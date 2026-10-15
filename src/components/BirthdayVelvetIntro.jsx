import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import "../styles/newintro.css";

export const VELVET_EASE = [0.22, 1, 0.36, 1];

export function velvetData({ brideName, weddingDate, weddingTime, venue, script, template, details = {} } = {}) {
  const velvet = details.velvet || {};
  const variant = velvet.variant === "onyx" || (!velvet.variant && template === "birthday-velvet-onyx") ? "onyx" : "rose";
  const cyrillic = (script || details.script) === "cyrillic";
  const name = velvet.name || details.birthdayIntro?.name || brideName || (variant === "onyx" ? cyrillic ? "Лука" : "Luka" : cyrillic ? "Нина" : "Nina");
  return {
    velvet, variant, name, cyrillic,
    age: details.age ?? details.birthdayIntro?.age ?? 18,
    date: details.date || weddingDate || "",
    time: weddingTime || details.time || "",
    venue: details.locationName || details.venue || venue || "",
    address: details.locationAddress || "",
    silk: velvet.silkImage || `/images/birthday-velvet/${variant}-silk.webp`,
    lace: velvet.laceImage || "/images/birthday-velvet/lace-oval.webp",
    evening: velvet.eveningImage || `/images/birthday-velvet/${variant}-evening.webp`,
    envelope: velvet.envelopeImage || `/images/birthday-velvet/${variant === "onyx" ? "blue" : "rose"}-envelope.webp`,
    nameScale: Math.min(1, 5.5 / Math.max(5.5, Array.from(name).length)),
  };
}

export function VelvetArrow() {
  return <svg className="bvs-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" /></svg>;
}

export function VelvetOrnament() {
  return <span className="bvs-ornament" aria-hidden="true"><i /><i /><i /></span>;
}

export function VelvetLine() {
  const reduced = useReducedMotion();
  return <svg className="bvs-line" viewBox="0 0 240 22" fill="none" aria-hidden="true"><motion.path d="M3 11h101m32 0h101m-117-8 8 8-8 8-8-8Z" initial={reduced ? false : {pathLength:0}} whileInView={{pathLength:1}} viewport={{once:true}} transition={{duration:reduced?0:1.15,ease:VELVET_EASE}} /></svg>;
}

export function VelvetReveal({ children, className = "", delay = 0, from = "bottom", ...rest }) {
  const reduced = useReducedMotion();
  return <motion.div
    className={`bvs-reveal ${className}`}
    initial={reduced ? false : { opacity: 0, y: from === "bottom" ? 26 : 0, x: from === "left" ? -24 : from === "right" ? 24 : 0 }}
    whileInView={{ opacity: 1, y: 0, x: 0 }}
    viewport={{ once: true, amount: 0.17 }}
    transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : delay, ease: VELVET_EASE }}
    {...rest}
  >{children}</motion.div>;
}

export function VelvetScript({ children, className = "", delay = 0, underline = false }) {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, amount: 0.2 });
  const reduced = useReducedMotion();
  const extended = typeof children === "string" && /[čćđČĆĐ]/.test(children);
  return <span ref={ref} className={`bvs-script ${extended ? "bvs-script-extended" : ""} ${className}`}>
    <motion.span className="bvs-ink"
      initial={reduced ? false : { clipPath: "inset(0 100% 0 0)" }}
      animate={visible ? { clipPath: "inset(0 0% 0 0)" } : undefined}
      transition={{ duration: reduced ? 0 : 1.6, delay: reduced ? 0 : delay, ease: [0.35, 0.05, 0.2, 1] }}
    >{children}</motion.span>
    {underline && <svg className="bvs-handline" viewBox="0 0 280 30" fill="none" aria-hidden="true"><motion.path
      d="M5 23c68-20 176-22 244-11 18 3 27 8 20 10-7 2-18-1-23-4"
      initial={reduced ? false : { pathLength: 0 }} animate={visible ? { pathLength: 1 } : undefined}
      transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : delay + 0.9, ease: VELVET_EASE }}
    /></svg>}
  </span>;
}

export function VelvetLetters({ text, className = "", delay = 0 }) {
  const reduced = useReducedMotion();
  let count = 0;
  return <motion.span className={`bvs-letters ${className}`} aria-label={text} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.25 }}>
    {String(text).split(/(\s+)/).map((word, i) => /^\s+$/.test(word)
      ? <span key={i} aria-hidden="true">{word}</span>
      : <span key={i} className="bvs-word" aria-hidden="true">{Array.from(word).map((letter, j) => {
          const order = count++;
          return <span key={j} className="bvs-letter-mask"><motion.span className="bvs-glyph"
            variants={{ hidden: reduced ? { opacity: 1, y: 0, rotate: 0 } : { opacity: 0, y: "115%", rotate: 6 }, shown: { opacity: 1, y: 0, rotate: 0 } }}
            transition={{ duration: reduced ? 0 : 0.8, delay: reduced ? 0 : delay + order * 0.035, ease: VELVET_EASE }}
          >{letter}</motion.span></span>;
        })}</span>)}
  </motion.span>;
}

export function VelvetPhoto({ src, alt = "", className = "", position = "50% 50%", eager = false }) {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, amount: 0.12 });
  const reduced = useReducedMotion();
  return <div ref={ref} className={`bvs-photo ${className}`}>
    <motion.div className="bvs-photo-mask"
      initial={reduced ? false : { clipPath: "inset(0 0 100% 0 round 0px)" }}
      animate={visible ? { clipPath: "inset(0 0 0% 0 round 0px)" } : undefined}
      transition={{ duration: reduced ? 0 : 1.25, ease: VELVET_EASE }}
    ><motion.img src={src} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" draggable="false"
      initial={reduced ? false : { scale: 1.075 }} animate={visible ? { scale: 1 } : undefined}
      transition={{ duration: reduced ? 0 : 1.9, ease: VELVET_EASE }} style={{ objectPosition: position }}
    /></motion.div>
  </div>;
}




export default function BirthdayVelvetIntro(props) {
  const { slug, onEnter, onStartMusic, details = {} } = props;
  const data = velvetData(props), c = data.cyrillic;
  const reduced = useReducedMotion();
  const [opening, setOpening] = useState(false);
  const locked = useRef(false), entered = useRef(false);
  useEffect(() => { locked.current = false; entered.current = false; setOpening(false); }, [slug]);
  const open = () => {
    if (locked.current) return;
    locked.current = true;
    onStartMusic?.();
    setOpening(true);
  };
  const finish = () => { if (opening && !entered.current) { entered.current = true; onEnter?.(); } };
  return <section className="bvs bvs-intro" data-variant={data.variant} data-script={c ? "cyrillic" : "latin"} lang={c ? "sr-Cyrl" : "sr-Latn"} style={{"--bvs-name-scale":data.nameScale}}>
    <motion.div className="bvs-cover" initial={{opacity:0}} animate={opening ? {opacity:0,scale:reduced?1:1.08,filter:reduced?"none":"blur(4px)"} : {opacity:1,scale:1,filter:"none"}} transition={{duration:reduced?0.15:opening?1:0.6,ease:VELVET_EASE}} onAnimationComplete={finish}>
      <motion.img className="bvs-cover-silk" src={data.silk} alt="" fetchPriority="high" draggable="false" initial={reduced?false:{scale:1.1}} animate={{scale:1}} transition={{duration:2.5,ease:VELVET_EASE}} />
      <p className="bvs-cover-eyebrow">{data.velvet.introLine || (c ? "ВЕЧЕ ЗА НАШЕ УСПОМЕНЕ" : "VEČE ZA NAŠE USPOMENE")}</p>
      <motion.div className="bvs-medallion" initial={reduced?false:{opacity:0,y:24,rotate:-3}} animate={{opacity:1,y:0,rotate:0}} transition={{duration:1.1,delay:reduced?0:0.2,ease:VELVET_EASE}}>
        <div className="bvs-medallion-paper" />
        {data.variant === "rose" ? <img className="bvs-lace" src={data.lace} alt="" draggable="false" /> : <div className="bvs-oval-frame" aria-hidden="true"><i /><i /></div>}
        <div className="bvs-medallion-copy">
          <VelvetReveal delay={0.3}><p className="bvs-kicker">{c?"ПОЗИВНИЦА ЗА":"POZIVNICA ZA"}</p></VelvetReveal>
          <h1 className="bvs-cover-name">{data.variant === "rose" ? <VelvetScript delay={0.4}>{data.name}</VelvetScript> : <VelvetLetters text={data.name} delay={0.35} />}</h1>
          <VelvetReveal delay={0.5}><p className="bvs-cover-age">{data.age}. {c?"рођендан":"rođendan"}</p><VelvetLine /><p className="bvs-cover-date">{data.date}</p></VelvetReveal>
        </div>
      </motion.div>
      <div className="bvs-cover-bottom"><VelvetReveal delay={0.65}><p>{data.velvet.coverCity || ""}</p><motion.button className="bvs-button bvs-cover-button" type="button" onClick={open} disabled={opening} whileTap={reduced?undefined:{scale:0.98}}><span>{details.birthdayIntro?.buttonText || (c?"ПОГЛЕДАЈ ПОЗИВНИЦУ":"POGLEDAJ POZIVNICU")}</span><VelvetArrow /></motion.button></VelvetReveal></div>
    </motion.div>
  </section>;
}
