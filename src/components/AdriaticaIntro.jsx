import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import "../styles/newintro.css";
import "../styles/adriatica-language.css";

const imageDirectory = "/images/adriatica-destination";
const openingDuration = 1440;
const openingFallbackDuration = 1800;
const languageChoices = [
  { value: "sr", label: "Srpski", lang: "sr-Latn" },
  { value: "de", label: "Deutsch", lang: "de" },
];

const envelopeCopy = {
  sr: {
    cue: "Dodirni pismo",
    cueDetail: "i otvori pozivnicu",
    open: "Dodirni pismo i otvori pozivnicu",
    opening: "Otvaranje pozivnice",
  },
  de: {
    cue: "Umschlag antippen",
    cueDetail: "und die Einladung öffnen",
    open: "Umschlag antippen, um die Einladung zu öffnen",
    opening: "Die Einladung wird geöffnet",
  },
};

export const adriaticaCoverImages = {
  background: `${imageDirectory}/boka-akvarel.webp`,
  monogram: `${imageDirectory}/monogram-vm.webp`,
  paper: `${imageDirectory}/reljefni-papir.webp`,
};

export default function AdriaticaIntro({
  brideName,
  groomName,
  slug,
  language = "sr",
  showLanguageSwitcher = false,
  overCover = false,
  onLanguageChange,
  onStartMusic,
  onReveal,
  onEnter,
}) {
  const [opening, setOpening] = useState(false);
  const [languageChosen, setLanguageChosen] = useState(false);
  const openingRef = useRef(false);
  const timer = useRef(null);
  const firstLanguageButton = useRef(null);
  const openButton = useRef(null);
  const moveFocus = useRef(false);
  const reducedMotion = useReducedMotion();
  const canChooseLanguage =
    slug === "valerija-marko" &&
    showLanguageSwitcher &&
    typeof onLanguageChange === "function";
  const showLanguageChoice = canChooseLanguage && !languageChosen;
  const copy = language === "de" ? envelopeCopy.de : envelopeCopy.sr;
  const Screen = overCover ? "div" : "main";
  const className = overCover ? "adriatica-cover-intro" : "adriatica";

  useEffect(() => {
    if (!overCover) {
      const monogram = new Image();
      monogram.src = adriaticaCoverImages.monogram;
    }

    return () => window.clearTimeout(timer.current);
  }, [overCover]);

  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    const nextButton = showLanguageChoice ? firstLanguageButton : openButton;
    nextButton.current?.focus({ preventScroll: true });
  }, [showLanguageChoice]);

  const chooseLanguage = (nextLanguage) => {
    onLanguageChange(nextLanguage);
    moveFocus.current = true;
    setLanguageChosen(true);
  };

  const finishOpening = () => {
    if (timer.current === null) return;
    window.clearTimeout(timer.current);
    timer.current = null;
    onEnter();
  };

  const openEnvelope = () => {
    if (openingRef.current) return;
    openingRef.current = true;
    onStartMusic?.();

    if (reducedMotion) {
      onEnter();
      return;
    }

    setOpening(true);
    timer.current = window.setTimeout(
      finishOpening,
      overCover ? openingFallbackDuration : openingDuration,
    );
  };

  const initials = [brideName, groomName]
    .map((name) => Array.from((name || "").trim())[0] || "")
    .join("")
    .toLocaleUpperCase("sr-Latn");

  if (showLanguageChoice) {
    return (
      <div className={className} lang="sr-Latn">
        <Screen
          className="adriatica-language-screen"
          aria-labelledby="adriatica-language-title"
        >
          <div className="adriatica-language-plaque">
            <img
              className="adriatica-language-paper"
              src={`${imageDirectory}/okvir-jezik.png`}
              alt=""
              width={1073}
              height={1466}
              fetchPriority="high"
              draggable={false}
            />
            <div className="adriatica-language-content">
              <h1 id="adriatica-language-title" className="adriatica-language-title">
                Izaberite jezik
                <span lang="de">Sprache wählen</span>
              </h1>
              <div
                className="adriatica-language-options"
                role="group"
                aria-labelledby="adriatica-language-title"
              >
                {languageChoices.map(({ value, label, lang }, index) => (
                  <button
                    key={value}
                    ref={index === 0 ? firstLanguageButton : undefined}
                    type="button"
                    lang={lang}
                    onClick={() => chooseLanguage(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Screen>
      </div>
    );
  }

  return (
    <div className={className} lang={language === "de" ? "de" : "sr-Latn"}>
      <Screen
        className={`adriatica-envelope-screen${opening ? " adriatica-envelope-screen--opening" : ""}`}
      >
        {!overCover && (
          <img
            className="adriatica-cover-image"
            src={adriaticaCoverImages.background}
            alt=""
            width={1350}
            height={900}
            draggable={false}
          />
        )}
        <div className="adriatica-screen-envelope" aria-hidden="true">
          <span
            className="adriatica-screen-envelope-pocket"
            onAnimationStart={({ animationName }) => {
              if (overCover && animationName === "adriatica-screen-lower-pocket") {
                onReveal?.();
              }
            }}
            onAnimationEnd={({ animationName }) => {
              if (overCover && animationName === "adriatica-screen-lower-pocket") {
                finishOpening();
              }
            }}
          />
          <span className="adriatica-screen-envelope-flap" />
        </div>

        <button
          ref={openButton}
          type="button"
          className="adriatica-screen-open"
          onClick={openEnvelope}
          aria-label={opening ? copy.opening : copy.open}
          aria-disabled={opening}
        >
          <span className="adriatica-screen-seal" aria-hidden="true">
            <img src={`${imageDirectory}/bronzani-pecat.webp`} alt="" draggable={false} />
            <span>{initials}</span>
          </span>
          <span className="adriatica-screen-cue" aria-hidden="true">
            <span className="adriatica-screen-cue-script">{copy.cue}</span>
            <span className="adriatica-screen-cue-detail">{copy.cueDetail}</span>
          </span>
        </button>
      </Screen>
    </div>
  );
}
