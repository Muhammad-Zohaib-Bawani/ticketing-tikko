import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';
import { useApp } from '../state/AppContext.jsx';
import { EVENTS } from '../data/events.js';

const seedDemoOrder = () => {
  const e = EVENTS[0];
  return [{
    id: 'TKO-DEMO01',
    eventId: e.id,
    eventTitle: e.title,
    eventVenue: e.venue,
    eventDate: e.date,
    lines: [
      { label: e.tiers[2].name.en + ' — D7', labelAr: e.tiers[2].name.ar + ' — D7', price: e.tiers[2].price },
      { label: e.tiers[2].name.en + ' — D8', labelAr: e.tiers[2].name.ar + ' — D8', price: e.tiers[2].price },
    ],
    addons: [{ label: 'Premium parking', labelAr: 'موقف مميز', price: 60, kind: 'parking' }],
    total: e.tiers[2].price * 2 + 60,
    rotating: true,
    contact: { name: 'Demo User', email: 'you@example.com', phone: '+966 5x xxx xxxx' },
    createdAt: new Date().toISOString(),
  }];
};


export default function Tickets() {
  const { t, lang, orders, formatPrice } = useApp();
  const [tab, setTab] = useState('upcoming');
  const [tick, setTick] = useState(0);

  // Trigger rotating barcode tick every 5s
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 5000);
    return () => clearInterval(id);
  }, []);

  const data = orders.length ? orders : seedDemoOrder();

  const filtered = data.filter((o) => {
    const future = new Date(o.eventDate) > new Date();
    return tab === 'upcoming' ? future : !future;
  });

  return (
    <div className="container fade-in">
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 26 }}>🎟️ {t.nav.tickets}</h1>
        <p style={{ marginTop: 4 }}>{lang === 'en' ? 'Your wallet — present the QR at the gate.' : 'محفظتك — أبرز رمز QR عند البوابة.'}</p>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
        <button className={`btn btn-sm ${tab === 'upcoming' ? 'btn-primary' : ''}`} onClick={() => setTab('upcoming')}>{t.upcoming}</button>
        <button className={`btn btn-sm ${tab === 'past' ? 'btn-primary' : ''}`} onClick={() => setTab('past')}>{t.past}</button>
      </div>

      {filtered.length === 0 && (
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <p>{lang === 'en' ? 'No tickets here yet.' : 'لا توجد تذاكر بعد.'}</p>
          <Link to="/" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>{t.nav.discover} →</Link>
        </div>
      )}

      {filtered.map((order) => {
        const event = EVENTS.find((e) => e.id === order.eventId);
        const date = new Date(order.eventDate);
        const dateLabel = date.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
        const timeLabel = date.toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' });
        const rotatingCode = order.rotating ? `${order.id}-${Math.floor(Date.now() / 5000)}` : order.id;

        const parking = (order.addons || []).find((a) => a.kind === 'parking');

        return (
          <div className="ticket-card" key={order.id}>
            <div className="ticket-body">
              <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                {order.rotating && <span className="badge badge-warn pulse">↻ {t.rotating}</span>}
                <span className="badge badge-success">✓ {lang === 'en' ? 'Confirmed' : 'مؤكدة'}</span>
              </div>
              <div className="ticket-title">{(order.eventTitle?.[lang]) || event?.title?.[lang]}</div>
              <p style={{ fontSize: 13, marginTop: 6 }}>
                📅 {dateLabel} · {timeLabel}<br />
                📍 {(order.eventVenue?.[lang]) || event?.venue?.[lang]}
              </p>
              <div className="divider" />
              <div style={{ fontSize: 13 }}>
                {order.lines.map((l, i) => (
                  <div key={i} className="summary-row" style={{ padding: '3px 0' }}>
                    <span>{lang === 'ar' && l.labelAr ? l.labelAr : l.label}</span>
                    <span className="tnum">{l.price === 0 ? t.free : formatPrice(l.price)}</span>
                  </div>
                ))}
              </div>
              {parking && (
                <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(124,58,237,0.10)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 'var(--radius)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>🅿️</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text)' }}>{t.parkingIncluded} — {lang === 'ar' && parking.labelAr ? parking.labelAr : parking.label}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 2 }}>{t.parkingHint}</div>
                    </div>
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                <button className="btn btn-sm">↗ {t.transfer}</button>
                <button className="btn btn-sm"> {t.addToWallet}</button>
              </div>
            </div>
            <div className="ticket-stub">
              <div style={{ background: '#fff', padding: 8, borderRadius: 8 }}>
                <QRCodeSVG value={rotatingCode} size={108} bgColor="#ffffff" fgColor="#0b0b14" includeMargin={false} />
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-mute)', textAlign: 'center', maxWidth: 130, fontFamily: 'monospace' }}>
                {order.id}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
