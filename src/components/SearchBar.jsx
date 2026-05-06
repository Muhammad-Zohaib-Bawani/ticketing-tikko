import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../data/events.js';
import { useApp } from '../state/AppContext.jsx';
import './SearchBar.css';

export default function SearchBar({ initialQ = '', initialCategory = 'all', initialDate = '' }) {
  const { t, lang } = useApp();
  const nav = useNavigate();
  const [q, setQ] = useState(initialQ);
  const [category, setCategory] = useState(initialCategory);
  const [date, setDate] = useState(initialDate);

  const submit = (e) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (date) params.set('date', date);
    const slug = category && category !== 'all' ? category : 'all';
    nav(`/browse/${slug}${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <form className="sb glass" onSubmit={submit} role="search">
      <div className="sb-field sb-text">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input
          className="sb-input"
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.searchPlaceholder}
          aria-label={t.searchPlaceholder}
        />
      </div>

      <span className="sb-divider" />

      <div className="sb-field">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1.5"/>
          <rect x="14" y="3" width="7" height="7" rx="1.5"/>
          <rect x="3" y="14" width="7" height="7" rx="1.5"/>
          <rect x="14" y="14" width="7" height="7" rx="1.5"/>
        </svg>
        <select className="sb-input" value={category} onChange={(e) => setCategory(e.target.value)} aria-label={t.allCategories}>
          <option value="all">{t.allCategories}</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.icon}  {c[lang]}</option>
          ))}
        </select>
      </div>

      <span className="sb-divider" />

      <div className="sb-field">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="17" rx="2.5"/>
          <path d="M16 2v4M8 2v4M3 10h18"/>
        </svg>
        <input
          className="sb-input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-label={t.anyDate}
          placeholder={t.anyDate}
        />
      </div>

      <button type="submit" className="btn btn-primary sb-go">
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
          </svg>
          {t.searchCta}
        </span>
      </button>
    </form>
  );
}
