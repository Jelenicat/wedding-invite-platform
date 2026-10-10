import { useEffect, useMemo, useState } from "react";
import { art, calendarUrl, pad, weddingMoment } from "./legendFantasyData";
import { Chapter, Motes, Ornament, useScene } from "./LegendFantasyEffects";

export default function LegendFantasyMoon({ brideName, groomName, weddingDate = "", weddingTime = "", venue = "", details = {} }) {
  const [ref, seen] = useScene();
  const moment = useMemo(() => weddingMoment(weddingDate, weddingTime, details), [weddingDate, weddingTime, details.dateISO, details.time, details.timeZone]);
  const [now, setNow] = useState(Date.now);
  useEffect(() => { if (!moment || !seen) return; setNow(Date.now()); const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, [moment?.timestamp, seen]);
  const seconds = moment ? Math.max(0, Math.floor((moment.timestamp - now) / 1000)) : null;
  const parts = seconds === null ? null : [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
  const calendar = details.showCalendarButton === false ? "" : calendarUrl(moment, `${brideName} i ${groomName}`, venue, details.calendarDurationHours);
  return <section ref={ref} className={`lfp-moon ${seen ? "is-seen" : ""}`} aria-label="Datum venčanja i odbrojavanje">
    <Chapter number="III" label="Pod istim zvezdama" title="Mesečeva vrata" light>Jedan dan. Jedno obećanje. Čitav zajednički svet.</Chapter>
    <div className="lfp-moon__gate">
      <img src={art("gate")} alt="Vilenjačka vrata pod mesečinom" width="1024" height="1536" loading="lazy" decoding="async"/>
      <div className="lfp-moon__mist" aria-hidden="true"/><Motes count={18}/>
      <div className="lfp-moon__date"><span>{moment?.display.weekday || "Naš poseban dan"}</span><strong>{moment?.display.day || "✧"}</strong><p>{moment ? `${moment.display.month} ${moment.display.year}.` : weddingDate || "Datum uskoro"}</p>{weddingTime && <time>u {weddingTime}</time>}<Ornament/></div>
    </div>
    <div className="lfp-moon__details">
      {venue && <p>{venue}</p>}
      {details.showDressCode && <div className="lfp-dress"><span className="lfp-kicker">Odeća</span><strong>{details.dressCodeTitle || "Svečano, u bojama šume, zemlje i zlata"}</strong>{details.dressCodeNote && <p>{details.dressCodeNote}</p>}{Array.isArray(details.dressCodePalette) && <div className="lfp-dress__colors" aria-label="Predložene boje odeće">{details.dressCodePalette.map((color, i) => <span key={i} style={{ backgroundColor: color }} title={color}/>)}</div>}</div>}
      {calendar && <a className="lfp-button lfp-button--light" href={calendar} target="_blank" rel="noopener noreferrer">Sačuvajte datum <span aria-hidden="true">↗</span></a>}
    </div>
    <div className="lfp-countdown"><span className="lfp-kicker">Do našeg dana</span><h3>{seconds === 0 ? "Naša priča je počela" : "Ostalo je još"}</h3>
      <div className="lfp-dial" role="timer" aria-live="off" aria-label={parts ? `${parts[0]} dana, ${parts[1]} sati, ${parts[2]} minuta i ${parts[3]} sekundi` : "Datum uskoro"}>
        <svg viewBox="0 0 360 360" className="lfp-dial__lines" aria-hidden="true"><circle cx="180" cy="180" r="168"/><circle cx="180" cy="180" r="148"/><circle cx="180" cy="180" r="133" strokeDasharray="2 6"/>{Array.from({ length: 60 }, (_, i) => <path key={i} transform={`rotate(${i * 6} 180 180)`} d={`M180 14v${i % 5 ? 5 : 13}`} strokeWidth={i % 5 ? .5 : 1.5}/>)}<path d="M167 41h26m-13-13v26M174 35l12 12m0-12-12 12"/></svg>
        <div className="lfp-dial__orbit" aria-hidden="true"><span/></div><div className="lfp-dial__orbit lfp-dial__orbit--two" aria-hidden="true"><span/></div>
        <div className="lfp-dial__numbers"><strong>{parts?.[0] ?? "—"}</strong><span>dana</span><p>{parts ? `${pad(parts[1])} : ${pad(parts[2])} : ${pad(parts[3])}` : "Datum uskoro"}</p>{parts && <small>sati · minuti · sekunde</small>}</div>
      </div><p className="lfp-italic">Neka nas na ovom putu prate svetlost i ljubav.</p>
    </div>
  </section>;
}
