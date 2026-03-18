import { motion } from "framer-motion";
import weddingVideo from "../assets/wedding.mp4";

function PhotoScriptIntro({
  brideName,
  groomName,
  videoSrc,
  onEnter,
}) {
  return (
    <section className="photo-script-intro">

 <video
  className="photo-script-bg-video"
  autoPlay
  muted
  loop
  playsInline
  preload="auto"
  poster="/images/fallback.jpg"
>
 <source src={videoSrc || "/videos/wedding.mp4"} type="video/mp4" />
  Your browser does not support the video tag.
</video>

      {/* OVERLAY */}
      <div className="photo-script-overlay" />

      {/* CONTENT */}
      <motion.div
        className="photo-script-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
       <h1 className="photo-script-names">
  <span className="name">{brideName}</span>
  <span className="photo-script-and">&</span>
  <span className="name">{groomName}</span>
</h1>

        <button className="photo-script-button" onClick={onEnter}>
          Pogledaj pozivnicu
        </button>
      </motion.div>
    </section>
  );
}

export default PhotoScriptIntro;