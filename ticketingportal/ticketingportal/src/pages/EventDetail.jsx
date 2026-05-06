import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { getEvent } from '../data/events.js';
import { useApp } from '../state/AppContext.jsx';
import BookingModal from '../components/BookingModal.jsx';
import EventGallery from '../components/EventGallery.jsx';
import RelatedEvents from '../components/RelatedEvents.jsx';
import Countdown from '../components/Countdown.jsx';

const ADDON_ICONS = { hotel: '🏨', dining: '🍽️', parking: '🅿️' };

export default function EventDetail() {
  const { id } = useParams();
  const event = getEvent(id);
  const { t, lang, formatPrice, user } = useApp();
  const nav = useNavigate();
  const loc = useLocation();
  const [open, setOpen] = useState(false);

  if (!event) return <div className="container"><p>Not found.</p></div>;

  const isRegistration = !!event.flags?.registration;
  const date = new Date(event.date);
  const dateLabel = date.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeLabel = date.toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' });

  const salesOpenAt = event.salesOpenAt ? new Date(event.salesOpenAt) : null;
  const presale = salesOpenAt && salesOpenAt > new Date();

  const available = (event.capacity != null && event.sold != null)
    ? Math.max(0, event.capacity - event.sold)
    : null;
  const soldOut = available === 0;
  const soldPct = (event.capacity && available != null)
    ? Math.round((event.sold / event.capacity) * 100)
    : null;

  const ctaLabel = soldOut
    ? t.soldOutLabel
    : presale
      ? t.notifyMe
      : isRegistration ? t.registerNow : t.bookNow;

  const onBook = () => {
    if (presale || soldOut) return;
    if (!user) {
      nav(`/signin?next=${encodeURIComponent(loc.pathname)}`);
      return;
    }
    setOpen(true);
  };

  const galleryImages = (event.images && event.images.length ? event.images : [event.image]);

  return (
    <div className="container fade-in">
      {/* Gallery hero */}
      <EventGallery
        images={galleryImages}
        alt={event.title[lang]}
        overlay={
          <div style={{ color: '#fff' }}>
            <h1 className="detail-h1" style={{ fontSize: 30 }}>{event.title[lang]}</h1>
            <p className="detail-sub">{event.subtitle[lang]}</p>
          </div>
        }
      />

      <div className="detail-meta-row">
        <span className="item">📅 {dateLabel}</span>
        <span className="item">🕘 {timeLabel}</span>
        <span className="item">📍 {event.venue[lang]} · {event.city}</span>
        <span className="item">👀 {event.viewing.toLocaleString()} {t.viewing}</span>
        {available != null && (
          <span className="item" style={{ color: soldOut ? 'var(--danger)' : 'var(--text-dim)' }}>
            🎟️ {soldOut ? t.soldOutLabel : `${available.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')} ${t.ticketsLeft}`}
          </span>
        )}
      </div>

      {/* Pre-sale countdown banner */}
      {presale && (
        <div className="card glass-card" style={{ padding: 22, marginTop: 24, display: 'grid', gridTemplateColumns: '1fr auto', gap: 18, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              ⏱ {t.salesNotOpen}
            </div>
            <h3 style={{ fontSize: 18, marginTop: 4 }}>
              {t.salesOpenIn}{' '}
              <span style={{ color: 'var(--primary)' }}>
                {salesOpenAt.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </h3>
            <p style={{ marginTop: 6, fontSize: 13.5 }}>
              {event.flags?.verifiedFan
                ? (lang === 'en' ? 'Verified Fan presale registration is open — selected fans receive access codes by SMS.' : 'تسجيل Verified Fan متاح — يستلم المعجبون رموز الدخول عبر الرسائل.')
                : (lang === 'en' ? 'We will notify you when sales open.' : 'سنبلغك عند بدء البيع.')}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>
                {t.from}{' '}
                <b style={{ color: 'var(--text)', fontSize: 16, fontVariantNumeric: 'tabular-nums' }}>
                  {event.priceFrom === 0 ? t.free : formatPrice(event.priceFrom)}
                </b>
              </span>
              <button className="btn btn-primary btn-sm" disabled>
                🔔 {t.notifyMe}
              </button>
            </div>
          </div>
          <Countdown to={event.salesOpenAt} />
        </div>
      )}

      <div className="detail-grid" style={{ marginTop: 28, ...(presale ? { gridTemplateColumns: '1fr' } : null) }}>
        <div>
          {/* About */}
          <div className="card" style={{ padding: 22, marginBottom: 18 }}>
            <h2 style={{ fontSize: 18, marginBottom: 10 }}>{t.aboutEvent}</h2>
            <p style={{ lineHeight: 1.65 }}>{event.description[lang]}</p>
            <div style={{ marginTop: 14 }}>
              {(event.tags?.[lang] || []).map((tag) => <span key={tag} className="tag">#{tag}</span>)}
            </div>
          </div>

          {/* Venue & details */}
          <div className="card" style={{ padding: 22, marginBottom: 18 }}>
            <h2 style={{ fontSize: 18, marginBottom: 12 }}>{t.venueDetails}</h2>
            <div className="info-grid">
              <InfoCell icon="📅" label={lang === 'en' ? 'Date' : 'التاريخ'} value={dateLabel} />
              <InfoCell icon="🕘" label={lang === 'en' ? 'Doors' : 'الدخول'} value={timeLabel} />
              <InfoCell icon="📍" label={lang === 'en' ? 'Venue' : 'المكان'} value={`${event.venue[lang]} · ${event.city}`} />
              {event.flags?.ageRestricted && (
                <InfoCell icon="🔞" label={lang === 'en' ? 'Age' : 'الفئة العمرية'} value={event.flags.ageRestricted} />
              )}
              {event.flags?.accessible && (
                <InfoCell icon="♿" label={lang === 'en' ? 'Accessibility' : 'إمكانية الوصول'} value={t.accessible} />
              )}
              {event.multiDay && (
                <InfoCell icon="📅" label={lang === 'en' ? 'Days' : 'الأيام'} value={`${event.days.length} · ${t.multiDay}`} />
              )}
              <InfoCell icon={isRegistration ? '📝' : '🎟️'} label={t.eventStatus} value={isRegistration ? t.statusRegistration : t.statusTicketed} />
              {available != null && (
                <InfoCell
                  icon="🎟️"
                  label={lang === 'en' ? 'Availability' : 'التوفر'}
                  value={
                    <>
                      <div>
                        <b>{available.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')}</b>
                        <span style={{ color: 'var(--text-mute)' }}> / {event.capacity.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')} {t.available}</span>
                      </div>
                      <div className="avail-bar"><div className="avail-bar-fill" style={{ width: `${soldPct}%` }} /></div>
                      <div style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 4 }}>{soldPct}% {t.soldPercent}</div>
                    </>
                  }
                />
              )}
            </div>
          </div>

        </div>

        {/* Right: sticky CTA card — hidden during pre-sale (banner above covers it) */}
        {!presale && (
        <div className="side-card">
          <div className="glass-card" style={{ padding: 22 }}>
            <div style={{ fontSize: 11, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
              {t.from}
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
              {event.priceFrom === 0 ? t.free : formatPrice(event.priceFrom)}
            </div>

            {/* Availability inline */}
            {available != null && !presale && (
              <div style={{ marginTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                    {soldOut
                      ? <b style={{ color: 'var(--danger)' }}>{t.soldOutLabel}</b>
                      : <><b style={{ color: 'var(--text)' }}>{available.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')}</b> {t.ticketsLeft}</>}
                  </span>
                  {soldPct != null && <span style={{ fontSize: 11, color: 'var(--text-mute)' }}>{soldPct}% {t.soldPercent}</span>}
                </div>
                <div className="avail-bar"><div className="avail-bar-fill" style={{ width: `${soldPct}%` }} /></div>
              </div>
            )}

            {presale && (
              <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.28)', borderRadius: 'var(--radius)' }}>
                <div style={{ fontSize: 11, color: 'var(--warn)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  ⏱ {t.salesOpenIn}
                </div>
                <div style={{ marginTop: 8 }}><Countdown to={event.salesOpenAt} /></div>
              </div>
            )}

            <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={onBook} disabled={soldOut || presale}>
              {ctaLabel} {soldOut || presale ? '' : '→'}
            </button>

            {!user && !presale && !soldOut && (
              <p style={{ fontSize: 11.5, color: 'var(--text-mute)', textAlign: 'center', marginTop: 10 }}>
                🔒 <Link to={`/signin?next=${encodeURIComponent(loc.pathname)}`} style={{ color: 'var(--text-dim)', textDecoration: 'underline' }}>{t.signIn}</Link> {lang === 'en' ? 'to continue' : 'للمتابعة'}
              </p>
            )}

            <div className="divider" />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5, color: 'var(--text-dim)' }}>
              <li>🔒 {t.secureCheckout}</li>
              {event.flags?.rotating && <li>↻ {t.rotatingBarcode}</li>}
              {event.flags?.queue && <li>⏳ {t.queue}</li>}
              {event.flags?.verifiedFan && <li>★ {t.verified}</li>}
              <li>♻️ {t.transfer}</li>
            </ul>
          </div>
        </div>
        )}
      </div>

      {/* Related events */}
      <RelatedEvents event={event} />

      <BookingModal event={event} open={open} onClose={() => setOpen(false)} />

      <style>{`
        .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        @media (max-width: 600px) { .info-grid { grid-template-columns: 1fr; } }
        .info-cell {
          display: flex; gap: 10px; align-items: flex-start;
          padding: 10px 12px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: var(--radius);
        }
        .info-cell-icon { width: 28px; height: 28px; display: grid; place-items: center; background: var(--surface-3); border-radius: 8px; font-size: 14px; flex: 0 0 auto; }
        .info-cell-lbl { font-size: 11px; color: var(--text-mute); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 700; }
        .info-cell-val { font-size: 13.5px; color: var(--text); margin-top: 2px; }
      `}</style>
    </div>
  );
}

function InfoCell({ icon, label, value }) {
  return (
    <div className="info-cell">
      <span className="info-cell-icon">{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="info-cell-lbl">{label}</div>
        <div className="info-cell-val">{value}</div>
      </div>
    </div>
  );
}
