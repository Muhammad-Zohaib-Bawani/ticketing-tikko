import { useApp } from '../state/AppContext.jsx';

export default function Footer() {
  const { t } = useApp();
  return (
    <footer style={{ borderTop: '1px solid var(--border)', marginTop: 64, padding: '32px 0', color: 'var(--text-mute)' }}>
      <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 22, height: 22, display: 'grid', placeItems: 'center', background: 'var(--grad-hero)', borderRadius: 6, fontWeight: 800, color: 'white', fontSize: 13 }}>T</span>
          <span style={{ fontWeight: 700, color: 'var(--text-dim)' }}>{t.brand}</span>
          <span style={{ marginInlineStart: 8 }}>© 2026</span>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <span>{t.secureCheckout}</span>
          <span>WCAG 2.1 AA</span>
          <span>PDPL · GDPR</span>
        </div>
      </div>
    </footer>
  );
}
