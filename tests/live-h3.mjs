// Explicit opt-in smoke test: creates paid FastH3 scenes and closes the session.
import {chromium} from '@playwright/test';
const browser=await chromium.launch({headless:true,args:['--autoplay-policy=no-user-gesture-required']});
const page=await browser.newPage({viewport:{width:1280,height:900}});
let failed=false;
try{
 await page.goto('http://localhost:3017');await page.click('#begin-btn');
 for(const [i,answer]of ['Tester',process.env.TEST_IMAGERY || 'snakes moving across the floor',process.env.TEST_FEAR || 'snake (the animal)'].entries()){
  await page.waitForFunction(i=>document.getElementById('progress').textContent.includes(`0${i+1} OF`),i);
  await page.evaluate(()=>document.getElementById('doctor').dispatchEvent(new Event('ended')));
  await page.locator('#answer-input').fill(answer);await page.locator('#answer-form button').click();
 }
 await page.waitForFunction(()=>!document.getElementById('world').classList.contains('hidden')||document.getElementById('error').textContent);
 await page.waitForFunction(()=>document.getElementById('world-status').textContent.includes('Your move')||document.getElementById('reactor-error').textContent,{},{timeout:150000});
 const error=await page.locator('#reactor-error').textContent();if(error)throw new Error(error);
 const stats=await page.locator('#world-video').evaluate(v=>({width:v.videoWidth,height:v.videoHeight,frames:v.getVideoPlaybackQuality().totalVideoFrames,tracks:v.srcObject?.getTracks().map(t=>t.kind)}));
 await page.screenshot({path:'/tmp/worlds-h3-check.png',fullPage:true});
 if(process.env.TEST_ACTION){
  await page.locator('#action-input').fill(process.env.TEST_ACTION);
  await page.locator('#action-send').click();
  await page.waitForFunction(()=>!document.getElementById('action-send').disabled,{},{timeout:150000});
  await page.screenshot({path:'/tmp/worlds-h3-action.png',fullPage:true});
  console.log('Follow-up action completed.');
 }
 console.log(JSON.stringify({status:await page.locator('#world-status').textContent(),...stats}));
 if(!stats.width||!stats.frames)throw new Error('No decoded video frames');
}catch(e){failed=true;console.log('LIVE CHECK FAILED: '+e.message);await page.screenshot({path:'/tmp/worlds-h3-check.png',fullPage:true}).catch(()=>{});}
finally{await page.locator('#stop-world').click({timeout:3000}).catch(()=>{});await browser.close();}
if(failed)process.exitCode=1;
