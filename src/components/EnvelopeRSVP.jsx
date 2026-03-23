import { useState } from "react";
import { motion } from "framer-motion";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/rsvp.css";

function EnvelopeRSVP({ slug, eventType }) {
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
      className="envelope-rsvp-section"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="envelope-rsvp-shell">
        <div className="envelope-rsvp-box">
          <div className="envelope-rsvp-frame" />

          <p className="envelope-rsvp-kicker">RSVP</p>

          <h2 className="envelope-rsvp-title">Potvrdite dolazak</h2>

          <p className="envelope-rsvp-subtitle">
            Biće nam veliko zadovoljstvo da svojim prisustvom ulepšate naš
            poseban dan.
          </p>

          <div className="envelope-rsvp-divider" />

          <form className="envelope-rsvp-form" onSubmit={handleSubmit}>
            <div className="envelope-rsvp-field">
              <label htmlFor="envelope-fullName">Ime i prezime</label>
              <input
                id="envelope-fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Unesite ime i prezime"
                required
              />
            </div>

            <div className="envelope-rsvp-choice-block">
              <p className="envelope-rsvp-choice-label">Da li dolazite?</p>

              <div className="envelope-rsvp-choice-grid">
                <button
                  type="button"
                  className={`envelope-choice-card ${
                    formData.attending === "da" ? "is-active" : ""
                  }`}
                  onClick={() => handleAttendanceSelect("da")}
                >
                  <span className="envelope-choice-title">Dolazim</span>
                  <span className="envelope-choice-text">
                    Radujem se što slavim sa vama
                  </span>
                </button>

                <button
                  type="button"
                  className={`envelope-choice-card ${
                    formData.attending === "ne" ? "is-active" : ""
                  }`}
                  onClick={() => handleAttendanceSelect("ne")}
                >
                  <span className="envelope-choice-title">Ne dolazim</span>
                  <span className="envelope-choice-text">
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
              <div className="envelope-rsvp-field">
                <label htmlFor="envelope-guests">Broj osoba</label>
                <input
                  id="envelope-guests"
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
              className="envelope-rsvp-button"
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

export default EnvelopeRSVP;