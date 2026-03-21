import { motion } from "framer-motion";

function BlackWhiteIntro({ brideName, groomName, onEnter }) {
  const celebrantName = brideName || groomName || "Slavljenica";

  return (
    <section className="black-white-intro">
      {/* osnovna pozadina */}
      <div className="black-white-base black-white-base-top" />
      <div className="black-white-base black-white-base-bottom" />

      {/* animirani novi paneli */}
      <motion.div
        className="black-white-swap black-white-swap-top"
        initial={{ y: "-100%" }}
        animate={{ y: 0 }}
        transition={{ duration:3, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      />

      <motion.div
        className="black-white-swap black-white-swap-bottom"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 3, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      />

      <div className="black-white-content">
        <div className="black-white-text-split">
          <motion.div
            className="black-white-text-top"
            initial={{ color: "#ffffff" }}
            animate={{ color: "#000000" }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h1 className="black-white-name">{celebrantName}</h1>
          </motion.div>

          <motion.div
            className="black-white-text-bottom"
            initial={{ color: "#000000" }}
            animate={{ color: "#ffffff" }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
           <p className="black-white-birthday-line">
  <span className="black-white-age">18.</span>
  <span>ROĐENDAN</span>
</p>
          </motion.div>
        </div>

        <motion.button
          className="black-white-open-btn"
          onClick={onEnter}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.05 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          Pogledaj pozivnicu
        </motion.button>
      </div>
    </section>
  );
}

export default BlackWhiteIntro;