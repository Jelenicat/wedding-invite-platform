
import { useEffect, useRef, useState } from "react";
import "../styles/intro.css";

const clamp = (value, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const smoothstep = (value) => value * value * (3 - 2 * value);

function firstLetter(value) {
  return Array.from(String(value || "").trim())[0]?.toUpperCase() || "";
}

function formatDate(value) {
  const text = String(value || "").trim();

  const match = text.match(
    /^(\d{1,2})\s*[./-]\s*(\d{1,2})\s*[./-]\s*(\d{4})\.?$/
  );

  if (!match) return text;

  return `${match[1].padStart(2, "0")} · ${match[2].padStart(2, "0")} · ${match[3]}`;
}

export default function PhotoZoomIntro({
  slug,
  brideName,
  groomName,
  weddingDate,
  backgroundImage,
  image,
  details = {},
  script = "latin",
  onEnter,
}) {
  const config = details.photoZoomIntro || {};

  const introRef = useRef(null);
  const sceneRef = useRef(null);
  const canEnterRef = useRef(false);
  const enteringRef = useRef(false);

  const [canEnter, setCanEnter] = useState(false);

  /* =====================================================
     IMAGE CONFIGURATION
  ===================================================== */

  const imageSrc =
    config.imageSrc ||
    image ||
    backgroundImage ||
    "/images/photo-zoom-demo.png";

  const zoomValue = Number(config.initialZoom);

  const initialZoom = Number.isFinite(zoomValue)
    ? clamp(zoomValue, 1, 4)
    : 2.7;

  /* =====================================================
     NAMES
  ===================================================== */

  const longestName = Math.max(
    Array.from(String(brideName || "")).length,
    Array.from(String(groomName || "")).length,
    1
  );

  const namesScale = Math.min(1, 6.8 / longestName);

  const photoPosition = config.photoPosition || "50% 43%";

  const dateText =
    config.dateText || formatDate(weddingDate || details.date);

  /* =====================================================
     LANGUAGE
  ===================================================== */

  const t =
    script === "cyrillic"
      ? {
          invitation: "Позивница за венчање",
          open: "Погледај позивницу",
          instruction:
            "Померите страницу надоле да откријете фотографију и погледате позивницу.",
        }
      : {
          invitation: "Pozivnica za venčanje",
          open: "Pogledaj pozivnicu",
          instruction:
            "Pomerite stranicu nadole da otkrijete fotografiju i pogledate pozivnicu.",
        };

  /* =====================================================
     SCROLL ZOOM ANIMATION
  ===================================================== */

  useEffect(() => {
    const intro = introRef.current;
    const scene = sceneRef.current;

    if (!intro || !scene) return undefined;

    let frame = 0;
    let start = 0;
    let travel = 1;

    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const previousRestoration =
      window.history.scrollRestoration;

    const previousScrollBehavior =
      document.documentElement.style.scrollBehavior;

    /* =====================================================
       RESET SCROLL POSITION
    ===================================================== */

    window.history.scrollRestoration = "manual";

    document.documentElement.style.scrollBehavior = "auto";

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });

    document.documentElement.style.scrollBehavior =
      previousScrollBehavior;

    canEnterRef.current = false;
    enteringRef.current = false;

    setCanEnter(false);

    /* =====================================================
       RENDER ANIMATION
    ===================================================== */

    function render() {
      frame = 0;

      const progress = clamp(
        (window.scrollY - start) / travel
      );

      const reveal = smoothstep(
        clamp(progress / 0.9)
      );

      const reducedMotion = motionQuery.matches;

      /* PHOTO ZOOM */

      intro.style.setProperty(
        "--pz-zoom",
        String(
          reducedMotion
            ? 1
            : initialZoom - (initialZoom - 1) * reveal
        )
      );

      /* NAMES OPACITY */

      intro.style.setProperty(
        "--pz-names-opacity",
        String(
          reducedMotion
            ? 1
            : 1 -
                0.84 *
                  smoothstep(
                    clamp((progress - 0.73) / 0.27)
                  )
        )
      );

      /* NAMES POSITION */

      intro.style.setProperty(
        "--pz-names-shift",
        `${reducedMotion ? 0 : -22 * reveal}px`
      );

      /* SCROLL ARROW */

      intro.style.setProperty(
        "--pz-hint-opacity",
        String(
          1 -
            smoothstep(
              clamp((progress - 0.65) / 0.25)
            )
        )
      );

      /* =====================================================
         SHOW BUTTON WHEN ZOOM IS FINISHED
      ===================================================== */

      const visible = progress >= 0.9;

      if (canEnterRef.current !== visible) {
        canEnterRef.current = visible;
        setCanEnter(visible);
      }
    }

    /* =====================================================
       ANIMATION FRAME
    ===================================================== */

    function schedule() {
      if (!frame) {
        frame = window.requestAnimationFrame(render);
      }
    }

    /* =====================================================
       MEASURE SCROLL DISTANCE
    ===================================================== */

    function measure() {
      start =
        intro.getBoundingClientRect().top +
        window.scrollY;

      travel = Math.max(
        1,
        intro.offsetHeight - scene.offsetHeight
      );

      schedule();
    }

    /* =====================================================
       EVENT LISTENERS
    ===================================================== */

    window.addEventListener("scroll", schedule, {
      passive: true,
    });

    window.addEventListener("resize", measure, {
      passive: true,
    });

    window.addEventListener("pageshow", measure);

    window.visualViewport?.addEventListener(
      "resize",
      measure,
      { passive: true }
    );

    motionQuery.addEventListener("change", schedule);

    /* =====================================================
       RESIZE OBSERVER
    ===================================================== */

    const observer =
      typeof ResizeObserver === "function"
        ? new ResizeObserver(measure)
        : null;

    observer?.observe(intro);
    observer?.observe(scene);

    measure();

    /* =====================================================
       CLEANUP
    ===================================================== */

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pageshow", measure);

      window.visualViewport?.removeEventListener(
        "resize",
        measure
      );

      motionQuery.removeEventListener("change", schedule);

      observer?.disconnect();

      window.history.scrollRestoration =
        previousRestoration;
    };
  }, [slug, imageSrc, initialZoom]);

  /* =====================================================
     OPEN INVITATION
  ===================================================== */

  function handleEnter() {
    if (
      !canEnterRef.current ||
      enteringRef.current
    ) {
      return;
    }

    enteringRef.current = true;

    // WeddingPage otvara karticu i pokreće muziku.
    onEnter?.();
  }

  /* =====================================================
     JSX
  ===================================================== */

  return (
    <section
      ref={introRef}
      className="photo-zoom-intro"
      data-script={script}
      aria-label={`${brideName || ""} i ${
        groomName || ""
      } — ${t.invitation}`}
      style={{
        "--pz-initial-zoom": initialZoom,
        "--pz-photo-position": photoPosition,
        "--pz-photo-filter":
          config.blackAndWhite === false
            ? "none"
            : "grayscale(1)",
        "--pz-names-scale": namesScale,
      }}
    >
      <div
        ref={sceneRef}
        className="photo-zoom-intro__scene"
      >
        {/* =================================================
            BACKGROUND PHOTO
        ================================================= */}

        <div
          className="photo-zoom-intro__photo"
          aria-hidden="true"
        >
          <img
            src={imageSrc}
            alt=""
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </div>

        {/* =================================================
            OVERLAY
        ================================================= */}

        <div
          className="photo-zoom-intro__shade"
          aria-hidden="true"
        />

        {/* =================================================
            MONOGRAM
        ================================================= */}

        <p
          className="photo-zoom-intro__monogram"
          aria-hidden="true"
        >
          {firstLetter(brideName)}
          <span>&amp;</span>
          {firstLetter(groomName)}
        </p>

        {/* =================================================
            INVITATION LABEL
        ================================================= */}

        <p className="photo-zoom-intro__eyebrow">
          {config.eyebrow || t.invitation}
        </p>

        {/* =================================================
            BRIDE AND GROOM NAMES
        ================================================= */}

        <div className="photo-zoom-intro__copy">
          <h1 className="photo-zoom-intro__names">
            <span className="photo-zoom-intro__name">
              {brideName}
            </span>

            <span className="photo-zoom-intro__amp">
              &amp;
            </span>

            <span className="photo-zoom-intro__name">
              {groomName}
            </span>
          </h1>

          {/* WEDDING DATE */}

          {dateText && (
            <p className="photo-zoom-intro__date">
              {dateText}
            </p>
          )}
        </div>

        {/* =================================================
            BOTTOM ACTIONS
        ================================================= */}

        <div className="photo-zoom-intro__actions">
          {/* OPEN INVITATION BUTTON */}

          <button
            type="button"
            className={`photo-zoom-intro__enter${
              canEnter ? " is-visible" : ""
            }`}
            disabled={!canEnter}
            aria-hidden={!canEnter}
            tabIndex={canEnter ? 0 : -1}
            onClick={handleEnter}
          >
            {config.buttonText || t.open}
          </button>

          {/* SCROLL ARROW */}

          <div
            className="photo-zoom-intro__cue"
            aria-hidden="true"
          >
            <svg
              className="photo-zoom-intro__arrow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.15"
              strokeLinecap="round"
              strokeLinejoin="round"
              focusable="false"
            >
              <path d="M12 4v15M6 13l6 6 6-6" />
            </svg>
          </div>
        </div>

        {/* =================================================
            ACCESSIBILITY TEXT
        ================================================= */}

        <p className="photo-zoom-intro__sr-only">
          {t.instruction}
        </p>
      </div>
    </section>
  );
}
