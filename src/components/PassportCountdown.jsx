import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import "../styles/rsvp.css";

function PassportCountdown({ targetDate, slug = "" }) {
  const countdownBg = useMemo(() => {
    return `/images/passport/${slug}-card-bg.jpg`;
  }, [slug]);

  const calculateTimeLeft = useMemo(() => {
    return () => {
      if (!targetDate) return null;

      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference <= 0) {
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
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateTimeLeft]);

  if (!targetDate || !timeLeft) return null;

  return (
    <section
      className="passport-countdown-section"
      style={{ "--passport-countdown-bg": `url(${countdownBg})` }}
    >
      <motion.div
        className="passport-countdown-card"
        initial={{ opacity: 0, y: 36, scale: 0.985 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="passport-countdown-bg-parallax"
          animate={{ y: [0, -8, 0], scale: [1, 1.02, 1] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />

        <div className="passport-countdown-paper" />

        <div className="passport-countdown-inner">
          <motion.div
            className="passport-countdown-topline"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <span />
            <motion.img
              src="/images/passport/plane-mini.svg"
              alt=""
              aria-hidden="true"
              className="passport-countdown-plane"
              animate={{ y: [0, -3, 0], rotate: [0, -4, 0] }}
              transition={{
                duration: 4.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span />
          </motion.div>

          <motion.h2
            className="passport-countdown-title"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            ODBROJAVANJE
          </motion.h2>

          <motion.div
            className="passport-countdown-heart-wrap"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08 }}
          >
            <span className="passport-countdown-heart-line" />
            <motion.img
              src="/images/passport/heart-mini.svg"
              alt=""
              aria-hidden="true"
              className="passport-countdown-heart"
              animate={{ scale: [1, 1.08, 1], opacity: [0.9, 1, 0.9] }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span className="passport-countdown-heart-line" />
          </motion.div>

          {timeLeft.expired ? (
            <motion.div
              className="passport-countdown-expired"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Naš dan je stigao 💛
            </motion.div>
          ) : (
            <>
              <motion.p
                className="passport-countdown-subtitle"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.12 }}
              >
                Brojimo sitno do našeg najlepšeg dana
              </motion.p>

              <div className="passport-countdown-grid">
                {[
                  { value: timeLeft.days, label: "Dana" },
                  { value: timeLeft.hours, label: "Sati" },
                  { value: timeLeft.minutes, label: "Minuta" },
                  { value: timeLeft.seconds, label: "Sekundi" },
                ].map((item, index) => (
                  <motion.div
                    className="passport-countdown-item"
                    key={item.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.45,
                      delay: 0.08 + index * 0.06,
                    }}
                  >
                    <motion.div
                      className="passport-countdown-number"
                      key={`${item.label}-${item.value}`}
                      initial={{ opacity: 0.45, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22 }}
                    >
                      {String(item.value).padStart(2, "0")}
                    </motion.div>
                    <div className="passport-countdown-label">{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </section>
  );
}

export default PassportCountdown;