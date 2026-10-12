import { useEffect, useId, useRef, useState } from "react";
import { collection, doc, serverTimestamp, setDoc, writeBatch } from "firebase/firestore";
import { db } from "../firebase";
import { LUMIERE_ASSETS, LumierePhoto, LumiereIcon, LumiereReveal, lumiereText } from "./LumiereIntro";
import "../styles/newrsvp.css";

export default function LumiereRSVP({ slug, eventType = "wedding", brideName = "", groomName = "", details = {}, script = "latin", language = "sr" }) {
  const t = lumiereText(language, script);
  const config = details.lumiere || {};
  const options = details.rsvpOptions || {};
  const showFasting = Boolean(options.fasting);
  const individualGuests = Boolean(options.individualGuests);
  const id = useId();
  const [fullName, setFullName] = useState("");
  const [attending, setAttending] = useState("");
  const [guests, setGuests] = useState(1);
  const [fasting, setFasting] = useState("");
  const [guestNames, setGuestNames] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const lockRef = useRef(false);
  const pendingRef = useRef(null);
  const nameRef = useRef(null);
  const errorRef = useRef(null);
  const successRef = useRef(null);

  useEffect(() => {
    if (!individualGuests) return;
    const count = Number.isInteger(Number(guests)) ? Math.max(1, Math.min(10, Number(guests))) : 1;
    setGuestNames((previous) => Array.from({ length: count }, (_, index) => previous[index] || ""));
  }, [guests, individualGuests]);
  useEffect(() => { if (error) errorRef.current?.focus({ preventScroll: true }); }, [error]);
  useEffect(() => { if (submitted) successRef.current?.focus({ preventScroll: true }); }, [submitted]);

  const setAttendance = (value) => { setAttending(value); setError(""); if (value === "ne") setFasting(""); };
  const changeCount = (next) => { setGuests(next); setError(""); };

  const submit = async (event) => {
    event.preventDefault();
    if (lockRef.current || loading || submitted || details.rsvpClosed) return;
    setError("");
    if (!slug || !eventType) { setError(t.missingSlug); return; }
    if (!attending) { setError(t.chooseAttendance); return; }
    const count = Number(guests);
    if ((!individualGuests || attending === "ne") && !fullName.trim()) { setError(t.enterName); nameRef.current?.focus(); return; }
    if (attending === "da" && (!Number.isInteger(count) || count < 1 || count > 10)) { setError(t.invalidGuests); return; }
    const names = individualGuests && attending === "da" ? guestNames.slice(0, count).map((name) => name.trim()) : [fullName.trim()];
    if (individualGuests && attending === "da" && (names.length !== count || names.some((name) => !name))) { setError(t.missingNames); return; }
    if (attending === "da" && showFasting && !["posti", "ne_posti"].includes(fasting)) { setError(t.chooseFasting); return; }
    lockRef.current = true;
    setLoading(true);
    try {
      // Ista putanja i ista polja kao u postojećem MinimalRSVP / admin panelu.
      await setDoc(doc(db, "events", slug), { slug, eventType, updatedAt: serverTimestamp() }, { merge: true });
      const fingerprint = JSON.stringify({ slug, eventType, names, attending, count, fasting });
      if (!pendingRef.current || pendingRef.current.fingerprint !== fingerprint) {
        pendingRef.current = {
          fingerprint,
          refs: names.map(() => doc(collection(db, "events", slug, "rsvps"))),
          groupId: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
        };
      }
      // Jedan atomic batch: ili se svi pojedinačni gosti sačuvaju, ili nijedan.
      // Isti ID-jevi se koriste pri ponovljenom pokušaju za isti sadržaj forme.
      const batch = writeBatch(db);
      names.forEach((name, index) => {
        const payload = {
          eventType, fullName: name, attending,
          guests: attending === "da" ? (individualGuests ? 1 : count) : 0,
          fasting: attending === "da" && showFasting ? fasting : "",
          createdAt: serverTimestamp(),
        };
        if (individualGuests && attending === "da") payload.submissionGroupId = pendingRef.current.groupId;
        batch.set(pendingRef.current.refs[index], payload);
      });
      await batch.commit();
      pendingRef.current = null;
      setSubmitted(true);
    } catch (err) {
      console.error("Lumiere RSVP:", err);
      setError(t.submitError);
    } finally { lockRef.current = false; setLoading(false); }
  };

  const reset = () => { setSubmitted(false); setFullName(""); setAttending(""); setGuests(1); setFasting(""); setGuestNames([""]); setError(""); pendingRef.current = null; };
  const deadline = config.rsvpDeadline || details.rsvpDeadline;

  return <section className="lmv lmv-rsvp" data-script={script} aria-label={t.rsvpTitle}>
    <LumierePhoto src={config.rsvpImage || config.venueImage || LUMIERE_ASSETS.venue} className="lmv-rsvp-backdrop" parallax={false} />
    <div className="lmv-wrap lmv-rsvp-paper">
      <div className="lmv-reply-mark" aria-hidden="true"><span>RSVP</span><span>{brideName.trim().charAt(0)} &amp; {groomName.trim().charAt(0)}</span></div>
      {details.rsvpClosed ? <LumiereReveal className="lmv-rsvp-closed"><LumiereIcon name="envelope" size={40} /><h2 className="lmv-heading">{t.closed}</h2><p className="lmv-body">{config.closedText || t.closedNote}</p></LumiereReveal> : submitted ? <div className="lmv-rsvp-success" ref={successRef} role="status" tabIndex={-1}>
        <div className="lmv-petals" aria-hidden="true">{Array.from({ length: 13 }, (_, i) => <span key={i} className="lmv-petal" style={{ "--i": i }} />)}</div>
        <div className="lmv-success-seal" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M5 16 12 23 27 8" /></svg></div><h2 className="lmv-heading">{t.thanks}</h2><p className="lmv-body">{t.success}</p><p className="lmv-body">{attending === "da" ? t.successYes : t.successNo}</p><p className="lmv-rsvp-signature">{details.rsvpSignature || `${brideName} & ${groomName}`}</p><button className="lmv-new-rsvp" type="button" onClick={reset}>{t.another}</button>
      </div> : <LumiereReveal>
        <header className="lmv-rsvp-head"><p className="lmv-kicker">{t.rsvp}</p><LumiereIcon name="envelope" size={38} /><h2 className="lmv-heading">{config.rsvpTitle || t.rsvpTitle}</h2><p className="lmv-body">{details.rsvpText || t.rsvpNote}</p>{deadline && <p className="lmv-rsvp-deadline">{t.deadline} {deadline}</p>}</header>
        <form className="lmv-rsvp-form" onSubmit={submit} noValidate aria-busy={loading}>
          <fieldset className="lmv-fields" disabled={loading}>
            {(!individualGuests || attending === "ne") && <div className="lmv-rsvp-field"><label className="lmv-rsvp-label" htmlFor={`${id}-name`}>{t.fullName}</label><input ref={nameRef} id={`${id}-name`} className="lmv-rsvp-input" name="fullName" type="text" autoComplete="name" maxLength={150} value={fullName} onChange={(event) => { setFullName(event.target.value); setError(""); }} placeholder={t.namePlaceholder} required /></div>}
            <fieldset className="lmv-rsvp-choice"><legend>{t.attendance}</legend><div className="lmv-choice-grid">{[["da", t.yes, t.yesNote], ["ne", t.no, t.noNote]].map(([value, label, note]) => <label key={value} className={`lmv-choice ${attending === value ? "is-active" : ""}`}><input className="lmv-sr-only" type="radio" name={`${id}-attendance`} value={value} checked={attending === value} onChange={() => setAttendance(value)} required /><span className="lmv-choice-title">{label}</span><span className="lmv-choice-note">{note}</span></label>)}</div></fieldset>
            {attending === "da" && <div className="lmv-extra-fields">
              <div className="lmv-stepper-row"><div className="lmv-stepper-copy"><label className="lmv-rsvp-label" htmlFor={`${id}-guests`}>{t.guests}</label><p className="lmv-stepper-hint">{t.guestsHint}</p></div><div className="lmv-stepper"><button type="button" aria-label={t.fewer} disabled={Number(guests) <= 1} onClick={() => changeCount(Math.max(1, (Number(guests) || 1) - 1))}>−</button><input id={`${id}-guests`} name="guests" type="number" min={1} max={10} step={1} inputMode="numeric" value={guests} onChange={(event) => changeCount(event.target.value)} required /><button type="button" aria-label={t.more} disabled={Number(guests) >= 10} onClick={() => changeCount(Math.min(10, (Number(guests) || 1) + 1))}>+</button></div></div>
              {individualGuests && <div className="lmv-guest-names"><p className="lmv-kicker">{t.guestNames}</p>{guestNames.map((name, index) => <div className="lmv-rsvp-field" key={index}><label className="lmv-rsvp-label" htmlFor={`${id}-guest-${index}`}>{t.guest} {index + 1}</label><input id={`${id}-guest-${index}`} className="lmv-rsvp-input" type="text" autoComplete={index === 0 ? "name" : "off"} maxLength={150} value={name} onChange={(event) => { const value = event.target.value; setGuestNames((previous) => previous.map((item, i) => i === index ? value : item)); setError(""); }} placeholder={t.namePlaceholder} required /></div>)}</div>}
              {showFasting && <fieldset className="lmv-rsvp-choice"><legend>{t.fasting}</legend><div className="lmv-choice-grid">{[["posti", t.fastingYes], ["ne_posti", t.fastingNo]].map(([value, label]) => <label className={`lmv-choice lmv-choice--small ${fasting === value ? "is-active" : ""}`} key={value}><input className="lmv-sr-only" type="radio" name={`${id}-fasting`} value={value} checked={fasting === value} onChange={() => { setFasting(value); setError(""); }} required /><span className="lmv-choice-title">{label}</span></label>)}</div></fieldset>}
            </div>}
          </fieldset>
          {error && <p className="lmv-rsvp-error" ref={errorRef} role="alert" tabIndex={-1}>{error}</p>}
          <button className="lmv-button lmv-button--solid" type="submit" disabled={loading}><span>{loading ? t.sending : t.submit}</span><span className="lmv-arrow" aria-hidden="true">{loading ? "· · ·" : "↗"}</span></button>
        </form>
        <p className="lmv-rsvp-signature">{details.rsvpSignature || `${brideName} & ${groomName}`}</p>
      </LumiereReveal>}
    </div>
  </section>;
}
