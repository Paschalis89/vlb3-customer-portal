import { Skeleton } from '../ui/Skeleton';

export function UsersSkeleton() {
  return (
    <div className="users-loading" aria-label="Caricamento utenti">
      <div className="users-summary-grid">
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="user-summary-card" key={index}>
            <Skeleton className="skeleton--user-summary-label" />
            <Skeleton className="skeleton--user-summary-value" />
          </div>
        ))}
      </div>

      <div className="users-panel">
        <Skeleton className="skeleton--users-toolbar" />
        <div className="users-table users-table--skeleton">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="user-row" key={index}>
              <div className="user-row__identity">
                <Skeleton className="skeleton--user-avatar" />
                <div>
                  <Skeleton className="skeleton--user-name" />
                  <Skeleton className="skeleton--user-email" />
                </div>
              </div>
              <Skeleton className="skeleton--user-pill" />
              <Skeleton className="skeleton--user-pill" />
              <Skeleton className="skeleton--user-date" />
              <Skeleton className="skeleton--user-actions" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
