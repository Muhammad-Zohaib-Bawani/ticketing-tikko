import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../state/AppContext.jsx';
import { CATEGORIES, EVENTS } from '../data/events.js';
import EventCard from '../components/EventCard.jsx';
import Carousel, { CarouselItem } from '../components/Carousel.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { EventGridSkeleton } from '../components/Skeleton.jsx';

export default function Discover() {
  const { t, lang, city } = useApp();
  const [loading, setLoading] = useState(true);

  // Simulate a brief loading window so skeletons are visible.
  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(id);
  }, []);

  const weekend = EVENTS.slice(0, 4);
  const trending = [...EVENTS]
    .filter((e) => new Date(e.date) > new Date())
    .sort((a, b) => b.viewing - a.viewing);
  const forYou = EVENTS.filter((e) => ['concerts', 'experiences', 'festivals'].includes(e.category)).slice(0, 4);

  return (
    <div className="container fade-in">
      {/* Hero with search */}
      <section className="hero">
        <span className="hero-eyebrow">★ {city} · {lang === 'en' ? 'May 2026' : 'مايو 2026'}</span>
        <h1 className="hero-title">{t.siteHero}</h1>
        <p className="hero-sub">{t.siteHeroSub}</p>
        <SearchBar />
      </section>

      {/* Categories */}
      <section className="section">
        <div className="section-head">
          <h2>{lang === 'en' ? 'Browse categories' : 'تصفح الفئات'}</h2>
        </div>
        <div className="cat-rail">
          {CATEGORIES.map((c) => (
            <Link key={c.id} to={`/browse/${c.id}`} className="cat-tile">
              <span className="cat-tile-icon">{c.icon}</span>
              <span>{c[lang]}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending — carousel */}
      <section className="section">
        <div className="section-head">
          <div>
            <h2>🔥 {t.trendingTitle}</h2>
            <p style={{ marginTop: 4, fontSize: 13 }}>{t.trendingSub}</p>
          </div>
          <Link className="see-all" to="/trending">{t.seeAll} →</Link>
        </div>
        {loading ? (
          <EventGridSkeleton count={4} />
        ) : (
          <Carousel autoPlay interval={5500}>
            {trending.map((e) => (
              <CarouselItem key={e.id} width={300}>
                <EventCard event={e} />
              </CarouselItem>
            ))}
          </Carousel>
        )}
      </section>

      {/* For You */}
      <section className="section">
        <div className="section-head">
          <h2>✨ {t.forYou}</h2>
        </div>
        {loading ? (
          <EventGridSkeleton count={4} />
        ) : (
          <div className="event-grid">
            {forYou.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        )}
      </section>

      {/* This weekend */}
      <section className="section">
        <div className="section-head">
          <h2>🗓️ {t.weekend}</h2>
          <Link className="see-all" to="/browse/festivals">{t.seeAll} →</Link>
        </div>
        {loading ? (
          <EventGridSkeleton count={4} />
        ) : (
          <div className="event-grid">
            {weekend.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        )}
      </section>
    </div>
  );
}
