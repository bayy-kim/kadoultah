import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import ParticleField from './three/ParticleField';
import FloatingFrames from './three/FloatingFrames';
import CakeScene from './three/CakeScene';
import StarField from './three/StarField';
import CameraController from './three/CameraController';

export default function Canvas3D({ activeSection = 0, isBlown = false }) {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <CameraController activeSection={activeSection} />

          {/* Section 1 (Intro): Particles */}
          <ParticleField count={600} visible={activeSection === 0} />

          {/* Section 2 (Journey): Floating Frames */}
          <FloatingFrames visible={activeSection === 1} />

          {/* Section 3 (Cake): Abstract Cake */}
          <CakeScene visible={activeSection === 2} isBlown={isBlown} />

          {/* Section 4 (Letter): Starry Sky */}
          <StarField count={1000} visible={activeSection === 3} />
        </Suspense>
      </Canvas>
    </div>
  );
}
