import { interpretBrief } from "./director.js";
import { mintReactorToken } from "./reactor-auth.js";
import express from "express";
import { fal } from "@fal-ai/client";
import fs from "node:fs/promises";
import path from "node:path";

const PORT = process.env.PORT || 3000;
const RESOLUTION = process.env.FABRIC_RESOLUTION || "480p";
const MOCK = process.env.MOCK === "1";
const GENERATE = process.env.ENABLE_GENERATION === "1";
const CACHE_DIR = path.resolve("cache");
const CACHE_FILE = path.join(CACHE_DIR, "session.json");

fal.config({ credentials: process.env.FAL_KEY });

// Public sample assets from fal's docs — used in MOCK mode, zero credits burned.
const MOCK_ASSETS = {
  portrait:
    "https://v3.fal.media/files/koala/NLVPfOI4XL1cWT2PmmqT3_Hope.png",
  video: "https://v3.fal.media/files/lion/Yha3swLpHm35hoJCs8oJQ_tmp618_yf2f.mp4",
};

function errDetail(err) {
  return err?.body?.detail || err?.message || String(err);
}

// --- The psychologist's script. Last turn is the fear question -> feeds Reactor.
const SCRIPT = [
  {
    line: "Good evening. I've been expecting you. Please... sit. Before we begin, tell me your name.",
    label: "What is your name?",
  },
  {
    line: "Mm. Breathe slowly. Now — when the lights go out and the house goes quiet... what do you see?",
    label: "What do you see in the dark?",
  },
  {
    line: "One last question. Answer carefully — what you tell me next becomes the world you wake up in. What is your greatest fear?",
    label: "What is your greatest fear?",
    isFearQuestion: true,
  },
];

const PORTRAIT_PROMPT =
  "Cinematic portrait of an unsettlingly calm psychologist, middle-aged, faint knowing smile, " +
  "sitting in a dimly lit Victorian office, face centered and looking directly at the camera, " +
  "single candlelight from below, deep shadows, film noir horror atmosphere, photorealistic, 4k";

// --- Session state -------------------------------------------------------

const session = {
  status: "idle", // idle | generating | ready | error
  error: null,
  portraitUrl: null,
  turns: SCRIPT.map((t) => ({ ...t, status: "pending", videoUrl: null })),
  answers: [],
  fear: null,
};

async function saveCache() {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  const { portraitUrl, turns } = session;
  await fs.writeFile(CACHE_FILE, JSON.stringify({ portraitUrl, turns }, null, 2));
}

// If pre-baked clips exist in public/clips/ (e.g. rendered in the VEED editor),
// serve those instead of calling fal — zero credits, instant startup.
async function loadLocalClips() {
  const dir = path.resolve("public/clips");
  for (const ext of ["png", "jpg", "jpeg", "webp"]) {
    const p = path.join(dir, `portrait.${ext}`);
    if (await fs.stat(p).then(() => true).catch(() => false)) {
      session.portraitUrl = `/clips/portrait.${ext}`;
    }
  }
  let found = 0;
  for (const [i, turn] of session.turns.entries()) {
    const p = path.join(dir, `turn-${i}.mp4`);
    if (await fs.stat(p).then(() => true).catch(() => false)) {
      turn.status = "done";
      turn.videoUrl = `/clips/turn-${i}.mp4`;
      found++;
    }
  }
  if (found) console.log(`[local] using ${found} pre-baked clip(s) from public/clips/`);
  if (found === session.turns.length) session.status = "ready";
}

async function loadCache() {
  try {
    const data = JSON.parse(await fs.readFile(CACHE_FILE, "utf8"));
    if (data.portraitUrl && data.turns?.length === SCRIPT.length) {
      session.portraitUrl = data.portraitUrl;
      data.turns.forEach((t, i) => {
        session.turns[i].status = t.status;
        session.turns[i].videoUrl = t.videoUrl;
      });

      session.status = session.turns.every((t) => t.status === "done") ? "ready" : "idle";
      return session.status === "ready";
    }
  } catch {}
  return false;
}

// --- Generation pipeline --------------------------------------------------

async function generatePortrait() {
  if (MOCK) return MOCK_ASSETS.portrait;
  const res = await fal.subscribe("fal-ai/flux/schnell", {
    input: {
      prompt: PORTRAIT_PROMPT,
      image_size: "portrait_4_3",
      num_images: 1,
    },
  });
  return res.data.images[0].url;
}

async function generateAudio(text) {
  if (MOCK) return "mock-audio";
  const res = await fal.subscribe("fal-ai/elevenlabs/tts/multilingual-v2", {
    input: {
      text,
      voice: "Adam",
      stability: 0.35,
      similarity_boost: 0.8,
      speed: 0.92,
    },
  });
  return res.data.audio.url;
}

async function generateClip(imageUrl, audioUrl) {
  if (MOCK) {
    await new Promise((r) => setTimeout(r, 1500)); // simulate gen time
    return MOCK_ASSETS.video;
  }
  const res = await fal.subscribe("veed/fabric-1.0", {
    input: { image_url: imageUrl, audio_url: audioUrl, resolution: RESOLUTION },
    logs: true,
  });
  return res.data.video.url;
}

async function runPipeline() {
  session.status = "generating";
  if (!GENERATE) {
    session.turns.forEach(t => { t.status = "done"; });
    session.status = "ready";
    return;
  }
  try {
    if (!session.portraitUrl) {
      console.log("[fal] generating portrait...");
      session.portraitUrl = await generatePortrait().catch((e) => {
        console.warn("[fal] portrait failed:", errDetail(e));
        return null;
      });
      if (session.portraitUrl) await saveCache();
    }
    // A local portrait (pre-baked in the VEED editor) needs a public URL for fal.
    let imageUrl = session.portraitUrl;
    if (imageUrl?.startsWith("/")) {
      const buf = await fs.readFile(path.join("public", imageUrl));
      const file = new File([buf], path.basename(imageUrl), { type: "image/png" });
      imageUrl = await fal.storage.upload(file);
      console.log("[fal] local portrait uploaded:", imageUrl);
    }

    // No portrait and no mock → nothing to feed Fabric. Mark turns done with no
    // videoUrl; the frontend falls back to browser speech + animated portrait.
    if (!imageUrl && !MOCK) {
      console.warn("[fal] no image available — falling back to local speech");
      session.turns.forEach((t) => {
        if (t.status !== "done") t.status = "done";
      });
      session.status = "ready";
      return;
    }

    await Promise.all(
      session.turns.map(async (turn, i) => {
        if (turn.status === "done") return;
        try {
          turn.status = "audio";
          const audioUrl = await generateAudio(turn.line);
          turn.status = "video";
          console.log(`[fal] turn ${i}: audio done, generating clip...`);
          turn.videoUrl = await generateClip(imageUrl, audioUrl);
          turn.status = "done";
          console.log(`[fal] turn ${i}: clip done`);
          await saveCache();
        } catch (err) {
          // Done but no videoUrl → frontend speaks the line locally.
          console.warn(`[fal] turn ${i} failed (${errDetail(err)}) — local speech fallback`);
          turn.status = "done";
        }
      })
    );

    session.status = "ready";
    console.log("[fal] session ready");
  } catch (err) {
    // Last-resort fallback: still let the session run on local speech.
    session.turns.forEach((t) => {
      if (t.status !== "done") t.status = "done";
    });
    session.status = "ready";
    session.error = errDetail(err);
    console.warn("[fal] pipeline failed, using local speech:", session.error);
  }
}

// --- API ------------------------------------------------------------------

const app = express();
app.use(express.json());
app.use(express.static("public", { setHeaders(res, file) { if (/\.(js|html)$/.test(file)) res.set("Cache-Control", "no-store"); } }));

app.post("/api/reactor/token", async (req, res) => {
  res.set("Cache-Control", "no-store");
  const origin = req.get("origin");
  if (origin && origin !== `${req.protocol}://${req.get("host")}`) {
    return res.status(403).json({ error: "Use this app to start a session." });
  }
  try {
    res.json(await mintReactorToken(process.env.REACTOR_API_KEY));
  } catch (err) {
    res.status(502).json({ error: err.name === "TimeoutError" ? "Reactor timed out. Please retry." : err.message });
  }
});

// Shared video assets; answers remain private to the browser and each request.
app.post("/api/session", (req, res) => {
  if (session.status === "idle") runPipeline();
  res.json(publicState());
});
app.get("/api/session", (req, res) => res.json(publicState()));
app.post("/api/brief", async (req, res) => {
  const { answers, intensity = "slow dread", exclusions = "" } = req.body ?? {};
  if (!Array.isArray(answers) || answers.length !== SCRIPT.length ||
      answers.some(a => typeof a !== "string" || !a.trim() || a.length > 1000) ||
      !["slow dread", "strong suspense", "nightmare"].includes(intensity) ||
      typeof exclusions !== "string" || exclusions.length > 1000) {
    return res.status(400).json({ error: "Complete all three answers (maximum 1000 characters each)." });
  }
  const [name, darkness, fear] = answers.map(a => a.trim());
  const brief = {
    title: "The Consultation", version: 1,
    player: name, fear, imagery: darkness, intensity, exclusions,
    reactor: { status: "ready_to_connect", model: "reactor/fast-h3" }
  };
  try {
    brief.direction = await interpretBrief(brief, fal);
    brief.opening = brief.direction.opening;
    brief.objective = brief.direction.objective;
    brief.prompt = `${brief.direction.opening} Setting: ${brief.direction.setting}. Objective: ${brief.objective}. Exclude: ${brief.exclusions}.`;
    res.json(brief);
  } catch {
    res.status(502).json({error:"The interpretation service failed. Check the fal balance or disable ENABLE_DIRECTOR to pass the consultation directly to H3."});
  }
});

function publicState() {
  return {
    status: session.status,
    error: session.error,
    portraitUrl: session.portraitUrl,
    turns: session.turns.map(({ line, label, status, videoUrl, isFearQuestion }) => ({
      line,
      label,
      status,
      videoUrl,
      isFearQuestion: !!isFearQuestion,
    })),
    mode: GENERATE ? (MOCK ? "mock" : "fal") : "local",
  };
}

await loadCache();
await loadLocalClips();
app.listen(PORT, "127.0.0.1", () => {
  console.log(`psychologist's office open at http://localhost:${PORT}`);
  if (session.status === "ready") console.log("[cache] session ready — no generation needed");
});
