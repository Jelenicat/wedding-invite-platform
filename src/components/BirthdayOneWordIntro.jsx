import { motion } from "framer-motion";

function BirthdayOneWordIntro({
  brideName,
  weddingDate,
  image1,
  image2,
  image3,
  onEnter,
  slug,
}) {
  const name = brideName || "Emilia";

  return (
    <section className="birthday-one-word-intro">
      <motion.div
        className="birthday-one-word-card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75 }}
      >
        <motion.p
          className="birthday-one-word-script"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          {name} uskoro puni
        </motion.p>

        <motion.div
          className="birthday-one-word-title"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.18, duration: 0.7 }}
        >
          <div className="birthday-one-letter birthday-one-letter-o">
            <img src={image1} alt="" />
            <span>O</span>
          </div>

          <div className="birthday-one-letter birthday-one-letter-n">
            <img src={image2} alt="" />
            <span>N</span>
          </div>

          <div className="birthday-one-letter birthday-one-letter-e">
            <img src={image3} alt="" />
            <span>E</span>
          </div>
        </motion.div>

        <motion.p
          className="birthday-one-word-invite"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.32, duration: 0.6 }}
        >
          Pridružite se mom slavlju!
        </motion.p>

        <motion.p
          className="birthday-one-word-date"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.42, duration: 0.6 }}
        >
          {weddingDate}
        </motion.p>

        <motion.button
          className="birthday-one-word-btn"
          onClick={onEnter}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52, duration: 0.65 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          Pogledaj pozivnicu
        </motion.button>
      </motion.div>

      {/* 🔥 SVG DNO */}
      <img
        src={`/images/${slug}-bottom.svg`}
        alt=""
        className="birthday-bottom-svg"
      />
    </section>
  );
}

export default BirthdayOneWordIntro;