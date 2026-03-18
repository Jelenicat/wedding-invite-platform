import { motion } from "framer-motion";

function SplitImageIntro({ brideName, groomName, imageSrc, onEnter }) {
  return (
    <section
      className="split-image-intro"
      style={{ backgroundImage: `url(${imageSrc})` }}
    >
      <div className="split-image-overlay" />

      <motion.div
        className="split-image-names"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >
        <span>{brideName}</span>
        <span className="split-image-and">&</span>
        <span>{groomName}</span>
      </motion.div>

      <motion.button
        className="split-image-btn"
        onClick={onEnter}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        Pogledaj pozivnicu
      </motion.button>
    </section>
  );
}

export default SplitImageIntro;