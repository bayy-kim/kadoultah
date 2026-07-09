import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import IntroSection from './sections/IntroSection';
import JourneySection from './sections/JourneySection';
import CakeSection from './sections/CakeSection';
import LetterSection from './sections/LetterSection';

gsap.registerPlugin(ScrollTrigger);

export default function HTMLOverlay({ onSectionChange, onBlow, isBlown }) {
  const containerRef = useRef();

  useEffect(() => {
    const sections = containerRef.current.querySelectorAll('.section');
    const scrollTriggers = [];

    sections.forEach((section, index) => {
      // Map scroll progress of each section to trigger the section update
      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => {
          if (self.isActive) {
            onSectionChange(index);
          }
        },
      });
      scrollTriggers.push(st);
    });

    return () => {
      scrollTriggers.forEach((st) => st.kill());
    };
  }, [onSectionChange]);

  return (
    <div ref={containerRef} className="html-overlay">
      <IntroSection />
      <JourneySection />
      <CakeSection onBlow={onBlow} isBlown={isBlown} />
      <LetterSection />
    </div>
  );
}
