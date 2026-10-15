import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { noirData, NoirArrow, NoirIcon, NoirLetters, NoirPhoto, NoirReveal, NoirScript } from "./BirthdayNoirIntro";
import BirthdayNoirRSVP from "./BirthdayNoirRSVP";
import BirthdayNoirCountdown from "./BirthdayNoirCountdown";
import "../styles/newcard.css";

export default function BirthdayNoirInvitationCard(props) {
  const { slug, details = {} } = props;
  const data = noirData(props);
  const c = data.cyrillic;
  const reduced = useReducedMotion();
  const article = useRef(null);
  const events = Array.isArray(details.events) ? details.events : [];
  const map = details.mapLink || details.locationButtonLink || (data.venue ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${data.venue} ${data.address}`.trim())}` : "");
  useEffect(() => {
    const frame = requestAnimationFrame(() => { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); article.current?.focus({ preventScroll: true }); });
    return () => cancelAnimationFrame(frame);
  }, [slug]);

  return <article ref={article} className="bno bno-card" tabIndex={-1} data-script={c ? "cyrillic" : "latin"} lang={c ? "sr-Cyrl" : "sr-Latn"} aria-label={c ? "Рођенданска позивница" : "Rođendanska pozivnica"} style={{ "--bno-name-scale": data.nameScale }}>
    <section className="bno-hero">
      <NoirPhoto src={data.noir.heroImage || data.disco} className="bno-hero-photo" eager position={data.noir.heroPosition || "35% 40%"} />
      <div className="bno-hero-shade" aria-hidden="true" />
      <div className="bno-hero-copy">
        <NoirReveal><p className="bno-kicker">{data.name} · {data.age}. {c ? "РОЂЕНДАН" : "ROĐENDAN"}</p></NoirReveal>
        <h1 className="bno-hero-title"><NoirLetters text={data.noir.heroTitle || (c ? "Славимо" : "Slavimo")} delay={0.15} /><NoirScript delay={0.4}>{data.noir.heroScript || (c ? "заједно." : "zajedno.")}</NoirScript></h1>
        <NoirReveal delay={0.3}><p className="bno-hero-invite">{data.noir.heroText || (c ? "Једно посебно вече. Људи које волим. Успомене које остају." : "Jedno posebno veče. Ljudi koje volim. Uspomene koje ostaju.")}</p></NoirReveal>
      </div>
      <NoirReveal className="bno-hero-footer"><span>{data.date}</span><NoirArrow down /></NoirReveal>
    </section>

    <section className="bno-welcome bno-section">
      <NoirReveal className="bno-center"><NoirIcon /><p className="bno-kicker">{c ? "ОВО ВЕЧЕ ЈЕ" : "OVO VEČE JE"}</p><h2 className="bno-heading"><NoirLetters text={c ? "посебно" : "posebno"} /><NoirScript underline>{c ? "због вас." : "zbog vas."}</NoirScript></h2></NoirReveal>
      <NoirReveal><p className="bno-welcome-text">{details.welcomeText || (c ? `Позивам вас да заједно прославимо мој ${data.age}. рођендан. Дођите да плешемо, смејемо се и уживамо у вечери коју ћемо дуго памтити.` : `Pozivam vas da zajedno proslavimo moj ${data.age}. rođendan. Dođite da plešemo, smejemo se i uživamo u večeri koju ćemo dugo pamtiti.`)}</p></NoirReveal>
      {details.closingText && <NoirReveal><p className="bno-welcome-note">{details.closingText}</p></NoirReveal>}
      <NoirReveal className="bno-welcome-signature"><NoirScript>{data.name}</NoirScript></NoirReveal>
    </section>

    <section className="bno-event bno-section">
      <NoirReveal className="bno-center"><p className="bno-kicker">{c ? "САЧУВАЈ ДАТУМ" : "SAČUVAJ DATUM"}</p><h2 className="bno-heading"><NoirScript>{c ? "Видимо се." : "Vidimo se."}</NoirScript></h2></NoirReveal>
      <div className="bno-event-grid">
        {data.date && <NoirReveal className="bno-event-cell" from="left"><NoirIcon type="calendar" /><span className="bno-kicker">{c ? "ДАТУМ" : "DATUM"}</span><p>{data.date}</p></NoirReveal>}
        {data.time && <NoirReveal className="bno-event-cell" from="right" delay={0.08}><NoirIcon type="clock" /><span className="bno-kicker">{c ? "ПОЧЕТАК" : "POČETAK"}</span><p>{data.time}<small>h</small></p></NoirReveal>}
      </div>
      {data.venue && <NoirReveal className="bno-location">
        <NoirIcon type="location" /><p className="bno-kicker">{c ? "МЕСТО ПРОСЛАВЕ" : "MESTO PROSLAVE"}</p><h3>{data.venue}</h3>
        {data.address && <p className="bno-address">{data.address}</p>}
        {map && <motion.a className="bno-button bno-button-outline" href={map} target="_blank" rel="noopener noreferrer" whileTap={reduced ? undefined : { scale: 0.98 }}><span>{details.locationButtonText || (c ? "ПОГЛЕДАЈ ЛОКАЦИЈУ" : "POGLEDAJ LOKACIJU")}</span><NoirArrow /></motion.a>}
      </NoirReveal>}
      {events.length > 0 && <div className="bno-schedule">{events.map((event, i) => <NoirReveal className="bno-schedule-item" key={`${event.time}-${i}`} from={i % 2 ? "right" : "left"}>
        <span className="bno-schedule-dot" aria-hidden="true" /><span className="bno-schedule-time">{event.time}</span><div><h3>{event.title || event.label || event.name}</h3>{(event.venue || event.location) && <p>{event.venue || event.location}</p>}{event.mapLink && <a className="bno-text-link" href={event.mapLink} target="_blank" rel="noopener noreferrer">{c ? "ЛОКАЦИЈА" : "LOKACIJA"}<NoirArrow /></a>}</div>
      </NoirReveal>)}</div>}
      {details.showDressCode && <NoirReveal className="bno-dress"><NoirIcon /><h3>{details.dressCodeTitle || "Dress code"}</h3>{details.dressCodeNote && <p>{details.dressCodeNote}</p>}{Array.isArray(details.dressCodePalette) && details.dressCodePalette.length > 0 && <div className="bno-palette">{details.dressCodePalette.map((value, i) => {
        const color = typeof value === "string" ? value : value.color || value.hex;
        const label = typeof value === "string" ? value : value.label || value.name || color;
        return <span key={i} style={{ backgroundColor: color }} role="img" aria-label={label} title={label} />;
      })}</div>}</NoirReveal>}
    </section>

    <section className="bno-toast">
      <NoirPhoto src={data.noir.toastImage || data.cover} position={data.noir.toastPosition || "50% 78%"} />
      <div className="bno-toast-shade" aria-hidden="true" />
      <NoirReveal className="bno-toast-copy"><p>{data.noir.toastTitle || (c ? "За тренутке" : "Za trenutke")}</p><NoirScript>{data.noir.toastScript || (c ? "који остају." : "koji ostaju.")}</NoirScript></NoirReveal>
    </section>
    <BirthdayNoirRSVP {...props} eventType="birthday" />
    <BirthdayNoirCountdown {...props} targetDate={details.dateISO} />
  </article>;
}
