import { Link } from 'react-router-dom';
import { useApp } from '../state/AppContext.jsx';
import { EVENTS } from '../data/events.js';
import EventCard from './EventCard.jsx';
import Carousel, { CarouselItem } from './Carousel.jsx';

/**
 * Related events: same category > same city > same venue. Excludes current event.
 */
export default function RelatedEvents({ event }) {
  const { t } = useApp();
  if (!event) return null;

  const score = (e) => {
    if (e.id === event.id) return -1;
    let s = 0;
    if (e.category === event.category) s += 3;
    if (e.city === event.city) s += 2;
    if (e.venue?.en === event.venue?.en) s += 4;
    return s;
  };
  const related = EVENTS
    .map((e) => ({ e, s: score(e) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 6)
    .map(({ e }) => e);

  if (related.length === 0) return null;

  return (
    <section className="section">
      <div className="section-head">
        <h2>✨ {t.relatedEvents}</h2>
        <Link className="see-all" to={`/browse/${event.category}`}>{t.seeAll} →</Link>
      </div>
      <Carousel autoPlay={false}>
        {related.map((e) => (
          <CarouselItem key={e.id} width={300}>
            <EventCard event={e} />
          </CarouselItem>
        ))}
      </Carousel>
    </section>
  );
}
