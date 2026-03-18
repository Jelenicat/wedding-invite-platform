import { useState } from "react";
import { motion } from "framer-motion";
import "../styles/rsvp.css";

function PhotoCardRSVP() {
  const [formData, setFormData] = useState({
    fullName: "",
    attending: "",
    guests: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "guests" ? Number(value) : value,
    }));
  };

  const handleAttendanceSelect = (value) => {
    setFormData((prev) => ({
      ...prev,
      attending: value,
      guests: value === "da" ? prev.guests || 1 : 0,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      guests: formData.attending === "da" ? formData.guests : 0,
    };

    console.log("Photo card RSVP:", payload);
  };

  return (
    <motion.section
      className="photo-card-rsvp-section"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="photo-card-rsvp-shell">
        <div className="photo-card-rsvp-box">
          <p className="photo-card-rsvp-kicker">RSVP</p>

          <h2 className="photo-card-rsvp-title">Potvrdite dolazak</h2>

          <p className="photo-card-rsvp-subtitle">
            Biće nam veliko zadovoljstvo da svojim prisustvom ulepšate naš
            poseban dan.
          </p>

          <div className="photo-card-rsvp-divider" />

          <form className="photo-card-rsvp-form" onSubmit={handleSubmit}>
            <div className="photo-card-rsvp-field">
              <label htmlFor="photo-card-fullName">Ime i prezime</label>
              <input
                id="photo-card-fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Unesite ime i prezime"
                required
              />
            </div>

            <div className="photo-card-rsvp-choice-block">
              <p className="photo-card-rsvp-choice-label">Da li dolazite?</p>

              <div className="photo-card-rsvp-choice-grid">
                <button
                  type="button"
                  className={`photo-card-choice-card ${
                    formData.attending === "da" ? "is-active" : ""
                  }`}
                  onClick={() => handleAttendanceSelect("da")}
                >
                  <span className="photo-card-choice-title">Dolazim</span>
                  <span className="photo-card-choice-text">
                    Radujem se što slavim sa vama
                  </span>
                </button>

                <button
                  type="button"
                  className={`photo-card-choice-card ${
                    formData.attending === "ne" ? "is-active" : ""
                  }`}
                  onClick={() => handleAttendanceSelect("ne")}
                >
                  <span className="photo-card-choice-title">Ne dolazim</span>
                  <span className="photo-card-choice-text">
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
              <div className="photo-card-rsvp-field">
                <label htmlFor="photo-card-guests">Broj osoba</label>
                <input
                  id="photo-card-guests"
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

            <button type="submit" className="photo-card-rsvp-button">
              Pošalji potvrdu
            </button>
          </form>
        </div>
      </div>
    </motion.section>
  );
}

export default PhotoCardRSVP;