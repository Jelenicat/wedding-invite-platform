import { motion } from "framer-motion";

function SplitVideoIntro({
  slug,
  brideName,
  groomName,
  videoSrc,
  onEnter,
  onStartMusic,
  musicStarted = false,
  hasMusic = false,
  details = {},
  script = "latin",
}) {
  const theme = details.theme || {};

  const isNinaMilan = slug === "nina-milan";

  const isCyrillic =
    script === "cyrillic" ||
    details.script === "cyrillic" ||
    /[А-Яа-яЉЊЋЂЏђћљњџ]/.test(
      `${brideName || ""} ${groomName || ""}`
    );

  const t = isCyrillic
    ? {
        and: "&",
        button: "Погледај позивницу",
        playMusic: "Пусти музику",
      }
    : {
        and: "&",
        button: "Pogledaj pozivnicu",
        playMusic: "Pusti muziku",
      };

  const themeStyles = {
    "--intro-bg": theme.introBg || "#e9e4de",

    "--intro-main-text":
      theme.introMainText ||
      theme.mainText ||
      "#ffffff",

    "--intro-accent":
      theme.introAccent ||
      theme.accent ||
      "#ffffff",

    "--intro-button-bg":
      theme.introButtonBg ||
      "rgba(255, 255, 255, 0.18)",

    "--intro-button-text":
      theme.introButtonText ||
      theme.buttonText ||
      "#000000",

    "--intro-button-border":
      theme.introButtonBorder ||
      "rgba(20, 20, 20, 0.28)",

    "--intro-button-hover-bg":
      theme.introButtonHoverBg ||
      "rgba(255, 255, 255, 0.22)",

    "--intro-button-hover-shadow":
      theme.introButtonHoverShadow ||
      "rgba(0, 0, 0, 0.14)",

    "--intro-text-shadow":
      theme.introTextShadow ||
      "rgba(0, 0, 0, 0.18)",

    "--intro-overlay":
      theme.introOverlay ||
      "rgba(255, 252, 248, 0.05)",

    "--intro-play-bg":
      theme.introPlayBg ||
      "rgba(255, 255, 255, 0.2)",

    "--intro-play-text":
      theme.introPlayText ||
      "#ffffff",
  };

  /*
   * Dugme postoji samo za nina-milan.
   * Nestaje čim se muzika uspešno pokrene.
   */
  const showMusicButton =
    isNinaMilan &&
    !musicStarted &&
    hasMusic &&
    typeof onStartMusic === "function";

  return (
    <section
      className={`split-video-intro ${
        slug ? `split-video-intro--${slug}` : ""
      } ${
        isCyrillic
          ? "split-video-intro--cyrillic"
          : ""
      }`}
      style={themeStyles}
    >
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

        <span className="split-and">
          {t.and}
        </span>

        <span>{groomName}</span>
      </div>

      {/* Dugme za muziku samo za slug nina-milan */}
      {showMusicButton && (
        <motion.div
          className="split-music-control"
          initial={{
            opacity: 0,
            y: 14,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.45,
            duration: 0.6,
            ease: "easeOut",
          }}
        >
          <motion.button
            type="button"
            className="split-music-circle"
            onClick={onStartMusic}
            aria-label={t.playMusic}
            whileHover={{
              scale: 1.06,
            }}
            whileTap={{
              scale: 0.94,
            }}
          >
            <span
              className="split-music-icon"
              aria-hidden="true"
            />
          </motion.button>

          <span className="split-music-label">
            {t.playMusic}
          </span>
        </motion.div>
      )}

      <motion.button
        type="button"
        className="split-btn"
        onClick={onEnter}
        initial={{
          opacity: 0,
          y: 20,
          x: "-50%",
        }}
        animate={{
          opacity: 1,
          y: 0,
          x: "-50%",
        }}
        transition={{
          delay: 0.6,
          duration: 0.6,
        }}
      >
        {t.button}
      </motion.button>
    </section>
  );
}

export default SplitVideoIntro;