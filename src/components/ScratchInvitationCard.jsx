import { useEffect, useId, useRef, useState } from "react";
import EnvelopeFlapRSVP from "./EnvelopeFlapRSVP";
import EnvelopeFlapCountdown from "./EnvelopeFlapCountdown";

import "../styles/card.css";
import "../styles/rsvp.css";

const COPY = {
  sr: {
    invitation: "Pozivnica za venčanje",
    together: "Slavimo ljubav",
    scratch: "Prevucite prstom preko kruga",
    reveal: "Otkrij fotografiju",
    photo: "Fotografija mladenaca",
    unavailable: "Fotografija trenutno nije dostupna.",
    continue: "Pogledaj pozivnicu",
    loading: "Učitavanje fotografije…",
    details: "Detalji proslave",
    timeline: "Naš dan",
    location: "Pogledaj lokaciju",
    dress: "Dress code",
    women: "Dame",
    men: "Gospoda",
    language: "Izbor jezika",
    revealed:
      "Fotografija je otkrivena. Pozivnica je sada dostupna.",
  },

  cyrillic: {
    invitation: "Позивница за венчање",
    together: "Славимо љубав",
    scratch: "Превуците прстом преко круга",
    reveal: "Откриј фотографију",
    photo: "Фотографија младенаца",
    unavailable: "Фотографија тренутно није доступна.",
    continue: "Погледај позивницу",
    loading: "Учитавање фотографије…",
    details: "Детаљи прославе",
    timeline: "Наш дан",
    location: "Погледај локацију",
    dress: "Дрес код",
    women: "Даме",
    men: "Господа",
    language: "Избор језика",
    revealed:
      "Фотографија је откривена. Позивница је сада доступна.",
  },

  en: {
    invitation: "Wedding invitation",
    together: "A celebration of love",
    scratch: "Gently rub the circle to reveal",
    reveal: "Reveal photograph",
    photo: "Photograph of the couple",
    unavailable: "The photograph is currently unavailable.",
    continue: "View invitation",
    loading: "Loading photograph…",
    details: "Wedding details",
    timeline: "Our wedding day",
    location: "View location",
    dress: "Dress code",
    women: "Ladies",
    men: "Gentlemen",
    language: "Choose language",
    revealed:
      "Photograph revealed. The invitation is now available.",
  },
};

/* ============================================================
   EMBOSSED FRAME
============================================================ */

function EmbossedFrame() {
  const outer =
    "M44 12 H316 Q316 28 332 28 H348 V632 H332 Q316 632 316 648 H44 Q44 632 28 632 H12 V28 H28 Q44 28 44 12 Z";

  const inner =
    "M49 20 H311 Q313 36 332 36 H340 V624 H332 Q313 624 311 640 H49 Q47 624 28 624 H20 V36 H28 Q47 36 49 20 Z";

  return (
    <svg
      className="sci-frame"
      viewBox="0 0 360 660"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {[outer, inner].map((d, index) => (
        <g
          key={index}
          fill="none"
          strokeWidth="1.15"
        >
          <path
            d={d}
            className="sci-frame-shadow"
            transform="translate(0.7 0.9)"
            vectorEffect="non-scaling-stroke"
          />

          <path
            d={d}
            className="sci-frame-light"
            transform="translate(-0.7 -0.9)"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      ))}
    </svg>
  );
}

/* ============================================================
   SNOW
============================================================ */

const SNOW_FLAKES = [
  {
    left: "6%",
    size: "4px",
    duration: "2.15s",
    delay: "0s",
    drift: "-14px",
  },
  {
    left: "13%",
    size: "6px",
    duration: "2.5s",
    delay: "0.08s",
    drift: "11px",
  },
  {
    left: "21%",
    size: "3px",
    duration: "2.25s",
    delay: "0.18s",
    drift: "-9px",
  },
  {
    left: "29%",
    size: "7px",
    duration: "2.65s",
    delay: "0.03s",
    drift: "15px",
  },
  {
    left: "37%",
    size: "4px",
    duration: "2.35s",
    delay: "0.24s",
    drift: "-12px",
  },
  {
    left: "44%",
    size: "5px",
    duration: "2.55s",
    delay: "0.12s",
    drift: "8px",
  },
  {
    left: "51%",
    size: "3px",
    duration: "2.2s",
    delay: "0.3s",
    drift: "-8px",
  },
  {
    left: "58%",
    size: "7px",
    duration: "2.7s",
    delay: "0.05s",
    drift: "13px",
  },
  {
    left: "65%",
    size: "4px",
    duration: "2.3s",
    delay: "0.17s",
    drift: "-13px",
  },
  {
    left: "72%",
    size: "6px",
    duration: "2.55s",
    delay: "0.26s",
    drift: "10px",
  },
  {
    left: "79%",
    size: "3px",
    duration: "2.2s",
    delay: "0.1s",
    drift: "-7px",
  },
  {
    left: "86%",
    size: "5px",
    duration: "2.45s",
    delay: "0.2s",
    drift: "12px",
  },
  {
    left: "93%",
    size: "4px",
    duration: "2.3s",
    delay: "0.04s",
    drift: "-10px",
  },
  {
    left: "18%",
    size: "4px",
    duration: "2.75s",
    delay: "0.36s",
    drift: "12px",
  },
  {
    left: "33%",
    size: "5px",
    duration: "2.55s",
    delay: "0.42s",
    drift: "-13px",
  },
  {
    left: "48%",
    size: "6px",
    duration: "2.8s",
    delay: "0.32s",
    drift: "10px",
  },
  {
    left: "63%",
    size: "3px",
    duration: "2.45s",
    delay: "0.48s",
    drift: "-8px",
  },
  {
    left: "82%",
    size: "5px",
    duration: "2.7s",
    delay: "0.38s",
    drift: "9px",
  },
];

function SnowOverlay({ active }) {
  if (!active) return null;

  return (
    <div
      className="sci-snow-overlay"
      aria-hidden="true"
    >
      {SNOW_FLAKES.map((flake, index) => (
        <span
          key={index}
          className="sci-snow-flake"
          style={{
            "--snow-left": flake.left,
            "--snow-size": flake.size,
            "--snow-duration": flake.duration,
            "--snow-delay": flake.delay,
            "--snow-drift": flake.drift,
          }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   SCRATCH PHOTO
============================================================ */

function ScratchPhoto({
  src,
  paper,
  t,
  revealed,
  onReveal,
  showSnow,
}) {
  const canvasRef = useRef(null);

  const drawingRef = useRef({
    pointer: null,
    previous: null,
  });

  const completedRef = useRef(false);
  const lastCheckRef = useRef(0);

  const [status, setStatus] =
    useState("loading");

  const [canvasReady, setCanvasReady] =
    useState(false);

  const helpId = useId();

  /* ============================================================
     LOAD IMAGE
  ============================================================ */

  useEffect(() => {
    let active = true;

    setStatus("loading");

    const image = new Image();

    const timeout = setTimeout(() => {
      if (active) {
        setStatus("error");
      }
    }, 12000);

    image.onload = () => {
      clearTimeout(timeout);

      if (active) {
        setStatus("ready");
      }
    };

    image.onerror = () => {
      clearTimeout(timeout);

      if (active) {
        setStatus("error");
      }
    };

    image.src = src;

    return () => {
      active = false;

      clearTimeout(timeout);

      image.onload = null;
      image.onerror = null;
    };
  }, [src]);

  /* ============================================================
     CANVAS
  ============================================================ */

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    let initialized = false;

    const resize = () => {
      const rect =
        canvas.getBoundingClientRect();

      if (!rect.width || !rect.height) {
        return;
      }

      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2,
      );

      const width = Math.round(
        rect.width * dpr,
      );

      const height = Math.round(
        rect.height * dpr,
      );

      if (
        initialized &&
        canvas.width === width &&
        canvas.height === height
      ) {
        return;
      }

      const previous =
        document.createElement("canvas");

      if (initialized) {
        previous.width = canvas.width;
        previous.height = canvas.height;

        previous
          .getContext("2d")
          .drawImage(canvas, 0, 0);
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext(
        "2d",
        {
          willReadFrequently: true,
        },
      );

      if (!ctx) {
        return;
      }

      if (initialized) {
        ctx.drawImage(
          previous,
          0,
          0,
          width,
          height,
        );
      } else {
        ctx.fillStyle = paper;

        ctx.fillRect(
          0,
          0,
          width,
          height,
        );

        let seed = 73;

        const random = () => {
          seed =
            (seed * 16807) %
            2147483647;

          return seed / 2147483647;
        };

        for (
          let i = 0;
          i < width * height / 12;
          i += 1
        ) {
          ctx.fillStyle =
            i % 2
              ? "rgba(255,255,255,0.22)"
              : "rgba(105,97,88,0.035)";

          ctx.fillRect(
            random() * width,
            random() * height,
            dpr,
            dpr,
          );
        }

        initialized = true;
      }

      drawingRef.current = {
        pointer: null,
        previous: null,
      };

      setCanvasReady(true);
    };

    resize();

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(resize)
        : null;

    observer?.observe(canvas);

    window.addEventListener(
      "resize",
      resize,
    );

    return () => {
      observer?.disconnect();

      window.removeEventListener(
        "resize",
        resize,
      );
    };
  }, [paper]);

  /* ============================================================
     COMPLETE
  ============================================================ */

  const complete = () => {
    if (completedRef.current) {
      return;
    }

    completedRef.current = true;

    drawingRef.current = {
      pointer: null,
      previous: null,
    };

    onReveal();
  };

  /* ============================================================
     CHECK COVERAGE
  ============================================================ */

  const checkCoverage = () => {
    const canvas = canvasRef.current;

    const ctx =
      canvas?.getContext("2d", {
        willReadFrequently: true,
      });

    if (
      !ctx ||
      completedRef.current
    ) {
      return;
    }

    const { width, height } = canvas;

    const pixels =
      ctx.getImageData(
        0,
        0,
        width,
        height,
      ).data;

    let total = 0;
    let cleared = 0;

    for (
      let y = 0;
      y < height;
      y += 6
    ) {
      for (
        let x = 0;
        x < width;
        x += 6
      ) {
        const insideCircle =
          ((x - width / 2) /
            (width / 2)) **
            2 +
            ((y - height / 2) /
              (height / 2)) **
              2 <=
          1;

        if (!insideCircle) {
          continue;
        }

        total += 1;

        if (
          pixels[
            (y * width + x) * 4 + 3
          ] < 100
        ) {
          cleared += 1;
        }
      }
    }

    if (
      total &&
      cleared / total >= 0.48
    ) {
      complete();
    }
  };

  /* ============================================================
     DRAW
  ============================================================ */

  const draw = (event) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx =
      canvas.getContext("2d", {
        willReadFrequently: true,
      });

    if (!ctx) {
      return;
    }

    const rect =
      canvas.getBoundingClientRect();

    const point = {
      x:
        (event.clientX - rect.left) *
        canvas.width /
        rect.width,

      y:
        (event.clientY - rect.top) *
        canvas.height /
        rect.height,
    };

    const previous =
      drawingRef.current.previous ||
      point;

    ctx.globalCompositeOperation =
      "destination-out";

    ctx.lineWidth =
      canvas.width * 0.17;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();

    ctx.moveTo(
      previous.x,
      previous.y,
    );

    ctx.lineTo(
      point.x,
      point.y,
    );

    ctx.stroke();

    ctx.beginPath();

    ctx.arc(
      point.x,
      point.y,
      ctx.lineWidth / 2,
      0,
      Math.PI * 2,
    );

    ctx.fill();

    drawingRef.current.previous =
      point;
  };

  /* ============================================================
     POINTER — MOBILE SCROLL FIX
  ============================================================ */

  const start = (event) => {
    if (
      !canvasReady ||
      status !== "ready" ||
      revealed ||
      completedRef.current ||
      drawingRef.current.pointer !== null
    ) {
      return;
    }

    if (
      event.pointerType === "mouse" &&
      event.button !== 0
    ) {
      return;
    }

    /*
      Kada je korisnik stvarno počeo da grebe,
      browser ne sme da pretvori pokret u scroll.
    */
    event.preventDefault();

    drawingRef.current.pointer =
      event.pointerId;

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );

    draw(event);
  };

  const move = (event) => {
    if (
      drawingRef.current.pointer !==
        event.pointerId ||
      completedRef.current
    ) {
      return;
    }

    /*
      Blokiramo scroll SAMO dok traje aktivno grebanje.
    */
    event.preventDefault();

    draw(event);

    if (
      event.timeStamp -
        lastCheckRef.current >
      120
    ) {
      lastCheckRef.current =
        event.timeStamp;

      checkCoverage();
    }
  };

  const stop = (event) => {
    if (
      drawingRef.current.pointer !==
      event.pointerId
    ) {
      return;
    }

    event.preventDefault();

    drawingRef.current = {
      pointer: null,
      previous: null,
    };

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId,
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    }

    checkCoverage();
  };

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div
      className={`sci-photo-area ${
        revealed ? "is-revealed" : ""
      }`}
    >
      <div className="sci-photo-ring">
        <div className="sci-photo-window">
          {status === "ready" && (
            <img
              className="sci-photo"
              src={src}
              alt={
                revealed
                  ? t.photo
                  : ""
              }
              draggable={false}
            />
          )}

          <canvas
            className="sci-scratch-canvas"
            ref={canvasRef}
            aria-hidden="true"
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={stop}
            onPointerCancel={stop}
            onLostPointerCapture={() => {
              drawingRef.current = {
                pointer: null,
                previous: null,
              };
            }}
          />

          <SnowOverlay
            active={showSnow}
          />

          {status === "error" && (
            <p className="sci-photo-error">
              {t.unavailable}
            </p>
          )}
        </div>
      </div>

      {!revealed && (
        <div className="sci-scratch-help">
          <p id={helpId}>
            {status === "loading"
              ? t.loading
              : status === "error"
                ? t.unavailable
                : t.scratch}
          </p>

          <button
            type="button"
            className={`sci-reveal-button ${
              status === "error"
                ? "sci-reveal-fallback"
                : ""
            }`}
            onClick={complete}
            aria-describedby={helpId}
          >
            {status === "ready"
              ? t.reveal
              : t.continue}
          </button>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   MAIN CONTENT
============================================================ */

function ScratchCardContent({
  brideName = "",
  groomName = "",
  weddingDate,
  details = {},
  image,
  slug,
  type = "wedding",
  script = "latin",
  language = "sr",
  onLanguageChange,
}) {
  const [revealed, setRevealed] =
    useState(false);

  const [showSnow, setShowSnow] =
    useState(false);

  const sectionId = useId();

  const activeLanguage =
    language === "en"
      ? "en"
      : "sr";

  const t =
    COPY[
      activeLanguage === "en"
        ? "en"
        : script === "cyrillic"
          ? "cyrillic"
          : "sr"
    ];

  const paper =
    details.cardBackground ||
    "#f3f2f2";

  const photo =
    image ||
    `/images/invitations/${slug}.jpg`;

  const events = (
    details.events || []
  ).filter(
    (event) =>
      event.label ||
      event.time,
  );

  /* ============================================================
     SNOW TRAJE KRATKO
  ============================================================ */

  useEffect(() => {
    if (!showSnow) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setShowSnow(false);
    }, 3200);

    return () => {
      clearTimeout(timer);
    };
  }, [showSnow]);

  /* ============================================================
     REVEAL
  ============================================================ */

  const handleReveal = () => {
    setRevealed(true);
    setShowSnow(true);
  };

  return (
 <div
  className={`sci-root ${
    revealed
      ? "sci-revealed"
      : ""
  } ${
    slug === "bojana-vasilije"
      ? "sci-bojana-vasilije"
      : ""
  }`}
  lang={activeLanguage}
  style={{
    "--sci-paper": paper,
  }}
>
      {/* ======================================================
          HERO
      ====================================================== */}

      <section
        className="sci-hero"
        aria-label={t.invitation}
      >
        {/* LANGUAGE */}

        <div
          className="sci-language"
          role="group"
          aria-label={t.language}
        >
          {["sr", "en"].map(
            (value) => (
              <button
                key={value}
                type="button"
                lang={value}
                aria-label={
                  value === "sr"
                    ? "Srpski"
                    : "English"
                }
                aria-pressed={
                  activeLanguage ===
                  value
                }
                onClick={() =>
                  onLanguageChange?.(
                    value,
                  )
                }
              >
                {value.toUpperCase()}
              </button>
            ),
          )}
        </div>

        {/* PAPER */}

        <div className="sci-paper-panel">
          <EmbossedFrame />

          {/* HEADING */}

          <header
            className="sci-heading sci-reveal-text"
            aria-hidden={!revealed}
          >
            <p className="sci-kicker">
              {t.invitation}
            </p>

            <h1
              className={`sci-names ${
                script ===
                  "cyrillic" &&
                activeLanguage !== "en"
                  ? "sci-cyrillic"
                  : ""
              }`}
            >
              <span>
                {brideName}
              </span>

              <span className="sci-amp">
                &
              </span>

              <span>
                {groomName}
              </span>
            </h1>
          </header>

          {/* SCRATCH */}

          <ScratchPhoto
            key={photo}
            src={photo}
            paper={paper}
            t={t}
            revealed={revealed}
            showSnow={showSnow}
            onReveal={
              handleReveal
            }
          />

          {/* FOOTER */}

          <div
            className="sci-hero-footer sci-reveal-text"
            aria-hidden={!revealed}
          >
            <p className="sci-together">
              {t.together}
            </p>

            <p className="sci-date">
              {details.date ||
                weddingDate}
            </p>

            {revealed && (
              <a
                className="sci-details-link"
                href={`#${sectionId}`}
              >
                {t.details}

                <span aria-hidden="true">
                  ↓
                </span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* SCREEN READER STATUS */}

      <p
        className="sci-sr-only"
        role="status"
      >
        {revealed
          ? t.revealed
          : ""}
      </p>

      {/* ======================================================
          CONTENT POSLE REVEAL-A
      ====================================================== */}

      {revealed && (
        <div
          className="sci-revealed-content"
          id={sectionId}
        >
          <section className="sci-details-section">

            {/* WELCOME */}

            {details.welcomeText && (
              <p className="sci-welcome">
                {
                  details.welcomeText
                }
              </p>
            )}

            {/* EVENTS */}

            {events.length > 0 && (
              <div className="sci-program">
                <h2 className="sci-section-title">
                  {t.timeline}
                </h2>

                {events.map(
                  (event, index) => (
                    <div
                      className="sci-event"
                      key={index}
                    >
                      <p className="sci-event-time">
                        {event.time}
                      </p>

                      <div className="sci-event-info">
                        <h3>
                          {event.label}
                        </h3>

                        {event.location && (
                          <>
                            <p>
                              {
                                event.location
                              }
                            </p>

                            <a
                              className="sci-event-location"
                              href={
                                event.mapLink ||
                                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                  event.location,
                                )}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {
                                t.location
                              }
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}

            {/* DRESS CODE */}

            {details.showDressCode && (
              <div className="sci-dress">
                <p className="sci-kicker">
                  {t.dress}
                </p>

                {details.dressCodeTitle && (
                  <h2>
                    {
                      details.dressCodeTitle
                    }
                  </h2>
                )}

                {details.dressCodeNote && (
                  <p>
                    {
                      details.dressCodeNote
                    }
                  </p>
                )}

                {details.dressCodeWomen && (
                  <p>
                    <strong>
                      {t.women}:{" "}
                    </strong>

                    {
                      details.dressCodeWomen
                    }
                  </p>
                )}

                {details.dressCodeMen && (
                  <p>
                    <strong>
                      {t.men}:{" "}
                    </strong>

                    {
                      details.dressCodeMen
                    }
                  </p>
                )}

                {details
                  .dressCodePalette
                  ?.length > 0 && (
                  <div className="sci-palette">
                    {details.dressCodePalette.map(
                      (
                        color,
                        index,
                      ) => (
                        <span
                          key={
                            index
                          }
                          style={{
                            backgroundColor:
                              color,
                          }}
                          aria-label={
                            color
                          }
                        />
                      ),
                    )}
                  </div>
                )}
              </div>
            )}

            {/* NOTE */}

            {details.note && (
              <p className="sci-note">
                {details.note}
              </p>
            )}
          </section>

          {/* ==================================================
              RSVP + COUNTDOWN
          ================================================== */}

          <div className="sci-followup">
            <EnvelopeFlapRSVP
              slug={slug}
              eventType={type}
              brideName={brideName}
              groomName={groomName}
              details={details}
              script={
                activeLanguage ===
                "en"
                  ? "latin"
                  : script
              }
              language={
                activeLanguage
              }
            />

            {details.dateISO && (
              <EnvelopeFlapCountdown
                targetDate={
                  details.dateISO
                }
                brideName={
                  brideName
                }
                groomName={
                  groomName
                }
                details={details}
                script={
                  activeLanguage ===
                    "en"
                    ? "latin"
                    : script
                }
                slug={slug}
                language={
                  activeLanguage
                }
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   EXPORT
============================================================ */

export default function ScratchInvitationCard(
  props,
) {
  return (
    <ScratchCardContent
      key={props.slug}
      {...props}
    />
  );
}