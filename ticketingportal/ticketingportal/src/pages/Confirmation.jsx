import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../state/AppContext.jsx';
import { getEvent } from '../data/events.js';

export default function Confirmation() {
  const { id } = useParams();
  const event = getEvent(id);
  const { t, lang, orders } = useApp();
  const order = orders[0];
  const nav = useNavigate();

  if (!event || !order) {
    nav('/');
    return null;
  }

  return (
    <div className="container fade-in">
      <div className="card" style={{ padding: 36, textAlign: 'center', maxWidth: 600, margin: '40px auto' }}>
        <div style={{ width: 72, height: 72, margin: '0 auto 20px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'grid', placeItems: 'center', fontSize: 32 }}>
          ✓
        </div>
        <h1 style={{ fontSize: 28 }}>{t.orderConfirmed}</h1>
        <p style={{ marginTop: 10, fontSize: 14 }}>{t.orderConfirmedDesc}</p>
        <div style={{ marginTop: 24, padding: 14, background: 'var(--surface-2)', borderRadius: 'var(--radius)', textAlign: 'start' }}>
          <div style={{ fontSize: 12, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{lang === 'en' ? 'Order' : 'طلب'}</div>
          <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>#{order.id}</div>
          <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 8 }}>
            {event.title[lang]} · {new Date(event.date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric' })}
          </div>
          <div style={{ fontSize: 13, marginTop: 4, fontWeight: 700 }}>
            {order.lines.length} {lang === 'en' ? 'tickets' : 'تذاكر'}
            {order.addons.length > 0 && ` + ${order.addons.length} ${t.addons}`}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 22, flexWrap: 'wrap' }}>
          <Link to="/tickets" className="btn btn-primary">🎟️ {t.nav.tickets}</Link>
          <button className="btn">{t.addToWallet}</button>
          <Link to="/" className="btn btn-ghost">← {t.nav.discover}</Link>
        </div>
      </div>
    </div>
  );
}
