import { motion } from "framer-motion";
import floralImage from "../assets/floral.png";

function FloralIntro({ brideName, groomName, onEnter }) {
  const brideInitial = brideName?.[0] || "A";
  const groomInitial = groomName?.[0] || "M";

  return (
    <section className="floral-intro">
      <img
        src={floralImage}
        alt="Wedding floral background"
        className="floral-bg"
      />

      <div className="floral-overlay" />

      <motion.div
        className="floral-content"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <div className="floral-monogram">
          {brideInitial} <span>&
            </span> {groomInitial}
        </div>

        <h1 className="floral-names">
          {brideName} <span>&</span> {groomName}
        </h1>

        <button className="floral-button" onClick={onEnter}>
          Pogledaj pozivnicu
        </button>
      </motion.div>
    </section>
  );
}

export default FloralIntro;