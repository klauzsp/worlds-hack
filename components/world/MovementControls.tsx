"use client";

import { useEffect } from "react";
import type { WorldAdapter, Rotation, Translation } from "@/lib/world/adapter";

const MOVE_KEYS: Record<string, "Front" | "Back" | "Left" | "Right"> = {
  KeyW: "Front",
  KeyS: "Back",
  KeyA: "Left",
  KeyD: "Right",
};

const LOOK_KEYS: Record<string, Rotation> = {
  ArrowUp: "Mouse_Up",
  ArrowDown: "Mouse_Down",
  ArrowLeft: "Mouse_Left",
  ArrowRight: "Mouse_Right",
};

const DIAGONAL_MOVE: Record<string, Translation> = {
  "Front+Left": "Front_Left",
  "Front+Right": "Front_Right",
  "Back+Left": "Back_Left",
  "Back+Right": "Back_Right",
};

const DIAGONAL_LOOK: Record<string, Rotation> = {
  "Mouse_Down+Mouse_Left": "Mouse_Down_Left",
  "Mouse_Down+Mouse_Right": "Mouse_Down_Right",
  "Mouse_Up+Mouse_Left": "Mouse_Up_Left",
  "Mouse_Up+Mouse_Right": "Mouse_Up_Right",
};

/*
 * Held-state keybinds. Movement is persistent on this model — a direction
 * stays until released — so we track pressed keys, compose diagonals, and
 * always send the release on keyup/blur/unmount. Looking happens two ways:
 * arrow keys (held, like movement) and pointer-locked mouse motion, where
 * deltas become a rotation hold that decays ~140ms after the mouse stops.
 * E reaches for the first verb the world itself advertises; Space jumps.
 */
export function MovementControls({ adapter }: { adapter: WorldAdapter }) {
  useEffect(() => {
    const pressed = new Set<string>();
    let lastTranslation: Translation = "None";
    let lastRotation: Rotation = "None";
    let sprinting = false;
    let mouseX: Rotation = "None";
    let mouseY: Rotation = "None";
    let mouseDecay: number | null = null;

    function keyRotation(): Rotation {
      const dirs = [...pressed].map((k) => LOOK_KEYS[k]).filter(Boolean);
      return dirs.length === 0 ? "None" : dirs[dirs.length - 1];
    }

    function composedRotation(): Rotation {
      const key = keyRotation();
      if (key !== "None") return key;
      if (mouseX !== "None" && mouseY !== "None") {
        return DIAGONAL_LOOK[[mouseX, mouseY].sort().join("+")] ?? mouseX;
      }
      return mouseX !== "None" ? mouseX : mouseY;
    }

    function sync() {
      const dirs = [...pressed].map((k) => MOVE_KEYS[k]).filter(Boolean);
      const translation: Translation =
        dirs.length === 0
          ? "None"
          : dirs.length === 1
            ? dirs[0]
            : (DIAGONAL_MOVE[dirs.sort().join("+")] ?? dirs[dirs.length - 1]);
      const rotation = composedRotation();
      const axes: Parameters<WorldAdapter["hold"]>[0] = {};
      if (translation !== lastTranslation) axes.translation = translation;
      if (rotation !== lastRotation) axes.rotation = rotation;
      if (Object.keys(axes).length > 0) adapter.hold(axes);
      lastTranslation = translation;
      lastRotation = rotation;
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.repeat) return;
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        if (!sprinting) {
          sprinting = true;
          adapter.interact("Sprint");
        }
        return;
      }
      if (e.code === "Space") {
        e.preventDefault();
        adapter.interact("Jump");
        return;
      }
      if (e.code === "KeyQ") {
        // Glance over the shoulder — a timed rotation hold ≈ a turn-back.
        // The pursuit only advances when unobserved; this is the check.
        const dir = Math.random() < 0.5 ? "Mouse_Left" : "Mouse_Right";
        adapter.hold({ rotation: dir });
        lastRotation = dir;
        window.setTimeout(() => {
          adapter.release({ rotation: true });
          lastRotation = "None";
          mouseX = "None";
          mouseY = "None";
        }, 750);
        return;
      }
      if (e.code === "KeyE") {
        const verb = adapter.environmentVerbs[0];
        if (verb) adapter.interact(verb);
        return;
      }
      if (MOVE_KEYS[e.code] || LOOK_KEYS[e.code]) {
        e.preventDefault();
        pressed.add(e.code);
        sync();
      }
    }

    function onKeyUp(e: KeyboardEvent) {
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        if (sprinting) {
          sprinting = false;
          adapter.release({ interaction: true });
        }
        return;
      }
      if (e.code === "Space" || e.code === "KeyE") {
        adapter.release({ interaction: true });
        return;
      }
      if (pressed.delete(e.code)) sync();
    }

    function onMouseMove(e: MouseEvent) {
      if (document.pointerLockElement === null) return;
      const THRESHOLD = 2;
      mouseX =
        e.movementX > THRESHOLD ? "Mouse_Right" : e.movementX < -THRESHOLD ? "Mouse_Left" : mouseX;
      mouseY =
        e.movementY > THRESHOLD ? "Mouse_Down" : e.movementY < -THRESHOLD ? "Mouse_Up" : mouseY;
      sync();
      if (mouseDecay !== null) window.clearTimeout(mouseDecay);
      mouseDecay = window.setTimeout(() => {
        mouseX = "None";
        mouseY = "None";
        sync();
      }, 140);
    }

    function onMouseDown() {
      if (document.pointerLockElement === null) {
        document.body.requestPointerLock();
      }
    }

    function onBlur() {
      pressed.clear();
      sprinting = false;
      mouseX = "None";
      mouseY = "None";
      lastTranslation = "None";
      lastRotation = "None";
      adapter.stopAll();
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("blur", onBlur);
      if (mouseDecay !== null) window.clearTimeout(mouseDecay);
      if (document.pointerLockElement !== null) document.exitPointerLock();
      onBlur();
    };
  }, [adapter]);

  return null;
}
