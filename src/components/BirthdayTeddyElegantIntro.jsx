import { motion } from "framer-motion";
import "../styles/birthdayintro.css";

/* =========================================================
   SRCULENCA OKO KARTICE

   Namerno su raspoređena uz ivice i u donjem delu,
   da ne prelaze preko centralne kartice.
========================================================= */

const floatingHearts = [
  /* GORE */
  {
    top: "6%",
    left: "9%",
    size: "11px",
    delay: "0s",
  },
  {
    top: "9%",
    left: "20%",
    size: "8px",
    delay: "0.7s",
  },
  {
    top: "7%",
    right: "10%",
    size: "12px",
    delay: "1.2s",
  },
  {
    top: "12%",
    right: "20%",
    size: "8px",
    delay: "1.8s",
  },

  /* GORNJE STRANE */
  {
    top: "19%",
    left: "5%",
    size: "10px",
    delay: "1s",
  },
  {
    top: "25%",
    left: "8%",
    size: "14px",
    delay: "0.3s",
  },
  {
    top: "20%",
    right: "5%",
    size: "9px",
    delay: "1.5s",
  },
  {
    top: "26%",
    right: "8%",
    size: "14px",
    delay: "0.6s",
  },

  /* SREDINA LEVO */
  {
    top: "36%",
    left: "3%",
    size: "9px",
    delay: "0.8s",
  },
  {
    top: "43%",
    left: "6%",
    size: "12px",
    delay: "1.4s",
  },
  {
    top: "50%",
    left: "4%",
    size: "8px",
    delay: "0.2s",
  },

  /* SREDINA DESNO */
  {
    top: "35%",
    right: "3%",
    size: "10px",
    delay: "1.7s",
  },
  {
    top: "43%",
    right: "6%",
    size: "13px",
    delay: "0.5s",
  },
  {
    top: "51%",
    right: "4%",
    size: "8px",
    delay: "1.1s",
  },

  /* ISPOD KARTICE */
  {
    bottom: "34%",
    left: "8%",
    size: "9px",
    delay: "0.4s",
  },
  {
    bottom: "30%",
    left: "18%",
    size: "13px",
    delay: "1.6s",
  },
  {
    bottom: "35%",
    right: "8%",
    size: "10px",
    delay: "0.9s",
  },
  {
    bottom: "30%",
    right: "18%",
    size: "13px",
    delay: "1.9s",
  },

  /* DONJI DEO LEVO */
  {
    bottom: "23%",
    left: "7%",
    size: "8px",
    delay: "0.2s",
  },
  {
    bottom: "18%",
    left: "12%",
    size: "11px",
    delay: "1.3s",
  },
  {
    bottom: "13%",
    left: "7%",
    size: "9px",
    delay: "0.7s",
  },

  /* DONJI DEO DESNO */
  {
    bottom: "23%",
    right: "7%",
    size: "9px",
    delay: "1s",
  },
  {
    bottom: "18%",
    right: "13%",
    size: "11px",
    delay: "0.3s",
  },
  {
    bottom: "12%",
    right: "7%",
    size: "9px",
    delay: "1.6s",
  },

  /* JOŠ NEKOLIKO SITNIH */
  {
    top: "16%",
    left: "13%",
    size: "6px",
    delay: "2s",
  },
  {
    top: "31%",
    right: "13%",
    size: "7px",
    delay: "0.4s",
  },
  {
    bottom: "26%",
    left: "27%",
    size: "7px",
    delay: "1.1s",
  },
  {
    bottom: "26%",
    right: "27%",
    size: "7px",
    delay: "1.7s",
  },
];

export default function BirthdayTeddyElegantIntro({
  childName,
  brideName,
  weddingDate,
  birthdayDate,
  backgroundImage,
  details = {},
  onOpen,
  onEnter,
  isOpen = false,
}) {
  /* =======================================================
     IME
  ======================================================= */

  const name =
    childName ||
    details.childName ||
    brideName ||
    "Lana";

  /* =======================================================
     DATUM
  ======================================================= */

  const date =
    birthdayDate ||
    details.birthdayDate ||
    details.date ||
    weddingDate ||
    "";

  /* =======================================================
     POZADINA
  ======================================================= */

  const bgImage =
    details.introBackgroundImage ||
    backgroundImage;

  /* =======================================================
     OTVARANJE POZIVNICE
  ======================================================= */

  const openInvitation = () => {
    if (isOpen) return;

    if (typeof onOpen === "function") {
      onOpen();
      return;
    }

    if (typeof onEnter === "function") {
      onEnter();
    }
  };

  return (
    <section
      className={`teddy-elegant-intro ${
        isOpen ? "is-opening" : ""
      }`}
      style={{
        backgroundImage: bgImage
          ? `url("${bgImage}")`
          : undefined,
      }}
    >
      {/* ===================================================
          VEOMA BLAG OVERLAY
      =================================================== */}

      <div
        className="teddy-elegant-intro__overlay"
        aria-hidden="true"
      />

      {/* ===================================================
          TREPEREĆA SRCULENCA

          Nalaze se iza kartice jer hearts layer ima niži
          z-index od wrap-a.
      =================================================== */}

      <div
        className="teddy-elegant-intro__hearts"
        aria-hidden="true"
      >
        {floatingHearts.map(
          (heart, index) => (
            <span
              key={index}
              className="teddy-elegant-intro__heart"
              style={{
                top: heart.top,
                left: heart.left,
                right: heart.right,
                bottom: heart.bottom,

                fontSize:
                  heart.size,

                animationDelay:
                  heart.delay,
              }}
            >
              ♥
            </span>
          )
        )}
      </div>

      {/* ===================================================
          CENTRALNA KARTICA
      =================================================== */}

      <motion.div
        className="teddy-elegant-intro__wrap"
        initial={{
          opacity: 0,
          y: 22,
          scale: 0.985,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.95,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="teddy-elegant-intro__frame">
          <div className="teddy-elegant-intro__frame-inner">

            {/* mali uvodni tekst */}

            <motion.p
              className="teddy-elegant-intro__eyebrow"
              initial={{
                opacity: 0,
                y: 7,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.75,
                delay: 0.2,
              }}
            >
              Sa ljubavlju vas pozivamo
            </motion.p>

            {/* ime deteta */}

            <motion.h1
              className="teddy-elegant-intro__name"
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.9,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {name}
            </motion.h1>

            {/* prvi rođendan */}

            <motion.p
              className="teddy-elegant-intro__occasion"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                duration: 0.8,
                delay: 0.48,
              }}
            >
              na prvi rođendan
            </motion.p>

            {/* datum */}

            {date && (
              <motion.p
                className="teddy-elegant-intro__date"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.62,
                }}
              >
                {date}
              </motion.p>
            )}

            {/* dugme */}

            <motion.button
              type="button"
              className="teddy-elegant-intro__button"
              onClick={openInvitation}
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.75,
              }}
              whileTap={{
                scale: 0.98,
              }}
            >
              Otvori pozivnicu
            </motion.button>

          </div>
        </div>
      </motion.div>
    </section>
  );
}