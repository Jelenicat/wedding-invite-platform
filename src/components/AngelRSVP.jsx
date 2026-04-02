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

function AngelRSVP({ slug, eventType }) {
  const [fullName, setFullName] = useState("");
  const [attending, setAttending] = useState("");
  const [guests, setGuests] = useState("1");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setSubmitted(false);
        setFullName("");
        setAttending("");
        setGuests("1");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!slug || !eventType) {
      alert("Nedostaje slug ili tip događaja.");
      return;
    }

    if (!fullName.trim()) {
      alert("Unesite ime i prezime.");
      return;
    }

    if (!attending) {
      alert("Izaberite da li dolazite.");
      return;
    }

    const guestsCount = Number(guests);

    if (attending === "da") {
      if (!guests || Number.isNaN(guestsCount) || guestsCount < 1) {
        alert("Unesite ispravan broj gostiju.");
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
        fullName: fullName.trim(),
        attending,
        guests: attending === "da" ? guestsCount : 0,
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Greška pri slanju RSVP:", error);
      alert("Došlo je do greške.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="angel-rsvp-section">
      <div className="angel-rsvp-overlay" />

      <div className="angel-rsvp-shell">
        <div className="angel-rsvp-frame-outer">
          <motion.div
            className="angel-rsvp-card"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <div className="angel-rsvp-frame" />
            <div className="angel-rsvp-frame angel-rsvp-frame-second" />

            <motion.div
              className="angel-rsvp-heading"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <div className="angel-rsvp-script">RSVP</div>
              <h2 className="angel-rsvp-title">Potvrdite svoj dolazak</h2>
              <p className="angel-rsvp-subtitle">
                Bilo bi nam zadovoljstvo da ovaj poseban dan podelimo sa vama.
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  className="angel-rsvp-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="angel-rsvp-success-heart"
                    initial={{ scale: 0, rotate: -15 }}
                    animate={{ scale: [0, 1.2, 1], rotate: [0, 8, -8, 0] }}
                    transition={{ duration: 0.9 }}
                  >
                    💌
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    Hvala!
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Vaša potvrda je uspešno poslata.
                  </motion.p>

                  <div className="angel-confetti-wrap">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <motion.span
                        key={i}
                        className="angel-confetti"
                        initial={{ opacity: 0, y: 0, x: 0, scale: 0.6 }}
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
                <form className="angel-rsvp-form" onSubmit={handleSubmit}>
                  <div className="angel-rsvp-field">
                    <label>Ime i prezime</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Unesite ime i prezime"
                    />
                  </div>

                  <div className="angel-rsvp-field">
                    <span className="angel-rsvp-label">
                      Da li dolazite?
                    </span>

                    <div className="angel-rsvp-options">
                      <button
                        type="button"
                        className={`angel-rsvp-option ${
                          attending === "da" ? "is-active" : ""
                        }`}
                        onClick={() => setAttending("da")}
                      >
                        Dolazim
                      </button>

                      <button
                        type="button"
                        className={`angel-rsvp-option ${
                          attending === "ne" ? "is-active" : ""
                        }`}
                        onClick={() => setAttending("ne")}
                      >
                        Ne dolazim
                      </button>
                    </div>
                  </div>

                  {attending === "da" && (
                    <motion.div
                      className="angel-rsvp-field"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <label>Broj gostiju</label>
                      <input
                        type="number"
                        min="1"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                      />
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    className="angel-rsvp-submit"
                    disabled={!fullName || !attending || loading}
                  >
                    {loading ? "Slanje..." : "Pošalji odgovor"}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AngelRSVP;