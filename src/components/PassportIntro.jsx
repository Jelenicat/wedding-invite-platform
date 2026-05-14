import { motion } from "framer-motion";
import { useState } from "react";
import "../styles/intro.css";

function PassportIntro({
  onEnter,
  slug,
  brideName,
  groomName,
  backgroundImage,
  passportImage,
  script = "latin",
  theme = {},
}) {
  const [isLeaving, setIsLeaving] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const t =
    script === "cyrillic"
      ? {
          button: "Погледај позивницу",
        }
      : {
          button: "Pogledaj pozivnicu",
        };

  const introBg = backgroundImage || `/images/passport/${slug}-bg.jpg`;
  const introPassport = passportImage || `/images/passport/${slug}.svg`;

  const passportIntroThemeStyle = {
    "--passport-intro-main": theme.main || "#b18d53",
    "--passport-intro-main-dark": theme.mainDark || "#7a674f",
    "--passport-intro-cream": theme.cream || "#fffbf5",
    "--passport-intro-white": theme.white || "#ffffff",

    "--passport-intro-overlay-top":
      theme.introOverlayTop || "rgba(0, 0, 0, 0.08)",
    "--passport-intro-overlay-mid":
      theme.introOverlayMid || "rgba(0, 0, 0, 0.18)",
    "--passport-intro-overlay-mid-2":
      theme.introOverlayMid2 || "rgba(255, 255, 255, 0.08)",
    "--passport-intro-overlay-bottom":
      theme.introOverlayBottom || "rgba(0, 0, 0, 0.38)",

    "--passport-intro-button-bg":
      theme.introButtonBg || theme.buttonBg || "rgba(255, 255, 255, 0.14)",
    "--passport-intro-button-hover-bg":
      theme.introButtonHoverBg || "rgba(255, 255, 255, 0.22)",

    "--passport-intro-button-border":
      theme.introButtonBorder || "rgba(255, 255, 255, 0.34)",
    "--passport-intro-button-border-hover":
      theme.introButtonBorderHover ||
      theme.introButtonBorder ||
      "rgba(255, 255, 255, 0.48)",

    "--passport-intro-button-text":
      theme.introButtonText || theme.buttonText || "#ffffff",
    "--passport-intro-button-text-hover":
      theme.introButtonTextHover ||
      theme.introButtonText ||
      theme.buttonText ||
      "#ffffff",

    "--passport-intro-button-dot":
      theme.introButtonDot || theme.accent || "#ffffff",
    "--passport-intro-button-dot-ring":
      theme.introButtonDotRing || "rgba(255, 255, 255, 0.16)",

    "--passport-intro-button-shadow":
      theme.introButtonShadow || "rgba(0, 0, 0, 0.14)",
    "--passport-intro-button-shadow-hover":
      theme.introButtonShadowHover || "rgba(0, 0, 0, 0.18)",
    "--passport-intro-button-inner-shadow":
      theme.introButtonInnerShadow || "rgba(255, 255, 255, 0.12)",
    "--passport-intro-button-inner-shadow-hover":
      theme.introButtonInnerShadowHover || "rgba(255, 255, 255, 0.16)",

    "--passport-intro-image-shadow":
      theme.introImageShadow || "rgba(116, 90, 53, 0.10)",
  };

  const handleEnter = () => {
    if (isLeaving) return;

    setIsLeaving(true);

    setTimeout(() => {
      setIsHidden(true);
      onEnter?.();
    }, 1100);
  };

  if (isHidden) return null;

  return (
    <motion.section
      className="passport-intro"
      initial={{ opacity: 1 }}
      animate={
        isLeaving
          ? { opacity: 0, scale: 1.01, filter: "blur(6px)" }
          : { opacity: 1, scale: 1, filter: "blur(0px)" }
      }
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        backgroundImage: `url(${introBg})`,
        ...passportIntroThemeStyle,
      }}
    >
      <div className="passport-intro-overlay" />

      <motion.div
        className="passport-intro-content"
        initial={{ opacity: 0, y: 18 }}
        animate={isLeaving ? { opacity: 0, y: -16 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 0.08 }}
      >
        <motion.div
          className="passport-intro-image-wrap"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={
            isLeaving
              ? { opacity: 0, scale: 1.01 }
              : { opacity: 1, scale: 1 }
          }
          transition={{ duration: 0.9, delay: 0.12 }}
        >
          <motion.img
            src={introPassport}
            alt={`${brideName || ""} ${groomName || ""} passport invitation`}
            className="passport-intro-image"
            animate={
              isLeaving
                ? {}
                : {
                    y: [0, -4, 0],
                  }
            }
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        <motion.button
          type="button"
          className="passport-intro-button"
          onClick={handleEnter}
          whileHover={{ y: -2, scale: 1.015, x: "-50%" }}
          whileTap={{ scale: 0.985, x: "-50%" }}
          initial={{ opacity: 0, y: 12, x: "-50%" }}
          animate={
            isLeaving
              ? { opacity: 0, y: 10, x: "-50%" }
              : { opacity: 1, y: 0, x: "-50%" }
          }
          transition={{ duration: 0.7, delay: 0.28 }}
        >
          <span className="passport-intro-button-dot" />
          <span className="passport-intro-button-text">{t.button}</span>
          <span className="passport-intro-button-dot" />
        </motion.button>
      </motion.div>
    </motion.section>
  );
}

export default PassportIntro;