import { motion } from "framer-motion";
import FloralRSVP from "./FloralRSVP";
import FloralCountdown from "./FloralCountdown";
import "../styles/card.css";
import "../styles/rsvp.css";

function FloralInvitationCard({
  brideName,
  groomName,
  details = {},
  slug,
  type,
  backgroundImage,
}) {
  const brideInitial = brideName?.[0] || "A";
  const groomInitial = groomName?.[0] || "M";

  const weekDays = ["PON", "UTO", "SRE", "ČET", "PET", "SUB", "NED"];

  const iconMap = {
    gathering: "/icons/guests.svg",
    church: "/icons/church.svg",
    civil: "/icons/rings.svg",
    restaurant: "/icons/dinner.svg",
    party: "/icons/dinner.svg",
  };

  const shouldShowDressCode =
    details.showDressCode &&
    (
      details.dressCodeTitle ||
      details.dressCodeNote ||
      details.dressCodePalette?.length > 0
    );

  const sectionVariants = {
    hidden: { opacity: 0, y: 36 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.12,
        delayChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const softReveal = {
    hidden: { opacity: 0, y: 22, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const timelineItemVariants = {
    hidden: { opacity: 0, y: 34, scale: 0.96 },
    show: (index) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.75,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const renderCalendar = (dateString) => {
    if (!dateString) return null;

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return null;

    const year = date.getFullYear();
    const month = date.getMonth();
    const selectedDay = date.getDate();

    const firstDay = new Date(year, month, 1);
    const lastDate = new Date(year, month + 1, 0).getDate();

    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;

    const cells = [];

    for (let i = 0; i < startDay; i++) {
      cells.push(null);
    }

    for (let day = 1; day <= lastDate; day++) {
      cells.push(day);
    }

    const monthNames = [
      "Januar",
      "Februar",
      "Mart",
      "April",
      "Maj",
      "Jun",
      "Jul",
      "Avgust",
      "Septembar",
      "Oktobar",
      "Novembar",
      "Decembar",
    ];

    return (
      <motion.div
        className="floral-calendar-card"
        variants={softReveal}
      >
        <motion.p
          className="floral-calendar-month"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {monthNames[month]}
        </motion.p>

        <div className="floral-calendar-weekdays">
          {weekDays.map((day) => (
            <motion.span
              key={day}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4 }}
            >
              {day}
            </motion.span>
          ))}
        </div>

        <div className="floral-calendar-grid">
          {cells.map((day, index) => (
            <motion.span
              key={`${day ?? "empty"}-${index}`}
              className={`floral-calendar-day ${
                day === selectedDay ? "is-active" : ""
              } ${day === null ? "is-empty" : ""}`}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: day === null ? 0 : 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.25,
                delay: Math.min(index * 0.015, 0.3),
              }}
            >
              {day ?? ""}
            </motion.span>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <>
    <motion.section
  className="floral-invitation-card floral-editorial-card"
  style={
    backgroundImage
      ? { "--floral-bg-image": `url(${backgroundImage})` }
      : undefined
  }
  initial="hidden"
  animate="show"
  variants={sectionVariants}
>
        <div className="floral-invitation-overlay" />
        <div className="floral-corner floral-corner-top-left" />
        <div className="floral-corner floral-corner-bottom-right" />

        <motion.div
          className="floral-paper floral-editorial-paper"
          initial={{ opacity: 0, y: 50, scale: 0.97, rotateX: 6 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="floral-monogram-badge"
            variants={itemVariants}
            whileHover={{ scale: 1.04, rotate: 2 }}
            transition={{ duration: 0.35 }}
          >
            <span>{brideInitial}</span>
            <span className="floral-monogram-and">&</span>
            <span>{groomInitial}</span>
          </motion.div>

          <motion.h1
            className="floral-invitation-names"
            variants={itemVariants}
          >
            {brideName} <span>&</span> {groomName}
          </motion.h1>

          <motion.div
            className="floral-divider floral-divider-lg"
            variants={itemVariants}
          />

          {details.welcomeText && (
            <motion.p
              className="floral-invitation-text floral-editorial-text"
              variants={itemVariants}
            >
              {details.welcomeText}
            </motion.p>
          )}

          <motion.div
            className="floral-divider floral-divider-sm"
            variants={itemVariants}
          />

          {renderCalendar(details.dateISO)}

          {details.events?.length > 0 && (
            <div className="floral-timeline">
              {details.events.map((event, index) => (
                <motion.div
                  key={`${event.label}-${index}`}
                  className="floral-timeline-item"
                  custom={index}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.25 }}
                  variants={timelineItemVariants}
                  whileHover={{ y: -6, scale: 1.01 }}
                >
                  <motion.div
                    className="floral-timeline-icon"
                    initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{ scale: 1.08, rotate: -3 }}
                  >
                    <img
                      src={iconMap[event.icon] || "/icons/guests.svg"}
                      alt={event.label}
                    />
                  </motion.div>

                  <motion.h3
                    className="floral-timeline-title"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.55, delay: 0.08 }}
                  >
                    {event.label}
                  </motion.h3>

                  <div className="floral-timeline-meta">
                    {event.time && (
                      <motion.p
                        className="floral-timeline-time"
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, delay: 0.12 }}
                      >
                        {event.time}
                        {event.location && (
                          <span className="floral-timeline-separator"> • </span>
                        )}
                        {event.location &&
                          (event.mapLink ? (
                            <a
                              href={event.mapLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="floral-timeline-location-inline floral-timeline-location-link"
                            >
                              {event.location}
                            </a>
                          ) : (
                            <span className="floral-timeline-location-inline">
                              {event.location}
                            </span>
                          ))}
                      </motion.p>
                    )}

                    {event.note && (
                      <motion.p
                        className="floral-timeline-note"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.55, delay: 0.18 }}
                      >
                        {event.note}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {shouldShowDressCode && (
            <motion.div
              className="floral-extra-card floral-dresscode-card"
              initial={{ opacity: 0, y: 34, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
            >
              <motion.div
                className="floral-dresscode-icon"
                initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
              >
                <img src="/icons/dresscode.svg" alt="Dress code" />
              </motion.div>

              <motion.h3
                className="floral-section-title"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55 }}
              >
                {details.dressCodeTitle || "Dress code"}
              </motion.h3>

              {details.dressCodeNote && (
                <motion.p
                  className="floral-section-note floral-dresscode-note"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.55, delay: 0.08 }}
                >
                  {details.dressCodeNote}
                </motion.p>
              )}

              {details.dressCodePalette?.length > 0 && (
                <motion.div
                  className="floral-palette floral-dresscode-palette"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: 0.1 }}
                >
                  {details.dressCodePalette.map((color, index) => (
                    <motion.span
                      key={`${color}-${index}`}
                      className="floral-palette-dot"
                      style={{ backgroundColor: color }}
                      aria-label={`dress code color ${index + 1}`}
                      initial={{ opacity: 0, scale: 0.7, y: 8 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.06,
                      }}
                      whileHover={{ y: -4, scale: 1.08 }}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {details.mapLink && (
            <motion.div
              className="floral-extra-card floral-map-card"
              initial={{ opacity: 0, y: 34, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
            >
              <motion.h3
                className="floral-section-title"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
              >
                Lokacija
              </motion.h3>

              <motion.a
                href={details.mapLink}
                target="_blank"
                rel="noreferrer"
                className="floral-map-link"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: 0.08 }}
                whileHover={{ y: -3, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Pogledaj na mapi
              </motion.a>
            </motion.div>
          )}

          {details.note && (
            <motion.p
              className="floral-invitation-note"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.65, delay: 0.08 }}
            >
              {details.note}
            </motion.p>
          )}
        </motion.div>
      </motion.section>

      <FloralRSVP
        slug={slug}
        eventType={type}
        rsvpOptions={details?.rsvpOptions}
      />

      {details.dateISO && (
  <FloralCountdown
    targetDate={details.dateISO}
    brideName={brideName}
    groomName={groomName}
    details={details}
    showCalendarButton={details?.showCalendarButton}
  />
)}
    </>
  );
}

export default FloralInvitationCard;