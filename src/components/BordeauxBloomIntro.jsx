import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import EnvelopeFlapIntro from "./EnvelopeFlapIntro";
import "../styles/newintro.css";

// Omotač koristi postojeći EnvelopeFlapIntro, bez menjanja njegovog fajla.
export default function BordeauxBloomIntro({ details = {}, onReveal, onEnter, script = "latin", language = "sr", ...props }) {
  const config = details.bordeauxBloom || {};
  const reduced = useReducedMotion();
  const [opening, setOpening] = useState(false);
  const timer = useRef(null);
  const revealed = useRef(false);
  const callbacks = useRef({ onReveal, onEnter });
  callbacks.current = { onReveal, onEnter };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  function reveal() {
    if (revealed.current) return;
    revealed.current = true;
    callbacks.current.onReveal?.();
  }
function start() {
  setOpening(true);
  reveal();
}
  function finish() {
    window.clearTimeout(timer.current);
    reveal();
    callbacks.current.onEnter?.();
  }
  const t = language === "en" ? { title: "Invitation", subtitle: "to our wedding", open: "View invitation" }
    : language === "de" ? { title: "Einladung", subtitle: "zu unserer Hochzeit", open: "Einladung ansehen" }
    : script === "cyrillic" ? { title: "Позивница", subtitle: "за наше венчање", open: "Погледај позивницу" }
    : { title: "Pozivnica", subtitle: "za naše venčanje", open: "Pogledaj pozivnicu" };

  return <div className={`bb bb-intro-wrap ${opening ? "bb-is-opening" : ""} ${script === "cyrillic" ? "bb-cyrillic" : ""}`}>
    <EnvelopeFlapIntro {...props} details={{ ...details, envelopeFlap: { ...details.envelopeFlap, hingePercent: 0 } }}
      slug={config.envelopeAssetSlug || "bordeaux-bloom-demo"} script={script} language={language}
      openHint={config.introOpenText || t.open} onReveal={start} onEnter={finish} />
    <div className="bb-intro-copy" aria-hidden="true">
      <motion.img className="bb-intro-crest" src="/icons/bordeaux-bloom-divider.svg" width="180" height="48" alt="" initial={reduced ? false : { opacity: 0, scale: .85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .2, duration: 1.5 }} />
      <p className="bb-script">{config.introTitle || t.title}</p>
      <p className="bb-intro-subtitle">{config.introSubtitle || t.subtitle}</p>
    </div>
    {!reduced && <motion.span className="bb-intro-light" aria-hidden="true" initial={{ x: "-160%", opacity: 0 }} animate={{ x: "160%", opacity: [0, .65, 0] }} transition={{ delay: .8, duration: 3.2, ease: "easeInOut" }} />}
  </div>;
}
