import { motion } from "framer-motion";
import "../styles/intro.css";

function BirthdaySplitIntro({
  slug,
  brideName,
  sliderImages = [],
  backgroundImage,
  onEnter,
}) {
  const name = brideName || "Olivia";

  const validImages = sliderImages.filter(Boolean);

  // Dupliramo slike zbog seamless / infinite slidera
  const loopImages = [...validImages, ...validImages];

  const isLaraSlug = slug === "lara-1";

  return (
    <section
      className={`birthday-split-intro ${
        isLaraSlug ? "birthday-split-intro-lara-1" : ""
      }`}
      style={
        isLaraSlug && backgroundImage
          ? {
              "--birthday-split-intro-bg": `url(${backgroundImage})`,
            }
          : undefined
      }
    >
      {/* LEFT - SLIDER */}
      <div className="birthday-split-left">
        <div
          className="birthday-split-track"
          style={{
            "--image-count": validImages.length || 1,
          }}
        >
          {loopImages.map((img, i) => (
            <div
              className="birthday-split-slide"
              key={`${img}-${i}`}
            >
              <img
                src={img}
                alt={`${name} ${i + 1}`}
                loading="eager"
              />
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT - TEXT */}
      <motion.div
        className="birthday-split-right"
        initial={{
          opacity: 0,
          x: 30,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        transition={{
          duration: 0.9,
        }}
      >
        {/* Background samo za Laru */}
        {isLaraSlug && backgroundImage && (
          <div className="birthday-split-lara-background" />
        )}

        <div className="birthday-split-content">
          {/* HEADING */}
          <div className="birthday-split-heading">
            {/* BIG 1 */}
            <motion.div
              className="birthday-split-one"
              initial={{
                opacity: 0,
                scale: 0.85,
                filter: "blur(6px)",
              }}
              animate={{
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
              }}
              transition={{
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              1
            </motion.div>

            {/* ONE */}
            <motion.h1
              className="birthday-split-title"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.15,
                duration: 0.8,
              }}
            >
              One
            </motion.h1>
          </div>

          {/* SUBTITLE */}
          {isLaraSlug ? (
            <motion.div
              className="birthday-split-subtitle-wrap"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.3,
                duration: 0.7,
              }}
            >
              <div className="birthday-split-subtitle-name">
                {name}
              </div>

              <div className="birthday-split-subtitle-text">
                slavi rođendan!
              </div>
            </motion.div>
          ) : (
            <motion.p
              className="birthday-split-subtitle"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.3,
                duration: 0.7,
              }}
            >
              {name} slavi rođendan!
            </motion.p>
          )}

          {/* BUTTON */}
          <motion.button
            className="birthday-split-btn"
            onClick={onEnter}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.5,
              duration: 0.7,
            }}
            whileHover={{
              y: -2,
            }}
            whileTap={{
              scale: 0.98,
            }}
          >
            Pogledaj pozivnicu
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}

export default BirthdaySplitIntro;