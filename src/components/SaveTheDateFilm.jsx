import { useEffect, useState } from "react";
import "../styles/saveTheDate.css";
import { addToCalendar } from "../utils/calendar";

function toISO(value) {
  const match = String(value || "").trim().match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})\.?$/);
  return match ? `${match[3]}-${match[2].padStart(2, "0")}-${match[1].padStart(2, "0")}` : "";
}

function remaining(iso) {
  const match = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const target = new Date(+match[1], +match[2] - 1, +match[3]);
  if (target.getFullYear() !== +match[1] || target.getMonth() !== +match[2] - 1 || target.getDate() !== +match[3]) return null;
  const minutes = Math.max(0, Math.floor((target.getTime() - Date.now()) / 60000));
  return { days: Math.floor(minutes / 1440), hours: Math.floor(minutes % 1440 / 60), minutes: minutes % 60 };
}

export default function SaveTheDateFilm({
  brideName = "Ana",
  groomName = "Nikola",
  weddingDate = "19.06.2027.",
  venue = "Beograd",
  script = "latin",
  details = {},
}) {
  const config = details.saveTheDate || {};
  const cyrillic = script === "cyrillic" || config.script === "cyrillic" || details.script === "cyrillic";
  const dateISO = config.dateISO || details.dateISO || toISO(weddingDate);
  const photo = config.photo || "";
  const [phase, setPhase] = useState("idle");
  const [count, setCount] = useState(3);
  const [clock, setClock] = useState(() => remaining(dateISO));
  const open = phase === "open";
  const showCountdown = config.showCountdown === true;
  const showCalendarButton = config.showCalendarButton ?? details.showCalendarButton ?? false;
  const copy = cyrillic ? {
    label: "САЧУВАЈТЕ ДАТУМ", play: "ПОГЛЕДАЈ НАШУ ПРИЧУ", scene: "НАША ПРИЧА У КАДРОВИМА",
    soon: "Позивница са детаљима ускоро стиже.", calendar: "Додај у календар",
    days: "ДАНА", hours: "САТИ", minutes: "МИНУТА", end: "НАСТАВЉА СЕ…",
  } : {
    label: "SAVE THE DATE", play: "POGLEDAJ NAŠU PRIČU", scene: "NAŠA PRIČA U KADROVIMA",
    soon: "Pozivnica sa detaljima uskoro stiže.", calendar: "Dodaj u kalendar",
    days: "DANA", hours: "SATI", minutes: "MINUTA", end: "NASTAVLJA SE…",
  };

  useEffect(() => {
    if (phase !== "counting") return;
    const timers = [
      window.setTimeout(() => setCount(2), 440),
      window.setTimeout(() => setCount(1), 880),
      window.setTimeout(() => setPhase("open"), 1320),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [phase]);

  useEffect(() => {
    if (!showCountdown) return;
    setClock(remaining(dateISO));
    const timer = window.setInterval(() => setClock(remaining(dateISO)), 60000);
    return () => window.clearInterval(timer);
  }, [dateISO, showCountdown]);

  const start = () => {
    if (phase !== "idle") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPhase("open");
    else { setCount(3); setPhase("counting"); }
  };

  const handleCalendar = () => {
    if (!remaining(dateISO)) return;
    addToCalendar({
      brideName, groomName, dateISO, venue,
      mapLink: config.mapLink || details.mapLink || "",
      note: config.calendarDescription || copy.soon,
      eventType: "save-the-date",
      eventTitle: config.calendarTitle || `${copy.label} — ${brideName} & ${groomName}`,
      allDay: true,
      language: "sr",
    });
  };

  return (
    <main className={`std-film-save std-film-save--${phase}`} style={{
      "--sfs-accent": config.accentColor || "#d7b99d",
      "--sfs-photo-position": config.photoPosition || "center 43%",
    }}>
      <div className="std-film-save__photo">
        {photo ? <img src={photo} alt={config.photoAlt || `${brideName} & ${groomName}`} loading="eager" decoding="async" />
          : <div className="std-film-save__fallback">{brideName[0]} <i>&amp;</i> {groomName[0]}</div>}
      </div>
      <div className="std-film-save__shade" aria-hidden="true" />
      <div className="std-film-save__shutter" aria-hidden="true"><span /><span /><span /><span /></div>
      <div className="std-film-save__flash" aria-hidden="true" />
      <div className="std-film-save__leak" aria-hidden="true" />
      <div className="std-film-save__grain" aria-hidden="true" />
      <div className="std-film-save__sprockets" aria-hidden="true"><span /><span /></div>

      <header className="std-film-save__top"><span>{config.heading || copy.label}</span><span>01 / {dateISO.slice(0, 4) || "2027"}</span></header>

      {phase === "idle" && <div className="std-film-save__intro">
        <span className="std-film-save__intro-index">01 — LOVE, ON FILM</span>
        <button type="button" className="std-film-save__play" onClick={start}
          aria-label={cyrillic ? "Пусти филм" : "Pusti film"}>
          <span className="std-film-save__play-icon" aria-hidden="true">
            <svg
              viewBox="0 0 32 36"
              width="1em"
              height="1.125em"
              fill="currentColor"
              focusable="false"
              style={{ display: "block" }}
            >
              <path d="M4 2.5v31L30 18 4 2.5Z" />
            </svg>
          </span>
          <span>{config.playText || copy.play}</span>
        </button>
        <p>{config.introNote || (cyrillic ? "Један датум који желимо да поделимо са вама." : "Jedan datum koji želimo da podelimo sa vama.")}</p>
      </div>}

      {phase === "counting" && <div className="std-film-save__count" key={count} role="status" aria-label={`${count}`}>{count}</div>}

      <section className="std-film-save__ending" aria-live="polite" aria-hidden={!open}>
        <span className="std-film-save__eyebrow">{config.filmLabel || copy.scene}</span>
        <h1><span>{brideName}</span><i>&amp;</i><span>{groomName}</span></h1>
        <div className="std-film-save__rule" />
        <div className="std-film-save__meta"><strong>{weddingDate}</strong><span>{venue}</span></div>
        <p>{config.closingText || copy.soon}</p>
        {showCountdown && clock && <div className="std-film-save__countdown" aria-label={cyrillic ? "Одбројавање до венчања" : "Odbrojavanje do venčanja"}>
          {[[clock.days, copy.days], [clock.hours, copy.hours], [clock.minutes, copy.minutes]].map(([value, label]) =>
            <span key={label}><strong>{String(value).padStart(2, "0")}</strong><small>{label}</small></span>)}
        </div>}
        {open && showCalendarButton && remaining(dateISO) && <button className="std-film-save__calendar" type="button" onClick={handleCalendar}>
          <span aria-hidden="true">＋</span>{copy.calendar}
        </button>}
      </section>

      <footer className="std-film-save__bottom"><span>REC <b aria-hidden="true" /></span><span>{config.footer || copy.end}</span></footer>
      <div className="std-film-save__progress" aria-hidden="true"><span /></div>
    </main>
  );
}
