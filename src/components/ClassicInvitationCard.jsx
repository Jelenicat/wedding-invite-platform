import { motion } from "framer-motion";
import ClassicRSVP from "./ClassicRSVP";
import ClassicCountdown from "./ClassicCountdown";
import "../styles/card.css";

function ClassicInvitationCard({ details = {}, slug, type }) {
  const timelineEvents =
    details?.events?.length > 0
      ? details.events
      : [
          {
            label: "Građansko venčanje",
            time: "14:00",
            location: "Opština",
            note: "Molimo vas da dođete 30 minuta ranije.",
          },
          {
            label: "Fotografisanje",
            time: "16:00",
            location: "Park",
            note: "Zabeležimo najlepše trenutke zajedno.",
          },
          {
            label: "Koktel",
            time: "18:00",
            location: "Restoran",
            note: "Dobrodošlica uz piće i muziku.",
          },
          {
            label: "Večera i slavlje",
            time: "20:00",
            location: "Sala",
            note: "Počinje proslava!",
          },
        ];

  const dressPalette =
    details?.dressCodePalette?.length > 0
      ? details.dressCodePalette
      : ["#e9e1d9", "#d8c5b7", "#9a836d", "#6b532e"];

  return (
    <section className="classic-vertical-page">
      <div className="classic-vertical-shell">
        <motion.div
          className="classic-vertical-column"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.65 }}
        >
          <motion.section
            className="classic-vertical-card classic-schedule-card"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.6 }}
          >
            <div className="classic-vertical-inner">
              <div className="classic-striped-frame classic-striped-frame-top" />

              <h2 className="classic-vertical-script">Program</h2>

              <div className="classic-schedule-list">
                {timelineEvents.map((event, index) => (
                  <div
                    className="classic-schedule-item"
                    key={`${event.label}-${index}`}
                  >
                    <div className="classic-schedule-time">{event.time}</div>

                    <div className="classic-schedule-label">{event.label}</div>

                    {event.location &&
                      (event.mapLink ? (
                        <a
                          href={event.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="classic-schedule-location classic-schedule-location-link"
                        >
                          {event.location}
                        </a>
                      ) : (
                        <div className="classic-schedule-location">
                          {event.location}
                        </div>
                      ))}

                    {event.note && (
                      <div className="classic-schedule-note">{event.note}</div>
                    )}

                    {index !== timelineEvents.length - 1 && (
                      <div className="classic-schedule-divider" />
                    )}
                  </div>
                ))}
              </div>

              <div className="classic-striped-frame classic-striped-frame-bottom" />
            </div>
          </motion.section>

          {details?.dateISO && <ClassicCountdown targetDate={details.dateISO} />}

          <ClassicRSVP slug={slug} eventType={type} />

          <motion.section
            className="classic-vertical-card classic-dress-card"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.6 }}
          >
            <div className="classic-dress-bg" />

            <div className="classic-vertical-inner classic-dress-inner">
              <div className="classic-dress-script">Dres kod</div>

              {details?.dressCodeNote ? (
                <p className="classic-dress-text">{details.dressCodeNote}</p>
              ) : (
                <p className="classic-dress-text">
                  Tema venčanja je elegantna i bezvremenska.
                </p>
              )}

              <div className="classic-dress-swatches">
                {dressPalette.map((color, index) => (
                  <span
                    key={`${color}-${index}`}
                    className="classic-dress-swatch"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <p className="classic-dress-footnote">
                Bela boja je rezervisana za mladu — hvala na razumevanju.
              </p>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </section>
  );
}

export default ClassicInvitationCard;