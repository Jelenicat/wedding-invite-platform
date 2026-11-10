import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { keepsakeCopy, KeepsakeHeart, KeepsakeReveal, useKeepsakeFonts } from "./KeepsakeCountdown";
import "../styles/newrsvp.css";

const EMPTY = { fullName: "", attending: "", guests: "1", fasting: "", note: "" };

export default function KeepsakeRSVP({ slug, eventType, details = {}, script = "latin", language = "sr" }) {
  useKeepsakeFonts();
  const reduced = useReducedMotion();
  const config = details.keepsake || {};
  const t = keepsakeCopy(script, language, config.copy);
  const id = `keepsake-rsvp-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [formData, setFormData] = useState({ ...EMPTY });
  const [guestNames, setGuestNames] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const submissionLock = useRef(false);
  const mounted = useRef(true);
  const successRef = useRef(null);
  const showFasting = Boolean(details.rsvpOptions?.fasting);
  // Preserve the individual-document exception from the supplied MinimalRSVP.
  const splitGuests = slug === "andjela-andrija-5";
  const deadline = config.rsvpDeadline || details.rsvpDeadline;

  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => {
    if (!submitted) return undefined;
    const focus = window.setTimeout(() => successRef.current?.focus(), reduced ? 0 : 300);
    // Keep the reference component's three-second form reset behavior.
    const timer = window.setTimeout(() => {
      setSubmitted(false); setFormData({ ...EMPTY }); setGuestNames([""]);
    }, 3000);
    return () => { window.clearTimeout(timer); window.clearTimeout(focus); };
  }, [submitted, reduced]);
  useEffect(() => {
    if (!splitGuests) return;
    if (formData.attending !== "da") { setGuestNames([""]); return; }
    const n = Number(formData.guests);
    const count = Number.isInteger(n) && n >= 1 ? Math.min(n, 10) : 1;
    setGuestNames((previous) => Array.from({ length: count }, (_, index) => previous[index] || ""));
  }, [splitGuests, formData.attending, formData.guests]);

  function change(event) {
    const { name, value } = event.target;
    setError("");
    setFormData((previous) => ({ ...previous, [name]: value }));
  }
  function chooseAttendance(value) {
    setError("");
    setFormData((previous) => ({ ...previous, attending: value,
      guests: value === "da" ? previous.guests || "1" : "", fasting: value === "da" ? previous.fasting : "" }));
  }
  function step(delta) {
    setError("");
    setFormData((previous) => {
      const n = Number(previous.guests);
      return { ...previous, guests: String(Math.min(10, Math.max(1, (Number.isInteger(n) ? n : 1) + delta))) };
    });
  }
  function fail(message, field) {
    setError(message);
    if (field) window.requestAnimationFrame(() => document.getElementById(`${id}-${field}`)?.focus());
  }
  async function submit(event) {
    event.preventDefault();
    if (submissionLock.current || details.rsvpClosed) return;
    setError("");
    if (!slug || !eventType) { fail(t.missingSlug); return; }
    if (!splitGuests && !formData.fullName.trim()) { fail(t.enterName, "name"); return; }
    if (!["da", "ne"].includes(formData.attending)) { fail(t.chooseAttendance, "yes"); return; }
    const guestsCount = Number(formData.guests);
    if (formData.attending === "da") {
      if (!Number.isInteger(guestsCount) || guestsCount < 1 || guestsCount > 10) { fail(t.invalidGuests, "guests"); return; }
      if (splitGuests && (guestNames.length !== guestsCount || guestNames.some((name) => !name.trim()))) { fail(t.missingGuestNames, "guest-0"); return; }
      if (showFasting && !["posti", "ne_posti"].includes(formData.fasting)) { fail(t.chooseFasting, "fasting-yes"); return; }
    }
    if (splitGuests && formData.attending === "ne" && !formData.fullName.trim()) { fail(t.enterName, "name"); return; }
    submissionLock.current = true;
    setLoading(true);
    try {
      // Same parent document, merge option, collection, field names and enum
      // values as MinimalRSVP. A nonempty optional note is stored as `note`.
      await setDoc(doc(db, "events", slug), { slug, eventType, updatedAt: serverTimestamp() }, { merge: true });
      const optionalNote = formData.note.trim() ? { note: formData.note.trim() } : {};
      if (splitGuests && formData.attending === "da") {
        const submissionGroupId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
        await Promise.all(guestNames.slice(0, guestsCount).map((name) => addDoc(collection(db, "events", slug, "rsvps"), {
          eventType, fullName: name.trim(), attending: "da", guests: 1,
          fasting: showFasting ? formData.fasting : "", submissionGroupId, ...optionalNote, createdAt: serverTimestamp(),
        })));
      } else {
        await addDoc(collection(db, "events", slug, "rsvps"), {
          eventType, fullName: formData.fullName.trim(), attending: formData.attending,
          guests: formData.attending === "da" ? guestsCount : 0,
          fasting: formData.attending === "da" && showFasting ? formData.fasting : "",
          ...optionalNote, createdAt: serverTimestamp(),
        });
      }
      if (mounted.current) setSubmitted(true);
    } catch (cause) {
      console.error("Keepsake RSVP:", cause);
      if (mounted.current) setError(t.submitError);
    } finally {
      submissionLock.current = false;
      if (mounted.current) setLoading(false);
    }
  }

  const reveal = { initial: reduced ? false : { opacity: 0, y: 9 }, animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reduced ? 0 : -6 }, transition: { duration: reduced ? 0 : 0.24 } };
  return <section className="keepsake-rsvp" id="keepsake-rsvp" data-script={script}>
    <KeepsakeReveal className="keepsake-rsvp-inner">
      <header className="keepsake-rsvp-heading"><h2>{config.rsvpTitle || t.rsvp}</h2><p>{t.rsvpScript}</p></header>
      {details.rsvpClosed ? <p className="keepsake-rsvp-closed" role="status">{config.rsvpClosedText || t.closed}</p> : <>
        <p className="keepsake-rsvp-description">{details.rsvpText || t.rsvpText}</p>
        {deadline && <p className="keepsake-rsvp-deadline">{t.deadline} <strong>{deadline}</strong></p>}
        <AnimatePresence mode="wait" initial={false}>
          {submitted ? <motion.div key="success" className="keepsake-rsvp-success" {...reveal} role="status" tabIndex={-1} ref={successRef}>
            <KeepsakeHeart className="keepsake-rsvp-success-heart" /><h3>{t.thanks}</h3><p>{t.success}</p>
            <p>{formData.attending === "da" ? t.successYes : t.successNo}</p>
          </motion.div> : <motion.form key="form" className="keepsake-rsvp-form" {...reveal} onSubmit={submit} noValidate aria-busy={loading}
            aria-describedby={error ? `${id}-error` : undefined}>
            <fieldset className="keepsake-rsvp-fields" disabled={loading}>
              {(!splitGuests || formData.attending === "ne") && <div className="keepsake-rsvp-field">
                <label htmlFor={`${id}-name`}>{t.fullName}</label><input id={`${id}-name`} name="fullName" value={formData.fullName} onChange={change}
                  placeholder={t.namePlaceholder} autoComplete="name" maxLength={160} required />
              </div>}
              <fieldset className="keepsake-rsvp-radios"><legend>{t.attendance}</legend>
                <label className="keepsake-rsvp-radio"><input id={`${id}-yes`} type="radio" name="attending" value="da" checked={formData.attending === "da"}
                  onChange={() => chooseAttendance("da")} required /><span>{t.yes}</span></label>
                <label className="keepsake-rsvp-radio"><input type="radio" name="attending" value="ne" checked={formData.attending === "ne"}
                  onChange={() => chooseAttendance("ne")} required /><span>{t.no}</span></label>
              </fieldset>
              <AnimatePresence initial={false}>
                {formData.attending === "da" && <motion.div key="attendance-details" className="keepsake-rsvp-attendance-details" {...reveal}>
                  <div className="keepsake-rsvp-field"><label htmlFor={`${id}-guests`}>{t.guests}</label>
                    <div className="keepsake-rsvp-stepper">
                      <button type="button" aria-label={t.less} onClick={() => step(-1)} disabled={Number(formData.guests) <= 1}>
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg></button>
                      <input id={`${id}-guests`} type="number" name="guests" min="1" max="10" step="1" inputMode="numeric" value={formData.guests} onChange={change} required />
                      <button type="button" aria-label={t.more} onClick={() => step(1)} disabled={Number(formData.guests) >= 10}>
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5v14" /></svg></button>
                    </div>
                  </div>
                  {splitGuests && <div className="keepsake-rsvp-guest-names"><p>{t.namesTitle}</p>
                    {guestNames.map((name, index) => <div className="keepsake-rsvp-field" key={index}>
                      <label htmlFor={`${id}-guest-${index}`}>{t.guestLabel} {index + 1}</label>
                      <input id={`${id}-guest-${index}`} value={name} maxLength={160} placeholder={t.namePlaceholder} required
                        onChange={(event) => { const value = event.target.value; setGuestNames((previous) => previous.map((item, i) => i === index ? value : item)); }} />
                    </div>)}
                  </div>}
                  {showFasting && <fieldset className="keepsake-rsvp-radios keepsake-rsvp-fasting"><legend>{t.fasting}</legend>
                    <label className="keepsake-rsvp-radio"><input id={`${id}-fasting-yes`} type="radio" name="fasting" value="posti" checked={formData.fasting === "posti"} onChange={change} required /><span>{t.fastingYes}</span></label>
                    <label className="keepsake-rsvp-radio"><input type="radio" name="fasting" value="ne_posti" checked={formData.fasting === "ne_posti"} onChange={change} required /><span>{t.fastingNo}</span></label>
                  </fieldset>}
                </motion.div>}
              </AnimatePresence>
              <div className="keepsake-rsvp-field keepsake-rsvp-note"><label htmlFor={`${id}-note`}>{t.note} <span>({t.optional})</span></label>
                <textarea id={`${id}-note`} name="note" rows="3" maxLength={1000} value={formData.note} onChange={change} placeholder={t.notePlaceholder} />
              </div>
              {error && <p className="keepsake-rsvp-error" id={`${id}-error`} role="alert">{error}</p>}
              <button className="keepsake-rsvp-submit" type="submit" disabled={loading}>{loading ? t.sending : t.submit}
                {loading ? <span className="keepsake-rsvp-spinner" aria-hidden="true" /> : <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>}
              </button>
            </fieldset>
          </motion.form>}
        </AnimatePresence>
      </>}
    </KeepsakeReveal>
  </section>;
}
