import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import "../styles/rsvp.css";

function ElegantBlackCountdown({
  targetDate,
  slug,
  backgroundImage,
  script = "latin",
}) {
  const t =
    script === "cyrillic"
      ? {
          top: "ОДБРОЈАВАЊЕ ДО НАШЕГ ДАНА",
          title: "Odbrojavanje",
          subtitle: "Радујемо се сваком тренутку који нас дели до венчања.",
          expired: "Наш дан је стигао",
          labels: {
            days: "дана",
            hours: "сати",
            minutes: "минута",
            seconds: "секунди",
          },
        }
      : {
          top: "ODBROJAVANJE DO NAŠEG DANA",
          title: "Odbrojavanje",
          subtitle: "Radujemo se svakom trenutku koji nas deli do venčanja.",
          expired: "Naš dan je stigao",
          labels: {
            days: "dana",
            hours: "sati",
            minutes: "minuta",
            seconds: "sekundi",
          },
        };

  const calculateTimeLeft = useMemo(() => {
    return () => {
      if (!targetDate) {
        return null;
      }

      const diff = new Date(targetDate).getTime() - new Date().getTime();

      if (diff <= 0) {
        return {
          expired: true,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      }

      return {
        expired: false,
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const bg = backgroundImage || `/images/elegant-black/${slug}-intro.jpg`;
  const topOrnament = `/images/elegant-black/gore.svg`;
  const bottomOrnament = `/images/elegant-black/dole.svg`;

  if (!timeLeft) return null;

  const items = [
    { value: timeLeft.days, label: t.labels.days },
    { value: timeLeft.hours, label: t.labels.hours },
    { value: timeLeft.minutes, label: t.labels.minutes },
    { value: timeLeft.seconds, label: t.labels.seconds },
  ];

  return (
    <section className="elegant-black-countdown-section">
      <div
        className="elegant-black-countdown-bg"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="elegant-black-countdown-overlay" />
      <div className="elegant-black-countdown-vignette" />

      <motion.div
        className="elegant-black-countdown-card"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="elegant-black-countdown-top">{t.top}</p>

        <img
          src={topOrnament}
          alt=""
          className="elegant-black-countdown-ornament elegant-black-countdown-ornament-top"
        />

        <h2 className="elegant-black-countdown-title">{t.title}</h2>
        <p className="elegant-black-countdown-subtitle">{t.subtitle}</p>

        <img
          src={bottomOrnament}
          alt=""
          className="elegant-black-countdown-ornament elegant-black-countdown-ornament-bottom"
        />

        {timeLeft.expired ? (
          <div className="elegant-black-countdown-expired">{t.expired}</div>
        ) : (
          <div className="elegant-black-countdown-grid">
            {items.map((item, index) => (
              <motion.div
                key={index}
                className="elegant-black-countdown-box"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
              >
                <span className="elegant-black-countdown-number">
                  {String(item.value).padStart(2, "0")}
                </span>
                <span className="elegant-black-countdown-label">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}

export default ElegantBlackCountdown;