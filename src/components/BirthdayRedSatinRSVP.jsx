import { useEffect, useId, useRef, useState } from "react";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { redSatinText } from "./BirthdayRedSatinCountdown";
import "../styles/birthdayrsvp.css";

const GUEST_LIMIT = 10;

export default function BirthdayRedSatinRSVP({
  slug, eventType = "birthday", details = {}, script,
}) {
  const headingId = useId();
  const radioName = useId();
  const guestLabelId = useId();
  const t = (value) => redSatinText(value, script);
  const config = details.redSatin || {};
  const options = details.rsvpOptions || {};
  const [attending, setAttending] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const pending = useRef(false);
  const confirmationHeading = useRef(null);

  useEffect(() => {
    if (result) confirmationHeading.current?.focus();
  }, [result]);

  function changeGuestCount(delta) {
    setGuestCount((count) => Math.min(GUEST_LIMIT, Math.max(1, count + delta)));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (pending.current || result || details.rsvpClosed) return;

    const data = new FormData(event.currentTarget);
    const fullName = String(data.get("fullName") || "").trim();
    const choice = data.get(radioName);
    const guests = choice === "da" ? Number(data.get("guests")) : 0;

    if (!slug || !eventType) {
      setError(t("Pozivnica nema podešen događaj za prijavu."));
      return;
    }
    if (!fullName) {
      setError(t("Unesi ime i prezime."));
      return;
    }
    if (choice !== "da" && choice !== "ne") {
      setError(t("Izaberi da li dolaziš."));
      return;
    }
    if (choice === "da" && (!Number.isInteger(guests) || guests < 1 || guests > GUEST_LIMIT)) {
      setError(t("Izaberi broj osoba koje dolaze."));
      return;
    }

    pending.current = true;
    setSending(true);
    setError("");

    try {
      const response = { fullName, attending: choice, guests, eventType, createdAt: serverTimestamp() };
      if (choice === "da" && options.foodPreferences) {
        response.foodPreferences = String(data.get("foodPreferences") || "").trim();
      }
      if (choice === "da" && options.musicWish) {
        response.musicWish = String(data.get("musicWish") || "").trim();
      }

      // Isti put i struktura dokumenta koje koriste rođendanske pozivnice i admin.
      await setDoc(doc(db, "events", slug), { slug, eventType, updatedAt: serverTimestamp() }, { merge: true });
      await addDoc(collection(db, "events", slug, "rsvps"), response);
      setResult({ attending: choice, guests });
    } catch (cause) {
      pending.current = false;
      console.error("Greška pri slanju RSVP:", cause);
      setError(t("Odgovor nije poslat. Pokušaj ponovo."));
    } finally {
      setSending(false);
    }
  }

  if (details.showRSVP === false) return null;

  const closed = Boolean(details.rsvpClosed);
  const personLabel = (number, first) => number === 1 ? t(first) : number <= 4 ? t("osobe") : t("osoba");

  return (
    <section className="brs-rsvp brs-paper brs-padded" aria-labelledby={headingId}>
      <h2 id={headingId} className="brs-section-title" data-brs-reveal="write">
        <span className="brs-script">{t("Potvrdi")}</span>
        <span className="brs-caps brs-title-tail">{t("dolazak")}</span>
      </h2>
      {!closed && (
        <p className="brs-rsvp-intro" data-brs-reveal="">
          {details.rsvpNote || details.rsvpText || t("Molim te da mi javiš da li dolaziš")}
          {!details.rsvpNote && details.rsvpDeadline && (
            <>
              <br />{t("do ")}
              <strong><time dateTime={details.rsvpDeadlineISO}>{details.rsvpDeadline}</time></strong>
            </>
          )}
        </p>
      )}
      {closed ? (
        <p className="brs-rsvp-closed">{config.rsvpClosedText || t("Potvrđivanje dolaska je završeno.")}</p>
      ) : result ? (
        <div className="brs-rsvp-confirmation brs-rsvp-confirmation--sealed">
          <svg className="brs-icon brs-confirm-check" viewBox="0 0 24 24" aria-hidden="true">
            <path pathLength="1" d="m5 12 4 4L19 6" />
          </svg>
          <h3 className="brs-script" ref={confirmationHeading} tabIndex={-1}>{t("Hvala na odgovoru!")}</h3>
          <p>{result.attending === "da"
            ? t("Dolazak je potvrđen za ") + result.guests + " " + personLabel(result.guests, "osobu") + "."
            : t("Tvoj odgovor je zabeležen.")}</p>
        </div>
      ) : (
        <form className="brs-rsvp-form" onSubmit={handleSubmit} aria-busy={sending} data-brs-reveal="">
          <fieldset className="brs-rsvp-fields" disabled={sending}>
            <label className="brs-field">
              {t("Ime i prezime")}
              <input type="text" name="fullName" maxLength={100} autoComplete="name"
                placeholder={t("Unesi ime i prezime")} required />
            </label>
            <fieldset>
              <legend>{t("Da li dolaziš?")}</legend>
              <div className="brs-attendance-options">
                <label className="brs-attendance">
                  <input type="radio" name={radioName} value="da" required
                    checked={attending === "da"} onChange={() => setAttending("da")} />
                  <span>{t("Dolazim")}</span>
                </label>
                <label className="brs-attendance">
                  <input type="radio" name={radioName} value="ne"
                    checked={attending === "ne"} onChange={() => {
                      setAttending("ne");
                      setGuestCount(1);
                    }} />
                  <span>{t("Ne dolazim")}</span>
                </label>
              </div>
            </fieldset>
            {attending === "da" && (
              <>
                <div className="brs-field brs-guest-field">
                  <span id={guestLabelId}>{t("Broj osoba, uključujući tebe")}</span>
                  <div className="brs-guest-stepper" role="group" aria-labelledby={guestLabelId}>
                    <button className="brs-guest-stepper-button" type="button"
                      aria-label={t("Smanji broj osoba")} disabled={guestCount === 1}
                      onClick={() => changeGuestCount(-1)}>
                      <svg className="brs-icon" aria-hidden="true"><use href="#brs-icon-minus" /></svg>
                    </button>
                    <output className="brs-guest-count">
                      <strong>{guestCount}</strong>{" "}<span>{personLabel(guestCount, "osoba")}</span>
                    </output>
                    <button className="brs-guest-stepper-button" type="button"
                      aria-label={t("Povećaj broj osoba")} disabled={guestCount === GUEST_LIMIT}
                      onClick={() => changeGuestCount(1)}>
                      <svg className="brs-icon" aria-hidden="true"><use href="#brs-icon-plus" /></svg>
                    </button>
                  </div>
                </div>
                <input type="hidden" name="guests" value={guestCount} />
                {options.foodPreferences && (
                  <label className="brs-field">
                    {t("Napomena za hranu (opciono)")}
                    <input name="foodPreferences" type="text" maxLength={240} />
                  </label>
                )}
                {options.musicWish && (
                  <label className="brs-field">
                    {t("Muzička želja (opciono)")}
                    <input name="musicWish" type="text" maxLength={240} />
                  </label>
                )}
              </>
            )}
            {error && <p className="brs-rsvp-error" role="alert">{error}</p>}
            <button className="brs-button brs-button--solid" type="submit" disabled={sending}>
              {sending && <span className="brs-rsvp-spinner" aria-hidden="true" />}
              {sending ? t("Šaljem odgovor…") : t("Pošalji odgovor")}
            </button>
          </fieldset>
        </form>
      )}
    </section>
  );
}
