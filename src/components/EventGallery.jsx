import { useState, useEffect } from 'react';
import { useApp } from '../state/AppContext.jsx';

/**
 * Event image gallery — primary on the left + 2 thumbs on the right.
 * `images` may include the primary image as the first entry.
 */
export default function EventGallery({ images, alt = '', overlay = null }) {
  const { t } = useApp();
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  // Lock body scroll when lightbox is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!images || images.length === 0) return null;
  const main = images[active];
  const side1 = images[(active + 1) % images.length];
  const side2 = images[(active + 2) % images.length];

  return (
    <>
      <div className="gallery" role="group" aria-label={alt}>
        <div
          className="gallery-main"
          style={{ backgroundImage: `url(${main})` }}
          onClick={() => setOpen(true)}
          aria-label="Open gallery"
        >
          {overlay && <div className="gallery-overlay">{overlay}</div>}
          <div className="gallery-count">📷 {images.length} · {t.gallery}</div>
        </div>
        <div
          className="gallery-side"
          style={{ backgroundImage: `url(${side1})` }}
          onClick={() => setActive((active + 1) % images.length)}
          aria-label="Next image"
        />
        <div
          className="gallery-side"
          style={{ backgroundImage: `url(${side2})` }}
          onClick={() => setActive((active + 2) % images.length)}
          aria-label="Skip image"
        />
      </div>

      {open && (
        <div
          className="bm-overlay"
          onClick={() => setOpen(false)}
          style={{ zIndex: 220 }}
        >
          <div className="glass-card" style={{ width: 'min(96vw, 1100px)', height: 'min(86vh, 700px)', overflow: 'hidden', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ width: '100%', height: '100%', backgroundImage: `url(${main})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <button
              className="bm-close"
              style={{ position: 'absolute', top: 16, insetInlineEnd: 16 }}
              onClick={() => setOpen(false)}
              aria-label="Close"
            >✕</button>
            <div style={{ position: 'absolute', bottom: 16, insetInline: 16, display: 'flex', gap: 8, justifyContent: 'center' }}>
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={i === active ? 'active' : ''}
                  style={{
                    width: 60, height: 38,
                    borderRadius: 6,
                    backgroundImage: `url(${img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: i === active ? '2px solid #fff' : '2px solid rgba(255,255,255,0.30)',
                    cursor: 'pointer',
                  }}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
