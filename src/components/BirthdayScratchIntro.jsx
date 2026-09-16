import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { motion } from "framer-motion";

import "../styles/birthdayintro.css";

const COPY = {
  latin: {
    kicker: "Malo srce, velika ljubav",
    scratchHint: "Prevucite prstom preko slike",
    revealedTop: "Jedna mala svećica",
    revealedMain: "velika ljubav",
    revealedBottom: "i najlepša godina iza nas",
    birthdayText: "slavi svoj prvi rođendan",
    open: "Otvori pozivnicu",
    opening: "Otvaramo pozivnicu…",
  },

  cyrillic: {
    kicker: "Мало срце, велика љубав",
    scratchHint: "Превуците прстом преко слике",
    revealedTop: "Једна мала свећица",
    revealedMain: "велика љубав",
    revealedBottom: "и најлепша година иза нас",
    birthdayText: "слави свој први рођендан",
    open: "Отвори позивницу",
    opening: "Отварамо позивницу…",
  },
};

function BirthdayScratchIntro({
  childName,
  brideName,

  scratchImage,
  introScratchImage,

  backgroundImage,

  details = {},

  script = "latin",

  slug,

  onOpen,
  onEnter,

  isOpen = false,

  className = "",
}) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);

  const drawingRef = useRef(false);
  const lastPointRef = useRef(null);
  const openingRef = useRef(isOpen);

  const [ready, setReady] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [opening, setOpening] = useState(isOpen);

  const isCyrillic = [
    "cyrillic",
    "cyr",
    "ćirilica",
    "cirilica",
  ].includes(script);

  const text = isCyrillic
    ? COPY.cyrillic
    : COPY.latin;

  const name =
    childName ||
    brideName ||
    details?.childName ||
    (isCyrillic
      ? "Име"
      : "Ime");

  /* =========================================================
     SLIKA KOJU GREBEMO
  ========================================================= */

  const activeScratchImage =
    details?.scratchImage ||
    introScratchImage ||
    scratchImage ||
    details?.introScratchImage ||
    "";

  /* =========================================================
     POZADINA CELOG INTRO-A
  ========================================================= */

  const activeBackground =
    details?.scratchIntroBackgroundImage ||
    details?.introBackgroundImage ||
    backgroundImage ||
    "";

  /* =========================================================
     OPEN STATE
  ========================================================= */

  useEffect(() => {
    openingRef.current = isOpen;
    setOpening(isOpen);
  }, [isOpen]);

  /* =========================================================
     RESET PO SLUGU
  ========================================================= */

  useEffect(() => {
    setRevealed(false);
    setReady(false);

    drawingRef.current = false;
    lastPointRef.current = null;
  }, [
    slug,
    activeScratchImage,
  ]);

  /* =========================================================
     CRTANJE SLIKE NA CANVAS
  ========================================================= */

  useEffect(() => {
    const canvas =
      canvasRef.current;

    const frame =
      frameRef.current;

    if (
      !canvas ||
      !frame ||
      !activeScratchImage
    ) {
      return undefined;
    }

    let cancelled = false;

    const drawImage = () => {
      if (cancelled) return;

      const rect =
        frame.getBoundingClientRect();

      if (
        !rect.width ||
        !rect.height
      ) {
        return;
      }

      const dpr =
        Math.min(
          window.devicePixelRatio || 1,
          2
        );

      canvas.width =
        Math.max(
          1,
          Math.round(
            rect.width * dpr
          )
        );

      canvas.height =
        Math.max(
          1,
          Math.round(
            rect.height * dpr
          )
        );

      canvas.style.width =
        `${rect.width}px`;

      canvas.style.height =
        `${rect.height}px`;

      const context =
        canvas.getContext(
          "2d",
          {
            willReadFrequently: true,
          }
        );

      if (!context) {
        return;
      }

      const image =
        new Image();

      image.decoding =
        "async";

      image.onload = () => {
        if (cancelled) return;

        context.setTransform(
          1,
          0,
          0,
          1,
          0,
          0
        );

        context.clearRect(
          0,
          0,
          canvas.width,
          canvas.height
        );

        context.setTransform(
          dpr,
          0,
          0,
          dpr,
          0,
          0
        );

        const imageRatio =
          image.width /
          image.height;

        const boxRatio =
          rect.width /
          rect.height;

        let drawWidth;
        let drawHeight;
        let drawX;
        let drawY;

        /* COVER */

        if (
          imageRatio >
          boxRatio
        ) {
          drawHeight =
            rect.height;

          drawWidth =
            drawHeight *
            imageRatio;

          drawX =
            (
              rect.width -
              drawWidth
            ) / 2;

          drawY = 0;
        } else {
          drawWidth =
            rect.width;

          drawHeight =
            drawWidth /
            imageRatio;

          drawX = 0;

          drawY =
            (
              rect.height -
              drawHeight
            ) / 2;
        }

        context.globalCompositeOperation =
          "source-over";

        context.drawImage(
          image,
          drawX,
          drawY,
          drawWidth,
          drawHeight
        );

        setReady(true);
      };

      image.onerror = () => {
        if (cancelled) return;

        console.error(
          "Scratch slika nije učitana:",
          activeScratchImage
        );

        setReady(false);
      };

      image.src =
        activeScratchImage;
    };

    drawImage();

    let observer;

    if (
      typeof ResizeObserver !==
      "undefined"
    ) {
      observer =
        new ResizeObserver(
          () => {
            /*
             * Ne crtamo ponovo nakon što je
             * korisnik već počeo da grebe.
             */
            if (
              !drawingRef.current &&
              !revealed
            ) {
              drawImage();
            }
          }
        );

      observer.observe(frame);
    }

    return () => {
      cancelled = true;

      if (observer) {
        observer.disconnect();
      }
    };
  }, [
    activeScratchImage,
    revealed,
  ]);

  /* =========================================================
     POINTER POZICIJA
  ========================================================= */

  function getPoint(event) {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return null;
    }

    const rect =
      canvas.getBoundingClientRect();

    return {
      x:
        event.clientX -
        rect.left,

      y:
        event.clientY -
        rect.top,
    };
  }

  /* =========================================================
     GREBANJE
  ========================================================= */

  function scratchLine(
    from,
    to
  ) {
    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const context =
      canvas.getContext(
        "2d",
        {
          willReadFrequently: true,
        }
      );

    if (!context) return;

    const dpr =
      Math.min(
        window.devicePixelRatio || 1,
        2
      );

    context.save();

    context.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );

    context.globalCompositeOperation =
      "destination-out";

    context.lineCap =
      "round";

    context.lineJoin =
      "round";

    /*
     * Debljina četkice.
     * Veća je da bude prijatno
     * za korišćenje na telefonu.
     */
    context.lineWidth =
      44;

    context.beginPath();

    context.moveTo(
      from.x,
      from.y
    );

    context.lineTo(
      to.x,
      to.y
    );

    context.stroke();

    /*
     * Krug omogućava da i običan tap
     * nešto ogrebe.
     */
    context.beginPath();

    context.arc(
      to.x,
      to.y,
      22,
      0,
      Math.PI * 2
    );

    context.fill();

    context.restore();
  }

  /* =========================================================
     PROCENAT OGREBANOG DELA
  ========================================================= */

  function calculateRevealed() {
    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const context =
      canvas.getContext(
        "2d",
        {
          willReadFrequently: true,
        }
      );

    if (!context) return;

    try {
      const data =
        context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        ).data;

      let transparent = 0;
      let checked = 0;

      /*
       * Uzimamo uzorak piksela
       * umesto svakog piksela.
       */
      const step = 24;

      for (
        let index = 3;
        index < data.length;
        index += 4 * step
      ) {
        checked += 1;

        if (
          data[index] <
          40
        ) {
          transparent += 1;
        }
      }

      if (!checked) {
        return;
      }

      const percent =
        transparent /
        checked;

      /*
       * Kada je ~35% slike ogrebano,
       * završavamo reveal.
       */
      if (
        percent >=
        0.35
      ) {
        setRevealed(true);
      }
    } catch (error) {
      console.error(
        "Nije moguće proveriti scratch canvas:",
        error
      );
    }
  }

  /* =========================================================
     POINTER DOWN
  ========================================================= */

  function handlePointerDown(
    event
  ) {
    if (
      openingRef.current ||
      revealed ||
      !ready
    ) {
      return;
    }

    event.preventDefault();

    const canvas =
      event.currentTarget;

    try {
      canvas.setPointerCapture(
        event.pointerId
      );
    } catch {
      // nije kritično
    }

    const point =
      getPoint(event);

    if (!point) return;

    drawingRef.current =
      true;

    lastPointRef.current =
      point;

    scratchLine(
      point,
      point
    );
  }

  /* =========================================================
     POINTER MOVE
  ========================================================= */

  function handlePointerMove(
    event
  ) {
    if (
      !drawingRef.current ||
      revealed
    ) {
      return;
    }

    event.preventDefault();

    const point =
      getPoint(event);

    if (
      !point ||
      !lastPointRef.current
    ) {
      return;
    }

    scratchLine(
      lastPointRef.current,
      point
    );

    lastPointRef.current =
      point;
  }

  /* =========================================================
     POINTER END
  ========================================================= */

  function finishScratch(
    event
  ) {
    if (
      !drawingRef.current
    ) {
      return;
    }

    event.preventDefault();

    drawingRef.current =
      false;

    lastPointRef.current =
      null;

    try {
      if (
        event.currentTarget.hasPointerCapture(
          event.pointerId
        )
      ) {
        event.currentTarget.releasePointerCapture(
          event.pointerId
        );
      }
    } catch {
      // nije kritično
    }

    calculateRevealed();
  }

  /* =========================================================
     KADA JE DOVOLJNO OGREBANO
  ========================================================= */

  useEffect(() => {
    if (!revealed) {
      return;
    }

    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    canvas.classList.add(
      "bsi-scratch-complete"
    );
  }, [revealed]);

  /* =========================================================
     OTVARANJE POZIVNICE
  ========================================================= */

  function openInvitation(
    event
  ) {
    if (
      openingRef.current
    ) {
      return;
    }

    openingRef.current =
      true;

    setOpening(true);

    const callback =
      typeof onOpen ===
      "function"
        ? onOpen
        : onEnter;

    if (
      typeof callback ===
      "function"
    ) {
      callback(event);
    }
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section
      className={[
        "bsi-intro",

        ready
          ? "bsi-is-ready"
          : "",

        revealed
          ? "bsi-is-revealed"
          : "",

        opening
          ? "bsi-is-opening"
          : "",

        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        activeBackground
          ? {
              "--bsi-background":
                `url("${activeBackground}")`,
            }
          : undefined
      }
    >
      {/* ===============================================
          POZADINA
      =============================================== */}

      <div
        className="bsi-background"
        aria-hidden="true"
      />

      <div
        className="bsi-background-softener"
        aria-hidden="true"
      />

      {/* ===============================================
          SPOLJNI OKVIR
      =============================================== */}

      <div
        className="bsi-frame"
        aria-hidden="true"
      />

      <div
        className="bsi-frame-inner"
        aria-hidden="true"
      />

      {/* ===============================================
          CONTENT
      =============================================== */}

      <div className="bsi-content">
        <p className="bsi-kicker">
          {text.kicker}
        </p>

        <h1 className="bsi-name">
          {name}
        </h1>

        <p className="bsi-birthday-text">
          {text.birthdayText}
        </p>

        {/* ===========================================
            SCRATCH OVAL
        =========================================== */}

        <div
          ref={frameRef}
          className="bsi-scratch-frame"
        >
          {/* TEKST KOJI SE OTKRIVA */}

          <div className="bsi-reveal-content">
            <span className="bsi-reveal-small">
              {text.revealedTop}
            </span>

            <strong className="bsi-reveal-main">
              {text.revealedMain}
            </strong>

            <span className="bsi-reveal-bottom">
              {text.revealedBottom}
            </span>

            <span
              className="bsi-reveal-one"
              aria-hidden="true"
            >
              one
            </span>
          </div>

          {/* =========================================
              SLIKA KOJA SE GREBE
          ========================================= */}

          {activeScratchImage && (
            <canvas
              ref={canvasRef}
              className="bsi-scratch-canvas"
              aria-label={
                text.scratchHint
              }
              onPointerDown={
                handlePointerDown
              }
              onPointerMove={
                handlePointerMove
              }
              onPointerUp={
                finishScratch
              }
              onPointerCancel={
                finishScratch
              }
              onLostPointerCapture={
                finishScratch
              }
            />
          )}

          {/* FALLBACK AKO SLIKA NE POSTOJI */}

          {!activeScratchImage && (
            <div className="bsi-scratch-placeholder">
              {name}
            </div>
          )}
        </div>

        {/* ===========================================
            HINT / OPEN BUTTON
        =========================================== */}

        {!revealed ? (
          <p className="bsi-scratch-hint">
            <span
              className="bsi-finger"
              aria-hidden="true"
            >
              ♡
            </span>

            {text.scratchHint}
          </p>
        ) : (
          <motion.div
            className="bsi-after-reveal"
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.65,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >
            <div
              className="bsi-divider"
              aria-hidden="true"
            >
              <span />

              <b>
                ♡
              </b>

              <span />
            </div>

            <button
              type="button"
              className="bsi-open"
              onClick={
                openInvitation
              }
              disabled={
                opening
              }
            >
              {opening
                ? text.opening
                : text.open}
            </button>
          </motion.div>
        )}
      </div>

      {/* ===============================================
          OPEN TRANSITION
      =============================================== */}

      <div
        className="bsi-opening-bloom"
        aria-hidden="true"
      />
    </section>
  );
}

export default BirthdayScratchIntro;