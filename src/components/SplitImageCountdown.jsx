import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/rsvp.css";

function SplitImageCountdown({ targetDate }) {
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

  if (!timeLeft) {
    return (
      <section className="split-image-countdown-section">
        <div className="split-image-countdown-inner">
          <p className="split-image-countdown-kicker">Dan venčanja je stigao</p>
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
      className="split-image-countdown-section"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="split-image-countdown-inner">
        <p className="split-image-countdown-kicker">Do venčanja je ostalo</p>

        <div className="split-image-countdown-divider" />

        <div className="split-image-countdown">
          {items.map((item) => (
            <div key={item.label} className="split-image-countdown-item">
              <AnimatePresence mode="wait">
                <motion.span
                  key={item.value}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {item.value}
                </motion.span>
              </AnimatePresence>

              <small>{item.label}</small>
            </div>
          ))}
        </div>

        <p className="split-image-countdown-note">
          Jedva čekamo da zajedno obeležimo ovaj poseban trenutak.
        </p>
      </div>
    </motion.section>
  );
}

export default SplitImageCountdown;