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

  const dressWomen = details?.dressCodeWomen || "";
  const dressMen = details?.dressCodeMen || "";

  const locationText =
    venue ||
    details?.venue ||
    details?.restaurantVenue ||
    events?.[events.length - 1]?.location ||
    "";

  return (
    <section className="editorial-card">
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

                {events.map((event, index) => (
                  <div
                    className="editorial-timeline-item"
                    key={`${event.time || "event"}-${index}`}
                  >
                    {event.time && (
                      <div className="editorial-time">{event.time}</div>
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
                ))}
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