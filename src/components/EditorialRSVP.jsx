import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EditorialRSVP({ brideName, groomName }) {
  const [formData, setFormData] = useState({
    fullName: "",
    attending: "",
    guests: 1,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name === "attending") {
        return {
          ...prev,
          attending: value,
          guests: value === "da" ? prev.guests || 1 : 0,
        };
      }

      if (name === "guests") {
        return {
          ...prev,
          guests: Number(value),
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      guests: formData.attending === "da" ? formData.guests : 0,
    };

    console.log("RSVP podaci:", payload);

    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: "",
        attending: "",
        guests: 1,
      });
    }, 3000);
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
        <h2 className="editorial-rsvp-title">RSVP</h2>
        <div className="editorial-rsvp-script">confirm attendance</div>

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
                <input
                  type="number"
                  name="guests"
                  min="1"
                  max="10"
                  value={formData.guests}
                  onChange={handleChange}
                  className="editorial-rsvp-input"
                  placeholder="Broj gostiju"
                  required
                />
              )}

              <button type="submit" className="editorial-rsvp-button">
                Potvrdi dolazak
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}