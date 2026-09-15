import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const COPY = {
  sr: {
    kicker: "RSVP",
    title: "Potvrdite dolazak",
    subtitle:
      "Biće nam veliko zadovoljstvo da svojim prisustvom ulepšate naš poseban dan.",
    name: "Ime i prezime",
    namePlaceholder: "Unesite ime i prezime",
    attendance: "Da li dolazite?",
    yes: "Dolazim",
    yesText: "Radujem se što slavim sa vama",
    no: "Ne dolazim",
    noText: "Nažalost nisam u mogućnosti",
    guests: "Broj osoba",
    fasting: "Da li postite?",
    fastingYes: "Postim",
    fastingNo: "Ne postim",
    submit: "Pošalji potvrdu",
    sending: "Šalje se…",
    thanks: "Hvala!",
    success: "Vaša potvrda je uspešno poslata.",
    errors: {
      name: "Unesite ime i prezime.",
      attendance: "Izaberite da li dolazite.",
      guests: "Unesite ispravan broj osoba.",
      fasting: "Izaberite da li postite.",
      send: "Došlo je do greške pri slanju.",
    },
  },

  cyrillic: {
    kicker: "RSVP",
    title: "Потврдите долазак",
    subtitle:
      "Биће нам велико задовољство да својим присуством улепшате наш посебан дан.",
    name: "Име и презиме",
    namePlaceholder: "Унесите име и презиме",
    attendance: "Да ли долазите?",
    yes: "Долазим",
    yesText: "Радујем се што славим са вама",
    no: "Не долазим",
    noText: "Нажалост нисам у могућности",
    guests: "Број особа",
    fasting: "Да ли постите?",
    fastingYes: "Постим",
    fastingNo: "Не постим",
    submit: "Пошаљи потврду",
    sending: "Шаље се…",
    thanks: "Хвала!",
    success: "Ваша потврда је успешно послата.",
    errors: {
      name: "Унесите име и презиме.",
      attendance: "Изаберите да ли долазите.",
      guests: "Унесите исправан број особа.",
      fasting: "Изаберите да ли постите.",
      send: "Дошло је до грешке при слању.",
    },
  },

  en: {
    kicker: "RSVP",
    title: "Confirm your attendance",
    subtitle:
      "It would mean so much to us to have you with us on our special day.",
    name: "Full name",
    namePlaceholder: "Enter your full name",
    attendance: "Will you attend?",
    yes: "Attending",
    yesText: "I’m happy to celebrate with you",
    no: "Not attending",
    noText: "Unfortunately, I can’t make it",
    guests: "Number of guests",
    fasting: "Are you fasting?",
    fastingYes: "Fasting",
    fastingNo: "Not fasting",
    submit: "Send RSVP",
    sending: "Sending…",
    thanks: "Thank you!",
    success: "Your RSVP has been sent successfully.",
    errors: {
      name: "Please enter your full name.",
      attendance: "Please choose whether you will attend.",
      guests: "Please enter a valid number of guests.",
      fasting: "Please choose whether you are fasting.",
      send: "An error occurred while sending your RSVP.",
    },
  },
};

/* ============================================================
   ISTI EMBOSSED FRAME KAO NA INVITATION CARD
============================================================ */

function RSVPEmbossedFrame() {
  const outer =
    "M44 12 H316 Q316 28 332 28 H348 V632 H332 Q316 632 316 648 H44 Q44 632 28 632 H12 V28 H28 Q44 28 44 12 Z";

  const inner =
    "M49 20 H311 Q313 36 332 36 H340 V624 H332 Q313 624 311 640 H49 Q47 624 28 624 H20 V36 H28 Q47 36 49 20 Z";

  return (
    <svg
      className="ef-rsvp-frame"
      viewBox="0 0 360 660"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {[outer, inner].map((d, index) => (
        <g key={index} fill="none" strokeWidth="1.15">
          <path
            d={d}
            className="ef-rsvp-frame-shadow"
            transform="translate(0.7 0.9)"
            vectorEffect="non-scaling-stroke"
          />

          <path
            d={d}
            className="ef-rsvp-frame-light"
            transform="translate(-0.7 -0.9)"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      ))}
    </svg>
  );
}

export default function EnvelopeFlapRSVP({
  slug,
  eventType,
  details = {},
  script = "latin",
  language = "sr",
}) {
  const locale =
    language === "en"
      ? "en"
      : script === "cyrillic"
        ? "cyrillic"
        : "sr";

  const t = COPY[locale];

  const showFasting = Boolean(details.rsvpOptions?.fasting);

  const [form, setForm] = useState({
    fullName: "",
    attending: "",
    guests: "1",
    fasting: "",
  });

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status !== "success") return undefined;

    const timer = setTimeout(() => {
      setStatus("idle");

      setForm({
        fullName: "",
        attending: "",
        guests: "1",
        fasting: "",
      });
    }, 3500);

    return () => clearTimeout(timer);
  }, [status]);

  const chooseAttendance = (attending) => {
    setForm((previous) => ({
      ...previous,

      attending,

      guests:
        attending === "da"
          ? previous.guests || "1"
          : "",

      fasting:
        attending === "da"
          ? previous.fasting
          : "",
    }));

    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();

    setError("");

    if (!form.fullName.trim()) {
      return setError(t.errors.name);
    }

    if (!form.attending) {
      return setError(t.errors.attendance);
    }

    const guests = Number(form.guests);

    if (
      form.attending === "da" &&
      (!form.guests || !Number.isFinite(guests) || guests < 1)
    ) {
      return setError(t.errors.guests);
    }

    if (
      form.attending === "da" &&
      showFasting &&
      !form.fasting
    ) {
      return setError(t.errors.fasting);
    }

    setStatus("sending");

    try {
      await setDoc(
        doc(db, "events", slug),
        {
          slug,
          eventType,
          updatedAt: serverTimestamp(),
        },
        {
          merge: true,
        },
      );

      await addDoc(
        collection(db, "events", slug, "rsvps"),
        {
          eventType,

          fullName: form.fullName.trim(),

          attending: form.attending,

          guests:
            form.attending === "da"
              ? guests
              : 0,

          fasting:
            form.attending === "da" && showFasting
              ? form.fasting
              : "",

          createdAt: serverTimestamp(),
        },
      );

      setStatus("success");
    } catch (submitError) {
      console.error(
        "Greška pri slanju envelope-flap RSVP-a:",
        submitError,
      );

      setStatus("idle");
      setError(t.errors.send);
    }
  };

  return (
    <section
      className={`ef-rsvp ef-rsvp-${slug || ""}`}
    >
      {/* ISTI OKVIR KAO NA INVITATION CARD */}
      <RSVPEmbossedFrame />

      {status === "success" ? (
        <div
          className="ef-rsvp-success"
          role="status"
        >
          <span
            className="ef-rsvp-success-mark"
            aria-hidden="true"
          >
            ♡
          </span>

          <p className="ef-rsvp-kicker">
            {t.kicker}
          </p>

          <h2>
            {t.thanks}
          </h2>

          <p>
            {t.success}
          </p>
        </div>
      ) : (
        <>
          <p className="ef-rsvp-kicker">
            {t.kicker}
          </p>

          <h2>
            {t.title}
          </h2>

          <p className="ef-rsvp-subtitle">
            {t.subtitle}
          </p>

          <div className="ef-rsvp-rule" />

          <form
            onSubmit={submit}
            className="ef-rsvp-form"
          >
            <label className="ef-rsvp-field">
              <span>
                {t.name}
              </span>

              <input
                type="text"
                value={form.fullName}
                placeholder={t.namePlaceholder}
                onChange={(event) =>
                  setForm({
                    ...form,
                    fullName: event.target.value,
                  })
                }
              />
            </label>

            <fieldset className="ef-rsvp-fieldset">
              <legend>
                {t.attendance}
              </legend>

              <div className="ef-rsvp-options">
                <button
                  type="button"
                  className={
                    form.attending === "da"
                      ? "is-selected"
                      : ""
                  }
                  onClick={() =>
                    chooseAttendance("da")
                  }
                >
                  <strong>
                    {t.yes}
                  </strong>

                  <small>
                    {t.yesText}
                  </small>
                </button>

                <button
                  type="button"
                  className={
                    form.attending === "ne"
                      ? "is-selected"
                      : ""
                  }
                  onClick={() =>
                    chooseAttendance("ne")
                  }
                >
                  <strong>
                    {t.no}
                  </strong>

                  <small>
                    {t.noText}
                  </small>
                </button>
              </div>
            </fieldset>

            {form.attending === "da" && (
              <label className="ef-rsvp-field">
                <span>
                  {t.guests}
                </span>

                <input
                  type="number"
                  min="1"
                  max="10"
                  value={form.guests}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      guests: event.target.value,
                    })
                  }
                />
              </label>
            )}

            {form.attending === "da" &&
              showFasting && (
                <fieldset className="ef-rsvp-fieldset">
                  <legend>
                    {t.fasting}
                  </legend>

                  <div className="ef-rsvp-options ef-rsvp-options-small">
                    <button
                      type="button"
                      className={
                        form.fasting === "posti"
                          ? "is-selected"
                          : ""
                      }
                      onClick={() =>
                        setForm({
                          ...form,
                          fasting: "posti",
                        })
                      }
                    >
                      {t.fastingYes}
                    </button>

                    <button
                      type="button"
                      className={
                        form.fasting === "ne_posti"
                          ? "is-selected"
                          : ""
                      }
                      onClick={() =>
                        setForm({
                          ...form,
                          fasting: "ne_posti",
                        })
                      }
                    >
                      {t.fastingNo}
                    </button>
                  </div>
                </fieldset>
              )}

            {error && (
              <p
                className="ef-rsvp-error"
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              className="ef-rsvp-submit"
              type="submit"
              disabled={status === "sending"}
            >
              {status === "sending"
                ? t.sending
                : t.submit}
            </button>
          </form>
        </>
      )}
    </section>
  );
}