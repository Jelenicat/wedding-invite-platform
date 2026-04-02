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

function BirthdaySplitRSVP({
  slug,
  eventType = "birthday",
  brideName,
  details = {},
  backgroundImage,
}) {
  const name = brideName || "Nina";

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
      // 🔥 kreira event doc ako ne postoji
      await setDoc(
        doc(db, "events", slug),
        {
          slug,
          eventType,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // 🔥 upis u novu kolekciju
      await addDoc(collection(db, "events", slug, "rsvps"), {
        eventType,
        fullName: formData.fullName.trim(),
        attending: formData.attending,
        guests: formData.attending === "da" ? guestsCount : 0,
        createdAt: serverTimestamp(),
      });

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
      className="birthday-split-rsvp-section"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8 }}
      style={
        backgroundImage
          ? { "--birthday-split-rsvp-bg": `url(${backgroundImage})` }
          : undefined
      }
    >
      <div className="birthday-split-rsvp-bg" />
      <div className="birthday-split-rsvp-overlay" />

      <div className="birthday-split-rsvp-wrap">
        <div className="birthday-split-rsvp-card">
          <p className="birthday-split-rsvp-kicker">RSVP</p>

          <h2 className="birthday-split-rsvp-title">Potvrdite dolazak</h2>

          <p className="birthday-split-rsvp-subtitle">
            Radovaćemo se da zajedno proslavimo {name}in rođendan.
          </p>

          {details?.note && (
            <div className="birthday-split-rsvp-note">
              {details.note}
            </div>
          )}

          <form className="birthday-split-rsvp-form" onSubmit={handleSubmit}>
            <div className="birthday-split-rsvp-field">
              <label htmlFor="birthday-split-fullName">
                Ime i prezime
              </label>
              <input
                id="birthday-split-fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Unesite ime i prezime"
                required
              />
            </div>

            <div className="birthday-split-rsvp-choice-block">
              <p className="birthday-split-rsvp-choice-label">
                Da li dolazite?
              </p>

              <div className="birthday-split-rsvp-choice-grid">
                <button
                  type="button"
                  className={`birthday-split-choice-card ${
                    formData.attending === "da" ? "is-active" : ""
                  }`}
                  onClick={() => handleAttendanceSelect("da")}
                >
                  <span className="birthday-split-choice-title">
                    Dolazim
                  </span>
                  <span className="birthday-split-choice-text">
                    Biće mi zadovoljstvo
                  </span>
                </button>

                <button
                  type="button"
                  className={`birthday-split-choice-card ${
                    formData.attending === "ne" ? "is-active" : ""
                  }`}
                  onClick={() => handleAttendanceSelect("ne")}
                >
                  <span className="birthday-split-choice-title">
                    Ne dolazim
                  </span>
                  <span className="birthday-split-choice-text">
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
              <div className="birthday-split-rsvp-field">
                <label htmlFor="birthday-split-guests">
                  Broj osoba
                </label>
                <input
                  id="birthday-split-guests"
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
              className="birthday-split-rsvp-button"
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

export default BirthdaySplitRSVP;