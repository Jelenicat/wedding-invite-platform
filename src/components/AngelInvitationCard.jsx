import { motion } from "framer-motion";
import AngelRSVP from "./AngelRSVP";
import AngelCountdown from "./AngelCountdown";
import "../styles/card.css";
import "../styles/rsvp.css";

function AngelInvitationCard({
  brideName,
  groomName,
  details = {},
  slug,
  type,
}) {
  const monthsShort = {
    JAN: 0,
    FEB: 1,
    MAR: 2,
    APR: 3,
    MAY: 4,
    JUN: 5,
    JUL: 6,
    AUG: 7,
    SEP: 8,
    OCT: 9,
    NOV: 10,
    DEC: 11,
  };

  const getCalendarData = () => {
    if (details?.dateISO) {
      const d = new Date(details.dateISO);
      if (!Number.isNaN(d.getTime())) {
        return {
          day: d.getDate(),
          monthIndex: d.getMonth(),
          year: d.getFullYear(),
        };
      }
    }

    if (details?.date) {
      const parts = details.date.trim().split(/\s+/);
      if (parts.length >= 3) {
        const day = Number(parts[0]);
        const monthIndex = monthsShort[parts[1]?.toUpperCase()];
        const year = Number(parts[2]);

        if (
          !Number.isNaN(day) &&
          monthIndex !== undefined &&
          !Number.isNaN(year)
        ) {
          return { day, monthIndex, year };
        }
      }
    }

    return { day: 25, monthIndex: 5, year: 2026 };
  };

  const { day, monthIndex, year } = getCalendarData();

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

  const weekDays = ["PO", "UT", "SR", "ČE", "PE", "SU", "NE"];

  const getDaysInMonth = (month, fullYear) => {
    return new Date(fullYear, month + 1, 0).getDate();
  };

  const getFirstDayOffset = (month, fullYear) => {
    const jsDay = new Date(fullYear, month, 1).getDay();
    return jsDay === 0 ? 6 : jsDay - 1;
  };

  const daysInMonth = getDaysInMonth(monthIndex, year);
  const firstDayOffset = getFirstDayOffset(monthIndex, year);

  const calendarCells = [];
  for (let i = 0; i < firstDayOffset; i += 1) {
    calendarCells.push(null);
  }
  for (let i = 1; i <= daysInMonth; i += 1) {
    calendarCells.push(i);
  }

  const timelineEvents =
    details?.events?.length > 0
      ? details.events
      : [
          {
            label: "Okupljanje gostiju",
            time: details.gatheringTime || "12:00",
            note: "Doček i početak proslave",
            iconType: "gathering",
          },
          {
            label: "Svečana ceremonija",
            time: details.ceremonyTime || "13:30",
            note: "Početak ceremonije venčanja",
            iconType: "rings",
          },
          {
            label: "Večera i slavlje",
            time: details.dinnerTime || "18:00",
            note: "Nastavak proslave uz muziku i večeru",
            iconType: "dinner",
          },
        ];

  const iconMap = {
    church: "/icons/church.svg",
    civil: "/icons/civil.svg",
    rings: "/icons/rings.svg",
    gathering: "/icons/gathering.svg",
    restaurant: "/icons/restaurant.svg",
    dinner: "/icons/dinner.svg",
    party: "/icons/party.svg",
    ceremony: "/icons/ceremony.svg",
    dresscode: "/icons/dresscode.svg",
    guests: "/icons/guests.svg",
  };

  const renderIcon = (iconType, index) => {
    const key = iconType || timelineEvents[index]?.icon || "gathering";

    let src = iconMap[key];

    if (!src) {
      if (key === "glass") src = iconMap.dinner;
      else if (key === "cherub") src = iconMap.gathering;
      else src = iconMap.rings;
    }

    return (
      <span className="angel-program-icon-badge" aria-hidden="true">
        <img src={src} alt="" className="angel-program-icon-svg" />
      </span>
    );
  };

  const hasDressCode =
    !!details?.dressCodeNote ||
    details?.dressCodeWomen?.length > 0 ||
    details?.dressCodeMen?.length > 0;

  return (
    <>
      <section className="angel-card-page angel-card-page-connected">
        <div className="angel-card-top-fade" />
        <div className="angel-card-top-glow" />

        <div className="angel-card-shell">
          <motion.div
            className="angel-card-main"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.75 }}
          >
            <div className="angel-card-inner-frame" />
            <div className="angel-card-inner-frame angel-card-inner-frame-second" />

            <motion.div
              className="angel-card-heading"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
          

              <p className="angel-card-invite-text">Pozivnica</p>

              {details?.welcomeText && (
                <p className="angel-card-subtext">{details.welcomeText}</p>
              )}
            </motion.div>

            <div className="angel-card-grid">
              <motion.div
                className="angel-info-block angel-calendar-block"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55 }}
              >
                <div className="angel-block-title">Datum venčanja</div>

                <div className="angel-calendar">
                  <div className="angel-calendar-month">
                    {monthNames[monthIndex]} {year}
                  </div>

                  <div className="angel-calendar-weekdays">
                    {weekDays.map((wd) => (
                      <span key={wd}>{wd}</span>
                    ))}
                  </div>

                  <div className="angel-calendar-days">
                    {calendarCells.map((cell, index) => (
                      <div
                        key={`${cell}-${index}`}
                        className={`angel-calendar-day ${
                          cell === day ? "is-selected" : ""
                        } ${cell === null ? "is-empty" : ""}`}
                      >
                        {cell !== null && (
                          <>
                            {cell === day && (
                              <span className="angel-calendar-heart">♡</span>
                            )}
                            <span>{cell}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="angel-info-block angel-program-block"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: 0.08 }}
              >
                <div className="angel-block-title">Program</div>

                <div className="angel-program-list">
                  {timelineEvents.map((event, index) => (
                    <div
                      className="angel-program-item"
                      key={`${event.label}-${index}`}
                    >
                      <div className="angel-program-icon">
                        {renderIcon(event.iconType || event.icon, index)}
                      </div>

                      <div className="angel-program-content">
                        <div className="angel-program-time">
                          {event.time || ""}
                        </div>

                        <div className="angel-program-label">{event.label}</div>

                        {event.location &&
                          (event.mapLink ? (
                            <a
                              href={event.mapLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="angel-program-location angel-program-location-link"
                            >
                              {event.location}
                            </a>
                          ) : (
                            <div className="angel-program-location">
                              {event.location}
                            </div>
                          ))}

                        {event.note && (
                          <div className="angel-program-note">{event.note}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {hasDressCode && (
              <div className="angel-card-bottom-grid angel-card-bottom-grid-single">
                <motion.div
                  className="angel-info-block angel-dress-block"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, delay: 0.08 }}
                >
                  <div className="angel-block-title">Dress code</div>

                  {details?.dressCodeNote && (
                    <p className="angel-dress-text">{details.dressCodeNote}</p>
                  )}

                  {details?.dressCodeWomen?.length > 0 && (
                    <div className="angel-dress-group">
                      <div className="angel-dress-group-title">Za dame</div>

                      <div className="angel-dress-palette">
                        {details.dressCodeWomen.map((color, index) => (
                          <span
                            key={`women-${color}-${index}`}
                            className="angel-dress-swatch"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {details?.dressCodeMen?.length > 0 && (
                    <div className="angel-dress-group">
                      <div className="angel-dress-group-title">Za gospodu</div>

                      <div className="angel-dress-palette">
                        {details.dressCodeMen.map((color, index) => (
                          <span
                            key={`men-${color}-${index}`}
                            className="angel-dress-swatch"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            )}

            {details?.note && (
              <motion.div
                className="angel-card-note"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55 }}
              >
                {details.note}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      <div className="angel-rsvp-connected">
       <AngelRSVP slug={slug} eventType={type} />
      </div>

      {details?.dateISO && (
        <div className="angel-countdown-connected">
         <AngelCountdown targetDate={details.dateISO} />
        </div>
      )}
    </>
  );
}

export default AngelInvitationCard;