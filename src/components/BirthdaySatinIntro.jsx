import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import "../styles/newintro.css";

// Zajednički elementi su ovde da ceo template ostane u četiri JSX fajla.
export function satinData(props = {}) {
  const details = props.details || {};
  const satin = details.satin || {};
  const cyrillic = props.script === "cyrillic";
  const name = String(props.brideName || props.childName || satin.name || "Slavljenica");
  const rawAge = details.age ?? satin.age ?? 30;
  const age = /^\d{1,3}$/.test(String(rawAge)) ? String(rawAge) : "30";
  const iso = details.dateISO || "";
  let date = iso ? new Date(iso) : null;
  if (!date || Number.isNaN(date.getTime())) {
    const match = String(details.date || props.weddingDate || "").match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})\.?$/);
    date = match ? new Date(`${match[3]}-${match[2].padStart(2, "0")}-${match[1].padStart(2, "0")}T${props.weddingTime || "18:00"}:00`) : null;
    if (date && Number.isNaN(date.getTime())) date = null;
  }
  const locale = cyrillic ? "sr-Cyrl-RS" : "sr-Latn-RS";
  // Datum i satnica ostaju u vremenskoj zoni proslave, i za goste iz inostranstva.
  const timeZone = satin.timeZone || "Europe/Belgrade";
  const dateOptions = { timeZone };
  const dayMonth = date ? date.toLocaleDateString(locale, { ...dateOptions, day: "numeric", month: "long" }) : String(details.date || props.weddingDate || "");
  const year = date ? date.toLocaleDateString(locale, { ...dateOptions, year: "numeric" }) : "";
  const time = props.weddingTime || details.gatheringTime || (date ? date.toLocaleTimeString(locale, { timeZone, hour: "2-digit", minute: "2-digit", hour12: false }) : "");
  return {
    details, satin, cyrillic, name, age, date, dayMonth, year, time,
    nameScale: Math.max(0.48, Math.min(1, 6 / Math.max(6, Array.from(name).length))),
    t: (latin, cyrillicText) => cyrillic ? cyrillicText : latin,
  };
}

export function SatinReveal({ children, className = "", delay = 0, ...rest }) {
  const reduced = useReducedMotion();
  return <motion.div
    className={className}
    initial={reduced ? false : { opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.12, margin: "0px 0px -12px 0px" }}
    transition={{ duration: reduced ? 0 : 0.65, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    {...rest}
  >{children}</motion.div>;
}

export function SatinLetters({ children, as = "span", className = "", delay = 0, ...rest }) {
  const reduced = useReducedMotion();
  const Tag = motion[as];
  const text = String(children ?? "");
  let count = 0;
  return <Tag
    className={`bsa-letters ${className}`}
    aria-label={text}
    initial={reduced ? false : "hidden"}
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    {...rest}
  >
    {text.split(/(\s+)/).map((word, wordIndex) => /^\s+$/.test(word) ? <span key={wordIndex} aria-hidden="true">{word}</span> : (
      <span key={wordIndex} className="bsa-word" aria-hidden="true">
        {Array.from(word).map((letter, letterIndex) => {
          const index = count++;
          return <motion.span key={letterIndex} className="bsa-letter"
            variants={{ hidden: { opacity: 0, y: 15, rotate: 3 }, visible: { opacity: 1, y: 0, rotate: 0, transition: { duration: reduced ? 0 : 0.48, delay: reduced ? 0 : delay + Math.min(index * 0.022, 0.65), ease: [0.22, 1, 0.36, 1] } } }}
          >{letter}</motion.span>;
        })}
      </span>
    ))}
  </Tag>;
}

// Pisani font se animira u celini: tako se ne prekidaju njegovi spojevi slova.
export function SatinScript({ children, className = "", ...rest }) {
  const reduced = useReducedMotion();
  return <motion.span className={`bsa-script ${className}`}
    initial={reduced ? false : { opacity: 0, y: 18, rotate: -3 }}
    whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: reduced ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }} {...rest}
  >{children}</motion.span>;
}

export function SatinIcon({ name = "bow-small", className = "", ...rest }) {
  return <img className={`bsa-icon ${className}`} src={`/icons/bsa-${name}.svg`} alt="" aria-hidden="true" width="48" height="48" {...rest} />;
}

export function SatinArrow({ className = "" }) {
  return <SatinIcon name="arrow" className={`bsa-arrow ${className}`} />;
}

export function SatinBow({ className = "", animated = true }) {
  const reduced = useReducedMotion();
  return <motion.div className={`bsa-bow ${className}`} aria-hidden="true"
    initial={reduced || !animated ? false : { opacity: 0, rotate: -12, scale: 0.9 }}
    animate={{ opacity: 1, rotate: 0, scale: 1 }}
    transition={{ duration: reduced ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}>
    <img src="/icons/bsa-bow.svg" alt="" width="500" height="670" decoding="async" />
  </motion.div>;
}

export default function BirthdaySatinIntro(props) {
  const { name, age, dayMonth, year, nameScale, satin, cyrillic, t } = satinData(props);
  const reduced = useReducedMotion();
  const uid = useId();
  const [opening, setOpening] = useState(false);
  const callback = useRef(null);
  callback.current = props.onEnter || props.onOpen;

  useEffect(() => {
    if (!opening) return undefined;
    const timer = window.setTimeout(() => callback.current?.(), reduced ? 0 : 620);
    return () => window.clearTimeout(timer);
  }, [opening, reduced]);

  const enter = () => {
    if (opening) return;
    props.onStartMusic?.();
    setOpening(true);
  };

  return <motion.main className="bsa bsa-intro" data-script={cyrillic ? "cyrillic" : "latin"}
    style={{ "--bsa-name-scale": nameScale }} aria-labelledby={`${uid}-name`}
    initial={false} animate={opening ? { opacity: 0, y: -24 } : { opacity: 1, y: 0 }}
    transition={{ duration: reduced ? 0 : 0.6, ease: [0.76, 0, 0.24, 1] }}>
    <div className="bsa-cover">
      <motion.div className={`bsa-cover-age ${age.length > 2 ? "bsa-cover-age-long" : ""}`} aria-hidden="true"
        initial={reduced ? false : { opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduced ? 0 : 1.2 }}>
        {age}
      </motion.div>
      <SatinBow className="bsa-cover-bow" />
      <p className="bsa-cover-kicker">{satin.introKicker || t("JEDNO POSEBNO VEČE", "ЈЕДНО ПОСЕБНО ВЕЧЕ")}</p>
      <h1 className="bsa-cover-name" id={`${uid}-name`}><SatinScript>{name}</SatinScript></h1>
      <div className="bsa-cover-copy">
        <SatinReveal delay={0.12}>
          <p className="bsa-cover-invitation">{satin.introLine || t(`Pozivnica za moj ${age}. rođendan`, `Позивница за мој ${age}. рођендан`)}</p>
          <p className="bsa-cover-date">{dayMonth}{year ? ` ${year}.` : ""}</p>
        </SatinReveal>
      </div>
      <SatinReveal className="bsa-enter-wrap" delay={0.24}>
        <motion.button type="button" className="bsa-button bsa-enter" onClick={enter} disabled={opening}
          whileTap={reduced ? undefined : { scale: 0.97 }} aria-label={t("Pogledaj pozivnicu", "Погледај позивницу")}>
          <span>{t("Pogledaj pozivnicu", "Погледај позивницу")}</span><SatinArrow />
        </motion.button>
      </SatinReveal>
      <p className="bsa-cover-footnote">{t("Lepi trenuci su lepši zajedno.", "Лепи тренуци су лепши заједно.")}</p>
    </div>
  </motion.main>;
}
