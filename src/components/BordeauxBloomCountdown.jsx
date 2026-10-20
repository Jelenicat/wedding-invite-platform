import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { addToCalendar } from "../utils/calendar";

const EASE = [0.22, 1, 0.36, 1];

// Reljefni cvetovi imaju odvojene slojeve: lagani pomak pri skrolu i mirno lebdenje.
// Lebdenje radi samo dok je element blizu ekrana. Bez senzora i dozvola telefona.
export function BordeauxBloomFloralLayer({ src, className = "", depth = 16, width = 1024, height = 1536, eager = false, ambient = true }) {
  const anchor = useRef(null);
  const reduced = useReducedMotion();
  const visible = useInView(anchor, { margin: "120px" });
  const { scrollYProgress } = useScroll({ target: anchor, offset: ["start end", "end start"] });
  const distance = useTransform(scrollYProgress, [0, 1], [-depth, depth]);
  const y = useSpring(distance, { stiffness: 65, damping: 26, mass: .7 });
  return <motion.div ref={anchor} className={`bb-floral-layer ${className}`} aria-hidden="true" style={{ y: reduced ? 0 : y }}>
    <motion.div animate={!reduced && visible && ambient ? { y: [0, -4, 0], rotate: [0, .8, 0] } : { y: 0, rotate: 0 }} transition={!reduced && visible && ambient ? { duration: 9, repeat: Infinity, ease: "easeInOut" } : { duration: reduced ? 0 : .35 }}>
      <motion.img src={src} alt="" width={width} height={height} loading={eager ? "eager" : "lazy"} decoding="async" draggable="false"
        initial={reduced ? false : { opacity: 0, scale: .92, rotate: -2 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true, margin: "60px" }} transition={{ duration: reduced ? 0 : 1.6, ease: EASE }} />
    </motion.div>
  </motion.div>;
}

export function BordeauxBloomDust({ light = false }) {
  const anchor = useRef(null);
  const visible = useInView(anchor);
  const reduced = useReducedMotion();
  return <span ref={anchor} className={`bb-dust ${light ? "bb-dust-light" : ""} ${visible && !reduced ? "bb-dust-awake" : ""}`} aria-hidden="true">
    {[12, 32, 73, 87, 24, 66].map((left, index) => <i key={left} style={{ left: `${left}%`, top: `${[19, 48, 26, 64, 84, 92][index]}%`, "--bb-delay": `${index * -2.7}s`, "--bb-drift": `${index % 2 ? 11 : -9}px` }} />)}
  </span>;
}

export function BordeauxBloomCalendar({ dateISO, script = "latin", language = "sr" }) {
  const reduced = useReducedMotion();
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateISO || "");
  if (!match) return null;
  const [, y, m, d] = match.map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return null;
  const cyr = script === "cyrillic";
  const months = language === "en" ? ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    : language === "de" ? ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]
    : cyr ? ["Јануар", "Фебруар", "Март", "Април", "Мај", "Јун", "Јул", "Август", "Септембар", "Октобар", "Новембар", "Децембар"]
    : ["Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"];
  const weekdays = language === "en" ? ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
    : language === "de" ? ["MO", "DI", "MI", "DO", "FR", "SA", "SO"]
    : cyr ? ["ПОН", "УТО", "СРЕ", "ЧЕТ", "ПЕТ", "СУБ", "НЕД"] : ["PON", "UTO", "SRE", "ČET", "PET", "SUB", "NED"];
  const start = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells = Array.from({ length: Math.ceil((start + days) / 7) * 7 }, (_, i) => i >= start && i < start + days ? i - start + 1 : null);
  return <BordeauxBloomReveal className="bb-calendar-wrap">
    <table className="bb-month-calendar">
      <caption style={{ "--bb-month-size": months[m - 1].length > 8 ? "46px" : months[m - 1].length > 7 ? "49px" : "55px" }}>
        <BordeauxBloomText as="span" className="bb-calendar-month" scriptText>{months[m - 1]}</BordeauxBloomText>
        <span className="bb-calendar-year">{y}</span>
      </caption>
      <thead><tr>{weekdays.map(day => <th key={day} scope="col">{day}</th>)}</tr></thead>
      <tbody>{Array.from({ length: cells.length / 7 }, (_, row) => <tr key={row}>
        {cells.slice(row * 7, row * 7 + 7).map((day, index) => <td key={index} className={day === d ? "bb-wedding-day" : ""}>
          {day && <time dateTime={`${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`}>{day}</time>}
          {day === d && <svg viewBox="0 0 68 68" aria-hidden="true">
            <motion.path d="M34 58C27 52 8 40 8 25C8 10 26 8 34 23C42 7 61 12 60 26C59 40 42 53 34 58Z"
              fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
              initial={reduced ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }}
              viewport={{ once: true }} transition={{ duration: reduced ? 0 : 1.6, delay: reduced ? 0 : .3 }} />
          </svg>}
        </td>)}
      </tr>)}</tbody>
    </table>
  </BordeauxBloomReveal>;
}

export function BordeauxBloomBackdrop({ src, position = "50% 50%" }) {
  if (!src) return null;
  return (
    <div className="bb-section-background" aria-hidden="true">
      <img src={src} alt="" loading="lazy" decoding="async" draggable="false"
        style={{ objectPosition: position }} />
    </div>
  );
}

// Zajednički mali elementi ostaju u jednom od četiri tražena JSX fajla.
export function BordeauxBloomReveal({ children, className = "", delay = 0, ...props }) {
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

export function BordeauxBloomText({
  children, as = "h2", className = "", scriptText = false, immediate = false, delay = 0,
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as];
  const text = String(children ?? "");
  const parts = Array.from(text);
  return (
    <Tag
      className={`bb-text ${scriptText ? "bb-script" : "bb-letter-text"} ${className}`}
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
          className="bb-script-ink"
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
              className="bb-letter"
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

export function BordeauxBloomNames({ brideName, groomName, immediate = false, as = "h1" }) {
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
    let frame = null;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    function fit() {
      if (disposed || !context) return;
      const sample = element.querySelector(".bb-text");
      if (!sample) return;
      const style = getComputedStyle(sample);
      const current = Number.parseFloat(element.style.getPropertyValue("--bb-name-scale")) || 1;
      const size = Number.parseFloat(style.fontSize) / current;
      context.font = `${style.fontStyle} 400 ${size}px ${style.fontFamily}`;
      const width = Math.max(...[bride, `& ${groom}`].map((name) => {
        const metrics = context.measureText(name);
        return Math.max(metrics.width, Math.abs(metrics.actualBoundingBoxLeft || 0) + Math.abs(metrics.actualBoundingBoxRight || 0));
      }));
      const available = Math.max(1, element.clientWidth - 20);
      const next = Math.min(1, available / Math.max(1, width));
      element.style.setProperty("--bb-name-scale", String(next));
    }
    function scheduleFit() {
      if (disposed) return;
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(fit);
    }
    fit();
    document.fonts?.ready.then(scheduleFit);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width || 0;
      if (Math.abs(width - lastWidth) > 0.5) { lastWidth = width; scheduleFit(); }
    });
    observer?.observe(element);
    return () => { disposed = true; window.cancelAnimationFrame(frame); observer?.disconnect(); };
  }, [bride, groom]);
  return (
    <Tag ref={heading} className="bb-names" style={{ "--bb-name-scale": scale }} aria-label={`${bride} & ${groom}`}>
      <BordeauxBloomText as="span" scriptText immediate={immediate}>{bride}</BordeauxBloomText>
      <BordeauxBloomText as="span" className="bb-name-second" scriptText immediate={immediate} delay={0.23}>
        {`& ${groom}`}
      </BordeauxBloomText>
    </Tag>
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

export default function BordeauxBloomCountdown({
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
    <BordeauxBloomReveal className="bb-countdown">
      <p className="bb-kicker">{time.difference === 0 ? t.arrived : t.remaining}</p>
      <div className="bb-countdown-grid" role="timer" aria-live="off">
        {["days", "hours", "minutes", "seconds"].map((key) => (
          <div className="bb-countdown-unit" key={key}>
            <div className="bb-countdown-number">
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
            <span className="bb-countdown-label">{t[key]}</span>
          </div>
        ))}
      </div>
      {details.showCalendarButton === true && (
        <button className="bb-button bb-calendar-button" type="button" onClick={saveDate}>
          <img src="/icons/bordeaux-bloom-calendar.svg" alt="" width="15" height="15" />
          {t.calendar}
        </button>
      )}
    </BordeauxBloomReveal>
  );
}
