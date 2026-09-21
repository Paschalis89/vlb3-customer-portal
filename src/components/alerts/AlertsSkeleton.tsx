import { Skeleton } from '../ui/Skeleton';

export function AlertsSkeleton() {
  return (
    <div className="alerts-loading" aria-label="Caricamento allarmi" aria-busy="true">
      <div className="alerts-summary-grid">
        {Array.from({ length: 3 }, (_, index) => (
          <div className="alert-summary-card" key={index}>
            <Skeleton className="skeleton--label" />
            <Skeleton className="skeleton--value" />
          </div>
        ))}
      </div>

      <Skeleton className="skeleton--alerts-toolbar" />

      <div className="alerts-grid">
        {Array.from({ length: 3 }, (_, index) => (
          <div className="alert-card" key={index}>
            <Skeleton className="skeleton--alert-badge" />
            <Skeleton className="skeleton--alert-title" />
            <Skeleton className="skeleton--alert-line" />
            <Skeleton className="skeleton--alert-line skeleton--alert-line-short" />
          </div>
        ))}
      </div>
    </div>
  );
}
