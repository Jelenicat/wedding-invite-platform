import { motion } from "framer-motion";
import MinimalRSVP from "./MinimalRSVP";
import MinimalCountdown from "./MinimalCountdown";
import minimalBg from "../assets/minimal-bg.jpg";
import "../styles/card.css";
import "../styles/rsvp.css";

function MinimalInvitationCard({
  brideName,
  groomName,
  details = {},
  backgroundImage,
}) {
  const safeBrideName = brideName || "Bride";
  const safeGroomName = groomName || "Groom";

  const brideInitial = safeBrideName[0];
  const groomInitial = safeGroomName[0];

  const finalBg = backgroundImage || minimalBg;

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
        className="minimal-invitation-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div
          className="minimal-invitation-bg"
          style={{ backgroundImage: `url(${finalBg})` }}
        />
        <div className="minimal-invitation-overlay" />

        <div className="minimal-invitation-paper">
          <div className="minimal-invitation-frame" />

          <p className="minimal-invitation-kicker">POZIVNICA</p>

          <div className="minimal-invitation-monogram">
            <span>{brideInitial}</span>
            <span className="minimal-invitation-monogram-and">&</span>
            <span>{groomInitial}</span>
          </div>

          <h1 className="minimal-invitation-names">
            <span>{safeBrideName}</span>
            <span className="minimal-invitation-amp">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20
                         c-6-4.5-9-7.5-9-11
                         c0-2.5 2-4.5 4.5-4.5
                         c1.5 0 3 .8 4.5 2.3
                         c1.5-1.5 3-2.3 4.5-2.3
                         C19 4.5 21 6.5 21 9
                         c0 3.5-3 6.5-9 11z" />
              </svg>
            </span>
            <span>{safeGroomName}</span>
          </h1>

          {details.welcomeText && (
            <p className="minimal-invitation-text">{details.welcomeText}</p>
          )}

          {details.date && (
            <div className="minimal-invitation-date-block">
              <span className="minimal-invitation-date-label">Datum</span>
              <p className="minimal-invitation-date">{details.date}</p>
            </div>
          )}

          {infoItems.length > 0 && (
            <div className="minimal-program-card">
              <h3 className="minimal-section-title">Plan venčanja</h3>

              <div className="minimal-program-list">
                {infoItems.map((item, index) => (
                  <div
                    className="minimal-program-row"
                    key={`${item.label}-${index}`}
                  >
                    <span className="minimal-program-row-label">
                      {item.label}
                    </span>
                    <span className="minimal-program-row-value">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {details.dressCodePalette?.length > 0 && (
            <div className="minimal-extra-card">
              <h3 className="minimal-section-title">
                {details.dressCodeTitle || "Dress Code"}
              </h3>

              <div className="minimal-palette">
                {details.dressCodePalette.map((color, index) => (
                  <span
                    key={`${color}-${index}`}
                    className="minimal-palette-dot"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {details.dressCodeNote && (
                <p className="minimal-section-note">
                  {details.dressCodeNote}
                </p>
              )}
            </div>
          )}

          {details.mapLink && (
            <div className="minimal-extra-card">
              <h3 className="minimal-section-title">Lokacija</h3>

              <a
                href={details.mapLink}
                target="_blank"
                rel="noreferrer"
                className="minimal-map-link"
              >
                Otvori mapu
              </a>
            </div>
          )}

          {details.note && (
            <p className="minimal-invitation-note">{details.note}</p>
          )}
        </div>
      </motion.section>

      <MinimalRSVP
        brideName={safeBrideName}
        groomName={safeGroomName}
        details={details}
      />

      {details.dateISO && (
        <MinimalCountdown targetDate={details.dateISO} />
      )}
    </>
  );
}

export default MinimalInvitationCard;