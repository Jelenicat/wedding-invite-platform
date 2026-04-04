import { motion } from "framer-motion";
import EditorialRSVP from "./EditorialRSVP";
import EditorialCountdown from "./EditorialCountdown";

export default function EditorialInvitationCard({
  brideName,
  groomName,
  weddingDate,
  details,
  image1,
  venue,
}) {
  const events = details?.events || [];
  const event1 = events[0];
  const event2 = events[1];
  const event3 = events[2];

  const dressWomen = details?.dressCodeWomen || "";
  const dressMen = details?.dressCodeMen || "";

  const locationText =
    venue ||
    details?.venue ||
    details?.restaurantVenue ||
    event3?.location ||
    event2?.location ||
    event1?.location ||
    "";

  const monogram = `${brideName?.[0] || ""}${groomName?.[0] || ""}`;

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
          {/* HERO */}
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

          {/* LOCATION */}
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
                <p>{locationText}</p>
              ) : (
                <p style={{ opacity: 0.5 }}>Lokacija uskoro</p>
              )}

              {details?.mapLink && (
                <a
                  href={details.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="editorial-map-link"
                >
                  Otvori lokaciju
                </a>
              )}
            </div>

          
          </section>

          {/* TIMING */}
          {!!events.length && (
            <section className="editorial-section editorial-timing-section">
              <h2 className="editorial-title">RASPORED</h2>
              <div className="editorial-script">timeline</div>

              <div className="editorial-timeline">
                <div className="editorial-timeline-line" />

                {event1 && (
                  <div className="editorial-timeline-item">
                    <div className="editorial-time">{event1.time}</div>
                    <div className="editorial-time-label">{event1.label}</div>
                    {event1.location && (
                      <div className="editorial-time-location">
                        {event1.location}
                      </div>
                    )}
                  </div>
                )}

                {event2 && (
                  <div className="editorial-timeline-item">
                    <div className="editorial-time">{event2.time}</div>
                    <div className="editorial-time-label">{event2.label}</div>
                    {event2.location && (
                      <div className="editorial-time-location">
                        {event2.location}
                      </div>
                    )}
                  </div>
                )}

                {event3 && (
                  <div className="editorial-timeline-item">
                    <div className="editorial-time">{event3.time}</div>
                    <div className="editorial-time-label">{event3.label}</div>
                    {event3.location && (
                      <div className="editorial-time-location">
                        {event3.location}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* DRESS CODE */}
          <section className="editorial-section editorial-dress-section">
            <h2 className="editorial-title editorial-dress-title">
              DRESS
              <br />
              CODE
            </h2>

            <div className="editorial-dress-copy">
              {dressWomen && <p>{dressWomen}</p>}
              {dressMen && <p>{dressMen}</p>}
              {!dressWomen && !dressMen && (
                <p>Elegantna garderoba u crnim i neutralnim tonovima.</p>
              )}
            </div>

            <div className="editorial-color-row">
              <span className="editorial-color editorial-color-light" />
              <span className="editorial-color editorial-color-dark" />
            </div>

            <div className="editorial-color-label">TOTAL BLACK</div>
          </section>

          {/* RSVP */}
          <EditorialRSVP brideName={brideName} groomName={groomName} />

          {/* COUNTDOWN */}
          <EditorialCountdown targetDate={details?.dateISO} />
        </motion.div>
      </div>
    </section>
  );
}