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

function PhotoScriptRSVP({ slug, eventType, script = "latin" }) {
  const [formData, setFormData] = useState({
    fullName: "",
    attending: "",
    guests: "1",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const t =
    script === "cyrillic"
      ? {
          missingSlug: "Недостаје slug или тип догађаја.",
          enterName: "Унесите име и презиме.",
          chooseAttendance: "Изаберите да ли долазите.",
          invalidGuests: "Унесите исправан број особа.",
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
          sending: "Slanje...",
          submit: "Pošalji potvrdu",
        };

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setSubmitted(false);
        setFormData({
          fullName: "",
          attending: "",
          guests: "1",
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [submitted]);

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
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      className="photo-script-rsvp-section"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="photo-script-rsvp-shell">
        <div className="photo-script-rsvp-box">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                className="photo-script-rsvp-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="photo-script-success-heart"
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: [0, 1.2, 1], rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 0.9 }}
                >
                  💌
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.45 }}
                >
                  {t.thanks}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.45 }}
                >
                  {t.success}
                </motion.p>

                <div className="photo-script-confetti-wrap">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <motion.span
                      key={i}
                      className="photo-script-confetti"
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
                <p className="photo-script-rsvp-kicker">RSVP</p>

                <h2 className="photo-script-rsvp-title">{t.title}</h2>

                <p className="photo-script-rsvp-subtitle">{t.subtitle}</p>

                <div className="photo-script-rsvp-divider" />

                <form className="photo-script-rsvp-form" onSubmit={handleSubmit}>
                  <div className="photo-script-rsvp-field">
                    <label htmlFor="photo-script-fullName">{t.fullName}</label>
                    <input
                      id="photo-script-fullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder={t.fullNamePlaceholder}
                      required
                    />
                  </div>

                  <div className="photo-script-rsvp-choice-block">
                    <p className="photo-script-rsvp-choice-label">
                      {t.attendance}
                    </p>

                    <div className="photo-script-rsvp-choice-grid">
                      <button
                        type="button"
                        className={`photo-script-choice-card ${
                          formData.attending === "da" ? "is-active" : ""
                        }`}
                        onClick={() => handleAttendanceSelect("da")}
                      >
                        <span className="photo-script-choice-title">
                          {t.yes}
                        </span>
                        <span className="photo-script-choice-text">
                          {t.yesText}
                        </span>
                      </button>

                      <button
                        type="button"
                        className={`photo-script-choice-card ${
                          formData.attending === "ne" ? "is-active" : ""
                        }`}
                        onClick={() => handleAttendanceSelect("ne")}
                      >
                        <span className="photo-script-choice-title">
                          {t.no}
                        </span>
                        <span className="photo-script-choice-text">
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

                  {formData.attending === "da" && (
                    <motion.div
                      className="photo-script-rsvp-field"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      <label htmlFor="photo-script-guests">{t.guests}</label>
                      <input
                        id="photo-script-guests"
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

                  <button
                    type="submit"
                    className="photo-script-rsvp-button"
                    disabled={loading}
                  >
                    {loading ? t.sending : t.submit}
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

export default PhotoScriptRSVP;