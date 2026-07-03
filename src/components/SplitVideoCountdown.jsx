import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/rsvp.css";
import { addToCalendar } from "../utils/calendar";

function SplitVideoCountdown({
  targetDate,
  brideName,
  groomName,
  details = {},
  script = "latin",
  slug = "",
}) {
  const isCyrillic =
    script === "cyrillic" ||
    details.script === "cyrillic" ||
    /[А-Яа-яЉЊЋЂЏђћљњџ]/.test(`${brideName || ""} ${groomName || ""}`);

  const t = isCyrillic
    ? {
        arrivedKicker: "Наш дан је стигао",
        arrivedTitle: "Дан венчања је стигао",
        remaining: "До венчања је остало",
        days: "дана",
        hours: "сати",
        minutes: "мин",
        seconds: "сек",
        note: "Видимо се да заједно направимо успомене за памћење.",
        calendarButton: "Додај у календар",
        calendarHint: "Сачувајте датум венчања у свом телефону.",
      }
    : {
        arrivedKicker: "Naš dan je stigao",
        arrivedTitle: "Dan venčanja je stigao",
        remaining: "Do venčanja je ostalo",
        days: "dana",
        hours: "sati",
        minutes: "min",
        seconds: "sek",
        note: "Vidimo se da zajedno napravimo uspomene za pamćenje.",
        calendarButton: "Dodaj u kalendar",
        calendarHint: "Sačuvajte datum venčanja u svom telefonu.",
      };

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

  const theme = details.theme || {};
  const showCalendarButton = details?.showCalendarButton === true;

  const themeStyles = {
    "--countdown-bg": theme.backgroundColor || "#f3ece6",
    "--countdown-main-text": theme.mainText || "#6f5b4f",
    "--countdown-soft-text": theme.softText || "#87756a",
    "--countdown-muted-text": theme.mutedText || "#8c7a6f",
    "--countdown-accent": theme.accent || "#8f8a64",
    "--countdown-accent-strong": theme.accentStrong || "#6e5a4e",
    "--countdown-card-bg": theme.cardBg || "rgba(255, 255, 255, 0.34)",
    "--countdown-card-border":
      theme.cardBorder || "rgba(145, 122, 108, 0.10)",
    "--countdown-divider": theme.dividerLine || "rgba(145, 122, 108, 0.38)",
    "--countdown-vignette": theme.vignetteColor || "rgba(0, 0, 0, 0.04)",
    "--countdown-shadow-soft": "rgba(88, 71, 60, 0.06)",
    "--countdown-shadow-hover": "rgba(88, 71, 60, 0.08)",
  };

  const sectionClassName = `split-video-countdown-section ${
    isCyrillic ? "split-video-countdown-section--cyrillic" : ""
  } ${slug ? `split-video-countdown-${slug}` : ""}`;

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
      dateISO: targetDate || details?.dateISO,
      venue: details?.venue,
      mapLink: details?.mapLink,
      note: details?.note,
    });
  };

  const CalendarButton = () => {
    if (!showCalendarButton) return null;

    return (
      <div className="split-video-calendar-box">
        <button
          type="button"
          className="split-video-calendar-btn"
          onClick={handleCalendarClick}
        >
          <span>📅</span>
          {t.calendarButton}
        </button>

        <p className="split-video-calendar-hint">{t.calendarHint}</p>
      </div>
    );
  };

  if (!timeLeft) {
    return (
      <section className={sectionClassName} style={themeStyles}>
        <div className="split-video-countdown-paper">
          <div className="split-video-countdown-inner">
            <p className="split-video-countdown-kicker">{t.arrivedKicker}</p>

            <h3 className="split-video-countdown-finished">
              {t.arrivedTitle}
            </h3>

            <CalendarButton />
          </div>
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
      className={sectionClassName}
      style={themeStyles}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="split-video-countdown-paper">
        <div className="split-video-countdown-inner">
          <motion.p
            className="split-video-countdown-kicker"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t.remaining}
          </motion.p>

          <motion.div
            className="split-video-countdown-divider"
            initial={{ opacity: 0, scaleX: 0.7 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08 }}
          />

          <div className="split-video-countdown">
            {items.map((item, index) => (
              <motion.div
                key={item.label}
                className="split-video-countdown-item"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={item.value}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22 }}
                  >
                    {item.value}
                  </motion.span>
                </AnimatePresence>

                <small>{item.label}</small>
              </motion.div>
            ))}
          </div>

          <motion.p
            className="split-video-countdown-note"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.15 }}
          >
            {t.note}
          </motion.p>

          <CalendarButton />
        </div>
      </div>
    </motion.section>
  );
}

export default SplitVideoCountdown;