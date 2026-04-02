import { useState } from "react";
import { motion } from "framer-motion";
import "../styles/rsvp.css";

function AngelRSVP({ slug, eventType }) {
  const [fullName, setFullName] = useState("");
  const [attending, setAttending] = useState("");
  const [guests, setGuests] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      slug,
      eventType,
      fullName,
      attending,
      guests: attending === "da" ? Number(guests) : 0,
    };

    console.log("Angel RSVP:", payload);
    setSubmitted(true);
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
                  disabled={!fullName || !attending}
                >
                  Pošalji odgovor
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