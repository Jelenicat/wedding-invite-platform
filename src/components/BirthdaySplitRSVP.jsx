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
import "../styles/rsvp.css";

function getPossessiveName(name, isCyrillic) {
  const normalizedName = String(name || "").trim();

  if (!normalizedName) {
    return isCyrillic ? "Евин" : "Evin";
  }

  if (isCyrillic) {
    if (/[аА]$/.test(normalizedName)) {
      return `${normalizedName.slice(0, -1)}ин`;
    }

    return `${normalizedName}ов`;
  }

  if (/[aA]$/.test(normalizedName)) {
    return `${normalizedName.slice(0, -1)}in`;
  }

  return `${normalizedName}ov`;
}

function BirthdaySplitRSVP({
  slug,
  eventType = "birthday",
  brideName,
  details = {},
  backgroundImage,
  script,
}) {
  const activeScript =
    script ||
    details?.script ||
    "latin";

  const isCyrillic = activeScript === "cyrillic";

  const name =
    brideName ||
    (isCyrillic ? "Ева" : "Eva");

  const possessiveName = getPossessiveName(
    name,
    isCyrillic
  );

  const text = isCyrillic
    ? {
        missingEvent: "Недостају подаци о догађају.",
        enterFullName: "Унесите име и презиме.",
        chooseAttendance: "Изаберите да ли долазите.",
        invalidGuests: "Унесите исправан број особа.",
        sendError: "Дошло је до грешке при слању.",

        successTitle: "Хвала!",
        successText: "Ваша потврда је успешно послата.",

        kicker: "ПОТВРДА",
        title: "Потврдите долазак",
        subtitle: `Радоваћемо се да заједно прославимо ${possessiveName} рођендан.`,

        fullNameLabel: "Име и презиме",
        fullNamePlaceholder: "Унесите име и презиме",

        attendanceQuestion: "Да ли долазите?",

        attendingYes: "Долазим",
        attendingYesText: "Биће ми задовољство",

        attendingNo: "Не долазим",
        attendingNoText: "Нажалост, нисам у могућности",

        guestsLabel: "Број особа",

        sending: "Слање...",
        submit: "Пошаљи потврду",
      }
    : {
        missingEvent: "Nedostaju podaci o događaju.",
        enterFullName: "Unesite ime i prezime.",
        chooseAttendance: "Izaberite da li dolazite.",
        invalidGuests: "Unesite ispravan broj osoba.",
        sendError: "Došlo je do greške pri slanju.",

        successTitle: "Hvala!",
        successText: "Vaša potvrda je uspešno poslata.",

        kicker: "RSVP",
        title: "Potvrdite dolazak",
        subtitle: `Radovaćemo se da zajedno proslavimo ${possessiveName} rođendan.`,

        fullNameLabel: "Ime i prezime",
        fullNamePlaceholder: "Unesite ime i prezime",

        attendanceQuestion: "Da li dolazite?",

        attendingYes: "Dolazim",
        attendingYesText: "Biće mi zadovoljstvo",

        attendingNo: "Ne dolazim",
        attendingNoText: "Nažalost, nisam u mogućnosti",

        guestsLabel: "Broj osoba",

        sending: "Slanje...",
        submit: "Pošalji potvrdu",
      };

  const subtitle =
    details?.rsvpSubtitle ||
    text.subtitle;

  const slugClass = slug
    ? `birthday-split-rsvp-${slug}`
    : "";

  const [formData, setFormData] = useState({
    fullName: "",
    attending: "",
    guests: "1",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!submitted) return undefined;

    const timer = setTimeout(() => {
      setSubmitted(false);

      setFormData({
        fullName: "",
        attending: "",
        guests: "1",
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [submitted]);

  const handleChange = (event) => {
    const { name: fieldName, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [fieldName]: value,
    }));
  };

  const handleAttendanceSelect = (value) => {
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
      alert(text.missingEvent);
      return;
    }

    if (!formData.fullName.trim()) {
      alert(text.enterFullName);
      return;
    }

    if (!formData.attending) {
      alert(text.chooseAttendance);
      return;
    }

    const guestsCount = Number(formData.guests);

    if (formData.attending === "da") {
      if (
        !formData.guests ||
        Number.isNaN(guestsCount) ||
        guestsCount < 1
      ) {
        alert(text.invalidGuests);
        return;
      }
    }

    setLoading(true);

    try {
      await setDoc(
        doc(db, "events", slug),
        {
          slug,
          eventType,
          updatedAt: serverTimestamp(),
        },
        {
          merge: true,
        }
      );

      await addDoc(
        collection(db, "events", slug, "rsvps"),
        {
          eventType,
          fullName: formData.fullName.trim(),
          attending: formData.attending,
          guests:
            formData.attending === "da"
              ? guestsCount
              : 0,
          createdAt: serverTimestamp(),
        }
      );

      setSubmitted(true);
    } catch (error) {
      console.error("Greška pri slanju RSVP:", error);
      alert(text.sendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      className={[
        "birthday-split-rsvp-section",
        slugClass,
        isCyrillic
          ? "birthday-split-rsvp-cyrillic"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
      lang={isCyrillic ? "sr-Cyrl" : "sr-Latn"}
      initial={{
        opacity: 0,
        y: 24,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.8,
      }}
      style={
        backgroundImage
          ? {
              "--birthday-split-rsvp-bg": `url(${backgroundImage})`,
            }
          : undefined
      }
    >
      <div className="birthday-split-rsvp-bg" />
      <div className="birthday-split-rsvp-overlay" />

      <div className="birthday-split-rsvp-wrap">
        <div className="birthday-split-rsvp-card">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                className="birthday-split-rsvp-success"
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
                  className="birthday-split-rsvp-success-heart"
                  initial={{
                    scale: 0,
                    rotate: -15,
                  }}
                  animate={{
                    scale: [0, 1.2, 1],
                    rotate: [0, 8, -8, 0],
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
                  {text.successTitle}
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
                  {text.successText}
                </motion.p>

                <div className="birthday-split-confetti-wrap">
                  {Array.from({
                    length: 18,
                  }).map((_, index) => (
                    <motion.span
                      key={index}
                      className="birthday-split-confetti"
                      initial={{
                        opacity: 0,
                        y: 0,
                        x: 0,
                        scale: 0.6,
                      }}
                      animate={{
                        opacity: [0, 1, 1, 0],
                        y:
                          110 +
                          (index % 4) * 8,
                        x:
                          (index - 9) * 10,
                        scale: [0.6, 1, 0.9],
                        rotate: [0, 120, 240],
                      }}
                      transition={{
                        duration: 1.6,
                        delay: index * 0.04,
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
                <p className="birthday-split-rsvp-kicker">
                  {text.kicker}
                </p>

                <h2 className="birthday-split-rsvp-title">
                  {text.title}
                </h2>

                <p className="birthday-split-rsvp-subtitle">
                  {subtitle}
                </p>

                {details?.note &&
  slug !== "eva-1" &&
  slug !== "lara-1" && (
    <div className="birthday-split-rsvp-note">
      {details.note}
    </div>
  )}

                <form
                  className="birthday-split-rsvp-form"
                  onSubmit={handleSubmit}
                >
                  <div className="birthday-split-rsvp-field">
                    <label htmlFor="birthday-split-fullName">
                      {text.fullNameLabel}
                    </label>

                    <input
                      id="birthday-split-fullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder={text.fullNamePlaceholder}
                      required
                    />
                  </div>

                  <div className="birthday-split-rsvp-choice-block">
                    <p className="birthday-split-rsvp-choice-label">
                      {text.attendanceQuestion}
                    </p>

                    <div className="birthday-split-rsvp-choice-grid">
                      <button
                        type="button"
                        className={`birthday-split-choice-card ${
                          formData.attending === "da"
                            ? "is-active"
                            : ""
                        }`}
                        onClick={() =>
                          handleAttendanceSelect("da")
                        }
                      >
                        <span className="birthday-split-choice-title">
                          {text.attendingYes}
                        </span>

                        <span className="birthday-split-choice-text">
                          {text.attendingYesText}
                        </span>
                      </button>

                      <button
                        type="button"
                        className={`birthday-split-choice-card ${
                          formData.attending === "ne"
                            ? "is-active"
                            : ""
                        }`}
                        onClick={() =>
                          handleAttendanceSelect("ne")
                        }
                      >
                        <span className="birthday-split-choice-title">
                          {text.attendingNo}
                        </span>

                        <span className="birthday-split-choice-text">
                          {text.attendingNoText}
                        </span>
                      </button>
                    </div>
                  </div>

                  <input
                    type="hidden"
                    name="attending"
                    value={formData.attending}
                    required
                  />

                  <AnimatePresence initial={false}>
                    {formData.attending === "da" && (
                      <motion.div
                        className="birthday-split-rsvp-field"
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
                        <label htmlFor="birthday-split-guests">
                          {text.guestsLabel}
                        </label>

                        <input
                          id="birthday-split-guests"
                          type="number"
                          name="guests"
                          min="1"
                          max="10"
                          value={formData.guests}
                          onChange={handleChange}
                          required
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    className="birthday-split-rsvp-button"
                    disabled={loading}
                  >
                    {loading
                      ? text.sending
                      : text.submit}
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

export default BirthdaySplitRSVP;