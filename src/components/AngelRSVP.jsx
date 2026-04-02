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

function AngelRSVP({ slug, eventType }) {
  const [fullName, setFullName] = useState("");
  const [attending, setAttending] = useState("");
  const [guests, setGuests] = useState("1");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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

      // 🔥 upis u novu strukturu
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

            {submitted ? (
              <motion.div
                className="angel-rsvp-success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                <div className="angel-rsvp-success-icon">♡</div>
                <h3>Hvala vam</h3>
                <p>Vaš odgovor je uspešno zabeležen.</p>
              </motion.div>
            ) : (
              <form className="angel-rsvp-form" onSubmit={handleSubmit}>
                <div className="angel-rsvp-field">
                  <label htmlFor="angel-full-name">Ime i prezime</label>
                  <input
                    id="angel-full-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Unesite ime i prezime"
                    required
                  />
                </div>

                <div className="angel-rsvp-field">
                  <span className="angel-rsvp-label">Da li dolazite?</span>

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
                    transition={{ duration: 0.35 }}
                  >
                    <label htmlFor="angel-guests">Broj gostiju</label>
                    <input
                      id="angel-guests"
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AngelRSVP;