import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WISH_TEXT } from '../../config/content';

gsap.registerPlugin(ScrollTrigger);

export default function CakeSection({ onBlow, isBlown }) {
  const sectionRef = useRef();
  const titleRef = useRef();
  const subtitleRef = useRef();
  const buttonRef = useRef();
  const wishRef = useRef();
  const explosionRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      );
      tl.fromTo(
        buttonRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' },
        '-=0.2'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animate wish text appearance after blow
  useEffect(() => {
    if (isBlown && wishRef.current) {
      // Create HTML particle explosion
      createExplosion();

      gsap.to(buttonRef.current, {
        opacity: 0,
        scale: 0.5,
        duration: 0.4,
        ease: 'power2.in',
      });

      gsap.fromTo(
        wishRef.current,
        { opacity: 0, scale: 0.5, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: 'elastic.out(1, 0.5)',
          delay: 0.5,
        }
      );
    }
  }, [isBlown]);

  const createExplosion = () => {
    if (!explosionRef.current) return;
    const container = explosionRef.current;
    container.innerHTML = '';

    const colors = ['#a855f7', '#ec4899', '#f59e0b', '#06b6d4', '#10b981', '#f43f5e'];

    for (let i = 0; i < 40; i++) {
      const particle = document.createElement('div');
      particle.className = 'explosion-particle';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.width = (4 + Math.random() * 8) + 'px';
      particle.style.height = particle.style.width;
      container.appendChild(particle);

      const angle = (Math.random() * Math.PI * 2);
      const distance = 100 + Math.random() * 300;
      const duration = 0.8 + Math.random() * 1.2;

      gsap.fromTo(
        particle,
        { x: 0, y: 0, scale: 1, opacity: 1 },
        {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 100,
          scale: 0,
          opacity: 0,
          duration: duration,
          ease: 'power2.out',
          onComplete: () => particle.remove(),
        }
      );
    }
  };

  const handleBlow = () => {
    if (!isBlown && onBlow) {
      onBlow();
    }
  };

  return (
    <section ref={sectionRef} className="section cake-section" id="cake">
      <h2 ref={titleRef} className="cake-title">
        Buat Harapanmu 🕯️
      </h2>
      <p ref={subtitleRef} className="cake-subtitle">
        Pejamkan mata, buat harapan, lalu tiup lilinnya...
      </p>

      {!isBlown && (
        <button ref={buttonRef} className="blow-button" onClick={handleBlow}>
          🎂 Klik untuk Tiup Lilin
        </button>
      )}

      <div ref={wishRef} className="wish-text" style={{ opacity: 0 }}>
        {WISH_TEXT}
      </div>

      <div ref={explosionRef} className="explosion-container" />
    </section>
  );
}
