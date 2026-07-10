import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CLOSING_TITLE, CLOSING_SUBTITLE, CLOSING_MESSAGE } from '../../config/content';

gsap.registerPlugin(ScrollTrigger);

export default function ClosingSection() {
  const sectionRef = useRef();
  const titleRef = useRef();
  const subtitleRef = useRef();
  const cardRef = useRef();
  const heartsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 40, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' } }
      );
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.3,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%', toggleActions: 'play none none reverse' } }
      );
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out', delay: 0.5,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 55%', toggleActions: 'play none none reverse' } }
      );
      gsap.fromTo(
        heartsRef.current.filter(Boolean),
        { opacity: 0, scale: 0 },
        { opacity: 0.5, scale: 1, duration: 0.8, ease: 'back.out(2)', stagger: 0.2, delay: 0.8,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 50%', toggleActions: 'play none none reverse' } }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section closing-section" id="closing">
      {/* Floating hearts */}
      {[
        { icon: '💕', x: '10%', y: '15%', size: 24 },
        { icon: '💖', x: '85%', y: '20%', size: 20 },
        { icon: '💗', x: '20%', y: '70%', size: 18 },
        { icon: '💝', x: '80%', y: '75%', size: 22 },
        { icon: '✨', x: '50%', y: '12%', size: 16 },
      ].map((item, i) => (
        <div
          key={i}
          ref={(el) => (heartsRef.current[i] = el)}
          className="closing-heart"
          style={{ left: item.x, top: item.y, fontSize: item.size, animationDelay: `${i * 0.6}s` }}
        >
          {item.icon}
        </div>
      ))}

      <div className="closing-glow" />
      <h2 ref={titleRef} className="closing-title">{CLOSING_TITLE}</h2>
      <p ref={subtitleRef} className="closing-subtitle">{CLOSING_SUBTITLE}</p>
      <div ref={cardRef} className="closing-card">
        <p className="closing-message">{CLOSING_MESSAGE}</p>
      </div>

      {/* Lanjutkan Cerita button */}
      <button
        className="closing-next-btn"
        onClick={() => window.open('/aurora-night.html', '_blank')}
      >
        Lanjutkan Cerita ✨
        <span className="closing-next-arrow">→</span>
      </button>

      <div className="closing-credit">Made with ❤️ for yeshi</div>
    </section>
  );
}