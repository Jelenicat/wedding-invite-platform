import { useState } from "react";
import { motion } from "framer-motion";
import "../styles/rsvp.css";

function FloralRSVP() {
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

    console.log("Floral RSVP:", payload);
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

            <button type="submit" className="floral-rsvp-button">
              Pošalji potvrdu
            </button>
          </form>
        </div>
      </div>
    </motion.section>
  );
}

export default FloralRSVP;