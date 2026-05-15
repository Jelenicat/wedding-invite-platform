import { motion } from "framer-motion";
import "../styles/card.css";

import DarkFloralRSVP from "./DarkFloralRSVP";
import DarkFloralCountdown from "./DarkFloralCountdown";

function DarkFloralInvitationCard({
  slug,
  type,
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  venue,
  details = {},
}) {
  const safeBrideName = brideName || details?.brideName || "Mlada";
  const safeGroomName = groomName || details?.groomName || "Mladoženja";

  const bg =
    details?.cardBackground ||
    details?.backgroundImage ||
    "/images/dark-floral-card.jpg";

  const events = details?.events || [];

  const mainVenue = venue || details?.venue;
  const mainMapLink = details?.mapLink;

  const getEventMapLink = (event) => {
    if (event?.mapLink) return event.mapLink;

    if (event?.location) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        event.location
      )}`;
    }

    return null;
  };

  const hasDressCode =
    details?.showDressCode &&
    (details?.dressCodeTitle ||
      details?.dressCodeNote ||
      details?.dressCodeWomen ||
      details?.dressCodeMen ||
      details?.dressCodePalette?.length > 0);

  return (
    <>
      <main className="df-card-page">
        <div
          className="df-card-bg"
          style={{ backgroundImage: `url(${bg})` }}
        />

        <div className="df-card-overlay" />

        <motion.section
          className="df-card-content"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <div className="df-card-kicker">Pozivamo vas na venčanje</div>

          <h1 className="df-card-names">
            <span>{safeBrideName}</span>
            <em>&</em>
            <span>{safeGroomName}</span>
          </h1>

          <div className="df-card-date">{weddingDate}</div>

          {details?.welcomeText && (
            <p className="df-card-text">{details.welcomeText}</p>
          )}

          {events.length > 0 && (
            <>
              <div className="df-card-divider" />

              <section className="df-card-events">
                <h2 className="df-card-section-title">Plan venčanja</h2>

                {events.map((event, index) => {
                  const eventMapLink = getEventMapLink(event);

                  return (
                    <div
                      className="df-card-event"
                      key={`${event.label || "event"}-${index}`}
                    >
                      <div className="df-card-event-time">{event.time}</div>
                      <div className="df-card-event-line" />

                      <div className="df-card-event-info">
                        <div className="df-card-event-label">
                          {event.label}
                        </div>

                        {event.location && eventMapLink ? (
                          <a
                            className="df-card-event-location df-card-event-location-link"
                            href={eventMapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {event.location}
                          </a>
                        ) : (
                          event.location && (
                            <div className="df-card-event-location">
                              {event.location}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </section>

              <div className="df-card-divider df-card-divider-bottom" />
            </>
          )}

          {mainVenue && (
            <div className="df-card-location">
              <span>Lokacija</span>
              <strong>{mainVenue}</strong>

              {mainMapLink && (
                <a
                  className="df-card-map-button"
                  href={mainMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pogledaj lokaciju
                </a>
              )}
            </div>
          )}

          {details?.note && (
            <p className="df-card-note">{details.note}</p>
          )}

          {hasDressCode && (
            <section className="df-card-dress-code">
              <div className="df-card-divider" />

              <h2 className="df-card-section-title">
                {details?.dressCodeTitle || "Dress code"}
              </h2>

              {details?.dressCodeNote && (
                <p className="df-card-text">{details.dressCodeNote}</p>
              )}

              {details?.dressCodePalette?.length > 0 && (
                <div className="df-card-dress-palette">
                  {details.dressCodePalette.map((color, index) => (
                    <span
                      key={`${color}-${index}`}
                      className="df-card-dress-color"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}

              {(details?.dressCodeWomen || details?.dressCodeMen) && (
                <div className="df-card-dress-info">
                  {details?.dressCodeWomen && (
                    <div>
                      <span>Dame</span>
                      <p>{details.dressCodeWomen}</p>
                    </div>
                  )}

                  {details?.dressCodeMen && (
                    <div>
                      <span>Gospoda</span>
                      <p>{details.dressCodeMen}</p>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}
        </motion.section>
      </main>

      <DarkFloralRSVP
        slug={slug}
        eventType={type}
        brideName={safeBrideName}
        groomName={safeGroomName}
        details={details}
      />

      {details.dateISO && (
        <DarkFloralCountdown
          targetDate={details.dateISO}
          brideName={safeBrideName}
          groomName={safeGroomName}
          details={details}
        />
      )}
    </>
  );
}

export default DarkFloralInvitationCard;