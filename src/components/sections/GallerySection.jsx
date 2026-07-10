import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GALLERY_PHOTOS } from '../../config/content';
import { X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function GallerySection() {
  const [selected, setSelected] = useState(null);
  const sectionRef = useRef();
  const headerRef = useRef();
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current, { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' } });
      gsap.fromTo(cardsRef.current.filter(Boolean),
        { opacity: 0, y: 60, scale: 0.9, rotateX: 5 },
        { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 0.8, ease: 'back.out(1.7)', stagger: 0.12,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', toggleActions: 'play none none reverse' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selected]);

  return (
    <section ref={sectionRef} className="section gallery-section" id="gallery">
      <h2 ref={headerRef} className="gallery-header">Galeri Kenangan 📸</h2>
      <div className="gallery-grid">
        {GALLERY_PHOTOS.map((item, i) => (
          <div
            key={i}
            ref={(el) => (cardsRef.current[i] = el)}
            className="gallery-card"
            style={{ '--card-color': item.color }}
            onClick={() => setSelected(item)}
          >
            <div className="gallery-card-bg" style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}88)` }} />
            <span className="gallery-card-emoji">{item.emoji}</span>
            <span className="gallery-card-label">{item.label}</span>
            <span className="gallery-card-desc">{item.desc}</span>
          </div>
        ))}
      </div>

      {/* Modal — CSS-only animation (no framer-motion) */}
      {selected && (
        <div className="gallery-modal" onClick={() => setSelected(null)}>
          <div className="gallery-modal-card" onClick={(e) => e.stopPropagation()} style={{ '--modal-color': selected.color }}>
            <button className="gallery-modal-close" onClick={() => setSelected(null)}>
              <X size={20} />
            </button>
            <div className="gallery-modal-visual" style={{ background: `linear-gradient(135deg, ${selected.color}, ${selected.color}66)` }}>
              <span className="gallery-modal-emoji">{selected.emoji}</span>
            </div>
            <div className="gallery-modal-body">
              <h3 className="gallery-modal-title">{selected.label}</h3>
              <p className="gallery-modal-desc">{selected.desc}</p>
              <div className="gallery-modal-footer">
                <span className="gallery-modal-heart">💕</span>
                <span className="gallery-modal-note">Untuk kenangan yang tak terlupakan</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}