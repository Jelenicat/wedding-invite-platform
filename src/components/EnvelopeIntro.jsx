import { motion, AnimatePresence } from "framer-motion";
import bgImage from "../assets/wedding-bg.jpg";
import sealImage from "../assets/seal.png";

function EnvelopeIntro({ isOpen, onOpen, brideName, groomName }) {
  const safeBrideName = brideName || "Bride";
  const safeGroomName = groomName || "Groom";

  const envelopeVariants = {
    closed: {
      rotateX: 0,
      y: 0,
    },
    open: {
      rotateX: 2,
      y: -4,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const letterVariants = {
    closed: {
      x: "-50%",
      y: 138,
      scale: 0.94,
      rotate: 0,
      opacity: 0,
    },
    open: {
      x: "-50%",
      y: -118,
      scale: 1.03,
      rotate: -1.5,
      opacity: 1,
      transition: {
        duration: 1.45,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.22,
      },
    },
  };

  const flapVariants = {
    closed: {
      rotateX: 0,
      y: 0,
    },
    open: {
      rotateX: -175,
      y: -2,
      transition: {
        duration: 0.95,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const sealVariants = {
    closed: {
      scale: 1,
      opacity: 1,
      y: 0,
    },
    open: {
      scale: 0.72,
      opacity: 0,
      y: -8,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="invite-hero">
      <motion.div
        className="invite-hero-bg"
        style={{ backgroundImage: `url(${bgImage})` }}
        animate={{
          scale: [1.08, 1.12, 1.08],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 12,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
        }}
      />

      <div className="invite-hero-overlay" />

      <div className="invite-hero-content">
        <p className="invite-kicker">Digitalna pozivnica</p>

        <h1 className="invite-heading">
          Forever starts <span>now...</span>
        </h1>

        <div className="invite-envelope-scene">
          <motion.div
            className={`invite-envelope ${isOpen ? "open" : ""}`}
            data-open={isOpen ? "true" : "false"}
            initial={false}
            animate={isOpen ? "open" : "closed"}
            variants={envelopeVariants}
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              className="invite-letter"
              variants={letterVariants}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="invite-letter-inner">
                <p className="invite-letter-label">Wedding Invitation</p>
                <h3>
                  {safeBrideName} <span>&</span> {safeGroomName}
                </h3>
              </div>
            </motion.div>

            <div className="invite-envelope-base" />
            <div className="invite-envelope-shine" />

            <motion.div
              className="invite-envelope-flap"
              variants={flapVariants}
              style={{
                transformOrigin: "top center",
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
            />

            <motion.button
              type="button"
              className="invite-seal"
              onClick={onOpen}
              disabled={isOpen}
              variants={sealVariants}
              whileHover={!isOpen ? { scale: 1.05 } : undefined}
              whileTap={!isOpen ? { scale: 0.97 } : undefined}
              style={{ backgroundImage: `url(${sealImage})` }}
              aria-label="Open invitation"
            />
          </motion.div>
        </div>

        <AnimatePresence>
          {!isOpen && (
            <motion.p
              className="invite-open-text"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.25 }}
            >
              Kliknite na pečat da otvorite pozivnicu
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default EnvelopeIntro;