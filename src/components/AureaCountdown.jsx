import { useEffect, useState } from "react";
import { addToCalendar } from "../utils/calendar";
import { aureaLocale } from "./AureaIntro";

const COPY = {
  "sr-Latn": {
    title: "Do našeg venčanja",
    arrived: "Naš dan je stigao",
    units: ["dana", "sati", "minuta", "sekundi"],
    save: "Sačuvaj datum",
    weekdays: ["Po", "Ut", "Sr", "Če", "Pe", "Su", "Ne"],
  },
  "sr-Cyrl": {
    title: "До нашег венчања",
    arrived: "Наш дан је стигао",
    units: ["дана", "сати", "минута", "секунди"],
    save: "Сачувај датум",
    weekdays: ["По", "Ут", "Ср", "Че", "Пе", "Су", "Не"],
  },
  en: {
    title: "Until our wedding",
    arrived: "Our day is here",
    units: ["days", "hours", "minutes", "seconds"],
    save: "Save the date",
    weekdays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  },
  de: {
    title: "Bis zu unserer Hochzeit",
    arrived: "Unser Tag ist da",
    units: ["Tage", "Stunden", "Minuten", "Sekunden"],
    save: "Datum speichern",
    weekdays: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
  },
};

const UTC = { timeZone: "UTC" };

export function AureaMonth({ dateISO, locale }) {
  // dateISO starts with the wedding's local calendar date, including when viewed abroad.
  const datePrefix = typeof dateISO === "string" ? dateISO.match(/^\d{4}-\d{2}-\d{2}/)?.[0] : null;
  if (!datePrefix) return null;

  const date = new Date(`${datePrefix}T12:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== datePrefix) return null;

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const firstWeekday = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const label = new Intl.DateTimeFormat(locale, { ...UTC, month: "long", year: "numeric" }).format(date);
  const fullDate = new Intl.DateTimeFormat(locale, { ...UTC, dateStyle: "full" }).format(date);
  const values = Array.from({ length: Math.ceil((days + firstWeekday) / 7) * 7 }, (_, index) => {
    const day = index - firstWeekday + 1;
    return day >= 1 && day <= days ? day : null;
  });

  return (
    <table className="aurea-month">
      <caption>{label}</caption>
      <thead>
        <tr>{COPY[locale].weekdays.map((weekday) => <th key={weekday} scope="col">{weekday}</th>)}</tr>
      </thead>
      <tbody>
        {Array.from({ length: values.length / 7 }, (_, week) => (
          <tr key={week}>
            {values.slice(week * 7, week * 7 + 7).map((day, index) => (
              <td key={index}>
                {day === date.getUTCDate() ? (
                  <time dateTime={datePrefix} aria-label={fullDate} className="aurea-month-date">{day}</time>
                ) : day}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function AureaCountdown({
  targetDate,
  brideName,
  groomName,
  venue,
  details = {},
  script = "latin",
  language = "sr",
}) {
  const copy = COPY[aureaLocale(language, script)];
  const target = Date.parse(targetDate);
  const [now, setNow] = useState(Date.now);
  const remaining = Math.max(0, Math.ceil((target - now) / 1000));

  useEffect(() => {
    if (!Number.isFinite(target) || target <= Date.now()) return undefined;
    setNow(Date.now());
    const interval = window.setInterval(() => {
      const currentTime = Date.now();
      setNow(currentTime);
      if (currentTime >= target) window.clearInterval(interval);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [target]);

  if (!Number.isFinite(target)) return null;

  const values = [
    Math.floor(remaining / 86400),
    Math.floor(remaining / 3600) % 24,
    Math.floor(remaining / 60) % 60,
    remaining % 60,
  ];

  const saveDate = () => {
    addToCalendar({
      brideName,
      groomName,
      dateISO: targetDate,
      venue: details.venue || venue,
      mapLink: details.mapLink || details.locationButtonLink,
      note: details.note,
      durationHours: details.calendarDurationHours,
      language,
    });
  };

  return (
    <section className="aurea-countdown" aria-labelledby="aurea-countdown-title">
      <h2 id="aurea-countdown-title" className="aurea-script">
        {remaining > 0 ? copy.title : copy.arrived}
      </h2>
      {remaining > 0 && (
        <dl className="aurea-countdown-grid">
          {copy.units.map((label, index) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{String(values[index]).padStart(2, "0")}</dd>
            </div>
          ))}
        </dl>
      )}
      {details.showCalendarButton === true && (
        <button className="aurea-outline-button" type="button" onClick={saveDate}>{copy.save}</button>
      )}
    </section>
  );
}
