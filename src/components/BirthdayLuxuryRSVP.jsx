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
import "../styles/birthdayrsvp.css";

function BirthdayLuxuryRSVP({
  slug,
  eventType = "birthday",
  details = {},
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    attending: "",
    guests: "1",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const rsvpSignature = details.rsvpSignature || "Đorđe Krušić";

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
      alert("Došlo je do greške pri slanju potvrde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      className="blux-rsvp-section"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <div className="blux-rsvp-bg-glow blux-rsvp-bg-glow-1" />
      <div className="blux-rsvp-bg-glow blux-rsvp-bg-glow-2" />

      <div className="blux-rsvp-shell">
        <div className="blux-rsvp-box">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                className="blux-rsvp-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="blux-rsvp-success-icon"
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: [0, 1.18, 1], rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 0.85 }}
                >
                  ✦
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

                <div className="blux-rsvp-confetti-wrap">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <motion.span
                      key={i}
                      className="blux-rsvp-confetti"
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
                <p className="blux-rsvp-kicker">RSVP</p>

                <h2 className="blux-rsvp-title">Potvrdite dolazak</h2>

                <p className="blux-rsvp-subtitle">
                  Biće nam drago da zajedno proslavimo ovaj poseban dan.
                </p>

                <p className="blux-rsvp-signature">{rsvpSignature}</p>

                {details.rsvpDeadline && (
                  <p className="blux-rsvp-deadline">
                    Potvrda dolaska do {details.rsvpDeadline}
                  </p>
                )}

                <div className="blux-rsvp-divider" />

                <form className="blux-rsvp-form" onSubmit={handleSubmit}>
                  <div className="blux-rsvp-field">
                    <label htmlFor="blux-fullName">Ime i prezime</label>
                    <input
                      id="blux-fullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Unesite ime i prezime"
                      required
                    />
                  </div>

                  <div className="blux-rsvp-choice-block">
                    <p className="blux-rsvp-choice-label">Da li dolazite?</p>

                    <div className="blux-rsvp-choice-grid">
                      <button
                        type="button"
                        className={`blux-choice-card ${
                          formData.attending === "da" ? "is-active" : ""
                        }`}
                        onClick={() => handleAttendanceSelect("da")}
                      >
                        <span className="blux-choice-title">Dolazim</span>
                        <span className="blux-choice-text">
                          Broj osoba za koje potvrđujem dolazak
                        </span>
                      </button>

                      <button
                        type="button"
                        className={`blux-choice-card ${
                          formData.attending === "ne" ? "is-active" : ""
                        }`}
                        onClick={() => handleAttendanceSelect("ne")}
                      >
                        <span className="blux-choice-title">Ne dolazim</span>
                        <span className="blux-choice-text">
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

                  {formData.attending === "da" && (
                    <motion.div
                      className="blux-rsvp-field"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      <label htmlFor="blux-guests">
                        Broj osoba za koje potvrđujem dolazak
                      </label>
                      <input
                        id="blux-guests"
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
                    className="blux-rsvp-button"
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

export default BirthdayLuxuryRSVP;