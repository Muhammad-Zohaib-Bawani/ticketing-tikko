import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext.jsx';
import './Header.css';

export default function Header() {
  const { t, lang, setLang, city, setCity, cities, user, signOut, theme, toggleTheme } = useApp();
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <header className="hdr">
      <div className="container hdr-row">
        <Link to="/" className="hdr-brand">
          <span className="hdr-logo">T</span>
          <span className="hdr-brand-name">{t.brand}</span>
        </Link>

        <nav className="hdr-nav">
          <NavLink to="/" end>{t.nav.discover}</NavLink>
          <NavLink to="/trending">🔥 {t.nav.trending}</NavLink>
          <NavLink to="/news">{t.nav.news}</NavLink>
          <NavLink to="/venues">{t.nav.venues}</NavLink>
        </nav>

        <div className="hdr-actions">
          <div className="hdr-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input className="hdr-search-input" placeholder={t.search} />
          </div>

          <div className="hdr-select" title={t.city}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a8 8 0 0 0-8 8c0 5.5 8 12 8 12s8-6.5 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="2.5"/></svg>
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              {cities.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <button
            className="btn btn-ghost btn-sm hdr-theme-btn"
            onClick={toggleTheme}
            aria-label={t.toggleTheme}
            title={theme === 'dark' ? t.lightMode : t.darkMode}
          >
            {theme === 'dark' ? (
              // Sun (means: switch to light)
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2"/><path d="M12 20v2"/>
                <path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/>
                <path d="M2 12h2"/><path d="M20 12h2"/>
                <path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
              </svg>
            ) : (
              // Moon (means: switch to dark)
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          <button className="btn btn-ghost btn-sm" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} aria-label="Toggle language">
            {lang === 'en' ? 'العربية' : 'English'}
          </button>

          <button className="btn btn-ghost btn-sm" onClick={() => nav('/tickets')} aria-label="My tickets">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"/><path d="M9 7v10"/></svg>
            {t.nav.tickets}
          </button>

          {user ? (
            <div className="hdr-user" ref={menuRef}>
              <button className="hdr-avatar" onClick={() => setMenuOpen((v) => !v)} aria-haspopup="menu" aria-expanded={menuOpen}>
                {user.initials}
              </button>
              {menuOpen && (
                <div className="hdr-menu" role="menu">
                  <div className="hdr-menu-h">
                    <div style={{ fontSize: 11, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t.signedInAs}</div>
                    <div style={{ fontWeight: 700, marginTop: 2 }}>{user.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{user.email}</div>
                  </div>
                  <button className="hdr-menu-item" onClick={() => { setMenuOpen(false); nav('/tickets'); }}>🎟️ {t.nav.tickets}</button>
                  <button className="hdr-menu-item" onClick={() => { setMenuOpen(false); nav('/organizer'); }}>📊 {t.nav.organizer}</button>
                  <div style={{ borderTop: '1px solid var(--border)' }} />
                  <button className="hdr-menu-item danger" onClick={() => { signOut(); setMenuOpen(false); nav('/'); }}>↩ {t.signOut}</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => nav('/signup')}>{lang === 'en' ? 'Sign up' : 'سجّل'}</button>
              <button className="btn btn-primary btn-sm" onClick={() => nav('/signin')}>{t.signIn}</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
