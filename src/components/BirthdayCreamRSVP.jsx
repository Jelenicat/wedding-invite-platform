import { useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/birthdayintro.css";
import "../styles/birthdayrsvp.css";

const EMPTY_FORM = { fullName: "", attending: "", guests: "1" };

export default function BirthdayCreamRSVP({
  slug,
  eventType = "birthday",
  brideName,
  details = {},
}) {
  const id = useId();
  const reduceMotion = useReducedMotion();
  const submittingRef = useRef(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const signature = details.rsvpSignature || brideName || "";
  const configuredMax = Number(details.rsvpOptions?.maxGuests);
  const maxGuests = Number.isInteger(configuredMax) && configuredMax > 0 ? configuredMax : 10;

  const change = (event) => {
    const { name, value } = event.target;
    setError("");
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (submittingRef.current || details.rsvpClosed) return;
    setError("");
    if (!slug) {
      setError("Potvrdu trenutno nije moguće poslati. Pokušajte ponovo kasnije.");
      return;
    }
    if (!form.fullName.trim()) {
      setError("Unesite ime i prezime.");
      return;
    }
    if (!["da", "ne"].includes(form.attending)) {
      setError("Izaberite da li dolazite.");
      return;
    }
    const guests = Number(form.guests);
    if (form.attending === "da" && (!Number.isInteger(guests) || guests < 1 || guests > maxGuests)) {
      setError(`Unesite broj osoba od 1 do ${maxGuests}.`);
      return;
    }

    submittingRef.current = true;
    setLoading(true);
    try {
      // Isti put i ista polja koja koristi postojeći admin panel.
      await setDoc(doc(db, "events", slug), {
        slug,
        eventType,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      await addDoc(collection(db, "events", slug, "rsvps"), {
        eventType,
        fullName: form.fullName.trim(),
        attending: form.attending,
        guests: form.attending === "da" ? guests : 0,
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (cause) {
      console.error("Greška pri slanju RSVP:", cause);
      setError("Potvrda nije poslata. Proverite vezu i pokušajte ponovo.");
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  return (
    <section className="mcr-theme mcr-rsvp-section" id="mcr-rsvp" aria-labelledby={`${id}-title`}>
      <motion.div
        className="mcr-rsvp-panel"
        initial={reduceMotion ? false : { opacity: 0, y: 30, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="mcr-eyebrow">Najlepše je zajedno</p>
        <h2 className="mcr-section-title" id={`${id}-title`}>Potvrdite dolazak</h2>
        <p className="mcr-rsvp-intro">{details.rsvpText || "Biće mi drago da ovaj poseban dan provedemo zajedno."}</p>
        {details.rsvpDeadline && <p className="mcr-rsvp-deadline">Molim vas da potvrdite dolazak do <strong>{details.rsvpDeadline}</strong></p>}

        {details.rsvpClosed ? (
          <p className="mcr-rsvp-closed" role="status">Potvrde dolaska su završene. Hvala vam!</p>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            {submitted ? (
              <motion.div
                key="success"
                className="mcr-rsvp-success"
                role="status"
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <svg className="mcr-success-mark" viewBox="0 0 56 56" fill="none" aria-hidden="true">
                  <circle cx="28" cy="28" r="26" /><path d="m17 28 7 7 15-16" />
                </svg>
                <h3>{form.attending === "da" ? "Vidimo se na proslavi!" : "Hvala što ste javili."}</h3>
                <p>Vaša potvrda je uspešno poslata.</p>
                {signature && <p className="mcr-rsvp-signature">{signature}</p>}
                <button className="mcr-text-link" type="button" onClick={() => {
                  setSubmitted(false);
                  setForm(EMPTY_FORM);
                  setError("");
                }}>Pošalji još jednu potvrdu</button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                className="mcr-rsvp-form"
                onSubmit={submit}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                aria-busy={loading}
                aria-describedby={error ? `${id}-error` : undefined}
              >
                <div className="mcr-form-field">
                  <label htmlFor={`${id}-name`}>Ime i prezime</label>
                  <input id={`${id}-name`} name="fullName" type="text" autoComplete="name" maxLength={120}
                    placeholder="Vaše ime i prezime" value={form.fullName} onChange={change} required disabled={loading} />
                </div>
                <fieldset className="mcr-attendance" disabled={loading}>
                  <legend>Da li dolazite?</legend>
                  <div className="mcr-attendance-grid">
                    <label className={`mcr-choice${form.attending === "da" ? " mcr-choice-selected" : ""}`}>
                      <input type="radio" name="attending" value="da" checked={form.attending === "da"} onChange={change} required />
                      <span className="mcr-radio-indicator" aria-hidden="true" />
                      <span>Dolazim</span>
                    </label>
                    <label className={`mcr-choice${form.attending === "ne" ? " mcr-choice-selected" : ""}`}>
                      <input type="radio" name="attending" value="ne" checked={form.attending === "ne"} onChange={change} required />
                      <span className="mcr-radio-indicator" aria-hidden="true" />
                      <span>Ne dolazim</span>
                    </label>
                  </div>
                </fieldset>
                {form.attending === "da" && (
                  <motion.div className="mcr-form-field" initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <label htmlFor={`${id}-guests`}>Broj osoba, uključujući vas</label>
                    <input id={`${id}-guests`} name="guests" type="number" inputMode="numeric" min={1} max={maxGuests} step={1}
                      value={form.guests} onChange={change} required disabled={loading} />
                  </motion.div>
                )}
                {error && <p className="mcr-form-error" id={`${id}-error`} role="alert">{error}</p>}
                <button className="mcr-button mcr-submit-button" type="submit" disabled={loading}>
                  {loading ? "Slanje…" : "Pošalji potvrdu"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </section>
  );
}
