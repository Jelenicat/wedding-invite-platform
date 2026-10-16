import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import BirthdaySatinRSVP from "./BirthdaySatinRSVP";
import BirthdaySatinCountdown from "./BirthdaySatinCountdown";
import { satinData, SatinArrow, SatinIcon, SatinLetters, SatinReveal, SatinScript } from "./BirthdaySatinIntro";
import "../styles/newcard.css";

function calendarText(value) {
  return String(value || "").replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function saveCalendar({ date, name, age, details, satin, t, venue, slug }) {
  if (!date) return;
  const rawHours = Number(details.calendarDurationHours);
  const hours = Number.isFinite(rawHours) && rawHours > 0 ? rawHours : 6;
  const end = new Date(date.getTime() + hours * 3600000);
  const utc = (value) => value.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const text = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Digitalna pozivnica//Birthday Satin//SR", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
    `UID:${calendarText(slug || "birthday")}-${date.getTime()}@digitalnapozivnica`,
    `DTSTAMP:${utc(new Date())}`, `DTSTART:${utc(date)}`, `DTEND:${utc(end)}`,
    `SUMMARY:${calendarText(t(`${name} – ${age}. rođendan`, `${name} – ${age}. рођендан`))}`,
    `LOCATION:${calendarText([details.locationName || venue, details.locationAddress].filter(Boolean).join(", "))}`,
    `DESCRIPTION:${calendarText(satin.calendarText || details.welcomeText || "")}`,
    "END:VEVENT", "END:VCALENDAR", ""].join("\r\n");
  // RFC 5545: dugačke linije se prelamaju na najviše 75 UTF-8 bajtova.
  const encoder = new TextEncoder();
  const folded = text.split("\r\n").map((line) => {
    let out = "", bytes = 0;
    for (const char of line) {
      const length = encoder.encode(char).length;
      if (bytes + length > 75) { out += "\r\n "; bytes = 1; }
      out += char; bytes += length;
    }
    return out;
  }).join("\r\n");
  const url = URL.createObjectURL(new Blob([folded], { type: "text/calendar;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url; anchor.download = `${slug || "rodjendan"}.ics`;
  document.body.appendChild(anchor); anchor.click(); anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export default function BirthdaySatinInvitationCard(props) {
  const data = satinData(props);
  const { name, age, details, satin, cyrillic, nameScale, dayMonth, year, date, time, t } = data;
  const reduced = useReducedMotion();
  const root = useRef(null);
  const heading = useRef(null);
  const location = details.locationName || props.venue || "";
  const address = details.locationAddress || "";
  const rawMapLink = details.locationButtonLink || details.mapLink;
  const mapLink = rawMapLink && /^https?:\/\//i.test(rawMapLink) ? rawMapLink : location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([location, address].filter(Boolean).join(", "))}` : "";
  const showDressCode = details.showDressCode === true;
  const events = Array.isArray(details.events) ? details.events : [];
  const palette = Array.isArray(details.dressCodePalette) && details.dressCodePalette.length ? details.dressCodePalette : ["#f4f4f1", "#171717"];

  useEffect(() => {
    // Novi sadržaj počinje od vrha, bez nasleđivanja skrola sa introa.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    heading.current?.focus({ preventScroll: true });
  }, [props.slug]);

  return <main ref={root} className="bsa bsa-card" data-script={cyrillic ? "cyrillic" : "latin"} style={{ "--bsa-name-scale": nameScale }}>
    <section className="bsa-welcome bsa-section" aria-labelledby={`bsa-welcome-${props.slug || "event"}`}>
      <SatinReveal><SatinIcon /><p className="bsa-kicker">{t("SLAVIMO ŽIVOT I LEPE TRENUTKE", "СЛАВИМО ЖИВОТ И ЛЕПЕ ТРЕНУТКЕ")}</p></SatinReveal>
      <h1 ref={heading} tabIndex={-1} id={`bsa-welcome-${props.slug || "event"}`} className="bsa-title bsa-welcome-title">
        <SatinLetters>{satin.welcomeTitle || t("Dragi gosti!", "Драги гости!")}</SatinLetters>
      </h1>
      <SatinReveal delay={0.08}>
        <p className="bsa-copy">{details.welcomeText || t(`Sa velikom radošću vas pozivam da zajedno proslavimo moj ${age}. rođendan. Čekaju nas osmesi, muzika i trenuci koje ćemo dugo pamtiti.`, `Са великом радошћу вас позивам да заједно прославимо мој ${age}. рођендан. Чекају нас осмеси, музика и тренуци које ћемо дуго памтити.`)}</p>
        <p className="bsa-welcome-note">{satin.welcomeEnding || t("Radujem se da vas vidim", "Радујем се да вас видим")}</p>
      </SatinReveal>
      <SatinLetters as="p" className="bsa-special-date">{dayMonth}</SatinLetters>
      {year && <SatinReveal><p className="bsa-year">{year}.</p></SatinReveal>}
      <SatinReveal className="bsa-coupes-wrap"><SatinIcon name="coupes" className="bsa-coupes" /></SatinReveal>
      {details.showCalendarButton === true && date && <SatinReveal><button type="button" className="bsa-calendar-link" onClick={() => saveCalendar({ ...data, venue: props.venue, slug: props.slug })}>
        <SatinIcon name="calendar" /><span>{t("Sačuvaj datum", "Сачувај датум")}</span>
      </button></SatinReveal>}
    </section>

    <section className="bsa-location bsa-section" aria-labelledby={`bsa-location-${props.slug || "event"}`}>
      <SatinLetters as="h2" id={`bsa-location-${props.slug || "event"}`} className="bsa-title">{satin.locationTitle || t("Mesto proslave", "Место прославе")}</SatinLetters>
      <SatinReveal delay={0.05}>
        {location && <p className="bsa-location-name">{location}</p>}
        {address && <p className="bsa-location-address">{address}</p>}
        {mapLink && details.showLocationButton !== false && <a className="bsa-button bsa-button-light bsa-map-link" href={mapLink} target="_blank" rel="noopener noreferrer">
          <span>{details.locationButtonText || t("Pogledaj na mapi", "Погледај на мапи")}</span><SatinArrow />
        </a>}
      </SatinReveal>
      <motion.div className="bsa-vertical-line" aria-hidden="true" initial={reduced ? false : { scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: reduced ? 0 : 0.8 }} />
      <SatinReveal><p className="bsa-gathering-title">{satin.gatheringTitle || t("Okupljanje gostiju", "Окупљање гостију")}</p><p className="bsa-gathering-time">{time}</p></SatinReveal>
      {events.length > 0 && <div className="bsa-schedule">{events.map((event, index) => <SatinReveal key={`${event.label}-${index}`} className="bsa-schedule-item" delay={Math.min(index * 0.05, 0.2)}>
        <p className="bsa-event-time">{event.time}</p><div><p>{event.label}</p>{event.location && <small>{event.location}</small>}</div>
      </SatinReveal>)}</div>}
    </section>

    {showDressCode && <section className="bsa-dresscode bsa-section" aria-labelledby={`bsa-dress-${props.slug || "event"}`}>
      <SatinReveal><SatinIcon /></SatinReveal>
      <SatinLetters as="h2" id={`bsa-dress-${props.slug || "event"}`} className="bsa-title">{details.dressCodeTitle || "Dress code"}</SatinLetters>
      <SatinReveal><p className="bsa-copy">{details.dressCodeNote || t("Biće mi posebno drago ako svojim odevnim kombinacijama u crnoj ili beloj boji ulepšate atmosferu naše večeri.", "Биће ми посебно драго ако својим одевним комбинацијама у црној или белој боји улепшате атмосферу наше вечери.")}</p></SatinReveal>
      <div className="bsa-swatches" aria-label={t("Boje za odevanje", "Боје за одевање")}>{palette.map((color, index) => <SatinReveal key={`${color}-${index}`} delay={index * 0.12}>
        <span className="bsa-swatch" style={{ backgroundColor: color }} role="img" aria-label={t(`Boja ${color}`, `Боја ${color}`)}>
          {index < 2 && <img src={`/icons/bsa-satin-${index === 0 ? "light" : "dark"}.svg`} alt="" width="76" height="76" loading="lazy" />}
        </span>
      </SatinReveal>)}</div>
    </section>}

    <BirthdaySatinRSVP {...props} eventType="birthday" />
    <BirthdaySatinCountdown {...props} />
    <footer className="bsa-footer"><SatinReveal><SatinIcon /><p>{satin.footerText || t("Jedva čekam da slavimo zajedno!", "Једва чекам да славимо заједно!")}</p><SatinScript>{name}</SatinScript><span className="bsa-footer-date">{dayMonth}{year ? ` ${year}.` : ""}</span></SatinReveal></footer>
  </main>;
}
