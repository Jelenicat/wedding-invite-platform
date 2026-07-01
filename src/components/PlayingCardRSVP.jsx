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

function getInitial(value = "") {
  const cleanValue = String(value).trim();
  if (!cleanValue) return "";
  return Array.from(cleanValue)[0].toUpperCase();
}

function PlayingCardRSVP({
  slug,
  eventType,
  brideName,
  groomName,
  details = {},
  script = "latin",
}) {
  const isCyrillic = script === "cyrillic";

  const brideInitial = getInitial(brideName || "Jelisaveta");
  const groomInitial = getInitial(groomName || "Luka");

  const t = isCyrillic
    ? {
        missingSlug: "Недостаје slug или тип догађаја.",
        enterName: "Унесите име и презиме.",
        chooseAttendance: "Изаберите да ли долазите.",
        invalidGuests: "Унесите исправан број особа.",
        submitError: "Дошло је до грешке при слању.",
        thanks: "Хвала!",
        success: "Ваша потврда је успешно послата.",
        kicker: "RSVP",
        title: "Потврдите долазак",
        subtitle:
          "Биће нам велико задовољство да будете део нашег посебног дана.",
        fullName: "Име и презиме",
        fullNamePlaceholder: "Унесите име и презиме",
        attendance: "Да ли долазите?",
        yes: "Долазим",
        yesText: "Са радошћу славим са вама",
        no: "Не долазим",
        noText: "Нажалост нисам у могућности",
        guests: "Број особа",
        sending: "Слање...",
        submit: "Пошаљи потврду",
      }
    : {
        missingSlug: "Nedostaje slug ili tip događaja.",
        enterName: "Unesite ime i prezime.",
        chooseAttendance: "Izaberite da li dolazite.",
        invalidGuests: "Unesite ispravan broj osoba.",
        submitError: "Došlo je do greške pri slanju.",
        thanks: "Hvala!",
        success: "Vaša potvrda je uspešno poslata.",
        kicker: "RSVP",
        title: "Potvrdite dolazak",
        subtitle:
          "Biće nam veliko zadovoljstvo da budete deo našeg posebnog dana.",
        fullName: "Ime i prezime",
        fullNamePlaceholder: "Unesite ime i prezime",
        attendance: "Da li dolazite?",
        yes: "Dolazim",
        yesText: "Sa radošću slavimo sa vama",
        no: "Ne dolazim",
        noText: "Nažalost nisam u mogućnosti",
        guests: "Broj osoba",
        sending: "Slanje...",
        submit: "Pošalji potvrdu",
      };

  const [formData, setFormData] = useState({
    fullName: "",
    attending: "",
    guests: "1",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!submitted) return;

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
    const { name, value } = event.target;

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
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!slug || !eventType) {
      alert(t.missingSlug);
      return;
    }

    if (!formData.fullName.trim()) {
      alert(t.enterName);
      return;
    }

    if (!formData.attending) {
      alert(t.chooseAttendance);
      return;
    }

    const guestsCount = Number(formData.guests);

    if (formData.attending === "da") {
      if (!formData.guests || Number.isNaN(guestsCount) || guestsCount < 1) {
        alert(t.invalidGuests);
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
        { merge: true }
      );

      await addDoc(collection(db, "events", slug, "rsvps"), {
        eventType,
        fullName: formData.fullName.trim(),
        attending: formData.attending,
        guests: formData.attending === "da" ? guestsCount : 0,
        createdAt: serverTimestamp(),
      });

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
      className={`pc-rsvp-section pc-rsvp-slug-${slug || ""}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="pc-rsvp-shell">
        <motion.div
          className="pc-rsvp-card"
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.08 }}
          viewport={{ once: true }}
        >
          <div className="pc-rsvp-frame" />

          <div className="pc-rsvp-corner pc-rsvp-corner-top">
            <span>{brideInitial}</span>
            <small>♥</small>
          </div>

          <div className="pc-rsvp-corner pc-rsvp-corner-bottom">
            <span>{groomInitial}</span>
            <small>♥</small>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                className="pc-rsvp-success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="pc-rsvp-success-heart"
                  initial={{ scale: 0, rotate: -12 }}
                  animate={{ scale: [0, 1.18, 1], rotate: [0, 6, -6, 0] }}
                  transition={{ duration: 0.85 }}
                >
                  ♥
                </motion.div>

                <h3>{t.thanks}</h3>
                <p>{t.success}</p>

                <div className="pc-rsvp-confetti">
                  {Array.from({ length: 20 }).map((_, index) => (
                    <motion.span
                      key={index}
                      initial={{
                        opacity: 0,
                        y: 0,
                        x: 0,
                        scale: 0.6,
                      }}
                      animate={{
                        opacity: [0, 1, 1, 0],
                        y: 90 + (index % 5) * 8,
                        x: (index - 10) * 9,
                        scale: [0.6, 1, 0.8],
                        rotate: [0, 120, 240],
                      }}
                      transition={{
                        duration: 1.45,
                        delay: index * 0.035,
                        ease: "easeOut",
                      }}
                    >
                      ♥
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                className="pc-rsvp-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="pc-rsvp-kicker">{t.kicker}</p>

                <div className="pc-rsvp-hearts">
                  <span>♥</span>
                  <span>♥</span>
                  <span>♥</span>
                </div>

                <h2>{t.title}</h2>

                <p className="pc-rsvp-subtitle">{t.subtitle}</p>

                <form className="pc-rsvp-form" onSubmit={handleSubmit}>
                  <div className="pc-rsvp-field">
                    <label htmlFor="pc-rsvp-fullName">{t.fullName}</label>
                    <input
                      id="pc-rsvp-fullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder={t.fullNamePlaceholder}
                      required
                    />
                  </div>

                  <div className="pc-rsvp-choice-block">
                    <p>{t.attendance}</p>

                    <div className="pc-rsvp-choice-grid">
                      <button
                        type="button"
                        className={`pc-rsvp-choice ${
                          formData.attending === "da" ? "is-active" : ""
                        }`}
                        onClick={() => handleAttendanceSelect("da")}
                      >
                        <strong>{t.yes}</strong>
                        <span>{t.yesText}</span>
                      </button>

                      <button
                        type="button"
                        className={`pc-rsvp-choice ${
                          formData.attending === "ne" ? "is-active" : ""
                        }`}
                        onClick={() => handleAttendanceSelect("ne")}
                      >
                        <strong>{t.no}</strong>
                        <span>{t.noText}</span>
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
                        className="pc-rsvp-field"
                        initial={{ opacity: 0, height: 0, y: 8 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                      >
                        <label htmlFor="pc-rsvp-guests">{t.guests}</label>
                        <input
                          id="pc-rsvp-guests"
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
                    className="pc-rsvp-submit"
                    disabled={loading}
                  >
                    <span>♥</span>
                    {loading ? t.sending : t.submit}
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

export default PlayingCardRSVP;