import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "../styles/intro.css";

function GoldPrintVideoIntro({
  brideName,
  groomName,
  videoSrc,
  backgroundImage,
  onEnter,
  details = {},
  script = "latin",
}) {
  const [videoEnded, setVideoEnded] = useState(false);

  const isCyrillic = script === "cyrillic";

  const t = isCyrillic
    ? {
        kicker: "Позивница за вјенчање",
        open: "Отвори позивницу",
        brideFallback: "Николина",
        groomFallback: "Велибор",
        and: "и",
        crestAlt: "Породични грб",
      }
    : {
        kicker: "Pozivnica za vjenčanje",
        open: "Otvori pozivnicu",
        brideFallback: "Nikolina",
        groomFallback: "Velibor",
        and: "i",
        crestAlt: "Porodični grb",
      };

  const namesSvg = details.namesSvg || "/images/names/nikolina-velibor.svg";

  const tribalSvg =
    details.tribalSvg || "/images/ornaments/goldprint-tribal.svg";

  const familyCrestSvg =
    details.familyCrestSvg || "/images/crests/family-crest.svg";

  const fallbackBg = backgroundImage || "/images/gold-print-fallback.jpg";

  useEffect(() => {
    if (!videoSrc) {
      setVideoEnded(true);
    }
  }, [videoSrc]);

  return (
    <section className="gpv-intro">
      <div
        className="gpv-fallback-bg"
        style={{ backgroundImage: `url(${fallbackBg})` }}
        aria-hidden="true"
      />

      {videoSrc && (
        <video
          className={`gpv-video ${videoEnded ? "is-ended" : ""}`}
          src={videoSrc}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={() => setVideoEnded(true)}
          onError={() => setVideoEnded(true)}
        />
      )}

      <div className="gpv-overlay" aria-hidden="true" />

      <motion.div
        className={`gpv-content ${videoEnded ? "is-visible" : ""}`}
        initial={false}
        animate={
          videoEnded
            ? { opacity: 1, y: 0, filter: "blur(0px)" }
            : { opacity: 0, y: 18, filter: "blur(10px)" }
        }
        transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="gpv-top-content">
          <div className="gpv-kicker-group">
            <motion.div
              className="gpv-tribal-fixed-wrap"
              aria-hidden="true"
              initial={false}
              animate={
                videoEnded
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: 0, scale: 0.96, y: 8 }
              }
              transition={{
                delay: 0.08,
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div
                className="gpv-tribal-fixed"
                style={{
                  "--gpv-tribal-mask": `url(${tribalSvg})`,
                }}
              />
            </motion.div>

            <motion.p
              className="gpv-kicker"
              initial={false}
              animate={
                videoEnded ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
              }
              transition={{ delay: 0.15, duration: 0.8, ease: "easeOut" }}
            >
              {t.kicker}
            </motion.p>
          </div>

          <motion.img
            className="gpv-family-crest"
            src={familyCrestSvg}
            alt={t.crestAlt}
            initial={false}
            animate={
              videoEnded
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0, scale: 0.92, y: 12 }
            }
            transition={{
              delay: 0.25,
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
            }}
          />

          <motion.img
            className="gpv-names-svg-img"
            src={namesSvg}
            alt={`${brideName || t.brideFallback} ${t.and} ${
              groomName || t.groomFallback
            }`}
            draggable="false"
            initial={false}
            animate={
              videoEnded
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0, scale: 0.96, y: 16 }
            }
            transition={{
              delay: 0.42,
              duration: 1.25,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        </div>

        <motion.button
          type="button"
          className="gpv-open-btn"
          onClick={onEnter}
          aria-label={t.open}
          initial={false}
          animate={videoEnded ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ delay: 0.8, duration: 0.85, ease: "easeOut" }}
          whileHover={{ y: -2, scale: 1.015 }}
          whileTap={{ scale: 0.97 }}
        >
          {t.open}
        </motion.button>
      </motion.div>
    </section>
  );
}

export default GoldPrintVideoIntro;