import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import "../styles/rsvp.css";

function DarkFloralRSVP({
  slug,
  brideName = "",
  groomName = "",
  details = {},
  eventType = "wedding",
}) {
  const bg =
    details?.cardBackground ||
    details?.backgroundImage ||
    "/images/dark-floral-card.jpg";

  const [name, setName] = useState("");
  const [attending, setAttending] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleAttendingChange = (value) => {
    setAttending(value);

    if (value === "yes") {
      setGuests((prev) => Math.max(1, prev));
    }

    if (value === "no") {
      setGuests(0);
    }
  };

  const handleSubmit = async () => {
    setError("");

    if (!slug) {
      setError("Greška pri učitavanju pozivnice.");
      return;
    }

    if (!name.trim()) {
      setError("Molimo unesite ime i prezime.");
      return;
    }

    if (!attending) {
      setError("Molimo izaberite da li dolazite.");
      return;
    }

    try {
      setLoading(true);

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
        name: name.trim(),
        fullName: name.trim(),

        attending: attending === "yes" ? "da" : "ne",
        attendingRaw: attending,

        guests: attending === "yes" ? guests : 0,

        eventType,
        brideName,
        groomName,
        slug,

        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
      setName("");
      setAttending("");
      setGuests(1);
    } catch (err) {
      console.error("RSVP error:", err);
      setError("Došlo je do greške. Pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="df-rsvp-page" id="rsvp">
      <div
        className="df-rsvp-bg"
        style={{ backgroundImage: `url(${bg})` }}
      />

      <div className="df-rsvp-overlay" />

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            className="df-rsvp-content"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <div className="df-rsvp-ornament">✦</div>

            <h2 className="df-rsvp-title">RSVP</h2>

            <p className="df-rsvp-subtitle">
              {details?.note ||
                "Molimo vas da svoj dolazak potvrdite na vreme."}
            </p>

            <div className="df-rsvp-divider" />

            <label className="df-rsvp-name-wrap">
              <span>Ime i prezime</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <div className="df-rsvp-options">
              <button
                type="button"
                className={attending === "yes" ? "active" : ""}
                onClick={() => handleAttendingChange("yes")}
              >
                <span />
                Sa radošću prihvatam
              </button>

              <button
                type="button"
                className={attending === "no" ? "active" : ""}
                onClick={() => handleAttendingChange("no")}
              >
                <span />
                Nažalost, nisam u mogućnosti
              </button>
            </div>

            {attending === "yes" && (
              <>
                <div className="df-rsvp-divider small" />

                <div className="df-rsvp-guests">
                  <p>Broj gostiju</p>

                  <div className="df-rsvp-counter">
                    <button
                      type="button"
                      onClick={() =>
                        setGuests((prev) => Math.max(1, prev - 1))
                      }
                    >
                      −
                    </button>

                    <strong>{guests}</strong>

                    <button
                      type="button"
                      onClick={() => setGuests((prev) => prev + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </>
            )}

            {error && <p className="df-rsvp-error">{error}</p>}

            <button
              type="button"
              className="df-rsvp-submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Slanje..." : "Pošalji odgovor"}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            className="df-rsvp-content df-rsvp-success"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="df-rsvp-ornament">✦</div>

            <h2 className="df-rsvp-title">Hvala</h2>

            <p className="df-rsvp-subtitle">
              Vaš odgovor je
              <br />
              uspešno zabeležen.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default DarkFloralRSVP;