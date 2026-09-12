"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { clone as cloneSkeleton } from "three/addons/utils/SkeletonUtils.js";
import { Bone, Mesh, MeshStandardMaterial, Quaternion, SkinnedMesh, Vector3 } from "three";
import { mixer } from "@/lib/audio/mixer";

/*
 * The psychologist — an MPFB avatar, seated behind the desk. She is never
 * animated beyond life: breath in the spine, a listening tilt, an occasional
 * blink, and a jaw driven by the RMS level of her actual voice channel
 * (mixer.speechLevel) — audio-driven mouth, not phoneme sync.
 */

type MorphTarget = { mesh: SkinnedMesh; index: number };

function aimBone(bone: Bone, child: Bone, direction: Vector3) {
  bone.updateWorldMatrix(true, true);
  const origin = bone.getWorldPosition(new Vector3());
  const current = child.getWorldPosition(new Vector3()).sub(origin).normalize();
  const world = bone.getWorldQuaternion(new Quaternion());
  const delta = new Quaternion().setFromUnitVectors(current, direction.clone().normalize());
  const parentWorld = bone.parent?.getWorldQuaternion(new Quaternion()) ?? new Quaternion();
  bone.quaternion.copy(parentWorld.invert().multiply(delta).multiply(world));
  bone.updateWorldMatrix(false, true);
}

const MORPHS = [
  "jawOpen",
  "mouthFunnel",
  "mouthPucker",
  "eyeBlinkLeft",
  "eyeBlinkRight",
] as const;

const BLOUSE = "#303733";

export function Psychologist({
  listening,
  onReady,
}: {
  listening: boolean;
  onReady: () => void;
}) {
  const gltf = useGLTF("/models/psychologist.glb");

  const rig = useMemo(() => {
    const scene = cloneSkeleton(gltf.scene);
    const bones = new Map<string, Bone>();
    const morphs = new Map<string, MorphTarget[]>();
    let clothes: MeshStandardMaterial | null = null;
    scene.traverse((node) => {
      if (node instanceof Bone) bones.set(node.name, node);
      if (node instanceof SkinnedMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        node.frustumCulled = false; // posed off-axis; bounds are unreliable
        if (node.name.includes("female_casualsuit01") && node.material instanceof MeshStandardMaterial) {
          // plain blouse — the sample's printed logo texture reads wrong up close
          clothes = node.material.clone();
          clothes.map = null;
          clothes.color.set(BLOUSE);
          clothes.roughness = 0.85;
          node.material = clothes;
        }
        const dict = node.morphTargetDictionary;
        if (!dict) return;
        for (const name of MORPHS) {
          const index = dict[name];
          if (index === undefined) continue;
          const list = morphs.get(name) ?? [];
          list.push({ mesh: node, index });
          morphs.set(name, list);
        }
      }
      if (node instanceof Mesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    const hips = bones.get("Hips");
    const head = bones.get("Head");
    if (!hips || !head || !morphs.has("jawOpen")) {
      throw new Error("Psychologist asset is missing its rig or face shapes");
    }

    const get = (name: string): Bone => {
      const bone = bones.get(name);
      if (!bone) throw new Error(`Psychologist rig missing ${name}`);
      return bone;
    };

    // Seated pose — aim each limb bone at a world direction, preserving the
    // rest orientation's roll rather than guessing Euler axes.
    const v = (x: number, y: number, z: number) => new Vector3(x, y, z);
    aimBone(get("LeftUpLeg"), get("LeftLeg"), v(0.06, -0.06, 0.4));
    aimBone(get("RightUpLeg"), get("RightLeg"), v(-0.06, -0.06, 0.4));
    aimBone(get("LeftLeg"), get("LeftFoot"), v(0, -0.42, 0.03));
    aimBone(get("RightLeg"), get("RightFoot"), v(0, -0.42, 0.03));
    aimBone(get("LeftFoot"), get("LeftToeBase"), v(0, 0, 0.13));
    aimBone(get("RightFoot"), get("RightToeBase"), v(0, 0, 0.13));
    aimBone(get("LeftArm"), get("LeftForeArm"), v(0.08, -0.25, 0.05));
    aimBone(get("RightArm"), get("RightForeArm"), v(-0.08, -0.25, 0.05));
    aimBone(get("LeftForeArm"), get("LeftHand"), v(-0.05, -0.04, 0.23));
    aimBone(get("RightForeArm"), get("RightHand"), v(0.05, -0.04, 0.23));

    scene.updateMatrixWorld(true);
    const hipsY = hips.getWorldPosition(new Vector3()).y;

    return {
      scene,
      bones: {
        head,
        spine: bones.get("Spine2"),
        leftForeArm: bones.get("LeftForeArm"),
        rightForeArm: bones.get("RightForeArm"),
      },
      morphs,
      clothes: clothes as MeshStandardMaterial | null,
      // root lift so her hips land at seat height after posing
      lift: 0.6 - hipsY,
    };
  }, [gltf.scene]);

  useEffect(() => () => rig.clothes?.dispose(), [rig]);

  const base = useRef<{
    head?: Quaternion;
    spine?: Quaternion;
    jaw: number;
    nextBlink: number;
    blinkT: number;
  }>({ jaw: 0, nextBlink: 2 + Math.random() * 2, blinkT: -1 });

  const tmp = useRef({
    yaw: new Quaternion(),
    pitch: new Quaternion(),
    roll: new Quaternion(),
    axisX: new Vector3(1, 0, 0),
    axisY: new Vector3(0, 1, 0),
    axisZ: new Vector3(0, 0, 1),
  });

  const readyRef = useRef(false);
  useEffect(() => {
    // baselines captured once the pose is applied and mounted
    base.current.head = rig.bones.head?.quaternion.clone();
    base.current.spine = rig.bones.spine?.quaternion.clone();
    if (!readyRef.current) {
      readyRef.current = true;
      onReady();
    }
  }, [rig, onReady]);

  const setMorph = (name: (typeof MORPHS)[number], value: number) => {
    const targets = rig.morphs.get(name);
    if (!targets) return;
    for (const t of targets) {
      const influences = t.mesh.morphTargetInfluences;
      if (influences) influences[t.index] = value;
    }
  };

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const level = mixer.speechLevel;
    const talking = level > 0.02;

    // jaw: smooth the analyser RMS toward the shape
    const b = base.current;
    b.jaw += (Math.min(level, 1) - b.jaw) * (1 - Math.exp(-dt * 18));
    setMorph("jawOpen", b.jaw * 0.45);
    setMorph("mouthFunnel", b.jaw * 0.08);

    // blink: 0.16s close/open on a 3.8–5s schedule
    if (b.blinkT < 0 && t > b.nextBlink) b.blinkT = t;
    if (b.blinkT >= 0) {
      const p = (t - b.blinkT) / 0.16;
      const amount = p >= 1 ? 0 : Math.sin(p * Math.PI);
      setMorph("eyeBlinkLeft", amount);
      setMorph("eyeBlinkRight", amount);
      if (p >= 1) {
        b.blinkT = -1;
        b.nextBlink = t + 3.8 + Math.random() * 1.2;
      }
    }

    // head: nod while talking, tilt while listening — about the captured pose
    const head = rig.bones.head;
    const tp = tmp.current;
    if (head && b.head) {
      head.quaternion.copy(b.head);
      const nod = talking ? Math.sin(t * 2.3) * 0.035 * Math.min(1, b.jaw * 4) : 0;
      const tilt = listening ? 0.025 : 0;
      tp.yaw.setFromAxisAngle(tp.axisY, talking ? Math.sin(t * 1.7) * 0.02 : 0);
      tp.pitch.setFromAxisAngle(tp.axisX, nod);
      tp.roll.setFromAxisAngle(tp.axisZ, tilt);
      head.quaternion.multiply(tp.yaw).multiply(tp.pitch).multiply(tp.roll);
    }

    // breath in the upper spine
    const spine = rig.bones.spine;
    if (spine && b.spine) {
      spine.quaternion.copy(b.spine);
      spine.quaternion.multiply(tp.pitch.setFromAxisAngle(tp.axisX, Math.sin(t * 0.9) * 0.008));
    }
  });

  return (
    <group position={[-0.25, rig.lift, -2.15]}>
      <primitive object={rig.scene} dispose={null} />
    </group>
  );
}
