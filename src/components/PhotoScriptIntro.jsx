import { motion } from "framer-motion";

function PhotoScriptIntro({
  brideName,
  groomName,
  videoSrc,
  onEnter,
  script = "latin",
}) {
  const t =
    script === "cyrillic"
      ? {
          openInvitation: "Погледај позивницу",
        }
      : {
          openInvitation: "Pogledaj pozivnicu",
        };

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

      <div className="photo-script-overlay" />

      <motion.div
        className="photo-script-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <motion.h1
          className={`photo-script-names ${
            script === "cyrillic" ? "cyrillic" : ""
          }`}
          initial={{ opacity: 0, scale: 0.92, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
        >
          <motion.span
            className="name"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45 }}
          >
            {brideName}
          </motion.span>

          <motion.span
            className="photo-script-and"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.85, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.85 }}
          >
            &
          </motion.span>

          <motion.span
            className="name"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.65 }}
          >
            {groomName}
          </motion.span>
        </motion.h1>

       <motion.button
  className="photo-script-button"
  onClick={onEnter}
  initial={{ opacity: 0, x: "-50%", y: 18 }}
  animate={{ opacity: 1, x: "-50%", y: 0 }}
  transition={{ duration: 0.9, delay: 1.2 }}
>
  {t.openInvitation}
</motion.button>
      </motion.div>
    </section>
  );
}

export default PhotoScriptIntro;