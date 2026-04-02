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
import "../styles/rsvp.css";

function RetroRSVP({ slug, eventType, brideName, details = {}, rsvpVideoSrc }) {
  const name = brideName || "Jelena";

  const [formData, setFormData] = useState({
    fullName: "",
    attending: "",
    guests: "1",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
      alert("Došlo je do greške pri slanju.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="retro-rsvp-section">
      <video className="retro-rsvp-video" autoPlay muted loop playsInline>
        <source src={rsvpVideoSrc} type="video/mp4" />
      </video>

      <div className="retro-rsvp-overlay" />

      <div className="retro-rsvp-center">
        <motion.div
          className="retro-rsvp-card"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                className="retro-rsvp-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="retro-rsvp-success-heart"
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: [0, 1.2, 1], rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 0.9 }}
                >
                  💌
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.45 }}
                >
                  Hvala!
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.45 }}
                >
                  Vaša potvrda je uspešno poslata.
                </motion.p>

                <div className="retro-confetti-wrap">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <motion.span
                      key={i}
                      className="retro-confetti"
                      initial={{
                        opacity: 0,
                        y: 0,
                        x: 0,
                        scale: 0.6,
                      }}
                      animate={{
                        opacity: [0, 1, 1, 0],
                        y: 110 + (i % 4) * 8,
                        x: (i - 9) * 10,
                        scale: [0.6, 1, 0.9],
                        rotate: [0, 120, 240],
                      }}
                      transition={{
                        duration: 1.6,
                        delay: i * 0.04,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="retro-rsvp-kicker">RSVP</p>
                <h2 className="retro-rsvp-title">{name}'s 18th Birthday</h2>
                <p className="retro-rsvp-subtitle">
                  Potvrdi svoj dolazak i budi deo proslave.
                </p>

                <form className="retro-rsvp-form" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Ime i prezime"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="retro-rsvp-input"
                    required
                  />

                  <div className="retro-rsvp-choice-row">
                    <button
                      type="button"
                      className={`retro-rsvp-choice ${
                        formData.attending === "da" ? "active" : ""
                      }`}
                      onClick={() => handleAttendanceSelect("da")}
                    >
                      Dolazim
                    </button>

                    <button
                      type="button"
                      className={`retro-rsvp-choice ${
                        formData.attending === "ne" ? "active" : ""
                      }`}
                      onClick={() => handleAttendanceSelect("ne")}
                    >
                      Ne dolazim
                    </button>
                  </div>

                  <input
                    type="hidden"
                    name="attending"
                    value={formData.attending}
                    required
                  />

                  {formData.attending === "da" && (
                    <motion.input
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                      type="number"
                      min="1"
                      name="guests"
                      placeholder="Broj osoba"
                      value={formData.guests}
                      onChange={handleChange}
                      className="retro-rsvp-input"
                      required
                    />
                  )}

                  <button
                    type="submit"
                    className="retro-rsvp-submit"
                    disabled={loading}
                  >
                    {loading ? "Slanje..." : "Potvrdi"}
                  </button>
                </form>

                {(details?.dressCodeTitle ||
                  details?.dressCodePalette?.length ||
                  details?.dressCodeNote) && (
                  <div className="retro-dress-code">
                    <p className="retro-dress-code-title">
                      {details?.dressCodeTitle || "Dress code"}
                    </p>

                    {!!details?.dressCodePalette?.length && (
                      <div className="retro-dress-code-palette">
                        {details.dressCodePalette.map((color, index) => (
                          <span
                            key={`${color}-${index}`}
                            className="retro-dress-swatch"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    )}

                    {details?.dressCodeNote && (
                      <p className="retro-dress-code-note">
                        {details.dressCodeNote}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

export default RetroRSVP;