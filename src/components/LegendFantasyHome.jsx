import { useEffect, useRef, useState } from "react";
import { art } from "./legendFantasyData";
import { Chapter, Motes, Ornament, useScene } from "./LegendFantasyEffects";

export default function LegendFantasyHome({ brideName = "Ana", groomName = "Luka", weddingDate = "", venue = "", details = {} }) {
  const [open, setOpen] = useState(false);
  const doorRef = useRef(null);
  const touched = useRef(false);
  const [ref, seen] = useScene();
  useEffect(() => {
    const node = doorRef.current;
    if (!node || !("IntersectionObserver" in window)) return;
    let timer;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        timer = setTimeout(() => { if (!touched.current) setOpen(true); }, 1100);
        observer.disconnect();
      }
    }, { threshold: .7 });
    observer.observe(node);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, []);
  const toggle = () => { touched.current = true; setOpen(v => !v); };
  return <section ref={ref} className={`lfp-home ${seen ? "is-seen" : ""} ${open ? "is-open" : ""}`} aria-label="Naš dom">
    <Chapter number="II" label="Povratak u Okrug" title="Naša priča je pronašla dom">Najlepše avanture počinju na kućnom pragu.</Chapter>
    <div className="lfp-home__scene">
      <img className="lfp-home__art" src={art("shire")} width="1024" height="1536" loading="lazy" decoding="async" alt="Hobitska kuća među cvećem, obasjana zlatnim svetlom"/>
      <Motes count={16}/>
      <button ref={doorRef} className="lfp-home__door" type="button" onClick={toggle} aria-expanded={open} aria-controls="lfp-home-letter" aria-label={open ? "Zatvori vrata doma" : "Otvori vrata doma"}>
        <img src={art("round-door")} alt="" width="1024" height="1024" loading="lazy"/>
      </button>
      <button className="lfp-home__hint" type="button" onClick={toggle} aria-expanded={open} aria-controls="lfp-home-letter">{open ? "Naš dom je i vaš dom" : "Dodirnite vrata i zakoračite u priču"}<span aria-hidden="true">{open ? "✧" : "↗"}</span></button>
    </div>
    <div className="lfp-home__unroll" id="lfp-home-letter" hidden={!open}>
      <div className="lfp-scroll">
        <span className="lfp-scroll__rod" aria-hidden="true"/>
        <div className="lfp-scroll__body"><Ornament tree/><p className="lfp-kicker">Dugo očekivana zabava</p><p className="lfp-home__letter">{details.shireText || "Vreme je da zajedno stvaramo uspomene koje ćemo pamtiti zauvek i prenositi kao legendu."}</p><strong className="lfp-home__names">{brideName} <em>i</em> {groomName}</strong>{details.familyText && <p>{details.familyText}</p>}<Ornament/><p>{weddingDate}<br/>{venue}</p><p className="lfp-italic">Vaše prisustvo učiniće ovu priču još lepšom.</p></div>
        <span className="lfp-scroll__rod" aria-hidden="true"/>
      </div>
    </div>
  </section>;
}
