import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import "../styles/rsvp.css";

function BirthdayGalleryRSVP({
  slug,
  eventType,
  brideName,
  brideNameLatin,
  brideNameCyrillic,
  details = {},
  backgroundImage,
  script,
}) {
  const activeScript =
    script || details?.script || "latin";

  const isCyrillic =
    activeScript === "cyrillic";

  /*
   * Ostaje zbog kompatibilnosti sa starim slugovima.
   *
   * Za nove slugove ovaj objekat nije obavezan.
   */
  const rsvpConfig =
    details?.birthdayGalleryRSVP || {};

  /*
   * Sve nove boje čitamo iz zajedničke teme.
   */
  const theme =
    details?.theme || {};

  /*
   * Podrška za stare slugove koji koriste:
   *
   * birthdayGalleryRSVP: {
   *   colors: {}
   * }
   */
  const legacyColors =
    rsvpConfig?.colors || {};

  const name = isCyrillic
    ? brideNameCyrillic ||
      details?.brideNameCyrillic ||
      brideName ||
      "Виктор"
    : brideNameLatin ||
      details?.brideNameLatin ||
      brideName ||
      "Viktor";

  /*
   * Podrazumevani tekstovi već postoje u komponenti,
   * pa ne moraju da se ponavljaju u demoWedding slugu.
   */
  const defaultTexts = isCyrillic
    ? {
        title: "Потврдите долазак",

        subtitle:
          "Биће нам велико задовољство да заједно прославимо овај посебан дан.",

        fullNameLabel:
          "Име и презиме",

        fullNamePlaceholder:
          "Унесите име и презиме",

        attendanceQuestion:
          "Да ли долазите?",

        attendingTitle:
          "Долазим",

        attendingText:
          "Радујем се прослави",

        notAttendingTitle:
          "Не долазим",

        notAttendingText:
          "Нажалост, нисам у могућности",

        guestsLabel:
          "Број особа",

        submit:
          "Пошаљи потврду",

        loading:
          "Слање...",

        successTitle:
          "Хвала!",

        successText:
          "Ваша потврда је успешно послата.",

        missingEvent:
          "Недостаје slug или тип догађаја.",

        missingName:
          "Унесите име и презиме.",

        missingAttendance:
          "Изаберите да ли долазите.",

        invalidGuests:
          "Унесите исправан број особа.",

        submitError:
          "Дошло је до грешке при слању.",
      }
    : {
        title:
          "Potvrdite dolazak",

        subtitle:
          "Biće nam veliko zadovoljstvo da zajedno proslavimo ovaj poseban dan.",

        fullNameLabel:
          "Ime i prezime",

        fullNamePlaceholder:
          "Unesite ime i prezime",

        attendanceQuestion:
          "Da li dolazite?",

        attendingTitle:
          "Dolazim",

        attendingText:
          "Radujem se proslavi",

        notAttendingTitle:
          "Ne dolazim",

        notAttendingText:
          "Nažalost, nisam u mogućnosti",

        guestsLabel:
          "Broj osoba",

        submit:
          "Pošalji potvrdu",

        loading:
          "Slanje...",

        successTitle:
          "Hvala!",

        successText:
          "Vaša potvrda je uspešno poslata.",

        missingEvent:
          "Nedostaje slug ili tip događaja.",

        missingName:
          "Unesite ime i prezime.",

        missingAttendance:
          "Izaberite da li dolazite.",

        invalidGuests:
          "Unesite ispravan broj osoba.",

        submitError:
          "Došlo je do greške pri slanju.",
      };

  /*
   * Stari slugovi i dalje mogu da imaju posebne tekstove.
   *
   * Za Tadiju ovaj deo ne mora da postoji u demoWedding.
   */
  const legacyCustomTexts =
    rsvpConfig?.texts?.[activeScript] || {};

  const texts = {
    ...defaultTexts,
    ...legacyCustomTexts,
  };

  const showName =
    rsvpConfig?.showName === true;

  const activeBackgroundImage =
    rsvpConfig?.backgroundImage ||
    backgroundImage ||
    details?.backgroundImage ||
    "";

  /*
   * Sve nove boje prvenstveno se uzimaju iz details.theme.
   *
   * legacyColors ostaje kao rezerva za stare slugove.
   */
  const themeStyle = {
    "--birthday-rsvp-page-bg":
      theme.rsvpPageBackground ||
      theme.backgroundColor ||
      legacyColors.background ||
      "#f7f4ee",

    "--birthday-rsvp-overlay":
      theme.rsvpOverlay ||
      legacyColors.overlay ||
      "rgba(247, 244, 238, 0.62)",

    "--birthday-rsvp-card-bg":
      theme.rsvpCardBackground ||
      legacyColors.cardBackground ||
      "rgba(255, 255, 255, 0.76)",

    "--birthday-rsvp-card-border":
      theme.rsvpCardBorder ||
      legacyColors.cardBorder ||
      "rgba(100, 78, 62, 0.15)",

    /*
     * Opšte boje teksta
     */
    "--birthday-rsvp-text":
      theme.rsvpMainText ||
      theme.mainText ||
      legacyColors.text ||
      "#2f251f",

    "--birthday-rsvp-muted-text":
      theme.rsvpSoftText ||
      theme.softText ||
      legacyColors.secondaryText ||
      "#89796f",

    "--birthday-rsvp-accent":
      theme.rsvpAccent ||
      theme.accent ||
      legacyColors.accent ||
      "#b49778",

    /*
     * Pojedinačne boje teksta
     */
    "--birthday-rsvp-kicker-text":
      theme.rsvpKickerText ||
      theme.rsvpAccent ||
      theme.accent ||
      legacyColors.accent ||
      "#b49778",

    "--birthday-rsvp-title-text":
      theme.rsvpTitleText ||
      theme.rsvpMainText ||
      theme.mainText ||
      legacyColors.text ||
      "#2f251f",

    "--birthday-rsvp-subtitle-text":
      theme.rsvpSubtitleText ||
      theme.rsvpSoftText ||
      theme.softText ||
      legacyColors.secondaryText ||
      "#89796f",

    "--birthday-rsvp-label-text":
      theme.rsvpLabelText ||
      theme.rsvpMainText ||
      theme.mainText ||
      legacyColors.text ||
      "#2f251f",

    "--birthday-rsvp-input-text":
      theme.rsvpInputText ||
      theme.rsvpMainText ||
      theme.mainText ||
      legacyColors.text ||
      "#2f251f",

    "--birthday-rsvp-placeholder-text":
      theme.rsvpPlaceholderText ||
      theme.rsvpSoftText ||
      theme.softText ||
      legacyColors.secondaryText ||
      "#89796f",

    "--birthday-rsvp-choice-title-text":
      theme.rsvpChoiceTitleText ||
      theme.rsvpMainText ||
      theme.mainText ||
      legacyColors.text ||
      "#2f251f",

    "--birthday-rsvp-choice-text":
      theme.rsvpChoiceText ||
      theme.rsvpSoftText ||
      theme.softText ||
      legacyColors.secondaryText ||
      "#89796f",

    "--birthday-rsvp-success-title-text":
      theme.rsvpSuccessTitleText ||
      theme.rsvpMainText ||
      theme.mainText ||
      legacyColors.text ||
      "#2f251f",

    "--birthday-rsvp-success-text":
      theme.rsvpSuccessText ||
      theme.rsvpSoftText ||
      theme.softText ||
      legacyColors.secondaryText ||
      "#89796f",

    /*
     * Polja forme
     */
    "--birthday-rsvp-input-bg":
      theme.rsvpInputBackground ||
      legacyColors.inputBackground ||
      "rgba(255, 255, 255, 0.72)",

    "--birthday-rsvp-input-border":
      theme.rsvpInputBorder ||
      legacyColors.inputBorder ||
      "rgba(100, 78, 62, 0.18)",

    /*
     * Dolazim / Ne dolazim
     */
    "--birthday-rsvp-choice-bg":
      theme.rsvpChoiceBackground ||
      legacyColors.choiceBackground ||
      "rgba(255, 255, 255, 0.45)",

    "--birthday-rsvp-choice-active-bg":
      theme.rsvpChoiceActiveBackground ||
      legacyColors.choiceActiveBackground ||
      "rgba(180, 151, 120, 0.14)",

    "--birthday-rsvp-choice-active-border":
      theme.rsvpChoiceActiveBorder ||
      theme.rsvpAccent ||
      theme.accent ||
      legacyColors.choiceActiveBorder ||
      legacyColors.accent ||
      "#b49778",

    "--birthday-rsvp-divider":
      theme.rsvpDivider ||
      legacyColors.divider ||
      "rgba(100, 78, 62, 0.16)",

    /*
     * Dugme
     */
    "--birthday-rsvp-button-bg":
      theme.rsvpButtonBackground ||
      theme.buttonBackground ||
      legacyColors.buttonBackground ||
      "#2f241d",

    "--birthday-rsvp-button-text":
      theme.rsvpButtonText ||
      theme.buttonText ||
      legacyColors.buttonText ||
      "#ffffff",

    "--birthday-rsvp-button-border":
      theme.rsvpButtonBorder ||
      theme.buttonBorder ||
      legacyColors.buttonBorder ||
      legacyColors.buttonBackground ||
      "#2f241d",

    /*
     * Uspešno slanje
     */
    "--birthday-rsvp-success":
      theme.rsvpSuccess ||
      theme.rsvpAccent ||
      theme.accent ||
      legacyColors.success ||
      legacyColors.accent ||
      "#b49778",

    ...(activeBackgroundImage
      ? {
          "--birthday-rsvp-bg":
            `url(${activeBackgroundImage})`,
        }
      : {}),
  };

  const [formData, setFormData] =
    useState({
      fullName: "",
      attending: "",
      guests: "1",
    });

  const [loading, setLoading] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  useEffect(() => {
    if (!submitted) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setSubmitted(false);

      setFormData({
        fullName: "",
        attending: "",
        guests: "1",
      });
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [submitted]);

  const handleChange = (event) => {
    const {
      name: fieldName,
      value,
    } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [fieldName]: value,
    }));
  };

  const handleAttendanceSelect = (
    value
  ) => {
    setFormData((previousData) => ({
      ...previousData,

      attending: value,

      guests:
        value === "da"
          ? previousData.guests || "1"
          : "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!slug || !eventType) {
      alert(texts.missingEvent);
      return;
    }

    if (!formData.fullName.trim()) {
      alert(texts.missingName);
      return;
    }

    if (!formData.attending) {
      alert(texts.missingAttendance);
      return;
    }

    const guestsCount =
      Number(formData.guests);

    if (
      formData.attending === "da" &&
      (
        !formData.guests ||
        Number.isNaN(guestsCount) ||
        guestsCount < 1
      )
    ) {
      alert(texts.invalidGuests);
      return;
    }

    setLoading(true);

    try {
      await setDoc(
        doc(db, "events", slug),
        {
          slug,
          eventType,
          updatedAt:
            serverTimestamp(),
        },
        {
          merge: true,
        }
      );

      await addDoc(
        collection(
          db,
          "events",
          slug,
          "rsvps"
        ),
        {
          eventType,

          fullName:
            formData.fullName.trim(),

          attending:
            formData.attending,

          guests:
            formData.attending === "da"
              ? guestsCount
              : 0,

          createdAt:
            serverTimestamp(),
        }
      );

      setSubmitted(true);
    } catch (error) {
      console.error(
        "Greška pri slanju RSVP:",
        error
      );

      alert(texts.submitError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      className={`birthday-rsvp-section birthday-rsvp-section-${activeScript}`}
      initial={{
        opacity: 0,
        y: 26,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.8,
      }}
      viewport={{
        once: true,
      }}
      style={themeStyle}
    >
      {activeBackgroundImage && (
        <div className="birthday-rsvp-bg-image" />
      )}

      <div className="birthday-rsvp-overlay" />

      <div className="birthday-rsvp-shell">
        <div className="birthday-rsvp-card">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                className="birthday-rsvp-success"
                initial={{
                  opacity: 0,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: 0.5,
                }}
              >
                <motion.div
                  className="birthday-rsvp-success-heart"
                  initial={{
                    scale: 0,
                    rotate: -15,
                  }}
                  animate={{
                    scale: [0, 1.2, 1],

                    rotate: [
                      0,
                      8,
                      -8,
                      0,
                    ],
                  }}
                  transition={{
                    duration: 0.9,
                  }}
                >
                  💌
                </motion.div>

                <motion.h3
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.15,
                    duration: 0.45,
                  }}
                >
                  {texts.successTitle}
                </motion.h3>

                <motion.p
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.28,
                    duration: 0.45,
                  }}
                >
                  {texts.successText}
                </motion.p>

                <div className="birthday-confetti-wrap">
                  {Array.from({
                    length: 18,
                  }).map((_, index) => (
                    <motion.span
                      key={index}
                      className="birthday-confetti"
                      initial={{
                        opacity: 0,
                        y: 0,
                        x: 0,
                        scale: 0.6,
                      }}
                      animate={{
                        opacity: [
                          0,
                          1,
                          1,
                          0,
                        ],

                        y:
                          110 +
                          (index % 4) * 8,

                        x:
                          (index - 9) * 10,

                        scale: [
                          0.6,
                          1,
                          0.9,
                        ],

                        rotate: [
                          0,
                          120,
                          240,
                        ],
                      }}
                      transition={{
                        duration: 1.6,

                        delay:
                          index * 0.04,

                        ease: "easeOut",
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
              >
                <p className="birthday-rsvp-kicker">
                  RSVP
                </p>

                <h2 className="birthday-rsvp-title">
                  {texts.title}
                </h2>

                <p className="birthday-rsvp-subtitle">
                  {texts.subtitle}
                </p>

                {showName && (
                  <p className="birthday-rsvp-child-name">
                    {name}
                  </p>
                )}

                <div className="birthday-rsvp-divider" />

                <form
                  className="birthday-rsvp-form"
                  onSubmit={handleSubmit}
                >
                  <div className="birthday-rsvp-field">
                    <label
                      htmlFor={`birthday-fullName-${slug}`}
                    >
                      {texts.fullNameLabel}
                    </label>

                    <input
                      id={`birthday-fullName-${slug}`}
                      type="text"
                      name="fullName"
                      value={
                        formData.fullName
                      }
                      onChange={
                        handleChange
                      }
                      placeholder={
                        texts.fullNamePlaceholder
                      }
                      required
                    />
                  </div>

                  <div className="birthday-rsvp-choice-block">
                    <p className="birthday-rsvp-choice-label">
                      {
                        texts.attendanceQuestion
                      }
                    </p>

                    <div className="birthday-rsvp-choice-grid">
                      <button
                        type="button"
                        className={`birthday-choice-card ${
                          formData.attending === "da"
                            ? "is-active"
                            : ""
                        }`}
                        onClick={() =>
                          handleAttendanceSelect(
                            "da"
                          )
                        }
                      >
                        <span className="birthday-choice-title">
                          {
                            texts.attendingTitle
                          }
                        </span>

                        <span className="birthday-choice-text">
                          {
                            texts.attendingText
                          }
                        </span>
                      </button>

                      <button
                        type="button"
                        className={`birthday-choice-card ${
                          formData.attending === "ne"
                            ? "is-active"
                            : ""
                        }`}
                        onClick={() =>
                          handleAttendanceSelect(
                            "ne"
                          )
                        }
                      >
                        <span className="birthday-choice-title">
                          {
                            texts.notAttendingTitle
                          }
                        </span>

                        <span className="birthday-choice-text">
                          {
                            texts.notAttendingText
                          }
                        </span>
                      </button>
                    </div>
                  </div>

                  <input
                    type="hidden"
                    name="attending"
                    value={
                      formData.attending
                    }
                    required
                  />

                  <AnimatePresence initial={false}>
                    {formData.attending === "da" && (
                      <motion.div
                        className="birthday-rsvp-field"
                        initial={{
                          opacity: 0,
                          height: 0,
                          y: 6,
                        }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          height: 0,
                          y: -4,
                        }}
                        transition={{
                          duration: 0.25,
                        }}
                      >
                        <label
                          htmlFor={`birthday-guests-${slug}`}
                        >
                          {texts.guestsLabel}
                        </label>

                        <input
                          id={`birthday-guests-${slug}`}
                          type="number"
                          name="guests"
                          min="1"
                          max="10"
                          value={
                            formData.guests
                          }
                          onChange={
                            handleChange
                          }
                          required
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    className="birthday-rsvp-button"
                    disabled={loading}
                  >
                    {loading
                      ? texts.loading
                      : texts.submit}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}

export default BirthdayGalleryRSVP;