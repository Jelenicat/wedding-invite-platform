import { useEffect, useId, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cherryCalendar, cherryData, CherryArrow, CherryCalendarButton, CherryDoodle, CherryLetters, CherryPhoto, CherryReveal, CherryScript } from "./BirthdayCherryIntro";
import BirthdayCherryRSVP from "./BirthdayCherryRSVP";
import BirthdayCherryCountdown from "./BirthdayCherryCountdown";
import "../styles/newcard.css";

export default function BirthdayCherryInvitationCard(props) {
  const { slug, details = {}, showCalendarButton } = props;
  const data = cherryData(props), c = data.cyrillic;
  const calendar = cherryCalendar(data.dateISO, c);
  const reduced = useReducedMotion(), root = useRef(null);
  const uid = useId();
  const days = c ? ["Пон", "Уто", "Сре", "Чет", "Пет", "Суб", "Нед"] : ["Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"];
  const map = details.mapLink || details.locationButtonLink || (data.venue ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${data.venue} ${data.address}`.trim())}` : "");
  const events = Array.isArray(details.events) ? details.events : [];
  const canSaveDate = showCalendarButton ?? data.cherry.showCalendarButton ?? details.showCalendarButton ?? details.birthdayGalleryCountdown?.showCalendarButton ?? true;
  useEffect(() => {
    const frame = requestAnimationFrame(() => { window.scrollTo({ top: 0, behavior: "instant" }); root.current?.focus({ preventScroll: true }); });
    return () => cancelAnimationFrame(frame);
  }, [slug]);

  return <article ref={root} className="bch bch-card" tabIndex={-1} lang={c ? "sr-Cyrl" : "sr-Latn"} data-script={c ? "cyrillic" : "latin"} style={{ "--bch-name-scale": data.nameScale }}>
    <section className="bch-welcome bch-section" aria-labelledby={`${uid}-welcome`}>
      <CherryReveal className="bch-welcome-topline"><span>{data.name}</span><CherryDoodle type="cherries" /><span>{data.age}. {c ? "РОЂЕНДАН" : "ROĐENDAN"}</span></CherryReveal>
      <div className="bch-letter-paper">
        <CherryReveal className="bch-center">
          <p className="bch-kicker">{c ? "НАЈЛЕПШЕ ЈЕ КАД СМО ЗАЈЕДНО" : "NAJLEPŠE JE KAD SMO ZAJEDNO"}</p>
          <h1 id={`${uid}-welcome`} className="bch-heading"><CherryLetters text={c ? "Прославимо" : "Proslavimo"} /><CherryScript delay={0.15}>{c ? "заједно." : "zajedno."}</CherryScript></h1>
        </CherryReveal>
        <CherryReveal><p className="bch-welcome-text">{details.welcomeText || (c ? `Позивам те да заједно прославимо мој ${data.age}. рођендан. Уз омиљену музику, много смеха и све нас на једном месту.` : `Pozivam te da zajedno proslavimo moj ${data.age}. rođendan. Uz omiljenu muziku, mnogo smeha i sve nas na jednom mestu.`)}</p></CherryReveal>
        {details.closingText && <CherryReveal><p className="bch-welcome-note">{details.closingText}</p></CherryReveal>}
        <CherryReveal className="bch-signature"><CherryScript>{data.name}</CherryScript><CherryDoodle type="heart" /></CherryReveal>
      </div>
      <CherryReveal className="bch-party-strip"><span>{c ? "МУЗИКА" : "MUZIKA"}</span><CherryDoodle type="star" /><span>{c ? "ОСМЕСИ" : "OSMESI"}</span><CherryDoodle type="star" /><span>{c ? "УСПОМЕНЕ" : "USPOMENE"}</span></CherryReveal>
    </section>

    <section className="bch-date-section bch-section" aria-labelledby={`${uid}-date`}>
      <CherryReveal className="bch-section-heading"><p className="bch-kicker">01 / {c ? "КАДА И ГДЕ" : "KADA I GDE"}</p><h2 id={`${uid}-date`} className="bch-heading"><CherryLetters text={c ? "Један посебан" : "Jedan poseban"} /><CherryScript>{c ? "датум." : "datum."}</CherryScript></h2></CherryReveal>
      <CherryReveal className="bch-party-ticket">
        {calendar ? <>
          <div className="bch-ticket-header"><span className="bch-kicker">{c ? "ОВО ВЕЧЕ ЈЕ НАШЕ" : "OVO VEČE JE NAŠE"}</span><CherryDoodle type="cherries" /></div>
          <div className="bch-ticket-date"><strong>{String(calendar.day).padStart(2, "0")}</strong><div><h3 className="bch-month"><CherryScript>{calendar.monthName.toLocaleLowerCase(c ? "sr-Cyrl" : "sr-Latn")}</CherryScript></h3><p className="bch-year">{calendar.year}</p></div></div>
          <table className="bch-month-grid" aria-label={`${calendar.monthName} ${calendar.year}. ${c ? "Датум прославе" : "Datum proslave"}: ${calendar.day}.`}>
            <thead><tr>{days.map(day => <th key={day} scope="col">{day}</th>)}</tr></thead>
            <tbody>{Array.from({ length: calendar.cells.length / 7 }, (_, row) => <tr key={row}>{calendar.cells.slice(row * 7, row * 7 + 7).map((day, i) => <td key={i}>
              {day && <span className={day === calendar.day ? "bch-selected-day" : ""}>{day}{day === calendar.day && <><span className="bch-sr-only">{c ? " — датум прославе" : " — datum proslave"}</span><svg viewBox="0 0 50 46" fill="none" aria-hidden="true"><motion.path d="M25 40 8 24C-3 12 13-2 24 11l1 2 2-2C39-2 55 13 43 25Z" initial={reduced ? false : { pathLength: 0, fillOpacity: 0 }} whileInView={{ pathLength: 1, fillOpacity: 1 }} viewport={{ once: true }} transition={{ duration: reduced ? 0 : 1, delay: reduced ? 0 : 0.15 }} /></svg></>}</span>}
            </td>)}</tr>)}</tbody>
          </table>
        </> : <div className="bch-date-pending"><CherryDoodle type="cherries" /><p>{data.date || (c ? "Датум ускоро стиже" : "Datum uskoro stiže")}</p></div>}
        <div className="bch-ticket-time"><span>{data.weekday || (c ? "ВИДИМО СЕ" : "VIDIMO SE")}</span>{data.time && <strong>{data.time}<small> h</small></strong>}</div>
        {data.venue && <div className="bch-location">
          <p className="bch-kicker">{c ? "МЕСТО ПРОСЛАВЕ" : "MESTO PROSLAVE"}</p><h3>{data.venue}</h3>{data.address && <p className="bch-location-address">{data.address}</p>}
          {map && <a className="bch-location-link" href={map} target="_blank" rel="noopener noreferrer"><svg className="bch-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12Z" /><circle cx="12" cy="9" r="2.5" /></svg><span>{details.locationButtonText || (c ? "Погледај локацију" : "Pogledaj lokaciju")}</span><CherryArrow /></a>}
        </div>}
        {canSaveDate && data.dateISO && <CherryCalendarButton data={data} details={details} text={data.cherry.calendarButtonText} />}
      </CherryReveal>
    </section>

    {events.length > 0 && <section className="bch-program bch-section" aria-labelledby={`${uid}-program`}>
      <CherryReveal className="bch-section-heading"><p className="bch-kicker">{c ? "ПЛАН ЗА ПАМЋЕЊЕ" : "PLAN ZA PAMĆENJE"}</p><h2 id={`${uid}-program`} className="bch-heading"><CherryScript>{c ? "Наше вече." : "Naše veče."}</CherryScript></h2></CherryReveal>
      <div className="bch-schedule">{events.map((event, i) => <CherryReveal className="bch-schedule-row" delay={Math.min(i * 0.06, 0.24)} key={`${event.time}-${i}`}><span className="bch-schedule-dot" /><time>{event.time}</time><div><h3>{event.title || event.label || event.name}</h3>{(event.venue || event.location) && <p>{event.venue || event.location}</p>}{event.description && <p>{event.description}</p>}{event.mapLink && <a href={event.mapLink} className="bch-text-link" target="_blank" rel="noopener noreferrer">{c ? "ЛОКАЦИЈА" : "LOKACIJA"}<CherryArrow /></a>}</div></CherryReveal>)}</div>
    </section>}

    {details.showDressCode && <section className="bch-dress bch-section"><div className="bch-dress-paper"><CherryReveal className="bch-center"><CherryDoodle type="bow" /><p className="bch-kicker">{c ? "МАЛО ИНСПИРАЦИЈЕ" : "MALO INSPIRACIJE"}</p><h2><CherryScript>{details.dressCodeTitle || "Dress code"}</CherryScript></h2>{data.cherry.dressImage && <CherryPhoto src={data.cherry.dressImage} className="bch-dress-photo" alt={c ? "Инспирација за одевање" : "Inspiracija za odevanje"} position={data.cherry.dressPosition || "50% 50%"} />}{details.dressCodeNote && <p>{details.dressCodeNote}</p>}{Array.isArray(details.dressCodePalette) && <div className="bch-palette">{details.dressCodePalette.map((value, i) => { const color = typeof value === "string" ? value : value.color || value.hex; const label = typeof value === "string" ? value : value.label || value.name || color; return <span key={i} style={{ backgroundColor: color }} role="img" aria-label={label} title={label} />; })}</div>}</CherryReveal></div></section>}

    <BirthdayCherryRSVP {...props} eventType="birthday" />
    <BirthdayCherryCountdown {...props} targetDate={data.dateISO} showCalendarButton={false} />
  </article>;
}
