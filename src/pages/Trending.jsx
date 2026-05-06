import { Link } from 'react-router-dom';
import { useApp } from '../state/AppContext.jsx';
import { EVENTS } from '../data/events.js';
import EventCard from '../components/EventCard.jsx';
import Carousel, { CarouselItem } from '../components/Carousel.jsx';

export default function Trending() {
  const { t, lang } = useApp();
  const trending = [...EVENTS]
    .filter((e) => new Date(e.date) > new Date())
    .sort((a, b) => b.viewing - a.viewing);
  const top = trending.slice(0, 6);
  const rest = trending.slice(6);

  return (
    <div className="container fade-in">
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 12, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t.nav.trending}</div>
        <h1 style={{ marginTop: 6, fontSize: 32 }}>🔥 {t.trendingTitle}</h1>
        <p style={{ marginTop: 6, maxWidth: 720 }}>{t.trendingSub}</p>
      </div>

      <section className="section" style={{ marginTop: 16 }}>
        <Carousel autoPlay interval={4500}>
          {top.map((e) => (
            <CarouselItem key={e.id} width={320}>
              <EventCard event={e} />
            </CarouselItem>
          ))}
        </Carousel>
      </section>

      {rest.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2 style={{ fontSize: 18 }}>{lang === 'en' ? 'More trending' : 'المزيد من الرائج'}</h2>
            <Link to="/browse/concerts" className="see-all">{t.seeAll} →</Link>
          </div>
          <div className="event-grid">
            {rest.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        </section>
      )}
    </div>
  );
}
