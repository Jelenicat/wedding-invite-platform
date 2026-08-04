import { motion } from "framer-motion";
import { useState } from "react";
import "../styles/intro.css";

function ElegantWhiteIntro({
  onEnter,
  brideName,
  groomName,
  weddingDate,
  backgroundImage,
  monogram,
  subtitle,
  script = "latin",
}) {
  const isCyrillic = script === "cyrillic";

  const t = isCyrillic
    ? {
        subtitle: "Добро дошли",
        story: "наша прича почиње овде",
        button: "Погледај позивницу",
      }
    : {
        subtitle: "Dobrodošli",
        story: "naša priča počinje ovde",
        button: "Pogledaj pozivnicu",
      };

  const displayedSubtitle = subtitle || t.subtitle;

  const computedMonogram =
    monogram ||
    `${brideName?.charAt(0) || ""} | ${
      groomName?.charAt(0) || ""
    }`;

  const [isLeaving, setIsLeaving] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

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
      className={`elegant-white-intro ${
        isCyrillic
          ? "elegant-white-intro--cyrillic"
          : ""
      }`}
      initial={{
        opacity: 0,
        scale: 1.02,
      }}
      animate={
        isLeaving
          ? {
              opacity: 0,
              scale: 1.03,
              filter: "blur(8px)",
            }
          : {
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
            }
      }
      transition={{
        duration: isLeaving ? 1 : 1.2,
        ease: "easeOut",
      }}
    >
      <div
        className="elegant-white-intro-bg"
        style={{
          backgroundImage: `url(${
            backgroundImage ||
            "/images/elegant-white/intro.jpg"
          })`,
        }}
      />

      <div className="elegant-white-intro-overlay" />

      <motion.div
        className="elegant-white-intro-card-wrap"
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={
          isLeaving
            ? {
                opacity: 0,
                y: 24,
                scale: 0.98,
              }
            : {
                opacity: 1,
                y: 0,
                scale: 1,
              }
        }
        transition={{
          duration: 1.1,
          ease: "easeOut",
          delay: 0.15,
        }}
      >
        <div className="elegant-white-intro-card">
          <motion.div
            className="elegant-white-monogram"
            initial={{
              opacity: 0,
              y: 14,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.35,
            }}
          >
            <img
              src="/images/elegant-white/monogram-frame.svg"
              alt=""
              aria-hidden="true"
              className="elegant-white-monogram-frame"
            />

            <span className="elegant-white-monogram-text">
              {computedMonogram}
            </span>
          </motion.div>

          <div className="elegant-white-divider" />

          <motion.p
            className="elegant-white-subtitle"
            initial={{
              opacity: 0,
              y: 14,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.55,
            }}
          >
            {displayedSubtitle}
          </motion.p>

          <motion.h1
            className="elegant-white-title"
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.9,
              delay: 0.65,
            }}
          >
            <span className="elegant-white-title-name">
              {brideName}
            </span>

            <span className="elegant-white-title-amp">
              &
            </span>

            <span className="elegant-white-title-name">
              {groomName}
            </span>
          </motion.h1>

          <motion.p
            className="elegant-white-script"
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.9,
              delay: 0.8,
            }}
          >
            {t.story}
          </motion.p>

          <motion.p
            className="elegant-white-date"
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.9,
              delay: 0.95,
            }}
          >
            {weddingDate}
          </motion.p>

          <motion.button
            type="button"
            className="elegant-white-button"
            onClick={handleEnter}
            whileHover={{
              y: -2,
              scale: 1.01,
            }}
            whileTap={{
              scale: 0.99,
            }}
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.9,
              delay: 1.05,
            }}
          >
            {t.button}
          </motion.button>

          <motion.div
            className="elegant-white-arrow"
            initial={{
              opacity: 0,
              y: 6,
            }}
            animate={{
              opacity: 1,
              y: [0, 6, 0],
            }}
            transition={{
              opacity: {
                duration: 0.9,
                delay: 1.2,
              },
              y: {
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.2,
              },
            }}
            aria-hidden="true"
          >
            ˅
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}

export default ElegantWhiteIntro;