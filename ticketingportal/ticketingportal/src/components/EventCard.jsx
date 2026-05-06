import { Link } from 'react-router-dom';
import { useApp } from '../state/AppContext.jsx';
import Countdown from './Countdown.jsx';

export default function EventCard({ event }) {
  const { t, lang, formatPrice } = useApp();
  const cat = event.category;
  const date = new Date(event.date);
  const dateLabel = date.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const timeLabel = date.toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  const f = event.flags || {};
  const hasParking = (event.addons || []).some((a) => a.kind === 'parking');
  const isRegistration = !!f.registration;
  const isFuture = date > new Date();
  const salesOpenAt = event.salesOpenAt ? new Date(event.salesOpenAt) : null;
  const presale = salesOpenAt && salesOpenAt > new Date();

  // Available count (capacity - sold)
  const available = (event.capacity != null && event.sold != null)
    ? Math.max(0, event.capacity - event.sold)
    : null;
  let availLabel = null;
  if (available != null) {
    if (available === 0) availLabel = { text: t.soldOutLabel, kind: 'danger' };
    else if (available < 50) availLabel = { text: `${available.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')} ${t.ticketsLeft}`, kind: 'danger' };
    else if (available / event.capacity < 0.15) availLabel = { text: t.fewLeftLabel, kind: 'warn' };
  }

  return (
    <Link to={`/event/${event.id}`} className="event-card">
      <div className="event-card-img" style={{ backgroundImage: `url(${event.image})` }}>
        <div className="event-card-flags">
          {isRegistration ? (
            <span className="badge badge-primary">📝 {t.statusRegistration}</span>
          ) : (
            <span className="badge badge-warn">🎟️ {t.statusTicketed}</span>
          )}
          {presale ? (
            <span className="badge badge-warn">⏱ {t.salesOpenIn}</span>
          ) : (
            isFuture && <span className="badge badge-success">● {t.statusOpen}</span>
          )}
          {f.multiDay && <span className="badge">📅 {t.multiDay}</span>}
          {availLabel && <span className={`badge badge-${availLabel.kind}`}>{availLabel.text}</span>}
        </div>
      </div>
      <div className="event-card-body">
        <div className="event-card-cat">{cat}</div>
        <div className="event-card-title">{event.title[lang]}</div>
        <div className="event-card-meta">
          <span>📅 {dateLabel} · {timeLabel}</span>
          <span>📍 {event.venue[lang]} · {event.city}</span>
          {presale && (
            <span style={{ color: 'var(--warn)' }}>
              <Countdown to={event.salesOpenAt} compact />
            </span>
          )}
          {hasParking && <span style={{ color: 'var(--text-mute)' }}>🅿️ {t.parkingIncluded}</span>}
        </div>
        <div className="event-card-foot">
          <span className="event-card-price">
            {event.priceFrom === 0 ? <b>{t.free}</b> : <>{t.from} <b>{formatPrice(event.priceFrom)}</b></>}
          </span>
        </div>
      </div>
    </Link>
  );
}
