import { useEffect, useRef, useState } from "react";
import "../styles/intro.css";

// Obe slike zadržavaju isto platno (1024 × 1536),
// uključujući providne delove.
function EnvelopeFlapIntro({
  onEnter,
  onReveal,
  onStartMusic,
  slug,

  details = {},
  script = "latin",
  language = "sr",

  openHint = "",
  openingText = "",
}) {
  const config = details.envelopeFlap || {};

  // Svaki slug koristi svoje slike.
  const topImage = `/images/envelope/${slug}-top.png`;
  const bottomImage = `/images/envelope/${slug}-bottom.png`;

  // Procenat visine cele slike na kome počinje pregib.
  const hinge = Number.isFinite(config.hingePercent)
    ? config.hingePercent
    : 0;

  const [assets, setAssets] = useState("loading");
  const [phase, setPhase] = useState("closed");

  const openedRef = useRef(false);
  const finishedRef = useRef(false);

  const cyrillic = script === "cyrillic";
  const hidden = phase === "hidden";

  /* =========================================================
     PRELOAD ASSETS
     ========================================================= */

  useEffect(() => {
    let active = true;
    let loaded = 0;

    setAssets("loading");
    setPhase("closed");

    openedRef.current = false;
    finishedRef.current = false;

    const images = [bottomImage, topImage].map((src) => {
      const img = new Image();

      img.onload = () => {
        loaded += 1;

        if (active && loaded === 2) {
          setAssets("ready");
        }
      };

      img.onerror = () => {
        if (active) {
          setAssets("error");
        }
      };

      img.src = src;

      return img;
    });

    // Omogućava ulazak i ako učitavanje slika zastane.
    const timeout = setTimeout(() => {
      if (active && loaded !== 2) {
        setAssets("error");
      }
    }, 12000);

    return () => {
      active = false;

      clearTimeout(timeout);

      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [topImage, bottomImage]);

  /* =========================================================
     LOCK SCROLL DOK JE INTRO AKTIVAN
     ========================================================= */

  useEffect(() => {
    if (hidden) return undefined;

    const bodyOverflow = document.body.style.overflow;
    const htmlOverflow =
      document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = htmlOverflow;
    };
  }, [hidden]);

  /* =========================================================
     OPEN
     ========================================================= */

  const open = () => {
    if (
      openedRef.current ||
      assets === "loading"
    ) {
      return;
    }

    openedRef.current = true;

    // Muzika se pokreće direktno na klik zbog mobilnih browsera.
    onStartMusic?.();

    // Parent dobija signal da je otvaranje počelo.
    onReveal?.();

    if (assets === "error") {
      setPhase("fading");
    } else {
      setPhase("opening");
    }
  };

  /* =========================================================
     FLAP ANIMATION FINISHED
     ========================================================= */

  const reveal = (event) => {
    if (
      event.target !== event.currentTarget ||
      event.animationName !== "efi-open-flap"
    ) {
      return;
    }

    // Rotacija je završena — uklanjamo ostatak intro sloja.
    setPhase("fading");
  };

  /* =========================================================
     INTRO FINISHED
     ========================================================= */

  const finish = (event) => {
    if (
      event.target !== event.currentTarget ||
      event.animationName !== "efi-fade-out" ||
      finishedRef.current
    ) {
      return;
    }

    finishedRef.current = true;

    setPhase("hidden");

    onEnter?.();
  };

  /* =========================================================
     HIDDEN
     ========================================================= */

  if (hidden) return null;

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <section
      className={`efi-overlay efi-${phase}`}
      aria-label={
        language === "de"
          ? "Brief öffnen"
          : cyrillic
            ? "Отварање позивнице"
            : "Otvaranje pozivnice"
      }
      onAnimationEnd={finish}
    >
      {/* =====================================================
          ENVELOPE
          ===================================================== */}

      <div
        className="efi-viewport"
        aria-hidden="true"
      >
        {assets === "ready" && (
          <div
            className="efi-canvas"
            style={{
              "--efi-hinge": `${hinge}%`,
              "--efi-top-image": `url(${JSON.stringify(
                topImage
              )})`,
            }}
          >
            <img
              className="efi-bottom"
              src={bottomImage}
              alt=""
              draggable={false}
            />

            <div className="efi-shadow" />

            <div
              className="efi-flap"
              onAnimationEnd={reveal}
            >
              <img
                className="efi-front"
                src={topImage}
                alt=""
                draggable={false}
              />
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          CLICK / TAP AREA
          ===================================================== */}

      <button
        className="efi-open-button"
        type="button"
        onClick={open}
        disabled={
          assets === "loading" ||
          phase !== "closed"
        }
        aria-label={
          language === "de"
            ? "Brief öffnen"
            : cyrillic
              ? "Отвори позивницу"
              : "Otvori pozivnicu"
        }
      >
        {/* ===================================================
            BOJANA & VASILIJE
            POSTOJEĆE — OSTAVLJENO
            =================================================== */}

        {slug === "bojana-vasilije" &&
          phase === "closed" && (
            <span
              className="efi-bojana-open-hint"
              aria-hidden="true"
            >
              <span className="efi-bojana-open-hint-sr">
                Кликните да отворите писмо
              </span>

              <span className="efi-bojana-open-hint-en">
                Click to open the letter
              </span>
            </span>
          )}

        {/* ===================================================
            GENERIC OPEN HINT
            npr. ANDJELA & ANDRIJA 5
            =================================================== */}

        {openHint &&
          phase === "closed" && (
            <span
              className="efi-andjela-open-hint"
              aria-hidden="true"
            >
              {openHint}
            </span>
          )}
      </button>

      {/* =====================================================
          TEXT DOK SE KOVERTA OTVARA
          ===================================================== */}

      {openingText &&
        phase === "opening" && (
          <div
            className="efi-andjela-opening-text"
            aria-hidden="true"
          >
            {openingText}
          </div>
        )}
    </section>
  );
}

export default EnvelopeFlapIntro;