import { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { collection, doc, serverTimestamp, setDoc, writeBatch } from "firebase/firestore";
import { db } from "../firebase";

import { DentelleIcon, DentelleLace, DentelleReveal, dentelleText } from "./DentelleIntro";
import "../styles/newrsvp.css";

// Isti jezici kao u MinimalRSVP, uz očuvanje Dentelle dizajna.
const RSVP_LANGUAGE = {
  sr: {
    rsvp: "Potvrdite dolazak",
    rsvpKicker: "Deo ste naše priče",
    rsvpNote: "Biće nam veliko zadovoljstvo da svojim prisustvom ulepšate naš poseban dan.",
    deadline: "Molimo vas da odgovorite do",
    fullName: "Ime i prezime",
    namePlaceholder: "Unesite ime i prezime",
    attendance: "Da li dolazite?",
    yes: "Dolazim",
    yesNote: "Radujem se što slavim sa vama",
    no: "Ne dolazim",
    noNote: "Nažalost, nisam u mogućnosti",
    guests: "Broj osoba",
    guestsHint: "Ukupan broj osoba, uključujući vas.",
    fewer: "Manje osoba",
    more: "Više osoba",
    guest: "Gost",
    guestNames: "Imena gostiju",
    missingNames: "Unesite ime i prezime za svaku osobu.",
    children: "Od toga dece",
    childrenHint: "Deca su uračunata u ukupan broj osoba.",
    fewerChildren: "Manje dece",
    moreChildren: "Više dece",
    fasting: "Da li postite?",
    fastingYes: "Postim",
    fastingNo: "Ne postim",
    dietary: "Alergije ili posebna ishrana",
    dietaryPlaceholder: "Npr. vegetarijanska ishrana, alergija na orahe...",
    message: "Poruka za mladence",
    messagePlaceholder: "Ostavite nam nekoliko reči...",
    submit: "Pošalji potvrdu",
    sending: "Slanje...",
    thanks: "Hvala!",
    saved: "Vaša potvrda je uspešno poslata.",
    savedYes: "Jedva čekamo da slavimo zajedno!",
    savedNo: "Hvala što ste nas obavestili.",
    another: "Pošalji još jednu potvrdu",
    closed: "Potvrde dolaska su zatvorene",
    closedNote: "Za eventualne izmene kontaktirajte mladence.",
    missingSlug: "Nedostaje oznaka pozivnice ili tip događaja.",
    enterName: "Unesite ime i prezime.",
    chooseAttendance: "Izaberite da li dolazite.",
    invalidGuests: "Unesite ispravan broj osoba.",
    invalidChildren: "Broj dece mora biti manji od ukupnog broja osoba.",
    chooseFasting: "Izaberite da li postite.",
    submitError: "Došlo je do greške pri slanju potvrde. Pokušajte ponovo.",
    offline: "Nema internet veze. Povežite se i pokušajte ponovo.",
  },
  cyrillic: {
    rsvp: "Потврдите долазак",
    rsvpKicker: "Део сте наше приче",
    rsvpNote: "Биће нам велико задовољство да својим присуством улепшате наш посебан дан.",
    deadline: "Молимо вас да одговорите до",
    fullName: "Име и презиме",
    namePlaceholder: "Унесите име и презиме",
    attendance: "Да ли долазите?",
    yes: "Долазим",
    yesNote: "Радујем се што славим са вама",
    no: "Не долазим",
    noNote: "Нажалост, нисам у могућности",
    guests: "Број особа",
    guestsHint: "Укупан број особа, укључујући вас.",
    fewer: "Мање особа",
    more: "Више особа",
    guest: "Гост",
    guestNames: "Имена гостију",
    missingNames: "Унесите име и презиме за сваку особу.",
    children: "Од тога деце",
    childrenHint: "Деца су урачуната у укупан број особа.",
    fewerChildren: "Мање деце",
    moreChildren: "Више деце",
    fasting: "Да ли постите?",
    fastingYes: "Постим",
    fastingNo: "Не постим",
    dietary: "Алергије или посебна исхрана",
    dietaryPlaceholder: "Нпр. вегетаријанска исхрана, алергија на орахе...",
    message: "Порука за младенце",
    messagePlaceholder: "Оставите нам неколико речи...",
    submit: "Пошаљи потврду",
    sending: "Слање...",
    thanks: "Хвала!",
    saved: "Ваша потврда је успешно послата.",
    savedYes: "Једва чекамо да славимо заједно!",
    savedNo: "Хвала што сте нас обавестили.",
    another: "Пошаљи још једну потврду",
    closed: "Потврде доласка су затворене",
    closedNote: "За евентуалне измене контактирајте младенце.",
    missingSlug: "Недостаје ознака позивнице или тип догађаја.",
    enterName: "Унесите име и презиме.",
    chooseAttendance: "Изаберите да ли долазите.",
    invalidGuests: "Унесите исправан број особа.",
    invalidChildren: "Број деце мора бити мањи од укупног броја особа.",
    chooseFasting: "Изаберите да ли постите.",
    submitError: "Дошло је до грешке при слању потврде. Покушајте поново.",
    offline: "Нема интернет везе. Повежите се и покушајте поново.",
  },
  en: {
    rsvp: "Confirm your attendance",
    rsvpKicker: "You are part of our story",
    rsvpNote: "Our day will be even more special with you.",
    deadline: "Please reply by",
    fullName: "Full name",
    namePlaceholder: "Enter your full name",
    attendance: "Will you attend?",
    yes: "Attending",
    yesNote: "I'd love to celebrate with you",
    no: "Not attending",
    noNote: "Unfortunately, I can't make it",
    guests: "Number of guests",
    guestsHint: "Including yourself and children.",
    fewer: "Fewer guests",
    more: "More guests",
    guest: "Guest",
    guestNames: "Guest names",
    missingNames: "Please enter the full name of each guest.",
    children: "Of those, children",
    childrenHint: "Children are included in the total.",
    fewerChildren: "Fewer children",
    moreChildren: "More children",
    fasting: "Are you fasting?",
    fastingYes: "Fasting",
    fastingNo: "Not fasting",
    dietary: "Allergies or dietary requirements",
    dietaryPlaceholder: "e.g. vegetarian, nut allergy...",
    message: "A message for us",
    messagePlaceholder: "Leave us a few words...",
    submit: "Send RSVP",
    sending: "Sending...",
    thanks: "Thank you!",
    saved: "Your RSVP was sent successfully.",
    savedYes: "We can't wait to celebrate together.",
    savedNo: "Thank you for letting us know.",
    another: "Submit another RSVP",
    closed: "RSVPs are closed",
    closedNote: "Please contact the couple for any changes.",
    missingSlug: "Missing invitation or event information.",
    enterName: "Please enter your full name.",
    chooseAttendance: "Please choose whether you will attend.",
    invalidGuests: "Please enter a valid number of guests.",
    invalidChildren: "The number of children must be smaller than the total number of guests.",
    chooseFasting: "Please choose whether you are fasting.",
    submitError: "An error occurred while sending your RSVP. Please try again.",
    offline: "You are offline. Please reconnect and try again.",
  },
  de: {
    rsvp: "Teilnahme bestätigen",
    rsvpKicker: "Ihr seid Teil unserer Geschichte",
    rsvpNote: "Unser Tag wird mit euch noch schöner.",
    deadline: "Bitte antwortet bis zum",
    fullName: "Vor- und Nachname",
    namePlaceholder: "Vor- und Nachnamen eingeben",
    attendance: "Seid ihr dabei?",
    yes: "Wir sind dabei",
    yesNote: "Wir freuen uns auf die Feier",
    no: "Wir sind nicht dabei",
    noNote: "Leider können wir nicht kommen",
    guests: "Anzahl der Gäste",
    guestsHint: "Euch selbst und Kinder mitgezählt.",
    fewer: "Weniger Gäste",
    more: "Mehr Gäste",
    guest: "Gast",
    guestNames: "Namen der Gäste",
    missingNames: "Bitte gebt den vollständigen Namen jedes Gastes ein.",
    children: "Davon Kinder",
    childrenHint: "Kinder sind bereits mitgezählt.",
    fewerChildren: "Weniger Kinder",
    moreChildren: "Mehr Kinder",
    fasting: "Fastet ihr?",
    fastingYes: "Wir fasten",
    fastingNo: "Wir fasten nicht",
    dietary: "Allergien oder besondere Ernährung",
    dietaryPlaceholder: "z. B. vegetarisch, Nussallergie...",
    message: "Eine Nachricht an uns",
    messagePlaceholder: "Hinterlasst uns ein paar Worte...",
    submit: "Antwort senden",
    sending: "Wird gesendet...",
    thanks: "Vielen Dank!",
    saved: "Eure Rückmeldung wurde erfolgreich gesendet.",
    savedYes: "Wir freuen uns, gemeinsam zu feiern.",
    savedNo: "Danke, dass ihr uns Bescheid gegeben habt.",
    another: "Weitere Rückmeldung senden",
    closed: "Anmeldungen sind geschlossen",
    closedNote: "Bei Änderungen kontaktiert bitte das Brautpaar.",
    missingSlug: "Einladungs- oder Veranstaltungsinformationen fehlen.",
    enterName: "Bitte gebt euren Vor- und Nachnamen ein.",
    chooseAttendance: "Bitte wählt aus, ob ihr teilnehmen werdet.",
    invalidGuests: "Bitte gebt eine gültige Anzahl an Gästen ein.",
    invalidChildren: "Die Anzahl der Kinder muss kleiner als die Gesamtzahl sein.",
    chooseFasting: "Bitte wählt aus, ob ihr fastet.",
    submitError: "Beim Senden ist ein Fehler aufgetreten. Bitte versucht es erneut.",
    offline: "Keine Internetverbindung. Bitte verbindet euch erneut.",
  },
};

export default function DentelleRSVP({
  slug, eventType = "wedding", brideName = "", groomName = "", details = {}, script = "latin", language = "sr",
}) {
  const localLanguage = language === "sr" ? (script === "cyrillic" ? "cyrillic" : "sr") : language;
  const t = { ...dentelleText(script), ...RSVP_LANGUAGE.sr, ...(RSVP_LANGUAGE[localLanguage] || {}) };
  const config = details.dentelle || {};
  const options = details.rsvpOptions || {};
  const showFasting = Boolean(options.fasting);
  // Kao u MinimalRSVP: osnovna forma prikazuje samo ime, dolazak, broj osoba
  // i opciono post. Dodatna polja se uključuju samo kada su izričito tražena.
  const showChildren = options.children === true;
  const showDietary = options.dietary === true;
  const showMessage = options.message === true;
  // MinimalRSVP ima posebnu prijavu po osobi za ovaj slug.
  // Kod ostalih slugova opcija se uključuje preko details.rsvpOptions.individualGuests.
  const individualGuests = options.individualGuests == null
    ? slug === "andjela-andrija-5"
    : Boolean(options.individualGuests);
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
  const nameRef = useRef(null);
  const resultRef = useRef(null);
  const errorRef = useRef(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);
  useEffect(() => {
    if (individualGuests) {
      setGuestNames((previous) => Array.from({ length: guests }, (_, index) => previous[index] || ""));
    } else {
      setGuestNames([]);
    }
    setChildren((previous) => Math.min(previous, Math.max(0, guests - 1)));
  }, [guests, individualGuests]);
  useEffect(() => { if (submitted) resultRef.current?.focus({ preventScroll: true }); }, [submitted]);
  useEffect(() => { if (error) errorRef.current?.focus({ preventScroll: true }); }, [error]);

  // Kao u MinimalRSVP: nakon potvrde, zahvalnica traje 3 sekunde.
  useEffect(() => {
    if (!submitted) return undefined;
    const timeout = window.setTimeout(() => {
      if (!mounted.current) return;
      setFullName("");
      setAttending("");
      setGuests(1);
      setChildren(0);
      setGuestNames([""]);
      setFasting("");
      setDietary("");
      setMessage("");
      setError("");
      pending.current = null;
      setSubmitted(false);
    }, 3000);
    return () => window.clearTimeout(timeout);
  }, [submitted]);

  const changeAttendance = (value) => {
    setAttending(value);
    setError("");
    if (value === "da" && individualGuests) {
      setGuestNames((previous) =>
        Array.from({ length: guests }, (_, index) => previous[index] || "")
      );
    }
    if (value === "ne") {
      setGuestNames([""]);
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
    if (!["da", "ne"].includes(attending)) { setError(t.chooseAttendance); return; }
    if ((!individualGuests || attending !== "da") && !fullName.trim()) {
      setError(t.enterName); nameRef.current?.focus(); return;
    }
    if (attending === "da" && (!Number.isInteger(guests) || guests < 1 || guests > maxGuests)) { setError(t.invalidGuests); return; }
    if (attending === "da" && showChildren && (!Number.isInteger(children) || children < 0 || children >= guests)) { setError(t.invalidChildren); return; }
    if (attending === "da" && showFasting && !["posti", "ne_posti"].includes(fasting)) { setError(t.chooseFasting); return; }
    const names = attending === "da" && individualGuests
      ? guestNames.slice(0, guests).map((name) => name.trim())
      : [fullName.trim()];
    if (individualGuests && attending === "da" && (names.length !== guests || names.some((name) => !name))) { setError(t.missingNames); return; }
    if (navigator.onLine === false) { setError(t.offline); return; }
    lock.current = true;
    setLoading(true);
    const totalChildren = attending === "da" && showChildren ? children : 0;
    const fingerprint = JSON.stringify({
      slug, eventType, names, attending,
      guests: attending === "da" ? guests : 0,
      children: totalChildren,
      fasting: attending === "da" && showFasting ? fasting : "",
      dietary: attending === "da" && showDietary ? dietary.trim() : "",
      message: showMessage ? message.trim() : "",
    });
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
      // Kao u MinimalRSVP: prvo kreiramo/ažuriramo događaj, pa tek onda
      // dodajemo potvrde u njegovu RSVP podkolekciju.
      await setDoc(
        doc(db, "events", slug),
        { slug, eventType, updatedAt: serverTimestamp() },
        { merge: true }
      );
      // Grupne prijave se upisuju zajedno, bez delimično sačuvanih gostiju.
      const batch = writeBatch(db);
      names.forEach((name, index) => {
        const payload = {
          eventType,
          fullName: name,
          attending,
          guests: attending === "da" ? (individualGuests ? 1 : guests) : 0,
          fasting: attending === "da" && showFasting ? fasting : "",
          createdAt: serverTimestamp(),
        };
        // MinimalRSVP koristi upravo polja iznad: fullName, attending,
        // guests, fasting, eventType i createdAt. Ostala polja su opciona.
        if (attending === "da" && showChildren && !individualGuests) {
          payload.children = totalChildren;
        }
        if (attending === "da" && showDietary) {
          payload.dietaryRequirements = dietary.trim();
        }
        if (showMessage && message.trim()) {
          payload.note = message.trim();
        }
        if (individualGuests && attending === "da") {
          payload.submissionGroupId = pending.current.groupId;
          if (showChildren) payload.groupChildren = totalChildren;
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
    setFullName(""); setAttending(""); setGuests(1); setChildren(0); setGuestNames([""]);
    setFasting(""); setDietary(""); setMessage(""); setError(""); setSubmitted(false);
    pending.current = null;
    // Kod pojedinačnih gostiju polje za ime ne postoji dok se ne izabere dolazak.
    if (!individualGuests) requestAnimationFrame(() => nameRef.current?.focus({ preventScroll: true }));
  };
  const deadline = config.rsvpDeadline || details.rsvpDeadline;
  return <section className="dnt dnt-rsvp" data-script={script} aria-label={t.rsvp}>
    <DentelleLace src={config.edgeImage} className="dnt-lace-top" />
    <div className="dnt-rsvp-inner">
      {details.rsvpClosed ? <div className="dnt-rsvp-result">
        <DentelleIcon name="heart" size={74} />
        <h2 className="dnt-heading">{t.closed}</h2>
        <p className="dnt-body">{config.closedText || t.closedNote}</p>
      </div> : submitted ? <motion.div className="dnt-rsvp-result" ref={resultRef} tabIndex={-1} role="status"
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div className="dnt-success-seal"
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: [0, 1.12, 1], rotate: [-12, 5, 0] }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        ><DentelleIcon name="check" size={47} /></motion.div>
        <h2 className="dnt-heading">{t.thanks}</h2>
        <p className="dnt-body">{t.saved}</p>
        <p className="dnt-body">{attending === "da" ? t.savedYes : t.savedNo}</p>
        <p className="dnt-rsvp-signature">{brideName} &amp; {groomName}</p>
        <button className="dnt-text-button" type="button" onClick={reset}>{t.another}</button>
      </motion.div> : <>
        <DentelleReveal as="header" className="dnt-rsvp-header">
          <DentelleIcon name="heart" size={76} />
          <p className="dnt-kicker">{config.rsvpKicker || t.rsvpKicker}</p>
          <h2 className="dnt-heading">RSVP</h2>
          <p className="dnt-rsvp-title">{config.rsvpTitle || t.rsvp}</p>
          <p className="dnt-body">{details.rsvpText || t.rsvpNote}</p>
          {deadline && <p className="dnt-rsvp-deadline">{t.deadline} <strong>{deadline}</strong></p>}
          
        </DentelleReveal>
        <form className="dnt-rsvp-form" onSubmit={submit} noValidate aria-busy={loading}>
          <fieldset className="dnt-fields" disabled={loading}>
            {!individualGuests && <div className="dnt-field">
              <label htmlFor={id + "-name"}>{t.fullName}</label>
              <input ref={nameRef} id={id + "-name"} name="fullName" type="text" autoComplete="name" maxLength={150}
                value={fullName} onChange={(event) => { setFullName(event.target.value); setError(""); }} placeholder={t.namePlaceholder} required />
            </div>}
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
            {individualGuests && attending === "ne" && <div className="dnt-field">
              <label htmlFor={id + "-name"}>{t.fullName}</label>
              <input ref={nameRef} id={id + "-name"} name="fullName" type="text" autoComplete="name" maxLength={150}
                value={fullName} onChange={(event) => { setFullName(event.target.value); setError(""); }} placeholder={t.namePlaceholder} required />
            </div>}
            {attending === "da" && <div className="dnt-rsvp-extra">
              <div className="dnt-stepper-row">
                <div><span id={id + "-guests-label"} className="dnt-field-label">{t.guests}</span><p>{t.guestsHint}</p></div>
                <div className="dnt-stepper">
                  <button type="button" aria-label={t.fewer} disabled={guests <= 1} onClick={() => changeGuests(guests - 1)}>−</button>
                  <output aria-labelledby={id + "-guests-label"} aria-live="polite">{guests}</output>
                  <button type="button" aria-label={t.more} disabled={guests >= maxGuests} onClick={() => changeGuests(guests + 1)}>+</button>
                </div>
              </div>
              {individualGuests && <div className="dnt-guest-names">
                <p className="dnt-kicker">{t.guestNames}</p>
                {guestNames.map((name, index) => <div className="dnt-field" key={index}>
                  <label htmlFor={id + "-guest-" + index}>{t.guest} {index + 1}</label>
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
              {showMessage && <div className="dnt-field">
                <label htmlFor={id + "-message"}>{t.message}</label>
                <textarea id={id + "-message"} name="message" rows={3} maxLength={1000} value={message} onChange={(event) => setMessage(event.target.value)} placeholder={t.messagePlaceholder} />
              </div>}
            </div>}
            {showMessage && attending === "ne" && <div className="dnt-field">
              <label htmlFor={id + "-message"}>{t.message}</label>
              <textarea id={id + "-message"} name="message" rows={3} maxLength={1000} value={message} onChange={(event) => setMessage(event.target.value)} placeholder={t.messagePlaceholder} />
            </div>}
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
