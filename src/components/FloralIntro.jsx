import { motion } from "framer-motion";
import floralFallback from "../assets/floral.png";

function FloralIntro({ brideName, groomName, onEnter, backgroundImage }) {
  const safeBrideName = brideName || "Bride";
  const safeGroomName = groomName || "Groom";
  const brideInitial = safeBrideName[0];
  const groomInitial = safeGroomName[0];
  const finalBackground = backgroundImage || floralFallback;

  return (
    <section className="floral-intro">
      <img
        src={finalBackground}
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
          {brideInitial} <span>&</span> {groomInitial}
        </div>

        <h1 className="floral-names">
          {safeBrideName} <span>&</span> {safeGroomName}
        </h1>

        <button className="floral-button" onClick={onEnter}>
          Pogledaj pozivnicu
        </button>
      </motion.div>
    </section>
  );
}

export default FloralIntro;