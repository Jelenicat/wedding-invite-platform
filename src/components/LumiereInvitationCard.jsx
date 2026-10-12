import { useEffect, useLayoutEffect, useRef } from "react";
import LumiereRSVP from "./LumiereRSVP";
import LumiereCountdown from "./LumiereCountdown";
import { LUMIERE_ASSETS, LumiereIcon, LumierePhoto, LumiereReveal, lumiereDateParts, lumiereNameScale, lumiereText, useLumiereReducedMotion } from "./LumiereIntro";
import "../styles/newcard.css";

const EVENT_ICONS = { gathering: "glasses", guests: "glasses", church: "church", groom: "glasses", civil: "rings", ceremony: "rings", dinner: "dinner", restaurant: "dinner", party: "party", rings: "rings", angel: "heart", dresscode: "dress", cake: "cake", vecera: "dinner", camera: "camera" };
const mapsUrl = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || "")}`;

function WeddingCalendar({ date, language, script }) {
  if (!date) return null;
  const year = Number(date.year);
  const month = Number(date.monthNumber) - 1;
  const day = Number(date.day);
  const offset = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  const count = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const labels = language === "en" ? ["M", "T", "W", "T", "F", "S", "S"] : language === "de" ? ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"] : script === "cyrillic" ? ["П", "У", "С", "Ч", "П", "С", "Н"] : ["P", "U", "S", "Č", "P", "S", "N"];
  return <div className="lmv-calendar" aria-hidden="true">
    {labels.map((label, i) => <span className="lmv-calendar-weekday" key={`w-${i}`}>{label}</span>)}
    {Array.from({ length: offset }, (_, i) => <span key={`empty-${i}`} />)}
    {Array.from({ length: count }, (_, i) => <span key={i} className={`lmv-calendar-cell ${i + 1 === day ? "is-wedding" : ""}`}>{i + 1}{i + 1 === day && <svg viewBox="0 0 40 37"><ellipse cx="20" cy="18" rx="17" ry="15" /></svg>}</span>)}
  </div>;
}

function Chapter({ index, children }) {
  return <div className="lmv-chapter-head"><span className="lmv-kicker">{children}</span><span className="lmv-chapter-index" aria-hidden="true">{index}</span></div>;
}

// Jedna scena ostaje u kadru dok se fotografija širi, a druga uspomena ulazi preko nje.
// Skrol menja samo CSS promenljive; nema React renderovanja pri svakom pomeranju.
function StoryScene({ hero, storyImage, detailPhoto, config, t, brideName, groomName, reduced }) {
  const ref = useRef(null);
  useEffect(() => {
    if (reduced || !ref.current) return;
    let active = true, frame = 0;
    const update = () => {
      frame = 0;
      if (!active || !ref.current) return;
      const box = ref.current.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, -box.top / Math.max(1, box.height - window.innerHeight)));
      ref.current.style.setProperty("--lmv-scene-open", Math.min(1, p * 2.5).toFixed(4));
      ref.current.style.setProperty("--lmv-scene-turn", Math.max(0, Math.min(1, (p - .32) / .55)).toFixed(4));
    };
    const queue = () => { if (active && !frame) frame = requestAnimationFrame(update); };
    let observer;
    if (window.IntersectionObserver) {
      observer = new IntersectionObserver(([entry]) => { active = entry.isIntersecting; if (active) queue(); }, { rootMargin: "100px" });
      observer.observe(ref.current);
    }
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    queue();
    return () => { observer?.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", queue); window.removeEventListener("resize", queue); };
  }, [reduced]);
  return <section className="lmv-story-scene" ref={ref}>
    <div className="lmv-story-sticky">
      <p className="lmv-kicker">{t.story}</p>
      <div className="lmv-story-photo"><LumierePhoto src={hero} alt={config.heroAlt || ""} position={config.heroPosition || "50% 45%"} parallax={false} /><LumierePhoto src={storyImage} className="lmv-story-next" alt={config.storyAlt || ""} position={config.storyPosition || "50% 42%"} parallax={false} /></div>
      <h2 className="lmv-story-caption">{config.photoQuote || t.chapter}</h2>
      <div className="lmv-story-memory" aria-hidden="true"><LumierePhoto src={detailPhoto} position={config.detailPosition || "50% 50%"} parallax={false} /><span>{brideName} &amp; {groomName}</span></div>
    </div>
  </section>;
}

export default function LumiereInvitationCard({ brideName = "", groomName = "", weddingDate, weddingTime, venue, details = {}, backgroundImage, image, image1, image2, image3, slug = "", type = "wedding", script = "latin", language = "sr" }) {
  const rootRef = useRef(null);
  const reduced = useLumiereReducedMotion();
  const t = lumiereText(language, script);
  const config = details.lumiere || {};
  const hero = config.heroImage || image || image1 || backgroundImage || LUMIERE_ASSETS.hero;
  const storyImage = config.storyImage || (hero === LUMIERE_ASSETS.hero ? LUMIERE_ASSETS.story : hero);
  const detailPhoto = config.detailImage || image2 || LUMIERE_ASSETS.detail;
  const venueImage = config.venueImage || image3 || LUMIERE_ASSETS.venue;
  const dateInput = details.dateISO || details.date || weddingDate;
  const date = lumiereDateParts(dateInput, language, script);
  const dateLabel = details.date || weddingDate || (date ? `${date.day}. ${date.month} ${date.year}` : "");
  const rsvpId = `lmv-rsvp-${slug || "event"}`;
  const venueName = details.locationName || details.venue || venue;
  const mapLink = details.locationButtonLink || details.mapLink || (venueName ? mapsUrl(venueName) : "");
  const timeline = Array.isArray(details.events) ? details.events.filter((event) => event && (event.label || event.time)) : [];
  const dressCode = Boolean(details.showDressCode && (details.dressCodeTitle || details.dressCodeNote || details.dressCodeWomen || details.dressCodeMen || details.dressCodePalette?.length));
  const info = Array.isArray(config.information) ? config.information : [];
  const contacts = Array.isArray(config.contacts) ? config.contacts : [];

  useLayoutEffect(() => {
    const previous = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.style.scrollBehavior = previous;
    rootRef.current?.focus({ preventScroll: true });
  }, [slug]);

  // Ažuriranje linije napretka tokom skrolovanja; nezavisno od RSVP dugmeta.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!rootRef.current) return;
      const box = rootRef.current.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -box.top / Math.max(1, box.height - window.innerHeight)));
      rootRef.current.style.setProperty("--lmv-progress", progress.toFixed(4));
    };
    const scroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll);
    scroll();
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", scroll);
    };
  }, [slug]);

  return <main ref={rootRef} tabIndex={-1} className="lmv lmv-card" data-script={script} aria-label={t.invitation}>
    <div className="lmv-reading-progress" aria-hidden="true" />
    <header className="lmv-card-hero">
      <LumierePhoto src={hero} alt={config.heroAlt || ""} eager position={config.heroPosition || "50% 45%"} />
      <div className="lmv-hero-top"><span aria-hidden="true">{brideName.trim()[0]} / {groomName.trim()[0]}</span><span className="lmv-kicker">{t.invitation}</span></div>
      <span className="lmv-hero-amp" aria-hidden="true">&amp;</span>
      <div className="lmv-hero-bottom"><h1 className="lmv-hero-title" style={{ "--lmv-bride-scale": lumiereNameScale(brideName, 5.7), "--lmv-groom-scale": lumiereNameScale(groomName, 5.5) }}><span>{brideName}</span><span className="lmv-hero-groom">{groomName}</span></h1><p className="lmv-hero-date">{dateLabel}</p></div>
      <p className="lmv-hero-scroll">{t.scroll}<span aria-hidden="true">↓</span></p>
    </header>
    <div className="lmv-meta-strip"><span>{date?.numeric || dateLabel}</span>{venueName && <span>{venueName}</span>}</div>

    <LumiereReveal as="section" className="lmv-intro-letter"><span className="lmv-letter-amp" aria-hidden="true">&amp;</span><div className="lmv-wrap"><p className="lmv-letter-handnote">{t.closing}</p><p className="lmv-kicker">{t.story}</p><h2 className="lmv-heading">{config.welcomeTitle || t.welcomeTitle}</h2><p className="lmv-body">{details.welcomeText || t.welcome}</p><p className="lmv-signature">{brideName} &amp; {groomName}</p></div></LumiereReveal>

    {dateLabel && <LumiereReveal as="section" className="lmv-date-section"><div className="lmv-wrap"><Chapter index="01">{t.date}</Chapter>{date ? <><div className="lmv-date-lockup"><span>{date.day}</span><div><p className="lmv-date-month">{date.month}</p><p className="lmv-date-year">{date.year}</p></div></div><p className="lmv-weekday">{date.weekday}{weddingTime && <span> · {weddingTime}</span>}</p><WeddingCalendar date={date} language={language} script={script} /><span className="lmv-sr-only">{dateLabel}</span></> : <p className="lmv-heading">{dateLabel}</p>}</div></LumiereReveal>}

    <StoryScene hero={hero} storyImage={storyImage} detailPhoto={detailPhoto} config={config} t={t} brideName={brideName} groomName={groomName} reduced={reduced} />

    {timeline.length > 0 && <section className="lmv-plan-section"><div className="lmv-wrap"><LumiereReveal><Chapter index="02">{t.plan}</Chapter><h2 className="lmv-heading">{config.planTitle || t.plan}</h2><p className="lmv-body">{config.planNote || t.planNote}</p></LumiereReveal><div className="lmv-timeline">{timeline.map((event, index) => <LumiereReveal key={`${event.label}-${index}`} className="lmv-event" delay={Math.min(index * 50, 180)}><time className="lmv-event-time">{event.time}</time><div className="lmv-event-spine" aria-hidden="true"><LumiereIcon name={EVENT_ICONS[event.icon] || "rings"} size={38} /></div><div className="lmv-event-copy"><h3>{event.label}</h3>{event.location && <a className="lmv-event-location" href={event.mapLink || mapsUrl(event.location)} target="_blank" rel="noopener noreferrer">{event.location}{" "}<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg></a>}{event.note && <p className="lmv-event-note">{event.note}</p>}</div></LumiereReveal>)}</div></div></section>}

    {venueName && <section className="lmv-venue-section"><div className="lmv-wrap"><LumiereReveal><Chapter index="03">{t.location}</Chapter></LumiereReveal></div><LumiereReveal className="lmv-venue-layout"><LumierePhoto src={venueImage} alt={config.venueAlt || ""} className="lmv-venue-photo" position={config.venuePosition || "50% 50%"} /><div className="lmv-venue-paper"><LumiereIcon name="pin" size={32} /><h2 className="lmv-script">{config.locationTitle || t.location}</h2><h3>{venueName}</h3>{details.locationAddress && <p className="lmv-body">{details.locationAddress}</p>}{mapLink && details.showLocationButton !== false && <a className="lmv-button" href={mapLink} target="_blank" rel="noopener noreferrer"><span>{details.locationButtonText || t.map}</span><svg className="lmv-arrow" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg></a>}</div></LumiereReveal></section>}

    {dressCode && <LumiereReveal as="section" className="lmv-dress-section"><div className="lmv-wrap"><Chapter index="04">{t.dressCode}</Chapter><div className="lmv-dress-head"><h2 className="lmv-heading">{details.dressCodeTitle || t.dressCode}</h2><LumiereIcon name="dress" size={53} /></div>{details.dressCodeNote && <p className="lmv-body">{details.dressCodeNote}</p>}{Array.isArray(details.dressCodePalette) && details.dressCodePalette.length > 0 && <div className="lmv-palette" role="group" aria-label={t.palette}>{details.dressCodePalette.map((color, index) => <span key={`${color}-${index}`} className="lmv-swatch" style={{ "--lmv-swatch-color": color, "--lmv-swatch-angle": `${(index - (details.dressCodePalette.length - 1) / 2) * 10}deg`, "--lmv-swatch-index": index }} role="img" aria-label={`${t.color} ${index + 1}: ${color}`} />)}</div>}{details.dressCodeWomen && <div className="lmv-dress-person"><p className="lmv-kicker">{t.women}</p><p className="lmv-body">{details.dressCodeWomen}</p></div>}{details.dressCodeMen && <div className="lmv-dress-person"><p className="lmv-kicker">{t.men}</p><p className="lmv-body">{details.dressCodeMen}</p></div>}</div></LumiereReveal>}

    {(details.note || info.length > 0 || contacts.length > 0) && <LumiereReveal as="section" className="lmv-info-section"><div className="lmv-wrap"><Chapter index="05">{t.details}</Chapter><h2 className="lmv-heading">{config.infoTitle || t.details}</h2>{details.note && <p className="lmv-body">{details.note}</p>}{info.map((item, index) => <div className="lmv-info-row" key={index}><LumiereIcon name={item.icon || "heart"} size={30} /><div>{item.title && <h3>{item.title}</h3>}{item.text && <p className="lmv-body">{item.text}</p>}</div></div>)}{contacts.length > 0 && <div className="lmv-contact"><p className="lmv-kicker">{t.contact}</p><div className="lmv-contacts">{contacts.filter((contact) => contact.phone).map((contact, index) => <a className="lmv-contact-person" key={index} href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}>{contact.name}<span>{contact.phone}</span></a>)}</div></div>}</div></LumiereReveal>}

    <div id={rsvpId} tabIndex={-1} className="lmv-rsvp-anchor"><LumiereRSVP key={slug} slug={slug} eventType={type} brideName={brideName} groomName={groomName} details={details} script={script} language={language} /></div>
    <LumiereCountdown targetDate={details.dateISO} brideName={brideName} groomName={groomName} details={details} script={script} language={language} slug={slug} />
  </main>;
}
