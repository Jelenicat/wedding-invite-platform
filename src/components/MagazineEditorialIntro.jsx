import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function MagazineEditorialIntro({
  slug,
  brideName,
  groomName,
  weddingDate,
  backgroundImage,
  videoSrc,
  details = {},
  onEnter,
}) {
  const [videoReady, setVideoReady] = useState(false);

  const bg =
    backgroundImage ||
    details?.backgroundImage ||
    "/images/magazine-intro-bg.png";

  const hasVideoBackground =
    slug === "nina-milan-magazine" && Boolean(videoSrc);

  useEffect(() => {
    setVideoReady(false);
  }, [slug, videoSrc]);

  const dateText = details?.date || weddingDate || "21 JUL 2026";

  const [day = "21", month = "JUL", year = "2026"] = dateText
    .replaceAll(".", "")
    .split(" ")
    .filter(Boolean);

  const ticketNumber =
    details?.ticketNumber ||
    `${String(day).padStart(2, "0")}${month || "JUL"}${year || ""}`
      .replace(/\s/g, "")
      .toUpperCase();

  return (
    <section
      className="mag-intro"
      style={{
        backgroundColor: hasVideoBackground ? "#111111" : undefined,
      }}
    >
      {hasVideoBackground ? (
        <motion.video
          className="mag-intro-bg mag-intro-bg-video"
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setVideoReady(true)}
          onCanPlay={() => setVideoReady(true)}
          initial={{
            scale: 1.06,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: videoReady ? 1 : 0,
          }}
          transition={{
            scale: {
              duration: 1.6,
              ease: "easeOut",
            },
            opacity: {
              duration: 0.45,
              ease: "easeOut",
            },
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            backgroundColor: "#111111",
          }}
        />
      ) : (
        <motion.div
          className="mag-intro-bg"
          style={{
            backgroundImage: `url(${bg})`,
          }}
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 1.6,
            ease: "easeOut",
          }}
        />
      )}

      <div className="mag-intro-overlay" />
      <div className="mag-intro-grain" />

      <motion.div
        className="mag-intro-content"
        initial={{
          opacity: 0,
          y: 18,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 1.05,
          ease: "easeOut",
        }}
      >
        <header className="mag-intro-header">
          <motion.h1
            className="mag-intro-title"
            initial={{
              opacity: 0,
              y: -18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.1,
              duration: 1,
            }}
          >
            VENČANJE
          </motion.h1>

          <motion.div
            className="mag-intro-issue"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.45,
              duration: 0.9,
            }}
          >
            <span>{dateText}</span>
            <span>VENČANO IZDANJE</span>
            <span>ZAUVEK POČINJE</span>
          </motion.div>

          <motion.div
            className="mag-intro-magazine"
            initial={{
              opacity: 0,
              x: 18,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.55,
              duration: 0.9,
            }}
          >
            MAGAZIN
          </motion.div>
        </header>

        <motion.div
          className="mag-intro-left-copy"
          initial={{
            opacity: 0,
            x: -18,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            delay: 0.75,
            duration: 0.9,
          }}
        >
          <p>LJUBAVNA PRIČA</p>
          <p>VREDNA SLAVLJA.</p>

          <span />

          <p>PRIDRUŽITE NAM SE</p>
          <p>NA POČETKU ZAUVEK.</p>
        </motion.div>

        <motion.div
          className="mag-intro-names"
          initial={{
            opacity: 0,
            y: 28,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.95,
            duration: 1,
          }}
        >
          <div className="mag-intro-script">Najlepši dan</div>

          <div className="mag-intro-couple">
            <span>{brideName}</span>

            <span className="mag-intro-amp">
              &amp;
            </span>

            <span>{groomName}</span>
          </div>
        </motion.div>

        <motion.div
          className="mag-intro-date-block"
          initial={{
            opacity: 0,
            x: 18,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            delay: 1.05,
            duration: 0.9,
          }}
        >
          <strong>{day}</strong>
          <span>{month}</span>
          <small>{year}</small>
        </motion.div>

        <motion.button
          type="button"
          className="mag-intro-button"
          onClick={onEnter}
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 1.25,
            duration: 0.85,
          }}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
        >
          OTVORI POZIVNICU
          <span />
        </motion.button>
      </motion.div>
    </section>
  );
}

export default MagazineEditorialIntro;