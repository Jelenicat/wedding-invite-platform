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

function SplitVideoRSVP({ slug, eventType, details = {}, script = "latin" }) {
  const isCyrillic =
    script === "cyrillic" || details.script === "cyrillic";

  const t = isCyrillic
    ? {
        thankYou: "Хвала!",
        success: "Ваша потврда је успешно послата.",
        title: "Потврдите долазак",
        subtitle: "Биће нам изузетна част да будете део нашег дана.",
        fullName: "Име и презиме",
        fullNamePlaceholder: "Унесите име и презиме",
        choiceLabel: "Да ли долазите?",
        yes: "Долазим",
        no: "Не долазим",
        guests: "Број особа",
        loading: "Слање...",
        submit: "Пошаљи потврду",
        error: "Грешка при слању RSVP:",
      }
    : {
        thankYou: "Hvala!",
        success: "Vaša potvrda je uspešno poslata.",
        title: "Potvrdite dolazak",
        subtitle: "Biće nam izuzetna čast da budete deo našeg dana.",
        fullName: "Ime i prezime",
        fullNamePlaceholder: "Unesite ime i prezime",
        choiceLabel: "Da li dolazite?",
        yes: "Dolazim",
        no: "Ne dolazim",
        guests: "Broj osoba",
        loading: "Slanje...",
        submit: "Pošalji potvrdu",
        error: "Greška pri slanju RSVP:",
      };

  const [formData, setFormData] = useState({
    fullName: "",
    attending: "",
    guests: "1",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const theme = details.theme || {};

  const themeStyles = {
    "--rsvp-bg": theme.backgroundColor || "#f3ece6",
    "--rsvp-main-text": theme.mainText || "#6f5b4f",
    "--rsvp-soft-text": theme.softText || "#87756a",
    "--rsvp-muted-text": theme.mutedText || "#8c7a6f",
    "--rsvp-accent": theme.accent || "#8f8a64",
    "--rsvp-accent-strong": theme.accentStrong || "#6e5a4e",
    "--rsvp-button-bg": theme.rsvpButtonBg || theme.accent || "#8f8a64",
    "--rsvp-button-text": theme.rsvpButtonText || theme.buttonText || "#fffaf5",
    "--rsvp-card-bg": theme.cardBg || "rgba(255,255,255,0.34)",
    "--rsvp-card-border": theme.cardBorder || "rgba(145,122,108,0.12)",
    "--rsvp-frame-border": theme.frameBorder || "rgba(145,122,108,0.12)",
    "--rsvp-divider": theme.dividerLine || "rgba(145,122,108,0.35)",
    "--rsvp-overlay-top":
      theme.paperOverlayTop || "rgba(247, 238, 233, 0.95)",
    "--rsvp-overlay-bottom":
      theme.paperOverlayBottom || "rgba(243, 231, 225, 0.96)",
    "--rsvp-vignette": theme.vignetteColor || "rgba(0, 0, 0, 0.04)",
    "--rsvp-node-ring": theme.nodeRing || "rgba(143,138,100,0.12)",
  };

  const sectionClassName = `split-video-rsvp-section ${
    isCyrillic ? "split-video-rsvp-section--cyrillic" : ""
  } ${slug ? `split-video-rsvp-${slug}` : ""}`;

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

    if (!slug || !eventType) return;
    if (!formData.fullName.trim()) return;
    if (!formData.attending) return;

    const guestsCount = Number(formData.guests);

    if (formData.attending === "da") {
      if (!formData.guests || Number.isNaN(guestsCount) || guestsCount < 1) {
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
      console.error(t.error, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      className={sectionClassName}
      style={themeStyles}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="split-video-rsvp-shell">
        <div className="split-video-rsvp-box">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                className="split-video-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="split-video-success-heart"
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
                  {t.thankYou}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {t.success}
                </motion.p>

                <div className="split-video-confetti-wrap">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <motion.span
                      key={i}
                      className="split-video-confetti"
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
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.p
                  className="split-video-rsvp-kicker"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  RSVP
                </motion.p>

                <motion.h2
                  className="split-video-rsvp-title"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {t.title}
                </motion.h2>

                <motion.p
                  className="split-video-rsvp-subtitle"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {t.subtitle}
                </motion.p>

                <div className="split-video-rsvp-divider" />

                <form className="split-video-rsvp-form" onSubmit={handleSubmit}>
                  <motion.div
                    className="split-video-rsvp-field"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <label>{t.fullName}</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder={t.fullNamePlaceholder}
                      required
                    />
                  </motion.div>

                  <motion.div
                    className="split-video-rsvp-choice-block"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="split-video-rsvp-choice-label">
                      {t.choiceLabel}
                    </p>

                    <div className="split-video-rsvp-choice-grid">
                      <button
                        type="button"
                        className={`split-video-choice-card ${
                          formData.attending === "da" ? "is-active" : ""
                        }`}
                        onClick={() => handleAttendanceSelect("da")}
                      >
                        {t.yes}
                      </button>

                      <button
                        type="button"
                        className={`split-video-choice-card ${
                          formData.attending === "ne" ? "is-active" : ""
                        }`}
                        onClick={() => handleAttendanceSelect("ne")}
                      >
                        {t.no}
                      </button>
                    </div>
                  </motion.div>

                  {formData.attending === "da" && (
                    <motion.div
                      className="split-video-rsvp-field"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <label>{t.guests}</label>
                      <input
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

                  <motion.button
                    type="submit"
                    className="split-video-rsvp-button"
                    disabled={loading}
                    whileTap={{ scale: 0.96 }}
                  >
                    {loading ? t.loading : t.submit}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}

export default SplitVideoRSVP;