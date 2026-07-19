import { motion } from "framer-motion";
import "../styles/birthdayintro.css";

function splitDate(dateValue = "") {
  const normalized = String(dateValue).replace(/\s+/g, " ").trim();
  const match = normalized.match(/^(.*?)(20\d{2}\.?)$/);

  if (!match) {
    return {
      main: normalized,
      year: "",
    };
  }

  return {
    main: match[1].trim(),
    year: match[2].trim(),
  };
}

function BirthdayEvaIntro({
  brideName,
  childName,
  weddingDate,
  introText,
  babyImage,
  introPreviewImage,
  backgroundImage,
  script,
  details = {},
  onEnter,
}) {
  const activeScript = script || details?.script || "latin";
  const isCyrillic = activeScript === "cyrillic";

  const name =
    childName ||
    brideName ||
    (isCyrillic ? "Ева" : "Eva");

  const defaultSentence = isCyrillic
    ? "слави свој први рођендан"
    : "slavi svoj prvi rođendan";

  const buttonText = isCyrillic
    ? "Погледај позивницу"
    : "Pogledaj pozivnicu";

  const bearAlt = isCyrillic ? "Меда" : "Meda";

  const sentence =
    introText ||
    details?.occasionText ||
    defaultSentence;

  const bearImage =
    babyImage ||
    details?.babyImage ||
    "";

  const introBackground =
    introPreviewImage ||
    details?.introPreviewImage ||
    backgroundImage ||
    "/images/eva/eva-intro-bg.png";

  const { main: dateMain, year: dateYear } = splitDate(
    details?.date || weddingDate
  );

  return (
    <motion.section
      className={`birthday-eva-intro ${
        isCyrillic ? "birthday-eva-intro-cyrillic" : ""
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.65,
        ease: "easeOut",
      }}
    >
      <img
        className="birthday-eva-intro-background"
        src={introBackground}
        alt=""
        aria-hidden="true"
        draggable="false"
      />

      <motion.div
        className="birthday-eva-intro-content"
        initial={{
          opacity: 0,
          y: 24,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.9,
          delay: 0.12,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <motion.h1
          className="birthday-eva-intro-name"
          initial={{
            opacity: 0,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.8,
            delay: 0.2,
          }}
        >
          {name}
        </motion.h1>

        <motion.div
          className={`birthday-eva-intro-bear-wrap ${
            bearImage ? "has-bear" : "is-empty"
          }`}
          initial={{
            opacity: 0,
            y: 18,
            scale: 0.97,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.9,
            delay: 0.28,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {bearImage && (
            <img
              src={bearImage}
              alt={bearAlt}
              className="birthday-eva-intro-bear"
              draggable="false"
            />
          )}
        </motion.div>

        <motion.p
          className="birthday-eva-intro-sentence"
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.75,
            delay: 0.38,
          }}
        >
          {sentence}
        </motion.p>

        <motion.div
          className="birthday-eva-intro-date"
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.75,
            delay: 0.46,
          }}
        >
          <span>{dateMain}</span>

          {dateYear && <strong>{dateYear}</strong>}
        </motion.div>

        <motion.button
          type="button"
          className="birthday-eva-intro-button"
          onClick={onEnter}
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.75,
            delay: 0.56,
          }}
          whileHover={{
            y: -2,
          }}
          whileTap={{
            scale: 0.98,
          }}
        >
          {buttonText}
        </motion.button>
      </motion.div>
    </motion.section>
  );
}

export default BirthdayEvaIntro;