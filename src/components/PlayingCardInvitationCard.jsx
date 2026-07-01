import { motion } from "framer-motion";
import PlayingCardRSVP from "./PlayingCardRSVP";
import PlayingCardCountdown from "./PlayingCardCountdown";

import "../styles/card.css";
import "../styles/rsvp.css";

function getInitial(value = "") {
  const cleanValue = String(value).trim();
  if (!cleanValue) return "";
  return Array.from(cleanValue)[0].toUpperCase();
}

function PlayingCardInvitationCard({
  brideName,
  groomName,
  details = {},
  weddingDate,
  slug,
  type,
  script = "latin",
}) {
  const safeBrideName = brideName || "Jelisaveta";
  const safeGroomName = groomName || "Luka";

  const brideInitial = getInitial(safeBrideName);
  const groomInitial = getInitial(safeGroomName);

  const isCyrillic = script === "cyrillic";

  const t = isCyrillic
    ? {
        invitation: "Позивница",
        inviteText: "вас позивају на венчање",
        schedule: "Распоред",
        location: "Погледај локацију",
        dressCode: "Дрес код",
        women: "Даме:",
        men: "Мушкарци:",
      }
    : {
        invitation: "Pozivnica",
        inviteText: "vas pozivaju na venčanje",
        schedule: "Raspored",
        location: "Pogledaj lokaciju",
        dressCode: "Dress code",
        women: "Dame:",
        men: "Muškarci:",
      };

  const timelineItems =
    details.events?.filter((item) => item.label || item.time) || [];

  const shouldShowDressCode =
    details.showDressCode &&
    (details.dressCodeTitle ||
      details.dressCodeNote ||
      details.dressCodeWomen ||
      details.dressCodeMen ||
      details.dressCodePalette?.length > 0);

  const dateText = details.date || weddingDate;

  return (
    <>
      <motion.section
        className={`playing-card-invitation playing-card-slug-${slug || ""}`}
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="pci-page-inner">
          <article className="pci-main-card">
            <div className="pci-frame" />

            <div className="pci-corner pci-corner-top">
              <span>{brideInitial}</span>
              <small>♥</small>
            </div>

            <div className="pci-corner pci-corner-bottom">
              <span>{groomInitial}</span>
              <small>♥</small>
            </div>

            <div className="pci-hero">
              <p className="pci-kicker">{t.invitation}</p>

              <div className="pci-mini-suits">
                <span>♥</span>
                <span>♥</span>
                <span>♥</span>
              </div>

              <h1 className="pci-names">
                <span>{safeBrideName}</span>
                <em>&</em>
                <span>{safeGroomName}</span>
              </h1>

              <p className="pci-invite-text">{t.inviteText}</p>

              <div className="pci-heart-mark" aria-hidden="true">
                ♥
              </div>

              <p className="pci-script">Lucky in Love</p>

              {dateText && (
                <div className="pci-date-card">
                  <span>{dateText}</span>
                </div>
              )}

              {details.welcomeText && (
                <p className="pci-welcome">{details.welcomeText}</p>
              )}
            </div>
          </article>

          {timelineItems.length > 0 && (
            <section className="pci-section pci-schedule-section">
              <div className="pci-section-title-wrap">
                <span>♥</span>
                <h2>{t.schedule}</h2>
                <span>♥</span>
              </div>

              <div className="pci-timeline">
                {timelineItems.map((event, index) => {
                  const locationQuery = [event.location, event.address]
                    .filter(Boolean)
                    .join(", ");

                  const eventMapLink =
                    event.mapLink ||
                    (locationQuery
                      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          locationQuery
                        )}`
                      : "");

                  return (
                    <motion.div
                      key={`${event.label}-${event.time}-${index}`}
                      className="pci-event-card"
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.45, delay: index * 0.06 }}
                    >
                      <div className="pci-event-suit">
                        <strong>{String(index + 1).padStart(2, "0")}</strong>
                        <span>♥</span>
                      </div>

                      <div className="pci-event-content">
                        {event.time && (
                          <p className="pci-event-time">{event.time}</p>
                        )}

                        {event.label && (
                          <h3 className="pci-event-title">{event.label}</h3>
                        )}

                        {event.location && (
                          <p className="pci-event-location">
                            {event.location}
                          </p>
                        )}

                        {event.address && (
                          <p className="pci-event-address">{event.address}</p>
                        )}

                        {eventMapLink && (
                          <a
                            href={eventMapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pci-event-link"
                          >
                            {event.buttonText || t.location}
                          </a>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}

          {shouldShowDressCode && (
            <section className="pci-section pci-dress-section">
              <div className="pci-section-title-wrap">
                <span>♥</span>
                <h2>{details.dressCodeTitle || t.dressCode}</h2>
                <span>♥</span>
              </div>

              {details.dressCodeNote && (
                <p className="pci-section-note">{details.dressCodeNote}</p>
              )}

              {details.dressCodeWomen && (
                <div className="pci-dress-row">
                  <strong>{t.women}</strong>
                  <p>{details.dressCodeWomen}</p>
                </div>
              )}

              {details.dressCodePalette?.length > 0 && (
                <div className="pci-palette">
                  {details.dressCodePalette.map((color, index) => (
                    <span
                      key={`${color}-${index}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}

              {details.dressCodeMen && (
                <div className="pci-dress-row">
                  <strong>{t.men}</strong>
                  <p>{details.dressCodeMen}</p>
                </div>
              )}
            </section>
          )}

          {details.note && (
            <section className="pci-note-card">
              <span>♥</span>
              <p>{details.note}</p>
            </section>
          )}
        </div>
      </motion.section>

      <PlayingCardRSVP
        slug={slug}
        eventType={type}
        brideName={safeBrideName}
        groomName={safeGroomName}
        details={details}
        script={script}
      />

      {details.dateISO && (
        <PlayingCardCountdown
          targetDate={details.dateISO}
          brideName={safeBrideName}
          groomName={safeGroomName}
          details={details}
          script={script}
          slug={slug}
        />
      )}
    </>
  );
}

export default PlayingCardInvitationCard;