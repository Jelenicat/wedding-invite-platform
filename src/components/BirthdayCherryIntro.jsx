import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { addToCalendar } from "../utils/calendar";
import "../styles/newintro.css";

export const CHERRY_EASE = [0.22, 1, 0.36, 1];

// Bez izmišljanja godine: prihvata ISO ili kompletan datum, npr. 7. novembar 2026.
export function cherryEventDate(value, time = "") {
  if (!value || typeof value !== "string") return "";
  const text = value.trim();
  if (/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:?\d{2})$/i.test(text)) {
    return Number.isFinite(new Date(text).getTime()) ? text : "";
  }
  const months = [
    /^(jan|јан)/i, /^(feb|феб)/i, /^(mar|мар)/i, /^(apr|апр)/i,
    /^(maj|may|мај)/i, /^(jun|јун)/i, /^(jul|јул)/i, /^(avg|aug|авг)/i,
    /^(sep|сеп)/i, /^(okt|oct|окт)/i, /^(nov|нов)/i, /^(dec|дец)/i,
  ];
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::\d{2})?)?$/);
  const local = text.match(/^(\d{1,2})[.\s/-]+([\p{L}]+|\d{1,2})[.\s/-]+(\d{4})\.?$/u);
  if (!iso && !local) return "";
  const year = Number(iso ? iso[1] : local[3]);
  const month = iso ? Number(iso[2]) : /^\d+$/.test(local[2]) ? Number(local[2]) : months.findIndex((pattern) => pattern.test(local[2])) + 1;
  const day = Number(iso ? iso[3] : local[1]);
  const clock = String(time || (iso?.[4] ? `${iso[4]}:${iso[5]}` : "00:00")).match(/^(\d{1,2})[:.](\d{2})/);
  if (!clock) return "";
  const hour = Number(clock[1]), minute = Number(clock[2]);
  const test = new Date(Date.UTC(year, month - 1, day));
  if (test.getUTCFullYear() !== year || test.getUTCMonth() !== month - 1 || test.getUTCDate() !== day || hour > 23 || minute > 59) return "";
  // Offset se proverava za čas događaja i na dan prelaska letnje/zimsko vreme.
  const wallTime = Date.UTC(year, month - 1, day, hour, minute);
  let offsetHours = 1;
  for (let pass = 0; pass < 2; pass++) {
    const zone = new Intl.DateTimeFormat("en", { timeZone: "Europe/Belgrade", timeZoneName: "shortOffset" }).formatToParts(new Date(wallTime - offsetHours * 3600000)).find((part) => part.type === "timeZoneName")?.value || "GMT+1";
    offsetHours = zone.includes("+2") ? 2 : 1;
  }
  const offset = offsetHours === 2 ? "+02:00" : "+01:00";
  const pad = (number) => String(number).padStart(2, "0");
  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00${offset}`;
}

export function cherryData({ brideName, birthdayName, weddingDate, weddingTime, venue, script, details = {} } = {}) {
  const cherry = details.cherry || {};
  const intro = details.birthdayIntro || {};
  const cyrillic = (script || details.script) === "cyrillic";
  const name = String(cherry.name || intro.name || birthdayName || brideName || (cyrillic ? "Мила" : "Mila"));
  const eventTime = weddingTime || details.time || details.events?.[0]?.time || "";
  const dateISO = cherryEventDate(details.dateISO, eventTime) || cherryEventDate(details.date || weddingDate, eventTime);
  const eventDate = dateISO ? new Date(dateISO) : null;
  const locale = cyrillic ? "sr-Cyrl-RS" : "sr-Latn-RS";
  return {
    cherry, intro, name, cyrillic, dateISO,
    age: details.age ?? intro.age ?? 18,
    date: details.date || weddingDate || (eventDate ? new Intl.DateTimeFormat(locale, { timeZone: "Europe/Belgrade", day: "numeric", month: "long", year: "numeric" }).format(eventDate) : ""),
    time: eventTime || (eventDate ? new Intl.DateTimeFormat("sr", { timeZone: "Europe/Belgrade", hour: "2-digit", minute: "2-digit" }).format(eventDate) : ""),
    weekday: eventDate ? new Intl.DateTimeFormat(locale, { timeZone: "Europe/Belgrade", weekday: "long" }).format(eventDate) : "",
    venue: details.locationName || details.venue || venue || "",
    address: details.locationAddress || "",
    cake: cherry.cakeImage || "/images/birthday-cherry/cherry-cake.webp",
    evening: cherry.eveningImage || "/images/birthday-cherry/cherry-evening.webp",
    nameScale: Math.min(1, 6.7 / Math.max(6.7, Array.from(name).length)),
  };
}

// Mesec i izabrani datum prate vreme proslave u Srbiji, i za goste u drugim zonama.
export function cherryCalendar(dateISO, cyrillic = false) {
  if (!dateISO || !Number.isFinite(new Date(dateISO).getTime())) return null;
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Belgrade", year: "numeric", month: "numeric", day: "numeric" }).formatToParts(new Date(dateISO));
  const value = (type) => Number(parts.find((part) => part.type === type)?.value);
  const year = value("year"), month = value("month"), day = value("day");
  const start = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const months = cyrillic ? ["Јануар", "Фебруар", "Март", "Април", "Мај", "Јун", "Јул", "Август", "Септембар", "Октобар", "Новембар", "Децембар"] : ["Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"];
  const cells = Array.from({ length: Math.ceil((start + days) / 7) * 7 }, (_, index) => index >= start && index < start + days ? index - start + 1 : null);
  return { year, month, day, start, days, cells, monthName: months[month - 1] };
}

export function CherryArrow({ down = false }) {
  return <svg className="bch-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={down ? "M12 4v16m-6-6 6 6 6-6" : "M4 12h16m-6-6 6 6-6 6"} /></svg>;
}

export function CherryDoodle({ type = "bow", className = "" }) {
  const paths = {
    heart: "M50 83 16 50C-5 29 22 4 42 24l8 8 8-8c20-20 47 5 26 26Z",
    bow: "M48 43C30 14 8 21 13 39c4 15 22 15 35 4Zm4 0c18-29 40-22 35-4-4 15-22 15-35 4ZM44 42c1-7 11-7 12 0l-1 9H45Zm2 9L29 84l16-9 5 8 2-32m2 1 15 29-15-9-7 8",
    star: "M50 18v64M20 33l60 34M20 67l60-34",
    music: "M42 69V22l35-8v45M42 32l35-8M42 69c0 13-25 18-25 5s25-18 25-5Zm35-10c0 13-25 18-25 5s25-18 25-5Z",
    glasses: "M12 17h31c3 17-2 28-15 28S9 34 12 17Zm15 28-3 35m-10 5 22 2M58 9h31c3 18-2 29-15 29S55 27 58 9Zm16 29 3 35m-11 7 23-3M11 28h33m14-8h32M42 43l10 4m-7-13 9 2M29 56c-13-12-20-2-14 4l14 11 12-12c6-7-4-12-12-3Z",
    cherries: "M45 55C44 34 58 17 69 11M68 11c-2 24 7 32 8 47M68 11c-22-9-28 1-27 6 11 5 20 2 27-6M46 55c-12-10-31-2-28 14 3 17 28 21 34 3 3-8 1-13-6-17Zm31 3c-10-10-27-3-25 11 2 16 25 20 32 5 4-7 1-13-7-16Z",
  };
  return <svg className={`bch-doodle bch-doodle-${type} ${className}`} viewBox="0 0 100 100" fill="none" aria-hidden="true"><path d={paths[type] || paths.bow} /></svg>;
}

export function CherryFrame({ className = "" }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.05 });
  const reduced = useReducedMotion();
  const [drawn, setDrawn] = useState(false);
  const corners = [[12, 12], [348, 12], [348, 588], [12, 588], [12, 12]];
  let path = "M12 12";
  for (let side = 0; side < 4; side++) {
    const [x, y] = corners[side], [endX, endY] = corners[side + 1];
    const count = Math.round(Math.hypot(endX - x, endY - y) / 9);
    const dx = (endX - x) / count, dy = (endY - y) / count;
    for (let step = 0; step < count; step++) {
      const direction = step % 2 ? -1 : 1;
      const length = Math.hypot(dx, dy);
      path += `Q${x + dx * (step + 0.5) - dy / length * direction * 3} ${y + dy * (step + 0.5) + dx / length * direction * 3} ${x + dx * (step + 1)} ${y + dy * (step + 1)}`;
    }
  }
  return <svg ref={ref} className={`bch-frame ${className}`} viewBox="0 0 360 600" preserveAspectRatio="none" fill="none" aria-hidden="true">{drawn || reduced ? <path d={`${path}Z`} /> : <motion.path d={`${path}Z`} initial={{ pathLength: 0 }} animate={seen ? { pathLength: 1 } : undefined} transition={{ duration: 1.7, ease: CHERRY_EASE }} onAnimationComplete={() => { if (seen) setDrawn(true); }} />}</svg>;
}

export function CherryReveal({ children, className = "", delay = 0, from = "bottom", ...rest }) {
  const reduced = useReducedMotion();
  return <motion.div
    className={`bch-reveal ${className}`}
    initial={reduced ? false : { opacity: 0, y: from === "bottom" ? 26 : 0, x: from === "left" ? -24 : from === "right" ? 24 : 0 }}
    whileInView={{ opacity: 1, y: 0, x: 0 }}
    viewport={{ once: true, amount: 0.17 }}
    transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : delay, ease: CHERRY_EASE }}
    {...rest}
  >{children}</motion.div>;
}

export function CherryScript({ children, className = "", delay = 0, underline = false }) {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, amount: 0.2 });
  const reduced = useReducedMotion();
  const extended = typeof children === "string" && /[čćđČĆĐ]/.test(children);
  return <span ref={ref} className={`bch-script ${extended ? "bch-script-extended" : ""} ${className}`}>
    <motion.span className="bch-ink"
      initial={reduced ? false : { clipPath: "inset(0 100% 0 0)" }}
      animate={visible ? { clipPath: "inset(0 0% 0 0)" } : undefined}
      transition={{ duration: reduced ? 0 : 1.6, delay: reduced ? 0 : delay, ease: [0.35, 0.05, 0.2, 1] }}
    >{children}</motion.span>
    {underline && <svg className="bch-handline" viewBox="0 0 280 30" fill="none" aria-hidden="true"><motion.path
      d="M5 23c68-20 176-22 244-11 18 3 27 8 20 10-7 2-18-1-23-4"
      initial={reduced ? false : { pathLength: 0 }} animate={visible ? { pathLength: 1 } : undefined}
      transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : delay + 0.9, ease: CHERRY_EASE }}
    /></svg>}
  </span>;
}

export function CherryLetters({ text, className = "", delay = 0 }) {
  const reduced = useReducedMotion();
  let count = 0;
  return <motion.span className={`bch-letters ${className}`} aria-label={text} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.25 }}>
    {String(text).split(/(\s+)/).map((word, i) => /^\s+$/.test(word)
      ? <span key={i} aria-hidden="true">{word}</span>
      : <span key={i} className="bch-word" aria-hidden="true">{Array.from(word).map((letter, j) => {
          const order = count++;
          return <span key={j} className="bch-letter-mask"><motion.span className="bch-glyph"
            variants={{ hidden: reduced ? { opacity: 1, y: 0, rotate: 0 } : { opacity: 0, y: "115%", rotate: 6 }, shown: { opacity: 1, y: 0, rotate: 0 } }}
            transition={{ duration: reduced ? 0 : 0.8, delay: reduced ? 0 : delay + order * 0.035, ease: CHERRY_EASE }}
          >{letter}</motion.span></span>;
        })}</span>)}
  </motion.span>;
}

export function CherryPhoto({ src, alt = "", className = "", position = "50% 50%", eager = false }) {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, amount: 0.12 });
  const reduced = useReducedMotion();
  const [failed, setFailed] = useState(false);
  useEffect(() => { setFailed(false); }, [src]);
  return <div ref={ref} className={`bch-photo ${failed ? "bch-photo-fallback" : ""} ${className}`}>
    {failed ? <div className="bch-photo-art" aria-hidden="true"><CherryDoodle type="glasses" /><CherryScript>chin chin!</CherryScript><CherryDoodle type="cherries" /></div> :
    <motion.div className="bch-photo-mask"
      initial={reduced ? false : { clipPath: "inset(0 0 100% 0 round 0px)" }}
      animate={visible ? { clipPath: "inset(0 0 0% 0 round 0px)" } : undefined}
      transition={{ duration: reduced ? 0 : 1.25, ease: CHERRY_EASE }}
    ><motion.img src={src} alt={alt} onError={() => setFailed(true)} loading={eager ? "eager" : "lazy"} decoding="async" draggable="false"
      initial={reduced ? false : { scale: 1.075 }} animate={visible ? { scale: 1 } : undefined}
      transition={{ duration: reduced ? 0 : 1.9, ease: CHERRY_EASE }} style={{ objectPosition: position }}
    /></motion.div>
    }
  </div>;
}

export function CherryCalendarButton({ data, details = {}, dateISO = data.dateISO, text, className = "" }) {
  const pending = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const c = data.cyrillic;
  if (!dateISO) return null;
  const save = async () => {
    if (pending.current) return;
    pending.current = true; setBusy(true); setError("");
    try {
      await addToCalendar({
        brideName: data.name, groomName: "", dateISO, venue: data.venue,
        mapLink: details.mapLink, note: details.calendarDescription || details.note || (c ? "Видимо се на прослави!" : "Vidimo se na proslavi!"),
        durationHours: details.calendarDurationHours, eventType: "birthday", age: data.age,
        eventTitle: details.calendarTitle || `${data.name} — ${data.age}. ${c ? "рођендан" : "rođendan"}`, language: "sr",
      });
    } catch (cause) { console.error("BirthdayCherry calendar:", cause); setError(c ? "Покушај поново да сачуваш датум." : "Pokušaj ponovo da sačuvaš datum."); }
    finally { pending.current = false; setBusy(false); }
  };
  return <div className={`bch-save-date ${className}`}>
    <button className="bch-button bch-button-outline" type="button" onClick={save} disabled={busy} aria-busy={busy}>
      <svg className="bch-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 3v4m8-4v4M4 10h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Zm3 10 3 3 5-5" /></svg>
      <span>{busy ? c ? "ЧУВАЊЕ…" : "ČUVANJE…" : text || (c ? "САЧУВАЈ ДАТУМ" : "SAČUVAJ DATUM")}</span>
    </button>
    {error && <p className="bch-calendar-error" role="alert">{error}</p>}
  </div>;
}


export default function BirthdayCherryIntro(props) {
  const { slug, onEnter, onStartMusic } = props;
  const data = cherryData(props), c = data.cyrillic;
  const reduced = useReducedMotion();
  const [opening, setOpening] = useState(false);
  const locked = useRef(false), entered = useRef(false);
  useEffect(() => { locked.current = false; entered.current = false; setOpening(false); }, [slug]);
  const open = () => { if (locked.current) return; locked.current = true; onStartMusic?.(); setOpening(true); };
  const finish = () => { if (!opening || entered.current) return; entered.current = true; onEnter?.(); };
  return <section className="bch bch-intro" data-script={c ? "cyrillic" : "latin"} lang={c ? "sr-Cyrl" : "sr-Latn"} style={{ "--bch-name-scale": data.nameScale }}>
    <motion.div className="bch-cover" initial={{ opacity: 0 }} animate={opening ? { opacity: 0, y: reduced ? 0 : -42, rotate: reduced ? 0 : -2.5, scale: reduced ? 1 : 0.97 } : { opacity: 1, y: 0, rotate: 0, scale: 1 }} transition={{ duration: reduced ? 0.15 : opening ? 0.8 : 0.6, ease: CHERRY_EASE }} onAnimationComplete={finish}>
      <CherryFrame />
      <div className="bch-cover-doodles" aria-hidden="true"><CherryDoodle type="heart" /><CherryDoodle type="star" /><CherryDoodle type="heart" /><CherryDoodle type="star" /></div>
      <header className="bch-cover-heading">
        <CherryReveal><p className="bch-kicker">{data.cherry.introLine || (c ? "ПОЗИВАМ ТЕ НА СВОЈ" : "POZIVAM TE NA SVOJ")}</p></CherryReveal>
        <h1 className="bch-cover-name"><CherryScript delay={0.2}>{data.name}</CherryScript></h1>
        <p className="bch-cover-age"><CherryLetters text={`${data.age}. ${c ? "рођендан" : "rođendan"}`} delay={0.4} /></p>
      </header>
      <motion.img className="bch-cover-cake" src={data.cake} alt="" fetchPriority="high" draggable="false" initial={reduced ? false : { opacity: 0, y: 22, rotate: -5 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 1.1, delay: reduced ? 0 : 0.35, ease: CHERRY_EASE }} />
      <footer className="bch-cover-footer">
        <CherryReveal delay={0.5}><p className="bch-cover-date">{data.date}</p>{data.cherry.coverCity && <p className="bch-cover-city">{data.cherry.coverCity}</p>}</CherryReveal>
        <motion.button type="button" className="bch-button bch-cover-button" onClick={open} disabled={opening} whileTap={reduced ? undefined : { scale: 0.97 }}><CherryDoodle type="bow" /><span>{data.intro.buttonText || (c ? "ПОГЛЕДАЈ ПОЗИВНИЦУ" : "POGLEDAJ POZIVNICU")}</span></motion.button>
      </footer>
    </motion.div>
  </section>;
}
