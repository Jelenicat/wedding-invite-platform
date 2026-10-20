import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { addToCalendar } from "../utils/calendar";

const EASE = [0.22, 1, 0.36, 1];

export function IvoryLaceBackdrop({ src, position = "50% 50%" }) {
  if (!src) return null;
  return (
    <div className="ivl-section-background" aria-hidden="true">
      <img src={src} alt="" loading="lazy" decoding="async" draggable="false"
        style={{ objectPosition: position }} />
    </div>
  );
}

// Zajednički mali elementi ostaju u jednom od četiri tražena JSX fajla.
export function IvoryLaceReveal({ children, className = "", delay = 0, ...props }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.85, delay, ease: EASE }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function IvoryLaceText({
  children, as = "h2", className = "", scriptText = false, immediate = false, delay = 0,
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as];
  const text = String(children ?? "");
  const parts = Array.from(text);
  return (
    <Tag
      className={`ivl-text ${scriptText ? "ivl-script" : "ivl-letter-text"} ${className}`}
      aria-label={text}
      initial={reduced ? false : "hidden"}
      animate={immediate ? "visible" : undefined}
      whileInView={immediate ? undefined : "visible"}
      viewport={{ once: true, amount: 0.35 }}
      variants={{ visible: { transition: { staggerChildren: 0.024, delayChildren: delay } } }}
    >
      {scriptText ? (
        // Cela reč ostaje spojena: razdvajanje pisanih slova prekida ligature.
        <motion.span
          aria-hidden="true"
          className="ivl-script-ink"
          variants={{
            hidden: { opacity: 0, clipPath: "inset(0 112% 0 -12%)", y: 9 },
            visible: { opacity: 1, clipPath: "inset(0 -18% 0 -12%)", y: 0 },
          }}
          transition={{ duration: reduced ? 0 : 1.35, delay: reduced ? 0 : delay, ease: EASE }}
        >{text}</motion.span>
      ) : (
        <span aria-hidden="true">
          {parts.map((letter, index) => (
            <motion.span
              className="ivl-letter"
              key={`${letter}-${index}`}
              variants={{ hidden: { opacity: 0, y: 9 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: reduced ? 0 : 0.55, ease: EASE }}
            >{letter === " " ? "\u00a0" : letter}</motion.span>
          ))}
        </span>
      )}
    </Tag>
  );
}

export function IvoryLaceNames({ brideName, groomName, immediate = false, as = "h1" }) {
  const heading = useRef(null);
  const Tag = as;
  const bride = brideName || "Ana";
  const groom = groomName || "Nikola";
  const longest = Math.max(bride.length, groom.length);
  const scale = longest > 18 ? 0.46 : longest > 13 ? 0.56 : longest > 10 ? 0.73 : 1;
  useLayoutEffect(() => {
    const element = heading.current;
    if (!element) return undefined;
    let disposed = false;
    let lastWidth = 0;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    function fit() {
      if (disposed || !context) return;
      const sample = element.querySelector(".ivl-text");
      if (!sample) return;
      const style = getComputedStyle(sample);
      const current = Number.parseFloat(element.style.getPropertyValue("--ivl-name-scale")) || 1;
      const size = Number.parseFloat(style.fontSize) / current;
      context.font = `${style.fontStyle} 400 ${size}px ${style.fontFamily}`;
      const width = Math.max(...[bride, `& ${groom}`].map((name) => {
        const metrics = context.measureText(name);
        return Math.max(metrics.width, Math.abs(metrics.actualBoundingBoxLeft || 0) + Math.abs(metrics.actualBoundingBoxRight || 0));
      }));
      const available = Math.max(1, element.clientWidth - 20);
      const next = Math.min(1, available / Math.max(1, width));
      element.style.setProperty("--ivl-name-scale", String(next));
    }
    fit();
    document.fonts?.ready.then(fit);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width || 0;
      if (Math.abs(width - lastWidth) > 0.5) { lastWidth = width; fit(); }
    });
    observer?.observe(element);
    return () => { disposed = true; observer?.disconnect(); };
  }, [bride, groom]);
  return (
    <Tag ref={heading} className="ivl-names" style={{ "--ivl-name-scale": scale }} aria-label={`${bride} & ${groom}`}>
      <IvoryLaceText as="span" scriptText immediate={immediate}>{bride}</IvoryLaceText>
      <IvoryLaceText as="span" className="ivl-name-second" scriptText immediate={immediate} delay={0.23}>
        {`& ${groom}`}
      </IvoryLaceText>
    </Tag>
  );
}

export function IvoryLaceMonogram({ brideName = "Ana", groomName = "Nikola" }) {
  return (
    <div className="ivl-monogram" aria-hidden="true">
      <img src="/icons/ivory-lace-medallion.svg" alt="" width="180" height="204" />
      <span className="ivl-monogram-first">{Array.from(brideName.trim())[0] || "A"}</span>
      <span className="ivl-monogram-last">{Array.from(groomName.trim())[0] || "N"}</span>
    </div>
  );
}

function getTime(targetDate) {
  const timestamp = new Date(targetDate).getTime();
  if (!Number.isFinite(timestamp)) return null;
  const difference = Math.max(0, timestamp - Date.now());
  return {
    difference,
    days: Math.floor(difference / 86400000),
    hours: Math.floor((difference / 3600000) % 24),
    minutes: Math.floor((difference / 60000) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export default function IvoryLaceCountdown({
  targetDate, brideName, groomName, details = {}, script = "latin", language = "sr",
}) {
  const reduced = useReducedMotion();
  const [time, setTime] = useState(() => getTime(targetDate));
  const cyr = script === "cyrillic";
  const t = language === "en" ? {
    remaining: "Until we say I do", arrived: "Our wedding day is here", days: "days", hours: "hours",
    minutes: "min", seconds: "sec", calendar: "Save the date",
  } : language === "de" ? {
    remaining: "Bis zu unserem Ja-Wort", arrived: "Unser Hochzeitstag ist da", days: "Tage", hours: "Std.",
    minutes: "Min.", seconds: "Sek.", calendar: "Datum speichern",
  } : cyr ? {
    remaining: "До венчања је остало", arrived: "Наш дан је стигао", days: "дана", hours: "сати",
    minutes: "мин", seconds: "сек", calendar: "Сачувај датум",
  } : {
    remaining: "Do venčanja je ostalo", arrived: "Naš dan je stigao", days: "dana", hours: "sati",
    minutes: "min", seconds: "sek", calendar: "Sačuvaj datum",
  };

  useEffect(() => {
    const tick = () => setTime(getTime(targetDate));
    tick();
    // Zaustavi ponavljanje kada datum prođe ili je neispravan.
    const initialTime = getTime(targetDate);
    if (!initialTime || initialTime.difference === 0) return undefined;
    const interval = window.setInterval(() => {
      const next = getTime(targetDate);
      setTime(next);
      if (!next || next.difference === 0) window.clearInterval(interval);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [targetDate]);

  if (!time) return null;

  function saveDate() {
    addToCalendar({
      brideName, groomName, dateISO: targetDate,
      venue: details.venue || details.locationName,
      mapLink: details.mapLink || details.locationButtonLink,
      note: details.note,
      durationHours: details.calendarDurationHours,
      language,
    });
  }

  return (
    <IvoryLaceReveal className="ivl-countdown">
      <p className="ivl-kicker">{time.difference === 0 ? t.arrived : t.remaining}</p>
      <div className="ivl-countdown-grid" role="timer" aria-live="off">
        {["days", "hours", "minutes", "seconds"].map((key) => (
          <div className="ivl-countdown-unit" key={key}>
            <div className="ivl-countdown-number">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  key={time[key]}
                  initial={reduced ? false : { y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reduced ? undefined : { y: -10, opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.28 }}
                >{String(time[key]).padStart(2, "0")}</motion.span>
              </AnimatePresence>
            </div>
            <span className="ivl-countdown-label">{t[key]}</span>
          </div>
        ))}
      </div>
      {details.showCalendarButton === true && (
        <button className="ivl-button ivl-calendar-button" type="button" onClick={saveDate}>
          <img src="/icons/ivory-lace-calendar.svg" alt="" width="15" height="15" />
          {t.calendar}
        </button>
      )}
    </IvoryLaceReveal>
  );
}
