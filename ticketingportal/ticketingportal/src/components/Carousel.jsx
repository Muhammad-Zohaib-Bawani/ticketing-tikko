import { useEffect, useRef, useState } from 'react';
import './Carousel.css';

export default function Carousel({ children, autoPlay = true, interval = 5000 }) {
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0); // 0..1 of scrollable distance
  const [isHover, setHover] = useState(false);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('.carousel-item');
    const step = card ? card.getBoundingClientRect().width + 18 : el.clientWidth * 0.9;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  };

  useEffect(() => {
    if (!autoPlay) return undefined;
    const id = setInterval(() => {
      if (isHover) return;
      const el = trackRef.current;
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      const atEnd = el.scrollLeft >= max - 4;
      if (atEnd) el.scrollTo({ left: 0, behavior: 'smooth' });
      else scrollBy(1);
    }, interval);
    return () => clearInterval(id);
  }, [autoPlay, interval, isHover]);

  return (
    <div className="carousel" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <button type="button" className="carousel-nav prev" aria-label="Previous" onClick={() => scrollBy(-1)}>‹</button>
      <button type="button" className="carousel-nav next" aria-label="Next" onClick={() => scrollBy(1)}>›</button>
      <div className="carousel-track" ref={trackRef} onScroll={onScroll}>
        {children}
      </div>
      <div className="carousel-progress" aria-hidden="true">
        <span className="carousel-progress-fill" style={{ width: `${Math.max(8, progress * 100)}%` }} />
      </div>
    </div>
  );
}

export function CarouselItem({ children, width = 320 }) {
  return (
    <div className="carousel-item" style={{ flex: `0 0 ${width}px` }}>
      {children}
    </div>
  );
}
