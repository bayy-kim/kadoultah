import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import ParticleField from './three/ParticleField';
import FloatingFrames from './three/FloatingFrames';
import CakeScene from './three/CakeScene';
import StarField from './three/StarField';
import CameraController from './three/CameraController';

export default function Canvas3D({ scrollProgress = 0, isBlown = false }) {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 10, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <CameraController scrollProgress={scrollProgress} />

          {/* Section 0 (Intro): Particles at y=10 */}
          <ParticleField count={600} position={[0, 10, 0]} />

          {/* Section 1 (Journey): Floating Frames at y=0 */}
          <FloatingFrames position={[0, 0, 0]} />

          {/* Section 2 (Cake): Abstract Cake at y=-10 */}
          <CakeScene position={[0, -10, 0]} isBlown={isBlown} />

          {/* Section 3 (Letter): Starry Sky at y=-20 */}
          <StarField count={1000} position={[0, -20, 0]} />

          {/* Section 4 (Gallery): Starry Sky at y=-30 */}
          <StarField count={800} position={[0, -30, 0]} />

          {/* Section 5 (Closing): Starry Sky + extra glow at y=-40 */}
          <StarField count={1200} position={[0, -40, 0]} />
        </Suspense>
      </Canvas>
    </div>
  );
}