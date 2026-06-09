import { motion } from "framer-motion";
import MinimalGoldRSVP from "./MinimalGoldRSVP";
import MinimalGoldCountdown from "./MinimalGoldCountdown";

import "../styles/card.css";
import "../styles/rsvp.css";

function MinimalGoldInvitationCard({
  brideName,
  groomName,
  details = {},
  backgroundImage,
  slug,
  type,
  script = "latin",
}) {
  const safeBrideName = brideName || "Bride";
  const safeGroomName = groomName || "Groom";

  const finalBg =
    details.cardBackground || backgroundImage || "/images/minimal-gold-bg.jpg";

  const t =
    script === "cyrillic"
      ? {
          invitation: "Позивница",
          date: "Датум",
          plan: "План венчања",
          dressCode: "Дрес код",
          women: "Даме:",
          men: "Мушкарци:",
          location: "Погледај локацију",
        }
      : {
          invitation: "Pozivnica",
          date: "Datum",
          plan: "Plan vjenčanja",
          dressCode: "Dress code",
          women: "Dame:",
          men: "Muškarci:",
          location: "Pogledaj lokaciju",
        };

  const iconMap = {
    gathering: "/icons/gathering.svg",
    guests: "/icons/guests.svg",
    church: "/icons/church.svg",
    groom: "/icons/groom.svg",
    civil: "/icons/civil.svg",
    ceremony: "/icons/ceremony.svg",
    dinner: "/icons/dinner.svg",
    restaurant: "/icons/restaurant.svg",
    party: "/icons/party.svg",
    rings: "/icons/rings.svg",
    angel: "/icons/angel.svg",
    dresscode: "/icons/dresscode.svg",
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

  return (
    <>
      <motion.section
        className="minimal-invitation-card minimal-gold-theme"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div
          className="minimal-invitation-bg"
          style={{ backgroundImage: `url(${finalBg})` }}
        />

        <div className="minimal-invitation-overlay" />

        <div className="minimal-invitation-paper">
          <div className="minimal-invitation-frame" />

          <p className="minimal-invitation-kicker">{t.invitation}</p>

          <div className="minimal-invitation-monogram">
            <span>{safeGroomName[0]}</span>
            <span className="minimal-invitation-monogram-and">&</span>
            
            <span>{safeBrideName[0]}</span>
          </div>

          <h1
            className={`minimal-invitation-names ${
              script === "cyrillic"
                ? "minimal-invitation-names-cyrillic"
                : ""
            }`}
          >
                <span>{safeGroomName}</span>

            <span className="minimal-invitation-amp">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  d="M12 20
                  c-6-4.5-9-7.5-9-11
                  c0-2.5 2-4.5 4.5-4.5
                  c1.5 0 3 .8 4.5 2.3
                  c1.5-1.5 3-2.3 4.5-2.3
                  C19 4.5 21 6.5 21 9
                  c0 3.5-3 6.5-9 11z"
                />
              </svg>
            </span>

        
            <span>{safeBrideName}</span>
          </h1>

          {details.openingText && (
            <p className="minimal-invitation-text minimal-gold-opening-text">
              {details.openingText}
            </p>
          )}

          {details.mainQuote && (
            <p className="minimal-invitation-text minimal-gold-main-quote">
              {details.mainQuote}
            </p>
          )}

          {details.welcomeText && (
            <p className="minimal-invitation-text">{details.welcomeText}</p>
          )}

          {details.date && (
            <div className="minimal-invitation-date-block">
              <span className="minimal-invitation-date-label">{t.date}</span>
              <p className="minimal-invitation-date">{details.date}</p>
            </div>
          )}

          {timelineItems.length > 0 && (
            <div className="minimal-program-card minimal-program-editorial">
              <h3 className="minimal-section-title minimal-script-title">
                {t.plan}
              </h3>

              <div className="minimal-timeline">
                {timelineItems.map((event, index) => (
                  <motion.div
                    key={`${event.label}-${index}`}
                    className="minimal-timeline-row"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: index * 0.06 }}
                  >
                    <div className="minimal-timeline-left">
                      <div className="minimal-timeline-icon">
                        <img
                          src={iconMap[event.icon] || "/icons/guests.svg"}
                          alt={event.label || ""}
                        />
                      </div>

                      {index !== timelineItems.length - 1 && (
                        <span className="minimal-timeline-line" />
                      )}
                    </div>

                    <div className="minimal-timeline-right">
                      <p className="minimal-timeline-time">
                        {event.time}

                        {event.location && (
                          <>
                            <span className="minimal-timeline-separator">
                              {" "}
                              |{" "}
                            </span>

                            <a
                              href={
                                event.mapLink ||
                                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                  event.location
                                )}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="minimal-timeline-location-inline minimal-timeline-location-link"
                            >
                              {event.location}
                            </a>
                          </>
                        )}
                      </p>

                      {event.label && (
                        <h4 className="minimal-timeline-title">
                          {event.label}
                        </h4>
                      )}

                      {event.note && (
                        <p className="minimal-timeline-note">{event.note}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {shouldShowDressCode && (
            <div className="minimal-extra-card minimal-dresscode-editorial">
              <h3 className="minimal-section-title minimal-script-title">
                {details.dressCodeTitle || t.dressCode}
              </h3>

              {details.dressCodeNote && (
                <p className="minimal-section-note minimal-dresscode-note-editorial">
                  {details.dressCodeNote}
                </p>
              )}

              {details.dressCodeWomen && (
                <div className="minimal-dresscode-role">
                  <p className="minimal-dresscode-role-title">{t.women}</p>
                  <p className="minimal-dresscode-role-text">
                    {details.dressCodeWomen}
                  </p>
                </div>
              )}

              {details.dressCodePalette?.length > 0 && (
                <div className="minimal-palette-box">
                  <div className="minimal-palette minimal-palette-editorial">
                    {details.dressCodePalette.map((color, index) => (
                      <span
                        key={`${color}-${index}`}
                        className="minimal-palette-dot minimal-palette-dot-editorial"
                        style={{ backgroundColor: color }}
                        aria-label={`dress code color ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {details.dressCodeMen && (
                <div className="minimal-dresscode-role minimal-dresscode-role-men">
                  <p className="minimal-dresscode-role-title">{t.men}</p>
                  <p className="minimal-dresscode-role-text">
                    {details.dressCodeMen}
                  </p>
                </div>
              )}
            </div>
          )}

          {details.closingQuote && (
            <p className="minimal-invitation-text minimal-gold-closing-quote">
              {details.closingQuote}
            </p>
          )}

          {details.contactText && (
            <p className="minimal-invitation-note minimal-gold-contact-text">
              {details.contactText}
            </p>
          )}

          {details.mapLink && (
            <div className="minimal-location-section">
              <a
                href={details.mapLink}
                target="_blank"
                rel="noreferrer"
                className="minimal-map-link"
              >
                {t.location}
              </a>
            </div>
          )}

          {details.note && (
            <p className="minimal-invitation-note">{details.note}</p>
          )}
        </div>
      </motion.section>

      <MinimalGoldRSVP
        slug={slug}
        eventType={type}
        brideName={safeBrideName}
        groomName={safeGroomName}
        details={details}
        script={script}
      />

      {details.dateISO && (
       <MinimalGoldCountdown
          targetDate={details.dateISO}
          brideName={safeBrideName}
          groomName={safeGroomName}
          details={details}
          script={script}
        />
      )}
    </>
  );
}

export default MinimalGoldInvitationCard;