import { useEffect, useId, useRef, useState } from "react";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { arielData } from "./BirthdayArielIntro";
import "../styles/newrsvp.css";

export default function BirthdayArielRSVP(props) {
  const { slug, id } = props;
  const eventType = props.eventType || props.type || "birthday";
  const { config, details, text } = arielData(props);
  const uid = useId();
  const nameInput = useRef(null);
  const yesInput = useRef(null);
  const confirmation = useRef(null);
  const responseDoc = useRef(null);
  const pending = useRef(false);
  const mounted = useRef(true);
  const [fullName, setFullName] = useState("");
  const [attending, setAttending] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const max = Number(details.rsvpMaxGuests);
  const limit = Number.isFinite(max) && max >= 1 ? Math.floor(max) : 8;
  const guests = Math.min(guestCount, limit);
  const closed = details.rsvpClosed === true;
  const saving = status === "saving";

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    if (status === "sent") confirmation.current?.focus();
  }, [status]);

  const clearError = () => setError(null);
  const submit = async (event) => {
    event.preventDefault();
    if (closed || pending.current || status === "sent") return;
    const name = fullName.trim();
    if (!slug) {
      setError({ message: text("Nedostaje oznaka proslave.", "Недостаје ознака прославе.") });
      return;
    }
    if (!name) {
      setError({ field: "name", message: text("Unesite ime i prezime.", "Унесите име и презиме.") });
      nameInput.current?.focus();
      return;
    }
    if (!attending) {
      setError({ field: "attending", message: text("Izaberite da li dolazite.", "Изаберите да ли долазите.") });
      yesInput.current?.focus();
      return;
    }

    pending.current = true;
    setStatus("saving");
    clearError();
    try {
      // Čuvamo identifikator odgovora za ponovni pokušaj slanja.
      responseDoc.current ??= doc(collection(db, "events", slug, "rsvps"));
      await setDoc(doc(db, "events", slug), { slug, eventType, updatedAt: serverTimestamp() }, { merge: true });
      await setDoc(responseDoc.current, {
        fullName: name,
        attending,
        guests: attending === "da" ? guests : 0,
        eventType,
        message: "",
        createdAt: serverTimestamp(),
      });
      if (mounted.current) setStatus("sent");
    } catch {
      if (mounted.current) {
        setStatus("idle");
        setError({ message: text("Odgovor nije poslat. Pokušajte ponovo.", "Одговор није послат. Покушајте поново.") });
      }
    } finally {
      pending.current = false;
    }
  };

  return (
    <section className="ariel-rsvp" id={id || "ariel-rsvp-" + (slug || "event")} tabIndex={-1} aria-labelledby={uid + "-title"}>
      <div className="ariel-inner">
        <h2 className="ariel-title" id={uid + "-title"}>{text("Slavimo", "Славимо")} <em>{text("zajedno", "заједно")}</em></h2>
        {details.rsvpText && <p className="ariel-rsvp-deadline">{details.rsvpText}</p>}

        {closed ? (
          <p className="ariel-rsvp-result">{config.rsvpClosedText || text("Prijave su zatvorene.", "Пријаве су затворене.")}</p>
        ) : status === "sent" ? (
          <div className="ariel-rsvp-result" ref={confirmation} tabIndex={-1} role="status">
            <h3>{text("Odgovor je sačuvan", "Одговор је сачуван")}</h3>
            <p>{attending === "da" ? text("Vidimo se na proslavi!", "Видимо се на прослави!") : text("Hvala što ste nam javili.", "Хвала што сте нам јавили.")}</p>
          </div>
        ) : (
          <form className="ariel-rsvp-form" onSubmit={submit} noValidate aria-busy={saving}>
            <fieldset disabled={saving} className="ariel-form-fields">
              <fieldset className="ariel-attending">
                <legend>{text("Dolazite li na proslavu?", "Долазите ли на прославу?")}</legend>
                <div className="ariel-attending-options">
                  {[
                    { value: "da", label: text("Dolazimo", "Долазимо") },
                    { value: "ne", label: text("Ne možemo", "Не можемо") },
                  ].map(choice => (
                    <label className="ariel-choice" key={choice.value}>
                      <input
                        ref={choice.value === "da" ? yesInput : undefined}
                        type="radio"
                        name={uid + "-attending"}
                        value={choice.value}
                        checked={attending === choice.value}
                        onChange={() => { setAttending(choice.value); clearError(); }}
                        aria-invalid={error?.field === "attending" || undefined}
                        aria-describedby={error?.field === "attending" ? uid + "-error" : undefined}
                        required
                      />
                      <span>{choice.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="ariel-name-field">
                <label htmlFor={uid + "-name"}>{text("Ime i prezime", "Име и презиме")}</label>
                <input
                  ref={nameInput}
                  id={uid + "-name"}
                  name="fullName"
                  autoComplete="name"
                  autoCapitalize="words"
                  maxLength={160}
                  required
                  value={fullName}
                  onChange={event => { setFullName(event.target.value); clearError(); }}
                  aria-invalid={error?.field === "name" || undefined}
                  aria-describedby={error?.field === "name" ? uid + "-error" : undefined}
                />
              </div>

              {attending === "da" && limit > 1 && (
                <div className="ariel-guest-row">
                  <span>{text("Ukupan broj osoba", "Укупан број особа")}</span>
                  <div className="ariel-stepper">
                    <button type="button" disabled={guests <= 1} onClick={() => setGuestCount(guests - 1)} aria-label={text("Smanji broj osoba", "Смањи број особа")}>−</button>
                    <output aria-live="polite">{guests}</output>
                    <button type="button" disabled={guests >= limit} onClick={() => setGuestCount(guests + 1)} aria-label={text("Povećaj broj osoba", "Повећај број особа")}>+</button>
                  </div>
                </div>
              )}

              {error && <p className="ariel-form-error" id={uid + "-error"} role="alert">{error.message}</p>}
              <button className="ariel-button ariel-submit" type="submit" disabled={saving}>
                {saving ? text("Šaljemo odgovor…", "Шаљемо одговор…") : text("Pošalji odgovor", "Пошаљи одговор")}
              </button>
            </fieldset>
          </form>
        )}
      </div>
    </section>
  );
}
