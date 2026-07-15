import { motion } from "framer-motion";
import SilkPhotoRSVP from "./SilkPhotoRSVP";
import SilkPhotoCountdown from "./SilkPhotoCountdown";
import "../styles/card.css";

const CYRILLIC_PATTERN = /[А-Яа-яЉЊЋЂЏђћљњџ]/;

function SilkPhotoInvitationCard({
  brideName,
  groomName,
  weddingDate,
  details = {},
  backgroundImage,
  image,
  imageSrc,
  slug = "",
  type = "wedding",
  script = "latin",
}) {
  const isCyrillic =
    script === "cyrillic" ||
    details.script === "cyrillic" ||
    CYRILLIC_PATTERN.test(`${brideName || ""} ${groomName || ""}`);

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

  const safeBrideName =
    brideName || (isCyrillic ? "Млада" : "Mlada");

  const safeGroomName =
    groomName || (isCyrillic ? "Младожења" : "Mladoženja");

  const theme = details.theme || {};

  const cardImage =
    details.cardBackgroundImage ||
    details.invitationBackgroundImage ||
    imageSrc ||
    image ||
    backgroundImage;

  const timelineItems =
    details.events?.filter(
      (event) =>
        event?.time ||
        event?.label ||
        event?.location,
    ) || [];

  const shouldShowDressCode =
    details.showDressCode === true &&
    (details.dressCodeTitle ||
      details.dressCodeNote ||
      details.dressCodePalette?.length > 0);

  const iconMap = {
    gathering: "/icons/guests.svg",
    church: "/icons/church.svg",
    civil: "/icons/rings.svg",
    restaurant: "/icons/dinner.svg",
    dinner: "/icons/dinner.svg",
    party: "/icons/party.svg",
  };

  const themeStyles = {
    "--silk-photo-page-bg":
      theme.backgroundColor || "#e8e1da",

    "--silk-photo-paper":
      theme.cardPaper ||
      "rgba(255, 252, 248, 0.86)",

    "--silk-photo-paper-border":
      theme.cardBorder ||
      "rgba(92, 83, 77, 0.14)",

    "--silk-photo-inner-border":
      theme.cardInnerBorder ||
      "rgba(92, 83, 77, 0.11)",

    "--silk-photo-main-text":
      theme.mainText || "#514943",

    "--silk-photo-soft-text":
      theme.softText || "#746961",

    "--silk-photo-muted-text":
      theme.mutedText || "#887c74",

    "--silk-photo-accent":
      theme.accent || "#a77958",

    "--silk-photo-accent-strong":
      theme.accentStrong || "#7f563c",

    "--silk-photo-on-accent":
      theme.onAccent || "#fffaf5",

    "--silk-photo-location-soft":
      theme.locationSoftText ||
      "rgba(255, 250, 245, 0.9)",

    "--silk-photo-overlay":
      theme.cardPhotoOverlay ||
      "rgba(255, 255, 255, 0.58)",

    "--silk-photo-overlay-bottom":
      theme.cardPhotoOverlayBottom ||
      "rgba(255, 255, 255, 0.72)",

    "--silk-photo-shadow":
      theme.cardShadow ||
      "rgba(62, 48, 40, 0.13)",

    "--silk-photo-name-font":
      theme.nameFont ||
      '"Italianno", "Great Vibes", cursive',

    "--silk-photo-script-font":
      theme.scriptFont ||
      '"Allura", "Great Vibes", cursive',

    backgroundImage: cardImage
      ? `url(${cardImage})`
      : undefined,

    backgroundPosition:
      details.cardBackgroundPosition ||
      "center",
  };

  const renderMiniCalendar = (dateString) => {
    if (!dateString) {
      return null;
    }

    const targetDate = new Date(dateString);

    if (Number.isNaN(targetDate.getTime())) {
      return null;
    }

    const locale = isCyrillic
      ? "sr-Cyrl-RS"
      : "sr-Latn-RS";

    const month =
      targetDate.toLocaleDateString(locale, {
        month: "long",
      });

    const year = targetDate.getFullYear();

    const calendarDays = [
      -2,
      -1,
      0,
      1,
      2,
    ].map((offset) => {
      const date = new Date(targetDate);

      date.setDate(
        targetDate.getDate() + offset,
      );

      return {
        day: date.getDate(),
        isActive: offset === 0,
        key: date.toISOString(),
      };
    });

    return (
      <div className="silk-photo-card__mini-calendar">
        <div className="silk-photo-card__mini-calendar-heading">
          <span className="silk-photo-card__mini-calendar-month">
            {month}
          </span>

          <span className="silk-photo-card__mini-calendar-year">
            {year}
          </span>
        </div>

        <div className="silk-photo-card__mini-calendar-days">
          {calendarDays.map((item) => (
            <span
              key={item.key}
              className={`silk-photo-card__mini-calendar-day ${
                item.isActive
                  ? "is-active"
                  : ""
              }`}
            >
              {item.day}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const nameConnector =
    details.nameConnector || "heart";

  const renderNameConnector = () => {
    if (nameConnector === "ampersand") {
      return (
        <span
          className="silk-photo-card__ampersand"
          aria-hidden="true"
        >
          &amp;
        </span>
      );
    }

    return (
      <span
        className="silk-photo-card__heart"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="
              M12 20
              c-6-4.5-9-7.5-9-11
              0-2.5 2-4.5 4.5-4.5
              1.5 0 3 .8 4.5 2.3
              1.5-1.5 3-2.3 4.5-2.3
              C19 4.5 21 6.5 21 9
              c0 3.5-3 6.5-9 11z
            "
          />
        </svg>
      </span>
    );
  };

  const renderEventContent = (event) => (
    <>
      {event.time && (
        <p className="silk-photo-card__timeline-time">
          {event.time}
        </p>
      )}

      {event.label && (
        <h4 className="silk-photo-card__timeline-title">
          {event.label}
        </h4>
      )}

      {event.location &&
        (event.mapLink ? (
          <a
            href={event.mapLink}
            target="_blank"
            rel="noreferrer"
            className="silk-photo-card__timeline-location is-link"
          >
            {event.location}
          </a>
        ) : (
          <p className="silk-photo-card__timeline-location">
            {event.location}
          </p>
        ))}
    </>
  );

  return (
    <>
      <motion.section
        className={`silk-photo-card ${
          isCyrillic
            ? "silk-photo-card--cyrillic"
            : ""
        } ${
          slug
            ? `silk-photo-card--${slug}`
            : ""
        }`}
        style={themeStyles}
        initial={{
          opacity: 0,
          y: 24,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
        }}
      >
        <div className="silk-photo-card__overlay" />

        <div className="silk-photo-card__paper">
          <p className="silk-photo-card__kicker">
            {details.invitationKicker ||
              labels.invitation}
          </p>

          <h1 className="silk-photo-card__names">
            <span>{safeBrideName}</span>

            {renderNameConnector()}

            <span>{safeGroomName}</span>
          </h1>

          {details.welcomeText && (
            <p className="silk-photo-card__welcome">
              {details.welcomeText}
            </p>
          )}

          {renderMiniCalendar(
            details.dateISO,
          )}

          {timelineItems.length > 0 && (
            <div className="silk-photo-card__timeline">
              {timelineItems.map(
                (event, index) => (
                  <motion.div
                    key={`${
                      event.label || "event"
                    }-${index}`}
                    className="silk-photo-card__timeline-row"
                    initial={{
                      opacity: 0,
                      y: 24,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.2,
                    }}
                    transition={{
                      duration: 0.45,
                      delay:
                        index * 0.08,
                    }}
                  >
                    <div className="silk-photo-card__timeline-side left">
                      {index % 2 ===
                        0 &&
                        renderEventContent(
                          event,
                        )}
                    </div>

                    <div className="silk-photo-card__timeline-center">
                      <span className="silk-photo-card__timeline-dot" />

                      <span className="silk-photo-card__timeline-line" />

                      <div className="silk-photo-card__timeline-icon">
                        <img
                          src={
                            event.iconSrc ||
                            iconMap[
                              event.icon
                            ] ||
                            "/icons/guests.svg"
                          }
                          alt={
                            event.label ||
                            ""
                          }
                        />
                      </div>
                    </div>

                    <div className="silk-photo-card__timeline-side right">
                      {index % 2 !==
                        0 &&
                        renderEventContent(
                          event,
                        )}
                    </div>
                  </motion.div>
                ),
              )}
            </div>
          )}

        {details.venue && (
  <div className="silk-photo-card__location-box">
    <h3>
      {details.locationTitle || labels.waitingForYou}
    </h3>

    <p className="silk-photo-card__location-venue">
      {details.venue}
    </p>

    {details.venueAddress && (
      <p className="silk-photo-card__location-address">
        {details.venueAddress}
      </p>
    )}

    {details.mapLink && (
      <a
        href={details.mapLink}
        target="_blank"
        rel="noreferrer"
      >
        {details.mapButtonText || labels.viewLocation}
      </a>
    )}
  </div>
)}

          {shouldShowDressCode && (
            <div className="silk-photo-card__dresscode">
              <h3>
                {details.dressCodeTitle ||
                  labels.dressCode}
              </h3>

              {details.dressCodeNote && (
                <p>
                  {
                    details.dressCodeNote
                  }
                </p>
              )}

              {details
                .dressCodePalette
                ?.length > 0 && (
                <div className="silk-photo-card__palette-shell">
                  <div className="silk-photo-card__palette">
                    {details.dressCodePalette.map(
                      (
                        color,
                        index,
                      ) => (
                        <span
                          key={`${color}-${index}`}
                          style={{
                            backgroundColor:
                              color,
                          }}
                          aria-label={`${labels.dressCodeColor} ${
                            index + 1
                          }`}
                        />
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {details.note && (
            <p className="silk-photo-card__note">
              {details.note}
            </p>
          )}
        </div>
      </motion.section>

      <SilkPhotoRSVP
        slug={slug}
        eventType={type}
        details={details}
        script={script}
      />

      {details.dateISO && (
        <SilkPhotoCountdown
          targetDate={
            details.dateISO
          }
          brideName={
            safeBrideName
          }
          groomName={
            safeGroomName
          }
          details={details}
          script={script}
          slug={slug}
        />
      )}
    </>
  );
}

export default SilkPhotoInvitationCard;