import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import "../styles/newintro.css";

// Svi zajednički elementi su ovde. Šablon ima ukupno četiri JSX fajla.
export const UNIVERSE_EASE = [0.22, 1, 0.36, 1];

// Sve ilustracije i ukrasi su generisane slike. CSS služi za raspored i animiranje.
export const UNIVERSE_ASSETS = {
  constellation: "/images/birthday-little-universe/constellation.webp",
  sparkle: "/images/birthday-little-universe/sparkle.webp",
  icons: "/images/birthday-little-universe/icons-atlas.webp",
  paper: "/images/birthday-little-universe/paper-background.webp",
  candleUnlit: "/images/birthday-little-universe/candle-unlit.webp",
  candleLit: "/images/birthday-little-universe/candle-lit.webp",
  storyHero: "/images/birthday-little-universe/story-dusk.webp",
  storyStar: "/images/birthday-little-universe/story-dusk-star.webp",
  celebration: "/images/birthday-little-universe/story-night-gate.webp",
  planets: [
    "/images/birthday-little-universe/planet-blue.webp",
    "/images/birthday-little-universe/planet-saturn.webp",
    "/images/birthday-little-universe/planet-sage.webp",
    "/images/birthday-little-universe/planet-rose.webp",
  ],
};

const INTRO_ART = {
  sky: "/images/birthday-little-universe/intro-lunar-sky.webp",
  moonlitSealed: "/images/birthday-little-universe/intro-moonlit-sealed.webp",
  moonlitLifting: "/images/birthday-little-universe/intro-moonlit-lifting.webp",
  moonlitOpen: "/images/birthday-little-universe/intro-moonlit-open.webp",
  pocket: "/images/birthday-little-universe/intro-ivory-pocket.webp",
  flap: "/images/birthday-little-universe/intro-ivory-flap.webp",
  seal: "/images/birthday-little-universe/intro-ribbon-seal.webp",
  letter: "/images/birthday-little-universe/intro-star-atlas.webp",
};

const PREVIOUS_DEFAULT_STAGES = new Set([
  "/images/birthday-little-universe/midnight-silk.webp",
  INTRO_ART.sky,
]);
const PREVIOUS_DEFAULT_HEROES = new Set([
  "/images/birthday-little-universe/little-world.webp",
  "/images/birthday-little-universe/story-meadow.webp",
]);
const OPENING_DURATION = 1510;

export function universeData(props = {}) {
  const details = props.details || {};
  const config = details.littleUniverse || {};
  const c = (props.script || details.script) === "cyrillic";
  const name = config.name || props.childName || props.brideName || (c ? "Лука" : "Luka");
  return {
    config, details, c, name,
    age: details.age ?? 1,
    date: details.date || props.weddingDate || "",
    time: props.weddingTime || details.time || "",
    dateISO: details.dateISO || "",
    venue: details.locationName || details.venue || props.venue || "",
    address: details.locationAddress || "",
    hero: config.heroImage && !PREVIOUS_DEFAULT_HEROES.has(config.heroImage)
      ? config.heroImage
      : UNIVERSE_ASSETS.storyHero,
    nameScale: Math.min(1, 6.5 / Math.max(6.5, Array.from(String(name)).length)),
  };
}

export function UniverseIcon({ type = "star", className = "", ...props }) {
  const symbols = ["star", "sparkle", "arrow", "down", "check", "calendar", "location", "heart", "moon"];
  const index = Math.max(0, symbols.indexOf(type));
  return <span className={`blu-icon ${className}`} aria-hidden="true" {...props}
    style={{ backgroundImage: `url("${UNIVERSE_ASSETS.icons}")`, backgroundPosition: `${index % 3 * 50}% ${Math.floor(index / 3) * 50}%`, ...props.style }} />;
}

export function UniverseReveal({ children, className = "", delay = 0, ...props }) {
  const reduced = useReducedMotion();
  return <motion.div className={`blu-reveal ${className}`}
    initial={reduced ? false : { opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }}
    transition={{ duration: reduced ? 0 : 0.85, delay: reduced ? 0 : delay, ease: UNIVERSE_EASE }}
    {...props}>{children}</motion.div>;
}

export function UniverseScript({ children, className = "" }) {
  return <span className={`blu-script ${className}`}>{children}</span>;
}

export function UniverseLetters({ text, className = "", delay = 0 }) {
  const reduced = useReducedMotion();
  let index = 0;
  return <motion.span className={`blu-letters ${className}`} aria-label={text}
    initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.2 }}>
    {String(text).split(/(\s+)/).map((word, w) => /^\s+$/.test(word)
      ? <span key={w} aria-hidden="true">{word}</span>
      : <span className="blu-word" key={w} aria-hidden="true">{Array.from(word).map((letter, l) => {
        const order = index++;
        return <motion.span key={l} className="blu-letter"
          variants={{ hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }, shown: { opacity: 1, y: 0 } }}
          transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : delay + order * 0.045, ease: UNIVERSE_EASE }}
        >{letter}</motion.span>;
      })}</span>)}
  </motion.span>;
}

// Deterministički položaji: nema Math.random u renderu, nema skakanja zvezda.
const STARS = Array.from({ length: 17 }, (_, i) => ({
  left: `${(i * 37 + 9) % 96 + 2}%`, top: `${(i * 23 + 7) % 93 + 2}%`,
  delay: `${i * -0.43}s`, size: `${i % 4 === 0 ? 16 : 8}px`,
}));

export function UniverseStars({ className = "" }) {
  return <div className={`blu-stars ${className}`} aria-hidden="true">{STARS.map((s, i) =>
    <img key={i} src={UNIVERSE_ASSETS.sparkle} alt="" decoding="async" draggable="false" style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay }} />
  )}</div>;
}

export function UniverseBurst({ burst }) {
  const reduced = useReducedMotion();
  if (!burst || reduced) return null;
  return <div className="blu-burst" key={burst.id} style={{ left: burst.x, top: burst.y }} aria-hidden="true">
    {Array.from({ length: 12 }, (_, i) => <img key={i} src={UNIVERSE_ASSETS.sparkle} alt="" decoding="async" style={{ "--blu-angle": `${i * 30}deg`, "--blu-distance": `${42 + i % 3 * 16}px`, "--blu-delay": `${i % 3 * 0.025}s` }} />)}
  </div>;
}

export function UniverseOrbit({ className = "" }) {
  return <img className={`blu-orbit ${className}`} src={UNIVERSE_ASSETS.constellation} alt="" aria-hidden="true" loading="lazy" decoding="async" draggable="false" />;
}

function LetterCopy({ name, date, c, className = "" }) {
  return (
    <div className={`blu-letter-copy ${className}`}>
      <p>{c ? "МОЈ ПРВИ РОЂЕНДАН" : "MOJ PRVI ROĐENDAN"}</p>
      <span className="blu-letter-name" aria-hidden="true">{name}</span>
      {date && <p className="blu-letter-date">{date}</p>}
    </div>
  );
}

function MoonlitEnvelope({ heading, name, date, c, unsealed, reduced, onOpen, openLabel }) {
  const [letterFrameReady, setLetterFrameReady] = useState(false);

  return (
    <div className="blu-moonlit-stage">
      <div className="blu-moonlit-frame">
        <img className="blu-moonlit-image" src={INTRO_ART.moonlitSealed} alt="" fetchPriority="high" decoding="async" draggable="false" />
        {!reduced && (
          <>
            <img className="blu-moonlit-image blu-moonlit-lifting" src={INTRO_ART.moonlitLifting} alt="" fetchPriority="low" decoding="async" draggable="false" />
            <img
              className="blu-moonlit-image blu-moonlit-open"
              src={INTRO_ART.moonlitOpen}
              alt=""
              fetchPriority="low"
              decoding="async"
              draggable="false"
              onLoad={() => setLetterFrameReady(true)}
            />
          </>
        )}
        <header className="blu-intro-heading blu-moonlit-heading" aria-hidden={unsealed || undefined}>{heading}</header>
        {unsealed && letterFrameReady && (
          <LetterCopy name={name} date={date} c={c} className="blu-moonlit-letter-copy" />
        )}
        <button
          className="blu-moonlit-seal"
          type="button"
          aria-label={openLabel}
          onClick={onOpen}
          disabled={unsealed}
        >
          <span className="blu-moonlit-hint" aria-hidden="true">{c ? "Додирни печат" : "Dodirni pečat"}</span>
        </button>
        <UniverseBurst burst={unsealed ? { id: "moonlit-seal", x: "50%", y: "62%" } : null} />
      </div>
    </div>
  );
}

export default function BirthdayLittleUniverseIntro(props) {
  const { slug, onEnter, onStartMusic } = props;
  const { name, age, date, hero, c, config, nameScale } = universeData(props);
  const reduced = useReducedMotion();
  const [unsealed, setUnsealed] = useState(false);
  const openingStarted = useRef(false);
  const invitationEntered = useRef(false);
  const enterInvitation = useRef(onEnter);
  const customStage = config.stageImage && !PREVIOUS_DEFAULT_STAGES.has(config.stageImage)
    ? config.stageImage
    : null;
  const title = c ? "ПОЗИВНИЦА ЗА ПРВИ РОЂЕНДАН" : "POZIVNICA ZA PRVI ROĐENDAN";

  useLayoutEffect(() => {
    openingStarted.current = false;
    invitationEntered.current = false;
    setUnsealed(false);
  }, [slug]);

  useLayoutEffect(() => {
    enterInvitation.current = onEnter;
  }, [onEnter]);

  useEffect(() => {
    if (!unsealed) return;
    const timer = window.setTimeout(() => {
      if (invitationEntered.current) return;
      invitationEntered.current = true;
      enterInvitation.current?.();
    }, reduced ? 0 : OPENING_DURATION);
    return () => window.clearTimeout(timer);
  }, [unsealed, reduced, slug]);

  const open = () => {
    if (openingStarted.current) return;
    openingStarted.current = true;
    setUnsealed(true);
    onStartMusic?.();
    // Slika prve scene može da počne da se učitava dok se koverta otvara.
    const nextPicture = new Image();
    nextPicture.fetchPriority = "high";
    nextPicture.src = hero;
  };

  const openLabel = c ? "Отвори писмо — додирни златни печат" : "Otvori pismo — dodirni zlatni pečat";
  const sectionProps = {
    "data-phase": unsealed ? "opening" : "sealed",
    "data-unsealed": unsealed || undefined,
    "data-script": c ? "cyrillic" : "latin",
    lang: c ? "sr-Cyrl" : "sr-Latn",
    "aria-label": `${name} — ${age}. ${c ? "рођендан" : "rođendan"}`,
    style: { "--blu-name-scale": nameScale },
  };
  const heading = (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.9, ease: UNIVERSE_EASE }}
    >
      <p className="blu-kicker">{config.introKicker || title}</p>
      <h1>{name}</h1>
    </motion.div>
  );
  const status = (
    <p className="blu-intro-status" role="status">
      {unsealed ? (c ? "Писмо се отвара…" : "Pismo se otvara…") : ""}
    </p>
  );
  const pageTurn = unsealed && <div className="blu-intro-page-turn" aria-hidden="true" />;

  if (!customStage) {
    return (
      <section className="blu blu-intro blu-intro-moonlit" {...sectionProps}>
        <MoonlitEnvelope
          heading={heading}
          name={name}
          date={date}
          c={c}
          unsealed={unsealed}
          reduced={reduced}
          openLabel={openLabel}
          onOpen={open}
        />
        {status}
        {pageTurn}
      </section>
    );
  }

  return (
    <section className="blu blu-intro" {...sectionProps}>
      <div className="blu-intro-backdrop" aria-hidden="true">
        <img className="blu-stage-image" src={customStage} alt="" fetchPriority="high" decoding="async" draggable="false" />
      </div>
      <UniverseStars className="blu-intro-stars" />
      {pageTurn}

      <div className="blu-intro-scene">
        <header className="blu-intro-heading">{heading}</header>

        <motion.div
          className="blu-envelope-stage"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduced ? 0 : 0.12, duration: reduced ? 0 : 1, ease: UNIVERSE_EASE }}
        >
          <div className="blu-envelope">
            <img className="blu-envelope-back" src={UNIVERSE_ASSETS.paper} alt="" decoding="async" draggable="false" />
            <img className="blu-envelope-flap" src={INTRO_ART.flap} alt="" decoding="async" draggable="false" />
            <div className="blu-letter-track" aria-hidden={!unsealed}>
              <div className="blu-letter-card">
                <img src={INTRO_ART.letter} alt="" decoding="async" draggable="false" />
                <LetterCopy name={name} date={date} c={c} />
              </div>
            </div>
            <img className="blu-envelope-pocket" src={INTRO_ART.pocket} alt="" decoding="async" fetchPriority="high" draggable="false" />
            <button
              className="blu-open-seal"
              type="button"
              onClick={open}
              disabled={unsealed}
              aria-label={openLabel}
            >
              <img className="blu-seal" src={INTRO_ART.seal} alt="" decoding="async" fetchPriority="high" draggable="false" />
            </button>
            <UniverseBurst burst={unsealed ? { id: slug || "intro", x: "50%", y: "69%" } : null} />
          </div>
        </motion.div>

        <footer className="blu-intro-footer">
          {!unsealed && (
            <p className="blu-open-hint">
              <img src={UNIVERSE_ASSETS.sparkle} alt="" decoding="async" />
              {c ? "Додирни печат" : "Dodirni pečat"}
            </p>
          )}
          {status}
        </footer>
      </div>
    </section>
  );
}
