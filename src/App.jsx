import { useState, useEffect } from 'react';
import Canvas3D from './components/Canvas3D';
import HTMLOverlay from './components/HTMLOverlay';
import PasswordGate from './components/PasswordGate';
import LoadingScreen from './components/LoadingScreen';
import FloatingMusicPlayer from './components/FloatingMusicPlayer';
import { THEME_HUE } from './config/content';
import './styles/index.css';

export default function App() {
  const [phase, setPhase] = useState('gate'); // gate → loading → web
  const [activeSection, setActiveSection] = useState(0);
  const [isBlown, setIsBlown] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    document.documentElement.style.setProperty('--hue', String(THEME_HUE));
  }, []);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePasswordSuccess = () => setPhase('loading');
  const handleLoadingComplete = () => setPhase('web');
  const handleSectionChange = (sectionIndex) => setActiveSection(sectionIndex);
  const handleBlow = () => setIsBlown(true);

  if (phase === 'gate') return <PasswordGate onSuccess={handlePasswordSuccess} />;
  if (phase === 'loading') return <LoadingScreen onComplete={handleLoadingComplete} />;

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Scroll Progress Bar */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '4px',
          background: 'linear-gradient(to right, var(--accent), var(--accent-secondary))',
          width: `${scrollProgress}%`,
          zIndex: 9999,
          transition: 'width 0.1s ease-out'
        }}
      />

      <Canvas3D scrollProgress={scrollProgress} isBlown={isBlown} />

      <HTMLOverlay
        onSectionChange={handleSectionChange}
        onBlow={handleBlow}
        isBlown={isBlown}
      />

      {/* Floating Music Player */}
      <FloatingMusicPlayer autoPlay />
    </main>
  );
}