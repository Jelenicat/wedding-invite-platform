import { motion } from "framer-motion";
import { addToCalendar } from "../utils/calendar";
import "../styles/birthdaycountdown.css";

function BirthdayLuxuryCountdown({
  targetDate,
  brideName,
  details = {},
}) {
  const age = details.age || 18;
  const name = brideName || "Đorđe";

  if (!targetDate) return null;

  const eventDate = new Date(targetDate);

  if (Number.isNaN(eventDate.getTime())) return null;

  const monthNames = [
    "januar",
    "februar",
    "mart",
    "april",
    "maj",
    "jun",
    "jul",
    "avgust",
    "septembar",
    "oktobar",
    "novembar",
    "decembar",
  ];

  const weekDays = ["pon", "uto", "sre", "čet", "pet", "sub", "ned"];

  const year = eventDate.getFullYear();
  const month = eventDate.getMonth();
  const selectedDay = eventDate.getDate();

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const jsDay = firstDay.getDay();
  const mondayBasedStart = jsDay === 0 ? 6 : jsDay - 1;

  const emptyCells = Array.from({ length: mondayBasedStart });
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);

const handleCalendarClick = () => {
  addToCalendar({
    eventType: "birthday",
    brideName: name,
    age,
    eventTitle: `${name} - ${age}. rođendan`,
    dateISO: targetDate,
    venue: details?.venue,
    mapLink: details?.mapLink,
    note: details?.note,
  });
};

  return (
    <motion.section
      className="blux-countdown-section"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="blux-countdown-glow blux-countdown-glow-1" />
      <div className="blux-countdown-glow blux-countdown-glow-2" />

      <div className="blux-countdown-box">
        <p className="blux-countdown-kicker">Sačuvajte datum</p>

        <div className="blux-countdown-divider" />

        <div className="blux-calendar-preview">
          <div className="blux-calendar-preview-header">
            <span>{monthNames[month]}</span>
            <strong>{year}</strong>
          </div>

          <div className="blux-calendar-weekdays">
            {weekDays.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="blux-calendar-days">
            {emptyCells.map((_, index) => (
              <span key={`empty-${index}`} className="is-empty" />
            ))}

            {days.map((day) => (
              <span
                key={day}
                className={day === selectedDay ? "is-selected" : ""}
              >
                {day}
              </span>
            ))}
          </div>
        </div>

        <p className="blux-countdown-note">
          Vidimo se {selectedDay}. {monthNames[month]}a.
        </p>

        {details.showCalendarButton && (
          <div className="blux-calendar-box">
            <button
              type="button"
              className="blux-calendar-button"
              onClick={handleCalendarClick}
            >
              <span>＋</span>
              Dodaj u kalendar
            </button>

            <p>Sačuvajte datum rođendana u svom telefonu.</p>
          </div>
        )}
      </div>
    </motion.section>
  );
}

export default BirthdayLuxuryCountdown;