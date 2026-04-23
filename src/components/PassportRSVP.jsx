import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import "../styles/rsvp.css";

function PassportRSVP({ slug, eventType = "wedding" }) {
  const [formData, setFormData] = useState({
    fullName: "",
    attending: "",
    guests: 1,
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const rsvpBg = useMemo(() => {
    return `/images/passport/${slug}-card-bg.jpg`;
  }, [slug]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.attending) return;

    const guestsCount =
      formData.attending === "da"
        ? Math.max(1, Number(formData.guests) || 1)
        : 0;

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
        fullName: formData.fullName.trim(),
        attending: formData.attending,
        guests: guestsCount,
        slug,
        eventType,
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
      setFormData({
        fullName: "",
        attending: "",
        guests: 1,
      });
    } catch (error) {
      console.error("Greška pri slanju RSVP:", error);
      alert("Došlo je do greške pri slanju odgovora.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="passport-rsvp-section"
      style={{ "--passport-rsvp-bg": `url(${rsvpBg})` }}
    >
      <motion.div
        className="passport-rsvp-card"
        initial={{ opacity: 0, y: 36, scale: 0.985 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="passport-rsvp-bg-parallax"
          animate={{ y: [0, -8, 0], scale: [1, 1.02, 1] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />

        <div className="passport-rsvp-paper" />

        <div className="passport-rsvp-inner">
          <motion.div
            className="passport-rsvp-topline"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <span />
            <motion.img
              src="/images/passport/plane-mini.svg"
              alt=""
              className="passport-rsvp-plane"
              animate={{ y: [0, -3, 0], rotate: [0, -4, 0] }}
              transition={{
                duration: 4.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span />
          </motion.div>

          <motion.h2
            className="passport-rsvp-title"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            RSVP
          </motion.h2>

          <motion.div
            className="passport-rsvp-heart-wrap"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08 }}
          >
            <span className="passport-rsvp-heart-line" />
            <motion.img
              src="/images/passport/heart-mini.svg"
              alt=""
              className="passport-rsvp-heart"
              animate={{ scale: [1, 1.08, 1], opacity: [0.9, 1, 0.9] }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span className="passport-rsvp-heart-line" />
          </motion.div>

          <motion.p
            className="passport-rsvp-subtitle"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            Molimo vas da potvrdite svoj dolazak
          </motion.p>

          <motion.div
            className="passport-rsvp-divider"
            initial={{ opacity: 0, scaleX: 0.6 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.14 }}
          />

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                className="passport-rsvp-success"
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -18, scale: 0.96 }}
                transition={{ duration: 0.4 }}
              >
                <motion.img
                  src="/images/passport/heart-mini.svg"
                  alt=""
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <h3>Hvala 💌</h3>
                <p>Vaš odgovor je uspešno zabeležen.</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                className="passport-rsvp-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.4 }}
              >
                <motion.label
                  className="passport-rsvp-input-wrap"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.02 }}
                >
                  <span className="passport-rsvp-label">Ime i prezime</span>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    placeholder="Unesite ime i prezime"
                    className="passport-rsvp-input"
                  />
                </motion.label>

                <div className="passport-rsvp-options">
                  <motion.button
                    type="button"
                    className={`passport-rsvp-option ${
                      formData.attending === "da" ? "active" : ""
                    }`}
                    onClick={() => handleChange("attending", "da")}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.06 }}
                  >
                    <span className="passport-rsvp-option-left">
                      <span className="passport-rsvp-radio" />
                      <img
                        src="/images/passport/guests.svg"
                        alt=""
                        className="passport-rsvp-option-icon"
                      />
                    </span>
                    <span className="passport-rsvp-option-text">
                      Rado dolazimo
                    </span>
                  </motion.button>

                  <motion.button
                    type="button"
                    className={`passport-rsvp-option ${
                      formData.attending === "ne" ? "active" : ""
                    }`}
                    onClick={() => handleChange("attending", "ne")}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <span className="passport-rsvp-option-left">
                      <span className="passport-rsvp-radio" />
                      <img
                        src="/images/passport/icons/close.svg"
                        alt=""
                        className="passport-rsvp-option-icon"
                      />
                    </span>
                    <span className="passport-rsvp-option-text">
                      Nažalost, nismo u mogućnosti
                    </span>
                  </motion.button>
                </div>

                {formData.attending === "da" && (
                  <motion.label
                    className="passport-rsvp-input-wrap passport-rsvp-input-with-icon"
                    initial={{ opacity: 0, height: 0, y: -8 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div style={{ width: "100%" }}>
                      <span className="passport-rsvp-label">Broj gostiju</span>

                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={formData.guests}
                        onChange={(e) => handleChange("guests", e.target.value)}
                        className="passport-rsvp-input"
                      />
                    </div>
                  </motion.label>
                )}

                <motion.button
                  type="submit"
                  className="passport-rsvp-submit"
                  disabled={
                    loading ||
                    !formData.fullName.trim() ||
                    !formData.attending
                  }
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.14 }}
                >
                  {loading ? "Slanje..." : "Pošalji odgovor"}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}

export default PassportRSVP;