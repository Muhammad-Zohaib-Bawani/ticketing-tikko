export default function Spinner({ size = 24, label }) {
  return (
    <span style={{ display: 'inline-flex', gap: 10, alignItems: 'center', color: 'var(--text-dim)' }} role="status" aria-live="polite">
      <span className="spinner" style={{ width: size, height: size }} />
      {label && <span style={{ fontSize: 13 }}>{label}</span>}
    </span>
  );
}

export function FullPageLoader({ label }) {
  return (
    <div style={{ display: 'grid', placeItems: 'center', padding: '80px 0' }}>
      <Spinner size={36} label={label} />
    </div>
  );
}
