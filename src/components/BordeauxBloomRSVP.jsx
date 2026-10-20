import { useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { collection, doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "../firebase";
import { BordeauxBloomBackdrop, BordeauxBloomFloralLayer, BordeauxBloomReveal, BordeauxBloomText } from "./BordeauxBloomCountdown";

export default function BordeauxBloomRSVP({
  slug, eventType = "wedding", details = {}, script = "latin", language = "sr", backgroundImage,
}) {
  const id = useId();
  const pending = useRef(false);
  const reduced = useReducedMotion();
  const [form, setForm] = useState({ fullName: "", attending: "", guests: "1", fasting: "" });
  const [guestNames, setGuestNames] = useState([""]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const config = details.bordeauxBloom || {};
  const photoBackground = config.showPhotoBackgrounds === false ? null : backgroundImage || config.rsvpBackground || null;
  const options = details.rsvpOptions || {};
  const closed = details.rsvpClosed === true;
  const individual = options.individualGuests === true;
  const maxGuests = Number.isInteger(options.maxGuests) && options.maxGuests > 0 ? options.maxGuests : 10;
  const loading = status === "sending";
  const cyr = script === "cyrillic";
  const t = language === "en" ? {
    title: "Guest", subtitle: "reply", intro: "Let us know if you can join us so we can prepare a wonderful day together.",
    open: "Confirm attendance", deadline: "Please reply by", name: "Full name", placeholder: "Enter your full name",
    attendance: "Will you join us?", yes: "Joyfully accept", no: "Regretfully decline", guests: "Number of guests",
    guest: "Guest", fasting: "Fasting meal?", fastingYes: "Yes", fastingNo: "No", send: "Send reply", sending: "Sending…",
    thanks: "Thank you!", success: "Your reply has been received.", closed: "RSVP is closed.",
    invalid: "Please complete the required fields.", invalidGuests: "Please enter a valid whole number of guests.",
    failed: "Your reply could not be sent. Please try again.", missing: "The invitation identifier is missing.",
  } : language === "de" ? {
    title: "Eure", subtitle: "Rückmeldung", intro: "Sagt uns Bescheid, ob ihr dabei seid, damit wir diesen Tag gemeinsam planen können.",
    open: "Teilnahme bestätigen", deadline: "Bitte antwortet bis zum", name: "Vor- und Nachname", placeholder: "Vor- und Nachname eingeben",
    attendance: "Seid ihr dabei?", yes: "Wir sind dabei", no: "Leider nicht", guests: "Anzahl der Gäste",
    guest: "Gast", fasting: "Fastenmenü?", fastingYes: "Ja", fastingNo: "Nein", send: "Antwort senden", sending: "Wird gesendet…",
    thanks: "Vielen Dank!", success: "Eure Rückmeldung ist angekommen.", closed: "Die Anmeldung ist geschlossen.",
    invalid: "Bitte füllt die Pflichtfelder aus.", invalidGuests: "Bitte gebt eine gültige ganze Anzahl an Gästen ein.",
    failed: "Die Antwort konnte nicht gesendet werden. Bitte erneut versuchen.", missing: "Die Kennung der Einladung fehlt.",
  } : cyr ? {
    title: "Анкета", subtitle: "гостију", intro: "Да бисмо могли да се припремимо за наш посебан дан, молимо вас да потврдите долазак.",
    open: "Потврди долазак", deadline: "Молимо за потврду до", name: "Име и презиме", placeholder: "Унесите име и презиме",
    attendance: "Да ли долазите?", yes: "Долазим", no: "Не долазим", guests: "Број особа",
    guest: "Гост", fasting: "Да ли постите?", fastingYes: "Постим", fastingNo: "Не постим", send: "Пошаљи потврду", sending: "Слање…",
    thanks: "Хвала!", success: "Ваша потврда је успешно послата.", closed: "Потврде доласка су затворене.",
    invalid: "Попуните обавезна поља и изаберите одговоре.", invalidGuests: "Унесите исправан цео број особа.",
    failed: "Потврда није послата. Покушајте поново.", missing: "Недостаје ознака позивнице.",
  } : {
    title: "Anketa", subtitle: "gostiju", intro: "Da bismo mogli da se pripremimo za naš poseban dan, molimo vas da potvrdite dolazak.",
    open: "Potvrdi dolazak", deadline: "Molimo za potvrdu do", name: "Ime i prezime", placeholder: "Unesite ime i prezime",
    attendance: "Da li dolazite?", yes: "Dolazim", no: "Ne dolazim", guests: "Broj osoba",
    guest: "Gost", fasting: "Da li postite?", fastingYes: "Postim", fastingNo: "Ne postim", send: "Pošalji potvrdu", sending: "Slanje…",
    thanks: "Hvala!", success: "Vaša potvrda je uspešno poslata.", closed: "Potvrde dolaska su zatvorene.",
    invalid: "Popunite obavezna polja i izaberite odgovore.", invalidGuests: "Unesite ispravan ceo broj osoba.",
    failed: "Potvrda nije poslata. Pokušajte ponovo.", missing: "Nedostaje oznaka pozivnice.",
  };

  function change(event) {
    const { name, value } = event.target;
    setError("");
    setForm((previous) => ({ ...previous, [name]: value }));
    if (name === "guests") {
      const count = Math.max(1, Math.min(maxGuests, Math.floor(Number(value) || 1)));
      setGuestNames((previous) => Array.from({ length: count }, (_, index) => previous[index] || ""));
    }
  }

  function selectAttendance(value) {
    setError("");
    setForm((previous) => ({ ...previous, attending: value, fasting: "" }));
  }

  async function submit(event) {
    event.preventDefault();
    if (pending.current || closed) return;
    if (!slug || !eventType) { setError(t.missing); return; }
    const accepts = form.attending === "da";
    const count = Number(form.guests);
    if (!form.attending || ((!individual || !accepts) && !form.fullName.trim())) {
      setError(t.invalid); return;
    }
    if (accepts && (!Number.isInteger(count) || count < 1 || count > maxGuests)) {
      setError(`${t.invalidGuests} (1–${maxGuests})`); return;
    }
    const names = individual && accepts ? guestNames.slice(0, count).map((name) => name.trim()) : [form.fullName.trim()];
    if (names.some((name) => !name) || (individual && accepts && names.length !== count) || (accepts && options.fasting && !form.fasting)) {
      setError(t.invalid); return;
    }
    pending.current = true;
    setStatus("sending");
    setError("");
    try {
      // Ista putanja i polja kao u MinimalRSVP, sa atomskim upisom grupe.
      const batch = writeBatch(db);
      batch.set(doc(db, "events", slug), { slug, eventType, updatedAt: serverTimestamp() }, { merge: true });
      const submissionGroupId = individual && accepts ? `${Date.now()}-${Math.random().toString(36).slice(2, 10)}` : null;
      names.forEach((fullName) => {
        const record = {
          eventType, fullName, attending: form.attending,
          guests: accepts ? (individual ? 1 : count) : 0,
          fasting: accepts && options.fasting ? form.fasting : "",
          createdAt: serverTimestamp(),
        };
        if (submissionGroupId) record.submissionGroupId = submissionGroupId;
        batch.set(doc(collection(db, "events", slug, "rsvps")), record);
      });
      await batch.commit();
      setStatus("success");
    } catch (cause) {
      console.error("Bordeaux Bloom RSVP:", cause);
      setError(t.failed);
      setStatus("idle");
    } finally { pending.current = false; }
  }

  return (
    <section className={`bb-rsvp ${photoBackground ? "bb-photo-section" : ""}`} aria-labelledby={`${id}-title`}>
      <BordeauxBloomBackdrop src={photoBackground} position={config.rsvpBackgroundPosition || "50% 64%"} />
      <div className="bb-relief-backdrop bb-rsvp-relief" aria-hidden="true"><img src={config.reliefPaper || "/images/bordeaux-bloom-relief-paper.webp"} width="1024" height="1536" alt="" loading="lazy" /></div>
      <BordeauxBloomFloralLayer className="bb-rsvp-rose" src={config.roseImage || "/images/bordeaux-bloom-relief-rose.webp"} width={1254} height={1254} depth={-12} ambient={config.ambientMotion !== false} />
      <div className="bb-rsvp-panel">
       <BordeauxBloomReveal>
        <img className="bb-rsvp-ornament" src="/icons/bordeaux-bloom-heart.svg" width="23" height="23" alt="" />
        <h2 id={`${id}-title`} className="bb-rsvp-title">
          <BordeauxBloomText as="span" scriptText>{config.rsvpTitle || t.title}</BordeauxBloomText>
          <span className="bb-kicker">{config.rsvpSubtitle || t.subtitle}</span>
        </h2>
        <p className="bb-copy">{details.rsvpText || t.intro}</p>
        {details.rsvpDeadline && <p className="bb-rsvp-deadline"><span>{t.deadline}</span> <strong>{details.rsvpDeadline}</strong></p>}
       </BordeauxBloomReveal>
        {closed ? <p className="bb-rsvp-closed">{t.closed}</p> : (
              <div id={`${id}-form`} className="bb-form-reveal">
                {status === "success" ? <div className="bb-rsvp-success" role="status">
                  {!reduced && <span className="bb-success-petals" aria-hidden="true">{[18, 52, 81].map((left, index) => <motion.img key={left} src="/icons/bordeaux-bloom-petal.svg" width="14" height="19" alt="" style={{ left: `${left}%` }} initial={{ opacity: 0, y: -15, rotate: -25 }} animate={{ opacity: [0, .75, 0], y: 130, rotate: index % 2 ? 55 : -65, x: index % 2 ? -18 : 16 }} transition={{ duration: 3.8, delay: index * .3, ease: "easeOut" }} />)}</span>}
                  <img src="/icons/bordeaux-bloom-wax-seal.svg" width="64" height="64" alt="" />
                  <p className="bb-script">{t.thanks}</p><p className="bb-copy">{t.success}</p>
                </div> : (
                  <form className="bb-form" onSubmit={submit} aria-busy={loading} noValidate>
                    <div className="bb-form-letterhead" aria-hidden="true"><img className="bb-rsvp-wax-seal" src="/icons/bordeaux-bloom-wax-seal.svg" width="120" height="120" alt="" /><span>R.S.V.P.</span><img src="/icons/bordeaux-bloom-divider.svg" width="110" height="29" alt="" /></div>
                    <fieldset disabled={loading} className="bb-form-fields">
                      {(!individual || form.attending !== "da") && <div className="bb-field">
                        <label htmlFor={`${id}-name`}>{t.name}</label>
                        <input id={`${id}-name`} name="fullName" type="text" value={form.fullName} onChange={change}
                          placeholder={t.placeholder} autoComplete="name" maxLength={120} required />
                      </div>}
                      <fieldset className="bb-choice"><legend>{t.attendance}</legend>
                        <div className="bb-choice-grid">
                          {[{ value: "da", label: t.yes }, { value: "ne", label: t.no }].map((choice) => (
                            <label className={`bb-radio ${form.attending === choice.value ? "bb-selected" : ""}`} key={choice.value}>
                              <input type="radio" name="attending" value={choice.value} checked={form.attending === choice.value}
                                onChange={() => selectAttendance(choice.value)} required />
                              <span>{choice.label}</span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                      <AnimatePresence initial={false}>
                        {form.attending === "da" && <motion.div key="attending-fields" className="bb-conditional-fields"
                          initial={reduced ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                          exit={reduced ? undefined : { opacity: 0, height: 0 }} transition={{ duration: reduced ? 0 : 0.3 }}>
                          <div className="bb-field">
                            <label htmlFor={`${id}-guests`}>{t.guests}</label>
                            <input id={`${id}-guests`} type="number" inputMode="numeric" name="guests" min="1" max={maxGuests}
                              step="1" value={form.guests} onChange={change} required />
                          </div>
                          {individual && guestNames.map((name, index) => <div className="bb-field" key={index}>
                            <label htmlFor={`${id}-guest-${index}`}>{t.guest} {index + 1} — {t.name}</label>
                            <input id={`${id}-guest-${index}`} type="text" value={name} maxLength={120} required
                              onChange={(event) => {
                                const value = event.target.value;
                                setGuestNames((previous) => previous.map((entry, current) => current === index ? value : entry));
                              }} />
                          </div>)}
                          {options.fasting && <fieldset className="bb-choice"><legend>{t.fasting}</legend>
                            <div className="bb-choice-grid">
                              {[{ value: "posti", label: t.fastingYes }, { value: "ne_posti", label: t.fastingNo }].map((choice) => (
                                <label className={`bb-radio ${form.fasting === choice.value ? "bb-selected" : ""}`} key={choice.value}>
                                  <input type="radio" name="fasting" value={choice.value} checked={form.fasting === choice.value}
                                    onChange={change} required /><span>{choice.label}</span>
                                </label>
                              ))}
                            </div>
                          </fieldset>}
                        </motion.div>}
                      </AnimatePresence>
                      {error && <p className="bb-form-error" role="alert">{error}</p>}
                      <motion.button className="bb-button bb-submit" type="submit" disabled={loading}
                        whileTap={reduced ? undefined : { scale: 0.985 }}>
                        {loading ? t.sending : t.send}
                        {!loading && <img src="/icons/bordeaux-bloom-arrow.svg" width="20" height="15" alt="" />}
                      </motion.button>
                    </fieldset>
                  </form>
                )}
              </div>
        )}
      </div>
    </section>
  );
}
