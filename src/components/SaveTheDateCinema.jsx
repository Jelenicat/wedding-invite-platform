import { useEffect, useId, useRef, useState } from "react";
import { addToCalendar } from "../utils/calendar";
import "../styles/saveTheDateCinema.css";

const COPY = {
  sr: {
    connector: "i",
    open: "Pogledajte detalje",
    eyebrow: "Zajedno sa svojim porodicama",
    message: "Molimo vas da sačuvate datum našeg venčanja",
    signature: "Svečana pozivnica uskoro stiže",
    countdownTitle: "Do našeg dana",
    units: ["Dana", "Sati", "Minuta"],
    today: "Danas je naš dan",
    locationButton: "Pogledajte lokaciju",
    calendarButton: "Dodaj u kalendar",
    calendarTitle: "Sačuvajte datum",
    calendarDescription: "Sačuvajte datum za naš poseban dan.",
    pauseVideo: "Pauziraj video",
    playVideo: "Pokreni video",
  },
  de: {
    connector: "und",
    open: "Details ansehen",
    eyebrow: "Gemeinsam mit unseren Familien",
    message: "Bitte merkt euch den Termin unserer Hochzeit vor",
    signature: "Die offizielle Einladung folgt in Kürze",
    countdownTitle: "Bis zu unserem großen Tag",
    units: ["Tage", "Stunden", "Minuten"],
    today: "Heute ist unser großer Tag",
    locationButton: "Ort auf der Karte ansehen",
    calendarButton: "Zum Kalender hinzufügen",
    calendarTitle: "Save the Date",
    calendarDescription: "Merkt euch den Termin für unseren besonderen Tag vor.",
    pauseVideo: "Video pausieren",
    playVideo: "Video abspielen",
  },
  "sr-Cyrl": {
    connector: "и",
    open: "Погледајте детаље",
    eyebrow: "Заједно са својим породицама",
    message: "Молимо вас да сачувате датум нашег венчања",
    signature: "Свечана позивница ускоро стиже",
    countdownTitle: "До нашег дана",
    units: ["Дана", "Сати", "Минута"],
    today: "Данас је наш дан",
    locationButton: "Погледајте локацију",
    calendarButton: "Додај у календар",
    calendarTitle: "Сачувајте датум",
    calendarDescription: "Сачувајте датум за наш посебан дан.",
    pauseVideo: "Паузирај видео",
    playVideo: "Покрени видео",
  },
};

function dateDisplayToISO(value) {
  const match = /^(\d{1,2})\.(\d{1,2})\.(\d{4})\.?$/.exec(value.trim());
  if (!match) return "";

  const [, day, month, year] = match;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function getEventDate(dateISO) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateISO)) return null;

  const target = new Date(`${dateISO}T00:00:00`);
  const [, month, day] = dateISO.split("-");
  if (target.getMonth() + 1 !== Number(month) || target.getDate() !== Number(day)) {
    return null;
  }

  return target;
}

function CinemaCountdown({ target, copy }) {
  const [now, setNow] = useState(Date.now);
  const remaining = target.getTime() - now;
  const finished = remaining <= 0;
  const totalMinutes = Math.ceil(Math.max(0, remaining) / 60000);
  const values = [
    Math.floor(totalMinutes / 1440),
    Math.floor((totalMinutes % 1440) / 60),
    totalMinutes % 60,
  ];

  useEffect(() => {
    if (finished) return;

    const delay = (remaining % 60000) || 60000;
    const timeout = window.setTimeout(() => setNow(Date.now()), delay);
    return () => window.clearTimeout(timeout);
  }, [finished, remaining]);

  return (
    <div className="std-cinema__countdown">
      <p className="std-cinema__label">{finished ? copy.today : copy.countdownTitle}</p>
      {!finished && (
        <dl className="std-cinema__countdown-grid">
          {copy.units.map((unit, index) => (
            <div key={unit}>
              <dt>{unit}</dt>
              <dd>{String(values[index]).padStart(index === 0 ? 1 : 2, "0")}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

function CinemaBackground({ videoSrc, poster, position, posterPosition, copy, heroRef }) {
  const videoRef = useRef(null);
  const heroVisible = useRef(true);
  const [playing, setPlaying] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);
  const [failed, setFailed] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || failed) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      if (motion.matches || document.hidden || !heroVisible.current) {
        video.pause();
      } else if (!userPaused.current) {
        video.play().catch(() => {});
      }
    };

    syncPlayback();
    motion.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    const observer = new IntersectionObserver(
      ([entry]) => {
        heroVisible.current = entry.intersectionRatio >= 0.45;
        syncPlayback();
      },
      { threshold: 0.45 }
    );
    if (heroRef.current) observer.observe(heroRef.current);

    return () => {
      video.pause();
      motion.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      observer.disconnect();
    };
  }, [videoSrc, failed, heroRef]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    userPaused.current = !video.paused;
    if (userPaused.current) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  };

  return (
    <>
      <div
        className="std-cinema__backdrop"
        aria-hidden="true"
        style={{
          "--std-cinema-position": position,
          "--std-cinema-poster-position": posterPosition,
        }}
      >
        {poster && <img className="std-cinema__poster" src={poster} alt="" />}
        {videoSrc && !failed && (
          <video
            ref={videoRef}
            className="std-cinema__video"
            data-visible={hasFrame}
            src={videoSrc}
            preload="metadata"
            muted
            loop
            playsInline
            disablePictureInPicture
            onPlaying={() => {
              setHasFrame(true);
              setPlaying(true);
            }}
            onPause={() => setPlaying(false)}
            onError={() => setFailed(true)}
          />
        )}
      </div>
      <div className="std-cinema__shade" aria-hidden="true" />
      {videoSrc && !failed && (
        <button
          type="button"
          className="std-cinema__video-toggle"
          onClick={togglePlayback}
          aria-label={playing ? copy.pauseVideo : copy.playVideo}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            {playing ? (
              <path d="M6 4h2v12H6zm6 0h2v12h-2z" />
            ) : (
              <path d="m7 4 9 6-9 6z" />
            )}
          </svg>
        </button>
      )}
    </>
  );
}

export default function SaveTheDateCinema({
  brideName,
  groomName,
  weddingDate = "",
  venue,
  script = "latin",
  details = {},
  musicStarted,
  onStartMusic,
}) {
  const config = details.saveTheDate || {};
  const date = weddingDate || details.date || "";
  const venueName = venue || details.venue || "";
  const mapLink = config.mapLink || details.mapLink || "";
  const dateISO = config.dateISO || details.dateISO || dateDisplayToISO(date);
  const target = getEventDate(dateISO);
  const videoSrc = config.videoSrc || details.videoSrc;
  const showCountdown = config.showCountdown === true && Boolean(target);
  const showCalendar = config.showCalendarButton !== false && Boolean(target);
  const [language, setLanguage] = useState(details.defaultLanguage || "sr");
  const heroRef = useRef(null);
  const detailsRef = useRef(null);
  const headingRef = useRef(null);
  const detailsId = useId();
  const displayLanguage =
    language === "de" ? "de" : script === "cyrillic" ? "sr-Cyrl" : "sr";
  const names = `${brideName} & ${groomName}`;
  const copy = COPY[displayLanguage];

  const openDetails = () => {
    if (!musicStarted) onStartMusic?.();
    headingRef.current?.focus({ preventScroll: true });
    detailsRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
  };

  const handleAddToCalendar = () => {
    addToCalendar({
      brideName,
      groomName,
      dateISO,
      venue: venueName,
      mapLink,
      note: copy.calendarDescription,
      eventType: "save-the-date",
      eventTitle: `${copy.calendarTitle} - ${names}`,
      allDay: true,
      language: language === "de" ? "de" : "sr",
    });
  };

  return (
    <main className="std-cinema" lang={displayLanguage}>
      <header ref={heroRef} className="std-cinema__hero">
        <CinemaBackground
          key={videoSrc}
          videoSrc={videoSrc}
          poster={config.videoPoster}
          position={config.videoPosition || "center center"}
          posterPosition={config.posterPosition}
          copy={copy}
          heroRef={heroRef}
        />

        {details.showLanguageSwitcher && (
          <div className="std-cinema__languages" role="group" aria-label="Jezik / Sprache">
            <button
              type="button"
              lang="sr"
              aria-label="Srpski"
              aria-pressed={language !== "de"}
              onClick={() => setLanguage("sr")}
            >
              SR
            </button>
            <button
              type="button"
              lang="de"
              aria-label="Deutsch"
              aria-pressed={language === "de"}
              onClick={() => setLanguage("de")}
            >
              DE
            </button>
          </div>
        )}

        <div className="std-cinema__hero-copy">
          <h1 className="std-cinema__title" lang="en">Save the Date</h1>
          {date && (
            <time className="std-cinema__hero-date" dateTime={target ? dateISO : undefined}>
              {date}
            </time>
          )}
          <p className="std-cinema__names">
            <span>{brideName}</span>
            <span className="std-cinema__amp" aria-hidden="true">&amp;</span>
            <span className="std-cinema__sr-only">{` ${copy.connector} `}</span>
            <span>{groomName}</span>
          </p>
          {venueName && <p className="std-cinema__hero-venue">{venueName}</p>}
        </div>

        <button
          type="button"
          className="std-cinema__open"
          aria-controls={detailsId}
          onClick={openDetails}
        >
          <span>{copy.open}</span>
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 3v13m-4-4 4 4 4-4" stroke="currentColor" strokeWidth="1.1" />
          </svg>
        </button>
      </header>

      <section
        id={detailsId}
        ref={detailsRef}
        className="std-cinema__details"
        aria-labelledby={`${detailsId}-heading`}
      >
        <p className="std-cinema__label">{copy.eyebrow}</p>
        <h2 ref={headingRef} id={`${detailsId}-heading`} tabIndex={-1}>
          {copy.message}
        </h2>

        {mapLink && (
          <a className="std-cinema__location" href={mapLink} target="_blank" rel="noopener noreferrer">
            {copy.locationButton}
          </a>
        )}

        {showCountdown && (
          <CinemaCountdown target={target} copy={copy} />
        )}

        {showCalendar && (
          <button
            type="button"
            className="std-cinema__calendar"
            onClick={handleAddToCalendar}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="4" y="6" width="16" height="14" rx="1" stroke="currentColor" strokeWidth="1.25" />
              <path d="M8 4v4m8-4v4M4 10h16m-8 2.5v5m-2.5-2.5h5" stroke="currentColor" strokeWidth="1.25" />
            </svg>
            {copy.calendarButton}
          </button>
        )}
        <p className="std-cinema__signature">{copy.signature}</p>
      </section>
    </main>
  );
}
