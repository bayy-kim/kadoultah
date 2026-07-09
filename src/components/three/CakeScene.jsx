import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function GlowParticle({ position, color, speed }) {
  const ref = useRef();
  const initialPos = useRef(position);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed;
    ref.current.position.x = initialPos.current[0] + Math.sin(t) * 0.3;
    ref.current.position.y = initialPos.current[1] + Math.cos(t * 0.7) * 0.2;
    ref.current.position.z = initialPos.current[2] + Math.sin(t * 1.3) * 0.3;
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} />
    </mesh>
  );
}

function CandleFlame({ position, isLit }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current || !isLit) return;
    const t = state.clock.elapsedTime;
    ref.current.scale.y = 1 + Math.sin(t * 8) * 0.15;
    ref.current.scale.x = 1 + Math.sin(t * 6) * 0.1;
  });

  if (!isLit) return null;

  return (
    <group position={position}>
      {/* Candle stick */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
        <meshStandardMaterial color="#f0e6d3" />
      </mesh>
      {/* Flame */}
      <mesh ref={ref} position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.9} />
      </mesh>
      <pointLight color="#fbbf24" intensity={2} distance={3} />
    </group>
  );
}

export default function CakeScene({ visible = true, isBlown = false }) {
  const groupRef = useRef();

  // Generate orbiting glow particles
  const glowParticles = useMemo(() => {
    const particles = [];
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      const radius = 1.5 + Math.random() * 1;
      const y = (Math.random() - 0.5) * 2;
      particles.push({
        position: [
          Math.cos(angle) * radius,
          y,
          Math.sin(angle) * radius,
        ],
        color: new THREE.Color().setHSL(0.95 + Math.random() * 0.05, 0.9, 0.7 + Math.random() * 0.2), // Soft pink
        speed: 0.3 + Math.random() * 0.5,
      });
    }
    return particles;
  }, []);

  // Candle positions on top of cake
  const candlePositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const r = 0.35;
      positions.push([Math.cos(angle) * r, 0.85, Math.sin(angle) * r]);
    }
    return positions;
  }, []);

  // Explosion particles
  const explosionParticles = useMemo(() => {
    const particles = [];
    for (let i = 0; i < 60; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 2 + Math.random() * 4;
      particles.push({
        vx: Math.sin(phi) * Math.cos(theta) * speed,
        vy: Math.sin(phi) * Math.sin(theta) * speed + 2,
        vz: Math.cos(phi) * speed,
        color: new THREE.Color().setHSL(Math.random() * 0.15 + 0.05, 1, 0.6),
      });
    }
    return particles;
  }, []);

  const explosionRef = useRef();
  const explosionTimeRef = useRef(null);

  useFrame((state, delta) => {
    if (!groupRef.current || !visible) return;
    groupRef.current.rotation.y += delta * 0.1;

    // Animate explosion
    if (isBlown && explosionRef.current) {
      if (explosionTimeRef.current === null) {
        explosionTimeRef.current = 0;
      }
      explosionTimeRef.current += delta;
      const t = explosionTimeRef.current;
      const posAttr = explosionRef.current.geometry.attributes.position;

      for (let i = 0; i < explosionParticles.length; i++) {
        const p = explosionParticles[i];
        posAttr.array[i * 3] = p.vx * t;
        posAttr.array[i * 3 + 1] = p.vy * t - 4.9 * t * t;
        posAttr.array[i * 3 + 2] = p.vz * t;
      }
      posAttr.needsUpdate = true;

      // Fade out
      const mat = explosionRef.current.material;
      mat.opacity = Math.max(0, 1 - t * 0.5);
    }
  });

  if (!visible) return null;

  return (
    <group ref={groupRef}>
      {/* Abstract cake — stacked cylinders */}
      {/* Bottom tier */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.8, 0.9, 0.4, 32]} />
        <meshStandardMaterial
          color="#ff8093"
          metalness={0.1}
          roughness={0.6}
          emissive="#ffa6bc"
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* Middle tier */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.6, 0.7, 0.4, 32]} />
        <meshStandardMaterial
          color="#fff5f6"
          metalness={0.1}
          roughness={0.6}
          emissive="#ffe5ec"
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* Top tier */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.3, 32]} />
        <meshStandardMaterial
          color="#ffb3c6"
          metalness={0.1}
          roughness={0.6}
          emissive="#ffccd5"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Decoration ring */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.85, 0.02, 8, 32]} />
        <meshBasicMaterial color="#ff7597" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.65, 0.02, 8, 32]} />
        <meshBasicMaterial color="#ffa6bc" transparent opacity={0.6} />
      </mesh>

      {/* Candles */}
      {candlePositions.map((pos, i) => (
        <CandleFlame key={i} position={pos} isLit={!isBlown} />
      ))}

      {/* Orbiting glow particles */}
      {glowParticles.map((p, i) => (
        <GlowParticle key={i} {...p} />
      ))}

      {/* Explosion particles (only after blown) */}
      {isBlown && (
        <points ref={explosionRef} position={[0, 0.8, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={explosionParticles.length}
              array={new Float32Array(explosionParticles.length * 3)}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={explosionParticles.length}
              array={new Float32Array(
                explosionParticles.flatMap((p) => [p.color.r, p.color.g, p.color.b])
              )}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.1}
            vertexColors
            transparent
            opacity={1}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 3, 2]} color="#ff7597" intensity={1.5} distance={10} />
      <pointLight position={[-2, 1, -1]} color="#ffa6bc" intensity={1} distance={8} />
    </group>
  );
}
