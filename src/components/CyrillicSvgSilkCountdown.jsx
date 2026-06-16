import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function getTimeLeft(targetDate) {
  const target = new Date(targetDate).getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (!targetDate || Number.isNaN(target) || diff <= 0) {
    return {
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

function formatGoogleDate(date) {
  const d = new Date(date);

  if (Number.isNaN(d.getTime())) return "";

  return d
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

function CyrillicSvgSilkCountdown({
  weddingDate,
  details = {},
  brideName,
  groomName,
}) {
  const namesSvg = details.namesSvg;
  const countdownDate = details.dateISO || weddingDate;
  const showCalendarButton = details?.showCalendarButton === true;

  const [timeLeft, setTimeLeft] = useState(() =>
    getTimeLeft(countdownDate)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(countdownDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [countdownDate]);

  const startDate = details.dateISO || weddingDate;
  const endDate = startDate
    ? new Date(new Date(startDate).getTime() + 3 * 60 * 60 * 1000)
    : null;

  const googleCalendarLink =
    startDate && endDate
      ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
          `Венчање - ${brideName} и ${groomName}`
        )}&dates=${formatGoogleDate(startDate)}/${formatGoogleDate(
          endDate
        )}&details=${encodeURIComponent(
          "Са радошћу вас очекујемо на нашем венчању."
        )}&location=${encodeURIComponent(details.venue || "")}`
      : "#";

  return (
    <motion.div
      className="csvg-countdown-box"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      {namesSvg && (
        <img
          src={namesSvg}
          alt={`${brideName} и ${groomName}`}
          className="csvg-countdown-names-svg"
        />
      )}

      <div className="csvg-countdown-divider">
        <span>♡</span>
      </div>

      <p className="csvg-countdown-small">До венчања је остало</p>

      <div className="csvg-countdown-grid">
        <div className="csvg-countdown-item">
          <span>{timeLeft.days}</span>
          <p>дана</p>
        </div>

        <div className="csvg-countdown-item">
          <span>{timeLeft.hours}</span>
          <p>сати</p>
        </div>

        <div className="csvg-countdown-item">
          <span>{timeLeft.minutes}</span>
          <p>минута</p>
        </div>

        <div className="csvg-countdown-item">
          <span>{timeLeft.seconds}</span>
          <p>секунди</p>
        </div>
      </div>

      {showCalendarButton && (
        <div className="csvg-calendar-add-wrap">
          <a
            href={googleCalendarLink}
            target="_blank"
            rel="noreferrer"
            className="csvg-calendar-add-btn"
          >
            Додај у календар
          </a>

          <p className="csvg-calendar-save-text">
            Сачувајте датум венчања у свом телефону
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default CyrillicSvgSilkCountdown;