import { useEffect, useId, useRef, useState } from "react";
import { collection, doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "../firebase";
import { starlightData, StarlightIcon, StarlightScript } from "./BirthdayStarlightIntro";
import "../styles/newrsvp.css";

export default function BirthdayStarlightRSVP(props) {
  const data = starlightData(props);
  const { c, details, starlight } = data;
  const { slug, eventType = "birthday" } = props;
  const uid = useId();
  const input = useRef(null);
  const pending = useRef(false);
  const responseRef = useRef(null);
  const scope = useRef(0);
  const [form, setForm] = useState({ fullName: "", attending: "", guests: 1, message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const configuredMax = Number(details.rsvpMaxGuests ?? details.rsvpOptions?.maxGuests);
  const maxGuests = Number.isFinite(configuredMax) && configuredMax >= 1 ? Math.floor(configuredMax) : 8;
  const closed = details.rsvpClosed === true;
  const showMessage = details.rsvpOptions?.message === true;

  useEffect(() => {
    scope.current += 1;
    pending.current = false;
    responseRef.current = null;
    setForm({ fullName: "", attending: "", guests: 1, message: "" });
    setLoading(false);
    setSubmitted(false);
    setError("");
    return () => { scope.current += 1; };
  }, [slug]);

  const submit = async (event) => {
    event.preventDefault();
    if (pending.current || closed) return;
    const fullName = form.fullName.trim();
    if (!slug || !eventType) { setError(c ? "Недостају подаци о прослави." : "Nedostaju podaci o proslavi."); return; }
    if (!fullName) {
      setError(c ? "Унесите име и презиме." : "Unesite ime i prezime.");
      input.current?.focus();
      return;
    }
    if (!["da", "ne"].includes(form.attending)) { setError(c ? "Изаберите да ли долазите." : "Izaberite da li dolazite."); return; }
    if (form.attending === "da" && (!Number.isInteger(form.guests) || form.guests < 1 || form.guests > maxGuests)) {
      setError(c ? "Проверите број особа." : "Proverite broj osoba.");
      return;
    }
    const requestScope = scope.current;
    pending.current = true;
    setLoading(true);
    setError("");
    try {
      // Ista putanja i ista osnovna polja kao u postojećim rođendanskim RSVP-ovima.
      // Jedan atomski upis; isti ID pri ponovnom pokušaju sprečava duplikat.
      if (!responseRef.current) responseRef.current = doc(collection(db, "events", slug, "rsvps"));
      const batch = writeBatch(db);
      batch.set(doc(db, "events", slug), { slug, eventType, updatedAt: serverTimestamp() }, { merge: true });
      batch.set(responseRef.current, {
        eventType,
        fullName,
        attending: form.attending,
        guests: form.attending === "da" ? form.guests : 0,
        ...(showMessage ? { message: form.message.trim() } : {}),
        createdAt: serverTimestamp(),
      });
      await batch.commit();
      if (scope.current === requestScope) setSubmitted(true);
    } catch (cause) {
      console.error("BirthdayStarlight RSVP:", cause);
      if (scope.current === requestScope) setError(c ? "Слање није успело. Покушајте поново." : "Slanje nije uspelo. Pokušajte ponovo.");
    } finally {
      if (scope.current === requestScope) { pending.current = false; setLoading(false); }
    }
  };

  const clear = () => {
    responseRef.current = null;
    setForm({ fullName: "", attending: "", guests: 1, message: "" });
    setError("");
    setSubmitted(false);
  };

  return <section className="bsl bsl-rsvp" id={`bsl-rsvp-${slug || "event"}`} data-script={c ? "cyrillic" : "latin"} aria-labelledby={`${uid}-title`}>
    <div className="bsl-rsvp-arch">
      <h2 className="bsl-rsvp-heading" id={`${uid}-title`}><StarlightScript>{starlight.rsvpTitle || (c ? "Потврда" : "Potvrda")}</StarlightScript><StarlightScript delay={0.16}>{starlight.rsvpSubtitle || (c ? "присуства" : "prisustva")}</StarlightScript></h2>
      <p className="bsl-rsvp-note">{details.rsvpText || details.note || (c ? "Молим те да потврдиш свој долазак. Радујем се што ћемо славити заједно!" : "Molim te da potvrdiš svoj dolazak. Radujem se što ćemo slaviti zajedno!")}</p>

      {closed ? <div className="bsl-rsvp-feedback" role="status"><StarlightIcon name="star" /><p>{starlight.closedText || (c ? "Пријаве за ову прославу су затворене." : "Prijave za ovu proslavu su zatvorene.")}</p></div>
        : submitted ? <div className="bsl-rsvp-feedback" role="status">
          <StarlightIcon name="check" />
          <h3 className="bsl-feedback-title">{c ? "Хвала!" : "Hvala!"}</h3>
          <p>{form.attending === "da" ? (c ? "Твој долазак је потврђен. Видимо се на прослави!" : "Tvoj dolazak je potvrđen. Vidimo se na proslavi!") : (c ? "Твој одговор је сачуван. Хвала што си јавио/јавила." : "Tvoj odgovor je sačuvan. Hvala što si javio/javila.")}</p>
          <button type="button" className="bsl-text-button" onClick={clear}>{c ? "Пошаљи још један одговор" : "Pošalji još jedan odgovor"}</button>
        </div>
          : <form className="bsl-rsvp-form" onSubmit={submit} noValidate aria-busy={loading}>
            <fieldset className="bsl-fields" disabled={loading}>
              <div className="bsl-name-field">
                <label htmlFor={`${uid}-name`}>{c ? "Име и презиме" : "Ime i prezime"}</label>
                <input ref={input} id={`${uid}-name`} type="text" name="fullName" required maxLength={160} autoComplete="name" autoCapitalize="words" placeholder={c ? "Твоје име на листи гостију" : "Tvoje ime na listi gostiju"} value={form.fullName} onChange={(event) => { setForm((previous) => ({ ...previous, fullName: event.target.value })); setError(""); }} aria-describedby={error ? `${uid}-error` : undefined} />
              </div>
              <fieldset className="bsl-attendance">
                <legend>{c ? "Да ли долазиш?" : "Da li dolaziš?"}</legend>
                <div className="bsl-choice-grid">
                  {[{ value: "da", label: c ? "Долазим" : "Dolazim" }, { value: "ne", label: c ? "Не могу" : "Ne mogu" }].map((choice) => <label className={`bsl-choice ${form.attending === choice.value ? "bsl-choice-selected" : ""}`} key={choice.value}>
                    <input type="radio" name={`${uid}-attending`} required value={choice.value} checked={form.attending === choice.value} onChange={() => { setForm((previous) => ({ ...previous, attending: choice.value, guests: choice.value === "da" ? Math.min(maxGuests, Math.max(1, previous.guests)) : 1 })); setError(""); }} />
                    <span className="bsl-radio-mark" aria-hidden="true" /><span>{choice.label}</span>
                  </label>)}
                </div>
              </fieldset>
              {form.attending === "da" && maxGuests > 1 && <div className="bsl-guests-row">
                <div><span>{c ? "Број особа" : "Broj osoba"}</span><small>{c ? "Укључујући и тебе" : "Uključujući i tebe"}</small></div>
                <div className="bsl-stepper" role="group" aria-label={c ? "Број особа" : "Broj osoba"}>
                  <button type="button" aria-label={c ? "Смањи број особа" : "Smanji broj osoba"} disabled={form.guests <= 1} onClick={() => setForm((previous) => ({ ...previous, guests: Math.max(1, previous.guests - 1) }))}>−</button>
                  <output aria-live="polite">{form.guests}</output>
                  <button type="button" aria-label={c ? "Повећај број особа" : "Povećaj broj osoba"} disabled={form.guests >= maxGuests} onClick={() => setForm((previous) => ({ ...previous, guests: Math.min(maxGuests, previous.guests + 1) }))}>+</button>
                </div>
              </div>}
              {showMessage && <div className="bsl-message-field"><label htmlFor={`${uid}-message`}>{c ? "Порука (опционо)" : "Poruka (opciono)"}</label><textarea id={`${uid}-message`} rows={3} maxLength={1000} value={form.message} onChange={(event) => setForm((previous) => ({ ...previous, message: event.target.value }))} /></div>}
              {error && <p className="bsl-form-error" id={`${uid}-error`} role="alert">{error}</p>}
              <button type="submit" disabled={loading} className="bsl-button bsl-button-cream bsl-submit">{loading ? (c ? "Слање…" : "Slanje…") : (c ? "Потврди долазак" : "Potvrdi dolazak")}{loading && <span className="bsl-loader" aria-hidden="true" />}</button>
            </fieldset>
          </form>}

      <div className="bsl-toast-photo"><img src={data.toastImage} width="1536" height="1024" alt="" loading="lazy" decoding="async" draggable="false" /></div>
      <p className="bsl-see-you"><StarlightScript>{starlight.closingTitle || (c ? "Видимо се!" : "Vidimo se!")}</StarlightScript></p>
    </div>
  </section>;
}
