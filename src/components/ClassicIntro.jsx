import { motion } from "framer-motion";
import "../styles/intro.css";

function ClassicIntro({
  weddingDate,
  image,
  introPreviewImage,
  onEnter,
}) {
  const preview = introPreviewImage || image;

  return (
    <section className="classic-intro" onClick={onEnter}>
      <motion.div
        className="classic-intro-card"
        initial={{ opacity: 0, y: 36, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="classic-intro-surface">

          {/* LETTER IMAGE */}
          <div className="classic-letter-image">
            <img src="/images/slug/letter.jpg" alt="" />
          </div>

          {/* DATE */}
          <div className="classic-date">{weddingDate}</div>

          {/* PREVIEW */}
          <div className="classic-preview-wrap">
            <img src={preview} alt="" />
          </div>

        </div>

        {/* FLOATING CARD */}
        <motion.div
          className="classic-invite-card"
          initial={{ opacity: 0, y: 24, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={{ delay: 0.25, duration: 0.7 }}
        >
          <div className="classic-invite-inner">
            <div className="classic-invite-script">Rekla je da!</div>

            <p>Pozivamo vas na naš poseban dan!</p>

            <div className="classic-invite-date">{weddingDate}</div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default ClassicIntro;