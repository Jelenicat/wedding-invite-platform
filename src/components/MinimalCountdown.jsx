import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/rsvp.css";
import { addToCalendar } from "../utils/calendar";

function MinimalCountdown({
  targetDate,
  brideName,
  groomName,
  details = {},
  script = "latin",
  slug,
  language = "sr",
}) {
  const t =
    language === "en"
      ? {
          arrived: "The wedding day has arrived",
          remaining: "Time until the wedding",
          days: "days",
          hours: "hours",
          minutes: "min",
          seconds: "sec",
          note: "We can’t wait to celebrate this special moment together.",
          addCalendar: "Add to calendar",
          calendarHint: "Save the wedding date on your phone.",
        }
      : script === "cyrillic"
        ? {
            arrived: "Дан венчања је стигао",
            remaining: "До венчања је остало",
            days: "дана",
            hours: "сати",
            minutes: "мин",
            seconds: "сек",
            note: "Једва чекамо да заједно обележимо овај посебан тренутак.",
            addCalendar: "Додај у календар",
            calendarHint: "Сачувајте датум венчања у свом телефону.",
          }
        : {
            arrived: "Dan venčanja je stigao",
            remaining: "Do venčanja je ostalo",
            days: "dana",
            hours: "sati",
            minutes: "min",
            seconds: "sek",
            note: "Jedva čekamo da zajedno obeležimo ovaj poseban trenutak.",
            addCalendar: "Dodaj u kalendar",
            calendarHint: "Sačuvajte datum venčanja u svom telefonu.",
          };

  const showCalendarButton = details?.showCalendarButton === true;

  const calculateTimeLeft = () => {
    const difference = new Date(targetDate).getTime() - new Date().getTime();

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

  const format = (num) => String(num).padStart(2, "0");

  const handleCalendarClick = () => {
    addToCalendar({
      brideName,
      groomName,
      dateISO: targetDate,
      venue: details?.venue,
      mapLink: details?.mapLink,
      note: details?.note,
      durationHours: details?.calendarDurationHours,
      language,
    });
  };

  if (!timeLeft) {
    return (
      <section
        className={`minimal-countdown-section minimal-countdown-slug-${
          slug || ""
        }`}
      >
        <div className="minimal-countdown-inner">
          <p className="minimal-countdown-kicker">{t.arrived}</p>

          {showCalendarButton && (
            <div className="minimal-countdown-calendar-box">
              <button
                type="button"
                className="minimal-countdown-calendar-btn"
                onClick={handleCalendarClick}
              >
                <span>📅</span>
                {t.addCalendar}
              </button>

              <p className="minimal-countdown-calendar-hint">
                {t.calendarHint}
              </p>
            </div>
          )}
        </div>
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
    <motion.section
      className={`minimal-countdown-section minimal-countdown-slug-${
        slug || ""
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="minimal-countdown-inner">
        <p className="minimal-countdown-kicker">{t.remaining}</p>

        <div className="minimal-countdown-divider" />

        <div className="minimal-countdown">
          {items.map((item, index) => (
            <motion.div
              key={item.label}
              className="minimal-countdown-item"
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

        <p className="minimal-countdown-note">{t.note}</p>

        {showCalendarButton && (
          <div className="minimal-countdown-calendar-box">
            <button
              type="button"
              className="minimal-countdown-calendar-btn"
              onClick={handleCalendarClick}
            >
              <span>📅</span>
              {t.addCalendar}
            </button>

            <p className="minimal-countdown-calendar-hint">
              {t.calendarHint}
            </p>
          </div>
        )}
      </div>
    </motion.section>
  );
}

export default MinimalCountdown;