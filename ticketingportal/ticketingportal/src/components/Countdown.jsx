import { useEffect, useState } from 'react';
import { useApp } from '../state/AppContext.jsx';

function diffParts(ms) {
  ms = Math.max(0, ms);
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return { days, hours, mins, secs };
}

export default function Countdown({ to, label, compact = false }) {
  const { t, lang } = useApp();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const target = new Date(to).getTime();
  const ms = target - now;
  if (ms <= 0) return null;
  const { days, hours, mins, secs } = diffParts(ms);

  const cell = (n, l) => (
    <div className="cd-cell">
      <span className="cd-num">{String(n).padStart(2, '0')}</span>
      <span className="cd-lbl">{l}</span>
    </div>
  );

  if (compact) {
    return (
      <span className="cd-compact">
        ⏱{' '}
        {days > 0 ? `${days}${lang === 'ar' ? 'ي' : 'd'} ` : ''}
        {String(hours).padStart(2, '0')}:{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </span>
    );
  }

  return (
    <div className="cd">
      {label && <div className="cd-label">{label}</div>}
      <div className="cd-row">
        {cell(days, t.countdownDays)}
        <span className="cd-sep">:</span>
        {cell(hours, t.countdownHrs)}
        <span className="cd-sep">:</span>
        {cell(mins, t.countdownMin)}
        <span className="cd-sep">:</span>
        {cell(secs, t.countdownSec)}
      </div>
    </div>
  );
}
