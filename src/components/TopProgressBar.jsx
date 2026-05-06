import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function TopProgressBar() {
  const loc = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    setProgress(15);
    const t1 = setTimeout(() => setProgress(60), 100);
    const t2 = setTimeout(() => setProgress(95), 280);
    const t3 = setTimeout(() => { setProgress(100); }, 480);
    const t4 = setTimeout(() => { setVisible(false); setProgress(0); }, 700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [loc.pathname, loc.search]);

  return (
    <div
      className="top-progress"
      aria-hidden="true"
      style={{
        width: `${progress}%`,
        opacity: visible ? 1 : 0,
        pointerEvents: 'none',
      }}
    />
  );
}
