import {Reactor} from '@reactor-team/js-sdk';
import {promptForScene} from './scene.js';
const $=id=>document.getElementById(id);
let active=null;
export async function stopWorld(){
 const run=active;active=null;if(!run)return;
 clearTimeout(run.timer);run.abort.abort();run.cancel?.(new Error('Session ended.'));
 $('world-video').srcObject=null;
 await run.client?.disconnect().catch(()=>{});
}
export async function startWorld(brief,onShow){
 await stopWorld();
 const run={client:null,abort:new AbortController(),timer:null,cancel:null};active=run;
 const current=()=>active===run;
 let busy=true,failed=false,previousClip='',pending=null,turn=0,history=[];
 let resolveFirst,rejectFirst;
 const first=new Promise((resolve,reject)=>{resolveFirst=resolve;rejectFirst=reject;});first.catch(()=>{});run.cancel=rejectFirst;
 onShow();$('game-story').textContent=`Your greatest fear: “${brief.fear}”. ${brief.direction.objective}`;
 $('world-actions').replaceChildren();
 const actions=[['W','Move cautiously forward through the established environment (swim if underwater), watching the feared subject.'],['A','Turn the first-person camera to the left and examine that part of the same environment.'],['S','Back slowly away from the feared subject.'],['D','Turn the first-person camera to the right and look for a safe path.'],['E','Investigate the nearest object without touching the feared subject.']];
 const buttons=actions.map(([key,action])=>{const b=document.createElement('button');b.className='btn';b.textContent=key+' · '+({W:'Forward',A:'Left',S:'Back',D:'Right',E:'Investigate'}[key]);b.onclick=()=>{if(!busy&&!failed)void enqueue(action);};$('world-actions').append(b);return b;});
 function controls(disabled){busy=disabled;buttons.forEach(b=>b.disabled=disabled);$('action-input').disabled=disabled;$('action-send').disabled=disabled;}
 function fail(message){if(!current()||failed)return;failed=true;clearTimeout(run.timer);controls(true);$('world-status').textContent=message;rejectFirst(new Error(message));void run.client?.disconnect().catch(()=>{});}
 async function enqueue(action){
  if(!current()||failed)return;
  controls(true);pending={id:String(turn++),action};
  const prompt=promptForScene(brief,action,history);$('generation-prompt').textContent=prompt;
  $('world-status').textContent='H3 is generating your next scene…';
  clearTimeout(run.timer);run.timer=setTimeout(()=>fail('H3 generation timed out. End the session and retry.'),120000);
  try{await run.client.sendCommand('enqueue',{prompt,seconds:6,continue_from_clip_id:previousClip,metadata:pending.id});}
  catch{fail('H3 rejected the generation request. End the session and retry.');}
 }
 $('action-form').onsubmit=e=>{e.preventDefault();const action=$('action-input').value.trim();if(action&&!busy&&!failed){$('action-input').value='';void enqueue(action);}};
 window.addEventListener('keydown',e=>{
  if(e.repeat||e.ctrlKey||e.metaKey||e.altKey||e.target instanceof HTMLInputElement||busy||failed)return;
  const match=actions.find(([key])=>'Key'+key===e.code);if(match){e.preventDefault();void enqueue(match[1]);}
 },{signal:run.abort.signal});
 controls(true);$('world-status').textContent='Connecting to Reactor FastH3…';
 try{
  const response=await fetch('/api/reactor/token',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}',signal:AbortSignal.timeout(25000)});
  const data=await response.json();if(!response.ok)throw new Error(data.error || 'Reactor authentication failed.');if(!current())return;
  const client=new Reactor({modelName:data.model});run.client=client;
  const stream=new MediaStream(),video=$('world-video');video.srcObject=stream;
  client.on('trackReceived',(name,track)=>{if(!current()||!['main_video','main_audio'].includes(name))return;stream.addTrack(track);video.play().catch(()=>{$('world-status').textContent='Press play to enable the video and sound.';});});
  client.on('message',message=>{
   if(!current()||failed)return;
   const payload=message.data;
   if(message.type==='clip_started')$('world-status').textContent='Reactor FastH3 · scene playing';
   if(message.type==='clip_failed'||message.type==='command_error')fail('H3 could not produce this scene. End the session and retry.');
   if(message.type==='clip_finished'&&pending&&payload?.clip?.metadata===pending.id){
    clearTimeout(run.timer);previousClip=payload.clip.clip_id;history.push(pending.action);pending=null;controls(false);
    $('world-status').textContent='Your move. The next scene follows your action.';resolveFirst();run.cancel=null;
   }
  });
  client.on('error',error=>{
   if(error.status===402 || String(error.message).includes('credits_depleted')) { fail('Reactor credits are depleted. Add credits in your Reactor dashboard, then click Enter the nightmare to retry with the same consultation.'); return; }
   const detail=String(error.message || '').replace(/rk_[a-zA-Z0-9]+|eyJ[a-zA-Z0-9_.-]+/g,'[redacted]').slice(0,500);
   fail(`Reactor ${error.operation || 'connection'} failed (${error.code || 'unknown'}${error.status ? ', HTTP '+error.status : ''}): ${detail}`);
  });
  client.on('statusChanged',status=>{if(!current()||failed)return;if(status==='waiting')$('world-status').textContent='Waiting for Reactor capacity…';if(status==='disconnected')fail('Reactor disconnected. End the session and retry.');});
  run.timer=setTimeout(()=>fail('Reactor connection timed out.'),120000);
  await Promise.race([client.connect(data.jwt),first]);if(!current())return;
  await client.sendCommand('set_autoplay',{enabled:true});await client.sendCommand('set_flush_on_clip_end',{enabled:false});
  await enqueue('Reveal the actual feared subject clearly in front of the player. Establish a possible route to safety.');
  await first;
 }catch(error){if(current())await stopWorld();throw error;}
}
