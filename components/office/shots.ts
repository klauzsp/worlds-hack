/*
 * The shot list. The office has one camera and no cuts — every state gets a
 * shot, the rig glides between them, then each shot plays its own slow move.
 * The interview is a seated first-person POV: the camera never leaves the
 * visitor's chair until the door sequence walks it across the room.
 * Coordinates are metres, origin at floor centre; window −z, bookshelf −x,
 * door +x at z≈1.4, desk z≈−1.25, her chair z≈−2.15.
 */
export type OfficeShot =
  | "gate"
  | "q1"
  | "q2"
  | "q3"
  | "q4"
  | "inferring"
  | "door"
  | "return";

export type ShotDef = {
  position: [number, number, number];
  target: [number, number, number];
  /* Optional slow moves after the ease-in: dolly to moveTo, pan to targetTo. */
  moveTo?: [number, number, number];
  targetTo?: [number, number, number];
  durationSec: number;
  fov: number;
};

export const DOOR_PAN_MS = 6000;
export const DOOR_APPROACH_MS = 4000;
export const DOOR_OPEN_MS = 2200;

/* The visitor's eye-line — all seated shots share it. */
const seat: [number, number, number] = [0.22, 1.24, 0.12];
/* Her face, from the chair. */
const her: [number, number, number] = [-0.25, 1.27, -2.15];

const Q4: ShotDef = {
  position: seat,
  target: her,
  moveTo: [0.22, 1.24, 0.02],
  durationSec: 24,
  fov: 43,
};

export const SHOTS: Record<OfficeShot, ShotDef> = {
  gate: {
    // Wide establishing from the door side, low, across the rug to the desk.
    position: [2.2, 1.2, 2.7],
    target: [-0.6, 1.1, -1.8],
    moveTo: [2.2, 1.2, 2.1],
    durationSec: 40,
    fov: 50,
  },
  q1: { position: seat, target: her, moveTo: [0.22, 1.24, 0.06], durationSec: 24, fov: 46 },
  q2: { position: seat, target: [-0.28, 1.27, -2.15], moveTo: [0.2, 1.24, 0.08], durationSec: 24, fov: 45 },
  q3: { position: seat, target: [-0.25, 1.22, -2.05], moveTo: [0.22, 1.24, 0.04], durationSec: 24, fov: 44 },
  q4: Q4,
  inferring: Q4,
  door: { position: seat, target: her, durationSec: 150, fov: 44 },
  // Same seat framing as the start — the office is identical at both ends.
  return: { position: seat, target: her, moveTo: [0.22, 1.24, 0.06], durationSec: 24, fov: 46 },
};

/* Door-sequence poses keyed by phase — the rig eases to each in turn. */
export const DOOR_POSES: Record<
  "lines" | "turn" | "approach" | "opening" | "black",
  { position: [number, number, number]; target: [number, number, number]; fov: number; transitionMs: number }
> = {
  lines: { position: seat, target: her, fov: 44, transitionMs: 1800 },
  turn: { position: seat, target: [3, 1.35, 1.4], fov: 46, transitionMs: DOOR_PAN_MS },
  approach: { position: [1.15, 1.38, 1.4], target: [3, 1.1, 1.4], fov: 50, transitionMs: DOOR_APPROACH_MS },
  opening: { position: [3.45, 1.38, 1.4], target: [4.6, 1.3, 1.4], fov: 55, transitionMs: DOOR_OPEN_MS },
  black: { position: [3.45, 1.38, 1.4], target: [4.6, 1.3, 1.4], fov: 55, transitionMs: 400 },
};
