import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import "../styles/rsvp.css";
import { addToCalendar } from "../utils/calendar";

const PassportCountdownMotionIcon = ({
  src,
  className = "",
  alt = "",
  useGold = false,
  style,
  ...props
}) => {
  if (!useGold) {
    return (
      <motion.img
        src={src}
        alt={alt}
        className={className}
        style={style}
        {...props}
      />
    );
  }

  return (
    <motion.span
      className={`${className} passport-countdown-gold-mask-icon`}
      style={{
        ...style,
        "--passport-countdown-gold-mask": `url(${src})`,
      }}
      {...props}
      aria-hidden={props["aria-hidden"] ?? true}
      role={!props["aria-hidden"] && alt ? "img" : undefined}
      aria-label={!props["aria-hidden"] && alt ? alt : undefined}
    />
  );
};

function PassportCountdown({
  targetDate,
  slug = "",
  theme = {},
  brideName,
  groomName,
  details = {},
}) {
  const isDorotejaMarko = slug === "doroteja-marko";

  const countdownBg = useMemo(() => {
    return `/images/passport/${slug}-card-bg.jpg`;
  }, [slug]);

  const passportCountdownThemeStyle = {
    "--passport-countdown-bg": `url(${countdownBg})`,

    "--passport-main": theme.main || "#f7efe4",
    "--passport-main-dark": theme.mainDark || "#efe1cd",
    "--passport-cream": theme.cream || "#fffbf5",
    "--passport-white": theme.white || "#ffffff",

    "--passport-text-main": theme.textMain || "#5f4a2d",
    "--passport-text-soft": theme.textSoft || "#8f7450",
    "--passport-text-muted": theme.textMuted || "#a08965",

    "--passport-card-overlay":
      theme.cardOverlay || "rgba(255, 251, 245, 0.82)",
    "--passport-card-border":
      theme.cardBorder || "rgba(177, 141, 83, 0.26)",

    "--passport-accent": theme.accent || "#b18d53",
    "--passport-accent-soft":
      theme.accentSoft || "rgba(180, 144, 84, 0.34)",

    "--passport-button-bg": theme.buttonBg || "#b18d53",
    "--passport-button-text": theme.buttonText || "#ffffff",

    "--passport-icon-filter": theme.iconFilter || "none",
  };

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

  const handleCalendarClick = () => {
    addToCalendar({
      brideName,
      groomName,
      dateISO: targetDate,
      venue: details?.venue,
      mapLink: details?.mapLink,
      note: details?.note,
    });
  };

  if (!targetDate || !timeLeft) return null;

  return (
    <section
      className={`passport-countdown-section ${
        isDorotejaMarko ? "passport-countdown-section--doroteja-marko" : ""
      }`}
      style={passportCountdownThemeStyle}
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

            <PassportCountdownMotionIcon
              src="/images/passport/heart-mini.svg"
              alt=""
              aria-hidden="true"
              useGold={isDorotejaMarko}
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

                    <div className="passport-countdown-label">
                      {item.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          <motion.div
            className="passport-countdown-calendar-box"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.18 }}
          >
       <button
  type="button"
  className="passport-countdown-calendar-btn"
  onClick={handleCalendarClick}
>
  {isDorotejaMarko ? (
    <span className="passport-countdown-calendar-icon" aria-hidden="true">
      <span />
    </span>
  ) : (
    <span aria-hidden="true">📅</span>
  )}

  <span className="passport-countdown-calendar-text">
    Dodaj u kalendar
  </span>
</button>

            <p className="passport-countdown-calendar-hint">
              Sačuvajte datum venčanja u svom telefonu.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

export default PassportCountdown;