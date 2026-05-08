import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/rsvp.css";
import { addToCalendar } from "../utils/calendar";

function AngelCountdown({
  targetDate,
  brideName,
  groomName,
  details = {},
  showCalendarButton = false,
}) {
  const calculateTimeLeft = () => {
    const difference =
      new Date(targetDate).getTime() - new Date().getTime();

    if (difference <= 0) return null;

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

  const calendarBox = showCalendarButton ? (
    <motion.div
      className="angel-countdown-calendar-box"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay: 0.15 }}
    >
      <button
        type="button"
        className="angel-countdown-calendar-btn"
        onClick={handleCalendarClick}
      >
        <span>📅</span>
        Dodaj u kalendar
      </button>

      <p className="angel-countdown-calendar-hint">
        Sačuvajte datum venčanja u svom telefonu.
      </p>
    </motion.div>
  ) : null;

  if (!timeLeft) {
    return (
      <section className="angel-countdown-section">
        <div className="angel-countdown-shell">
          <div className="angel-countdown-frame-outer">
            <motion.div
              className="angel-countdown-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7 }}
            >
              <div className="angel-countdown-frame" />
              <div className="angel-countdown-frame angel-countdown-frame-second" />

              <div className="angel-countdown-heading">
                <div className="angel-countdown-script">Wedding day</div>
                <h2 className="angel-countdown-title">
                  Dan venčanja je stigao ✨
                </h2>
              </div>

              {calendarBox}
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  const items = [
    { label: "Dana", value: timeLeft.days },
    { label: "Sati", value: timeLeft.hours },
    { label: "Minuta", value: timeLeft.minutes },
    {
      label: timeLeft.seconds === 1 ? "Sekunda" : "Sekundi",
      value: timeLeft.seconds,
    },
  ];

  return (
    <section className="angel-countdown-section">
      <div className="angel-countdown-shell">
        <div className="angel-countdown-frame-outer">
          <motion.div
            className="angel-countdown-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7 }}
          >
            <div className="angel-countdown-frame" />
            <div className="angel-countdown-frame angel-countdown-frame-second" />

            <div className="angel-countdown-heading">
              <div className="angel-countdown-script">Countdown</div>
              <h2 className="angel-countdown-title">
                Odbrojavanje do našeg dana
              </h2>
            </div>

            <div className="angel-countdown-grid">
              {items.map((item) => (
                <div className="angel-countdown-item" key={item.label}>
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={item.value}
                      className="angel-countdown-value"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                    >
                      {String(item.value).padStart(2, "0")}
                    </motion.div>
                  </AnimatePresence>

                  <div className="angel-countdown-label">{item.label}</div>
                </div>
              ))}
            </div>

            {calendarBox}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AngelCountdown;