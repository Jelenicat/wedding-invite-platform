import { motion } from "framer-motion";
import "../styles/birthdayintro.css";

function BirthdayGlassIntro({
  brideName,
  weddingDate,
  backgroundImage,
  introBackgroundImage,
  details = {},
  onEnter,
}) {
  const age = details.age || 18;
  const displayName = brideName || "Đorđe";
  const date = weddingDate || details.date || "27 • 06 • 2026";

  const bgImage =
    introBackgroundImage || backgroundImage || "/images/birthday-glass-intro.jpg";

  return (
    <section className="bglass-intro">
      <div
        className="bglass-bg"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      />

      <div className="bglass-overlay" />

      <motion.div
        className="bglass-panel"
        initial={{ opacity: 0, y: 26, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="bglass-top-line">
          <span />
        </div>

        <motion.h1
          className="bglass-name"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.25 }}
        >
          {displayName.toLocaleUpperCase("sr-RS")}
        </motion.h1>

        <motion.div
          className="bglass-proslavlja"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.38 }}
        >
          <span />
          <p>proslavlja</p>
          <span />
        </motion.div>

        <motion.div
          className="bglass-age-wrap"
          initial={{ opacity: 0, scale: 0.92, y: 22 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.52, ease: "easeOut" }}
        >
          <div className="bglass-age">{age}</div>
          <div className="bglass-age-shine" />
        </motion.div>

        <motion.div
          className="bglass-divider"
          initial={{ opacity: 0, scaleX: 0.5 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.75, delay: 0.72 }}
        >
          <span />
        </motion.div>

        <motion.p
          className="bglass-birthday"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.84 }}
        >
          rođendan
        </motion.p>

        <motion.p
          className="bglass-date"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.96 }}
        >
          {date}
        </motion.p>

        <motion.button
          type="button"
          className="bglass-button"
          onClick={onEnter}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 1.12 }}
          whileTap={{ scale: 0.97 }}
        >
          Otvori pozivnicu
          <span>→</span>
        </motion.button>

        <div className="bglass-bottom-line">
          <span />
        </div>
      </motion.div>
    </section>
  );
}

export default BirthdayGlassIntro;