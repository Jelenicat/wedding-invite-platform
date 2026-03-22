import { motion } from "framer-motion";
import EnvelopeRSVP from "./EnvelopeRSVP";
import EnvelopeCountdown from "./EnvelopeCountdown";
import "../styles/card.css";
import "../styles/rsvp.css";

function EnvelopeInvitationCard({ brideName, groomName, details = {} }) {
  const safeBrideName = brideName || "Bride";
  const safeGroomName = groomName || "Groom";

  const timelineItems =
    details.events?.filter((item) => item.label || item.time) || [];

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

    for (let i = 0; i < startDay; i++) cells.push(null);
    for (let day = 1; day <= lastDate; day++) cells.push(day);

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
      <div className="envelope-editorial-calendar">
        <p className="envelope-editorial-calendar-month">
          {monthNames[month]}
        </p>

        <div className="envelope-editorial-calendar-grid">
          {cells.map((day, index) => (
            <span
              key={`${day ?? "empty"}-${index}`}
              className={`envelope-editorial-calendar-day ${
                day === null ? "is-empty" : ""
              } ${day === selectedDay ? "is-active" : ""}`}
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
        className="envelope-invitation-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="envelope-invitation-overlay" />

        <div className="envelope-paper">
          <div className="envelope-paper-frame" />

          <p className="envelope-kicker">Pozivnica</p>

          <h1 className="envelope-invitation-names">
            <span>{safeBrideName}</span>
            <span className="envelope-invitation-and">&</span>
            <span>{safeGroomName}</span>
          </h1>

          {details.date && <p className="envelope-date">{details.date}</p>}

          <div className="envelope-divider" />

          {details.welcomeText && (
            <p className="envelope-text">{details.welcomeText}</p>
          )}

          {renderCalendar(details.dateISO)}

          {timelineItems.length > 0 && (
            <div className="envelope-editorial-program">
              <h3 className="envelope-editorial-title">Timing</h3>

              <div className="envelope-editorial-timeline">
                {timelineItems.map((event, index) => (
                  <motion.div
                    key={`${event.label}-${index}`}
                    className="envelope-editorial-row"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: index * 0.06 }}
                  >
                    <div className="envelope-editorial-time">
                      {event.time}
                    </div>

                    <div className="envelope-editorial-line-wrap">
                      <span className="envelope-editorial-dot" />
                      {index !== timelineItems.length - 1 && (
                        <span className="envelope-editorial-line" />
                      )}
                    </div>

                    <div className="envelope-editorial-content">
                      <h4 className="envelope-editorial-event-title">
                        {event.label}
                      </h4>

                      {event.location &&
                        (event.mapLink ? (
                          <a
                            href={event.mapLink}
                            target="_blank"
                            rel="noreferrer"
                            className="envelope-editorial-location is-link"
                          >
                            {event.location}
                          </a>
                        ) : (
                          <p className="envelope-editorial-location">
                            {event.location}
                          </p>
                        ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {details.dressCodePalette?.length > 0 && (
            <div className="envelope-editorial-dresscode">
              <h3 className="envelope-editorial-title">
                {details.dressCodeTitle || "Dress code"}
              </h3>

              {details.dressCodeNote && (
                <p className="envelope-editorial-note">
                  {details.dressCodeNote}
                </p>
              )}

              <div className="envelope-editorial-palette-shell">
                <div className="envelope-palette envelope-editorial-palette">
                  {details.dressCodePalette.map((color, index) => (
                    <span
                      key={`${color}-${index}`}
                      className="envelope-palette-dot envelope-editorial-palette-dot"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {details.mapLink && (
            <div className="envelope-editorial-map">
              <a
                href={details.mapLink}
                target="_blank"
                rel="noreferrer"
                className="envelope-map-link"
              >
                Otvori mapu
              </a>
            </div>
          )}

          {details.note && <p className="envelope-note">{details.note}</p>}
        </div>
      </motion.section>

      <EnvelopeRSVP
        brideName={safeBrideName}
        groomName={safeGroomName}
        details={details}
      />

      {details.dateISO && <EnvelopeCountdown targetDate={details.dateISO} />}
    </>
  );
}

export default EnvelopeInvitationCard;