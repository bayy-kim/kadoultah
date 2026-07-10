import { useState, useRef, useEffect } from 'react';
import { BIRTHDAY_NAME } from '../config/content';

export default function PasswordGate({ onSuccess }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value === '25082023') {
      setError('');
      onSuccess();
    } else {
      setShake(true);
      setError('yahh aku kira masih ingat 😔');
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="password-gate">
      <div className="password-bg">
        <div className="password-glow" />
        <div className="password-hearts">
          {['💕', '💖', '💗', '💝', '✨', '🌸'].map((h, i) => (
            <span key={i} className="pw-heart" style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${i * 0.8}s`,
              fontSize: `${16 + Math.random() * 16}px`,
            }}>{h}</span>
          ))}
        </div>
      </div>

      <div className={`password-card ${shake ? 'pw-shake' : ''}`}>
        <div className="pw-lock">🔐</div>
        <h1 className="pw-title">
          Untuk <span className="pw-name">{BIRTHDAY_NAME}</span>
        </h1>
        <p className="pw-subtitle">Masukkan tanggal spesial kita</p>

        <form onSubmit={handleSubmit} className="pw-form">
          <input
            ref={inputRef}
            type="password"
            className="pw-input"
            placeholder="●●●●●●●●"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(''); }}
            maxLength={8}
            autoComplete="off"
          />
          <button type="submit" className="pw-button">
            Buka 💕
          </button>
        </form>

        {error && <p className="pw-error">{error}</p>}
      </div>
    </div>
  );
}