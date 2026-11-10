import { Fragment, useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import KeepsakeRSVP from "./KeepsakeRSVP";
import KeepsakeCountdown, { keepsakeCopy, keepsakeDate, KeepsakeHeart, KeepsakeReveal, useKeepsakeFonts } from "./KeepsakeCountdown";
import "../styles/newcard.css";

const ICONS = {
  gathering: "glasses", guests: "glasses", groom: "glasses", church: "church", civil: "rings",
  ceremony: "rings", rings: "rings", dinner: "dinner", restaurant: "dinner", vecera: "dinner",
  party: "party", cake: "cake", angel: "rings", dresscode: "bow",
};

function Heading({ title, scriptText }) {
  return <div className="keepsake-card-heading"><h2>{title}</h2>{scriptText && <span>{scriptText}</span>}</div>;
}

function DateStrip({ date, locale, reduced }) {
  if (!date) return null;
  const days = [-1, 0, 1].map((offset) => {
    const value = new Date(date.value);
    value.setUTCDate(value.getUTCDate() + offset);
    return { offset, value, day: value.getUTCDate(),
      weekday: value.toLocaleDateString(locale, { weekday: "long", timeZone: "UTC" }),
      month: value.toLocaleDateString(locale, { month: "short", timeZone: "UTC" }).replace(/\.$/, "") };
  });
  return <div className="keepsake-card-date-strip">
    {days.map((day) => <div className={`keepsake-card-day${day.offset === 0 ? " keepsake-card-day--chosen" : ""}`} key={day.offset}>
      <span className="keepsake-card-weekday">{day.weekday}</span><span className="keepsake-card-month">{day.month}</span>
      <span className="keepsake-card-day-number">{day.day}</span>
      {day.offset === 0 && <svg className="keepsake-card-date-circle" viewBox="0 0 180 125" fill="none" aria-hidden="true">
        <motion.path d="M146 21C108-2 34 1 13 39-12 84 43 124 106 116 161 110 187 78 166 45 148 17 95 5 57 19 22 31 11 60 30 88"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" initial={reduced ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: reduced ? 0 : 1.1, delay: reduced ? 0 : 0.15 }} />
      </svg>}
    </div>)}
  </div>;
}

function HeartPhoto({ src, alt }) {
  const id = `keepsake-heart-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  if (!src) return null;
  return <svg className="keepsake-card-venue-photo" viewBox="0 0 260 270" role="img" aria-label={alt}>
    <defs><clipPath id={id}><path d="M130 254C103 231 5 158 7 90 9 26 80 10 130 74 179 9 251 27 253 90 256 155 157 232 130 254Z" /></clipPath></defs>
    <image href={src} x="0" y="0" width="260" height="270" preserveAspectRatio="xMidYMid slice" clipPath={`url(#${id})`} />
  </svg>;
}

function Palette({ colors, label }) {
  if (!Array.isArray(colors) || !colors.length) return null;
  return <div className="keepsake-card-palette" role="group" aria-label={label}>
    {colors.map((color, index) => <span key={`${color}-${index}`} style={{ backgroundColor: color }} role="img" aria-label={color} />)}
  </div>;
}

export default function KeepsakeInvitationCard({ brideName, groomName, childName, weddingDate, weddingTime, venue, details = {},
  slug, type, script = "latin", language = "sr" }) {
  useKeepsakeFonts();
  const reduced = useReducedMotion();
  const config = details.keepsake || {};
  const t = keepsakeCopy(script, language, config.copy);
  const date = keepsakeDate(details.dateISO);
  const names = [brideName, groomName].filter(Boolean);
  const displayDate = details.date || weddingDate || date?.numeric;
  const events = Array.isArray(details.events) ? details.events.filter((item) => item && (item.label || item.time)) : [];
  const location = details.locationName || details.venue || venue;
  const mapLink = details.locationButtonLink || details.mapLink || (location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([location, details.locationAddress].filter(Boolean).join(", "))}` : "");
  const showMap = Boolean(mapLink) && (details.showLocationButton === true || (details.showLocationButton == null && Boolean(details.mapLink)));
  const showDressCode = details.showDressCode === true && Boolean(details.dressCodeTitle || details.dressCodeNote || details.dressCodeWomen || details.dressCodeMen ||
    details.dressCodePalette?.length || details.dressCodeWomenPalette?.length || details.dressCodeMenPalette?.length);
  const wishes = Array.isArray(config.wishes) ? config.wishes : [];
  const hasWishes = wishes.length > 0 || details.note || config.petImage || config.petNote;
  return <main className="keepsake-card" data-script={script}>
    <section className="keepsake-card-welcome">
      <KeepsakeReveal>
        <h1 className="keepsake-card-dear">{config.welcomeTitle || t.dear}</h1>
        {details.welcomeText && <p className="keepsake-card-welcome-text">{details.welcomeText}</p>}
        <p className={`keepsake-card-couple${names.join(" ").length > 15 ? " keepsake-card-couple--stacked" : ""}`}>{names.length ? names.map((name, index) => <Fragment key={`${name}-${index}`}>
          {index > 0 && <KeepsakeHeart className="keepsake-card-name-heart" />}<span>{name}</span>
        </Fragment>) : childName}</p>
      </KeepsakeReveal>
      <KeepsakeReveal delay={0.05}>
        <DateStrip date={date} locale={t.locale} reduced={reduced} />
        {(displayDate || weddingTime) && <p className="keepsake-card-date-caption">{displayDate}{weddingTime && <span>{weddingTime}</span>}</p>}
      </KeepsakeReveal>
    </section>

    {(location || config.venueImage) && <section className="keepsake-card-venue">
      <KeepsakeReveal className="keepsake-card-venue-layout">
        <div className="keepsake-card-venue-copy">
          <Heading title={config.venueTitle || t.place} />
          {location && <p className="keepsake-card-venue-name">{location}</p>}
          {details.locationAddress && <p className="keepsake-card-address">{details.locationAddress}</p>}
          {showMap && <a className="keepsake-card-map" href={mapLink} target="_blank" rel="noopener noreferrer">{details.locationButtonText || t.map}
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
          </a>}
        </div>
        <div className="keepsake-card-venue-image"><HeartPhoto src={config.venueImage} alt={config.venueImageAlt || location || ""} /></div>
      </KeepsakeReveal>
      <p className="keepsake-card-margin-note" aria-hidden="true">{config.venueScribble || t.littleNote}</p>
    </section>}

    {details.dateISO && <KeepsakeCountdown targetDate={details.dateISO} brideName={brideName} groomName={groomName} details={details}
      venue={venue} script={script} language={language} embedded />}

    {events.length > 0 && <section className="keepsake-card-schedule">
      <KeepsakeReveal><Heading title={config.planTitle || t.plan} scriptText={config.planScript || t.planScript} /></KeepsakeReveal>
      <ol className="keepsake-card-events">
        {events.map((event, index) => <motion.li className="keepsake-card-event" key={`${event.time}-${event.label}-${index}`}
          initial={reduced ? false : { opacity: 0, y: 22, rotate: index % 2 ? 2 : -2 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : (index % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}>
          <img className="keepsake-card-event-icon" src={event.icon?.startsWith("/") ? event.icon : `/icons/keepsake-${ICONS[event.icon] || "glasses"}.svg`}
            alt="" width="120" height="120" loading="lazy" decoding="async" />
          {event.label && <h3>{event.label}</h3>}
          {event.time && <p className="keepsake-card-event-time">{event.time}</p>}
          {event.location && (event.showLocationButton === false ? <p className="keepsake-card-event-location">{event.location}</p> :
            <a className="keepsake-card-event-location" href={event.mapLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
              target="_blank" rel="noopener noreferrer">{event.location}</a>)}
          {(event.note || event.description) && <p className="keepsake-card-event-note">{event.note || event.description}</p>}
        </motion.li>)}
      </ol>
    </section>}

    {showDressCode && <section className="keepsake-card-dress">
      <svg className="keepsake-card-wave keepsake-card-wave--top" viewBox="0 0 600 48" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 23C90-15 155 51 260 29S458-5 600 21V48H0Z" fill="currentColor" />
      </svg>
      <KeepsakeReveal>
        <Heading title={details.dressCodeTitle || t.dressCode} scriptText={t.dressScript} />
        {details.dressCodeNote && <p className="keepsake-card-dress-note">{details.dressCodeNote}</p>}
      </KeepsakeReveal>
      <KeepsakeReveal className="keepsake-card-dress-details">
        {details.dressCodeWomen && <p className="keepsake-card-dress-role"><strong>{t.women}</strong>{details.dressCodeWomen}</p>}
        <Palette colors={details.dressCodeWomenPalette?.length ? details.dressCodeWomenPalette : details.dressCodePalette} label={`${t.palette} — ${t.women}`} />
        {details.dressCodeMen && <p className="keepsake-card-dress-role"><strong>{t.men}</strong>{details.dressCodeMen}</p>}
        <Palette colors={details.dressCodeMenPalette} label={`${t.palette} — ${t.men}`} />
      </KeepsakeReveal>
      <svg className="keepsake-card-wave keepsake-card-wave--bottom" viewBox="0 0 600 48" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 0H600V22C489 62 404-12 304 14S110 60 0 25Z" fill="currentColor" />
      </svg>
    </section>}

    {hasWishes && <section className="keepsake-card-wishes">
      <KeepsakeReveal><Heading title={config.wishesTitle || t.wishes} scriptText={t.wishesScript} /></KeepsakeReveal>
      {wishes.map((wish, index) => <KeepsakeReveal className="keepsake-card-wish" key={`${wish.title || "wish"}-${index}`}>
        {wish.title && <h3>{wish.title}</h3>}{wish.text && <p>{wish.text}</p>}
      </KeepsakeReveal>)}
      {details.note && <KeepsakeReveal className="keepsake-card-note"><p>{details.note}</p></KeepsakeReveal>}
      {(config.petImage || config.petNote) && <KeepsakeReveal className="keepsake-card-pet">
        <img className="keepsake-card-sparks" src="/icons/keepsake-sparkles.svg" alt="" width="48" height="48" loading="lazy" />
        {config.petNote && <p>{config.petNote}</p>}
        {config.petImage && <img className="keepsake-card-pet-photo" src={config.petImage} alt={config.petName || ""} width="310" height="313" loading="lazy" decoding="async" />}
        {config.petName && <span className="keepsake-card-pet-name">{config.petName}</span>}
      </KeepsakeReveal>}
      <KeepsakeReveal className="keepsake-card-stamps">
        {["bow", "glasses", "party"].map((icon) => <div className="keepsake-card-stamp" key={icon}>
          <img src="/icons/keepsake-stamp.svg" alt="" className="keepsake-card-stamp-border" width="100" height="78" loading="lazy" />
          <img src={`/icons/keepsake-${icon}-orange.svg`} alt="" className="keepsake-card-stamp-icon" width="60" height="60" loading="lazy" />
        </div>)}
      </KeepsakeReveal>
    </section>}

    {details.showRSVP !== false && config.showRSVP !== false && <KeepsakeRSVP slug={slug} eventType={type} brideName={brideName} groomName={groomName}
      details={details} script={script} language={language} />}
    <footer className="keepsake-card-footer"><KeepsakeReveal>
      <KeepsakeHeart className="keepsake-card-footer-heart" /><p>{config.closingText || t.forever}</p>
      <span>{names.length ? names.join(" & ") : childName}</span>
    </KeepsakeReveal></footer>
  </main>;
}
