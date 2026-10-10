import { useEffect, useRef } from "react";
import "../styles/legendFantasy.css";
import "../styles/legendFantasyPremium.css";
import LegendFantasyMap from "./LegendFantasyMap";
import LegendFantasyHome from "./LegendFantasyHome";
import LegendFantasyWorld from "./LegendFantasyWorld";
import { Motes, Ornament, useScene } from "./LegendFantasyEffects";
import { art } from "./legendFantasyData";

/** Same public props as the original. The separate cinematic intro is untouched. */
export default function LegendFantasyInvitationCard({ brideName = "Ana", groomName = "Luka", weddingDate = "", weddingTime = "", venue = "", details = {}, onRsvpSubmit }) {
  const [ref, seen] = useScene();
  const mainRef = useRef(null);
  useEffect(() => {
    const nodes = mainRef.current?.querySelectorAll(".lfp-motes, .lfp-dial, .lfp-moon__mist, .lfp-opening__ring, .lfp-heading");
    if (!nodes) return;
    if (!("IntersectionObserver" in window)) { nodes.forEach(n => n.classList.add("is-animating")); return; }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      entry.target.classList.toggle("is-animating", entry.isIntersecting && !document.hidden);
      if (entry.isIntersecting) entry.target.classList.add("was-seen");
    }), { rootMargin: "40px" });
    nodes.forEach(node => observer.observe(node));
    const pause = () => nodes.forEach(node => {
      const rect = node.getBoundingClientRect();
      node.classList.toggle("is-animating", !document.hidden && rect.bottom > 0 && rect.top < window.innerHeight);
    });
    document.addEventListener("visibilitychange", pause);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", pause); };
  }, []);
  const props = { brideName, groomName, weddingDate, weddingTime, venue, details: details || {}, onRsvpSubmit };
  return <main ref={mainRef} className="legend-fantasy lfp" id="legend-fantasy-invitation">
    <section ref={ref} className={`lfp-opening ${seen ? "is-seen" : ""}`} aria-labelledby="lfp-opening-title">
      <img className="lfp-opening__art" src={art("opening")} alt="" width="1024" height="1536" fetchPriority="high" decoding="async"/>
      <Motes/>
      <div className="lfp-opening__copy">
        <span className="lfp-kicker">Jedna priča. Jedan zajednički put.</span>
        <p className="lfp-opening__epigraph">Dugo očekivana<br/>zabava</p>
        <div className="lfp-opening__ring" aria-hidden="true"><img src={art("golden-ring")} alt="" width="1254" height="1254" decoding="async"/></div>
        <h1 id="lfp-opening-title"><span>{brideName}</span><em>i</em><span>{groomName}</span></h1>
        <p className="lfp-opening__date">{weddingDate}{weddingTime && <span>u {weddingTime}</span>}</p>
        <p className="lfp-opening__prose">{details?.welcomeText || "Posle mnogih puteva, skretanja i avantura, naša priča je pronašla svoj dom. Pozivamo vas da zajedno započnemo najlepše poglavlje."}</p>
        {venue && <p className="lfp-opening__venue">{venue}</p>}
        <a className="lfp-explore" href="#lfp-map">Naše putovanje počinje ovde<span aria-hidden="true">↓</span></a>
      </div>
      <span className="lfp-opening__folio" aria-hidden="true">I · KNJIGA NAŠE PRIČE</span>
    </section>
    <LegendFantasyMap {...props}/>
    <LegendFantasyHome {...props}/>
    <LegendFantasyWorld {...props}/>
  </main>;
}
