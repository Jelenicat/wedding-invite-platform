import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import "../styles/rsvp.css";

function getTimeLeft(targetDate) {
  const difference = new Date(targetDate).getTime() - new Date().getTime();

  if (difference <= 0) {
    return {
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
    };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

function RetroCountdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const items = useMemo(
    () => [
      { label: "Dana", value: timeLeft.days },
      { label: "Sati", value: timeLeft.hours },
      { label: "Minuta", value: timeLeft.minutes },
      { label: "Sekundi", value: timeLeft.seconds },
    ],
    [timeLeft]
  );

  return (
    <section className="retro-countdown-section">
      <div className="retro-countdown-center">
        <motion.div
          className="retro-countdown-card"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
        >
          <p className="retro-countdown-kicker">Countdown</p>
          <h2 className="retro-countdown-title">Vidimo se uskoro</h2>
          <p className="retro-countdown-subtitle">
            Odbrojavamo do početka proslave.
          </p>

          <div className="retro-countdown-grid">
            {items.map((item) => (
              <div key={item.label} className="retro-countdown-box">
                <span className="retro-countdown-value">{item.value}</span>
                <span className="retro-countdown-label">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default RetroCountdown;