import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import BirthdayRedSatinRSVP from "./BirthdayRedSatinRSVP";
import { RED_SATIN_PAPER_TOAST } from "./BirthdayRedSatinIntro";
import BirthdayRedSatinCountdown, {
  formatRedSatinDate,
  getRedSatinDate,
  redSatinCapitalize,
  redSatinText,
} from "./BirthdayRedSatinCountdown";
import "../styles/birthdaycard.css";

const LAST_LETTER = "/images/birthday-red-satin/last-letter.webp";
const DEFAULT_PALETTE = {
  "#181014": { name: "Crna", fabric: "black" },
  "#801e34": { name: "Bordo", fabric: "red" },
  "#dfc099": { name: "Šampanj", fabric: "gold" },
};

function SatinGraphics() {
  return (
    <svg className="brs-icon-library" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <symbol id="brs-icon-calendar" viewBox="0 0 24 24">
        <rect x="4" y="6" width="16" height="14" rx="2" />
        <path d="M8 4v4m8-4v4M4 11h16m-8 3v4m-2-2h4" />
      </symbol>
      <symbol id="brs-icon-note" viewBox="0 0 24 24">
        <path d="M9 17V6l11-2v11M9 17c0 1.2-1.3 2.2-3 2.2S3 18.5 3 17.3s1.3-2.2 3-2.2 3 .7 3 1.9Zm11-2c0 1.2-1.3 2.2-3 2.2s-3-.7-3-1.9 1.3-2.2 3-2.2 3 .7 3 1.9Z" />
      </symbol>
      <symbol id="brs-icon-plus" viewBox="0 0 24 24"><path d="M5 12h14m-7-7v14" /></symbol>
      <symbol id="brs-icon-minus" viewBox="0 0 24 24"><path d="M5 12h14" /></symbol>
      <symbol id="brs-icon-pin" viewBox="0 0 24 24">
        <path d="M19 10c0 5-7 10-7 10S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" />
      </symbol>
      <symbol id="brs-icon-drapes" viewBox="0 0 24 24"><path d="M9 4v16m6-16v16M6 9l-3 3 3 3m12-6 3 3-3 3" /></symbol>
      <clipPath id="brs-silk-venue" clipPathUnits="objectBoundingBox">
        <path d="M0,0 C.2,0 .29,.079 .47,.104 C.62,.124 .78,.096 1,.052 L1,1 H0 Z" />
      </clipPath>
      <clipPath id="brs-silk-back" clipPathUnits="objectBoundingBox">
        <path d="M0,.34 C.2,.58 .34,.62 .56,.49 C.73,.38 .84,.29 1,.39 L1,.63 C.81,.53 .68,.72 .49,.77 C.25,.83 .1,.68 0,.53 Z" />
      </clipPath>
      <clipPath id="brs-silk-front" clipPathUnits="objectBoundingBox">
        <path d="M0,.11 C.22,.04 .38,.15 .56,.34 C.72,.52 .84,.62 1,.56 L1,.84 C.83,.88 .66,.73 .52,.55 C.32,.32 .18,.31 0,.43 Z" />
      </clipPath>
    </svg>
  );
}

function DressCode({ details, script }) {
  const [open, setOpen] = useState(false);
  const [activeMaterial, setActiveMaterial] = useState(null);
  const titleId = useId();
  const roomId = useId();
  const toggleRef = useRef(null);
  const t = (value) => redSatinText(value, script);
  const config = details.redSatin || {};
  const title = details.dressCodeTitle;
  const palette = Array.isArray(details.dressCodePalette)
    ? details.dressCodePalette
    : Object.keys(DEFAULT_PALETTE);

  const atelierPalette = palette.length === 3 &&
    Object.keys(DEFAULT_PALETTE).every((color, index) => color === String(palette[index]).toLowerCase());

  function toggleDress() {
    setOpen(!open);
    setActiveMaterial(null);
  }

  function handleEscape(event) {
    if (event.key !== "Escape" || !open) return;
    toggleDress();
    toggleRef.current?.focus();
  }

  return (
    <section className={"brs-dress" + (open ? " brs-is-open" : "")}
      aria-labelledby={titleId} onKeyDown={handleEscape}>
      <div className="brs-dress-stage">
        <div className="brs-curtain-wing brs-curtain-wing--left" aria-hidden="true" />
        <div className="brs-curtain-wing brs-curtain-wing--right" aria-hidden="true" />
        <div className="brs-curtain-light" aria-hidden="true" />
        <div className="brs-dress-cover" data-brs-reveal="write">
          <h2 id={titleId} className="brs-section-title">
            {title && title.toLowerCase() !== "dress code" ? (
              <span className="brs-script brs-dress-custom-title">{title}</span>
            ) : (
              <><span className="brs-script">Dress</span><span className="brs-caps brs-title-tail">code</span></>
            )}
          </h2>
        </div>
        <button ref={toggleRef} className="brs-button brs-dress-toggle" type="button"
          aria-controls={roomId} aria-expanded={open} onClick={toggleDress}>
          <svg className="brs-icon" aria-hidden="true"><use href="#brs-icon-drapes" /></svg>
          <span>{open ? t("Zatvori zavesu") : t("Razmakni zavesu")}</span>
        </button>
        <div className="brs-dress-room" id={roomId} inert={!open} aria-hidden={!open}>
          <p className="brs-script brs-dress-reveal-title">{config.dressCodeHeading || t("Svečano i elegantno")}</p>
          {details.dressCodeNote && <p>{details.dressCodeNote}</p>}
          {palette.length > 0 && (
            <ul className={"brs-palette" + (atelierPalette ? " brs-palette--atelier" : "")}
              aria-label={t("Predlog boja")} data-brs-material={activeMaterial ?? undefined}>
              {palette.map((color, index) => {
                const preset = DEFAULT_PALETTE[String(color).toLowerCase()];
                const label = config.paletteLabels?.[index] || (preset ? t(preset.name) : color);
                const swatch = (
                  <span className={"brs-fabric brs-fabric--" + (preset?.fabric || "custom")}
                    style={preset ? undefined : { "--brs-fabric-color": color }} aria-hidden="true" />
                );

                return (
                  <li key={index}>
                    {atelierPalette ? (
                      <button type="button" className="brs-material-button"
                        aria-pressed={activeMaterial === index}
                        onClick={() => setActiveMaterial((current) => current === index ? null : index)}>
                        {swatch}<span>{label}</span>
                      </button>
                    ) : <>{swatch}<span>{label}</span></>}
                  </li>
                );
              })}
            </ul>
          )}
          {atelierPalette && <p className="brs-palette-hint">{t("Dodirni boju da je istakneš")}</p>}
        </div>
      </div>
    </section>
  );
}

function MusicButton({ audioRef, script }) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return undefined;

    const sync = () => setPlaying(!audio.paused);
    sync();
    audio.addEventListener("play", sync);
    audio.addEventListener("pause", sync);
    audio.addEventListener("ended", sync);

    return () => {
      audio.removeEventListener("play", sync);
      audio.removeEventListener("pause", sync);
      audio.removeEventListener("ended", sync);
    };
  }, [audioRef]);

  function toggleMusic() {
    const audio = audioRef?.current;
    if (!audio) return;

    if (audio.paused) {
      audio.muted = false;
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }

  const label = redSatinText(playing ? "Pauziraj muziku" : "Pusti muziku", script);
  return (
    <button className="brs-music-button" type="button" onClick={toggleMusic}
      aria-pressed={playing} aria-label={label} title={label}>
      <svg className="brs-icon" aria-hidden="true">
        <use href="#brs-icon-note" /><path className="brs-music-slash" d="M4 4l16 16" />
      </svg>
    </button>
  );
}

export default function BirthdayRedSatinInvitationCard({
  slug, type, brideName, childName, weddingDate, weddingTime, venue, details = {},
  script, introReady = true, audioRef, hasMusic,
}) {
  const shellRef = useRef(null);
  const titleRef = useRef(null);
  const venueId = useId();
  const programId = useId();
  const config = details.redSatin || {};
  const activeScript = script || details.script;
  const t = (value) => redSatinText(value, activeScript);
  const name = childName || brideName || details.childName;
  const date = getRedSatinDate(details.dateISO, weddingTime);
  const dateLabel = details.date || weddingDate || (date && formatRedSatinDate(date, activeScript, {
    day: "2-digit", month: "2-digit", year: "numeric",
  }));
  const time = weddingTime?.replace(":", ".") ||
    (date && formatRedSatinDate(date, activeScript, { hour: "2-digit", minute: "2-digit" }).replace(":", "."));
  const weekday = date && redSatinCapitalize(formatRedSatinDate(date, activeScript, { weekday: "long" }));
  const timeLabel = config.dayTimeLabel || (time && (weekday ? weekday + t(" u ") : "") + time);
  const events = Array.isArray(details.events) ? details.events : [];
  const locationName = details.locationName || details.venue || venue || events[0]?.location;
  const locationAddress = details.locationAddress;
  const venueLabel = [locationName, locationAddress].filter(Boolean).join(", ");
  const mapLink = details.showLocationButton === false ? "" : (
    details.locationButtonLink || details.mapLink || events[0]?.mapLink ||
    (venueLabel && "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(venueLabel))
  );

  useLayoutEffect(() => {
    const shell = shellRef.current;
    if (!shell || !("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const elements = shell.querySelectorAll("[data-brs-reveal]:not(.brs-is-visible)");
    shell.classList.add("brs-scroll-motion");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.remove("brs-awaiting-reveal");
        entry.target.classList.add("brs-is-visible");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12 });

    elements.forEach((element) => {
      element.classList.add("brs-awaiting-reveal");
      observer.observe(element);
    });
    return () => {
      observer.disconnect();
      shell.classList.remove("brs-scroll-motion");
      elements.forEach((element) => element.classList.remove("brs-awaiting-reveal"));
    };
  }, []);

  useLayoutEffect(() => {
    if (introReady) titleRef.current?.focus({ preventScroll: true });
  }, [introReady]);

  return (
    <div className="brs-invitation-shell" ref={shellRef}>
      <SatinGraphics />
      <main>
        <header className="brs-letter brs-paper">
          <div className="brs-letter-copy">
            <h1 className="brs-script brs-is-visible" ref={titleRef} tabIndex={-1} data-brs-reveal="write">
              {config.invitationTitle || t("Pozivam te")}
            </h1>
            {details.welcomeText && (
              <p className="brs-letter-welcome brs-is-visible" data-brs-reveal="">{details.welcomeText}</p>
            )}
            {(dateLabel || timeLabel) && (
              <div className="brs-letter-when brs-is-visible" data-brs-reveal="">
                {dateLabel && (
                  <time className="brs-letter-date" dateTime={date?.toISOString()}>{dateLabel}</time>
                )}
                {timeLabel && <p className="brs-caps brs-letter-time">{timeLabel}</p>}
              </div>
            )}
          </div>
          <div className={"brs-letter-art brs-is-visible" + (config.toastImage ? "" : " brs-letter-art--cutout")}
            data-brs-reveal="photo">
            <img className="brs-toast-art" src={config.toastImage || RED_SATIN_PAPER_TOAST}
              width={config.toastImage ? 625 : 720} height={config.toastImage ? 625 : 960} alt="" decoding="async" />
          </div>
        </header>

        {(locationName || locationAddress) && (
          <section className="brs-venue brs-on-wine" aria-labelledby={venueId}>
            <div className="brs-venue-silk" aria-hidden="true" />
            <div className="brs-venue-content">
              <h2 id={venueId} className="brs-section-title" data-brs-reveal="write">
                <span className="brs-script">{t("Mesto")}</span>
                <span className="brs-caps brs-title-tail">{t("i vreme")}</span>
              </h2>
              <div className="brs-venue-info" data-brs-reveal="">
                {locationName && <p className="brs-venue-name">{locationName}</p>}
                {locationAddress && <p className="brs-venue-city">{locationAddress}</p>}
                {mapLink && (
                  <a className="brs-button brs-button--light" href={mapLink} target="_blank" rel="noopener noreferrer">
                    <svg className="brs-icon" aria-hidden="true"><use href="#brs-icon-pin" /></svg>
                    {details.locationButtonText || t("Prikaži na mapi")}
                  </a>
                )}
              </div>
            </div>
          </section>
        )}

        {events.length > 0 && (
          <section className="brs-program brs-paper brs-padded" aria-labelledby={programId}>
            <h2 id={programId} className="brs-section-title" data-brs-reveal="write">
              <span className="brs-script">{t("Program")}</span>
              <span className="brs-caps brs-title-tail">{t("večeri")}</span>
            </h2>
            <ol className="brs-schedule" data-brs-reveal="schedule">
              {events.map((event, index) => {
                const eventTime = String(event.time || "").replace(".", ":");
                const description = event.description || event.note;
                const eventLocation = event.location !== locationName && event.location !== locationAddress
                  ? event.location : "";

                return (
                  <li key={index}>
                    <time dateTime={/^\d{2}:\d{2}$/.test(eventTime) ? eventTime : undefined}>{event.time}</time>
                    <div>
                      <h3>{event.label}</h3>
                      {description && <p>{description}</p>}
                      {eventLocation && <p>{eventLocation}</p>}
                      {event.mapLink && event.mapLink !== mapLink && (
                        <a className="brs-event-map" href={event.mapLink} target="_blank" rel="noopener noreferrer">
                          {t("Prikaži na mapi")}
                        </a>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        {events.length > 0 && !details.showDressCode && (
          <div className="brs-silk-fold" aria-hidden="true" data-brs-reveal="silk">
            <span className="brs-silk-fold-back" /><span className="brs-silk-fold-front" />
          </div>
        )}
        {details.showDressCode && <DressCode details={details} script={activeScript} />}

        <BirthdayRedSatinRSVP key={slug} slug={slug} eventType={type || "birthday"}
          details={details} script={activeScript} />
        <BirthdayRedSatinCountdown slug={slug} date={date} name={name} venue={venueLabel}
          details={details} script={activeScript} introReady={introReady} />

        <footer className="brs-farewell brs-paper">
          <h2 className="brs-script brs-section-title" data-brs-reveal="write">
            {config.farewellTitle || t("Vidimo se!")}
          </h2>
          <img src={config.giftImage || LAST_LETTER}
            className={"brs-gift-art" + (config.giftImage ? "" : " brs-gift-art--letter")}
            width={config.giftImage ? 625 : 960} height={config.giftImage ? 625 : 640}
            loading="lazy" decoding="async" alt="" data-brs-reveal="photo" />
          {(details.note || name) && <p data-brs-reveal="">{details.note || t("S ljubavlju, ") + name}</p>}
        </footer>
      </main>
      {introReady && hasMusic && <MusicButton audioRef={audioRef} script={activeScript} />}
    </div>
  );
}
