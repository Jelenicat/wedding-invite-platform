import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";


import "../styles/saveTheDate.css";


import { addToCalendar } from "../utils/calendar";

/* =====================================================
   HELPERS
===================================================== */

function clampNumber(value, fallback, min, max) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, parsed));
}

function dateDisplayToISO(value) {
  if (!value) return "";

  const match = String(value)
    .trim()
    .match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})\.?$/);

  if (!match) return "";

  const [, day, month, year] = match;

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseTargetDate(value) {
  if (!value) return null;

  const dateOnly = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (dateOnly) {
    const [, year, month, day] = dateOnly;

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

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getCountdown(targetDate) {
  if (!targetDate || Number.isNaN(targetDate.getTime())) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      finished: false,
    };
  }

  const difference = targetDate.getTime() - Date.now();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      finished: true,
    };
  }

  const totalMinutes = Math.floor(difference / 60000);

  return {
    days: Math.floor(totalMinutes / 1440),
    hours: Math.floor((totalMinutes % 1440) / 60),
    minutes: totalMinutes % 60,
    finished: false,
  };
}

function padNumber(value) {
  return String(value).padStart(2, "0");
}

function splitDisplayDate(value) {
  const match = String(value || "")
    .trim()
    .match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})\.?$/);

  if (!match) {
    return {
      day: "",
      month: "",
      year: "",
      fallback: value || "",
    };
  }

  return {
    day: String(match[1]).padStart(2, "0"),
    month: String(match[2]).padStart(2, "0"),
    year: match[3],
    fallback: "",
  };
}

function getMonthLabel(month, isCyrillic, isGerman = false) {
  const monthIndex = Number(month) - 1;

  const latinMonths = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAJ",
    "JUN",
    "JUL",
    "AVG",
    "SEP",
    "OKT",
    "NOV",
    "DEC",
  ];

  const cyrillicMonths = [
    "ЈАН",
    "ФЕБ",
    "МАР",
    "АПР",
    "МАЈ",
    "ЈУН",
    "ЈУЛ",
    "АВГ",
    "СЕП",
    "ОКТ",
    "НОВ",
    "ДЕЦ",
  ];

  const germanMonths = [
    "JAN",
    "FEB",
    "MÄR",
    "APR",
    "MAI",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OKT",
    "NOV",
    "DEZ",
  ];

  const months = isGerman
    ? germanMonths
    : isCyrillic
      ? cyrillicMonths
      : latinMonths;

  return months[monthIndex] || month || "";
}

/* =====================================================
   STITCH TEXT
===================================================== */

function getStitchDuration(text, step) {
  const chars = Math.max(Array.from(String(text || "")).length, 1);
  return Math.max(420, chars * step);
}

function StitchText({
  text,
  className = "",
  start = 0,
  step = 70,
  wrap = false,
}) {
  const value = String(text || "");

  if (wrap) {
    const words = value.trim().split(/\s+/).filter(Boolean);
    let offset = 0;

    return (
      <span
        className={`std-envelope-video-save__stitch-text ${className} is-wrap`}
        aria-label={value}
      >
        {words.map((word, index) => {
          const chars = Math.max(Array.from(word).length, 1);
          const delay = start + offset * step;
          const duration = Math.max(260, chars * step);

          offset += chars + 1;

          return (
            <span
              key={`${word}-${index}`}
              className="std-envelope-video-save__stitch-word"
              aria-hidden="true"
              style={{
                "--stev-stitch-delay": `${delay}ms`,
                "--stev-stitch-duration": `${duration}ms`,
                "--stev-stitch-timing": `steps(${chars}, end)`,
              }}
            >
              <span className="std-envelope-video-save__stitch-ink">
                {word}
              </span>

              <span className="std-envelope-video-save__stitch-needle" />

              {index < words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </span>
    );
  }

  const chars = Math.max(Array.from(value).length, 1);
  const duration = Math.max(420, chars * step);

  return (
    <span
      className={`std-envelope-video-save__stitch-text ${className}`}
      aria-label={value}
      style={{
        "--stev-stitch-delay": `${start}ms`,
        "--stev-stitch-duration": `${duration}ms`,
        "--stev-stitch-timing": `steps(${chars}, end)`,
      }}
    >
      <span
        className="std-envelope-video-save__stitch-ink"
        aria-hidden="true"
      >
        {value}
      </span>

      <span
        className="std-envelope-video-save__stitch-needle"
        aria-hidden="true"
      />
    </span>
  );
}

/* =====================================================
   COMPONENT

   FLOW:
   closed -> opening -> stitch-card -> video -> monogram -> revealed
===================================================== */

function SaveTheDateEnvelopeVideo({
  slug = "save-the-date-envelope-video",
  brideName = "Ana",
  groomName = "Nikola",
  weddingDate = "19.06.2027.",
  venue = "Beograd",
  script = "latin",
  details = {},
  onStartMusic,
}) {
  const config = details.saveTheDate || {};

  const isCyrillic =
    script === "cyrillic" ||
    config.script === "cyrillic" ||
    details.script === "cyrillic";

  const isGerman =
    slug === "save-andjela-andrija-6" ||
    config.language === "de" ||
    details.language === "de";

  const copy = isGerman
    ? {
        eyebrow: "GEMEINSAM MIT UNSEREN FAMILIEN",
        introHint: "Tippt, um den Umschlag zu öffnen",
        opening: "Der Umschlag wird geöffnet…",
        message: "BITTE MERKT EUCH DEN TERMIN UNSERER HOCHZEIT VOR",
        signature: "Die offizielle Einladung folgt in Kürze",
        connector: "UND",
        countdownTitle: "Bis zu unserem großen Tag",
        days: "Tage",
        hours: "Stunden",
        minutes: "Minuten",
        today: "Heute ist unser großer Tag",
        addCalendar: "Zum Kalender hinzufügen",
        calendarNote: "Merkt euch den Termin für unseren besonderen Tag vor.",
        calendarTitle: `Save the Date - ${brideName} & ${groomName}`,
        ariaOpen: "Save-the-Date-Umschlag öffnen",
      }
    : isCyrillic
      ? {
          eyebrow: "ЗАЈЕДНО СА СВОЈИМ ПОРОДИЦАМА",
          introHint: "Додирните да отворите писмо",
          opening: "Отварамо писмо…",
          message: "МОЛИМО ВАС ДА САЧУВАТЕ ДАТУМ НАШЕГ ВЕНЧАЊА",
          signature: "Свечана позивница ускоро",
          connector: "И",
          countdownTitle: "До нашег дана",
          days: "Дана",
          hours: "Сати",
          minutes: "Минута",
          today: "Данас је наш дан",
          addCalendar: "Додај у календар",
          calendarNote: "Сачувајте датум за наш посебан дан.",
          calendarTitle: `Сачувајте датум - ${brideName} & ${groomName}`,
          ariaOpen: "Отвори Save the Date писмо",
        }
      : {
          eyebrow: "ZAJEDNO SA SVOJIM PORODICAMA",
          introHint: "Dodirnite da otvorite pismo",
          opening: "Otvaramo pismo…",
          message: "MOLIMO VAS DA SAČUVATE DATUM NAŠEG VENČANJA",
          signature: "Svečana pozivnica uskoro stiže",
          connector: "I",
          countdownTitle: "Do našeg dana",
          days: "Dana",
          hours: "Sati",
          minutes: "Minuta",
          today: "Danas je naš dan",
          addCalendar: "Dodaj u kalendar",
          calendarNote: "Sačuvajte datum za naš poseban dan.",
          calendarTitle: `Sačuvajte datum - ${brideName} & ${groomName}`,
          ariaOpen: "Otvori Save the Date pismo",
        };

  /* =====================================================
     CONFIG
  ===================================================== */

  const envelopeTopImage =
    config.envelopeTopImage ||
    `/images/save-the-date/envelope/${slug}-top.png`;

  const envelopeBottomImage =
    config.envelopeBottomImage ||
    `/images/save-the-date/envelope/${slug}-bottom.png`;

  const envelopeHingePercent = clampNumber(
    config.envelopeHingePercent,
    0,
    -20,
    100
  );

  const envelopeDurationMs = clampNumber(
    config.envelopeDurationMs,
    4800,
    900,
    8000
  );

  /*
    Isto ponašanje kao EnvelopeFlapVideoIntro:
    animacija koverte traje 4.8s, ali na polovini
    (2.4s) cela koverta nestaje i video odmah kreće.
  */
  const envelopeCutDelayMs = clampNumber(
    config.envelopeCutDelayMs,
    envelopeDurationMs / 2,
    0,
    envelopeDurationMs
  );

  const videoSrc = config.videoSrc || details.videoSrc || "";
  const videoPoster = config.videoPoster || "";
  const videoPosition = config.videoPosition || "center center";
  const videoMuted = config.videoMuted !== false;

  /*
    Safety limits:
    - assetPreloadTimeoutMs: do not leave the intro locked forever
    - videoWatchdogMs: absolute fallback if the browser never fires ended/error
    - videoStallTimeoutMs: skip a video that remains stalled/waiting too long
  */
  const assetPreloadTimeoutMs = clampNumber(
    config.assetPreloadTimeoutMs,
    6000,
    2500,
    20000
  );

  const videoWatchdogMs = clampNumber(
    config.videoWatchdogMs,
    18000,
    12000,
    180000
  );

  const videoStallTimeoutMs = clampNumber(
    config.videoStallTimeoutMs,
    8000,
    4000,
    30000
  );

  const stitchedCardImage =
    config.stitchedCardImage ||
    "/images/save-the-date/stitched-oval-transparent.png";

  const stitchCardDurationMs = clampNumber(
    config.stitchCardDurationMs,
    5600,
    3000,
    10000
  );

  const stitchLetterStepMs = clampNumber(
    config.stitchLetterStepMs,
    68,
    35,
    150
  );

  const stitchTextStartMs = clampNumber(
    config.stitchTextStartMs,
    550,
    0,
    2500
  );

  const monogramDurationMs = clampNumber(
    config.monogramDurationMs,
    3200,
    900,
    6000
  );

  const brideInitial = brideName.trim().charAt(0).toUpperCase();
  const groomInitial = groomName.trim().charAt(0).toUpperCase();

  const pageBackground = config.pageBackground || "#f1ece3";
  const paperColor = config.paperColor || "#fbf6ef";
  const inkColor = config.inkColor || "#4a4038";
  const mutedColor = config.mutedColor || "#8b8075";
  const accentColor = config.accentColor || "#b89a6f";

  const cardArtImage =
    config.cardArtImage === false
      ? ""
      : config.cardArtImage || "/images/save-the-date/floral-oval-blank.png";

  const backgroundImage =
    config.backgroundImage === false ? "" : config.backgroundImage || "";

  const backgroundPosition = config.backgroundPosition || "center top";

  const backgroundOverlay = clampNumber(
    config.backgroundOverlay,
    0,
    0,
    1
  );

  const cardTextureImage =
    config.cardTextureImage === false
      ? ""
      : config.cardTextureImage || "";

  const showCountdown = config.showCountdown === true;
  const showCalendarButton = config.showCalendarButton !== false;

  const calendarDateISO =
    config.dateISO ||
    details.dateISO ||
    dateDisplayToISO(weddingDate);

  const targetDate = useMemo(
    () => parseTargetDate(calendarDateISO),
    [calendarDateISO]
  );

  const dateParts = useMemo(
    () => splitDisplayDate(weddingDate),
    [weddingDate]
  );

  const [countdown, setCountdown] = useState(() =>
    getCountdown(targetDate)
  );

  const [assets, setAssets] = useState("loading");
  const [phase, setPhase] = useState("closed");

  const openedRef = useRef(false);
  const videoFinishedRef = useRef(false);
  const openTimerRef = useRef(null);
  const stitchTimerRef = useRef(null);
  const monogramTimerRef = useRef(null);

  const videoWatchdogRef = useRef(null);
  const videoStallTimerRef = useRef(null);

  const videoRef = useRef(null);

  /* =====================================================
     PRELOAD — SAFE / NON-BLOCKING
  ===================================================== */

  useEffect(() => {
    let active = true;

    setAssets("loading");
    setPhase("closed");

    openedRef.current = false;
    videoFinishedRef.current = false;

    if (videoRef.current) {
      videoRef.current.pause();

      try {
        videoRef.current.currentTime = 0;
      } catch {
        // Metadata may not be available yet on some mobile browsers.
      }
    }

    /*
      These three assets are required for the envelope sequence.
      If one fails, we do NOT leave the user stuck. The click will
      gracefully skip the envelope/card and continue to the video.
    */
    const essentialSources = [
      envelopeBottomImage,
      envelopeTopImage,
      stitchedCardImage,
    ].filter(Boolean);

    /*
      These are only warmed into the browser cache.
      Their failure must never block the intro.
    */
    const warmSources = [
      videoPoster,
      cardArtImage,
      backgroundImage,
      cardTextureImage,
    ]
      .filter(Boolean)
      .filter(
        (src, index, array) =>
          array.indexOf(src) === index &&
          !essentialSources.includes(src)
      );

    let settled = 0;
    let failed = 0;

    const finishEssential = (didFail = false) => {
      if (!active) return;

      settled += 1;

      if (didFail) {
        failed += 1;
      }

      if (settled >= essentialSources.length) {
        setAssets(failed > 0 ? "error" : "ready");
      }
    };

    const essentialImages = essentialSources.map((src) => {
      const image = new Image();
      let done = false;

      const finish = (didFail) => {
        if (done) return;

        done = true;
        finishEssential(didFail);
      };

      image.onload = () => finish(false);
      image.onerror = () => finish(true);
      image.src = src;

      /*
        Cached images can already be complete before the handlers
        get a chance to fire consistently on every browser.
      */
      if (image.complete) {
        if (image.naturalWidth > 0) {
          finish(false);
        } else {
          finish(true);
        }
      }

      return image;
    });

    const warmImages = warmSources.map((src) => {
      const image = new Image();

      image.onload = null;
      image.onerror = null;
      image.src = src;

      return image;
    });

    if (essentialSources.length === 0) {
      setAssets("ready");
    }

    /*
      Critical fallback:
      never leave the open button disabled forever on a bad/slow
      connection. "error" means openEnvelope will skip directly
      to video/final instead of freezing.
    */
    const fallbackTimer = window.setTimeout(() => {
      if (!active) return;

      setAssets((current) =>
        current === "loading" ? "error" : current
      );
    }, assetPreloadTimeoutMs);

    return () => {
      active = false;

      window.clearTimeout(fallbackTimer);

      essentialImages.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });

      warmImages.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
    };
  }, [
    envelopeBottomImage,
    envelopeTopImage,
    stitchedCardImage,
    videoPoster,
    cardArtImage,
    backgroundImage,
    cardTextureImage,
    assetPreloadTimeoutMs,
  ]);

  /* =====================================================
     LOCK SCROLL DURING INTRO
  ===================================================== */

  useEffect(() => {
    if (phase === "revealed") return undefined;

    const bodyOverflow = document.body.style.overflow;
    const htmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = htmlOverflow;
    };
  }, [phase]);

  /* =====================================================
     COUNTDOWN
  ===================================================== */

  useEffect(() => {
    setCountdown(getCountdown(targetDate));

    const interval = window.setInterval(() => {
      setCountdown(getCountdown(targetDate));
    }, 60000);

    return () => window.clearInterval(interval);
  }, [targetDate]);

  /* =====================================================
     CLEANUP
  ===================================================== */

  const clearVideoSafetyTimers = useCallback(() => {
    if (videoWatchdogRef.current) {
      window.clearTimeout(videoWatchdogRef.current);
      videoWatchdogRef.current = null;
    }

    if (videoStallTimerRef.current) {
      window.clearTimeout(videoStallTimerRef.current);
      videoStallTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (openTimerRef.current) {
        window.clearTimeout(openTimerRef.current);
      }

      if (stitchTimerRef.current) {
        window.clearTimeout(stitchTimerRef.current);
      }

      if (monogramTimerRef.current) {
        window.clearTimeout(monogramTimerRef.current);
      }

      if (videoWatchdogRef.current) {
        window.clearTimeout(videoWatchdogRef.current);
      }

      if (videoStallTimerRef.current) {
        window.clearTimeout(videoStallTimerRef.current);
      }
    };
  }, []);

  /* =====================================================
     VIDEO -> MONOGRAM -> FINAL
     Hardened for Safari / slow mobile connections.
  ===================================================== */

  const finishVideo = useCallback(() => {
    if (videoFinishedRef.current) return;

    videoFinishedRef.current = true;

    clearVideoSafetyTimers();

    const video = videoRef.current;

    if (video) {
      try {
        video.pause();
      } catch {
        // Ignore browser-specific media errors during cleanup.
      }
    }

    setPhase("monogram");

    if (monogramTimerRef.current) {
      window.clearTimeout(monogramTimerRef.current);
    }

    monogramTimerRef.current = window.setTimeout(() => {
      setPhase("revealed");
    }, monogramDurationMs);
  }, [clearVideoSafetyTimers, monogramDurationMs]);

  const scheduleVideoWatchdog = useCallback(
    (video) => {
      if (videoWatchdogRef.current) {
        window.clearTimeout(videoWatchdogRef.current);
      }

      /*
        If duration is known, always allow the full video plus a safety
        margin. Otherwise use the configured watchdog.
      */
      const durationMs =
        video &&
        Number.isFinite(video.duration) &&
        video.duration > 0
          ? Math.ceil(video.duration * 1000) + 8000
          : 0;

      const timeoutMs = Math.max(
        videoWatchdogMs,
        durationMs
      );

      videoWatchdogRef.current = window.setTimeout(() => {
        finishVideo();
      }, timeoutMs);
    },
    [finishVideo, videoWatchdogMs]
  );

  const clearVideoStallTimer = useCallback(() => {
    if (videoStallTimerRef.current) {
      window.clearTimeout(videoStallTimerRef.current);
      videoStallTimerRef.current = null;
    }
  }, []);

  const handleVideoWaiting = useCallback(() => {
    if (videoFinishedRef.current) return;

    clearVideoStallTimer();

    videoStallTimerRef.current = window.setTimeout(() => {
      finishVideo();
    }, videoStallTimeoutMs);
  }, [
    clearVideoStallTimer,
    finishVideo,
    videoStallTimeoutMs,
  ]);

  const handleVideoPlaying = useCallback(() => {
    clearVideoStallTimer();
  }, [clearVideoStallTimer]);

  const handleVideoLoadedMetadata = useCallback(() => {
    const video = videoRef.current;

    if (!video || videoFinishedRef.current) return;

    scheduleVideoWatchdog(video);
  }, [scheduleVideoWatchdog]);

  const startVideo = useCallback(() => {
    if (!videoSrc) {
      finishVideo();
      return;
    }

    videoFinishedRef.current = false;

    clearVideoSafetyTimers();

    setPhase("video");

    window.requestAnimationFrame(() => {
      const video = videoRef.current;

      if (!video) {
        finishVideo();
        return;
      }

      try {
        video.currentTime = 0;
      } catch {
        // Some Safari versions reject currentTime before metadata.
      }

      video.muted = videoMuted;

      /*
        Start the watchdog before play(). Even if the promise never
        settles correctly, the intro still cannot remain stuck forever.
      */
      scheduleVideoWatchdog(video);

      const tryPlay = () => {
        try {
          return video.play();
        } catch {
          return Promise.reject(
            new Error("Video playback failed")
          );
        }
      };

      const playPromise = tryPlay();

      if (playPromise?.catch) {
        playPromise.catch(() => {
          /*
            Delayed autoplay may lose the original user gesture.
            Retry muted. If even muted playback fails, continue to
            monogram/final instead of leaving a black screen.
          */
          video.muted = true;

          const mutedPlayPromise = tryPlay();

          if (mutedPlayPromise?.catch) {
            mutedPlayPromise.catch(finishVideo);
          }
        });
      }
    });
  }, [
    clearVideoSafetyTimers,
    finishVideo,
    scheduleVideoWatchdog,
    videoMuted,
    videoSrc,
  ]);

  const startStitchedCard = useCallback(() => {
    setPhase("stitch-card");

    if (stitchTimerRef.current) {
      window.clearTimeout(stitchTimerRef.current);
    }

    stitchTimerRef.current = window.setTimeout(() => {
      startVideo();
    }, stitchCardDurationMs);
  }, [startVideo, stitchCardDurationMs]);

  const openEnvelope = useCallback(() => {
    if (openedRef.current || assets === "loading") return;

    // Muzika kreće odmah na klik za otvaranje pisma.
    onStartMusic?.();

    openedRef.current = true;
    videoFinishedRef.current = false;

    if (assets === "error") {
      startVideo();
      return;
    }

    setPhase("opening");

    openTimerRef.current = window.setTimeout(() => {
      startStitchedCard();
    }, envelopeCutDelayMs);
  }, [
    assets,
    envelopeCutDelayMs,
    startStitchedCard,
    startVideo,
    onStartMusic,
  ]);

  /* =====================================================
     CALENDAR
  ===================================================== */

  const handleAddToCalendar = useCallback(() => {
    if (!calendarDateISO) return;

    addToCalendar({
      brideName,
      groomName,
      dateISO: calendarDateISO,
      venue,
      mapLink: config.mapLink || details.mapLink || "",
      note: config.calendarDescription || copy.calendarNote,
      eventType: "save-the-date",
      eventTitle: config.calendarTitle || copy.calendarTitle,
      allDay: true,
      language: isGerman ? "de" : "sr",
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
    isGerman,
  ]);

  /* =====================================================
     STYLE VARIABLES
  ===================================================== */

  const style = {
    "--ste-page-background": pageBackground,
    "--ste-paper": paperColor,
    "--ste-ink": inkColor,
    "--ste-muted": mutedColor,
    "--ste-accent": accentColor,
    "--ste-bg-image": backgroundImage
      ? `url(${JSON.stringify(backgroundImage)})`
      : "none",
    "--ste-bg-position": backgroundPosition,
    "--ste-bg-overlay": backgroundOverlay,
    "--ste-card-texture": cardTextureImage
      ? `url(${JSON.stringify(cardTextureImage)})`
      : "none",
    "--ste-card-art": cardArtImage
      ? `url(${JSON.stringify(cardArtImage)})`
      : "none",
    "--ste-name-factor": Math.min(
      1,
      8.5 / Math.max(brideName.length, groomName.length, 1)
    ),
    "--ste-envelope-hinge": `${envelopeHingePercent}%`,
    "--ste-envelope-duration": `${envelopeDurationMs}ms`,
    "--stev-video-position": videoPosition,
    "--stev-monogram-color": config.monogramColor || "#ffffff",
    "--stev-envelope-resume-delay": `-${envelopeCutDelayMs}ms`,
  };

  const message = config.message || copy.message;
  const eyebrow = config.eyebrow || copy.eyebrow;
  const signature = config.signature || copy.signature;
  const connector = config.connector || copy.connector;
  const countdownTitle = config.countdownTitle || copy.countdownTitle;

  const monthLabel = dateParts.fallback
    ? ""
    : getMonthLabel(dateParts.month, isCyrillic, isGerman);

  const formattedDateLine = dateParts.fallback
    ? weddingDate
    : `${dateParts.day}. ${monthLabel} ${dateParts.year}.`;

  const venueLabel = String(venue || "").trim().toUpperCase();

  const stitchConnector = isGerman
    ? "und"
    : isCyrillic
      ? "и"
      : "i";

  const stitchedNames = `${brideName} ${stitchConnector} ${groomName}`;

  const stitchedSaveDate = isGerman
    ? "Termin vormerken"
    : isCyrillic
      ? "Сачувајте датум"
      : "Sačuvajte datum";
  const stitchedDate = dateParts.fallback
    ? weddingDate
    : `${dateParts.day} / ${dateParts.month} / ${dateParts.year}`;

  const stitchNamesStart = stitchTextStartMs;
  const stitchNamesEnd =
    stitchNamesStart + stitchedNames.length * stitchLetterStepMs;
  const stitchDividerStart = stitchNamesEnd + 180;
  const stitchTitleStart = stitchDividerStart + 450;
  const stitchTitleEnd =
    stitchTitleStart + stitchedSaveDate.length * stitchLetterStepMs;
  const stitchDateStart = stitchTitleEnd + 280;

  /* =====================================================
     FINAL CARD — STITCH TIMING
     Starts only when phase becomes "revealed".
  ===================================================== */

  const finalEyebrowStep = 22;
  const finalNameStep = 54;
  const finalConnectorStep = 70;
  const finalMessageStep = 20;
  const finalDateStep = 44;
  const finalVenueStep = 27;
  const finalSignatureStep = 28;

  const finalEyebrowStart = 180;

  const finalBrideStart =
    finalEyebrowStart +
    getStitchDuration(eyebrow, finalEyebrowStep) +
    140;

  const finalConnectorStart =
    finalBrideStart +
    getStitchDuration(brideName, finalNameStep) +
    70;

  const finalGroomStart =
    finalConnectorStart +
    getStitchDuration(connector, finalConnectorStep) +
    70;

  const finalMessageStart =
    finalGroomStart +
    getStitchDuration(groomName, finalNameStep) +
    220;

  const finalDateStart =
    finalMessageStart +
    getStitchDuration(message, finalMessageStep) +
    240;

  const finalVenueStart =
    finalDateStart +
    getStitchDuration(formattedDateLine, finalDateStep) +
    220;

  const finalSignatureStart =
    (venueLabel
      ? finalVenueStart +
        getStitchDuration(venueLabel, finalVenueStep)
      : finalDateStart +
        getStitchDuration(formattedDateLine, finalDateStep)) +
    210;

  const finalExtrasStart =
    finalSignatureStart +
    getStitchDuration(signature, finalSignatureStep) +
    420;

  return (
    <section
      className={`std-envelope-save std-envelope-video-save ${
        isCyrillic ? "is-cyrillic" : ""
      }`}
      data-phase={phase}
      style={style}
    >
      <div className="std-envelope-save__ambient" aria-hidden="true" />

      {/* =================================================
          FINAL SAVE THE DATE INFO
          Same information layout as SaveTheDateEnvelope
      ================================================= */}

      <main className="std-envelope-save__content">
        <article className="std-envelope-save__paper">
          <div className="std-envelope-save__paper-inner">
            <p className="std-envelope-save__eyebrow">
              <StitchText
                text={eyebrow}
                className="std-envelope-save__final-stitch"
                start={finalEyebrowStart}
                step={finalEyebrowStep}
                wrap
              />
            </p>

            <div
              className="std-envelope-save__names"
              aria-label={`${brideName} ${isGerman ? "und" : isCyrillic ? "и" : "i"} ${groomName}`}
            >
              <StitchText
                text={brideName}
                className="std-envelope-save__final-stitch"
                start={finalBrideStart}
                step={finalNameStep}
              />

              <span className="std-envelope-save__amp">
                <StitchText
                  text={connector}
                  className="std-envelope-save__final-stitch"
                  start={finalConnectorStart}
                  step={finalConnectorStep}
                />
              </span>

              <StitchText
                text={groomName}
                className="std-envelope-save__final-stitch"
                start={finalGroomStart}
                step={finalNameStep}
              />
            </div>

            <p className="std-envelope-save__message">
              <StitchText
                text={message}
                className="std-envelope-save__final-stitch"
                start={finalMessageStart}
                step={finalMessageStep}
                wrap
              />
            </p>

            <div className="std-envelope-save__date-block">
              <p
                className="std-envelope-save__date-line"
                aria-label={weddingDate}
              >
                <StitchText
                  text={formattedDateLine}
                  className="std-envelope-save__final-stitch"
                  start={finalDateStart}
                  step={finalDateStep}
                />
              </p>
            </div>

            {venueLabel && (
              <p className="std-envelope-save__venue">
                <StitchText
                  text={venueLabel}
                  className="std-envelope-save__final-stitch"
                  start={finalVenueStart}
                  step={finalVenueStep}
                  wrap
                />
              </p>
            )}

            <p className="std-envelope-save__signature">
              <StitchText
                text={signature}
                className="std-envelope-save__final-stitch"
                start={finalSignatureStart}
                step={finalSignatureStep}
                wrap
              />
            </p>
          </div>
        </article>

        {(showCountdown || (showCalendarButton && calendarDateISO)) && (
          <aside className="std-envelope-save__extras">
            {showCountdown && (
              <section
                className="std-envelope-save__countdown"
                aria-label={countdownTitle}
                style={{
                  "--stev-final-extra-delay": `${finalExtrasStart}ms`,
                }}
              >
                <p className="std-envelope-save__countdown-title">
                  {countdown.finished ? copy.today : countdownTitle}
                </p>

                {!countdown.finished && (
                  <div className="std-envelope-save__countdown-grid">
                    <div>
                      <strong>{countdown.days}</strong>
                      <span>{copy.days}</span>
                    </div>

                    <span className="std-envelope-save__countdown-separator" />

                    <div>
                      <strong>{padNumber(countdown.hours)}</strong>
                      <span>{copy.hours}</span>
                    </div>

                    <span className="std-envelope-save__countdown-separator" />

                    <div>
                      <strong>{padNumber(countdown.minutes)}</strong>
                      <span>{copy.minutes}</span>
                    </div>
                  </div>
                )}
              </section>
            )}

            {showCalendarButton && calendarDateISO && (
              <button
                type="button"
                className="std-envelope-save__calendar"
                onClick={handleAddToCalendar}
                style={{
                  "--stev-final-extra-delay": `${finalExtrasStart + 280}ms`,
                }}
              >
                <span
                  className="std-envelope-save__calendar-icon"
                  aria-hidden="true"
                >
                  +
                </span>
                <span>{copy.addCalendar}</span>
              </button>
            )}
          </aside>
        )}
      </main>

      {/* =================================================
          INTRO: ENVELOPE -> STITCHED CARD -> VIDEO -> MONOGRAM
      ================================================= */}

      <div
        className="std-envelope-save__intro"
        aria-hidden={phase === "revealed"}
      >
        <div className="std-envelope-save__intro-glow" aria-hidden="true" />

        <div className="std-envelope-video-save__film" aria-hidden="true">
          {videoSrc && (
            <video
              ref={videoRef}
              className="std-envelope-video-save__video"
              src={videoSrc}
              poster={videoPoster || undefined}
              preload="auto"
              playsInline
              muted={videoMuted}
              onLoadedMetadata={handleVideoLoadedMetadata}
              onCanPlay={handleVideoPlaying}
              onPlaying={handleVideoPlaying}
              onWaiting={handleVideoWaiting}
              onStalled={handleVideoWaiting}
              onEnded={finishVideo}
              onError={finishVideo}
            />
          )}

          <div className="std-envelope-video-save__darken" />

          <div className="std-envelope-video-save__monogram">
            <div
              className="std-envelope-video-save__photo-script-initials"
              aria-label={`${brideInitial} & ${groomInitial}`}
            >
              <span className="std-envelope-video-save__photo-script-initial">
                {brideInitial}
              </span>

              <span className="std-envelope-video-save__photo-script-and">
                &
              </span>

              <span className="std-envelope-video-save__photo-script-initial">
                {groomInitial}
              </span>
            </div>
          </div>
        </div>

        {assets === "ready" ? (
          <div className="std-envelope-save__envelope-stage" aria-hidden="true">
            <div className="std-envelope-save__envelope-canvas">
              {/* Base envelope stays behind the insert. */}
              <img
                className="std-envelope-save__envelope-bottom"
                src={envelopeBottomImage}
                alt=""
                draggable={false}
              />

              {/* Oval insert rises out of the envelope. */}
              <div
                className="std-envelope-video-save__stitch-card"
                aria-hidden={phase !== "stitch-card"}
              >
                <img
                  className="std-envelope-video-save__stitch-card-image"
                  src={stitchedCardImage}
                  alt=""
                  draggable={false}
                />

                <div className="std-envelope-video-save__stitch-copy">
                  <StitchText
                    text={stitchedNames}
                    className="std-envelope-video-save__stitch-names"
                    start={stitchNamesStart}
                    step={stitchLetterStepMs}
                  />

                  <div
                    className="std-envelope-video-save__stitch-divider"
                    style={{
                      "--stev-divider-delay": `${stitchDividerStart}ms`,
                    }}
                  >
                    <span />
                    <i>♡</i>
                    <span />
                  </div>

                  <StitchText
                    text={stitchedSaveDate}
                    className="std-envelope-video-save__stitch-title"
                    start={stitchTitleStart}
                    step={stitchLetterStepMs}
                  />

                  <StitchText
                    text={stitchedDate}
                    className="std-envelope-video-save__stitch-date"
                    start={stitchDateStart}
                    step={Math.max(45, stitchLetterStepMs - 10)}
                  />
                </div>
              </div>

              {/*
                Duplicate only the FRONT pocket over the insert.
                This is what makes the oval look like it is physically
                coming out of the envelope instead of floating over it.
              */}
              <img
                className="std-envelope-video-save__envelope-front-mask"
                src={envelopeBottomImage}
                alt=""
                draggable={false}
              />

              <div className="std-envelope-save__envelope-shadow" />

              <div className="std-envelope-save__envelope-flap">
                <img
                  src={envelopeTopImage}
                  alt=""
                  draggable={false}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="std-envelope-save__asset-state" aria-hidden="true">
            <span className="std-envelope-save__asset-dot" />
          </div>
        )}

        <div className="std-envelope-save__intro-copy" aria-hidden="true">
          <p>{eyebrow}</p>
          <span>
            {phase === "opening"
              ? copy.opening
              : config.envelopeHint || copy.introHint}
          </span>
        </div>

        <button
          type="button"
          className="std-envelope-save__open-button"
          onClick={openEnvelope}
          disabled={assets === "loading" || phase !== "closed"}
          aria-label={copy.ariaOpen}
        />
      </div>
    </section>
  );
}

export default SaveTheDateEnvelopeVideo;
