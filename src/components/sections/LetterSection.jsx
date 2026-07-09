import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, Pause, Music } from 'lucide-react';
import { LETTER_TEXT, AUDIO_SRC, AUDIO_TITLE } from '../../config/content';

gsap.registerPlugin(ScrollTrigger);

export default function LetterSection() {
  const sectionRef = useRef();
  const headerRef = useRef();
  const cardRef = useRef();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [eqBars, setEqBars] = useState([4, 8, 6, 10, 5]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Equalizer animation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setEqBars([
        3 + Math.random() * 13,
        3 + Math.random() * 13,
        3 + Math.random() * 13,
        3 + Math.random() * 13,
        3 + Math.random() * 13,
      ]);
    }, 200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Audio progress tracking
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const toggleAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        // Audio play might be blocked by browser autoplay policy
        console.log('Audio autoplay blocked. User interaction required.');
      });
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  return (
    <>
      <section ref={sectionRef} className="section letter-section" id="letter">
        <h2 ref={headerRef} className="letter-header">
          Surat Untukmu 💌
        </h2>

        <div ref={cardRef} className="letter-card">
          <p className="letter-content">{LETTER_TEXT}</p>
        </div>
      </section>

      {/* ✏️ Audio element — taruh file musik di public/music/ */}
      <audio ref={audioRef} src={AUDIO_SRC} preload="auto" loop />

      {/* Floating audio player */}
      <div className="audio-player" onClick={toggleAudio}>
        <button className="audio-btn" aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <div className="audio-info">
          <span className="audio-title">
            <Music size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
            {AUDIO_TITLE}
          </span>
          <div className="audio-progress-bar">
            <div className="audio-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
        {isPlaying && (
          <div className="audio-eq">
            {eqBars.map((h, i) => (
              <div
                key={i}
                className="audio-eq-bar"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
