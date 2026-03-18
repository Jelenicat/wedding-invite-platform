import { useState } from "react";
import { motion } from "framer-motion";
import "../styles/rsvp.css";

function MinimalRSVP() {
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

    console.log("Minimal RSVP:", payload);
  };

  return (
    <motion.section
      className="minimal-rsvp-section"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="minimal-rsvp-shell">
        <div className="minimal-rsvp-box">
          <p className="minimal-rsvp-kicker">RSVP</p>

          <h2 className="minimal-rsvp-title">Potvrdite dolazak</h2>

          <p className="minimal-rsvp-subtitle">
            Biće nam veliko zadovoljstvo da svojim prisustvom ulepšate naš
            poseban dan.
          </p>

          <div className="minimal-rsvp-divider" />

          <form className="minimal-rsvp-form" onSubmit={handleSubmit}>
            <div className="minimal-rsvp-field">
              <label htmlFor="minimal-fullName">Ime i prezime</label>
              <input
                id="minimal-fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Unesite ime i prezime"
                required
              />
            </div>

            <div className="minimal-rsvp-choice-block">
              <p className="minimal-rsvp-choice-label">Da li dolazite?</p>

              <div className="minimal-rsvp-choice-grid">
                <button
                  type="button"
                  className={`minimal-choice-card ${
                    formData.attending === "da" ? "is-active" : ""
                  }`}
                  onClick={() => handleAttendanceSelect("da")}
                >
                  <span className="minimal-choice-title">Dolazim</span>
                  <span className="minimal-choice-text">
                    Radujem se što slavim sa vama
                  </span>
                </button>

                <button
                  type="button"
                  className={`minimal-choice-card ${
                    formData.attending === "ne" ? "is-active" : ""
                  }`}
                  onClick={() => handleAttendanceSelect("ne")}
                >
                  <span className="minimal-choice-title">Ne dolazim</span>
                  <span className="minimal-choice-text">
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
              <div className="minimal-rsvp-field">
                <label htmlFor="minimal-guests">Broj osoba</label>
                <input
                  id="minimal-guests"
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

            <button type="submit" className="minimal-rsvp-button">
              Pošalji potvrdu
            </button>
          </form>
        </div>
      </div>
    </motion.section>
  );
}

export default MinimalRSVP;