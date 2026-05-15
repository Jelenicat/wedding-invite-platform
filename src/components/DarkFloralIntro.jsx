import { motion } from "framer-motion";
import "../styles/intro.css";

function DarkFloralIntro({
  brideName,
  groomName,
  weddingDate,
  backgroundImage,
  details = {},
  onEnter,
}) {
  const bg = backgroundImage || details?.backgroundImage || "/images/dark-floral-intro.jpg";

  return (
    <section className="df-intro">
      <div
        className="df-intro-bg"
        style={{ backgroundImage: `url(${bg})` }}
      />

      <div className="df-intro-overlay" />

      <motion.div
        className="df-intro-content"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      >
        <motion.div
          className="df-intro-kicker"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.9 }}
        >
          Pozivnica za venčanje
        </motion.div>

        <motion.div
          className="df-intro-names"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55, duration: 1 }}
        >
          <span>{brideName}</span>
          <em>&</em>
          <span>{groomName}</span>
        </motion.div>

        <motion.div
          className="df-intro-date"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.9 }}
        >
          {weddingDate}
        </motion.div>

        <motion.button
  type="button"
  className="df-intro-button"
  onClick={onEnter}
  aria-label="Otvori pozivnicu"
  initial={{ opacity: 0, y: 18 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 1.1, duration: 0.8 }}
  whileTap={{ scale: 0.97 }}
>
  Otvori pozivnicu
</motion.button>
      </motion.div>
    </section>
  );
}

export default DarkFloralIntro;