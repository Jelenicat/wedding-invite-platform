import { useEffect, useRef } from "react";
import DentelleCountdown from "./DentelleCountdown";
import DentelleRSVP from "./DentelleRSVP";
import {
  DENTELLE_ASSETS, DentelleHeroContent, DentelleIcon, DentelleFlourish, DentelleLace, DentelleReveal,
  dentelleDate, dentelleSafeLink, dentelleText,
} from "./DentelleIntro";
import "../styles/newcard.css";

function calendarEscape(value = "") {
  return String(value).replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}
function calendarUTC(date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}
// RFC 5545: duge linije prelamamo na najviše 75 UTF-8 bajtova.
function calendarFold(line) {
  const encoder = new TextEncoder();
  let result = "", current = "", length = 0;
  for (const character of line) {
    const bytes = encoder.encode(character).length;
    if (length + bytes > 75) {
      result += current + "\r\n";
      current = " ";
      length = 1;
    }
    current += character;
    length += bytes;
  }
  return result + current;
}

export function dentelleCalendar({ dateISO, brideName, groomName, venue, slug, durationHours = 8 }) {
  const start = dentelleDate(dateISO);
  if (!start) return null;
  const duration = Number.isFinite(Number(durationHours)) && Number(durationHours) > 0 ? Number(durationHours) : 8;
  const end = new Date(start.getTime() + duration * 3600000);
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Digitalne Pozivnice//Dentelle//SR",
    "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "BEGIN:VEVENT",
    "UID:" + calendarEscape(slug || "dentelle") + "-" + start.getTime() + "@digitalna-pozivnica",
    "DTSTAMP:" + calendarUTC(new Date()),
    "DTSTART:" + calendarUTC(start), "DTEND:" + calendarUTC(end),
    "SUMMARY:" + calendarEscape(brideName + " & " + groomName + " — venčanje"),
    "LOCATION:" + calendarEscape(venue),
    "DESCRIPTION:" + calendarEscape("Radujemo se što ćete biti deo našeg dana."),
    "END:VEVENT", "END:VCALENDAR",
  ];
  return lines.map(calendarFold).join("\r\n") + "\r\n";
}

export default function DentelleInvitationCard({
  brideName = "", groomName = "", weddingDate = "", weddingTime = "", venue = "",
  details = {}, slug = "", type = "wedding", script = "latin",
}) {
  const t = dentelleText(script);
  const config = details.dentelle || {};
  const mainRef = useRef(null);
  const names = brideName + " & " + groomName;
  const events = Array.isArray(details.events) ? details.events : [];
  const venueName = details.locationName || venue;
  const mapLink = dentelleSafeLink(details.locationButtonLink || details.mapLink) ||
    (venue ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(venue) : "");
  const rsvpId = "dentelle-rsvp-" + slug.replace(/[^a-zA-Z0-9_-]/g, "");
  const canSaveDate = details.showCalendarButton && Boolean(dentelleDate(details.dateISO));
  const frame = config.frameImage || DENTELLE_ASSETS.frame;
  const illustration = config.venueImage || DENTELLE_ASSETS.venue;

  useEffect(() => {
    // Ova komponenta se montira tek kada WeddingPage završi otvaranje koverte.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    mainRef.current?.focus({ preventScroll: true });
  }, [slug]);

  const saveDate = () => {
    const content = dentelleCalendar({
      dateISO: details.dateISO, brideName, groomName, venue, slug,
      durationHours: details.calendarDurationHours,
    });
    if (!content) return;
    const url = URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = (slug || "vencanje") + ".ics";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  return <main className="dnt dnt-card" data-script={script} ref={mainRef} tabIndex={-1} aria-label={t.invitation}>
    <section className="dnt-hero" aria-label={names}>
      <div className="dnt-hero-paper">
        <img className="dnt-hero-frame" src={frame} alt="" fetchPriority="high" decoding="async" />
        <DentelleHeroContent brideName={brideName} groomName={groomName} weddingDate={weddingDate} venue={venue} details={details} script={script} rsvpId={rsvpId} />
      </div>
    </section>

    <section className="dnt-welcome">
      <DentelleLace src={config.edgeImage} className="dnt-lace-top" />
      <DentelleReveal className="dnt-welcome-inner">
        <DentelleIcon name="swans" size={58} />
        <p className="dnt-kicker">{config.welcomeKicker || t.forYou}</p>
        <h2 className="dnt-heading">{config.welcomeTitle || t.welcomeTitle}</h2>
        <p className="dnt-body">{details.welcomeText || t.welcomeBody}</p>
        <DentelleFlourish />
      </DentelleReveal>
    </section>

    <DentelleCountdown details={details} script={script} />

    <section className="dnt-location">
      <DentelleReveal className="dnt-section-inner">
        <p className="dnt-kicker">{config.locationKicker || t.locationKicker}</p>
        <h2 className="dnt-heading">{config.locationTitle || t.location}</h2>
        <div className="dnt-venue-portrait">
          <span className="dnt-pearl dnt-pearl-one" aria-hidden="true" />
          <span className="dnt-pearl dnt-pearl-two" aria-hidden="true" />
          <span className="dnt-pearl dnt-pearl-three" aria-hidden="true" />
          <DentelleFlourish className="dnt-venue-flourish" />
          <img src={illustration} alt={config.venueAlt || t.venueAlt} loading="lazy" decoding="async" />
          <DentelleFlourish className="dnt-venue-flourish dnt-flourish-bottom" />
        </div>
        <h3 className="dnt-location-name">{venueName}</h3>
        {details.locationAddress && <p className="dnt-kicker">{details.locationAddress}</p>}
        {config.venueText && <p className="dnt-body">{config.venueText}</p>}
        {weddingTime && <p className="dnt-location-time"><span className="dnt-time-line" />{weddingTime}<span className="dnt-time-line" /></p>}
        <div className="dnt-location-actions">
          {mapLink && details.showLocationButton !== false && <a className="dnt-button" href={mapLink} target="_blank" rel="noopener noreferrer">
            <DentelleIcon name="location" size={17} />{details.locationButtonText || t.directions}
          </a>}
          {canSaveDate && <button type="button" className="dnt-text-button" onClick={saveDate}>
            <DentelleIcon name="calendar" size={17} />{t.calendar}
          </button>}
        </div>
      </DentelleReveal>
    </section>

    {events.length > 0 && <section className="dnt-day">
      <DentelleLace src={config.edgeImage} className="dnt-lace-top" />
      <DentelleReveal className="dnt-section-inner">
        <p className="dnt-kicker">{config.scheduleKicker || t.scheduleKicker}</p>
        <h2 className="dnt-heading">{config.scheduleTitle || t.day}</h2>
        <p className="dnt-body dnt-day-note">{config.scheduleNote || t.dayNote}</p>
        <ol className="dnt-timeline">
          {events.map((event, index) => {
            const link = dentelleSafeLink(event.mapLink);
            return <li className="dnt-timeline-item" key={String(index) + event.time}>
              <div className="dnt-timeline-art"><DentelleIcon name={event.icon || (index === 0 ? "gathering" : "rings")} size={42} /></div>
              <time className="dnt-timeline-time">{event.time}</time>
              <div className="dnt-timeline-copy">
                <span className="dnt-timeline-pearl" aria-hidden="true" />
                <h3>{event.label || event.title}</h3>
                {(event.location || event.place) && <p className="dnt-timeline-place">{event.location || event.place}</p>}
                {(event.description || event.note) && <p className="dnt-body">{event.description || event.note}</p>}
                {link && <a className="dnt-timeline-map" href={link} target="_blank" rel="noopener noreferrer">{t.directions}</a>}
              </div>
            </li>;
          })}
        </ol>
        <DentelleIcon name="tablescape" className="dnt-day-illustration" />
      </DentelleReveal>
    </section>}

    {details.showDressCode && <section className="dnt-dress">
      <DentelleReveal className="dnt-dress-paper">
        <img className="dnt-dress-frame" src={frame} alt="" loading="lazy" decoding="async" />
        <div className="dnt-dress-content">
          <p className="dnt-kicker">{t.dress}</p>
          <h2 className="dnt-heading">{details.dressCodeTitle || t.dressTitle}</h2>
          <DentelleIcon name="dress" size={102} />
          <p className="dnt-body">{details.dressCodeNote || t.dressNote}</p>
          {details.dressCodeWomen && <p className="dnt-body dnt-dress-extra">{details.dressCodeWomen}</p>}
          {details.dressCodeMen && <p className="dnt-body dnt-dress-extra">{details.dressCodeMen}</p>}
          {Array.isArray(details.dressCodePalette) && details.dressCodePalette.length > 0 && <div className="dnt-palette" aria-label={t.dress}>
            {details.dressCodePalette.map((color, index) => <svg key={String(index) + color} width="28" height="28" viewBox="0 0 30 30" aria-hidden="true">
              <use href="/icons/dentelle-swatch.svg#dnt-swatch" fill={color} />
            </svg>)}
          </div>}
          <DentelleFlourish />
        </div>
      </DentelleReveal>
    </section>}

    {config.showGift !== false && <section className="dnt-gift">
      <DentelleLace src={config.edgeImage} className="dnt-lace-top" />
      <DentelleReveal className="dnt-section-inner">
        <DentelleIcon name="heart" size={55} />
        <p className="dnt-kicker">{config.giftTitle || t.gift}</p>
        <h2 className="dnt-gift-title">{config.giftText || t.giftText}</h2>
        <p className="dnt-body">{config.giftNote || t.giftNote}</p>
        {Array.isArray(config.giftDetails) && config.giftDetails.map((line, index) => <p className="dnt-body dnt-gift-detail" key={index}>{line}</p>)}
      </DentelleReveal>
    </section>}

    <div id={rsvpId} className="dnt-rsvp-anchor">
      <DentelleRSVP key={slug} slug={slug} eventType={type} brideName={brideName} groomName={groomName} details={details} script={script} />
    </div>

    <footer className="dnt-closing">
      <div className="dnt-closing-paper">
        <img className="dnt-closing-frame" src={frame} alt="" loading="lazy" decoding="async" />
        <DentelleReveal className="dnt-closing-inner">
          <DentelleIcon name="rings" size={60} />
          <p className="dnt-closing-text">{config.closingText || t.closing}</p>
          <p className="dnt-kicker">{t.withLove}</p>
          <p className="dnt-closing-names">{brideName}<span>&amp;</span>{groomName}</p>
          <p className="dnt-date">{weddingDate}</p>
          <DentelleFlourish />
        </DentelleReveal>
      </div>
    </footer>
  </main>;
}
