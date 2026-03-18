import { useState } from "react";
import { motion } from "framer-motion";
import "../styles/rsvp.css";

function PhotoScriptRSVP() {
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

    console.log("Photo script RSVP:", payload);
  };

  return (
    <motion.section
      className="photo-script-rsvp-section"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="photo-script-rsvp-shell">
        <div className="photo-script-rsvp-box">
          <p className="photo-script-rsvp-kicker">RSVP</p>

          <h2 className="photo-script-rsvp-title">Potvrdite dolazak</h2>

          <p className="photo-script-rsvp-subtitle">
            Biće nam veliko zadovoljstvo da svojim prisustvom ulepšate naš
            poseban dan.
          </p>

          <div className="photo-script-rsvp-divider" />

          <form className="photo-script-rsvp-form" onSubmit={handleSubmit}>
            <div className="photo-script-rsvp-field">
              <label htmlFor="photo-script-fullName">Ime i prezime</label>
              <input
                id="photo-script-fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Unesite ime i prezime"
                required
              />
            </div>

            <div className="photo-script-rsvp-choice-block">
              <p className="photo-script-rsvp-choice-label">Da li dolazite?</p>

              <div className="photo-script-rsvp-choice-grid">
                <button
                  type="button"
                  className={`photo-script-choice-card ${
                    formData.attending === "da" ? "is-active" : ""
                  }`}
                  onClick={() => handleAttendanceSelect("da")}
                >
                  <span className="photo-script-choice-title">Dolazim</span>
                  <span className="photo-script-choice-text">
                    Radujem se što slavim sa vama
                  </span>
                </button>

                <button
                  type="button"
                  className={`photo-script-choice-card ${
                    formData.attending === "ne" ? "is-active" : ""
                  }`}
                  onClick={() => handleAttendanceSelect("ne")}
                >
                  <span className="photo-script-choice-title">Ne dolazim</span>
                  <span className="photo-script-choice-text">
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
              <div className="photo-script-rsvp-field">
                <label htmlFor="photo-script-guests">Broj osoba</label>
                <input
                  id="photo-script-guests"
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

            <button type="submit" className="photo-script-rsvp-button">
              Pošalji potvrdu
            </button>
          </form>
        </div>
      </div>
    </motion.section>
  );
}

export default PhotoScriptRSVP;