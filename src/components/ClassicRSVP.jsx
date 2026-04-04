import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import "../styles/card.css";

function ClassicRSVP({ slug, eventType }) {
  const [fullName, setFullName] = useState("");
  const [attending, setAttending] = useState("");
  const [guests, setGuests] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!submitted) return;

    const timer = setTimeout(() => {
      setSubmitted(false);
      setFullName("");
      setAttending("");
      setGuests(1);
      setErrorMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [submitted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!slug || !eventType) {
      setErrorMessage("Nedostaje slug ili tip događaja.");
      return;
    }

    if (!fullName.trim()) {
      setErrorMessage("Unesite ime i prezime.");
      return;
    }

    if (!attending) {
      setErrorMessage("Izaberite da li dolazite.");
      return;
    }

    const guestsCount = Number(guests);

    if (attending === "da") {
      if (Number.isNaN(guestsCount) || guestsCount < 1) {
        setErrorMessage("Unesite ispravan broj gostiju.");
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
      setErrorMessage("Došlo je do greške pri slanju potvrde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="classic-vertical-card classic-rsvp-card">
      <div className="classic-vertical-inner classic-rsvp-inner">
        <div className="classic-rsvp-script">RSVP</div>
        <h3 className="classic-rsvp-title">Potvrdite dolazak</h3>
        <p className="classic-rsvp-subtitle">
          Biće nam veliko zadovoljstvo da ovaj poseban dan podelimo sa vama.
        </p>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              className="classic-rsvp-success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="classic-rsvp-success-heart">💌</div>
              <h4>Hvala!</h4>
              <p>Vaša potvrda je uspešno poslata.</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              className="classic-rsvp-form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="classic-rsvp-field">
                <label>Ime i prezime</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Unesite ime i prezime"
                />
              </div>

              <div className="classic-rsvp-field">
                <span className="classic-rsvp-label">Da li dolazite?</span>

                <div className="classic-rsvp-options">
                  <button
                    type="button"
                    className={`classic-rsvp-option ${
                      attending === "da" ? "is-active" : ""
                    }`}
                    onClick={() => setAttending("da")}
                  >
                    Dolazim
                  </button>

                  <button
                    type="button"
                    className={`classic-rsvp-option ${
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
                  className="classic-rsvp-field"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <label>Broj gostiju</label>
                  <input
                    type="number"
                    min="1"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                  />
                </motion.div>
              )}

              {errorMessage && (
                <div className="classic-rsvp-error">{errorMessage}</div>
              )}

              <button
                type="submit"
                className="classic-rsvp-submit"
                disabled={!fullName.trim() || !attending || loading}
              >
                {loading ? "Slanje..." : "Pošalji odgovor"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default ClassicRSVP;