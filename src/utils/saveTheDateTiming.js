export function dateDisplayToISO(value) {
  if (!value) return "";

  const match = String(value)
    .trim()
    .match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})\.?$/);

  if (!match) return "";

  const [, day, month, year] = match;

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function parseTargetDate(value) {
  if (!value) return null;

  const dateOnly = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (dateOnly) {
    const [, year, month, day] = dateOnly;

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      0,
      0,
      0
    );
  }

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getCountdown(targetDate) {
  if (!targetDate || Number.isNaN(targetDate.getTime())) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      finished: false,
    };
  }

  const difference = targetDate.getTime() - Date.now();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      finished: true,
    };
  }

  const totalMinutes = Math.floor(difference / 60000);

  return {
    days: Math.floor(totalMinutes / 1440),
    hours: Math.floor((totalMinutes % 1440) / 60),
    minutes: totalMinutes % 60,
    finished: false,
  };
}

export function padNumber(value) {
  return String(value).padStart(2, "0");
}
