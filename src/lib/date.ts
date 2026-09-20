const relativeTimeFormatter = new Intl.RelativeTimeFormat('it', {
  numeric: 'auto',
});

export function formatRelativeTime(value: string, now = Date.now()): string {
  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return 'non disponibile';
  }

  const differenceInSeconds = Math.round((timestamp - now) / 1_000);
  const absoluteSeconds = Math.abs(differenceInSeconds);

  if (absoluteSeconds < 45) {
    return relativeTimeFormatter.format(differenceInSeconds, 'second');
  }

  const differenceInMinutes = Math.round(differenceInSeconds / 60);
  if (Math.abs(differenceInMinutes) < 60) {
    return relativeTimeFormatter.format(differenceInMinutes, 'minute');
  }

  const differenceInHours = Math.round(differenceInMinutes / 60);
  if (Math.abs(differenceInHours) < 24) {
    return relativeTimeFormatter.format(differenceInHours, 'hour');
  }

  const differenceInDays = Math.round(differenceInHours / 24);
  return relativeTimeFormatter.format(differenceInDays, 'day');
}

export function formatTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '--:--';
  }

  return new Intl.DateTimeFormat('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
}
