import { motion } from "framer-motion";
import "../styles/card.css";
import "../styles/rsvp.css";
import ElegantWhiteCountdown from "./ElegantWhiteCountdown";
import ElegantWhiteRSVP from "./ElegantWhiteRSVP";

function EleganWhiteInvitationCard({
  brideName = "Andrea",
  groomName = "Marko",
  weddingDate = "28 JUN 2025.",
  weddingTime = "16:00",
  details = {},
  slug,
  type,
}) {
  const events = details?.events || [];

  const formatMainDate = (dateString) => {
    if (!dateString) {
      return {
        dayName: "SUBOTA",
        dayNumber: "28",
        monthYear: "JUN 2025.",
      };
    }

    const parts = dateString.trim().split(" ");
    if (parts.length >= 3) {
      return {
        dayName: "SUBOTA",
        dayNumber: parts[0],
        monthYear: `${parts[1]} ${parts[2]}`,
      };
    }

    return {
      dayName: "SUBOTA",
      dayNumber: dateString,
      monthYear: "",
    };
  };

  const dateParts = formatMainDate(details?.date || weddingDate);

  const getEventIcon = (event) => {
    const label = (event?.label || "").toLowerCase();
    const icon = (event?.icon || "").toLowerCase();

    if (
      icon === "guests" ||
      label.includes("prijem gostiju") ||
      label.includes("gosti")
    ) {
      return "/images/passport/icons/guests.svg";
    }

    if (
      icon === "gathering" ||
      label.includes("okupljanje") ||
      label.includes("skup")
    ) {
      return "/images/passport/icons/gathering.svg";
    }

    if (icon === "church" || label.includes("crkveno")) {
      return "/images/passport/icons/church.svg";
    }

    if (
      icon === "civil" ||
      label.includes("građansko") ||
      label.includes("gradjansko") ||
      label.includes("ceremonija") ||
      label.includes("venčanje") ||
      label.includes("venčanja")
    ) {
      return "/images/passport/icons/rings.svg";
    }

    if (
      icon === "toast" ||
      label.includes("zdravica") ||
      label.includes("koktel") ||
      label.includes("piće")
    ) {
      return "/images/passport/icons/toast.svg";
    }

    if (
      icon === "restaurant" ||
      label.includes("večera") ||
      label.includes("ručak")
    ) {
      return "/images/passport/icons/dinner.svg";
    }

    if (
      icon === "party" ||
      label.includes("proslava") ||
      label.includes("after") ||
      label.includes("zabava") ||
      label.includes("ples")
    ) {
      return "/images/passport/icons/party.svg";
    }

    if (label.includes("torta")) {
      return "/images/passport/icons/cake.svg";
    }

    return "/images/passport/icons/event.svg";
  };

  return (
    <>
      <section
        className="elegant-white-card-section"
        style={{
          backgroundImage: `url(${
            details?.backgroundImage || "/images/elegant-white/background.jpg"
          })`,
        }}
      >
        <div className="elegant-white-card-overlay" />

        <motion.div
          className="elegant-white-card-shell"
          initial={{ opacity: 0, y: 36, scale: 0.985 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="elegant-white-card-arch">
            <div className="elegant-white-card-inner">
              <motion.div
                className="elegant-white-monogram-wrap"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <div className="elegant-white-monogram-frame-wrap">
                  <img
                    src="/images/elegant-white/monogram-frame.svg"
                    alt=""
                    aria-hidden="true"
                    className="elegant-white-monogram-frame"
                  />

                  <div className="elegant-white-monogram">
                    <span>{brideName?.[0] || "A"}</span>
                    <span className="elegant-white-monogram-divider" />
                    <span>{groomName?.[0] || "M"}</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="elegant-white-intro-copy"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.05 }}
              >
                <p>Sa radošću vas pozivamo</p>
                <p>da sa nama proslavite</p>
              </motion.div>

              <motion.h3
                className="elegant-white-eyebrow"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                Naše venčanje
              </motion.h3>

              <motion.div
                className="elegant-white-divider"
                initial={{ opacity: 0, scaleX: 0.7 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.16 }}
                style={{ transformOrigin: "center" }}
              >
                <span />
              </motion.div>

              <motion.div
                className="elegant-white-names"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, delay: 0.14 }}
              >
                <h1>{brideName}</h1>

                <div className="elegant-white-and-row">
                  <img
                    src="/images/elegant-white/ileft.svg"
                    alt=""
                    aria-hidden="true"
                    className="elegant-white-and-icon"
                  />
                  <em>i</em>
                  <img
                    src="/images/elegant-white/iright.svg"
                    alt=""
                    aria-hidden="true"
                    className="elegant-white-and-icon"
                  />
                </div>

                <h1>{groomName}</h1>
              </motion.div>

              <motion.div
                className="elegant-white-date-row"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, delay: 0.2 }}
              >
                <div className="elegant-white-date-box">
                  <span>{dateParts.dayName}</span>
                </div>

                <div className="elegant-white-date-center">
                  <strong>{dateParts.dayNumber}</strong>
                </div>

                <div className="elegant-white-date-box">
                  <span>{dateParts.monthYear}</span>
                </div>
              </motion.div>

              <motion.div
                className="elegant-white-time"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.24 }}
              >
                u {details?.ceremonyTime || weddingTime} časova
              </motion.div>

              <motion.div
                className="elegant-white-closing"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.32 }}
              >
                Radujemo se vašem dolasku!
              </motion.div>

              <div className="elegant-white-heart">♡</div>
            </div>
          </div>
        </motion.div>

        {events.length > 0 && (
          <motion.div
            className="elegant-white-schedule-full"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.85,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="elegant-white-schedule-card">
              <div className="elegant-white-schedule-inner">
                <motion.h3
                  className="elegant-white-schedule-title"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65 }}
                >
                  Raspored
                </motion.h3>

                <div className="elegant-white-schedule-divider">
                  <span />
                  <i>♡</i>
                  <span />
                </div>

                <div className="elegant-white-timeline">
                  <div className="elegant-white-timeline-line" />

                  {events.map((event, index) => (
                    <motion.div
                      className="elegant-white-event"
                      key={`${event.label}-${index}`}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{
                        duration: 0.55,
                        delay: index * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <div className="elegant-white-event-dot" />

                      <div className="elegant-white-event-icon-wrap">
                        <img
                          src={getEventIcon(event)}
                          alt=""
                          aria-hidden="true"
                          className="elegant-white-event-icon"
                        />
                      </div>

                      <div className="elegant-white-event-content">
                        <div className="elegant-white-event-time">
                          {event.time}
                        </div>

                        <div className="elegant-white-event-label">
                          {event.label}
                        </div>

                        {event.location &&
                          (event.mapLink ? (
                            <a
                              href={event.mapLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="elegant-white-event-location elegant-white-event-location-link"
                            >
                              {event.location}
                            </a>
                          ) : (
                            <div className="elegant-white-event-location">
                              {event.location}
                            </div>
                          ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      <ElegantWhiteRSVP
  slug={slug}
  eventType={type}
  note={details?.note}
/>

     {details.dateISO && (
  <ElegantWhiteCountdown
    targetDate={details.dateISO}
    backgroundImage={details?.backgroundImage}
    brideName={brideName}
    groomName={groomName}
    details={details}
    showCalendarButton={details?.showCalendarButton}
  />
)}
    </>
  );
}

export default EleganWhiteInvitationCard;