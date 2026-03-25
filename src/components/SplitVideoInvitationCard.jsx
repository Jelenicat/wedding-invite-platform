import { motion } from "framer-motion";
import SplitVideoRSVP from "./SplitVideoRSVP";
import SplitVideoCountdown from "./SplitVideoCountdown";
import "../styles/card.css";
import "../styles/rsvp.css";

function SplitVideoInvitationCard({
  brideName,
  groomName,
  details = {},
  slug,
  type,
}) {
  const safeBrideName = brideName || "Bride";
  const safeGroomName = groomName || "Groom";

  const timelineItems =
    details.events?.filter((item) => item.label || item.time) || [];

  const dateParts = details.date
    ? details.date.split(" ")
    : ["18", "SEP", "2026"];

  const [day = "18", month = "SEP", year = "2026"] = dateParts;

  const fadeUp = {
    initial: { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
  };

  return (
    <>
      <motion.section
        className="split-video-invitation"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="split-video-paper">
          <div className="split-video-paper-inner">
            <motion.h1
              className="split-video-invitation-names top"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {safeBrideName}{" "}
              <span className="split-video-invitation-and">&</span>{" "}
              {safeGroomName}
            </motion.h1>

            <motion.p
              className="split-video-kicker"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
            >
              Dobrodošli
            </motion.p>

            {details.welcomeText && (
              <motion.p
                className="split-video-text"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.2 }}
              >
                {details.welcomeText}
              </motion.p>
            )}

            <motion.div
              className="split-video-calendar"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.28 }}
            >
              <div className="split-video-calendar-line" />

              <div className="split-video-calendar-grid">
                <div className="split-video-calendar-col">
                  <span className="split-video-calendar-label">Dan</span>
                  <span className="split-video-calendar-value">{day}</span>
                </div>

                <div className="split-video-calendar-col split-video-calendar-col-center">
                  <motion.span
                    className="split-video-calendar-heart"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.45 }}
                  >
                    ♡
                  </motion.span>
                  <span className="split-video-calendar-month">{month}</span>
                </div>

                <div className="split-video-calendar-col">
                  <span className="split-video-calendar-label">Godina</span>
                  <span className="split-video-calendar-value">{year}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="split-video-love-mark"
              initial={{ opacity: 0, scale: 0.8, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.5 }}
            >
              ♥
            </motion.div>

            {timelineItems.length > 0 && (
              <motion.div
                className="split-video-flow"
                {...fadeUp}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                {timelineItems.map((event, index) => (
                  <motion.div
                    key={`${event.label}-${index}`}
                    className="split-video-flow-item"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                  >
                    <motion.div
                      className="split-video-flow-node"
                      initial={{ opacity: 0, scale: 0.6 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: index * 0.08 + 0.08 }}
                    />
                    <div className="split-video-flow-curve" />

                    <div className="split-video-flow-content">
                      <h4 className="split-video-flow-title">{event.label}</h4>
                      <p className="split-video-flow-time">{event.time}</p>

                      {event.location &&
                        (event.mapLink ? (
                          <a
                            href={event.mapLink}
                            target="_blank"
                            rel="noreferrer"
                            className="split-video-flow-location is-link"
                          >
                            {event.location}
                          </a>
                        ) : (
                          <p className="split-video-flow-location">
                            {event.location}
                          </p>
                        ))}

                      {event.note && (
                        <p className="split-video-flow-note">{event.note}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {(details.mapLink || details.venue) && (
              <motion.div
                className="split-video-location-box"
                {...fadeUp}
                transition={{ duration: 0.65 }}
              >
                <h3 className="split-video-section-script">Lokacija</h3>

                {details.venue && (
                  <p className="split-video-location-text">{details.venue}</p>
                )}

                {details.mapLink && (
                  <a
                    href={details.mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="split-video-location-link"
                  >
                    Pogledaj mapu
                  </a>
                )}
              </motion.div>
            )}

            {details.dressCodePalette?.length > 0 && (
              <motion.div
                className="split-video-dresscode-box"
                {...fadeUp}
                transition={{ duration: 0.65 }}
              >
                <h3 className="split-video-section-script">Dress code</h3>

                {details.dressCodeNote && (
                  <p className="split-video-section-note">
                    {details.dressCodeNote}
                  </p>
                )}

                <div className="split-video-palette">
                  {details.dressCodePalette.map((color, index) => (
                    <motion.span
                      key={index}
                      className="split-video-palette-dot"
                      style={{ backgroundColor: color }}
                      initial={{ opacity: 0, scale: 0.7, y: 8 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: index * 0.06 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {details.note && (
              <motion.p
                className="split-video-note"
                {...fadeUp}
                transition={{ duration: 0.6 }}
              >
                {details.note}
              </motion.p>
            )}
          </div>
        </div>
      </motion.section>

      <SplitVideoRSVP slug={slug} eventType={type} />
      {details.dateISO && <SplitVideoCountdown targetDate={details.dateISO} />}
    </>
  );
}

export default SplitVideoInvitationCard;