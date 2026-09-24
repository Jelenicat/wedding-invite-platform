import { useEffect, useRef, useState } from "react";
import "../styles/saveTheDate.css";
import { addToCalendar } from "../utils/calendar";

function dateToISO(value) {
  const match = String(value || "").trim().match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})\.?$/);
  return match
    ? `${match[3]}-${match[2].padStart(2, "0")}-${match[1].padStart(2, "0")}`
    : "";
}

export default function SaveTheDatePhotoSlot({
  brideName = "Ana",
  groomName = "Nikola",
  weddingDate = "19.06.2027.",
  venue = "Beograd",
  script = "latin",
  details = {},
}) {
  const config = details.saveTheDate || {};
  const cyrillic = script === "cyrillic" || config.script === "cyrillic";
  const photos = Array.isArray(config.photos) ? config.photos.filter(Boolean).slice(0, 4) : [];
  const [phase, setPhase] = useState("idle");
  const finishTimer = useRef(null);
  const dateISO = config.dateISO || details.dateISO || dateToISO(weddingDate);

  useEffect(() => () => window.clearTimeout(finishTimer.current), []);

  function start() {
    if (phase !== "idle") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPhase(reduceMotion ? "done" : "playing");
    if (!reduceMotion) {
      finishTimer.current = window.setTimeout(() => setPhase("done"), 3750);
    }
  }

  function calendar() {
    if (!dateISO) return;
    addToCalendar({
      brideName,
      groomName,
      dateISO,
      venue,
      eventType: "save-the-date",
      eventTitle: config.calendarTitle || `${brideName} & ${groomName} — ${cyrillic ? "Сачувајте датум" : "Sačuvajte datum"}`,
      note: config.calendarDescription || (cyrillic
        ? "Позивница са детаљима ускоро стиже."
        : "Pozivnica sa detaljima uskoro stiže."),
      allDay: true,
      language: "sr",
    });
  }

  const customStyle = {
    "--sps-background": config.backgroundColor || "#590b25",
    "--sps-slot-top": config.slotTop || "32%",
    "--sps-slot-width": config.slotWidth || "41%",
    "--sps-strip-width": config.stripWidth || "32%",
    "--sps-frame-width": config.frameWidth || "min(74vw, 390px)",
    "--sps-frame-ratio": config.frameRatio || "4 / 5",
    "--sps-slot-angle": config.slotAngle || "0deg",
    "--sps-strip-angle": config.stripAngle || "0deg",
  };

  return (
    <main className="std-photo-slot" style={customStyle} data-phase={phase}>
      <div className="std-photo-slot__layout">
        <header className="std-photo-slot__heading">
          <span className="std-photo-slot__eyebrow">
            {config.heading || (cyrillic ? "САЧУВАЈ ДАТУМ!" : "SAČUVAJ DATUM!")}
          </span>
          <h1>{brideName} <span aria-hidden="true">&amp;</span> {groomName}</h1>
        </header>

        <div className="std-photo-slot__scene">
          {config.frameImage ? (
            <img
              className="std-photo-slot__frame"
              src={config.frameImage}
              alt=""
              aria-hidden="true"
              draggable="false"
            />
          ) : <div className="std-photo-slot__frame-fallback" aria-hidden="true" />}

          <div className="std-photo-slot__reveal">
            <div className="std-photo-slot__strip">
              {photos.length ? photos.map((photo, index) => (
                <div className="std-photo-slot__photo" key={`${photo}-${index}`}>
                  <img
                    src={photo}
                    alt={config.photoAlts?.[index] || (cyrillic
                      ? `Фотографија пара ${index + 1}`
                      : `Fotografija para ${index + 1}`)}
                    loading="eager"
                    decoding="async"
                    draggable="false"
                  />
                </div>
              )) : [1, 2, 3].map(number => (
                <div className="std-photo-slot__photo std-photo-slot__photo--placeholder" key={number}>
                  <span>{String(number).padStart(2, "0")}</span>
                </div>
              ))}
              <span className="std-photo-slot__strip-date">{weddingDate}</span>
            </div>
          </div>

          {config.showSlotOverlay !== false && (
            <span className="std-photo-slot__slot" aria-hidden="true" />
          )}
        </div>

        <div className="std-photo-slot__actions">
          <button
            className="std-photo-slot__open"
            type="button"
            onClick={phase === "done" ? () => setPhase("idle") : start}
            disabled={phase === "playing"}
          >
            {phase === "done"
              ? (config.replayText || (cyrillic ? "ПОГЛЕДАЈ ПОНОВО" : "POGLEDAJ PONOVO"))
              : (config.openText || (cyrillic ? "ОТВОРИ НАЈАВУ" : "OTVORI NAJAVU"))}
          </button>
          {phase === "done" && (
            <div className="std-photo-slot__details">
              <p>{config.closingText || (cyrillic
                ? "Позивница са детаљима ускоро стиже."
                : "Pozivnica sa detaljima uskoro stiže.")}</p>
              {config.showCalendarButton === true && dateISO && (
                <button type="button" className="std-photo-slot__calendar" onClick={calendar}>
                  {cyrillic ? "Додај у календар" : "Dodaj u kalendar"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
