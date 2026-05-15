import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/rsvp.css";
import { addToCalendar } from "../utils/calendar";

function DarkFloralCountdown({
  targetDate,
  brideName = "",
  groomName = "",
  details = {},
}) {
  const bg =
    details?.cardBackground ||
    details?.backgroundImage ||
    "/images/dark-floral-card.jpg";

  const finalDate = targetDate || details?.dateISO;

  const safeBrideName = brideName || details?.brideName || "Mlada";
  const safeGroomName = groomName || details?.groomName || "Mladoženja";

  const finalVenue =
    details?.venue ||
    details?.locationName ||
    details?.location ||
    "";

  const calculateTimeLeft = () => {
    if (!finalDate) return null;

    const difference = new Date(finalDate).getTime() - new Date().getTime();

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
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [finalDate]);

  const format = (num) => String(num).padStart(2, "0");

  const handleCalendarClick = () => {
    if (!finalDate) return;

    addToCalendar({
      brideName: safeBrideName,
      groomName: safeGroomName,
      dateISO: finalDate,
      venue: finalVenue,
      mapLink: details?.mapLink,
      note: details?.note,
    });
  };

  return (
    <section className="df-countdown-page">
      <div
        className="df-countdown-bg"
        style={{ backgroundImage: `url(${bg})` }}
      />

      <div className="df-countdown-overlay" />

      <motion.div
        className="df-countdown-content"
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <div className="df-rsvp-ornament">✦</div>

        <p className="df-countdown-subtitle">
          {timeLeft ? (
            <>
              Brojimo dane
              <br />
              do našeg venčanja
            </>
          ) : (
            <>Dan venčanja je stigao</>
          )}
        </p>

        {timeLeft && (
          <div className="df-countdown-grid">
            {[
              { value: format(timeLeft.days), label: "Dana" },
              { value: format(timeLeft.hours), label: "Sati" },
              { value: format(timeLeft.minutes), label: "Minuta" },
              { value: format(timeLeft.seconds), label: "Sekundi" },
            ].map((item) => (
              <div key={item.label}>
                <AnimatePresence mode="wait">
                  <motion.strong
                    key={item.value}
                    initial={{ opacity: 0, y: 7 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -7 }}
                    transition={{ duration: 0.22 }}
                  >
                    {item.value}
                  </motion.strong>
                </AnimatePresence>

                <span>{item.label}</span>
              </div>
            ))}
          </div>
        )}

        {details?.showCalendarButton && finalDate && (
          <button
            type="button"
            className="df-countdown-calendar-btn"
            onClick={handleCalendarClick}
          >
            Dodaj u kalendar
          </button>
        )}
      </motion.div>
    </section>
  );
}

export default DarkFloralCountdown;