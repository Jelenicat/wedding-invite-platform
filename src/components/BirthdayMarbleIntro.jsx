import { motion } from "framer-motion";
import "../styles/birthdayintro.css";

function BirthdayMarbleIntro({
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
    introBackgroundImage ||
    backgroundImage ||
    "/images/birthday-marble-intro.jpg";

  return (
    <section className="bmarble-intro">
      <div
        className="bmarble-bg"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      />

      <div className="bmarble-overlay" />

      <div className="bmarble-content">
        <motion.p
          className="bmarble-venue"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.15 }}
        >
          cÔtier
        </motion.p>

        <motion.div
          className="bmarble-age-wrap"
          initial={{ opacity: 0, scale: 0.92, y: 22 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: "easeOut" }}
        >
          <span>{age}.</span>
        </motion.div>

        <motion.h1
          className="bmarble-name"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.55 }}
        >
         {displayName}
        </motion.h1>

        <motion.p
          className="bmarble-subtitle"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.72 }}
        >
          slavi rođendan
        </motion.p>

        <motion.div
          className="bmarble-divider"
          initial={{ opacity: 0, scaleX: 0.55 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.75, delay: 0.88 }}
        >
          <span />
        </motion.div>

        <motion.p
          className="bmarble-date"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 1 }}
        >
          {date}
        </motion.p>

        <motion.button
          type="button"
          className="bmarble-button"
          onClick={onEnter}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 1.15 }}
          whileTap={{ scale: 0.97 }}
        >
          Pogledaj pozivnicu
          <span>⌄</span>
        </motion.button>
      </div>
    </section>
  );
}

export default BirthdayMarbleIntro;