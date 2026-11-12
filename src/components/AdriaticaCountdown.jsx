import { useEffect, useState } from "react";
import { addToCalendar } from "../utils/calendar";
import "../styles/newrsvp.css";

const units = [86400, 3600, 60, 1];

const countdownCopy = {
  sr: {
    units: ["dana", "sati", "minuta", "sekundi"],
    waiting: "Do našeg dana",
    arrived: "Dan venčanja je stigao",
    calendar: "Dodaj u kalendar",
  },
  de: {
    units: ["Tage", "Stunden", "Minuten", "Sekunden"],
    waiting: "Bis zu unserem Hochzeitstag",
    arrived: "Unser Hochzeitstag ist da",
    calendar: "Zum Kalender hinzufügen",
  },
};

export default function AdriaticaCountdown({
  brideName,
  groomName,
  details = {},
  language = "sr",
}) {
  const isGerman = language === "de";
  const copy = isGerman ? countdownCopy.de : countdownCopy.sr;
  const { date, dateISO, calendarDurationHours } = details;
  const target = Date.parse(dateISO);
  const [now, setNow] = useState(Date.now);
  const timeLeft = Math.max(0, Math.ceil((target - now) / 1000));
  const { calendarLocation, calendarNote } = details.adriatica || {};

  useEffect(() => {
    if (!Number.isFinite(target) || target <= Date.now()) return;
    const update = () => {
      const current = Date.now();
      setNow(current);
      if (current >= target) window.clearInterval(interval);
    };
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [target]);

  if (!Number.isFinite(target)) return null;

  const handleCalendarClick = () => {
    const mapLink = details.events?.[0]?.mapLink;
    const note =
      isGerman && mapLink
        ? [calendarNote, `Karte: ${mapLink}`].filter(Boolean).join("\\n")
        : calendarNote;

    addToCalendar({
      brideName,
      groomName,
      dateISO,
      venue: calendarLocation,
      mapLink: isGerman ? undefined : mapLink,
      note,
      eventTitle: isGerman ? `Hochzeit – ${brideName} & ${groomName}` : undefined,
      durationHours: calendarDurationHours > 0 ? calendarDurationHours : 1,
      language,
    });
  };

  return (
    <section
      className="adriatica-section adriatica-countdown"
      aria-labelledby="adriatica-countdown-title"
    >
      <header className="adriatica-countdown-heading">
        <h2 id="adriatica-countdown-title">
          {timeLeft > 0 ? copy.waiting : copy.arrived}
        </h2>
        {date && (
          <time className="adriatica-countdown-date" dateTime={dateISO}>
            {date}
          </time>
        )}
      </header>
      {timeLeft > 0 && (
        <dl className="adriatica-clock" aria-live="off">
          {units.map((size, index) => {
            const value =
              index === 0
                ? Math.floor(timeLeft / size)
                : Math.floor((timeLeft % units[index - 1]) / size);
            return (
              <div key={size}>
                <dt>{copy.units[index]}</dt>
                <dd>{String(value).padStart(2, "0")}</dd>
              </div>
            );
          })}
        </dl>
      )}
      {details.showCalendarButton === true && (
        <button
          type="button"
          className="adriatica-countdown-calendar"
          onClick={handleCalendarClick}
        >
          <AdriaticaIcon name="calendar" /> {copy.calendar}
        </button>
      )}
    </section>
  );
}

export function AdriaticaFlourish({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 180 40"
      fill="none"
      aria-hidden="true"
    >
      <g
        stroke="currentColor"
        strokeWidth=".9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 23c26-12 57 12 83 2 26 10 57-14 83-2" />
        <path d="M90 24c-9-6-5-13 0-17 5 4 9 11 0 17ZM90 25l-3 5 3 5 3-5-3-5Z" />
        <path d="M79 27c-9-2-16-8-21-17 9 2 17 6 21 17Zm-16-1c-10 3-18 2-25-3 10-2 18-1 25 3ZM45 22c-7-2-12-5-16-10 8 0 14 4 16 10Z" />
        <path d="M101 27c9-2 16-8 21-17-9 2-17 6-21 17Zm16-1c10 3 18 2 25-3-10-2-18-1-25 3Zm18-4c7-2 12-5 16-10-8 0-14 4-16 10Z" />
        <circle cx="7" cy="23" r="1.8" />
        <circle cx="173" cy="23" r="1.8" />
      </g>
    </svg>
  );
}

const iconPaths = {
  arrow: "M4 12h15m-5-5 5 5-5 5",
  down: "M12 4v15m-5-5 5 5 5-5",
  check: "m5 12 4 4L19 6",
  calendar:
    "M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm-2 5h18M7 3v4m10-4v4m-8 8h6",
  pin: "M20 10c0 5-8 11-8 11s-8-6-8-11a8 8 0 1 1 16 0Z M12 7a3 3 0 1 0 .01 0Z",
  chapel: "M3 21h18M5 21V11l7-5 7 5v10m-9 0v-5a2 2 0 0 1 4 0v5M12 6V2m-2 2h4",
  boat: "M2 15h20l-3 4H6l-4-4Zm4 0 2-4h11l2 4M12 11V5l5 6M2 21c2 0 3-1 5-1s3 1 5 1 3-1 5-1 3 1 5 1",
  glass: "M7 3h10l-1 5c-.3 3-2 5-4 5S8.3 11 8 8L7 3Zm1 4h8m-4 6v7m-4 1h8",
  rings: "M13 7a6 6 0 1 0 0 10m-2-10a6 6 0 1 1 0 10",
  dinner: "M4 3v5a3 3 0 0 0 6 0V3M7 3v18m11-18c-3 2-4 6-4 10h4m0-10v18",
  plane: "M22 2 9 15m13-13-4 19-4-8-8-4 16-7ZM8 16l-3 3m1-7-3 3m10 3-3 3",
  phone:
    "M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a14 14 0 0 1-7-7l2-2-2-5Z",
  leaf: "M4 20c5-8 11-11 16-16 1 8-2 13-9 13H6m4-3v-4m4 1h4",
  fish: "M3 12c4-5 8-6 13-2l5-3v10l-5-3c-5 4-9 3-13-2Zm5 0h.01",
  meat: "M6 20c-2 1-3-1-2-3l4-4c-1-3 0-6 2-8 3-3 8-3 10 0s1 7-2 10c-2 2-5 2-7 1l-5 4Zm6-12 4 4m-2-6 4 4",
};

export function AdriaticaIcon({ name, className = "" }) {
  if (!iconPaths[name]) return null;

  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}
