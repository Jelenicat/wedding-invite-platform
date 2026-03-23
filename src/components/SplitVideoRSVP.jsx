import { useState } from "react";
import { motion } from "framer-motion";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/rsvp.css";

function SplitVideoRSVP({ slug, eventType }) {
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
      className="split-video-rsvp-section"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="split-video-rsvp-shell">
        <div className="split-video-rsvp-box">
          <p className="split-video-rsvp-kicker">RSVP</p>

          <h2 className="split-video-rsvp-title">Potvrdite dolazak</h2>

          <p className="split-video-rsvp-subtitle">
            Biće nam izuzetna čast da svojim prisustvom budete deo našeg
            posebnog dana.
          </p>

          <div className="split-video-rsvp-divider" />

          <form className="split-video-rsvp-form" onSubmit={handleSubmit}>
            <div className="split-video-rsvp-field">
              <label htmlFor="split-video-fullName">Ime i prezime</label>
              <input
                id="split-video-fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Unesite ime i prezime"
                required
              />
            </div>

            <div className="split-video-rsvp-choice-block">
              <p className="split-video-rsvp-choice-label">Da li dolazite?</p>

              <div className="split-video-rsvp-choice-grid">
                <button
                  type="button"
                  className={`split-video-choice-card ${
                    formData.attending === "da" ? "is-active" : ""
                  }`}
                  onClick={() => handleAttendanceSelect("da")}
                >
                  <span className="split-video-choice-title">Dolazim</span>
                  <span className="split-video-choice-text">
                    Radujem se što slavim sa vama
                  </span>
                </button>

                <button
                  type="button"
                  className={`split-video-choice-card ${
                    formData.attending === "ne" ? "is-active" : ""
                  }`}
                  onClick={() => handleAttendanceSelect("ne")}
                >
                  <span className="split-video-choice-title">Ne dolazim</span>
                  <span className="split-video-choice-text">
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
              <div className="split-video-rsvp-field">
                <label htmlFor="split-video-guests">Broj osoba</label>
                <input
                  id="split-video-guests"
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
              className="split-video-rsvp-button"
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

export default SplitVideoRSVP;