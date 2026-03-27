import { motion } from "framer-motion";
import "../styles/card.css";
import BirthdaySplitRSVP from "./BirthdaySplitRSVP";
import BirthdaySplitCountdown from "./BirthdaySplitCountdown";

function BirthdaySplitInvitationCard({
  slug,
  brideName,
  weddingDate,
  weddingTime,
  venue,
  details = {},
  backgroundImage,
}) {
  const name = brideName || "Nina";

  const videoPath = `/videos/${slug}.mp4`;

  const dateParts = weddingDate?.split(" ") || [];
  const day = dateParts[0] || "24";
  const month = dateParts[1] || "SEP";
  const year = dateParts[2] || "2026";

  return (
    <>
      <section className="birthday-video-invitation">
        <video
          className="birthday-video-bg"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={videoPath} type="video/mp4" />
        </video>

        <div className="birthday-video-overlay" />

        <motion.div
          className="birthday-video-card"
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
      <h1 className="birthday-video-name">{name}</h1>

<p className="birthday-video-subtitle">
  slavi svoj rođendan
</p>
<div className="birthday-video-calendar">
  <div className="calendar-month">{month}</div>

  <div className="calendar-days">
    {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
      <span key={d}>{d}</span>
    ))}
  </div>

  <div className="calendar-grid">
    {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
      <div
        key={d}
        className={`calendar-cell ${d == day ? "active" : ""}`}
      >
        {d}
      </div>
    ))}
  </div>
</div>

          <div className="birthday-video-info">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                venue || ""
              )}`}
              target="_blank"
              rel="noreferrer"
              className="birthday-video-item"
            >
              <span className="birthday-video-item-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 21s-6-5.4-6-10a6 6 0 1 1 12 0c0 4.6-6 10-6 10Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="11" r="2.5" fill="currentColor" />
                </svg>
              </span>
              <span>{venue}</span>
            </a>

            <div className="birthday-video-item">
              <span className="birthday-video-item-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="8.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M12 7.5v5l3 2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>{weddingTime}</span>
            </div>

            {details?.note && (
              <div className="birthday-video-note">{details.note}</div>
            )}
          </div>
        </motion.div>
      </section>

      <BirthdaySplitRSVP
        slug={slug}
        eventType="birthday"
        brideName={brideName}
        details={details}
        backgroundImage={backgroundImage}
      />

      <BirthdaySplitCountdown
        targetDate={details?.dateISO}
        backgroundImage={backgroundImage}
      />
    </>
  );
}

export default BirthdaySplitInvitationCard;