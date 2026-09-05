import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

function getInitial(name = "") {
  const cleanName = String(name).trim();

  if (!cleanName) return "";

  return Array.from(cleanName)[0].toUpperCase();
}

function MonogramVideoIntro({
  brideName,
  groomName,
  weddingDate,
  videoSrc,
  onEnter,
  script = "latin",
  language = "sr",
  details = {},
}) {
  const videoRef = useRef(null);

  const brideInitial = getInitial(brideName);
  const groomInitial = getInitial(groomName);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay može biti blokiran na nekim uređajima.
      });
    }
  }, [videoSrc]);

  const isEnglish = language === "en";

  const texts = isEnglish
    ? {
        top: "Wedding invitation",
        button: "View invitation",
      }
    : script === "cyrillic"
      ? {
          top: "Позивница за венчање",
          button: "Погледај позивницу",
        }
      : {
          top: "Pozivnica za venčanje",
          button: "Pogledaj pozivnicu",
        };

  const displayDate =
    details?.introDate ||
    weddingDate ||
    "";

  return (
    <section className="monogram-video-intro">
      <video
        ref={videoRef}
        className="monogram-video-bg"
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
      />

      <div className="monogram-video-overlay" />
      <div className="monogram-video-vignette" />

      <motion.div
        className="monogram-video-top"
        initial={{
          opacity: 0,
          y: -12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 1.1,
          delay: 0.15,
          ease: "easeOut",
        }}
      >
        {texts.top}
      </motion.div>

      <motion.div
        className="monogram-video-monogram"
        initial={{
          opacity: 0,
          scale: 0.88,
          filter: "blur(5px)",
        }}
        animate={{
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
        }}
        transition={{
          duration: 1.5,
          delay: 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <span className="monogram-video-letter monogram-video-letter-bride">
          {brideInitial}
        </span>

        <span className="monogram-video-letter monogram-video-letter-groom">
          {groomInitial}
        </span>
      </motion.div>

      <motion.div
        className="monogram-video-details"
        initial={{
          opacity: 0,
          y: 18,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 1,
          delay: 1,
          ease: "easeOut",
        }}
      >
        <div className="monogram-video-names">
          {brideName}
          <span>&</span>
          {groomName}
        </div>

        {displayDate && (
          <div className="monogram-video-date">
            {displayDate}
          </div>
        )}
      </motion.div>

      <motion.button
        type="button"
        className="monogram-video-button"
        onClick={onEnter}
        initial={{
          opacity: 0,
          y: 14,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        whileHover={{
          y: -2,
        }}
        whileTap={{
          scale: 0.98,
        }}
        transition={{
          duration: 0.8,
          delay: 1.35,
        }}
      >
        {texts.button}
      </motion.button>
    </section>
  );
}

export default MonogramVideoIntro;