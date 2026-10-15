import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import "../styles/newintro.css";

// Zajednički mali elementi su ovde da šablon ostane u tačno četiri JSX fajla.
export const EDITION_EASE = [0.22, 1, 0.36, 1];

export function editionData({
  brideName,
  weddingDate,
  weddingTime,
  venue,
  details = {},
  script,
  backgroundImage,
} = {}) {
  const intro = details.birthdayIntro || {};
  const edition = details.edition || {};
  const cyrillic = (script || details.script) === "cyrillic";
  const age = details.age ?? intro.age ?? 18;
  const name = edition.name || intro.name || brideName || (cyrillic ? "Лена" : "Lena");
  const cover = edition.coverImage || intro.backgroundImage || backgroundImage ||
    (Number(age) < 18
      ? "/images/birthday-edition/edition-cake.webp"
      : "/images/birthday-edition/edition-cover.webp");
  return {
    edition,
    intro,
    age,
    name,
    cyrillic,
    date: details.date || weddingDate || "",
    time: weddingTime || details.time || "",
    venue: details.locationName || details.venue || venue || "",
    address: details.locationAddress || "",
    cover,
    story: edition.storyImage || details.cardBackgroundImage ||
      details.cardBackground || "/images/birthday-edition/edition-cake.webp",
    nameScale: Math.min(1, 6.8 / Math.max(6.8, Array.from(name).length)),
  };
}

export function EditionArrow({ down = false, className = "" }) {
  return (
    <svg className={`bde-arrow ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {down ? <path d="M12 4v16m-6-6 6 6 6-6" /> : <path d="M4 12h16m-6-6 6 6-6 6" />}
    </svg>
  );
}

export function EditionReveal({ children, className = "", delay = 0, ...rest }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={`bde-reveal ${className}`}
      initial={reduced ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: reduced ? 0 : 0.85, delay: reduced ? 0 : delay, ease: EDITION_EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// Rukopis ostaje jedan tekst: razdvajanje na slova prekinulo bi spojene poteze fonta.
export function EditionScript({ children, className = "", delay = 0, underline = false }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();
  const extended = typeof children === "string" && /[čćđČĆĐ]/.test(children);
  return (
    <span ref={ref} className={`bde-script ${extended ? "bde-script-extended" : ""} ${className}`}>
      <motion.span
        className="bde-script-ink"
        initial={reduced ? false : { clipPath: "inset(0 100% 0 0)" }}
        animate={seen ? { clipPath: "inset(0 0% 0 0)" } : undefined}
        transition={{ duration: reduced ? 0 : 1.45, delay: reduced ? 0 : delay, ease: [0.3, 0.05, 0.15, 1] }}
      >
        {children}
      </motion.span>
      {underline && (
        <svg className="bde-script-underline" viewBox="0 0 260 25" fill="none" aria-hidden="true">
          <motion.path
            d="M4 18C58 4 149 3 220 11c23 3 35 9 26 10-7 1-19-1-25-3"
            initial={reduced ? false : { pathLength: 0 }}
            animate={seen ? { pathLength: 1 } : undefined}
            transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : delay + 0.8, ease: EDITION_EASE }}
          />
        </svg>
      )}
    </span>
  );
}

export function EditionLetters({ text, className = "", delay = 0 }) {
  const reduced = useReducedMotion();
  let charIndex = 0;
  return (
    <motion.span
      className={`bde-letters ${className}`}
      aria-label={text}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      {String(text).split(/(\s+)/).map((word, index) => (
        /^\s+$/.test(word)
          ? <span key={index} aria-hidden="true">{word}</span>
          : <span key={index} className="bde-word" aria-hidden="true">
              {Array.from(word).map((character, letter) => {
                const order = charIndex++;
                return (
                  <span className="bde-letter-mask" key={letter}>
                    <motion.span
                      className="bde-glyph"
                      variants={{
                        hidden: reduced ? { y: 0, opacity: 1 } : { y: "115%", opacity: 0 },
                        visible: { y: 0, opacity: 1 },
                      }}
                      transition={{ duration: reduced ? 0 : 0.75, delay: reduced ? 0 : delay + order * 0.035, ease: EDITION_EASE }}
                    >{character}</motion.span>
                  </span>
                );
              })}
            </span>
      ))}
    </motion.span>
  );
}

export function EditionPhoto({ src, alt = "", className = "", position = "50% 50%", eager = false }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const seen = useInView(ref, { once: true, amount: 0.15 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-12, 12]);
  return (
    <div
      ref={ref}
      className={`bde-photo ${className}`}
    >
      <motion.div
        className="bde-photo-reveal"
        initial={reduced ? false : { clipPath: "inset(0 0 100% 0)" }}
        animate={seen ? { clipPath: "inset(0 0 0% 0)" } : undefined}
        transition={{ duration: reduced ? 0 : 1.15, ease: EDITION_EASE }}
      >
        <motion.img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          draggable="false"
          style={{ y: reduced ? 0 : y, objectPosition: position }}
        />
      </motion.div>
    </div>
  );
}

export default function BirthdayEditionIntro(props) {
  const { slug, details = {}, onEnter, onStartMusic } = props;
  const data = editionData(props);
  const reduced = useReducedMotion();
  const [opening, setOpening] = useState(false);
  const locked = useRef(false);
  const entered = useRef(false);
  const c = data.cyrillic;

  useEffect(() => {
    locked.current = false;
    entered.current = false;
    setOpening(false);
  }, [slug]);

  const handleOpen = () => {
    if (locked.current) return;
    locked.current = true;
    // Poziv ostaje u korisničkom kliku, što je važno za zvuk u mobilnom Safari-ju.
    onStartMusic?.();
    setOpening(true);
  };

  const finishOpening = () => {
    if (!opening || entered.current) return;
    entered.current = true;
    onEnter?.();
  };

  return (
    <section
      className="bde bde-intro"
      data-script={c ? "cyrillic" : "latin"}
      lang={c ? "sr-Cyrl" : "sr-Latn"}
      aria-label={`${data.name} — ${data.age}. ${c ? "рођендан" : "rođendan"}`}
      style={{ "--bde-name-scale": data.nameScale }}
    >
      <motion.div
        className="bde-cover-sheet"
        initial={{ opacity: 0 }}
        animate={opening
          ? { opacity: 0, y: reduced ? 0 : "-9%", scale: reduced ? 1 : 0.975 }
          : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: reduced ? 0.12 : opening ? 0.85 : 0.7, ease: EDITION_EASE }}
        onAnimationComplete={finishOpening}
      >
        <div className="bde-cover-image" aria-hidden="true">
          <motion.img
            src={data.cover}
            alt=""
            fetchPriority="high"
            decoding="async"
            draggable="false"
            initial={reduced ? false : { scale: 1.07 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.2, ease: EDITION_EASE }}
            style={{ objectPosition: data.edition.coverPosition || data.intro.backgroundPosition || "50% 55%" }}
          />
        </div>
        <div className="bde-cover-wash" aria-hidden="true" />

        <header className="bde-cover-meta">
          <span>{data.edition.coverKicker || (c ? "ПОСЕБНО ИЗДАЊЕ" : "POSEBNO IZDANJE")}</span>
          <span>№ {data.age}</span>
        </header>

        <div className="bde-cover-type">
          <EditionReveal delay={0.1}>
            <p className="bde-kicker">{data.edition.introLine || (c ? "ПОЗИВАМ ТЕ НА СВОЈ" : "POZIVAM TE NA SVOJ")}</p>
          </EditionReveal>
          <div className="bde-cover-titles">
            <motion.span
              className="bde-cover-age"
              aria-hidden="true"
              initial={reduced ? false : { y: 34, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.15, ease: EDITION_EASE }}
            >{data.age}</motion.span>
            <h1 className="bde-cover-name"><EditionScript delay={0.45}>{data.name}</EditionScript></h1>
          </div>
          <p className="bde-cover-label">
            <EditionLetters text={`${data.age}. ${data.intro.birthdayLabel || (c ? "РОЂЕНДАН" : "ROĐENDAN")}`} delay={0.7} />
          </p>
        </div>

        <footer className="bde-cover-bottom">
          <EditionReveal delay={0.65}>
            {data.date && <p className="bde-cover-date">{data.date}</p>}
            {data.edition.coverCity && <p className="bde-cover-city">{data.edition.coverCity}</p>}
          </EditionReveal>
          <motion.button
            className="bde-button bde-cover-button"
            type="button"
            onClick={handleOpen}
            disabled={opening}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: reduced ? 0 : 1.15 }}
            whileTap={reduced ? undefined : { scale: 0.975 }}
          >
            <span>{opening
              ? c ? "ОТВАРАЊЕ…" : "OTVARANJE…"
              : data.intro.buttonText || (c ? "ПОГЛЕДАЈ ПОЗИВНИЦУ" : "POGLEDAJ POZIVNICU")}</span>
            <EditionArrow />
          </motion.button>
          <span className="bde-cover-footnote" aria-hidden="true">{c ? "ЈЕДНО ВЕЧЕ. БЕЗБРОЈ УСПОМЕНА." : "JEDNO VEČE. BEZBROJ USPOMENA."}</span>
        </footer>
      </motion.div>
    </section>
  );
}
