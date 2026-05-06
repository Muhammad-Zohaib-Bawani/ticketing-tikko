import { useApp } from '../state/AppContext.jsx';
import { EVENTS } from '../data/events.js';

const CHANNELS = [
  { label: { en: 'Direct (web)', ar: 'مباشر (ويب)' }, share: 0.42 },
  { label: { en: 'Email campaigns', ar: 'حملات البريد' }, share: 0.21 },
  { label: { en: 'Social ads', ar: 'إعلانات سوشيال' }, share: 0.18 },
  { label: { en: 'Affiliates', ar: 'شركاء' }, share: 0.12 },
  { label: { en: 'Editorial', ar: 'تحريري' }, share: 0.07 },
];

export default function Organizer() {
  const { t, lang, formatPrice } = useApp();

  const events = EVENTS.slice(0, 4);
  const sales = events.map((e) => ({
    e,
    units: 600 + Math.floor(Math.random() * 5400),
    revenue: e.priceFrom * (200 + Math.floor(Math.random() * 1800)),
  }));
  const totalRevenue = sales.reduce((s, x) => s + x.revenue, 0);
  const totalUnits = sales.reduce((s, x) => s + x.units, 0);

  return (
    <div className="container fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 14, marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t.organizerTitle}</div>
          <h1 style={{ marginTop: 6 }}>{lang === 'en' ? 'Welcome back, Riyadh Live' : 'أهلًا بعودتك، رياض لايف'}</h1>
          <p style={{ marginTop: 4 }}>{t.organizerSub}</p>
        </div>
        <button className="btn btn-primary">+ {t.publishCta}</button>
      </div>

      {/* KPI cards */}
      <div className="kpi-grid">
        <div className="card kpi-card">
          <div className="kpi-lbl">{t.revenue} ({t.organizerKpis})</div>
          <div className="kpi-val">{formatPrice(totalRevenue)}</div>
          <div className="kpi-delta">↑ 12.4%</div>
        </div>
        <div className="card kpi-card">
          <div className="kpi-lbl">{t.sold}</div>
          <div className="kpi-val">{totalUnits.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')}</div>
          <div className="kpi-delta">↑ 8.1%</div>
        </div>
        <div className="card kpi-card">
          <div className="kpi-lbl">{t.conversion}</div>
          <div className="kpi-val">5.7%</div>
          <div className="kpi-delta">↑ 0.6 pp</div>
        </div>
        <div className="card kpi-card">
          <div className="kpi-lbl">{t.holds}</div>
          <div className="kpi-val">412</div>
          <div className="kpi-delta" style={{ color: 'var(--warn)' }}>VIP / Comps</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }} className="org-grid">
        {/* Events table */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <h2 style={{ fontSize: 17 }}>{t.upcomingEvents}</h2>
            <span style={{ fontSize: 12, color: 'var(--text-mute)' }}>{events.length} {t.eventsManaged}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sales.map(({ e, units, revenue }) => {
              const dateLabel = new Date(e.date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric' });
              const sold = Math.min(0.95, units / 6000);
              return (
                <div key={e.id} style={{ display: 'flex', gap: 14, padding: 12, background: 'var(--surface-2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                  <div style={{ width: 64, height: 64, flex: '0 0 64px', borderRadius: 8, backgroundImage: `url(${e.image})`, backgroundSize: 'cover' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{e.title[lang]}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-mute)', marginTop: 2 }}>{dateLabel} · {e.venue[lang]}</div>
                    <div className="bar" style={{ height: 6, background: 'var(--surface-3)', borderRadius: 999, marginTop: 8, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${sold * 100}%`, background: 'var(--grad-hero)' }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'end' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>{formatPrice(revenue)}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-mute)' }}>{units.toLocaleString()} {lang === 'en' ? 'sold' : 'مباع'}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: channels + tools */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="card" style={{ padding: 20 }}>
            <h2 style={{ fontSize: 17, marginBottom: 12 }}>{t.salesByChannel}</h2>
            {CHANNELS.map((c) => (
              <div className="bar-row" key={c.label.en}>
                <span className="label">{c.label[lang]}</span>
                <span className="bar"><span className="bar-fill" style={{ width: `${c.share * 100}%` }} /></span>
                <span className="val">{(c.share * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h2 style={{ fontSize: 17, marginBottom: 12 }}>{lang === 'en' ? 'Trust & integrity' : 'الثقة والنزاهة'}</h2>
            <ToolRow icon="↻" title={t.rotatingBarcode} desc={lang === 'en' ? 'Active on 3 events' : 'مفعل على 3 أحداث'} on />
            <ToolRow icon="⏳" title={t.queue} desc={lang === 'en' ? 'Soundstorm · Riyadh Season' : 'ساوند ستورم · موسم الرياض'} on />
            <ToolRow icon="★" title={t.verifiedFan} desc={lang === 'en' ? 'Lottery active for 2 events' : 'يانصيب مفعل لحدثين'} on />
            <ToolRow icon="$" title={t.fanResale} desc={lang === 'en' ? 'Floor 80% / Ceiling 130%' : 'حد 80% / سقف 130%'} on />
            <ToolRow icon="🛡️" title={lang === 'en' ? 'Bot mitigation' : 'حماية من البوتات'} desc={lang === 'en' ? 'CAPTCHA + ML signals' : 'CAPTCHA + إشارات ML'} on />
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h2 style={{ fontSize: 17, marginBottom: 8 }}>{t.settle}</h2>
            <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text)' }}>{formatPrice(Math.round(totalRevenue * 0.78))}</div>
            <p style={{ fontSize: 12, marginTop: 6 }}>
              {lang === 'en' ? 'Net of fees, refunds and 15% VAT. Settles every Tuesday.' : 'صافٍ بعد الرسوم والاسترداد و15% ضريبة. تسوية كل ثلاثاء.'}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .org-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

function ToolRow({ icon, title, desc, on }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ width: 32, height: 32, display: 'grid', placeItems: 'center', background: 'var(--surface-3)', borderRadius: 8, fontSize: 14 }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 13.5 }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--text-mute)' }}>{desc}</div>
      </div>
      <div style={{ width: 38, height: 22, background: on ? 'var(--success)' : 'var(--surface-3)', borderRadius: 999, position: 'relative', transition: 'background 0.15s' }}>
        <span style={{ position: 'absolute', top: 2, left: on ? 18 : 2, width: 18, height: 18, background: '#fff', borderRadius: '50%', transition: 'left 0.15s' }} />
      </div>
    </div>
  );
}
