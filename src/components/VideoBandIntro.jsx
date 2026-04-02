import { useState } from "react";
import { motion } from "framer-motion";

function VideoBandIntro({ brideName, groomName, videoSrc, onEnter }) {
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);

  return (
    <section className="video-band-intro">
      <div className="video-band-poster-layer" />

      {!videoError && videoSrc && (
        <video
          className={`video-band-bg ${videoReady ? "is-visible" : ""}`}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/video-band-poster.jpg"
          onCanPlay={() => setVideoReady(true)}
          onError={() => setVideoError(true)}
        />
      )}

      <div
        className={`video-band-overlay ${videoReady ? "is-video-ready" : ""}`}
      />

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

      <motion.button
        type="button"
        aria-label="Pogledaj pozivnicu"
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