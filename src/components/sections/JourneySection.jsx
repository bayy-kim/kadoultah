import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { JOURNEY_TEXTS } from '../../config/content';

gsap.registerPlugin(ScrollTrigger);

export default function JourneySection() {
  const sectionRef = useRef();
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              end: 'top 50%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section journey-section" id="journey">
      {JOURNEY_TEXTS.map((item, i) => (
        <div
          key={i}
          ref={(el) => (cardsRef.current[i] = el)}
          className="journey-card"
        >
          <div className="journey-card-index">
            {String(i + 1).padStart(2, '0')} / {String(JOURNEY_TEXTS.length).padStart(2, '0')}
          </div>
          <h2 className="journey-card-title">{item.title}</h2>
          <p className="journey-card-desc">{item.description}</p>
        </div>
      ))}
    </section>
  );
}
