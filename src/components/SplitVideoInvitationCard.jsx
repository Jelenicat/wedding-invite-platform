import { motion } from "framer-motion";
import SplitVideoRSVP from "./SplitVideoRSVP";
import SplitVideoCountdown from "./SplitVideoCountdown";
import "../styles/card.css";
import "../styles/rsvp.css";

function SplitVideoInvitationCard({
  brideName,
  groomName,
  details = {},
  videoSrc,
  slug,
  type,
}) {
  const safeBrideName = brideName || "Bride";
  const safeGroomName = groomName || "Groom";

  const timelineItems =
    details.events?.filter((item) => item.label || item.time) || [];

  return (
    <>
      <motion.section
        className="split-video-invitation"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <video
          className="split-video-invitation-bg"
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
        />

        <div className="split-video-invitation-overlay" />

        <div className="split-video-paper">
          <p className="split-video-kicker">Pozivnica</p>

          <h1 className="split-video-invitation-names">
            <span>{safeBrideName}</span>
            <span className="split-video-invitation-and">&</span>
            <span>{safeGroomName}</span>
          </h1>

          {details.date && <p className="split-video-date">{details.date}</p>}

          <div className="split-video-divider" />

          {details.welcomeText && (
            <p className="split-video-text">{details.welcomeText}</p>
          )}

          {timelineItems.length > 0 && (
            <div className="split-video-editorial-block">
              <div className="split-video-heart-divider top">
                <span>♡</span>
              </div>

              <h3 className="split-video-editorial-title">Plan dana</h3>

              <div className="split-video-editorial-timeline">
                {timelineItems.map((event, index) => (
                  <motion.div
                    key={`${event.label}-${index}`}
                    className="split-video-editorial-row"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                  >
                    <div className="split-video-editorial-time">
                      {event.time}
                    </div>

                    <div className="split-video-editorial-center">
                      <span className="split-video-editorial-dot" />
                      {index !== timelineItems.length - 1 && (
                        <span className="split-video-editorial-line" />
                      )}
                    </div>

                    <div className="split-video-editorial-content">
                      <h4 className="split-video-editorial-event-title">
                        {event.label}
                      </h4>

                      {event.location &&
                        (event.mapLink ? (
                          <a
                            href={event.mapLink}
                            target="_blank"
                            rel="noreferrer"
                            className="split-video-editorial-location is-link"
                          >
                            {event.location}
                          </a>
                        ) : (
                          <p className="split-video-editorial-location">
                            {event.location}
                          </p>
                        ))}

                      {event.note && (
                        <p className="split-video-editorial-note">
                          {event.note}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="split-video-heart-divider bottom">
                <span>♡</span>
              </div>
            </div>
          )}

          {details.dressCodePalette?.length > 0 && (
            <div className="split-video-extra split-video-dresscode-editorial">
              <h3 className="split-video-editorial-title dresscode">
                Dress-kod
              </h3>

              {details.dressCodeNote && (
                <p className="split-video-section-note split-video-dresscode-note">
                  {details.dressCodeNote}
                </p>
              )}

            

              <div className="split-video-palette split-video-palette-editorial">
                {details.dressCodePalette.map((color, index) => (
                  <span
                    key={`${color}-${index}`}
                    className="split-video-palette-dot split-video-palette-dot-editorial"
                    style={{ backgroundColor: color }}
                    aria-label={`dress code color ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          {details.note && <p className="split-video-note">{details.note}</p>}
        </div>
      </motion.section>

    <SplitVideoRSVP slug={slug} eventType={type} />

      {details.dateISO && (
        <SplitVideoCountdown targetDate={details.dateISO} />
      )}
    </>
  );
}

export default SplitVideoInvitationCard;