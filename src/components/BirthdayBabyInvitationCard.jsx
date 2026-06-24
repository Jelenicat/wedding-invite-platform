import { motion } from "framer-motion";
import "../styles/birthdaycard.css";
import BirthdaySplitRSVP from "./BirthdaySplitRSVP";
import BirthdaySplitCountdown from "./BirthdaySplitCountdown";

function BirthdayBabyInvitationCard({
  slug,
  brideName,
  weddingDate,
  weddingTime,
  venue,
  details = {},
  backgroundImage,
  videoSrc,
}) {
  const name = brideName || "Ana";
  const cardVideoSrc = videoSrc || details.videoSrc || `/videos/${slug}.mp4`;

  const ornamentTopSvg = details.introOrnamentTopSvg;
  const ornamentBottomSvg = details.introOrnamentBottomSvg;
  const events = details.events || [];

  const theme = details.theme || {};

  const dateObj = details.dateISO ? new Date(details.dateISO) : null;

  const daysSr = [
    "NEDELJA",
    "PONEDELJAK",
    "UTORAK",
    "SREDA",
    "ČETVRTAK",
    "PETAK",
    "SUBOTA",
  ];

  const monthsSr = [
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

  const weekday = dateObj ? daysSr[dateObj.getDay()] : "";
  const month = dateObj ? monthsSr[dateObj.getMonth()] : "";

  const day = dateObj
    ? String(dateObj.getDate()).padStart(2, "0")
    : weddingDate?.match(/\d+/)?.[0] || "";

  const year = dateObj
    ? dateObj.getFullYear()
    : weddingDate?.match(/\d{4}/)?.[0] || "";

  const getEventIcon = (event) => {
    const icon = event.icon || "";
    const label = (event.label || "").toLowerCase();

    if (
      icon === "church" ||
      label.includes("krštenje") ||
      label.includes("krstenje")
    ) {
      return "♡";
    }

    if (
      icon === "cake" ||
      label.includes("rođendan") ||
      label.includes("rodjendan")
    ) {
      return "🎂";
    }

    if (label.includes("proslava") || icon === "party") {
      return "✦";
    }

    return "♡";
  };

  return (
    <>
      <section
        className="bbaby-card-section"
        style={{
          "--bbaby-card-main": theme.babyMain || "#ad6d60",
          "--bbaby-card-soft": theme.babySoft || "#f6becd",
          "--bbaby-card-light": theme.babyLight || "#fff6f1",
          "--bbaby-card-muted": theme.babyMuted || "#a4695e",
          "--bbaby-card-border":
            theme.babyBorder || "rgba(198, 131, 101, 0.52)",
          "--bbaby-card-shadow":
            theme.babyShadow || "rgba(147, 88, 72, 0.2)",
        }}
      >
        {cardVideoSrc ? (
          <video
            className="bbaby-card-bg-video"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={cardVideoSrc} type="video/mp4" />
          </video>
        ) : (
          <div
            className="bbaby-card-bg-image"
            style={{
              backgroundImage: backgroundImage
                ? `url(${backgroundImage})`
                : "none",
            }}
          />
        )}

        <div className="bbaby-card-overlay" />

        <motion.div
          className="bbaby-card"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          {ornamentTopSvg && (
            <img
              src={ornamentTopSvg}
              alt=""
              className="bbaby-card-ornament bbaby-card-ornament-top"
            />
          )}

          <h1 className="bbaby-card-name">{name}</h1>

          <p className="bbaby-card-subtitle">slavi prvi rođendan</p>

          {ornamentBottomSvg && (
            <img
              src={ornamentBottomSvg}
              alt=""
              className="bbaby-card-ornament bbaby-card-ornament-bottom"
            />
          )}

          <div className="bbaby-date-stack">
            {weekday && <p className="bbaby-date-weekday">{weekday}</p>}
            {month && <p className="bbaby-date-month">{month}</p>}
            <p className="bbaby-date-day">{day}</p>
            <p className="bbaby-date-year">{year}</p>
          </div>

          {events.length > 0 && (
            <div className="bbaby-card-schedule">
              <p className="bbaby-schedule-title">Raspored</p>

              <div className="bbaby-schedule-list">
                {events.map((event, index) => {
                  const eventLink = event.mapLink || "";

                  const content = (
                    <>
                      <span className="bbaby-schedule-icon">
                        {getEventIcon(event)}
                      </span>

                      <span className="bbaby-schedule-content">
                        <span className="bbaby-schedule-label">
                          {event.label}
                        </span>

                        {event.time && (
                          <span className="bbaby-schedule-time">
                            {event.time}
                          </span>
                        )}

                        {event.location && (
                          <span className="bbaby-schedule-location">
                            {event.location}
                          </span>
                        )}
                      </span>
                    </>
                  );

                  return eventLink ? (
                    <a
                      key={`${event.label}-${index}`}
                      href={eventLink}
                      target="_blank"
                      rel="noreferrer"
                      className="bbaby-schedule-item"
                    >
                      {content}
                    </a>
                  ) : (
                    <div
                      key={`${event.label}-${index}`}
                      className="bbaby-schedule-item"
                    >
                      {content}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {details?.note && (
            <p className="bbaby-card-note">{details.note}</p>
          )}
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

export default BirthdayBabyInvitationCard;