import { motion } from "framer-motion";
import FloralRSVP from "./FloralRSVP";
import FloralCountdown from "./FloralCountdown";
import "../styles/card.css";
import "../styles/rsvp.css";

function FloralInvitationCard({ brideName, groomName, details = {} }) {
  const brideInitial = brideName?.[0] || "A";
  const groomInitial = groomName?.[0] || "M";

  const infoItems = [
    { label: "Okupljanje gostiju", value: details.gatheringTime },
    { label: "Početak venčanja", value: details.ceremonyTime },
    { label: "Crkveno venčanje", value: details.churchTime },
    { label: "Lokacija", value: details.venue },
    { label: "Crkva", value: details.churchVenue },
    { label: "Proslava", value: details.dinnerTime },
    { label: "Dress code", value: details.dressCode },
  ].filter((item) => item.value);

  return (
  <>
    <motion.section
      className="floral-invitation-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="floral-invitation-overlay" />

      <div className="floral-corner floral-corner-top-left" />
      <div className="floral-corner floral-corner-bottom-right" />

      <div className="floral-paper">
        <div className="floral-monogram-badge">
          <span>{brideInitial}</span>
          <span className="floral-monogram-and">&</span>
          <span>{groomInitial}</span>
        </div>

        <h1 className="floral-invitation-names">
          {brideName} <span>&</span> {groomName}
        </h1>

        <div className="floral-divider floral-divider-lg" />

        {details.welcomeText && (
          <p className="floral-invitation-text">{details.welcomeText}</p>
        )}

        <div className="floral-divider floral-divider-sm" />

        {details.date && (
          <div className="floral-date-block">
            <p className="floral-date">{details.date}</p>
          </div>
        )}

        {infoItems.length > 0 && (
          <div className="floral-program-card">
            {infoItems.map((item, index) => (
              <div className="floral-program-row" key={`${item.label}-${index}`}>
                <span className="floral-program-label">{item.label}</span>
                <span className="floral-program-value">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {details.dressCodePalette?.length > 0 && (
          <div className="floral-extra-card">
            <h3 className="floral-section-title">
              {details.dressCodeTitle || "Dress code"}
            </h3>

            <div className="floral-palette">
              {details.dressCodePalette.map((color, index) => (
                <span
                  key={`${color}-${index}`}
                  className="floral-palette-dot"
                  style={{ backgroundColor: color }}
                  aria-label={`dress code color ${index + 1}`}
                />
              ))}
            </div>

            {details.dressCodeNote && (
              <p className="floral-section-note">{details.dressCodeNote}</p>
            )}
          </div>
        )}

        {(details.mapLink || details.mapEmbed) && (
          <div className="floral-extra-card">
            <h3 className="floral-section-title">Lokacija na mapi</h3>

            {details.mapEmbed ? (
              <div className="floral-map-wrap">
                <iframe
                  src={details.mapEmbed}
                  title="Wedding location map"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : null}

            {details.mapLink && (
              <a
                href={details.mapLink}
                target="_blank"
                rel="noreferrer"
                className="floral-map-link"
              >
                Otvori mapu
              </a>
            )}
          </div>
        )}

        {details.note && (
          <p className="floral-invitation-note">{details.note}</p>
        )}
      </div>
    </motion.section>

    <FloralRSVP />

    {details.dateISO && (
      <FloralCountdown targetDate={details.dateISO} />
    )}
  </>
);
}

export default FloralInvitationCard;