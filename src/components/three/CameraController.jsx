import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Camera positions for each section
const CAMERA_STATES = [
  { pos: [0, 0, 8], lookAt: [0, 0, 0] },      // Babak 1 — Intro
  { pos: [0, 0.5, 5], lookAt: [0, 0, -2] },    // Babak 2 — Journey
  { pos: [0, 1.5, 4], lookAt: [0, 0.3, 0] },   // Babak 3 — Cake
  { pos: [0, 0, 12], lookAt: [0, 0, 0] },       // Babak 4 — Letter (far away)
];

export default function CameraController({ activeSection = 0 }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 8));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    const idx = Math.min(activeSection, CAMERA_STATES.length - 1);
    const target = CAMERA_STATES[idx];

    // Smoothly interpolate camera position
    targetPos.current.set(...target.pos);
    targetLookAt.current.set(...target.lookAt);

    const lerpSpeed = 2 * delta;

    camera.position.lerp(targetPos.current, lerpSpeed);
    currentLookAt.current.lerp(targetLookAt.current, lerpSpeed);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
