import { useState } from "react";
import { motion } from "framer-motion";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import "../styles/rsvp.css";

function SplitImageRSVP({ slug, eventType }) {
  const [formData, setFormData] = useState({
    fullName: "",
    attending: "",
    guests: "1",
  });

  const [loading, setLoading] = useState(false);

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
      // 🔥 kreira parent event ako ne postoji
      await setDoc(
        doc(db, "events", slug),
        {
          slug,
          eventType,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // 🔥 upis u novu strukturu
      await addDoc(collection(db, "events", slug, "rsvps"), {
        eventType,
        fullName: formData.fullName.trim(),
        attending: formData.attending,
        guests: formData.attending === "da" ? guestsCount : 0,
        createdAt: serverTimestamp(),
      });

      alert("Uspešno poslato!");

      setFormData({
        fullName: "",
        attending: "",
        guests: "1",
      });
    } catch (error) {
      console.error("Greška pri slanju RSVP:", error);
      alert("Došlo je do greške pri slanju.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      className="split-image-rsvp-section"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="split-image-rsvp-shell">
        <div className="split-image-rsvp-box">
          <p className="split-image-rsvp-kicker">RSVP</p>

          <h2 className="split-image-rsvp-title">Potvrdite dolazak</h2>

          <p className="split-image-rsvp-subtitle">
            Biće nam veliko zadovoljstvo da svojim prisustvom ulepšate naš
            poseban dan.
          </p>

          <div className="split-image-rsvp-divider" />

          <form className="split-image-rsvp-form" onSubmit={handleSubmit}>
            <div className="split-image-rsvp-field">
              <label htmlFor="split-image-fullName">Ime i prezime</label>
              <input
                id="split-image-fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Unesite ime i prezime"
                required
              />
            </div>

            <div className="split-image-rsvp-choice-block">
              <p className="split-image-rsvp-choice-label">Da li dolazite?</p>

              <div className="split-image-rsvp-choice-grid">
                <button
                  type="button"
                  className={`split-image-choice-card ${
                    formData.attending === "da" ? "is-active" : ""
                  }`}
                  onClick={() => handleAttendanceSelect("da")}
                >
                  <span className="split-image-choice-title">Dolazim</span>
                  <span className="split-image-choice-text">
                    Radujem se što slavim sa vama
                  </span>
                </button>

                <button
                  type="button"
                  className={`split-image-choice-card ${
                    formData.attending === "ne" ? "is-active" : ""
                  }`}
                  onClick={() => handleAttendanceSelect("ne")}
                >
                  <span className="split-image-choice-title">Ne dolazim</span>
                  <span className="split-image-choice-text">
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
              <div className="split-image-rsvp-field">
                <label htmlFor="split-image-guests">Broj osoba</label>
                <input
                  id="split-image-guests"
                  type="number"
                  name="guests"
                  min="1"
                  max="10"
                  value={formData.guests}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="split-image-rsvp-button"
              disabled={loading}
            >
              {loading ? "Slanje..." : "Pošalji potvrdu"}
            </button>
          </form>
        </div>
      </div>
    </motion.section>
  );
}

export default SplitImageRSVP;