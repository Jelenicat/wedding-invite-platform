import { useState } from "react";
import { motion } from "framer-motion";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/rsvp.css";

function FloralRSVP({ slug, eventType }) {
  const [formData, setFormData] = useState({
    fullName: "",
    attending: "",
    guests: "1", // 🔥 STRING
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value, // 🔥 nema Number
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

    const guestsCount = Number(formData.guests);

    if (formData.attending === "da") {
      if (!formData.guests || Number.isNaN(guestsCount) || guestsCount < 1) {
        alert("Unesite ispravan broj osoba.");
        return;
      }
    }

    setLoading(true);

    try {
      const payload = {
        slug,
        eventType,
        fullName: formData.fullName.trim(),
        attending: formData.attending,
        guests: formData.attending === "da" ? guestsCount : 0,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "rsvps"), payload);

      alert("Uspešno poslato!");

      setFormData({
        fullName: "",
        attending: "",
        guests: "1", // 🔥 reset string
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
      className="floral-rsvp-section"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="floral-rsvp-shell">
        <div className="floral-rsvp-box">
          <p className="floral-rsvp-kicker">RSVP</p>

          <h2 className="floral-rsvp-title">Potvrdite dolazak</h2>

          <p className="floral-rsvp-subtitle">
            Biće nam veliko zadovoljstvo da svojim prisustvom ulepšate naš
            poseban dan.
          </p>

          <div className="floral-rsvp-divider" />

          <form className="floral-rsvp-form" onSubmit={handleSubmit}>
            <div className="floral-rsvp-field">
              <label htmlFor="floral-fullName">Ime i prezime</label>
              <input
                id="floral-fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Unesite ime i prezime"
                required
              />
            </div>

            <div className="floral-rsvp-choice-block">
              <p className="floral-rsvp-choice-label">Da li dolazite?</p>

              <div className="floral-rsvp-choice-grid">
                <button
                  type="button"
                  className={`floral-choice-card ${
                    formData.attending === "da" ? "is-active" : ""
                  }`}
                  onClick={() => handleAttendanceSelect("da")}
                >
                  <span className="floral-choice-title">Dolazim</span>
                  <span className="floral-choice-text">
                    Radujem se što slavim sa vama
                  </span>
                </button>

                <button
                  type="button"
                  className={`floral-choice-card ${
                    formData.attending === "ne" ? "is-active" : ""
                  }`}
                  onClick={() => handleAttendanceSelect("ne")}
                >
                  <span className="floral-choice-title">Ne dolazim</span>
                  <span className="floral-choice-text">
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
              <div className="floral-rsvp-field">
                <label htmlFor="floral-guests">Broj osoba</label>
                <input
                  id="floral-guests"
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
              className="floral-rsvp-button"
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

export default FloralRSVP;