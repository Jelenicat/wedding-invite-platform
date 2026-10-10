import { art, eventsOf } from "./legendFantasyData";
import { Chapter, FireCanvas, useScene } from "./LegendFantasyEffects";

const SPOTS = [[29, 13], [80, 38], [26, 55.5], [78, 76]];
function Beacon({ event, index }) {
  const [ref, seen] = useScene(.15);
  const [x, y] = SPOTS[index];
  return <li ref={ref} className={`lfp-beacon ${seen ? "is-lit" : ""} lfp-beacon--${index}`} style={{ "--beacon-x": `${x}%`, "--beacon-y": `${y}%` }}>
    <div className="lfp-beacon__flame"><img className="lfp-beacon__flameArt" src={art("flame")} alt="" width="1024" height="1536" loading="lazy"/><FireCanvas/></div>
    <div className="lfp-beacon__copy">{event.time && <time>{event.time}</time>}<h3>{event.title}</h3>{event.place && <strong>{event.place}</strong>}{event.note && <p>{event.note}</p>}</div>
  </li>;
}
export default function LegendFantasyBeacons({ details = {}, weddingTime = "", venue = "" }) {
  const events = eventsOf(details, weddingTime, venue);
  const groups = Array.from({ length: Math.ceil(events.length / 4) }, (_, i) => events.slice(i * 4, i * 4 + 4));
  return <section className="lfp-beacons" aria-label="Tok proslave">
    <Chapter number="IV" label="Tok naše proslave" title="Vatre na vrhovima" light>Kada jedna zasvetli, druga nastavlja priču.</Chapter>
    {groups.length ? groups.map((group, g) => <ol className="lfp-beacons__land" key={g} start={g * 4 + 1} style={{ backgroundImage: `url(${art("beacons")})` }}>{group.map((event, i) => <Beacon key={`${event.title}-${i}`} event={event} index={i}/>)}</ol>) : <p className="lfp-beacons__empty">Satnica će uskoro biti upisana u našu knjigu.</p>}
  </section>;
}
