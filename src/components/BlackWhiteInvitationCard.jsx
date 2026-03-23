import { motion } from "framer-motion";
import BlackWhiteRSVP from "./BlackWhiteRSVP";

function BlackWhiteInvitationCard({
  brideName,
  weddingDate,
  weddingTime,
  venue,
  details = {},
  slug,
  type,
}) {
  const name = brideName || "Jelena";
  const videoPath = `/videos/${slug}.mp4`;

  return (
    <>
      <section className="bw-invitation">
        <video className="bw-video" autoPlay muted loop playsInline>
          <source src={videoPath} type="video/mp4" />
        </video>

        <div className="bw-overlay" />

        <motion.div
          className="bw-card"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <p className="bw-kicker">YOU'RE INVITED</p>

          <h1 className="bw-name">{name}</h1>

          <div className="bw-divider" />

          <p className="bw-line">
            {details.date || weddingDate}
          </p>

          <p className="bw-line">
            {details.ceremonyTime || weddingTime}
          </p>

          <p className="bw-location">
            {details.venue || venue}
          </p>
        </motion.div>
      </section>

      {/* 👇 OVO JE KLJUČNO */}
      <BlackWhiteRSVP
        brideName={brideName}
        details={details}
        slug={slug}
        eventType={type}
      />
    </>
  );
}

export default BlackWhiteInvitationCard;