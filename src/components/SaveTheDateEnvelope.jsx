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

function getMonthLabel(month, isCyrillic) {
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

  const months = isCyrillic ? cyrillicMonths : latinMonths;

  return months[monthIndex] || month || "";
}


/* =====================================================
   COMPONENT
===================================================== */

function SaveTheDateEnvelope({
  slug = "save-the-date",
  brideName = "Iva",
  groomName = "Marko",
  weddingDate = "20.06.2027.",
  venue = "Beograd",
  script = "latin",
  details = {},
}) {
  const config = details.saveTheDate || {};

  const isCyrillic =
    script === "cyrillic" ||
    config.script === "cyrillic" ||
    details.script === "cyrillic";

  const copy = isCyrillic
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
    3800,
    1000,
    5000
  );

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

  const backgroundPosition =
    config.backgroundPosition || "center top";

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
  const openTimerRef = useRef(null);

  /* =====================================================
     PRELOAD ENVELOPE
  ===================================================== */

  useEffect(() => {
    let active = true;
    let loaded = 0;

    setAssets("loading");
    setPhase("closed");
    openedRef.current = false;

    const markLoaded = () => {
      loaded += 1;

      if (active && loaded === 2) {
        setAssets("ready");
      }
    };

    const images = [envelopeBottomImage, envelopeTopImage].map((src) => {
      const image = new Image();

      image.onload = markLoaded;
      image.onerror = () => {
        if (active) {
          setAssets("error");
        }
      };
      image.src = src;

      return image;
    });

    const fallbackTimer = window.setTimeout(() => {
      if (active && loaded !== 2) {
        setAssets("error");
      }
    }, 9000);

    return () => {
      active = false;
      window.clearTimeout(fallbackTimer);

      images.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
    };
  }, [envelopeBottomImage, envelopeTopImage]);

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

  useEffect(() => {
    return () => {
      if (openTimerRef.current) {
        window.clearTimeout(openTimerRef.current);
      }
    };
  }, []);

  /* =====================================================
     OPEN
  ===================================================== */

  const openEnvelope = useCallback(() => {
    if (openedRef.current || assets === "loading") return;

    openedRef.current = true;

    if (assets === "error") {
      setPhase("revealed");
      return;
    }

    setPhase("opening");

    openTimerRef.current = window.setTimeout(() => {
      setPhase("revealed");
    }, envelopeDurationMs + 520);
  }, [assets, envelopeDurationMs]);

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
      language: isCyrillic ? "sr" : "sr",
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
    isCyrillic,
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
  };

  const message = config.message || copy.message;
  const eyebrow = config.eyebrow || copy.eyebrow;
  const signature = config.signature || copy.signature;
  const connector = config.connector || copy.connector;
  const countdownTitle = config.countdownTitle || copy.countdownTitle;

  const monthLabel = dateParts.fallback
    ? ""
    : getMonthLabel(dateParts.month, isCyrillic);

  const formattedDateLine = dateParts.fallback
    ? weddingDate
    : `${dateParts.day}. ${monthLabel} ${dateParts.year}.`;

  const venueLabel = String(venue || "").trim().toUpperCase();

  return (
    <section
      className={`std-envelope-save ${isCyrillic ? "is-cyrillic" : ""}`}
      data-phase={phase}
      style={style}
    >
      <div className="std-envelope-save__ambient" aria-hidden="true" />

      {/* =================================================
          FINAL SAVE THE DATE CARD
      ================================================= */}

      <main className="std-envelope-save__content">
        <article className="std-envelope-save__paper">
          <div className="std-envelope-save__paper-inner">
            <p className="std-envelope-save__eyebrow">{eyebrow}</p>

            <div className="std-envelope-save__names" aria-label={`${brideName} i ${groomName}`}>
              <span>{brideName}</span>
              <span className="std-envelope-save__amp">{connector}</span>
              <span>{groomName}</span>
            </div>

            <p className="std-envelope-save__message">{message}</p>

            <div className="std-envelope-save__date-block">
              <p className="std-envelope-save__date-line" aria-label={weddingDate}>
                {formattedDateLine}
              </p>
            </div>

            {venueLabel && (
              <p className="std-envelope-save__venue">{venueLabel}</p>
            )}

            <p className="std-envelope-save__signature">{signature}</p>
          </div>
        </article>

        {(showCountdown || (showCalendarButton && calendarDateISO)) && (
          <aside className="std-envelope-save__extras">
            {showCountdown && (
              <section className="std-envelope-save__countdown" aria-label={countdownTitle}>
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
              >
                <span className="std-envelope-save__calendar-icon" aria-hidden="true">
                  +
                </span>
                <span>{copy.addCalendar}</span>
              </button>
            )}
          </aside>
        )}
      </main>

      {/* =================================================
          ENVELOPE INTRO
      ================================================= */}

      <div className="std-envelope-save__intro" aria-hidden={phase === "revealed"}>
        <div className="std-envelope-save__intro-glow" aria-hidden="true" />

        {assets === "ready" ? (
          <div className="std-envelope-save__envelope-stage" aria-hidden="true">
            <div className="std-envelope-save__envelope-canvas">
              <img
                className="std-envelope-save__envelope-bottom"
                src={envelopeBottomImage}
                alt=""
                draggable={false}
              />

              <div className="std-envelope-save__preview-card">
                <div className="std-envelope-save__preview-card-inner">
                  <div
                    className="std-envelope-save__preview-initials"
                    aria-label={`${brideName.trim().charAt(0)} ${groomName.trim().charAt(0)}`}
                  >
                    <span>{brideName.trim().charAt(0)}</span>
                    <span>{groomName.trim().charAt(0)}</span>
                  </div>

                  <p className="std-envelope-save__preview-date">
                    {formattedDateLine}
                  </p>
                </div>
              </div>

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
          <span>{phase === "opening" ? copy.opening : config.envelopeHint || copy.introHint}</span>
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

export default SaveTheDateEnvelope;
