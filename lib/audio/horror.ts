import { mixer } from "./mixer";

/*
 * The world act's score. The Reactor stream is video-only — there is no
 * audio track — so the soundscape is synthesized here on the mixer's
 * master bus: a detuned drone bed, a hiss of air, randomized distant
 * stingers, and a heartbeat that escalate() brings in and accelerates.
 * Everything is scheduled, so stop() tears the whole graph down.
 */
class HorrorScape {
  private out: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private timers: number[] = [];
  private heartTimer: number | null = null;
  private heartPeriodMs = 0;
  private alive = false;
  private escalated = false;

  private get ctx(): AudioContext {
    return mixer.bus.ctx;
  }

  private noise(): AudioBuffer {
    if (!this.noiseBuffer) {
      const { ctx } = this;
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      this.noiseBuffer = buffer;
    }
    return this.noiseBuffer;
  }

  private later(ms: number, fn: () => void): void {
    this.timers.push(window.setTimeout(fn, ms));
  }

  /* ---- bed ------------------------------------------------------------ */

  private startDrone(): void {
    const { ctx } = this;
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0;
    droneGain.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 4);
    droneGain.connect(this.out as GainNode);

    for (const freq of [52, 53.7, 104.3]) {
      const osc = ctx.createOscillator();
      osc.type = freq > 80 ? "triangle" : "sine";
      osc.frequency.value = freq;
      const level = ctx.createGain();
      level.gain.value = freq > 80 ? 0.25 : 0.6;
      osc.connect(level).connect(droneGain);
      osc.start();
    }

    // Slow restless LFO on the drone level — never settles.
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.05;
    lfo.connect(lfoGain).connect(droneGain.gain);
    lfo.start();
  }

  private startAir(): void {
    const { ctx } = this;
    const src = ctx.createBufferSource();
    src.buffer = this.noise();
    src.loop = true;
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 420;
    const gain = ctx.createGain();
    gain.gain.value = 0.035;
    src.connect(lowpass).connect(gain).connect(this.out as GainNode);
    src.start();
  }

  /* ---- stingers -------------------------------------------------------- */

  private knock(pan = 0): void {
    const { ctx } = this;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.frequency.setValueAtTime(95, t);
    osc.frequency.exponentialRampToValueAtTime(48, t + 0.18);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    const panner = ctx.createStereoPanner();
    panner.pan.value = pan;
    osc.connect(gain).connect(panner).connect(this.out as GainNode);
    osc.start(t);
    osc.stop(t + 0.6);
  }

  private metalGroan(): void {
    const { ctx } = this;
    const t = ctx.currentTime;
    const dur = 1.8 + Math.random() * 1.6;
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(160 + Math.random() * 120, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + dur);
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 300 + Math.random() * 400;
    band.Q.value = 6;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.14, t + dur * 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(band).connect(gain).connect(this.out as GainNode);
    osc.start(t);
    osc.stop(t + dur + 0.1);
  }

  private footsteps(): void {
    const level = this.escalated ? 0.32 : 0.1;
    const steps = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < steps; i++) {
      this.later(i * (320 + Math.random() * 120), () => this.thump(level));
    }
  }

  private thump(level: number): void {
    const { ctx } = this;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noise();
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 160;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(level, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    src.connect(lowpass).connect(gain).connect(this.out as GainNode);
    src.start(t, Math.random());
    src.stop(t + 0.3);
  }

  private whisperSwell(): void {
    const { ctx } = this;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noise();
    src.playbackRate.value = 0.9 + Math.random() * 0.3;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.Q.value = 3;
    band.frequency.setValueAtTime(900, t);
    band.frequency.linearRampToValueAtTime(2200, t + 2.4);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.06, t + 1.6);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.6);
    src.connect(band).connect(gain).connect(this.out as GainNode);
    src.start(t, Math.random());
    src.stop(t + 2.8);
  }

  /* Something big rising under everything — used once near the cut. */
  private riser(durSec: number): void {
    const { ctx } = this;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noise();
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(120, t);
    lowpass.frequency.exponentialRampToValueAtTime(3000, t + durSec);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.5, t + durSec);
    src.connect(lowpass).connect(gain).connect(this.out as GainNode);
    src.start(t, Math.random());
    src.stop(t + durSec + 0.1);
  }

  /* ---- scheduler -------------------------------------------------------- */

  private scheduleStinger(): void {
    const pick = Math.random();
    if (pick < 0.3) this.knock(Math.random() * 1.6 - 0.8);
    else if (pick < 0.55) this.metalGroan();
    else if (pick < 0.8) this.footsteps();
    else this.whisperSwell();
    const gap = this.escalated ? 2500 + Math.random() * 4000 : 7000 + Math.random() * 8000;
    this.later(gap, () => this.scheduleStinger());
  }

  private beat(): void {
    if (!this.alive || this.heartPeriodMs <= 0) return;
    this.thump(0.35);
    this.later(140, () => this.thump(0.24));
    this.heartPeriodMs = Math.max(420, this.heartPeriodMs - 18);
    this.heartTimer = window.setTimeout(() => this.beat(), this.heartPeriodMs);
  }

  /* ---- lifecycle -------------------------------------------------------- */

  start(): void {
    if (this.alive) return;
    const { ctx, master } = mixer.bus;
    this.out = ctx.createGain();
    this.out.gain.value = 1;
    this.out.connect(master);
    this.alive = true;
    this.escalated = false;
    this.startDrone();
    this.startAir();
    this.later(4000 + Math.random() * 3000, () => this.scheduleStinger());
  }

  /* t≈30s: heartbeat fades in and keeps tightening to the cut. Opens with
     footsteps directly behind — centre-panned, close, impossible to place. */
  escalate(): void {
    if (!this.alive || this.escalated) return;
    this.escalated = true;
    this.footsteps();
    this.later(900, () => this.knock(0));
    this.heartPeriodMs = 1100;
    this.beat();
  }

  /* Final seconds: everything swells toward the hard cut. */
  climax(durSec: number): void {
    if (!this.alive) return;
    this.riser(durSec);
  }

  stop(fadeSec = 1): void {
    if (!this.alive) return;
    this.alive = false;
    for (const id of this.timers) window.clearTimeout(id);
    this.timers = [];
    if (this.heartTimer !== null) window.clearTimeout(this.heartTimer);
    this.heartTimer = null;
    const out = this.out;
    this.out = null;
    if (out) {
      const t = this.ctx.currentTime;
      out.gain.cancelScheduledValues(t);
      out.gain.setValueAtTime(out.gain.value, t);
      out.gain.linearRampToValueAtTime(0, t + fadeSec);
      window.setTimeout(() => out.disconnect(), fadeSec * 1000 + 200);
    }
  }
}

export const horror = new HorrorScape();
