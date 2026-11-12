import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion as Motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { addDoc, collection, doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { db } from "../firebase";
import { AdriaticaIcon } from "./AdriaticaCountdown.jsx";
import "../styles/newintro.css";
import "../styles/newrsvp.css";

const ADRIATICA_MAX_GUESTS = 8;
const ADRIATICA_NAME_LENGTH = 120;
const ADRIATICA_ALLERGY_LENGTH = 500;

const adriaticaMenus = [
  { value: "meat", label: "Mesni meni" },
  { value: "fish", label: "Riblji meni" },
  { value: "vegetarian", label: "Vegetarijanski meni" },
];

const normalizeAdriaticaName = (name) =>
  name.trim().replace(/\s+/gu, " ");

function isAdriaticaFullName(value) {
  const name = normalizeAdriaticaName(value);
  return (
    name.length <= ADRIATICA_NAME_LENGTH &&
    /^[^\s]*\p{L}[^\s]*(?: [^\s]*\p{L}[^\s]*)+$/u.test(name)
  );
}

const attendanceOptions = ["da", "ne"];
const blankGuest = () => ({ fullName: "", menu: "", allergies: "" });

const rsvpCopy = {
  sr: {
    title: "Potvrdite dolazak",
    deadline: "Molimo vas da odgovorite do",
    thanks: "Hvala vam na odgovoru",
    accepted: "Radujemo se što ćemo slaviti sa vama.",
    declined: "Hvala što ste nam javili. Mislimo na vas.",
    closed: "Prijave su završene. Za naknadne izmene javite se mladencima.",
    attendanceQuestion: "Da li dolazite?",
    attendance: { da: "Dolazim", ne: "Ne dolazim" },
    attendanceError: "Izaberite odgovor o dolasku.",
    guest: "Gost",
    fullName: "Ime i prezime",
    nameError: "Unesite ime i prezime.",
    guestNameError: "Unesite ime i prezime gosta.",
    chooseMenu: "Izbor menija",
    menuError: "Izaberite meni za ovog gosta.",
    allergies: "Alergije ili napomene o ishrani",
    optional: "(opciono)",
    guestCount: "Broj gostiju, uključujući vas",
    fewerGuests: "Smanji broj gostiju",
    moreGuests: "Povećaj broj gostiju",
    privacy: "Napomene su vidljive organizatoru. Upišite samo ono što je važno za obrok.",
    invalid: "Proverite označena polja.",
    offline: "Veza sa internetom je prekinuta. Proverite vezu i pokušajte ponovo.",
    permission: "Potvrda trenutno ne može da se primi. Javite se mladencima da potvrdite dolazak.",
    retry: "Slanje nije uspelo. Vaši unosi su sačuvani u formularu. Pokušajte ponovo.",
    slow: "Veza je usporena. Sačekajte potvrdu slanja.",
    sendingStatus: "Šaljemo vaš odgovor…",
    sending: "Slanje…",
    submit: "Pošalji odgovor",
  },
  de: {
    title: "Rückmeldung zur Hochzeit",
    deadline: "Bitte gebt uns bis zum",
    deadlineSuffix: "Bescheid.",
    thanks: "Danke für eure Rückmeldung",
    accepted: "Wir freuen uns darauf, mit euch zu feiern.",
    declined: "Danke, dass ihr uns Bescheid gegeben habt. Wir denken an euch.",
    closed: "Die Rückmeldefrist ist abgelaufen. Bitte wendet euch für Änderungen an das Brautpaar.",
    attendanceQuestion: "Kommt ihr zur Hochzeit?",
    attendance: { da: "Ich komme", ne: "Ich komme nicht" },
    attendanceError: "Bitte wählt aus, ob ihr zur Hochzeit kommt.",
    guest: "Gast",
    fullName: "Vor- und Nachname",
    nameError: "Bitte gebt euren Vor- und Nachnamen ein.",
    guestNameError: "Bitte gebt den Vor- und Nachnamen des Gastes ein.",
    chooseMenu: "Menüauswahl",
    menuLabels: { meat: "Fleisch", fish: "Fisch", vegetarian: "Vegetarisch" },
    menuError: "Bitte wählt ein Menü für diesen Gast.",
    allergies: "Allergien oder Hinweise zum Essen",
    optional: "(optional)",
    guestCount: "Anzahl der Gäste (inklusive euch)",
    fewerGuests: "Gästezahl verringern",
    moreGuests: "Gästezahl erhöhen",
    privacy: "Das Brautpaar sieht eure Hinweise. Gebt bitte nur an, was für das Essen wichtig ist.",
    invalid: "Bitte überprüft die markierten Felder.",
    offline: "Die Internetverbindung wurde unterbrochen. Bitte prüft eure Verbindung und versucht es erneut.",
    permission: "Eure Rückmeldung kann gerade nicht entgegengenommen werden. Bitte meldet euch beim Brautpaar.",
    retry: "Das Senden hat nicht geklappt. Eure Angaben stehen noch im Formular. Bitte versucht es erneut.",
    slow: "Die Verbindung ist langsam. Bitte wartet auf die Bestätigung.",
    sendingStatus: "Eure Rückmeldung wird gesendet…",
    sending: "Wird gesendet…",
    submit: "Rückmeldung senden",
  },
};

function GuestFields({
  index,
  guest,
  menus,
  showAllergies,
  invalidName,
  invalidMenu,
  update,
  copy,
}) {
  const prefix = `adriatica-guest-${index}`;

  return (
    <fieldset className="adriatica-guest-card">
      <legend>{copy.guest} {index + 1}</legend>
      <div className="adriatica-rsvp-field">
        <label htmlFor={`${prefix}-name`}>{copy.fullName}</label>
        <input
          id={`${prefix}-name`}
          autoComplete={`section-guest${index + 1} name`}
          value={guest.fullName}
          maxLength={ADRIATICA_NAME_LENGTH}
          required
          aria-invalid={invalidName || undefined}
          aria-describedby={invalidName ? `${prefix}-name-error` : undefined}
          onChange={(event) => update("fullName", event.target.value)}
        />
        {invalidName && (
          <p className="adriatica-rsvp-error" id={`${prefix}-name-error`}>
            {copy.guestNameError}
          </p>
        )}
      </div>

      <fieldset className="adriatica-rsvp-field adriatica-menu-group">
        <legend>{copy.chooseMenu}</legend>
        <div className="adriatica-menu-options">
          {menus.map(({ value, label }) => (
            <label className="adriatica-option" key={value}>
              <input
                type="radio"
                id={`${prefix}-${value}`}
                name={`${prefix}-menu`}
                value={value}
                checked={guest.menu === value}
                required
                aria-invalid={invalidMenu || undefined}
                aria-describedby={
                  invalidMenu ? `${prefix}-menu-error` : undefined
                }
                onChange={() => update("menu", value)}
              />
              <span>{copy.menuLabels?.[value] || label}</span>
            </label>
          ))}
        </div>
        {invalidMenu && (
          <p className="adriatica-rsvp-error" id={`${prefix}-menu-error`}>
            {copy.menuError}
          </p>
        )}
      </fieldset>

      {showAllergies && (
        <div className="adriatica-rsvp-field">
          <label htmlFor={`${prefix}-allergies`}>
            {copy.allergies} <span>{copy.optional}</span>
          </label>
          <textarea
            id={`${prefix}-allergies`}
            rows="2"
            value={guest.allergies}
            maxLength={ADRIATICA_ALLERGY_LENGTH}
            aria-describedby="adriatica-rsvp-privacy"
            onChange={(event) => update("allergies", event.target.value)}
          />
        </div>
      )}
    </fieldset>
  );
}

export default function AdriaticaRSVP({
  slug,
  options = {},
  closed = false,
  language = "sr",
}) {
  const copy = language === "de" ? rsvpCopy.de : rsvpCopy.sr;
  const maxGuests = Number.isInteger(options.maxGuests)
    ? Math.min(ADRIATICA_MAX_GUESTS, Math.max(1, options.maxGuests))
    : ADRIATICA_MAX_GUESTS;
  const configuredMenus = Array.isArray(options.menuChoices)
    ? adriaticaMenus.filter(({ value }) => options.menuChoices.includes(value))
    : adriaticaMenus;
  const menus = configuredMenus.length ? configuredMenus : adriaticaMenus;
  const showAllergies = options.showGuestAllergies !== false;
  const cutoff = Date.parse(options.closesAt);
  const [timeNow, setTimeNow] = useState(Date.now);
  const [attending, setAttending] = useState("");
  const [count, setCount] = useState(1);
  const [declineName, setDeclineName] = useState("");
  const [drafts, setDrafts] = useState(() =>
    Array.from({ length: ADRIATICA_MAX_GUESTS }, blankGuest),
  );
  const [attempted, setAttempted] = useState(false);
  const [sending, setSending] = useState(false);
  const [slow, setSlow] = useState(false);
  const [receipt, setReceipt] = useState("");
  const [error, setError] = useState("");
  const submitting = useRef(false);
  const successHeading = useRef(null);
  const reducedMotion = useReducedMotion();

  const isClosed = closed || (Number.isFinite(cutoff) && timeNow >= cutoff);
  const isComing = attending === "da";
  const guestDetails = isComing ? drafts.slice(0, count) : [];
  const invalidFields = guestDetails.map((guest) => ({
    name: !isAdriaticaFullName(guest.fullName),
    menu: !menus.some(({ value }) => value === guest.menu),
  }));
  const missingDeclineName =
    attending === "ne" && !isAdriaticaFullName(declineName);
  const hasInvalidFields =
    !attending ||
    missingDeclineName ||
    invalidFields.some(({ name, menu }) => name || menu);

  useEffect(() => {
    if (!Number.isFinite(cutoff) || isClosed) return;
    const updateTime = () => setTimeNow(Date.now());
    const interval = window.setInterval(updateTime, 30_000);
    document.addEventListener("visibilitychange", updateTime);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", updateTime);
    };
  }, [cutoff, isClosed]);

  useEffect(() => {
    if (!sending) return;
    const timeout = window.setTimeout(() => setSlow(true), 7000);
    return () => window.clearTimeout(timeout);
  }, [sending]);

  useEffect(() => {
    if (receipt) successHeading.current?.focus();
  }, [receipt]);

  const updateGuest = (index, key, value) => {
    setDrafts((current) =>
      current.map((guest, guestIndex) =>
        guestIndex === index ? { ...guest, [key]: value } : guest,
      ),
    );
  };

  const submit = async (event) => {
    event.preventDefault();
    if (submitting.current) return;
    if (closed || (Number.isFinite(cutoff) && Date.now() >= cutoff)) {
      setTimeNow(Date.now());
      return;
    }

    setAttempted(true);
    setError("");
    if (hasInvalidFields) {
      const firstGuest = invalidFields.findIndex(
        ({ name, menu }) => name || menu,
      );
      let fieldId = "adriatica-attending-da";
      if (missingDeclineName) fieldId = "adriatica-decline-name";
      if (firstGuest !== -1) {
        fieldId = `adriatica-guest-${firstGuest}-${invalidFields[firstGuest].name ? "name" : menus[0].value}`;
      }
      document.getElementById(fieldId)?.focus();
      return;
    }

    if (!navigator.onLine) {
      setError(copy.offline);
      return;
    }

    const normalizedGuests = guestDetails.map(
      ({ fullName, menu, allergies }) => ({
        fullName: normalizeAdriaticaName(fullName),
        menu,
        allergies: showAllergies ? allergies.trim() : "",
      }),
    );
    submitting.current = true;
    setSlow(false);
    setSending(true);

    try {
      await addDoc(collection(db, "events", slug, "rsvps"), {
        slug,
        eventType: "wedding",
        attending,
        fullName: isComing
          ? normalizedGuests[0].fullName
          : normalizeAdriaticaName(declineName),
        guests: normalizedGuests.length,
        note: "",
        guestDetails: normalizedGuests,
        createdAt: serverTimestamp(),
      });
      setReceipt(attending);
    } catch (writeError) {
      submitting.current = false;
      setTimeNow(Date.now());
      setError(
        writeError?.code === "permission-denied"
          ? copy.permission
          : copy.retry,
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      className="adriatica-section adriatica-rsvp"
      id="adriatica-rsvp"
      aria-labelledby="adriatica-rsvp-title"
    >
      <div className="adriatica-section-heading">
        <h2 id="adriatica-rsvp-title">{copy.title}</h2>
        {options.deadlineLabel && (
          <p>
            {copy.deadline} <strong>{options.deadlineLabel}</strong>
            {copy.deadlineSuffix && ` ${copy.deadlineSuffix}`}
          </p>
        )}
      </div>

      {receipt ? (
        <Motion.div
          className="adriatica-rsvp-receipt"
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.35 }}
        >
          <AdriaticaIcon name="check" />
          <h3 ref={successHeading} tabIndex={-1}>
            {copy.thanks}
          </h3>
          <p>
            {receipt === "da" ? copy.accepted : copy.declined}
          </p>
        </Motion.div>
      ) : isClosed && !sending ? (
        <p className="adriatica-rsvp-closed">
          {copy.closed}
        </p>
      ) : (
        <form className="adriatica-rsvp-form" noValidate onSubmit={submit}>
          <fieldset className="adriatica-rsvp-form-fields" disabled={sending}>
            <fieldset className="adriatica-attendance">
              <legend>{copy.attendanceQuestion}</legend>
              <div className="adriatica-attendance-options">
                {attendanceOptions.map((value) => (
                  <label className="adriatica-option" key={value}>
                    <input
                      type="radio"
                      id={`adriatica-attending-${value}`}
                      name="adriatica-attending"
                      value={value}
                      checked={attending === value}
                      required
                      aria-invalid={attempted && !attending ? true : undefined}
                      aria-describedby={
                        attempted && !attending
                          ? "adriatica-attending-error"
                          : undefined
                      }
                      onChange={() => {
                        setAttending(value);
                        setAttempted(false);
                        setError("");
                      }}
                    />
                    <span>{copy.attendance[value]}</span>
                  </label>
                ))}
              </div>
              {attempted && !attending && (
                <p
                  className="adriatica-rsvp-error"
                  id="adriatica-attending-error"
                >
                  {copy.attendanceError}
                </p>
              )}
            </fieldset>

            {attending === "ne" && (
              <div className="adriatica-rsvp-field">
                <label htmlFor="adriatica-decline-name">{copy.fullName}</label>
                <input
                  id="adriatica-decline-name"
                  autoComplete="name"
                  value={declineName}
                  maxLength={ADRIATICA_NAME_LENGTH}
                  required
                  aria-invalid={(attempted && missingDeclineName) || undefined}
                  aria-describedby={
                    attempted && missingDeclineName
                      ? "adriatica-decline-error"
                      : undefined
                  }
                  onChange={(event) => setDeclineName(event.target.value)}
                />
                {attempted && missingDeclineName && (
                  <p
                    className="adriatica-rsvp-error"
                    id="adriatica-decline-error"
                  >
                    {copy.nameError}
                  </p>
                )}
              </div>
            )}

            {isComing && (
              <div className="adriatica-rsvp-guests">
                {maxGuests > 1 && (
                  <div className="adriatica-guest-count">
                    <span id="adriatica-guest-count-label">
                      {copy.guestCount}
                    </span>
                    <div
                      role="group"
                      aria-labelledby="adriatica-guest-count-label"
                      className="adriatica-stepper"
                    >
                      <button
                        type="button"
                        aria-label={copy.fewerGuests}
                        disabled={count <= 1}
                        onClick={() =>
                          setCount((value) => Math.max(1, value - 1))
                        }
                      >
                        −
                      </button>
                      <output aria-live="polite">{count}</output>
                      <button
                        type="button"
                        aria-label={copy.moreGuests}
                        disabled={count >= maxGuests}
                        onClick={() =>
                          setCount((value) => Math.min(maxGuests, value + 1))
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
                {showAllergies && (
                  <p
                    className="adriatica-rsvp-privacy"
                    id="adriatica-rsvp-privacy"
                  >
                    {copy.privacy}
                  </p>
                )}
                {guestDetails.map((guest, index) => (
                  <GuestFields
                    key={index}
                    index={index}
                    guest={guest}
                    menus={menus}
                    showAllergies={showAllergies}
                    invalidName={attempted && invalidFields[index].name}
                    invalidMenu={attempted && invalidFields[index].menu}
                    update={(field, value) => updateGuest(index, field, value)}
                    copy={copy}
                  />
                ))}
              </div>
            )}
          </fieldset>

          {attempted && hasInvalidFields && (
            <p className="adriatica-rsvp-error" role="alert">
              {copy.invalid}
            </p>
          )}
          {error && (
            <p className="adriatica-rsvp-error" role="alert">
              {error}
            </p>
          )}
          {sending && (
            <p className="adriatica-rsvp-status" role="status">
              {slow ? copy.slow : copy.sendingStatus}
            </p>
          )}
          <button
            className="adriatica-button adriatica-rsvp-submit"
            type="submit"
            disabled={sending}
          >
            {sending ? copy.sending : copy.submit}
            {!sending && <AdriaticaIcon name="arrow" />}
          </button>
        </form>
      )}
    </section>
  );
}

export function AdriaticaAdminGate({ slug, children }) {
  const auth = getAuth(db.app);
  const [access, setAccess] = useState("checking");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const authenticating = useRef(false);

  useEffect(() => {
    let stopAccess = () => {};
    const stopAuth = onAuthStateChanged(
      auth,
      (user) => {
        stopAccess();
        if (!user) {
          setAccess("signed-out");
          return;
        }

        setAccess("checking");
        const accessDoc = doc(db, "events", slug, "organizers", user.uid);
        stopAccess = onSnapshot(
          accessDoc,
          { includeMetadataChanges: true },
          (snapshot) => {
            if (snapshot.metadata.fromCache) {
              setAccess("connecting");
              return;
            }
            setAccess(
              snapshot.data()?.enabled === true ? "authorized" : "denied",
            );
          },
          () => setAccess("unavailable"),
        );
      },
      () => setAccess("unavailable"),
    );

    return () => {
      stopAuth();
      stopAccess();
    };
  }, [auth, slug]);

  const logout = useCallback(async () => {
    setError("");
    try {
      await signOut(auth);
    } catch {
      setError("Odjava nije uspela. Pokušajte ponovo.");
    }
  }, [auth]);

  const login = async (event) => {
    event.preventDefault();
    if (authenticating.current) return;
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    authenticating.current = true;
    setPending(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (loginError) {
      setError(
        loginError?.code === "auth/network-request-failed"
          ? "Proverite internet vezu i pokušajte ponovo."
          : "Prijava nije uspela. Proverite adresu e-pošte i lozinku.",
      );
    } finally {
      authenticating.current = false;
      setPending(false);
    }
  };

  if (access === "authorized") {
    return (
      <>
        {error && (
          <p className="adriatica-admin-error-banner" role="alert">
            {error}
          </p>
        )}
        {children(logout)}
      </>
    );
  }

  return (
    <main className="adriatica-admin">
      <div className="adriatica-admin-login">
        <h1>Prijava organizatora</h1>
        {access === "signed-out" ? (
          <form onSubmit={login}>
            <label htmlFor="adriatica-admin-email">E-pošta</label>
            <input
              id="adriatica-admin-email"
              name="email"
              type="email"
              autoComplete="username"
              required
            />
            <label htmlFor="adriatica-admin-password">Lozinka</label>
            <input
              id="adriatica-admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
            <button
              className="adriatica-admin-button"
              type="submit"
              disabled={pending}
            >
              {pending ? "Prijava…" : "Prijavite se"}
            </button>
          </form>
        ) : (
          <>
            <p role="status">
              {access === "denied" && "Ovaj nalog nema pristup pozivnici."}
              {access === "unavailable" &&
                "Provera pristupa trenutno nije dostupna."}
              {access === "checking" && "Proveravamo pristup…"}
              {access === "connecting" &&
                "Za proveru pristupa potrebna je veza sa serverom."}
            </p>
            {access !== "checking" && (
              <button
                className="adriatica-admin-button"
                type="button"
                onClick={logout}
              >
                Prijavite se drugim nalogom
              </button>
            )}
          </>
        )}
        {error && (
          <p className="adriatica-admin-error" role="alert">
            {error}
          </p>
        )}
      </div>
    </main>
  );
}

const menuLabels = Object.fromEntries(
  adriaticaMenus.map(({ value, label }) => [value, label]),
);
const individualGuests = (record) =>
  Array.isArray(record.guestDetails)
    ? record.guestDetails.filter(
        (guest) => typeof guest?.fullName === "string" && guest.fullName.trim(),
      )
    : [];

export function AdriaticaMenuAdmin({ slug, onLogout }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(
    () =>
      onSnapshot(
        collection(db, "events", slug, "rsvps"),
        (snapshot) => {
          const entries = snapshot.docs.map((entry) => ({
            ...entry.data(),
            id: entry.id,
          }));
          entries.sort(
            (first, second) =>
              (second.createdAt?.toMillis?.() || 0) -
              (first.createdAt?.toMillis?.() || 0),
          );
          setRecords(entries);
          setLoading(false);
        },
        () => {
          setRecords([]);
          setLoading(false);
          setError(
            "Učitavanje RSVP podataka nije uspelo. Vratite se u pregled i pokušajte ponovo.",
          );
        },
      ),
    [slug],
  );

  const summary = useMemo(() => {
    const total = {
      people: 0,
      meat: 0,
      fish: 0,
      vegetarian: 0,
      missing: 0,
      declined: 0,
    };
    for (const record of records) {
      if (record.attending === "ne") total.declined += 1;
      if (record.attending !== "da") continue;
      const details = individualGuests(record);
      const size = Math.max(Number(record.guests) || 0, details.length);
      total.people += size;
      let selected = 0;
      for (const guest of details) {
        if (!Object.hasOwn(menuLabels, guest.menu)) continue;
        total[guest.menu] += 1;
        selected += 1;
      }
      total.missing += size - selected;
    }
    return total;
  }, [records]);

  return (
    <main className="adriatica-admin">
      <div className="adriatica-admin-panel">
        <header className="adriatica-admin-header">
          <div>
            <Link to={`/admin/${slug}`}>Nazad na pregled odgovora</Link>
            <h1>Meniji i alergije</h1>
          </div>
          <button
            className="adriatica-admin-button"
            type="button"
            onClick={onLogout}
          >
            Odjavi se
          </button>
        </header>

        {loading && <p role="status">Učitavamo odgovore…</p>}
        {error && (
          <p className="adriatica-admin-error" role="alert">
            {error}
          </p>
        )}
        {!loading && !error && (
          <>
            <dl className="adriatica-admin-totals" aria-label="Zbirni pregled">
              <div>
                <dt>Dolazi osoba</dt>
                <dd>{summary.people}</dd>
              </div>
              {adriaticaMenus.map(({ value, label }) => (
                <div key={value}>
                  <dt>{label}</dt>
                  <dd>{summary[value]}</dd>
                </div>
              ))}
              <div>
                <dt>Meni nije unet</dt>
                <dd>{summary.missing}</dd>
              </div>
              <div>
                <dt>Odbijeni pozivi</dt>
                <dd>{summary.declined}</dd>
              </div>
            </dl>
            {records.length === 0 ? (
              <p>Još nema RSVP odgovora.</p>
            ) : (
              <div className="adriatica-admin-records">
                {records.map((record) => {
                  const coming = record.attending === "da";
                  const guests = coming ? individualGuests(record) : [];
                  const count = coming
                    ? Math.max(Number(record.guests) || 0, guests.length)
                    : 0;
                  return (
                    <article className="adriatica-admin-record" key={record.id}>
                      <header>
                        <h2>{record.fullName || "Gost"}</h2>
                        <p>
                          {coming
                            ? `Dolazi · ${count} ${count === 1 ? "osoba" : "osobe"}`
                            : record.attending === "ne"
                              ? "Ne dolazi"
                              : "Bez odgovora"}
                        </p>
                      </header>
                      {guests.length > 0 && (
                        <ul>
                          {guests.map((guest, index) => (
                            <li key={index}>
                              <strong>{guest.fullName}</strong>
                              <span>
                                {Object.hasOwn(menuLabels, guest.menu)
                                  ? menuLabels[guest.menu]
                                  : "Meni nije unet"}
                              </span>
                              {guest.allergies && (
                                <p>
                                  <b>Alergije i napomene</b> {guest.allergies}
                                </p>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                      {coming && guests.length < count && (
                        <p>
                          Bez pojedinačnog izbora menija za{" "}
                          {count - guests.length}.
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
