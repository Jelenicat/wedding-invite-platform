import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addToCalendar } from "../utils/calendar";
import "../styles/birthdaycountdown.css";

function BirthdayLuxuryCountdown({
  targetDate,
  brideName,
  details = {},
}) {
  const age = details.age || 18;
  const name = brideName || "Đorđe";

  const calculateTimeLeft = () => {
    const difference = new Date(targetDate).getTime() - new Date().getTime();

    if (!targetDate || Number.isNaN(difference) || difference <= 0) {
      return null;
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const format = (num) => String(num).padStart(2, "0");

  const handleCalendarClick = () => {
    addToCalendar({
      brideName: name,
      groomName: `${age}. rođendan`,
      dateISO: targetDate,
      venue: details?.venue,
      mapLink: details?.mapLink,
      note: details?.note,
    });
  };

  if (!targetDate) return null;

  if (!timeLeft) {
    return (
      <section className="blux-countdown-section">
        <div className="blux-countdown-box">
          <p className="blux-countdown-kicker">Proslava je počela</p>

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

              <p>Sačuvajte datum u svom telefonu.</p>
            </div>
          )}
        </div>
      </section>
    );
  }

  const items = [
    { value: format(timeLeft.days), label: "dana" },
    { value: format(timeLeft.hours), label: "sati" },
    { value: format(timeLeft.minutes), label: "min" },
    { value: format(timeLeft.seconds), label: "sek" },
  ];

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
        <p className="blux-countdown-kicker">Do proslave je ostalo</p>

        <div className="blux-countdown-divider" />

        <div className="blux-countdown-grid">
          {items.map((item, index) => (
            <motion.div
              key={item.label}
              className="blux-countdown-item"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              viewport={{ once: true }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={item.value}
                  initial={{ opacity: 0, y: 7 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -7 }}
                  transition={{ duration: 0.22 }}
                >
                  {item.value}
                </motion.span>
              </AnimatePresence>

              <small>{item.label}</small>
            </motion.div>
          ))}
        </div>

        <p className="blux-countdown-note">
          Još malo do večeri za pamćenje.
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