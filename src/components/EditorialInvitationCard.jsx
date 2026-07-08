import { motion } from "framer-motion";
import EditorialRSVP from "./EditorialRSVP";
import EditorialCountdown from "./EditorialCountdown";

export default function EditorialInvitationCard({
  brideName,
  groomName,
  weddingDate,
  details = {},
  image1,
  venue,
  slug,
  type,
}) {
  const events = details?.events || [];
  const isAleksandraAleksa = slug === "aleksandra-aleksa";

  const dressWomen = details?.dressCodeWomen || "";
  const dressMen = details?.dressCodeMen || "";

  const locationText =
    venue ||
    details?.venue ||
    details?.restaurantVenue ||
    events?.[events.length - 1]?.location ||
    "";

  const getAleksandraAleksaEventIcon = (event) => {
  if (!isAleksandraAleksa) return null;

  const label = event?.label?.toLowerCase() || "";
  const icon = event?.icon || "";

  if (icon === "church" || label.includes("crkven")) {
    return "/icons/crkva.svg";
  }

  if (
    icon === "gathering" ||
    label.includes("okupljanje") ||
    label.includes("skup")
  ) {
    return "/icons/gathering.svg";
  }

  if (
    icon === "civil" ||
    label.includes("građansko") ||
    label.includes("gradjansko")
  ) {
    return "/icons/civil.svg";
  }

  if (
    icon === "restaurant" ||
    icon === "dinner" ||
    label.includes("restoran") ||
    label.includes("večera") ||
    label.includes("vecera") ||
    label.includes("proslava")
  ) {
    return "/icons/restaurant.svg";
  }

  return null;
};

  return (
    <section
      className={`editorial-card ${
        slug ? `editorial-card--${slug}` : ""
      }`}
    >
      <div className="editorial-card-shell">
        <motion.div
          className="editorial-card-inner"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8 }}
        >
          {/* UVOD */}
          <section className="editorial-hero">
            {isAleksandraAleksa ? (
              <>
                <div className="editorial-hero-monogram">A &amp; A</div>

                <div className="editorial-hero-names">
                  <span>{brideName}</span>
                  <span className="editorial-hero-heart">♡</span>
                  <span>{groomName}</span>
                </div>

                <p className="editorial-hero-welcome">
                  {details?.welcomeText ||
                    "Biće nam izuzetno drago da svojim prisustvom ulepšate naš poseban dan."}
                </p>

                <div className="editorial-hero-date-label">DATUM</div>

                <div className="editorial-hero-date">{weddingDate}</div>
              </>
            ) : (
              <>
                <p className="editorial-hero-top">
                  Ljubav je najveći
                  <br />
                  trenutak koji želimo sa vama da
                  <br />
                  podelimo na našem posebnom danu
                </p>

                <div className="editorial-hero-date">{weddingDate}</div>

                <p className="editorial-hero-bottom">
                  Radujemo se što ćemo
                  <br />
                  zajedno proslaviti početak
                  <br />
                  našeg zajedničkog života
                </p>
              </>
            )}
          </section>

          {/* LOKACIJA */}
          <section className="editorial-section editorial-location-section">
            <h2 className="editorial-title">LOKACIJA</h2>
            <div className="editorial-script">restoran</div>

            {image1 && (
              <div className="editorial-location-image-wrap">
                <img
                  src={image1}
                  alt={`${brideName} i ${groomName}`}
                  className="editorial-location-image"
                />
              </div>
            )}

            <div className="editorial-location-text">
              {locationText ? (
                <div className="editorial-location-stack">
                  <div className="editorial-location-name-row">
                    {details?.mapLink ? (
                      <a
                        href={details.mapLink}
                        target="_blank"
                        rel="noreferrer"
                        className="editorial-location-main-link"
                      >
                        {locationText}
                      </a>
                    ) : (
                      <span className="editorial-location-main-link">
                        {locationText}
                      </span>
                    )}
                  </div>

                  {details?.mapLink && (
                    <div className="editorial-location-button-row">
                      <a
                        href={details.mapLink}
                        target="_blank"
                        rel="noreferrer"
                        className="editorial-map-link"
                      >
                        Otvori lokaciju
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <p style={{ opacity: 0.5 }}>Lokacija uskoro</p>
              )}
            </div>
          </section>

          {/* RASPORED */}
          {!!events.length && (
            <section className="editorial-section editorial-timing-section">
              <h2 className="editorial-title">RASPORED</h2>
              <div className="editorial-script">raspored</div>

              <div className="editorial-timeline">
                <div className="editorial-timeline-line" />

                {events.map((event, index) => {
                  const eventIconSrc = getAleksandraAleksaEventIcon(event);

                  return (
                    <div
                      className="editorial-timeline-item"
                      key={`${event.time || "event"}-${index}`}
                    >
                      {event.time && (
                        <div className="editorial-time">{event.time}</div>
                      )}

                      {eventIconSrc && (
                        <img
                          src={eventIconSrc}
                          alt=""
                          className="editorial-event-icon"
                        />
                      )}

                      {event.label && (
                        <div className="editorial-time-label">
                          {event.label}
                        </div>
                      )}

                      {event.location &&
                        (event.mapLink ? (
                          <a
                            href={event.mapLink}
                            target="_blank"
                            rel="noreferrer"
                            className="editorial-time-location editorial-time-location-link"
                          >
                            {event.location}
                          </a>
                        ) : (
                          <div className="editorial-time-location">
                            {event.location}
                          </div>
                        ))}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* KOD OBLAČENJA */}
          {details?.showDressCode && (
            <section className="editorial-section editorial-dress-section">
              <h2 className="editorial-title editorial-dress-title">
                KOD
                <br />
                OBLAČENJA
              </h2>

              <div className="editorial-dress-copy">
                {dressWomen && <p>{dressWomen}</p>}
                {dressMen && <p>{dressMen}</p>}

                {!dressWomen && !dressMen && details?.dressCodeNote && (
                  <p>{details.dressCodeNote}</p>
                )}

                {!dressWomen && !dressMen && !details?.dressCodeNote && (
                  <p>Elegantna garderoba u skladu sa stilom proslave.</p>
                )}
              </div>

              <div className="editorial-color-row">
                <span className="editorial-color editorial-color-light" />
                <span className="editorial-color editorial-color-dark" />
              </div>

              <div className="editorial-color-label">CRNI TONOVI</div>
            </section>
          )}

          {/* POTVRDA DOLASKA */}
          <EditorialRSVP
            slug={slug}
            eventType={type || "wedding"}
            brideName={brideName}
            groomName={groomName}
            note={details?.note}
          />

          {/* ODBROJAVANJE */}
          <EditorialCountdown
            targetDate={details?.dateISO}
            brideName={brideName}
            groomName={groomName}
            details={details}
            script={details?.script || "latin"}
            slug={slug}
          />
        </motion.div>
      </div>
    </section>
  );
}