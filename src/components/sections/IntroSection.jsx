import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { BIRTHDAY_NAME, INTRO_SUBTITLE } from '../../config/content';

export default function IntroSection() {
  const sectionRef = useRef();
  const titleRef = useRef();
  const subtitleRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 60, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: 'power3.out', delay: 0.3 }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section intro-section" id="intro">
      <h1 ref={titleRef} className="intro-title">
        Happy Birthday, {BIRTHDAY_NAME} ✨
      </h1>
      <p ref={subtitleRef} className="intro-subtitle">
        {INTRO_SUBTITLE}
      </p>
      <div className="scroll-indicator">
        <span>Scroll Down</span>
        <div className="scroll-indicator-line" />
      </div>
    </section>
  );
}
