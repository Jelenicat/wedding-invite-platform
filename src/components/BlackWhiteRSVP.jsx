import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
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
  const [submitted, setSubmitted] = useState(false);

  const celebrantName = brideName || "Jelena";
  const rsvpVideoPath = `/videos/rsvp/${slug}.mp4`;

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setSubmitted(false);
        setFormData({
          fullName: "",
          attending: "",
          guests: "1",
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [submitted]);

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

    if (!slug || !eventType) return;
    if (!formData.fullName.trim()) return;
    if (!formData.attending) return;

    const guestsCount = Number(formData.guests);

    if (formData.attending === "da") {
      if (!formData.guests || Number.isNaN(guestsCount) || guestsCount < 1) {
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

      await addDoc(collection(db, "events", slug, "rsvps"), {
        eventType,
        fullName: formData.fullName.trim(),
        attending: formData.attending,
        guests: formData.attending === "da" ? guestsCount : 0,
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Greška pri slanju RSVP:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section className="bw-rsvp-section">
      <div className="bw-rsvp-video-wrap">
        <video className="bw-rsvp-video" autoPlay muted loop playsInline>
          <source src={rsvpVideoPath} type="video/mp4" />
        </video>

        <div className="bw-rsvp-overlay" />

        <div className="bw-rsvp-inner">
          <div className="bw-rsvp-card">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  className="bw-rsvp-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="bw-rsvp-success-heart"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                  >
                    💌
                  </motion.div>

                  <h3>Hvala!</h3>
                  <p>Vaša potvrda je uspešno poslata.</p>

                  <div className="bw-confetti-wrap">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <motion.span
                        key={i}
                        className="bw-confetti"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: [0, 1, 1, 0],
                          y: 110,
                          x: (i - 9) * 10,
                        }}
                        transition={{
                          duration: 1.6,
                          delay: i * 0.04,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              ) : (
                <>
                  <p className="bw-rsvp-kicker">RSVP</p>

                  <h2 className="bw-rsvp-title">Potvrdi dolazak</h2>

                  <p className="bw-rsvp-subtitle">
                    {details.note ||
                      `Potvrdi dolazak na proslavu za ${celebrantName}.`}
                  </p>

                  <form className="bw-rsvp-form" onSubmit={handleSubmit}>
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Ime i prezime"
                    />

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

                    {formData.attending === "da" && (
                      <input
                        type="number"
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        placeholder="Broj osoba"
                      />
                    )}

                    <button
                      type="submit"
                      className="bw-rsvp-submit"
                      disabled={loading}
                    >
                      {loading ? "Slanje..." : "Potvrdi"}
                    </button>
                  </form>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default BlackWhiteRSVP;