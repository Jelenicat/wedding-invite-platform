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

function ElegantBlackRSVP({
  slug,
  eventType,
  backgroundImage,
  brideName,
  groomName,
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
          top: "МОЛИМО ВАС ДА ПОТВРДИТЕ ДОЛАЗАК",
          title: "RSVP",
          subtitle:
            "Биће нам велико задовољство да овај дан поделимо са вама.",
          fullName: "Име и презиме",
          fullNamePlaceholder: "Унесите име и презиме",
          attendance: "Да ли долазите?",
          yes: "Да, долазим",
          no: "Нажалост, не долазим",
          guests: "Број гостију",
          button: "Пошаљи потврду",
          sending: "Слање...",
          success: "Хвала вам",
          successText: "Ваш одговор је успешно забележен.",
          missingSlug: "Недостаје slug или тип догађаја.",
          enterName: "Унесите име и презиме.",
          chooseAttendance: "Изаберите да ли долазите.",
          invalidGuests: "Унесите исправан број гостију.",
          submitError: "Дошло је до грешке при слању.",
        }
      : {
          top: "MOLIMO VAS DA POTVRDITE DOLAZAK",
          title: "RSVP",
          subtitle:
            "Biće nam veliko zadovoljstvo da ovaj dan podelimo sa vama.",
          fullName: "Ime i prezime",
          fullNamePlaceholder: "Unesite ime i prezime",
          attendance: "Da li dolazite?",
          yes: "Da, dolazim",
          no: "Nažalost, ne dolazim",
          guests: "Broj gostiju",
          button: "Pošalji potvrdu",
          sending: "Slanje...",
          success: "Hvala vam",
          successText: "Vaš odgovor je uspešno zabeležen.",
          missingSlug: "Nedostaje slug ili tip događaja.",
          enterName: "Unesite ime i prezime.",
          chooseAttendance: "Izaberite da li dolazite.",
          invalidGuests: "Unesite ispravan broj gostiju.",
          submitError: "Došlo je do greške pri slanju.",
        };

  const bg = backgroundImage || `/images/elegant-black/${slug}-intro.jpg`;
  const topOrnament = `/images/elegant-black/gore.svg`;
  const bottomOrnament = `/images/elegant-black/dole.svg`;

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

  const handleAttendance = (value) => {
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
          brideName: brideName || "",
          groomName: groomName || "",
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
      console.error("RSVP submit error:", error);
      alert(t.submitError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="elegant-black-rsvp-section">
      <div
        className="elegant-black-rsvp-bg"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="elegant-black-rsvp-overlay" />
      <div className="elegant-black-rsvp-vignette" />

      <motion.div
        className="elegant-black-rsvp-card"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="elegant-black-rsvp-top">{t.top}</p>

        <img
          src={topOrnament}
          alt=""
          className="elegant-black-rsvp-ornament elegant-black-rsvp-ornament-top"
        />

        <h2 className="elegant-black-rsvp-title">{t.title}</h2>
        <p className="elegant-black-rsvp-subtitle">{t.subtitle}</p>

        <img
          src={bottomOrnament}
          alt=""
          className="elegant-black-rsvp-ornament elegant-black-rsvp-ornament-bottom"
        />

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              className="elegant-black-rsvp-success"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.5 }}
            >
              <h3>{t.success}</h3>
              <p>{t.successText}</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              className="elegant-black-rsvp-form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="elegant-black-rsvp-field">
                <label htmlFor="elegant-black-fullName">{t.fullName}</label>
                <input
                  id="elegant-black-fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder={t.fullNamePlaceholder}
                  required
                />
              </div>

              <div className="elegant-black-rsvp-field">
                <label>{t.attendance}</label>

                <div className="elegant-black-rsvp-choice-row">
                  <button
                    type="button"
                    className={`elegant-black-rsvp-choice ${
                      formData.attending === "da" ? "active" : ""
                    }`}
                    onClick={() => handleAttendance("da")}
                  >
                    {t.yes}
                  </button>

                  <button
                    type="button"
                    className={`elegant-black-rsvp-choice ${
                      formData.attending === "ne" ? "active" : ""
                    }`}
                    onClick={() => handleAttendance("ne")}
                  >
                    {t.no}
                  </button>
                </div>
              </div>

              <input
                type="hidden"
                name="attending"
                value={formData.attending}
                required
              />

              {formData.attending === "da" && (
                <div className="elegant-black-rsvp-field">
                  <label htmlFor="elegant-black-guests">{t.guests}</label>
                  <select
                    id="elegant-black-guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    required
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={String(num)}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="elegant-black-rsvp-submit"
                disabled={loading}
              >
                {loading ? t.sending : t.button}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

export default ElegantBlackRSVP;