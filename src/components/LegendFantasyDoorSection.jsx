import { useState } from "react";
import { art, mapUrl, placesOf } from "./legendFantasyData";
import { Chapter, Motes } from "./LegendFantasyEffects";

function Door({ place, index }) {
  const [open, setOpen] = useState(false);
  return <article className={`lfp-destination ${open ? "is-open" : ""}`}>
    <span className="lfp-destination__ribbon">{place.title}</span>
    <div className="lfp-destination__garden">
      <img className="lfp-destination__scene" src={art("shire")} alt="" width="1024" height="1536" loading="lazy"/>
      <Motes count={8}/>
      <div className="lfp-destination__portal">
        <a className="lfp-destination__inside" href={mapUrl(place)} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1} aria-hidden={!open} aria-label={`Pogledaj lokaciju ${place.name}`}>
          {place.image && <img src={place.image} alt="" loading="lazy" onError={e => { e.currentTarget.hidden = true; }}/>}<span aria-hidden="true"><svg width="26" height="32" viewBox="0 0 26 32" fill="none"><path d="M13 30S2 17 2 12a11 11 0 1 1 22 0c0 5-11 18-11 18Z" stroke="currentColor" strokeWidth="1.5"/><circle cx="13" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/></svg></span><strong>{place.name}</strong><small>Otvorite mapu ↗</small>
        </a>
        <button className={`lfp-destination__leaf lfp-destination__leaf--${index % 2}`} type="button" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-label={`${open ? "Zatvori" : "Otvori"} vrata: ${place.name}`}><img src={art("round-door")} alt="" width="1024" height="1024" loading="lazy"/></button>
      </div>
    </div>
    <div className="lfp-destination__copy"><p className="lfp-kicker">{place.time || "Čekamo vas"}</p><h3>{place.name}</h3>{place.address && <p>{place.address}</p>}<a className="lfp-button" href={mapUrl(place)} target="_blank" rel="noopener noreferrer">Otvorite mapu <span aria-hidden="true">↗</span></a></div>
  </article>;
}
export default function LegendFantasyDoorSection({ details = {}, venue = "" }) {
  const places = placesOf(details, venue);
  return <section className="lfp-places" aria-label="Lokacije proslave"><Chapter number="V" label="Gde se putevi susreću" title="Vaše odredište">Iza ovih vrata čeka vas mesto za našim stolom.</Chapter><div className="lfp-places__grid">{places.map((p, i) => <Door key={`${p.name}-${i}`} place={p} index={i}/>)}</div>{!places.length && <p className="lfp-center">Lokaciju ćemo uskoro otkriti.</p>}</section>;
}
