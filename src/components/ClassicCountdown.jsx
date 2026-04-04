import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/card.css";

function ClassicCountdown({ targetDate }) {
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

  if (!timeLeft) {
    return (
      <section className="classic-vertical-card classic-countdown-card">
        <div className="classic-vertical-inner classic-countdown-inner">
          <div className="classic-countdown-script">Countdown</div>
          <h3 className="classic-countdown-title">Naš dan je stigao ✨</h3>
        </div>
      </section>
    );
  }

  const items = [
    { label: "Dana", value: timeLeft.days },
    { label: "Sati", value: timeLeft.hours },
    { label: "Minuta", value: timeLeft.minutes },
    {
      label: timeLeft.seconds === 1 ? "Sekunda" : "Sekundi",
      value: timeLeft.seconds,
    },
  ];

  return (
    <section className="classic-vertical-card classic-countdown-card">
      <div className="classic-vertical-inner classic-countdown-inner">
        <div className="classic-countdown-script">Countdown</div>
        <h3 className="classic-countdown-title">Odbrojavanje do našeg dana</h3>

        <div className="classic-countdown-grid">
          {items.map((item) => (
            <div className="classic-countdown-item" key={item.label}>
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={item.value}
                  className="classic-countdown-value"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {String(item.value).padStart(2, "0")}
                </motion.div>
              </AnimatePresence>

              <div className="classic-countdown-label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ClassicCountdown;