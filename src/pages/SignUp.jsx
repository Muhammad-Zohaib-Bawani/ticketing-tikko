import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext.jsx';

export default function SignUp() {
  const { t, lang, signUp } = useApp();
  const nav = useNavigate();
  const loc = useLocation();
  const next = new URLSearchParams(loc.search).get('next') || '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const submit = (e) => {
    e.preventDefault();
    signUp({ email, name });
    nav(next, { replace: true });
  };

  return (
    <div className="container fade-in" style={{ display: 'grid', placeItems: 'center', padding: '40px 0' }}>
      <div className="auth-card">
        <Link to="/" className="auth-brand">
          <span className="hdr-logo" style={{ width: 36, height: 36 }}>T</span>
          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>{t.brand}</span>
        </Link>

        <h1 style={{ fontSize: 26, marginTop: 18 }}>{t.signUpTitle}</h1>
        <p style={{ marginTop: 6, fontSize: 14 }}>{t.signUpSub}</p>

        <form onSubmit={submit} style={{ marginTop: 18 }}>
          <div className="field">
            <label>{t.fullName}</label>
            <input className="input" required value={name} onChange={(e) => setName(e.target.value)} placeholder={lang === 'en' ? 'Mohammed Al-Saud' : 'محمد آل سعود'} />
          </div>
          <div className="field">
            <label>{t.email}</label>
            <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="field">
            <label>{t.phone}</label>
            <input className="input" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+966 5x xxx xxxx" />
          </div>
          <div className="field">
            <label>{t.password}</label>
            <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 12 }}>
            {lang === 'en' ? 'Create account' : 'إنشاء حساب'} →
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--text-dim)' }}>
          {t.haveAccount}{' '}
          <Link to={`/signin${next !== '/' ? `?next=${encodeURIComponent(next)}` : ''}`} style={{ color: 'var(--text)', fontWeight: 600 }}>
            {t.signIn}
          </Link>
        </div>

        <p style={{ fontSize: 11, color: 'var(--text-mute)', textAlign: 'center', marginTop: 14, lineHeight: 1.5 }}>
          {lang === 'en'
            ? 'By creating an account you agree to Tikko\'s Terms of Service and Privacy Policy. PDPL and GDPR compliant.'
            : 'بإنشائك الحساب، فإنك توافق على شروط الخدمة وسياسة الخصوصية لتيكو. متوافق مع PDPL و GDPR.'}
        </p>
      </div>

      <style>{`
        .auth-card {
          width: 100%;
          max-width: 460px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: 32px;
          box-shadow: var(--shadow);
        }
        .auth-brand { display: inline-flex; align-items: center; gap: 10px; }
      `}</style>
    </div>
  );
}
