import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

function SilkIntro({
  brideName,
  groomName,
  onEnter,
  videoSrc,
  fontMode = "light",
  weddingDate,
  script = "latin",
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Browser je blokirao autoplay.
        // Intro i dalje ostaje prikazan normalno.
      });
    }
  }, [videoSrc]);

  const textColor =
    fontMode === "dark" ? "#2f2a26" : "rgba(255,255,255,0.92)";

  const monthMapLatin = {
    JAN: "januar",
    FEB: "februar",
    MAR: "mart",
    APR: "april",
    MAY: "maj",
    MAJ: "maj",
    JUN: "jun",
    JUL: "jul",
    AVG: "avgust",
    AUG: "avgust",
    SEP: "septembar",
    OCT: "oktobar",
    OKT: "oktobar",
    NOV: "novembar",
    DEC: "decembar",
  };

  const monthMapCyrillic = {
    JAN: "јануар",
    FEB: "фебруар",
    MAR: "март",
    APR: "април",
    MAY: "мај",
    MAJ: "мај",
    JUN: "јун",
    JUL: "јул",
    AVG: "август",
    AUG: "август",
    SEP: "септембар",
    СЕП: "септембар",
    OCT: "октобар",
    OKT: "октобар",
    ОКТ: "октобар",
    NOV: "новембар",
    DEC: "децембар",
  };

  const monthMap = script === "cyrillic" ? monthMapCyrillic : monthMapLatin;

  let month = script === "cyrillic" ? "септембар" : "septembar";
  let day = "06";
  let year = "2026";

  if (weddingDate) {
    const parts = weddingDate.trim().split(/\s+/);

    if (parts.length === 3) {
      if (Number.isNaN(Number(parts[0]))) {
        month = monthMap[parts[0].toUpperCase()] || parts[0];
        day = parts[1];
        year = parts[2];
      } else {
        day = parts[0];
        month = monthMap[parts[1].toUpperCase()] || parts[1];
        year = parts[2];
      }
    }
  }

  const t =
    script === "cyrillic"
      ? {
          top: "Позивница за венчање",
          button: "Погледај позивницу",
        }
      : {
          top: "Pozivnica za venčanje",
          button: "Pogledaj pozivnicu",
        };

  return (
    <section className="silk-intro">
      <video
        ref={videoRef}
        className="silk-video"
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
      />

      <div className="silk-overlay" />

      <motion.div
        className="silk-content"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <p className={`silk-top ${fontMode}`}>{t.top}</p>

        <h1
          className={`silk-names ${
            script === "cyrillic" ? "silk-names-cyrillic" : ""
          }`}
          style={{ color: textColor }}
        >
          {brideName}
          <br />
          <span className="silk-amp">&</span>
          <br />
          {groomName}
        </h1>

        <p className={`silk-date ${fontMode}`}>
          {month}
          <br />
          {day}
          <br />
          {year}
        </p>

        <button className={`silk-enter ${fontMode}`} onClick={onEnter}>
          {t.button}
        </button>
      </motion.div>
    </section>
  );
}

export default SilkIntro;