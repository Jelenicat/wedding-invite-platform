import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import "../styles/rsvp.css";

function MinimalRSVP({
  slug,
  eventType,
  brideName,
  groomName,
  details = {},
  script = "latin",
  language = "sr",
}) {
  const t =
    language === "de"
      ? {
          missingSlug: "Slug oder Veranstaltungstyp fehlt.",
          enterName: "Bitte gebt euren Vor- und Nachnamen ein.",
          chooseAttendance: "Bitte wählt aus, ob ihr teilnehmen werdet.",
          invalidGuests: "Bitte gebt eine gültige Anzahl an Gästen ein.",
          chooseFasting: "Bitte wählt aus, ob ihr fastet.",
          submitError: "Beim Senden eurer Rückmeldung ist ein Fehler aufgetreten.",
          thanks: "Vielen Dank!",
          success: "Eure Rückmeldung wurde erfolgreich gesendet.",
          title: "Teilnahme bestätigen",
          subtitle:
            "Wir würden uns sehr freuen, diesen besonderen Tag gemeinsam mit euch zu feiern.",
          fullName: "Vor- und Nachname",
          fullNamePlaceholder: "Vor- und Nachname eingeben",
          attendance: "Seid ihr dabei?",
          yes: "Wir sind dabei",
          yesText: "Wir freuen uns, mit euch zu feiern",
          no: "Wir sind nicht dabei",
          noText: "Leider können wir nicht kommen",
          guests: "Anzahl der Gäste",
          fasting: "Fastet ihr?",
          fastingYes: "Ja, wir fasten",
          fastingNo: "Nein, wir fasten nicht",
          sending: "Wird gesendet...",
          submit: "Antwort senden",
        }
      : language === "en"
        ? {
            missingSlug: "Missing slug or event type.",
            enterName: "Please enter your full name.",
            chooseAttendance: "Please choose whether you will attend.",
            invalidGuests: "Please enter a valid number of guests.",
            chooseFasting: "Please choose whether you are fasting.",
            submitError: "An error occurred while sending your RSVP.",
            thanks: "Thank you!",
            success: "Your RSVP has been sent successfully.",
            title: "Confirm your attendance",
            subtitle:
              "It would mean so much to us to have you with us on our special day.",
            fullName: "Full name",
            fullNamePlaceholder: "Enter your full name",
            attendance: "Will you attend?",
            yes: "Attending",
            yesText: "I’m happy to celebrate with you",
            no: "Not attending",
            noText: "Unfortunately, I can’t make it",
            guests: "Number of guests",
            fasting: "Are you fasting?",
            fastingYes: "Fasting",
            fastingNo: "Not fasting",
            sending: "Sending...",
            submit: "Send RSVP",
          }
        : script === "cyrillic"
        ? {
            missingSlug: "Недостаје slug или тип догађаја.",
            enterName: "Унесите име и презиме.",
            chooseAttendance: "Изаберите да ли долазите.",
            invalidGuests: "Унесите исправан број особа.",
            chooseFasting: "Изаберите да ли постите.",
            submitError: "Дошло је до грешке при слању.",
            thanks: "Хвала!",
            success: "Ваша потврда је успешно послата.",
            title: "Потврдите долазак",
            subtitle:
              "Биће нам велико задовољство да својим присуством улепшате наш посебан дан.",
            fullName: "Име и презиме",
            fullNamePlaceholder: "Унесите име и презиме",
            attendance: "Да ли долазите?",
            yes: "Долазим",
            yesText: "Радујем се што славим са вама",
            no: "Не долазим",
            noText: "Нажалост нисам у могућности",
            guests: "Број особа",
            fasting: "Да ли постите?",
            fastingYes: "Постим",
            fastingNo: "Не постим",
            sending: "Слање...",
            submit: "Пошаљи потврду",
          }
        : {
            missingSlug: "Nedostaje slug ili tip događaja.",
            enterName: "Unesite ime i prezime.",
            chooseAttendance: "Izaberite da li dolazite.",
            invalidGuests: "Unesite ispravan broj osoba.",
            chooseFasting: "Izaberite da li postite.",
            submitError: "Došlo je do greške pri slanju.",
            thanks: "Hvala!",
            success: "Vaša potvrda je uspešno poslata.",
            title: "Potvrdite dolazak",
            subtitle:
              "Biće nam veliko zadovoljstvo da svojim prisustvom ulepšate naš poseban dan.",
            fullName: "Ime i prezime",
            fullNamePlaceholder: "Unesite ime i prezime",
            attendance: "Da li dolazite?",
            yes: "Dolazim",
            yesText: "Radujem se što slavim sa vama",
            no: "Ne dolazim",
            noText: "Nažalost nisam u mogućnosti",
            guests: "Broj osoba",
            fasting: "Da li postite?",
            fastingYes: "Postim",
            fastingNo: "Ne postim",
            sending: "Slanje...",
            submit: "Pošalji potvrdu",
          };

  const rsvpOptions = details?.rsvpOptions || {};
  const showFastingOption = Boolean(rsvpOptions.fasting);

  // Samo za ovaj slug svaki gost se unosi posebno
  // i čuva kao poseban RSVP dokument sa guests: 1.
  const splitGuestsIntoIndividualRsvps =
    slug === "andjela-andrija-5";

  const individualGuestText =
    language === "de"
      ? {
          namesTitle: "Namen der Gäste",
          guestLabel: "Gast",
          guestPlaceholder: "Vor- und Nachname",
          missingGuestNames:
            "Bitte geben Sie den Vor- und Nachnamen jeder Person ein.",
        }
      : language === "en"
        ? {
            namesTitle: "Guest names",
            guestLabel: "Guest",
            guestPlaceholder: "Full name",
            missingGuestNames:
              "Please enter the full name of every guest.",
          }
        : script === "cyrillic"
          ? {
              namesTitle: "Имена гостију",
              guestLabel: "Гост",
              guestPlaceholder: "Име и презиме",
              missingGuestNames:
                "Унесите име и презиме за сваку особу.",
            }
          : {
              namesTitle: "Imena gostiju",
              guestLabel: "Gost",
              guestPlaceholder: "Ime i prezime",
              missingGuestNames:
                "Unesite ime i prezime za svaku osobu.",
            };

  const [formData, setFormData] = useState({
    fullName: "",
    attending: "",
    guests: "1",
    fasting: "",
  });

  const [guestNames, setGuestNames] = useState([""]);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setSubmitted(false);

        setFormData({
          fullName: "",
          attending: "",
          guests: "1",
          fasting: "",
        });

        setGuestNames([""]);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [submitted]);

  useEffect(() => {
    if (!splitGuestsIntoIndividualRsvps) return;

    if (formData.attending !== "da") {
      setGuestNames([""]);
      return;
    }

    const rawCount = Number(formData.guests);
    const guestCount =
      Number.isFinite(rawCount) && rawCount >= 1
        ? Math.min(rawCount, 10)
        : 1;

    setGuestNames((prev) =>
      Array.from(
        { length: guestCount },
        (_, index) => prev[index] || ""
      )
    );
  }, [
    splitGuestsIntoIndividualRsvps,
    formData.attending,
    formData.guests,
  ]);

  const handleGuestNameChange = (index, value) => {
    setGuestNames((prev) =>
      prev.map((name, currentIndex) =>
        currentIndex === index ? value : name
      )
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAttendanceSelect = (value) => {
    setFormData((prev) => ({
      ...prev,
      attending: value,
      guests: value === "da" ? prev.guests || "1" : "",
      fasting: value === "da" ? prev.fasting : "",
    }));

    if (
      splitGuestsIntoIndividualRsvps &&
      value !== "da"
    ) {
      setGuestNames([""]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!slug || !eventType) {
      alert(t.missingSlug);
      return;
    }

    if (
      !splitGuestsIntoIndividualRsvps &&
      !formData.fullName.trim()
    ) {
      alert(t.enterName);
      return;
    }

    if (!formData.attending) {
      alert(t.chooseAttendance);
      return;
    }

    const guestsCount = Number(formData.guests);

    if (formData.attending === "da") {
      if (
        !formData.guests ||
        Number.isNaN(guestsCount) ||
        guestsCount < 1
      ) {
        alert(t.invalidGuests);
        return;
      }

      if (splitGuestsIntoIndividualRsvps) {
        const namesForSubmission = guestNames
          .slice(0, guestsCount)
          .map((name) => name.trim());

        if (
          namesForSubmission.length !== guestsCount ||
          namesForSubmission.some((name) => !name)
        ) {
          alert(individualGuestText.missingGuestNames);
          return;
        }
      }

      if (showFastingOption && !formData.fasting) {
        alert(t.chooseFasting);
        return;
      }
    }

    if (
      splitGuestsIntoIndividualRsvps &&
      formData.attending === "ne" &&
      !formData.fullName.trim()
    ) {
      alert(t.enterName);
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
        { merge: true }
      );

      if (
        splitGuestsIntoIndividualRsvps &&
        formData.attending === "da"
      ) {
        const namesForSubmission = guestNames
          .slice(0, guestsCount)
          .map((name) => name.trim());

        // Jedna potvrda može imati više osoba, ali se svaka osoba
        // čuva kao poseban RSVP red sa guests: 1.
        const submissionGroupId = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 10)}`;

        await Promise.all(
          namesForSubmission.map((fullName) =>
            addDoc(
              collection(db, "events", slug, "rsvps"),
              {
                eventType,
                fullName,
                attending: "da",
                guests: 1,
                fasting: showFastingOption
                  ? formData.fasting
                  : "",
                submissionGroupId,
                createdAt: serverTimestamp(),
              }
            )
          )
        );
      } else {
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
            fasting:
              formData.attending === "da" &&
              showFastingOption
                ? formData.fasting
                : "",
            createdAt: serverTimestamp(),
          }
        );
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Greška pri slanju RSVP:", error);
      alert(t.submitError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      className={`minimal-rsvp-section minimal-rsvp-slug-${slug || ""}`}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
    >
      <div className="minimal-rsvp-shell">
        <motion.div
          className="minimal-rsvp-box"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.08,
          }}
          viewport={{ once: true }}
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                className="minimal-rsvp-success"
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
                  className="minimal-rsvp-success-heart"
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
                  {t.thanks}
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
                  {t.success}
                </motion.p>

                <div className="minimal-confetti-wrap">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <motion.span
                      key={i}
                      className="minimal-confetti"
                      initial={{
                        opacity: 0,
                        y: 0,
                        x: 0,
                        scale: 0.6,
                      }}
                      animate={{
                        opacity: [0, 1, 1, 0],
                        y: 110 + (i % 4) * 8,
                        x: (i - 9) * 10,
                        scale: [0.6, 1, 0.9],
                        rotate: [0, 120, 240],
                      }}
                      transition={{
                        duration: 1.6,
                        delay: i * 0.04,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
            {slug !== "andjela-andrija-5" && (
  <p className="minimal-rsvp-kicker">
    RSVP
  </p>
)}

                <h2 className="minimal-rsvp-title">
                  {t.title}
                </h2>

                <p className="minimal-rsvp-subtitle">
                  {t.subtitle}
                </p>

                <div className="minimal-rsvp-divider" />

                <form
                  className="minimal-rsvp-form"
                  onSubmit={handleSubmit}
                >
                  {!splitGuestsIntoIndividualRsvps && (
                    <div className="minimal-rsvp-field">
                      <label htmlFor="minimal-fullName">
                        {t.fullName}
                      </label>

                      <input
                        id="minimal-fullName"
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder={t.fullNamePlaceholder}
                        required
                      />
                    </div>
                  )}

                  <div className="minimal-rsvp-choice-block">
                    <p className="minimal-rsvp-choice-label">
                      {t.attendance}
                    </p>

                    <div className="minimal-rsvp-choice-grid">
                      <button
                        type="button"
                        className={`minimal-choice-card ${
                          formData.attending === "da"
                            ? "is-active"
                            : ""
                        }`}
                        onClick={() =>
                          handleAttendanceSelect("da")
                        }
                      >
                        <span className="minimal-choice-title">
                          {t.yes}
                        </span>

                        <span className="minimal-choice-text">
                          {t.yesText}
                        </span>
                      </button>

                      <button
                        type="button"
                        className={`minimal-choice-card ${
                          formData.attending === "ne"
                            ? "is-active"
                            : ""
                        }`}
                        onClick={() =>
                          handleAttendanceSelect("ne")
                        }
                      >
                        <span className="minimal-choice-title">
                          {t.no}
                        </span>

                        <span className="minimal-choice-text">
                          {t.noText}
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
                    {splitGuestsIntoIndividualRsvps &&
                      formData.attending === "ne" && (
                        <motion.div
                          className="minimal-rsvp-field"
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
                          <label htmlFor="minimal-fullName">
                            {t.fullName}
                          </label>

                          <input
                            id="minimal-fullName"
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder={t.fullNamePlaceholder}
                            required
                          />
                        </motion.div>
                      )}
                  </AnimatePresence>

                  <AnimatePresence initial={false}>
                    {formData.attending === "da" && (
                      <motion.div
                        className="minimal-rsvp-field"
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
                        <label htmlFor="minimal-guests">
                          {t.guests}
                        </label>

                        <input
                          id="minimal-guests"
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

                  <AnimatePresence initial={false}>
                    {splitGuestsIntoIndividualRsvps &&
                      formData.attending === "da" &&
                      Number(formData.guests) >= 1 && (
                        <motion.div
                          className="minimal-rsvp-guest-names"
                          key={`guest-names-${formData.guests}`}
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
                          <p className="minimal-rsvp-choice-label">
                            {individualGuestText.namesTitle}
                          </p>

                          {guestNames.map((guestName, index) => (
                            <div
                              className="minimal-rsvp-field"
                              key={`guest-name-${index}`}
                            >
                              <label
                                htmlFor={`minimal-guest-name-${index}`}
                              >
                                {individualGuestText.guestLabel}{" "}
                                {index + 1}
                              </label>

                              <input
                                id={`minimal-guest-name-${index}`}
                                type="text"
                                value={guestName}
                                onChange={(e) =>
                                  handleGuestNameChange(
                                    index,
                                    e.target.value
                                  )
                                }
                                placeholder={
                                  individualGuestText.guestPlaceholder
                                }
                                required
                              />
                            </div>
                          ))}
                        </motion.div>
                      )}
                  </AnimatePresence>

                  <AnimatePresence initial={false}>
                    {formData.attending === "da" &&
                      showFastingOption && (
                        <motion.div
                          className="minimal-rsvp-choice-block minimal-rsvp-fasting-block"
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
                          <p className="minimal-rsvp-choice-label">
                            {t.fasting}
                          </p>

                          <div className="minimal-rsvp-choice-grid">
                            <button
                              type="button"
                              className={`minimal-choice-card ${
                                formData.fasting === "posti"
                                  ? "is-active"
                                  : ""
                              }`}
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  fasting: "posti",
                                }))
                              }
                            >
                              <span className="minimal-choice-title">
                                {t.fastingYes}
                              </span>
                            </button>

                            <button
                              type="button"
                              className={`minimal-choice-card ${
                                formData.fasting === "ne_posti"
                                  ? "is-active"
                                  : ""
                              }`}
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  fasting: "ne_posti",
                                }))
                              }
                            >
                              <span className="minimal-choice-title">
                                {t.fastingNo}
                              </span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    className="minimal-rsvp-button"
                    disabled={loading}
                  >
                    {loading ? t.sending : t.submit}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {slug === "gordana-milos" &&
          details.rsvpImage && (
            <motion.div
              className="minimal-gordana-milos-rsvp-footer"
              initial={{
                opacity: 0,
                y: 24,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
            >
              {details.rsvpPhotoTitle && (
                <p className="minimal-gordana-milos-rsvp-quote">
                  {details.rsvpPhotoTitle}
                </p>
              )}

              <div className="minimal-gordana-milos-rsvp-image-frame">
                <img
                  src={details.rsvpImage}
                  alt={`${brideName} и ${groomName}`}
                  className="minimal-gordana-milos-rsvp-image"
                />
              </div>

              {details.rsvpPhotoText && (
                <p className="minimal-gordana-milos-rsvp-signature">
                  {details.rsvpPhotoText}
                </p>
              )}
            </motion.div>
          )}
      </div>
    </motion.section>
  );
}

export default MinimalRSVP;