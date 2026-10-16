import { useRef } from "react";
import AmoreCountdown, {
  AMORE_HEART_PATH, AmoreIcon, AmoreReveal, AmoreText,
  amoreCalendarURL, amoreText, getAmoreDate, useAmoreMotion,
} from "./AmoreCountdown";
import AmoreRSVP from "./AmoreRSVP";
import "../styles/newcard.css";
import "../styles/newintro.css";

export const AMORE_PHOTOS = {
  hero: "/images/amore/hero.webp",
  toast: "/images/amore/toast.webp",
  details: "/images/amore/details.webp",
};

function Photo({ src, fallback, alt = "", className = "", position = "50% 50%", priority = false, parallax = false }) {
  return <img src={src || fallback} alt={alt} className={`amr-photo ${className}`}
    loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"}
    decoding="async" draggable={false} width="1024" height="1536"
    data-amr-parallax={parallax ? "" : undefined} style={{ objectPosition: position }}
    onError={(event) => {
      if (event.currentTarget.dataset.fallback !== "1" && fallback) {
        event.currentTarget.dataset.fallback = "1";
        event.currentTarget.src = fallback;
      }
    }} />;
}

function DateCalendar({ date, label, href, t }) {
  if (!date) return null;
  return (
    <AmoreReveal className="amr-calendar-wrap">
      <div className="amr-calendar" role="img" aria-label={label}>
        {date.week.map((day) => (
          <div className={`amr-calendar-day${day.selected ? " amr-calendar-selected" : ""}`} key={day.key} aria-hidden="true">
            <span className="amr-calendar-weekday">{day.weekday}</span>
            <span className="amr-calendar-month">{day.month}</span>
            <span className="amr-calendar-number">{day.day}</span>
            {day.selected && <svg className="amr-calendar-heart" viewBox="0 0 165 185" fill="none" aria-hidden="true">
              <path d={AMORE_HEART_PATH} pathLength="1" />
            </svg>}
          </div>
        ))}
      </div>
      {href && <a className="amr-calendar-link" href={href} target="_blank" rel="noopener noreferrer">
        <img src="/icons/amore-calendar.svg" width="16" height="16" alt="" aria-hidden="true" />{t.calendar}
      </a>}
    </AmoreReveal>
  );
}

function SaveTheDateTape() {
  return <div className="amr-date-tapes" aria-hidden="true">
    {[0, 1].map((row) => <div className={`amr-tape amr-tape-${row}`} key={row}>
      <div className="amr-tape-track">
        {[0, 1].map((copy) => <div className="amr-tape-copy" key={copy}>
          {Array.from({ length: 7 }, (_, index) => <span key={index}>SAVE THE DATE</span>)}
        </div>)}
      </div>
    </div>)}
  </div>;
}

export default function AmoreInvitationCard({
  brideName = "Ana", groomName = "Nikola", weddingDate = "", venue = "",
  backgroundImage = "", image1 = "", image2 = "", image3 = "",
  slug, type = "wedding", details = {}, script = "latin", introReady = true,
}) {
  const root = useRef(null);
  useAmoreMotion(root, introReady);
  const t = amoreText(script);
  const config = details.amore || {};
  const date = getAmoreDate(details.dateISO, script);
  const dateLabel = details.date || weddingDate || date?.label || "";
  const names = `${brideName} & ${groomName}`;
  const signature = config.signature || `${t.signature} ${names}`;
  const signatureParts = String(signature).trim().match(/^(Vaši|Vasi|Ваши)\s+(.+)$/iu);
  const location = config.locationName || details.locationName || details.venue || venue;
  const address = config.locationAddress || details.locationAddress;
  const map = details.locationButtonLink || details.mapLink ||
    (location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([location, address].filter(Boolean).join(", "))}` : "");
  const calendar = details.showCalendarButton ? amoreCalendarURL({
    dateISO: details.dateISO, names, venue: [location, address].filter(Boolean).join(", "),
    duration: details.calendarDurationHours, description: details.welcomeText || "",
  }) : "";
  const events = Array.isArray(details.events) ? details.events : [];
  const palette = details.dressCodePalette?.length ? details.dressCodePalette : ["#e9e6d9", "#f0d85b", "#7b6540", "#333536"];

  return (
    <main ref={root} className="amr-invitation" data-script={script} data-amr-active={introReady ? "true" : "false"}>
      <header className="amr-hero">
        <Photo src={config.heroImage || backgroundImage || image1} fallback={AMORE_PHOTOS.hero}
          alt={`${brideName} i ${groomName}`} priority parallax position={config.heroPosition || "50% 43%"} />
        <div className="amr-hero-shade" aria-hidden="true" />
        <div className="amr-hero-copy">
          <AmoreText as="h1" text={names} className="amr-hero-names" />
          <AmoreText as="p" text={config.heroNote || "s tobom, do kraja života."} className="amr-hero-note" delay={50} />
        </div>
        <img className="amr-torn-edge" src="/icons/amore-torn-paper.svg" alt="" aria-hidden="true" width="1000" height="245" />
      </header>

      <section className="amr-opening amr-inner" aria-label={t.welcome}>
        {dateLabel && <AmoreText as="p" text={dateLabel} className="amr-wedding-date" />}
        <AmoreText as="h2" text={config.welcomeTitle || t.welcome} className="amr-small-title" />
        <AmoreReveal as="p" className="amr-body amr-welcome-copy">{details.welcomeText || t.welcomeBody}</AmoreReveal>
        <DateCalendar date={date} label={dateLabel} href={calendar} t={t} />
      </section>

      <SaveTheDateTape />

      {location && <section className="amr-location amr-inner" aria-labelledby="amr-location-title">
        <AmoreText text={config.locationTitle || t.location} id="amr-location-title" className="amr-script" />
        <AmoreReveal className="amr-location-copy">
          {address && <p className="amr-location-address">{address}</p>}
          <h3 className="amr-location-name">{location}</h3>
          {map && details.showLocationButton !== false && <a className="amr-button amr-map-button" href={map} target="_blank" rel="noopener noreferrer">
            {details.locationButtonText || t.map}
          </a>}
        </AmoreReveal>
      </section>}

      <AmoreReveal className="amr-toast amr-photo-reveal">
        <Photo src={config.toastImage || image2} fallback={AMORE_PHOTOS.toast} alt="Zdravica na proslavi" parallax position={config.toastPosition || "50% 50%"} />
      </AmoreReveal>

      {events.length > 0 && <section className="amr-timing amr-inner" aria-labelledby="amr-timing-title">
        <AmoreText text={config.timingTitle || t.timing} id="amr-timing-title" className="amr-script" />
        <ol className="amr-events">
          {events.map((event, index) => {
            const eventLocation = event.location || location;
            const eventAddress = event.address || (eventLocation === location ? address : "");
            const eventMap = event.mapLink ||
              (eventLocation === location ? map : "") ||
              (eventLocation ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([eventLocation, eventAddress].filter(Boolean).join(", "))}` : "");

            return <AmoreReveal as="li" className="amr-event" key={`${event.label}-${index}`} delay={Math.min(index * 60, 160)}>
            <AmoreIcon name={event.icon || ["gathering", "buffet", "civil", "dinner"][index % 4]} />
            <div className="amr-event-copy">
              {event.time && <p className="amr-event-time">{event.time}</p>}
              <h3 className="amr-event-title">{event.label}</h3>
              {eventLocation && <p className="amr-event-location">{eventLocation}</p>}
              {eventAddress && <p className="amr-event-address">{eventAddress}</p>}
              {event.note && <p className="amr-event-note">{event.note}</p>}
              {eventMap && <a className="amr-button amr-event-map-button" href={eventMap} target="_blank" rel="noopener noreferrer"
                aria-label={`${t.map}: ${event.label}${eventLocation ? `, ${eventLocation}` : ""}`}>
                {t.map}
              </a>}
            </div>
          </AmoreReveal>;
          })}
        </ol>
      </section>}

      {details.showDressCode && <section className="amr-dress-code amr-inner" aria-labelledby="amr-dress-title">
        <AmoreText text={details.dressCodeTitle || "DRESS CODE"} className="amr-dress-title" id="amr-dress-title" />
        <AmoreReveal className="amr-palette" aria-label={script === "cyrillic" ? "Палета боја" : "Paleta boja"}>
          {palette.map((item, index) => {
            const color = typeof item === "string" ? item : item.color;
            const label = typeof item === "string" ? item : item.name || item.color;
            return <span className="amr-swatch" key={`${color}-${index}`} role="img" aria-label={label}
              style={{ "--amr-swatch": color, "--amr-swatch-i": index }} />;
          })}
        </AmoreReveal>
        <AmoreReveal as="p" className="amr-body amr-dress-note">{details.dressCodeNote || t.palette}</AmoreReveal>
        {details.dressCodeWomen && <AmoreReveal as="p" className="amr-body amr-dress-note">{details.dressCodeWomen}</AmoreReveal>}
        {details.dressCodeMen && <AmoreReveal as="p" className="amr-body amr-dress-note">{details.dressCodeMen}</AmoreReveal>}
      </section>}

      <section className="amr-details" aria-label="Details">
        <div className="amr-details-wall" aria-hidden="true">
          {[0, 1, 2, 3].map((row) => <div className={`amr-details-line amr-details-line-${row}`} key={row}>
            <span>details&nbsp; details&nbsp; details&nbsp; details&nbsp; </span>
            <span>details&nbsp; details&nbsp; details&nbsp; details&nbsp; </span>
          </div>)}
        </div>
        <AmoreReveal className="amr-detail-photo amr-photo-reveal">
          <Photo src={config.detailsImage || image3} fallback={AMORE_PHOTOS.details} alt="Nežni detalji našeg dana" position={config.detailsPosition || "50% 50%"} />
        </AmoreReveal>
      </section>

      <section className="amr-closing amr-inner">
        <AmoreReveal as="p" className="amr-body amr-details-note">{config.detailsText || t.details}</AmoreReveal>
        {config.additionalNote && <AmoreReveal as="p" className="amr-body amr-details-note">{config.additionalNote}</AmoreReveal>}
        <AmoreText as="p" text={config.closingTitle || t.waiting} className="amr-closing-title" />
        {signatureParts && <AmoreReveal as="p" className="amr-signature-label">{signatureParts[1]}</AmoreReveal>}
        <AmoreText as="p" text={signatureParts ? signatureParts[2] : signature} className="amr-script amr-signature" />
      </section>

      <AmoreRSVP slug={slug} eventType={type} brideName={brideName} groomName={groomName} details={details} script={script} />
      <AmoreCountdown dateISO={details.dateISO} details={details} script={script} />
      <footer className="amr-footer"><span>{names}</span><span aria-hidden="true"> · </span><span>{dateLabel}</span></footer>
    </main>
  );
}
