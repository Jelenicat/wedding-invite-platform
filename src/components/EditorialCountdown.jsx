import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function EditorialCountdown({ targetDate }) {
  const calculateTimeLeft = () => {
    const difference = new Date(targetDate) - new Date();

    if (difference <= 0) {
      return {
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      };
    }

    const days = String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, "0");
    const hours = String(
      Math.floor((difference / (1000 * 60 * 60)) % 24)
    ).padStart(2, "0");
    const minutes = String(
      Math.floor((difference / (1000 * 60)) % 60)
    ).padStart(2, "0");
    const seconds = String(
      Math.floor((difference / 1000) % 60)
    ).padStart(2, "0");

    return { days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <section className="editorial-countdown-section">
      <motion.div
        className="editorial-countdown-card"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="editorial-countdown-title">COUNTDOWN</h2>
        <div className="editorial-countdown-script">until our day</div>

        <div className="editorial-countdown-grid">
          <div className="editorial-countdown-item">
            <span className="editorial-countdown-number">{timeLeft.days}</span>
            <span className="editorial-countdown-label">Dana</span>
          </div>

          <div className="editorial-countdown-item">
            <span className="editorial-countdown-number">{timeLeft.hours}</span>
            <span className="editorial-countdown-label">Sati</span>
          </div>

          <div className="editorial-countdown-item">
            <span className="editorial-countdown-number">{timeLeft.minutes}</span>
            <span className="editorial-countdown-label">Min</span>
          </div>

          <div className="editorial-countdown-item">
            <span className="editorial-countdown-number">{timeLeft.seconds}</span>
            <span className="editorial-countdown-label">Sek</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}