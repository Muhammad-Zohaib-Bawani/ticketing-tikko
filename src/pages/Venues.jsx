import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../state/AppContext.jsx';
import { VENUES } from '../data/news.js';
import { getEvent } from '../data/events.js';

export default function Venues() {
  const { t, lang } = useApp();
  const [city, setCity] = useState('all');
  const [sort, setSort] = useState('events');

  const cities = useMemo(() => Array.from(new Set(VENUES.map((v) => v.city))).sort(), []);

  const list = useMemo(() => {
    let arr = VENUES;
    if (city !== 'all') arr = arr.filter((v) => v.city === city);
    if (sort === 'events') arr = [...arr].sort((a, b) => b.upcoming - a.upcoming);
    if (sort === 'capacity') arr = [...arr].sort((a, b) => b.capacity - a.capacity);
    if (sort === 'city') arr = [...arr].sort((a, b) => a.city.localeCompare(b.city));
    return arr;
  }, [city, sort]);

  return (
    <div className="container fade-in">
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 12, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t.nav.venues}</div>
        <h1 style={{ marginTop: 6, fontSize: 32 }}>🏟️ {t.venuesTitle}</h1>
        <p style={{ marginTop: 6, maxWidth: 740 }}>{t.venuesSub}</p>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        <select className="input" value={city} onChange={(e) => setCity(e.target.value)} style={{ width: 200 }}>
          <option value="all">{t.allCities}</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="input" value={sort} onChange={(e) => setSort(e.target.value)} style={{ width: 200 }}>
          <option value="events">{t.sortByEvents}</option>
          <option value="capacity">{t.sortByCapacity}</option>
          <option value="city">{t.sortByCity}</option>
        </select>
        <span style={{ marginInlineStart: 'auto', alignSelf: 'center', fontSize: 13, color: 'var(--text-mute)' }}>
          {list.length} {lang === 'en' ? 'venues' : 'مكان'}
        </span>
      </div>

      <div className="venue-list">
        {list.map((v) => {
          const event = v.eventId ? getEvent(v.eventId) : null;
          return (
            <article key={v.id} className="venue-row">
              <div className="venue-row-cover" style={{ background: `linear-gradient(135deg, ${v.color[0]}, ${v.color[1]})` }}>
                <span className="venue-row-cap">
                  <b>{v.upcoming}</b>
                  <span>{t.eventsCount}</span>
                </span>
              </div>
              <div className="venue-row-body">
                <div style={{ fontSize: 11, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{v.city}</div>
                <h2 style={{ fontSize: 18, marginTop: 4 }}>{v.name[lang]}</h2>
                <p style={{ fontSize: 13, marginTop: 4 }}>{v.note[lang]}</p>
                <div className="venue-row-meta">
                  <span>👥 {t.capacity}: <b>{v.capacity.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')}</b></span>
                  <span>📅 {v.upcoming} {lang === 'en' ? 'upcoming' : 'قادم'}</span>
                </div>
              </div>
              <div className="venue-row-cta">
                {event ? (
                  <Link to={`/event/${event.id}`} className="btn btn-primary btn-sm">
                    {t.nextEvent} →
                  </Link>
                ) : (
                  <Link to="/news" className="btn btn-sm">{lang === 'en' ? 'See activity' : 'النشاطات'}</Link>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <style>{`
        .venue-list { display: flex; flex-direction: column; gap: 12px; }
        .venue-row {
          display: grid;
          grid-template-columns: 180px 1fr auto;
          gap: 0;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          align-items: stretch;
          transition: border-color 0.15s, transform 0.15s;
        }
        .venue-row:hover { border-color: var(--border-strong); transform: translateY(-1px); }
        .venue-row-cover {
          position: relative;
          min-height: 110px;
          background-image: radial-gradient(circle at 25% 30%, rgba(255,255,255,0.18), transparent 55%);
        }
        .venue-row-cap {
          position: absolute; bottom: 12px; inset-inline-start: 12px;
          background: rgba(0,0,0,0.55); backdrop-filter: blur(6px);
          padding: 6px 10px; border-radius: 8px;
          color: #fff;
          font-size: 11px;
          display: inline-flex; align-items: baseline; gap: 6px;
        }
        .venue-row-cap b { font-size: 18px; font-weight: 800; font-variant-numeric: tabular-nums; }
        .venue-row-body { padding: 16px 18px; min-width: 0; }
        .venue-row-meta {
          display: flex; gap: 18px; flex-wrap: wrap;
          margin-top: 12px; font-size: 12.5px; color: var(--text-dim);
        }
        .venue-row-meta b { color: var(--text); font-weight: 700; }
        .venue-row-cta {
          display: grid; place-items: center;
          padding: 16px 18px;
          border-inline-start: 1px solid var(--border);
          background: var(--surface);
        }
        @media (max-width: 720px) {
          .venue-row { grid-template-columns: 1fr; }
          .venue-row-cover { min-height: 130px; }
          .venue-row-cta { border-inline-start: none; border-top: 1px solid var(--border); justify-self: stretch; }
        }
      `}</style>
    </div>
  );
}
