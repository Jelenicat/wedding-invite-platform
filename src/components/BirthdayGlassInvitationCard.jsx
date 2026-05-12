import { motion } from "framer-motion";
import BirthdayLuxuryRSVP from "./BirthdayLuxuryRSVP";
import BirthdayLuxuryCountdown from "./BirthdayLuxuryCountdown";
import "../styles/birthdaycard.css";

function BirthdayGlassInvitationCard({
  brideName,
  weddingDate,
  weddingTime,
  venue,
  details = {},
  backgroundImage,
  slug,
  type,
}) {
  const name = brideName || "Đorđe";
  const age = details.age || 18;
  const date = weddingDate || details.date || "27 • 06 • 2026";
  const time = weddingTime || details.time || "20:00";
  const location = venue || details.venue || "Cotier";
  const note =
    details.note ||
    "Radujemo se da zajedno proslavimo ovaj poseban dan.";

  const mapLink = details.mapLink;

  return (
    <>
      <main className="bglass-card-page">
        <div
          className="bglass-card-bg"
          style={{
            backgroundImage: `url(${
              backgroundImage || "/images/birthday-glass-bg.jpg"
            })`,
          }}
        />

        <div className="bglass-card-overlay" />

        <motion.section
          className="bglass-card"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <p className="bglass-card-kicker">Pozivnica za rođendan</p>

          <h2>
            {name.toLocaleUpperCase("sr-RS")}
            <span>proslavlja {age}. rođendan</span>
          </h2>

          <div className="bglass-card-line" />

          <div className="bglass-info-grid">
            <div>
              <span>Datum</span>
              <strong>{date}</strong>
            </div>

            <div>
              <span>Vreme</span>
              <strong>{time}</strong>
            </div>

            <div className="bglass-full">
              <span>Lokacija</span>
              <strong>{location}</strong>
            </div>
          </div>

          <p className="bglass-note">{note}</p>

          {mapLink && (
            <a
              className="bglass-map-btn"
              href={mapLink}
              target="_blank"
              rel="noreferrer"
            >
              Pogledaj lokaciju
            </a>
          )}
        </motion.section>
      </main>

      <BirthdayLuxuryRSVP
        slug={slug}
        eventType={type}
        details={details}
      />

      {details.dateISO && (
        <BirthdayLuxuryCountdown
          targetDate={details.dateISO}
          brideName={brideName}
          details={details}
        />
      )}
    </>
  );
}

export default BirthdayGlassInvitationCard;