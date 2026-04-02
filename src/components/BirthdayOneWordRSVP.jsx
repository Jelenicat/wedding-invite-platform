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

function BirthdayOneWordRSVP({
  slug,
  eventType,
  brideName,
  details = {},
  backgroundImage,
}) {
  const name = brideName || "Nina";

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
      alert("Nedostaje slug ili tip događaja.");
      return;
    }

    if (!formData.fullName.trim()) {
      alert("Unesite ime i prezime.");
      return;
    }

    if (!formData.attending) {
      alert("Izaberite da li dolazite.");
      return;
    }

    const guestsCount = Number(formData.guests);

    if (formData.attending === "da") {
      if (!formData.guests || Number.isNaN(guestsCount) || guestsCount < 1) {
        alert("Unesite ispravan broj osoba.");
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
      alert("Došlo je do greške pri slanju.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      className="birthday-one-word-rsvp-section"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.15 }}
      style={
        backgroundImage
          ? { "--birthday-one-word-rsvp-bg": `url(${backgroundImage})` }
          : undefined
      }
    >
      <div className="birthday-one-word-rsvp-bg-image" />
      <div className="birthday-one-word-rsvp-overlay" />

      <div className="birthday-one-word-rsvp-shell">
        <div className="birthday-one-word-rsvp-card">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                className="birthday-one-word-rsvp-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="birthday-one-word-rsvp-success-heart"
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
                  Hvala!
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.45 }}
                >
                  Vaša potvrda je uspešno poslata.
                </motion.p>

                <div className="birthday-one-word-confetti-wrap">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <motion.span
                      key={i}
                      className="birthday-one-word-confetti"
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
                <p className="birthday-one-word-rsvp-kicker">RSVP</p>

                <h2 className="birthday-one-word-rsvp-title">
                  Potvrdite dolazak
                </h2>

                <p className="birthday-one-word-rsvp-subtitle">
                  Radovaćemo se da zajedno proslavimo {name}in rođendan.
                </p>

                {details?.note && (
                  <div className="birthday-one-word-rsvp-note">
                    {details.note}
                  </div>
                )}

                <div className="birthday-one-word-rsvp-divider" />

                <form
                  className="birthday-one-word-rsvp-form"
                  onSubmit={handleSubmit}
                >
                  <div className="birthday-one-word-rsvp-field">
                    <label htmlFor="birthday-one-word-fullName">
                      Ime i prezime
                    </label>
                    <input
                      id="birthday-one-word-fullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Unesite ime i prezime"
                      required
                    />
                  </div>

                  <div className="birthday-one-word-rsvp-choice-block">
                    <p className="birthday-one-word-rsvp-choice-label">
                      Da li dolazite?
                    </p>

                    <div className="birthday-one-word-rsvp-choice-grid">
                      <button
                        type="button"
                        className={`birthday-one-word-choice-card ${
                          formData.attending === "da" ? "is-active" : ""
                        }`}
                        onClick={() => handleAttendanceSelect("da")}
                      >
                        <span className="birthday-one-word-choice-title">
                          Dolazim
                        </span>
                        <span className="birthday-one-word-choice-text">
                          Biće mi zadovoljstvo
                        </span>
                      </button>

                      <button
                        type="button"
                        className={`birthday-one-word-choice-card ${
                          formData.attending === "ne" ? "is-active" : ""
                        }`}
                        onClick={() => handleAttendanceSelect("ne")}
                      >
                        <span className="birthday-one-word-choice-title">
                          Ne dolazim
                        </span>
                        <span className="birthday-one-word-choice-text">
                          Nažalost nisam u mogućnosti
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
                        className="birthday-one-word-rsvp-field"
                        initial={{ opacity: 0, height: 0, y: 6 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -4 }}
                        transition={{ duration: 0.25 }}
                      >
                        <label htmlFor="birthday-one-word-guests">
                          Broj osoba
                        </label>
                        <input
                          id="birthday-one-word-guests"
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
                    className="birthday-one-word-rsvp-button"
                    disabled={loading}
                  >
                    {loading ? "Slanje..." : "Pošalji potvrdu"}
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

export default BirthdayOneWordRSVP;