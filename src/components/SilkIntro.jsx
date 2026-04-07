import { motion } from "framer-motion";

function SilkIntro({
  brideName,
  groomName,
  onEnter,
  videoSrc,
  fontMode = "light",
  weddingDate,
}) {
  const textColor =
    fontMode === "dark"
      ? "#2f2a26"
      : "rgba(255,255,255,0.92)";

  const monthMap = {
    JAN: "januar",
    FEB: "februar",
    MAR: "mart",
    APR: "april",
    MAY: "maj",
    JUN: "jun",
    JUL: "jul",
    AVG: "avgust",
    AUG: "avgust",
    SEP: "septembar",
    OCT: "oktobar",
    NOV: "novembar",
    DEC: "decembar",
  };

  let month = "septembar";
  let day = "06";
  let year = "2025";

  if (weddingDate) {
    const parts = weddingDate.trim().split(/\s+/);

    if (parts.length === 3) {
      if (isNaN(parts[0])) {
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

  return (
    <section className="silk-intro">
      <video
        className="silk-video"
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="silk-overlay" />

      <motion.div
        className="silk-content"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <p className={`silk-top ${fontMode}`}>
          Pozivnica za venčanje
        </p>

        <h1 className="silk-names" style={{ color: textColor }}>
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

        <button
          className={`silk-enter ${fontMode}`}
          onClick={onEnter}
        >
          Pogledaj pozivnicu
        </button>
      </motion.div>
    </section>
  );
}

export default SilkIntro;