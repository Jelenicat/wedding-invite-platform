import { motion } from "framer-motion";
import SplitImageRSVP from "./SplitImageRSVP";
import SplitImageCountdown from "./SplitImageCountdown";
import "../styles/card.css";
import "../styles/rsvp.css";

function SplitImageInvitationCard({
  brideName,
  groomName,
  imageSrc,
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
        className="split-image-invitation"
        style={{
          backgroundImage: `url(${imageSrc || "/images/wedding4.jpg"})`,
        }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="split-image-invitation-overlay" />

        <div className="split-image-paper">
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

          {infoItems.length > 0 && (
            <div className="split-image-program">
              {infoItems.map((item, index) => (
                <div
                  className="split-image-program-row"
                  key={`${item.label}-${index}`}
                >
                  <span className="split-image-program-label">
                    {item.label}
                  </span>
                  <span className="split-image-program-value">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {details.dressCodePalette?.length > 0 && (
            <div className="split-image-extra">
              <h3 className="split-image-section-title">
                {details.dressCodeTitle || "Dress code"}
              </h3>

              <div className="split-image-palette">
                {details.dressCodePalette.map((color, index) => (
                  <span
                    key={`${color}-${index}`}
                    className="split-image-palette-dot"
                    style={{ backgroundColor: color }}
                    aria-label={`dress code color ${index + 1}`}
                  />
                ))}
              </div>

              {details.dressCodeNote && (
                <p className="split-image-section-note">
                  {details.dressCodeNote}
                </p>
              )}
            </div>
          )}

          {details.mapLink && (
            <div className="split-image-extra">
              <h3 className="split-image-section-title">Lokacija</h3>

              <a
                href={details.mapLink}
                target="_blank"
                rel="noreferrer"
                className="split-image-map-link"
              >
                Otvori mapu
              </a>
            </div>
          )}

          {details.note && <p className="split-image-note">{details.note}</p>}
        </div>
      </motion.section>

      <SplitImageRSVP
        brideName={safeBrideName}
        groomName={safeGroomName}
        details={details}
      />

      {details.dateISO && (
        <SplitImageCountdown targetDate={details.dateISO} />
      )}
    </>
  );
}

export default SplitImageInvitationCard;