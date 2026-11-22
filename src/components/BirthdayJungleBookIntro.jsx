import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import "../styles/newintro.css";

export const JUNGLE_ART = {
  closed: "/images/birthday-jungle-book/book-closed.webp",
  open: "/images/birthday-jungle-book/book-open.webp",
  prologue: "/images/birthday-jungle-book/jungle-prologue.webp",
  clearing: "/images/birthday-jungle-book/lantern-garden.webp",
  butterfly: "/images/birthday-jungle-book/golden-butterfly.webp",
  sunlight: "/images/birthday-jungle-book/forest-sunlight.webp",
  watch: "/images/birthday-jungle-book/forest-pocket-watch.webp",
  paw: "/images/birthday-jungle-book/page-paw.webp",
  river: "/images/birthday-jungle-book/page-river.webp",
  canopy: "/images/birthday-jungle-book/page-canopy.webp",
};

const marks = {
  paw: "0% 0%",
  drop: "50% 0%",
  feather: "100% 0%",
  leaf: "0% 100%",
  compass: "50% 100%",
  check: "100% 100%",
};

export function jungleData(props) {
  const details = props.details || {};
  const config = details.jungleBook || {};
  const cyrillic = (props.script ?? details.script) === "cyrillic";
  const text = (latin, cyr) => cyrillic ? cyr : latin;
  const name = String(config.name || props.childName || props.brideName || text("Leo", "Лео")).trim()
    || text("Leo", "Лео");
  const configuredAge = Number(details.age ?? props.age ?? 1);
  return {
    config, details, text, name,
    script: cyrillic ? "cyrillic" : "latin",
    language: cyrillic ? "sr-Cyrl" : "sr-Latn",
    age: Number.isInteger(configuredAge) && configuredAge > 0 ? configuredAge : 1,
    date: details.date || props.weddingDate || "",
    dateISO: details.dateISO || "",
    time: details.time || props.weddingTime || "",
    venue: details.locationName || details.venue || props.venue || "",
    address: details.locationAddress || "",
  };
}

export function JungleMark({ type, className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={className ? "jb-mark " + className : "jb-mark"}
      style={{ backgroundPosition: marks[type] || marks.leaf }}
    />
  );
}

export default function BirthdayJungleBookIntro(props) {
  const { config, name, age, text, script, language } = jungleData(props);
  const prefersReducedMotion = useReducedMotion();
  const timer = useRef(null);
  const [opening, setOpening] = useState(false);
  const prologueImage = config.prologueImage || JUNGLE_ART.prologue;
  const handoff = prologueImage === JUNGLE_ART.prologue && !prefersReducedMotion;

  useEffect(() => {
    window.clearTimeout(timer.current);
    timer.current = null;
    setOpening(false);
    return () => window.clearTimeout(timer.current);
  }, [props.slug]);

  useEffect(() => {
    const prologue = new Image();
    prologue.fetchPriority = "low";
    prologue.src = prologueImage;
  }, [prologueImage]);

  const openBook = () => {
    if (timer.current !== null) return;
    setOpening(true);
    timer.current = window.setTimeout(() => props.onEnter?.(), prefersReducedMotion ? 0 : handoff ? 1460 : 1050);
    try {
      Promise.resolve(props.onStartMusic?.()).catch(() => {});
    } catch {
      // Pozivnica se otvara i ako audio nije dostupan.
    }
  };

  return (
    <section className="jb jb-intro" lang={language} data-script={script} data-opening={opening} data-handoff={handoff}>
      <div className="jb-cover-stage">
        <img className="jb-cover-photo" src={JUNGLE_ART.closed} alt="" fetchPriority="high" />
        <img className="jb-cover-photo jb-open-photo" src={JUNGLE_ART.open} alt="" fetchPriority="low" />
        <div className="jb-cover-leaf">
          <img src={JUNGLE_ART.closed} alt="" draggable="false" />
          <div className="jb-cover-title">
            <p className="jb-eyebrow">{text("Knjiga o džungli", "Књига о џунгли")}</p>
            <h1 className="jb-script" data-long-name={name.length > 13}>{name}</h1>
            <p>{age}. {text("rođendan", "рођендан")}</p>
          </div>
        </div>
        <button
          type="button"
          className="jb-book-seal"
          disabled={opening}
          onClick={openBook}
        >
          <span>{text("Otvori knjigu", "Отвори књигу")}</span>
        </button>
      </div>
      {handoff && (
        <div className="jb-opening-overlay" aria-hidden="true">
          <img className="jb-opening-light" src={JUNGLE_ART.sunlight} alt="" fetchPriority="low" />
          <img className="jb-opening-butterfly" src={JUNGLE_ART.butterfly} alt="" fetchPriority="low" />
        </div>
      )}
      <span className="jb-visually-hidden" role="status">
        {opening && text("Knjiga se otvara.", "Књига се отвара.")}
      </span>
    </section>
  );
}
