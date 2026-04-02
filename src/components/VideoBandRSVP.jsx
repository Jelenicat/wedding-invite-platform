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

function VideoBandRSVP({ slug, eventType }) {
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
      await setDoc(
        doc(db, "events", slug),
        {
          slug,
          eventType,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      const payload = {
        eventType,
        fullName: formData.fullName.trim(),
        attending: formData.attending,
        guests: formData.attending === "da" ? guestsCount : 0,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "events", slug, "rsvps"), payload);

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
      className="video-band-rsvp-section"
      initial={{ opacity: 0, y: 26, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
    >
      <div className="video-band-rsvp-paper" />

      <div className="video-band-rsvp-shell">
        <div className="video-band-rsvp-frame">
          <motion.div
            className="video-band-rsvp-box"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.08 }}
          >
            <p className="video-band-rsvp-kicker">RSVP</p>

            <h2 className="video-band-rsvp-title">Potvrdite dolazak</h2>

            <p className="video-band-rsvp-subtitle">
              Biće nam veliko zadovoljstvo da svojim prisustvom ulepšate naš poseban dan.
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
                <motion.div
                  className="video-band-rsvp-field"
                  initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.35 }}
                >
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
                </motion.div>
              )}

              <button
                type="submit"
                className="video-band-rsvp-button"
                disabled={loading}
              >
                {loading ? "Slanje..." : "Pošalji potvrdu"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

export default VideoBandRSVP;