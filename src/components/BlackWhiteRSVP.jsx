import { useState } from "react";
import { motion } from "framer-motion";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

function BlackWhiteRSVP({
  brideName,
  details = {},
  slug,
  eventType,
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    attending: "",
    guests: "1",
  });

  const [loading, setLoading] = useState(false);

  const celebrantName = brideName || "Jelena";
  const rsvpVideoPath = `/videos/rsvp/${slug}.mp4`;

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
      className="bw-rsvp-section"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="bw-rsvp-video-wrap">
        <video
          className="bw-rsvp-video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={rsvpVideoPath} type="video/mp4" />
        </video>

        <div className="bw-rsvp-overlay" />

        <div className="bw-rsvp-inner">
          <motion.div
            className="bw-rsvp-card"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="bw-rsvp-kicker">RSVP</p>

            <h2 className="bw-rsvp-title">Potvrdi dolazak</h2>

            <p className="bw-rsvp-subtitle">
              {details.note ||
                `Potvrdi dolazak na proslavu za ${celebrantName}.`}
            </p>

            <form className="bw-rsvp-form" onSubmit={handleSubmit}>
              <div className="bw-rsvp-field">
                <label htmlFor="bw-fullName">Ime i prezime</label>
                <input
                  id="bw-fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Unesite ime i prezime"
                  required
                />
              </div>

              <div className="bw-rsvp-field">
                <span className="bw-rsvp-label">Dolazite li?</span>

                <div className="bw-rsvp-choice-row">
                  <button
                    type="button"
                    className={`bw-rsvp-choice ${
                      formData.attending === "da" ? "active" : ""
                    }`}
                    onClick={() => handleAttendanceSelect("da")}
                  >
                    Dolazim
                  </button>

                  <button
                    type="button"
                    className={`bw-rsvp-choice ${
                      formData.attending === "ne" ? "active" : ""
                    }`}
                    onClick={() => handleAttendanceSelect("ne")}
                  >
                    Ne dolazim
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
                <div className="bw-rsvp-field">
                  <label htmlFor="bw-guests">Broj osoba</label>
                  <input
                    id="bw-guests"
                    name="guests"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.guests}
                    onChange={handleChange}
                    placeholder="1"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="bw-rsvp-submit"
                disabled={loading}
              >
                {loading ? "Slanje..." : "Potvrdi"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

export default BlackWhiteRSVP;