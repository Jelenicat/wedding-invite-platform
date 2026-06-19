import { motion } from "framer-motion";
import PhotoScriptRSVP from "./PhotoScriptRSVP";
import PhotoScriptCountdown from "./PhotoScriptCountdown";
import "../styles/card.css";
import "../styles/rsvp.css";

function PhotoScriptInvitationCard({
  brideName,
  groomName,
  details = {},
  image,
  slug,
  type,
  videoSrc,
  script = "latin",
}) {
  const safeBrideName = brideName || "Bride";
  const safeGroomName = groomName || "Groom";

  const theme = details.theme || {};

  const themeStyles = {
    "--photo-script-card-accent":
      theme.cardAccent || theme.introAccent || "#cb7474",
      "--photo-script-names-gradient":
  theme.namesGradient || theme.textGradient || "none",
"--photo-script-title-gradient":
  theme.titleGradient || theme.namesGradient || theme.textGradient || "none",
    "--photo-script-card-text-main":
      theme.cardTextMain || "rgba(255, 255, 255, 0.84)",
    "--photo-script-card-text-soft":
      theme.cardTextSoft || "rgba(255, 255, 255, 0.72)",
    "--photo-script-card-text-muted":
      theme.cardTextMuted || "rgba(255, 255, 255, 0.66)",
    "--photo-script-card-border":
      theme.cardBorder || "rgba(255, 255, 255, 0.12)",
    "--photo-script-card-inner-border":
      theme.cardInnerBorder || "rgba(255, 255, 255, 0.08)",
    "--photo-script-card-bg":
      theme.cardBg || "rgba(18, 18, 18, 0.34)",
    "--photo-script-card-kicker":
      theme.cardKicker || "rgba(255, 255, 255, 0.72)",
    "--photo-script-card-divider":
      theme.cardDivider || "rgba(255, 255, 255, 0.7)",
    "--photo-script-card-title":
      theme.cardTitle || "rgba(255, 255, 255, 0.72)",
    "--photo-script-card-event-title":
      theme.cardEventTitle || "#ffffff",
    "--photo-script-card-palette-bg":
      theme.cardPaletteBg || "rgba(255, 255, 255, 0.05)",
    "--photo-script-card-palette-border":
      theme.cardPaletteBorder || "rgba(255, 255, 255, 0.12)",
    "--photo-script-card-dot-ring":
      theme.cardDotRing || "rgba(203, 116, 116, 0.12)",
    "--photo-script-card-line-top":
      theme.cardLineTop || "rgba(203, 116, 116, 0.42)",
    "--photo-script-card-line-bottom":
      theme.cardLineBottom || "rgba(203, 116, 116, 0.08)",
    "--photo-script-card-overlay-top":
      theme.cardOverlayTop || "rgba(0, 0, 0, 0.12)",
    "--photo-script-card-overlay-mid":
      theme.cardOverlayMid || "rgba(0, 0, 0, 0.24)",
    "--photo-script-card-overlay-bottom":
      theme.cardOverlayBottom || "rgba(0, 0, 0, 0.58)",
    "--photo-script-name-font":
      theme.nameFont || '"Italianno", cursive',
    "--photo-script-name-font-cyrillic":
      theme.nameFontCyrillic || '"Great Vibes", cursive',
    "--photo-script-script-font":
      theme.scriptFont || '"Italianno", "Allura", cursive',
    "--photo-script-script-font-cyrillic":
      theme.scriptFontCyrillic || '"Great Vibes", cursive',
      "--photo-script-location-button-bg":
  theme.locationButtonBg || "rgba(255, 255, 255, 0.06)",
"--photo-script-location-button-border":
  theme.locationButtonBorder || "rgba(255, 255, 255, 0.16)",
"--photo-script-location-button-text":
  theme.locationButtonTextColor || "rgba(255, 255, 255, 0.84)",
  };

  const t =
    script === "cyrillic"
      ? {
          invitation: "Позивница",
          timing: "Програм",
          dressCode: "Dress code",
          palette: "Основне нијансе",
        }
      : {
          invitation: "Pozivnica",
          timing: "Timing",
          dressCode: "Dress code",
          palette: "Osnovne nijanse",
        };

  const timelineItems =
    details.events?.filter((item) => item.label || item.time) || [];

  const shouldShowDressCode =
    details.showDressCode &&
    (
      details.dressCodeTitle ||
      details.dressCodeNote ||
      details.dressCodePalette?.length > 0
    );

  const hasCustomScriptFont = Boolean(theme.scriptFont);
  const hasCustomNameFont = Boolean(theme.nameFont);
const hasGradientText = Boolean(
  theme.namesGradient || theme.textGradient || theme.titleGradient
);
  return (
    <>
      <motion.section
     className={[
  "photo-script-invitation",
  hasCustomScriptFont ? "has-custom-script-font" : "",
  hasCustomNameFont ? "has-custom-name-font" : "",
  hasGradientText ? "has-gradient-text" : "",
]
          .filter(Boolean)
          .join(" ")}
        style={themeStyles}
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

        <div className="photo-script-paper photo-script-editorial-paper">
          <p className="photo-script-kicker">{t.invitation}</p>

          <h1
            className={`photo-script-invitation-names ${
              script === "cyrillic" ? "cyrillic" : ""
            }`}
          >
            <span className="name">{safeBrideName}</span>
            <span className="photo-script-invitation-and">&</span>
            <span className="name">{safeGroomName}</span>
          </h1>

          {details.date && <p className="photo-script-date">{details.date}</p>}

          <div className="photo-script-divider" />

          {details.welcomeText && (
            <p className="photo-script-text">{details.welcomeText}</p>
          )}

          {timelineItems.length > 0 && (
            <div className="photo-script-editorial-block">
              <h3
                className={`photo-script-editorial-script ${
                  script === "cyrillic" ? "cyrillic" : ""
                }`}
              >
                {t.timing}
              </h3>

              <div className="photo-script-editorial-timeline">
                {timelineItems.map((event, index) => (
                  <motion.div
                    key={`${event.label}-${index}`}
                    className="photo-script-editorial-row"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: index * 0.06 }}
                  >
                    <div className="photo-script-editorial-time">
                      {event.time}
                    </div>

                    <div className="photo-script-editorial-line-wrap">
                      <span className="photo-script-editorial-dot" />
                      {index !== timelineItems.length - 1 && (
                        <span className="photo-script-editorial-line" />
                      )}
                    </div>

                    <div className="photo-script-editorial-content">
                      <h4
                        className={`photo-script-editorial-title ${
                          script === "cyrillic" ? "cyrillic" : ""
                        }`}
                      >
                        {event.label}
                      </h4>

                      {event.location &&
                        (event.mapLink ? (
                          <a
                            href={event.mapLink}
                            target="_blank"
                            rel="noreferrer"
                            className="photo-script-editorial-location is-link"
                          >
                            {event.location}
                          </a>
                        ) : (
                          <p className="photo-script-editorial-location">
                            {event.location}
                          </p>
                        ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        {details.showLocationButton && details.locationButtonLink && (
  <div className="photo-script-location-button-wrap">
    <a
      href={details.locationButtonLink}
      target="_blank"
      rel="noreferrer"
      className="photo-script-location-button"
    >
      {details.locationButtonText || "Pogledaj lokaciju"}
    </a>
  </div>
)}
          {details.editorialImage1 && (
            <div className="photo-script-editorial-image-block">
              <img
                src={details.editorialImage1}
                alt="Wedding moment"
                className="photo-script-editorial-image"
              />
            </div>
          )}
  

          {shouldShowDressCode && (
            <div className="photo-script-editorial-block photo-script-editorial-dresscode">
              <h3
                className={`photo-script-editorial-script ${
                  script === "cyrillic" ? "cyrillic" : ""
                }`}
              >
                {details.dressCodeTitle || t.dressCode}
              </h3>

              {details.dressCodeNote && (
                <p className="photo-script-editorial-dresscode-note">
                  {details.dressCodeNote}
                </p>
              )}

              {details.dressCodePalette?.length > 0 && (
                <>
                  <div className="photo-script-editorial-palette-label">
                    {t.palette}
                  </div>

                  <div className="photo-script-editorial-palette-shell">
                    <div className="photo-script-palette photo-script-editorial-palette">
                      {details.dressCodePalette.map((color, index) => (
                        <span
                          key={`${color}-${index}`}
                          className="photo-script-palette-dot photo-script-editorial-palette-dot"
                          style={{ backgroundColor: color }}
                          aria-label={`dress code color ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {details.note && <p className="photo-script-note">{details.note}</p>}
        </div>
      </motion.section>

      <PhotoScriptRSVP
        slug={slug}
        eventType={type}
        script={script}
        details={details}
      />

      {details.dateISO && (
        <PhotoScriptCountdown
          targetDate={details.dateISO}
          script={script}
          details={details}
        />
      )}
    </>
  );
}

export default PhotoScriptInvitationCard;