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
  const activeScript =
    script || details?.script || "latin";

  const isCyrillic =
    activeScript === "cyrillic";

  /*
   * Podešavanja glavne kartice.
   * Ostaje zbog kompatibilnosti sa starim slugovima.
   */
  const cardConfig =
    details?.birthdayGalleryCard || {};

  /*
   * Zajednička tema iz sluga.
   */
  const theme =
    details?.theme || {};

  /*
   * Podrška za stare slugove koji koriste:
   *
   * birthdayGalleryCard: {
   *   colors: {}
   * }
   */
  const legacyColors =
    cardConfig?.colors || {};

  const getLocalizedText = (
    value,
    fallback = ""
  ) => {
    if (!value) {
      return fallback;
    }

    if (
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
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
        kicker:
          "РОЂЕНДАНСКО СЛАВЉЕ",

        subtitle:
          "Прослава првог рођендана",

        saveTheDate:
          "САЧУВАЈТЕ ДАТУМ",

        when:
          "Када",

        where:
          "Где",

        note:
          "Напомена",

        timeConnector:
          "у",

        footer:
          "Радујемо се да заједно обележимо овај посебан дан.",
      }
    : {
        kicker:
          "ROĐENDANSKO SLAVLJE",

        subtitle:
          "Proslava prvog rođendana",

        saveTheDate:
          "SAČUVAJTE DATUM",

        when:
          "Kada",

        where:
          "Gde",

        note:
          "Napomena",

        timeConnector:
          "u",

        footer:
          "Radujemo se da zajedno obeležimo ovaj poseban dan.",
      };

  /*
   * Podrška za stare slugove
   * sa posebnim tekstovima.
   */
  const customTexts =
    cardConfig?.texts?.[activeScript] || {};

  const texts = {
    ...defaultTexts,
    ...customTexts,
  };

  /*
   * Datum prvenstveno koristi weddingDate.
   */
  const displayedDate =
    weddingDate ||
    getLocalizedText(
      details?.date,
      ""
    );

  /*
   * Lokacija prvenstveno koristi venue.
   */
  const locationText =
    getLocalizedText(
      cardConfig?.locationText,
      venue ||
        details?.venue ||
        ""
    );

  /*
   * Napomena sa glavne kartice.
   */
  const noteText =
    getLocalizedText(
      cardConfig?.note,
      getLocalizedText(
        details?.note,
        ""
      )
    );

  const footerText =
    getLocalizedText(
      cardConfig?.footerText,
      texts.footer
    );

  /*
   * Pozadinska slika za glavnu karticu,
   * RSVP i countdown.
   */
  const activeBackgroundImage =
    cardConfig?.backgroundImage ||
    backgroundImage ||
    details?.backgroundImage ||
    "";

  /*
   * Rastavljanje datuma za kalendar.
   *
   * Primer:
   * 25 SEP 2026
   */
  const dateParts =
    String(displayedDate || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  const day =
    dateParts[0] || "10";

  const month =
    dateParts[1] ||
    (isCyrillic
      ? "СЕП"
      : "SEP");

  const year =
    dateParts[2] || "2026";

  /*
   * Sve boje prvo se uzimaju iz details.theme.
   *
   * Ako neka vrednost ne postoji u theme,
   * koristi se stari colors objekat, pa default.
   */
  const themeStyle = {
    /* Glavna pozadina */
    "--birthday-gallery-page-bg":
      theme.cardPageBackground ||
      theme.backgroundColor ||
      legacyColors.background ||
      "#f7f4ee",

    /* Osnovne boje teksta */
    "--birthday-gallery-text":
      theme.cardMainText ||
      theme.mainText ||
      legacyColors.text ||
      "#2f251f",

    "--birthday-gallery-muted-text":
      theme.cardSoftText ||
      theme.softText ||
      legacyColors.secondaryText ||
      "#8f8176",

    "--birthday-gallery-accent":
      theme.cardAccent ||
      theme.accent ||
      legacyColors.accent ||
      "#b49778",

    /* Pojedinačne boje teksta */
    "--birthday-gallery-kicker-text":
      theme.cardKickerText ||
      theme.cardAccent ||
      theme.accent ||
      legacyColors.accent ||
      "#7d6655",

    "--birthday-gallery-title-text":
      theme.cardTitleText ||
      theme.cardMainText ||
      theme.mainText ||
      legacyColors.text ||
      "#2d221c",

    "--birthday-gallery-subtitle-text":
      theme.cardSubtitleText ||
      theme.cardSoftText ||
      theme.softText ||
      legacyColors.secondaryText ||
      "#62674a",

    "--birthday-gallery-calendar-text":
      theme.cardCalendarText ||
      theme.cardMainText ||
      theme.mainText ||
      legacyColors.text ||
      "#2f241d",

    "--birthday-gallery-calendar-day-text":
      theme.cardCalendarDayText ||
      theme.cardMainText ||
      theme.mainText ||
      legacyColors.text ||
      "#2f251f",

    "--birthday-gallery-info-label-text":
      theme.cardInfoLabelText ||
      theme.cardAccent ||
      theme.accent ||
      legacyColors.accent ||
      "#8e7562",

    "--birthday-gallery-info-value-text":
      theme.cardInfoValueText ||
      theme.cardMainText ||
      theme.mainText ||
      legacyColors.text ||
      "#2d221c",

    "--birthday-gallery-footer-text":
      theme.cardFooterText ||
      theme.cardSoftText ||
      theme.softText ||
      legacyColors.secondaryText ||
      "#6e584a",

    /* Overlay */
    "--birthday-gallery-overlay":
      theme.cardOverlay ||
      legacyColors.overlay ||
      "rgba(247, 244, 238, 0.42)",

    /* Unutrašnja površina */
    "--birthday-gallery-inner-bg":
      theme.cardSurfaceBackground ||
      "rgba(255, 255, 255, 0.08)",

    "--birthday-gallery-inner-border":
      theme.cardSurfaceBorder ||
      legacyColors.infoBorder ||
      "rgba(100, 78, 62, 0.15)",

    /* Info kartica */
    "--birthday-gallery-info-bg":
      theme.cardInfoBackground ||
      legacyColors.infoBackground ||
      "rgba(255, 255, 255, 0.62)",

    "--birthday-gallery-info-border":
      theme.cardInfoBorder ||
      legacyColors.infoBorder ||
      "rgba(100, 78, 62, 0.15)",

    "--birthday-gallery-divider":
      theme.cardDivider ||
      legacyColors.divider ||
      "rgba(100, 78, 62, 0.18)",

    /* Kalendar */
    "--birthday-gallery-calendar-header-bg":
      theme.cardCalendarHeaderBackground ||
      theme.buttonBackground ||
      legacyColors.buttonBackground ||
      "#2f241d",

    "--birthday-gallery-calendar-header-text":
      theme.cardCalendarHeaderText ||
      theme.buttonText ||
      legacyColors.buttonText ||
      "#ffffff",

    "--birthday-gallery-calendar-body-bg":
      theme.cardCalendarBackground ||
      "rgba(255, 255, 255, 0.9)",

    "--birthday-gallery-calendar-body-border":
      theme.cardCalendarBorder ||
      legacyColors.infoBorder ||
      "rgba(122, 100, 84, 0.12)",

    "--birthday-gallery-calendar-day-bg":
      theme.cardCalendarDayBackground ||
      "linear-gradient(180deg, #f7efe7 0%, #efe2d5 100%)",

    "--birthday-gallery-calendar-ring":
      theme.cardCalendarRing ||
      theme.cardAccent ||
      legacyColors.accent ||
      "rgba(143, 115, 96, 0.18)",

    /* Dugmad */
    "--birthday-gallery-button-bg":
      theme.cardButtonBackground ||
      theme.buttonBackground ||
      legacyColors.buttonBackground ||
      "#2f241d",

    "--birthday-gallery-button-text":
      theme.cardButtonText ||
      theme.buttonText ||
      legacyColors.buttonText ||
      "#ffffff",

    "--birthday-gallery-button-border":
      theme.cardButtonBorder ||
      theme.buttonBorder ||
      legacyColors.buttonBorder ||
      legacyColors.buttonBackground ||
      "#2f241d",

    /* Dekorativni glow */
    "--birthday-gallery-glow-one":
      theme.cardGlowOne ||
      legacyColors.glowOne ||
      "rgba(255, 255, 255, 0.48)",

    "--birthday-gallery-glow-two":
      theme.cardGlowTwo ||
      legacyColors.glowTwo ||
      "rgba(200, 176, 150, 0.18)",
  };

  /*
   * Rezervne slike ako sliderImages
   * nije dodat u details.
   */
  const fallbackImages = [
    image1,
    image2,
    image3,
  ].filter(Boolean);

  /*
   * Ako postoji details.sliderImages,
   * slider koristi sve slike iz tog niza.
   *
   * Ako ne postoji, koristi image1–image3.
   */
  const configuredSliderImages =
    Array.isArray(details?.sliderImages)
      ? details.sliderImages.filter(Boolean)
      : [];

  const originalSliderImages =
    configuredSliderImages.length > 0
      ? configuredSliderImages
      : fallbackImages;

  /*
   * Slike se dupliraju zbog
   * neprekidne horizontalne animacije.
   *
   * Primer za šest slika:
   * 1 2 3 4 5 6 1 2 3 4 5 6
   */
  const sliderImages = [
    ...originalSliderImages,
    ...originalSliderImages,
  ];

  /*
   * Više slika znači dužu animaciju,
   * da slider ne bi bio prebrz.
   *
   * 3 slike = najmanje 20 sekundi
   * 6 slika = 30 sekundi
   * 10 slika = 50 sekundi
   */
  const sliderDuration =
    Math.max(
      20,
      originalSliderImages.length * 5
    );

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
                "--birthday-card-bg":
                  `url(${activeBackgroundImage})`,
              }
            : undefined
        }
      >
        {activeBackgroundImage && (
          <div className="birthday-gallery-bg-image" />
        )}

        <div className="birthday-gallery-bg-overlay" />

        <div className="birthday-gallery-glow birthday-gallery-glow-one" />

        <div className="birthday-gallery-glow birthday-gallery-glow-two" />

        <motion.div
          className="birthday-gallery-inner"
          initial={{
            opacity: 0,
            y: 28,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.9,
          }}
        >
          {originalSliderImages.length > 0 && (
            <motion.div
              className="birthday-gallery-slider-wrap birthday-gallery-slider-top"
              initial={{
                opacity: 0,
                y: -10,
                scale: 0.99,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                delay: 0.08,
                duration: 0.8,
              }}
            >
              <div
                className="birthday-gallery-slider-track"
                style={{
                  "--birthday-gallery-slider-duration":
                    `${sliderDuration}s`,
                }}
              >
                {sliderImages.map(
                  (img, index) => (
                    <div
                      className="birthday-gallery-slide"
                      key={`${img}-${index}`}
                    >
                      <img
                        src={img}
                        alt={`${name} ${
                          (index %
                            originalSliderImages.length) +
                          1
                        }`}
                        loading={
                          index < 3
                            ? "eager"
                            : "lazy"
                        }
                      />
                    </div>
                  )
                )}
              </div>
            </motion.div>
          )}

          <motion.div
            className="birthday-gallery-heading"
            initial={{
              opacity: 0,
              y: 14,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.18,
              duration: 0.7,
            }}
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
            initial={{
              opacity: 0,
              y: 14,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.34,
              duration: 0.65,
            }}
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
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.48,
              duration: 0.7,
            }}
          >
            <div className="birthday-gallery-info-row">
              <span className="birthday-gallery-info-label">
                {texts.when}
              </span>

              <p className="birthday-gallery-info-value">
                {displayedDate}

                {displayedDate &&
                  weddingTime &&
                  " "}

                {weddingTime && (
                  <>
                    {texts.timeConnector}{" "}
                    {weddingTime}
                  </>
                )}
              </p>
            </div>

            {locationText && (
              <>
                <div className="birthday-gallery-info-divider" />

                <div className="birthday-gallery-info-row">
                  <span className="birthday-gallery-info-label">
                    {texts.where}
                  </span>

                  <p className="birthday-gallery-info-value">
                    {locationText}
                  </p>
                </div>
              </>
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

          {footerText && (
            <motion.p
              className="birthday-gallery-footer"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.65,
                duration: 0.6,
              }}
            >
              {footerText}
            </motion.p>
          )}
        </motion.div>
      </section>

      <BirthdayGalleryRSVP
        slug={slug}
        eventType={
          type || "birthday"
        }
        brideName={name}
        brideNameLatin={
          brideNameLatin
        }
        brideNameCyrillic={
          brideNameCyrillic
        }
        details={details}
        backgroundImage={
          activeBackgroundImage ||
          undefined
        }
        script={activeScript}
      />

      {details?.dateISO && (
        <BirthdayGalleryCountdown
          targetDate={
            details.dateISO
          }
          backgroundImage={
            activeBackgroundImage ||
            undefined
          }
          details={details}
          script={activeScript}
          brideName={name}
          venue={
            venue ||
            details?.venue ||
            ""
          }
          slug={slug}
        />
      )}
    </div>
  );
}

export default BirthdayGalleryInvitationCard;