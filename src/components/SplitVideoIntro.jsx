import { motion } from "framer-motion";

function SplitVideoIntro({
  brideName,
  groomName,
  videoSrc,
  onEnter,
  details = {},
}) {
  const theme = details.theme || {};

const themeStyles = {
  "--intro-bg": theme.introBg || "#e9e4de",
  "--intro-main-text": theme.introMainText || theme.mainText || "#ffffff",
  "--intro-accent": theme.introAccent || theme.accent || "#ffffff",
 "--intro-button-bg":
  theme.introButtonBg || "rgba(255,255,255,0.18)",
  "--intro-button-text": theme.introButtonText || theme.buttonText || "#000000",
  "--intro-button-border": theme.introButtonBorder || "rgba(20, 20, 20, 0.28)",
  "--intro-button-hover-bg":
    theme.introButtonHoverBg || "rgba(255, 255, 255, 0.22)",
  "--intro-button-hover-shadow":
    theme.introButtonHoverShadow || "rgba(0, 0, 0, 0.14)",
  "--intro-text-shadow": theme.introTextShadow || "rgba(0, 0, 0, 0.18)",
  "--intro-overlay": theme.introOverlay || "rgba(255, 252, 248, 0.05)",
  "--intro-play-bg": theme.introPlayBg || "rgba(255, 255, 255, 0.2)",
  "--intro-play-text": theme.introPlayText || "#ffffff",
};

  return (
    <section className="split-video-intro" style={themeStyles}>
      <video
        className="split-video-bg"
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="split-names">
        <span>{brideName}</span>
        <span className="split-and">&</span>
        <span>{groomName}</span>
      </div>

   <motion.button
  className="split-btn"
  onClick={onEnter}
  initial={{ opacity: 0, y: 20, x: "-50%" }}
  animate={{ opacity: 1, y: 0, x: "-50%" }}
  transition={{ delay: 0.6, duration: 0.6 }}
>
        Pogledaj pozivnicu
      </motion.button>
    </section>
  );
}

export default SplitVideoIntro;