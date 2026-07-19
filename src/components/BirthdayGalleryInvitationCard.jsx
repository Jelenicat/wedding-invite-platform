import { motion } from "framer-motion";
import BirthdayGalleryRSVP from "./BirthdayGalleryRSVP";
import BirthdayGalleryCountdown from "./BirthdayGalleryCountdown.jsx";
import "../styles/card.css";
import "../styles/rsvp.css";

function BirthdayGalleryInvitationCard({
  brideName,
  brideNameLatin,
  brideNameCyrillic,
  weddingDate,
  weddingTime,
  venue,
  details = {},
  image1,
  image2,
  image3,
  backgroundImage,
  slug,
  type,
  script,
}) {
  const activeScript = script || details?.script || "latin";
  const isCyrillic = activeScript === "cyrillic";

  const cardConfig = details?.birthdayGalleryCard || {};
  const colors = cardConfig?.colors || {};

  const getLocalizedText = (value, fallback = "") => {
    if (!value) return fallback;

    if (typeof value === "object") {
      return (
        value[activeScript] ||
        value.latin ||
        value.cyrillic ||
        fallback
      );
    }

    return value;
  };

  const name = isCyrillic
    ? brideNameCyrillic ||
      details?.brideNameCyrillic ||
      brideName ||
      "Виктор"
    : brideNameLatin ||
      details?.brideNameLatin ||
      brideName ||
      "Viktor";

  const defaultTexts = isCyrillic
    ? {
        kicker: "РОЂЕНДАНСКО СЛАВЉЕ",
        subtitle: "Прослава првог рођендана",
        saveTheDate: "САЧУВАЈТЕ ДАТУМ",
        when: "Када",
        where: "Где",
        note: "Напомена",
        timeConnector: "у",
        footer:
          "Радујемо се да заједно обележимо овај посебан дан.",
      }
    : {
        kicker: "ROĐENDANSKO SLAVLJE",
        subtitle: "Proslava prvog rođendana",
        saveTheDate: "SAČUVAJTE DATUM",
        when: "Kada",
        where: "Gde",
        note: "Napomena",
        timeConnector: "u",
        footer:
          "Radujemo se da zajedno obeležimo ovaj poseban dan.",
      };

  const customTexts = cardConfig?.texts?.[activeScript] || {};

  const texts = {
    ...defaultTexts,
    ...customTexts,
  };

  const locationText = getLocalizedText(
    cardConfig?.locationText,
    venue
  );

  const noteText = getLocalizedText(
    cardConfig?.note,
    getLocalizedText(details?.note)
  );

  const footerText = getLocalizedText(
    cardConfig?.footerText,
    texts.footer
  );

  const activeBackgroundImage =
    cardConfig?.backgroundImage || backgroundImage;

  const dateParts = weddingDate?.trim().split(/\s+/) || [];

  const day = dateParts[0] || "10";
  const month = dateParts[1] || (isCyrillic ? "СЕП" : "SEP");
  const year = dateParts[2] || "2026";

  const themeStyle = {
    "--birthday-gallery-page-bg":
      colors.background || "#f7f4ee",

    "--birthday-gallery-text":
      colors.text || "#2f251f",

    "--birthday-gallery-muted-text":
      colors.secondaryText || "#8f8176",

    "--birthday-gallery-accent":
      colors.accent || "#b49778",

    "--birthday-gallery-overlay":
      colors.overlay || "rgba(247, 244, 238, 0.42)",

    "--birthday-gallery-info-bg":
      colors.infoBackground || "rgba(255, 255, 255, 0.62)",

    "--birthday-gallery-info-border":
      colors.infoBorder || "rgba(100, 78, 62, 0.15)",

    "--birthday-gallery-divider":
      colors.divider || "rgba(100, 78, 62, 0.18)",

    "--birthday-gallery-button-bg":
      colors.buttonBackground || "#2f241d",

    "--birthday-gallery-button-text":
      colors.buttonText || "#ffffff",

    "--birthday-gallery-button-border":
      colors.buttonBorder ||
      colors.buttonBackground ||
      "#2f241d",

    "--birthday-gallery-glow-one":
      colors.glowOne || "rgba(255, 255, 255, 0.48)",

    "--birthday-gallery-glow-two":
      colors.glowTwo || "rgba(200, 176, 150, 0.18)",
  };

  return (
    <div
      className={`birthday-gallery-page birthday-gallery-page-${activeScript}`}
      style={themeStyle}
    >
      <section
        className={`birthday-gallery-card birthday-gallery-card-${activeScript}`}
        style={
          activeBackgroundImage
            ? {
                "--birthday-card-bg": `url(${activeBackgroundImage})`,
              }
            : undefined
        }
      >
        <div className="birthday-gallery-bg-image" />
        <div className="birthday-gallery-bg-overlay" />

        <div className="birthday-gallery-glow birthday-gallery-glow-one" />
        <div className="birthday-gallery-glow birthday-gallery-glow-two" />

        <motion.div
          className="birthday-gallery-inner"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <motion.div
            className="birthday-gallery-slider-wrap birthday-gallery-slider-top"
            initial={{ opacity: 0, y: -10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.08, duration: 0.8 }}
          >
            <div className="birthday-gallery-slider-track">
              {[image1, image2, image3, image1, image2, image3]
                .filter(Boolean)
                .map((img, index) => (
                  <div
                    className="birthday-gallery-slide"
                    key={`${img}-${index}`}
                  >
                    <img
                      src={img}
                      alt={`${name} ${index + 1}`}
                    />
                  </div>
                ))}
            </div>
          </motion.div>

          <motion.div
            className="birthday-gallery-heading"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.7 }}
          >
            <p className="birthday-gallery-kicker">
              {texts.kicker}
            </p>

            <h1 className="birthday-gallery-title">
              {name}
            </h1>

            <p className="birthday-gallery-subtitle">
              {texts.subtitle}
            </p>
          </motion.div>

          <motion.div
            className="birthday-gallery-calendar"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34, duration: 0.65 }}
          >
            <div className="birthday-gallery-calendar-top">
              {texts.saveTheDate}
            </div>

            <div className="birthday-gallery-calendar-body">
              <span className="birthday-gallery-calendar-month">
                {month}
              </span>

              <span className="birthday-gallery-calendar-day">
                {day}
              </span>

              <span className="birthday-gallery-calendar-year">
                {year}
              </span>

              <div className="birthday-gallery-calendar-ring" />
            </div>
          </motion.div>

          <motion.div
            className="birthday-gallery-info-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.7 }}
          >
            <div className="birthday-gallery-info-row">
              <span className="birthday-gallery-info-label">
                {texts.when}
              </span>

              <p className="birthday-gallery-info-value">
                {weddingDate} {texts.timeConnector} {weddingTime}
              </p>
            </div>

            <div className="birthday-gallery-info-divider" />

            {locationText && (
              <div className="birthday-gallery-info-row">
                <span className="birthday-gallery-info-label">
                  {texts.where}
                </span>

                <p className="birthday-gallery-info-value">
                  {locationText}
                </p>
              </div>
            )}

            {noteText && (
              <>
                <div className="birthday-gallery-info-divider" />

                <div className="birthday-gallery-info-row">
                  <span className="birthday-gallery-info-label">
                    {texts.note}
                  </span>

                  <p className="birthday-gallery-info-value">
                    {noteText}
                  </p>
                </div>
              </>
            )}
          </motion.div>

          <motion.p
            className="birthday-gallery-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.6 }}
          >
            {footerText}
          </motion.p>
        </motion.div>
      </section>

      <BirthdayGalleryRSVP
        slug={slug}
        eventType={type}
        brideName={name}
        details={details}
        backgroundImage={activeBackgroundImage}
        script={activeScript}
      />

      {details?.dateISO && (
        <BirthdayGalleryCountdown
          targetDate={details.dateISO}
          details={details}
          script={activeScript}
        />
      )}
    </div>
  );
}

export default BirthdayGalleryInvitationCard;