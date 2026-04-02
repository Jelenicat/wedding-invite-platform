import { motion } from "framer-motion";
import VideoBandRSVP from "./VideoBandRSVP";
import VideoBandCountdown from "./VideoBandCountdown";
import "../styles/card.css";
import "../styles/rsvp.css";

function VideoBandInvitationCard({
  brideName,
  groomName,
  details = {},
  videoSrc,
  slug,
  type,
}) {
  const safeBrideName = brideName || "Bride";
  const safeGroomName = groomName || "Groom";

  // 🔴 BITNO: više NEMA getMapUrl
  const timelineItems =
    details.events?.length > 0
      ? details.events.map((item) => ({
          label: item.label,
          value: item.time,
          location: item.location,
          icon: item.icon,
          mapLink: item.mapLink, // 👉 samo ono što postoji
        }))
      : [
          {
            label: "Skup gostiju",
            value: details.gatheringTime,
            location: details.venue || "",
            icon: "gathering",
            mapLink: details.mapLink,
          },
          {
            label: "Crkveno venčanje",
            value: details.churchTime,
            location: details.churchVenue || "",
            icon: "church",
            mapLink: details.churchMapLink,
          },
          {
            label: "Građansko venčanje",
            value: details.ceremonyTime,
            location: details.venue || "",
            icon: "civil",
            mapLink: details.mapLink,
          },
          {
            label: "Proslava",
            value: details.dinnerTime,
            location: details.venue || "",
            icon: "dinner",
            mapLink: details.mapLink,
          },
        ].filter((item) => item.value);

  const formatDateParts = (dateString) => {
    if (!dateString) {
      return { day: "08", month: "AVG", year: "2026" };
    }

    const parts = dateString.split(" ");
    return {
      day: parts[0] || "08",
      month: parts[1] || "AVG",
      year: parts[2] || "2026",
    };
  };

  const { day, month, year } = formatDateParts(details.date);
  const editorialImage = `/images/${slug}.jpg`;

  const sheetReveal = {
    hidden: {
      opacity: 0,
      y: 36,
      filter: "blur(10px)",
      scale: 0.985,
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.14,
      },
    },
  };

  const softReveal = {
    hidden: {
      opacity: 0,
      y: 18,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const timelineReveal = {
    hidden: {
      opacity: 0,
      x: 10,
      filter: "blur(6px)",
    },
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <>
      <section className="video-band-editorial">
        <div className="video-band-editorial-paper" />

        <motion.div
          className="video-band-editorial-sheet"
          initial="hidden"
          animate="visible"
          variants={sheetReveal}
        >
          <motion.div
            className="video-band-editorial-top"
            variants={softReveal}
          >
            <p className="video-band-editorial-script">Program dana</p>
          </motion.div>

          <motion.div
            className="video-band-editorial-center-image"
            variants={softReveal}
          >
            <motion.img
              src={editorialImage}
              alt={`${safeBrideName} ${safeGroomName}`}
              animate={{
                y: [0, -4, 0],
                scale: [1, 1.01, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          <motion.div
            className="video-band-program-timeline video-band-program-timeline-editorial"
            variants={softReveal}
          >
            {timelineItems.map((item, index) => (
              <motion.div
                key={`${item.label}-${index}`}
                className="video-band-program-row video-band-program-row-editorial"
                variants={timelineReveal}
              >
                <div className="video-band-program-side video-band-program-side-left">
                  <div className="video-band-program-time">{item.value}</div>
                </div>

                <div className="video-band-program-centerline">
                  <span className="video-band-program-dot" />
                  {index !== timelineItems.length - 1 && (
                    <span className="video-band-program-line-vertical" />
                  )}
                </div>

                <div className="video-band-program-side video-band-program-side-right">
                  <div className="video-band-elegant-title">
                    {item.label}
                  </div>

                  {/* 🔥 KLJUČNI DEO */}
                  {item.location && (
                    item.mapLink ? (
                      <a
                        href={item.mapLink}
                        target="_blank"
                        rel="noreferrer"
                        className="video-band-program-location video-band-program-location-link"
                      >
                        {item.location}
                      </a>
                    ) : (
                      <div className="video-band-program-location">
                        {item.location}
                      </div>
                    )
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="video-band-editorial-calendar-wrap"
            variants={softReveal}
          >
            <p className="video-band-editorial-calendar-title">
              Dragi gosti!
            </p>

            {details.note && (
              <p className="video-band-editorial-note">{details.note}</p>
            )}

            <div className="video-band-editorial-calendar">
              <div className="video-band-editorial-calendar-month">{month}</div>

              <div className="video-band-editorial-calendar-grid">
                <span>PN</span>
                <span>UT</span>
                <span>SR</span>
                <span>ČT</span>
                <span>PT</span>
                <span>SB</span>
                <span>NV</span>

                {[...Array(31)].map((_, i) => {
                  const num = i + 1;
                  const isActive = String(num) === String(parseInt(day, 10));

                  return (
                    <span
                      key={num}
                      className={
                        isActive
                          ? "video-band-editorial-calendar-day is-active"
                          : "video-band-editorial-calendar-day"
                      }
                    >
                      {num}
                    </span>
                  );
                })}
              </div>

              <div className="video-band-editorial-calendar-year">{year}</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <motion.div className="video-band-scroll-section">
        <VideoBandRSVP slug={slug} eventType={type} />
      </motion.div>

      {details.dateISO && (
        <motion.div className="video-band-scroll-section">
          <VideoBandCountdown targetDate={details.dateISO} />
        </motion.div>
      )}
    </>
  );
}

export default VideoBandInvitationCard;