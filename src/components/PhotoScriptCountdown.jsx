import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/rsvp.css";

function PhotoScriptCountdown({
  targetDate,
  script = "latin",
  details = {},
}) {
  const theme = details.theme || {};

  const themeStyles = {
    "--photo-script-countdown-section-bg":
      theme.countdownSectionBg ||
      `linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.9) 20%,
        rgba(0, 0, 0, 0.9) 16%,
        rgba(0, 0, 0, 0.9) 38%,
        rgba(0, 0, 0, 0.9) 100%
      )`,
    "--photo-script-countdown-kicker":
      theme.countdownKicker || "rgba(255,255,255,0.56)",
    "--photo-script-countdown-divider-top":
      theme.countdownDividerTop ||
      theme.cardAccent ||
      theme.introAccent ||
      "rgba(203,116,116,0.3)",
    "--photo-script-countdown-number":
      theme.countdownNumber || "#f2e8e6",
    "--photo-script-countdown-label":
      theme.countdownLabel || "rgba(255,255,255,0.5)",
    "--photo-script-countdown-note":
      theme.countdownNote || "rgba(255,255,255,0.54)",
  };

  const t =
    script === "cyrillic"
      ? {
          arrived: "Дан венчања је стигао",
          remaining: "До венчања је остало",
          days: "дана",
          hours: "сати",
          minutes: "мин",
          seconds: "сек",
          note: "Једва чекамо да заједно обележимо овај посебан тренутак.",
        }
      : {
          arrived: "Dan venčanja je stigao",
          remaining: "Do venčanja je ostalo",
          days: "dana",
          hours: "sati",
          minutes: "min",
          seconds: "sek",
          note: "Jedva čekamo da zajedno obeležimo ovaj poseban trenutak.",
        };

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
      <section
        className="photo-script-countdown-section"
        style={themeStyles}
      >
        <div className="photo-script-countdown-inner">
          <p className="photo-script-countdown-kicker">{t.arrived}</p>
        </div>
      </section>
    );
  }

  const items = [
    { value: format(timeLeft.days), label: t.days },
    { value: format(timeLeft.hours), label: t.hours },
    { value: format(timeLeft.minutes), label: t.minutes },
    { value: format(timeLeft.seconds), label: t.seconds },
  ];

  return (
    <motion.section
      className="photo-script-countdown-section"
      style={themeStyles}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="photo-script-countdown-inner">
        <p className="photo-script-countdown-kicker">{t.remaining}</p>

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

        <p className="photo-script-countdown-note">{t.note}</p>
      </div>
    </motion.section>
  );
}

export default PhotoScriptCountdown;