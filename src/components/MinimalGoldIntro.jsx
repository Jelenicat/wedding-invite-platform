import { motion } from "framer-motion";
import "../styles/intro.css";

function MinimalGoldIntro({
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  introText,
  backgroundImage,
  onEnter,
  script = "latin",
  details = {},
}) {
  const [day = "10", month = "OKT", year = "2026"] = weddingDate
    ? weddingDate.split(" ")
    : ["10", "OKT", "2026"];

  const finalBg = backgroundImage || "/images/minimal-gold-bg.jpg";

  const t =
    script === "cyrillic"
      ? {
          invitation: "ПОЗИВНИЦА",
          day: "ДАН",
          defaultText:
            "Са великом радошћу вас позивамо да својим присуством улепшате наш посебан дан.",
          open: "ОТВОРИ ПОЗИВНИЦУ",
        }
      : {
          invitation: "POZIVNICA",
          day: "DAN",
          defaultText: "Što Bog združi, čovjek neka ne rastavlja.",
          open: "OTVORI POZIVNICU",
        };

  const displayText = introText || details?.mainQuote || t.defaultText;

  return (
    <section className="minimal-gold-intro-v2">
      <div
        className="minimal-gold-intro-v2-bg"
        style={{ backgroundImage: `url(${finalBg})` }}
      />

      <div className="minimal-gold-intro-v2-fade" />

      <motion.div
        className="minimal-gold-intro-v2-card"
        initial={{ opacity: 0, y: 20, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <div className="minimal-gold-frame" />

        <motion.p
          className="minimal-gold-top-title"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.15 }}
        >
          {t.invitation}
        </motion.p>

        <motion.div
          className="minimal-gold-arch"
          initial={{ opacity: 0, scaleY: 0.96 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 0.9, delay: 0.25 }}
        />

        <motion.h1
          className="minimal-gold-script-names"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45 }}
        >
           <span>{groomName}</span>

          <span className="minimal-gold-amp" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M12 20
                   c-6-4.5-9-7.5-9-11
                   c0-2.5 2-4.5 4.5-4.5
                   c1.5 0 3 .8 4.5 2.3
                   c1.5-1.5 3-2.3 4.5-2.3
                   C19 4.5 21 6.5 21 9
                   c0 3.5-3 6.5-9 11z"
              />
            </svg>
          </span>

         
           <span>{brideName}</span>
        </motion.h1>

        <motion.div
          className="minimal-gold-date-row"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.65 }}
        >
          <div className="minimal-gold-date-box">
            <span className="minimal-gold-date-label">{t.day}</span>
            <span className="minimal-gold-date-line" />
          </div>

          <div className="minimal-gold-date-center">
            <span className="minimal-gold-date-month">{month}</span>
            <span className="minimal-gold-date-day">{day}</span>
            <span className="minimal-gold-date-year">{year}</span>
          </div>

          <div className="minimal-gold-date-box">
            <span className="minimal-gold-date-label">
              {weddingTime || "17:30"}
            </span>
            <span className="minimal-gold-date-line" />
          </div>
        </motion.div>

        <motion.div
          className="minimal-gold-quote-wrap"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.82 }}
        >
          <span className="minimal-gold-quote-line" />

          <p className="minimal-gold-bottom-text">{displayText}</p>

          <span className="minimal-gold-quote-line" />
        </motion.div>

        <motion.button
          type="button"
          className="minimal-gold-open-btn"
          onClick={onEnter}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 1 }}
        >
          {t.open}
        </motion.button>
      </motion.div>
    </section>
  );
}

export default MinimalGoldIntro;