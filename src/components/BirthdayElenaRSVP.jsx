import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import "../styles/birthdayrsvp.css";

function getPossessiveName(name, isCyrillic) {
  const normalizedName = String(name || "").trim();

  if (!normalizedName) {
    return isCyrillic ? "Еленин" : "Elenin";
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

function GemHeart({ className = "" }) {
  return (
    <svg
      className={`birthday-elena-rsvp__gem ${className}`}
      viewBox="0 0 44 40"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="birthdayElenaRsvpGem"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0" stopColor="#fffaf8" />
          <stop offset="0.25" stopColor="#eed4d0" />
          <stop offset="0.55" stopColor="#c99c97" />
          <stop offset="0.8" stopColor="#9b6965" />
          <stop offset="1" stopColor="#e5c3bf" />
        </linearGradient>
      </defs>

      <path
        d="M22 35.8 5.9 20.2C-3.8 10.7 9.3-3 19.1 6.5L22 9.4l2.9-2.9C34.7-3 47.8 10.7 38.1 20.2Z"
        fill="url(#birthdayElenaRsvpGem)"
        stroke="rgba(143,82,66,.62)"
        strokeWidth="1.15"
      />

      <path
        d="M7.8 13.1 19.2 7.7 15 20.6 22 34.1 26.2 20.6 36.2 12.9 24.8 8.1 22 10.9 19.2 8.1Z"
        fill="none"
        stroke="rgba(255,255,255,.48)"
        strokeWidth="1"
      />
    </svg>
  );
}

function OutlineHeart() {
  return (
    <svg
      className="birthday-elena-rsvp__outline-heart"
      viewBox="0 0 48 44"
      aria-hidden="true"
    >
      <path d="M24 39 6.9 22.5C-3.2 12.7 10.4-1.4 20.6 8.4L24 11.7l3.4-3.3c10.2-9.8 23.8 4.3 13.7 14.1Z" />
    </svg>
  );
}

function Ornament() {
  return (
    <div
      className="birthday-elena-rsvp__ornament"
      aria-hidden="true"
    >
      <span />
      <GemHeart />
      <span />
    </div>
  );
}

function BirthdayElenaRSVP({
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

  const isCyrillic =
    activeScript === "cyrillic";

  const name =
    brideName ||
    (isCyrillic ? "Елена" : "Elena");

  const possessiveName = getPossessiveName(
    name,
    isCyrillic
  );

  const text = isCyrillic
    ? {
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

        heading:
          "ПОТВРДА ДОЛАСКА",
        defaultDeadline:
          "Молимо вас да потврдите долазак.",
        fullNameLabel:
          "Име и презиме",
        fullNamePlaceholder:
          "Унесите име и презиме",
        attendingYes:
          "ДОЛАЗИМ",
        attendingNo:
          "НЕ МОГУ ДА ДОЂЕМ",
        guestsLabel:
          "Број гостију",
        decreaseGuests:
          "Смањи број гостију",
        increaseGuests:
          "Повећај број гостију",
        submit:
          "ПОТВРДИ",
        sending:
          "СЛАЊЕ...",
        successTitle:
          "Хвала!",
        successText:
          "Ваша потврда је успешно послата.",
        successNote:
          `Радујемо се да заједно прославимо ${possessiveName} рођендан.`,
      }
    : {
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

        heading:
          "POTVRDA DOLASKA",
        defaultDeadline:
          "Molimo vas da potvrdite dolazak.",
        fullNameLabel:
          "Ime i prezime",
        fullNamePlaceholder:
          "Unesite ime i prezime",
        attendingYes:
          "DOLAZIM",
        attendingNo:
          "NE MOGU DA DOĐEM",
        guestsLabel:
          "Broj gostiju",
        decreaseGuests:
          "Smanji broj gostiju",
        increaseGuests:
          "Povećaj broj gostiju",
        submit:
          "POTVRDI",
        sending:
          "SLANJE...",
        successTitle:
          "Hvala!",
        successText:
          "Vaša potvrda je uspešno poslata.",
        successNote:
          `Radujemo se da zajedno proslavimo ${possessiveName} rođendan.`,
      };

  const deadlineText =
    details?.rsvpText ||
    details?.note ||
    text.defaultDeadline;

  const rsvpBackground =
    details?.rsvpImage ||
    details?.rsvpBackgroundImage ||
    backgroundImage ||
    details?.cardBackground ||
    details?.birthdayIntro?.backgroundImage ||
    "/images/elena-intro/elena-rsvp-background.webp";

  const maxGuests = useMemo(() => {
    const configuredMax = Number(
      details?.rsvpMaxGuests
    );

    if (
      Number.isFinite(configuredMax) &&
      configuredMax >= 1
    ) {
      return configuredMax;
    }

    return 10;
  }, [details?.rsvpMaxGuests]);

  const inputId =
    `birthday-elena-rsvp-name-${slug || "event"}`;

  const [formData, setFormData] = useState({
    fullName: "",
    attending: "",
    guests: 1,
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
        guests: 1,
      });
    }, 3500);

    return () => clearTimeout(timer);
  }, [submitted]);

  const handleFullNameChange = (event) => {
    setFormData((previousData) => ({
      ...previousData,
      fullName: event.target.value,
    }));
  };

  const handleAttendanceSelect = (value) => {
    setFormData((previousData) => ({
      ...previousData,
      attending: value,
      guests:
        value === "da"
          ? Math.max(
              1,
              Number(previousData.guests) || 1
            )
          : 1,
    }));
  };

  const changeGuestCount = (difference) => {
    setFormData((previousData) => {
      const currentGuests =
        Number(previousData.guests) || 1;

      const nextGuests = Math.min(
        maxGuests,
        Math.max(
          1,
          currentGuests + difference
        )
      );

      return {
        ...previousData,
        guests: nextGuests,
      };
    });
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

    const guestsCount =
      Number(formData.guests);

    if (
      formData.attending === "da" &&
      (
        Number.isNaN(guestsCount) ||
        guestsCount < 1 ||
        guestsCount > maxGuests
      )
    ) {
      alert(text.invalidGuests);
      return;
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
        "Greška pri slanju potvrde dolaska:",
        error
      );

      alert(text.sendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      className={[
        "birthday-elena-rsvp",
        slug
          ? `birthday-elena-rsvp--${slug}`
          : "",
        isCyrillic
          ? "birthday-elena-rsvp--cyrillic"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
      lang={
        isCyrillic
          ? "sr-Cyrl"
          : "sr-Latn"
      }
      style={{
        "--birthday-elena-rsvp-bg":
          `url("${rsvpBackground}")`,
      }}
      initial={{
        opacity: 0,
      }}
      whileInView={{
        opacity: 1,
      }}
      viewport={{
        once: true,
        amount: 0.08,
      }}
      transition={{
        duration: 0.7,
      }}
    >
      <div className="birthday-elena-rsvp__stage">
        <div className="birthday-elena-rsvp__background" />
        <div className="birthday-elena-rsvp__overlay" />

        <div className="birthday-elena-rsvp__content">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                className="birthday-elena-rsvp__success"
                initial={{
                  opacity: 0,
                  y: 14,
                  scale: 0.97,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <GemHeart className="birthday-elena-rsvp__success-gem" />

                <h2>
                  {text.successTitle}
                </h2>

                <p>
                  {text.successText}
                </p>

                <span>
                  {text.successNote}
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                className="birthday-elena-rsvp__panel"
                initial={{
                  opacity: 0,
                  y: 18,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                }}
                transition={{
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <h2 className="birthday-elena-rsvp__title">
                  {text.heading}
                </h2>

                <Ornament />

                <p className="birthday-elena-rsvp__deadline">
                  {deadlineText}
                </p>

                <form
                  className="birthday-elena-rsvp__form"
                  onSubmit={handleSubmit}
                >
                  <div className="birthday-elena-rsvp__name-field">
                    <label htmlFor={inputId}>
                      {text.fullNameLabel}
                    </label>

                    <input
                      id={inputId}
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleFullNameChange}
                      placeholder={text.fullNamePlaceholder}
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div className="birthday-elena-rsvp__choices">
                    <button
                      type="button"
                      className={[
                        "birthday-elena-rsvp__choice",
                        formData.attending === "da"
                          ? "is-active"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      aria-pressed={
                        formData.attending === "da"
                      }
                      onClick={() =>
                        handleAttendanceSelect("da")
                      }
                    >
                      <GemHeart />

                      <span>
                        {text.attendingYes}
                      </span>
                    </button>

                    <button
                      type="button"
                      className={[
                        "birthday-elena-rsvp__choice",
                        "birthday-elena-rsvp__choice--no",
                        formData.attending === "ne"
                          ? "is-active"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      aria-pressed={
                        formData.attending === "ne"
                      }
                      onClick={() =>
                        handleAttendanceSelect("ne")
                      }
                    >
                      <OutlineHeart />

                      <span>
                        {text.attendingNo}
                      </span>
                    </button>
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
                        className="birthday-elena-rsvp__guests"
                        initial={{
                          opacity: 0,
                          height: 0,
                          y: 8,
                        }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          height: 0,
                          y: -6,
                        }}
                        transition={{
                          duration: 0.28,
                        }}
                      >
                        <Ornament />

                        <p>
                          {text.guestsLabel}
                        </p>

                        <div className="birthday-elena-rsvp__stepper">
                          <button
                            type="button"
                            aria-label={
                              text.decreaseGuests
                            }
                            onClick={() =>
                              changeGuestCount(-1)
                            }
                            disabled={
                              formData.guests <= 1
                            }
                          >
                            −
                          </button>

                          <output
                            aria-live="polite"
                            aria-label={
                              text.guestsLabel
                            }
                          >
                            {formData.guests}
                          </output>

                          <button
                            type="button"
                            aria-label={
                              text.increaseGuests
                            }
                            onClick={() =>
                              changeGuestCount(1)
                            }
                            disabled={
                              formData.guests >=
                              maxGuests
                            }
                          >
                            +
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    className="birthday-elena-rsvp__submit"
                    disabled={loading}
                  >
                    <GemHeart />

                    <span>
                      {loading
                        ? text.sending
                        : text.submit}
                    </span>
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

export default BirthdayElenaRSVP;