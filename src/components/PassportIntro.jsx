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