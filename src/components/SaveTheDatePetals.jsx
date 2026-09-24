import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "../styles/saveTheDate.css";
import { addToCalendar } from "../utils/calendar";

const LOGICAL_W = 1000;
const LOGICAL_H = 900;

const MASK_W = 100;
const MASK_H = 90;

/* ===============================
   RANDOM
================================ */

function seededRandom(seedRef) {
  seedRef.current =
    (seedRef.current * 1664525 +
      1013904223) >>>
    0;

  return seedRef.current / 4294967296;
}

/* ===============================
   DATE HELPERS
================================ */

function dateDisplayToISO(value) {
  if (!value) return "";

  const match = String(value)
    .trim()
    .match(
      /^(\d{1,2})\.(\d{1,2})\.(\d{4})\.?$/
    );

  if (!match) return "";

  const [, day, month, year] = match;

  return `${year}-${String(month).padStart(
    2,
    "0"
  )}-${String(day).padStart(2, "0")}`;
}

function parseTargetDate(value) {
  if (!value) return null;

  const dateOnlyMatch =
    String(value).match(
      /^(\d{4})-(\d{2})-(\d{2})$/
    );

  if (dateOnlyMatch) {
    const [, year, month, day] =
      dateOnlyMatch;

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      0,
      0,
      0
    );
  }

  const parsed = new Date(value);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return null;
  }

  return parsed;
}

/* ===============================
   COUNTDOWN
================================ */

function getCountdown(targetDate) {
  if (
    !targetDate ||
    Number.isNaN(
      targetDate.getTime()
    )
  ) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      finished: false,
    };
  }

  const difference =
    targetDate.getTime() - Date.now();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      finished: true,
    };
  }

  const totalMinutes =
    Math.floor(
      difference / 60000
    );

  const days =
    Math.floor(
      totalMinutes /
        (60 * 24)
    );

  const hours =
    Math.floor(
      (totalMinutes %
        (60 * 24)) /
        60
    );

  const minutes =
    totalMinutes % 60;

  return {
    days,
    hours,
    minutes,
    finished: false,
  };
}

function padNumber(value) {
  return String(value).padStart(
    2,
    "0"
  );
}

function clampConfigNumber(
  value,
  fallback,
  min,
  max
) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(
    max,
    Math.max(
      min,
      parsed
    )
  );
}

/* ===============================
   COMPONENT
================================ */

function SaveTheDatePetals({
  brideName = "Ana",
  groomName = "Nikola",
  weddingDate = "19.06.2027.",
  venue = "Beograd",
  script = "latin",
  details = {},
}) {
  const config =
    details.saveTheDate || {};

  const isCyrillic =
    script === "cyrillic" ||
    config.script === "cyrillic" ||
    details.script === "cyrillic";

  const copy = isCyrillic
    ? {
        masthead: "САЧУВАЈТЕ ДАТУМ",
        scratchTitle: "Љубав се открива.",
        revealedTitle: "Наше заувек почиње.",
        scratchEyebrow: "Наша мала тајна",
        revealedEyebrow: "Венчавамо се",
        loading: "Срце се учитава…",
        error: "Срце није учитано.",
        retry: "Покушај поново",
        scratchLine1: "Превуци прстом преко срца",
        scratchLine2: "и откриј наш датум.",
        revealWithout: "Откриј без гребања",
        saveDate: "Сачувајте датум.",
        soon: "Позивница са детаљима ускоро стиже.",
        addCalendar: "Додај у календар",
        today: "Данас је наш дан",
        untilWedding: "Бројимо дане",
        days: "Дана",
        hours: "Сати",
        minutes: "Минута",
        footer: "",
        introTitle: "Наша мала тајна",
        introHint: "Додирни латице",
        ariaHeart: "Срце које се гребе",
        ariaOpen: "Додирни латице и откриј Save the Date",
        calendarNote: "Сачувајте датум за наш посебан дан.",
        calendarTitle: `Сачувајте датум - ${brideName} & ${groomName}`,
      }
    : {
        masthead: "SAVE THE DATE",
        scratchTitle: "Ljubav se otkriva.",
        revealedTitle: "Naše zauvek počinje.",
        scratchEyebrow: "Naša mala tajna",
        revealedEyebrow: "Venčavamo se",
        loading: "Srce se učitava…",
        error: "Srce nije učitano.",
        retry: "Pokušaj ponovo",
        scratchLine1: "Prevuci prstom preko srca",
        scratchLine2: "i otkrij naš datum.",
        revealWithout: "Otkrij bez grebanja",
        saveDate: "Sačuvajte datum.",
        soon: "Pozivnica sa detaljima uskoro stiže.",
        addCalendar: "Dodaj u kalendar",
        today: "Danas je naš dan",
        untilWedding: "Do našeg dana",
        days: "Dana",
        hours: "Sati",
        minutes: "Minuta",
        footer: "",
        introTitle: "Naša mala tajna",
        introHint: "Dodirni latice",
        ariaHeart: "Srce koje se grebe",
        ariaOpen: "Dodirni latice i otkrij Save the Date",
        calendarNote: "Sačuvajte datum za naš poseban dan.",
        calendarTitle: `Sačuvajte datum - ${brideName} & ${groomName}`,
      };

  /* ===============================
     CONFIG
  ================================ */

  const petalImageSrc =
    config.petalImageSrc ||
    "/images/save-the-date/white-rose-petals.webp";

  const heartImageSrc =
    config.heartImageSrc ||
    "/images/save-the-date/mint-glass-heart.webp";

  const backgroundImage =
    config.backgroundImage || "";

  /*
    Background može da se podešava po slugu.

    backgroundPosition primeri:
    "center center"
    "center top"
    "65% center"

    backgroundOverlay:
    1 = skoro potpuno bela pozadina
    0 = puna fotografija
  */
  const backgroundPosition =
    config.backgroundPosition || "center center";

  const backgroundOverlay =
    clampConfigNumber(
      config.backgroundOverlay,
      0.9,
      0,
      1
    );

  /*
    THEME PO SLUGU

    Ovo omogućava da isti template koristi:
    mint, bordo, roze, zlatno, sage...
    bez posebnog CSS-a za svaki slug.
  */

  const accentColor =
    config.accentColor ||
    "#b79a72";

  const pageBackground =
    config.pageBackground ||
    "#f8f6f1";

  const heartRevealOpacity =
    clampConfigNumber(
      config.heartRevealOpacity,
      0.33,
      0,
      1
    );

  const heartSaturation =
    clampConfigNumber(
      config.heartSaturation,
      0.72,
      0,
      2
    );

  const heartBrightness =
    clampConfigNumber(
      config.heartBrightness,
      1.08,
      0.4,
      2
    );

  const heartContrast =
    clampConfigNumber(
      config.heartContrast,
      1.01,
      0.4,
      2
    );

  const revealThreshold =
    clampConfigNumber(
      config.revealThreshold,
      0.46,
      0.2,
      0.8
    );

  const showCountdown =
    config.showCountdown !== false;

  const showCalendarButton =
    config.showCalendarButton ??
    details.showCalendarButton ??
    false;

  /* ===============================
     DATE
  ================================ */

  const calendarDateISO =
    useMemo(() => {
      if (config.dateISO) {
        return config.dateISO;
      }

      if (details.dateISO) {
        return details.dateISO;
      }

      return dateDisplayToISO(
        weddingDate
      );
    }, [
      config.dateISO,
      details.dateISO,
      weddingDate,
    ]);

  const targetDate =
    useMemo(
      () =>
        parseTargetDate(
          calendarDateISO
        ),
      [calendarDateISO]
    );

  /* ===============================
     STATE
  ================================ */

  const [
    phase,
    setPhase,
  ] = useState("intro");

  const [
    petals,
    setPetals,
  ] = useState([]);

  const [
    heartReady,
    setHeartReady,
  ] = useState(false);

  const [
    heartError,
    setHeartError,
  ] = useState(false);

  const [
    touched,
    setTouched,
  ] = useState(false);

  const [
    countdown,
    setCountdown,
  ] = useState(() =>
    getCountdown(
      targetDate
    )
  );

  /* ===============================
     REFS
  ================================ */

  const rootRef =
    useRef(null);

  const canvasRef =
    useRef(null);

  const heartImageRef =
    useRef(null);

  const phaseRef =
    useRef("intro");

  const heartReadyRef =
    useRef(false);

  const pointerIdRef =
    useRef(null);

  const lastPointRef =
    useRef(null);

  const strokesRef =
    useRef([]);

  const originalPixelsRef =
    useRef(0);

  const hitMaskRef =
    useRef(null);

  const checkFrameRef =
    useRef(0);

  const lastCheckRef =
    useRef(0);

  const fallTimerRef =
    useRef(null);

  const resizeFrameRef =
    useRef(0);

  const maskCanvasRef =
    useRef(null);

  const maskContextRef =
    useRef(null);

  const lastCanvasSizeRef =
    useRef({
      width: 0,
      height: 0,
    });

  /* ===============================
     PHASE
  ================================ */

  const changePhase =
    useCallback(
      (nextPhase) => {
        phaseRef.current =
          nextPhase;

        setPhase(
          nextPhase
        );
      },
      []
    );

  /* ===============================
     COUNTDOWN
  ================================ */

  useEffect(() => {
    setCountdown(
      getCountdown(
        targetDate
      )
    );

    if (
      !showCountdown ||
      !targetDate
    ) {
      return undefined;
    }

    const interval =
      window.setInterval(
        () => {
          setCountdown(
            getCountdown(
              targetDate
            )
          );
        },
        30000
      );

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, [
    showCountdown,
    targetDate,
  ]);

  /* ===============================
     PETALS
  ================================ */

  const buildPetals =
    useCallback(() => {
      if (
        !rootRef.current ||
        phaseRef.current !==
          "intro"
      ) {
        return;
      }

      const rect =
        rootRef.current
          .getBoundingClientRect();

      const width =
        Math.max(
          rect.width,
          window.innerWidth ||
            360
        );

      const height =
        Math.max(
          rect.height,
          window.innerHeight ||
            640
        );

      const targetCell =
        width <= 600
          ? 72
          : 94;

      const columns =
        Math.max(
          6,
          Math.ceil(
            width /
              targetCell
          )
        );

      const rows =
        Math.max(
          10,
          Math.ceil(
            height /
              targetCell
          )
        );

      const cellW =
        width / columns;

      const cellH =
        height / rows;

      const baseSize =
        Math.hypot(
          cellW,
          cellH
        ) * 1.58;

      const seed = {
        current: 1729,
      };

      const next = [];

      let id = 0;

      for (
        let row = -1;
        row <= rows;
        row += 1
      ) {
        for (
          let col = -1;
          col <= columns;
          col += 1
        ) {
          const rand = () =>
            seededRandom(
              seed
            );

          const x =
            ((col +
              0.5 +
              (rand() -
                0.5) *
                0.46) /
              columns) *
            100;

          const y =
            ((row +
              0.5 +
              (rand() -
                0.5) *
                0.46) /
              rows) *
            100;

          const size =
            baseSize *
            (0.98 +
              rand() *
                0.32);

          const delay =
            Math.round(
              rand() *
                220
            );

          const duration =
            Math.round(
              1450 +
                rand() *
                  360
            );

          const drift =
            Math.round(
              -95 +
                rand() *
                  190
            );

          const tilt =
            Math.round(
              rand() *
                360
            );

          const endRotate =
            tilt +
            Math.round(
              -240 +
                rand() *
                  480
            );

          next.push({
            id,
            x,
            y,
            size,
            delay,
            duration,
            drift,
            tilt,
            endRotate,
            sprite:
              id % 4,
            z:
              Math.floor(
                rand() *
                  6
              ),
          });

          id += 1;
        }
      }

      setPetals(next);
    }, []);

  /* ===============================
     CONTEXTS
  ================================ */

  const getContexts =
    useCallback(() => {
      const canvas =
        canvasRef.current;

      if (!canvas) {
        return null;
      }

      const context =
        canvas.getContext(
          "2d",
          {
            willReadFrequently:
              true,
          }
        );

      if (!context) {
        return null;
      }

      if (
        !maskCanvasRef.current
      ) {
        const mask =
          document.createElement(
            "canvas"
          );

        mask.width =
          MASK_W;

        mask.height =
          MASK_H;

        maskCanvasRef.current =
          mask;

        maskContextRef.current =
          mask.getContext(
            "2d",
            {
              willReadFrequently:
                true,
            }
          );
      }

      if (
        !maskContextRef.current
      ) {
        return null;
      }

      return {
        canvas,
        context,
        mask:
          maskCanvasRef.current,
        maskContext:
          maskContextRef.current,
      };
    }, []);

  /* ===============================
     DRAW IMAGE
  ================================ */

  const drawImageContain =
    useCallback(
      (
        ctx,
        image,
        w,
        h
      ) => {
        const scale =
          Math.min(
            w /
              image.naturalWidth,
            h /
              image.naturalHeight
          );

        const drawW =
          image.naturalWidth *
          scale;

        const drawH =
          image.naturalHeight *
          scale;

        const x =
          (w - drawW) /
          2;

        const y =
          (h - drawH) /
          2;

        ctx.drawImage(
          image,
          x,
          y,
          drawW,
          drawH
        );
      },
      []
    );

  /* ===============================
     ERASE
  ================================ */

  const erase =
    useCallback(
      (
        ctx,
        from,
        to,
        scale = 1
      ) => {
        ctx.save();

        ctx.globalCompositeOperation =
          "destination-out";

        ctx.lineWidth =
          112 *
          scale;

        ctx.lineCap =
          "round";

        ctx.lineJoin =
          "round";

        ctx.beginPath();

        ctx.moveTo(
          from.x *
            scale,
          from.y *
            scale
        );

        ctx.lineTo(
          to.x *
            scale,
          to.y *
            scale
        );

        ctx.stroke();

        ctx.beginPath();

        ctx.arc(
          to.x *
            scale,
          to.y *
            scale,
          56 *
            scale,
          0,
          Math.PI *
            2
        );

        ctx.fill();

        ctx.restore();
      },
      []
    );

  /* ===============================
     MASK
  ================================ */

  const countMaskPixels =
    useCallback(() => {
      const maskContext =
        maskContextRef.current;

      if (!maskContext) {
        return 0;
      }

      const pixels =
        maskContext.getImageData(
          0,
          0,
          MASK_W,
          MASK_H
        ).data;

      let sum = 0;

      for (
        let i = 3;
        i <
        pixels.length;
        i += 4
      ) {
        sum +=
          pixels[i] /
          255;
      }

      return sum;
    }, []);

  /* ===============================
     DRAW COATING
  ================================ */

  const drawCoating =
    useCallback(() => {
      if (
        !heartImageRef.current
      ) {
        return;
      }

      if (
        phaseRef.current ===
        "revealed"
      ) {
        return;
      }

      const contexts =
        getContexts();

      if (!contexts) {
        return;
      }

      const {
        canvas,
        context,
        maskContext,
      } = contexts;

      const rect =
        canvas
          .getBoundingClientRect();

      if (
        !rect.width ||
        !rect.height
      ) {
        return;
      }

      const ratio =
        Math.min(
          window
            .devicePixelRatio ||
            1,
          2
        );

      const pixelWidth =
        Math.round(
          rect.width *
            ratio
        );

      const pixelHeight =
        Math.round(
          rect.height *
            ratio
        );

      const lastSize =
        lastCanvasSizeRef.current;

      const sameSize =
        lastSize.width ===
          pixelWidth &&
        lastSize.height ===
          pixelHeight;

      if (
        sameSize &&
        originalPixelsRef.current
      ) {
        return;
      }

      lastCanvasSizeRef.current =
        {
          width:
            pixelWidth,
          height:
            pixelHeight,
        };

      canvas.width =
        pixelWidth;

      canvas.height =
        pixelHeight;

      context.setTransform(
        pixelWidth /
          LOGICAL_W,
        0,
        0,
        pixelHeight /
          LOGICAL_H,
        0,
        0
      );

      context.clearRect(
        0,
        0,
        LOGICAL_W,
        LOGICAL_H
      );

      /*
        3 sloja izabranog srca
        za scratch površinu.
      */

      drawImageContain(
        context,
        heartImageRef.current,
        LOGICAL_W,
        LOGICAL_H
      );

      drawImageContain(
        context,
        heartImageRef.current,
        LOGICAL_W,
        LOGICAL_H
      );

      drawImageContain(
        context,
        heartImageRef.current,
        LOGICAL_W,
        LOGICAL_H
      );

      maskContext.setTransform(
        1,
        0,
        0,
        1,
        0,
        0
      );

      maskContext.clearRect(
        0,
        0,
        MASK_W,
        MASK_H
      );

      drawImageContain(
        maskContext,
        heartImageRef.current,
        MASK_W,
        MASK_H
      );

      hitMaskRef.current =
        maskContext
          .getImageData(
            0,
            0,
            MASK_W,
            MASK_H
          )
          .data
          .slice();

      originalPixelsRef.current =
        countMaskPixels();

      for (
        const stroke of
        strokesRef.current
      ) {
        erase(
          context,
          stroke.from,
          stroke.to,
          1
        );

        erase(
          maskContext,
          stroke.from,
          stroke.to,
          0.1
        );
      }
    }, [
      countMaskPixels,
      drawImageContain,
      erase,
      getContexts,
    ]);

  /* ===============================
     LOAD HEART
  ================================ */

  const loadHeart =
    useCallback(() => {
      setHeartError(
        false
      );

      setHeartReady(
        false
      );

      heartReadyRef.current =
        false;

      const image =
        new Image();

      image.decoding =
        "async";

      image.fetchPriority =
        "high";

      image.onload =
        () => {
          heartImageRef.current =
            image;

          heartReadyRef.current =
            true;

          setHeartReady(
            true
          );

          lastCanvasSizeRef.current =
            {
              width: 0,
              height: 0,
            };

          requestAnimationFrame(
            () => {
              drawCoating();

              if (
                phaseRef.current ===
                "loading"
              ) {
                changePhase(
                  "scratch"
                );
              }
            }
          );
        };

      image.onerror =
        () => {
          heartReadyRef.current =
            false;

          setHeartError(
            true
          );
        };

      image.src =
        heartImageSrc;

      return () => {
        image.onload =
          null;

        image.onerror =
          null;
      };
    }, [
      changePhase,
      drawCoating,
      heartImageSrc,
    ]);

  /* ===============================
     INIT
  ================================ */

  useEffect(() => {
    buildPetals();

    const preloadPetals =
      new Image();

    preloadPetals.decoding =
      "async";

    preloadPetals.src =
      petalImageSrc;

    const cleanupHeart =
      loadHeart();

    const handleResize =
      () => {
        cancelAnimationFrame(
          resizeFrameRef.current
        );

        resizeFrameRef.current =
          requestAnimationFrame(
            () => {
              if (
                phaseRef.current ===
                "intro"
              ) {
                buildPetals();
              }

              lastCanvasSizeRef.current =
                {
                  width: 0,
                  height: 0,
                };

              drawCoating();
            }
          );
      };

    window.addEventListener(
      "resize",
      handleResize,
      {
        passive: true,
      }
    );

    return () => {
      cleanupHeart?.();

      window.removeEventListener(
        "resize",
        handleResize
      );

      cancelAnimationFrame(
        resizeFrameRef.current
      );

      cancelAnimationFrame(
        checkFrameRef.current
      );

      clearTimeout(
        fallTimerRef.current
      );
    };
  }, [
    buildPetals,
    drawCoating,
    loadHeart,
    petalImageSrc,
  ]);

  useEffect(() => {
    if (!heartReady) {
      return;
    }

    requestAnimationFrame(
      drawCoating
    );
  }, [
    heartReady,
    drawCoating,
  ]);

  /* ===============================
     REVEAL
  ================================ */

  const revealAll =
    useCallback(() => {
      if (
        phaseRef.current !==
        "scratch"
      ) {
        return;
      }

      pointerIdRef.current =
        null;

      lastPointRef.current =
        null;

      changePhase(
        "revealed"
      );
    }, [
      changePhase,
    ]);

  /* ===============================
     PROGRESS
  ================================ */

  const checkProgress =
    useCallback(() => {
      checkFrameRef.current =
        0;

      if (
        phaseRef.current !==
        "scratch"
      ) {
        return;
      }

      if (
        !originalPixelsRef.current
      ) {
        return;
      }

      lastCheckRef.current =
        performance.now();

      const currentPixels =
        countMaskPixels();

      const erased =
        1 -
        currentPixels /
          originalPixelsRef.current;

      if (
        erased >=
        revealThreshold
      ) {
        revealAll();
      }
    }, [
      countMaskPixels,
      revealAll,
      revealThreshold,
    ]);

  /* ===============================
     POINT
  ================================ */

  const getPoint =
    useCallback(
      (event) => {
        const canvas =
          canvasRef.current;

        if (!canvas) {
          return null;
        }

        const rect =
          canvas
            .getBoundingClientRect();

        if (
          !rect.width ||
          !rect.height
        ) {
          return null;
        }

        return {
          x:
            ((event.clientX -
              rect.left) /
              rect.width) *
            LOGICAL_W,

          y:
            ((event.clientY -
              rect.top) /
              rect.height) *
            LOGICAL_H,
        };
      },
      []
    );

  /* ===============================
     SCRATCH
  ================================ */

  const scratch =
    useCallback(
      (
        from,
        to
      ) => {
        const contexts =
          getContexts();

        if (!contexts) {
          return;
        }

        const {
          context,
          maskContext,
        } = contexts;

        const stroke = {
          from,
          to,
        };

        strokesRef.current.push(
          stroke
        );

        erase(
          context,
          from,
          to,
          1
        );

        erase(
          maskContext,
          from,
          to,
          0.1
        );

        setTouched(
          true
        );

        if (
          !checkFrameRef.current &&
          performance.now() -
            lastCheckRef.current >
            110
        ) {
          checkFrameRef.current =
            requestAnimationFrame(
              checkProgress
            );
        }
      },
      [
        checkProgress,
        erase,
        getContexts,
      ]
    );

  /* ===============================
     POINTER DOWN
  ================================ */

  const handlePointerDown =
    useCallback(
      (event) => {
        if (
          phaseRef.current !==
          "scratch"
        ) {
          return;
        }

        if (
          pointerIdRef.current !==
          null
        ) {
          return;
        }

        if (
          event.isPrimary ===
          false
        ) {
          return;
        }

        if (
          event.pointerType ===
            "mouse" &&
          event.button !== 0
        ) {
          return;
        }

        const point =
          getPoint(
            event
          );

        if (!point) {
          return;
        }

        const maskX =
          Math.floor(
            point.x / 10
          );

        const maskY =
          Math.floor(
            point.y / 10
          );

        const hitMask =
          hitMaskRef.current;

        if (
          !hitMask ||
          maskX < 0 ||
          maskX >= MASK_W ||
          maskY < 0 ||
          maskY >= MASK_H
        ) {
          return;
        }

        const alpha =
          hitMask[
            (maskY *
              MASK_W +
              maskX) *
              4 +
              3
          ];

        if (
          alpha < 28
        ) {
          return;
        }

        event.preventDefault();

        pointerIdRef.current =
          event.pointerId;

        lastPointRef.current =
          point;

        canvasRef.current
          ?.setPointerCapture?.(
            event.pointerId
          );

        scratch(
          point,
          point
        );
      },
      [
        getPoint,
        scratch,
      ]
    );

  /* ===============================
     POINTER MOVE
  ================================ */

  const handlePointerMove =
    useCallback(
      (event) => {
        if (
          phaseRef.current !==
          "scratch"
        ) {
          return;
        }

        if (
          event.pointerId !==
          pointerIdRef.current
        ) {
          return;
        }

        if (
          !lastPointRef.current
        ) {
          return;
        }

        event.preventDefault();

        const point =
          getPoint(
            event
          );

        if (!point) {
          return;
        }

        scratch(
          lastPointRef.current,
          point
        );

        lastPointRef.current =
          point;
      },
      [
        getPoint,
        scratch,
      ]
    );

  /* ===============================
     RELEASE POINTER
  ================================ */

  const releasePointer =
    useCallback(
      (event) => {
        if (
          event &&
          pointerIdRef.current !==
            null &&
          event.pointerId !==
            pointerIdRef.current
        ) {
          return;
        }

        const canvas =
          canvasRef.current;

        const activePointer =
          pointerIdRef.current;

        if (
          canvas &&
          activePointer !==
            null &&
          canvas.hasPointerCapture?.(
            activePointer
          )
        ) {
          canvas.releasePointerCapture(
            activePointer
          );
        }

        pointerIdRef.current =
          null;

        lastPointRef.current =
          null;
      },
      []
    );

  const handlePointerEnd =
    useCallback(
      (event) => {
        releasePointer(
          event
        );

        checkProgress();
      },
      [
        checkProgress,
        releasePointer,
      ]
    );

  /* ===============================
     START
  ================================ */

  const start =
    useCallback(() => {
      if (
        phaseRef.current !==
        "intro"
      ) {
        return;
      }

      changePhase(
        "falling"
      );

      const reducedMotion =
        window.matchMedia?.(
          "(prefers-reduced-motion: reduce)"
        )?.matches;

      clearTimeout(
        fallTimerRef.current
      );

      fallTimerRef.current =
        window.setTimeout(
          () => {
            if (
              heartReadyRef.current
            ) {
              changePhase(
                "scratch"
              );

              requestAnimationFrame(
                drawCoating
              );
            } else {
              changePhase(
                "loading"
              );
            }
          },
          reducedMotion
            ? 520
            : 2050
        );
    }, [
      changePhase,
      drawCoating,
    ]);

  /* ===============================
     CALENDAR
  ================================ */

  const handleAddToCalendar =
    useCallback(() => {
      if (
        !calendarDateISO
      ) {
        return;
      }

      addToCalendar({
        brideName,
        groomName,

        dateISO:
          calendarDateISO,

        venue,

        mapLink:
          config.mapLink ||
          details.mapLink ||
          "",

        note:
          config.calendarDescription ||
          copy.calendarNote,

        eventType:
          "save-the-date",

        eventTitle:
          config.calendarTitle ||
          copy.calendarTitle,

        /*
          Samo datum.
          Nema izmišljene satnice.
        */
        allDay: true,

        language: "sr",
      });
    }, [
      brideName,
      groomName,
      calendarDateISO,
      venue,
      config.mapLink,
      config.calendarDescription,
      config.calendarTitle,
      details.mapLink,
      copy.calendarNote,
      copy.calendarTitle,
    ]);

  /* ===============================
     TEXT
  ================================ */

  const title =
    phase === "revealed"
      ? copy.revealedTitle
      : copy.scratchTitle;

  const eyebrow =
    phase === "revealed"
      ? copy.revealedEyebrow
      : copy.scratchEyebrow;

  /* ===============================
     RENDER
  ================================ */

  return (
    <section
      ref={rootRef}
      className={`std-save-date ${
        touched
          ? "is-touched"
          : ""
      } ${
        isCyrillic
          ? "is-cyrillic"
          : ""
      }`}
      data-phase={phase}
      data-script={
        isCyrillic
          ? "cyrillic"
          : "latin"
      }
      style={{
        "--std-petal-image":
          `url("${petalImageSrc}")`,

        "--std-heart-image":
          `url("${heartImageSrc}")`,

        "--std-bg-image":
          backgroundImage
            ? `url("${backgroundImage}")`
            : "none",

        "--std-bg-position":
          backgroundPosition,

        "--std-bg-overlay":
          backgroundOverlay,

        "--std-accent":
          accentColor,

        "--std-page-background":
          pageBackground,

        "--std-heart-reveal-opacity":
          heartRevealOpacity,

        "--std-heart-saturation":
          heartSaturation,

        "--std-heart-brightness":
          heartBrightness,

        "--std-heart-contrast":
          heartContrast,
      }}
      aria-label="Save the Date"
    >
      <div
        className="std-save-date__light"
        aria-hidden="true"
      />

      <header className="std-save-date__masthead">
        {copy.masthead}
      </header>

      <main className="std-save-date__stage">

        <div className="std-save-date__reveal">

          {/* HEADING */}

          <div className="std-save-date__heading">

            <p className="std-save-date__eyebrow">
              {eyebrow}
            </p>

            <h1 className="std-save-date__title">
              {title}
            </h1>

          </div>

          {/* HEART */}

          <div className="std-save-date__heart-zone">

            <div
              className="std-save-date__heart"
              role="group"
              aria-label={copy.ariaHeart}
            >
              {/* BELA OSNOVA */}

              <div
                className="std-save-date__paper-heart"
                aria-hidden="true"
              />

              {/* POSLE REVEAL-A
                  OSTAJE BLAGO STAKLENO SRCE */}

              <div
                className="std-save-date__revealed-glass"
                aria-hidden="true"
              />

              {/* IMENA */}

              <div className="std-save-date__secret">

                <div className="std-save-date__names">

                  <span className="std-save-date__name">
                    {brideName}
                  </span>

                  <span className="std-save-date__amp">
                    &amp;
                  </span>

                  <span className="std-save-date__name">
                    {groomName}
                  </span>

                </div>

                <p className="std-save-date__date">
                  {weddingDate}
                </p>

              </div>

              {/* SCRATCH */}

              <canvas
                ref={canvasRef}
                className="std-save-date__canvas"
                aria-hidden="true"

                onPointerDown={
                  handlePointerDown
                }

                onPointerMove={
                  handlePointerMove
                }

                onPointerUp={
                  handlePointerEnd
                }

                onPointerCancel={
                  handlePointerEnd
                }

                onLostPointerCapture={
                  handlePointerEnd
                }

                onContextMenu={(
                  event
                ) =>
                  event.preventDefault()
                }
              />

              {/* SHIMMER */}

              {phase ===
                "revealed" && (
                <div
                  className="std-save-date__heart-shimmer"
                  aria-hidden="true"
                />
              )}

              {/* SCRATCH POINTER */}

              <div
                className="std-save-date__scratch-gesture"
                aria-hidden="true"
              >
                <span />
              </div>

            </div>

          </div>

          {/* BELOW HEART */}

          <div className="std-save-date__below">

            {phase ===
              "loading" &&
              !heartError && (
                <p className="std-save-date__hint">
                  {copy.loading}
                </p>
              )}

            {heartError &&
              phase !==
                "revealed" && (
                <div className="std-save-date__asset-error">

                  <p className="std-save-date__hint">
                    {copy.error}
                  </p>

                  <button
                    type="button"
                    className="std-save-date__text-button"
                    onClick={
                      loadHeart
                    }
                  >
                    {copy.retry}
                  </button>

                </div>
              )}

            {phase ===
              "scratch" && (
                <div className="std-save-date__instructions">

                  <p className="std-save-date__hint">
                    {copy.scratchLine1}
                    <br />
                    {copy.scratchLine2}
                  </p>

                  <button
                    type="button"
                    className="std-save-date__text-button"
                    onClick={
                      revealAll
                    }
                  >
                    {copy.revealWithout}
                  </button>

                </div>
              )}

            {phase ===
              "revealed" && (
                <div className="std-save-date__message">

                  {venue && (
                    <p className="std-save-date__city">
                      {venue}
                    </p>
                  )}

                  <p className="std-save-date__save">
                    {copy.saveDate}
                  </p>

                  <p className="std-save-date__soon">
                    {copy.soon}
                  </p>

                  {/* CALENDAR */}

                  {showCalendarButton &&
                    calendarDateISO && (
                      <button
                        type="button"
                        className="std-save-date__calendar-button"
                        onClick={
                          handleAddToCalendar
                        }
                      >
                        <span
                          className="std-save-date__calendar-icon"
                          aria-hidden="true"
                        >
                          +
                        </span>

                        <span>
                          {copy.addCalendar}
                        </span>

                      </button>
                    )}

                  {/* COUNTDOWN */}

                  {showCountdown &&
                    targetDate && (
                      <div className="std-save-date__countdown">

                        <span
                          className="std-save-date__countdown-heart"
                          aria-hidden="true"
                        >
                          ♡
                        </span>

                        <p className="std-save-date__countdown-title">
                          {countdown.finished
                            ? copy.today
                            : copy.untilWedding}
                        </p>

                        <div className="std-save-date__countdown-grid">

                          <div className="std-save-date__countdown-item">

                            <span className="std-save-date__countdown-number">
                              {countdown.days}
                            </span>

                            <span className="std-save-date__countdown-label">
                              {copy.days}
                            </span>

                          </div>

                          <div className="std-save-date__countdown-separator" />

                          <div className="std-save-date__countdown-item">

                            <span className="std-save-date__countdown-number">
                              {padNumber(
                                countdown.hours
                              )}
                            </span>

                            <span className="std-save-date__countdown-label">
                              {copy.hours}
                            </span>

                          </div>

                          <div className="std-save-date__countdown-separator" />

                          <div className="std-save-date__countdown-item">

                            <span className="std-save-date__countdown-number">
                              {padNumber(
                                countdown.minutes
                              )}
                            </span>

                            <span className="std-save-date__countdown-label">
                              {copy.minutes}
                            </span>

                          </div>

                        </div>

                      </div>
                    )}

                </div>
              )}

          </div>

        </div>

      </main>

      {copy.footer && (
        <footer className="std-save-date__footer">
          {copy.footer}
        </footer>
      )}

      {/* INTRO */}

      <div className="std-save-date__intro">

        <button
          type="button"
          className="std-save-date__open"

          onClick={
            start
          }

          disabled={
            phase !==
            "intro"
          }

          aria-label={copy.ariaOpen}
        >

          <span
            className="std-save-date__petals"
            aria-hidden="true"
          >

            {petals.map(
              (
                petal
              ) => (
                <span
                  key={
                    petal.id
                  }

                  className={`std-save-date__petal sprite-${petal.sprite}`}

                  style={{
                    "--x":
                      `${petal.x}%`,

                    "--y":
                      `${petal.y}%`,

                    "--size":
                      `${petal.size}px`,

                    "--delay":
                      `${petal.delay}ms`,

                    "--duration":
                      `${petal.duration}ms`,

                    "--drift":
                      `${petal.drift}px`,

                    "--tilt":
                      `${petal.tilt}deg`,

                    "--end-rotate":
                      `${petal.endRotate}deg`,

                    zIndex:
                      petal.z,
                  }}
                />
              )
            )}

          </span>

          <span className="std-save-date__intro-copy">

            <span className="std-save-date__intro-label">
              {copy.masthead}
            </span>

            <span className="std-save-date__intro-title">
              {copy.introTitle}
            </span>

            <span className="std-save-date__open-hint">
              {copy.introHint}
            </span>

            <span
              className="std-save-date__open-line"
              aria-hidden="true"
            />

          </span>

        </button>

      </div>

    </section>
  );
}

export default SaveTheDatePetals;