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

function FloralRSVP({ slug, eventType, rsvpOptions = {} }) {
  const initialFormData = {
    fullName: "",
    attending: "",
    guests: "1",
    foodPreferences: "",
    musicWish: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const showFoodPreferences = rsvpOptions?.foodPreferences;
  const showMusicWish = rsvpOptions?.musicWish;

  const showGuestField = formData.attending === "da";
  const showOptionalFields =
    formData.attending === "da" &&
    (showFoodPreferences || showMusicWish);

  useEffect(() => {
    if (!submitted) return;

    const timer = setTimeout(() => {
      setSubmitted(false);
      setErrorMessage("");
      setFormData(initialFormData);
    }, 3000);

    return () => clearTimeout(timer);
  }, [submitted]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (errorMessage) {
      setErrorMessage("");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAttendanceSelect = (value) => {
    if (errorMessage) {
      setErrorMessage("");
    }

    setFormData((prev) => ({
      ...prev,
      attending: value,
      guests: value === "da" ? prev.guests || "1" : "",
      foodPreferences: value === "da" ? prev.foodPreferences : "",
      musicWish: value === "da" ? prev.musicWish : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!slug || !eventType) {
      setErrorMessage(
        "Došlo je do greške pri učitavanju pozivnice. Pokušajte ponovo."
      );
      return;
    }

    if (!formData.fullName.trim()) {
      setErrorMessage("Unesite ime i prezime.");
      return;
    }

    if (!formData.attending) {
      setErrorMessage("Izaberite da li dolazite.");
      return;
    }

    const guestsCount = Number(formData.guests);

    if (formData.attending === "da") {
      if (!formData.guests || Number.isNaN(guestsCount) || guestsCount < 1) {
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

      await addDoc(collection(db, "events", slug, "rsvps"), {
        eventType,
        fullName: formData.fullName.trim(),
        attending: formData.attending,
        guests: formData.attending === "da" ? guestsCount : 0,
        foodPreferences:
          formData.attending === "da" && showFoodPreferences
            ? formData.foodPreferences.trim()
            : "",
        musicWish:
          formData.attending === "da" && showMusicWish
            ? formData.musicWish.trim()
            : "",
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
      setErrorMessage("");
    } catch (error) {
      console.error("Greška pri slanju RSVP:", error);
      setErrorMessage(
        "Slanje trenutno nije uspelo. Pokušajte ponovo za nekoliko trenutaka."
      );
    } finally {
      setLoading(false);
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1,
        delayChildren: 0.06,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const softScale = {
    hidden: { opacity: 0, y: 18, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const expandBlock = {
    initial: { opacity: 0, y: 14, height: 0 },
    animate: {
      opacity: 1,
      y: 0,
      height: "auto",
      transition: {
        height: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 0.3 },
        y: { duration: 0.35 },
      },
    },
    exit: {
      opacity: 0,
      y: -8,
      height: 0,
      transition: {
        height: { duration: 0.32, ease: [0.4, 0, 1, 1] },
        opacity: { duration: 0.2 },
        y: { duration: 0.22 },
      },
    },
  };

  return (
    <motion.section
      className="floral-rsvp-section"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <div className="floral-rsvp-shell">
        <motion.div
          className="floral-rsvp-box"
          variants={softScale}
          whileHover={{ y: -3 }}
          transition={{ duration: 0.35 }}
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                className="floral-rsvp-success"
                initial={{ opacity: 0, y: 24, scale: 0.96, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  className="floral-rsvp-success-heart"
                  initial={{ scale: 0, rotate: -12 }}
                  animate={{ scale: [0, 1.18, 1], rotate: [ -12, 6, 0 ] }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  💌
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.12 }}
                >
                  Hvala!
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.18 }}
                >
                  Vaša potvrda je uspešno poslata.
                </motion.p>

                <div className="floral-confetti-wrap">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <motion.span
                      key={i}
                      className="floral-confetti"
                      initial={{ opacity: 0, scale: 0.6, y: 0, x: 0 }}
                      animate={{
                        opacity: [0, 1, 1, 0],
                        scale: [0.6, 1, 0.95],
                        y: 110,
                        x: (i - 9) * 11,
                        rotate: (i - 9) * 9,
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
                initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
                transition={{ duration: 0.45 }}
              >
                <motion.p className="floral-rsvp-kicker" variants={fadeUp}>
                  RSVP
                </motion.p>

                <motion.h2 className="floral-rsvp-title" variants={fadeUp}>
                  Potvrdite dolazak
                </motion.h2>

                <motion.p className="floral-rsvp-subtitle" variants={fadeUp}>
                  Biće nam veliko zadovoljstvo da svojim prisustvom ulepšate naš
                  poseban dan.
                </motion.p>

                <motion.div
                  className="floral-rsvp-divider"
                  variants={fadeUp}
                />

                <motion.form
                  className="floral-rsvp-form"
                  onSubmit={handleSubmit}
                  variants={sectionVariants}
                  initial="hidden"
                  animate="show"
                >
                  <motion.div className="floral-rsvp-field" variants={fadeUp}>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Ime i prezime"
                    />
                  </motion.div>

                  <motion.div
                    className="floral-rsvp-choice-grid"
                    variants={fadeUp}
                  >
                    <motion.button
                      type="button"
                      className={`floral-choice-card ${
                        formData.attending === "da" ? "is-active" : ""
                      }`}
                      onClick={() => handleAttendanceSelect("da")}
                      whileHover={{ y: -3, scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                      animate={
                        formData.attending === "da"
                          ? {
                              scale: 1.02,
                              boxShadow:
                                "0 16px 34px rgba(80, 60, 48, 0.10)",
                            }
                          : {
                              scale: 1,
                              boxShadow:
                                "0 8px 18px rgba(80, 60, 48, 0.05)",
                            }
                      }
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                      Dolazim
                    </motion.button>

                    <motion.button
                      type="button"
                      className={`floral-choice-card ${
                        formData.attending === "ne" ? "is-active" : ""
                      }`}
                      onClick={() => handleAttendanceSelect("ne")}
                      whileHover={{ y: -3, scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                      animate={
                        formData.attending === "ne"
                          ? {
                              scale: 1.02,
                              boxShadow:
                                "0 16px 34px rgba(80, 60, 48, 0.10)",
                            }
                          : {
                              scale: 1,
                              boxShadow:
                                "0 8px 18px rgba(80, 60, 48, 0.05)",
                            }
                      }
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                      Ne dolazim
                    </motion.button>
                  </motion.div>

                  <AnimatePresence initial={false}>
                    {showGuestField && (
                      <motion.div
                        key="guests-field"
                        style={{ overflow: "hidden" }}
                        variants={expandBlock}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <div className="floral-rsvp-field">
                          <label className="floral-rsvp-label">Broj osoba</label>
                          <input
                            type="number"
                            name="guests"
                            value={formData.guests}
                            onChange={handleChange}
                            placeholder="Unesite broj osoba"
                            min="1"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence initial={false}>
                    {showOptionalFields && (
                      <motion.div
                        key="optional-fields"
                        style={{ overflow: "hidden" }}
                        variants={expandBlock}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <div className="floral-rsvp-optional-wrap">
                          {showFoodPreferences && (
                            <motion.div
                              className="floral-rsvp-detail-card"
                              initial={{ opacity: 0, y: 14, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -8, scale: 0.98 }}
                              transition={{ duration: 0.4, delay: 0.02 }}
                            >
                              <div className="floral-rsvp-detail-head">
                                <motion.span
                                  className="floral-rsvp-detail-icon"
                                  initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
                                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                  transition={{ duration: 0.45 }}
                                >
                                  ✿
                                </motion.span>
                                <div>
                                  <h3 className="floral-rsvp-detail-title">
                                    Napomena za hranu
                                  </h3>
                                  <p className="floral-rsvp-detail-text">
                                    Alergije, posebna ishrana ili druge napomene
                                  </p>
                                </div>
                              </div>

                              <div className="floral-rsvp-field floral-rsvp-field-detail">
                                <textarea
                                  name="foodPreferences"
                                  value={formData.foodPreferences}
                                  onChange={handleChange}
                                  placeholder="Napišite napomenu..."
                                />
                              </div>
                            </motion.div>
                          )}

                          {showMusicWish && (
                            <motion.div
                              className="floral-rsvp-detail-card"
                              initial={{ opacity: 0, y: 14, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -8, scale: 0.98 }}
                              transition={{ duration: 0.4, delay: 0.08 }}
                            >
                              <div className="floral-rsvp-detail-head">
                                <motion.span
                                  className="floral-rsvp-detail-icon"
                                  initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
                                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                  transition={{ duration: 0.45 }}
                                >
                                  ♪
                                </motion.span>
                                <div>
                                  <h3 className="floral-rsvp-detail-title">
                                    Muzička želja
                                  </h3>
                                  <p className="floral-rsvp-detail-text">
                                    Pesma koju biste voleli da čujete na slavlju
                                  </p>
                                </div>
                              </div>

                              <div className="floral-rsvp-field floral-rsvp-field-detail">
                                <textarea
                                  name="musicWish"
                                  value={formData.musicWish}
                                  onChange={handleChange}
                                  placeholder="Napišite naziv pesme ili izvođača..."
                                />
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {errorMessage && (
                      <motion.p
                        key="error"
                        className="floral-rsvp-error"
                        role="alert"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                      >
                        {errorMessage}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    className="floral-rsvp-button"
                    disabled={loading}
                    variants={fadeUp}
                    whileHover={!loading ? { y: -3, scale: 1.02 } : {}}
                    whileTap={!loading ? { scale: 0.985 } : {}}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  >
                    {loading ? "Slanje..." : "Pošalji"}
                  </motion.button>
                </motion.form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default FloralRSVP;