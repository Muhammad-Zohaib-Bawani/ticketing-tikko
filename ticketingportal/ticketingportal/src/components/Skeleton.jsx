export function Skeleton({ width = '100%', height = 12, radius = 8, style }) {
  return <span className="skeleton" style={{ width, height, borderRadius: radius, ...style }} />;
}

export function EventCardSkeleton() {
  return (
    <div className="event-card" aria-hidden="true">
      <Skeleton style={{ aspectRatio: '16/10', borderRadius: 0 }} />
      <div className="event-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <Skeleton width="35%" height={10} />
        <Skeleton width="92%" height={16} />
        <Skeleton width="78%" height={12} />
        <Skeleton width="62%" height={12} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <Skeleton width="38%" height={14} />
          <Skeleton width="20%" height={14} />
        </div>
      </div>
    </div>
  );
}

export function EventGridSkeleton({ count = 4 }) {
  return (
    <div className="event-grid">
      {Array.from({ length: count }).map((_, i) => <EventCardSkeleton key={i} />)}
    </div>
  );
}
