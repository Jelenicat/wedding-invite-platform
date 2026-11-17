import { useEffect, useRef, useState } from "react";
import { collection, doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "../firebase";
import { aureaLocale } from "./AureaIntro";
import "../styles/newrsvp.css";

// Standardni RSVP po uzoru na MinimalRSVP:
// jedna potvrda = jedno ime i prezime + ukupan broj osoba.
// Nema pojedinačnih menija, alergija ni zasebnih RSVP dokumenata po gostu.
const COPY = {
  "sr-Latn": {
    heading: "Potvrdite dolazak",
    subtitle: "Biće nam veliko zadovoljstvo da svojim prisustvom ulepšate naš poseban dan.",
    deadline: "Molimo vas da odgovorite do",
    name: "Ime i prezime",
    placeholder: "Unesite ime i prezime",
    attendance: "Da li dolazite?",
    yes: "Dolazim",
    no: "Ne dolazim",
    count: "Broj osoba",
    less: "Smanji broj osoba",
    more: "Povećaj broj osoba",
    fasting: "Da li postite?",
    fast: "Postim",
    noFast: "Ne postim",
    message: "Poruka mladencima (opciono)",
    submit: "Pošalji potvrdu",
    sending: "Slanje…",
    closed: "Potvrde dolaska su zatvorene.",
    thanks: "Hvala na odgovoru",
    success: "Vaša potvrda je uspešno poslata.",
    demo: "Probna potvrda je prikazana. Podaci nisu poslati.",
    nameError: "Unesite ime i prezime.",
    attendanceError: "Izaberite da li dolazite.",
    fastingError: "Izaberite da li postite.",
    error: "Potvrda trenutno ne može da se pošalje. Pokušajte ponovo.",
  },
  "sr-Cyrl": {
    heading: "Потврдите долазак",
    subtitle: "Биће нам велико задовољство да својим присуством улепшате наш посебан дан.",
    deadline: "Молимо вас да одговорите до",
    name: "Име и презиме",
    placeholder: "Унесите име и презиме",
    attendance: "Да ли долазите?",
    yes: "Долазим",
    no: "Не долазим",
    count: "Број особа",
    less: "Смањи број особа",
    more: "Повећај број особа",
    fasting: "Да ли постите?",
    fast: "Постим",
    noFast: "Не постим",
    message: "Порука младенцима (опционо)",
    submit: "Пошаљи потврду",
    sending: "Слање…",
    closed: "Потврде доласка су затворене.",
    thanks: "Хвала на одговору",
    success: "Ваша потврда је успешно послата.",
    demo: "Пробна потврда је приказана. Подаци нису послати.",
    nameError: "Унесите име и презиме.",
    attendanceError: "Изаберите да ли долазите.",
    fastingError: "Изаберите да ли постите.",
    error: "Потврда тренутно не може да се пошаље. Покушајте поново.",
  },
  en: {
    heading: "Confirm your attendance",
    subtitle: "It would mean so much to us to have you with us on our special day.",
    deadline: "Please reply by",
    name: "Full name",
    placeholder: "Enter your full name",
    attendance: "Will you attend?",
    yes: "Attending",
    no: "Not attending",
    count: "Number of guests",
    less: "Remove one guest",
    more: "Add one guest",
    fasting: "Are you fasting?",
    fast: "Fasting",
    noFast: "Not fasting",
    message: "Message to the couple (optional)",
    submit: "Send RSVP",
    sending: "Sending…",
    closed: "RSVPs are closed.",
    thanks: "Thank you!",
    success: "Your RSVP has been sent successfully.",
    demo: "This is a preview. No data was sent.",
    nameError: "Please enter your full name.",
    attendanceError: "Please choose whether you will attend.",
    fastingError: "Please indicate whether you are fasting.",
    error: "We couldn't send your RSVP. Please try again.",
  },
  de: {
    heading: "Teilnahme bestätigen",
    subtitle: "Wir würden uns sehr freuen, diesen besonderen Tag gemeinsam mit euch zu feiern.",
    deadline: "Bitte antwortet bis zum",
    name: "Vor- und Nachname",
    placeholder: "Vor- und Nachname eingeben",
    attendance: "Seid ihr dabei?",
    yes: "Wir kommen",
    no: "Wir können nicht kommen",
    count: "Anzahl der Gäste",
    less: "Einen Gast entfernen",
    more: "Einen Gast hinzufügen",
    fasting: "Fastet ihr?",
    fast: "Ja",
    noFast: "Nein",
    message: "Nachricht an das Brautpaar (optional)",
    submit: "Antwort absenden",
    sending: "Wird gesendet…",
    closed: "Die Rückmeldefrist ist abgelaufen.",
    thanks: "Vielen Dank!",
    success: "Eure Rückmeldung wurde erfolgreich gesendet.",
    demo: "Dies ist eine Vorschau. Es wurden keine Daten gesendet.",
    nameError: "Bitte gebt euren Vor- und Nachnamen ein.",
    attendanceError: "Bitte wählt aus, ob ihr teilnehmen werdet.",
    fastingError: "Bitte wählt aus, ob ihr fastet.",
    error: "Eure Rückmeldung konnte nicht gesendet werden. Bitte versucht es erneut.",
  },
};

function isClosed(closesAt) {
  if (!closesAt) return false;
  if (/^\d{4}-\d{2}-\d{2}$/.test(closesAt)) {
    const todayInSerbia = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Belgrade" }).format(new Date());
    return todayInSerbia > closesAt;
  }
  const limit = Date.parse(closesAt);
  return Number.isFinite(limit) && Date.now() >= limit;
}

export default function AureaRSVP({
  slug,
  eventType = "wedding",
  details = {},
  language = "sr",
  script = "latin",
  preview = false,
}) {
  const copy = COPY[aureaLocale(language, script)] || COPY["sr-Latn"];
  const options = details.rsvpOptions || {};
  const configuredMax = Number(options.maxGuests);
  const maxGuests = Number.isInteger(configuredMax) && configuredMax > 0
    ? Math.min(configuredMax, 20)
    : 10;
  const fastingEnabled = options.fasting === true;
  const messageEnabled = options.message === true;
  const deadlineLabel = options.deadlineLabel || details.rsvpDeadline;
  const closesAt = options.closesAt || details.rsvpDeadlineISO;

  const [fullName, setFullName] = useState("");
  const [attendance, setAttendance] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [fasting, setFasting] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [deadlinePassed, setDeadlinePassed] = useState(() => isClosed(closesAt));

  const sending = useRef(false);
  const lastAttempt = useRef(null);

  useEffect(() => {
    const check = () => setDeadlinePassed(isClosed(closesAt));
    check();
    if (!closesAt) return undefined;
    const timer = window.setInterval(check, 30000);
    return () => window.clearInterval(timer);
  }, [closesAt]);

  const coming = attendance === "da";
  const count = Math.max(1, Math.min(guestCount, maxGuests));
  const closed = Boolean(details.rsvpClosed || deadlinePassed);

  const choose = (value) => {
    setAttendance(value);
    setError("");
    if (value === "ne") setFasting("");
  };

  const submit = async (event) => {
    event.preventDefault();
    if (sending.current || submitted) return;

    if (closed || isClosed(closesAt)) {
      setDeadlinePassed(true);
      return;
    }

    if (!fullName.trim()) {
      setError(copy.nameError);
      return;
    }
    if (!attendance) {
      setError(copy.attendanceError);
      return;
    }
    if (coming && fastingEnabled && !fasting) {
      setError(copy.fastingError);
      return;
    }
    if (!slug && !preview) {
      setError(copy.error);
      return;
    }

    setError("");
    if (preview) {
      setSubmitted(true);
      return;
    }

    const response = {
      eventType,
      fullName: fullName.trim(),
      attending: attendance,
      guests: coming ? count : 0,
      fasting: coming && fastingEnabled ? fasting : "",
      ...(messageEnabled ? { message: message.trim() } : {}),
    };

    sending.current = true;
    setPending(true);
    try {
      const key = JSON.stringify(response);
      if (lastAttempt.current?.key !== key) {
        const responses = collection(db, "events", slug, "rsvps");
        lastAttempt.current = { key, ref: doc(responses) };
      }

      // Jedna atomarna potvrda sa ukupnim brojem gostiju.
      const batch = writeBatch(db);
      batch.set(doc(db, "events", slug), {
        slug,
        eventType,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      batch.set(lastAttempt.current.ref, {
        ...response,
        createdAt: serverTimestamp(),
      });
      await batch.commit();
      setSubmitted(true);
    } catch (failure) {
      console.error("Aurea RSVP", failure);
      setError(copy.error);
    } finally {
      sending.current = false;
      setPending(false);
    }
  };

  return (
    <section
      className="aurea-rsvp aurea-rsvp--standard"
      id="aurea-rsvp"
      aria-labelledby="aurea-rsvp-title"
    >
      <h2 className="aurea-script" id="aurea-rsvp-title">{copy.heading}</h2>

      {submitted ? (
        <div className="aurea-rsvp-feedback" role="status">
          <strong>{copy.thanks}</strong>
          <p>{preview ? copy.demo : copy.success}</p>
        </div>
      ) : closed ? (
        <p className="aurea-rsvp-feedback" role="status">{copy.closed}</p>
      ) : (
        <>
          <p className="aurea-rsvp-text">{details.rsvpText || copy.subtitle}</p>
          {deadlineLabel && (
            <p className="aurea-rsvp-deadline">
              {copy.deadline} <strong>{deadlineLabel}</strong>
            </p>
          )}

          <form onSubmit={submit} noValidate>
            <fieldset className="aurea-rsvp-fields" disabled={pending}>
              <label className="aurea-rsvp-field">
                {copy.name}
                <input
                  type="text"
                  name="fullName"
                  value={fullName}
                  onChange={(event) => {
                    setFullName(event.target.value);
                    setError("");
                  }}
                  placeholder={copy.placeholder}
                  maxLength={120}
                  autoComplete="name"
                  required
                />
              </label>

              <fieldset className="aurea-rsvp-choices">
                <legend>{copy.attendance}</legend>
                <div className="aurea-rsvp-choice-grid">
                  {[["da", copy.yes], ["ne", copy.no]].map(([value, label]) => (
                    <label key={value}>
                      <input
                        type="radio"
                        name="aurea-attendance"
                        value={value}
                        checked={attendance === value}
                        onChange={() => choose(value)}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {coming && maxGuests > 1 && (
                <div className="aurea-rsvp-stepper">
                  <span id="aurea-guest-count-label">{copy.count}</span>
                  <div role="group" aria-labelledby="aurea-guest-count-label">
                    <button
                      type="button"
                      disabled={count <= 1}
                      onClick={() => setGuestCount((previous) => Math.max(1, previous - 1))}
                      aria-label={copy.less}
                    >−</button>
                    <output aria-live="polite">{count}</output>
                    <button
                      type="button"
                      disabled={count >= maxGuests}
                      onClick={() => setGuestCount((previous) => Math.min(maxGuests, previous + 1))}
                      aria-label={copy.more}
                    >+</button>
                  </div>
                </div>
              )}

              {coming && fastingEnabled && (
                <fieldset className="aurea-rsvp-choices aurea-rsvp-fasting">
                  <legend>{copy.fasting}</legend>
                  <div className="aurea-rsvp-choice-grid">
                    {[["posti", copy.fast], ["ne_posti", copy.noFast]].map(([value, label]) => (
                      <label key={value}>
                        <input
                          type="radio"
                          name="aurea-fasting"
                          value={value}
                          checked={fasting === value}
                          onChange={() => setFasting(value)}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {attendance && messageEnabled && (
                <label className="aurea-rsvp-field">
                  {copy.message}
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    maxLength={600}
                    rows={3}
                  />
                </label>
              )}

              {error && <p className="aurea-rsvp-error" role="alert">{error}</p>}
              <button type="submit" className="aurea-rsvp-submit" disabled={pending}>
                {pending ? copy.sending : copy.submit}
              </button>
            </fieldset>
          </form>
        </>
      )}
    </section>
  );
}
