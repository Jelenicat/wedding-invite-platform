import { motion } from "framer-motion";
import BirthdayLuxuryRSVP from "./BirthdayLuxuryRSVP";
import BirthdayLuxuryCountdown from "./BirthdayLuxuryCountdown";
import "../styles/birthdaycard.css";

function BirthdayMarbleInvitationCard({
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
      <main className="bmarble-card-page">
        <div
          className="bmarble-card-bg"
          style={{
            backgroundImage: `url(${
              backgroundImage || "/images/birthday-marble-bg.jpg"
            })`,
          }}
        />

        <div className="bmarble-card-overlay" />

        <motion.section
          className="bmarble-card"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <p className="bmarble-card-kicker">Pozivnica za rođendan</p>

        <h2 className="bmarble-card-title">
  <span className="bmarble-card-name-script">{name}</span>
  <span className="bmarble-card-subtitle">slavi {age}. rođendan</span>
</h2>
          <div className="bmarble-card-line" />

          <div className="bmarble-info-grid">
            <div>
              <span>Datum</span>
              <strong>{date}</strong>
            </div>

            <div>
              <span>Vreme</span>
              <strong>{time}</strong>
            </div>

            <div className="bmarble-full">
              <span>Lokacija</span>
              <strong>{location}</strong>
            </div>
          </div>

          <p className="bmarble-note">{note}</p>

          {mapLink && (
            <a
              className="bmarble-map-btn"
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

export default BirthdayMarbleInvitationCard;