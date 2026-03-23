import { motion } from "framer-motion";
import PhotoScriptRSVP from "./PhotoScriptRSVP";
import PhotoScriptCountdown from "./PhotoScriptCountdown";
import "../styles/card.css";
import "../styles/rsvp.css";

function PhotoScriptInvitationCard({
  brideName,
  groomName,
  details = {},
  image,
  slug,
  type,
})  {
  const safeBrideName = brideName || "Bride";
  const safeGroomName = groomName || "Groom";

  const iconMap = {
    gathering: "/icons/guests.svg",
    church: "/icons/church.svg",
    civil: "/icons/rings.svg",
    restaurant: "/icons/dinner.svg",
    party: "/icons/party.svg",
  };

  const timelineItems =
    details.events?.filter((item) => item.label || item.time) || [];

  return (
    <>
      <motion.section
        className="photo-script-invitation"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <video
          className="photo-script-invitation-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={videoSrc || "/videos/wedding.mp4"} type="video/mp4" />
        </video>

        <div className="photo-script-invitation-overlay" />

        <div className="photo-script-paper photo-script-editorial-paper">
          <p className="photo-script-kicker">Pozivnica</p>

          <h1 className="photo-script-invitation-names">
            <span className="name">{safeBrideName}</span>
            <span className="photo-script-invitation-and">&</span>
            <span className="name">{safeGroomName}</span>
          </h1>

          {details.date && <p className="photo-script-date">{details.date}</p>}

          <div className="photo-script-divider" />

          {details.welcomeText && (
            <p className="photo-script-text">{details.welcomeText}</p>
          )}

          {timelineItems.length > 0 && (
            <div className="photo-script-editorial-block">
              <h3 className="photo-script-editorial-script">Timing</h3>

              <div className="photo-script-editorial-timeline">
                {timelineItems.map((event, index) => (
                  <motion.div
                    key={`${event.label}-${index}`}
                    className="photo-script-editorial-row"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: index * 0.06 }}
                  >
                    <div className="photo-script-editorial-time">
                      {event.time}
                    </div>

                    <div className="photo-script-editorial-line-wrap">
                      <span className="photo-script-editorial-dot" />
                      {index !== timelineItems.length - 1 && (
                        <span className="photo-script-editorial-line" />
                      )}
                    </div>

                    <div className="photo-script-editorial-content">
                      <h4 className="photo-script-editorial-title">
                        {event.label}
                      </h4>

                      {event.location && (
                        event.mapLink ? (
                          <a
                            href={event.mapLink}
                            target="_blank"
                            rel="noreferrer"
                            className="photo-script-editorial-location is-link"
                          >
                            {event.location}
                          </a>
                        ) : (
                          <p className="photo-script-editorial-location">
                            {event.location}
                          </p>
                        )
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {details.editorialImage1 && (
            <div className="photo-script-editorial-image-block">
              <img
                src={details.editorialImage1}
                alt="Wedding moment"
                className="photo-script-editorial-image"
              />
            </div>
          )}

          {details.dressCodePalette?.length > 0 && (
            <div className="photo-script-editorial-block photo-script-editorial-dresscode">
              <h3 className="photo-script-editorial-script">
                {details.dressCodeTitle || "Dress code"}
              </h3>

              {details.dressCodeNote && (
                <p className="photo-script-editorial-dresscode-note">
                  {details.dressCodeNote}
                </p>
              )}

              <div className="photo-script-editorial-palette-label">
                Osnovne nijanse
              </div>

              <div className="photo-script-editorial-palette-shell">
                <div className="photo-script-palette photo-script-editorial-palette">
                  {details.dressCodePalette.map((color, index) => (
                    <span
                      key={`${color}-${index}`}
                      className="photo-script-palette-dot photo-script-editorial-palette-dot"
                      style={{ backgroundColor: color }}
                      aria-label={`dress code color ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {details.note && <p className="photo-script-note">{details.note}</p>}
        </div>
      </motion.section>

    <PhotoScriptRSVP slug={slug} eventType={type} />

      {details.dateISO && (
        <PhotoScriptCountdown targetDate={details.dateISO} />
      )}
    </>
  );
}

export default PhotoScriptInvitationCard;