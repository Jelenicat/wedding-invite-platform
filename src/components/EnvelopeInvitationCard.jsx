import { motion } from "framer-motion";
import EnvelopeRSVP from "./EnvelopeRSVP";
import EnvelopeCountdown from "./EnvelopeCountdown";
import "../styles/card.css";
import "../styles/rsvp.css";

function EnvelopeInvitationCard({
  brideName,
  groomName,
  details = {},
}) {
  const safeBrideName = brideName || "Bride";
  const safeGroomName = groomName || "Groom";

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
        className="envelope-invitation-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="envelope-invitation-overlay" />

        <div className="envelope-paper">
          <div className="envelope-paper-frame" />

          <p className="envelope-kicker">Pozivnica</p>

          <h1 className="envelope-invitation-names">
            <span>{safeBrideName}</span>
            <span className="envelope-invitation-and">&</span>
            <span>{safeGroomName}</span>
          </h1>

          {details.date && <p className="envelope-date">{details.date}</p>}

          <div className="envelope-divider" />

          {details.welcomeText && (
            <p className="envelope-text">{details.welcomeText}</p>
          )}

          {infoItems.length > 0 && (
            <div className="envelope-program">
              {infoItems.map((item, index) => (
                <div
                  className="envelope-program-row"
                  key={`${item.label}-${index}`}
                >
                  <span className="envelope-program-label">
                    {item.label}
                  </span>
                  <span className="envelope-program-value">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {details.dressCodePalette?.length > 0 && (
            <div className="envelope-extra">
              <h3 className="envelope-section-title">
                {details.dressCodeTitle || "Dress code"}
              </h3>

              <div className="envelope-palette">
                {details.dressCodePalette.map((color, index) => (
                  <span
                    key={`${color}-${index}`}
                    className="envelope-palette-dot"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {details.dressCodeNote && (
                <p className="envelope-section-note">
                  {details.dressCodeNote}
                </p>
              )}
            </div>
          )}

          {details.mapLink && (
            <div className="envelope-extra">
              <h3 className="envelope-section-title">Lokacija</h3>

              <a
                href={details.mapLink}
                target="_blank"
                rel="noreferrer"
                className="envelope-map-link"
              >
                Otvori mapu
              </a>
            </div>
          )}

          {details.note && <p className="envelope-note">{details.note}</p>}
        </div>
      </motion.section>

      <EnvelopeRSVP
        brideName={safeBrideName}
        groomName={safeGroomName}
        details={details}
      />

      {details.dateISO && (
        <EnvelopeCountdown targetDate={details.dateISO} />
      )}
    </>
  );
}

export default EnvelopeInvitationCard;