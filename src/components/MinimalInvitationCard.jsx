import { motion } from "framer-motion";
import MinimalRSVP from "./MinimalRSVP";
import MinimalCountdown from "./MinimalCountdown";

import "../styles/card.css";
import "../styles/rsvp.css";

function MinimalInvitationCard({
  brideName,
  groomName,
  details = {},
  backgroundImage,
  slug,
  type,
}){
  const safeBrideName = brideName || "Bride";
  const safeGroomName = groomName || "Groom";
  const finalBg = backgroundImage || "/images/minimal-bg.jpg";

  const iconMap = {
    gathering: "/icons/guests.svg",
    church: "/icons/rings.svg",
    civil: "/icons/ceremony.svg",
    restaurant: "/icons/dinner.svg",
    party: "/icons/party.svg",
  };

  const timelineItems =
    details.events?.filter((item) => item.label || item.time) || [];

  return (
    <>
      <motion.section
        className="minimal-invitation-card"
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

          <p className="minimal-invitation-kicker">Pozivnica</p>

          <div className="minimal-invitation-monogram">
            <span>{safeBrideName[0]}</span>
            <span className="minimal-invitation-monogram-and">&</span>
            <span>{safeGroomName[0]}</span>
          </div>

          <h1 className="minimal-invitation-names">
            <span>{safeBrideName}</span>

            <span className="minimal-invitation-amp">
              <svg
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="1"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path d="M12 20
           c-6-4.5-9-7.5-9-11
           c0-2.5 2-4.5 4.5-4.5
           c1.5 0 3 .8 4.5 2.3
           c1.5-1.5 3-2.3 4.5-2.3
           C19 4.5 21 6.5 21 9
           c0 3.5-3 6.5-9 11z" />
</svg>
            </span>

            <span>{safeGroomName}</span>
          </h1>

          {details.welcomeText && (
            <p className="minimal-invitation-text">{details.welcomeText}</p>
          )}

          {details.date && (
            <div className="minimal-invitation-date-block">
              <span className="minimal-invitation-date-label">Datum</span>
              <p className="minimal-invitation-date">{details.date}</p>
            </div>
          )}

          {timelineItems.length > 0 && (
            <div className="minimal-program-card minimal-program-editorial">
              <h3 className="minimal-section-title minimal-script-title">
                Plan venčanja
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
                          alt={event.label}
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
  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
  target="_blank"
  rel="noopener noreferrer"
  className="minimal-timeline-location-inline minimal-timeline-location-link"
>
  {event.location}
</a>
                          </>
                        )}
                      </p>

                      <h4 className="minimal-timeline-title">{event.label}</h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {details.dressCodePalette?.length > 0 && (
            <div className="minimal-extra-card minimal-dresscode-editorial">
              <h3 className="minimal-section-title minimal-script-title">
                {details.dressCodeTitle || "Dress code"}
              </h3>

              {details.dressCodeNote && (
                <p className="minimal-section-note minimal-dresscode-note-editorial">
                  {details.dressCodeNote}
                </p>
              )}

              {details.dressCodeWomen && (
                <div className="minimal-dresscode-role">
                  <p className="minimal-dresscode-role-title">Dame:</p>
                  <p className="minimal-dresscode-role-text">
                    {details.dressCodeWomen}
                  </p>
                </div>
              )}

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

              {details.dressCodeMen && (
                <div className="minimal-dresscode-role minimal-dresscode-role-men">
                  <p className="minimal-dresscode-role-title">Muškarci:</p>
                  <p className="minimal-dresscode-role-text">
                    {details.dressCodeMen}
                  </p>
                </div>
              )}
            </div>
          )}

          {details.mapLink && (
            <div className="minimal-location-section">
              <a
                href={details.mapLink}
                target="_blank"
                rel="noreferrer"
                className="minimal-map-link"
              >
                Pogledaj lokaciju
              </a>
            </div>
          )}

          {details.note && (
            <p className="minimal-invitation-note">{details.note}</p>
          )}
        </div>
      </motion.section>

     <MinimalRSVP slug={slug} eventType={type} />

      {details.dateISO && <MinimalCountdown targetDate={details.dateISO} />}
    </>
  );
}

export default MinimalInvitationCard;