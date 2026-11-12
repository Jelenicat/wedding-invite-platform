import { useLayoutEffect, useRef, useState } from "react";
import { motion as Motion, useReducedMotion } from "framer-motion";
import AdriaticaCountdown, { AdriaticaIcon } from "./AdriaticaCountdown.jsx";
import { adriaticaCoverImages } from "./AdriaticaIntro.jsx";
import AdriaticaRSVP from "./AdriaticaRSVP.jsx";
import "../styles/newcard.css";

const invitationCopy = {
  sr: {
    and: "i",
    scroll: "Listajte dalje",
    scrollLabel: "Listajte dalje do pozivnice",
    greeting: "Dragi naši,",
    program: "Program venčanja",
    boarding: "Ukrcavanje",
    boardingMap: "Mesto ukrcavanja",
    location: "Pogledaj lokaciju",
    venue: "Mesto proslave",
    attire: "Odevanje",
    arrival: "Dolazak i prevoz",
    airports: "Aerodromi",
    openMap: "Otvori na mapi",
    mapAction: "otvori lokaciju na mapi",
    airportTransfer: "Transfer sa aerodroma",
    weddingTransfer: "Prevoz na dan venčanja",
    viewProgram: "Pogledaj program",
    flights: "Informacije o letovima",
    stay: "Vaš boravak u Crnoj Gori",
    booking: "Još opcija na Booking.com",
    guide: "Dobro došli u Crnu Goru",
    contact: "Kontakt",
    reservation: "Rezervacija",
    moreInformation: "Više informacija",
  },
  de: {
    and: "und",
    scroll: "Weiterblättern",
    scrollLabel: "Weiter zur Hochzeitseinladung",
    greeting: "Ihr Lieben,",
    program: "Ablauf der Hochzeit",
    boarding: "Einstieg",
    boardingMap: "Treffpunkt für den Katamaran",
    location: "Auf der Karte ansehen",
    venue: "Ort der Feier",
    attire: "Dresscode",
    arrival: "Anreise und Transfer",
    airports: "Flughäfen",
    openMap: "Auf der Karte öffnen",
    mapAction: "auf der Karte öffnen",
    airportTransfer: "Flughafentransfer",
    weddingTransfer: "Transfer am Hochzeitstag",
    viewProgram: "Zum Hochzeitsablauf",
    flights: "Fluginformationen",
    stay: "Euer Aufenthalt in Montenegro",
    booking: "Weitere Unterkünfte auf Booking.com",
    guide: "Willkommen in Montenegro",
    contact: "Kontakt",
    reservation: "Reservierung",
    moreInformation: "Weitere Informationen",
    categories: {
      Restorani: "Restaurants",
      "Klubovi na plaži": "Beachclubs",
    },
  },
};

function AdriaticaJourneyDetails({ journey, copy }) {
  const route = [journey.from, journey.to].filter(Boolean).join(" – ");
  const boarding = journey.boarding
    ? `${copy.boarding} · ${journey.boarding}`
    : journey.pendingBoarding;

  return (
    <>
      {route && <p className="adriatica-program-note">{route}</p>}
      {boarding && <p className="adriatica-program-note">{boarding}</p>}
      {journey.boarding && (
        <TravelLink href={journey.boardingMapLink}>{copy.boardingMap}</TravelLink>
      )}
    </>
  );
}

export default function AdriaticaInvitationCard({
  brideName,
  groomName,
  weddingDate,
  venue,
  details = {},
  slug,
  language = "sr",
}) {
  const coverRef = useRef(null);
  const cardRef = useRef(null);
  const [coverScrolled, setCoverScrolled] = useState(false);
  const reducedMotion = useReducedMotion();
  const copy = language === "de" ? invitationCopy.de : invitationCopy.sr;
  const adriatica = details.adriatica || {};
  const events = details.events || [];
  const boatEvent = events.find((event) => event.journey);
  const displayDate = details.date || weddingDate;
  const scrollReveal = reducedMotion || typeof IntersectionObserver === "undefined"
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: "some", margin: "0px 0px -32px 0px" },
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
      };

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    coverRef.current?.focus({ preventScroll: true });

    const updateCoverCue = () => setCoverScrolled(window.scrollY > 2);
    window.addEventListener("scroll", updateCoverCue, { passive: true });
    return () => window.removeEventListener("scroll", updateCoverCue);
  }, []);

  const scrollToCard = () => {
    cardRef.current?.focus({ preventScroll: true });
    cardRef.current?.scrollIntoView({
      block: "start",
      behavior: reducedMotion ? "instant" : "smooth",
    });
  };

  return (
    <div className="adriatica" lang={language === "de" ? "de" : "sr-Latn"}>
      <main className="adriatica-invitation">
        <section
          ref={coverRef}
          tabIndex={-1}
          className="adriatica-cover"
          aria-label={`${brideName} ${copy.and} ${groomName}`}
        >
          <div className="adriatica-cover-art" aria-hidden="true">
            <img
              className="adriatica-cover-image"
              src={adriaticaCoverImages.background}
              alt=""
              width={1350}
              height={900}
              fetchPriority="high"
              draggable={false}
            />
          </div>
          <Motion.img
            className="adriatica-cover-monogram"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reducedMotion ? 0 : 0.65 }}
            src={adriaticaCoverImages.monogram}
            alt=""
            width={864}
            height={1296}
            draggable={false}
          />
          <button
            type="button"
            className="adriatica-cover-action"
            onClick={scrollToCard}
            aria-controls="adriatica-pismo"
            aria-label={copy.scrollLabel}
            data-scrolled={coverScrolled || undefined}
            tabIndex={coverScrolled ? -1 : undefined}
          >
            {copy.scroll}
            <AdriaticaIcon name="down" />
          </button>
        </section>

        <header
          ref={cardRef}
          id="adriatica-pismo"
          className="adriatica-hero"
          tabIndex={-1}
          aria-labelledby="adriatica-hero-names"
        >
          <Motion.div
            className="adriatica-hero-paper"
            {...scrollReveal}
          >
            <img
              className="adriatica-hero-paper-image"
              src={adriaticaCoverImages.paper}
              alt=""
              width={960}
              height={1344}
              draggable={false}
            />
            <div className="adriatica-hero-copy">
              <h1 id="adriatica-hero-names" className="adriatica-hero-names">
                <span>{brideName}</span>
                <span className="adriatica-hero-amp">&amp;</span>
                <span>{groomName}</span>
              </h1>
              <p className="adriatica-hero-date">{displayDate}</p>
              {adriatica.placeLine && (
                <p className="adriatica-hero-place">{adriatica.placeLine}</p>
              )}
            </div>
          </Motion.div>
        </header>

        <div className="adriatica-content">
          {details.welcomeText && (
            <Motion.section
              className="adriatica-section adriatica-welcome"
              {...scrollReveal}
            >
              <h2>{copy.greeting}</h2>
              <p className="adriatica-welcome-text">{details.welcomeText}</p>
              <p className="adriatica-signature">
                {`${brideName} ${copy.and} ${groomName}`}
              </p>
            </Motion.section>
          )}

          {events.length > 0 && (
            <Motion.section
              className="adriatica-section adriatica-schedule"
              id="adriatica-program"
              aria-labelledby="adriatica-program-title"
              {...scrollReveal}
            >
              <div className="adriatica-program-paper">
                <div className="adriatica-program-copy">
                  <header className="adriatica-program-heading">
                    <h2 id="adriatica-program-title">{copy.program}</h2>
                    {displayDate && <p>{displayDate}</p>}
                  </header>
                  <ol className="adriatica-program-list" role="list">
                    {events.map((event) => (
                      <li
                        className="adriatica-program-event"
                        key={`${event.time}-${event.label}`}
                      >
                        <p className="adriatica-program-time">
                          {/^[0-9]{2}:[0-9]{2}$/.test(event.time) ? (
                            <time dateTime={event.time}>{event.time}</time>
                          ) : (
                            event.time
                          )}
                        </p>
                        <h3>{event.label}</h3>
                        {(event.location || event.pendingLocation) && (
                          <p className="adriatica-program-note">
                            {event.location || event.pendingLocation}
                          </p>
                        )}
                        {event.description && (event !== boatEvent || !adriatica.transport) && (
                          <p className="adriatica-program-note">{event.description}</p>
                        )}
                        {event.location && (
                          <TravelLink href={event.mapLink}>{copy.location}</TravelLink>
                        )}
                        {event.journey && (
                          <AdriaticaJourneyDetails journey={event.journey} copy={copy} />
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </Motion.section>
          )}

          {(details.locationName || venue) && (
            <Motion.section
              className="adriatica-section adriatica-venue"
              aria-labelledby="adriatica-venue-title"
              {...scrollReveal}
            >
              <div className="adriatica-venue-copy">
                <h2 id="adriatica-venue-title">{copy.venue}</h2>
                <p className="adriatica-venue-name">
                  {details.locationName || venue}
                </p>
                {details.locationAddress && (
                  <p className="adriatica-venue-address">
                    {details.locationAddress}
                  </p>
                )}
              </div>
              {adriatica.artwork && (
                <figure className="adriatica-venue-art">
                  <img
                    src={adriatica.artwork}
                    alt={adriatica.artworkAlt || ""}
                    width={1200}
                    height={800}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              )}
              {details.mapLink && (
                <a
                  className="adriatica-venue-map"
                  href={details.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <AdriaticaIcon name="pin" /> {copy.location}
                </a>
              )}
            </Motion.section>
          )}

          <AdriaticaTransport
            transport={adriatica.transport}
            boatEvent={boatEvent}
            scrollReveal={scrollReveal}
            copy={copy}
          />

          {details.showDressCode && details.dressCodeNote && (
            <Motion.section
              className="adriatica-section adriatica-attire"
              aria-labelledby="adriatica-attire-title"
              {...scrollReveal}
            >
              <img
                className="adriatica-attire-art"
                src="/images/adriatica-destination/odevanje-masna.webp"
                alt=""
                width={600}
                height={400}
                loading="lazy"
                decoding="async"
              />
              <h2 id="adriatica-attire-title">{details.dressCodeTitle || copy.attire}</h2>
              <p>{details.dressCodeNote}</p>
            </Motion.section>
          )}

          <Motion.div {...scrollReveal}>
            <AdriaticaRSVP
              slug={slug}
              options={details.rsvpOptions}
              closed={details.rsvpClosed}
              language={language}
            />
          </Motion.div>
          <Motion.div {...scrollReveal}>
            <AdriaticaCountdown
              brideName={brideName}
              groomName={groomName}
              details={details}
              language={language}
            />
          </Motion.div>

          <AdriaticaGuestGuide config={adriatica} scrollReveal={scrollReveal} copy={copy} />

          <Motion.footer className="adriatica-footer" {...scrollReveal}>
            {slug === "valerija-marko" && (
              <img
                className="adriatica-footer-monogram"
                src={adriaticaCoverImages.monogram}
                alt=""
                width={864}
                height={1296}
                loading="lazy"
                decoding="async"
              />
            )}
            <p className="adriatica-footer-signature">
              {brideName} <span>&amp;</span> {groomName}
            </p>
            {displayDate && <p className="adriatica-footer-date">{displayDate}</p>}
          </Motion.footer>
        </div>
      </main>
    </div>
  );
}

function TravelLink({
  href,
  children,
  className = "adriatica-text-link",
  icon = "arrow",
  label,
}) {
  if (!href) return null;
  return (
    <a
      className={className}
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      {icon && <AdriaticaIcon name={icon} />}
    </a>
  );
}

function PlaceCards({ items, groupBy, copy }) {
  if (!items.length) return null;

  const groups = new Map();
  for (const item of items) {
    const title = item[groupBy] || "";
    if (!groups.has(title)) groups.set(title, []);
    groups.get(title).push(item);
  }

  return (
    <div className="adriatica-place-groups">
      {Array.from(groups, ([title, places]) => (
        <div className="adriatica-place-group" key={title}>
          {title && <h3>{copy.categories?.[title] || title}</h3>}
          <ul className="adriatica-place-list" role="list">
            {places.map((item) => (
              <li
                className="adriatica-place-card"
                key={`${item.name}-${item.location || item.category || ""}`}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.imageAlt || ""}
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <TravelLink
                  href={getPlaceMapLink(item)}
                  className="adriatica-place-map"
                  icon={null}
                  label={`${[item.name, item.location].filter(Boolean).join(", ")} – ${copy.mapAction}`}
                >
                  <span className="adriatica-place-copy">
                    {groupBy !== "category" && item.category && (
                      <span className="adriatica-place-location">
                        {copy.categories?.[item.category] || item.category}
                      </span>
                    )}
                    <span className="adriatica-place-name">
                      <span>{item.name}</span>
                      <AdriaticaIcon name="pin" />
                    </span>
                    {groupBy !== "location" && item.location && (
                      <span className="adriatica-place-location">{item.location}</span>
                    )}
                  </span>
                </TravelLink>
                {item.description && (
                  <p className="adriatica-place-description">{item.description}</p>
                )}
                {(item.bookingLink || item.url) && (
                  <div className="adriatica-link-row">
                    <TravelLink href={item.bookingLink}>{copy.reservation}</TravelLink>
                    <TravelLink href={item.url}>{copy.moreInformation}</TravelLink>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function getPlaceMapLink({ name, location, mapLink }) {
  if (mapLink) return mapLink;
  const query = [name, location, "Crna Gora"]
    .filter(Boolean)
    .join(", ")
    .replaceAll(" · ", ", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function AdriaticaTransport({ transport, boatEvent, scrollReveal, copy }) {
  if (!transport) return null;

  return (
    <Motion.section
      className="adriatica-section adriatica-travel"
      id="adriatica-dolazak"
      aria-labelledby="adriatica-travel-title"
      {...scrollReveal}
    >
      <div className="adriatica-section-heading">
        <h2 id="adriatica-travel-title">{copy.arrival}</h2>
      </div>
      {transport.airports?.length > 0 && (
        <div className="adriatica-airports" role="group" aria-label={copy.airports}>
          {transport.airports.map((airport) => (
            <article key={airport.name} className="adriatica-airport">
              <h3>
                {airport.name.replace(/^Aerodrom\s+/i, "")}
                {airport.code && (
                  <span className="adriatica-airport-code"> ({airport.code})</span>
                )}
              </h3>
              {airport.description && <p>{airport.description}</p>}
              <TravelLink href={airport.mapLink}>{copy.openMap}</TravelLink>
            </article>
          ))}
        </div>
      )}
      <div className="adriatica-travel-details">
        {(transport.transfers || transport.pendingTransfers) && (
          <div>
            <h3>{copy.airportTransfer}</h3>
            <p>{transport.transfers || transport.pendingTransfers}</p>
          </div>
        )}
        {boatEvent && (
          <div>
            <img
              className="adriatica-travel-art"
              src="/images/adriatica-destination/katamaran-akvarel.webp"
              alt=""
              width={900}
              height={600}
              loading="lazy"
              decoding="async"
            />
            <h3>{copy.weddingTransfer}</h3>
            <p>{boatEvent.description}</p>
            <a
              className="adriatica-text-link adriatica-travel-program-link"
              href="#adriatica-program"
            >
              {copy.viewProgram} <AdriaticaIcon name="arrow" />
            </a>
          </div>
        )}
        {transport.flights?.some((flight) => flight.name) && (
          <div>
            <h3>{copy.flights}</h3>
            <ul className="adriatica-travel-links">
              {transport.flights
                .filter((flight) => flight.name)
                .map((flight) => (
                  <li key={flight.name}>
                    {flight.url ? (
                      <TravelLink href={flight.url}>
                        {flight.name}
                      </TravelLink>
                    ) : (
                      <strong>{flight.name}</strong>
                    )}
                    {flight.description && <p>{flight.description}</p>}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </Motion.section>
  );
}

function AdriaticaGuestGuide({ config, scrollReveal, copy }) {
  const { accommodation, guide, contacts = [] } = config;
  const hotels = (accommodation?.hotels || []).filter((hotel) => hotel.name);
  const recommendations = (guide?.places || []).filter((place) => place.name);
  const activeContacts = contacts.filter(
    (contact) => contact.name && (contact.phone || contact.whatsapp),
  );

  return (
    <>
      {(accommodation?.intro || hotels.length > 0 || accommodation?.bookingLink) && (
        <Motion.section
          className="adriatica-section adriatica-stay adriatica-travel-info"
          aria-labelledby="adriatica-stay-title"
          {...scrollReveal}
        >
          <div className="adriatica-section-heading">
            <img
              className="adriatica-guide-emblem"
              src={adriaticaCoverImages.monogram}
              alt=""
              width={864}
              height={1296}
              loading="lazy"
              decoding="async"
            />
            <h2 id="adriatica-stay-title">{copy.stay}</h2>
            {accommodation.intro && <p>{accommodation.intro}</p>}
          </div>
          <PlaceCards items={hotels} groupBy="location" copy={copy} />
          {accommodation.bookingLink && (
            <div className="adriatica-booking">
              <TravelLink
                href={accommodation.bookingLink}
                className="adriatica-booking-link"
              >
                {copy.booking}
              </TravelLink>
            </div>
          )}
        </Motion.section>
      )}

      {recommendations.length > 0 && (
        <Motion.section
          className="adriatica-section adriatica-travel-info adriatica-local-guide"
          aria-labelledby="adriatica-guide-title"
          {...scrollReveal}
        >
          <div className="adriatica-section-heading">
            <h2 id="adriatica-guide-title">{copy.guide}</h2>
            {guide.intro && <p>{guide.intro}</p>}
          </div>
          <PlaceCards items={recommendations} groupBy="category" copy={copy} />
        </Motion.section>
      )}

      {activeContacts.length > 0 && (
        <Motion.section
          className="adriatica-section adriatica-travel-info"
          aria-labelledby="adriatica-contact-title"
          {...scrollReveal}
        >
          <div className="adriatica-section-heading">
            <h2 id="adriatica-contact-title">{copy.contact}</h2>
          </div>
          <ul className="adriatica-contacts">
            {activeContacts.map((contact) => (
              <li key={`${contact.name}-${contact.phone || contact.whatsapp}`}>
                <h3>{contact.name}</h3>
                {contact.description && <p>{contact.description}</p>}
                <div className="adriatica-link-row">
                  {contact.phone && (
                    <a
                      className="adriatica-text-link"
                      href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
                    >
                      <AdriaticaIcon name="phone" /> {contact.phone}
                    </a>
                  )}
                  {contact.whatsapp && (
                    <TravelLink href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}>
                      WhatsApp
                    </TravelLink>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Motion.section>
      )}
    </>
  );
}
