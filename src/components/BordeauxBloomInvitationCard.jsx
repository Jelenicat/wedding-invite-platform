import { useLayoutEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import BordeauxBloomCountdown, { BordeauxBloomCalendar, BordeauxBloomDust, BordeauxBloomFloralLayer, BordeauxBloomNames, BordeauxBloomReveal, BordeauxBloomText } from "./BordeauxBloomCountdown";
import BordeauxBloomRSVP from "./BordeauxBloomRSVP";
import "../styles/newintro.css";
import "../styles/newcard.css";
import "../styles/newrsvp.css";

export default function BordeauxBloomInvitationCard({
  brideName = "Ana", groomName = "Nikola", weddingDate, venue, details = {}, slug,
  type = "wedding", script = "latin", language = "sr",
}) {
  const root = useRef(null);
  const reduced = useReducedMotion();
  const config = details.bordeauxBloom || {};
  const cyr = script === "cyrillic";
  const corner = config.cornerImage || "/images/bordeaux-bloom-relief-cascade.webp";
  const flowers = config.flowersImage || "/images/bordeaux-bloom-relief-crown.webp";
  const rose = config.roseImage || "/images/bordeaux-bloom-relief-rose.webp";
  const reliefPaper = config.reliefPaper || "/images/bordeaux-bloom-relief-paper.webp";
  const events = (details.events || []).filter(event => event.label || event.time);
  const map = details.locationButtonLink || details.mapLink;
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(details.dateISO || "");
  const calendarDate = dateMatch ? new Date(Date.UTC(Number(dateMatch[1]), Number(dateMatch[2]) - 1, Number(dateMatch[3]))) : null;
  const dateMonth = calendarDate ? new Intl.DateTimeFormat(language === "en" ? "en" : language === "de" ? "de" : cyr ? "sr-Cyrl" : "sr-Latn", { month: "long", timeZone: "UTC" }).format(calendarDate) : "";
  const t = language === "en" ? {
    invite: "Together with our families", dear: "Dear guests", welcome: "We invite you to share the joy of our wedding day and celebrate the beginning of our new chapter.",
    program: "Our day", programNote: "From the first toast to the last dance", dateNote: "A date to treasure", women: "For her", men: "For him", palette: "Our colours", details: "The details", location: "The celebration", map: "View location", dress: "Dress code", contacts: "Get in touch", contactText: "For any questions, please get in touch with the bride and groom.", closing: "With love", small: "A few little wishes",
  } : language === "de" ? {
    invite: "Gemeinsam mit unseren Familien", dear: "Liebe Gäste", welcome: "Wir laden euch herzlich ein, unseren Hochzeitstag und den Beginn unseres gemeinsamen Weges mit uns zu feiern.",
    program: "Unser Tag", programNote: "Vom ersten Anstoßen bis zum letzten Tanz", dateNote: "Ein Datum für immer", women: "Für sie", men: "Für ihn", palette: "Unsere Farben", details: "Die Details", location: "Die Feier", map: "Ort ansehen", dress: "Dresscode", contacts: "Kontakt", contactText: "Für alle Fragen stehen euch Braut und Bräutigam gerne zur Verfügung.", closing: "In Liebe", small: "Unsere kleinen Wünsche",
  } : cyr ? {
    invite: "Са радошћу вас позивамо", dear: "Драги гости", welcome: "Позивамо вас да будете део нашег посебног дана и заједно са нама прославите почетак наше заједничке приче.",
    program: "Наш дан", programNote: "Од прве здравице до последњег плеса", dateNote: "Датум који чувамо", women: "За даме", men: "За господу", palette: "Наша палета", details: "Детаљи", location: "Место прославе", map: "Погледај локацију", dress: "Дрес код", contacts: "Контакти", contactText: "За сва питања и договоре, слободно се јавите младенцима.", closing: "С љубављу", small: "Наше мале жеље",
  } : {
    invite: "Sa radošću vas pozivamo", dear: "Dragi gosti", welcome: "Pozivamo vas da budete deo našeg posebnog dana i zajedno sa nama proslavite početak naše zajedničke priče.",
    program: "Naš dan", programNote: "Od prve zdravice do poslednjeg plesa", dateNote: "Datum koji čuvamo", women: "Za dame", men: "Za gospodu", palette: "Naša paleta", details: "Detalji", location: "Mesto proslave", map: "Pogledaj lokaciju", dress: "Dres kod", contacts: "Kontakti", contactText: "Za sva pitanja i dogovore, slobodno se javite mladencima.", closing: "S ljubavlju", small: "Naše male želje",
  };

  useLayoutEffect(() => {
    const html = document.documentElement;
    const previous = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    html.style.scrollBehavior = previous;
    root.current?.focus({ preventScroll: true });
  }, [slug]);

  return <article ref={root} tabIndex={-1} className={`bb bb-card ${cyr ? "bb-cyrillic" : ""}`}>
    <header className="bb-hero">
      <div className="bb-relief-backdrop bb-hero-relief" aria-hidden="true"><img src={reliefPaper} alt="" width="1024" height="1536" /></div>
      <BordeauxBloomDust />
      <BordeauxBloomReveal className="bb-hero-crest"><img src="/icons/bordeaux-bloom-crest.svg" width="240" height="180" alt="" /><span className="bb-hero-initials" aria-hidden="true">{Array.from(brideName.trim())[0]}<i>&amp;</i>{Array.from(groomName.trim())[0]}</span></BordeauxBloomReveal>
      <BordeauxBloomFloralLayer className="bb-hero-floral" src={corner} depth={22} eager ambient={config.ambientMotion !== false} />
      <BordeauxBloomFloralLayer className="bb-hero-rose" src={rose} width={1254} height={1254} depth={-15} eager ambient={config.ambientMotion !== false} />
      <BordeauxBloomNames brideName={brideName} groomName={groomName} />
      <BordeauxBloomText as="p" className="bb-kicker bb-hero-invite">{config.heroText || t.invite}</BordeauxBloomText>
      <BordeauxBloomReveal className="bb-hero-date">
        {dateMatch ? <time dateTime={dateMatch[0]}><span className="bb-date-day">{Number(dateMatch[3])}</span><span className="bb-date-caption" style={{ "--bb-hero-month-size": dateMonth.length > 8 ? "54px" : dateMonth.length > 7 ? "58px" : "66px" }}><BordeauxBloomText as="span" className="bb-date-month" scriptText>{dateMonth}</BordeauxBloomText><span className="bb-date-year">{dateMatch[1]}</span></span></time> : <p>{details.date || weddingDate}</p>}
        <img src="/icons/bordeaux-bloom-divider.svg" width="154" height="41" alt="" />
      </BordeauxBloomReveal>
    </header>

    <section className="bb-welcome bb-section">
      <BordeauxBloomText className="bb-welcome-title" scriptText>{config.welcomeTitle || t.dear}</BordeauxBloomText>
      <BordeauxBloomReveal><p className="bb-copy">{details.welcomeText || t.welcome}</p></BordeauxBloomReveal>
      {details.note && <BordeauxBloomReveal delay={.12}><p className="bb-copy bb-welcome-note">{details.note}</p></BordeauxBloomReveal>}
    </section>

    {(config.showCalendar !== false || config.showCountdown !== false) && details.dateISO && <section className="bb-date-keepsake" aria-label={t.dateNote}>
      <img className="bb-keepsake-corner bb-corner-nw" src="/icons/bordeaux-bloom-corner-engraving.svg" width="180" height="180" alt="" loading="lazy" />
      <img className="bb-keepsake-corner bb-corner-se" src="/icons/bordeaux-bloom-corner-engraving.svg" width="180" height="180" alt="" loading="lazy" />
      <BordeauxBloomReveal><p className="bb-kicker bb-date-note">{config.dateNote || t.dateNote}</p></BordeauxBloomReveal>
      {config.showCalendar !== false && <BordeauxBloomCalendar dateISO={details.dateISO} script={script} language={language} />}
      {config.showCountdown !== false && <BordeauxBloomCountdown targetDate={details.dateISO} brideName={brideName} groomName={groomName} details={details} script={script} language={language} />}
    </section>}

    {events.length > 0 && <section className="bb-section bb-program">
      <img className="bb-program-engraving" src="/icons/bordeaux-bloom-corner-engraving.svg" width="180" height="180" alt="" loading="lazy" />
      <BordeauxBloomText className="bb-section-title" scriptText>{config.timelineTitle || t.program}</BordeauxBloomText>
      <BordeauxBloomReveal><p className="bb-kicker bb-program-note">{config.timelineSubtitle || t.programNote}</p><img className="bb-program-sprig" src="/icons/bordeaux-bloom-divider.svg" width="154" height="41" alt="" /></BordeauxBloomReveal>
      <div className="bb-agenda-scene"><svg className="bb-agenda-thread" viewBox="0 0 44 600" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="bb-thread-gold" x2="1" y2="1"><stop stopColor="#c2a783" /><stop offset=".45" stopColor="#ede1cf" /><stop offset="1" stopColor="#ad8b62" /></linearGradient></defs><motion.path d="M22 0C-2 75 48 125 22 200S-4 325 22 400S48 525 22 600" stroke="url(#bb-thread-gold)" strokeWidth="1.4" fill="none" initial={reduced ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, amount: .12 }} transition={{ duration: reduced ? 0 : 3, ease: "easeInOut" }} /></svg>
      <ol className="bb-agenda">{events.map((event, index) => <motion.li key={`${event.time}-${index}`}
        initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: .35 }} transition={{ duration: 1, ease: [.22, 1, .36, 1] }}>
        <div className="bb-agenda-hour"><span className="bb-agenda-medallion"><img src={index === 0 ? "/icons/bordeaux-bloom-toast.svg" : index === 1 ? "/icons/bordeaux-bloom-rings.svg" : "/icons/bordeaux-bloom-dinner.svg"} width="65" height="65" alt="" loading="lazy" /></span><time>{event.time}</time></div>
        <span className="bb-agenda-dot" aria-hidden="true"><motion.span initial={reduced ? false : { scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: .15 }} /></span>
        <div className="bb-agenda-copy"><span className="bb-agenda-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h3>{event.label}</h3>{event.location && <p>{event.location}</p>}{(event.note || event.description) && <p>{event.note || event.description}</p>}
          {event.mapLink && <a className="bb-text-link" href={event.mapLink} target="_blank" rel="noopener noreferrer">{t.map}<img src="/icons/bordeaux-bloom-arrow.svg" width="17" height="12" alt="" /></a>}
        </div>
      </motion.li>)}</ol></div>
      <BordeauxBloomReveal className="bb-program-ribbon"><img src="/icons/bordeaux-bloom-silk-ribbon.svg" width="420" height="150" alt="" /></BordeauxBloomReveal>
    </section>}

    <section className="bb-details-arch" aria-labelledby="bb-details-title">
      <BordeauxBloomDust light />
      <BordeauxBloomFloralLayer className="bb-arch-flowers" src={flowers} width={1536} height={1024} depth={10} ambient={config.ambientMotion !== false} />
      <img className="bb-arch-engraving" src="/icons/bordeaux-bloom-corner-engraving.svg" width="180" height="180" alt="" loading="lazy" />
      <BordeauxBloomReveal>
        <BordeauxBloomText as="h2" className="bb-section-title" scriptText>{config.detailsTitle || t.details}</BordeauxBloomText>
        <p id="bb-details-title" className="bb-kicker bb-location-kicker">{t.location}</p>
        <h3 className="bb-venue">{details.locationName || venue || details.venue}</h3>
        {details.locationAddress && <p className="bb-location-address">{details.locationAddress}</p>}
        {details.showLocationButton && map && <a className="bb-button bb-map-button" href={map} target="_blank" rel="noopener noreferrer">{details.locationButtonText || t.map}<img src="/icons/bordeaux-bloom-pin.svg" width="15" height="19" alt="" /></a>}
      </BordeauxBloomReveal>
      {(config.giftsText || config.flowersText) && <BordeauxBloomReveal className="bb-little-wishes">
        <p className="bb-kicker">{t.small}</p>{config.giftsText && <p>{config.giftsText}</p>}{config.flowersText && <p>{config.flowersText}</p>}
      </BordeauxBloomReveal>}
    </section>

    {details.showDressCode && <section className="bb-section bb-dress">
      <BordeauxBloomText className="bb-section-title" scriptText>{details.dressCodeTitle || t.dress}</BordeauxBloomText>
      <BordeauxBloomReveal><div className="bb-fashion-plate"><img className="bb-dress-illustration" src="/icons/bordeaux-bloom-attire.svg" width="180" height="190" alt="" /></div>
        {details.dressCodeNote && <p className="bb-copy bb-dress-note">{details.dressCodeNote}</p>}
        {(details.dressCodeWomen || details.dressCodeMen) && <div className="bb-dress-guide">
          {details.dressCodeWomen && <div><span className="bb-kicker">{t.women}</span><p>{details.dressCodeWomen}</p></div>}
          {details.dressCodeMen && <div><span className="bb-kicker">{t.men}</span><p>{details.dressCodeMen}</p></div>}
        </div>}
        {details.dressCodePalette?.length > 0 && <div className="bb-palette-wrap"><p className="bb-kicker">{t.palette}</p><ul className="bb-palette" aria-label={t.palette}>{details.dressCodePalette.map((item, i) => <li key={i}><span className="bb-colour-swatch" style={{ backgroundColor: typeof item === "string" ? item : item.color }} aria-label={typeof item === "string" ? item : item.label || item.color} />{typeof item !== "string" && item.label && <span className="bb-colour-label">{item.label}</span>}</li>)}</ul></div>}
      </BordeauxBloomReveal>
    </section>}

    {config.showRSVP !== false && <BordeauxBloomRSVP slug={slug} eventType={type} details={details} script={script} language={language} />}
    {config.showContacts !== false && <section className="bb-section bb-contacts">
      <BordeauxBloomText className="bb-section-title" scriptText>{config.contactsTitle || t.contacts}</BordeauxBloomText>
      <BordeauxBloomReveal><p className="bb-copy">{config.contactText || t.contactText}</p>
        {(config.contacts || []).filter(person => person.phone).map((person, index) => <a key={index} className="bb-contact-link" href={`tel:${String(person.phone).replace(/[^+\d]/g, "")}`}><span>{person.name}</span>{person.phone}</a>)}
      </BordeauxBloomReveal>
    </section>}
    <BordeauxBloomFloralLayer className="bb-small-flowers" src={flowers} width={1536} height={1024} depth={9} ambient={config.ambientMotion !== false} />
    <footer className="bb-footer"><BordeauxBloomText as="p" className="bb-section-title" scriptText>{config.closingTitle || t.closing}</BordeauxBloomText><p className="bb-kicker">{brideName} &amp; {groomName}</p><img src="/icons/bordeaux-bloom-divider.svg" width="154" height="41" alt="" /></footer>
  </article>;
}
