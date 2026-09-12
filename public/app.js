import { startWorld, stopWorld } from './world.js';
const $ = id => document.getElementById(id);
const screens = ['intro', 'loading', 'session', 'outro', 'world'];
let state, brief, stopped = false;
const answers = [];
function show(name) { screens.forEach(id => $(id).classList.toggle('hidden', id !== name)); }
async function api(url, body) {
  const res = await fetch(url, { method: body ? 'POST' : 'GET', headers: {'Content-Type':'application/json'}, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) { const data = await res.json().catch(() => ({})); throw new Error(data.error || 'The session could not connect. Please try again.'); }
  return res.json();
}
function speak(turn) {
  const video = $('doctor'), portrait = $('portrait');
  video.pause(); video.classList.toggle('hidden', !turn.videoUrl);
  portrait.classList.toggle('hidden', !!turn.videoUrl);
  $('line').textContent = turn.line;
  if (state.portraitUrl) {
    portrait.style.backgroundImage = `url(${JSON.stringify(state.portraitUrl)})`;
    portrait.querySelector('svg').style.visibility = 'hidden';
  }
  return new Promise(resolve => {
    if (turn.videoUrl) {
      video.onended = () => {
        video.onended = null;
        video.onerror = null;
        resolve();
      };
      video.onerror = () => {
        video.onended = null;
        video.onerror = null;
        speak({...turn, videoUrl: null}).then(resolve);
      };
      video.src = turn.videoUrl;
      video.controls = true;
      video.play().catch(() => {
        // Native controls let the player start playback if autoplay is blocked.
      });
    } else if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(turn.line);
      speech.rate = .82; speech.pitch = .65;
      speech.onend = resolve;
      speech.onerror = resolve;
      speechSynthesis.speak(speech);
    } else {
      resolve();
    }
  });
}
async function run() {
  $('begin-btn').disabled = true;
  show('loading');
  try {
    state = await api('/api/session', {});
    const deadline = Date.now() + 180000;
    while (state.status !== 'ready' && Date.now() < deadline) {
      await new Promise(r => setTimeout(r, 1500));
      if (stopped) return;
      state = await api('/api/session');
    }
    for (let i = 0; i < state.turns.length; i++) {
      if (stopped) return;
      show('session');
      $('progress').textContent = `CONSULTATION / 0${i + 1} OF 0${state.turns.length}`;
      $('answer-form').classList.add('hidden');
      $('answer-form').onsubmit = null;
      await speak(state.turns[i]);
      if (stopped) return;
      $('answer-label').textContent = state.turns[i].label;
      $('answer-input').value = '';
      $('answer-form').classList.remove('hidden');
      $('answer-input').focus();
      answers[i] = await new Promise(resolve => {
        $('answer-form').onsubmit = e => {
          e.preventDefault();
          const value = $('answer-input').value.trim();
          if (!value) return;
          $('answer-form').classList.add('hidden');
          $('answer-form').onsubmit = null;
          $('doctor').pause();
          window.speechSynthesis?.cancel();
          resolve(value);
        };
      });
    }
    show('loading');
    $('loading-text').textContent = 'Turning your consultation into a nightmare…';
    brief = await api('/api/brief', { answers, intensity: $('intensity').value, exclusions: $('exclusions').value });
    $('fear-echo').textContent = `“${brief.fear}”`;
    $('world-prompt').textContent = brief.prompt;
    show('outro');
    await enterWorld();
  } catch (err) {
    show('intro'); $('error').textContent = err.message;
  } finally { $('begin-btn').disabled = false; }
}
$('begin-btn').onclick = run;
$('exit-btn').onclick = async () => { stopped = true; window.speechSynthesis?.cancel(); await stopWorld(); location.reload(); };
$('download-btn').onclick = () => {
  const url = URL.createObjectURL(new Blob([JSON.stringify(brief, null, 2)], { type: 'application/json' }));
  const a = document.createElement('a'); a.href = url; a.download = 'reactor-horror-brief.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
};
$('copy-btn').onclick = async () => {
  try { await navigator.clipboard.writeText(brief.prompt); $('copy-btn').textContent = 'Copied'; }
  catch { $('copy-btn').textContent = 'Select the prompt below to copy'; }
};

async function enterWorld() {
  $('enter-world').disabled = true;
  $('reactor-error').textContent = '';
  try {
    await startWorld(brief, () => show('world'));
  } catch (err) {
    show('outro');
    $('reactor-error').textContent = err.message;
  } finally { $('enter-world').disabled = false; }
}
$('enter-world').onclick = enterWorld;
$('stop-world').onclick = async () => { await stopWorld(); show('outro'); };
window.addEventListener('pagehide', () => { void stopWorld(); });
