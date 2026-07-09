import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { PHOTO_FRAMES } from '../../config/content';

import { useState, useEffect } from 'react';

function PhotoFrame({ position, rotation, color, image, index }) {
  const meshRef = useRef();
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    if (image) {
      const loader = new THREE.TextureLoader();
      loader.load(
        image,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          setTexture(tex);
        },
        undefined,
        (err) => {
          console.warn(`Failed to load photo texture: ${image}. Using color fallback instead.`, err);
        }
      );
    }
  }, [image]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    // Gentle individual float
    meshRef.current.position.y = position[1] + Math.sin(t * 0.5 + index * 1.5) * 0.15;
    meshRef.current.rotation.z = rotation[2] + Math.sin(t * 0.3 + index * 2) * 0.03;
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation}>
      {/* Frame border */}
      <RoundedBox args={[1.6, 1.2, 0.05]} radius={0.05} smoothness={4}>
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.9}
          roughness={0.1}
        />
      </RoundedBox>
      {/* Photo area */}
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[1.4, 1.0]} />
        {texture ? (
          <meshStandardMaterial
            map={texture}
            roughness={0.4}
          />
        ) : (
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.15}
            metalness={0.1}
            roughness={0.8}
          />
        )}
      </mesh>
      {/* Subtle glow behind frame */}
      <pointLight
        position={[0, 0, -0.5]}
        color={color}
        intensity={0.3}
        distance={3}
      />
    </group>
  );
}

export default function FloatingFrames({ visible = true }) {
  const groupRef = useRef();

  // Predefined positions for frames in 3D space
  const frameConfigs = useMemo(() => {
    return PHOTO_FRAMES.map((frame, i) => {
      const angle = (i / PHOTO_FRAMES.length) * Math.PI * 2;
      const radius = 2.5 + (i % 2) * 0.8;
      return {
        position: [
          Math.cos(angle) * radius,
          (i - 2) * 0.5,
          Math.sin(angle) * radius - 2,
        ],
        rotation: [
          0,
          -angle + Math.PI,
          (Math.random() - 0.5) * 0.2,
        ],
        color: frame.color,
        image: frame.image,
      };
    });
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current || !visible) return;
    groupRef.current.rotation.y += delta * 0.03;
  });

  if (!visible) return null;

  return (
    <group ref={groupRef}>
      {frameConfigs.map((config, i) => (
        <Float
          key={i}
          speed={1.5}
          rotationIntensity={0.2}
          floatIntensity={0.3}
        >
          <PhotoFrame {...config} index={i} />
        </Float>
      ))}
      {/* Ambient particles between frames */}
      <ambientLight intensity={0.3} />
    </group>
  );
}
