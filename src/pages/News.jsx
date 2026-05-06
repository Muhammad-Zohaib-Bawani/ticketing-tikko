import { Link } from 'react-router-dom';
import { useApp } from '../state/AppContext.jsx';
import { EVENTS, getEvent } from '../data/events.js';
import { NEWS, VENUES, KIND_META } from '../data/news.js';
import EventCard from '../components/EventCard.jsx';
import Carousel, { CarouselItem } from '../components/Carousel.jsx';

const fmtDate = (iso, lang) =>
  new Date(iso).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });
const fmtTime = (iso, lang) =>
  new Date(iso).toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US', {
    hour: '2-digit', minute: '2-digit',
  });
const fmtDay = (iso, lang) => ({
  d: new Date(iso).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { day: 'numeric' }),
  m: new Date(iso).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { month: 'short' }).toUpperCase(),
});

export default function News() {
  const { t, lang } = useApp();
  const upcoming = [...EVENTS]
    .filter((e) => new Date(e.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const news = [...NEWS].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  return (
    <div className="container fade-in">
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t.nav.news}</div>
        <h1 style={{ marginTop: 6, fontSize: 32 }}>{t.newsTitle}</h1>
        <p style={{ marginTop: 6, maxWidth: 720 }}>{t.newsSub}</p>
      </div>

      {/* Two-column: activity feed + upcoming timeline */}
      <div className="news-grid">
        {/* Activity feed */}
        <div>
          <div className="section-head">
            <h2 style={{ fontSize: 20 }}>📰 {t.activityFeed}</h2>
          </div>
          <div className="col" style={{ gap: 12 }}>
            {news.map((n) => {
              const event = getEvent(n.eventId);
              const meta = KIND_META[n.kind];
              return (
                <article key={n.id} className="card news-card">
                  <Link to={`/event/${n.eventId}`} className="news-cover" style={{ backgroundImage: `url(${event.image})` }}>
                    <span className="news-kind" style={{ background: meta.color }}>{meta.icon} {meta[lang]}</span>
                  </Link>
                  <div className="news-body">
                    <div className="news-meta">
                      {fmtDate(n.publishedAt, lang)} · {fmtTime(n.publishedAt, lang)} · <span style={{ color: 'var(--text-dim)' }}>{event.venue[lang]}</span>
                    </div>
                    <h3 className="news-title">{n.title[lang]}</h3>
                    <p className="news-excerpt">{n.excerpt[lang]}</p>
                    <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                      <Link to={`/event/${n.eventId}`} className="btn btn-sm">{t.readMore} →</Link>
                      <div style={{ fontSize: 12, color: 'var(--text-mute)' }}>📅 {fmtDate(event.date, lang)}</div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Upcoming timeline */}
        <aside>
          <div className="section-head">
            <h2 style={{ fontSize: 20 }}>📅 {t.upcomingFeed}</h2>
          </div>
          <ol className="timeline">
            {upcoming.map((e) => {
              const day = fmtDay(e.date, lang);
              return (
                <li key={e.id} className="timeline-item">
                  <div className="timeline-day">
                    <span className="timeline-day-d">{day.d}</span>
                    <span className="timeline-day-m">{day.m}</span>
                  </div>
                  <Link to={`/event/${e.id}`} className="timeline-card">
                    <div style={{ fontSize: 11, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {e.category} · {e.city}
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14, marginTop: 2 }}>{e.title[lang]}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>
                      📍 {e.venue[lang]} · 🕘 {fmtTime(e.date, lang)}
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                      {e.flags?.verifiedFan && <span className="badge badge-primary">★ {t.verified}</span>}
                      {e.flags?.queue && <span className="badge badge-warn">⏳ {t.queue}</span>}
                      {e.flags?.rotating && <span className="badge badge-success">↻</span>}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </aside>
      </div>

      {/* Popular places */}
      <section className="section">
        <div className="section-head">
          <div>
            <h2>🏟️ {t.popularPlaces}</h2>
            <p style={{ marginTop: 4, fontSize: 13 }}>{t.popularPlacesSub}</p>
          </div>
        </div>
        <Carousel autoPlay={false}>
          {VENUES.map((v) => {
            const event = getEvent(v.eventId);
            return (
              <CarouselItem key={v.id} width={300}>
                <Link
                  to={event ? `/event/${event.id}` : '/'}
                  className="venue-card"
                >
                  <div
                    className="venue-cover"
                    style={{
                      background: `linear-gradient(135deg, ${v.color[0]}, ${v.color[1]})`,
                    }}
                  >
                    <div className="venue-cap">
                      <div className="venue-cap-num">{v.upcoming}</div>
                      <div className="venue-cap-lbl">{t.eventsCount}</div>
                    </div>
                  </div>
                  <div className="venue-body">
                    <div style={{ fontSize: 12, color: 'var(--text-mute)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{v.city}</div>
                    <h3 style={{ fontSize: 16, marginTop: 4 }}>{v.name[lang]}</h3>
                    <p style={{ fontSize: 12.5, marginTop: 4 }}>{v.note[lang]}</p>
                    <div className="divider" style={{ margin: '10px 0' }} />
                    <div className="row between" style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                      <span>{t.capacity}: {v.capacity.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')}</span>
                      {event && <span>{t.nextEvent} →</span>}
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            );
          })}
        </Carousel>
      </section>

      {/* See more events grid */}
      <section className="section">
        <div className="section-head">
          <h2>{t.seeAll}</h2>
          <Link to="/trending" className="see-all">🔥 {t.trendingTitle} →</Link>
        </div>
        <div className="event-grid">
          {upcoming.slice(0, 4).map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      </section>

      <style>{`
        .news-grid { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 28px; align-items: start; }
        @media (max-width: 1000px) { .news-grid { grid-template-columns: 1fr; } }

        .news-card { display: grid; grid-template-columns: 220px 1fr; gap: 0; padding: 0; overflow: hidden; transition: border-color 0.15s; }
        .news-card:hover { border-color: var(--border-strong); }
        @media (max-width: 600px) { .news-card { grid-template-columns: 1fr; } }
        .news-cover { aspect-ratio: 4/3; background-size: cover; background-position: center; position: relative; }
        .news-kind {
          position: absolute; top: 12px; inset-inline-start: 12px;
          padding: 4px 10px; border-radius: 999px; color: #fff;
          font-size: 11px; font-weight: 700; letter-spacing: 0.04em;
        }
        .news-body { padding: 16px 18px; display: flex; flex-direction: column; gap: 6px; }
        .news-meta { font-size: 11.5px; color: var(--text-mute); text-transform: uppercase; letter-spacing: 0.04em; }
        .news-title { font-size: 16px; line-height: 1.35; color: var(--text); }
        .news-excerpt { font-size: 13.5px; line-height: 1.55; }

        .timeline { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
        .timeline-item { display: grid; grid-template-columns: 56px 1fr; gap: 12px; align-items: stretch; }
        .timeline-day {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 10px 6px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
        }
        .timeline-day-d { font-size: 22px; font-weight: 800; line-height: 1; color: var(--text); font-variant-numeric: tabular-nums; }
        .timeline-day-m { font-size: 10px; color: var(--text-mute); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 4px; font-weight: 700; }
        .timeline-card {
          padding: 12px 14px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          transition: border-color 0.15s, transform 0.15s;
        }
        .timeline-card:hover { border-color: var(--primary); transform: translateY(-1px); }

        .venue-card {
          display: flex; flex-direction: column;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: all 0.2s;
          width: 100%;
          height: 100%;
        }
        .venue-card:hover { border-color: var(--border-strong); transform: translateY(-3px); box-shadow: var(--shadow); }
        .venue-cover {
          aspect-ratio: 16/10;
          position: relative;
          background-image: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18), transparent 50%);
        }
        .venue-cap {
          position: absolute; bottom: 12px; inset-inline-end: 12px;
          background: rgba(0,0,0,0.5); backdrop-filter: blur(8px);
          padding: 8px 12px; border-radius: 10px; text-align: center;
          color: #fff;
        }
        .venue-cap-num { font-size: 22px; font-weight: 800; line-height: 1; font-variant-numeric: tabular-nums; }
        .venue-cap-lbl { font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 3px; opacity: 0.85; }
        .venue-body { padding: 14px 16px; }
      `}</style>
    </div>
  );
}
