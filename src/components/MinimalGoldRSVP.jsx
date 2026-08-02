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

function MinimalGoldRSVP({
  slug,
  eventType,
  brideName,
  groomName,
  details,
  script = "latin",
}) {
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
          deadline: "Потврда доласка до 28.9.2026.",
          contact: "Контакт: 097 685 1599",
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
          chooseAttendance: "Odaberite dolazite li.",
          invalidGuests: "Unesite ispravan broj osoba.",
          submitError: "Došlo je do pogreške prilikom slanja.",
          thanks: "Hvala!",
          success: "Vaša potvrda je uspješno poslana.",
          title: "Potvrdite dolazak",
          subtitle:
            "Bit će nam veliko zadovoljstvo ako svojim prisustvom uveličate naš poseban dan.",
          deadline: "Potvrda dolaska do 28.9.2026.",
          contact: "Kontakt: 097 685 1599",
          fullName: "Ime i prezime (navedite imena svih koji dolaze)",
          fullNamePlaceholder: "Unesite ime i prezime",
          attendance: "Dolazite li?",
          yes: "Dolazim",
          yesText: "Radujem se slavlju s vama",
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
      className="minimal-rsvp-section minimal-gold-rsvp-theme"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="minimal-rsvp-shell">
        <motion.div
          className="minimal-rsvp-box"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          viewport={{ once: true }}
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                className="minimal-rsvp-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="minimal-rsvp-success-heart"
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
                <p className="minimal-rsvp-kicker">RSVP</p>

                <h2 className="minimal-rsvp-title">{t.title}</h2>

                <p className="minimal-rsvp-subtitle">{t.subtitle}</p>

                <p className="minimal-gold-rsvp-deadline">
                  {t.deadline}
                  <br />
                  {t.contact}
                </p>

                <div className="minimal-rsvp-divider" />

                <form className="minimal-rsvp-form" onSubmit={handleSubmit}>
                  <div className="minimal-rsvp-field">
                    <label htmlFor="minimal-gold-fullName">
                      {t.fullName}
                    </label>

                    <input
                      id="minimal-gold-fullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder={t.fullNamePlaceholder}
                      required
                    />
                  </div>

                  <div className="minimal-rsvp-choice-block">
                    <p className="minimal-rsvp-choice-label">
                      {t.attendance}
                    </p>

                    <div className="minimal-rsvp-choice-grid">
                      <button
                        type="button"
                        className={`minimal-choice-card ${
                          formData.attending === "da" ? "is-active" : ""
                        }`}
                        onClick={() => handleAttendanceSelect("da")}
                      >
                        <span className="minimal-choice-title">{t.yes}</span>
                        <span className="minimal-choice-text">
                          {t.yesText}
                        </span>
                      </button>

                      <button
                        type="button"
                        className={`minimal-choice-card ${
                          formData.attending === "ne" ? "is-active" : ""
                        }`}
                        onClick={() => handleAttendanceSelect("ne")}
                      >
                        <span className="minimal-choice-title">{t.no}</span>
                        <span className="minimal-choice-text">{t.noText}</span>
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
                        className="minimal-rsvp-field"
                        initial={{ opacity: 0, height: 0, y: 6 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -4 }}
                        transition={{ duration: 0.25 }}
                      >
                        <label htmlFor="minimal-gold-guests">
                          {t.guests}
                        </label>

                        <input
                          id="minimal-gold-guests"
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
      </div>
    </motion.section>
  );
}

export default MinimalGoldRSVP;