import { motion } from "framer-motion";
import "../styles/intro.css";

function BirthdayGalleryIntro({
  brideName,
  weddingDate,
  weddingTime,
  venue,
  image1,
  image2,
  image3,
  onEnter,
}) {
  const name = brideName || "James";

  return (
    <section className="birthday-one-intro">
      <motion.div
        className="birthday-one-card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75 }}
      >
        <motion.h1
          className="birthday-one-name"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.65 }}
        >
          {name}
        </motion.h1>

        <motion.p
          className="birthday-one-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.55 }}
        >
          puni
        </motion.p>

        <motion.div
          className="birthday-one-shape"
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.7 }}
        >
          <div className="birthday-one-collage">
            <div className="birthday-one-photo birthday-one-photo-top">
              <img src={image1} alt={`${name} top`} />
            </div>

            <div className="birthday-one-photo birthday-one-photo-middle">
              <img src={image2} alt={`${name} middle`} />
            </div>

            <div className="birthday-one-photo birthday-one-photo-bottom">
              <img src={image3} alt={`${name} bottom`} />
            </div>
          </div>

          
        </motion.div>

        <motion.div
          className="birthday-one-info"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.55 }}
        >
          <p className="birthday-one-date">
            {weddingDate} u {weddingTime}
          </p>
          <p className="birthday-one-location">{venue}</p>
          <p className="birthday-one-rsvp"> Upotpunite moj veliki dan</p>
        </motion.div>

        <motion.button
          className="birthday-one-button"
          onClick={onEnter}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.55 }}
        >
         Otvorite pozivnicu
        </motion.button>
      </motion.div>
    </section>
  );
}

export default BirthdayGalleryIntro;