import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/rsvp.css";

function SplitVideoCountdown({ targetDate, details = {} }) {
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

  const themeStyles = {
    "--countdown-bg": theme.backgroundColor || "#f3ece6",
    "--countdown-main-text": theme.mainText || "#6f5b4f",
    "--countdown-soft-text": theme.softText || "#87756a",
    "--countdown-muted-text": theme.mutedText || "#8c7a6f",
    "--countdown-accent": theme.accent || "#8f8a64",
    "--countdown-accent-strong": theme.accentStrong || "#6e5a4e",
    "--countdown-card-bg": theme.cardBg || "rgba(255, 255, 255, 0.34)",
    "--countdown-card-border": theme.cardBorder || "rgba(145, 122, 108, 0.10)",
    "--countdown-divider": theme.dividerLine || "rgba(145, 122, 108, 0.38)",
    "--countdown-vignette": theme.vignetteColor || "rgba(0, 0, 0, 0.04)",
    "--countdown-shadow-soft": "rgba(88, 71, 60, 0.06)",
    "--countdown-shadow-hover": "rgba(88, 71, 60, 0.08)",
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const format = (num) => String(num).padStart(2, "0");

  if (!timeLeft) {
    return (
      <section className="split-video-countdown-section" style={themeStyles}>
        <div className="split-video-countdown-paper">
          <div className="split-video-countdown-inner">
            <p className="split-video-countdown-kicker">Naš dan je stigao</p>
            <h3 className="split-video-countdown-finished">
              Dan venčanja je stigao
            </h3>
          </div>
        </div>
      </section>
    );
  }

  const items = [
    { value: format(timeLeft.days), label: "dana" },
    { value: format(timeLeft.hours), label: "sati" },
    { value: format(timeLeft.minutes), label: "min" },
    { value: format(timeLeft.seconds), label: "sek" },
  ];

  return (
    <motion.section
      className="split-video-countdown-section"
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
            Do venčanja je ostalo
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
            Vidimo se da zajedno napravimo uspomene za pamćenje.
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
}

export default SplitVideoCountdown;