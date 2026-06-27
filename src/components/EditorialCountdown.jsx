import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addToCalendar } from "../utils/calendar";

export default function EditorialCountdown({
  targetDate,
  brideName,
  groomName,
  details = {},
  script = "latin",
  slug,
}) {
  const t =
    script === "cyrillic"
      ? {
          arrived: "Дан венчања је стигао",
          title: "ОДБРОЈАВАЊЕ",
          scriptText: "до нашег дана",
          days: "дана",
          hours: "сати",
          minutes: "мин",
          seconds: "сек",
          addCalendar: "Додај у календар",
          calendarHint: "Сачувајте датум венчања у свом телефону.",
        }
      : {
          arrived: "Dan venčanja je stigao",
          title: "ODBROJAVANJE",
          scriptText: "do našeg dana",
          days: "dana",
          hours: "sati",
          minutes: "min",
          seconds: "sek",
          addCalendar: "Dodaj u kalendar",
          calendarHint: "Sačuvajte datum venčanja u svom telefonu.",
        };

  const showCalendarButton = details?.showCalendarButton === true;

  const calculateTimeLeft = () => {
    if (!targetDate) return null;

    const difference = new Date(targetDate).getTime() - new Date().getTime();

    if (Number.isNaN(difference) || difference <= 0) return null;

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
      brideName,
      groomName,
      dateISO: targetDate,
      venue: details?.venue,
      mapLink: details?.mapLink,
      note: details?.note,
    });
  };

  if (!timeLeft) {
    return (
      <section
        className={`editorial-countdown-section editorial-countdown-slug-${
          slug || ""
        }`}
      >
        <motion.div
          className="editorial-countdown-card"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="editorial-countdown-title">{t.title}</h2>
          <div className="editorial-countdown-script">{t.arrived}</div>

          {showCalendarButton && (
            <div className="editorial-countdown-calendar-box">
              <button
                type="button"
                className="editorial-countdown-calendar-btn"
                onClick={handleCalendarClick}
              >
                <span>📅</span>
                {t.addCalendar}
              </button>

              <p className="editorial-countdown-calendar-hint">
                {t.calendarHint}
              </p>
            </div>
          )}
        </motion.div>
      </section>
    );
  }

  const items = [
    { value: format(timeLeft.days), label: t.days },
    { value: format(timeLeft.hours), label: t.hours },
    { value: format(timeLeft.minutes), label: t.minutes },
    { value: format(timeLeft.seconds), label: t.seconds },
  ];

  return (
    <section
      className={`editorial-countdown-section editorial-countdown-slug-${
        slug || ""
      }`}
    >
      <motion.div
        className="editorial-countdown-card"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="editorial-countdown-title">{t.title}</h2>
        <div className="editorial-countdown-script">{t.scriptText}</div>

        <div className="editorial-countdown-grid">
          {items.map((item, index) => (
            <motion.div
              key={item.label}
              className="editorial-countdown-item"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              viewport={{ once: true }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={item.value}
                  className="editorial-countdown-number"
                  initial={{ opacity: 0, y: 7 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -7 }}
                  transition={{ duration: 0.22 }}
                >
                  {item.value}
                </motion.span>
              </AnimatePresence>

              <span className="editorial-countdown-label">{item.label}</span>
            </motion.div>
          ))}
        </div>
<p className="editorial-countdown-note">
  Jedva čekamo da zajedno obeležimo ovaj poseban trenutak.
</p>
        {showCalendarButton && (
          <div className="editorial-countdown-calendar-box">
            <button
              type="button"
              className="editorial-countdown-calendar-btn"
              onClick={handleCalendarClick}
            >
              <span>📅</span>
              {t.addCalendar}
            </button>

            <p className="editorial-countdown-calendar-hint">
              {t.calendarHint}
            </p>
          </div>
        )}
      </motion.div>
    </section>
  );
}