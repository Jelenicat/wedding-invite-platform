import { useState } from "react";
import { motion } from "framer-motion";
import "../styles/rsvp.css";

function VideoBandRSVP() {
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

    console.log("RSVP podaci:", payload);
  };

  return (
    <motion.section
      className="video-band-rsvp-section"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="video-band-rsvp-shell">
        <div className="video-band-rsvp-box">
          <p className="video-band-rsvp-kicker">RSVP</p>

          <h2 className="video-band-rsvp-title">Potvrdite dolazak</h2>

          <p className="video-band-rsvp-subtitle">
            Biće nam veliko zadovoljstvo da svojim prisustvom ulepšate naš
            poseban dan.
          </p>

          <div className="video-band-rsvp-divider" />

          <form className="video-band-rsvp-form" onSubmit={handleSubmit}>
            <div className="video-band-rsvp-field">
              <label htmlFor="video-band-fullName">Ime i prezime</label>
              <input
                id="video-band-fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Unesite ime i prezime"
                required
              />
            </div>

            <div className="video-band-rsvp-choice-block">
              <p className="video-band-rsvp-choice-label">Da li dolazite?</p>

              <div className="video-band-rsvp-choice-grid">
                <button
                  type="button"
                  className={`video-band-choice-card ${
                    formData.attending === "da" ? "is-active" : ""
                  }`}
                  onClick={() => handleAttendanceSelect("da")}
                >
                  <span className="video-band-choice-title">Dolazim</span>
                  <span className="video-band-choice-text">
                    Radujem se proslavi sa vama
                  </span>
                </button>

                <button
                  type="button"
                  className={`video-band-choice-card ${
                    formData.attending === "ne" ? "is-active" : ""
                  }`}
                  onClick={() => handleAttendanceSelect("ne")}
                >
                  <span className="video-band-choice-title">Ne dolazim</span>
                  <span className="video-band-choice-text">
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
              <div className="video-band-rsvp-field">
                <label htmlFor="video-band-guests">Broj osoba</label>
                <input
                  id="video-band-guests"
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

            <button type="submit" className="video-band-rsvp-button">
              Pošalji potvrdu
            </button>
          </form>
        </div>
      </div>
    </motion.section>
  );
}

export default VideoBandRSVP;