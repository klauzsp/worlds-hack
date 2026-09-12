/*
 * Web Audio layer mixer. All app audio goes through here — never a bare
 * new Audio() in a component. Created on the gate click so the autoplay
 * gesture unlocks the context before anything plays.
 */

type LoopHandle = {
  source: AudioBufferSourceNode;
  gain: GainNode;
};

class Mixer {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private buffers = new Map<string, AudioBuffer>();
  private loops = new Map<string, LoopHandle>();

  init(): void {
    if (this.ctx) return;
    this.ctx = new AudioContext();
    this.master = this.ctx.createGain();
    this.master.gain.value = 1;
    this.master.connect(this.ctx.destination);
  }

  get ready(): boolean {
    return this.ctx !== null;
  }

  /* Raw graph access for procedural layers (the horror soundscape builds
     its own node tree on the master bus). */
  get bus(): { ctx: AudioContext; master: GainNode } {
    return this.requireCtx();
  }

  private requireCtx(): { ctx: AudioContext; master: GainNode } {
    if (!this.ctx || !this.master) throw new Error("Mixer used before init()");
    return { ctx: this.ctx, master: this.master };
  }

  private async load(url: string): Promise<AudioBuffer> {
    const cached = this.buffers.get(url);
    if (cached) return cached;
    const { ctx } = this.requireCtx();
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Audio fetch failed (${res.status}): ${url}`);
    const buffer = await ctx.decodeAudioData(await res.arrayBuffer());
    this.buffers.set(url, buffer);
    return buffer;
  }

  /* Warm a URL into the cache without playing it. */
  async preload(url: string): Promise<void> {
    await this.load(url);
  }

  /* Play a buffer once; resolves when it ends. Optional gain and fade-in. */
  async playOnce(url: string, gainValue = 1, fadeInSec = 0): Promise<void> {
    const { ctx, master } = this.requireCtx();
    const buffer = await this.load(url);
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    source.buffer = buffer;
    gain.gain.value = fadeInSec > 0 ? 0 : gainValue;
    if (fadeInSec > 0) {
      gain.gain.linearRampToValueAtTime(gainValue, ctx.currentTime + fadeInSec);
    }
    source.connect(gain).connect(master);
    return new Promise((resolve) => {
      source.onended = () => resolve();
      source.start();
    });
  }

  /* Duration in seconds after decode — lets the UI time subtitles to speech. */
  async duration(url: string): Promise<number> {
    return (await this.load(url)).duration;
  }

  playLoop(id: string, url: string, gainValue = 1, fadeInSec = 0): void {
    if (this.loops.has(id)) return;
    void this.load(url)
      .then((buffer) => {
        if (this.loops.has(id)) return;
        const { ctx, master } = this.requireCtx();
        const source = ctx.createBufferSource();
        const gain = ctx.createGain();
        source.buffer = buffer;
        source.loop = true;
        gain.gain.value = 0;
        gain.gain.linearRampToValueAtTime(gainValue, ctx.currentTime + Math.max(fadeInSec, 0.01));
        source.connect(gain).connect(master);
        source.start();
        this.loops.set(id, { source, gain });
      })
      .catch((error) => console.error(`Loop failed to load: ${url}`, error));
  }

  fadeLoop(id: string, to: number, sec: number): void {
    const handle = this.loops.get(id);
    if (!handle || !this.ctx) return;
    handle.gain.gain.cancelScheduledValues(this.ctx.currentTime);
    handle.gain.gain.setValueAtTime(handle.gain.gain.value, this.ctx.currentTime);
    handle.gain.gain.linearRampToValueAtTime(to, this.ctx.currentTime + sec);
  }

  stopLoop(id: string, fadeOutSec = 0.5): void {
    const handle = this.loops.get(id);
    if (!handle || !this.ctx) return;
    this.loops.delete(id);
    handle.gain.gain.cancelScheduledValues(this.ctx.currentTime);
    handle.gain.gain.setValueAtTime(handle.gain.gain.value, this.ctx.currentTime);
    handle.gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + fadeOutSec);
    const { source } = handle;
    window.setTimeout(() => {
      try {
        source.stop();
      } catch {
        /* already stopped */
      }
    }, fadeOutSec * 1000 + 100);
  }

  stopAll(fadeOutSec = 0.5): void {
    for (const id of [...this.loops.keys()]) this.stopLoop(id, fadeOutSec);
  }
}

export const mixer = new Mixer();
