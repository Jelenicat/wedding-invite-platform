import { useLayoutEffect, useRef, useState } from "react";
import { motion as Motion, useReducedMotion } from "framer-motion";
import AdriaticaCountdown, { AdriaticaIcon } from "./AdriaticaCountdown.jsx";
import { adriaticaCoverImages } from "./AdriaticaIntro.jsx";
import AdriaticaRSVP from "./AdriaticaRSVP.jsx";
import "../styles/newcard.css";
import "../styles/adriatica-refresh.css";

const invitationCopy = {
  sr: {
    and: "i",
    scroll: "Listajte dalje",
    scrollLabel: "Listajte dalje do pozivnice",
    greeting: "Dragi naši,",
    coupleCaption: "Jedva čekamo da ovaj dan podelimo sa vama.",
    program: "Tok venčanja",
    programKicker: "Naš dan u Boki",
    hour: "h",
    boarding: "Ukrcavanje",
    boardingMap: "Mesto ukrcavanja",
    location: "Pogledaj lokaciju",
    venue: "Mesto proslave",
    churchLocality: "Kotor, Crna Gora",
    churchArtAlt: "Akvarel Hrama Svetog Nikole sa dva zvonika u Starom gradu u Kotoru",
    arrival: "Dolazak avionom",
    note: "Napomena:",
    airports: "Aerodromi",
    openMap: "Otvori na mapi",
    mapAction: "otvori lokaciju na mapi",
    airportTransfer: "Transfer sa aerodroma",
    taxis: "Taksi prevoz",
    taxiNote: "Svim navedenim taksi službama možete pisati i preko WhatsApp-a.",
    carRental: "Iznajmljivanje automobila",
    viewRentalCars: "Pogledaj ponudu vozila",
    weddingTransfer: "Transfer na dan venčanja",
    viewProgram: "Pogledaj program",
    flights: "Informacije o letovima",
    stay: "Vaš boravak u Crnoj Gori",
    booking: "Još opcija na Booking.com",
    guide: "Restorani i beach clubovi",
    contact: "Kontakt",
    reservation: "Rezervacija",
    moreInformation: "Više informacija",
  },
  de: {
    and: "und",
    scroll: "Weiterblättern",
    scrollLabel: "Weiter zur Hochzeitseinladung",
    greeting: "Ihr Lieben,",
    coupleCaption: "Wir freuen uns darauf, diesen Tag mit euch zu teilen.",
    program: "Ablauf der Hochzeit",
    programKicker: "Unser Tag in der Bucht",
    hour: "Uhr",
    boarding: "Einstieg",
    boardingMap: "Treffpunkt zum Einsteigen",
    location: "Auf der Karte ansehen",
    venue: "Ort der Feier",
    churchLocality: "Kotor, Montenegro",
    churchArtAlt: "Aquarell der Nikolauskirche mit ihren beiden Glockentürmen in der Altstadt von Kotor",
    arrival: "Anreise mit dem Flugzeug",
    note: "Hinweis:",
    airports: "Flughäfen",
    openMap: "Auf der Karte öffnen",
    mapAction: "auf der Karte öffnen",
    airportTransfer: "Flughafentransfer",
    taxis: "Taxis vor Ort",
    taxiNote: "Alle genannten Taxiunternehmen erreicht ihr auch per WhatsApp.",
    carRental: "Mietwagen",
    viewRentalCars: "Mietwagen ansehen",
    weddingTransfer: "Transfer am Hochzeitstag",
    viewProgram: "Zum Hochzeitsablauf",
    flights: "Fluginformationen",
    stay: "Euer Aufenthalt in Montenegro",
    booking: "Weitere Unterkünfte auf Booking.com",
    guide: "Restaurants & Beachclubs",
    contact: "Kontakt",
    reservation: "Reservierung",
    moreInformation: "Weitere Informationen",
    categories: {
      Restorani: "Restaurants",
      "Klubovi na plaži": "Beachclubs",
    },
  },
};

const scheduleIconNames = new Set([
  "chapel",
  "boat",
  "glass",
  "rings",
  "dinner",
  "party",
]);

function AdriaticaScheduleIcon({ name }) {
  return (
    <span className="adriatica-program-icon" aria-hidden="true">
      {scheduleIconNames.has(name) ? (
        <img
          src={`/icons/adriatica-${name}.svg`}
          alt=""
          width={64}
          height={64}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <AdriaticaIcon name={name || "calendar"} />
      )}
    </span>
  );
}

function AdriaticaJourneyDetails({ journey, copy, inTransferSection = false }) {
  const route = [journey.from, journey.to].filter(Boolean).join(" – ");
  const boarding = journey.boarding
    ? `${copy.boarding} · ${journey.boarding}`
    : journey.pendingBoarding;

  return (
    <>
      {!inTransferSection && route && (
        <p className="adriatica-program-note">{route}</p>
      )}
      {boarding && (
        <p
          className={
            inTransferSection ? "adriatica-boarding-note" : "adriatica-program-note"
          }
        >
          {boarding}
        </p>
      )}
      {journey.boarding && (
        <TravelLink href={journey.boardingMapLink}>
          {copy.boardingMap}
        </TravelLink>
      )}
    </>
  );
}

function AdriaticaVenue({
  headingId,
  heading,
  name,
  address,
  artwork,
  artworkAlt,
  mapLink,
  paired = false,
  copy,
  scrollReveal,
}) {
  return (
    <Motion.section
      className={`adriatica-section adriatica-venue${paired ? " adriatica-venue--paired" : ""}`}
      aria-labelledby={headingId}
      {...scrollReveal}
    >
      <div className="adriatica-venue-copy">
        <h2 id={headingId}>{heading}</h2>
        <p className="adriatica-venue-name">{name}</p>
        {address && <p className="adriatica-venue-address">{address}</p>}
      </div>
      {artwork && (
        <figure className="adriatica-venue-art">
          <img
            src={artwork}
            alt={artworkAlt || ""}
            width={1200}
            height={800}
            loading="lazy"
            decoding="async"
          />
        </figure>
      )}
      {mapLink && (
        <a
          className="adriatica-venue-map"
          href={mapLink}
          aria-label={paired ? `${copy.location} – ${name}` : undefined}
          target="_blank"
          rel="noopener noreferrer"
        >
          {!paired && <AdriaticaIcon name="pin" />} {copy.location}
        </a>
      )}
    </Motion.section>
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
  intro,
  introReady = true,
  revealOrnament = introReady,
}) {
  const coverRef = useRef(null);
  const cardRef = useRef(null);
  const [coverScrolled, setCoverScrolled] = useState(false);
  const [ornamentStatus, setOrnamentStatus] = useState("loading");
  const reducedMotion = useReducedMotion();
  const copy = language === "de" ? invitationCopy.de : invitationCopy.sr;
  const adriatica = details.adriatica || {};
  const couplePhoto =
    slug === "valerija-marko" && adriatica.couplePhoto !== false
      ? {
          src: "/images/adriatica-destination/valerija-marko-fotografija.png",
          alt: `${brideName} ${copy.and} ${groomName}`,
          caption: copy.coupleCaption,
          position: "55% 50%",
          layout: "landscape",
          width: 2048,
          height: 1362,
          ...adriatica.couplePhoto,
        }
      : adriatica.couplePhoto;
  const events = details.events || [];
  const boatEvent = events.find((event) => event.journey);
  const journeyInTransport =
    adriatica.transport && boatEvent?.scheduleSummary ? boatEvent : undefined;
  const churchEvent =
    slug === "valerija-marko"
      ? events.find((event) => event.icon === "chapel" && event.location)
      : undefined;
  const displayDate = details.date || weddingDate;
  const scrollReveal =
    reducedMotion || typeof IntersectionObserver === "undefined"
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: "some", margin: "0px 0px -32px 0px" },
          transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        };

  useLayoutEffect(() => {
    if (!introReady) return;

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    coverRef.current?.focus({ preventScroll: true });

    const updateCoverCue = () => setCoverScrolled(window.scrollY > 2);
    window.addEventListener("scroll", updateCoverCue, { passive: true });
    return () => window.removeEventListener("scroll", updateCoverCue);
  }, [introReady]);

  const scrollToCard = () => {
    cardRef.current?.focus({ preventScroll: true });
    cardRef.current?.scrollIntoView({
      block: "start",
      behavior: reducedMotion ? "instant" : "smooth",
    });
  };

  return (
    <div
      className="adriatica adriatica-soft"
      lang={language === "de" ? "de" : "sr-Latn"}
    >
      <main className="adriatica-invitation">
        <section
          ref={coverRef}
          tabIndex={-1}
          className="adriatica-cover"
          data-ornament={revealOrnament ? ornamentStatus : "waiting"}
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
          <img
            className="adriatica-cover-monogram"
            src={adriaticaCoverImages.monogram}
            onLoad={() =>
              setOrnamentStatus((status) =>
                status === "loading" ? "revealing" : status,
              )
            }
            onError={() => setOrnamentStatus("unavailable")}
            onAnimationEnd={({ animationName }) => {
              if (animationName === "adriatica-vm-ornament-appear") {
                setOrnamentStatus("revealed");
              }
            }}
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
            disabled={!introReady}
            data-scrolled={coverScrolled || undefined}
            tabIndex={coverScrolled ? -1 : undefined}
          >
            {copy.scroll}
            <AdriaticaIcon name="down" />
          </button>
          {intro}
        </section>

        {introReady && (
          <>
            <header
              ref={cardRef}
              id="adriatica-pismo"
              className="adriatica-hero"
              tabIndex={-1}
              aria-labelledby="adriatica-hero-names"
            >
              <Motion.div className="adriatica-hero-paper" {...scrollReveal}>
                <img
                  className="adriatica-hero-paper-image"
                  src={adriaticaCoverImages.paper}
                  alt=""
                  width={960}
                  height={1344}
                  draggable={false}
                />
                <div className="adriatica-hero-copy">
                  <h1
                    id="adriatica-hero-names"
                    className="adriatica-hero-names"
                  >
                    <span>{brideName}</span>
                    <span className="adriatica-hero-amp">&amp;</span>
                    <span>{groomName}</span>
                  </h1>
                  <p className="adriatica-hero-date">{displayDate}</p>
                  {adriatica.placeLine && (
                    <p className="adriatica-hero-place">
                      {adriatica.placeLine}
                    </p>
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
                  <p className="adriatica-welcome-text">
                    {details.welcomeText}
                  </p>
                  <p className="adriatica-signature">
                    {`${brideName} ${copy.and} ${groomName}`}
                  </p>
                </Motion.section>
              )}

              {couplePhoto?.src?.trim() && (
                <Motion.figure
                  className={`adriatica-couple-photo${couplePhoto.layout === "landscape" ? " adriatica-couple-photo--wide" : ""}`}
                  {...scrollReveal}
                >
                  <img
                    src={couplePhoto.src}
                    alt={
                      couplePhoto.alt ||
                      `${brideName} ${copy.and} ${groomName}`
                    }
                    width={couplePhoto.width || 1200}
                    height={couplePhoto.height || 1500}
                    loading="lazy"
                    decoding="async"
                    style={{
                      objectPosition:
                        couplePhoto.position || "50% 50%",
                    }}
                  />
                  {couplePhoto.caption && (
                    <figcaption>{couplePhoto.caption}</figcaption>
                  )}
                </Motion.figure>
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
                        <p className="adriatica-program-kicker">
                          {copy.programKicker}
                        </p>
                        <h2 id="adriatica-program-title">{copy.program}</h2>
                        {displayDate && <p>{displayDate}</p>}
                      </header>
                      <ol className="adriatica-program-list" role="list">
                        {events.map((event) => (
                          <li
                            className="adriatica-program-event"
                            key={`${event.time}-${event.label}`}
                          >
                            <AdriaticaScheduleIcon name={event.icon} />
                            <div className="adriatica-program-event-copy">
                              <p className="adriatica-program-time">
                                {/^[0-9]{2}:[0-9]{2}$/.test(event.time) ? (
                                  <time dateTime={event.time}>
                                    {event.time}
                                    <span> {copy.hour}</span>
                                  </time>
                                ) : (
                                  event.time
                                )}
                              </p>
                              <h3>{event.label}</h3>
                              {event.scheduleSummary ? (
                                <p className="adriatica-program-note">
                                  {event.scheduleSummary}
                                </p>
                              ) : (
                                <>
                                  {(event.location || event.pendingLocation) && (
                                    <p className="adriatica-program-note">
                                      {event.location || event.pendingLocation}
                                    </p>
                                  )}
                                  {event.address && (
                                    <p className="adriatica-program-note adriatica-program-address">
                                      {event.address}
                                    </p>
                                  )}
                                  {event.description && (
                                    <p className="adriatica-program-note">
                                      {event.description}
                                    </p>
                                  )}
                                </>
                              )}
                              {event.location && event !== churchEvent && (
                                <TravelLink href={event.mapLink}>
                                  {copy.location}
                                </TravelLink>
                              )}
                              {event.journey && event !== journeyInTransport && (
                                <AdriaticaJourneyDetails
                                  journey={event.journey}
                                  copy={copy}
                                />
                              )}
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </Motion.section>
              )}

              {(details.locationName || venue) && (
                <AdriaticaVenue
                  headingId="adriatica-venue-title"
                  heading={copy.venue}
                  name={details.locationName || venue}
                  address={details.locationAddress}
                  artwork={adriatica.artwork}
                  artworkAlt={adriatica.artworkAlt}
                  mapLink={details.mapLink}
                  paired={Boolean(churchEvent)}
                  copy={copy}
                  scrollReveal={scrollReveal}
                />
              )}
              {churchEvent && (
                <AdriaticaVenue
                  headingId="adriatica-church-title"
                  heading={churchEvent.label}
                  name={churchEvent.location}
                  address={copy.churchLocality}
                  artwork="/images/adriatica-destination/hram-svetog-nikole-kotor-akvarel.webp"
                  artworkAlt={copy.churchArtAlt}
                  mapLink={churchEvent.mapLink}
                  paired
                  copy={copy}
                  scrollReveal={scrollReveal}
                />
              )}

              <AdriaticaTransport
                transport={adriatica.transport}
                boatEvent={boatEvent}
                scrollReveal={scrollReveal}
                copy={copy}
              />

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

              <AdriaticaGuestGuide
                config={adriatica}
                scrollReveal={scrollReveal}
                copy={copy}
              />

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
                {displayDate && (
                  <p className="adriatica-footer-date">{displayDate}</p>
                )}
              </Motion.footer>
            </div>
          </>
        )}
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
                      <span className="adriatica-place-location">
                        {item.location}
                      </span>
                    )}
                  </span>
                </TravelLink>
                {item.description && (
                  <p className="adriatica-place-description">
                    {item.description}
                  </p>
                )}
                {(item.bookingLink || item.url) && (
                  <div className="adriatica-link-row">
                    <TravelLink href={item.bookingLink}>
                      {copy.reservation}
                    </TravelLink>
                    <TravelLink href={item.url}>
                      {copy.moreInformation}
                    </TravelLink>
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

function AdriaticaContactLinks({ phone, whatsapp, name }) {
  return (
    <div className="adriatica-link-row">
      {phone && (
        <a
          className="adriatica-text-link"
          href={`tel:${phone.replace(/[^+\d]/g, "")}`}
          aria-label={name && `${name} · ${phone}`}
        >
          <AdriaticaIcon name="phone" /> {phone}
        </a>
      )}
      {whatsapp && (
        <TravelLink
          href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
          label={name && `WhatsApp · ${name}`}
        >
          WhatsApp
        </TravelLink>
      )}
    </div>
  );
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
        <div
          className="adriatica-airports"
          role="group"
          aria-label={copy.airports}
        >
          {transport.airports.map((airport) => (
            <article key={airport.name} className="adriatica-airport">
              <h3>
                {airport.name.replace(/^Aerodrom\s+/i, "")}
                {airport.code && (
                  <span className="adriatica-airport-code">
                    {" "}
                    ({airport.code})
                  </span>
                )}
              </h3>
              {airport.description && <p>{airport.description}</p>}
              <TravelLink href={airport.mapLink}>{copy.openMap}</TravelLink>
            </article>
          ))}
        </div>
      )}
      {transport.flightNote && (
        <aside className="adriatica-flight-note">
          <AdriaticaIcon name="plane" />
          <p>
            <strong>{copy.note}</strong> {transport.flightNote}
          </p>
        </aside>
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
              src={
                transport.boatArtwork ||
                "/images/adriatica-destination/brod-akvarel.webp"
              }
              alt=""
              width={1800}
              height={900}
              loading="lazy"
              decoding="async"
            />
            <h3>{copy.weddingTransfer}</h3>
            {transport.weddingTransferNote && (
              <p>{transport.weddingTransferNote}</p>
            )}
            <p>{boatEvent.description}</p>
            {boatEvent.scheduleSummary ? (
              <AdriaticaJourneyDetails
                journey={boatEvent.journey}
                copy={copy}
                inTransferSection
              />
            ) : boatEvent.journey?.pendingBoarding && (
              <p className="adriatica-boarding-note">
                {boatEvent.journey.pendingBoarding}
              </p>
            )}
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
                      <TravelLink href={flight.url}>{flight.name}</TravelLink>
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
  const { accommodation, guide, transport, contacts = [] } = config;
  const hotels = (accommodation?.hotels || []).filter((hotel) => hotel.name);
  const recommendations = (guide?.places || []).filter((place) => place.name);
  const taxis = Array.isArray(transport?.taxis)
    ? transport.taxis.filter((taxi) => taxi?.name && taxi.phone)
    : [];
  const carRental = transport?.carRental;
  const rentalUrl = carRental?.url?.trim();
  const activeContacts = contacts.filter(
    (contact) => contact.name && (contact.phone || contact.whatsapp),
  );

  return (
    <>
      {(accommodation?.intro ||
        hotels.length > 0 ||
        accommodation?.bookingLink) && (
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
            {guide.lead && <p className="adriatica-guide-lead">{guide.lead}</p>}
            {guide.intro && <p>{guide.intro}</p>}
          </div>
          <PlaceCards items={recommendations} groupBy="category" copy={copy} />
        </Motion.section>
      )}

      {taxis.length > 0 && (
        <Motion.section
          className="adriatica-section adriatica-travel-info"
          aria-labelledby="adriatica-taxi-title"
          {...scrollReveal}
        >
          <div className="adriatica-section-heading">
            <h2 id="adriatica-taxi-title">{copy.taxis}</h2>
            <p>{copy.taxiNote}</p>
          </div>
          <ul className="adriatica-travel-links adriatica-contacts">
            {taxis.map((taxi) => (
              <li key={taxi.phone}>
                {taxi.area && <strong>{taxi.area}</strong>}
                <span>{taxi.name}</span>
                <AdriaticaContactLinks
                  name={taxi.name}
                  phone={taxi.phone}
                  whatsapp={taxi.phone}
                />
              </li>
            ))}
          </ul>
        </Motion.section>
      )}

      {rentalUrl && (
        <Motion.section
          className="adriatica-section adriatica-travel-info"
          aria-labelledby="adriatica-car-rental-title"
          {...scrollReveal}
        >
          <div className="adriatica-section-heading">
            <h2 id="adriatica-car-rental-title">{copy.carRental}</h2>
            {carRental.description && <p>{carRental.description}</p>}
            {carRental.bookingNote && <p>{carRental.bookingNote}</p>}
            <TravelLink href={rentalUrl} className="adriatica-booking-link">
              {copy.viewRentalCars}
            </TravelLink>
          </div>
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
                <AdriaticaContactLinks
                  phone={contact.phone}
                  whatsapp={contact.whatsapp}
                />
              </li>
            ))}
          </ul>
        </Motion.section>
      )}
    </>
  );
}
