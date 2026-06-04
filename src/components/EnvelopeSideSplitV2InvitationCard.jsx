import { motion } from "framer-motion";
import "../styles/card.css";

function getInitial(name = "") {
  return name.trim().charAt(0).toUpperCase();
}

function formatDisplayDate(rawDate) {
  if (!rawDate) return "";

  if (typeof rawDate === "string" && rawDate.includes(".")) {
    const cleaned = rawDate.replace(/\s/g, "");
    const parts = cleaned.split(".").filter(Boolean);

    if (parts.length >= 3) {
      return `${parts[0]} | ${parts[1]} | ${parts[2]}.`;
    }

    return rawDate;
  }

  if (typeof rawDate === "string" && rawDate.includes("-")) {
    const [year, month, day] = rawDate.split("-");

    if (day && month && year) {
      return `${day} | ${month} | ${year}.`;
    }
  }

  return rawDate;
}

function normalizeEvents(details = {}, weddingTime, venue) {
  if (Array.isArray(details.events) && details.events.length > 0) {
    return details.events;
  }

  const fallbackEvents = [];

  if (details.churchVenue || weddingTime) {
    fallbackEvents.push({
      time: details.churchTime || weddingTime || "",
      location: details.churchVenue || "",
      icon: "church",
      mapLink: details.churchMapLink || "",
    });
  }

  if (details.partyVenue || venue || details.venue) {
    fallbackEvents.push({
      time: details.partyTime || "",
      location: details.partyVenue || venue || details.venue || "",
      icon: "rings",
      mapLink: details.partyMapLink || details.mapLink || "",
    });
  }

  return fallbackEvents;
}

function ChurchIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="essv2-event-icon-svg"
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 52V28L32 15l18 13v24" />
        <path d="M20 52V33h24v19" />
        <path d="M28 52V41h8v11" />
        <path d="M24 26h16" />
        <path d="M32 8v10" />
        <path d="M28 12h8" />
        <path d="M24 33v-8h16v8" />
        <circle cx="32" cy="28" r="3.8" />
      </g>
    </svg>
  );
}

function RingsIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="essv2-event-icon-svg"
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="24" cy="36" r="12" />
        <circle cx="40" cy="28" r="12" />
        <path d="M30 18l8-6 8 6" />
        <path d="M38 12l2-5 2 5" />
      </g>
    </svg>
  );
}

function EventIcon({ type }) {
  if (type === "church") return <ChurchIcon />;
  return <RingsIcon />;
}

const pageVariants = {
  hidden: {
    opacity: 0,
    scale: 1.04,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.25,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.55,
      staggerChildren: 0.22,
    },
  },
};

const fadeUpVariants = {
  hidden: {
    opacity: 0,
    y: 42,
    scale: 0.96,
    filter: "blur(12px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.15,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const monogramVariants = {
  hidden: {
    opacity: 0,
    scale: 0.78,
    y: 28,
    rotate: -3,
    filter: "blur(14px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotate: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.35,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const namesVariants = {
  hidden: {
    opacity: 0,
    y: 34,
    scale: 0.9,
    filter: "blur(14px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.35,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

function EnvelopeSideSplitV2InvitationCard({
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  venue,
  details = {},
}) {
  const invitationText =
    details.invitationText ||
    "POZIVAMO VAS DA SVOJIM PRISUSTVOM UVELIČATE NAŠE SLAVLJE";

  const cityText =
    details.city ||
    details.place ||
    details.location ||
    details.eventCity ||
    "";

  const dateText = formatDisplayDate(
    details.date || details.dateISO || weddingDate
  );

  const events = normalizeEvents(details, weddingTime, venue).slice(0, 2);

  const closingScript = details.closingScript || "Radujemo se vašem dolasku";

  const footerNote = details.rsvpText || details.footerText || "";

  const cardBackground =
    details.cardBackgroundImage ||
    "/images/cards/envelope-side-split-v2-paper.jpg";

  return (
    <motion.section
      className="essv2-page"
      style={{ backgroundImage: `url(${cardBackground})` }}
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="essv2-card">
        <motion.div
          className="essv2-inner"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="essv2-monogram" variants={monogramVariants}>
            <span>{getInitial(brideName)}</span>
            <span className="essv2-monogram-divider" />
            <span>{getInitial(groomName)}</span>
          </motion.div>

          <motion.p
            className="essv2-invitation-text"
            variants={fadeUpVariants}
          >
            {invitationText}
          </motion.p>

          {(cityText || dateText) && (
            <motion.div
              className="essv2-place-date"
              variants={fadeUpVariants}
            >
              {cityText ? <div className="essv2-city">{cityText}</div> : null}
              {dateText ? <div className="essv2-date">{dateText}</div> : null}
            </motion.div>
          )}

          <motion.h1 className="essv2-names" variants={namesVariants}>
            <motion.span
              className="essv2-name-script"
              initial={{ opacity: 0, x: -26, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{
                duration: 1.15,
                delay: 1.7,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {brideName}
            </motion.span>

            <motion.span
              className="essv2-ampersand"
              initial={{ opacity: 0, scale: 0.45, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: 0.9,
                delay: 1.95,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              &nbsp;&amp;&nbsp;
            </motion.span>

            <motion.span
              className="essv2-name-script"
              initial={{ opacity: 0, x: 26, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{
                duration: 1.15,
                delay: 1.7,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {groomName}
            </motion.span>
          </motion.h1>

          {events.length > 0 && (
            <motion.div className="essv2-events" variants={containerVariants}>
              {events.map((event, index) => (
                <motion.div
                  className="essv2-event-row"
                  key={index}
                  variants={fadeUpVariants}
                >
                  <motion.div
                    className="essv2-event-icon"
                    initial={{ opacity: 0, scale: 0.55, rotate: -8 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{
                      duration: 0.9,
                      delay: 2.15 + index * 0.18,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <EventIcon type={event.icon} />
                  </motion.div>

                  <div className="essv2-event-text">
                    {event.time ? (
                      <span className="essv2-event-time">{event.time}</span>
                    ) : null}

                    {event.time && event.location ? (
                      <span className="essv2-event-separator"> | </span>
                    ) : null}

                    {event.location ? (
                      event.mapLink ? (
                        <a
                          href={event.mapLink}
                          className="essv2-event-location essv2-event-location-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {event.location}
                        </a>
                      ) : (
                        <span className="essv2-event-location">
                          {event.location}
                        </span>
                      )
                    ) : null}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            className="essv2-closing-script"
            variants={fadeUpVariants}
          >
            <span>{closingScript}</span>
            <span className="essv2-heart" aria-hidden="true">
              ♥
            </span>
          </motion.div>

          {footerNote ? (
            <motion.p className="essv2-footer-note" variants={fadeUpVariants}>
              {footerNote}
            </motion.p>
          ) : null}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default EnvelopeSideSplitV2InvitationCard;