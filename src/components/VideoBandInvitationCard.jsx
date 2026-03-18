import { motion } from "framer-motion";
import VideoBandRSVP from "./VideoBandRSVP";
import VideoBandCountdown from "./VideoBandCountdown";
import "../styles/card.css";
import "../styles/rsvp.css";

function VideoBandInvitationCard({
  brideName,
  groomName,
  videoSrc,
  details = {},
}) {
  const infoItems = [
    { label: "Okupljanje gostiju", value: details.gatheringTime },
    { label: "Početak venčanja", value: details.ceremonyTime },
    { label: "Crkveno venčanje", value: details.churchTime },
    { label: "Lokacija", value: details.venue },
    { label: "Crkva", value: details.churchVenue },
    { label: "Proslava", value: details.dinnerTime },
  ].filter((item) => item.value);

  return (
    <>
      <motion.section
        className="video-band-invitation"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <video
          className="video-band-invitation-bg"
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
        />

        <div className="video-band-invitation-overlay" />

        <div className="video-band-paper">
          <p className="video-band-kicker">Pozivnica</p>

          <h1 className="video-band-invitation-names">
            <span>{brideName}</span>
            <span className="video-band-invitation-and">&</span>
            <span>{groomName}</span>
          </h1>

          {details.date && <p className="video-band-date">{details.date}</p>}

          <div className="video-band-divider" />

          {details.welcomeText && (
            <p className="video-band-text">{details.welcomeText}</p>
          )}

          {infoItems.length > 0 && (
            <div className="video-band-program">
              {infoItems.map((item, index) => (
                <div
                  className="video-band-program-row"
                  key={`${item.label}-${index}`}
                >
                  <span className="video-band-program-label">{item.label}</span>
                  <span className="video-band-program-value">{item.value}</span>
                </div>
              ))}
            </div>
          )}

          {details.dressCodePalette?.length > 0 && (
            <div className="video-band-extra">
              <h3 className="video-band-section-title">
                {details.dressCodeTitle || "Dress code"}
              </h3>

              <div className="video-band-palette">
                {details.dressCodePalette.map((color, index) => (
                  <span
                    key={`${color}-${index}`}
                    className="video-band-palette-dot"
                    style={{ backgroundColor: color }}
                    aria-label={`dress code color ${index + 1}`}
                  />
                ))}
              </div>

              {details.dressCodeNote && (
                <p className="video-band-section-note">
                  {details.dressCodeNote}
                </p>
              )}
            </div>
          )}

          {details.mapLink && (
            <div className="video-band-extra">
              <h3 className="video-band-section-title">Lokacija</h3>

              <a
                href={details.mapLink}
                target="_blank"
                rel="noreferrer"
                className="video-band-map-link"
              >
                Otvori mapu
              </a>
            </div>
          )}

          {details.note && <p className="video-band-note">{details.note}</p>}
        </div>
      </motion.section>

      <VideoBandRSVP />

      {details.dateISO && (
        <VideoBandCountdown targetDate={details.dateISO} />
      )}
    </>
  );
}

export default VideoBandInvitationCard;