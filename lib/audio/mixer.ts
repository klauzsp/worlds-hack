/*
 * Web Audio layer mixer. All app audio goes through here — never a bare
 * new Audio() in a component. Created on the gate click so the autoplay
 * gesture unlocks the context before anything plays.
 */

type LoopHandle = {
  source: AudioBufferSourceNode;
  gain: GainNode;
};

export type PlaybackOptions = {
  signal?: AbortSignal;
  channel?: "effects" | "psychologist" | "visitor";
};

class Mixer {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private psychologistBus: AnalyserNode | null = null;
  private buffers = new Map<string, AudioBuffer>();
  private inflight = new Map<string, Promise<AudioBuffer>>();
  private loops = new Map<string, LoopHandle>();
  private loopGen = new Map<string, number>();
  private oneShots = new Set<{
    source: AudioBufferSourceNode;
    gain: GainNode;
    channel: PlaybackOptions["channel"];
    finish: () => void;
  }>();
  private generation = 0;
  private speechBuf = new Float32Array(512);

  init(): void {
    if (this.ctx) {
      if (this.ctx.state === "suspended") void this.ctx.resume().catch(() => undefined);
      return;
    }
    this.ctx = new AudioContext();
    this.master = this.ctx.createGain();
    this.master.gain.value = 1;
    this.master.connect(this.ctx.destination);
    this.psychologistBus = this.ctx.createAnalyser();
    this.psychologistBus.fftSize = 512;
    this.psychologistBus.connect(this.master);
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
    if (this.ctx.state === "suspended") void this.ctx.resume().catch(() => undefined);
    return { ctx: this.ctx, master: this.master };
  }

  private destinationFor(channel: PlaybackOptions["channel"]): AudioNode {
    const { master } = this.requireCtx();
    if (channel === "psychologist") {
      if (!this.psychologistBus) throw new Error("Mixer used before init()");
      return this.psychologistBus;
    }
    return master;
  }

  /* Shared fetch/decode for committed files — deliberately signal-free so
    one aborted caller can't poison the cache for everyone else. Callers
    wait on it through waitForLoad, which rejects per-caller on abort. */
  private async load(url: string): Promise<AudioBuffer> {
    const cached = this.buffers.get(url);
    if (cached) return cached;
    const pending = this.inflight.get(url);
    if (pending) return pending;
    const { ctx } = this.requireCtx();
    const promise = (async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Audio fetch failed (${res.status}): ${url}`);
      const buffer = await ctx.decodeAudioData(await res.arrayBuffer());
      return buffer;
    })();
    this.inflight.set(url, promise);
    try {
      const buffer = await promise;
      this.buffers.set(url, buffer);
      return buffer;
    } finally {
      this.inflight.delete(url);
    }
  }

  private waitForLoad(url: string, signal?: AbortSignal): Promise<AudioBuffer> {
    if (signal?.aborted) return Promise.reject(new DOMException("Playback aborted", "AbortError"));
    const promise = this.load(url);
    if (!signal) return promise;
    return new Promise((resolve, reject) => {
      const onAbort = () => reject(new DOMException("Playback aborted", "AbortError"));
      signal.addEventListener("abort", onAbort, { once: true });
      promise.then(
        (buffer) => {
          signal.removeEventListener("abort", onAbort);
          resolve(buffer);
        },
        (error) => {
          signal.removeEventListener("abort", onAbort);
          reject(error instanceof Error ? error : new Error(String(error)));
        },
      );
    });
  }

  private playBuffer(
    buffer: AudioBuffer,
    gainValue: number,
    fadeInSec: number,
    options: PlaybackOptions,
  ): Promise<void> {
    const { ctx } = this.requireCtx();
    return new Promise((resolve, reject) => {
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      source.buffer = buffer;
      gain.gain.value = fadeInSec > 0 ? 0 : gainValue;
      if (fadeInSec > 0) {
        gain.gain.linearRampToValueAtTime(gainValue, ctx.currentTime + fadeInSec);
      }
      source.connect(gain).connect(this.destinationFor(options.channel));

      const handle = {
        source,
        gain,
        channel: options.channel,
        finish: () => {
          cleanup();
          try {
            source.stop();
          } catch {
            /* already stopped */
          }
          reject(new DOMException("Playback aborted", "AbortError"));
        },
      };

      const cleanup = () => {
        this.oneShots.delete(handle);
        if (options.signal) options.signal.removeEventListener("abort", onAbort);
        source.onended = null;
        try {
          source.disconnect();
          gain.disconnect();
        } catch {
          /* already torn down */
        }
      };
      const onAbort = () => {
        cleanup();
        try {
          source.stop();
        } catch {
          /* already stopped */
        }
        reject(new DOMException("Playback aborted", "AbortError"));
      };

      if (options.signal?.aborted) {
        cleanup();
        reject(new DOMException("Playback aborted", "AbortError"));
        return;
      }
      if (options.signal) options.signal.addEventListener("abort", onAbort, { once: true });
      this.oneShots.add(handle);
      source.onended = () => {
        cleanup();
        resolve();
      };
      try {
        source.start();
      } catch (error) {
        cleanup();
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }

  /* Play a buffer once; resolves when it ends. Optional gain and fade-in. */
  async playOnce(
    url: string,
    gainValue = 1,
    fadeInSec = 0,
    options: PlaybackOptions = {},
  ): Promise<void> {
    const gen = this.generation;
    const buffer = await this.waitForLoad(url, options.signal);
    if (options.signal?.aborted || gen !== this.generation) {
      throw new DOMException("Playback aborted", "AbortError");
    }
    const { ctx } = this.requireCtx();
    if (ctx.state === "suspended") await ctx.resume();
    if (options.signal?.aborted || gen !== this.generation) {
      throw new DOMException("Playback aborted", "AbortError");
    }
    await this.playBuffer(buffer, gainValue, fadeInSec, options);
  }

  /* Play fetched/generated bytes once (visitor speech — never cached). */
  async playBytes(bytes: ArrayBuffer, options: PlaybackOptions = {}): Promise<void> {
    const { ctx } = this.requireCtx();
    const gen = this.generation;
    const buffer = await ctx.decodeAudioData(bytes);
    if (options.signal?.aborted || gen !== this.generation) {
      throw new DOMException("Playback aborted", "AbortError");
    }
    if (ctx.state === "suspended") await ctx.resume();
    if (options.signal?.aborted || gen !== this.generation) {
      throw new DOMException("Playback aborted", "AbortError");
    }
    await this.playBuffer(buffer, 1, 0, options);
  }

  /* RMS of the psychologist channel — drives her jaw. 0 when silent. */
  get speechLevel(): number {
    if (!this.psychologistBus) return 0;
    let speaking = false;
    for (const h of this.oneShots) {
      if (h.channel === "psychologist") {
        speaking = true;
        break;
      }
    }
    if (!speaking) return 0;
    this.psychologistBus.getFloatTimeDomainData(this.speechBuf);
    let sum = 0;
    for (let i = 0; i < this.speechBuf.length; i++) sum += this.speechBuf[i] * this.speechBuf[i];
    const rms = Math.sqrt(sum / this.speechBuf.length);
    return Math.min(1, Math.max(0, (rms - 0.008) * 7));
  }

  /* Warm a URL into the cache without playing it. */
  async preload(url: string): Promise<void> {
    await this.load(url);
  }

  /* Duration in seconds after decode — lets the UI time subtitles to speech. */
  async duration(url: string): Promise<number> {
    return (await this.load(url)).duration;
  }

  playLoop(id: string, url: string, gainValue = 1, fadeInSec = 0): void {
    if (this.loops.has(id)) return;
    const gen = (this.loopGen.get(id) ?? 0) + 1;
    this.loopGen.set(id, gen);
    void this.load(url)
      .then((buffer) => {
        if (this.loops.has(id)) return;
        if (this.loopGen.get(id) !== gen) return;
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
    this.loopGen.set(id, (this.loopGen.get(id) ?? 0) + 1);
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
        source.disconnect();
        handle.gain.disconnect();
      } catch {
        /* already stopped */
      }
    }, fadeOutSec * 1000 + 100);
  }

  stopAll(fadeOutSec = 0.5): void {
    this.generation += 1;
    for (const id of this.loopGen.keys()) this.stopLoop(id, fadeOutSec);
    for (const handle of [...this.oneShots]) handle.finish();
  }
}

export const mixer = new Mixer();
