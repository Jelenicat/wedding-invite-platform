import { motion } from "framer-motion";

function RetroIntro({ brideName, backgroundImage, onEnter }) {
  const name = brideName || "Jelena";

  return (
    <section className="retro-intro">
      <div
        className="retro-intro-bg"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="retro-intro-overlay" />

<motion.div
  className="retro-intro-content"
  initial={{ opacity: 0, y: 24 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
  <div className="retro-text-block">
    <h1 className="retro-script-name">{name}'s</h1>

    <div className="retro-birthday-copy">
      <span className="retro-age-line">18TH</span>
      <span className="retro-birthday-line">BIRTHDAY</span>
    </div>
  </div>

  <div className="retro-open-btn-wrap">
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.55 }}
    >
      <button className="retro-open-btn" onClick={onEnter}>
        Pogledaj pozivnicu
      </button>
    </motion.div>
  </div>
</motion.div>
    </section>
  );
}

export default RetroIntro;