import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/rsvp.css";

function PhotoScriptCountdown({ targetDate }) {
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
      <section className="photo-script-countdown-section">
        <div className="photo-script-countdown-inner">
          <p className="photo-script-countdown-kicker">Dan venčanja je stigao</p>
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
      className="photo-script-countdown-section"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="photo-script-countdown-inner">
        <p className="photo-script-countdown-kicker">Do venčanja je ostalo</p>

        <div className="photo-script-countdown-divider" />

        <div className="photo-script-countdown">
          {items.map((item) => (
            <div key={item.label} className="photo-script-countdown-item">
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

        <p className="photo-script-countdown-note">
          Jedva čekamo da zajedno obeležimo ovaj poseban trenutak.
        </p>
      </div>
    </motion.section>
  );
}

export default PhotoScriptCountdown;