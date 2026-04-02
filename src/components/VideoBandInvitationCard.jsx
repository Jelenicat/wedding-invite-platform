import { motion } from "framer-motion";
import VideoBandRSVP from "./VideoBandRSVP";
import VideoBandCountdown from "./VideoBandCountdown";
import "../styles/card.css";
import "../styles/rsvp.css";

const WEEKDAY_LABELS = ["PN", "UT", "SR", "ČT", "PT", "SB", "NV"];

const MONTH_MAP = {
  JAN: 0,
  FEB: 1,
  MAR: 2,
  APR: 3,
  MAJ: 4,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AVG: 7,
  AUG: 7,
  SEP: 8,
  OKT: 9,
  OCT: 9,
  NOV: 10,
  DEC: 11,
  DECEMBER: 11,
};

function parseDateParts(dateString) {
  if (!dateString) {
    return { day: "08", month: "AVG", year: "2026" };
  }

  const parts = dateString.trim().split(/\s+/);

  return {
    day: parts[0] || "08",
    month: (parts[1] || "AVG").toUpperCase(),
    year: parts[2] || "2026",
  };
}

function buildCalendarDays(day, month, year) {
  const numericDay = Number.parseInt(day, 10);
  const numericYear = Number.parseInt(year, 10);
  const monthIndex = MONTH_MAP[month];

  if (
    Number.isNaN(numericDay) ||
    Number.isNaN(numericYear) ||
    monthIndex === undefined
  ) {
    return Array.from({ length: 35 }, (_, i) => ({
      key: `fallback-${i}`,
      label: "",
      isActive: false,
      isEmpty: true,
    }));
  }

  const firstDay = new Date(numericYear, monthIndex, 1);
  const daysInMonth = new Date(numericYear, monthIndex + 1, 0).getDate();

  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  const cells = [];

  for (let i = 0; i < startOffset; i += 1) {
    cells.push({
      key: `empty-start-${i}`,
      label: "",
      isActive: false,
      isEmpty: true,
    });
  }

  for (let i = 1; i <= daysInMonth; i += 1) {
    cells.push({
      key: `day-${i}`,
      label: i,
      isActive: i === numericDay,
      isEmpty: false,
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({
      key: `empty-end-${cells.length}`,
      label: "",
      isActive: false,
      isEmpty: true,
    });
  }

  return cells;
}

function VideoBandInvitationCard({
  brideName,
  groomName,
  details = {},
  slug,
  type,
  image,
  image1,
  image2,
  image3,
}) {
  const safeBrideName = brideName || "Bride";
  const safeGroomName = groomName || "Groom";

  const timelineItems =
    details.events?.length > 0
      ? details.events.map((item) => ({
          label: item.label,
          value: item.time,
          location: item.location,
          icon: item.icon,
          mapLink: item.mapLink,
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

  const { day, month, year } = parseDateParts(details.date);

  const calendarDays = buildCalendarDays(day, month, year);

  const editorialImage =
    details.editorialImage1 ||
    image1 ||
    image2 ||
    image3 ||
    image ||
    `/images/${slug}.jpg`;

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
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
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
                  <div className="video-band-elegant-title">{item.label}</div>

                  {item.location &&
                    (item.mapLink ? (
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
                    ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="video-band-editorial-calendar-wrap"
            variants={softReveal}
          >
            <p className="video-band-editorial-calendar-title">Dragi gosti!</p>

            {details.note && (
              <p className="video-band-editorial-note">{details.note}</p>
            )}

            <div className="video-band-editorial-calendar">
              <div className="video-band-editorial-calendar-month">{month}</div>

              <div className="video-band-editorial-calendar-grid">
                {WEEKDAY_LABELS.map((label) => (
                  <span key={label}>{label}</span>
                ))}

                {calendarDays.map((cell) => (
                  <span
                    key={cell.key}
                    className={[
                      "video-band-editorial-calendar-day",
                      cell.isActive ? "is-active" : "",
                      cell.isEmpty ? "is-empty" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {cell.label}
                  </span>
                ))}
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