import { useEffect, useId, useRef, useState } from "react";
import { AmoreReveal, AmoreText, amoreText } from "./AmoreCountdown";
import "../styles/newrsvp.css";

// UI pozivnice ne čeka Firestore. Modul se preuzima pri prvom dodiru/fokusu forme.
// Isti promise dele priprema i slanje; neuspešno preuzimanje može da se ponovi.
let firebasePromise;
function loadFirebase() {
  if (!firebasePromise) {
    firebasePromise = Promise.all([import("firebase/firestore"), import("../firebase")])
      .then(([firestore, { db }]) => ({ ...firestore, db }))
      .catch((error) => { firebasePromise = undefined; throw error; });
  }
  return firebasePromise;
}
const prepareFirebase = () => { loadFirebase().catch(() => {}); };

export default function AmoreRSVP({
  slug, eventType = "wedding", brideName = "", groomName = "", details = {}, script = "latin",
}) {
  const t = amoreText(script);
  const config = details.amore || {};
  const options = details.rsvpOptions || {};
  const individual = options.individualGuests === true;
  const showFasting = Boolean(options.fasting);
  const showChildren = options.children === true;
  const showDietary = options.dietary === true;
  const showMessage = options.message === true;
  const maxGuests = Math.max(1, Math.min(50, Math.floor(Number(options.maxGuests)) || 10));
  const id = useId();
  const [fullName, setFullName] = useState("");
  const [attending, setAttending] = useState("");
  const [guests, setGuests] = useState(1);
  const [children, setChildren] = useState(0);
  const [guestNames, setGuestNames] = useState([""]);
  const [fasting, setFasting] = useState("");
  const [dietary, setDietary] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const lock = useRef(false);
  const pending = useRef(null);
  const mounted = useRef(true);
  const nameRef = useRef(null);
  const resultRef = useRef(null);
  const errorRef = useRef(null);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);
  useEffect(() => {
    setGuestNames((previous) => Array.from({ length: guests }, (_, index) => previous[index] || ""));
    setChildren((previous) => Math.min(previous, Math.max(0, guests - 1)));
  }, [guests]);
  useEffect(() => { if (submitted) resultRef.current?.focus({ preventScroll: true }); }, [submitted]);
  useEffect(() => { if (error) errorRef.current?.focus({ preventScroll: true }); }, [error]);

  const changeAttendance = (value) => {
    setAttending(value);
    setError("");
    if (value === "da" && individual) {
      setGuestNames((previous) => Array.from({ length: guests }, (_, index) => previous[index] || (index === 0 ? fullName : "")));
    }
    if (value === "ne") { setChildren(0); setFasting(""); setDietary(""); }
  };
  const changeGuests = (value) => { setGuests(Math.min(maxGuests, Math.max(1, value))); setError(""); };

  const submit = async (event) => {
    event.preventDefault();
    if (lock.current || submitted || details.rsvpClosed) return;
    setError("");
    if (!slug || !eventType) { setError(t.missingSlug); return; }
    if (!["da", "ne"].includes(attending)) { setError(t.chooseAttendance); return; }
    if ((!individual || attending !== "da") && !fullName.trim()) {
      setError(t.enterName); nameRef.current?.focus(); return;
    }
    if (attending === "da" && (!Number.isInteger(guests) || guests < 1 || guests > maxGuests)) { setError(t.invalidGuests); return; }
    if (attending === "da" && showChildren && (!Number.isInteger(children) || children < 0 || children >= guests)) { setError(t.invalidChildren); return; }
    if (attending === "da" && showFasting && !["posti", "ne_posti"].includes(fasting)) { setError(t.chooseFasting); return; }
    const names = attending === "da" && individual
      ? guestNames.slice(0, guests).map((name) => name.trim()) : [fullName.trim()];
    if (names.length !== (attending === "da" && individual ? guests : 1) || names.some((name) => !name)) {
      setError(t.missingNames); return;
    }
    if (navigator.onLine === false) { setError(t.offline); return; }

    lock.current = true;
    setLoading(true);
    const totalChildren = attending === "da" && showChildren ? children : 0;
    const fingerprint = JSON.stringify({
      slug, eventType, names, attending,
      guests: attending === "da" ? guests : 0, children: totalChildren,
      fasting: attending === "da" && showFasting ? fasting : "",
      dietary: attending === "da" && showDietary ? dietary.trim() : "",
      message: showMessage ? message.trim() : "",
    });
    try {
      const { collection, doc, serverTimestamp, setDoc, writeBatch, db } = await loadFirebase();
      // Preuzeta putanja/polja iz postojećeg DentelleRSVP, kompatibilna sa admin panelom.
      // Pri ponovljenom pokušaju istog sadržaja koristimo iste ID-jeve dokumenata.
      if (!pending.current || pending.current.fingerprint !== fingerprint) {
        pending.current = {
          fingerprint,
          refs: names.map(() => doc(collection(db, "events", slug, "rsvps"))),
          groupId: Date.now() + "-" + Math.random().toString(36).slice(2, 10),
        };
      }
      await setDoc(doc(db, "events", slug), { slug, eventType, updatedAt: serverTimestamp() }, { merge: true });
      const batch = writeBatch(db);
      names.forEach((name, index) => {
        const payload = {
          eventType, fullName: name, attending,
          guests: attending === "da" ? (individual ? 1 : guests) : 0,
          fasting: attending === "da" && showFasting ? fasting : "",
          createdAt: serverTimestamp(),
        };
        if (attending === "da" && showChildren && !individual) payload.children = totalChildren;
        if (attending === "da" && showDietary) payload.dietaryRequirements = dietary.trim();
        if (showMessage && message.trim()) payload.note = message.trim();
        if (attending === "da" && individual) {
          payload.submissionGroupId = pending.current.groupId;
          payload.groupGuests = guests;
          if (showChildren) payload.groupChildren = totalChildren;
        }
        batch.set(pending.current.refs[index], payload);
      });
      await batch.commit();
      pending.current = null;
      if (mounted.current) setSubmitted(true);
    } catch (err) {
      console.error("Amore RSVP:", err);
      if (mounted.current) setError(t.submitError);
    } finally {
      lock.current = false;
      if (mounted.current) setLoading(false);
    }
  };

  const reset = () => {
    setFullName(""); setAttending(""); setGuests(1); setChildren(0); setGuestNames([""]);
    setFasting(""); setDietary(""); setMessage(""); setError(""); setSubmitted(false);
    pending.current = null;
    requestAnimationFrame(() => nameRef.current?.focus({ preventScroll: true }));
  };
  const deadline = config.rsvpDeadline || details.rsvpDeadline;

  return <section className="amr-rsvp" id="amore-rsvp" aria-label={t.rsvp}>
    <div className="amr-rsvp-inner">
      <AmoreText text={config.rsvpTitle || t.rsvp} className="amr-script amr-rsvp-title" />
      {details.rsvpClosed ? <div className="amr-rsvp-result">
        <p className="amr-rsvp-result-title">{t.closed}</p><p className="amr-rsvp-note">{t.closedNote}</p>
      </div> : submitted ? <div className="amr-rsvp-result amr-rsvp-success" ref={resultRef} tabIndex={-1} role="status">
        <svg className="amr-success-mark" viewBox="0 0 60 60" fill="none" aria-hidden="true">
          <circle cx="30" cy="30" r="27" /><path d="m17 30 9 9 18-20" pathLength="1" />
        </svg>
        <h3 className="amr-script amr-thank-you">{t.thanks}</h3>
        <p className="amr-rsvp-note">{t.saved}</p>
        <p className="amr-rsvp-note">{attending === "da" ? t.savedYes : t.savedNo}</p>
        <p className="amr-script amr-result-names">{brideName} &amp; {groomName}</p>
        <button type="button" className="amr-rsvp-text-button" onClick={reset}>{t.another}</button>
      </div> : <AmoreReveal className="amr-is-visible">
        <p className="amr-rsvp-note">{details.rsvpText || t.rsvpNote}</p>
        {deadline && <p className="amr-rsvp-deadline">{t.deadline} <strong>{deadline}</strong>.</p>}
        {!deadline && details.note && <p className="amr-rsvp-deadline">{details.note}</p>}
        <form className="amr-rsvp-form" onSubmit={submit} onFocusCapture={prepareFirebase} onPointerDownCapture={prepareFirebase}
          noValidate aria-busy={loading}>
          <fieldset className="amr-rsvp-fields" disabled={loading}>
            {(!individual || attending !== "da") && <div className="amr-field">
              <label htmlFor={`${id}-name`}>{t.fullName}</label>
              <input ref={nameRef} id={`${id}-name`} name="fullName" type="text" autoComplete="name" maxLength={150} required
                placeholder={t.namePlaceholder} value={fullName} onChange={(event) => { setFullName(event.target.value); setError(""); }} />
            </div>}
            <fieldset className="amr-rsvp-choice-field">
              <legend>{t.attendance}</legend>
              <div className="amr-rsvp-choices">
                {[["da", t.yes], ["ne", t.no]].map(([value, label]) => <label className="amr-radio" key={value}>
                  <input type="radio" name={`${id}-attending`} value={value} checked={attending === value} required onChange={() => changeAttendance(value)} />
                  <span><span className="amr-radio-dot" aria-hidden="true" />{label}</span>
                </label>)}
              </div>
            </fieldset>

            {attending === "da" && <div className="amr-rsvp-conditional">
              <div className="amr-field amr-stepper-field">
                <div><label id={`${id}-guests-label`}>{t.guests}</label><p className="amr-field-hint">{t.guestsHint}</p></div>
                <div className="amr-stepper" role="group" aria-labelledby={`${id}-guests-label`}>
                  <button type="button" disabled={guests <= 1} aria-label={t.fewer} onClick={() => changeGuests(guests - 1)}>−</button>
                  <output aria-live="polite">{guests}</output>
                  <button type="button" disabled={guests >= maxGuests} aria-label={t.more} onClick={() => changeGuests(guests + 1)}>+</button>
                </div>
              </div>
              {individual && <fieldset className="amr-guest-names">
                <legend>{t.guestNames}</legend>
                {guestNames.map((name, index) => <div className="amr-field" key={index}>
                  <label htmlFor={`${id}-guest-${index}`}>{t.guest} {index + 1}</label>
                  <input id={`${id}-guest-${index}`} name={`guest-${index}`} type="text" maxLength={150} autoComplete={index === 0 ? "name" : "off"}
                    value={name} required placeholder={t.namePlaceholder} onChange={(event) => {
                      const value = event.target.value;
                      setGuestNames((previous) => previous.map((old, current) => current === index ? value : old)); setError("");
                    }} />
                </div>)}
              </fieldset>}
              {showChildren && <div className="amr-field amr-stepper-field">
                <label id={`${id}-children-label`}>{t.children}</label>
                <div className="amr-stepper" role="group" aria-labelledby={`${id}-children-label`}>
                  <button type="button" disabled={children <= 0} aria-label={`${t.children}: −`} onClick={() => setChildren((n) => Math.max(0, n - 1))}>−</button>
                  <output aria-live="polite">{children}</output>
                  <button type="button" disabled={children >= guests - 1} aria-label={`${t.children}: +`} onClick={() => setChildren((n) => Math.min(guests - 1, n + 1))}>+</button>
                </div>
              </div>}
              {showFasting && <fieldset className="amr-rsvp-choice-field">
                <legend>{t.fasting}</legend><div className="amr-rsvp-choices">
                  {[["posti", t.fastingYes], ["ne_posti", t.fastingNo]].map(([value, label]) => <label className="amr-radio" key={value}>
                    <input type="radio" name={`${id}-fasting`} value={value} checked={fasting === value} onChange={() => { setFasting(value); setError(""); }} />
                    <span><span className="amr-radio-dot" aria-hidden="true" />{label}</span>
                  </label>)}
                </div>
              </fieldset>}
              {showDietary && <div className="amr-field">
                <label htmlFor={`${id}-dietary`}>{t.dietary}</label>
                <textarea id={`${id}-dietary`} rows={2} maxLength={600} value={dietary} onChange={(event) => setDietary(event.target.value)} />
              </div>}
            </div>}
            {showMessage && <div className="amr-field">
              <label htmlFor={`${id}-message`}>{t.message}</label>
              <textarea id={`${id}-message`} rows={2} maxLength={1200} value={message} onChange={(event) => setMessage(event.target.value)} />
            </div>}
          </fieldset>
          {error && <p className="amr-rsvp-error" role="alert" tabIndex={-1} ref={errorRef}>{error}</p>}
          <button className="amr-button amr-submit" type="submit" disabled={loading}>
            {loading && <span className="amr-submit-spinner" aria-hidden="true" />}{loading ? t.sending : t.submit}
          </button>
        </form>
      </AmoreReveal>}
    </div>
  </section>;
}
