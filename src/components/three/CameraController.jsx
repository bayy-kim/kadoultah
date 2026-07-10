import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

const CAMERA_STATES = [
  { pos: [0, 10, 8], lookAt: [0, 10, 0] },               // Section 0 — Intro (y=10)
  { pos: [0, 0.5, 5], lookAt: [0, 0, -2] },              // Section 1 — Journey (y=0)
  { pos: [-1.2, -10 + 1.5, 4.5], lookAt: [0.5, -10 + 0.3, 0] }, // Section 2 — Cake (y=-10)
  { pos: [0, -20, 12], lookAt: [0, -20, 0] },             // Section 3 — Letter (y=-20)
];

export default function CameraController({ scrollProgress = 0 }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(...CAMERA_STATES[0].pos));
  const targetLookAt = useRef(new THREE.Vector3(...CAMERA_STATES[0].lookAt));
  const currentLookAt = useRef(new THREE.Vector3(...CAMERA_STATES[0].lookAt));

  useEffect(() => {
    // Calculate targeted position and lookAt based on scroll progress (0 - 100)
    const t = (scrollProgress / 100) * (CAMERA_STATES.length - 1);
    const idx = Math.min(Math.floor(t), CAMERA_STATES.length - 2);
    const fraction = t - idx;

    const startState = CAMERA_STATES[idx];
    const endState = CAMERA_STATES[idx + 1];

    targetPos.current.set(
      THREE.MathUtils.lerp(startState.pos[0], endState.pos[0], fraction),
      THREE.MathUtils.lerp(startState.pos[1], endState.pos[1], fraction),
      THREE.MathUtils.lerp(startState.pos[2], endState.pos[2], fraction)
    );

    targetLookAt.current.set(
      THREE.MathUtils.lerp(startState.lookAt[0], endState.lookAt[0], fraction),
      THREE.MathUtils.lerp(startState.lookAt[1], endState.lookAt[1], fraction),
      THREE.MathUtils.lerp(startState.lookAt[2], endState.lookAt[2], fraction)
    );
  }, [scrollProgress]);

  useFrame((state, delta) => {
    // Responsive lerping for smooth physics feel
    const lerpSpeed = Math.min(5 * delta, 1);
    camera.position.lerp(targetPos.current, lerpSpeed);
    currentLookAt.current.lerp(targetLookAt.current, lerpSpeed);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
