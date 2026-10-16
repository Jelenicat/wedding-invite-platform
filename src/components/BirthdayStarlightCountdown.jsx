import { useEffect, useId, useRef, useState } from "react";
import { starlightData, StarlightIcon, StarlightLetters, StarlightReveal, StarlightScript, StarlightSparkles } from "./BirthdayStarlightIntro";
import "../styles/newcard.css";

function getClock(date) {
  const target = date ? new Date(date).getTime() : NaN;
  if (!Number.isFinite(target)) return { status: "invalid", values: [] };
  const seconds = Math.max(0, Math.ceil((target - Date.now()) / 1000));
  if (!seconds) return { status: "finished", values: [] };
  return { status: "upcoming", values: [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60] };
}

const escapeCalendar = (text) => String(text || "").replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
const calendarUTC = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
// RFC 5545: najviše 75 UTF-8 okteta u jednom redu.
function foldCalendarLine(text) {
  const encoder = new TextEncoder();
  let line = "";
  let bytes = 0;
  const lines = [];
  for (const char of text) {
    const count = encoder.encode(char).length;
    if (bytes + count > 75) { lines.push(line); line = " "; bytes = 1; }
    line += char;
    bytes += count;
  }
  lines.push(line);
  return lines.join("\r\n");
}

export default function BirthdayStarlightCountdown(props) {
  const data = starlightData(props);
  const { c, details, starlight } = data;
  const date = props.targetDate || details.dateISO;
  const section = useRef(null);
  const uid = useId();
  const [time, setTime] = useState(() => getClock(date));
  const [calendarError, setCalendarError] = useState("");
  const showCalendar = props.showCalendarButton ?? details.showCalendarButton ?? false;

  useEffect(() => {
    let timer;
    let visible = !("IntersectionObserver" in window);
    const update = () => setTime(getClock(date));
    const sync = () => {
      window.clearInterval(timer);
      update();
      if (visible && !document.hidden && getClock(date).status === "upcoming") timer = window.setInterval(() => {
        const next = getClock(date);
        setTime(next);
        if (next.status !== "upcoming") window.clearInterval(timer);
      }, 1000);
    };
    const observer = "IntersectionObserver" in window ? new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { rootMargin: "120px" }) : null;
    if (section.current) observer?.observe(section.current);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => { observer?.disconnect(); window.clearInterval(timer); document.removeEventListener("visibilitychange", sync); };
  }, [date]);

  const saveDate = () => {
    try {
      setCalendarError("");
      const start = new Date(date);
      if (!Number.isFinite(start.getTime())) throw new Error("Invalid birthday date");
      const duration = Number(details.calendarDurationHours);
      const end = new Date(start.getTime() + (Number.isFinite(duration) && duration > 0 ? duration : 6) * 3600000);
      const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Birthday Starlight//SR", "CALSCALE:GREGORIAN", "BEGIN:VEVENT", `UID:${escapeCalendar(props.slug || "birthday")}-${start.getTime()}@birthday-starlight`, `DTSTAMP:${calendarUTC(new Date())}`, `DTSTART:${calendarUTC(start)}`, `DTEND:${calendarUTC(end)}`, `SUMMARY:${escapeCalendar(details.calendarTitle || `${data.name} — ${data.age}. ${c ? "рођендан" : "rođendan"}`)}`, `LOCATION:${escapeCalendar(`${data.venue} ${data.address}`.trim())}`, `DESCRIPTION:${escapeCalendar(details.calendarDescription || details.welcomeText || "")}`, "END:VEVENT", "END:VCALENDAR"];
      const file = new Blob([lines.map(foldCalendarLine).join("\r\n") + "\r\n"], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${String(props.slug || "rodjendan").replace(/[^a-zA-Z0-9_-]/g, "-")}.ics`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch (cause) {
      console.error("BirthdayStarlight calendar:", cause);
      setCalendarError(c ? "Календар није отворен. Покушај поново." : "Kalendar nije otvoren. Pokušaj ponovo.");
    }
  };

  const finished = time.status === "finished";
  const labels = c ? ["ДАНА", "САТИ", "МИНУТА", "СЕКУНДИ"] : ["DANA", "SATI", "MINUTA", "SEKUNDI"];
  return <section ref={section} className="bsl bsl-countdown" data-script={c ? "cyrillic" : "latin"} aria-labelledby={`${uid}-title`}>
    <StarlightSparkles />
    <StarlightReveal><StarlightIcon /><p className="bsl-eyebrow">{starlight.countdownKicker || (c ? "ЈЕДВА ЧЕКАМ ДА СЛАВИМО" : "JEDVA ČEKAM DA SLAVIMO")}</p></StarlightReveal>
    <h2 id={`${uid}-title`} className="bsl-countdown-heading"><StarlightScript>{finished ? (starlight.finishedTitle || (c ? "Дан је стигао!" : "Dan je stigao!")) : (starlight.countdownTitle || (c ? "Још само..." : "Još samo..."))}</StarlightScript></h2>
    {time.status === "upcoming" ? <StarlightReveal><div className="bsl-clock" role="timer" aria-live="off" aria-label={c ? "Преостало време до прославе" : "Preostalo vreme do proslave"}>
      {time.values.map((value, i) => <div className="bsl-clock-unit" key={labels[i]}><span className="bsl-digit-window"><strong key={value} className={`bsl-count-digit ${String(value).length > 3 ? "bsl-count-digit-wide" : ""}`}>{String(value).padStart(2, "0")}</strong></span><span className="bsl-clock-label">{labels[i]}</span></div>)}
    </div></StarlightReveal> : <p className="bsl-countdown-note">{finished ? (starlight.finishedText || (c ? "Видимо се на прослави!" : "Vidimo se na proslavi!")) : (c ? "Датум прославе ускоро стиже." : "Datum proslave uskoro stiže.")}</p>}
    {showCalendar && time.status !== "invalid" && <div className="bsl-calendar"><button className="bsl-button bsl-button-outline" type="button" onClick={saveDate}><StarlightIcon name="calendar" />{c ? "Сачувај датум" : "Sačuvaj datum"}</button>{calendarError && <p role="alert">{calendarError}</p>}</div>}
    <footer className="bsl-finale"><p><StarlightLetters text={starlight.finaleText || (c ? "ЗА ВЕЧЕ КОЈЕ ЋЕМО ПАМТИТИ." : "ZA VEČE KOJE ĆEMO PAMTITI.")} /></p><span className="bsl-finale-name">{data.name}</span></footer>
  </section>;
}
