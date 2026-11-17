import { useEffect, useLayoutEffect, useRef } from "react";
import { AureaLanguageToggle, aureaLocale } from "./AureaIntro";
import AureaRSVP from "./AureaRSVP";
import AureaCountdown, { AureaMonth } from "./AureaCountdown";
import "../styles/newcard.css";



const COPY = {
  "sr-Latn": {
    invitation: "Pozivnica za venčanje",
    overline: "Naš najlepši dan",
    greeting: "Dragi naši",
    day: "Dan koji pamtimo",
    venue: "Mesto slavlja",
    map: "Pogledaj lokaciju",
    timeline: "Program dana",
    dress: "Dress code",
    women: "Za dame",
    men: "Za gospodu",
    note: "Mala napomena",
    contact: "Kontakt",
    closing: "Radujemo se vašem dolasku!",
  },
  "sr-Cyrl": {
    invitation: "Позивница за венчање",
    overline: "Наш најлепши дан",
    greeting: "Драги наши",
    day: "Дан који памтимо",
    venue: "Место славља",
    map: "Погледај локацију",
    timeline: "Програм дана",
    dress: "Дрес код",
    women: "За даме",
    men: "За господу",
    note: "Мала напомена",
    contact: "Контакт",
    closing: "Радујемо се вашем доласку!",
  },
  en: {
    invitation: "Wedding invitation",
    overline: "Our beautiful day",
    greeting: "Dear family & friends",
    day: "A day to remember",
    venue: "The celebration",
    map: "View location",
    timeline: "Order of the day",
    dress: "Dress code",
    women: "For ladies",
    men: "For gentlemen",
    note: "A little note",
    contact: "Contact",
    closing: "We can't wait to see you!",
  },
  de: {
    invitation: "Hochzeitseinladung",
    overline: "Unser schönster Tag",
    greeting: "Ihr Lieben",
    day: "Ein unvergesslicher Tag",
    venue: "Unsere Location",
    map: "Standort ansehen",
    timeline: "Tagesablauf",
    dress: "Dresscode",
    women: "Für die Damen",
    men: "Für die Herren",
    note: "Ein kleiner Hinweis",
    contact: "Kontakt",
    closing: "Wir freuen uns auf euch!",
  },
};

function mapsLink(place) {
  return place
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`
    : "";
}

function AureaFlourish({ className = "" }) {
  return (
    <svg className={`aurea-flourish ${className}`} viewBox="0 0 240 42" aria-hidden="true" focusable="false">
      <path d="M8 22h55c19 0 23-16 37-16 11 0 16 11 20 16 4-5 9-16 20-16 14 0 18 16 37 16h55" />
      <path d="M56 22c14 0 20 12 35 12 13 0 18-9 29-12 11 3 16 12 29 12 15 0 21-12 35-12" />
      <path d="M120 12c-7 6-7 14 0 20 7-6 7-14 0-20Z" />
      <circle cx="120" cy="22" r="2" />
    </svg>
  );
}

export default function AureaInvitationCard({
  brideName = "",
  groomName = "",
  weddingDate,
  weddingTime,
  venue,
  details = {},
  type = "wedding",
  slug,
  language = "sr",
  script = "latin",
  preview = false,
  ...languageControls
}) {
  const locale = aureaLocale(language, script);
  const copy = COPY[locale] || COPY["sr-Latn"];
  const design = details.aurea || {};
  const cardRef = useRef(null);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    cardRef.current?.focus({ preventScroll: true });
  }, [slug]);

  // Sadrzaj se pojavljuje kad gost skroluje do odgovarajuce sekcije.
  // Observer je ogranicen na Aurea karticu i ne utice na druge sablone.
  useEffect(() => {
    const root = cardRef.current;
    if (!root) return undefined;
    const targets = Array.from(root.querySelectorAll("[data-aurea-reveal]"));
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      targets.forEach((element) => element.classList.add("aurea-is-visible"));
      return undefined;
    }
    root.classList.add("aurea-motion-enabled");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("aurea-is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px 32px 0px" }
    );
    targets.forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      root.classList.remove("aurea-motion-enabled");
    };
  }, [slug, language]);

  const weddingNames = [brideName, groomName].filter(Boolean).join(" & ");
  const longestName = Math.max(
    1,
    ...[brideName, groomName].filter(Boolean).map((name) => Array.from(name).length)
  );
  const nameScale = Math.max(0.66, Math.min(1, 9 / longestName));
  const locationName = details.locationName || details.venue || venue;
  const locationAddress = details.locationAddress;
  const address = [locationName, locationAddress].filter(Boolean).join(", ");
  const locationLink = details.locationButtonLink || details.mapLink || mapsLink(address);
  const events = Array.isArray(details.events)
    ? details.events.filter((event) => event?.label || event?.time)
    : [];
  const palette = Array.isArray(details.dressCodePalette) ? details.dressCodePalette : [];
  const contacts = Array.isArray(details.contacts) ? details.contacts : [];
  const notes = [details.note, ...(Array.isArray(design.notes) ? design.notes : [])].filter(Boolean);
  const travel = details.foreignGuests?.enabled ? details.foreignGuests : null;

  return (
    <main
      className="aurea-card aurea-card--botanical aurea-card--frame-overlay"
      data-script={script}
      lang={locale}
      ref={cardRef}
      tabIndex={-1}
      aria-label={copy.invitation}
    >
      <div className="aurea-spread">
        <AureaLanguageToggle locale={locale} language={language} {...languageControls} />

        <div className="aurea-column aurea-column--letter">
          {/*
            Fullscreen landscape behind the supplied irregular ivory frame.
            Text remains dynamic for each slug — nothing is baked into the PNG.
          */}
          <header className="aurea-cover" aria-label={copy.invitation}>
            <div className="aurea-cover-landscape" aria-hidden="true">
              <img
                src={design.coverBackgroundImage || design.liningImage || "/images/aurea/aurea-landscape.webp"}
                alt=""
                fetchPriority="high"
              />
            </div>

            <div className="aurea-cover-frame">
              <img
                className="aurea-cover-frame-image"
                src={design.coverFrameImage || "/images/aurea/okvir-jezik.png"}
                alt=""
                fetchPriority="high"
                draggable={false}
              />
              <div className="aurea-cover-frame-content">
                <p className="aurea-small-caps">{copy.invitation}</p>
                <h1
                  className="aurea-cover-names"
                  aria-label={weddingNames}
                  style={{ "--aurea-name-scale": nameScale }}
                >
                  <span>{brideName}</span>
                  {brideName && groomName && (
                    <span className="aurea-cover-amp" aria-hidden="true">&amp;</span>
                  )}
                  <span>{groomName}</span>
                </h1>
                <p className="aurea-cover-date">
                  <span>{details.date || weddingDate}</span>
                  {weddingTime && <span>{weddingTime}</span>}
                </p>
              </div>
            </div>
          </header>

          <article className="aurea-sheet aurea-letter">
            {details.welcomeText && (
              <section className="aurea-welcome" data-aurea-reveal>
                <p className="aurea-mini-label">{copy.overline}</p>
                <h2 className="aurea-script">{design.greeting || copy.greeting}</h2>
                <p className="aurea-welcome-copy">{details.welcomeText}</p>
              </section>
            )}

            {details.dateISO && (
              <section className="aurea-calendar-section" data-aurea-reveal>
                <div className="aurea-calendar-embossed">
                  <img
                    className="aurea-calendar-embossed__frame"
                    src={design.calendarFrameImage || "/images/aurea/reljefni-papir.webp"}
                    alt=""
                    loading="lazy"
                    aria-hidden="true"
                  />
                  <div className="aurea-calendar-embossed__content">
                    <h2 className="aurea-script">{copy.day}</h2>
                    <div className="aurea-calendar-paper">
                      <AureaMonth dateISO={details.dateISO} locale={locale} />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {(address || locationLink) && (
              <section className="aurea-venue" data-aurea-reveal>
                <h2 className="aurea-script">{copy.venue}</h2>
                <div
                  className={
                    design.locationImage
                      ? "aurea-venue-content aurea-venue-content--photo"
                      : "aurea-venue-content"
                  }
                >
                  {design.locationImage && (
                    <figure className="aurea-venue-photo">
                      <img src={design.locationImage} alt={design.locationAlt || ""} loading="lazy" />
                      {design.locationCaption && <figcaption>{design.locationCaption}</figcaption>}
                    </figure>
                  )}
                  <div className="aurea-venue-text">
                    {locationName && <p>{locationName}</p>}
                    {locationAddress && <p>{locationAddress}</p>}
                    {locationLink && details.showLocationButton !== false && (
                      <a className="aurea-link" href={locationLink} target="_blank" rel="noreferrer">
                        {details.locationButtonText || copy.map}
                        <span className="aurea-diagonal-arrow" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              </section>
            )}

            {travel && (
              <section className="aurea-travel" data-aurea-reveal>
                {travel.title && <h2 className="aurea-script">{travel.title}</h2>}
                {travel.intro && <p>{travel.intro}</p>}
                {[travel.arrival, travel.accommodation].filter(Boolean).map((part, index) => (
                  <div key={index}>
                    {part.title && <h3>{part.title}</h3>}
                    {part.text && <p>{part.text}</p>}
                    {part.mapLink && (
                      <a className="aurea-link" href={part.mapLink} target="_blank" rel="noreferrer">
                        {part.buttonText || copy.map}
                      </a>
                    )}
                    {part.hotels?.map((hotel, hotelIndex) => (
                      <p key={hotelIndex}>
                        {hotel.mapLink ? (
                          <a href={hotel.mapLink} target="_blank" rel="noreferrer">{hotel.name}</a>
                        ) : hotel.name}
                        {hotel.note && <small>{hotel.note}</small>}
                      </p>
                    ))}
                  </div>
                ))}
              </section>
            )}
          </article>
        </div>

        <div className="aurea-column aurea-column--details">
          {events.length > 0 && (
            <section
              className="aurea-program aurea-program--floral"
              data-aurea-reveal
              style={{
                "--aurea-program-image": `url("${design.programBackgroundImage || "/images/aurea/aurea-program-botanical.webp"}")`,
              }}
            >
              <h2 className="aurea-script">{copy.timeline}</h2>
              <ol className="aurea-timeline">
                {events.map((event, index) => {
                  const link = event.mapLink || mapsLink(event.location);
                  return (
                    <li key={`${index}-${event.time}`}>
                      <span className="aurea-timeline-curve" aria-hidden="true" />
                      <div className="aurea-timeline-text">
                        {event.time && <span className="aurea-event-time">{event.time}</span>}
                        <div>
                          {event.label && <h3>{event.label}</h3>}
                          {event.location && link ? (
                            <a href={link} target="_blank" rel="noreferrer">
                              {event.location} <span className="aurea-diagonal-arrow" aria-hidden="true" />
                            </a>
                          ) : event.mapLink ? (
                            <a href={event.mapLink} target="_blank" rel="noreferrer">
                              {copy.map} <span className="aurea-diagonal-arrow" aria-hidden="true" />
                            </a>
                          ) : null}
                          {event.pendingLocation && <p>{event.pendingLocation}</p>}
                          {event.description && <p>{event.description}</p>}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          )}

          {details.showDressCode && (
            <section className="aurea-dress" data-aurea-reveal>
              <div className="aurea-dress-oval">
                <h2 className="aurea-script">{details.dressCodeTitle || copy.dress}</h2>
              </div>
              {details.dressCodeNote && <p>{details.dressCodeNote}</p>}
              {palette.length > 0 && (
                <ul className="aurea-palette" aria-label={details.dressCodeTitle || copy.dress}>
                  {palette.map((swatch, index) => {
                    const color = typeof swatch === "string" ? swatch : swatch?.color;
                    const label = typeof swatch === "string" ? swatch : swatch?.label;
                    if (!color) return null;
                    return (
                      <li key={index}>
                        <span style={{ backgroundColor: color }} />
                        <span className="aurea-visually-hidden">{label || color}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
              {details.dressCodeWomen && (
                <p className="aurea-dress-role"><strong>{copy.women}</strong> {details.dressCodeWomen}</p>
              )}
              {details.dressCodeMen && (
                <p className="aurea-dress-role"><strong>{copy.men}</strong> {details.dressCodeMen}</p>
              )}
            </section>
          )}

          {notes.length > 0 && (
            <section className="aurea-note" data-aurea-reveal>
              <h2 className="aurea-script">{design.noteTitle || copy.note}</h2>
              {notes.map((note, index) => <p key={index}>{note}</p>)}
            </section>
          )}

          <section className="aurea-rsvp-stage">
            <AureaRSVP
              slug={slug}
              eventType={type}
              details={details}
              language={language}
              script={script}
              preview={preview}
            />
          </section>

          {contacts.length > 0 && (
            <section className="aurea-contact" data-aurea-reveal>
              <h2 className="aurea-script">{copy.contact}</h2>
              {contacts.filter((person) => person?.name || person?.phone).map((person, index) => (
                <p key={index}>
                  {person.name && <strong>{person.name}</strong>}
                  {person.phone && (
                    <a href={`tel:${String(person.phone).replace(/[^+\d]/g, "")}`}>
                      {person.phone}
                    </a>
                  )}
                </p>
              ))}
            </section>
          )}

          <div className="aurea-countdown-stage">
            <AureaCountdown
              targetDate={details.dateISO}
              brideName={brideName}
              groomName={groomName}
              venue={venue}
              details={details}
              language={language}
              script={script}
            />
          </div>

          <footer className="aurea-signature" data-aurea-reveal>
            <AureaFlourish />
            <p className="aurea-script">{design.closing || copy.closing}</p>
            <span className="aurea-signature-names">{weddingNames}</span>
          </footer>
        </div>
      </div>
    </main>
  );
}
