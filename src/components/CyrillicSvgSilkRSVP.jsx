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

function CyrillicSvgSilkRSVP({
  slug,
  eventType = "wedding",
  deadline = "20. октобра 2026.",
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    attending: "",
    guests: "1",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!submitted) return;

    const timer = setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: "",
        attending: "",
        guests: "1",
      });
    }, 3500);

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
      alert("Недостаје slug или тип догађаја.");
      return;
    }

    if (!formData.fullName.trim()) {
      alert("Унесите име и презиме.");
      return;
    }

    if (!formData.attending) {
      alert("Изаберите да ли долазите.");
      return;
    }

    const guestsCount = Number(formData.guests);

    if (formData.attending === "da") {
      if (!formData.guests || Number.isNaN(guestsCount) || guestsCount < 1) {
        alert("Унесите исправан број особа.");
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
      console.error("Грешка при слању RSVP:", error);
      alert("Дошло је до грешке при слању.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="csvg-rsvp-custom">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            className="csvg-rsvp-success"
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45 }}
          >
            <div className="csvg-rsvp-success-icon">♡</div>
            <h3>Хвала!</h3>
            <p>Ваша потврда је успешно послата.</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            className="csvg-rsvp-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <div className="csvg-rsvp-field">
              <label htmlFor="csvg-fullName">ИМЕ И ПРЕЗИМЕ</label>
              <input
                id="csvg-fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Унесите име и презиме"
                required
              />
            </div>

            <div className="csvg-rsvp-question">
              <h3>Да ли долазите?</h3>
            </div>

            <div className="csvg-rsvp-choice-grid">
              <button
                type="button"
                className={`csvg-rsvp-choice ${
                  formData.attending === "da" ? "is-active" : ""
                }`}
                onClick={() => handleAttendanceSelect("da")}
              >
                

                <div className="csvg-rsvp-choice-content">
                  <span className="csvg-rsvp-choice-title">Долазим</span>
                  <span className="csvg-rsvp-choice-text">
                    Радујем се што славим са вама
                  </span>
                </div>
              </button>

              <button
                type="button"
                className={`csvg-rsvp-choice ${
                  formData.attending === "ne" ? "is-active" : ""
                }`}
                onClick={() => handleAttendanceSelect("ne")}
              >
                

                <div className="csvg-rsvp-choice-content">
                  <span className="csvg-rsvp-choice-title">Не долазим</span>
                  <span className="csvg-rsvp-choice-text">
                    Нажалост нисам у могућности
                  </span>
                </div>
              </button>
            </div>

            <AnimatePresence initial={false}>
              {formData.attending === "da" && (
                <motion.div
                  className="csvg-rsvp-field"
                  initial={{ opacity: 0, height: 0, y: 8 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  <label htmlFor="csvg-guests">БРОЈ ОСОБА</label>
                  <input
                    id="csvg-guests"
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
            </AnimatePresence>

            <button
              type="submit"
              className="csvg-rsvp-submit"
              disabled={loading}
            >
              {loading ? "СЛАЊЕ..." : "ПОШАЉИ ПОТВРДУ"}
            </button>

            <div className="csvg-rsvp-footer">
            

              <p className="csvg-rsvp-deadline">
                Молимо вас да свој долазак
                <br />
                потврдите до <strong>{deadline}</strong>
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CyrillicSvgSilkRSVP;