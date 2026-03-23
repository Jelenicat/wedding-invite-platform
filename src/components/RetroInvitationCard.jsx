import { motion } from "framer-motion";
import RetroRSVP from "./RetroRSVP";
import RetroCountdown from "./RetroCountdown";
import "../styles/card.css";
import "../styles/rsvp.css";

function RetroInvitationCard({
  brideName,
  details = {},
  videoSrc,
  rsvpVideoSrc,
  slug,
  type,
}) {
  const name = brideName || "Jelena";

  return (
    <>
      <section className="retro-invitation">
        <video className="retro-video" autoPlay muted loop playsInline>
          <source src={videoSrc} type="video/mp4" />
        </video>

        <div className="retro-overlay" />

        <div className="retro-center">
          <motion.div
            className="retro-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="retro-card-name">{name}'s</h1>

            <p className="retro-card-title">18TH BIRTHDAY</p>

            <p className="retro-card-text">
              {details?.welcomeText || "Join me for a special celebration."}
            </p>

            <div className="retro-info">
              {details?.date && <p>{details.date}</p>}
              {details?.ceremonyTime && <p>{details.ceremonyTime}</p>}
              {details?.venue && <p>{details.venue}</p>}
            </div>

           
            
          </motion.div>
        </div>
      </section>

      <RetroRSVP
        brideName={brideName}
        details={details}
        slug={slug}
        eventType={type}
        rsvpVideoSrc={rsvpVideoSrc || videoSrc}
      />

      {details?.dateISO && (
        <RetroCountdown
          targetDate={details.dateISO}
          videoSrc={videoSrc}
        />
      )}
    </>
  );
}

export default RetroInvitationCard;