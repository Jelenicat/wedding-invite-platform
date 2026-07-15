import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { addToCalendar } from "../utils/calendar";
import "../styles/rsvp.css";

function SilkPhotoCountdown({
  targetDate,
  brideName,
  groomName,
  details = {},
  script = "latin",
  slug = "",
}) {
  const isCyrillic =
    script === "cyrillic" ||
    details.script === "cyrillic" ||
    /[А-Яа-яЉЊЋЂЏђћљњџ]/.test(`${brideName || ""} ${groomName || ""}`);

  const t = isCyrillic
    ? {
        kicker: "Одбројавамо заједно",
        title: "До нашег дана је остало",
        days: "дана",
        hours: "сати",
        minutes: "минута",
        seconds: "секунди",
        note: "Једва чекамо да овај посебан дан поделимо са вама.",
        arrived: "Наш дан је стигао",
        arrivedNote: "Видимо се на прослави!",
        addToCalendar: "Додај у календар",
        calendarHint: "Сачувајте датум у свом телефону.",
      }
    : {
        kicker: "Odbrojavamo zajedno",
        title: "Do našeg dana je ostalo",
        days: "dana",
        hours: "sati",
        minutes: "minuta",
        seconds: "sekundi",
        note: "Jedva čekamo da ovaj poseban dan podelimo sa vama.",
        arrived: "Naš dan je stigao",
        arrivedNote: "Vidimo se na proslavi!",
        addToCalendar: "Dodaj u kalendar",
        calendarHint: "Sačuvajte datum u svom telefonu.",
      };

  const calculateTimeLeft = () => {
    const target = new Date(targetDate).getTime();
    if (Number.isNaN(target)) return null;

    const difference = target - Date.now();
    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / 86_400_000),
      hours: Math.floor((difference / 3_600_000) % 24),
      minutes: Math.floor((difference / 60_000) % 60),
      seconds: Math.floor((difference / 1_000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);
  const theme = details.theme || {};
  const showCalendarButton = details.showCalendarButton === true;
  const sectionImage =
    details.countdownBackgroundImage ||
    details.sectionBackgroundImage ||
    details.cardBackgroundImage;

  const sectionStyle = {
    "--silk-photo-section-bg": theme.backgroundColor || "#eee7df",
    "--silk-photo-main-text": theme.mainText || "#58483f",
    "--silk-photo-soft-text": theme.softText || "#7d6b60",
    "--silk-photo-accent": theme.accent || "#b79163",
    "--silk-photo-accent-strong": theme.accentStrong || "#8d6742",
    "--silk-photo-button-text": theme.rsvpButtonText || "#fffaf5",
    "--silk-photo-light-panel": theme.cardBg || "rgba(255, 255, 255, 0.62)",
    "--silk-photo-light-border": theme.cardBorder || "rgba(120, 91, 67, 0.18)",
    "--silk-photo-section-overlay":
      theme.sectionOverlay || "rgba(244, 238, 231, 0.9)",
    backgroundImage: sectionImage ? `url(${sectionImage})` : undefined,
    backgroundPosition: details.sectionBackgroundPosition || "center",
  };

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [targetDate]);

  const handleCalendarClick = () => {
    addToCalendar({
      brideName,
      groomName,
      dateISO: targetDate || details.dateISO,
      venue: details.venue,
      mapLink: details.mapLink,
      note: details.note,
    });
  };

  const formatNumber = (value) => String(value).padStart(2, "0");

  const CalendarButton = () => {
    if (!showCalendarButton) return null;

    return (
      <div className="silk-photo-countdown__calendar">
        <button type="button" onClick={handleCalendarClick}>
          <span aria-hidden="true">♡</span>
          {details.calendarButtonText || t.addToCalendar}
        </button>
        <p>{details.calendarHint || t.calendarHint}</p>
      </div>
    );
  };

  const items = timeLeft
    ? [
        { value: timeLeft.days, label: t.days },
        { value: timeLeft.hours, label: t.hours },
        { value: timeLeft.minutes, label: t.minutes },
        { value: timeLeft.seconds, label: t.seconds },
      ]
    : [];

  return (
    <motion.section
      className={`silk-photo-countdown ${
        isCyrillic ? "silk-photo-countdown--cyrillic" : ""
      } ${slug ? `silk-photo-countdown--${slug}` : ""}`}
      style={sectionStyle}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.75 }}
    >
      <div className="silk-photo-section__overlay" />

      <div className="silk-photo-countdown__shell">
        <p className="silk-photo-section__script">
          {details.countdownKicker || t.kicker}
        </p>

        <h2 className="silk-photo-section__title">
          {timeLeft
            ? details.countdownTitle || t.title
            : details.countdownFinishedTitle || t.arrived}
        </h2>

        <div className="silk-photo-section__ornament" aria-hidden="true">
          <span />
          <b>◆</b>
          <span />
        </div>

        {timeLeft ? (
          <div className="silk-photo-countdown__grid">
            {items.map((item) => (
              <div className="silk-photo-countdown__item" key={item.label}>
                <AnimatePresence mode="wait">
                  <motion.strong
                    key={item.value}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {formatNumber(item.value)}
                  </motion.strong>
                </AnimatePresence>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="silk-photo-countdown__finished">
            {details.countdownFinishedNote || t.arrivedNote}
          </p>
        )}

        {timeLeft && (
          <p className="silk-photo-countdown__note">
            {details.countdownNote || t.note}
          </p>
        )}

        <CalendarButton />
      </div>
    </motion.section>
  );
}

export default SilkPhotoCountdown;
