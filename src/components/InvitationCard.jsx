import { motion } from "framer-motion";

function InvitationCard({
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  venue,
  message,
}) {
  const handleScrollToRSVP = () => {
    const section = document.getElementById("rsvp");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

 return (
  <section className="invitation-section">
    <motion.div
      className="invitation-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.2 }}
    >
      <div className="invitation-header">
        <div className="invitation-monogram">
          {brideName[0]} <span>&</span> {groomName[0]}
        </div>

        <p className="invitation-eyebrow">
          <span></span>
          Pozivnica
          <span></span>
        </p>

        <h1 className="invitation-title">
          {brideName}
          <span>&</span>
          {groomName}
        </h1>
      </div>

      <p className="invitation-message">{message}</p>

      <div className="invitation-details">
        <div>
          <span>Datum</span>
          <strong>{weddingDate}</strong>
        </div>
        <div>
          <span>Vreme</span>
          <strong>{weddingTime}</strong>
        </div>
        <div>
          <span>Lokacija</span>
          <strong>{venue}</strong>
        </div>
      </div>

      <button className="rsvp-button" onClick={handleScrollToRSVP}>
        Potvrdite dolazak
      </button>
    </motion.div>
  </section>

  );
}

export default InvitationCard;