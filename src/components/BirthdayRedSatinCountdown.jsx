import { useEffect, useId, useMemo, useState } from "react";
import "../styles/birthdaycountdown.css";

const TIME_ZONE = "Europe/Belgrade";
const CYRILLIC = {
  a: "а", b: "б", c: "ц", č: "ч", ć: "ћ", d: "д", dž: "џ", đ: "ђ",
  e: "е", f: "ф", g: "г", h: "х", i: "и", j: "ј", k: "к", l: "л",
  lj: "љ", m: "м", n: "н", nj: "њ", o: "о", p: "п", r: "р", s: "с",
  š: "ш", t: "т", u: "у", v: "в", z: "з", ž: "ж",
};

function usesCyrillic(script) {
  return ["cyrillic", "cyr", "ćirilica", "cirilica"].includes(script);
}

// U ćirilicu se pretvaraju ugrađeni natpisi. Tekst iz details prikazuje se kako je unet.
export function redSatinText(text, script) {
  if (!usesCyrillic(script)) return text;

  return text.replace(/dž|lj|nj|[a-zčćđšž]/gi, (letters) => {
    const lower = letters.toLowerCase();
    const translated = CYRILLIC[lower] || letters;
    return letters === lower ? translated : translated.toUpperCase();
  });
}

export function formatRedSatinDate(date, script, options) {
  const locale = usesCyrillic(script) ? "sr-Cyrl-RS" : "sr-Latn-RS";
  return new Intl.DateTimeFormat(locale, { timeZone: TIME_ZONE, ...options }).format(date);
}

export function redSatinCapitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getRedSatinDate(dateISO, weddingTime) {
  if (!dateISO) return null;
  const source = String(dateISO).trim();
  let date;

  if (/^\d{4}-\d{2}-\d{2}$/.test(source) || /^\d{4}-\d{2}-\d{2}T[\d:.]+$/.test(source)) {
    const time = String(weddingTime || "00:00").trim().replace(".", ":");
    const wallTime = new Date((source.includes("T") ? source : source + "T" + time) + "Z");
    if (Number.isNaN(wallTime.getTime())) return null;

    const formatter = new Intl.DateTimeFormat("en", { timeZone: TIME_ZONE, timeZoneName: "longOffset" });
    const timeZoneOffset = (instant) => {
      const label = formatter.formatToParts(instant).find(({ type }) => type === "timeZoneName")?.value;
      const match = label?.match(/GMT([+-])(\d{2}):(\d{2})/);
      if (!match) return 0;
      return (match[1] === "-" ? -1 : 1) * (Number(match[2]) * 60 + Number(match[3])) * 60000;
    };

    const wall = wallTime.getTime();
    date = new Date(wall - timeZoneOffset(wall - timeZoneOffset(wall)));
  } else {
    date = new Date(source);
  }

  return Number.isNaN(date.getTime()) ? null : date;
}

function calendarMonth(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE, year: "numeric", month: "numeric", day: "numeric",
  }).formatToParts(date);
  const year = Number(parts.find(({ type }) => type === "year").value);
  const month = Number(parts.find(({ type }) => type === "month").value);
  const day = Number(parts.find(({ type }) => type === "day").value);
  const firstColumn = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
  const monthLength = new Date(Date.UTC(year, month, 0)).getUTCDate();

  const weeks = Array.from({ length: Math.ceil((firstColumn + monthLength) / 7) }, (_, week) =>
    Array.from({ length: 7 }, (_, column) => {
      const number = week * 7 + column - firstColumn + 1;
      return number > 0 && number <= monthLength ? number : null;
    }),
  );

  return { day, weeks };
}

const toIcsDate = (date) => date.toISOString().replace(/[-:]|\.\d{3}/g, "");
const toIcsText = (value) => String(value || "")
  .replace(/([\\;,])/g, "\\$1")
  .replace(/\r\n?|\n/g, "\\n");

function foldCalendarLine(line) {
  const encoder = new TextEncoder();
  let result = "";
  let column = 0;

  for (const character of line) {
    const size = encoder.encode(character).length;
    if (column + size > 75) {
      result += "\r\n ";
      column = 1;
    }
    result += character;
    column += size;
  }

  return result;
}

function addToCalendar({ slug, startDate, durationHours, title, venue, description }) {
  const endDate = new Date(startDate.getTime() + durationHours * 3600000);
  const content = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Moja pozivnica//Crveni saten//SR",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "UID:" + toIcsText((slug || "rodjendan") + "-" + toIcsDate(startDate) + "@mojapozivnica.app"),
    "DTSTAMP:" + toIcsDate(new Date()),
    "DTSTART:" + toIcsDate(startDate),
    "DTEND:" + toIcsDate(endDate),
    "SUMMARY:" + toIcsText(title),
    "LOCATION:" + toIcsText(venue),
    "DESCRIPTION:" + toIcsText(description),
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].map(foldCalendarLine).join("\r\n");

  const url = URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = (slug || "rodjendan") + ".ics";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30000);
}

const DIVISORS = [86400, 3600, 60, 1];

export default function BirthdayRedSatinCountdown({
  slug, date, name, venue, details = {}, script, introReady = true,
}) {
  const headingId = useId();
  const [now, setNow] = useState(Date.now);
  const startTime = date?.getTime();
  const showCountdown = details.showCountdown !== false;
  const t = (value) => redSatinText(value, script);
  const month = useMemo(() => {
    if (!date) return null;
    const label = redSatinCapitalize(formatRedSatinDate(date, script, { month: "long", year: "numeric" }));
    return { ...calendarMonth(date), label };
  }, [date, script]);

  useEffect(() => {
    if (!showCountdown || !introReady || !Number.isFinite(startTime)) return undefined;
    setNow(Date.now());
    if (Date.now() >= startTime) return undefined;

    const timer = window.setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= startTime) window.clearInterval(timer);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [showCountdown, introReady, startTime]);

  if (!date || !showCountdown) return null;

  let secondsLeft = Math.max(0, Math.ceil((startTime - now) / 1000));
  const finished = secondsLeft === 0;
  const labels = [t("dana"), t("sati"), t("minuta"), t("sekundi")];
  const units = DIVISORS.map((divisor, index) => {
    const value = String(Math.floor(secondsLeft / divisor)).padStart(2, "0");
    secondsLeft %= divisor;
    return { label: labels[index], value };
  });
  const { day, weeks, label: monthLabel } = month;
  const config = details.redSatin || {};
  const duration = Number(details.calendarDurationHours);
  const age = String(details.age ?? "").trim().replace(/\.+$/, "");
  const title = config.calendarTitle || [name, age ? age + ". " + t("rođendan") : t("Rođendan")]
    .filter(Boolean).join(" · ");

  return (
    <section className="brs-countdown brs-on-wine brs-padded" aria-labelledby={headingId}>
      <h2 id={headingId} className="brs-section-title" data-brs-reveal="write">
        <span className="brs-script">{config.countdownHeading || t("Još malo")}</span>
        <span className="brs-caps brs-title-tail">{t("do proslave")}</span>
      </h2>
      {finished ? (
        <p className="brs-countdown-finished">{t("Vreme je za slavlje!")}</p>
      ) : (
        <div className="brs-time-grid" role="timer" aria-live="off" data-brs-reveal="">
          {units.map(({ label, value }) => (
            <div key={label}>
              <span className="brs-visually-hidden">{value} </span>
              <span className="brs-time-value" aria-hidden="true">
                {Array.from(value, (digit, position) => (
                  <span className="brs-time-slot" key={position}>
                    <span className="brs-time-digit" key={digit}>{digit}</span>
                  </span>
                ))}
              </span>
              <span className="brs-time-label brs-caps">{label}</span>
            </div>
          ))}
        </div>
      )}
      <details className="brs-date-details">
        <summary>
          <span>{monthLabel}</span>
          <svg className="brs-icon brs-when-closed" aria-hidden="true"><use href="#brs-icon-plus" /></svg>
          <svg className="brs-icon brs-when-open" aria-hidden="true"><use href="#brs-icon-minus" /></svg>
        </summary>
        <table className="brs-date-calendar">
          <caption className="brs-visually-hidden">{monthLabel}</caption>
          <thead><tr>{["Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"].map((name) => (
            <th key={name} scope="col">{t(name)}</th>
          ))}</tr></thead>
          <tbody>{weeks.map((week, row) => (
            <tr key={row}>{week.map((number, column) => (
              <td key={column} className={number === day ? "brs-celebration-day" : undefined}
                aria-label={number === day ? day + ", " + t("dan proslave") : undefined}>
                {number}
              </td>
            ))}</tr>
          ))}</tbody>
        </table>
      </details>
      {details.showCalendarButton && (
        <button className="brs-button brs-button--light" type="button" onClick={() => addToCalendar({
          slug, startDate: date, durationHours: Number.isFinite(duration) && duration > 0 ? duration : 5,
          title, venue, description: config.calendarDescription || t("Proslava rođendana."),
        })}>
          <svg className="brs-icon" aria-hidden="true"><use href="#brs-icon-calendar" /></svg>
          {t("Dodaj u kalendar")}
        </button>
      )}
    </section>
  );
}
