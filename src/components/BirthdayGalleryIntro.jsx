import { motion } from "framer-motion";
import "../styles/intro.css";

function BirthdayGalleryIntro({
  brideName,
  brideNameLatin,
  brideNameCyrillic,
  weddingDate,
  weddingTime,
  image1,
  image2,
  image3,
  onEnter,
  script,
  details = {},
}) {
  const activeScript = script || details?.script || "latin";
  const isCyrillic = activeScript === "cyrillic";

  const name = isCyrillic
    ? brideNameCyrillic ||
      details?.brideNameCyrillic ||
      brideName ||
      "Џејмс"
    : brideNameLatin ||
      details?.brideNameLatin ||
      brideName ||
      "James";

  const content = isCyrillic
    ? {
        fills: "пуни",
        defaultMessage: "Употпуните мој велики дан",
        openButton: "Отворите позивницу",
        timeConnector: "у",
      }
    : {
        fills: "puni",
        defaultMessage: "Upotpunite moj veliki dan",
        openButton: "Otvorite pozivnicu",
        timeConnector: "u",
      };

  /*
   * Tekst koji se prikazuje umesto naziva restorana.
   * Postavlja se posebno u slugu.
   */
  const introLocationText =
    details?.birthdayIntro?.locationText ||
    details?.introLocationText ||
    "";

  /*
   * Završna poruka takođe može biti posebna za svaki slug.
   */
  const introMessage =
    details?.birthdayIntro?.message ||
    details?.introMessage ||
    content.defaultMessage;

  /*
   * Boje se postavljaju kroz CSS promenljive.
   * Ako nisu navedene u slugu, koriste se postojeće/default boje.
   */
  const introColors = details?.birthdayIntro?.colors || {};

  const introStyle = {
    "--birthday-intro-background":
      introColors.background || "#f1e6dc",

    "--birthday-intro-card-background":
      introColors.cardBackground || "rgba(255, 255, 255, 0.82)",

    "--birthday-intro-text":
      introColors.text || "#49362f",

    "--birthday-intro-secondary-text":
      introColors.secondaryText || introColors.text || "#705c53",

    "--birthday-intro-accent":
      introColors.accent || "#a87b67",

    "--birthday-intro-button-background":
      introColors.buttonBackground || "#49362f",

    "--birthday-intro-button-text":
      introColors.buttonText || "#ffffff",

    "--birthday-intro-button-border":
      introColors.buttonBorder ||
      introColors.buttonBackground ||
      "#49362f",
  };

  return (
    <section className="birthday-one-intro" style={introStyle}>
      <motion.div
        className="birthday-one-card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75 }}
      >
        <motion.h1
          className="birthday-one-name"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.65 }}
        >
          {name}
        </motion.h1>

        <motion.p
          className="birthday-one-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.55 }}
        >
          {content.fills}
        </motion.p>

        <motion.div
          className="birthday-one-shape"
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.7 }}
        >
          <div className="birthday-one-collage">
            <div className="birthday-one-photo birthday-one-photo-top">
              <img src={image1} alt={`${name} 1`} />
            </div>

            <div className="birthday-one-photo birthday-one-photo-middle">
              <img src={image2} alt={`${name} 2`} />
            </div>

            <div className="birthday-one-photo birthday-one-photo-bottom">
              <img src={image3} alt={`${name} 3`} />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="birthday-one-info"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.55 }}
        >
          <p className="birthday-one-date">
            {weddingDate} {content.timeConnector} {weddingTime}
          </p>

          {introLocationText && (
            <p className="birthday-one-location">
              {introLocationText}
            </p>
          )}

          <p className="birthday-one-rsvp">{introMessage}</p>
        </motion.div>

        <motion.button
          type="button"
          className="birthday-one-button"
          onClick={onEnter}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.55 }}
        >
          {content.openButton}
        </motion.button>
      </motion.div>
    </section>
  );
}

export default BirthdayGalleryIntro;