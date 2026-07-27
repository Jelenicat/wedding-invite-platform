import { motion } from "framer-motion";
import "../styles/birthdayintro.css";

const DEFAULT_BACKGROUND =
  "/images/elena-intro/background.webp";

const DEFAULT_NAME_GRADIENT =
  "linear-gradient(180deg, #8b4c3e 0%, #c7826d 14%, #efc1b0 30%, #b56e5a 48%, #e0a28c 66%, #8a4b3d 82%, #c88670 100%)";

const DEFAULT_AGE_GRADIENT =
  "linear-gradient(180deg, #945445 0%, #d0917b 16%, #efc5b5 31%, #b87560 50%, #dda08b 68%, #85483b 84%, #c47f69 100%)";

function GemHeart({ className = "" }) {
  return (
    <svg
      className={`birthday-intro__gem-svg ${className}`}
      viewBox="0 0 44 40"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="birthdayGem"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop
            offset="0"
            stopColor="#fff8f3"
          />

          <stop
            offset="0.28"
            stopColor="#efc2b2"
          />

          <stop
            offset="0.58"
            stopColor="#c77c69"
          />

          <stop
            offset="0.82"
            stopColor="#9f5d4d"
          />

          <stop
            offset="1"
            stopColor="#f0c7b8"
          />
        </linearGradient>
      </defs>

      <path
        d="M22 35.8 5.9 20.2C-3.8 10.7 9.3-3 19.1 6.5L22 9.4l2.9-2.9C34.7-3 47.8 10.7 38.1 20.2Z"
        fill="url(#birthdayGem)"
        stroke="rgba(143, 82, 66, 0.66)"
        strokeWidth="1.25"
      />

      <path
        d="M7.8 13.1 19.2 7.7 15 20.6 22 34.1 26.2 20.6 36.2 12.9 24.8 8.1 22 10.9 19.2 8.1Z"
        fill="none"
        stroke="rgba(255, 255, 255, 0.54)"
        strokeWidth="1"
      />

      <path
        d="M10.1 10.2c3.2-3.4 6.8-2.2 8.7-.25"
        fill="none"
        stroke="rgba(255, 255, 255, 0.88)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ScrollOrnament({
  position = "top",
}) {
  return (
    <div
      className={`birthday-intro__ornament birthday-intro__ornament--${position}`}
      aria-hidden="true"
    >
      <svg
        className="birthday-intro__ornament-scroll"
        viewBox="0 0 150 40"
      >
        <path d="M68 22c-10-13-23-13-29-5-5 7 2 13 9 9 4-2 4-7 1-9" />

        <path d="M38 20c-9 0-14 4-17 9" />

        <path d="M24 27c-7-7-14-6-19-1" />

        <path d="M82 22c10-13 23-13 29-5 5 7-2 13-9 9-4-2-4-7-1-9" />

        <path d="M112 20c9 0 14 4 17 9" />

        <path d="M126 27c7-7 14-6 19-1" />
      </svg>

      <GemHeart />
    </div>
  );
}

function CenterDivider() {
  return (
    <div
      className="birthday-intro__divider"
      aria-hidden="true"
    >
      <span />

      <GemHeart />

      <span />
    </div>
  );
}

function SideFlourish({
  mirrored = false,
}) {
  return (
    <svg
      className={`birthday-intro__side-flourish ${
        mirrored ? "is-mirrored" : ""
      }`}
      viewBox="0 0 100 34"
      aria-hidden="true"
    >
      <path d="M97 18c-13 0-20-9-30-9-11 0-13 12-5 15 7 3 12-5 6-9" />

      <path d="M61 17c-13 0-20 7-29 7-8 0-12-5-9-10 3-4 10-2 9 3" />

      <path d="M24 17C15 17 9 13 3 8" />
    </svg>
  );
}

function BirthdayIntro({
  slug,
  brideName,
  weddingDate,
  introPreviewImage,
  backgroundImage,
  details = {},
  onEnter,
}) {
  const intro =
    details?.birthdayIntro || {};

  const name =
    intro.name ||
    brideName ||
    "Elena";

  const age =
    intro.age ??
    details?.age ??
    18;

  const date =
    intro.date ||
    details?.date ||
    weddingDate ||
    "12.09.2026.";

  const birthdayLabel =
    intro.birthdayLabel ||
    "ROĐENDAN";

  const buttonText =
    intro.buttonText ||
    "POGLEDAJ POZIVNICU";

  const introBackground =
    intro.backgroundImage ||
    introPreviewImage ||
    backgroundImage ||
    DEFAULT_BACKGROUND;

  const nameGradient =
    intro.nameGradient ||
    (
      intro.nameColor
        ? "none"
        : DEFAULT_NAME_GRADIENT
    );

  const ageGradient =
    intro.ageGradient ||
    (
      intro.ageColor
        ? "none"
        : DEFAULT_AGE_GRADIENT
    );

  const cssVariables = {
    "--birthday-intro-name-color":
      intro.nameColor ||
      "#ae705f",

    "--birthday-intro-name-gradient":
      nameGradient,

    "--birthday-intro-age-color":
      intro.ageColor ||
      "#ae705f",

    "--birthday-intro-age-gradient":
      ageGradient,

    "--birthday-intro-text-color":
      intro.textColor ||
      "#8d5b4c",

    "--birthday-intro-accent-color":
      intro.accentColor ||
      "#bf7b69",

    "--birthday-intro-button-bg":
      intro.buttonBackground ||
      "rgba(247, 218, 203, 0.96)",

    "--birthday-intro-button-text":
      intro.buttonTextColor ||
      "#805245",

    "--birthday-intro-button-border":
      intro.buttonBorderColor ||
      "rgba(181, 113, 92, 0.86)",

    "--birthday-intro-page-bg":
      intro.pageBackground ||
      "#efc4b2",

    "--birthday-intro-bg-position":
      intro.backgroundPosition ||
      "center center",

    "--birthday-intro-bg-size":
      intro.backgroundSize ||
      "cover",

    "--birthday-intro-number-font":
      '"Cormorant Garamond", Georgia, serif',

    "--birthday-intro-text-font":
      '"Cormorant Garamond", Georgia, serif',

    "--birthday-intro-content-top":
      intro.contentTop ||
      "13.9%",

    "--birthday-intro-button-bottom":
      intro.buttonBottom ||
      "8.25%",
  };

  const handleEnter = () => {
    if (
      typeof onEnter === "function"
    ) {
      onEnter();
    }
  };

  return (
    <motion.section
      className={[
        "birthday-intro",
        slug
          ? `birthday-intro--${slug}`
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={cssVariables}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
      }}
    >
      <div
        className="birthday-intro__canvas"
        style={{
          backgroundImage:
            `url("${introBackground}")`,
        }}
      >
        <motion.div
          className="birthday-intro__content"
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.78,
            delay: 0.12,
            ease: "easeOut",
          }}
        >
          <ScrollOrnament
            position="top"
          />

          <h1
            data-text={name}
            className={`birthday-intro__name ${
              nameGradient !== "none"
                ? "has-gradient"
                : ""
            }`}
          >
            {name}
          </h1>

          <CenterDivider />

          <div className="birthday-intro__age-row">
            <SideFlourish />

            <div
              data-text={`${age}.`}
              className={`birthday-intro__age ${
                ageGradient !== "none"
                  ? "has-gradient"
                  : ""
              }`}
            >
              {age}.
            </div>

            <SideFlourish
              mirrored
            />
          </div>

          <div className="birthday-intro__label">
            {birthdayLabel}
          </div>

          <div className="birthday-intro__date">
            {date}
          </div>

          <ScrollOrnament
            position="bottom"
          />
        </motion.div>

        <motion.button
          type="button"
          className="birthday-intro__button"
          onClick={handleEnter}
          aria-label={buttonText}
          initial={{
            opacity: 0,
            y: 14,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.52,
            ease: "easeOut",
          }}
          whileTap={{
            scale: 0.975,
          }}
        >
          <span
            className="birthday-intro__button-gem"
            aria-hidden="true"
          >
            <GemHeart />
          </span>

          <span className="birthday-intro__button-copy">
            {buttonText}
          </span>

          <span
            className="birthday-intro__button-arrow"
            aria-hidden="true"
          >
            →
          </span>
        </motion.button>
      </div>
    </motion.section>
  );
}

export default BirthdayIntro;