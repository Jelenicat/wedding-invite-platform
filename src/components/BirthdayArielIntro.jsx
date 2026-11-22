import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import "../styles/newintro.css";

export const ARIEL_ART = {
  closed: "/images/birthday-ariel/shell-closed.webp",
  open: "/images/birthday-ariel/shell-open.webp",
  mermaid: "/images/birthday-ariel/pearl-grotto.webp",
  pearl: "/images/birthday-ariel/travelling-pearl.webp",
  drift: "/images/birthday-ariel/sea-drift.webp",
  refraction: "/images/birthday-ariel/tidal-refraction.webp",
  garden: "/images/birthday-ariel/reef-passage.webp",
  fish: "/images/birthday-ariel/reef-fish.webp",
  palace: "/images/birthday-ariel/palace-hall.webp",
  palaceEdges: "/images/birthday-ariel/palace-edges.webp",
  hourglass: "/images/birthday-ariel/pearl-hourglass.webp",
};

export function arielData(props) {
  const details = props.details || {};
  const config = details.ariel || {};
  const cyrillic = (props.script ?? details.script) === "cyrillic";
  const text = (latin, cyr) => cyrillic ? cyr : latin;
  const name = String(config.name || props.childName || props.brideName || "").trim() || text("Mila", "Мила");
  const age = Number(details.age ?? props.age ?? 1);

  return {
    details, config, text, name,
    script: cyrillic ? "cyrillic" : "latin",
    language: cyrillic ? "sr-Cyrl" : "sr-Latn",
    age: Number.isInteger(age) && age > 0 ? age : 1,
    date: details.date || props.weddingDate || "",
    dateISO: details.dateISO || "",
    time: details.time || props.weddingTime || "",
    venue: details.locationName || details.venue || props.venue || "",
    address: details.locationAddress || "",
  };
}

export default function BirthdayArielIntro(props) {
  const { config, text, name, age, script, language } = arielData(props);
  const reduceMotion = useReducedMotion();
  const [opening, setOpening] = useState(false);
  const openingTimer = useRef(null);
  const mermaid = config.mermaidImage || ARIEL_ART.mermaid;
  const openImage = config.openImage || ARIEL_ART.open;
  const carryPearl = mermaid === ARIEL_ART.mermaid && openImage === ARIEL_ART.open && !reduceMotion;

  useEffect(() => {
    setOpening(false);
    openingTimer.current = null;
    return () => window.clearTimeout(openingTimer.current);
  }, [props.slug]);

  useEffect(() => {
    const nextScene = new Image();
    nextScene.fetchPriority = "low";
    nextScene.src = mermaid;
  }, [mermaid]);

  const openShell = () => {
    if (openingTimer.current !== null) return;
    setOpening(true);
    const duration = reduceMotion ? 0 : carryPearl ? 1520 : 1120;
    openingTimer.current = window.setTimeout(() => props.onEnter?.(), duration);
    try {
      Promise.resolve(props.onStartMusic?.()).catch(() => {});
    } catch {
      // Otvaranje ostaje dostupno i ako audio nije spreman.
    }
  };

  return (
    <section className="ariel ariel-intro" data-script={script} data-opening={opening} data-pearl-handoff={carryPearl} lang={language}>
      <div className="ariel-cover">
        <div className="ariel-cover-art">
          <img src={config.coverImage || ARIEL_ART.closed} alt="" fetchPriority="high" />
          <img className="ariel-shell-open" src={openImage} alt="" fetchPriority="low" />
          <span className="ariel-pearl-light" aria-hidden="true" />
        </div>

        <div className="ariel-cover-copy">
          <p className="ariel-overline">{text("Arijelina morska bajka", "Аријелина морска бајка")}</p>
          <h1 className="ariel-name" data-long-name={name.length > 13}>{name}</h1>
          <p className="ariel-cover-age">{age}. {text("rođendan", "рођендан")}</p>
        </div>

        <button className="ariel-open" type="button" onClick={openShell} disabled={opening}>
          <span className="ariel-button ariel-button-glass">
            {text("Otvori školjku", "Отвори шкољку")}
          </span>
        </button>
      </div>
      {carryPearl && (
        <>
          <img className="ariel-transition-wave ariel-cover-wave" src={ARIEL_ART.refraction} alt="" fetchPriority="low" />
          <img className="ariel-moving-pearl ariel-cover-pearl" src={ARIEL_ART.pearl} alt="" fetchPriority="low" />
        </>
      )}
      <span className="ariel-sr-only" role="status">
        {opening && text("Školjka se otvara.", "Шкољка се отвара.")}
      </span>
    </section>
  );
}
