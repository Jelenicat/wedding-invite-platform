import { useEffect, useRef, useState } from "react";
import "../styles/saveTheDate.css";
import { addToCalendar } from "../utils/calendar";
import {
  dateDisplayToISO,
  getCountdown,
  padNumber,
  parseTargetDate,
} from "../utils/saveTheDateTiming";

const albumDecorPath = "/images/save-the-date/andjela-andrija-album/decor";
const defaultAlbumDecor = {
  portraitFrame: `${albumDecorPath}/portrait-mat.webp`,
  landscapeFrame: `${albumDecorPath}/landscape-mat.webp`,
  ribbonSticker: `${albumDecorPath}/ruby-satin-ribbon.webp`,
  heartsSticker: `${albumDecorPath}/ruby-ink-hearts.webp`,
};

const copyByLanguage = {
  sr: {
    languagePicker: "Jezik",
    open: "Otvori album",
    opening: "Otvaramo album…",
    calendar: "Dodaj u kalendar",
    calendarTitle: "Sačuvajte datum",
    calendarNote: "Sačuvajte datum za naš poseban dan.",
    countdown: "Do našeg dana",
    days: "Dana",
    hours: "Sati",
    minutes: "Minuta",
    today: "Naš dan je stigao",
    childhood: "Da smo se sreli kao mali…",
    childhoodPortrait: "iz detinjstva",
    togetherPhoto: "Zamišljeni zajednički portret iz detinjstva",
    signature: "Svečana pozivnica uskoro stiže.",
  },
  de: {
    languagePicker: "Sprache",
    open: "Album öffnen",
    opening: "Das Album öffnet sich…",
    calendar: "Zum Kalender hinzufügen",
    calendarTitle: "Save the Date",
    calendarNote: "Merkt euch den Termin für unseren besonderen Tag vor.",
    countdown: "Bis zu unserem großen Tag",
    days: "Tage",
    hours: "Stunden",
    minutes: "Minuten",
    today: "Unser großer Tag ist da",
    childhood: "Wenn wir uns als Kinder begegnet wären…",
    childhoodPortrait: "als Kind",
    togetherPhoto: "Ein ausgedachtes gemeinsames Kindheitsfoto",
    signature: "Die offizielle Einladung folgt in Kürze.",
  },
};

function AlbumCountdown({ dateISO, copy }) {
  const [countdown, setCountdown] = useState(() =>
    getCountdown(parseTargetDate(dateISO))
  );

  useEffect(() => {
    const targetDate = parseTargetDate(dateISO);
    const update = () => setCountdown(getCountdown(targetDate));

    update();
    if (getCountdown(targetDate).finished) return;

    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [dateISO]);

  return (
    <section className="std-photo-album__countdown" aria-label={copy.countdown}>
      <h2>{countdown.finished ? copy.today : copy.countdown}</h2>

      {!countdown.finished && (
        <dl className="std-photo-album__countdown-grid">
          {[
            [copy.days, countdown.days],
            [copy.hours, padNumber(countdown.hours)],
            [copy.minutes, padNumber(countdown.minutes)],
          ].map(([label, number]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{number}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}

function AlbumPrint({ className, format, frame, src, alt = "", cover = false, lazy = false }) {
  const isLandscape = format === "landscape";

  return (
    <span className={`std-photo-album__print std-photo-album__print--${format} ${className}`}>
      <img
        className="std-photo-album__image"
        src={src}
        width={isLandscape ? 1280 : 740}
        height={isLandscape ? 853 : 925}
        alt={alt}
        loading={lazy ? "lazy" : undefined}
        fetchPriority={cover ? "high" : undefined}
      />
      <img className="std-photo-album__mat" src={frame} alt="" aria-hidden="true" draggable="false" />
    </span>
  );
}

export default function SaveTheDatePhotoAlbum({
  brideName,
  groomName,
  weddingDate,
  venue,
  details = {},
  onStartMusic,
}) {
  const config = details.saveTheDate || {};
  const {
    bridePhoto,
    groomPhoto,
    brideSnapshot,
    togetherPhoto,
    portraitFrame,
    landscapeFrame,
    ribbonSticker,
    heartsSticker,
  } = { ...defaultAlbumDecor, ...config.photoAlbum };
  const [language, setLanguage] = useState(() =>
    (config.language || details.defaultLanguage) === "de" ? "de" : "sr"
  );
  const [phase, setPhase] = useState("closed");
  const headingRef = useRef(null);
  const copy = copyByLanguage[language];
  const isRevealed = phase === "revealed";
  const isOpening = phase === "opening";
  const eventVenue = venue || details.venue;
  const dateISO = config.dateISO || details.dateISO || dateDisplayToISO(weddingDate);
  const validDate = Boolean(parseTargetDate(dateISO));
  const dateParts = /^(\d{4})-(\d{2})-(\d{2})(?:$|T)/.exec(dateISO);
  const displayDate = dateParts
    ? `${dateParts[3]}.${dateParts[2]}.${dateParts[1]}.`
    : weddingDate;
  const names = `${brideName} & ${groomName}`;

  useEffect(() => {
    if (!isOpening) return;

    const timer = window.setTimeout(() => setPhase("revealed"), 820);
    return () => window.clearTimeout(timer);
  }, [isOpening]);

  useEffect(() => {
    if (!isRevealed) return;

    window.scrollTo({ top: 0, behavior: "instant" });
    headingRef.current?.focus({ preventScroll: true });
  }, [isRevealed]);

  function openAlbum() {
    if (phase !== "closed") return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPhase(reduceMotion ? "revealed" : "opening");
    onStartMusic?.();
  }

  function saveDate() {
    addToCalendar({
      brideName,
      groomName,
      dateISO,
      venue: eventVenue,
      mapLink: config.mapLink || details.mapLink || "",
      note: copy.calendarNote,
      eventType: "save-the-date",
      eventTitle: `${copy.calendarTitle} - ${names}`,
      allDay: true,
      language,
    });
  }

  return (
    <main
      className="std-photo-album"
      data-phase={phase}
      lang={language}
    >
      <div className="std-photo-album__page">
        <div className="std-photo-album__language" role="group" aria-label={copy.languagePicker}>
          <button type="button" lang="sr" aria-label="Srpski" aria-pressed={language === "sr"} onClick={() => setLanguage("sr")}>
            SR
          </button>
          <button type="button" lang="de" aria-label="Deutsch" aria-pressed={language === "de"} onClick={() => setLanguage("de")}>
            DE
          </button>
        </div>

        {!isRevealed ? (
          <div className="std-photo-album__cover">
            <p className="std-photo-album__cover-title" lang="en">
              Save <em>the</em> Date
            </p>

            <button
              className="std-photo-album__open"
              type="button"
              onClick={openAlbum}
              disabled={isOpening}
            >
              <span className="std-photo-album__cover-stack" aria-hidden="true">
                <AlbumPrint className="std-photo-album__stack-back std-photo-album__stack-back--left" format="portrait" frame={portraitFrame} src={bridePhoto} />
                <AlbumPrint className="std-photo-album__stack-back std-photo-album__stack-back--right" format="portrait" frame={portraitFrame} src={groomPhoto} />
                <AlbumPrint className="std-photo-album__cover-print" format="landscape" frame={landscapeFrame} src={togetherPhoto} cover />
                <img className="std-photo-album__ribbon" src={ribbonSticker} alt="" draggable="false" />
                <svg
                  className="std-photo-album__heart-mark"
                  viewBox="0 0 64 64"
                  aria-hidden="true"
                  focusable="false"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    d="M30 54C24 47 7 33 9 20c2-13 16-11 22 2C36 10 49 5 54 14c7 13-9 30-24 40Z"
                    strokeWidth="2.6"
                  />
                  <path
                    d="M28 54C22 46 8 33 10 21m22 2C38 11 47 9 52 14"
                    strokeWidth="1.4"
                    opacity=".46"
                  />
                </svg>
              </span>
              <span className="std-photo-album__open-label" aria-live="polite">
                {isOpening ? copy.opening : copy.open}
              </span>
            </button>

            <h1 className="std-photo-album__cover-names">
              {brideName} <span>&amp;</span> {groomName}
            </h1>
            {displayDate && (
              <time className="std-photo-album__cover-date" dateTime={validDate ? dateISO : undefined}>
                {displayDate}
              </time>
            )}
          </div>
        ) : (
          <>
            <article className="std-photo-album__invitation" aria-labelledby="std-photo-album-title">
              <div className="std-photo-album__portraits">
                <AlbumPrint className="std-photo-album__portrait std-photo-album__portrait--bride" format="portrait" frame={portraitFrame} src={bridePhoto} alt={`${brideName} ${copy.childhoodPortrait}`} />
                <AlbumPrint className="std-photo-album__portrait std-photo-album__portrait--groom" format="portrait" frame={portraitFrame} src={groomPhoto} alt={`${groomName} ${copy.childhoodPortrait}`} />
                <img className="std-photo-album__hearts" src={heartsSticker} alt="" aria-hidden="true" draggable="false" />
              </div>

              <div className="std-photo-album__details">
                <h1 className="std-photo-album__names" id="std-photo-album-title" ref={headingRef} tabIndex={-1}>
                  {brideName} <span>&amp;</span> {groomName}
                </h1>
                <time className="std-photo-album__date" dateTime={validDate ? dateISO : undefined}>
                  {displayDate}
                </time>
                {eventVenue && <p className="std-photo-album__venue">{eventVenue}</p>}
                {config.showCalendarButton !== false && validDate && (
                  <button className="std-photo-album__calendar" type="button" onClick={saveDate}>
                    <span className="std-photo-album__calendar-icon" aria-hidden="true" />
                    {copy.calendar}
                  </button>
                )}
              </div>
            </article>

            {config.showCountdown === true && validDate && (
              <AlbumCountdown dateISO={dateISO} copy={copy} />
            )}

            <figure className="std-photo-album__memories">
              <figcaption>{copy.childhood}</figcaption>
              <div className="std-photo-album__memory-prints">
                <AlbumPrint className="std-photo-album__together" format="landscape" frame={landscapeFrame} src={togetherPhoto} alt={copy.togetherPhoto} lazy />
                {brideSnapshot && (
                  <AlbumPrint className="std-photo-album__snapshot" format="portrait" frame={portraitFrame} src={brideSnapshot} alt={`${brideName} ${copy.childhoodPortrait}`} lazy />
                )}
              </div>
            </figure>

            <p className="std-photo-album__signature">{copy.signature}</p>
          </>
        )}
      </div>
    </main>
  );
}
