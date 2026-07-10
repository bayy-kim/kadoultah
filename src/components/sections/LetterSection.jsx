import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LETTER_TEXT } from '../../config/content';

gsap.registerPlugin(ScrollTrigger);

export default function LetterSection() {
  const sectionRef = useRef();
  const headerRef = useRef();
  const cardRef = useRef();
  const floatingRef = useRef([]);

  const paragraphs = useMemo(() => LETTER_TEXT.split(/\r?\n\r?\n/).filter(Boolean), []);
  const signature = useMemo(() => paragraphs[paragraphs.length - 1] || '', [paragraphs]);
  const contentParas = useMemo(() => paragraphs.slice(0, -1), [paragraphs]);
  const midIndex = useMemo(() => Math.floor(contentParas.length / 2), [contentParas]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' } });
      gsap.fromTo(cardRef.current, { opacity: 0, y: 40, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: cardRef.current, start: 'top 80%', toggleActions: 'play none none reverse' } });
      gsap.fromTo(floatingRef.current.filter(Boolean), { opacity: 0, scale: 0, y: 20 }, { opacity: 0.6, scale: 1, y: 0, duration: 1, ease: 'back.out(2)', stagger: 0.2,
        scrollTrigger: { trigger: cardRef.current, start: 'top 70%', toggleActions: 'play none none reverse' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section letter-section" id="letter">
      <h2 ref={headerRef} className="letter-header">Surat Untukmu 💌</h2>
      <div ref={cardRef} className="letter-card">
        <div className="letter-flourish top-left" />
        <div className="letter-flourish top-right" />
        <div className="letter-flourish bottom-left" />
        <div className="letter-flourish bottom-right" />
        <div className="letter-content">
          {contentParas.map((para, i) => (
            <span key={i}>
              {i === 0 ? (
                <p className="letter-para-first">
                  <span className="letter-dropcap">{para.charAt(0)}</span>
                  {para.slice(1)}
                </p>
              ) : (
                <p className="letter-para">{para}</p>
              )}
              {i === midIndex - 1 && <hr className="letter-divider" />}
            </span>
          ))}
        </div>
        <div className="letter-signature">
          <div className="letter-signature-line" />
          <p className="letter-signature-text">{signature}</p>
        </div>
      </div>
      {[
        { icon: '💕', x: '5%', y: '20%' },
        { icon: '✨', x: '90%', y: '30%' },
        { icon: '🌹', x: '8%', y: '60%' },
        { icon: '💫', x: '88%', y: '50%' },
        { icon: '🌸', x: '3%', y: '80%' },
      ].map((item, i) => (
        <div key={i} ref={(el) => (floatingRef.current[i] = el)} className="letter-float-icon"
          style={{ left: item.x, top: item.y, animationDelay: `${i * 0.8}s` }}>{item.icon}</div>
      ))}
    </section>
  );
}