import { motion } from "framer-motion";

function PhotoCardIntro({
  brideName,
  groomName,
  weddingDate,
  venue,
  image,
  backgroundImage,
  onEnter,
}) {
  const finalBg = backgroundImage || "/images/photo-card-bg.jpg";
  const finalImage = image || "/images/couple.jpg";

  return (
    <section
      className="photo-card-intro"
      style={{ backgroundImage: `url(${finalBg})` }}
    >
      <motion.div
        layoutId="card"
        className="photo-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="photo-card-title">Sačuvaj datum</p>

        <div className="photo-frame">
          <img src={finalImage} alt="couple" />
        </div>

        <p className="photo-card-names">
          {brideName} & {groomName}
        </p>

        <p className="photo-card-date">{weddingDate}</p>

        <div className="photo-divider" />

       <p className="photo-location">{venue}</p>

        <button className="photo-card-btn" onClick={onEnter}>
          Pogledaj pozivnicu
        </button>
      </motion.div>
    </section>
  );
}

export default PhotoCardIntro;