import { groupHistoryEvents } from '../../lib/history';
import type { CustomerHistoryEvent } from '../../types/history';
import { HistoryEventItem } from './HistoryEventItem';

interface HistoryTimelineProps {
  events: CustomerHistoryEvent[];
}

export function HistoryTimeline({ events }: HistoryTimelineProps) {
  const groups = groupHistoryEvents(events);

  return (
    <div className="history-timeline">
      {groups.map((group) => (
        <section className="history-day" key={group.key}>
          <div className="history-day__heading">
            <span>{group.label}</span>
            <small>{group.events.length} {group.events.length === 1 ? 'evento' : 'eventi'}</small>
          </div>

          <div className="history-day__events">
            {group.events.map((event) => (
              <HistoryEventItem event={event} key={event.id} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
