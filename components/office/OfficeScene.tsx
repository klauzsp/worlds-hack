"use client";

import { Component, Suspense, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, PCFShadowMap } from "three";
import { Room } from "./Room";
import { CameraRig } from "./CameraRig";
import { Psychologist } from "./Psychologist";
import { SHOTS, type OfficeShot } from "./shots";
import type { DoorPhase } from "../door/DoorSequence";

/*
 * The room. Deliberately not a horror set: a warm, dim, expensive consulting
 * room rendered in real time — the same room at the start and the end, so
 * the contrast lands on the world act instead. The cinematic treatment
 * (grain, vignette, letterbox) sits over the canvas exactly as before.
 * She is present, seated, behind the desk — voice-driven, never authored.
 */

class SceneBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function OfficeScene({
  shot,
  doorPhase = null,
  listening = false,
  onReady,
  onError,
}: {
  shot: OfficeShot;
  doorPhase?: DoorPhase | null;
  listening?: boolean;
  onReady: () => void;
  onError: () => void;
}) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <SceneBoundary onError={onError}>
        <Canvas
          dpr={[1, 1.5]}
          shadows={{ type: PCFShadowMap }}
          gl={{ antialias: true, toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
          camera={{ fov: SHOTS.gate.fov, position: SHOTS.gate.position, near: 0.05, far: 30 }}
        >
          <CameraRig shot={shot} doorPhase={doorPhase} />
          <Room doorPhase={doorPhase} />
          <Suspense fallback={null}>
            <Psychologist listening={listening} onReady={onReady} />
          </Suspense>
        </Canvas>
      </SceneBoundary>
      <div className="treatment" />
      <div className="letterbox top" />
      <div className="letterbox bottom" />
    </div>
  );
}
