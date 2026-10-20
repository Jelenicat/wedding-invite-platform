import { useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  collection,
  doc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  NewlywedTimesReveal,
  NewlywedTimesText,
} from "./NewlywedTimesCountdown";

export default function NewlywedTimesRSVP({
  slug,
  eventType = "wedding",
  details = {},
  script = "latin",
  language = "sr",
}) {
  const id = useId();
  const pending = useRef(false);
  const reduced = useReducedMotion();
  const [form, setForm] = useState({
    fullName: "",
    attending: "",
    guests: "1",
    fasting: "",
  });
  const [guestNames, setGuestNames] = useState([""]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const config = details.newlywedTimes || {};
  const options = details.rsvpOptions || {};
  const closed = details.rsvpClosed === true;
  const individual = options.individualGuests === true;
  const maxGuests =
    Number.isInteger(options.maxGuests) && options.maxGuests > 0
      ? options.maxGuests
      : 10;
  const loading = status === "sending";
  const cyr = script === "cyrillic";
  const t =
    language === "en"
      ? {
          title: "Guest",
          subtitle: "reply",
          intro:
            "Let us know if you can join us so we can prepare a wonderful day together.",
          open: "Confirm attendance",
          deadline: "Please reply by",
          name: "Full name",
          placeholder: "Enter your full name",
          attendance: "Will you join us?",
          yes: "Joyfully accept",
          no: "Regretfully decline",
          guests: "Number of guests",
          guest: "Guest",
          fasting: "Fasting meal?",
          fastingYes: "Yes",
          fastingNo: "No",
          send: "Send reply",
          sending: "Sending…",
          thanks: "Thank you!",
          success: "Your reply has been received.",
          closed: "RSVP is closed.",
          invalid: "Please complete the required fields.",
          invalidGuests: "Please enter a valid whole number of guests.",
          failed: "Your reply could not be sent. Please try again.",
          missing: "The invitation identifier is missing.",
        }
      : language === "de"
        ? {
            title: "Eure",
            subtitle: "Rückmeldung",
            intro:
              "Sagt uns Bescheid, ob ihr dabei seid, damit wir diesen Tag gemeinsam planen können.",
            open: "Teilnahme bestätigen",
            deadline: "Bitte antwortet bis zum",
            name: "Vor- und Nachname",
            placeholder: "Vor- und Nachname eingeben",
            attendance: "Seid ihr dabei?",
            yes: "Wir sind dabei",
            no: "Leider nicht",
            guests: "Anzahl der Gäste",
            guest: "Gast",
            fasting: "Fastenmenü?",
            fastingYes: "Ja",
            fastingNo: "Nein",
            send: "Antwort senden",
            sending: "Wird gesendet…",
            thanks: "Vielen Dank!",
            success: "Eure Rückmeldung ist angekommen.",
            closed: "Die Anmeldung ist geschlossen.",
            invalid: "Bitte füllt die Pflichtfelder aus.",
            invalidGuests:
              "Bitte gebt eine gültige ganze Anzahl an Gästen ein.",
            failed:
              "Die Antwort konnte nicht gesendet werden. Bitte erneut versuchen.",
            missing: "Die Kennung der Einladung fehlt.",
          }
        : cyr
          ? {
              title: "Анкета",
              subtitle: "гостију",
              intro:
                "Да бисмо могли да се припремимо за наш посебан дан, молимо вас да потврдите долазак.",
              open: "Потврди долазак",
              deadline: "Молимо за потврду до",
              name: "Име и презиме",
              placeholder: "Унесите име и презиме",
              attendance: "Да ли долазите?",
              yes: "Долазим",
              no: "Не долазим",
              guests: "Број особа",
              guest: "Гост",
              fasting: "Да ли постите?",
              fastingYes: "Постим",
              fastingNo: "Не постим",
              send: "Пошаљи потврду",
              sending: "Слање…",
              thanks: "Хвала!",
              success: "Ваша потврда је успешно послата.",
              closed: "Потврде доласка су затворене.",
              invalid: "Попуните обавезна поља и изаберите одговоре.",
              invalidGuests: "Унесите исправан цео број особа.",
              failed: "Потврда није послата. Покушајте поново.",
              missing: "Недостаје ознака позивнице.",
            }
          : {
              title: "Anketa",
              subtitle: "gostiju",
              intro:
                "Da bismo mogli da se pripremimo za naš poseban dan, molimo vas da potvrdite dolazak.",
              open: "Potvrdi dolazak",
              deadline: "Molimo za potvrdu do",
              name: "Ime i prezime",
              placeholder: "Unesite ime i prezime",
              attendance: "Da li dolazite?",
              yes: "Dolazim",
              no: "Ne dolazim",
              guests: "Broj osoba",
              guest: "Gost",
              fasting: "Da li postite?",
              fastingYes: "Postim",
              fastingNo: "Ne postim",
              send: "Pošalji potvrdu",
              sending: "Slanje…",
              thanks: "Hvala!",
              success: "Vaša potvrda je uspešno poslata.",
              closed: "Potvrde dolaska su zatvorene.",
              invalid: "Popunite obavezna polja i izaberite odgovore.",
              invalidGuests: "Unesite ispravan ceo broj osoba.",
              failed: "Potvrda nije poslata. Pokušajte ponovo.",
              missing: "Nedostaje oznaka pozivnice.",
            };

  function change(event) {
    const { name, value } = event.target;
    setError("");
    setForm((previous) => ({ ...previous, [name]: value }));
    if (name === "guests") {
      const count = Math.max(
        1,
        Math.min(maxGuests, Math.floor(Number(value) || 1)),
      );
      setGuestNames((previous) =>
        Array.from({ length: count }, (_, index) => previous[index] || ""),
      );
    }
  }

  function selectAttendance(value) {
    setError("");
    setForm((previous) => ({ ...previous, attending: value, fasting: "" }));
  }

  async function submit(event) {
    event.preventDefault();
    if (pending.current || closed) return;
    if (!slug || !eventType) {
      setError(t.missing);
      return;
    }
    const accepts = form.attending === "da";
    const count = Number(form.guests);
    if (
      !form.attending ||
      ((!individual || !accepts) && !form.fullName.trim())
    ) {
      setError(t.invalid);
      return;
    }
    if (
      accepts &&
      (!Number.isInteger(count) || count < 1 || count > maxGuests)
    ) {
      setError(`${t.invalidGuests} (1–${maxGuests})`);
      return;
    }
    const names =
      individual && accepts
        ? guestNames.slice(0, count).map((name) => name.trim())
        : [form.fullName.trim()];
    if (
      names.some((name) => !name) ||
      (individual && accepts && names.length !== count) ||
      (accepts && options.fasting && !form.fasting)
    ) {
      setError(t.invalid);
      return;
    }
    pending.current = true;
    setStatus("sending");
    setError("");
    try {
      // Ista putanja i polja kao u MinimalRSVP, sa atomskim upisom grupe.
      const batch = writeBatch(db);
      batch.set(
        doc(db, "events", slug),
        { slug, eventType, updatedAt: serverTimestamp() },
        { merge: true },
      );
      const submissionGroupId =
        individual && accepts
          ? `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
          : null;
      names.forEach((fullName) => {
        const record = {
          eventType,
          fullName,
          attending: form.attending,
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
      console.error("Newlywed Times RSVP:", cause);
      setError(t.failed);
      setStatus("idle");
    } finally {
      pending.current = false;
    }
  }

  return (
    <section className="nwt-rsvp" aria-labelledby={`${id}-title`}>
      <div className="nwt-coupon-edge" aria-hidden="true">
        <img
          src="/icons/newlywed-times-scissors.svg"
          width="32"
          height="19"
          alt=""
        />
      </div>
      <NewlywedTimesReveal className="nwt-reply-header">
        <h2 id={`${id}-title`} className="nwt-rsvp-title">
          <NewlywedTimesText as="span">
            {config.rsvpTitle || "R.S.V.P."}
          </NewlywedTimesText>
          <span className="nwt-kicker">
            {config.rsvpSubtitle || t.subtitle}
          </span>
        </h2>
        <p className="nwt-copy nwt-rsvp-intro">{details.rsvpText || t.intro}</p>
        {details.rsvpDeadline && (
          <p className="nwt-rsvp-deadline">
            <span>{t.deadline}</span>
            <strong>{details.rsvpDeadline}</strong>
          </p>
        )}
      </NewlywedTimesReveal>
      {closed ? (
        <p className="nwt-rsvp-closed">{t.closed}</p>
      ) : (
        <div className="nwt-form-reveal">
          {status === "success" ? (
            <div className="nwt-rsvp-success" role="status">
              <motion.img
                src="/icons/newlywed-times-reply.svg"
                width="70"
                height="70"
                alt=""
                initial={
                  reduced ? false : { scale: 1.4, rotate: -18, opacity: 0 }
                }
                animate={{ scale: 1, rotate: -5, opacity: 1 }}
                transition={{ duration: reduced ? 0 : 0.55 }}
              />
              <h3>{t.thanks}</h3>
              <p className="nwt-copy">{t.success}</p>
            </div>
          ) : (
            <form
              className="nwt-form"
              onSubmit={submit}
              aria-busy={loading}
              noValidate
            >
              <fieldset disabled={loading} className="nwt-form-fields">
                {(!individual || form.attending !== "da") && (
                  <div className="nwt-field">
                    <label htmlFor={`${id}-name`}>{t.name}</label>
                    <input
                      id={`${id}-name`}
                      name="fullName"
                      type="text"
                      value={form.fullName}
                      onChange={change}
                      placeholder={t.placeholder}
                      autoComplete="name"
                      maxLength={120}
                      required
                    />
                  </div>
                )}
                <fieldset className="nwt-choice">
                  <legend>{t.attendance}</legend>
                  <div className="nwt-choice-grid">
                    {[
                      { value: "da", label: t.yes },
                      { value: "ne", label: t.no },
                    ].map((choice) => (
                      <label
                        className={`nwt-radio ${form.attending === choice.value ? "nwt-selected" : ""}`}
                        key={choice.value}
                      >
                        <input
                          type="radio"
                          name="attending"
                          value={choice.value}
                          checked={form.attending === choice.value}
                          onChange={() => selectAttendance(choice.value)}
                          required
                        />
                        <span>{choice.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <AnimatePresence initial={false}>
                  {form.attending === "da" && (
                    <motion.div
                      key="attending-fields"
                      className="nwt-conditional-fields"
                      initial={reduced ? false : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={reduced ? undefined : { opacity: 0, height: 0 }}
                      transition={{ duration: reduced ? 0 : 0.3 }}
                    >
                      <div className="nwt-field">
                        <label htmlFor={`${id}-guests`}>{t.guests}</label>
                        <input
                          id={`${id}-guests`}
                          type="number"
                          inputMode="numeric"
                          name="guests"
                          min="1"
                          max={maxGuests}
                          step="1"
                          value={form.guests}
                          onChange={change}
                          required
                        />
                      </div>
                      {individual &&
                        guestNames.map((name, index) => (
                          <div className="nwt-field" key={index}>
                            <label htmlFor={`${id}-guest-${index}`}>
                              {t.guest} {index + 1} — {t.name}
                            </label>
                            <input
                              id={`${id}-guest-${index}`}
                              type="text"
                              value={name}
                              maxLength={120}
                              required
                              onChange={(event) => {
                                const value = event.target.value;
                                setGuestNames((previous) =>
                                  previous.map((entry, current) =>
                                    current === index ? value : entry,
                                  ),
                                );
                              }}
                            />
                          </div>
                        ))}
                      {options.fasting && (
                        <fieldset className="nwt-choice">
                          <legend>{t.fasting}</legend>
                          <div className="nwt-choice-grid">
                            {[
                              { value: "posti", label: t.fastingYes },
                              { value: "ne_posti", label: t.fastingNo },
                            ].map((choice) => (
                              <label
                                className={`nwt-radio ${form.fasting === choice.value ? "nwt-selected" : ""}`}
                                key={choice.value}
                              >
                                <input
                                  type="radio"
                                  name="fasting"
                                  value={choice.value}
                                  checked={form.fasting === choice.value}
                                  onChange={change}
                                  required
                                />
                                <span>{choice.label}</span>
                              </label>
                            ))}
                          </div>
                        </fieldset>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                {error && (
                  <p className="nwt-form-error" role="alert">
                    {error}
                  </p>
                )}
                <motion.button
                  className="nwt-button nwt-submit"
                  type="submit"
                  disabled={loading}
                  whileTap={reduced ? undefined : { scale: 0.985 }}
                >
                  {loading ? t.sending : t.send}
                  {!loading && (
                    <img
                      src="/icons/newlywed-times-arrow.svg"
                      width="26"
                      height="13"
                      alt=""
                    />
                  )}
                </motion.button>
              </fieldset>
            </form>
          )}
        </div>
      )}
    </section>
  );
}
