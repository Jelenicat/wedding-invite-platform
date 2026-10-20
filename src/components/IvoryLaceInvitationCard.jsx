import { useLayoutEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import IvoryLaceCountdown, {
  IvoryLaceBackdrop, IvoryLaceMonogram, IvoryLaceNames, IvoryLaceReveal, IvoryLaceText,
} from "./IvoryLaceCountdown";
import IvoryLaceRSVP from "./IvoryLaceRSVP";
import "../styles/newintro.css";
import "../styles/newcard.css";
import "../styles/newrsvp.css";

const AGENDA_ICONS = {
  toast: "/icons/ivory-lace-agenda-toast.svg",
  rings: "/icons/ivory-lace-agenda-rings.svg",
  dinner: "/icons/ivory-lace-agenda-dinner.svg",
};

function agendaIcon(event, index) {
  if (AGENDA_ICONS[event.icon]) return AGENDA_ICONS[event.icon];
  const label = String(event.label || "").toLowerCase();
  if (/venčan|венчан|ceremon|trauung|crkv|цркв/.test(label)) return AGENDA_ICONS.rings;
  if (/večer|вечер|dinner|essen|ručak|ручак|obrok/.test(label)) return AGENDA_ICONS.dinner;
  return index === 0 ? AGENDA_ICONS.toast : index === 1 ? AGENDA_ICONS.rings : AGENDA_ICONS.dinner;
}

function LacePhoto({ src, alt, position = "50% 50%", frame = "/images/ivory-lace-couture-frame.png" }) {
  const reduced = useReducedMotion();
  if (!src) return null;
  return (
    <motion.div className="ivl-lace-photo"
      initial={reduced ? false : "hidden"} whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="ivl-photo-window">
        <motion.img className="ivl-photo" src={src} alt={alt} draggable="false"
          style={{ objectPosition: position }}
          variants={{
            hidden: { scale: 1.08, opacity: 0, clipPath: "inset(0 0 100% 0)" },
            visible: { scale: 1, opacity: 1, clipPath: "inset(0 0 0% 0)" },
          }}
          transition={{ duration: reduced ? 0 : 1.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="ivl-lace-border" aria-hidden="true" style={{ borderImageSource: `url("${frame}")` }} />
    </motion.div>
  );
}

export default function IvoryLaceInvitationCard({
  brideName = "Ana", groomName = "Nikola", weddingDate, venue, details = {},
  image, backgroundImage, slug, type = "wedding", script = "latin", language = "sr",
}) {
  const root = useRef(null);
  const reduced = useReducedMotion();
  const config = details.ivoryLace || {};
  const photo = config.photo || details.editorialImage1 || image || backgroundImage;
  const footerPhoto = config.footerPhoto || details.editorialImage2 || details.rsvpImage || photo;
  const locationBackground = config.showPhotoBackgrounds === false ? null : config.locationBackground || photo;
  const rsvpBackground = config.showPhotoBackgrounds === false ? null : config.rsvpBackground || "/images/ivory-lace-chiffon.png";
  const date = details.date || weddingDate;
  const events = (details.events || []).filter((event) => event.label || event.time);
  const mapLink = details.locationButtonLink || details.mapLink;
  const cyr = script === "cyrillic";
  const t = language === "en" ? {
    dear: "Dear family and friends", welcome: "We would love you to join us as we begin our next chapter together.",
    location: "Location", map: "View location", timeline: "Our day", program: "the programme",
    dress: "Dress", code: "code", details: "The little", matters: "details", gifts: "gifts", flowers: "flowers",
    withLove: "with love", photo: "A moment together", mapEvent: "Open location",
  } : language === "de" ? {
    dear: "Liebe Familie, liebe Freunde", welcome: "Wir laden euch herzlich ein, den Beginn unseres gemeinsamen Weges mit uns zu feiern.",
    location: "Location", map: "Ort ansehen", timeline: "Unser Tag", program: "der Ablauf",
    dress: "Dress", code: "code", details: "Kleine", matters: "Details", gifts: "Geschenke", flowers: "Blumen",
    withLove: "in Liebe", photo: "Ein gemeinsamer Moment", mapEvent: "Ort ansehen",
  } : cyr ? {
    dear: "Драга породицо и пријатељи", welcome: "Позивамо вас да будете део нашег дана и заједно са нама прославите почетак наше заједничке приче.",
    location: "Локација", map: "Погледај локацију", timeline: "Распоред", program: "нашег дана",
    dress: "Дрес", code: "код", details: "Мали", matters: "детаљи", gifts: "поклони", flowers: "цвеће",
    withLove: "с љубављу", photo: "Наш заједнички тренутак", mapEvent: "Погледај локацију",
  } : {
    dear: "Draga porodico i prijatelji", welcome: "Pozivamo vas da budete deo našeg dana i zajedno sa nama proslavite početak naše zajedničke priče.",
    location: "Lokacija", map: "Pogledaj lokaciju", timeline: "Raspored", program: "našeg dana",
    dress: "Dres", code: "kod", details: "Mali", matters: "detalji", gifts: "pokloni", flowers: "cveće",
    withLove: "s ljubavlju", photo: "Naš zajednički trenutak", mapEvent: "Pogledaj lokaciju",
  };

  useLayoutEffect(() => {
    const html = document.documentElement;
    const previous = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    html.style.scrollBehavior = previous;
    root.current?.focus({ preventScroll: true });
  }, [slug]);

  return (
    <article ref={root} tabIndex={-1} className={`ivl ivl-card ${cyr ? "ivl-cyrillic" : ""}`}>
      <header className="ivl-hero">
        <IvoryLaceReveal><IvoryLaceMonogram brideName={brideName} groomName={groomName} /></IvoryLaceReveal>
        <IvoryLaceNames brideName={brideName} groomName={groomName} />
        {date && <IvoryLaceText as="p" className="ivl-kicker ivl-hero-date">{date}</IvoryLaceText>}
        <LacePhoto src={photo} alt={`${brideName} & ${groomName}`} position={config.photoPosition} frame={config.laceFrame} />
        <IvoryLaceReveal className="ivl-welcome">
          <IvoryLaceText as="h2" className="ivl-kicker">{config.welcomeTitle || t.dear}</IvoryLaceText>
          <p className="ivl-copy">{details.welcomeText || t.welcome}</p>
          {config.numericDate && <p className="ivl-numeric-date">{config.numericDate}</p>}
          <img className="ivl-divider" src="/icons/ivory-lace-divider.svg" alt="" width="88" height="8" />
        </IvoryLaceReveal>
      </header>

      {(details.locationName || venue || details.venue) && (
        <section className={`ivl-location ivl-section ${locationBackground ? "ivl-photo-section" : ""}`} aria-labelledby="ivl-location-title">
          <IvoryLaceBackdrop src={locationBackground} position={config.locationBackgroundPosition || "50% 60%"} />
          <IvoryLaceReveal className="ivl-location-paper">
            <IvoryLaceText className="ivl-section-title" scriptText>{t.location}</IvoryLaceText>
            <h3 id="ivl-location-title" className="ivl-location-name">{details.locationName || details.venue || venue}</h3>
            {details.locationAddress && <p className="ivl-location-address">{details.locationAddress}</p>}
            {details.showLocationButton === true && mapLink && (
              <a className="ivl-button" href={mapLink} target="_blank" rel="noopener noreferrer">
                {details.locationButtonText || t.map}
                <img src="/icons/ivory-lace-pin.svg" alt="" width="17" height="21" />
              </a>
            )}
            {config.locationImageCaption && <p className="ivl-location-caption">{config.locationImageCaption}</p>}
          </IvoryLaceReveal>
        </section>
      )}

      {config.showCountdown !== false && details.dateISO && (
        <IvoryLaceCountdown targetDate={details.dateISO} brideName={brideName} groomName={groomName}
          details={details} script={script} language={language} />
      )}

      {events.length > 0 && (
        <section className="ivl-section ivl-program" aria-labelledby="ivl-program-title">
          <IvoryLaceText as="p" className="ivl-kicker ivl-section-kicker">{config.timelineTitle || t.timeline}</IvoryLaceText>
          <h2 id="ivl-program-title" className="ivl-heading-wrap">
            <IvoryLaceText as="span" className="ivl-section-title" scriptText>{config.timelineSubtitle || t.program}</IvoryLaceText>
          </h2>
          <ol className="ivl-timeline">
            {events.map((event, index) => (
              <motion.li className={`ivl-timeline-row ${index % 2 ? "ivl-event-reverse" : ""}`} key={`${event.time}-${index}`}
                initial={reduced ? false : { opacity: 0, x: index % 2 ? 18 : -18, y: 12 }} whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="ivl-event-illustration" aria-hidden="true">
                  <motion.img src={agendaIcon(event, index)} width="100" height="116" alt=""
                    initial={reduced ? false : { opacity: 0, rotate: index % 2 ? 7 : -7, scale: 0.9 }}
                    whileInView={{ opacity: 1, rotate: 0, scale: 1 }} viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: 0.12 }} />
                </div>
                <div className="ivl-timeline-copy">
                  <span className="ivl-timeline-time">{event.time}</span>
                  <h3>{event.label}</h3>
                  {event.location && <p>{event.location}</p>}
                  {(event.description || event.note) && <p className="ivl-event-note">{event.description || event.note}</p>}
                  {event.mapLink && <a className="ivl-event-map" href={event.mapLink} target="_blank" rel="noopener noreferrer">
                    {t.mapEvent}<img src="/icons/ivory-lace-arrow.svg" alt="" width="16" height="12" />
                  </a>}
                </div>
              </motion.li>
            ))}
          </ol>
        </section>
      )}

      {details.showDressCode === true && (
        <section className="ivl-section ivl-dress-section" aria-labelledby="ivl-dress-title">
          {config.showDressBackground !== false && <motion.img className="ivl-dress-background"
            src={config.dressBackground || "/images/ivory-lace-chiffon.png"} alt=""
            loading="lazy" decoding="async" draggable="false"
            initial={reduced ? false : { scale: 1.05 }} whileInView={{ scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }} />}
          <IvoryLaceReveal className="ivl-dress-frame">
            <div className="ivl-dress-content">
              <h2 id="ivl-dress-title" className="ivl-dress-heading">
                <IvoryLaceText as="span" className="ivl-section-title" scriptText>{details.dressCodeTitle || `${t.dress} ${t.code}`}</IvoryLaceText>
              </h2>
              {details.dressCodeNote && <p className="ivl-dress-note">{details.dressCodeNote}</p>}
              {(details.dressCodeWomen || details.dressCodeMen) && <div className="ivl-dress-description">
                {details.dressCodeWomen && <p>{details.dressCodeWomen}</p>}
                {details.dressCodeMen && <p>{details.dressCodeMen}</p>}
              </div>}
              {details.dressCodePalette?.length > 0 && (
                <ul className="ivl-palette" aria-label={details.dressCodeTitle || `${t.dress} ${t.code}`}>
                  {details.dressCodePalette.map((item, index) => {
                    const color = typeof item === "string" ? item : item.color;
                    const label = typeof item === "string" ? item : item.label || color;
                    return <li key={`${color}-${index}`} className="ivl-swatch" aria-label={label}>
                      <span className="ivl-swatch-dot" style={{ backgroundColor: color }} />
                      {typeof item !== "string" && item.label && <span className="ivl-swatch-label">{item.label}</span>}
                    </li>;
                  })}
                </ul>
              )}
            </div>
          </IvoryLaceReveal>
        </section>
      )}

      {config.showRSVP !== false && <IvoryLaceRSVP slug={slug} eventType={type} brideName={brideName}
        groomName={groomName} details={details} script={script} language={language} backgroundImage={rsvpBackground} />}

      {(config.giftsText || config.flowersText) && (
        <section className="ivl-section ivl-details">
          <IvoryLaceText as="p" className="ivl-kicker ivl-section-kicker">{config.detailsTitle || t.details}</IvoryLaceText>
          <IvoryLaceText className="ivl-details-heading">{config.detailsSubtitle || t.matters}</IvoryLaceText>
          {config.giftsText && <IvoryLaceReveal className="ivl-detail-item">
            <IvoryLaceText as="h3" className="ivl-detail-title">{config.giftsTitle || t.gifts}</IvoryLaceText>
            <p className="ivl-copy">{config.giftsText}</p>
          </IvoryLaceReveal>}
          {config.flowersText && <IvoryLaceReveal className="ivl-detail-item">
            <IvoryLaceText as="h3" className="ivl-detail-title">{config.flowersTitle || t.flowers}</IvoryLaceText>
            <p className="ivl-copy">{config.flowersText}</p>
          </IvoryLaceReveal>}
        </section>
      )}

      <footer className="ivl-footer">
        <IvoryLaceText as="p" className="ivl-footer-script" scriptText>{config.closingTitle || t.withLove}</IvoryLaceText>
        {footerPhoto && <IvoryLaceReveal className="ivl-footer-photo-wrap">
          <img className="ivl-footer-photo" src={footerPhoto} alt={`${t.photo}: ${brideName} & ${groomName}`}
            loading="lazy" decoding="async" draggable="false" style={{ objectPosition: config.footerPhotoPosition || "50% 50%" }} />
        </IvoryLaceReveal>}
        <IvoryLaceText as="p" className="ivl-kicker ivl-footer-signature">{`${brideName} & ${groomName}`}</IvoryLaceText>
      </footer>
    </article>
  );
}
