import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext.jsx';
import './BookingModal.css';

export default function BookingModal({ event, open, onClose }) {
  const { t, lang, formatPrice } = useApp();
  const nav = useNavigate();

  const isReserved = event?.seating === 'reserved';
  const isMultiDay = !!event?.multiDay && Array.isArray(event?.days);
  const isRegistration = !!event?.flags?.registration;
  const hasLayout = isReserved && !!event?.layout?.blocks?.length;

  const [activeDay, setActiveDay] = useState(null);
  const [activeBlock, setActiveBlock] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [gaQty, setGaQty] = useState({});

  // Reset whenever modal re-opens
  useEffect(() => {
    if (!open) return;
    setActiveDay(isMultiDay ? null : 'one');
    setActiveBlock(null);
    setSelectedSeats([]);
    setGaQty({});
  }, [open, isMultiDay]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open || !event) return null;

  // Step machine
  let step;
  if (isMultiDay && !activeDay) step = 'day';
  else if (hasLayout) step = activeBlock ? 'seats' : 'layout';
  else step = 'tickets';

  const seatsTotal = selectedSeats.reduce((sum, s) => {
    const tier = event.tiers.find((tr) => tr.id === s.tierId);
    return sum + (tier?.price || 0);
  }, 0);
  const gaTotal = Object.entries(gaQty).reduce((sum, [tierId, n]) => {
    const tier = event.tiers.find((tr) => tr.id === tierId);
    return sum + (tier?.price || 0) * n;
  }, 0);
  const subtotal = hasLayout ? seatsTotal : gaTotal;
  const ticketCount = hasLayout ? selectedSeats.length : Object.values(gaQty).reduce((a, b) => a + b, 0);

  const proceed = () => {
    const dayLabel = (dayId) => {
      if (!dayId || dayId === 'one' || dayId === 'all') return '';
      const d = event.days?.find((x) => x.id === dayId);
      return d ? ` · ${d.label[lang]}` : '';
    };
    const lines = hasLayout
      ? selectedSeats.map((s) => {
          const tier = event.tiers.find((tr) => tr.id === s.tierId);
          const block = event.layout.blocks.find((b) => b.id === s.blockId);
          return {
            label: `${tier.name[lang]} — ${block.name[lang]} ${s.row}${s.num}${dayLabel(s.dayId)}`,
            price: tier.price,
          };
        })
      : Object.entries(gaQty).filter(([, n]) => n > 0).flatMap(([tierId, n]) => {
          const tier = event.tiers.find((tr) => tr.id === tierId);
          return Array.from({ length: n }).map(() => ({ label: `${tier.name[lang]}${dayLabel(activeDay)}`, price: tier.price }));
        });
    const fees = Math.round(subtotal * 0.05);
    const tax = Math.round((subtotal + fees) * 0.15);
    const total = subtotal + fees + tax;
    const payload = { eventId: event.id, lines, addons: [], fees, tax, total };
    sessionStorage.setItem('checkout', JSON.stringify(payload));
    onClose();
    nav(`/checkout/${event.id}`);
  };

  const stepIdx = step === 'day' ? 0 : step === 'layout' ? 1 : step === 'seats' ? 2 : 1;

  return (
    <div className="bm-overlay" onClick={onClose}>
      <div className="bm" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <header className="bm-h">
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="bm-eyebrow">{t.bookingTitle}</div>
            <h2 className="bm-title">{event.title[lang]}</h2>
          </div>
          <div className="bm-steps">
            {(isMultiDay ? ['day', hasLayout ? 'block' : 'seats', 'seats'] : (hasLayout ? ['block', 'seats'] : ['tickets']))
              .filter((s, i, arr) => arr.indexOf(s) === i)
              .map((s, i, arr) => (
                <span key={s} className={`bm-step ${i <= stepIdx ? 'on' : ''}`}>
                  <span className="bm-step-num">{i + 1}</span>
                  <span className="bm-step-lbl">{t.bookingSteps[s] || s}</span>
                </span>
              ))}
          </div>
          <button className="bm-close" onClick={onClose} aria-label="Close">✕</button>
        </header>

        <div className="bm-body">
          {step === 'day' && <DayPicker days={event.days} onPick={setActiveDay} t={t} lang={lang} hasLayout={hasLayout} isReserved={isReserved} />}
          {step === 'layout' && (
            <LayoutPick
              event={event}
              activeBlock={activeBlock}
              setActiveBlock={setActiveBlock}
              onBack={isMultiDay ? () => setActiveDay(null) : null}
              t={t}
              lang={lang}
              formatPrice={formatPrice}
            />
          )}
          {step === 'seats' && (
            <SeatPick
              event={event}
              blockId={activeBlock}
              dayId={activeDay}
              selected={selectedSeats}
              onToggle={(s) => setSelectedSeats((p) => p.find((x) => x.id === s.id) ? p.filter((x) => x.id !== s.id) : [...p, s])}
              onBack={() => setActiveBlock(null)}
              t={t}
              lang={lang}
              formatPrice={formatPrice}
            />
          )}
          {step === 'tickets' && (
            <TierPick
              event={event}
              dayId={activeDay}
              qty={gaQty}
              setQty={setGaQty}
              onBack={isMultiDay ? () => setActiveDay(null) : null}
              t={t}
              lang={lang}
              formatPrice={formatPrice}
            />
          )}
        </div>

        <footer className="bm-foot">
          <div>
            {ticketCount > 0 ? (
              <>
                <div className="bm-foot-lbl">{ticketCount} {hasLayout ? t.seatsSelected : (lang === 'en' ? 'tickets' : 'تذاكر')}</div>
                <div className="bm-foot-total">{subtotal === 0 ? t.free : formatPrice(subtotal)}</div>
              </>
            ) : (
              <div className="bm-foot-lbl">
                {step === 'day' ? t.pickDay : step === 'layout' ? t.pickBlock : (hasLayout ? t.selectSeats : t.chooseTickets)}
              </div>
            )}
          </div>
          <button className="btn btn-primary" disabled={ticketCount === 0} onClick={proceed}>
            {isRegistration ? `${t.registerNow} →` : `${t.proceedToCheckout} →`}
          </button>
        </footer>
      </div>
    </div>
  );
}

/* ---------- Day picker ---------- */
function DayPicker({ days, onPick, t, lang, hasLayout, isReserved }) {
  return (
    <div className="bm-day">
      <p className="bm-day-sub">{t.pickDay}</p>
      <div className="bm-day-grid">
        {days.map((d) => {
          const dn = new Date(d.date);
          return (
            <button key={d.id} type="button" className="bm-day-card" onClick={() => onPick(d.id)}>
              <div className="bm-day-d">{dn.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { day: 'numeric' })}</div>
              <div className="bm-day-m">{dn.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { month: 'short', weekday: 'short' })}</div>
              <div className="bm-day-lbl">{d.label[lang]}</div>
              {d.headline && <div className="bm-day-head">{d.headline[lang]}</div>}
            </button>
          );
        })}
        {!isReserved && (
          <button type="button" className="bm-day-card all" onClick={() => onPick('all')}>
            <div className="bm-day-d">{days.length}</div>
            <div className="bm-day-m">{t.allDays}</div>
            <div className="bm-day-lbl">{t.fullPass}</div>
            <div className="bm-day-head">★ {t.bestValue}</div>
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------- Stadium layout (split view) ---------- */
function LayoutPick({ event, activeBlock, setActiveBlock, onBack, t, lang, formatPrice }) {
  const layout = event.layout;
  const tierFor = (block) => event.tiers.find((tr) => tr.id === block.tierId);

  return (
    <div className="bm-split">
      <div className="bm-stadium">
        {onBack && (
          <button className="btn btn-ghost btn-sm bm-back" onClick={onBack}>← {t.backToDays}</button>
        )}
        <svg viewBox={`0 0 ${layout.width} ${layout.height}`} className="bm-stadium-svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <pattern id="dot" width="6" height="6" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.7" className="bm-pattern-dot" />
            </pattern>
          </defs>
          <rect x="0" y="0" width={layout.width} height={layout.height} fill="url(#dot)" />

          {layout.stage && (
            <g>
              <rect
                x={layout.stage.x} y={layout.stage.y}
                width={layout.stage.w} height={layout.stage.h}
                rx="8"
                fill="rgba(124,58,237,0.20)"
                stroke="var(--primary)"
                strokeWidth="1.5"
              />
              <text
                x={layout.stage.x + layout.stage.w / 2}
                y={layout.stage.y + layout.stage.h / 2 + 5}
                className="bm-stage-text"
                fontSize="14" fontWeight="800"
                textAnchor="middle" letterSpacing="4"
              >
                {layout.stage.label[lang]}
              </text>
            </g>
          )}

          {layout.blocks.map((b) => {
            const tier = tierFor(b);
            const isActive = activeBlock === b.id;
            return (
              <g key={b.id} onClick={() => setActiveBlock(b.id)} className="bm-block-svg" tabIndex={0}>
                <rect
                  x={b.shape.x} y={b.shape.y}
                  width={b.shape.w} height={b.shape.h}
                  rx="10"
                  fill={tier.color + (isActive ? 'cc' : '70')}
                  stroke={isActive ? '#fff' : tier.color}
                  strokeWidth={isActive ? 2.5 : 1}
                />
                <text
                  x={b.shape.x + b.shape.w / 2}
                  y={b.shape.y + b.shape.h / 2 + 4}
                  fill="#fff" fontSize="13" fontWeight="700"
                  textAnchor="middle" pointerEvents="none"
                >
                  {b.name[lang]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <aside className="bm-blocks">
        <div className="bm-blocks-h">
          <div className="bm-blocks-title">{t.pickBlock}</div>
          <div className="bm-blocks-sub">{t.pickBlockSub}</div>
        </div>
        <div className="bm-blocks-list">
          {layout.blocks.map((b) => {
            const tier = tierFor(b);
            const total = b.rows.length * b.perRow;
            // Mirror the seat-availability seed used in SeatPick to derive a per-block count
            const blockHash = Array.from(b.id).reduce((a, c) => a + c.charCodeAt(0), 0);
            let avail = 0;
            for (let r = 0; r < b.rows.length; r++) {
              for (let s = 1; s <= b.perRow; s++) {
                const seed = (event.id.charCodeAt(0) + blockHash * 11 + r * 13 + s * 7) % 11;
                if (seed >= 3) avail++;
              }
            }
            const pct = total ? Math.round((avail / total) * 100) : 0;
            const lowAvail = pct < 25;
            return (
              <button
                key={b.id}
                type="button"
                className={`bm-block-row ${activeBlock === b.id ? 'active' : ''}`}
                onClick={() => setActiveBlock(b.id)}
              >
                <span className="bm-block-dot" style={{ background: tier.color }} />
                <span className="bm-block-info">
                  <b>{b.name[lang]}</b>
                  <span className="muted">
                    {tier.name[lang]} ·{' '}
                    <span style={{ color: lowAvail ? 'var(--warn)' : 'var(--text-mute)' }}>
                      {avail}/{total} {t.available}
                    </span>
                  </span>
                </span>
                <span className="bm-block-price">{formatPrice(tier.price)}</span>
                <span style={{ marginInlineStart: 8, color: 'var(--text-mute)' }}>›</span>
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}

/* ---------- Seats inside a block ---------- */
function SeatPick({ event, blockId, dayId, selected, onToggle, onBack, t, lang, formatPrice }) {
  const block = event.layout.blocks.find((b) => b.id === blockId);
  const tier = event.tiers.find((tr) => tr.id === block.tierId);

  const grid = useMemo(() => {
    const dayHash = dayId && dayId !== 'one' && dayId !== 'all'
      ? Array.from(dayId).reduce((a, c) => a + c.charCodeAt(0), 0)
      : 0;
    const blockHash = Array.from(block.id).reduce((a, c) => a + c.charCodeAt(0), 0);
    const out = [];
    for (let r = 0; r < block.rows.length; r++) {
      const row = [];
      for (let s = 1; s <= block.perRow; s++) {
        const seed = (event.id.charCodeAt(0) + blockHash * 11 + r * 13 + s * 7 + dayHash * 5) % 11;
        const sold = seed < 3;
        const accessible = r === 0 && (s === 1 || s === block.perRow);
        row.push({
          id: `${block.id}-${block.rows[r]}${s}${dayId && dayId !== 'one' && dayId !== 'all' ? '-' + dayId : ''}`,
          row: block.rows[r],
          num: s,
          tierId: tier.id,
          blockId: block.id,
          dayId: (dayId === 'one' || dayId === 'all') ? null : dayId,
          status: sold ? 'sold' : 'available',
          accessible,
        });
      }
      out.push(row);
    }
    return out;
  }, [event, block, tier, dayId]);

  return (
    <div className="bm-seat-view">
      <div className="bm-seat-h">
        <button className="btn btn-sm btn-ghost" onClick={onBack}>← {t.backToMap}</button>
        <div className="bm-seat-h-info">
          <span className="tier-dot" style={{ background: tier.color }} />
          <b>{block.name[lang]}</b>
          <span className="muted">· {tier.name[lang]} · {formatPrice(tier.price)} {t.each}</span>
        </div>
      </div>

      <div className="seatmap" style={{ marginTop: 14 }}>
        <div className="stage">{lang === 'en' ? 'STAGE' : 'المسرح'}</div>
        {grid.map((row, ri) => (
          <div key={ri} className="row-of-seats">
            <span className="row-label">{row[0].row}</span>
            {row.map((seat) => {
              const isSel = selected.some((x) => x.id === seat.id);
              return (
                <button
                  key={seat.id}
                  className={`seat ${seat.status === 'sold' ? 'sold' : ''} ${isSel ? 'selected' : ''} ${seat.accessible ? 'acc' : ''}`}
                  style={{ background: seat.status !== 'sold' && !isSel ? tier.color + '70' : undefined }}
                  title={`${seat.row}${seat.num} — ${formatPrice(tier.price)}`}
                  onClick={() => onToggle(seat)}
                  disabled={seat.status === 'sold'}
                  aria-label={`Row ${seat.row} seat ${seat.num}`}
                />
              );
            })}
            <span className="row-label">{row[0].row}</span>
          </div>
        ))}
        <div className="seat-legend">
          <span><span className="seat-legend-dot" style={{ background: tier.color + '70' }} />{t.available}</span>
          <span><span className="seat-legend-dot" style={{ background: 'var(--success)' }} />{t.selected}</span>
          <span><span className="seat-legend-dot" style={{ background: '#2a2a3d' }} />{t.unavailable}</span>
          <span>♿ {t.accessible}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- GA / registration tier picker ---------- */
function TierPick({ event, dayId, qty, setQty, onBack, t, lang, formatPrice }) {
  const isMultiDay = !!event.multiDay;
  const tiers = isMultiDay
    ? event.tiers.filter((tr) => !tr.dayId || tr.dayId === dayId || tr.dayId === 'd-any')
    : event.tiers;

  const setQ = (id, n) => setQty({ ...qty, [id]: Math.max(0, Math.min(8, n)) });

  return (
    <div className="bm-tickets">
      {onBack && (
        <button className="btn btn-sm btn-ghost" onClick={onBack} style={{ marginBottom: 12 }}>← {t.backToDays}</button>
      )}
      <h3 style={{ fontSize: 18 }}>{t.chooseTickets}</h3>
      <div className="bm-tickets-list">
        {tiers.map((tier) => (
          <div key={tier.id} className="tier-row">
            <div className="tier-name">
              <span className="tier-dot" style={{ background: tier.color }} />
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span>{tier.name[lang]}</span>
                <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {tier.dayId === 'all' && <span className="badge badge-primary">{t.fullPass}</span>}
                  {tier.name?.save && <span className="badge badge-success">★ {tier.name.save[lang]}</span>}
                  {tier.registration && tier.price === 0 && <span className="badge badge-success">{t.registerFree}</span>}
                </span>
              </span>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <span className="tier-price">{tier.price === 0 ? t.free : formatPrice(tier.price)}</span>
              <div className="qty">
                <button onClick={() => setQ(tier.id, (qty[tier.id] || 0) - 1)}>−</button>
                <span className="num">{qty[tier.id] || 0}</span>
                <button onClick={() => setQ(tier.id, (qty[tier.id] || 0) + 1)}>+</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
