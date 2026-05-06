import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext.jsx';

export default function SignIn() {
  const { t, lang, signIn } = useApp();
  const nav = useNavigate();
  const loc = useLocation();
  const next = new URLSearchParams(loc.search).get('next') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);

  const submit = (e) => {
    e.preventDefault();
    signIn({ email });
    nav(next, { replace: true });
  };

  return (
    <div className="container fade-in" style={{ display: 'grid', placeItems: 'center', padding: '40px 0' }}>
      <div className="auth-card">
        <Link to="/" className="auth-brand">
          <span className="hdr-logo" style={{ width: 36, height: 36 }}>T</span>
          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>{t.brand}</span>
        </Link>

        <h1 style={{ fontSize: 26, marginTop: 18 }}>{t.signInTitle}</h1>
        <p style={{ marginTop: 6, fontSize: 14 }}>{t.signInSub}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 22 }}>
          <button type="button" className="btn" onClick={() => { signIn({ email: 'demo@apple.com', name: 'Apple User' }); nav(next, { replace: true }); }}> Apple</button>
          <button type="button" className="btn" onClick={() => { signIn({ email: 'demo@gmail.com', name: 'Google User' }); nav(next, { replace: true }); }}>G Google</button>
          <button type="button" className="btn" onClick={() => { signIn({ email: 'demo@fb.com', name: 'FB User' }); nav(next, { replace: true }); }}>f Facebook</button>
        </div>

        <div className="auth-or">
          <span /><span style={{ fontSize: 12, color: 'var(--text-mute)' }}>{t.or}</span><span />
        </div>

        <form onSubmit={submit}>
          <div className="field">
            <label>{t.email}</label>
            <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="field">
            <label>{t.password}</label>
            <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <div className="row between" style={{ fontSize: 13 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <span style={{ color: 'var(--text-dim)' }}>{t.rememberMe}</span>
            </label>
            <a href="#" style={{ color: 'var(--text-dim)' }}>{t.forgot}</a>
          </div>
          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 18 }}>{t.signIn} →</button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--text-dim)' }}>
          {t.noAccount}{' '}
          <Link to={`/signup${next !== '/' ? `?next=${encodeURIComponent(next)}` : ''}`} style={{ color: 'var(--text)', fontWeight: 600 }}>
            {lang === 'en' ? 'Sign up' : 'سجّل'}
          </Link>
        </div>
      </div>

      <style>{`
        .auth-card {
          width: 100%;
          max-width: 440px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: 32px;
          box-shadow: var(--shadow);
        }
        .auth-brand { display: inline-flex; align-items: center; gap: 10px; }
        .auth-or {
          display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 10px;
          margin: 18px 0;
        }
        .auth-or span:first-child, .auth-or span:last-child { height: 1px; background: var(--border); display: block; }
      `}</style>
    </div>
  );
}
