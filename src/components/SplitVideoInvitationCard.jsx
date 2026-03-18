import { motion } from "framer-motion";
import SplitVideoRSVP from "./SplitVideoRSVP";
import SplitVideoCountdown from "./SplitVideoCountdown";
import "../styles/card.css";
import "../styles/rsvp.css";

function SplitVideoInvitationCard({
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
          <span>{brideName}</span>
          <span className="split-video-invitation-and">&</span>
          <span>{groomName}</span>
        </h1>

        {details.date && <p className="split-video-date">{details.date}</p>}

        <div className="split-video-divider" />

        {details.welcomeText && (
          <p className="split-video-text">{details.welcomeText}</p>
        )}

        {infoItems.length > 0 && (
          <div className="split-video-program">
            {infoItems.map((item, index) => (
              <div
                className="split-video-program-row"
                key={`${item.label}-${index}`}
              >
                <span className="split-video-program-label">{item.label}</span>
                <span className="split-video-program-value">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {details.dressCodePalette?.length > 0 && (
          <div className="split-video-extra">
            <h3 className="split-video-section-title">
              {details.dressCodeTitle || "Dress code"}
            </h3>

            <div className="split-video-palette">
              {details.dressCodePalette.map((color, index) => (
                <span
                  key={`${color}-${index}`}
                  className="split-video-palette-dot"
                  style={{ backgroundColor: color }}
                  aria-label={`dress code color ${index + 1}`}
                />
              ))}
            </div>

            {details.dressCodeNote && (
              <p className="split-video-section-note">{details.dressCodeNote}</p>
            )}
          </div>
        )}

        {details.mapLink && (
          <div className="split-video-extra">
            <h3 className="split-video-section-title">Lokacija</h3>

            <a
              href={details.mapLink}
              target="_blank"
              rel="noreferrer"
              className="split-video-map-link"
            >
              Otvori mapu
            </a>
          </div>
        )}

        {details.note && <p className="split-video-note">{details.note}</p>}
      </div>
    </motion.section>

    <SplitVideoRSVP />

    {details.dateISO && (
      <SplitVideoCountdown targetDate={details.dateISO} />
    )}
  </>
);
}

export default SplitVideoInvitationCard;