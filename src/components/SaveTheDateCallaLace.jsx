import { useEffect, useMemo, useRef, useState } from "react";

import { addToCalendar } from "../utils/calendar";

import "../styles/saveTheDate.css";


const DEFAULT_ASSETS = {
  background: "/images/save-the-date/calla-lace/calla-background.png",
  envelope: "/images/save-the-date/calla-lace/ivory-envelope.png",
  envelopeOpen: "/images/save-the-date/calla-lace/ivory-envelope-open.png",
  lace: "/images/save-the-date/calla-lace/sheer-white-lace.png",
  paper: "",
};


const COPY = {
  latin: {
    eyebrow: "VENČAVAMO SE",
    openEnvelope: "DODIRNITE KOVERTU",
    saveTitle: "Sačuvajte datum",
    scrollDown: "POMERITE STRANICU NADOLE",

    formalInvitation: "Svečana pozivnica uskoro stiže",

    calendarPrompt: "Sačuvajte naš datum u svom kalendaru",
    withLove: "S LJUBAVLJU",
    note: "RADUJEMO SE ŠTO ĆETE BITI SA NAMA",

    countdownDays: "DANA",
    countdownHours: "SATI",
    countdownMinutes: "MINUTA",
    countdownSeconds: "SEKUNDI",

    questions: "Za sva pitanja pišite nam",
    calendar: "DODAJ U KALENDAR",
    dayIsHere: "Naš dan je stigao",
  },

  cyrillic: {
    eyebrow: "ВЕНЧАВАМО СЕ",
    openEnvelope: "ДОДИРНИТЕ КОВЕРТУ",
    saveTitle: "Сачувајте датум",
    scrollDown: "ПОМЕРИТЕ СТРАНИЦУ НАДОЛЕ",

    formalInvitation: "Свечана позивница ускоро стиже",

    calendarPrompt: "Сачувајте наш датум у свом календару",
    withLove: "С ЉУБАВЉУ",
    note: "РАДУЈЕМО СЕ ШТО ЋЕТЕ БИТИ СА НАМА",

    countdownDays: "ДАНА",
    countdownHours: "САТИ",
    countdownMinutes: "МИНУТА",
    countdownSeconds: "СЕКУНДИ",

    questions: "За сва питања пишите нам",
    calendar: "ДОДАЈ У КАЛЕНДАР",
    dayIsHere: "Наш дан је стигао",
  },
};


function dateToISO(date) {
  const match = String(date || "")
    .trim()
    .match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})\.?$/);

  return match
    ? `${match[3]}-${match[2].padStart(2, "0")}-${match[1].padStart(2, "0")}`
    : "";
}


function getTargetDate(iso) {
  if (!iso) return null;

  const value = /^\d{4}-\d{2}-\d{2}$/.test(iso)
    ? `${iso}T00:00:00`
    : iso;

  const target = new Date(value);

  return Number.isNaN(target.getTime())
    ? null
    : target;
}


function getRemaining(target) {
  if (!target) return null;

  const totalSeconds = Math.max(
    0,
    Math.floor(
      (target.getTime() - Date.now()) / 1000
    )
  );

  return {
    days: Math.floor(totalSeconds / 86400),

    hours: Math.floor(
      (totalSeconds % 86400) / 3600
    ),

    minutes: Math.floor(
      (totalSeconds % 3600) / 60
    ),

    seconds: totalSeconds % 60,

    done:
      target.getTime() <= Date.now(),
  };
}


function formatDate(value, iso, locale) {
  const match = String(value || "")
    .trim()
    .match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})\.?$/);

  if (!match) {
    return value || iso || "";
  }

  const date = new Date(
    Number(match[3]),
    Number(match[2]) - 1,
    Number(match[1])
  );

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    locale,
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  )
    .format(date)
    .toLocaleUpperCase(locale);
}


const imageCSS = (src) =>
  src
    ? `url(${JSON.stringify(src)})`
    : "none";


export default function SaveTheDateCallaLace({
  brideName = "Ana",
  groomName = "Nikola",
  weddingDate = "19.06.2027.",
  venue = "Beograd",
  script = "latin",
  details = {},
}) {
  const config =
    details.saveTheDate || {};

  const localeKey =
    script === "cyrillic"
      ? "cyrillic"
      : "latin";

  const locale =
    localeKey === "cyrillic"
      ? "sr-Cyrl-RS"
      : "sr-Latn-RS";

  const copy = {
    ...COPY[localeKey],
    ...config.copy,
  };

  const assets = {
    ...DEFAULT_ASSETS,
    ...config.assets,
  };

  const colors =
    config.colors || {};


  const iso =
    config.dateISO ||
    details.dateISO ||
    dateToISO(weddingDate);


  const target = useMemo(
    () => getTargetDate(iso),
    [iso]
  );


  const displayDate =
    config.displayDate ||
    formatDate(
      weddingDate,
      iso,
      locale
    );


  const initials =
    config.monogram ||
    `${brideName
      .trim()
      .charAt(0)}${groomName
      .trim()
      .charAt(0)}`;


  const [remaining, setRemaining] =
    useState(() =>
      getRemaining(target)
    );


  const [phase, setPhase] =
    useState("closed");


  /*
   * Ne dozvoljavamo otvaranje
   * dok se svi asseti ne učitaju.
   */
  const [
    assetsReady,
    setAssetsReady,
  ] = useState(false);


  const transitionRef =
    useRef(null);


  /* =====================================================
     COUNTDOWN
  ===================================================== */

  useEffect(() => {
    setRemaining(
      getRemaining(target)
    );

    const timer =
      window.setInterval(() => {
        setRemaining(
          getRemaining(target)
        );
      }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [target]);


  /* =====================================================
     CLEANUP OPENING TIMEOUT
  ===================================================== */

  useEffect(() => {
    return () => {
      window.clearTimeout(
        transitionRef.current
      );
    };
  }, []);


  /* =====================================================
     PRELOAD SVIH ASSETA
  ===================================================== */

  useEffect(() => {
    let cancelled = false;

    setAssetsReady(false);

    const sources = [
      assets.background,
      assets.envelope,
      assets.envelopeOpen,
      assets.lace,
      assets.paper,
    ].filter(Boolean);


    if (!sources.length) {
      setAssetsReady(true);

      return undefined;
    }


    const preloadImage = (src) =>
      new Promise((resolve) => {
        const img = new Image();

        let finished = false;


        const finish = () => {
          if (finished) return;

          finished = true;

          resolve();
        };


        img.onload = async () => {
          try {
            /*
             * Čekamo i decode da se slika
             * ne pojavi tek nakon rendera.
             */
            if (img.decode) {
              await img.decode();
            }
          } catch {
            /*
             * Safari i pojedini browseri
             * mogu da odbiju decode,
             * ali je slika već učitana.
             */
          }

          finish();
        };


        /*
         * Ako neki asset nedostaje,
         * ne blokiramo celu pozivnicu.
         */
        img.onerror = finish;


        img.src = src;


        /*
         * Ako je slika već u cache-u.
         */
        if (img.complete) {
          if (img.decode) {
            img
              .decode()
              .catch(() => {})
              .finally(finish);
          } else {
            finish();
          }
        }
      });


    Promise.all(
      sources.map(preloadImage)
    ).then(() => {
      if (!cancelled) {
        setAssetsReady(true);
      }
    });


    return () => {
      cancelled = true;
    };
  }, [
    assets.background,
    assets.envelope,
    assets.envelopeOpen,
    assets.lace,
    assets.paper,
  ]);


  /* =====================================================
     OPEN ENVELOPE
  ===================================================== */

  const openEnvelope = () => {
    /*
     * Ne može da se otvori
     * dok slike nisu spremne.
     */
    if (
      phase !== "closed" ||
      !assetsReady
    ) {
      return;
    }


    setPhase("opening");


    transitionRef.current =
      window.setTimeout(() => {
        setPhase("open");
      }, 950);
  };


  /* =====================================================
     CALENDAR
  ===================================================== */

  const addCalendarEvent = () => {
    if (!iso) return;


    addToCalendar({
      brideName,
      groomName,

      dateISO: iso,

      venue,

      mapLink:
        config.mapLink ||
        details.mapLink ||
        "",

      note:
        config.calendarDescription ||
        copy.formalInvitation,

      eventType:
        "save-the-date",

      eventTitle:
        config.calendarTitle ||
        `${brideName} & ${groomName} — ${copy.saveTitle}`,

      allDay: true,

      language: "sr",
    });
  };


  const nameLine =
    `${brideName} & ${groomName}`;


  /* =====================================================
     CSS VARIABLES
  ===================================================== */

  const style = {
    "--scl-background-image":
      imageCSS(
        assets.background
      ),

    "--scl-background-position":
      config.backgroundPosition ||
      "center center",

    "--scl-overlay":
      Math.min(
        1,
        Math.max(
          0,
          Number(
            config.backgroundOverlay ??
            0.05
          )
        )
      ),

    "--scl-lace-image":
      imageCSS(
        assets.lace
      ),

    "--scl-paper-image":
      imageCSS(
        assets.paper
      ),

    "--scl-paper":
      colors.paper ||
      "#fffefa",

    "--scl-ink":
      colors.ink ||
      "#2f2c27",

    "--scl-muted":
      colors.muted ||
      "#6a675e",

    "--scl-light":
      colors.light ||
      "#ffffff",

    "--scl-accent":
      colors.accent ||
      "#ededeb",

    "--scl-lace-ink":
      colors.laceText ||
      "#ffffff",

    "--scl-lace-panel":
      colors.lacePanel ||
      "rgba(255, 255, 255, .06)",

    "--scl-lace-opacity":
      Math.min(
        1,
        Math.max(
          0,
          Number(
            config.laceOpacity ??
            0.72
          )
        )
      ),

    "--scl-envelope-ink":
      colors.envelopeMonogram ||
      "#ffffff",

    "--scl-closed-clip":
      config.envelopeClipClosed ||
      (
        assets.envelope ===
        DEFAULT_ASSETS.envelope

          ? "inset(7.35% 3.6% 7.2% 3.6% round 2px)"

          : "none"
      ),

    "--scl-open-clip":
      config.envelopeClipOpen ||
      (
        assets.envelopeOpen ===
        DEFAULT_ASSETS.envelopeOpen

          ? "polygon(50% 2.4%, 84.55% 41.5%, 84.55% 95.45%, 15.45% 95.45%, 15.45% 41.5%)"

          : "none"
      ),
  };


  return (
    <section
      className="std-calla"
      data-phase={phase}
      data-assets-ready={
        assetsReady
          ? "true"
          : "false"
      }
      style={style}
      aria-label={
        copy.saveTitle
      }
      aria-busy={
        !assetsReady
      }
    >

      <div
        className="std-calla__backdrop"
        aria-hidden="true"
      />


      {/* =================================================
          ENVELOPE
      ================================================= */}

      {phase !== "open" && (
        <div className="std-calla__scene--envelope">

          <div className="std-calla__opening-copy">

            <span className="std-calla__eyebrow">
              {copy.eyebrow}
            </span>

            <h1 className="std-calla__names">
              {nameLine}
            </h1>

          </div>


          <button
            className="std-calla__envelope-button"
            type="button"
            onClick={
              openEnvelope
            }
            disabled={
              phase !== "closed" ||
              !assetsReady
            }
            aria-label={
              copy.openEnvelope
            }
          >

            <img
              className="std-calla__envelope-closed"
              src={
                assets.envelope
              }
              alt=""
              draggable="false"
              decoding="sync"
            />


            {assets.envelopeOpen && (
              <img
                className="std-calla__envelope-open"
                src={
                  assets.envelopeOpen
                }
                alt=""
                draggable="false"
                decoding="sync"
              />
            )}


            <span
              className="std-calla__seal"
              aria-hidden="true"
            >
              {initials}
            </span>

          </button>


          <p className="std-calla__hint">
            {copy.openEnvelope}
          </p>

        </div>
      )}


      {/* =================================================
          OPEN CONTENT
      ================================================= */}

      {phase === "open" && (

        <div className="std-calla__flow">


          {/* ================= HERO / LACE ================= */}

          <section
            className="std-calla__hero"
            aria-label={
              copy.saveTitle
            }
          >

            <div className="std-calla__lace-panel">

              <img
                src={
                  assets.lace
                }
                alt=""
                draggable="false"
                decoding="sync"
              />


              <div className="std-calla__lace-content">

                <span className="std-calla__lace-title">
                  {copy.saveTitle}
                </span>


                <span
                  className="std-calla__lace-rule"
                  aria-hidden="true"
                />


                <span className="std-calla__lace-names">
                  {nameLine}
                </span>


                <span className="std-calla__lace-date">
                  {displayDate}
                </span>

              </div>

            </div>


            <div className="std-calla__scroll-cue">

              <span>
                {copy.scrollDown}
              </span>

              <span
                className="std-calla__scroll-arrow"
                aria-hidden="true"
              />

            </div>

          </section>


          {/* ================= DETAILS ================= */}

          <section
            className="std-calla__details"
            aria-label={
              copy.formalInvitation
            }
          >

            <div className="std-calla__details-content">

              <h2 className="std-calla__follow">
                {copy.formalInvitation}
              </h2>


              <p className="std-calla__place">
                {venue}
              </p>


              <p className="std-calla__details-date">
                {weddingDate || displayDate}
              </p>


              {config.showCalendarButton !== false &&
                iso && (
                  <>

                    <p className="std-calla__address-prompt">
                      {copy.calendarPrompt}
                    </p>


                    <button
                      className="std-calla__address"
                      onClick={
                        addCalendarEvent
                      }
                      type="button"
                    >
                      {copy.calendar}
                    </button>

                  </>
                )}

            </div>

          </section>


          {/* ================= FINAL PAPER ================= */}

          <section
            className="std-calla__paper"
            aria-label={
              copy.withLove
            }
          >

            <span className="std-calla__paper-monogram">
              {initials}
            </span>


            {config.contactEmail && (

              <p className="std-calla__paper-contact">

                {copy.questions}

                <br />

                <a
                  href={`mailto:${config.contactEmail}`}
                >
                  {config.contactEmail}
                </a>

              </p>

            )}


            <span className="std-calla__paper-eyebrow">
              {copy.withLove}
            </span>


            {/* ============================================
                IMENA JEDNO ISPOD DRUGOG
            ============================================ */}

            <div
              className="std-calla__paper-names"
              aria-label={
                nameLine
              }
            >

              <span className="std-calla__paper-name">
                {brideName}
              </span>


              <span
                className="std-calla__paper-amp"
                aria-hidden="true"
              >
                &amp;
              </span>


              <span className="std-calla__paper-name">
                {groomName}
              </span>

            </div>


            <p className="std-calla__paper-note">
              {copy.note}
            </p>


            {config.showCountdown !== false &&
              remaining && (

                remaining.done ? (

                  <p className="std-calla__today">
                    {copy.dayIsHere}
                  </p>

                ) : (

                  <div
                    className="std-calla__countdown"
                    role="timer"
                    aria-label={`${remaining.days} ${copy.countdownDays}, ${remaining.hours} ${copy.countdownHours}, ${remaining.minutes} ${copy.countdownMinutes}, ${remaining.seconds} ${copy.countdownSeconds}`}
                  >

                    {[
                      [
                        remaining.days,
                        copy.countdownDays,
                      ],

                      [
                        remaining.hours,
                        copy.countdownHours,
                      ],

                      [
                        remaining.minutes,
                        copy.countdownMinutes,
                      ],

                      [
                        remaining.seconds,
                        copy.countdownSeconds,
                      ],
                    ].map(
                      (
                        [
                          value,
                          label,
                        ]
                      ) => (

                        <span
                          className="std-calla__time"
                          key={label}
                        >

                          <strong>
                            {String(
                              value
                            ).padStart(
                              2,
                              "0"
                            )}
                          </strong>

                          <small>
                            {label}
                          </small>

                        </span>

                      )
                    )}

                  </div>

                )

              )}

          </section>

        </div>

      )}

    </section>
  );
}