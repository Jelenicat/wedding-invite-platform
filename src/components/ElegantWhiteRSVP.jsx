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
import "../styles/rsvp.css";

function ElegantWhiteRSVP({
  slug,
  eventType,
  note,
  script = "latin",
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    attending: "",
    guests: "1",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const t =
    script === "cyrillic"
      ? {
          overline: "Sa ljubavlju",
          title: "RSVP",
          subtitle: "Molimo vas da nam potvrdite dolazak",
          fullName: "Ime i prezime",
          fullNamePlaceholder: "Unesite ime i prezime",
          attending: "Dolazim",
          notAttending: "Ne dolazim",
          guestsLabel: "Broj gostiju",
          button: "Pošalji odgovor",
          sending: "Slanje...",
          success: "Hvala vam na odgovoru!",
          missingSlug: "Nedostaje slug ili tip događaja.",
          enterName: "Unesite ime i prezime.",
          chooseAttendance: "Izaberite da li dolazite.",
          invalidGuests: "Unesite ispravan broj gostiju.",
          submitError: "Došlo je do greške pri slanju.",
        }
      : {
          overline: "Sa ljubavlju",
          title: "RSVP",
          subtitle: "Molimo vas da nam potvrdite dolazak",
          fullName: "Ime i prezime",
          fullNamePlaceholder: "Unesite ime i prezime",
          attending: "Dolazim",
          notAttending: "Ne dolazim",
          guestsLabel: "Broj gostiju",
          button: "Pošalji odgovor",
          sending: "Slanje...",
          success: "Hvala vam na odgovoru!",
          missingSlug: "Nedostaje slug ili tip događaja.",
          enterName: "Unesite ime i prezime.",
          chooseAttendance: "Izaberite da li dolazite.",
          invalidGuests: "Unesite ispravan broj gostiju.",
          submitError: "Došlo je do greške pri slanju.",
        };

  useEffect(() => {
    if (!submitted) return;

    const timer = setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: "",
        attending: "",
        guests: "1",
      });
    }, 3000);

    return () => clearTimeout(timer);
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
      alert(t.missingSlug);
      return;
    }

    if (!formData.fullName.trim()) {
      alert(t.enterName);
      return;
    }

    if (!formData.attending) {
      alert(t.chooseAttendance);
      return;
    }

    const guestsCount = Number(formData.guests);

    if (formData.attending === "da") {
      if (!formData.guests || Number.isNaN(guestsCount) || guestsCount < 1) {
        alert(t.invalidGuests);
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
      alert(t.submitError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="elegant-white-rsvp-section"
      style={{
        backgroundImage: "url(/images/elegant-white/background.jpg)",
      }}
    >
      <div className="elegant-white-rsvp-bg-overlay" />

      <motion.div
        className="elegant-white-rsvp-shell"
        initial={{ opacity: 0, y: 36, scale: 0.985 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="elegant-white-rsvp-card">
          <div className="elegant-white-rsvp-inner">
            <motion.p
              className="elegant-white-rsvp-overline"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {t.overline}
            </motion.p>

            <motion.h2
              className="elegant-white-rsvp-title"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.05 }}
            >
              {t.title}
            </motion.h2>

            <motion.div
              className="elegant-white-rsvp-divider"
              initial={{ opacity: 0, scaleX: 0.7 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.1 }}
              style={{ transformOrigin: "center" }}
            >
              <span />
            </motion.div>

            <motion.p
              className="elegant-white-rsvp-subtitle"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.12 }}
            >
              {note || t.subtitle}
            </motion.p>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  className="elegant-white-rsvp-form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="elegant-white-rsvp-field">
                    <label htmlFor="elegant-white-fullName">{t.fullName}</label>
                    <input
                      id="elegant-white-fullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder={t.fullNamePlaceholder}
                      required
                    />
                  </div>

                  <div className="elegant-white-rsvp-options">
                    <button
                      type="button"
                      className={`elegant-white-rsvp-option ${
                        formData.attending === "da" ? "is-active" : ""
                      }`}
                      onClick={() => handleAttendanceSelect("da")}
                    >
                      {t.attending}
                    </button>

                    <button
                      type="button"
                      className={`elegant-white-rsvp-option ${
                        formData.attending === "ne" ? "is-active" : ""
                      }`}
                      onClick={() => handleAttendanceSelect("ne")}
                    >
                      {t.notAttending}
                    </button>
                  </div>

                  <input
                    type="hidden"
                    name="attending"
                    value={formData.attending}
                    required
                  />

                  <AnimatePresence>
                    {formData.attending === "da" && (
                      <motion.div
                        className="elegant-white-rsvp-guests-wrap"
                        initial={{ opacity: 0, y: 14, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -8, height: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                      >
                        <label
                          htmlFor="elegant-white-guests"
                          className="elegant-white-rsvp-guests-label"
                        >
                          {t.guestsLabel}
                        </label>

                        <div className="elegant-white-rsvp-stepper">
                          <button
                            type="button"
                            className="elegant-white-rsvp-stepper-btn"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                guests: String(
                                  Math.max(1, Number(prev.guests || "1") - 1)
                                ),
                              }))
                            }
                          >
                            −
                          </button>

                          <div
                            id="elegant-white-guests"
                            className="elegant-white-rsvp-stepper-value"
                          >
                            {formData.guests}
                          </div>

                          <button
                            type="button"
                            className="elegant-white-rsvp-stepper-btn"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                guests: String(Number(prev.guests || "1") + 1),
                              }))
                            }
                          >
                            +
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    className="elegant-white-rsvp-submit"
                    disabled={loading}
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.985 }}
                  >
                    {loading ? t.sending : t.button}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  className="elegant-white-rsvp-success"
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55 }}
                >
                  <motion.div
                    className="elegant-white-rsvp-success-heart"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.45, delay: 0.1 }}
                  >
                    ♡
                  </motion.div>
                  <p>{t.success}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default ElegantWhiteRSVP;