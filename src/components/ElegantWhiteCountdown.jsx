import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import "../styles/rsvp.css";
import { addToCalendar } from "../utils/calendar";

function ElegantWhiteCountdown({
  targetDate,
  backgroundImage = "/images/elegant-white/background.jpg",
  brideName,
  groomName,
  details = {},
  showCalendarButton = false,
  script = "latin",
}) {
  const calculateTimeLeft = useMemo(() => {
    return () => {
      if (!targetDate) return null;

      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        return {
          expired: true,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      }

      return {
        expired: false,
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const t =
    script === "cyrillic"
      ? {
          overline: "Odbrojavanje do našeg dana",
          title: "Countdown",
          days: "Dana",
          hours: "Sati",
          minutes: "Minuta",
          seconds: "Sekundi",
          finished: "Naš dan je stigao!",
          addCalendar: "Dodaj u kalendar",
          calendarHint: "Sačuvajte datum venčanja u svom telefonu.",
        }
      : {
          overline: "Odbrojavanje do našeg dana",
          title: "Countdown",
          days: "Dana",
          hours: "Sati",
          minutes: "Minuta",
          seconds: "Sekundi",
          finished: "Naš dan je stigao!",
          addCalendar: "Dodaj u kalendar",
          calendarHint: "Sačuvajte datum venčanja u svom telefonu.",
        };

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

  if (!timeLeft) return null;

  return (
    <section
      className="elegant-white-countdown-section"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="elegant-white-countdown-bg-overlay" />

      <motion.div
        className="elegant-white-countdown-shell"
        initial={{ opacity: 0, y: 36, scale: 0.985 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="elegant-white-countdown-card">
          <div className="elegant-white-countdown-inner">
            <motion.p
              className="elegant-white-countdown-overline"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {t.overline}
            </motion.p>

            <motion.h2
              className="elegant-white-countdown-title"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.05 }}
            >
              {t.title}
            </motion.h2>

            <motion.div
              className="elegant-white-countdown-divider"
              initial={{ opacity: 0, scaleX: 0.7 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.1 }}
              style={{ transformOrigin: "center" }}
            >
              <span />
            </motion.div>

            {!timeLeft.expired ? (
              <div className="elegant-white-countdown-grid">
                <motion.div
                  className="elegant-white-countdown-box"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.05 }}
                >
                  <strong>{String(timeLeft.days).padStart(2, "0")}</strong>
                  <span>{t.days}</span>
                </motion.div>

                <motion.div
                  className="elegant-white-countdown-box"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.1 }}
                >
                  <strong>{String(timeLeft.hours).padStart(2, "0")}</strong>
                  <span>{t.hours}</span>
                </motion.div>

                <motion.div
                  className="elegant-white-countdown-box"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.15 }}
                >
                  <strong>{String(timeLeft.minutes).padStart(2, "0")}</strong>
                  <span>{t.minutes}</span>
                </motion.div>

                <motion.div
                  className="elegant-white-countdown-box"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.2 }}
                >
                  <strong>{String(timeLeft.seconds).padStart(2, "0")}</strong>
                  <span>{t.seconds}</span>
                </motion.div>
              </div>
            ) : (
              <motion.div
                className="elegant-white-countdown-finished"
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55 }}
              >
                <motion.div
                  className="elegant-white-countdown-finished-heart"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.45, delay: 0.1 }}
                >
                  ♡
                </motion.div>
                <p>{t.finished}</p>
              </motion.div>
            )}

            {showCalendarButton && (
              <motion.div
                className="elegant-white-countdown-calendar-box"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.25 }}
              >
                <button
                  type="button"
                  className="elegant-white-countdown-calendar-btn"
                  onClick={handleCalendarClick}
                >
                  <span>📅</span>
                  {t.addCalendar}
                </button>

                <p className="elegant-white-countdown-calendar-hint">
                  {t.calendarHint}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default ElegantWhiteCountdown;