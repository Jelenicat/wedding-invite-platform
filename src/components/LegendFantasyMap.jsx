import { useEffect, useRef, useState } from "react";
import { Chapter, Ornament } from "./LegendFantasyEffects";
import { art, clamp, initials } from "./legendFantasyData";

const PATHS = ["M105 78 C70 144 183 173 144 260 S119 349 161 396 Q190 411 200 438", "M312 90 C357 173 250 192 281 274 S234 373 222 400 Q207 415 200 438", "M200 438 C153 481 244 505 205 550 L205 576"];
const ROUTE_COLORS = ["#903b32", "#315c45", "#a06a25"];
export default function LegendFantasyMap({ brideName = "Ana", groomName = "Luka", details = {} }) {
  const ref = useRef(null), paths = useRef([]), markers = useRef([]);
  const [met, setMet] = useState(false);
  useEffect(() => {
    const node = ref.current; if (!node) return;
    let raf = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lengths = paths.current.map(p => p.getTotalLength());
    const paint = () => {
      raf = 0; const r = node.getBoundingClientRect(), vh = window.innerHeight;
      const routeScale = r.width / 400;
      const progress = reduced.matches ? 1 : clamp((vh * .72 - r.top) / r.height);
      const portions = [clamp(progress / .72), clamp(progress / .72), clamp((progress - .72) / .28)];
      paths.current.forEach((p, i) => {
        p.style.strokeDasharray = lengths[i] * routeScale; p.style.strokeDashoffset = lengths[i] * routeScale * (1 - portions[i]);
        const point = p.getPointAtLength(lengths[i] * portions[i]);
        markers.current[i].setAttribute("transform", `translate(${point.x} ${point.y})`);
        markers.current[i].style.opacity = i === 2 ? (portions[i] > 0 ? 1 : 0) : (progress >= .72 ? 0 : 1);
      });
      setMet(progress >= .72);
    };
    const request = () => { if (!raf) raf = requestAnimationFrame(paint); };
    paint(); window.addEventListener("scroll", request, { passive: true }); window.addEventListener("resize", request); reduced.addEventListener?.("change", request);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", request); window.removeEventListener("resize", request); reduced.removeEventListener?.("change", request); };
  }, []);
  return <section className="lfp-map" id="lfp-map" aria-label="Mapa naših puteva">
    <Chapter number="I" label="Dve staze, jedna priča" title="Mapa naših puteva">Svaki korak vodio nas je jedno ka drugom.</Chapter>
    <div ref={ref} className={`lfp-map__atlas ${met ? "has-met" : ""}`}>
      <img src={art("map")} alt="Ilustrovana mapa planina, vilenjačkog grada, šuma i hobitskog doma" width="1024" height="1536" loading="lazy" decoding="async"/>
      <svg viewBox="0 0 400 600" className="lfp-map__routes" aria-hidden="true">
        <g strokeLinecap="round" strokeLinejoin="round">
          {PATHS.map((d, i) => <path key={`parchment-${i}`} className="lfp-map__roadbed" vectorEffect="non-scaling-stroke" d={d} fill="none" stroke="#f9ebc7" strokeWidth="12" opacity=".85"/>)}
          {PATHS.map((d, i) => <path key={`border-${i}`} className="lfp-map__road-border" vectorEffect="non-scaling-stroke" d={d} fill="none" stroke={i === 2 ? "#704620" : "#573e2e"} strokeWidth="8.5" opacity=".75"/>)}
          {PATHS.map((d, i) => <path key={`road-${i}`} className="lfp-map__road-core" vectorEffect="non-scaling-stroke" d={d} fill="none" stroke="#eddaad" strokeWidth="6" opacity=".9"/>)}
          {PATHS.map((d, i) => <path key={`track-${i}`} className="lfp-map__road-track" vectorEffect="non-scaling-stroke" d={d} fill="none" stroke={ROUTE_COLORS[i]} opacity=".72" strokeWidth="3.5" strokeDasharray=".7 6"/>)}
          {PATHS.map((d, i) => <path key={i} className="lfp-map__live-route" vectorEffect="non-scaling-stroke" ref={e => { paths.current[i] = e; }} d={d} fill="none" stroke={ROUTE_COLORS[i]} strokeWidth="5.5"/>)}
        </g>
        <circle cx="200" cy="438" r="18" fill="#f7e3b0" opacity=".88" className="lfp-map__confluence-halo"/>
        <circle cx="200" cy="438" r="8.5" fill="#ad7832" stroke="#ffedbd" strokeWidth="2.5"/>
        <path d="M200 430 l2.2 5.8 5.8 2.2 -5.8 2.2 -2.2 5.8 -2.2 -5.8 -5.8 -2.2 5.8 -2.2z" fill="#fff4d2"/>
        {[initials(brideName), initials(groomName), "✦"].map((letter, i) => <g key={i} ref={e => { markers.current[i] = e; }} className="lfp-map__traveller"><circle r="15" fill="none" stroke="#fff3d2" opacity=".45" strokeWidth="2"/><circle r="12.5" fill={i === 0 ? "#79392c" : i === 1 ? "#304b38" : "#946b2d"} stroke="#fff0ca" strokeWidth="2.5"/><text textAnchor="middle" y="4.3" fill="#fff8e2" fontSize="12" fontFamily="Georgia">{letter}</text></g>)}
      </svg>
      <div className="lfp-map__start lfp-map__start--one"><strong>{brideName}</strong><span>{details.legendMap?.brideStart || "Njena staza"}</span></div>
      <div className="lfp-map__start lfp-map__start--two"><strong>{groomName}</strong><span>{details.legendMap?.groomStart || "Njegova staza"}</span></div>
      <span className="lfp-map__place lfp-map__place--forest">Šuma uspomena</span><span className="lfp-map__place lfp-map__place--mountains">Planine snova</span>
      <div className="lfp-map__meeting"><strong>{details.legendMap?.meetingText || "Tu su se naši putevi sreli"}</strong></div>
      <div className="lfp-map__home">Od tada — zajedno</div>
    </div>
    <div className="lfp-map__epilogue"><Ornament/><p>Dva puta postala su jedan.<br/><em>A najlepša pustolovina tek počinje.</em></p></div>
  </section>;
}
