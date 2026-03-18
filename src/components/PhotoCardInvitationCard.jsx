import { motion } from "framer-motion";
import PhotoCardRSVP from "./PhotoCardRSVP";
import PhotoCardCountdown from "./PhotoCardCountdown";
import "../styles/card.css";
import "../styles/rsvp.css";

function PhotoCardInvitationCard({
  brideName,
  groomName,
  image,
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
      className="photo-card-invitation"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="photo-card-invitation-overlay" />

      <div className="photo-card-paper">
        <p className="photo-card-kicker">Pozivnica</p>

        <div className="photo-card-photo-frame">
          <img src={image} alt={`${brideName} i ${groomName}`} />
        </div>

        <h1 className="photo-card-invitation-names">
          {brideName} <span>&</span> {groomName}
        </h1>

        {details.date && (
          <p className="photo-card-invitation-date">{details.date}</p>
        )}

        <div className="photo-card-divider" />

        {details.welcomeText && (
          <p className="photo-card-invitation-text">{details.welcomeText}</p>
        )}

        {infoItems.length > 0 && (
          <div className="photo-card-program">
            {infoItems.map((item, index) => (
              <div
                className="photo-card-program-row"
                key={`${item.label}-${index}`}
              >
                <span className="photo-card-program-label">{item.label}</span>
                <span className="photo-card-program-value">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {details.dressCodePalette?.length > 0 && (
          <div className="photo-card-extra">
            <h3 className="photo-card-section-title">
              {details.dressCodeTitle || "Dress code"}
            </h3>

            <div className="photo-card-palette">
              {details.dressCodePalette.map((color, index) => (
                <span
                  key={`${color}-${index}`}
                  className="photo-card-palette-dot"
                  style={{ backgroundColor: color }}
                  aria-label={`dress code color ${index + 1}`}
                />
              ))}
            </div>

            {details.dressCodeNote && (
              <p className="photo-card-section-note">{details.dressCodeNote}</p>
            )}
          </div>
        )}

        {details.mapLink && (
          <div className="photo-card-extra">
            <h3 className="photo-card-section-title">Lokacija</h3>

            <a
              href={details.mapLink}
              target="_blank"
              rel="noreferrer"
              className="photo-card-map-link"
            >
              Otvori mapu
            </a>
          </div>
        )}

        {details.note && <p className="photo-card-note">{details.note}</p>}
      </div>
    </motion.section>

    <PhotoCardRSVP />

    {details.dateISO && (
      <PhotoCardCountdown targetDate={details.dateISO} />
    )}
  </>
);
}

export default PhotoCardInvitationCard;