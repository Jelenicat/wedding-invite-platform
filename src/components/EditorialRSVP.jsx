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

export default function EditorialRSVP({
  slug,
  eventType,
  brideName,
  groomName,
}) {
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name === "attending") {
        return {
          ...prev,
          attending: value,
          guests: value === "da" ? prev.guests || "1" : "",
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
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
    <section className="editorial-rsvp-section">
      <motion.div
        className="editorial-rsvp-card"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="editorial-rsvp-title">POTVRDA DOLASKA</h2>
        <div className="editorial-rsvp-script">potvrdite prisustvo</div>

        <p className="editorial-rsvp-text">
          Molimo vas da potvrdite dolazak na proslavu
          <br />
          {brideName} & {groomName}
        </p>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              className="editorial-rsvp-success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
            >
              <h3>Hvala 💌</h3>
              <p>Vaša potvrda je uspešno poslata.</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              className="editorial-rsvp-form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <input
                type="text"
                name="fullName"
                placeholder="Ime i prezime"
                value={formData.fullName}
                onChange={handleChange}
                className="editorial-rsvp-input"
                required
              />

              <div className="editorial-rsvp-options">
                <label className="editorial-rsvp-option">
                  <input
                    type="radio"
                    name="attending"
                    value="da"
                    checked={formData.attending === "da"}
                    onChange={handleChange}
                    required
                  />
                  <span>Dolazim</span>
                </label>

                <label className="editorial-rsvp-option">
                  <input
                    type="radio"
                    name="attending"
                    value="ne"
                    checked={formData.attending === "ne"}
                    onChange={handleChange}
                    required
                  />
                  <span>Ne dolazim</span>
                </label>
              </div>

              {formData.attending === "da" && (
                <div className="editorial-rsvp-field">
                  <label className="editorial-rsvp-label" htmlFor="guests">
                    Broj gostiju
                  </label>

                  <input
                    id="guests"
                    type="number"
                    name="guests"
                    min="1"
                    max="10"
                    value={formData.guests}
                    onChange={handleChange}
                    className="editorial-rsvp-input"
                    placeholder="Unesite broj gostiju"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="editorial-rsvp-button"
                disabled={loading}
              >
                {loading ? "Slanje..." : "Pošalji potvrdu"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}