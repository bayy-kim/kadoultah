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
        
        // Staggered entrance animation
        gsap.fromTo(
          card,
          { opacity: 0, scale: 0.92, y: 80 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Smooth parallax scroll lag
        gsap.to(card, {
          y: i % 2 === 0 ? -40 : 40,
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section journey-section" id="journey">
      {/* Timeline decorative line */}
      <div className="journey-timeline" />

      {JOURNEY_TEXTS.map((item, i) => (
        <div
          key={i}
          ref={(el) => (cardsRef.current[i] = el)}
          className="journey-card"
        >
          {/* Timeline dot */}
          <div className="journey-card-dot" />
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