import { motion } from "framer-motion";
import BirthdayGalleryRSVP from "./BirthdayGalleryRSVP";
import BirthdayGalleryCountdown from "./BirthdayGalleryCountdown.jsx";
import "../styles/card.css";
import "../styles/rsvp.css";

function BirthdayGalleryInvitationCard({
  brideName,
  weddingDate,
  weddingTime,
  venue,
  details = {},
  image1,
  image2,
  image3,
  backgroundImage,
  slug,
  type,
}) {
  const name = brideName || "Viktor";

  const dateParts = weddingDate?.split(" ") || [];
  const day = dateParts[0] || "10";
  const month = dateParts[1] || "SEP";
  const year = dateParts[2] || "2026";

  return (
    <>
      <section
        className="birthday-gallery-card"
        style={
          backgroundImage
            ? { "--birthday-card-bg": `url(${backgroundImage})` }
            : undefined
        }
      >
        <div className="birthday-gallery-bg-image" />
        <div className="birthday-gallery-bg-overlay" />
        <div className="birthday-gallery-glow birthday-gallery-glow-one" />
        <div className="birthday-gallery-glow birthday-gallery-glow-two" />

        <motion.div
          className="birthday-gallery-inner"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <motion.div
            className="birthday-gallery-slider-wrap birthday-gallery-slider-top"
            initial={{ opacity: 0, y: -10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.08, duration: 0.8 }}
          >
            <div className="birthday-gallery-slider-track">
              {[image1, image2, image3, image1, image2, image3].map((img, i) => (
                <div className="birthday-gallery-slide" key={i}>
                  <img src={img} alt={`${name} ${i + 1}`} />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="birthday-gallery-heading"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.7 }}
          >
            <p className="birthday-gallery-kicker">BIRTHDAY CELEBRATION</p>
            <h1 className="birthday-gallery-title">{name}</h1>
            <p className="birthday-gallery-subtitle">First birthday celebration</p>
          </motion.div>

          <motion.div
            className="birthday-gallery-calendar"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34, duration: 0.65 }}
          >
            <div className="birthday-gallery-calendar-top">SAVE THE DATE</div>
            <div className="birthday-gallery-calendar-body">
              <span className="birthday-gallery-calendar-month">{month}</span>
              <span className="birthday-gallery-calendar-day">{day}</span>
              <span className="birthday-gallery-calendar-year">{year}</span>
              <div className="birthday-gallery-calendar-ring" />
            </div>
          </motion.div>

          <motion.div
            className="birthday-gallery-info-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.7 }}
          >
            <div className="birthday-gallery-info-row">
              <span className="birthday-gallery-info-label">Kada</span>
              <p className="birthday-gallery-info-value">
                {weddingDate} u {weddingTime}
              </p>
            </div>

            <div className="birthday-gallery-info-divider" />

            <div className="birthday-gallery-info-row">
              <span className="birthday-gallery-info-label">Gde</span>
              <p className="birthday-gallery-info-value">{venue}</p>
            </div>

            {details?.note && (
              <>
                <div className="birthday-gallery-info-divider" />
                <div className="birthday-gallery-info-row">
                  <span className="birthday-gallery-info-label">Napomena</span>
                  <p className="birthday-gallery-info-value">{details.note}</p>
                </div>
              </>
            )}
          </motion.div>

          <motion.p
            className="birthday-gallery-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.6 }}
          >
            Radujemo se da zajedno obeležimo ovaj poseban dan.
          </motion.p>
        </motion.div>
      </section>

      <BirthdayGalleryRSVP
        slug={slug}
        eventType={type}
        brideName={brideName}
        details={details}
        backgroundImage={backgroundImage}
      />

      {details.dateISO && <BirthdayGalleryCountdown targetDate={details.dateISO} />}
    </>
  );
}

export default BirthdayGalleryInvitationCard;