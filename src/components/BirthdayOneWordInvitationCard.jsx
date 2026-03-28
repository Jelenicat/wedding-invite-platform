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

  const images = [image1, image2, image3].filter(Boolean);
  const sliderImages = [...images, ...images];

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
            {name} slavi rođendan
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

            <motion.div
              className="birthday-info-item"
              whileHover={{ y: -1 }}
            >
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
      />
    </>
  );
}

export default BirthdayOneWordInvitationCard;