import { motion } from "framer-motion";
import "../styles/birthdayintro.css";

function BirthdayLuxuryIntro({
  brideName,
  weddingDate,
  venue,
  backgroundImage,
  details = {},
  onEnter,
}) {
  const age = details.age || 18;
  const displayName = brideName || "Đorđe";
  const date = weddingDate || details.date || "27 • 06 • 2026";
  const location = venue || details.venue || "Cotier";

  return (
    <section className="blux-intro">
      <div
        className="blux-bg"
        style={{
          backgroundImage: `url(${backgroundImage || "/images/djordje-18-bg.jpg"})`,
        }}
      />

      <div className="blux-dark-overlay" />
      <div className="blux-gold-glow blux-gold-glow-1" />
      <div className="blux-gold-glow blux-gold-glow-2" />

      <motion.div
        className="blux-frame"
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />

      <div className="blux-content">
      <motion.h1
  className="blux-name-top"
  initial={{ opacity: 0, y: 18 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.9, delay: 0.2 }}
>
  {displayName.toLocaleUpperCase("sr-RS")}
</motion.h1>
        
        <motion.div
          className="blux-top"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
        >
          <span>PROSLAVLJA</span>
        </motion.div>

        <motion.div
          className="blux-age-wrap"
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.5, ease: "easeOut" }}
        >
          <div className="blux-age">{age}</div>
          <div className="blux-age-dot">.</div>
          <div className="blux-age-light" />
        </motion.div>

        <motion.div
          className="blux-birthday-label"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
        >
          rođendan
        </motion.div>

        <motion.div
          className="blux-divider"
          initial={{ opacity: 0, scaleX: 0.5 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <span />
        </motion.div>

        <motion.div
          className="blux-info"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 1.05 }}
        >
          <p>{date}</p>
          <p>{location}</p>
        </motion.div>

        <motion.button
          type="button"
          className="blux-button"
          onClick={onEnter}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.25 }}
          whileTap={{ scale: 0.97 }}
        >
          Otvori pozivnicu
        </motion.button>
      </div>
    </section>
  );
}

export default BirthdayLuxuryIntro;