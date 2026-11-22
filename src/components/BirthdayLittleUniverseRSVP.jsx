import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { universeData, UniverseIcon, UniverseOrbit, UniverseReveal, UniverseScript, UNIVERSE_EASE } from "./BirthdayLittleUniverseIntro";
import "../styles/newrsvp.css";

const emptyForm = () => ({ fullName: "", attending: "", guests: 1, message: "" });

export default function BirthdayLittleUniverseRSVP(props) {
  const { slug, eventType = "birthday" } = props;
  const { name, nameScale, c, details, config } = universeData(props);
  const uid = useId();
  const reduced = useReducedMotion();
  const nameInput = useRef(null);
  const yesInput = useRef(null);
  const pending = useRef(false);
  const scope = useRef(0);
  const responseDoc = useRef(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [invalidField, setInvalidField] = useState("");
  const max = Number(details.rsvpMaxGuests);
  const maxGuests = Number.isFinite(max) && max >= 1 ? Math.floor(max) : 10;
  const closed = details.rsvpClosed === true;
  const showMessageField = config.showMessageField === true;

  useLayoutEffect(() => {
    scope.current += 1; pending.current = false; responseDoc.current = null;
    setForm(emptyForm()); setLoading(false); setSubmitted(false); setError(""); setInvalidField("");
    return () => { scope.current += 1; };
  }, [slug]);

  useEffect(() => {
    setForm((previous) => ({ ...previous, guests: Math.min(maxGuests, Math.max(1, previous.guests)) }));
  }, [maxGuests]);

  const change = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setError(""); setInvalidField("");
  };
  const changeGuests = (difference) => setForm((previous) => ({ ...previous, guests: Math.min(maxGuests, Math.max(1, previous.guests + difference)) }));

  const submit = async (event) => {
    event.preventDefault();
    if (pending.current || closed || submitted) return;
    const fullName = form.fullName.trim();
    if (!slug || !eventType) { setError(c ? "Недостају подаци о прослави." : "Nedostaju podaci o proslavi."); return; }
    if (!fullName) { setError(c ? "Унесите име и презиме." : "Unesite ime i prezime."); setInvalidField("name"); nameInput.current?.focus(); return; }
    if (!["da", "ne"].includes(form.attending)) { setError(c ? "Изаберите да ли долазите." : "Izaberite da li dolazite."); setInvalidField("attending"); yesInput.current?.focus(); return; }
    if (form.attending === "da" && (!Number.isInteger(form.guests) || form.guests < 1 || form.guests > maxGuests)) {
      setError(c ? "Проверите број особа." : "Proverite broj osoba."); return;
    }
    pending.current = true;
    const requestScope = scope.current;
    setLoading(true); setError(""); setInvalidField("");
    try {
      // Ista putanja i osnovna polja kao u BirthdayNoirRSVP.
      // Stabilan ID tokom ponovnog pokušaja sprečava dve iste prijave posle mrežne greške.
      if (!responseDoc.current) responseDoc.current = doc(collection(db, "events", slug, "rsvps"));
      const destination = responseDoc.current;
      await setDoc(doc(db, "events", slug), { slug, eventType, updatedAt: serverTimestamp() }, { merge: true });
      await setDoc(destination, {
        eventType, fullName, attending: form.attending,
        guests: form.attending === "da" ? form.guests : 0,
        message: showMessageField ? form.message.trim() : "",
        createdAt: serverTimestamp(),
      });
      if (scope.current === requestScope) setSubmitted(true);
    } catch (cause) {
      console.error("Little Universe RSVP:", cause);
      if (scope.current === requestScope) setError(c ? "Одговор није послат. Покушајте поново." : "Odgovor nije poslat. Pokušajte ponovo.");
    } finally {
      if (scope.current === requestScope) { pending.current = false; setLoading(false); }
    }
  };

  const reset = () => {
    responseDoc.current = null; setForm(emptyForm()); setSubmitted(false); setError(""); setInvalidField("");
  };

  return <section id={`blu-rsvp-${slug || "event"}`} tabIndex={-1} className="blu blu-rsvp blu-section" data-script={c ? "cyrillic" : "latin"}
    aria-labelledby={`${uid}-heading`} style={{ "--blu-name-scale": nameScale }}>
    <UniverseReveal className="blu-rsvp-heading"><UniverseOrbit className="blu-rsvp-orbit" /><p className="blu-kicker">{c ? "ПОТВРДА ДОЛАСКА" : "POTVRDA DOLASKA"}</p>
      <h2 className="blu-heading" id={`${uid}-heading`}>{c ? "Имате место" : "Imate mesto"}<UniverseScript>{c ? "у мом свемиру." : "u mom svemiru."}</UniverseScript></h2>
      {details.rsvpText && <p className="blu-rsvp-deadline">{details.rsvpText}</p>}
    </UniverseReveal>

    <AnimatePresence mode="wait" initial={false}>
      {closed ? <motion.div className="blu-rsvp-closed" key="closed" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }}>
        <UniverseIcon type="moon" /><h3>{c ? "Пријаве су затворене" : "Prijave su zatvorene"}</h3><p>{config.rsvpClosedText || (c ? "Хвала вам на свим лепим жељама. За промене у доласку јавите се организаторима." : "Hvala vam na svim lepim željama. Za promene u dolasku javite se organizatorima.")}</p>
      </motion.div> : submitted ? <motion.div key="success" className="blu-rsvp-success" role="status"
        initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
        <div className="blu-success-emblem"><UniverseOrbit /><UniverseIcon type="check" /></div>
        <p className="blu-kicker">{c ? "ВАШ ОДГОВОР ЈЕ САЧУВАН" : "VAŠ ODGOVOR JE SAČUVAN"}</p>
        <h3><UniverseScript>{form.attending === "da" ? c ? "До звезда заједно!" : "Do zvezda zajedno!" : c ? "Хвала што сте јавили." : "Hvala što ste javili."}</UniverseScript></h3>
        <p>{form.attending === "da" ? c ? "Радујемо се вашем доласку и свим загрљајима који нас чекају." : "Radujemo se vašem dolasku i svim zagrljajima koji nas čekaju." : c ? "Недостајаћете нам. Шаљемо један велики, звездани загрљај." : "Nedostajaćete nam. Šaljemo jedan veliki, zvezdani zagrljaj."}</p>
        <button className="blu-text-link" type="button" onClick={reset}>{c ? "Пошаљи још један одговор" : "Pošalji još jedan odgovor"}<UniverseIcon type="arrow" /></button>
      </motion.div> : <motion.form key="form" className="blu-rsvp-form" onSubmit={submit} noValidate aria-busy={loading}
        initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: UNIVERSE_EASE }}>
        <fieldset className="blu-form-fields" disabled={loading}>
          <fieldset className="blu-attendance">
            <legend>{c ? "ДОЛАЗИТЕ НА ПРОСЛАВУ?" : "DOLAZITE NA PROSLAVU?"}</legend>
            <div className="blu-choices">{[{ value: "da", label: c ? "Долазимо" : "Dolazimo", icon: "star" }, { value: "ne", label: c ? "Не можемо" : "Ne možemo", icon: "moon" }].map((choice) => <label className={`blu-choice ${form.attending === choice.value ? "is-checked" : ""}`} key={choice.value}>
              <input ref={choice.value === "da" ? yesInput : undefined} type="radio" name={`${uid}-attending`} value={choice.value} checked={form.attending === choice.value} required
                aria-invalid={invalidField === "attending" || undefined} aria-describedby={invalidField === "attending" ? `${uid}-error` : undefined} onChange={() => change("attending", choice.value)} />
              <span className="blu-choice-marker"><UniverseIcon type={choice.icon} /></span><strong>{choice.label}</strong><span className="blu-choice-check"><UniverseIcon type="check" /></span>
            </label>)}</div>
          </fieldset>

          <div className="blu-field"><label htmlFor={`${uid}-name`}>{c ? "ИМЕ И ПРЕЗИМЕ" : "IME I PREZIME"}</label>
            <input ref={nameInput} id={`${uid}-name`} name="fullName" type="text" autoComplete="name" autoCapitalize="words" value={form.fullName} required maxLength={160}
              placeholder={c ? "Упишите име и презиме" : "Upišite ime i prezime"} onChange={(e) => change("fullName", e.target.value)}
              aria-invalid={invalidField === "name" || undefined} aria-describedby={invalidField === "name" ? `${uid}-error` : undefined} />
          </div>

          <AnimatePresence initial={false}>{form.attending === "da" && maxGuests > 1 && <motion.div key="guests" className="blu-guests-wrap" initial={reduced ? false : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : 0.3 }}>
            <div className="blu-guest-row"><div><p className="blu-field-label">{c ? "БРОЈ ОСОБА" : "BROJ OSOBA"}</p><small>{c ? "Укупно, укључујући и вас" : "Ukupno, uključujući i vas"}</small></div>
              <div className="blu-stepper" role="group" aria-label={c ? "Укупан број особа" : "Ukupan broj osoba"}>
                <button type="button" disabled={form.guests <= 1} onClick={() => changeGuests(-1)} aria-label={c ? "Смањи број особа" : "Smanji broj osoba"}>−</button><output aria-live="polite" aria-atomic="true">{form.guests}</output><button type="button" disabled={form.guests >= maxGuests} onClick={() => changeGuests(1)} aria-label={c ? "Повећај број особа" : "Povećaj broj osoba"}>+</button>
              </div>
            </div>
          </motion.div>}</AnimatePresence>

          {showMessageField && <div className="blu-field"><label htmlFor={`${uid}-message`}>{c ? "ЈЕДНА МАЛА ПОРУКА" : "JEDNA MALA PORUKA"}<span>{c ? "није обавезно" : "nije obavezno"}</span></label>
            <textarea id={`${uid}-message`} name="message" rows={3} maxLength={800} value={form.message} placeholder={c ? "Жеља, напомена или један звездани загрљај…" : "Želja, napomena ili jedan zvezdani zagrljaj…"} onChange={(e) => change("message", e.target.value)} />
          </div>}

          {error && <p className="blu-form-error" id={`${uid}-error`} role="alert">{error}</p>}
          <button className="blu-button blu-submit" type="submit" disabled={loading}><span>{loading ? c ? "Шаљемо одговор…" : "Šaljemo odgovor…" : c ? "Пошаљи одговор" : "Pošalji odgovor"}</span>{loading ? <span className="blu-loader" /> : <UniverseIcon type="sparkle" />}</button>
        </fieldset>
      </motion.form>}
    </AnimatePresence>
    <div className="blu-rsvp-signature"><span>{c ? "С ЉУБАВЉУ," : "S LJUBAVLJU,"}</span><UniverseScript>{name}</UniverseScript></div>
  </section>;
}
