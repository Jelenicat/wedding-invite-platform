import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/rsvp.css";

function VideoBandCountdown({ targetDate }) {
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
      <section className="video-band-countdown-section">
        <div className="video-band-countdown-paper" />

        <motion.div
          className="video-band-countdown-inner video-band-countdown-inner-finished"
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="video-band-countdown-finished-script">
            Dan venčanja je stigao
          </p>
          <p className="video-band-countdown-finished-ring">💍</p>
        </motion.div>
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
      className="video-band-countdown-section"
      initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
    >
      <div className="video-band-countdown-paper" />

      <div className="video-band-countdown-shell">
        <div className="video-band-countdown-frame">
          <div className="video-band-countdown-inner">
            <p className="video-band-countdown-kicker">Do venčanja je ostalo</p>

            <p className="video-band-countdown-script">Odbrojavamo dane!</p>

            <div className="video-band-countdown-divider" />

            <div className="video-band-countdown">
              {items.map((item) => (
                <div key={item.label} className="video-band-countdown-item">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={item.value}
                      initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                      transition={{ duration: 0.24 }}
                    >
                      {item.value}
                    </motion.span>
                  </AnimatePresence>

                  <small>{item.label}</small>
                </div>
              ))}
            </div>

            <p className="video-band-countdown-note">
              Jedva čekamo da zajedno obeležimo ovaj poseban dan.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default VideoBandCountdown;