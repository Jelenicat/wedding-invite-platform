import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/rsvp.css";

function AngelCountdown({ targetDate }) {
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

  if (!timeLeft) return null;

  const items = [
    { label: "Dana", value: timeLeft.days },
    { label: "Sati", value: timeLeft.hours },
    { label: "Minuta", value: timeLeft.minutes },
    { label: timeLeft.seconds === 1 ? "Sekunda" : "Sekundi", value: timeLeft.seconds },
  ];

  return (
    <section className="angel-countdown-section">
      <div className="angel-countdown-shell">
        <div className="angel-countdown-frame-outer">
          <motion.div
            className="angel-countdown-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7 }}
          >
            <div className="angel-countdown-frame" />
            <div className="angel-countdown-frame angel-countdown-frame-second" />

            <div className="angel-countdown-heading">
              <div className="angel-countdown-script">Countdown</div>
              <h2 className="angel-countdown-title">
                Odbrojavanje do našeg dana
              </h2>
            </div>

            <div className="angel-countdown-grid">
              {items.map((item) => (
                <div className="angel-countdown-item" key={item.label}>
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={item.value}
                      className="angel-countdown-value"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                    >
                      {String(item.value).padStart(2, "0")}
                    </motion.div>
                  </AnimatePresence>

                  <div className="angel-countdown-label">{item.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AngelCountdown;