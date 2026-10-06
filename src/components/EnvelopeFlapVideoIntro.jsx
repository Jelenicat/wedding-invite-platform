import { useEffect, useMemo, useRef, useState } from "react";
import EnvelopeFlapIntro from "./EnvelopeFlapIntro";
import "../styles/intro.css";

function firstLetter(value) {
  return Array.from(String(value || "").trim())[0]?.toUpperCase() || "";
}

export default function EnvelopeFlapVideoIntro({
  brideName,
  groomName,
  videoSrc,
  details = {},
  onEnter,
  onStartMusic,
  slug,
  script = "latin",

  // =========================
  // LANGUAGE
  // =========================
  language = "sr",
  onLanguageChange,
}) {
  const config = details.envelopeVideoFlow || {};

  /* =====================================================
     LANGUAGE SCREEN
     SAMO ZA ANDJELA & ANDRIJA 5
     ===================================================== */

  const hasLanguageChoice = slug === "andjela-andrija-5";

  /*
    FLOW:

    andjela-andrija-5:
    language
      ↓
    envelope
      ↓
    video
      ↓
    initials
      ↓
    invitation

    svi ostali:
    envelope
      ↓
    video
      ↓
    initials
      ↓
    invitation
  */

  const [stage, setStage] = useState(
    hasLanguageChoice ? "language" : "envelope"
  );

  const [videoFinishing, setVideoFinishing] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState(
    language || "sr"
  );

  const videoRef = useRef(null);
  const completedRef = useRef(false);
  const envelopeTimerRef = useRef(null);

  /* =====================================================
     INITIALS
     ===================================================== */

  const brideInitial = useMemo(
    () => config.brideInitial || firstLetter(brideName),
    [brideName, config.brideInitial]
  );

  const groomInitial = useMemo(
    () => config.groomInitial || firstLetter(groomName),
    [groomName, config.groomInitial]
  );

  /* =====================================================
     VIDEO SETTINGS
     ===================================================== */

  const videoMuted = config.videoMuted !== false;

  const initialsDuration = Number.isFinite(config.initialsDuration)
    ? config.initialsDuration
    : 2200;

  const envelopeCutDelay = Number.isFinite(config.envelopeCutDelay)
    ? config.envelopeCutDelay
    : 2400;

  /* =====================================================
     LANGUAGE SYNC
     ===================================================== */

  useEffect(() => {
    if (!language) return;

    setSelectedLanguage(language);
  }, [language]);

  /* =====================================================
     VIDEO PRELOAD
     ===================================================== */

  useEffect(() => {
    if (!videoSrc) {
      return undefined;
    }

    const video = document.createElement("video");

    video.src = videoSrc;
    video.preload = "auto";
    video.muted = videoMuted;
    video.playsInline = true;

    video.load();

    return () => {
      video.removeAttribute("src");
      video.load();
    };
  }, [videoSrc, videoMuted]);

  /* =====================================================
     PLAY VIDEO
     ===================================================== */

  useEffect(() => {
    if (stage !== "video" || !videoRef.current) {
      return;
    }

    const video = videoRef.current;

    video.currentTime = 0;

    const promise = video.play();

    if (promise?.catch) {
      promise.catch((error) => {
        console.error(
          "Intro video nije automatski pokrenut:",
          error
        );
      });
    }
  }, [stage]);

  /* =====================================================
     INITIALS → INVITATION
     ===================================================== */

  useEffect(() => {
    if (stage !== "initials") {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      if (completedRef.current) {
        return;
      }

      completedRef.current = true;
      onEnter?.();
    }, initialsDuration);

    return () => window.clearTimeout(timeout);
  }, [stage, initialsDuration, onEnter]);

  /* =====================================================
     CLEANUP
     ===================================================== */

  useEffect(() => {
    return () => {
      if (envelopeTimerRef.current) {
        window.clearTimeout(envelopeTimerRef.current);
      }
    };
  }, []);

  /* =====================================================
     LANGUAGE SELECT
     ===================================================== */

  const handleLanguageSelect = (nextLanguage) => {
    setSelectedLanguage(nextLanguage);

    onLanguageChange?.(nextLanguage);

    // Nakon izbora jezika prikazujemo kovertu.
    setStage("envelope");
  };

  /* =====================================================
     ENVELOPE → VIDEO
     ===================================================== */

  const handleEnvelopeReveal = () => {
    if (envelopeTimerRef.current) {
      window.clearTimeout(envelopeTimerRef.current);
    }

    /*
      Koverta dobije dovoljno vremena da završi animaciju.

      Nakon toga:
      ako imamo video -> video
      ako nema videa -> initials
    */

    envelopeTimerRef.current = window.setTimeout(() => {
      setVideoFinishing(false);

      setStage(videoSrc ? "video" : "initials");
    }, envelopeCutDelay);
  };

  /* =====================================================
     VIDEO FADE BEFORE END
     ===================================================== */

  const handleVideoTimeUpdate = (event) => {
    const video = event.currentTarget;

    if (
      !Number.isFinite(video.duration) ||
      video.duration <= 0
    ) {
      return;
    }

    const fadeBeforeEnd = Number.isFinite(
      config.videoFadeBeforeEnd
    )
      ? config.videoFadeBeforeEnd
      : 0.8;

    if (
      video.duration - video.currentTime <=
      fadeBeforeEnd
    ) {
      setVideoFinishing(true);
    }
  };

  /* =====================================================
     VIDEO → INITIALS
     ===================================================== */

  const handleVideoFinished = () => {
    setStage("initials");
  };

  /* =====================================================
     RENDER
     ===================================================== */

  return (
    <div
      className={`efv-intro ${
        hasLanguageChoice
          ? "efv-intro-has-language"
          : ""
      }`}
      data-language={selectedLanguage}
      style={{
        "--efv-video-fit": config.videoFit || "cover",
        "--efv-video-position":
          config.videoPosition || "center center",
        "--efv-initials-bg":
          config.initialsBackground || "#000000",
        "--efv-initials-color":
          config.initialsColor || "#ffffff",
        "--efv-slash-color":
          config.slashColor ||
          config.initialsColor ||
          "#ffffff",
        "--efv-initials-duration": `${initialsDuration}ms`,
      }}
    >
      {/* =================================================
          LANGUAGE SCREEN
          SAMO ANDJELA & ANDRIJA 5
          ================================================= */}

      {stage === "language" && (
        <section
          className="efv-language-screen"
          aria-label="Izbor jezika"
        >
          <div className="efv-language-frame-wrap">
            <img
              src="/images/save-the-date/stitched-oval-language.png"
              alt=""
              className="efv-language-frame"
              aria-hidden="true"
            />

            <div className="efv-language-inner">
              {/* ================================
                  MONOGRAM
                  ================================= */}

              <div
                className="efv-language-monogram"
                aria-hidden="true"
              >
                <span>{brideInitial}</span>

                <span className="efv-language-monogram-divider">
                  /
                </span>

                <span>{groomInitial}</span>
              </div>

              {/* ================================
                  NAMES
                  ================================= */}

              <h1 className="efv-language-names">
                <span>{brideName}</span>

                <span className="efv-language-amp">
                  &
                </span>

                <span>{groomName}</span>
              </h1>

              <div className="efv-language-divider" />

              {/* ================================
                  TEXT
                  ================================= */}

              <div className="efv-language-copy">
                <p className="efv-language-copy-sr">
                  Odaberite jezik
                </p>

                <p className="efv-language-copy-de">
                  Sprache wählen
                </p>
              </div>

              {/* ================================
                  BUTTONS
                  ================================= */}

              <div className="efv-language-buttons">
                <button
                  type="button"
                  className="efv-language-button"
                  onClick={() =>
                    handleLanguageSelect("sr")
                  }
                >
                  <span className="efv-language-button-main">
                    SRPSKI
                  </span>
                </button>

                <button
                  type="button"
                  className="efv-language-button"
                  onClick={() =>
                    handleLanguageSelect("de")
                  }
                >
                  <span className="efv-language-button-main">
                    DEUTSCH
                  </span>
                </button>
              </div>

              {/* ================================
                  DATE
                  ================================= */}

              <p className="efv-language-footer">
                12 · 09 · 2027
              </p>
            </div>
          </div>
        </section>
      )}

      {/* =================================================
          ENVELOPE
          ================================================= */}

      {stage === "envelope" && (
        <EnvelopeFlapIntro
          onEnter={() => {}}
          onReveal={handleEnvelopeReveal}
          onStartMusic={onStartMusic}
          slug={slug}
          details={details}
          script={script}
          language={selectedLanguage}
          openHint={
            slug === "andjela-andrija-5"
              ? selectedLanguage === "de"
                ? "Tippen, um den Brief zu öffnen"
                : "Dodirnite da otvorite pismo"
              : ""
          }
          openingText={
            slug === "andjela-andrija-5"
              ? selectedLanguage === "de"
                ? "Brief wird geöffnet…"
                : "Otvaramo pismo…"
              : ""
          }
        />
      )}

      {/* =================================================
          VIDEO
          ================================================= */}

      {stage === "video" && (
        <section
          className={`efv-video-screen ${
            videoFinishing
              ? "is-finishing"
              : ""
          }`}
          aria-label="Video uvod pozivnice"
        >
          <video
            ref={videoRef}
            className="efv-video"
            src={videoSrc}
            muted={videoMuted}
            playsInline
            preload="auto"
            onTimeUpdate={handleVideoTimeUpdate}
            onEnded={handleVideoFinished}
            onError={handleVideoFinished}
          />
        </section>
      )}

      {/* =================================================
          INITIALS
          OKVIR SAMO ZA ANDJELA & ANDRIJA 5
          ================================================= */}

      {stage === "initials" && (
        <section
          className={`efv-initials-screen ${
            slug === "andjela-andrija-5"
              ? "efv-initials-screen-framed"
              : ""
          }`}
          aria-label="Inicijali mladenaca"
        >
          {slug === "andjela-andrija-5" ? (
            <div className="efv-initials-frame-wrap">
              <img
                src="/images/save-the-date/stitched-oval-language.png"
                alt=""
                className="efv-initials-frame"
                aria-hidden="true"
                draggable={false}
              />

              <div
                className="efv-initials-mark efv-initials-mark-framed"
                aria-hidden="true"
              >
                <span className="efv-initial efv-initial-bride">
                  {brideInitial}
                </span>

                <span className="efv-slash">
                  /
                </span>

                <span className="efv-initial efv-initial-groom">
                  {groomInitial}
                </span>
              </div>
            </div>
          ) : (
            <div
              className="efv-initials-mark"
              aria-hidden="true"
            >
              <span className="efv-initial efv-initial-bride">
                {brideInitial}
              </span>

              <span className="efv-slash">
                /
              </span>

              <span className="efv-initial efv-initial-groom">
                {groomInitial}
              </span>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
