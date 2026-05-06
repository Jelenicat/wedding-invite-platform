import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/rsvp.css";
import { addToCalendar } from "../utils/calendar";

function FloralCountdown({
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

  const sectionVariants = {
    hidden: { opacity: 0, y: 28, scale: 0.985, filter: "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.08,
        delayChildren: 0.08,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 18, scale: 0.96 },
    show: (index) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.65,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const calendarBox = showCalendarButton ? (
    <motion.div className="floral-countdown-calendar-box" variants={fadeUp}>
      <button
        type="button"
        className="floral-countdown-calendar-btn"
        onClick={handleCalendarClick}
      >
        <span>📅</span>
        Dodaj u kalendar
      </button>

      <p className="floral-countdown-calendar-hint">
        Sačuvajte datum venčanja u svom telefonu.
      </p>
    </motion.div>
  ) : null;

  if (!timeLeft) {
    return (
      <motion.section
        className="floral-countdown-section floral-countdown-finished-section"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <motion.div className="floral-countdown-inner" variants={fadeUp}>
          <motion.p className="floral-countdown-kicker" variants={fadeUp}>
            Poseban dan je stigao
          </motion.p>

          <motion.div className="floral-countdown-divider" variants={fadeUp} />

          <motion.h3
            className="floral-countdown-finished-title"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            Dan venčanja je stigao ✨
          </motion.h3>

          <motion.p
            className="floral-countdown-note"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Hvala vam što ste deo naše priče.
          </motion.p>

          {calendarBox}
        </motion.div>
      </motion.section>
    );
  }

  const items = [
    {
      value: format(timeLeft.days),
      label: "dana",
      isWide: String(timeLeft.days).length >= 3,
    },
    { value: format(timeLeft.hours), label: "sati", isWide: false },
    { value: format(timeLeft.minutes), label: "min", isWide: false },
    { value: format(timeLeft.seconds), label: "sek", isWide: false },
  ];

  return (
    <motion.section
      className="floral-countdown-section"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <div className="floral-countdown-inner">
        <motion.p className="floral-countdown-kicker" variants={fadeUp}>
          Do venčanja je ostalo
        </motion.p>

        <motion.div className="floral-countdown-divider" variants={fadeUp} />

        <motion.div className="floral-countdown" variants={fadeUp}>
          {items.map((item, index) => (
            <motion.div
              key={item.label}
              className={`floral-countdown-item ${
                item.isWide ? "is-wide" : ""
              }`}
              custom={index}
              variants={cardVariants}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            >
              <div className="floral-countdown-number-wrap">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={item.value}
                    className="floral-countdown-number"
                    initial={{
                      opacity: 0,
                      y: 10,
                      scale: 0.94,
                      filter: "blur(4px)",
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      filter: "blur(0px)",
                    }}
                    exit={{
                      opacity: 0,
                      y: -10,
                      scale: 0.96,
                      filter: "blur(4px)",
                    }}
                    transition={{
                      duration: 0.26,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {item.value}
                  </motion.span>
                </AnimatePresence>
              </div>

              <small>{item.label}</small>
            </motion.div>
          ))}
        </motion.div>

        <motion.p className="floral-countdown-note" variants={fadeUp}>
          Jedva čekamo da zajedno obeležimo ovaj poseban trenutak.
        </motion.p>

        {calendarBox}
      </div>
    </motion.section>
  );
}

export default FloralCountdown;