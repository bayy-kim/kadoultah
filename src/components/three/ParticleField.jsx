import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticleField({ count = 500, visible = true }) {
  const meshRef = useRef();
  const mouseRef = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  // Track mouse position
  const handlePointerMove = (e) => {
    mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  // Generate initial particle positions
  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Spread particles in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 5;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Soft pink, rose, and white color range
      const hue = 0.9 + Math.random() * 0.1; // 324-360 deg (pink/rose)
      const sat = Math.random() < 0.2 ? 0.0 : 0.6 + Math.random() * 0.4; // 20% white particles
      const light = 0.7 + Math.random() * 0.3; // bright pastel tones
      const color = new THREE.Color().setHSL(hue, sat, light);
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;

      siz[i] = 0.02 + Math.random() * 0.04;
    }

    return [pos, col, siz];
  }, [count]);

  // Animate particles each frame
  useFrame((state, delta) => {
    if (!meshRef.current || !visible) return;

    const time = state.clock.elapsedTime;
    const posAttr = meshRef.current.geometry.attributes.position;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const origX = positions[i3];
      const origY = positions[i3 + 1];
      const origZ = positions[i3 + 2];

      // Gentle rotation + sine wave drift
      const angle = time * 0.1 + i * 0.01;
      const drift = Math.sin(time * 0.5 + i * 0.1) * 0.3;

      posAttr.array[i3] = origX * Math.cos(angle) - origZ * Math.sin(angle) + mouseRef.current.x * 0.5;
      posAttr.array[i3 + 1] = origY + drift + mouseRef.current.y * 0.3;
      posAttr.array[i3 + 2] = origX * Math.sin(angle) + origZ * Math.cos(angle);
    }

    posAttr.needsUpdate = true;
    meshRef.current.rotation.y += delta * 0.02;
  });

  if (!visible) return null;

  return (
    <group onPointerMove={handlePointerMove}>
      {/* Invisible plane to capture mouse events */}
      <mesh visible={false}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions.slice()}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
