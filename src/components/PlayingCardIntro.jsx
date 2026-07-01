import { motion } from "framer-motion";
import "../styles/intro.css";

function getInitial(value = "") {
  const cleanValue = String(value).trim();
  if (!cleanValue) return "";
  return Array.from(cleanValue)[0].toUpperCase();
}

function PlayingCardIntro({
  brideName = "Jelisaveta",
  groomName = "Luka",
  onEnter,
}) {
  const brideInitial = getInitial(brideName);
  const groomInitial = getInitial(groomName);

  return (
    <section className="pc-intro" aria-label="Wedding playing card intro">
      <div className="pc-intro-glow pc-intro-glow-1" />
      <div className="pc-intro-glow pc-intro-glow-2" />

      <motion.div
        className="pc-card"
        initial={{ opacity: 0, y: 28, scale: 0.965, rotateX: 6 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="pc-card-shine" />
        <div className="pc-card-grain" />
        <div className="pc-inner-line" />

        <motion.div
          className="pc-corner pc-corner-top"
          initial={{ opacity: 0, x: -10, y: -8 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
        >
          <span className="pc-corner-initial">{brideInitial}</span>
          <span className="pc-corner-heart">♥</span>
        </motion.div>

        <motion.div
          className="pc-corner pc-corner-bottom"
          initial={{ opacity: 0, x: 10, y: 8, rotate: 180 }}
          animate={{ opacity: 1, x: 0, y: 0, rotate: 180 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <span className="pc-corner-initial">{groomInitial}</span>
          <span className="pc-corner-heart">♥</span>
        </motion.div>

        <motion.div
          className="pc-main-copy"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.8 }}
        >
          <div className="pc-name pc-name-bride">{brideName}</div>
          <div className="pc-amp">&</div>
          <div className="pc-name pc-name-groom">{groomName}</div>
          <div className="pc-invite-text">vas pozivaju na venčanje</div>
        </motion.div>

        <motion.div
          className="pc-heart-stage"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.62,
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="pc-big-heart" aria-hidden="true">
            ♥
          </div>

          <div className="pc-script-art" aria-hidden="true">
            <div className="pc-script-line pc-script-line-one">Lucky in</div>
            <div className="pc-script-line pc-script-line-two">Love</div>
          </div>
        </motion.div>

        <motion.button
          type="button"
          className="pc-enter-button"
          onClick={onEnter}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.92, duration: 0.75 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="pc-button-heart">♥</span>
          <span>Pogledaj pozivnicu</span>
        </motion.button>
      </motion.div>
    </section>
  );
}

export default PlayingCardIntro;