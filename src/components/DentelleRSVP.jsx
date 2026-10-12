import { useEffect, useId, useRef, useState } from "react";
import { collection, doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "../firebase";
import { DentelleIcon, DentelleFlourish, DentelleLace, dentelleText } from "./DentelleIntro";
import "../styles/newrsvp.css";

export default function DentelleRSVP({
  slug, eventType = "wedding", brideName = "", groomName = "", details = {}, script = "latin",
}) {
  const t = dentelleText(script);
  const config = details.dentelle || {};
  const options = details.rsvpOptions || {};
  const showFasting = Boolean(options.fasting);
  const showChildren = options.children !== false;
  const showDietary = options.dietary !== false;
  const individualGuests = Boolean(options.individualGuests);
  const maxGuests = Math.max(1, Math.min(50, Math.floor(Number(options.maxGuests)) || 10));
  const id = useId();
  const [fullName, setFullName] = useState("");
  const [attending, setAttending] = useState("");
  const [guests, setGuests] = useState(1);
  const [children, setChildren] = useState(0);
  const [guestNames, setGuestNames] = useState([]);
  const [fasting, setFasting] = useState("");
  const [dietary, setDietary] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const lock = useRef(false);
  const pending = useRef(null);
  const nameRef = useRef(null);
  const resultRef = useRef(null);
  const errorRef = useRef(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);
  useEffect(() => {
    setGuestNames((previous) => Array.from({ length: Math.max(0, guests - 1) }, (_, index) => previous[index] || ""));
    setChildren((previous) => Math.min(previous, Math.max(0, guests - 1)));
  }, [guests]);
  useEffect(() => { if (submitted) resultRef.current?.focus({ preventScroll: true }); }, [submitted]);
  useEffect(() => { if (error) errorRef.current?.focus({ preventScroll: true }); }, [error]);

  const changeAttendance = (value) => {
    setAttending(value);
    setError("");
    if (value === "ne") {
      setChildren(0);
      setFasting("");
      setDietary("");
    }
  };
  const changeGuests = (value) => {
    setGuests(Math.min(maxGuests, Math.max(1, value)));
    setError("");
  };
  const submit = async (event) => {
    event.preventDefault();
    if (lock.current || submitted || details.rsvpClosed) return;
    setError("");
    if (!slug || !eventType) { setError(t.missingSlug); return; }
    if (!fullName.trim()) { setError(t.enterName); nameRef.current?.focus(); return; }
    if (!["da", "ne"].includes(attending)) { setError(t.chooseAttendance); return; }
    if (attending === "da" && (!Number.isInteger(guests) || guests < 1 || guests > maxGuests)) { setError(t.invalidGuests); return; }
    if (attending === "da" && showChildren && (!Number.isInteger(children) || children < 0 || children >= guests)) { setError(t.invalidChildren); return; }
    if (attending === "da" && showFasting && !["posti", "ne_posti"].includes(fasting)) { setError(t.chooseFasting); return; }
    const names = attending === "da" && individualGuests ? [fullName.trim(), ...guestNames.map((name) => name.trim())] : [fullName.trim()];
    if (individualGuests && attending === "da" && (names.length !== guests || names.some((name) => !name))) { setError(t.missingNames); return; }
    if (navigator.onLine === false) { setError(t.offline); return; }
    lock.current = true;
    setLoading(true);
    const totalChildren = attending === "da" && showChildren ? children : 0;
    const fingerprint = JSON.stringify({ slug, eventType, names, attending, guests, children: totalChildren, fasting, dietary, message });
    try {
      // Putanja i osnovna polja odgovaraju postojećem LumiereRSVP i admin panelu.
      // Isti dokumenti pri ponovnom pokušaju sprečavaju dupliranje iste prijave.
      if (!pending.current || pending.current.fingerprint !== fingerprint) {
        pending.current = {
          fingerprint,
          refs: names.map(() => doc(collection(db, "events", slug, "rsvps"))),
          groupId: Date.now() + "-" + Math.random().toString(36).slice(2, 10),
        };
      }
      const batch = writeBatch(db);
      batch.set(doc(db, "events", slug), { slug, eventType, updatedAt: serverTimestamp() }, { merge: true });
      names.forEach((name, index) => {
        const payload = {
          eventType,
          fullName: name,
          attending,
          guests: attending === "da" ? (individualGuests ? 1 : guests) : 0,
          fasting: attending === "da" && showFasting ? fasting : "",
          createdAt: serverTimestamp(),
          // Dodatna polja ne menjaju postojeća polja koja admin već čita.
          children: individualGuests ? 0 : totalChildren,
          dietaryRequirements: attending === "da" && showDietary ? dietary.trim() : "",
          note: message.trim(),
        };
        if (individualGuests && attending === "da") {
          payload.submissionGroupId = pending.current.groupId;
          payload.groupChildren = totalChildren;
          payload.groupGuests = guests;
        }
        batch.set(pending.current.refs[index], payload);
      });
      await batch.commit();
      pending.current = null;
      if (mounted.current) setSubmitted(true);
    } catch (err) {
      console.error("Dentelle RSVP:", err);
      if (mounted.current) setError(t.submitError);
    } finally {
      lock.current = false;
      if (mounted.current) setLoading(false);
    }
  };

  const reset = () => {
    setFullName(""); setAttending(""); setGuests(1); setChildren(0); setGuestNames([]);
    setFasting(""); setDietary(""); setMessage(""); setError(""); setSubmitted(false);
    pending.current = null;
    requestAnimationFrame(() => nameRef.current?.focus({ preventScroll: true }));
  };
  const deadline = config.rsvpDeadline || details.rsvpDeadline;
  return <section className="dnt dnt-rsvp" data-script={script} aria-label={t.rsvp}>
    <DentelleLace src={config.edgeImage} className="dnt-lace-top" />
    <div className="dnt-rsvp-inner">
      {details.rsvpClosed ? <div className="dnt-rsvp-result">
        <DentelleIcon name="heart" size={74} />
        <h2 className="dnt-heading">{t.closed}</h2>
        <p className="dnt-body">{config.closedText || t.closedNote}</p>
      </div> : submitted ? <div className="dnt-rsvp-result" ref={resultRef} tabIndex={-1} role="status">
        <div className="dnt-success-seal"><DentelleIcon name="check" size={47} /></div>
        <h2 className="dnt-heading">{t.thanks}</h2>
        <p className="dnt-body">{t.saved}</p>
        <p className="dnt-body">{attending === "da" ? t.savedYes : t.savedNo}</p>
        <p className="dnt-rsvp-signature">{brideName} &amp; {groomName}</p>
        <button className="dnt-text-button" type="button" onClick={reset}>{t.another}</button>
      </div> : <>
        <header className="dnt-rsvp-header">
          <DentelleIcon name="heart" size={76} />
          <p className="dnt-kicker">{config.rsvpKicker || t.rsvpKicker}</p>
          <h2 className="dnt-heading">RSVP</h2>
          <p className="dnt-rsvp-title">{config.rsvpTitle || t.rsvp}</p>
          <p className="dnt-body">{details.rsvpText || t.rsvpNote}</p>
          {deadline && <p className="dnt-rsvp-deadline">{t.deadline} <strong>{deadline}</strong></p>}
          <DentelleFlourish />
        </header>
        <form className="dnt-rsvp-form" onSubmit={submit} noValidate aria-busy={loading}>
          <fieldset className="dnt-fields" disabled={loading}>
            <div className="dnt-field">
              <label htmlFor={id + "-name"}>{t.fullName}</label>
              <input ref={nameRef} id={id + "-name"} name="fullName" type="text" autoComplete="name" maxLength={150}
                value={fullName} onChange={(event) => { setFullName(event.target.value); setError(""); }} placeholder={t.namePlaceholder} required />
            </div>
            <fieldset className="dnt-attendance">
              <legend>{t.attendance}</legend>
              <div className="dnt-choice-grid">
                {[["da", t.yes, t.yesNote], ["ne", t.no, t.noNote]].map(([value, label, note]) => <label key={value} className={"dnt-choice " + (attending === value ? "dnt-choice-active" : "")}>
                  <input type="radio" name={id + "-attendance"} value={value} checked={attending === value} onChange={() => changeAttendance(value)} required />
                  <span className="dnt-choice-pearl" aria-hidden="true" />
                  <span className="dnt-choice-copy"><span>{label}</span><small>{note}</small></span>
                </label>)}
              </div>
            </fieldset>
            {attending === "da" && <div className="dnt-rsvp-extra">
              <div className="dnt-stepper-row">
                <div><span id={id + "-guests-label"} className="dnt-field-label">{t.guests}</span><p>{t.guestsHint}</p></div>
                <div className="dnt-stepper">
                  <button type="button" aria-label={t.fewer} disabled={guests <= 1} onClick={() => changeGuests(guests - 1)}>−</button>
                  <output aria-labelledby={id + "-guests-label"} aria-live="polite">{guests}</output>
                  <button type="button" aria-label={t.more} disabled={guests >= maxGuests} onClick={() => changeGuests(guests + 1)}>+</button>
                </div>
              </div>
              {individualGuests && guests > 1 && <div className="dnt-guest-names">
                <p className="dnt-kicker">{t.guestNames}</p>
                {guestNames.map((name, index) => <div className="dnt-field" key={index}>
                  <label htmlFor={id + "-guest-" + index}>{t.guest} {index + 2}</label>
                  <input id={id + "-guest-" + index} type="text" maxLength={150} autoComplete="off" value={name}
                    onChange={(event) => { const value = event.target.value; setGuestNames((previous) => previous.map((item, i) => i === index ? value : item)); setError(""); }} placeholder={t.namePlaceholder} required />
                </div>)}
              </div>}
              {showChildren && <div className="dnt-stepper-row">
                <div><span id={id + "-children-label"} className="dnt-field-label">{t.children}</span><p>{t.childrenHint}</p></div>
                <div className="dnt-stepper">
                  <button type="button" aria-label={t.fewerChildren} disabled={children <= 0} onClick={() => setChildren(Math.max(0, children - 1))}>−</button>
                  <output aria-labelledby={id + "-children-label"} aria-live="polite">{children}</output>
                  <button type="button" aria-label={t.moreChildren} disabled={children >= guests - 1} onClick={() => setChildren(Math.min(guests - 1, children + 1))}>+</button>
                </div>
              </div>}
              {showFasting && <fieldset className="dnt-attendance">
                <legend>{t.fasting}</legend>
                <div className="dnt-choice-grid">
                  {[["posti", t.fastingYes], ["ne_posti", t.fastingNo]].map(([value, label]) => <label className={"dnt-choice dnt-choice-small " + (fasting === value ? "dnt-choice-active" : "")} key={value}>
                    <input type="radio" name={id + "-fasting"} value={value} checked={fasting === value} onChange={() => { setFasting(value); setError(""); }} required />
                    <span className="dnt-choice-pearl" aria-hidden="true" /><span className="dnt-choice-copy"><span>{label}</span></span>
                  </label>)}
                </div>
              </fieldset>}
              {showDietary && <div className="dnt-field">
                <label htmlFor={id + "-dietary"}>{t.dietary}</label>
                <textarea id={id + "-dietary"} name="dietaryRequirements" rows={2} maxLength={700} value={dietary} onChange={(event) => setDietary(event.target.value)} placeholder={t.dietaryPlaceholder} />
              </div>}
            </div>}
            <div className="dnt-field">
              <label htmlFor={id + "-message"}>{t.message}</label>
              <textarea id={id + "-message"} name="note" rows={3} maxLength={1000} value={message} onChange={(event) => setMessage(event.target.value)} placeholder={t.messagePlaceholder} />
            </div>
          </fieldset>
          {error && <p className="dnt-rsvp-error" ref={errorRef} role="alert" tabIndex={-1}>{error}</p>}
          <button className="dnt-button dnt-rsvp-submit" type="submit" disabled={loading}>{loading ? t.sending : t.submit}</button>
        </form>
        <p className="dnt-rsvp-signature">{details.rsvpSignature || brideName + " & " + groomName}</p>
      </>}
    </div>
    <DentelleLace src={config.edgeImage} className="dnt-lace-bottom" />
  </section>;
}
