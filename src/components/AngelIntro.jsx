import { motion } from "framer-motion";
import "../styles/intro.css";

function AngelIntro({
  brideName,
  groomName,
  image,
  weddingDate,
}) {
  const heroImage = image || "/images/demo/couple.jpg";

  return (
    <section className="angel-intro-scroll">
      <motion.div
        className="angel-top-photo-wrap"
        initial={{ opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <img
          src={heroImage}
          alt={`${brideName} and ${groomName}`}
          className="angel-top-photo"
        />

        <div className="angel-photo-bottom-shadow" />
      </motion.div>

      <motion.div
        className="angel-scroll-text-block"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.8 }}
      >
        <motion.div
          className="angel-scroll-names"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          {brideName}
          <br />
          <span>&</span>
          <br />
          {groomName}
        </motion.div>

        <motion.div className="angel-invite-text">
          Biće nam čast da budete deo našeg venčanja
        </motion.div>
        <motion.div
  className="angel-intro-icon"
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.5, duration: 0.6 }}
>
  <img src="/icons/angel.svg" alt="angel" />
</motion.div>
      </motion.div>
    </section>
  );
}

export default AngelIntro;