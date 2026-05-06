import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../state/AppContext.jsx';
import { getEvent } from '../data/events.js';

const PAYMENT_METHODS = [
  { id: 'card', icon: '💳', label: { en: 'Card · Visa, Mada', ar: 'بطاقة · فيزا، مدى' } },
  { id: 'apple', icon: '', label: { en: 'Apple Pay', ar: 'Apple Pay' } },
  { id: 'google', icon: '🟢', label: { en: 'Google Pay', ar: 'Google Pay' } },
  { id: 'stcpay', icon: '📱', label: { en: 'STC Pay', ar: 'STC Pay' } },
];

export default function Checkout() {
  const { id } = useParams();
  const event = getEvent(id);
  const { t, lang, formatPrice, addOrder } = useApp();
  const nav = useNavigate();

  const cart = useMemo(() => {
    try { return JSON.parse(sessionStorage.getItem('checkout') || 'null'); } catch { return null; }
  }, []);

  const [showQueue, setShowQueue] = useState(!!event?.flags?.queue);
  const [queuePos, setQueuePos] = useState(2143);
  const [hold, setHold] = useState(8 * 60);
  const [pay, setPay] = useState('card');
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(0);
  const [insurance, setInsurance] = useState(false);
  const [contact, setContact] = useState({ name: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);

  // Virtual queue countdown
  useEffect(() => {
    if (!showQueue) return;
    const t = setInterval(() => {
      setQueuePos((p) => Math.max(0, p - Math.floor(35 + Math.random() * 80)));
    }, 700);
    return () => clearInterval(t);
  }, [showQueue]);

  useEffect(() => {
    if (queuePos === 0 && showQueue) setTimeout(() => setShowQueue(false), 600);
  }, [queuePos, showQueue]);

  // Hold timer
  useEffect(() => {
    if (showQueue) return;
    const t = setInterval(() => setHold((h) => Math.max(0, h - 1)), 1000);
    return () => clearInterval(t);
  }, [showQueue]);

  if (!event) return <div className="container"><p>Not found.</p></div>;
  if (!cart) {
    return (
      <div className="container">
        <div className="card" style={{ padding: 24 }}>
          <p>{lang === 'en' ? 'Your selection has expired. Please pick your tickets again.' : 'انتهت صلاحية اختيارك. يرجى إعادة اختيار التذاكر.'}</p>
          <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => nav(`/event/${id}`)}>← {t.back}</button>
        </div>
      </div>
    );
  }

  const subtotal = cart.lines.reduce((s, l) => s + l.price, 0) + cart.addons.reduce((s, a) => s + a.price, 0);
  const insuranceCost = insurance ? Math.round(subtotal * 0.06) : 0;
  const totalBeforeDiscount = subtotal + cart.fees + cart.tax + insuranceCost;
  const total = Math.max(0, totalBeforeDiscount - promoApplied);

  const applyPromo = () => {
    if (promo.trim().toUpperCase() === 'TIKKO10') setPromoApplied(Math.round(subtotal * 0.10));
    else if (promo.trim().toUpperCase() === 'WELCOME50') setPromoApplied(50);
    else setPromoApplied(0);
  };

  const minutes = String(Math.floor(hold / 60)).padStart(2, '0');
  const seconds = String(hold % 60).padStart(2, '0');

  const submit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const order = {
        eventId: event.id,
        eventTitle: event.title,
        eventVenue: event.venue,
        eventDate: event.date,
        lines: cart.lines,
        addons: cart.addons,
        total,
        contact,
        rotating: !!event.flags?.rotating,
      };
      addOrder(order);
      sessionStorage.removeItem('checkout');
      nav(`/confirmation/${event.id}`);
    }, 800);
  };

  return (
    <div className="container fade-in" style={{ position: 'relative' }}>
      {showQueue && (
        <div className="queue-overlay">
          <div className="queue-card">
            <div className="queue-pulse">⏳</div>
            <h2 style={{ fontSize: 22 }}>{t.queueTitle}</h2>
            <p style={{ marginTop: 8, fontSize: 13.5 }}>{t.queueSub}</p>
            <div className="queue-pos">
              <div>
                <div className="queue-pos-num">{queuePos.toLocaleString()}</div>
                <div className="queue-pos-lbl">{t.queuePos}</div>
              </div>
              <div>
                <div className="queue-pos-num">~{Math.max(1, Math.ceil(queuePos / 800))} {t.minutes}</div>
                <div className="queue-pos-lbl">{t.queueWait}</div>
              </div>
            </div>
            <div className="queue-bar"><div className="queue-bar-fill" style={{ width: `${100 - Math.min(100, queuePos / 25)}%` }} /></div>
            <p style={{ marginTop: 16, fontSize: 11, color: 'var(--text-mute)' }}>🔒 {t.queueProtected} · {t.deviceVerified}</p>
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 14 }} onClick={() => setShowQueue(false)}>
              {lang === 'en' ? 'Skip queue (demo)' : 'تخطي القائمة (تجريبي)'}
            </button>
          </div>
        </div>
      )}

      <button className="btn btn-ghost btn-sm" onClick={() => nav(`/event/${id}`)} style={{ marginBottom: 14 }}>← {t.back}</button>

      {!showQueue && hold < 8 * 60 && (
        <div className="timer-banner" style={{ marginBottom: 18 }}>
          <span>⏱️</span>
          <span style={{ flex: 1 }}>{t.holdTimer}</span>
          <span className="timer-time">{minutes}:{seconds}</span>
        </div>
      )}

      <div className="checkout-grid">
        <form onSubmit={submit}>
          <div className="card step-card">
            <div className="step-h"><span className="step-num">1</span><h2 style={{ fontSize: 17 }}>{t.contact}</h2></div>
            <div className="field">
              <label>{t.fullName}</label>
              <input className="input" required value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} placeholder={lang === 'en' ? 'Mohammed Al-Saud' : 'محمد آل سعود'} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="field">
                <label>{t.email}</label>
                <input className="input" type="email" required value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="you@example.com" />
              </div>
              <div className="field">
                <label>{t.phone}</label>
                <input className="input" required value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="+966 5x xxx xxxx" />
              </div>
            </div>
          </div>

          <div className="card step-card">
            <div className="step-h"><span className="step-num">2</span><h2 style={{ fontSize: 17 }}>{t.payment}</h2></div>
            <div className="pay-grid">
              {PAYMENT_METHODS.map((m) => (
                <div key={m.id} className={`pay-tile ${pay === m.id ? 'active' : ''}`} onClick={() => setPay(m.id)}>
                  <span className="pay-icon">{m.icon}</span>
                  <span>{m.label[lang]}</span>
                </div>
              ))}
            </div>
            {pay === 'card' && (
              <div style={{ marginTop: 14 }}>
                <div className="field">
                  <label>{lang === 'en' ? 'Card number' : 'رقم البطاقة'}</label>
                  <input className="input" placeholder="4242 4242 4242 4242" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="field"><label>{lang === 'en' ? 'Expiry' : 'الصلاحية'}</label><input className="input" placeholder="MM / YY" /></div>
                  <div className="field"><label>CVC</label><input className="input" placeholder="123" /></div>
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-mute)' }}>🔒 {t.secureCheckout} — {lang === 'en' ? 'card data tokenized via PSP, never stored on Tikko.' : 'بيانات البطاقة مشفرة عبر مزود الدفع.'}</p>
              </div>
            )}
            {pay !== 'card' && <p style={{ fontSize: 12, marginTop: 10, color: 'var(--text-mute)' }}>{lang === 'en' ? `Authenticate via ${pay} on the next step.` : `سيتم التحقق عبر ${pay} في الخطوة التالية.`}</p>}
          </div>

          <div className="card step-card">
            <div className="step-h"><span className="step-num">3</span><h2 style={{ fontSize: 17 }}>{lang === 'en' ? 'Promo & protection' : 'خصم وحماية'}</h2></div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <input className="input" placeholder={`${t.promo} (TIKKO10)`} value={promo} onChange={(e) => setPromo(e.target.value)} />
              <button type="button" className="btn" onClick={applyPromo}>{t.apply}</button>
            </div>
            {promoApplied > 0 && <p style={{ fontSize: 12, color: 'var(--success)' }}>✓ {lang === 'en' ? 'Promo applied' : 'تم تطبيق الخصم'}: −{formatPrice(promoApplied)}</p>}

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 12, border: '1px solid var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer', marginTop: 10 }}>
              <input type="checkbox" checked={insurance} onChange={(e) => setInsurance(e.target.checked)} style={{ marginTop: 3 }} />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text)' }}>🛡️ {t.insurance} <span className="tnum" style={{ color: 'var(--text-dim)', fontWeight: 400 }}>· +{formatPrice(Math.round(subtotal * 0.06))}</span></div>
                <div style={{ fontSize: 12, color: 'var(--text-mute)', marginTop: 2 }}>{t.insuranceDesc}</div>
              </div>
            </label>
          </div>

          <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
            {submitting ? '...' : `${t.completePurchase} · ${formatPrice(total)}`}
          </button>
        </form>

        {/* Summary */}
        <div className="side-card">
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
              <div style={{ width: 56, height: 56, borderRadius: 10, backgroundImage: `url(${event.image})`, backgroundSize: 'cover' }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{event.title[lang]}</div>
                <div style={{ fontSize: 12, color: 'var(--text-mute)' }}>{event.venue[lang]} · {event.city}</div>
              </div>
            </div>

            {cart.lines.map((l, i) => (
              <div key={i} className="summary-row">
                <span>{l.label}</span>
                <span className="tnum">{formatPrice(l.price)}</span>
              </div>
            ))}
            {cart.addons.map((a, i) => (
              <div key={'a' + i} className="summary-row">
                <span>+ {a.label}</span>
                <span className="tnum">{formatPrice(a.price)}</span>
              </div>
            ))}
            <div className="divider" />
            <div className="summary-row"><span>{t.subtotal}</span><span className="tnum">{formatPrice(subtotal)}</span></div>
            <div className="summary-row"><span>{t.fees}</span><span className="tnum">{formatPrice(cart.fees)}</span></div>
            <div className="summary-row"><span>{t.tax}</span><span className="tnum">{formatPrice(cart.tax)}</span></div>
            {insurance && <div className="summary-row"><span>🛡️ {t.insurance}</span><span className="tnum">{formatPrice(insuranceCost)}</span></div>}
            {promoApplied > 0 && <div className="summary-row" style={{ color: 'var(--success)' }}><span>{t.promo}</span><span className="tnum">−{formatPrice(promoApplied)}</span></div>}
            <div className="summary-row total"><span>{t.total}</span><span className="tnum">{formatPrice(total)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
