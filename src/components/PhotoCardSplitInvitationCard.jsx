import { motion } from "framer-motion";
import SplitVideoRSVP from "./SplitVideoRSVP";
import SplitVideoCountdown from "./SplitVideoCountdown";
import "../styles/card.css";
import "../styles/rsvp.css";

function PhotoCardSplitInvitationCard({
  brideName,
  groomName,
  details = {},
  slug,
  type,
  script = "latin",
}) {
  const isCyrillic = script === "cyrillic";
  const isNikoletaMarko = slug === "nikoleta-marko";

  const safeBrideName =
    brideName || (isCyrillic ? "Млада" : "Bride");

  const safeGroomName =
    groomName || (isCyrillic ? "Младожења" : "Groom");

  const labels = isCyrillic
    ? {
        invitation: "Позивница",
        waitingForYou: "Чекамо вас",
        atAddress: "на адреси",
        viewLocation: "Погледај локацију",
        dressCode: "Кодекс облачења",
        dressCodeColor: "боја кодекса облачења",
      }
    : {
        invitation: "Pozivnica",
        waitingForYou: "Čekamo vas",
        atAddress: "na adresi",
        viewLocation: "Pogledaj lokaciju",
        dressCode: "Dress code",
        dressCodeColor: "dress code color",
      };

  const iconMap = {
    gathering: "/icons/guests.svg",
    church: "/icons/church.svg",
    civil: "/icons/rings.svg",
    restaurant: "/icons/dinner.svg",
    party: "/icons/party.svg",
  };

  const timelineItems =
    details.events?.filter((item) => item.label || item.time) || [];

  const shouldShowDressCode =
    details.showDressCode &&
    (details.dressCodeTitle ||
      details.dressCodeNote ||
      details.dressCodePalette?.length > 0);

  const sectionStyle =
    isNikoletaMarko && details.cardBackgroundImage
      ? {
          backgroundImage: `url(${details.cardBackgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }
      : undefined;

  const renderMiniCalendar = (dateString) => {
    if (!dateString) return null;

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    const day = date.getDate();

    const monthRaw = date.toLocaleString(
      isCyrillic ? "sr-Cyrl-RS" : "sr-Latn-RS",
      {
        month: "long",
      }
    );

    const month =
      monthRaw.charAt(0).toUpperCase() + monthRaw.slice(1);

    const year = date.getFullYear();

    const nearbyDays = [
      day - 2,
      day - 1,
      day,
      day + 1,
      day + 2,
    ];

    return (
      <div className="photo-card-editorial-calendar">
        <div className="photo-card-editorial-calendar-month">
          <span>{month}</span>
          <span>{year}</span>
        </div>

        <div className="photo-card-editorial-calendar-strip">
          {nearbyDays.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className={`photo-card-editorial-calendar-day ${
                item === day ? "is-active" : ""
              }`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <motion.section
        className={`photo-card-invitation photo-card-editorial photo-card-no-photo ${
          slug ? `photo-card-${slug}` : ""
        }`}
        style={sectionStyle}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="photo-card-invitation-overlay" />

        <div className="photo-card-paper">
          <p className="photo-card-kicker">
            {labels.invitation}
          </p>

          <h1 className="photo-card-invitation-names">
            <span>{safeBrideName}</span>

            <span className="photo-card-invitation-and">
              &
            </span>

            <span>{safeGroomName}</span>
          </h1>

          {details.welcomeText && (
            <p className="photo-card-invitation-text">
              {details.welcomeText}
            </p>
          )}

          {renderMiniCalendar(details.dateISO)}

          {timelineItems.length > 0 && (
            <div className="photo-card-editorial-timeline">
              {timelineItems.map((event, index) => (
                <motion.div
                  key={`${event.label}-${index}`}
                  className="photo-card-editorial-timeline-row"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.08,
                  }}
                >
                  <div className="photo-card-editorial-timeline-side left">
                    {index % 2 === 0 && (
                      <>
                        {event.time && (
                          <p className="photo-card-editorial-time">
                            {event.time}
                          </p>
                        )}

                        {event.label && (
                          <h4 className="photo-card-editorial-event-title">
                            {event.label}
                          </h4>
                        )}

                        {event.location &&
                          (event.mapLink ? (
                            <a
                              href={event.mapLink}
                              target="_blank"
                              rel="noreferrer"
                              className="photo-card-editorial-location-inline is-link"
                            >
                              {event.location}
                            </a>
                          ) : (
                            <p className="photo-card-editorial-location-inline">
                              {event.location}
                            </p>
                          ))}
                      </>
                    )}
                  </div>

                  <div className="photo-card-editorial-timeline-center">
                    <span className="photo-card-editorial-dot" />

                    <span className="photo-card-editorial-line" />

                    <div className="photo-card-editorial-icon">
                      <img
                        src={
                          iconMap[event.icon] ||
                          "/icons/guests.svg"
                        }
                        alt={event.label || ""}
                      />
                    </div>
                  </div>

                  <div className="photo-card-editorial-timeline-side right">
                    {index % 2 !== 0 && (
                      <>
                        {event.time && (
                          <p className="photo-card-editorial-time">
                            {event.time}
                          </p>
                        )}

                        {event.label && (
                          <h4 className="photo-card-editorial-event-title">
                            {event.label}
                          </h4>
                        )}

                        {event.location &&
                          (event.mapLink ? (
                            <a
                              href={event.mapLink}
                              target="_blank"
                              rel="noreferrer"
                              className="photo-card-editorial-location-inline is-link"
                            >
                              {event.location}
                            </a>
                          ) : (
                            <p className="photo-card-editorial-location-inline">
                              {event.location}
                            </p>
                          ))}
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {details.venue && (
            <div className="photo-card-editorial-location-box">
              <h3 className="photo-card-editorial-location-title">
                {labels.waitingForYou}
              </h3>

              <p className="photo-card-editorial-location-text">
                {labels.atAddress}
                <br />
                {details.venue}
              </p>

              {details.mapLink && (
                <a
                  href={details.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="photo-card-editorial-location-link"
                >
                  {labels.viewLocation}
                </a>
              )}
            </div>
          )}

          {shouldShowDressCode && (
            <div className="photo-card-editorial-dresscode">
              <h3 className="photo-card-editorial-script photo-card-editorial-dresscode-title">
                {details.dressCodeTitle || labels.dressCode}
              </h3>

              {details.dressCodeNote && (
                <p className="photo-card-editorial-dresscode-note">
                  {details.dressCodeNote}
                </p>
              )}

              {details.dressCodePalette?.length > 0 && (
                <div className="photo-card-editorial-palette-shell">
                  <div className="photo-card-palette photo-card-editorial-palette">
                    {details.dressCodePalette.map(
                      (color, index) => (
                        <span
                          key={`${color}-${index}`}
                          className="photo-card-palette-dot photo-card-editorial-palette-dot"
                          style={{
                            backgroundColor: color,
                          }}
                          aria-label={`${labels.dressCodeColor} ${
                            index + 1
                          }`}
                        />
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {details.note && (
            <p className="photo-card-note">
              {details.note}
            </p>
          )}
        </div>
      </motion.section>

      <SplitVideoRSVP
        slug={slug}
        eventType={type}
        details={details}
        script={script}
      />

      {details.dateISO && (
        <SplitVideoCountdown
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

export default PhotoCardSplitInvitationCard;