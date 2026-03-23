import { motion } from "framer-motion";
import SplitImageRSVP from "./SplitImageRSVP";
import SplitImageCountdown from "./SplitImageCountdown";
import "../styles/card.css";
import "../styles/rsvp.css";

function SplitImageInvitationCard({
  brideName,
  groomName,
  details = {},
  image,
  slug,
  type,
}) {
  const safeBrideName = brideName || "Bride";
  const safeGroomName = groomName || "Groom";
  const finalImage = image || "/images/wedding4.jpg";

  const timelineItems =
    details.events?.filter((item) => item.label || item.time) || [];

  return (
    <>
      <motion.section
        className="split-image-invitation"
        style={{ backgroundImage: `url(${finalImage})` }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="split-image-invitation-overlay" />

        <div className="split-image-paper split-image-soft-paper">
          <p className="split-image-kicker">Pozivnica</p>

          <h1 className="split-image-invitation-names">
            <span>{safeBrideName}</span>
            <span className="split-image-invitation-and">&</span>
            <span>{safeGroomName}</span>
          </h1>

          {details.date && <p className="split-image-date">{details.date}</p>}

          <div className="split-image-divider" />

          {details.welcomeText && (
            <p className="split-image-text">{details.welcomeText}</p>
          )}

          {timelineItems.length > 0 && (
            <div className="split-image-editorial-block split-image-editorial-block-timeline">
              <div className="split-image-heart-divider top">
                <span>♡</span>
              </div>

              <h3 className="split-image-editorial-title">Plan dana</h3>

              <div className="split-image-editorial-timeline">
                {timelineItems.map((event, index) => (
                  <motion.div
                    key={`${event.label}-${index}`}
                    className="split-image-editorial-row"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                  >
                    <div className="split-image-editorial-time">
                      {event.time}
                    </div>

                    <div className="split-image-editorial-center">
                      <span className="split-image-editorial-dot" />
                      {index !== timelineItems.length - 1 && (
                        <span className="split-image-editorial-line" />
                      )}
                    </div>

                    <div className="split-image-editorial-content">
                      <h4 className="split-image-editorial-event-title">
                        {event.label}
                      </h4>

                      {event.location &&
                        (event.mapLink ? (
                          <a
                            href={event.mapLink}
                            target="_blank"
                            rel="noreferrer"
                            className="split-image-editorial-location is-link"
                          >
                            {event.location}
                          </a>
                        ) : (
                          <p className="split-image-editorial-location">
                            {event.location}
                          </p>
                        ))}

                      {event.note && (
                        <p className="split-image-editorial-note">
                          {event.note}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="split-image-heart-divider bottom">
                <span>♡</span>
              </div>
            </div>
          )}

          {details.dressCodePalette?.length > 0 && (
            <div className="split-image-extra split-image-dresscode-editorial">
              <h3 className="split-image-editorial-title dresscode">
                {details.dressCodeTitle || "Dress code"}
              </h3>

              {details.dressCodeNote && (
                <p className="split-image-section-note split-image-dresscode-note">
                  {details.dressCodeNote}
                </p>
              )}

           

              <div className="split-image-palette split-image-palette-editorial">
                {details.dressCodePalette.map((color, index) => (
                  <span
                    key={`${color}-${index}`}
                    className="split-image-palette-dot split-image-palette-dot-editorial"
                    style={{ backgroundColor: color }}
                    aria-label={`dress code color ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          {details.note && <p className="split-image-note">{details.note}</p>}
        </div>
      </motion.section>

    <SplitImageRSVP slug={slug} eventType={type} />

      {details.dateISO && (
        <SplitImageCountdown targetDate={details.dateISO} />
      )}
    </>
  );
}

export default SplitImageInvitationCard;