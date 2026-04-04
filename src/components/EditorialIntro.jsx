import { motion } from "framer-motion";

export default function EditorialIntro({
  brideName,
  groomName,
  weddingDate,
  onEnter,
}) {
  const safeDate = weddingDate || "";
  const [day = "", month = "", year = ""] = safeDate.split(" ");

  return (
    <section className="editorial-intro">
      <motion.div
        className="editorial-inner"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="editorial-date">
          <span>{day}</span>
          <span>{month}</span>
          <span>{year}</span>
        </div>

        <div className="editorial-save">SAVE THE DATE</div>

        <motion.div
          className="editorial-names"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div>{brideName}</div>
          <div className="editorial-and">&</div>
          <div>{groomName}</div>
        </motion.div>

        <motion.button
          className="editorial-btn"
          onClick={onEnter}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
        >
          Pogledaj pozivnicu
        </motion.button>
      </motion.div>
    </section>
  );
}