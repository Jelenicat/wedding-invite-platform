import { motion } from "framer-motion";

function SplitVideoIntro({ brideName, groomName, videoSrc, onEnter }) {
  return (
    <section className="split-video-intro">
      <video
        className="split-video-bg"
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
      />

      

      <div className="split-names">
        <span>{brideName}</span>
        <span className="split-and">&</span>
        <span>{groomName}</span>
      </div>

      <motion.button
        className="split-btn"
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

export default SplitVideoIntro;