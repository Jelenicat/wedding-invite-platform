import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import "../styles/rsvp.css";

function GoldPrintVideoRSVP({
  slug,
  eventType = "wedding",
  brideName,
  groomName,
  details = {},
  script = "cyrillic",
}) {
  const [form, setForm] = useState({
    name: "",
    attending: "",
    guests: 1,
  });

  const [status, setStatus] = useState("idle");
  const [submitted, setSubmitted] = useState(false);

  const isCyrillic = script === "cyrillic";
  const showRsvpPhotoBlock = details?.hideRsvpPhotoBlock !== true;

  const labels = {
    eyebrow: "RSVP",
    title: isCyrillic ? "Потврда доласка" : "Potvrda dolaska",
    subtitle: isCyrillic
      ? "Срећа је стварна само онда када се дијели са онима које волимо. Зато вас позивамо да својом близином, осмијехом и топлином увеличате наш најважнији дан и са нама подијелите радост овог вјечног обећања."
      : "Molimo vas da svoj dolazak potvrdite na vreme.",
    name: isCyrillic ? "Ваше име и презиме" : "Vaše ime i prezime",
    guests: isCyrillic ? "Број гостију" : "Broj gostiju",
    guestsNote: isCyrillic ? "Укључујући вас" : "Uključujući vas",
    yes: isCyrillic ? "Долазим" : "Dolazim",
    no: isCyrillic ? "Не долазим" : "Ne dolazim",
    submit: isCyrillic ? "Пошаљи потврду" : "Pošalji potvrdu",
    sending: isCyrillic ? "Шаље се..." : "Šalje se...",
    thanks: isCyrillic ? "Хвала!" : "Hvala!",
    success: isCyrillic
      ? "Ваша потврда је успешно послата."
      : "Vaša potvrda je uspešno poslata.",
    error: isCyrillic
      ? "Молимо унесите име и изаберите одговор."
      : "Molimo unesite ime i izaberite odgovor.",
  };

  const photoTitle =
    details?.rsvpPhotoTitle ||
    (isCyrillic ? "Радујемо се вашем доласку!" : "Radujemo se vašem dolasku!");

  const photoNamesText =
    details?.rsvpPhotoText || `${brideName} & ${groomName}`;

  const photoSrc =
    details?.rsvpImage ||
    details?.editorialImage1 ||
    details?.photo ||
    "/images/italian-rsvp/demo-photo.jpg";

  const rsvpSubtitle = details?.note || details?.rsvpText || labels.subtitle;

  useEffect(() => {
    if (!submitted) return;

    const timer = setTimeout(() => {
      setSubmitted(false);
      setStatus("idle");

      setForm({
        name: "",
        attending: "",
        guests: 1,
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [submitted]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (status === "error") {
      setStatus("idle");
    }
  };

  const incrementGuests = () => {
    setForm((prev) => ({
      ...prev,
      guests: Math.min(Number(prev.guests) + 1, 10),
    }));
  };

  const decrementGuests = () => {
    setForm((prev) => ({
      ...prev,
      guests: Math.max(Number(prev.guests) - 1, 1),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!slug || !eventType) {
      console.error("Nedostaje slug ili eventType za GoldPrintVideo RSVP:", {
        slug,
        eventType,
      });
      setStatus("error");
      return;
    }

    if (!form.name.trim() || !form.attending) {
      setStatus("error");
      return;
    }

    const guestsCount = Number(form.guests);

    if (
      form.attending === "yes" &&
      (!form.guests || Number.isNaN(guestsCount) || guestsCount < 1)
    ) {
      setStatus("error");
      return;
    }

    try {
      setStatus("sending");

      await setDoc(
        doc(db, "events", slug),
        {
          slug,
          eventType,
          brideName,
          groomName,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await addDoc(collection(db, "events", slug, "rsvps"), {
        eventType,
        fullName: form.name.trim(),
        attending: form.attending === "yes" ? "da" : "ne",
        guests: form.attending === "yes" ? guestsCount : 0,
        brideName,
        groomName,
        createdAt: serverTimestamp(),
      });

      setStatus("idle");
      setSubmitted(true);
    } catch (error) {
      console.error("Greška pri slanju GoldPrintVideo RSVP:", error);
      setStatus("error");
    }
  };

  return (
    <section className="goldprint-video-rsvp-section">
      <motion.div
        className="goldprint-video-rsvp-shell"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              className="goldprint-video-rsvp-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="goldprint-video-rsvp-success-heart"
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: [0, 1.2, 1], rotate: [0, 8, -8, 0] }}
                transition={{ duration: 0.9 }}
              >
                💌
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.45 }}
              >
                {labels.thanks}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.45 }}
              >
                {labels.success}
              </motion.p>

              <div className="goldprint-video-rsvp-confetti-wrap">
                {Array.from({ length: 18 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="goldprint-video-rsvp-confetti"
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
              <div className="goldprint-video-rsvp-heading">
                <p className="goldprint-video-rsvp-eyebrow">{labels.eyebrow}</p>

                <h2 className="goldprint-video-rsvp-title">{labels.title}</h2>

                <p className="goldprint-video-rsvp-subtitle">{rsvpSubtitle}</p>

                <div className="goldprint-video-rsvp-ornament">
                  <span />
                  <em>♡</em>
                  <span />
                </div>
              </div>

              <form className="goldprint-video-rsvp-form" onSubmit={handleSubmit}>
                <label className="goldprint-video-rsvp-field">
                  <span>{labels.name}</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder={labels.name}
                    disabled={status === "sending"}
                  />
                </label>

                <div className="goldprint-video-rsvp-attendance">
                  <button
                    type="button"
                    className={`goldprint-video-rsvp-attendance-card ${
                      form.attending === "yes" ? "is-active" : ""
                    }`}
                    onClick={() => handleChange("attending", "yes")}
                    disabled={status === "sending"}
                  >
                    <span className="goldprint-video-rsvp-choice-icon">♡</span>
                    <strong>{labels.yes}</strong>
                  </button>

                  <button
                    type="button"
                    className={`goldprint-video-rsvp-attendance-card ${
                      form.attending === "no" ? "is-active" : ""
                    }`}
                    onClick={() => handleChange("attending", "no")}
                    disabled={status === "sending"}
                  >
                    <span className="goldprint-video-rsvp-choice-icon">×</span>
                    <strong>{labels.no}</strong>
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {form.attending === "yes" && (
                    <motion.div
                      className="goldprint-video-rsvp-guests-box"
                      initial={{ opacity: 0, height: 0, y: 6 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -4 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div>
                        <span className="goldprint-video-rsvp-guests-label">
                          {labels.guests}
                        </span>
                        <p>{labels.guestsNote}</p>
                      </div>

                      <div className="goldprint-video-rsvp-stepper">
                        <button
                          type="button"
                          onClick={decrementGuests}
                          aria-label="Смањи број гостију"
                          disabled={status === "sending"}
                        >
                          −
                        </button>

                        <strong>{form.guests}</strong>

                        <button
                          type="button"
                          onClick={incrementGuests}
                          aria-label="Повећај број гостију"
                          disabled={status === "sending"}
                        >
                          +
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  className="goldprint-video-rsvp-submit"
                  type="submit"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? labels.sending : labels.submit}
                </button>

                {status === "error" && (
                  <p className="goldprint-video-rsvp-status is-error">
                    {labels.error}
                  </p>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {showRsvpPhotoBlock && (
        <motion.div
          className="goldprint-video-rsvp-photo-block"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.9,
            delay: 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="goldprint-video-rsvp-photo-top">
            <p className="goldprint-video-rsvp-photo-script">{photoTitle}</p>

            <h3 className="goldprint-video-rsvp-photo-names">
              {photoNamesText}
            </h3>
          </div>

          <div className="goldprint-video-rsvp-photo-divider" />
          <div className="goldprint-video-rsvp-photo-heart">♡</div>

          <div className="goldprint-video-rsvp-photo-wrap">
            <img
              src={photoSrc}
              alt={photoNamesText}
              className="goldprint-video-rsvp-photo"
            />
          </div>
        </motion.div>
      )}
    </section>
  );
}

export default GoldPrintVideoRSVP;
