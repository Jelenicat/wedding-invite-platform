import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/rsvp.css";
import { addToCalendar } from "../utils/calendar";

function SilkDateFlowCountdown({
  targetDate,
  brideName,
  groomName,
  details = {},
  backgroundImage,
  script = "latin",
}) {
  const isCyrillic = script === "cyrillic";

  const bg =
    details.countdownBackground ||
    details.scheduleBackground ||
    details.cardBackground ||
    details.backgroundImage ||
    backgroundImage ||
    "/images/silk-date-flow-bg.jpg";

  const t = isCyrillic
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

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

  useEffect(() => {
    if (!targetDate) return;

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

  if (!targetDate) return null;

  if (!timeLeft) {
    return (
      <section
        className="sdf-countdown-section"
        style={{
          "--sdf-countdown-bg": `url(${bg})`,
        }}
      >
        <motion.div
          className="sdf-countdown-inner"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="sdf-countdown-kicker">
            {brideName} <span>&</span> {groomName}
          </p>

          <h2 className="sdf-countdown-title">{t.arrived}</h2>

          <div className="sdf-countdown-calendar-box">
            <button
              type="button"
              className="sdf-countdown-calendar-btn"
              onClick={handleCalendarClick}
            >
              <span>📅</span>
              {t.addCalendar}
            </button>

            <p className="sdf-countdown-calendar-hint">{t.calendarHint}</p>
          </div>
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
      className="sdf-countdown-section"
      style={{
        "--sdf-countdown-bg": `url(${bg})`,
      }}
    >
      <motion.div
        className="sdf-countdown-inner"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="sdf-countdown-kicker">
          {brideName} <span>&</span> {groomName}
        </p>

        <h2 className="sdf-countdown-title">{t.remaining}</h2>

        <div className="sdf-countdown-grid">
          {items.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
            >
              <AnimatePresence mode="wait">
                <motion.strong
                  key={item.value}
                  initial={{ opacity: 0, y: 7 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -7 }}
                  transition={{ duration: 0.22 }}
                >
                  {item.value}
                </motion.strong>
              </AnimatePresence>

              <span>{item.label}</span>
            </motion.div>
          ))}
        </div>

        <p className="sdf-countdown-note">
          {details.countdownText || details.countdownNote || t.note}
        </p>

        <div className="sdf-countdown-calendar-box">
          <button
            type="button"
            className="sdf-countdown-calendar-btn"
            onClick={handleCalendarClick}
          >
            <span>📅</span>
            {t.addCalendar}
          </button>

          <p className="sdf-countdown-calendar-hint">{t.calendarHint}</p>
        </div>
      </motion.div>
    </section>
  );
}

export default SilkDateFlowCountdown;