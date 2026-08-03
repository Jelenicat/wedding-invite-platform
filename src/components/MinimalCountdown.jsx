import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/rsvp.css";
import { addToCalendar } from "../utils/calendar";

function MinimalCountdown({
  targetDate,
  brideName,
  groomName,
  details = {},
  script = "latin",
  slug,
  language = "sr",
}) {
  const t =
    language === "en"
      ? {
          arrived: "The wedding day has arrived",
          remaining: "Time until the wedding",
          days: "days",
          hours: "hours",
          minutes: "min",
          seconds: "sec",
          note: "We can’t wait to celebrate this special moment together.",
          addCalendar: "Add to calendar",
          calendarHint: "Save the wedding date on your phone.",
        }
      : script === "cyrillic"
        ? {
            arrived: "Дан венчања је стигао",
            remaining: "До венчања је остало",
            days: "дана",
            hours: "сати",
            minutes: "мин",
            seconds: "сек",
            note: "Једва чекамо да заједно обележимо овај посебан тренутак.",
            addCalendar: "Додај у календар",
            calendarHint: "Сачувајте датум венчања у свом телефону.",
          }
        : {
            arrived: "Dan venčanja je stigao",
            remaining: "Do venčanja je ostalo",
            days: "dana",
            hours: "sati",
            minutes: "min",
            seconds: "sek",
            note: "Jedva čekamo da zajedno obeležimo ovaj poseban trenutak.",
            addCalendar: "Dodaj u kalendar",
            calendarHint: "Sačuvajte datum venčanja u svom telefonu.",
          };

  const showCalendarButton = details?.showCalendarButton === true;

  const calculateTimeLeft = () => {
    const difference = new Date(targetDate).getTime() - new Date().getTime();

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

  const handleCalendarClick = () => {
    addToCalendar({
      brideName,
      groomName,
      dateISO: targetDate,
      venue: details?.venue,
      mapLink: details?.mapLink,
      note: details?.note,
      durationHours: details?.calendarDurationHours,
      language,
    });
  };


  const marijaNikolaExtraSection =
    slug === "marija-nikola" ? (
      <motion.div
        className="minimal-marija-nikola-info"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.08 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="minimal-marija-nikola-info-heading">
          <p className="minimal-marija-nikola-info-kicker">
            Važne informacije
          </p>

          <h2>Dobro je znati</h2>

          <div className="minimal-marija-nikola-info-divider" />
        </div>

        <div className="minimal-marija-nikola-info-list">
          <div className="minimal-marija-nikola-info-item">
            <div
              className="minimal-marija-nikola-info-icon"
              aria-hidden="true"
            >
              <svg viewBox="0 0 32 32">
                <path d="M16 26.5S5.5 20.3 5.5 12.6A5.1 5.1 0 0 1 10.7 7.5c2.3 0 4.2 1.3 5.3 3.1 1.1-1.8 3-3.1 5.3-3.1a5.1 5.1 0 0 1 5.2 5.1C26.5 20.3 16 26.5 16 26.5Z" />
              </svg>
            </div>

            <div className="minimal-marija-nikola-info-copy">
              <h3>Deca</h3>
              <p>
                Slobodno povedite i decu — radujemo se najmlađim gostima.
              </p>
            </div>
          </div>

          <div className="minimal-marija-nikola-info-item">
            <div
              className="minimal-marija-nikola-info-icon"
              aria-hidden="true"
            >
              <svg viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="11.5" />
                <path d="M12.5 23V9h4.8a4.4 4.4 0 0 1 0 8.8h-4.8" />
              </svg>
            </div>

          <div className="minimal-marija-nikola-info-copy">
  <h3>Parking</h3>

  <p className="minimal-marija-nikola-parking-name">
    JKP &quot;Donji grad&quot;
  </p>

  <p className="minimal-marija-nikola-info-note">
    Parking nije obezbeđen u okviru restorana.
  </p>
</div>
          </div>
        </div>

     <div className="minimal-marija-nikola-closing">
  <span
    className="minimal-marija-nikola-closing-heart"
    aria-hidden="true"
  >
    ♡
  </span>

  <p>
    Radujemo se zajedničkim trenucima, osmesima, zagrljajima i suzama
    radosnicama.
  </p>

  <div className="minimal-marija-nikola-signature">
    Marija &amp; Nikola
  </div>
</div>
      </motion.div>
    ) : null;

  if (!timeLeft) {
    return (
      <section
        className={`minimal-countdown-section minimal-countdown-slug-${
          slug || ""
        }`}
      >
        <div className="minimal-countdown-inner">
          <p className="minimal-countdown-kicker">{t.arrived}</p>

          {showCalendarButton && (
            <div className="minimal-countdown-calendar-box">
              <button
                type="button"
                className="minimal-countdown-calendar-btn"
                onClick={handleCalendarClick}
              >
                <span>📅</span>
                {t.addCalendar}
              </button>

              <p className="minimal-countdown-calendar-hint">
                {t.calendarHint}
              </p>
            </div>
          )}

          {marijaNikolaExtraSection}
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
      className={`minimal-countdown-section minimal-countdown-slug-${
        slug || ""
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="minimal-countdown-inner">
        <p className="minimal-countdown-kicker">{t.remaining}</p>

        <div className="minimal-countdown-divider" />

        <div className="minimal-countdown">
          {items.map((item, index) => (
            <motion.div
              key={item.label}
              className="minimal-countdown-item"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              viewport={{ once: true }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={item.value}
                  initial={{ opacity: 0, y: 7 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -7 }}
                  transition={{ duration: 0.22 }}
                >
                  {item.value}
                </motion.span>
              </AnimatePresence>

              <small>{item.label}</small>
            </motion.div>
          ))}
        </div>

        <p className="minimal-countdown-note">{t.note}</p>

        {showCalendarButton && (
          <div className="minimal-countdown-calendar-box">
            <button
              type="button"
              className="minimal-countdown-calendar-btn"
              onClick={handleCalendarClick}
            >
              <span>📅</span>
              {t.addCalendar}
            </button>

            <p className="minimal-countdown-calendar-hint">
              {t.calendarHint}
            </p>
          </div>
        )}

        {marijaNikolaExtraSection}
      </div>
    </motion.section>
  );
}

export default MinimalCountdown;