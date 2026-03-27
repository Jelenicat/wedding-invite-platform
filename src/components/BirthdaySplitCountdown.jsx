import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/rsvp.css";

function BirthdaySplitCountdown({ targetDate, backgroundImage }) {
  const calculateTimeLeft = () => {
    const difference =
      new Date(targetDate).getTime() - new Date().getTime();

    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
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

  const units = timeLeft
    ? [
        { label: "Dana", value: format(timeLeft.days) },
        { label: "Sati", value: format(timeLeft.hours) },
        { label: "Minuta", value: format(timeLeft.minutes) },
        { label: "Sekundi", value: format(timeLeft.seconds) },
      ]
    : [];

  return (
    <section
      className="birthday-split-countdown-section"
      style={
        backgroundImage
          ? { "--birthday-split-countdown-bg": `url(${backgroundImage})` }
          : undefined
      }
    >
      <div className="birthday-split-countdown-bg" />
      <div className="birthday-split-countdown-overlay" />

      <motion.div
        className="birthday-split-countdown-card"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <p className="birthday-split-countdown-kicker">COUNTDOWN</p>

        <h2 className="birthday-split-countdown-title">
          Još malo do proslave
        </h2>

        <p className="birthday-split-countdown-subtitle">
          Odbrojavamo do jednog posebnog dana punog osmeha, igre i lepih uspomena.
        </p>

        {timeLeft ? (
          <div className="birthday-split-countdown-grid">
            {units.map((item) => (
              <div className="birthday-split-countdown-unit" key={item.label}>
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={item.value}
                    className="birthday-split-countdown-number"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22 }}
                  >
                    {item.value}
                  </motion.span>
                </AnimatePresence>
                <span className="birthday-split-countdown-label">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className="birthday-split-countdown-finished"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
          >
            Proslava je počela!
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

export default BirthdaySplitCountdown;