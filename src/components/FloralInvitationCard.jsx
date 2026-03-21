import { motion } from "framer-motion";
import FloralRSVP from "./FloralRSVP";
import FloralCountdown from "./FloralCountdown";
import "../styles/card.css";
import "../styles/rsvp.css";

function FloralInvitationCard({ brideName, groomName, details = {} }) {
  const brideInitial = brideName?.[0] || "A";
  const groomInitial = groomName?.[0] || "M";

  const weekDays = ["PON", "UTO", "SRE", "ČET", "PET", "SUB", "NED"];

  const iconMap = {
    gathering: "/icons/guests.svg",
    church: "/icons/church.svg",
    civil: "/icons/rings.svg",
    restaurant: "/icons/dinner.svg",
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
      <div className="floral-calendar-card">
        <p className="floral-calendar-month">{monthNames[month]}</p>

        <div className="floral-calendar-weekdays">
          {weekDays.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="floral-calendar-grid">
          {cells.map((day, index) => (
            <span
              key={`${day ?? "empty"}-${index}`}
              className={`floral-calendar-day ${
                day === selectedDay ? "is-active" : ""
              } ${day === null ? "is-empty" : ""}`}
            >
              {day ?? ""}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <motion.section
        className="floral-invitation-card floral-editorial-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="floral-invitation-overlay" />
        <div className="floral-corner floral-corner-top-left" />
        <div className="floral-corner floral-corner-bottom-right" />

        <div className="floral-paper floral-editorial-paper">
          <div className="floral-monogram-badge">
            <span>{brideInitial}</span>
            <span className="floral-monogram-and">&</span>
            <span>{groomInitial}</span>
          </div>

          <h1 className="floral-invitation-names">
            {brideName} <span>&</span> {groomName}
          </h1>

          <div className="floral-divider floral-divider-lg" />

          {details.welcomeText && (
            <p className="floral-invitation-text floral-editorial-text">
              {details.welcomeText}
            </p>
          )}

          <div className="floral-divider floral-divider-sm" />

          {renderCalendar(details.dateISO)}

          {details.events?.length > 0 && (
            <div className="floral-timeline">
              {details.events.map((event, index) => (
                <motion.div
                  key={`${event.label}-${index}`}
                  className="floral-timeline-item"
                  initial={{ opacity: 0, y: 34 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                >
                  <div className="floral-timeline-icon">
                    <img
                      src={iconMap[event.icon] || "/icons/guests.svg"}
                      alt={event.label}
                    />
                  </div>

                  <h3 className="floral-timeline-title">{event.label}</h3>

                  <div className="floral-timeline-meta">
                    {event.time && (
                   <p className="floral-timeline-time">
  {event.time}
  {event.location && (
    <span className="floral-timeline-separator"> • </span>
  )}
  {event.location && (
    <span className="floral-timeline-location-inline">
      {event.location}
    </span>
  )}
</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {details.dressCodePalette?.length > 0 && (
            <motion.div
              className="floral-extra-card floral-dresscode-card"
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55 }}
            >
              <div className="floral-dresscode-icon">
                <img src="/icons/dresscode.svg" alt="Dress code" />
              </div>

              <h3 className="floral-section-title">
                {details.dressCodeTitle || "Dress code"}
              </h3>

              {details.dressCodeNote && (
                <p className="floral-section-note floral-dresscode-note">
                  {details.dressCodeNote}
                </p>
              )}

              <div className="floral-palette floral-dresscode-palette">
                {details.dressCodePalette.map((color, index) => (
                  <span
                    key={`${color}-${index}`}
                    className="floral-palette-dot"
                    style={{ backgroundColor: color }}
                    aria-label={`dress code color ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {details.mapLink && (
            <motion.div
              className="floral-extra-card floral-map-card"
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55 }}
            >
              <h3 className="floral-section-title">Lokacija</h3>

              <a
                href={details.mapLink}
                target="_blank"
                rel="noreferrer"
                className="floral-map-link"
              >
                Pogledaj na mapi
              </a>
            </motion.div>
          )}

          {details.note && (
            <p className="floral-invitation-note">{details.note}</p>
          )}
        </div>
      </motion.section>

      <FloralRSVP />

      {details.dateISO && <FloralCountdown targetDate={details.dateISO} />}
    </>
  );
}

export default FloralInvitationCard;