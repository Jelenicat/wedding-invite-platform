import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import "../styles/rsvp.css";

function SilkPhotoRSVP({ slug, eventType, details = {}, script = "latin" }) {
  const isCyrillic = script === "cyrillic" || details.script === "cyrillic";

  const t = isCyrillic
    ? {
        kicker: "Потврда доласка",
        title: "Радујемо се вашем одговору",
        subtitle: "Молимо вас да потврдите долазак у назначеном року.",
        fullName: "Име и презиме",
        fullNamePlaceholder: "Унесите име и презиме",
        attendance: "Да ли долазите?",
        yes: "Долазим",
        no: "Не долазим",
        guests: "Број особа",
        fasting: "Избор менија",
        fastingYes: "Постим",
        fastingNo: "Не постим",
        submit: "Пошаљи потврду",
        loading: "Слање...",
        thankYou: "Хвала вам",
        success: "Ваша потврда је успешно послата.",
        error: "Грешка при слању RSVP потврде:",
      }
    : {
        kicker: "Potvrda dolaska",
        title: "Radujemo se vašem odgovoru",
        subtitle: "Molimo vas da potvrdite dolazak u naznačenom roku.",
        fullName: "Ime i prezime",
        fullNamePlaceholder: "Unesite ime i prezime",
        attendance: "Da li dolazite?",
        yes: "Dolazim",
        no: "Ne dolazim",
        guests: "Broj osoba",
        fasting: "Izbor menija",
        fastingYes: "Postim",
        fastingNo: "Ne postim",
        submit: "Pošalji potvrdu",
        loading: "Slanje...",
        thankYou: "Hvala vam",
        success: "Vaša potvrda je uspešno poslata.",
        error: "Greška pri slanju RSVP potvrde:",
      };

  const [formData, setFormData] = useState({
    fullName: "",
    attending: "",
    guests: "1",
    fasting: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const theme = details.theme || {};
  const maxGuests = Number(details.rsvpMaxGuests) || 10;
  const showFastingOption = details.showFastingOption === true;
  const sectionImage =
    details.rsvpBackgroundImage ||
    details.sectionBackgroundImage ||
    details.cardBackgroundImage;

  const sectionStyle = {
    "--silk-photo-section-bg": theme.backgroundColor || "#eee7df",
    "--silk-photo-main-text": theme.mainText || "#58483f",
    "--silk-photo-soft-text": theme.softText || "#7d6b60",
    "--silk-photo-accent": theme.accent || "#b79163",
    "--silk-photo-accent-strong": theme.accentStrong || "#8d6742",
    "--silk-photo-button-text": theme.rsvpButtonText || "#fffaf5",
    "--silk-photo-light-panel": theme.cardBg || "rgba(255, 255, 255, 0.62)",
    "--silk-photo-light-border": theme.cardBorder || "rgba(120, 91, 67, 0.18)",
    "--silk-photo-input-bg": theme.inputBg || "rgba(255, 255, 255, 0.58)",
    "--silk-photo-section-overlay":
      theme.sectionOverlay || "rgba(244, 238, 231, 0.9)",
    backgroundImage: sectionImage ? `url(${sectionImage})` : undefined,
    backgroundPosition: details.sectionBackgroundPosition || "center",
  };

  useEffect(() => {
    if (!submitted) return undefined;

    const timer = setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: "",
        attending: "",
        guests: "1",
        fasting: "",
      });
    }, 3500);

    return () => clearTimeout(timer);
  }, [submitted]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setErrorMessage("");
  };

  const chooseAttendance = (attending) => {
    setFormData((previous) => ({
      ...previous,
      attending,
      guests: attending === "da" ? previous.guests || "1" : "",
      fasting: attending === "da" ? previous.fasting : "",
    }));
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!slug || !eventType) {
      setErrorMessage("RSVP konfiguracija nije potpuna.");
      return;
    }

    if (!formData.fullName.trim() || !formData.attending) {
      setErrorMessage(
        isCyrillic
          ? "Попуните име и изаберите да ли долазите."
          : "Popunite ime i izaberite da li dolazite.",
      );
      return;
    }

    const guestsCount = Number(formData.guests);

    if (
      formData.attending === "da" &&
      (!formData.guests ||
        Number.isNaN(guestsCount) ||
        guestsCount < 1 ||
        guestsCount > maxGuests)
    ) {
      setErrorMessage(
        isCyrillic
          ? `Унесите број особа од 1 до ${maxGuests}.`
          : `Unesite broj osoba od 1 do ${maxGuests}.`,
      );
      return;
    }

    if (formData.attending === "da" && showFastingOption && !formData.fasting) {
      setErrorMessage(
        isCyrillic ? "Изаберите опцију менија." : "Izaberite opciju menija.",
      );
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      await setDoc(
        doc(db, "events", slug),
        {
          slug,
          eventType,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      await addDoc(collection(db, "events", slug, "rsvps"), {
        eventType,
        fullName: formData.fullName.trim(),
        attending: formData.attending,
        guests: formData.attending === "da" ? guestsCount : 0,
        ...(showFastingOption && formData.attending === "da"
          ? { fasting: formData.fasting }
          : {}),
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
    } catch (error) {
      console.error(t.error, error);
      setErrorMessage(
        isCyrillic
          ? "Потврда тренутно није послата. Покушајте поново."
          : "Potvrda trenutno nije poslata. Pokušajte ponovo.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      className={`silk-photo-rsvp ${
        isCyrillic ? "silk-photo-rsvp--cyrillic" : ""
      } ${slug ? `silk-photo-rsvp--${slug}` : ""}`}
      style={sectionStyle}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.75 }}
    >
      <div className="silk-photo-section__overlay" />

      <div className="silk-photo-rsvp__shell">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              className="silk-photo-rsvp__success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <span className="silk-photo-rsvp__success-mark">♡</span>
              <h2>{t.thankYou}</h2>
              <p>{t.success}</p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="silk-photo-section__script">
                {details.rsvpKicker || t.kicker}
              </p>
              <h2 className="silk-photo-section__title">
                {details.rsvpTitle || t.title}
              </h2>
              <p className="silk-photo-section__subtitle">
                {details.rsvpSubtitle || t.subtitle}
              </p>

              <div className="silk-photo-section__ornament" aria-hidden="true">
                <span />
                <b>◆</b>
                <span />
              </div>

              <form className="silk-photo-rsvp__form" onSubmit={handleSubmit}>
                <label className="silk-photo-rsvp__field">
                  <span>{t.fullName}</span>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={t.fullNamePlaceholder}
                    autoComplete="name"
                    required
                  />
                </label>

                <fieldset className="silk-photo-rsvp__fieldset">
                  <legend>{t.attendance}</legend>
                  <div className="silk-photo-rsvp__choices">
                    <button
                      type="button"
                      className={formData.attending === "da" ? "is-active" : ""}
                      onClick={() => chooseAttendance("da")}
                    >
                      {t.yes}
                    </button>
                    <button
                      type="button"
                      className={formData.attending === "ne" ? "is-active" : ""}
                      onClick={() => chooseAttendance("ne")}
                    >
                      {t.no}
                    </button>
                  </div>
                </fieldset>

                {formData.attending === "da" && (
                  <motion.div
                    className="silk-photo-rsvp__conditional"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                  >
                    <label className="silk-photo-rsvp__field">
                      <span>{t.guests}</span>
                      <input
                        type="number"
                        name="guests"
                        min="1"
                        max={maxGuests}
                        value={formData.guests}
                        onChange={handleChange}
                        required
                      />
                    </label>

                    {showFastingOption && (
                      <fieldset className="silk-photo-rsvp__fieldset">
                        <legend>{t.fasting}</legend>
                        <div className="silk-photo-rsvp__choices">
                          <button
                            type="button"
                            className={
                              formData.fasting === "da" ? "is-active" : ""
                            }
                            onClick={() =>
                              setFormData((previous) => ({
                                ...previous,
                                fasting: "da",
                              }))
                            }
                          >
                            {t.fastingYes}
                          </button>
                          <button
                            type="button"
                            className={
                              formData.fasting === "ne" ? "is-active" : ""
                            }
                            onClick={() =>
                              setFormData((previous) => ({
                                ...previous,
                                fasting: "ne",
                              }))
                            }
                          >
                            {t.fastingNo}
                          </button>
                        </div>
                      </fieldset>
                    )}
                  </motion.div>
                )}

                {errorMessage && (
                  <p className="silk-photo-rsvp__error" role="alert">
                    {errorMessage}
                  </p>
                )}

                <motion.button
                  type="submit"
                  className="silk-photo-rsvp__submit"
                  disabled={loading}
                  whileTap={{ scale: 0.97 }}
                >
                  {loading ? t.loading : details.rsvpButtonText || t.submit}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

export default SilkPhotoRSVP;
