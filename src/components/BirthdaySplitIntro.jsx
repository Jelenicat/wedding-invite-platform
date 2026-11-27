import { motion } from "framer-motion";
import "../styles/intro.css";

function BirthdaySplitIntro({
  slug,
  brideName,
  sliderImages = [],
  backgroundImage,
  onEnter,

  // MUZIKA
  onStartMusic,
  musicStarted = false,
  hasMusic = false,
}) {
  const name = brideName || "Olivia";

  const validImages = sliderImages.filter(Boolean);

  // Dupliramo slike zbog seamless / infinite slidera
  const loopImages = [...validImages, ...validImages];

  /*
   * POSEBNI SLUGOVI
   */
  const isLaraSlug =
    slug === "lara-1";

  const isReljaSlug =
    slug === "relja";

  const isHanaSlug =
    slug === "hana-1";

  /*
   * POZADINSKA SLIKA
   *
   * Lara, Relja i Hana koriste backgroundImage
   * na desnoj strani intro sekcije.
   */
  const hasBirthdaySplitBackground =
    isLaraSlug ||
    isReljaSlug ||
    isHanaSlug;

  /*
   * PLAY MUZIKA
   *
   * Samo Lara i Relja.
   */
  const showMusicButton =
    (isLaraSlug || isReljaSlug) &&
    hasMusic &&
    !musicStarted &&
    typeof onStartMusic === "function";

  // HANA-2: potpuno izolovan intro. Ostali slugovi koriste stari kod.
  if (slug === "hana-2") {
    return (
      <section className="hana2-couture" aria-label={`Pozivnica — ${name}`}>
        <div className="hana2-couture-photos">
          {validImages.length > 0 && (
            <div className="hana2-couture-track">
              {[0, 1].map((copy) => (
                <div
                  className="hana2-couture-photo-group"
                  key={copy}
                  aria-hidden={copy === 1 ? true : undefined}
                >
                  {validImages.map((img, index) => (
                    <div className="hana2-couture-photo" key={`${img}-${index}`}>
                      <img
                        src={img}
                        alt={copy === 0 ? `${name} — fotografija ${index + 1}` : ""}
                        loading="eager"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="hana2-couture-panel">
          <div className="hana2-couture-paper">
            <div className="hana2-couture-frame" aria-hidden="true" />
            <div className="hana2-couture-copy">
              <div className="hana2-couture-age" aria-label="Prvi rođendan">
                <span className="hana2-couture-number" aria-hidden="true">1</span>
                <span className="hana2-couture-one" aria-hidden="true">One</span>
              </div>
              
              <h1 className="hana2-couture-name">{name}</h1>
              <p className="hana2-couture-subtitle">
                slavi svoj prvi rođendan<br />i krštenje
              </p>
              <button
                type="button"
                className="hana2-couture-button"
                onClick={onEnter}
              >
                Pogledaj pozivnicu
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={[
        "birthday-split-intro",

        hasBirthdaySplitBackground
          ? "birthday-split-intro-lara-1"
          : "",

        isReljaSlug
          ? "birthday-split-intro-relja"
          : "",

        isHanaSlug
          ? "birthday-split-intro-hana"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        hasBirthdaySplitBackground &&
        backgroundImage
          ? {
              "--birthday-split-intro-bg": `url(${backgroundImage})`,
            }
          : undefined
      }
    >
      {/* =====================================================
          LEFT - SLIDER
      ===================================================== */}

      <div className="birthday-split-left">
        <div
          className="birthday-split-track"
          style={{
            "--image-count":
              validImages.length || 1,
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

      {/* =====================================================
          RIGHT - TEXT
      ===================================================== */}

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
        {/* ===================================================
            POZADINSKA SLIKA
            Lara / Relja / Hana
        =================================================== */}

        {hasBirthdaySplitBackground &&
          backgroundImage && (
            <div className="birthday-split-lara-background" />
          )}

        <div className="birthday-split-content">

          {/* =================================================
              HEADING 1 / ONE
              ISTI ZA LARU, RELJU I HANU
          ================================================= */}

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
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
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

          {/* =================================================
              SUBTITLE
          ================================================= */}

          {isHanaSlug ? (

            /* ================================================
               HANA
            ================================================ */

            <motion.div
              className="birthday-split-hana-content"
              initial={{
                opacity: 0,
                y: 14,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.3,
                duration: 0.8,
              }}
            >
              <motion.div
                className="birthday-split-hana-name"
                initial={{
                  opacity: 0,
                  y: 10,
                  filter: "blur(4px)",
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                }}
                transition={{
                  delay: 0.25,
                  duration: 0.9,
                }}
              >
                {name}
              </motion.div>

              <motion.div
                className="birthday-split-hana-text"
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.4,
                  duration: 0.7,
                }}
              >
                slavi svoj 1. rođendan
              </motion.div>
            </motion.div>

          ) : isLaraSlug ? (

            /* ================================================
               LARA
            ================================================ */

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
                slavi svoj 1. rođendan 🤎
              </div>
            </motion.div>

          ) : isReljaSlug ? (

            /* ================================================
               RELJA
            ================================================ */

            <motion.div
              className="birthday-split-relja-subtitle"
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
              <span className="birthday-split-relja-line">
                OUR LITTLE BEAR
              </span>

              <span className="birthday-split-relja-line birthday-split-relja-bottom">
                IS TURNING ONE

                <span
                  className="birthday-split-relja-bear"
                  aria-hidden="true"
                >
                  🧸
                </span>
              </span>
            </motion.div>

          ) : (

            /* ================================================
               OSTALI SLUGOVI
            ================================================ */

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

          {/* =================================================
              PLAY MUZIKA
              samo Lara / Relja
          ================================================= */}

          {showMusicButton && (
            <motion.div
              className="birthday-split-music-control"
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.42,
                duration: 0.6,
              }}
            >
              <motion.button
                type="button"
                className="birthday-split-music-circle"
                onClick={onStartMusic}
                aria-label="Pusti muziku"
                whileHover={{
                  scale: 1.06,
                }}
                whileTap={{
                  scale: 0.94,
                }}
              >
                <span
                  className="birthday-split-music-icon"
                  aria-hidden="true"
                />
              </motion.button>

              <span className="birthday-split-music-label">
                Pusti muziku
              </span>
            </motion.div>
          )}

          {/* =================================================
              BUTTON
          ================================================= */}

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
              delay: 0.55,
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