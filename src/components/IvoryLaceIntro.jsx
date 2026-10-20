import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { IvoryLaceNames, IvoryLaceText } from "./IvoryLaceCountdown";
import "../styles/newintro.css";

export default function IvoryLaceIntro({
  brideName, groomName, weddingDate, details = {}, onEnter, onStartMusic, script = "latin", language = "sr",
}) {
  const reduced = useReducedMotion();
  const [opening, setOpening] = useState(false);
  const timer = useRef(null);
  const entered = useRef(false);
  const enterCallback = useRef(onEnter);
  enterCallback.current = onEnter;
  const config = details.ivoryLace || {};
  const envelopeOpen = config.envelopeOpen || "/images/ivory-lace-lace-envelope-open.png";
  const envelopeClosed = config.envelopeClosed || "/images/ivory-lace-lace-envelope-closed.png";
  const t = language === "en" ? { title: "Invitation", subtitle: "to our wedding", open: "View invitation", envelope: "Wedding envelope" }
    : language === "de" ? { title: "Einladung", subtitle: "zu unserer Hochzeit", open: "Einladung ansehen", envelope: "Hochzeitsumschlag" }
    : script === "cyrillic" ? { title: "Позивница", subtitle: "за венчање", open: "Погледај позивницу", envelope: "Коверта позивнице" }
    : { title: "Pozivnica", subtitle: "za venčanje", open: "Pogledaj pozivnicu", envelope: "Koverta pozivnice" };

  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    [config.photo || "/images/ivory-lace-portrait.png", config.laceFrame || "/images/ivory-lace-couture-frame.png", envelopeOpen, envelopeClosed].forEach((src) => {
      const image = new Image(); image.src = src;
    });
  }, [config.photo, config.laceFrame, envelopeOpen, envelopeClosed]);

  function open() {
    if (entered.current) return;
    entered.current = true;
    onStartMusic?.();
    setOpening(true);
    timer.current = window.setTimeout(() => enterCallback.current?.(), reduced ? 100 : 1750);
  }

  return (
    <section className={`ivl ivl-intro ${opening ? "ivl-is-opening" : ""} ${script === "cyrillic" ? "ivl-cyrillic" : ""}`} aria-busy={opening}>
      {config.showIntroBackground !== false && <img className="ivl-intro-background"
        src={config.introBackground || "/images/ivory-lace-chiffon.png"} alt="" aria-hidden="true" decoding="async" />}
      <motion.div className="ivl-intro-paper"
        initial={reduced ? false : { opacity: 0, y: 24, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="ivl-intro-heading ivl-intro-copy">
          <IvoryLaceText as="p" className="ivl-kicker" immediate>{t.title}</IvoryLaceText>
          <p className="ivl-intro-subtitle">{t.subtitle}</p>
        </div>
        <div className="ivl-intro-names ivl-intro-copy"><IvoryLaceNames brideName={brideName} groomName={groomName} immediate /></div>
        <div className="ivl-envelope-stage">
          <img className="ivl-env-back" src={envelopeOpen} width="1254" height="1254" alt="" />
          <div className="ivl-env-letter" aria-hidden="true">
            <span className="ivl-kicker">{t.subtitle}</span>
            <span className="ivl-env-letter-names ivl-script">{(brideName || "Ana").split(" ")[0]}<br />&amp; {(groomName || "Nikola").split(" ")[0]}</span>
            <span className="ivl-env-letter-date">{details.date || weddingDate}</span>
          </div>
          <img className="ivl-env-front" src={envelopeOpen} width="1254" height="1254" alt="" />
          <div className="ivl-env-flap">
            <img className="ivl-env-flap-face ivl-env-flap-outside" src={envelopeClosed} width="1254" height="1254" alt="" />
            <div className="ivl-env-flap-face ivl-env-flap-inside">
              <img src={envelopeOpen} width="1254" height="1254" alt="" />
            </div>
          </div>
          <button className="ivl-envelope-seal" type="button" onClick={open} disabled={opening} aria-label={t.open}>
            <img src="/icons/ivory-lace-wax-seal.svg" width="100" height="100" alt="" />
          </button>
        </div>
        <motion.button className="ivl-button ivl-open-button" type="button" onClick={open} disabled={opening}
          whileTap={reduced ? undefined : { scale: 0.97 }}
        >
          <span>{t.open}</span>
          <img src="/icons/ivory-lace-arrow.svg" alt="" width="21" height="16" />
        </motion.button>
      </motion.div>
    </section>
  );
}
