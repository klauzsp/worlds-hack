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

/*
 * Held-state keybinds. Movement is persistent on this model — a direction
 * stays until released — so we track pressed keys, compose diagonals, and
 * always send the release on keyup/blur/unmount.
 */
export function MovementControls({ adapter }: { adapter: WorldAdapter }) {
  useEffect(() => {
    const pressed = new Set<string>();
    let lastTranslation: Translation = "None";
    let lastRotation: Rotation = "None";
    let sprinting = false;

    function currentTranslation(): Translation {
      const dirs = [...pressed].map((k) => MOVE_KEYS[k]).filter(Boolean);
      if (dirs.length === 0) return "None";
      if (dirs.length === 1) return dirs[0];
      const key = dirs.sort().join("+");
      return DIAGONAL_MOVE[key] ?? dirs[dirs.length - 1];
    }

    function currentRotation(): Rotation {
      const dirs = [...pressed].map((k) => LOOK_KEYS[k]).filter(Boolean);
      return dirs.length === 0 ? "None" : dirs[dirs.length - 1];
    }

    function sync() {
      const translation = currentTranslation();
      const rotation = currentRotation();
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
      if (pressed.delete(e.code)) sync();
    }

    function onBlur() {
      pressed.clear();
      sprinting = false;
      lastTranslation = "None";
      lastRotation = "None";
      adapter.stopAll();
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      onBlur();
    };
  }, [adapter]);

  return null;
}
