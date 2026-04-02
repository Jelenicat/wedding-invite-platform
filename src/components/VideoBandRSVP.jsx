import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/rsvp.css";

const normalizeFullName = (value = "") =>
  value.trim().replace(/\s+/g, " ");

const isValidFullName = (value = "") => {
  const normalized = normalizeFullName(value);
  const parts = normalized.split(" ").filter(Boolean);
  return normalized.length >= 4 && parts.length >= 2;
};

const createGuestId = (fullName = "") =>
  normalizeFullName(fullName)
    .toLowerCase()
    .replace(/[^a-zA-Z0-9а-шА-ШćčžšđĆČŽŠĐ\s-]/g, "")
    .replace(/\s+/g, "-");

function VideoBandRSVP({ slug, eventType }) {
  const [formData, setFormData] = useState({
    fullName: "",
    attending: "",
    guests: "1",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setSubmitted(false);
        setErrorMessage("");
        setFormData({
          fullName: "",
          attending: "",
          guests: "1",
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const normalizedFullName = useMemo(
    () => normalizeFullName(formData.fullName),
    [formData.fullName]
  );

  const guestsCount = Number(formData.guests);

  const isFormValid = useMemo(() => {
    if (!isValidFullName(formData.fullName)) return false;
    if (!formData.attending) return false;

    if (formData.attending === "da") {
      return (
        formData.guests !== "" &&
        !Number.isNaN(guestsCount) &&
        guestsCount >= 1 &&
        guestsCount <= 10
      );
    }

    return true;
  }, [formData.fullName, formData.attending, formData.guests, guestsCount]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "guests") {
      if (value === "") {
        setFormData((prev) => ({
          ...prev,
          guests: "",
        }));
        return;
      }

      const numericValue = Number(value);

      if (Number.isNaN(numericValue)) return;

      setFormData((prev) => ({
        ...prev,
        guests: String(Math.max(1, Math.min(10, numericValue))),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAttendanceSelect = (value) => {
    setErrorMessage("");

    setFormData((prev) => ({
      ...prev,
      attending: value,
      guests: value === "da" ? prev.guests || "1" : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!slug || !eventType) {
      setErrorMessage("Nedostaje slug ili tip događaja.");
      return;
    }

    if (!isValidFullName(formData.fullName)) {
      setErrorMessage("Unesite ime i prezime.");
      return;
    }

    if (!formData.attending) {
      setErrorMessage("Izaberite da li dolazite.");
      return;
    }

    if (formData.attending === "da") {
      if (
        !formData.guests ||
        Number.isNaN(guestsCount) ||
        guestsCount < 1 ||
        guestsCount > 10
      ) {
        setErrorMessage("Unesite ispravan broj osoba.");
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
        fullName: normalizedFullName,
        attending: formData.attending,
        guests: formData.attending === "da" ? guestsCount : 0,
        updatedAt: serverTimestamp(),
      };

      const guestId = createGuestId(normalizedFullName);

      await setDoc(doc(db, "events", slug, "rsvps", guestId), payload, {
        merge: true,
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Greška pri slanju RSVP:", error);
      setErrorMessage("Došlo je do greške pri slanju. Pokušajte ponovo.");
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
              Biće nam veliko zadovoljstvo da svojim prisustvom ulepšate naš
              poseban dan.
            </p>

            <div className="video-band-rsvp-divider" />

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  className="video-band-rsvp-success"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55 }}
                >
                  <motion.div
                    className="video-band-success-heart"
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

                  <div className="video-band-confetti-wrap">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <motion.span
                        key={i}
                        className="video-band-confetti"
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
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div className="video-band-rsvp-choice-block">
                    <p className="video-band-rsvp-choice-label">
                      Da li dolazite?
                    </p>

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
                        <span className="video-band-choice-title">
                          Ne dolazim
                        </span>
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

                  {errorMessage && (
                    <div className="video-band-rsvp-error" role="alert">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="video-band-rsvp-button"
                    disabled={loading || !isFormValid}
                  >
                    {loading ? "Slanje..." : "Pošalji potvrdu"}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

export default VideoBandRSVP;