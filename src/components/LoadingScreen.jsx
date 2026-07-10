import { useEffect, useState, useRef } from 'react';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0); // 0=loading, 1=done text
  const audioCtxRef = useRef(null);

  useEffect(() => {
    // Love meter goes from 0 to 100
    const startTime = Date.now();
    const duration = 2500; // 2.5 seconds

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 100) {
        requestAnimationFrame(tick);
      } else {
        setPhase(1);
        setTimeout(onComplete, 1200);
      }
    };

    requestAnimationFrame(tick);
  }, [onComplete]);

  // Heart size based on progress
  const heartScale = 0.6 + (progress / 100) * 0.6;
  const heartColor = `hsl(${340 - (progress / 100) * 40}, 100%, ${65 - (progress / 100) * 10}%)`;

  return (
    <div className="loading-screen">
      <div className="loading-bg">
        <div className="loading-glow" />
      </div>

      <div className="loading-content">
        {/* Animated Heart */}
        <div className="loading-heart-wrap" style={{ transform: `scale(${heartScale})` }}>
          <svg className="loading-heart" viewBox="0 0 100 100" width="100" height="100">
            <defs>
              <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff7597" />
                <stop offset="100%" stopColor="#ff4070" />
              </linearGradient>
            </defs>
            <path
              d="M50 88 C20 60, 5 40, 5 25 C5 10, 20 5, 30 10 C40 15, 45 25, 50 35 C55 25, 60 15, 70 10 C80 5, 95 10, 95 25 C95 40, 80 60, 50 88Z"
              fill={heartColor}
              stroke="#ff4070"
              strokeWidth="1"
            >
              <animate
                attributeName="d"
                values="
                  M50 88 C20 60, 5 40, 5 25 C5 10, 20 5, 30 10 C40 15, 45 25, 50 35 C55 25, 60 15, 70 10 C80 5, 95 10, 95 25 C95 40, 80 60, 50 88Z;
                  M50 85 C22 58, 8 38, 8 24 C8 12, 22 7, 32 12 C42 17, 47 27, 50 37 C53 27, 58 17, 68 12 C78 7, 92 12, 92 24 C92 38, 78 58, 50 85Z;
                  M50 88 C20 60, 5 40, 5 25 C5 10, 20 5, 30 10 C40 15, 45 25, 50 35 C55 25, 60 15, 70 10 C80 5, 95 10, 95 25 C95 40, 80 60, 50 88Z
                "
                dur="1s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>

        {/* Progress bar */}
        <div className="loading-bar-wrap">
          <div className="loading-bar">
            <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Text */}
        {phase === 0 ? (
          <>
            <p className="loading-text">suka aku ke kamu</p>
            <p className="loading-pct">{progress}%</p>
          </>
        ) : (
          <div className="loading-done">
            <p className="loading-done-text">100% ❤️</p>
            <p className="loading-done-sub">sepenuh hati</p>
          </div>
        )}
      </div>
    </div>
  );
}