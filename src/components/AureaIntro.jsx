import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import "../styles/newintro.css";

const INTRO_COPY = {
  "sr-Latn": { open: "Pogledaj pozivnicu", languages: "Jezik" },
  "sr-Cyrl": { open: "Погледај позивницу", languages: "Језик" },
  en: { open: "Open the invitation", languages: "Language" },
  de: { open: "Einladung ansehen", languages: "Sprache" },
};

export function aureaLocale(language, script) {
  if (language === "en" || language === "de") return language;
  return script === "cyrillic" ? "sr-Cyrl" : "sr-Latn";
}

export function AureaLanguageToggle({
  locale,
  language,
  languages = [],
  languageLabels = {},
  onLanguageChange,
  showLanguageSwitcher,
}) {
  if (!showLanguageSwitcher || !onLanguageChange || languages.length < 2) return null;
  return (
    <div className="aurea-languages" role="group" aria-label={INTRO_COPY[locale]?.languages || "Jezik"}>
      {languages.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={language === option}
          onClick={() => onLanguageChange(option)}
        >
          {languageLabels[option] || option.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => ((value = (1664525 * value + 1013904223) >>> 0) / 4294967296);
}

// Preneto iz SaveTheDatePetals: gust, preklapajući raster sa
// veličinom latice proporcionalnom dijagonali ćelije.
function buildPetals(width, height, seed = 1729) {
  const rand = seededRandom(seed);
  const targetCell = width <= 600 ? 72 : 94;
  const columns = Math.max(6, Math.ceil(width / targetCell));
  const rows = Math.max(10, Math.ceil(height / targetCell));
  const cellW = width / columns;
  const cellH = height / rows;
  const baseSize = Math.hypot(cellW, cellH) * 1.58;

  const result = [];
  let id = 0;

  // +1 red i kolona van ekrana: nema praznih ivica.
  for (let row = -1; row <= rows; row++) {
    for (let col = -1; col <= columns; col++) {
      const x = ((col + 0.5 + (rand() - 0.5) * 0.46) / columns) * 100;
      const y = ((row + 0.5 + (rand() - 0.5) * 0.46) / rows) * 100;
      const tilt = Math.round(rand() * 360);
      result.push({
        id: id++,
        x,
        y,
        size: baseSize * (0.98 + rand() * 0.32),
        sprite: (id - 1) % 4,
        delay: Math.round(rand() * 220),
        duration: Math.round(1450 + rand() * 360),
        drift: Math.round(-95 + rand() * 190),
        tilt,
        endRotate: tilt + Math.round(-240 + rand() * 480),
        z: Math.floor(rand() * 6),
      });
    }
  }

  return result;
}

export default function AureaIntro({
  brideName = "",
  groomName = "",
  onEnter,
  language = "sr",
  script = "latin",
  details = {},
  ...languageControls
}) {
  const locale = aureaLocale(language, script);
  const seed = useMemo(
    () => `${brideName}-${groomName}`.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 1081),
    [brideName, groomName]
  );
  const rootRef = useRef(null);
  const [petals, setPetals] = useState([]);
  const [phase, setPhase] = useState("intro");
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  // Dimenzije stvarnog intro ekrana, isto kao u SaveTheDatePetals.
  // Preračunava se samo dok su latice na početnom mestu.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const rebuild = () => {
      if (phaseRef.current !== "intro") return;
      const rect = root.getBoundingClientRect();
      const width = Math.max(rect.width, window.innerWidth || 360);
      const height = Math.max(rect.height, window.innerHeight || 640);
      setPetals(buildPetals(width, height, seed));
    };
    rebuild();
    const observer = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(rebuild)
      : null;
    observer?.observe(root);
    if (!observer) window.addEventListener("resize", rebuild);
    return () => {
      observer?.disconnect();
      if (!observer) window.removeEventListener("resize", rebuild);
    };
  }, [seed]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    media.addEventListener?.("change", update);

    const revealTimer = window.setTimeout(() => setPhase("revealing"), 1450);
    const readyTimer = window.setTimeout(() => setPhase("ready"), 3900);

    return () => {
      media.removeEventListener?.("change", update);
      window.clearTimeout(revealTimer);
      window.clearTimeout(readyTimer);
    };
  }, []);

  const initials = useMemo(
    () => [brideName, groomName].map((name) => Array.from((name || "").trim())[0] || ""),
    [brideName, groomName]
  );


  // Fotografija ostaje u ORIGINALNIM bojama; nema crnog overleja niti grayscale-a.
  // Za prikaz u boji, postavi details.aurea.introImage na fotografiju u boji.
  const photo = details?.aurea?.introImage || "/images/aurea/aurea-couple-bw.webp";
  const petalImage =
    details?.aurea?.petalImageSrc ||
    details?.saveTheDate?.petalImageSrc ||
    "/images/save-the-date/white-rose-petals.webp";

  // Za svaki slug mozes da generises poseban monogram/ornament PNG.
  const ornamentImage =
    details?.aurea?.ornamentImage ||
    details?.aurea?.monogramImage ||
    "/images/aurea/ornaments/default-monogram.png";

  // Personalizovani ornament po slugu već sadrži inicijale u samoj slici.
  // Ako je uneta ornamentImage, ne prikazujemo drugi tekst preko nje.
  const showTextInitials = details?.aurea?.showTextInitials ??
    !(details?.aurea?.ornamentImage || details?.aurea?.monogramImage);

  const isReady = reducedMotion || phase === "ready";

  return (
    <section
      ref={rootRef}
      className="aurea-petals-intro"
      data-phase={reducedMotion ? "ready" : phase}
      lang={locale}
      style={{
        "--aurea-photo": `url("${photo}")`,
        "--aurea-petal-image": `url("${petalImage}")`,
        "--aurea-ornament-image": `url("${ornamentImage}")`,
      }}
    >
      <div className="aurea-petals-intro__photo" aria-hidden="true" />
      <div className="aurea-petals-intro__veil" aria-hidden="true" />
      <div className="aurea-petals-intro__light" aria-hidden="true" />
      <div className="aurea-petals-intro__paper-cover" aria-hidden="true" />

      <span className="aurea-petals-intro__petals" aria-hidden="true">
        {petals.map((petal) => (
          <span
            key={petal.id}
            className={`aurea-petals-intro__petal sprite-${petal.sprite}`}
            style={{
              "--x": `${petal.x}%`,
              "--y": `${petal.y}%`,
              "--size": `${petal.size}px`,
              "--delay": `${petal.delay}ms`,
              "--duration": `${petal.duration}ms`,
              "--drift": `${petal.drift}px`,
              "--tilt": `${petal.tilt}deg`,
              "--end-rotate": `${petal.endRotate}deg`,
              zIndex: petal.z,
            }}
          />
        ))}
      </span>

      <div className="aurea-petals-intro__ornament-wrap" aria-hidden="true">
        <div className="aurea-petals-intro__ornament" />
      </div>

      {showTextInitials && (
        <div className="aurea-petals-intro__monogram" aria-label={`Inicijali ${initials.filter(Boolean).join(" i ")}`}>
          <span>{initials[0]}</span>
          <span>{initials[1]}</span>
        </div>
      )}

      {isReady && (
        <button type="button" className="aurea-petals-intro__open" onClick={onEnter}>
          {INTRO_COPY[locale].open}
        </button>
      )}

      {isReady && <AureaLanguageToggle locale={locale} language={language} {...languageControls} />}
    </section>
  );
}
