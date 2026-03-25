import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/rsvp.css";

function BirthdayGalleryCountdown({ targetDate, backgroundImage }) {
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
      className="birthday-countdown-section"
      style={
        backgroundImage
          ? { "--birthday-countdown-bg": `url(${backgroundImage})` }
          : undefined
      }
    >
      <div className="birthday-countdown-bg-image" />
      <div className="birthday-countdown-overlay" />
      <div className="birthday-countdown-glow birthday-countdown-glow-one" />
      <div className="birthday-countdown-glow birthday-countdown-glow-two" />

      <motion.div
        className="birthday-countdown-card"
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <p className="birthday-countdown-kicker">COUNTDOWN</p>

        <h2 className="birthday-countdown-title">Još malo do proslave</h2>

        <p className="birthday-countdown-subtitle">
          Odbrojavamo do jednog posebnog dana punog osmeha, radosti i lepih uspomena.
        </p>

        {timeLeft ? (
          <div className="birthday-countdown-grid">
            {units.map((item) => (
              <div className="birthday-countdown-unit" key={item.label}>
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={item.value}
                    className="birthday-countdown-number"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22 }}
                  >
                    {item.value}
                  </motion.span>
                </AnimatePresence>
                <span className="birthday-countdown-label">{item.label}</span>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className="birthday-countdown-finished"
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

export default BirthdayGalleryCountdown;