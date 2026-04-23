import { motion } from "framer-motion";
import { useState } from "react";
import "../styles/intro.css";

function ElegantBlackIntro({
  onEnter,
  brideName,
  groomName,
  slug,
  backgroundImage,
  script = "latin",
}) {
  const [isLeaving, setIsLeaving] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const t =
    script === "cyrillic"
      ? {
          top: "ВАША ЉУБАВНА ПРИЧА ПОЧИЊЕ ОВДЕ",
          quote: "Свака љубавна прича је лепа,\nали наша је моја омиљена.",
          button: "Погледај позивницу",
        }
      : {
          top: "VAŠA LJUBAVNA PRIČA POČINJE OVDE",
          quote: "Svaka ljubavna priča je lepa,\nali naša je moja omiljena.",
          button: "Pogledaj pozivnicu",
        };

  const introBg = backgroundImage || `/images/elegant-black/${slug}-intro.jpg`;
  const topOrnament = `/images/elegant-black/gore.svg`;
  const bottomOrnament = `/images/elegant-black/dole.svg`;

  const handleEnter = () => {
    if (isLeaving) return;

    setIsLeaving(true);

    setTimeout(() => {
      setIsHidden(true);
      onEnter?.();
    }, 1000);
  };

  if (isHidden) return null;

  return (
    <motion.section
      className="elegant-black-intro"
      initial={{ opacity: 1 }}
      animate={
        isLeaving
          ? {
              opacity: 0,
              scale: 1.03,
              filter: "blur(6px)",
            }
          : {
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
            }
      }
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="elegant-black-intro-bg"
        style={{ backgroundImage: `url(${introBg})` }}
      />

      <div className="elegant-black-intro-overlay" />
      <div className="elegant-black-intro-vignette" />

      <motion.div
        className="elegant-black-intro-content"
        initial={{ opacity: 0, y: 24 }}
        animate={isLeaving ? { opacity: 0, y: -18 } : { opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      >
        <p className="elegant-black-intro-top">{t.top}</p>

        <img
          src={topOrnament}
          alt=""
          className="elegant-black-intro-ornament elegant-black-intro-ornament-top"
        />

        <h1 className="elegant-black-intro-title">
          <span className="elegant-black-intro-name">{brideName}</span>

          <span className="elegant-black-intro-ampersand">&</span>

          <span className="elegant-black-intro-name">{groomName}</span>
        </h1>

        <img
          src={bottomOrnament}
          alt=""
          className="elegant-black-intro-ornament elegant-black-intro-ornament-bottom"
        />

        <p className="elegant-black-intro-quote">
          {t.quote.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              {i !== t.quote.split("\n").length - 1 && <br />}
            </span>
          ))}
        </p>

        <button
          type="button"
          className="elegant-black-intro-button"
          onClick={handleEnter}
        >
          {t.button}
        </button>
      </motion.div>
    </motion.section>
  );
}

export default ElegantBlackIntro;