import { Skeleton } from '../ui/Skeleton';

export function HistorySkeleton() {
  return (
    <section className="history-panel" aria-hidden="true">
      <div className="history-skeleton__toolbar">
        <Skeleton className="skeleton--history-search" />
        <Skeleton className="skeleton--history-filter" />
      </div>

      {[0, 1, 2].map((group) => (
        <div className="history-skeleton__group" key={group}>
          <Skeleton className="skeleton--history-day" />
          {[0, 1].map((row) => (
            <div className="history-skeleton__row" key={row}>
              <Skeleton className="skeleton--history-dot" />
              <div>
                <Skeleton className="skeleton--history-title" />
                <Skeleton className="skeleton--history-line" />
                <Skeleton className="skeleton--history-meta" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
