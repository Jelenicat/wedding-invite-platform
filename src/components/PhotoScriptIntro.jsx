import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function PhotoScriptIntro({
  brideName,
  groomName,
  videoSrc,
  onEnter,
  script = "latin",
  posterSrc = "/images/fallback.jpg",
  details = {},
}) {
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  const theme = details.theme || {};
  const hasCustomNameFont = Boolean(theme.nameFont);

  const themeStyles = {
    "--photo-script-bg": theme.introBg || "#111",
    "--photo-script-names-color": theme.introMainText || "#cb7474",
    "--photo-script-accent-color": theme.introAccent || "#cb7474",
    "--photo-script-button-border":
      theme.introButtonBorder || "rgba(255, 255, 255, 0.38)",
    "--photo-script-button-bg":
      theme.introButtonBg || "rgba(255, 255, 255, 0.08)",
    "--photo-script-button-text": theme.introButtonText || "#ffffff",
    "--photo-script-button-hover-bg":
      theme.introButtonHoverBg || "rgba(255, 255, 255, 0.14)",
    "--photo-script-overlay-top":
      theme.introOverlayTop || "rgba(0, 0, 0, 0.08)",
    "--photo-script-overlay-mid":
      theme.introOverlayMid || "rgba(0, 0, 0, 0.12)",
    "--photo-script-overlay-bottom":
      theme.introOverlayBottom || "rgba(0, 0, 0, 0.28)",
    "--photo-script-name-font":
      theme.nameFont || '"Italianno", cursive',
    "--photo-script-name-font-cyrillic":
      theme.nameFontCyrillic || '"Great Vibes", cursive',
  };

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

        const playPromise = video.play();

        if (playPromise !== undefined) {
          await playPromise;
        }
      } catch (err) {
        console.warn("Video autoplay nije uspeo:", err);
      }
    };

    const markReadyAndPlay = async () => {
      if (cancelled) return;
      setVideoReady(true);
      await tryPlay();
    };

    const handleLoadedData = () => {
      markReadyAndPlay();
    };

    const handleCanPlay = () => {
      markReadyAndPlay();
    };

    const handlePlaying = () => {
      if (!cancelled) {
        setVideoReady(true);
        setVideoFailed(false);
      }
    };

    const handleError = () => {
      if (!cancelled) {
        setVideoFailed(true);
        setVideoReady(false);
      }
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

    tryPlay();

    retryTimeout = setTimeout(() => {
      if (!cancelled && video && video.paused) {
        tryPlay();
      }
    }, 700);

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("error", handleError);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelled = true;
      clearTimeout(retryTimeout);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("error", handleError);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [videoSrc, videoFailed]);

  return (
    <section
      className={[
        "photo-script-intro",
        hasCustomNameFont ? "has-custom-name-font" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={themeStyles}
    >
      <div
        className={`photo-script-poster-layer ${
          videoReady && !videoFailed ? "is-hidden" : ""
        }`}
        style={{ backgroundImage: `url(${posterSrc})` }}
      />

      <video
        ref={videoRef}
        key={videoSrc || "/videos/wedding.mp4"}
        className={`photo-script-bg-video ${
          videoReady && !videoFailed ? "is-visible" : ""
        }`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={posterSrc}
      >
        <source src={videoSrc || "/videos/wedding.mp4"} type="video/mp4" />
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
            &amp;
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