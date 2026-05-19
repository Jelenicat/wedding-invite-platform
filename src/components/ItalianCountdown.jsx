import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { addToCalendar } from "../utils/calendar";
import "../styles/rsvp.css";

function getTimeLeft(targetDate) {
  const target = new Date(targetDate).getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (!targetDate || Number.isNaN(target) || diff <= 0) {
    return {
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
      finished: true,
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
    finished: false,
  };
}

function ItalianCountdown({
  brideName,
  groomName,
  details = {},
  script = "latin",
}) {
  const targetDate = details?.dateISO;

  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate));

  const isCyrillic = script === "cyrillic";

  const labels = useMemo(
    () => ({
      title: isCyrillic ? "До венчања" : "Do venčanja",
      finished: isCyrillic
        ? "Дан венчања је стигао"
        : "Dan venčanja je stigao",
      days: isCyrillic ? "дана" : "dana",
      hours: isCyrillic ? "сати" : "sati",
      minutes: isCyrillic ? "минута" : "minuta",
      seconds: isCyrillic ? "секунди" : "sekundi",
      addCalendar: isCyrillic ? "Додај у календар" : "Dodaj u kalendar",
      calendarHint: isCyrillic
        ? "Сачувајте датум венчања у свом телефону."
        : "Sačuvajte datum venčanja u svom telefonu.",
    }),
    [isCyrillic]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const handleCalendarClick = () => {
    addToCalendar({
      brideName,
      groomName,
      dateISO: targetDate,
      venue: details?.venue,
      mapLink: details?.mapLink,
      note: details?.note,
    });
  };

  if (!targetDate) return null;

  return (
    <section className="italian-countdown-section">
      <motion.div
        className="italian-countdown-shell"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="italian-countdown-kicker">
          {brideName} & {groomName}
        </p>

        <h2 className="italian-countdown-title">
          {timeLeft.finished ? labels.finished : labels.title}
        </h2>

        <div className="italian-countdown-ornament">
          <span />
          <em>♡</em>
          <span />
        </div>

        <div className="italian-countdown-grid">
          <div className="italian-countdown-item">
            <strong>{timeLeft.days}</strong>
            <span>{labels.days}</span>
          </div>

          <div className="italian-countdown-item">
            <strong>{timeLeft.hours}</strong>
            <span>{labels.hours}</span>
          </div>

          <div className="italian-countdown-item">
            <strong>{timeLeft.minutes}</strong>
            <span>{labels.minutes}</span>
          </div>

          <div className="italian-countdown-item">
            <strong>{timeLeft.seconds}</strong>
            <span>{labels.seconds}</span>
          </div>
        </div>

        <div className="italian-countdown-calendar-box">
          <button
            type="button"
            className="italian-countdown-calendar-btn"
            onClick={handleCalendarClick}
          >
            <span>📅</span>
            {labels.addCalendar}
          </button>

          <p className="italian-countdown-calendar-hint">
            {labels.calendarHint}
          </p>
        </div>
      </motion.div>
    </section>
  );
}

export default ItalianCountdown;