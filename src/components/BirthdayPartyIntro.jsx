import { motion } from "framer-motion";
import "../styles/intro.css";

function BirthdayPartyIntro({
  brideName,
  weddingDate,
  videoSrc,
  babyImage,
  image,
  imageSrc,
  partyGender = "girl",
  onEnter,
}) {
  const name = brideName || "Ana";
  const baby = babyImage || image || imageSrc;

  const dateParts = weddingDate?.split(" ") || [];
  const day = dateParts[0] || "1";

  const genderClass =
    partyGender === "boy" ? "birthday-party-boy" : "birthday-party-girl";

  return (
    <section className={`birthday-party-intro ${genderClass}`}>
      {videoSrc && (
        <video
          className="birthday-party-bg-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      <div className="birthday-party-overlay" />

      <motion.div
        className="birthday-party-content"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="birthday-party-title"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
        >
          <h1>{name}</h1>
          <p>slavi</p>

          <div className="birthday-party-age">
            <span>{day}.</span>
            <strong>rođendan</strong>
          </div>
        </motion.div>

        {baby && (
          <motion.img
            src={baby}
            alt={name}
            className="birthday-party-baby"
            initial={{ opacity: 0, scale: 0.88, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              delay: 0.45,
              duration: 0.85,
              ease: [0.22, 1, 0.36, 1],
            }}
            draggable="false"
          />
        )}

        <motion.button
          type="button"
          className="birthday-party-button"
          onClick={onEnter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          whileTap={{ scale: 0.97 }}
        >
          Pogledajte pozivnicu
        </motion.button>
      </motion.div>
    </section>
  );
}

export default BirthdayPartyIntro;