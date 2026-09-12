/*
 * Lifecycle regressions — node --test scripts/check-lifecycle.mjs
 * Stubs just enough Web Audio surface to drive the mixer: controllable
 * fetch, counting buffer sources. No network, no paid calls.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

const sources = [];
let pendingFetches = [];

const audioNode = () => ({
  gain: {
    value: 0,
    setValueAtTime() {},
    linearRampToValueAtTime() {},
    cancelScheduledValues() {},
  },
  fftSize: 0,
  connect: (n) => n,
  disconnect() {},
  getFloatTimeDomainData() {},
});

globalThis.window = { setTimeout, clearTimeout };
globalThis.AudioContext = class {
  constructor() {
    this.state = "running";
    this.currentTime = 0;
    this.destination = {};
  }
  createGain() {
    return audioNode();
  }
  createAnalyser() {
    return audioNode();
  }
  createBufferSource() {
    const s = {
      buffer: null,
      loop: false,
      started: 0,
      onended: null,
      connect: (n) => n,
      disconnect() {},
      start() {
        s.started += 1;
      },
      stop() {},
    };
    sources.push(s);
    return s;
  }
  decodeAudioData() {
    return Promise.resolve({ duration: 1 });
  }
  resume() {
    this.state = "running";
    return Promise.resolve();
  }
};

globalThis.fetch = (url) =>
  new Promise((resolve) => {
    pendingFetches.push({ url, resolve });
  });

const resolvePendingFetches = () => {
  for (const f of pendingFetches) {
    f.resolve({ ok: true, arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)) });
  }
  pendingFetches = [];
};

const { mixer } = await import("../lib/audio/mixer.ts");
const { fearProfileSchema } = await import("../lib/profile/schema.ts");
const { WorldAdapter } = await import("../lib/world/adapter.ts");

const tick = () => new Promise((r) => setTimeout(r, 10));
const abortError = (e) => e instanceof DOMException && e.name === "AbortError";

mixer.init();

test("stopAll cancels a loop still waiting on its fetch — source never starts", async () => {
  const before = sources.length;
  mixer.playLoop("reg-loop", "/audio/__test-loop.mp3", 0.5, 0);
  await tick();
  mixer.stopAll(0);
  resolvePendingFetches();
  await tick();
  assert.equal(sources.length, before, "no source may be created for a cancelled loop");
});

test("two callers share one in-flight load; aborting A rejects A, B still starts once", async () => {
  const before = sources.length;
  const a = new AbortController();
  const pA = mixer.playOnce("/audio/__test-shared.mp3", 1, 0, { signal: a.signal });
  const pB = mixer.playOnce("/audio/__test-shared.mp3");
  await tick();
  a.abort();
  resolvePendingFetches();
  await assert.rejects(pA, abortError);
  let started = 0;
  const mark = setInterval(() => {
    const s = sources[sources.length - 1];
    if (s && s.started) {
      started = s.started;
      s.onended?.();
    }
  }, 5);
  await pB;
  clearInterval(mark);
  assert.equal(sources.length, before + 1, "exactly one source for the surviving caller");
  assert.equal(started, 1);
});

test("stopAll settles a pending one-shot with AbortError, not success", async () => {
  const p = mixer.playOnce("/audio/__test-oneshot.mp3");
  resolvePendingFetches();
  await tick();
  assert.ok(sources[sources.length - 1].started === 1);
  mixer.stopAll(0);
  await assert.rejects(p, abortError);
});

test("profile schema accepts a valid max-length profile", () => {
  const ok = fearProfileSchema.safeParse({
    fearLabel: "x",
    entity: "x",
    setting: "x",
    timeOfDay: "x",
    weather: "x",
    seedImagePrompt: "x",
    worldPrompt: "w".repeat(1400),
    escalationPrompt: "e".repeat(350),
    audioPrompt: "a".repeat(200),
    notebookLines: ["a", "b", "c"],
  });
  assert.equal(ok.success, true);
});

test("profile schema rejects oversized world/escalation/audio prompts", () => {
  const base = {
    fearLabel: "x",
    entity: "x",
    setting: "x",
    timeOfDay: "x",
    weather: "x",
    seedImagePrompt: "x",
    worldPrompt: "w",
    escalationPrompt: "e",
    audioPrompt: "a",
    notebookLines: ["a", "b", "c"],
  };
  assert.equal(fearProfileSchema.safeParse({ ...base, worldPrompt: "w".repeat(1401) }).success, false);
  assert.equal(fearProfileSchema.safeParse({ ...base, escalationPrompt: "e".repeat(351) }).success, false);
  assert.equal(fearProfileSchema.safeParse({ ...base, audioPrompt: "a".repeat(201) }).success, false);
  // combined maximum stays inside the model's 2000-char createWorld limit
  assert.ok(1400 + 4 + 350 + 4 + 200 <= 2000);
});

test("buildWorld rejects prompts over the model's 2000-character limit", async () => {
  const adapter = new WorldAdapter();
  await assert.rejects(
    adapter.buildWorld("x".repeat(2001), "https://example.com/seed.png"),
    /2000-character limit/,
  );
});
