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
      "Тадија"
    : brideNameLatin ||
      details?.brideNameLatin ||
      brideName ||
      "Tadija";

  const content = isCyrillic
    ? {
        fills: "пуни",
        defaultWelcomeText:
          "Са великом радошћу вас позивамо да заједно прославимо овај посебан дан.",
        openButton: "Отворите позивницу",
        timeConnector: "у",
      }
    : {
        fills: "puni",
        defaultWelcomeText:
          "Sa velikom radošću vas pozivamo da zajedno proslavimo ovaj poseban dan.",
        openButton: "Otvorite pozivnicu",
        timeConnector: "u",
      };

  /*
   * Ispod datuma prikazuje se samo welcomeText.
   *
   * Može biti običan tekst:
   * welcomeText: "Tekst..."
   *
   * Ili tekst za oba pisma:
   * welcomeText: {
   *   latin: "Tekst...",
   *   cyrillic: "Текст...",
   * }
   */
  const welcomeText = getLocalizedText(
    details?.welcomeText,
    content.defaultWelcomeText
  );

  /*
   * Tekst dugmeta je automatski latinica/ćirilica,
   * ali može opciono da se promeni u slugu.
   */
  const buttonText = getLocalizedText(
    details?.birthdayIntro?.buttonText,
    content.openButton
  );

  /*
   * Sve boje uzimaju se iz details.theme.
   */
  const theme = details?.theme || {};

  const introStyle = {
    "--birthday-intro-background":
      theme.backgroundColor || "#55613A",

    "--birthday-intro-card-background":
      theme.introCardBackground ||
      "rgba(246, 241, 228, 0.12)",

    "--birthday-intro-text":
      theme.introMainText ||
      theme.mainText ||
      "#F6F1E4",

    "--birthday-intro-secondary-text":
      theme.introSoftText ||
      theme.softText ||
      theme.introMainText ||
      theme.mainText ||
      "#EFE6CF",

    "--birthday-intro-accent":
      theme.introAccent ||
      theme.accent ||
      "#B79A5D",

    "--birthday-intro-button-background":
      theme.introButtonBg ||
      theme.buttonBackground ||
      "#434D2D",

    "--birthday-intro-button-text":
      theme.introButtonText ||
      theme.buttonText ||
      "#FFFDF7",

    "--birthday-intro-button-border":
      theme.introButtonBorder ||
      theme.introButtonBg ||
      theme.buttonBackground ||
      "#434D2D",
  };

  return (
    <section
      className={`birthday-one-intro birthday-one-intro-${activeScript}`}
      style={introStyle}
    >
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
          transition={{
            delay: 0.12,
            duration: 0.65,
          }}
        >
          {name}
        </motion.h1>

        <motion.p
          className="birthday-one-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.25,
            duration: 0.55,
          }}
        >
          {content.fills}
        </motion.p>

        <motion.div
          className="birthday-one-shape"
          initial={{
            opacity: 0,
            scale: 0.985,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            delay: 0.35,
            duration: 0.7,
          }}
        >
          <div className="birthday-one-collage">
            {image1 && (
              <div className="birthday-one-photo birthday-one-photo-top">
                <img
                  src={image1}
                  alt={`${name} 1`}
                />
              </div>
            )}

            {image2 && (
              <div className="birthday-one-photo birthday-one-photo-middle">
                <img
                  src={image2}
                  alt={`${name} 2`}
                />
              </div>
            )}

            {image3 && (
              <div className="birthday-one-photo birthday-one-photo-bottom">
                <img
                  src={image3}
                  alt={`${name} 3`}
                />
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="birthday-one-info"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.7,
            duration: 0.55,
          }}
        >
          <p className="birthday-one-date">
            {weddingDate} {content.timeConnector} {weddingTime}
          </p>

          {welcomeText && (
            <p className="birthday-one-welcome">
              {welcomeText}
            </p>
          )}
        </motion.div>

        <motion.button
          type="button"
          className="birthday-one-button"
          onClick={onEnter}
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.9,
            duration: 0.55,
          }}
        >
          {buttonText}
        </motion.button>
      </motion.div>
    </section>
  );
}

export default BirthdayGalleryIntro;