import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

function VideoBandIntro({
  brideName,
  groomName,
  videoSrc,
  onEnter,
  posterSrc = "/images/video-band-poster.jpg",
}) {
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) return;

    let cancelled = false;
    let retryTimeout;

    const tryPlay = async () => {
      if (!video || cancelled) return;

      try {
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;
        video.setAttribute("muted", "");
        video.setAttribute("playsinline", "");
        video.setAttribute("webkit-playsinline", "");

        if (video.paused) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            await playPromise;
          }
        }
      } catch (err) {
        console.warn("VideoBand autoplay nije uspeo:", err);
      }
    };

    const handleCanPlay = () => {
      if (cancelled) return;
      setVideoReady(true);
      setVideoFailed(false);
    };

    const handlePlaying = () => {
      if (cancelled) return;
      setVideoReady(true);
      setVideoFailed(false);
    };

    const handleError = () => {
      if (cancelled) return;
      setVideoFailed(true);
      setVideoReady(false);
    };

    const handleVisibility = () => {
      if (
        document.visibilityState === "visible" &&
        video &&
        video.paused &&
        !cancelled &&
        !videoFailed
      ) {
        tryPlay();
      }
    };

    setVideoReady(false);
    setVideoFailed(false);

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("error", handleError);
    document.addEventListener("visibilitychange", handleVisibility);

    tryPlay();

    retryTimeout = setTimeout(() => {
      if (!cancelled && video && video.paused) {
        tryPlay();
      }
    }, 700);

    return () => {
      cancelled = true;
      clearTimeout(retryTimeout);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("error", handleError);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [videoSrc]);

  return (
    <section className="video-band-intro">
      <div
        className={`video-band-poster-layer ${
          videoReady && !videoFailed ? "is-hidden" : ""
        }`}
        style={{ backgroundImage: `url(${posterSrc})` }}
      />

      {!videoFailed && videoSrc && (
        <video
          ref={videoRef}
          key={videoSrc}
          className={`video-band-bg ${videoReady ? "is-visible" : ""}`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterSrc}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
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