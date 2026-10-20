import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { newlywedTimesCopy, newlywedTimesDate } from "./NewlywedTimesCountdown";
import "../styles/newintro.css";

// Stabilan tip komponente čuva istu fotografiju tokom otvaranja.
function NewspaperFront({
  config,
  copy,
  date,
  edition,
  photo,
  brideName,
  groomName,
}) {
  return (
    <div className="nwt-intro-print">
      <div className="nwt-intro-edition">
        <span className="nwt-intro-edition-label">
          <b>01</b>
          <span>
            {config.introHeadline || config.introKicker || copy.special}
          </span>
        </span>
        <span>{date?.y || ""}</span>
      </div>
      <p className="nwt-intro-masthead">
        {config.masthead || "NEWLYWED TIMES"}
      </p>
      <p className="nwt-intro-deck">{config.editionLine || copy.edition}</p>
      <div className="nwt-intro-photo">
        <img
          src={photo}
          width="1024"
          height="1536"
          alt=""
          draggable="false"
          style={{
            objectPosition:
              config.introPosition || config.coverPosition || "50% 50%",
            transform: `scale(${Math.min(1.5, Math.max(1, Number(config.introZoom) || 1.04))})`,
          }}
        />
        <div
          className="nwt-intro-names"
          style={{
            "--nwt-intro-name-scale": Math.min(
              1,
              13 /
                Math.max(
                  13,
                  String(brideName).length,
                  String(groomName).length,
                ),
            ),
          }}
        >
          <span>{brideName}</span>
          <i>&amp;</i>
          <span>{groomName}</span>
        </div>
      </div>
      <div className="nwt-intro-foot">
        <span>{edition}</span>
        <span>{copy.issue}</span>
      </div>
    </div>
  );
}
export default function NewlywedTimesIntro({
  brideName = "Ana",
  groomName = "Nikola",
  weddingDate,
  details = {},
  script = "latin",
  language = "sr",
  onReveal,
  onEnter,
  onStartMusic,
}) {
  const config = details.newlywedTimes || {},
    copy = newlywedTimesCopy(language, script),
    date = newlywedTimesDate(details.dateISO, language, script);
  const reduced = useReducedMotion(),
    [opening, setOpening] = useState(false),
    clicked = useRef(false),
    entered = useRef(false),
    revealed = useRef(false),
    timers = useRef([]),
    callbacks = useRef({ onReveal, onEnter, onStartMusic });
  callbacks.current = { onReveal, onEnter, onStartMusic };
  useEffect(() => {
    const body = document.body,
      html = document.documentElement,
      oldBody = body.style.overflow,
      oldHtml = html.style.overflow;
    body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    return () => {
      body.style.overflow = oldBody;
      html.style.overflow = oldHtml;
      timers.current.forEach(clearTimeout);
    };
  }, []);
  useEffect(() => {
    [
      config.coverImage || "/images/newlywed-times-cover.webp",
      config.storyImage || "/images/newlywed-times-story.webp",
      config.portraitImage || "/images/newlywed-times-portrait.webp",
    ].forEach((src) => {
      const image = new Image();
      image.src = src;
      image.decode?.().catch(() => {});
    });
  }, [config.coverImage, config.storyImage, config.portraitImage]);
  function reveal() {
    if (revealed.current) return;
    revealed.current = true;
    callbacks.current.onReveal?.();
  }
  function finish() {
    if (entered.current) return;
    entered.current = true;
    reveal();
    callbacks.current.onEnter?.();
  }
  function open() {
    if (clicked.current) return;
    clicked.current = true;
    callbacks.current.onStartMusic?.();
    setOpening(true);
    reveal();
    timers.current.push(setTimeout(finish, reduced ? 180 : 950));
  }
  const front = {
    config,
    copy,
    date,
    edition: details.date || date?.label || weddingDate || "",
    photo: config.coverImage || "/images/newlywed-times-cover.webp",
    brideName,
    groomName,
  };
  return (
    <section
      className={`nwt nwt-intro ${opening ? "nwt-is-opening" : ""} ${script === "cyrillic" ? "nwt-cyrillic" : ""}`}
      aria-labelledby="nwt-intro-title"
    >
      <motion.div
        className="nwt-intro-backdrop"
        aria-hidden="true"
        initial={false}
        animate={{ opacity: opening ? 0 : 1 }}
        transition={{ duration: reduced ? 0.1 : 0.3 }}
      />
      <h1 id="nwt-intro-title" className="nwt-sr-only">
        {brideName} &amp; {groomName} — {copy.special}
      </h1>
      <motion.div
        className="nwt-intro-studio"
        aria-hidden="true"
        initial={false}
        animate={opening ? "opening" : "rest"}
        variants={{
          rest: { opacity: 1, y: 0, scale: 1 },
          opening: {
            opacity: 0,
            y: -34,
            scale: 1.035,
            transition: {
              opacity: {
                delay: reduced ? 0 : 0.52,
                duration: reduced ? 0.12 : 0.22,
              },
              y: { duration: reduced ? 0 : 0.74 },
              scale: { duration: reduced ? 0 : 0.74 },
            },
          },
        }}
        onAnimationComplete={(state) => {
          if (state === "opening") finish();
        }}
      >
        <div className="nwt-intro-stage">
          <motion.div
            className="nwt-paper-stack nwt-stack-back"
            animate={
              opening
                ? { opacity: 0, y: 25, rotate: 4 }
                : { opacity: 1, y: 0, rotate: 0 }
            }
            transition={{ duration: reduced ? 0 : 0.42 }}
          />
          <motion.div
            className="nwt-paper-stack nwt-stack-middle"
            animate={
              opening
                ? { opacity: 0, y: 40, rotate: -4 }
                : { opacity: 1, y: 0, rotate: 0 }
            }
            transition={{ duration: reduced ? 0 : 0.48 }}
          />
          <motion.div
            className="nwt-intro-paper"
            initial={reduced ? false : { rotate: -1.1, y: 14 }}
            animate={opening ? { rotate: 0, y: -15 } : { rotate: -1.1, y: 0 }}
            transition={{
              duration: reduced ? 0 : 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <motion.div
              className="nwt-intro-bottom"
              animate={opening ? { y: 65, opacity: 0 } : { y: 0, opacity: 1 }}
              transition={{
                duration: reduced ? 0 : 0.56,
                delay: opening && !reduced ? 0.07 : 0,
              }}
            >
              <NewspaperFront {...front} />
            </motion.div>
            <motion.div
              className="nwt-intro-top"
              style={{
                transformOrigin: "50% 50%",
                backfaceVisibility: "hidden",
              }}
              animate={{ rotateX: opening && !reduced ? -164 : 0 }}
              transition={{
                duration: reduced ? 0 : 0.72,
                ease: [0.45, 0, 0.22, 1],
              }}
            >
              <NewspaperFront {...front} />
            </motion.div>
            <motion.span
              className="nwt-intro-fold"
              animate={{ opacity: opening ? 0 : 1 }}
              transition={{ duration: 0.18 }}
            />
          </motion.div>
        </div>
      </motion.div>
      <motion.button
        className="nwt-button nwt-intro-button"
        type="button"
        onClick={open}
        disabled={opening}
        initial={false}
        animate={{ opacity: opening ? 0 : 1, y: opening ? 8 : 0 }}
        transition={{ duration: reduced ? 0.05 : 0.16 }}
      >
        {config.introOpenText || copy.open}
        <img
          src="/icons/newlywed-times-arrow.svg"
          width="28"
          height="14"
          alt=""
        />
      </motion.button>
    </section>
  );
}
