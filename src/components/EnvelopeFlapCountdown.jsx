import { useEffect, useState } from "react";
import { addToCalendar } from "../utils/calendar";

const COPY = {
  sr: {
    title: "Do venčanja je ostalo",
    days: "dana",
    hours: "sati",
    minutes: "min",
    seconds: "sek",
    arrived: "Dan venčanja je stigao",
    addCalendar: "Dodaj u kalendar",
    calendarHint: "Sačuvajte datum venčanja u svom telefonu.",
  },

  cyrillic: {
    title: "До венчања је остало",
    days: "дана",
    hours: "сати",
    minutes: "мин",
    seconds: "сек",
    arrived: "Дан венчања је стигао",
    addCalendar: "Додај у календар",
    calendarHint: "Сачувајте датум венчања у свом телефону.",
  },

  en: {
    title: "Time until the wedding",
    days: "days",
    hours: "hours",
    minutes: "min",
    seconds: "sec",
    arrived: "The wedding day has arrived",
    addCalendar: "Add to calendar",
    calendarHint: "Save the wedding date to your phone.",
  },
};

function CountdownEmbossedFrame() {
  // Gore ravno, dekorativni usek samo dole
  const outer =
    "M12 12 H348 V632 H332 Q316 632 316 648 H44 Q44 632 28 632 H12 Z";

  const inner =
    "M20 20 H340 V624 H332 Q313 624 311 640 H49 Q47 624 28 624 H20 Z";

  return (
    <svg
      className="ef-countdown-frame"
      viewBox="0 0 360 660"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {[outer, inner].map((d, index) => (
        <g key={index} fill="none" strokeWidth="1.15">
          <path
            d={d}
            className="ef-countdown-frame-shadow"
            transform="translate(0.7 0.9)"
            vectorEffect="non-scaling-stroke"
          />

          <path
            d={d}
            className="ef-countdown-frame-light"
            transform="translate(-0.7 -0.9)"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      ))}
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6.5 3.5v3" />
      <path d="M17.5 3.5v3" />
      <path d="M4 8.5h16" />
      <rect x="3.5" y="5" width="17" height="15.5" rx="1.5" />
      <path d="M8 12h.01" />
      <path d="M12 12h.01" />
      <path d="M16 12h.01" />
      <path d="M8 16h.01" />
      <path d="M12 16h.01" />
      <path d="M16 16h.01" />
    </svg>
  );
}

export default function EnvelopeFlapCountdown({
  targetDate,
  brideName,
  groomName,
  details = {},
  script = "latin",
  language = "sr",
  slug,
}) {
  const locale =
    language === "en"
      ? "en"
      : script === "cyrillic"
        ? "cyrillic"
        : "sr";

  const t = COPY[locale];

  const getTime = () => {
    const difference =
      new Date(targetDate).getTime() - Date.now();

    if (
      !Number.isFinite(difference) ||
      difference <= 0
    ) {
      return null;
    }

    return {
      days: Math.floor(
        difference / 86400000
      ),

      hours: Math.floor(
        (difference / 3600000) % 24
      ),

      minutes: Math.floor(
        (difference / 60000) % 60
      ),

      seconds: Math.floor(
        (difference / 1000) % 60
      ),
    };
  };

  const [time, setTime] = useState(getTime);

  useEffect(() => {
    setTime(getTime());

    const timer = window.setInterval(() => {
      setTime(getTime());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [targetDate]);

  const format = (value) =>
    String(value).padStart(2, "0");

  const items = time
    ? [
        {
          key: "days",
          value: time.days,
          label: t.days,
        },
        {
          key: "hours",
          value: time.hours,
          label: t.hours,
        },
        {
          key: "minutes",
          value: time.minutes,
          label: t.minutes,
        },
        {
          key: "seconds",
          value: time.seconds,
          label: t.seconds,
        },
      ]
    : [];

  /*
    Isto ponašanje kao kod ostalih template-a:
    dugme se prikazuje kada u slugu imaš:

    showCalendarButton: true
  */
  const showCalendarButton =
    details?.showCalendarButton === true;

  const handleCalendarClick = () => {
    addToCalendar({
      brideName,
      groomName,

      dateISO:
        details?.dateISO ||
        targetDate,

      venue:
        details?.venue,

      mapLink:
        details?.mapLink,

      note:
        details?.note,

      durationHours:
        details?.calendarDurationHours,

      language,
    });
  };

  return (
    <section
      className={`ef-countdown ef-countdown-${slug || ""}`}
      aria-live="polite"
    >
      <CountdownEmbossedFrame />

      <div className="ef-countdown-content">
        <div
          className="ef-countdown-heart"
          aria-hidden="true"
        >
          ♡
        </div>

        <p className="ef-countdown-kicker">
          {time ? t.title : t.arrived}
        </p>

        {time && (
          <>
            <div className="ef-countdown-rule" />

            <div className="ef-countdown-grid">
              {items.map((item) => (
                <div
                  className="ef-countdown-unit"
                  key={item.key}
                >
                  <strong>
                    {format(item.value)}
                  </strong>

                  <small>
                    {item.label}
                  </small>
                </div>
              ))}
            </div>
          </>
        )}

        {showCalendarButton && (
          <div className="ef-countdown-calendar">
            <button
              type="button"
              className="ef-countdown-calendar-button"
              onClick={handleCalendarClick}
            >
              <span className="ef-countdown-calendar-icon">
                <CalendarIcon />
              </span>

              <span>
                {t.addCalendar}
              </span>
            </button>

            <p className="ef-countdown-calendar-hint">
              {t.calendarHint}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}