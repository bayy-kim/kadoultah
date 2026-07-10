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
  const cakeVisualRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cake-overlay-card',
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animate blow event
  useEffect(() => {
    if (!isBlown) return;

    // Extinguish all candle flames via CSS class
    document.querySelectorAll('.candle-flame').forEach((el) => {
      el.style.animation = 'none';
      el.style.opacity = '0';
      el.style.transform = 'scale(0)';
    });

    // Shrink and fade the HTML preview cake visual gently
    if (cakeVisualRef.current) {
      gsap.to(cakeVisualRef.current, {
        scale: 0.8,
        opacity: 0.3,
        duration: 0.8,
        ease: 'power2.out',
      });
    }

    // Hide blow button
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        opacity: 0,
        scale: 0.5,
        duration: 0.4,
        ease: 'power2.in',
      });
    }

    // Trigger HTML confetti blast
    createConfetti();

    // Elastic reveal of wish text
    if (wishRef.current) {
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

  const createConfetti = () => {
    if (!explosionRef.current) return;
    const container = explosionRef.current;
    container.innerHTML = '';

    const colors = ['#a855f7', '#ec4899', '#f59e0b', '#06b6d4', '#10b981', '#f43f5e', '#ff7597', '#ffd700'];

    for (let i = 0; i < 65; i++) {
      const particle = document.createElement('div');
      particle.className = 'explosion-particle';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      const size = 6 + Math.random() * 8;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      container.appendChild(particle);

      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 320;
      const duration = 0.8 + Math.random() * 1.4;

      gsap.fromTo(
        particle,
        { x: 0, y: 0, scale: 1, opacity: 1, rotation: 0 },
        {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 100,
          scale: 0,
          opacity: 0,
          rotation: Math.random() * 540,
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
      <div className="cake-overlay-card">
        <h2 ref={titleRef} className="cake-title">
          Buat Harapanmu 🕯️
        </h2>
        <p ref={subtitleRef} className="cake-subtitle">
          Pejamkan mata, buat harapan, lalu tiup lilinnya...
        </p>

        {/* CSS Cake Preview — click to blow! */}
        <div ref={cakeVisualRef} className="cake-preview-container" onClick={handleBlow} role="button" tabIndex={0}>
          <div className="cake-visual">
            <div className="cake-plate" />
            <div className="cake-tier bottom">
              <div className="cake-frosting" />
              <div className="cake-sprinkles" />
            </div>
            <div className="cake-tier middle">
              <div className="cake-frosting" />
              <div className="cake-rose" style={{ left: '20%', top: '30%' }} />
              <div className="cake-rose" style={{ right: '20%', top: '30%' }} />
            </div>
            <div className="cake-tier top">
              <div className="cake-frosting" />
              <div className="cake-heart-topper">💗</div>
            </div>
            <div className="cake-ring bottom-ring" />
            <div className="cake-ring top-ring" />
            {/* 5 Candles */}
            {[
              { angle: -Math.PI / 2, cx: '50%', cy: 'calc(50% - 75px)' },
              { angle: -Math.PI / 2 + 0.8, cx: 'calc(50% + 20px)', cy: 'calc(50% - 68px)' },
              { angle: -Math.PI / 2 - 0.8, cx: 'calc(50% - 20px)', cy: 'calc(50% - 68px)' },
              { angle: -Math.PI / 2 + 1.6, cx: 'calc(50% + 35px)', cy: 'calc(50% - 55px)' },
              { angle: -Math.PI / 2 - 1.6, cx: 'calc(50% - 35px)', cy: 'calc(50% - 55px)' },
            ].map((pos, i) => (
              <div key={i} className="cake-candle" style={{ left: pos.cx, top: pos.cy }}>
                <div className="candle-body" />
                {!isBlown && <div className="candle-flame" style={{ animationDelay: `${i * 0.12}s` }} />}
              </div>
            ))}
          </div>
        </div>

        {!isBlown && (
          <button ref={buttonRef} className="blow-button" onClick={handleBlow}>
            🎂 Klik untuk Tiup Lilin
          </button>
        )}

        <div ref={wishRef} className="wish-text" style={{ opacity: 0 }}>
          {WISH_TEXT}
        </div>
      </div>

      <div ref={explosionRef} className="explosion-container" />
    </section>
  );
}