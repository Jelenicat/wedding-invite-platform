import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

function CyrillicSvgSilkIntro({
  brideName,
  groomName,
  onEnter,
  videoSrc,
  fontMode = "light",
  weddingDate,
  script = "cyrillic",
  slug,
  introNamesSvg,
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
        // Browser može blokirati autoplay, ali intro ostaje normalno prikazan.
      });
    }
  }, [videoSrc]);

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

  let month = "септембар";
  let day = "06";
  let year = "2026";

  if (weddingDate) {
    const parts = weddingDate.trim().split(/\s+/);

    if (parts.length === 3) {
      if (Number.isNaN(Number(parts[0]))) {
        month = monthMapCyrillic[parts[0].toUpperCase()] || parts[0];
        day = parts[1];
        year = parts[2];
      } else {
        day = parts[0];
        month = monthMapCyrillic[parts[1].toUpperCase()] || parts[1];
        year = parts[2];
      }
    }
  }

  const displayDay = Number.isNaN(Number(day)) ? day : String(Number(day));

  return (
    <section
      className={`silk-intro cyrillic-svg-silk-intro silk-slug-${
        slug || ""
      }`}
    >
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
        <p className={`silk-top ${fontMode}`}>Позивница за венчање</p>

        <div
          className="cyrillic-svg-names-wrap"
          aria-label={`${brideName} & ${groomName}`}
        >
          {introNamesSvg ? (
            <img
              className="cyrillic-svg-names"
              src={introNamesSvg}
              alt={`${brideName} & ${groomName}`}
            />
          ) : (
            <div className="cyrillic-svg-names-fallback">
              {brideName}
              <br />
              <span>&</span>
              <br />
              {groomName}
            </div>
          )}
        </div>

        <p className={`silk-date ${fontMode}`}>
          {month}
          <br />
          {displayDay}.
          <br />
          {year}.
        </p>

        <button className={`silk-enter ${fontMode}`} onClick={onEnter}>
          Погледај позивницу
        </button>
      </motion.div>
    </section>
  );
}

export default CyrillicSvgSilkIntro;