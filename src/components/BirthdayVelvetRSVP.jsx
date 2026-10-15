import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { velvetData, VelvetArrow, VelvetOrnament, VelvetReveal, VelvetScript } from "./BirthdayVelvetIntro";
import "../styles/newrsvp.css";

export default function BirthdayVelvetRSVP(props) {
  const { slug, eventType = "birthday", details = {} } = props;
  const { name, cyrillic: c, velvet, nameScale, variant } = velvetData(props);
  const reduced = useReducedMotion();
  const uid = useId();
  const input = useRef(null);
  const pending = useRef(false);
  const requestScope = useRef(0);
  const [form, setForm] = useState({ fullName: "", attending: "", guests: 1 });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const configuredMax = Number(details.rsvpMaxGuests);
  const maxGuests = Number.isFinite(configuredMax) && configuredMax >= 1 ? Math.floor(configuredMax) : 10;
  const closed = details.rsvpClosed === true;

  useEffect(() => {
    requestScope.current += 1;
    pending.current = false;
    setForm({ fullName: "", attending: "", guests: 1 });
    setLoading(false);
    setSubmitted(false);
    setError("");
    return () => { requestScope.current += 1; };
  }, [slug]);

  const chooseAttendance = (attending) => {
    setError("");
    setForm((previous) => ({ ...previous, attending, guests: attending === "da" ? Math.min(maxGuests, Math.max(1, previous.guests)) : 1 }));
  };

  const changeGuests = (by) => {
    setForm((previous) => ({ ...previous, guests: Math.max(1, Math.min(maxGuests, previous.guests + by)) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (pending.current || closed) return;
    const fullName = form.fullName.trim();
    if (!slug || !eventType) { setError(c ? "Недостају подаци о догађају." : "Nedostaju podaci o događaju."); return; }
    if (!fullName) {
      setError(c ? "Унесите име и презиме." : "Unesite ime i prezime.");
      input.current?.focus();
      return;
    }
    if (!["da", "ne"].includes(form.attending)) { setError(c ? "Изаберите да ли долазите." : "Izaberite da li dolazite."); return; }
    if (form.attending === "da" && (!Number.isInteger(form.guests) || form.guests < 1 || form.guests > maxGuests)) {
      setError(c ? "Проверите број гостију." : "Proverite broj gostiju.");
      return;
    }
    pending.current = true;
    const scope = requestScope.current;
    setLoading(true);
    setError("");
    try {
      // Ista kolekcija i ista polja kao u postojećem BirthdayElenaRSVP.
      await setDoc(doc(db, "events", slug), { slug, eventType, updatedAt: serverTimestamp() }, { merge: true });
      await addDoc(collection(db, "events", slug, "rsvps"), {
        eventType,
        fullName,
        attending: form.attending,
        guests: form.attending === "da" ? form.guests : 0,
        createdAt: serverTimestamp(),
      });
      if (scope === requestScope.current) setSubmitted(true);
    } catch (cause) {
      console.error("BirthdayVelvet RSVP:", cause);
      if (scope === requestScope.current) setError(c ? "Слање није успело. Покушајте поново." : "Slanje nije uspelo. Pokušajte ponovo.");
    } finally {
      if (scope === requestScope.current) {
        pending.current = false;
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setForm({ fullName: "", attending: "", guests: 1 });
    setError("");
  };

  return (
    <section
      id={`bvs-rsvp-${slug || "event"}`}
      className="bvs bvs-rsvp bvs-section"
      data-variant={variant}
      data-script={c ? "cyrillic" : "latin"}
      style={{ "--bvs-name-scale": nameScale }}
      aria-labelledby={`${uid}-heading`}
    >
      <VelvetReveal>
        <VelvetOrnament />
        <p className="bvs-kicker">{c ? "ПОТВРДА ДОЛАСКА" : "POTVRDA DOLASKA"}</p>
        <h2 id={`${uid}-heading`} className="bvs-section-title">
          <VelvetScript underline>{c ? "Долазиш?" : "Dolaziš?"}</VelvetScript>
        </h2>
        <p className="bvs-rsvp-deadline">{details.rsvpText || details.note || (c ? "Молим те да потврдиш свој долазак." : "Molim te da potvrdiš svoj dolazak.")}</p>
      </VelvetReveal>

      <AnimatePresence mode="wait" initial={false}>
        {closed ? (
          <motion.div key="closed" className="bvs-rsvp-status" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }}>
            <p>{velvet.rsvpClosedText || (c ? "Пријаве за ову прославу су затворене." : "Prijave za ovu proslavu su zatvorene.")}</p>
          </motion.div>
        ) : submitted ? (
          <motion.div
            key="success"
            className="bvs-rsvp-success"
            role="status"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <svg className="bvs-success-mark" viewBox="0 0 70 70" fill="none" aria-hidden="true">
              <motion.circle cx="35" cy="35" r="31" initial={reduced ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7 }} />
              <motion.path d="m21 35 9 9 20-20" initial={reduced ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: reduced ? 0 : 0.35 }} />
            </svg>
            <h3><VelvetScript>{c ? "Хвала!" : "Hvala!"}</VelvetScript></h3>
            <p>{form.attending === "da"
              ? c ? "Твој долазак је потврђен. Видимо се на прослави!" : "Tvoj dolazak je potvrđen. Vidimo se na proslavi!"
              : c ? "Твој одговор је сачуван. Хвала што си јавио/јавила." : "Tvoj odgovor je sačuvan. Hvala što si javio/javila."}</p>
            <button className="bvs-text-link" type="button" onClick={resetForm}>{c ? "ПОШАЉИ ЈОШ ЈЕДАН ОДГОВОР" : "POŠALJI JOŠ JEDAN ODGOVOR"}<VelvetArrow /></button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            className="bvs-rsvp-form"
            onSubmit={handleSubmit}
            noValidate
            aria-busy={loading}
            initial={reduced ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            exit={{ opacity: 0 }}
          >
            <fieldset className="bvs-form-fields" disabled={loading}>
              <div className="bvs-name-field">
                <label className="bvs-field-label" htmlFor={`${uid}-name`}>{c ? "ИМЕ И ПРЕЗИМЕ" : "IME I PREZIME"}</label>
                <input
                  ref={input}
                  id={`${uid}-name`}
                  name="fullName"
                  autoComplete="name"
                  autoCapitalize="words"
                  type="text"
                  maxLength={160}
                  required
                  value={form.fullName}
                  onChange={(event) => { setError(""); setForm({ ...form, fullName: event.target.value }); }}
                  placeholder={c ? "Твоје име на списку гостију" : "Tvoje ime na spisku gostiju"}
                  aria-describedby={error ? `${uid}-error` : undefined}
                />
              </div>

              <fieldset className="bvs-attendance">
                <legend className="bvs-field-label">{c ? "ДА ЛИ ДОЛАЗИШ?" : "DA LI DOLAZIŠ?"}</legend>
                <div className="bvs-choice-grid">
                  {[{ value: "da", title: c ? "Долазим" : "Dolazim", note: c ? "Видимо се на прослави." : "Vidimo se na proslavi." },
                    { value: "ne", title: c ? "Не могу" : "Ne mogu", note: c ? "Овог пута пропуштам." : "Ovog puta propuštam." }].map((choice) => (
                    <label key={choice.value} className={`bvs-choice ${form.attending === choice.value ? "bvs-choice-selected" : ""}`}>
                      <input type="radio" name={`${uid}-attending`} value={choice.value} checked={form.attending === choice.value} onChange={() => chooseAttendance(choice.value)} required />
                      <span className="bvs-choice-top"><span className="bvs-choice-dot" aria-hidden="true" /></span>
                      <strong>{choice.title}</strong><span className="bvs-choice-note">{choice.note}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <AnimatePresence initial={false}>
                {form.attending === "da" && maxGuests > 1 && <motion.div
                  className="bvs-guest-row"
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.3 }}
                >
                  <div><span className="bvs-field-label">{c ? "БРОЈ ОСОБА" : "BROJ OSOBA"}</span><small>{c ? "Укључујући и тебе" : "Uključujući i tebe"}</small></div>
                  <div className="bvs-stepper" role="group" aria-label={c ? "Број особа" : "Broj osoba"}>
                    <button type="button" disabled={form.guests <= 1} onClick={() => changeGuests(-1)} aria-label={c ? "Смањи број особа" : "Smanji broj osoba"}>−</button>
                    <output aria-live="polite" aria-atomic="true">{form.guests}</output>
                    <button type="button" disabled={form.guests >= maxGuests} onClick={() => changeGuests(1)} aria-label={c ? "Повећај број особа" : "Povećaj broj osoba"}>+</button>
                  </div>
                </motion.div>}
              </AnimatePresence>

              {error && <p className="bvs-form-error" id={`${uid}-error`} role="alert">{error}</p>}
              <motion.button className="bvs-button bvs-submit" type="submit" disabled={loading} whileTap={reduced ? undefined : { scale: 0.98 }}>
                <span>{loading ? c ? "СЛАЊЕ…" : "SLANJE…" : c ? "ПОШАЉИ ОДГОВОР" : "POŠALJI ODGOVOR"}</span>
                {loading ? <span className="bvs-loader" aria-hidden="true" /> : <VelvetArrow />}
              </motion.button>
            </fieldset>
          </motion.form>
        )}
      </AnimatePresence>
      <p className="bvs-rsvp-signoff"><span>{velvet.signoff || (variant === "onyx" ? c ? "ВИДИМО СЕ," : "VIDIMO SE," : c ? "С ЉУБАВЉУ," : "S LJUBAVLJU,")}</span><VelvetScript>{name}</VelvetScript></p>
    </section>
  );
}
