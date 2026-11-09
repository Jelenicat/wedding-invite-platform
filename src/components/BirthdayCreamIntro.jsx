import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import BirthdayCreamInvitationCard from "./BirthdayCreamInvitationCard";
import "../styles/birthdayintro.css";

const DEFAULT_IMAGE = "/images/birthday-cream/cream-stone-premium.webp";

const MONTHS = ["januar", "februar", "mart", "april", "maj", "jun", "jul", "avgust", "septembar", "oktobar", "novembar", "decembar"];

// Ime default komponente ostaje isto, pa WeddingPage ne mora da se menja.
// Kartica i pozadina ostaju montirane tokom celog otvaranja.
export default function BirthdayCreamIntro(props) {
  return <BirthdayCreamExperience key={props.slug || props.brideName} {...props} />;
}

function BirthdayCreamExperience({
  brideName,
  weddingDate,
  weddingTime,
  venue,
  backgroundImage,
  introBackgroundImage,
  details = {},
  slug,
  onStartMusic,
}) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState("closed");
  const photo = introBackgroundImage || details.introBackgroundImage ||
    backgroundImage || details.backgroundImage || DEFAULT_IMAGE;
  const ready = phase === "open";

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <div className={`mcr-theme mcr-experience${ready ? " mcr-is-open" : ""}`}>
      <div className="mcr-shared-backdrop" aria-hidden="true">
        <motion.img
          src={photo}
          alt=""
          fetchPriority="high"
          initial={reduceMotion ? false : { scale: 1.045 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="mcr-card-stage" aria-hidden={!ready} inert={!ready}>
        <BirthdayCreamInvitationCard
          brideName={brideName}
          weddingDate={weddingDate}
          weddingTime={weddingTime}
          venue={venue}
          backgroundImage={photo}
          details={details}
          slug={slug}
          type="birthday"
          sharedBackground
          introOpening={phase === "opening"}
          introReady={ready}
        />
      </div>
      {!ready && (
        <div className="mcr-intro-cover">
          <BirthdayCreamIntroScreen
            brideName={brideName}
            weddingDate={weddingDate}
            backgroundImage={photo}
            details={details}
            sharedBackground
            onStartMusic={onStartMusic}
            onReveal={() => setPhase("opening")}
            onEnter={() => setPhase("open")}
          />
        </div>
      )}
    </div>
  );
}

export function BirthdayCreamIntroScreen({
  brideName,
  weddingDate,
  backgroundImage,
  introBackgroundImage,
  details = {},
  sharedBackground = false,
  onStartMusic,
  onReveal,
  onEnter,
}) {
  const reduceMotion = useReducedMotion();
  const [opening, setOpening] = useState(false);
  const openingRef = useRef(false);
  const timerRef = useRef(null);
  const name = brideName || "Matej";
  const age = details.age ?? 18;
  // WeddingPage već prosleđuje details, pa poseban novi prop nije potreban.
  const photo = introBackgroundImage || details.introBackgroundImage ||
    backgroundImage || details.backgroundImage || DEFAULT_IMAGE;
  const date = details.introDate || weddingDate || details.date || "";
  const dateMatch = String(date).trim().match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})\.?$/);
  const dateMonth = dateMatch ? MONTHS[Number(dateMatch[2]) - 1] : "";

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const enter = () => {
    if (openingRef.current) return;
    openingRef.current = true;
    onStartMusic?.();
    onReveal?.();
    setOpening(true);
    timerRef.current = setTimeout(() => onEnter?.(), reduceMotion ? 0 : 1150);
  };

  const group = {
    hidden: {},
    visible: { transition: { delayChildren: reduceMotion ? 0 : 0.18, staggerChildren: reduceMotion ? 0 : 0.14 } },
  };
  const reveal = {
    hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.95, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section
      className={`mcr-theme mcr-intro${sharedBackground ? " mcr-intro--shared" : ""}`}
      aria-label={`${name} — ${age}. rođendan`}
    >
      {!sharedBackground && <motion.img
        className="mcr-intro-photo"
        src={photo}
        alt=""
        fetchPriority="high"
        initial={reduceMotion ? false : { scale: 1.07 }}
        animate={{ scale: 1 }}
        transition={{ duration: 3.2, ease: [0.22, 1, 0.36, 1] }}
      />}
      <div className="mcr-intro-wash" aria-hidden="true" />
      <div className="mcr-intro-light" aria-hidden="true" />

      <motion.div
        className="mcr-intro-panel"
        initial={reduceMotion ? false : { opacity: 0, y: 28, filter: "blur(8px)" }}
        animate={{ opacity: opening ? 0 : 1, y: opening ? -18 : 0, scale: opening ? 0.97 : 1, filter: opening ? "blur(5px)" : "blur(0px)" }}
        transition={{ duration: opening ? 1.08 : 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div variants={group} initial="hidden" animate="visible">
          <motion.h1 className="mcr-intro-name" variants={reveal} aria-label={name}>
            {Array.from(name.toLocaleUpperCase("sr-RS")).map((letter, i) => (
              <motion.span
                key={`${i}-${letter}`}
                aria-hidden="true"
                initial={reduceMotion ? false : { opacity: 0, y: 20, rotateX: 38 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: reduceMotion ? 0 : 0.35 + i * 0.085, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              >{letter === " " ? "\u00a0" : letter}</motion.span>
            ))}
          </motion.h1>
          <motion.p className="mcr-intro-proslavlja" variants={reveal}>proslavlja</motion.p>
          <motion.div
            className="mcr-intro-age"
            variants={reveal}
            animate={opening ? { scale: 0.72, y: -15, z: -140, rotateX: 8, opacity: 0 } : undefined}
            transition={{ duration: reduceMotion ? 0 : 1.05, ease: [0.22, 1, 0.36, 1] }}
            aria-label={`${age}.`}
          >
            <span className="mcr-age-sculpture" aria-hidden="true">
              <span className="mcr-age-depth">{age}<small>.</small></span>
              <span className="mcr-age-glyph">{age}<small>.</small></span>
            </span>
          </motion.div>
          <motion.p className="mcr-intro-birthday" variants={reveal}>rođendan</motion.p>
          <motion.div className="mcr-intro-date" variants={reveal} aria-label={date}>
            {dateMatch && dateMonth ? (
              <>
                <strong>{dateMatch[1]}</strong>
                <span className="mcr-intro-date-meta"><b>{dateMonth}</b><small>{dateMatch[3]}.</small></span>
              </>
            ) : <span>{date}</span>}
          </motion.div>
          <motion.button
            className="mcr-button mcr-intro-button"
            type="button"
            onClick={enter}
            disabled={opening}
            variants={reveal}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          >
            Pogledaj pozivnicu
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
