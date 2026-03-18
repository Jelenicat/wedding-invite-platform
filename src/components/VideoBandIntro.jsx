import { motion } from "framer-motion";

function VideoBandIntro({ brideName, groomName, videoSrc, onEnter }) {
  return (
<section className="video-band-intro">
  <video
    className="video-band-bg"
    src={videoSrc}
    autoPlay
    muted
    loop
    playsInline
  />

  <div className="video-band-overlay" />

  <motion.div
    className="video-band-strip"
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.9 }}
  >
    <h1 className="video-band-names">
      <span>{brideName}</span>
      <span className="video-band-and">&</span>
      <span>{groomName}</span>
    </h1>
  </motion.div>

  {/* 👇 dugme dole */}
  <motion.button
    className="video-band-btn-bottom"
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

export default VideoBandIntro;