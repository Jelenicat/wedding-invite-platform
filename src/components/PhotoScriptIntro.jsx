import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

function PhotoScriptIntro({
  brideName,
  groomName,
  videoSrc,
  onEnter,
  script = "latin",
}) {
  const videoRef = useRef(null);

  const t =
    script === "cyrillic"
      ? {
          openInvitation: "Погледај позивницу",
        }
      : {
          openInvitation: "Pogledaj pozivnicu",
        };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    const tryPlay = async () => {
      if (!video || cancelled) return;

      try {
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;
        video.setAttribute("playsinline", "");
        video.setAttribute("webkit-playsinline", "");

        const playPromise = video.play();

        if (playPromise !== undefined) {
          await playPromise;
        }
      } catch (err) {
        console.warn("Video autoplay nije uspeo:", err);
      }
    };

    const handleVisibility = () => {
      if (
        document.visibilityState === "visible" &&
        video &&
        video.paused &&
        !cancelled
      ) {
        tryPlay();
      }
    };

    const handleLoadedData = () => {
      if (video && video.paused && !cancelled) {
        tryPlay();
      }
    };

    const handleCanPlay = () => {
      if (video && video.paused && !cancelled) {
        tryPlay();
      }
    };

    tryPlay();

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("canplay", handleCanPlay);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelled = true;
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("canplay", handleCanPlay);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [videoSrc]);

  return (
    <section className="photo-script-intro">
      <video
        ref={videoRef}
        key={videoSrc || "/videos/wedding.mp4"}
        className="photo-script-bg-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/images/fallback.jpg"
      >
        <source src={videoSrc || "/videos/wedding.mp4"} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="photo-script-overlay" />

      <motion.div
        className="photo-script-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <motion.h1
          className={`photo-script-names ${
            script === "cyrillic" ? "cyrillic" : ""
          }`}
          initial={{ opacity: 0, scale: 0.92, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
        >
          <motion.span
            className="name"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45 }}
          >
            {brideName}
          </motion.span>

          <motion.span
            className="photo-script-and"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.85, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.85 }}
          >
            &
          </motion.span>

          <motion.span
            className="name"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.65 }}
          >
            {groomName}
          </motion.span>
        </motion.h1>

        <motion.button
          className="photo-script-button"
          onClick={onEnter}
          initial={{ opacity: 0, x: "-50%", y: 18 }}
          animate={{ opacity: 1, x: "-50%", y: 0 }}
          transition={{ duration: 0.9, delay: 1.2 }}
        >
          {t.openInvitation}
        </motion.button>
      </motion.div>
    </section>
  );
}

export default PhotoScriptIntro;