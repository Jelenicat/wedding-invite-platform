import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { keepsakeCopy, keepsakeDate, KeepsakeHeart, useKeepsakeFonts } from "./KeepsakeCountdown";
import "../styles/newintro.css";

export default function KeepsakeIntro({ brideName, groomName, childName, weddingDate, introText, details = {}, image1, image2,
  onEnter, onStartMusic, script = "latin", language = "sr" }) {
  useKeepsakeFonts();
  const reduced = useReducedMotion();
  const config = details.keepsake || {};
  const t = keepsakeCopy(script, language, config.copy);
  const [opening, setOpening] = useState(false);
  const locked = useRef(false);
  const timer = useRef(null);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const title = Array.isArray(config.introTitle) ? config.introTitle : t.heroTitle;
  const date = keepsakeDate(details.dateISO);
  const displayDate = weddingDate || details.date || date?.numeric || "";
  const names = [brideName, groomName].filter(Boolean);
  const photos = Array.isArray(config.childhoodPhotos) ? config.childhoodPhotos.slice(0, 2) : [
    image1 ? { src: image1, name: groomName } : null, image2 ? { src: image2, name: brideName } : null,
  ].filter(Boolean);
  const open = () => {
    if (locked.current) return;
    locked.current = true;
    // Start the existing audio callback inside the original tap on iOS.
    // WeddingPage remains responsible for the audio element and routing.
    onStartMusic?.();
    setOpening(true);
    timer.current = window.setTimeout(() => onEnter?.(), reduced ? 0 : 680);
  };
  const entrance = reduced ? { duration: 0 } : { duration: 0.9, ease: [0.22, 1, 0.36, 1] };
  return <section className="keepsake-intro" data-script={script} aria-busy={opening}>
    <motion.div className="keepsake-intro-sheet"
      initial={reduced ? false : { opacity: 0 }} animate={opening ? { opacity: 0, y: reduced ? 0 : -24 } : { opacity: 1, y: 0 }}
      transition={opening ? { duration: reduced ? 0 : 0.65, ease: [0.65, 0, 0.35, 1] } : entrance}>
      <motion.p className="keepsake-intro-kicker" initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }} transition={{ ...entrance, delay: reduced ? 0 : 0.1 }}>{config.introKicker || t.invited}</motion.p>
      <div className={`keepsake-intro-collage${photos.length ? "" : " keepsake-intro-collage--type"}`}>
        <h1 className="keepsake-intro-title" aria-label={title.join(" ")}>
          {title.map((line, index) => <motion.span key={`${line}-${index}`} className={`keepsake-intro-word keepsake-intro-word--${index + 1}`} aria-hidden="true"
            initial={reduced ? false : { opacity: 0, y: 20, rotate: -10 }} animate={{ opacity: 1, y: 0, rotate: -9 }}
            transition={{ ...entrance, delay: reduced ? 0 : 0.15 + index * 0.12 }}>{line}</motion.span>)}
        </h1>
        <p className="keepsake-intro-marginalia" aria-hidden="true">{config.littleNote || t.littleNote}</p>
        {photos.map((photo, index) => photo?.src ? <motion.figure className={`keepsake-intro-photo keepsake-intro-photo--${index + 1}`} key={`${photo.src}-${index}`}
          initial={reduced ? false : { opacity: 0, y: 35, rotate: index === 0 ? -17 : 20 }}
          animate={{ opacity: 1, y: 0, rotate: index === 0 ? -8 : 12 }}
          transition={{ ...entrance, delay: reduced ? 0 : 0.35 + index * 0.17 }}>
          <img src={photo.src} alt={photo.alt || photo.name || ""} width="400" height="500"
            style={{ objectPosition: photo.position || "center" }} decoding="async" fetchPriority={index === 0 ? "high" : "auto"} />
          {photo.name && <figcaption>{photo.name}</figcaption>}
        </motion.figure> : null)}
        <motion.svg className="keepsake-intro-swoop" viewBox="0 0 220 90" fill="none" aria-hidden="true">
          <motion.path d="M6 65C35 21 138 12 196 30 224 39 197 63 166 54 148 49 169 34 183 37M195 26l8 8-12 1"
            stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" initial={reduced ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }} transition={{ duration: reduced ? 0 : 1.3, delay: reduced ? 0 : 0.7 }} />
        </motion.svg>
      </div>
      {introText && <p className="keepsake-intro-message">{introText}</p>}
      <motion.div className="keepsake-intro-bottom" initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }} transition={{ ...entrance, delay: reduced ? 0 : 0.75 }}>
        <div className="keepsake-intro-signature">
          <p className="keepsake-intro-names">{names.length ? names.map((name, index) => <span key={`${name}-${index}`}>
            {index > 0 && <KeepsakeHeart className="keepsake-intro-name-heart" />}{name}
          </span>) : childName}</p>
          {displayDate && <p className="keepsake-intro-date">{displayDate}</p>}
        </div>
        <button type="button" className="keepsake-intro-open" onClick={open} disabled={opening}>
          <span>{opening ? t.opening : t.open}</span>
          <svg viewBox="0 0 56 56" aria-hidden="true" fill="none"><circle cx="28" cy="28" r="25" stroke="currentColor" strokeWidth="1.5" />
            <path d="m23 17 17 11-17 11Z" fill="currentColor" /></svg>
        </button>
      </motion.div>
    </motion.div>
  </section>;
}
