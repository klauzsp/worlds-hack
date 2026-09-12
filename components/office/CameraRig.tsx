"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Vector3 } from "three";
import { DOOR_POSES, SHOTS, type OfficeShot, type ShotDef } from "./shots";
import type { DoorPhase } from "../door/DoorSequence";

const EASE_MS = 2200;

function smoothstep(t: number): number {
  const x = Math.min(Math.max(t, 0), 1);
  return x * x * (3 - 2 * x);
}

/*
 * The one camera. Transitions are timed on wall clock (performance.now) so a
 * slow renderer never stretches a 1.8s glide into minutes — a dropped frame
 * just lands further along the curve. On each shot/phase change the current
 * frame is snapshotted and eased to the new pose; the shot's own slow move
 * runs after. A three-sine breathing drift sits on top, always. During the
 * door shot each phase carries its own transition duration (pan, approach,
 * through).
 */
export function CameraRig({
  shot,
  doorPhase,
}: {
  shot: OfficeShot;
  doorPhase: DoorPhase | null;
}) {
  const camera = useThree((s) => s.camera);
  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const cur = useRef({
    pos: new Vector3(...SHOTS.gate.position),
    tgt: new Vector3(...SHOTS.gate.target),
    fov: SHOTS.gate.fov,
  });
  const trans = useRef({ pos: cur.current.pos.clone(), tgt: cur.current.tgt.clone(), fov: SHOTS.gate.fov, start: 0, ms: 1 });
  const moveStart = useRef(0);
  const tmp = useRef({ a: new Vector3(), b: new Vector3(), look: new Vector3() });

  /* "black" is the same pose as "opening" — normalising keeps one
     transition identity so the fade doesn't restart the move halfway. */
  const phase = doorPhase === "black" ? "opening" : doorPhase;

  useEffect(() => {
    const pose = shot === "door" && phase ? DOOR_POSES[phase] : null;
    const now = performance.now();
    trans.current = {
      pos: cur.current.pos.clone(),
      tgt: cur.current.tgt.clone(),
      fov: cur.current.fov,
      start: now,
      ms: reducedMotion ? 1 : pose ? pose.transitionMs : EASE_MS,
    };
    moveStart.current = now + trans.current.ms;
  }, [shot, phase, reducedMotion]);

  useFrame(() => {
    const now = performance.now();
    const tr = trans.current;
    const e = smoothstep((now - tr.start) / tr.ms);

    const pose = shot === "door" && phase ? DOOR_POSES[phase] : null;
    const def: ShotDef = SHOTS[shot];
    const toPos = pose ? pose.position : def.position;
    const toTgt = pose ? pose.target : def.target;
    const toFov = pose ? pose.fov : def.fov;

    // in-shot slow move, starting once the ease has landed
    let m = 0;
    if (!pose && !reducedMotion && (def.moveTo || def.targetTo)) {
      m = smoothstep((now - moveStart.current) / (def.durationSec * 1000));
    }
    const { a, b, look } = tmp.current;
    a.set(toPos[0], toPos[1], toPos[2]);
    if (def.moveTo && !pose) {
      a.lerp(b.set(def.moveTo[0], def.moveTo[1], def.moveTo[2]), m);
    }
    look.set(toTgt[0], toTgt[1], toTgt[2]);
    if (def.targetTo && !pose) {
      look.lerp(b.set(def.targetTo[0], def.targetTo[1], def.targetTo[2]), m);
    }

    cur.current.pos.copy(tr.pos).lerp(a, e);
    cur.current.tgt.copy(tr.tgt).lerp(look, e);
    cur.current.fov = tr.fov + (toFov - tr.fov) * e;

    if (!reducedMotion) {
      const c = now / 1000;
      cur.current.pos.x += Math.sin((c / 4.1) * Math.PI * 2) * 0.003 + Math.sin((c / 9.3) * Math.PI * 2 + 1.7) * 0.001;
      cur.current.pos.y += Math.sin((c / 6.7) * Math.PI * 2 + 0.9) * 0.004;
      cur.current.pos.z += Math.sin((c / 4.1) * Math.PI * 2 + 3.1) * 0.002;
      cur.current.tgt.x += Math.sin((c / 6.7) * Math.PI * 2 + 2.2) * 0.003;
      cur.current.tgt.y += Math.sin((c / 9.3) * Math.PI * 2 + 0.4) * 0.003;
      cur.current.tgt.z += Math.sin((c / 4.1) * Math.PI * 2 + 5.0) * 0.002;
    }

    camera.position.copy(cur.current.pos);
    camera.lookAt(cur.current.tgt);
    if (camera instanceof PerspectiveCamera && Math.abs(camera.fov - cur.current.fov) > 0.01) {
      camera.fov = cur.current.fov;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
