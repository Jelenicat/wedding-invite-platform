import { motion } from "framer-motion";
import PhotoScriptRSVP from "./PhotoScriptRSVP";
import PhotoScriptCountdown from "./PhotoScriptCountdown";
import "../styles/card.css";
import "../styles/rsvp.css";

function PhotoScriptInvitationCard({
  brideName,
  groomName,
  videoSrc,
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

        <div className="photo-script-paper">
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

          {infoItems.length > 0 && (
            <div className="photo-script-program">
              {infoItems.map((item, index) => (
                <div
                  className="photo-script-program-row"
                  key={`${item.label}-${index}`}
                >
                  <span className="photo-script-program-label">
                    {item.label}
                  </span>
                  <span className="photo-script-program-value">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {details.dressCodePalette?.length > 0 && (
            <div className="photo-script-extra">
              <h3 className="photo-script-section-title">
                {details.dressCodeTitle || "Dress code"}
              </h3>

              <div className="photo-script-palette">
                {details.dressCodePalette.map((color, index) => (
                  <span
                    key={`${color}-${index}`}
                    className="photo-script-palette-dot"
                    style={{ backgroundColor: color }}
                    aria-label={`dress code color ${index + 1}`}
                  />
                ))}
              </div>

              {details.dressCodeNote && (
                <p className="photo-script-section-note">
                  {details.dressCodeNote}
                </p>
              )}
            </div>
          )}

          {details.mapLink && (
            <div className="photo-script-extra">
              <h3 className="photo-script-section-title">Lokacija</h3>
              <a
                href={details.mapLink}
                target="_blank"
                rel="noreferrer"
                className="photo-script-map-link"
              >
                Otvori mapu
              </a>
            </div>
          )}

          {details.note && <p className="photo-script-note">{details.note}</p>}
        </div>
      </motion.section>

      <PhotoScriptRSVP
        brideName={safeBrideName}
        groomName={safeGroomName}
        details={details}
      />

      {details.dateISO && (
        <PhotoScriptCountdown targetDate={details.dateISO} />
      )}
    </>
  );
}

export default PhotoScriptInvitationCard;