import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { addToCalendar } from "../utils/calendar";
import "../styles/birthdayintro.css";
import "../styles/birthdaycountdown.css";

const MONTHS = ["januar", "februar", "mart", "april", "maj", "jun", "jul", "avgust", "septembar", "oktobar", "novembar", "decembar"];
const MONTHS_GENITIVE = ["januara", "februara", "marta", "aprila", "maja", "juna", "jula", "avgusta", "septembra", "oktobra", "novembra", "decembra"];
const WEEKDAYS = ["pon", "uto", "sre", "čet", "pet", "sub", "ned"];

function remaining(targetDate) {
  const target = new Date(targetDate).getTime();
  const total = Number.isFinite(target) ? Math.max(0, Math.floor((target - Date.now()) / 1000)) : 0;
  return {
    total,
    values: [Math.floor(total / 86400), Math.floor(total / 3600) % 24, Math.floor(total / 60) % 60, total % 60],
  };
}

export default function BirthdayCreamCountdown({ targetDate, brideName, venue, details = {} }) {
  const reduceMotion = useReducedMotion();
  const [clock, setClock] = useState(() => remaining(targetDate));

  useEffect(() => {
    setClock(remaining(targetDate));
    if (!Number.isFinite(new Date(targetDate).getTime())) return;
    const timer = setInterval(() => setClock(remaining(targetDate)), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const eventDate = new Date(targetDate);
  if (!targetDate || !Number.isFinite(eventDate.getTime())) return null;

  // Kalendar prikazuje datum proslave u Srbiji i gostima koji su u drugoj vremenskoj zoni.
  const dateParts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Belgrade", year: "numeric", month: "numeric", day: "numeric",
  }).formatToParts(eventDate);
  const numberPart = (type) => Number(dateParts.find((part) => part.type === type)?.value);
  const year = numberPart("year");
  const month = numberPart("month") - 1;
  const selectedDay = numberPart("day");
  const firstWeekday = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Belgrade", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).format(eventDate);
  const name = brideName || details.rsvpSignature || "";
  const age = details.age ?? 18;

  const saveDate = () => {
    addToCalendar({
      eventType: "birthday",
      brideName: name,
      age,
      eventTitle: `${name} — ${age}. rođendan`,
      dateISO: targetDate,
      venue: [details.locationName || venue || details.venue, details.locationAddress].filter(Boolean).join(", "),
      mapLink: details.mapLink || details.locationButtonLink,
      note: details.note,
      calendarDurationHours: details.calendarDurationHours,
    });
  };

  return (
    <section className="mcr-theme mcr-calendar-section" aria-label="Datum proslave i kalendar">
      <motion.div
        className="mcr-calendar-panel"
        initial={reduceMotion ? false : { opacity: 0, y: 30, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="mcr-eyebrow">Sačuvajte ovaj datum</p>
        <h2 className="mcr-section-title">Odbrojavamo do proslave</h2>
        {clock.total > 0 ? (
          <div className="mcr-countdown" role="timer" aria-live="off" aria-label="Vreme do početka proslave">
            {clock.values.map((value, i) => (
              <div className="mcr-countdown-unit" key={i}>
                <strong>{String(value).padStart(2, "0")}</strong>
                <span>{["dana", "sati", "minuta", "sekundi"][i]}</span>
              </div>
            ))}
          </div>
        ) : <p className="mcr-party-time">Vreme je za slavlje!</p>}

        <div className="mcr-calendar" aria-label={`${MONTHS[month]} ${year}.`}>
          <div className="mcr-calendar-heading"><span>{MONTHS[month]}</span><strong>{year}.</strong></div>
          <div className="mcr-calendar-weekdays" aria-hidden="true">
            {WEEKDAYS.map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="mcr-calendar-days">
            {Array.from({ length: firstWeekday }, (_, i) => <span className="mcr-calendar-empty" key={`empty-${i}`} aria-hidden="true" />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
              <span
                key={day}
                className={day === selectedDay ? "mcr-calendar-selected" : undefined}
                aria-label={day === selectedDay ? `${day}. ${MONTHS_GENITIVE[month]} ${year}. — dan proslave` : undefined}
              >
                {day}
              </span>
            ))}
          </div>
        </div>
        <p className="mcr-calendar-date">{selectedDay}. {MONTHS_GENITIVE[month]} {year}. <span>u {time} h</span></p>
        {details.showCalendarButton && (
          <button className="mcr-button mcr-calendar-button" type="button" onClick={saveDate}>
            <svg viewBox="0 0 20 22" fill="none" aria-hidden="true"><rect x="2" y="4" width="16" height="16" rx="1" /><path d="M6 1v6m8-6v6M2 10h16m-8 3v5m-2.5-2.5h5" /></svg>
            Sačuvaj datum
          </button>
        )}
      </motion.div>
    </section>
  );
}
