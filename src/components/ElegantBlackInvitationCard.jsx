import { motion } from "framer-motion";
import "../styles/card.css";
import ElegantBlackRSVP from "./ElegantBlackRSVP";
import ElegantBlackCountdown from "./ElegantBlackCountdown";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const softVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const scheduleItemVariants = {
  hidden: { opacity: 0, y: 26, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function ElegantBlackInvitationCard({
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  details,
  backgroundImage,
  script = "latin",
  slug,
  type,
}) {
  const events = details?.events || [];
  const dateParts = weddingDate?.split(" ") || [];
  const day = dateParts[0] || "24";
  const monthYear = dateParts.slice(1).join(" ") || "MAJ 2026.";
  const cardBg =
    details?.backgroundImage ||
    backgroundImage ||
    "/images/elegant-black/card-bg.jpg";

  const brideInitial = brideName?.charAt(0)?.toUpperCase() || "A";
  const groomInitial = groomName?.charAt(0)?.toUpperCase() || "M";

  return (
    <>
      <section className="elegant-black-card">
        <div
          className="elegant-black-card-bg"
          style={{ backgroundImage: `url(${cardBg})` }}
        />

        <div className="elegant-black-card-overlay">
          <motion.div
            className="elegant-black-paper"
            initial={{ opacity: 0, y: 42, scale: 0.985, rotate: -0.4 }}
            whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="elegant-black-paper-inner"
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
            >
              <motion.div
                className="elegant-black-monogram"
                variants={itemVariants}
              >
                {brideInitial} <span>&</span> {groomInitial}
              </motion.div>

              <motion.p
                className="elegant-black-small-text"
                variants={softVariants}
              >
                SA VELIKOM RADOŠĆU <br />
                POZIVAMO VAS NA NAŠE
              </motion.p>

              <motion.h2
                className="elegant-black-main-title"
                variants={itemVariants}
              >
                VENČANJE
              </motion.h2>

              <motion.div
                className="elegant-black-ornament-line"
                variants={softVariants}
              >
                <span />
              </motion.div>

              <motion.h3
                className="elegant-black-names"
                variants={itemVariants}
              >
                {brideName}
                <span className="elegant-black-and">i</span>
                {groomName}
              </motion.h3>

              <motion.div
                className="elegant-black-date-row"
                variants={itemVariants}
              >
                <div className="elegant-black-date-side">
                  <span>SUBOTA</span>
                </div>

                <div className="elegant-black-date-center">{day}</div>

                <div className="elegant-black-date-side">
                  <span>{monthYear}</span>
                </div>
              </motion.div>

              <motion.div
                className="elegant-black-dot"
                variants={softVariants}
              />

              <motion.p className="elegant-black-time" variants={softVariants}>
                {weddingTime} ČASOVA
              </motion.p>

              <motion.div
                className="elegant-black-divider"
                variants={softVariants}
              />

              <motion.p
                className="elegant-black-welcome"
                variants={itemVariants}
              >
                Radujemo se
                <br />
                da proslavimo ovaj dan sa vama!
              </motion.p>

              <motion.div
                className="elegant-black-divider elegant-black-divider-bottom"
                variants={softVariants}
              />

              {events.length > 0 && (
                <motion.div
                  className="elegant-black-schedule"
                  variants={containerVariants}
                >
                  <motion.h4
                    className="elegant-black-schedule-title"
                    variants={itemVariants}
                  >
                    Raspored
                  </motion.h4>

                  <div className="elegant-black-schedule-list">
                    {events.map((event, index) => (
                      <motion.div
                        className="elegant-black-schedule-item"
                        key={`${event.label}-${index}`}
                        variants={scheduleItemVariants}
                      >
                        <div className="elegant-black-schedule-time">
                          {event.time}
                        </div>

                        <div className="elegant-black-schedule-content">
                          <div className="elegant-black-schedule-label">
                            {event.label}
                          </div>

                          {event.location && (
                            <div className="elegant-black-schedule-location">
                              {event.location}
                            </div>
                          )}

                          {event.note && (
                            <div className="elegant-black-schedule-note">
                              {event.note}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {details?.note && (
                <>
                  <motion.div
                    className="elegant-black-divider elegant-black-divider-bottom"
                    variants={softVariants}
                  />
                  <motion.p
                    className="elegant-black-note"
                    variants={softVariants}
                  >
                    {details.note}
                  </motion.p>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

         <ElegantBlackRSVP
        slug={slug}
        eventType={type}
        brideName={brideName}
        groomName={groomName}
        script={script}
        backgroundImage={cardBg}
      />

      <ElegantBlackCountdown
        slug={slug}
        targetDate={details?.dateISO}
        script={script}
        backgroundImage={cardBg}
      />
    </>
  );
}

export default ElegantBlackInvitationCard;