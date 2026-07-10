import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { BIRTHDAY_NAME, BIRTHDAY_AGE, INTRO_SUBTITLE } from '../../config/content';

export default function IntroSection() {
  const sectionRef = useRef();
  const titleRef = useRef();
  const ageRef = useRef();
  const subtitleRef = useRef();
  const decorRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 60, scale: 0.85, filter: 'blur(12px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.5, ease: 'power3.out', delay: 0.3 }
      );
      gsap.fromTo(
        ageRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.7 }
      );
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.9 }
      );
      gsap.fromTo(
        decorRef.current.filter(Boolean),
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(2)', stagger: 0.15, delay: 0.5 }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const decorItems = [
    { icon: '🌸', x: '10%', y: '15%', size: 28 },
    { icon: '✨', x: '85%', y: '20%', size: 22 },
    { icon: '🦋', x: '15%', y: '70%', size: 24 },
    { icon: '⭐', x: '80%', y: '75%', size: 20 },
    { icon: '💫', x: '50%', y: '10%', size: 18 },
  ];

  return (
    <section ref={sectionRef} className="section intro-section" id="intro">
      {decorItems.map((item, i) => (
        <div
          key={i}
          ref={(el) => (decorRef.current[i] = el)}
          className="intro-decor"
          style={{ left: item.x, top: item.y, fontSize: item.size, animationDelay: `${i * 0.3}s` }}
        >
          {item.icon}
        </div>
      ))}

      <div className="intro-glow" />

      <h1 ref={titleRef} className="intro-title">
        Happy Birthday, {BIRTHDAY_NAME} ✨
      </h1>
      <p ref={ageRef} className="intro-age">
        yang ke-{BIRTHDAY_AGE} tahun 🎉
      </p>
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