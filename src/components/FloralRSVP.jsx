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

function FloralRSVP({ slug, eventType }) {
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

    if (!slug || !eventType) return;
    if (!formData.fullName.trim()) return;
    if (!formData.attending) return;

    const guestsCount = Number(formData.guests);

    if (formData.attending === "da") {
      if (!formData.guests || Number.isNaN(guestsCount) || guestsCount < 1) {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      className="floral-rsvp-section"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="floral-rsvp-shell">
        <div className="floral-rsvp-box">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                className="floral-rsvp-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="floral-rsvp-success-heart"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.8 }}
                >
                  💌
                </motion.div>

                <h3>Hvala 💌</h3>
                <p>Vaša potvrda je uspešno poslata.</p>

                <div className="floral-confetti-wrap">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <motion.span
                      key={i}
                      className="floral-confetti"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: [0, 1, 1, 0],
                        y: 110,
                        x: (i - 9) * 10,
                      }}
                      transition={{
                        duration: 1.6,
                        delay: i * 0.04,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <>
                <p className="floral-rsvp-kicker">RSVP</p>

                <h2 className="floral-rsvp-title">Potvrdite dolazak</h2>

                <p className="floral-rsvp-subtitle">
                  Biće nam veliko zadovoljstvo da svojim prisustvom ulepšate naš
                  poseban dan.
                </p>

                <div className="floral-rsvp-divider" />

                <form className="floral-rsvp-form" onSubmit={handleSubmit}>
                  <div className="floral-rsvp-field">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Ime i prezime"
                    />
                  </div>

                  <div className="floral-rsvp-choice-grid">
                    <button
                      type="button"
                      className={`floral-choice-card ${
                        formData.attending === "da" ? "is-active" : ""
                      }`}
                      onClick={() => handleAttendanceSelect("da")}
                    >
                      Dolazim
                    </button>

                    <button
                      type="button"
                      className={`floral-choice-card ${
                        formData.attending === "ne" ? "is-active" : ""
                      }`}
                      onClick={() => handleAttendanceSelect("ne")}
                    >
                      Ne dolazim
                    </button>
                  </div>

                  {formData.attending === "da" && (
                    <input
                      type="number"
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      placeholder="Broj osoba"
                    />
                  )}

                  <button
                    type="submit"
                    className="floral-rsvp-button"
                    disabled={loading}
                  >
                    {loading ? "Slanje..." : "Pošalji"}
                  </button>
                </form>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}

export default FloralRSVP;