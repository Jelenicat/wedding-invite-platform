import { motion } from "framer-motion";

function CallaLaceIntro({
  brideName,
  groomName,
  backgroundImage,
  onEnter,
}) {
  const bg = backgroundImage || "/images/calla-lace-bg.jpg";

  return (
    <section className="clace-intro">
      <motion.div
        className="clace-bg"
        style={{ backgroundImage: `url(${bg})` }}
        initial={{ scale: 1.035 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      <div className="clace-overlay" aria-hidden="true" />

      <motion.div
        className="clace-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1.1, ease: "easeOut" }}
      >
        <motion.div
          className="clace-text-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
        >
          <p className="clace-kicker">Pozivnica za venčanje</p>

          <div className="clace-divider" aria-hidden="true">
            <span />
            <i>♡</i>
            <span />
          </div>

          <h1 className="clace-names">
            <span>{brideName || "Tamara"}</span>
            <em aria-hidden="true">&amp;</em>
            <span>{groomName || "Viktor"}</span>
          </h1>
        </motion.div>

        <motion.button
          type="button"
          className="clace-open-btn"
          onClick={onEnter}
          aria-label="Otvori pozivnicu"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
          whileHover={{ y: -2, scale: 1.015 }}
          whileTap={{ scale: 0.97 }}
        >
          Otvori pozivnicu
        </motion.button>
      </motion.div>
    </section>
  );
}

export default CallaLaceIntro;