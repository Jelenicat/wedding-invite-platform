import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import "../styles/newintro.css";

// Zajednički elementi ostaju ovde: šablon ima ukupno četiri JSX fajla.
export const NOIR_EASE = [0.22, 1, 0.36, 1];

export function noirData({ brideName, weddingDate, weddingTime, venue, details = {}, script, backgroundImage } = {}) {
  const intro = details.birthdayIntro || {};
  const noir = details.noir || {};
  const cyrillic = (script || details.script) === "cyrillic";
  const name = noir.name || intro.name || brideName || (cyrillic ? "Лена" : "Lena");
  return {
    noir, intro, name, cyrillic,
    age: details.age ?? intro.age ?? 18,
    date: details.date || weddingDate || "",
    time: weddingTime || details.time || "",
    venue: details.locationName || details.venue || venue || "",
    address: details.locationAddress || "",
    cover: noir.coverImage || intro.backgroundImage || backgroundImage || "/images/birthday-noir/noir-glasses.webp",
    disco: noir.discoImage || "/images/birthday-noir/noir-disco.webp",
    nameScale: Math.min(1, 7 / Math.max(7, Array.from(name).length)),
  };
}

export function NoirArrow({ down = false }) {
  return <svg className="bno-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={down ? "M12 4v16m-6-6 6 6 6-6" : "M4 12h16m-6-6 6 6-6 6"} /></svg>;
}

export function NoirIcon({ type = "star", className = "" }) {
  const paths = {
    star: "M12 2c0 7-3 10-10 10 7 0 10 3 10 10 0-7 3-10 10-10-7 0-10-3-10-10Z",
    calendar: "M7 3v4m10-4v4M4 10h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Zm3 9h2m4 0h2m-8 3h2",
    clock: "M12 6v6l4 3M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z",
    location: "M12 22S4 15 4 9a8 8 0 1 1 16 0c0 6-8 13-8 13Zm3-13a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  };
  return <svg className={`bno-icon ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={paths[type] || paths.star} /></svg>;
}

export function NoirReveal({ children, className = "", delay = 0, from = "bottom", ...rest }) {
  const reduced = useReducedMotion();
  return <motion.div
    className={`bno-reveal ${className}`}
    initial={reduced ? false : { opacity: 0, y: from === "bottom" ? 26 : 0, x: from === "left" ? -24 : from === "right" ? 24 : 0 }}
    whileInView={{ opacity: 1, y: 0, x: 0 }}
    viewport={{ once: true, amount: 0.17 }}
    transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : delay, ease: NOIR_EASE }}
    {...rest}
  >{children}</motion.div>;
}

export function NoirScript({ children, className = "", delay = 0, underline = false }) {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, amount: 0.2 });
  const reduced = useReducedMotion();
  const extended = typeof children === "string" && /[čćđČĆĐ]/.test(children);
  return <span ref={ref} className={`bno-script ${extended ? "bno-script-extended" : ""} ${className}`}>
    <motion.span className="bno-ink"
      initial={reduced ? false : { clipPath: "inset(0 100% 0 0)" }}
      animate={visible ? { clipPath: "inset(0 0% 0 0)" } : undefined}
      transition={{ duration: reduced ? 0 : 1.6, delay: reduced ? 0 : delay, ease: [0.35, 0.05, 0.2, 1] }}
    >{children}</motion.span>
    {underline && <svg className="bno-handline" viewBox="0 0 280 30" fill="none" aria-hidden="true"><motion.path
      d="M5 23c68-20 176-22 244-11 18 3 27 8 20 10-7 2-18-1-23-4"
      initial={reduced ? false : { pathLength: 0 }} animate={visible ? { pathLength: 1 } : undefined}
      transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : delay + 0.9, ease: NOIR_EASE }}
    /></svg>}
  </span>;
}

export function NoirLetters({ text, className = "", delay = 0 }) {
  const reduced = useReducedMotion();
  let count = 0;
  return <motion.span className={`bno-letters ${className}`} aria-label={text} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.25 }}>
    {String(text).split(/(\s+)/).map((word, i) => /^\s+$/.test(word)
      ? <span key={i} aria-hidden="true">{word}</span>
      : <span key={i} className="bno-word" aria-hidden="true">{Array.from(word).map((letter, j) => {
          const order = count++;
          return <span key={j} className="bno-letter-mask"><motion.span className="bno-glyph"
            variants={{ hidden: reduced ? { opacity: 1, y: 0, rotate: 0 } : { opacity: 0, y: "115%", rotate: 6 }, shown: { opacity: 1, y: 0, rotate: 0 } }}
            transition={{ duration: reduced ? 0 : 0.8, delay: reduced ? 0 : delay + order * 0.035, ease: NOIR_EASE }}
          >{letter}</motion.span></span>;
        })}</span>)}
  </motion.span>;
}

export function NoirPhoto({ src, alt = "", className = "", position = "50% 50%", eager = false }) {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, amount: 0.12 });
  const reduced = useReducedMotion();
  return <div ref={ref} className={`bno-photo ${className}`}>
    <motion.div className="bno-photo-mask"
      initial={reduced ? false : { clipPath: "inset(0 0 100% 0 round 0px)" }}
      animate={visible ? { clipPath: "inset(0 0 0% 0 round 0px)" } : undefined}
      transition={{ duration: reduced ? 0 : 1.25, ease: NOIR_EASE }}
    ><motion.img src={src} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" draggable="false"
      initial={reduced ? false : { scale: 1.075 }} animate={visible ? { scale: 1 } : undefined}
      transition={{ duration: reduced ? 0 : 1.9, ease: NOIR_EASE }} style={{ objectPosition: position }}
    /></motion.div>
  </div>;
}

export default function BirthdayNoirIntro(props) {
  const { slug, onEnter, onStartMusic } = props;
  const data = noirData(props);
  const c = data.cyrillic;
  const reduced = useReducedMotion();
  const [opening, setOpening] = useState(false);
  const locked = useRef(false);
  const entered = useRef(false);
  useEffect(() => { locked.current = false; entered.current = false; setOpening(false); }, [slug]);
  const open = () => {
    if (locked.current) return;
    locked.current = true;
    onStartMusic?.();
    setOpening(true);
  };
  const finish = () => {
    if (!opening || entered.current) return;
    entered.current = true;
    onEnter?.();
  };
  return <section className="bno bno-intro" data-script={c ? "cyrillic" : "latin"} lang={c ? "sr-Cyrl" : "sr-Latn"} aria-label={`${data.name} — ${data.age}. ${c ? "рођендан" : "rođendan"}`} style={{ "--bno-name-scale": data.nameScale }}>
    <div className={`bno-cover ${opening ? "bno-opening" : ""}`}>
      <div className="bno-cover-backlight" aria-hidden="true" />
      {["left", "right"].map((side) => <motion.div key={side} className={`bno-curtain bno-curtain-${side}`} aria-hidden="true"
        initial={false}
        animate={{ x: opening && !reduced ? side === "left" ? "-105%" : "105%" : 0, opacity: opening && reduced ? 0 : 1 }}
        transition={{ duration: reduced ? 0.15 : 1.05, ease: [0.7, 0, 0.2, 1] }}
        onAnimationComplete={side === "right" ? finish : undefined}
      ><img src={data.cover} alt="" fetchPriority="high" decoding="async" draggable="false" style={{ objectPosition: data.noir.coverPosition || "50% 58%" }} /></motion.div>)}
      <div className="bno-cover-shade" aria-hidden="true" />
      <motion.div className="bno-cover-content" initial={{ opacity: 0 }} animate={opening ? { opacity: 0, y: -16 } : { opacity: 1, y: 0 }} transition={{ duration: reduced ? 0.1 : opening ? 0.35 : 0.8 }}>
        <header className="bno-cover-heading">
          <NoirReveal delay={0.1}><p className="bno-kicker">{data.noir.introLine || (c ? "ПОЗИВАМ ТЕ НА СВОЈ" : "POZIVAM TE NA SVOJ")}</p></NoirReveal>
          <h1 className="bno-cover-name"><NoirScript delay={0.25}>{data.name}</NoirScript></h1>
          <div className="bno-cover-age"><NoirLetters text={`${data.age}.`} delay={0.5} /><span>{data.intro.birthdayLabel || (c ? "рођендан" : "rođendan")}</span></div>
        </header>
        <footer className="bno-cover-footer">
          <NoirReveal delay={0.6}>
            {data.date && <p className="bno-cover-date">{data.date}</p>}
            {data.noir.coverCity && <p className="bno-cover-city">{data.noir.coverCity}</p>}
          </NoirReveal>
          <motion.button className="bno-button bno-cover-button" type="button" onClick={open} disabled={opening} whileTap={reduced ? undefined : { scale: 0.975 }}>
            <span>{data.intro.buttonText || (c ? "ПОГЛЕДАЈ ПОЗИВНИЦУ" : "POGLEDAJ POZIVNICU")}</span><NoirArrow />
          </motion.button>
        </footer>
      </motion.div>
    </div>
  </section>;
}
