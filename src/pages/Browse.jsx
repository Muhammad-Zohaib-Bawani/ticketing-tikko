import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { CATEGORIES, EVENTS } from '../data/events.js';
import { useApp } from '../state/AppContext.jsx';
import EventCard from '../components/EventCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { EventGridSkeleton } from '../components/Skeleton.jsx';

export default function Browse() {
  const { category } = useParams();
  const [params] = useSearchParams();
  const { lang, t } = useApp();
  const nav = useNavigate();

  const initialQ = params.get('q') || '';
  const initialDate = params.get('date') || '';

  const [q, setQ] = useState(initialQ);
  const [date, setDate] = useState(initialDate);
  const [sort, setSort] = useState('trending');
  const [loading, setLoading] = useState(true);

  // Sync local q/date state when URL params change (e.g. submitting the hero SearchBar)
  useEffect(() => {
    setQ(params.get('q') || '');
    setDate(params.get('date') || '');
  }, [params]);

  // Brief loading window per filter change for nicer UX
  useEffect(() => {
    setLoading(true);
    const id = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(id);
  }, [category, q, date, sort]);

  const cat = category && category !== 'all' ? CATEGORIES.find((c) => c.id === category) : null;

  const items = useMemo(() => {
    let list = EVENTS;
    if (cat) list = list.filter((e) => e.category === category);
    if (q) {
      const needle = q.toLowerCase();
      list = list.filter((e) =>
        e.title.en.toLowerCase().includes(needle) ||
        e.title.ar.includes(q) ||
        e.venue.en.toLowerCase().includes(needle) ||
        e.city.toLowerCase().includes(needle) ||
        (e.tags?.en || []).some((tag) => tag.toLowerCase().includes(needle))
      );
    }
    if (date) {
      const target = new Date(date).toDateString();
      list = list.filter((e) => new Date(e.date).toDateString() === target);
    }
    if (sort === 'trending') list = [...list].sort((a, b) => b.viewing - a.viewing);
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.priceFrom - b.priceFrom);
    if (sort === 'date') list = [...list].sort((a, b) => new Date(a.date) - new Date(b.date));
    return list;
  }, [category, q, date, sort, cat]);

  const clearFilters = () => {
    setQ(''); setDate('');
    nav(`/browse/${category || 'all'}`, { replace: true });
  };
  const hasFilters = q || date || (cat && cat.id !== 'all');

  return (
    <div className="container fade-in">
      <SearchBar initialQ={initialQ} initialCategory={category || 'all'} initialDate={initialDate} />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'end', justifyContent: 'space-between', margin: '20px 0' }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-mute)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {lang === 'en' ? 'Browse' : 'تصفح'}
          </div>
          <h1 style={{ marginTop: 6 }}>
            {cat ? `${cat.icon}  ${cat[lang]}` : (lang === 'en' ? 'All events' : 'كل الأحداث')}
          </h1>
          <p style={{ marginTop: 6 }}>
            {loading ? t.loadingEvents : `${items.length} ${lang === 'en' ? 'events' : 'حدث'}`}
            {hasFilters && !loading && (
              <button className="btn btn-ghost btn-sm" style={{ marginInlineStart: 10 }} onClick={clearFilters}>
                ✕ {lang === 'en' ? 'Clear filters' : 'مسح الفلاتر'}
              </button>
            )}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <select className="input" value={sort} onChange={(e) => setSort(e.target.value)} style={{ width: 180 }}>
            <option value="trending">🔥 {lang === 'en' ? 'Trending' : 'رائج'}</option>
            <option value="price-asc">↑ {lang === 'en' ? 'Price low → high' : 'السعر تصاعدي'}</option>
            <option value="date">📅 {lang === 'en' ? 'Date' : 'التاريخ'}</option>
          </select>
        </div>
      </div>

      {loading ? (
        <EventGridSkeleton count={Math.max(4, Math.min(8, items.length || 4))} />
      ) : items.length === 0 ? (
        <div className="card" style={{ padding: 36, textAlign: 'center' }}>
          <p>{lang === 'en' ? 'No matches. Try a different search.' : 'لا توجد نتائج. جرب بحثًا آخر.'}</p>
          {hasFilters && <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={clearFilters}>{lang === 'en' ? 'Clear filters' : 'مسح الفلاتر'}</button>}
        </div>
      ) : (
        <div className="event-grid">
          {items.map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      )}
    </div>
  );
}
