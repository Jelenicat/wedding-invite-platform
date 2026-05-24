import { motion } from "framer-motion";
import BirthdayOneWordRSVP from "./BirthdayOneWordRSVP";
import BirthdayOneWordCountdown from "./BirthdayOneWordCountdown";
import "../styles/card.css";

function BirthdayOneWordInvitationCard({
  slug,
  brideName,
  weddingDate,
  weddingTime,
  venue,
  details = {},
  image1,
  image2,
  image3,
  backgroundImage,
}) {
  const name = brideName || "Nina";

  const dateParts = weddingDate?.split(" ") || [];
  const day = dateParts[0] || "24";
  const month = dateParts[1] || "SEP";
  const year = dateParts[2] || "2026";

  const fallbackImages = [image1, image2, image3].filter(Boolean);

  const images =
    Array.isArray(details?.sliderImages) && details.sliderImages.length > 0
      ? details.sliderImages
      : fallbackImages;

  const sliderImages = [...images, ...images];

  const title = details?.cardTitle || `${name} slavi rođendan`;
  const events = Array.isArray(details?.events) ? details.events : [];

  const getEventIcon = (icon) => {
    if (icon === "church") {
      return (
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3v4M10 5h4M6.5 21V10.5L12 7l5.5 3.5V21"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 21v-5a2.5 2.5 0 0 1 5 0v5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    if (icon === "cake") {
      return (
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M7 10h10v4H7zM5.5 14h13v6h-13z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M9 10V7M12 10V7M15 10V7"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M9 6.2c.6-.8.8-1.2 0-2-.8.8-.6 1.2 0 2ZM12 6.2c.6-.8.8-1.2 0-2-.8.8-.6 1.2 0 2ZM15 6.2c.6-.8.8-1.2 0-2-.8.8-.6 1.2 0 2Z"
            fill="currentColor"
          />
        </svg>
      );
    }

    return (
      <svg viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="8.5"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M12 7.5v5l3 2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <>
      <section
        className="birthday-one-word-card-wrapper"
        style={
          backgroundImage
            ? { backgroundImage: `url(${backgroundImage})` }
            : undefined
        }
      >
        <div className="birthday-one-word-overlay" />

        <motion.div
          className="birthday-one-word-card-inner"
          initial={{ opacity: 0, y: 28, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.p
            className="birthday-title"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.55 }}
          >
            {title}
          </motion.p>

          <motion.div
            className="birthday-date"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.6 }}
          >
            <div className="birthday-date-month">{month}</div>

            <div className="birthday-date-day">
              <span className="heart" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21s-6.5-5.2-9.5-9A5.5 5.5 0 0 1 12 4.5 5.5 5.5 0 0 1 21.5 12c-3 3.8-9.5 9-9.5 9Z" />
                </svg>
              </span>
              {day}
            </div>

            <div className="birthday-date-year">{year}</div>
          </motion.div>

          <motion.div
            className="birthday-info"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26, duration: 0.6 }}
          >
            {events.length > 0 ? (
              <div className="birthday-events-list">
                {events.map((event, index) => (
                  <motion.a
                    key={`${event.label}-${event.time}-${index}`}
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      event.location || ""
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="birthday-info-item birthday-event-item"
                    whileHover={{ y: -1 }}
                  >
                    <span className="birthday-event-content">
                      <span className="birthday-event-title-row">
                        <span className="birthday-info-icon" aria-hidden="true">
                          {getEventIcon(event.icon)}
                        </span>

                        <strong>{event.label}</strong>
                      </span>

                      <span className="birthday-event-meta">
                        {event.time}
                        {event.location ? ` • ${event.location}` : ""}
                      </span>
                    </span>
                  </motion.a>
                ))}
              </div>
            ) : (
              <>
                <motion.a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    venue || ""
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="birthday-info-item"
                  whileHover={{ y: -1 }}
                >
                  <span className="birthday-info-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 21s-6-5.4-6-10a6 6 0 1 1 12 0c0 4.6-6 10-6 10Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="11" r="2.5" fill="currentColor" />
                    </svg>
                  </span>
                  <span>{venue}</span>
                </motion.a>

                <motion.div className="birthday-info-item" whileHover={{ y: -1 }}>
                  <span className="birthday-info-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle
                        cx="12"
                        cy="12"
                        r="8.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <path
                        d="M12 7.5v5l3 2"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span>{weddingTime}</span>
                </motion.div>
              </>
            )}

            {details?.note && (
              <motion.div
                className="birthday-info-note"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.34, duration: 0.55 }}
              >
                {details.note}
              </motion.div>
            )}
          </motion.div>

          {images.length > 0 && (
            <motion.div
              className="birthday-slider-strip"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.7 }}
            >
              <div className="birthday-slider-track">
                {sliderImages.map((img, i) => (
                  <div className="birthday-slider-slide" key={`${img}-${i}`}>
                    <img src={img} alt={`${name} slide ${i + 1}`} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </section>

      <BirthdayOneWordRSVP
        slug={slug}
        eventType="birthday"
        brideName={brideName}
        details={details}
        backgroundImage={backgroundImage}
      />

    <BirthdayOneWordCountdown
  targetDate={details?.dateISO}
  backgroundImage={backgroundImage}
  brideName={brideName}
  venue={venue}
  details={details}
/>
    </>
  );
}

export default BirthdayOneWordInvitationCard;