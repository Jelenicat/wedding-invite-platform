import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import "../styles/birthdayrsvp.css";

function getPossessiveName(name, isCyrillic) {
  const cleanName = String(name || "").trim();

  if (!cleanName) {
    return isCyrillic
      ? "дететов"
      : "detetov";
  }

  if (isCyrillic) {
    if (/[аА]$/.test(cleanName)) {
      return `${cleanName.slice(0, -1)}ин`;
    }

    return `${cleanName}ов`;
  }

  if (/[aA]$/.test(cleanName)) {
    return `${cleanName.slice(0, -1)}in`;
  }

  return `${cleanName}ov`;
}

function BirthdayHeartsRSVP({
  slug,
  eventType = "birthday",

  brideName,
  childName,

  details = {},
  backgroundImage,
  script,
}) {
  const activeScript =
    script ||
    details?.script ||
    "latin";

  const isCyrillic = [
    "cyrillic",
    "cyr",
    "ćirilica",
    "cirilica",
  ].includes(activeScript);

  const name =
    childName ||
    brideName ||
    details?.childName ||
    (isCyrillic
      ? "Име"
      : "Ime");

  const possessiveName =
    getPossessiveName(
      name,
      isCyrillic
    );

  const text = isCyrillic
    ? {
        kicker:
          "ПОТВРДА ДОЛАСКА",

        title:
          "Да ли славимо заједно?",

        subtitle:
          `Радоваћемо се да заједно прославимо ${possessiveName} први рођендан.`,

        fullNameLabel:
          "Име и презиме",

        fullNamePlaceholder:
          "Ваше име и презиме",

        attendanceQuestion:
          "Да ли долазите?",

        yes:
          "Долазим",

        yesSmall:
          "Радујем се прослави",

        no:
          "Не долазим",

        noSmall:
          "Нажалост, нисам у могућности",

        guests:
          "Број особа",

        submit:
          "Пошаљи потврду",

        sending:
          "Шаљемо...",

        successTitle:
          "Хвала!",

        successText:
          "Ваша потврда је успешно послата.",

        missingEvent:
          "Недостају подаци о догађају.",

        enterFullName:
          "Унесите име и презиме.",

        chooseAttendance:
          "Изаберите да ли долазите.",

        invalidGuests:
          "Унесите исправан број особа.",

        sendError:
          "Дошло је до грешке при слању.",
      }
    : {
        kicker:
          "POTVRDA DOLASKA",

        title:
          "Da li slavimo zajedno?",

        subtitle:
          `Radovaćemo se da zajedno proslavimo ${possessiveName} prvi rođendan.`,

        fullNameLabel:
          "Ime i prezime",

        fullNamePlaceholder:
          "Vaše ime i prezime",

        attendanceQuestion:
          "Da li dolazite?",

        yes:
          "Dolazim",

        yesSmall:
          "Radujem se proslavi",

        no:
          "Ne dolazim",

        noSmall:
          "Nažalost, nisam u mogućnosti",

        guests:
          "Broj osoba",

        submit:
          "Pošalji potvrdu",

        sending:
          "Šaljemo...",

        successTitle:
          "Hvala!",

        successText:
          "Vaša potvrda je uspešno poslata.",

        missingEvent:
          "Nedostaju podaci o događaju.",

        enterFullName:
          "Unesite ime i prezime.",

        chooseAttendance:
          "Izaberite da li dolazite.",

        invalidGuests:
          "Unesite ispravan broj osoba.",

        sendError:
          "Došlo je do greške pri slanju.",
      };

  const subtitle =
    details?.rsvpSubtitle ||
    text.subtitle;

  const rsvpNote =
    details?.rsvpNote || "";

  const sectionBackground =
    details?.rsvpBackgroundImage ||
    details?.cardBackgroundImage ||
    backgroundImage ||
    details?.introBackgroundImage ||
    "";

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

    const timer =
      setTimeout(() => {
        setSubmitted(false);

        setFormData({
          fullName: "",
          attending: "",
          guests: "1",
        });
      }, 3000);

    return () =>
      clearTimeout(timer);
  }, [submitted]);

  const handleChange = (event) => {
    const {
      name: fieldName,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [fieldName]: value,
      })
    );
  };

  const handleAttendanceSelect =
    (value) => {
      setFormData(
        (previous) => ({
          ...previous,

          attending: value,

          guests:
            value === "da"
              ? previous.guests ||
                "1"
              : "",
        })
      );
    };

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      if (
        !slug ||
        !eventType
      ) {
        alert(
          text.missingEvent
        );

        return;
      }

      if (
        !formData.fullName.trim()
      ) {
        alert(
          text.enterFullName
        );

        return;
      }

      if (
        !formData.attending
      ) {
        alert(
          text.chooseAttendance
        );

        return;
      }

      const guestsCount =
        Number(
          formData.guests
        );

      if (
        formData.attending ===
        "da"
      ) {
        if (
          !formData.guests ||
          Number.isNaN(
            guestsCount
          ) ||
          guestsCount < 1
        ) {
          alert(
            text.invalidGuests
          );

          return;
        }
      }

      setLoading(true);

      try {
        await setDoc(
          doc(
            db,
            "events",
            slug
          ),
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
              formData.attending ===
              "da"
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

        alert(
          text.sendError
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <motion.section
      className="bhrsvp-section"
      lang={
        isCyrillic
          ? "sr-Cyrl"
          : "sr-Latn"
      }
      style={
        sectionBackground
          ? {
              "--bhrsvp-bg":
                `url("${sectionBackground}")`,
            }
          : undefined
      }
      initial={{
        opacity: 0,
      }}
      whileInView={{
        opacity: 1,
      }}
      viewport={{
        once: true,
        amount: 0.1,
      }}
      transition={{
        duration: 0.7,
      }}
    >
      <div
        className="bhrsvp-bg"
        aria-hidden="true"
      />

      <div
        className="bhrsvp-softener"
        aria-hidden="true"
      />

      <div className="bhrsvp-wrap">
        <motion.div
          className="bhrsvp-card"
          initial={{
            opacity: 0,
            y: 30,
            scale: 0.98,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration: 0.85,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                className="bhrsvp-success"
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
              >
                <motion.div
                  className="bhrsvp-success-heart"
                  initial={{
                    scale: 0,
                  }}
                  animate={{
                    scale: [
                      0,
                      1.18,
                      1,
                    ],
                  }}
                  transition={{
                    duration: 0.8,
                  }}
                >
                  ♡
                </motion.div>

                <h3>
                  {
                    text.successTitle
                  }
                </h3>

                <p>
                  {
                    text.successText
                  }
                </p>

                <div
                  className="bhrsvp-success-one"
                  aria-hidden="true"
                >
                  one
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
                <header className="bhrsvp-heading">
                  <p className="bhrsvp-kicker">
                    {
                      text.kicker
                    }
                  </p>

                  <h2 className="bhrsvp-title">
                    {
                      text.title
                    }
                  </h2>

                  <p className="bhrsvp-subtitle">
                    {
                      subtitle
                    }
                  </p>

                  <div
                    className="bhrsvp-divider"
                    aria-hidden="true"
                  >
                    <span />
                    <b>♡</b>
                    <span />
                  </div>
                </header>

                {rsvpNote && (
                  <p className="bhrsvp-note">
                    {rsvpNote}
                  </p>
                )}

                <form
                  className="bhrsvp-form"
                  onSubmit={
                    handleSubmit
                  }
                >
                  <div className="bhrsvp-field">
                    <label
                      htmlFor={`bhrsvp-name-${slug}`}
                    >
                      {
                        text.fullNameLabel
                      }
                    </label>

                    <input
                      id={`bhrsvp-name-${slug}`}
                      type="text"
                      name="fullName"
                      value={
                        formData.fullName
                      }
                      onChange={
                        handleChange
                      }
                      placeholder={
                        text.fullNamePlaceholder
                      }
                      required
                    />
                  </div>

                  <div className="bhrsvp-attendance">
                    <p className="bhrsvp-question">
                      {
                        text.attendanceQuestion
                      }
                    </p>

                    <div className="bhrsvp-choice-grid">
                      <button
                        type="button"
                        className={[
                          "bhrsvp-choice",
                          formData.attending ===
                          "da"
                            ? "is-active"
                            : "",
                        ]
                          .filter(
                            Boolean
                          )
                          .join(" ")}
                        onClick={() =>
                          handleAttendanceSelect(
                            "da"
                          )
                        }
                      >
                        <span className="bhrsvp-choice-heart">
                          ♡
                        </span>

                        <span className="bhrsvp-choice-title">
                          {
                            text.yes
                          }
                        </span>

                        <span className="bhrsvp-choice-small">
                          {
                            text.yesSmall
                          }
                        </span>
                      </button>

                      <button
                        type="button"
                        className={[
                          "bhrsvp-choice",
                          formData.attending ===
                          "ne"
                            ? "is-active"
                            : "",
                        ]
                          .filter(
                            Boolean
                          )
                          .join(" ")}
                        onClick={() =>
                          handleAttendanceSelect(
                            "ne"
                          )
                        }
                      >
                        <span className="bhrsvp-choice-heart">
                          ♡
                        </span>

                        <span className="bhrsvp-choice-title">
                          {
                            text.no
                          }
                        </span>

                        <span className="bhrsvp-choice-small">
                          {
                            text.noSmall
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

                  <AnimatePresence
                    initial={false}
                  >
                    {formData.attending ===
                      "da" && (
                      <motion.div
                        className="bhrsvp-field bhrsvp-guests-field"
                        initial={{
                          opacity: 0,
                          height: 0,
                          y: 5,
                        }}
                        animate={{
                          opacity: 1,
                          height:
                            "auto",
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          height: 0,
                        }}
                        transition={{
                          duration: 0.3,
                        }}
                      >
                        <label
                          htmlFor={`bhrsvp-guests-${slug}`}
                        >
                          {
                            text.guests
                          }
                        </label>

                        <input
                          id={`bhrsvp-guests-${slug}`}
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
                    className="bhrsvp-submit"
                    disabled={
                      loading
                    }
                  >
                    {loading
                      ? text.sending
                      : text.submit}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default BirthdayHeartsRSVP;