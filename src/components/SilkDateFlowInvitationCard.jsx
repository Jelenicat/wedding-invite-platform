import { motion } from "framer-motion";
import SilkDateFlowRSVP from "./SilkDateFlowRSVP";
import SilkDateFlowCountdown from "./SilkDateFlowCountdown";

import "../styles/card.css";
import "../styles/rsvp.css";

const MONTHS_LATIN = [
  "JANUAR",
  "FEBRUAR",
  "MART",
  "APRIL",
  "MAJ",
  "JUN",
  "JUL",
  "AVGUST",
  "SEPTEMBAR",
  "OKTOBAR",
  "NOVEMBAR",
  "DECEMBAR",
];

const MONTHS_CYRILLIC = [
  "ЈАНУАР",
  "ФЕБРУАР",
  "МАРТ",
  "АПРИЛ",
  "МАЈ",
  "ЈУН",
  "ЈУЛ",
  "АВГУСТ",
  "СЕПТЕМБАР",
  "ОКТОБАР",
  "НОВЕМБАР",
  "ДЕЦЕМБАР",
];

const WEEK_DAYS_LATIN = ["PN", "UT", "SR", "ČT", "PT", "SB", "NS"];
const WEEK_DAYS_CYRILLIC = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

function getDateParts(dateISO, fallbackDate, months = MONTHS_LATIN) {
  const parsed = dateISO ? new Date(dateISO) : null;

  if (parsed && !Number.isNaN(parsed.getTime())) {
    return {
      day: parsed.getDate(),
      monthIndex: parsed.getMonth(),
      monthName: months[parsed.getMonth()],
      year: parsed.getFullYear(),
    };
  }

  const fallback = fallbackDate || "";
  const parts = fallback.trim().split(/\s+/);

  return {
    day: Number(parts[0]) || 1,
    monthIndex: 7,
    monthName: months[7],
    year: Number(parts[2]) || 2026,
  };
}

function getDisplayWeek(day, year, monthIndex) {
  const centerDate = new Date(year, monthIndex, day);

  return Array.from({ length: 7 }, (_, index) => {
    const d = new Date(centerDate);
    d.setDate(day - 2 + index);

    return {
      day: d.getDate(),
      monthIndex: d.getMonth(),
      year: d.getFullYear(),
    };
  });
}

function SilkDateFlowInvitationCard({
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  venue,
  details = {},
  backgroundImage,
  script = "latin",
  slug,
  type,
}) {
  const isCyrillic = script === "cyrillic";
  const months = isCyrillic ? MONTHS_CYRILLIC : MONTHS_LATIN;
  const weekDays = isCyrillic ? WEEK_DAYS_CYRILLIC : WEEK_DAYS_LATIN;

  // Slika za prvi deo: imena + tekst + datum + kalendar
  const bg =
    details.cardBackground ||
    details.backgroundImage ||
    backgroundImage ||
    "/images/silk-date-flow-bg.jpg";

  // Slika za drugi deo: raspored događaja
  const scheduleBg =
    details.scheduleBackground ||
    details.cardBackground ||
    details.backgroundImage ||
    backgroundImage ||
    "/images/silk-date-flow-bg.jpg";

  const dateISO = details.dateISO;
  const dateParts = getDateParts(dateISO, details.date || weddingDate, months);

  const displayWeek = getDisplayWeek(
    dateParts.day,
    dateParts.year,
    dateParts.monthIndex
  );

  const events = details.events || [];

  const namesConnector = isCyrillic ? "и" : "&";
  const scheduleTitle = isCyrillic ? "Распоред" : "Raspored";

  const defaultWelcome = isCyrillic
    ? "У овом посебном дану ми желимо да вас видимо међу нашим најближима."
    : "U ovom posebnom danu želimo da vas vidimo među našim najbližima.";

  const sharedDetails = {
    ...details,
    venue: details.venue || venue,
  };

  return (
    <>
      <main
        className="sdf-page"
        style={{
          "--sdf-bg": `url(${bg})`,
          "--sdf-schedule-bg": `url(${scheduleBg})`,
        }}
      >
        <section className="sdf-bg-layer" aria-hidden="true" />

        <motion.section
          className="sdf-card"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* PRVA SEKCIJA — IMENA, TEKST, DATUM */}
          <section className="sdf-date-section">
            <h1 className="sdf-names">
              {brideName} <span>{namesConnector}</span> {groomName}
            </h1>

            <p className="sdf-welcome">
              {details.welcomeText || defaultWelcome}
            </p>

            <div className="sdf-month-row">
              <span />
              <strong>{dateParts.monthName}</strong>
              <span />
            </div>

            <div className="sdf-calendar">
              <div className="sdf-weekdays">
                {weekDays.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>

              <div className="sdf-days">
                {displayWeek.map((item, index) => {
                  const isActive =
                    item.day === dateParts.day &&
                    item.monthIndex === dateParts.monthIndex &&
                    item.year === dateParts.year;

                  return (
                    <span
                      key={`${item.day}-${item.monthIndex}-${item.year}-${index}`}
                      className={isActive ? "is-active" : ""}
                    >
                      {item.day}
                    </span>
                  );
                })}
              </div>
            </div>
          </section>

          {/* DRUGA SEKCIJA — RASPORED DOGAĐAJA */}
          <section className="sdf-flow-section">
            <h2 className="sdf-schedule-title">{scheduleTitle}</h2>

            <svg
              className="sdf-dotted-line"
              viewBox="0 0 120 620"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M 74 0 C 10 120, 108 190, 52 300 C 0 405, 112 480, 42 620"
                fill="none"
                stroke="rgba(25,25,25,0.42)"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeDasharray="1 12"
              />
            </svg>

            <div className="sdf-events">
              {events.map((event, index) => {
                const isRight = index % 2 === 0;

                return (
                  <motion.article
                    className={`sdf-event ${isRight ? "right" : "left"}`}
                    key={`${event.label}-${event.time}-${index}`}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.55, delay: index * 0.08 }}
                  >
                    <p className="sdf-event-time">
                      {event.time || weddingTime}
                    </p>

                    <h2>{event.label}</h2>

                    {(event.location || event.note) && (
                      <p className="sdf-event-text">
                        {event.note || event.location}
                      </p>
                    )}

                    {event.mapLink && (
                      <a
                        className="sdf-map-link"
                        href={event.mapLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Pogledaj lokaciju
                      </a>
                    )}
                  </motion.article>
                );
              })}
            </div>
          </section>
        </motion.section>
      </main>

      <SilkDateFlowRSVP
        slug={slug}
        eventType={type}
        brideName={brideName}
        groomName={groomName}
        details={sharedDetails}
        backgroundImage={backgroundImage}
        script={script}
      />

      <SilkDateFlowCountdown
        targetDate={dateISO}
        brideName={brideName}
        groomName={groomName}
        details={sharedDetails}
        backgroundImage={backgroundImage}
        script={script}
      />
    </>
  );
}

export default SilkDateFlowInvitationCard;