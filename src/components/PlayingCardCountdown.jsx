import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import "../styles/rsvp.css";
import { addToCalendar } from "../utils/calendar";

function getInitial(value = "") {
  const cleanValue = String(value).trim();
  if (!cleanValue) return "";
  return Array.from(cleanValue)[0].toUpperCase();
}

function PlayingCardCountdown({
  targetDate,
  brideName,
  groomName,
  details = {},
  script = "latin",
  slug,
}) {
  const isCyrillic = script === "cyrillic";

  const brideInitial = getInitial(brideName || "Jelisaveta");
  const groomInitial = getInitial(groomName || "Luka");

  const t = isCyrillic
    ? {
        arrived: "Дан венчања је стигао",
        remaining: "До венчања је остало",
        days: "дана",
        hours: "сати",
        minutes: "мин",
        seconds: "сек",
        note: "Једва чекамо да заједно прославимо овај посебан дан.",
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
        note: "Jedva čekamo da zajedno proslavimo ovaj poseban dan.",
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

  const format = (number) => String(number).padStart(2, "0");

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

  const items = timeLeft
    ? [
        { value: format(timeLeft.days), label: t.days },
        { value: format(timeLeft.hours), label: t.hours },
        { value: format(timeLeft.minutes), label: t.minutes },
        { value: format(timeLeft.seconds), label: t.seconds },
      ]
    : [];

  return (
    <motion.section
      className={`pc-countdown-section pc-countdown-slug-${slug || ""}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="pc-countdown-shell">
        <div className="pc-countdown-card">
          <div className="pc-countdown-frame" />

          <div className="pc-countdown-corner pc-countdown-corner-top">
            <span>{brideInitial}</span>
            <small>♥</small>
          </div>

          <div className="pc-countdown-corner pc-countdown-corner-bottom">
            <span>{groomInitial}</span>
            <small>♥</small>
          </div>

          <div className="pc-countdown-content">
            <p className="pc-countdown-kicker">
              {timeLeft ? t.remaining : t.arrived}
            </p>

            <div className="pc-countdown-hearts">
              <span>♥</span>
              <span>♥</span>
              <span>♥</span>
            </div>

            {timeLeft ? (
              <>
                <div className="pc-countdown-grid">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.label}
                      className="pc-countdown-item"
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: index * 0.06 }}
                      viewport={{ once: true }}
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

                <p className="pc-countdown-note">{t.note}</p>
              </>
            ) : (
              <p className="pc-countdown-note">{t.arrived}</p>
            )}

            {showCalendarButton && (
              <div className="pc-countdown-calendar-box">
                <button
                  type="button"
                  className="pc-countdown-calendar-btn"
                  onClick={handleCalendarClick}
                >
                  <span>♥</span>
                  {t.addCalendar}
                </button>

                <p>{t.calendarHint}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default PlayingCardCountdown;