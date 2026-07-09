import { useState, useEffect } from 'react';
import Canvas3D from './components/Canvas3D';
import HTMLOverlay from './components/HTMLOverlay';
import { THEME_HUE } from './config/content';
import './styles/index.css';

export default function App() {
  const [activeSection, setActiveSection] = useState(0);
  const [isBlown, setIsBlown] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Set the global custom property for theme color
  useEffect(() => {
    document.documentElement.style.setProperty('--hue', String(THEME_HUE));
  }, []);

  // Track global scroll progress
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

  const handleSectionChange = (sectionIndex) => {
    setActiveSection(sectionIndex);
  };

  const handleBlow = () => {
    setIsBlown(true);
  };

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

      {/* 3D Canvas Background */}
      <Canvas3D activeSection={activeSection} isBlown={isBlown} />

      {/* HTML Content Scroll Foreground */}
      <HTMLOverlay
        onSectionChange={handleSectionChange}
        onBlow={handleBlow}
        isBlown={isBlown}
      />
    </main>
  );
}
