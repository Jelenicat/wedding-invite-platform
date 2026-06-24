import { motion } from "framer-motion";
import "../styles/birthdayintro.css";

function BirthdayBabyIntro({
  brideName,
  videoSrc,
  backgroundImage,
  onEnter,
  details = {},
}) {
  const ornamentTopSvg = details.introOrnamentTopSvg;
  const ornamentBottomSvg = details.introOrnamentBottomSvg;

  const theme = details.theme || {};

  return (
    <section
      className="bbaby-intro"
      style={{
        "--bbaby-main": theme.babyMain || "#ae6f60",
        "--bbaby-soft": theme.babySoft || "#f6becd",
        "--bbaby-light": theme.babyLight || "#fff6f1",
        "--bbaby-muted": theme.babyMuted || "#a4695e",
        "--bbaby-border":
          theme.babyBorder || "rgba(198, 131, 101, 0.52)",
        "--bbaby-shadow":
          theme.babyShadow || "rgba(154, 94, 76, 0.18)",
      }}
    >
      {videoSrc ? (
        <video
          className="bbaby-bg-video"
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <div
          className="bbaby-bg-image"
          style={{
            backgroundImage: backgroundImage
              ? `url(${backgroundImage})`
              : "none",
          }}
        />
      )}

      <div className="bbaby-overlay" />

      <motion.div
        className="bbaby-content bbaby-content-centered"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      >
        {ornamentTopSvg && (
          <motion.img
            src={ornamentTopSvg}
            alt=""
            className="bbaby-ornament bbaby-ornament-top"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.15 }}
          />
        )}

        <motion.h1
          className="bbaby-name"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.34 }}
        >
          {brideName}
        </motion.h1>

        <motion.p
          className="bbaby-subtitle"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.48 }}
        >
          slavi prvi rođendan
        </motion.p>

        {ornamentBottomSvg && (
          <motion.img
            src={ornamentBottomSvg}
            alt=""
            className="bbaby-ornament bbaby-ornament-bottom"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          />
        )}

        <motion.button
          type="button"
          className="bbaby-button"
          onClick={onEnter}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.76 }}
        >
          Pogledajte pozivnicu
        </motion.button>
      </motion.div>
    </section>
  );
}

export default BirthdayBabyIntro;