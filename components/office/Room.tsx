"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Instances, Instance, RoundedBox } from "@react-three/drei";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import {
  AdditiveBlending,
  BufferGeometry,
  CanvasTexture,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  LatheGeometry,
  PlaneGeometry,
  Points,
  RectAreaLight,
  RepeatWrapping,
  SRGBColorSpace,
  Vector2,
  Vector3,
} from "three";
import type { DoorPhase } from "../door/DoorSequence";
import { DOOR_OPEN_MS } from "./shots";

/*
 * The consulting room, built from primitives — no fetched assets. Origin at
 * floor centre: x ∈ [−3,3], floor y=0, ceiling 3.2, z ∈ [−3.5,3.5].
 * Window −z, bookshelf −x, door +x at z≈1.4. Warm practicals carry the
 * room; a cold blue through the window is the only reminder of outside.
 * Nothing in here is scary — the office is the contrast to the world.
 */

const W = 3; // half-width
const H = 3.2;
const D = 3.5; // half-depth

const COLORS = {
  walnut: "#3a2a1e",
  walnutDark: "#241a12",
  brass: "#b08a4a",
  cream: "#ede4d3",
  burgundy: "#5c1f26",
  plaster: "#2b3330",
  ceiling: "#cfc4ac",
  night: "#0b1220",
  lampShade: "#0e3a26",
  lampGlow: "#1b5a38",
  bulb: "#ffd9a0",
  leather: "#3d1c1c",
  leatherWarm: "#4a2c1e",
  corridor: "#060504",
  bg: "#0a0908",
} as const;

let rectInit = false;
function initRectArea(): void {
  if (!rectInit) {
    RectAreaLightUniformsLib.init();
    rectInit = true;
  }
}

/* Deterministic PRNG so the shelves don't re-shuffle every render. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeFloorTexture(): CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 1024;
  const g = c.getContext("2d");
  if (!g) throw new Error("2d context unavailable");
  const rnd = mulberry32(7);
  g.fillStyle = "#2a1d13";
  g.fillRect(0, 0, 1024, 1024);
  const plank = 128;
  for (let y = 0; y < 1024; y += plank) {
    const offset = (y / plank) % 2 === 0 ? 0 : 256;
    for (let x = -256; x < 1024; x += 512) {
      const tone = 0.82 + rnd() * 0.3;
      g.fillStyle = `rgb(${Math.round(46 * tone)},${Math.round(33 * tone)},${Math.round(23 * tone)})`;
      g.fillRect(x + offset, y, 512, plank);
      for (let i = 0; i < 22; i++) {
        g.strokeStyle = `rgba(0,0,0,${0.05 + rnd() * 0.1})`;
        g.lineWidth = 1;
        const gy = y + rnd() * plank;
        g.beginPath();
        g.moveTo(x + offset, gy);
        g.bezierCurveTo(
          x + offset + 170, gy + rnd() * 6 - 3,
          x + offset + 340, gy + rnd() * 6 - 3,
          x + offset + 512, gy,
        );
        g.stroke();
      }
      g.fillStyle = "rgba(0,0,0,0.5)";
      g.fillRect(x + offset, y, 512, 2);
      g.fillRect(x + offset, y, 2, plank);
    }
  }
  const tex = new CanvasTexture(c);
  tex.wrapS = tex.wrapT = RepeatWrapping;
  tex.repeat.set(2, 2.4);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

function makeNightTexture(): CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 256;
  const g = c.getContext("2d");
  if (!g) throw new Error("2d context unavailable");
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, "#060a14");
  grad.addColorStop(0.75, "#0b1220");
  grad.addColorStop(1, "#1d2940");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 256);
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

/* Fine grey noise — shared as roughnessMap (plaster) and bumpMap (leather). */
function makeNoiseTexture(): CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d");
  if (!g) throw new Error("2d context unavailable");
  const rnd = mulberry32(41);
  const img = g.createImageData(256, 256);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 110 + rnd() * 90;
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const tex = new CanvasTexture(c);
  tex.wrapS = tex.wrapT = RepeatWrapping;
  tex.repeat.set(4, 4);
  return tex;
}

const BOOK_COLORS = ["#4a1f24", "#1f3a2a", "#1c2a44", "#8a6f4d", "#141210", "#5c4a2a"];

function Books() {
  const books = useMemo(() => {
    const rnd = mulberry32(1234);
    const shelfYs = [0.35, 0.88, 1.41, 1.94, 2.47];
    const list: { pos: [number, number, number]; scale: [number, number, number]; color: string }[] = [];
    for (const sy of shelfYs) {
      let z = -2.0;
      while (z < 0.92) {
        if (rnd() < 0.06) {
          z += 0.16;
          continue;
        }
        const w = 0.02 + rnd() * 0.03;
        const h = 0.18 + rnd() * 0.12;
        const color = rnd() < 0.125 ? COLORS.brass : BOOK_COLORS[Math.floor(rnd() * BOOK_COLORS.length)];
        // spines sit proud of the shelf front edge (x ≈ −2.68)
        list.push({ pos: [-2.79, sy + h / 2, z + w / 2], scale: [0.16, h, w], color });
        z += w + 0.004;
      }
    }
    return list;
  }, []);
  return (
    <Instances limit={books.length} receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.85} />
      {books.map((b, i) => (
        <Instance key={i} position={b.pos} scale={b.scale} color={b.color} />
      ))}
    </Instances>
  );
}

function DustMotes() {
  const ref = useRef<Points>(null);
  const geo = useMemo(() => {
    const rnd = mulberry32(99);
    const positions = new Float32Array(400 * 3);
    for (let i = 0; i < 400; i++) {
      const nearLamp = rnd() < 0.6;
      positions[i * 3] = nearLamp ? -0.8 + rnd() * 2.2 : 1.8 + rnd() * 1.4;
      positions[i * 3 + 1] = 0.3 + rnd() * 2.2;
      positions[i * 3 + 2] = nearLamp ? -1.9 + rnd() * 1.8 : -3.1 + rnd() * 1.4;
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return g;
  }, []);
  useFrame((_, dt) => {
    const points = ref.current;
    if (!points) return;
    const arr = (points.geometry.getAttribute("position") as Float32BufferAttribute)
      .array as Float32Array;
    const now = performance.now() / 1000;
    for (let i = 0; i < 400; i++) {
      arr[i * 3 + 1] += dt * 0.02;
      arr[i * 3] += Math.sin(now * 0.4 + i) * dt * 0.008;
      if (arr[i * 3 + 1] > 2.6) arr[i * 3 + 1] = 0.3;
    }
    points.geometry.getAttribute("position").needsUpdate = true;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.008}
        color="#e8d9b0"
        transparent
        opacity={0.35}
        blending={AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/* The door on the +x wall at z∈[0.95,1.85]. Hinge pivot at the near jamb;
   opens toward +x — out of the room, out of the camera's path. */
function Door({ doorPhase }: { doorPhase: DoorPhase | null }) {
  const hinge = useRef<Group>(null);
  const openAt = useRef<number | null>(null);
  useFrame(() => {
    const isOpen = doorPhase === "opening" || doorPhase === "black";
    if (isOpen && openAt.current === null) openAt.current = performance.now();
    const at = openAt.current;
    const t = isOpen && at !== null ? Math.min(1, (performance.now() - at) / DOOR_OPEN_MS) : 0;
    const eased = t * t * (3 - 2 * t);
    if (hinge.current) hinge.current.rotation.y = eased * Math.PI * 0.56;
  });
  const leaf = { w: 0.9, h: 2.1, t: 0.045 };
  return (
    <group>
      {/* frame: two posts and a lintel — never a solid block */}
      {[-0.48, 0.48].map((dz, i) => (
        <mesh key={`fp${i}`} position={[W - 0.03, 1.11, 1.4 + dz]}>
          <boxGeometry args={[0.08, 2.22, 0.06]} />
          <meshStandardMaterial color={COLORS.walnutDark} roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[W - 0.03, 2.19, 1.4]}>
        <boxGeometry args={[0.08, 0.08, 1.02]} />
        <meshStandardMaterial color={COLORS.walnutDark} roughness={0.7} />
      </mesh>
      {/* threshold */}
      <mesh position={[W - 0.02, 0.012, 1.4]}>
        <boxGeometry args={[0.1, 0.024, 0.98]} />
        <meshStandardMaterial color={COLORS.walnutDark} roughness={0.6} />
      </mesh>
      {/* the dark beyond — a dim corridor, not void */}
      <mesh position={[4.5, 1.6, 1.4]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[3.2, 3.2]} />
        <meshBasicMaterial color={COLORS.corridor} />
      </mesh>
      {[0.25, 2.55].map((z, i) => (
        <mesh key={`cr${i}`} position={[3.75, 1.6, z]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.5, 3.2]} />
          <meshBasicMaterial color={COLORS.corridor} />
        </mesh>
      ))}
      {/* hinge pivot at the z=0.95 jamb; leaf spans z 0→0.9 in group space */}
      <group ref={hinge} position={[W - 0.025, 0, 0.95]}>
        <mesh position={[0, leaf.h / 2, leaf.w / 2]} castShadow>
          <boxGeometry args={[leaf.t, leaf.h, leaf.w]} />
          <meshStandardMaterial color={COLORS.walnut} roughness={0.5} />
        </mesh>
        {/* six inset panels, two columns × three rows */}
        {[0.42, 1.05, 1.68].map((y, ri) =>
          [0.235, 0.665].map((z, ci) => (
            <mesh key={`p${ri}${ci}`} position={[0, y, z]}>
              <boxGeometry args={[leaf.t + 0.012, 0.5, 0.34]} />
              <meshStandardMaterial color={COLORS.walnutDark} roughness={0.55} />
            </mesh>
          )),
        )}
        {/* brass lever + escutcheon */}
        <mesh position={[-0.035, 1.02, leaf.w - 0.1]}>
          <boxGeometry args={[0.02, 0.16, 0.05]} />
          <meshStandardMaterial color={COLORS.brass} metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[-0.08, 1.04, leaf.w - 0.1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.11, 10]} />
          <meshStandardMaterial color={COLORS.brass} metalness={0.85} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

/* Wall clock beside the door — real time-of-day, second hand ticks. The
   clock.mp3 loop already plays in the office mix. */
function WallClock() {
  const second = useRef<Group>(null);
  const minute = useRef<Group>(null);
  const hour = useRef<Group>(null);
  const acc = useRef(0);
  useFrame((_, dt) => {
    acc.current += dt;
    if (acc.current < 1) return;
    acc.current = 0;
    const now = new Date();
    const s = now.getSeconds();
    const m = now.getMinutes() + s / 60;
    const h = (now.getHours() % 12) + m / 60;
    if (second.current) second.current.rotation.z = (-s / 60) * Math.PI * 2;
    if (minute.current) minute.current.rotation.z = (-m / 60) * Math.PI * 2;
    if (hour.current) hour.current.rotation.z = (-h / 12) * Math.PI * 2;
  });
  // Face reads into the room (−x): the group lays the face in the XY plane.
  return (
    <group position={[W - 0.06, 2.2, 0.2]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.035, 32]} />
        <meshStandardMaterial color={COLORS.walnut} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <circleGeometry args={[0.145, 32]} />
        <meshStandardMaterial color={COLORS.cream} roughness={0.6} />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.sin(a) * 0.125, Math.cos(a) * 0.125, 0.023]}>
            <boxGeometry args={[0.006, i % 3 === 0 ? 0.022 : 0.012, 0.003]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        );
      })}
      <group position={[0, 0, 0.026]}>
        <group ref={hour}>
          <mesh position={[0, 0.032, 0]}>
            <boxGeometry args={[0.009, 0.065, 0.003]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        </group>
        <group ref={minute}>
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.006, 0.1, 0.003]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        </group>
        <group ref={second}>
          <mesh position={[0, 0.055, 0]}>
            <boxGeometry args={[0.0025, 0.11, 0.002]} />
            <meshStandardMaterial color={COLORS.burgundy} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/* Her wingback — seat top 0.51, rounded leather, yaw 0 (she sits in it). */
function Wingback({ noiseTex }: { noiseTex: CanvasTexture }) {
  const mat = useMemo(
    () => ({ roughness: 0.5, bumpMap: noiseTex, bumpScale: 0.003 }),
    [noiseTex],
  );
  return (
    <group position={[-0.25, 0, -2.15]}>
      <RoundedBox args={[0.65, 0.12, 0.57]} radius={0.045} position={[0, 0.45, 0]} castShadow>
        <meshStandardMaterial color={COLORS.leather} {...mat} />
      </RoundedBox>
      <RoundedBox
        args={[0.67, 0.82, 0.13]}
        radius={0.06}
        position={[0, 0.94, -0.28]}
        rotation={[0.12, 0, 0]}
        castShadow
      >
        <meshStandardMaterial color={COLORS.leather} {...mat} />
      </RoundedBox>
      {/* wings curling forward */}
      {[-0.31, 0.31].map((x, i) => (
        <RoundedBox
          key={`w${i}`}
          args={[0.14, 0.72, 0.3]}
          radius={0.05}
          position={[x, 0.92, -0.13]}
          rotation={[0.08, i === 0 ? 0.4 : -0.4, 0]}
          castShadow
        >
          <meshStandardMaterial color={COLORS.leather} {...mat} />
        </RoundedBox>
      ))}
      {[-0.325, 0.325].map((x, i) => (
        <RoundedBox key={`a${i}`} args={[0.1, 0.15, 0.55]} radius={0.04} position={[x, 0.66, 0.02]}>
          <meshStandardMaterial color={COLORS.leather} {...mat} />
        </RoundedBox>
      ))}
      {/* under-frame */}
      <mesh position={[0, 0.24, 0]}>
        <boxGeometry args={[0.55, 0.24, 0.48]} />
        <meshStandardMaterial color={COLORS.walnutDark} roughness={0.6} />
      </mesh>
      {[
        [-0.26, -0.2],
        [0.26, -0.2],
        [-0.26, 0.2],
        [0.26, 0.2],
      ].map(([x, z], i) => (
        <mesh key={`l${i}`} position={[x, 0.06, z]}>
          <cylinderGeometry args={[0.03, 0.02, 0.12, 8]} />
          <meshStandardMaterial color={COLORS.walnutDark} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

/* The visitor's armchair — the camera sits just in front of it. */
function VisitorChair({ noiseTex }: { noiseTex: CanvasTexture }) {
  const mat = useMemo(
    () => ({ roughness: 0.55, bumpMap: noiseTex, bumpScale: 0.003 }),
    [noiseTex],
  );
  return (
    <group position={[0.22, 0, 0.3]} rotation={[0, Math.PI, 0]}>
      <RoundedBox args={[0.6, 0.14, 0.55]} radius={0.05} position={[0, 0.4, 0]} castShadow>
        <meshStandardMaterial color={COLORS.leatherWarm} {...mat} />
      </RoundedBox>
      <RoundedBox args={[0.58, 0.42, 0.12]} radius={0.05} position={[0, 0.68, -0.24]} rotation={[0.15, 0, 0]} castShadow>
        <meshStandardMaterial color={COLORS.leatherWarm} {...mat} />
      </RoundedBox>
      {[-0.3, 0.3].map((x, i) => (
        <RoundedBox key={`va${i}`} args={[0.09, 0.13, 0.5]} radius={0.035} position={[x, 0.53, 0]}>
          <meshStandardMaterial color={COLORS.leatherWarm} {...mat} />
        </RoundedBox>
      ))}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.5, 0.2, 0.45]} />
        <meshStandardMaterial color={COLORS.walnutDark} roughness={0.6} />
      </mesh>
    </group>
  );
}

/* Banker's lamp — bell profile shade, brass rim and finial, a visible bulb. */
function BankersLamp() {
  const shadeGeo = useMemo(() => {
    const pts = [
      new Vector2(0.025, 0),
      new Vector2(0.07, 0.012),
      new Vector2(0.11, 0.05),
      new Vector2(0.145, 0.09),
      new Vector2(0.16, 0.12),
    ];
    return new LatheGeometry(pts, 28);
  }, []);
  return (
    <group position={[0.45, 0.785, -0.1]}>
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.09, 0.11, 0.02, 20]} />
        <meshStandardMaterial color={COLORS.brass} metalness={0.8} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.34, 10]} />
        <meshStandardMaterial color={COLORS.brass} metalness={0.8} roughness={0.35} />
      </mesh>
      {/* shade hangs bell-down over the bulb */}
      <mesh geometry={shadeGeo} position={[0, 0.37, 0]} rotation={[Math.PI, 0, 0]}>
        <meshPhysicalMaterial
          color={COLORS.lampShade}
          emissive={COLORS.lampGlow}
          emissiveIntensity={0.5}
          roughness={0.25}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
          side={DoubleSide}
        />
      </mesh>
      {/* brass rim at the shade's lower edge + finial */}
      <mesh position={[0, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.16, 0.006, 10, 28]} />
        <meshStandardMaterial color={COLORS.brass} metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.39, 0]}>
        <sphereGeometry args={[0.016, 12, 10]} />
        <meshStandardMaterial color={COLORS.brass} metalness={0.85} roughness={0.3} />
      </mesh>
      {/* the bulb — the visible source of the desk pool */}
      <mesh position={[0, 0.29, 0]}>
        <sphereGeometry args={[0.023, 14, 12]} />
        <meshStandardMaterial color={COLORS.bulb} emissive={COLORS.bulb} emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

export function Room({ doorPhase }: { doorPhase: DoorPhase | null }) {
  const floorTex = useMemo(makeFloorTexture, []);
  const nightTex = useMemo(makeNightTexture, []);
  const noiseTex = useMemo(makeNoiseTexture, []);
  const keyRef = useRef<RectAreaLight>(null);
  const curtainGeo = useMemo(() => {
    const g = new PlaneGeometry(0.55, 2.5, 14, 1);
    const pos = g.getAttribute("position");
    for (let i = 0; i < pos.count; i++) {
      pos.setZ(i, Math.sin(pos.getX(i) * 34) * 0.018);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  /* Wood for the desk and shelves — the same planks, tighter repeat. */
  const woodTex = useMemo(() => {
    const t = floorTex.clone();
    t.repeat.set(2, 1);
    t.needsUpdate = true;
    return t;
  }, [floorTex]);
  useEffect(() => () => woodTex.dispose(), [woodTex]);

  useEffect(() => {
    initRectArea();
    keyRef.current?.lookAt(new Vector3(-0.25, 1.2, -2.15));
  }, []);

  const plasterMat = { color: COLORS.plaster, roughness: 1, roughnessMap: noiseTex, bumpMap: noiseTex, bumpScale: 0.008 } as const;

  return (
    <group>
      <fog attach="fog" args={[COLORS.bg, 6, 16]} />
      <hemisphereLight args={[COLORS.cream, COLORS.walnut, 0.22]} />

      {/* Cold night light through the window — the only cold source. */}
      <directionalLight
        position={[0, 2.2, -6]}
        intensity={0.6}
        color="#4a6a9a"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
        shadow-normalBias={0.025}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />
      {/* Banker's lamp — the key light. */}
      <pointLight
        position={[0.45, 1.15, -1.35]}
        intensity={6}
        distance={4}
        decay={2}
        color="#ffd9a0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
        shadow-normalBias={0.025}
      />
      {/* Floor lamp — warm fill in the far-right corner. */}
      <pointLight position={[2.45, 1.5, -2.95]} intensity={9} distance={5} decay={2} color="#ffdcae" />
      {/* Soft overhead warmth so walls and chairs keep their form. */}
      <pointLight position={[0, 2.7, 0.2]} intensity={3} distance={8} decay={2} color="#f2d9b0" />
      {/* Key on her face — a soft warm panel off the visitor's left. */}
      <rectAreaLight
        ref={keyRef}
        position={[0.1, 1.8, -0.4]}
        intensity={3}
        width={1.5}
        height={1.2}
        color="#ffd9b0"
      />

      {/* ---- architecture ------------------------------------------------ */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[W * 2, D * 2]} />
        <meshStandardMaterial map={floorTex} roughness={0.55} />
      </mesh>
      <mesh position={[0, H, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W * 2, D * 2]} />
        <meshStandardMaterial color={COLORS.ceiling} roughness={1} />
      </mesh>
      {/* near wall */}
      <mesh position={[0, H / 2, D]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[W * 2, H]} />
        <meshStandardMaterial {...plasterMat} />
      </mesh>
      {/* far wall split around the window aperture x∈[−0.7,0.7], y∈[0.6,2.8] */}
      <mesh position={[(-W + -0.7) / 2, H / 2, -D]}>
        <planeGeometry args={[W - 0.7, H]} />
        <meshStandardMaterial {...plasterMat} />
      </mesh>
      <mesh position={[(0.7 + W) / 2, H / 2, -D]}>
        <planeGeometry args={[W - 0.7, H]} />
        <meshStandardMaterial {...plasterMat} />
      </mesh>
      <mesh position={[0, (2.8 + H) / 2, -D]}>
        <planeGeometry args={[1.4, H - 2.8]} />
        <meshStandardMaterial {...plasterMat} />
      </mesh>
      <mesh position={[0, 0.3, -D]}>
        <planeGeometry args={[1.4, 0.6]} />
        <meshStandardMaterial {...plasterMat} />
      </mesh>
      {/* left wall (bookshelf side) */}
      <mesh position={[-W, H / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[D * 2, H]} />
        <meshStandardMaterial {...plasterMat} />
      </mesh>
      {/* right wall split around the door aperture z∈[0.95,1.85], y∈[0,2.1] */}
      <mesh position={[W, H / 2, (-D + 0.95) / 2]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.95 + D, H]} />
        <meshStandardMaterial {...plasterMat} />
      </mesh>
      <mesh position={[W, H / 2, (1.85 + D) / 2]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[D - 1.85, H]} />
        <meshStandardMaterial {...plasterMat} />
      </mesh>
      <mesh position={[W, (2.1 + H) / 2, 1.4]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.9, H - 2.1]} />
        <meshStandardMaterial {...plasterMat} />
      </mesh>
      {/* skirting, split at the doorway on +x */}
      <mesh position={[0, 0.07, -D + 0.02]}>
        <boxGeometry args={[W * 2, 0.14, 0.025]} />
        <meshStandardMaterial color={COLORS.walnutDark} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.07, D - 0.02]}>
        <boxGeometry args={[W * 2, 0.14, 0.025]} />
        <meshStandardMaterial color={COLORS.walnutDark} roughness={0.7} />
      </mesh>
      <mesh position={[-W + 0.02, 0.07, 0]}>
        <boxGeometry args={[0.025, 0.14, D * 2]} />
        <meshStandardMaterial color={COLORS.walnutDark} roughness={0.7} />
      </mesh>
      <mesh position={[W - 0.02, 0.07, (0.95 - D) / 2]}>
        <boxGeometry args={[0.025, 0.14, 0.95 + D]} />
        <meshStandardMaterial color={COLORS.walnutDark} roughness={0.7} />
      </mesh>
      <mesh position={[W - 0.02, 0.07, (1.85 + D) / 2]}>
        <boxGeometry args={[0.025, 0.14, D - 1.85]} />
        <meshStandardMaterial color={COLORS.walnutDark} roughness={0.7} />
      </mesh>
      {/* picture rails on the long walls */}
      {[-D + 0.02, D - 0.02].map((z, i) => (
        <mesh key={`pr${i}`} position={[0, 2.6, z]}>
          <boxGeometry args={[W * 2, 0.04, 0.02]} />
          <meshStandardMaterial color={COLORS.walnutDark} roughness={0.7} />
        </mesh>
      ))}

      {/* ---- rug ---------------------------------------------------------- */}
      <mesh position={[-0.1, 0.015, -0.4]} scale={[1.5, 1, 2.1]} receiveShadow>
        <cylinderGeometry args={[1, 1, 0.03, 48]} />
        <meshStandardMaterial color={COLORS.burgundy} roughness={0.9} />
      </mesh>

      {/* ---- window (far wall, open aperture) ------------------------------- */}
      <group position={[0, 1.7, -D + 0.03]}>
        <mesh position={[0, 0, -0.14]}>
          <planeGeometry args={[1.4, 2.2]} />
          <meshBasicMaterial map={nightTex} />
        </mesh>
        <mesh position={[0, 0, -0.06]}>
          <planeGeometry args={[1.4, 2.2]} />
          <meshPhysicalMaterial color="#101820" transparent opacity={0.25} roughness={0.05} />
        </mesh>
        {/* frame: four borders so the night shows through */}
        {[-0.73, 0.73].map((x, i) => (
          <mesh key={`fv${i}`} position={[x, 0, 0]}>
            <boxGeometry args={[0.06, 2.32, 0.08]} />
            <meshStandardMaterial color={COLORS.walnut} roughness={0.6} />
          </mesh>
        ))}
        {[-1.13, 1.13].map((y, i) => (
          <mesh key={`fh${i}`} position={[0, y, 0]}>
            <boxGeometry args={[1.52, 0.06, 0.08]} />
            <meshStandardMaterial color={COLORS.walnut} roughness={0.6} />
          </mesh>
        ))}
        {/* mullions in front of the glass — 2×3 panes */}
        {[-0.37, 0.37].map((y, i) => (
          <mesh key={`mh${i}`} position={[0, y, 0.01]}>
            <boxGeometry args={[1.4, 0.035, 0.02]} />
            <meshStandardMaterial color={COLORS.walnut} roughness={0.6} />
          </mesh>
        ))}
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[0.035, 2.2, 0.02]} />
          <meshStandardMaterial color={COLORS.walnut} roughness={0.6} />
        </mesh>
        {/* sheer curtains, pleated */}
        {[-0.85, 0.85].map((x, i) => (
          <mesh key={`cu${i}`} geometry={curtainGeo} position={[x, -0.05, 0.1]} rotation={[0, i === 0 ? 0.12 : -0.12, 0]}>
            <meshStandardMaterial color={COLORS.cream} transparent opacity={0.35} roughness={1} side={DoubleSide} />
          </mesh>
        ))}
      </group>

      {/* ---- bookshelf (left wall) — open shelves, books visible ------------- */}
      <group>
        {/* back panel + sides — not a solid block */}
        <mesh position={[-2.985, 1.5, -0.55]}>
          <boxGeometry args={[0.03, 3.0, 3.0]} />
          <meshStandardMaterial color={COLORS.walnutDark} roughness={0.6} />
        </mesh>
        {[-2.05, 0.95].map((z, i) => (
          <mesh key={`bs${i}`} position={[-2.825, 1.5, z]}>
            <boxGeometry args={[0.29, 3.0, 0.05]} />
            <meshStandardMaterial color={COLORS.walnutDark} roughness={0.6} />
          </mesh>
        ))}
        {[0.02, 2.98].map((y, i) => (
          <mesh key={`bt${i}`} position={[-2.825, y, -0.55]}>
            <boxGeometry args={[0.29, 0.04, 3.0]} />
            <meshStandardMaterial color={COLORS.walnut} roughness={0.55} />
          </mesh>
        ))}
        {[0.35, 0.88, 1.41, 1.94, 2.47].map((y, i) => (
          <mesh key={`sh${i}`} position={[-2.825, y - 0.02, -0.55]}>
            <boxGeometry args={[0.29, 0.035, 2.9]} />
            <meshStandardMaterial map={woodTex} roughness={0.55} />
          </mesh>
        ))}
        <Books />
        <group position={[-2.79, 2.68, 0.6]}>
          <mesh position={[0, 0.09, 0]}>
            <sphereGeometry args={[0.07, 16, 12]} />
            <meshStandardMaterial color="#b8ab90" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.01, 0]}>
            <cylinderGeometry args={[0.075, 0.09, 0.05, 16]} />
            <meshStandardMaterial color="#a99c82" roughness={0.55} />
          </mesh>
        </group>
        <mesh position={[-2.79, 2.55, 0.25]} rotation={[0, 0.06, 0]}>
          <boxGeometry args={[0.17, 0.045, 0.24]} />
          <meshStandardMaterial color="#4a1f24" roughness={0.85} />
        </mesh>
        <mesh position={[-2.79, 2.6, 0.25]} rotation={[0, -0.05, 0]}>
          <boxGeometry args={[0.16, 0.04, 0.22]} />
          <meshStandardMaterial color="#1c2a44" roughness={0.85} />
        </mesh>
      </group>

      {/* ---- door + clock (right wall) ------------------------------------- */}
      <Door doorPhase={doorPhase} />
      <WallClock />

      {/* ---- desk ------------------------------------------------------------ */}
      <group position={[0, 0, -1.25]}>
        <mesh position={[0, 0.76, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.05, 0.8]} />
          <meshStandardMaterial map={woodTex} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.62, 0.1]}>
          <boxGeometry args={[1.45, 0.24, 0.55]} />
          <meshStandardMaterial color={COLORS.walnutDark} roughness={0.55} />
        </mesh>
        {[
          [-0.72, -0.32],
          [0.72, -0.32],
          [-0.72, 0.32],
          [0.72, 0.32],
        ].map(([x, z], i) => (
          <mesh key={`leg${i}`} position={[x, 0.37, z]}>
            <cylinderGeometry args={[0.028, 0.02, 0.74, 10]} />
            <meshStandardMaterial color={COLORS.walnutDark} roughness={0.55} />
          </mesh>
        ))}
        <BankersLamp />
        {/* her notebook, closed, with the fountain pen */}
        <mesh position={[-0.15, 0.805, 0.05]} rotation={[0, 0.12, 0]}>
          <boxGeometry args={[0.22, 0.025, 0.3]} />
          <meshStandardMaterial color="#2a1414" roughness={0.5} />
        </mesh>
        <mesh position={[-0.15, 0.822, 0.05]} rotation={[0, 0.12, Math.PI / 2]}>
          <cylinderGeometry args={[0.008, 0.008, 0.16, 10]} />
          <meshStandardMaterial color="#141210" roughness={0.4} />
        </mesh>
        <mesh position={[-0.15, 0.822, 0.13]} rotation={[0, 0.12, Math.PI / 2]}>
          <cylinderGeometry args={[0.009, 0.009, 0.03, 10]} />
          <meshStandardMaterial color={COLORS.brass} metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0.62, 0.8, 0.15]}>
          <boxGeometry args={[0.3, 0.05, 0.2]} />
          <meshStandardMaterial color={COLORS.brass} metalness={0.7} roughness={0.4} />
        </mesh>
        <mesh position={[-0.55, 0.845, -0.15]}>
          <cylinderGeometry args={[0.035, 0.03, 0.09, 16]} />
          <meshPhysicalMaterial transmission={0.9} roughness={0.05} thickness={0.02} color="#c9b98a" />
        </mesh>
        <mesh position={[-0.68, 0.9, -0.2]}>
          <cylinderGeometry args={[0.045, 0.06, 0.2, 16]} />
          <meshPhysicalMaterial transmission={0.9} roughness={0.05} thickness={0.03} color="#8a5a20" />
        </mesh>
      </group>

      <Wingback noiseTex={noiseTex} />
      <VisitorChair noiseTex={noiseTex} />

      {/* ---- side table ------------------------------------------------------ */}
      <group position={[1.05, 0, 0.35]}>
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.03, 24]} />
          <meshStandardMaterial map={woodTex} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.28, 0]}>
          <cylinderGeometry args={[0.02, 0.03, 0.55, 10]} />
          <meshStandardMaterial color={COLORS.walnutDark} roughness={0.6} />
        </mesh>
        <mesh position={[0.05, 0.62, 0.02]}>
          <cylinderGeometry args={[0.032, 0.028, 0.1, 16]} />
          <meshPhysicalMaterial transmission={0.9} roughness={0.05} thickness={0.015} color="#dfe8ea" />
        </mesh>
      </group>

      {/* ---- floor lamp ------------------------------------------------------- */}
      <group position={[2.45, 0, -2.95]}>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.16, 0.18, 0.04, 20]} />
          <meshStandardMaterial color={COLORS.brass} metalness={0.8} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.014, 0.014, 1.55, 10]} />
          <meshStandardMaterial color={COLORS.brass} metalness={0.8} roughness={0.35} />
        </mesh>
        <mesh position={[0, 1.62, 0]}>
          <cylinderGeometry args={[0.19, 0.23, 0.3, 20, 1, true]} />
          <meshStandardMaterial
            color={COLORS.cream}
            emissive="#ffdcae"
            emissiveIntensity={0.55}
            roughness={0.9}
            side={DoubleSide}
          />
        </mesh>
      </group>

      <DustMotes />
    </group>
  );
}
