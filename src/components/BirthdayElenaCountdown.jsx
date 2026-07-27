import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { addToCalendar } from "../utils/calendar";
import "../styles/birthdaycountdown.css";

function GemHeart({ className = "" }) {
  return (
    <svg
      className={`birthday-elena-countdown__gem ${className}`}
      viewBox="0 0 44 40"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="birthdayElenaCountdownGem"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0" stopColor="#fff8f3" />
          <stop offset="0.25" stopColor="#f3cabb" />
          <stop offset="0.55" stopColor="#d28a74" />
          <stop offset="0.8" stopColor="#a85f4e" />
          <stop offset="1" stopColor="#f1c7b7" />
        </linearGradient>
      </defs>

      <path
        d="M22 35.8 5.9 20.2C-3.8 10.7 9.3-3 19.1 6.5L22 9.4l2.9-2.9C34.7-3 47.8 10.7 38.1 20.2Z"
        fill="url(#birthdayElenaCountdownGem)"
        stroke="rgba(143,82,66,.62)"
        strokeWidth="1.15"
      />

      <path
        d="M7.8 13.1 19.2 7.7 15 20.6 22 34.1 26.2 20.6 36.2 12.9 24.8 8.1 22 10.9 19.2 8.1Z"
        fill="none"
        stroke="rgba(255,255,255,.48)"
        strokeWidth="1"
      />
    </svg>
  );
}

function OutlineHeart() {
  return (
    <svg
      className="birthday-elena-countdown__outline-heart"
      viewBox="0 0 48 44"
      aria-hidden="true"
    >
      <path d="M24 39 6.9 22.5C-3.2 12.7 10.4-1.4 20.6 8.4L24 11.7l3.4-3.3c10.2-9.8 23.8 4.3 13.7 14.1Z" />
    </svg>
  );
}

function Ornament() {
  return (
    <div
      className="birthday-elena-countdown__ornament"
      aria-hidden="true"
    >
      <span />
      <GemHeart />
      <span />
    </div>
  );
}

function calculateTimeLeft(targetDate) {
  const targetTime = new Date(targetDate).getTime();

  if (Number.isNaN(targetTime)) {
    return null;
  }

  const difference = targetTime - Date.now();

  if (difference <= 0) {
    return null;
  }

  return {
    days: Math.floor(
      difference / (1000 * 60 * 60 * 24)
    ),
    hours: Math.floor(
      (difference / (1000 * 60 * 60)) % 24
    ),
    minutes: Math.floor(
      (difference / (1000 * 60)) % 60
    ),
    seconds: Math.floor(
      (difference / 1000) % 60
    ),
  };
}

function BirthdayElenaCountdown({
  slug,
  targetDate,
  brideName,
  weddingDate,
  weddingTime,
  venue,
  details = {},
  backgroundImage,
  script,
  showCalendarButton,
}) {
  const activeScript =
    script ||
    details?.script ||
    "latin";

  const isCyrillic =
    activeScript === "cyrillic";

  const countdownConfig =
    details?.birthdayGalleryCountdown &&
    typeof details.birthdayGalleryCountdown === "object"
      ? details.birthdayGalleryCountdown
      : {};

  const name =
    details?.birthdayIntro?.name ||
    brideName ||
    (isCyrillic ? "Елена" : "Elena");

  const age =
    details?.age ??
    details?.birthdayIntro?.age ??
    18;

  const text = isCyrillic
    ? {
        kicker: "ОДБРОЈАВАЊЕ",
        title: "ДО ПРОСЛАВЕ ЈЕ ОСТАЛО",
        finishedTitle: "ПОСЕБАН ДАН ЈЕ СТИГАО",
        finishedText:
          "Видимо се на прослави!",
        days: "ДАНА",
        hours: "САТИ",
        minutes: "МИНУТА",
        seconds: "СЕКУНДИ",
        calendarButton:
          "ДОДАЈ У КАЛЕНДАР",
        calendarHint:
          "Сачувајте датум прославе у свом телефону.",
        dateLabel: "ДАТУМ",
        timeLabel: "ВРЕМЕ",
        venueLabel: "МЕСТО",
      }
    : {
        kicker: "ODBROJAVANJE",
        title: "DO PROSLAVE JE OSTALO",
        finishedTitle:
          "POSEBAN DAN JE STIGAO",
        finishedText:
          "Vidimo se na proslavi!",
        days: "DANA",
        hours: "SATI",
        minutes: "MINUTA",
        seconds: "SEKUNDI",
        calendarButton:
          "DODAJ U KALENDAR",
        calendarHint:
          "Sačuvajte datum proslave u svom telefonu.",
        dateLabel: "DATUM",
        timeLabel: "VREME",
        venueLabel: "MESTO",
      };

  const countdownBackground =
    countdownConfig?.backgroundImage ||
    (
      typeof details?.birthdayGalleryCountdown ===
      "string"
        ? details.birthdayGalleryCountdown
        : ""
    ) ||
    details?.countdownBackgroundImage ||
    backgroundImage ||
    details?.cardBackground ||
    details?.birthdayIntro?.backgroundImage ||
    "/images/elena-intro/elena-countdown-background.webp";

  const kicker =
    countdownConfig?.kicker ||
    text.kicker;

  const title =
    countdownConfig?.title ||
    text.title;

  const finishedTitle =
    countdownConfig?.finishedTitle ||
    text.finishedTitle;

  const finishedText =
    countdownConfig?.finishedText ||
    text.finishedText;

  const displayedDate =
    countdownConfig?.date ||
    details?.date ||
    weddingDate ||
    "";

  const displayedTime =
    countdownConfig?.time ||
    weddingTime ||
    "";

  const displayedVenue =
    countdownConfig?.venue ||
    details?.locationName ||
    details?.venue ||
    venue ||
    "";

  const shouldShowCalendar =
    showCalendarButton ??
    countdownConfig?.showCalendarButton ??
    details?.showCalendarButton ??
    false;

  const [timeLeft, setTimeLeft] = useState(
    () => calculateTimeLeft(targetDate)
  );

  useEffect(() => {
    setTimeLeft(
      calculateTimeLeft(targetDate)
    );

    const interval = window.setInterval(() => {
      setTimeLeft(
        calculateTimeLeft(targetDate)
      );
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [targetDate]);

  const items = useMemo(() => {
    if (!timeLeft) {
      return [];
    }

    return [
      {
        key: "days",
        label: text.days,
        value: timeLeft.days,
      },
      {
        key: "hours",
        label: text.hours,
        value: timeLeft.hours,
      },
      {
        key: "minutes",
        label: text.minutes,
        value: timeLeft.minutes,
      },
      {
        key: "seconds",
        label: text.seconds,
        value: timeLeft.seconds,
      },
    ];
  }, [timeLeft, text.days, text.hours, text.minutes, text.seconds]);

  const handleCalendarClick = () => {
    addToCalendar({
      brideName: name,
      groomName: "",
      dateISO: targetDate,
      venue:
        details?.venue ||
        displayedVenue,
      mapLink:
        details?.mapLink,
      note:
        details?.note,
      durationHours:
        details?.calendarDurationHours,
    });
  };

  return (
    <motion.section
      className={[
        "birthday-elena-countdown",
        slug
          ? `birthday-elena-countdown--${slug}`
          : "",
        isCyrillic
          ? "birthday-elena-countdown--cyrillic"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
      lang={
        isCyrillic
          ? "sr-Cyrl"
          : "sr-Latn"
      }
      style={{
        "--birthday-elena-countdown-bg":
          `url("${countdownBackground}")`,
      }}
      initial={{
        opacity: 0,
      }}
      whileInView={{
        opacity: 1,
      }}
      viewport={{
        once: true,
        amount: 0.08,
      }}
      transition={{
        duration: 0.7,
      }}
    >
      <div className="birthday-elena-countdown__stage">
        <div className="birthday-elena-countdown__background" />
        <div className="birthday-elena-countdown__overlay" />

        <motion.div
          className="birthday-elena-countdown__content"
          initial={{
            opacity: 0,
            y: 22,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <GemHeart className="birthday-elena-countdown__top-gem" />

          <p className="birthday-elena-countdown__kicker">
            {kicker}
          </p>

          <h2 className="birthday-elena-countdown__title">
            {timeLeft
              ? title
              : finishedTitle}
          </h2>

          <Ornament />

          {timeLeft ? (
            <>
              <div className="birthday-elena-countdown__grid">
                {items.map((item) => (
                  <div
                    className="birthday-elena-countdown__item"
                    key={item.key}
                  >
                    <AnimatePresence
                      mode="popLayout"
                      initial={false}
                    >
                      <motion.strong
                        key={item.value}
                        initial={{
                          opacity: 0,
                          y: 8,
                          scale: 0.96,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                        }}
                        exit={{
                          opacity: 0,
                          y: -8,
                          scale: 0.96,
                        }}
                        transition={{
                          duration: 0.22,
                        }}
                      >
                        {String(
                          item.value
                        ).padStart(2, "0")}
                      </motion.strong>
                    </AnimatePresence>

                    <span>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

            </>
          ) : (
            <motion.div
              className="birthday-elena-countdown__finished"
              initial={{
                opacity: 0,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.55,
              }}
            >
              <OutlineHeart />

              <p>
                {finishedText}
              </p>
            </motion.div>
          )}

          {shouldShowCalendar && targetDate && (
            <motion.div
              className="birthday-elena-countdown__calendar"
              initial={{
                opacity: 0,
                y: 12,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.25,
              }}
              transition={{
                duration: 0.5,
                delay: 0.15,
              }}
            >
              <button
                type="button"
                onClick={handleCalendarClick}
              >
                <GemHeart />

                <span>
                  {countdownConfig?.calendarButtonText ||
                    text.calendarButton}
                </span>
              </button>

              <p>
                {countdownConfig?.calendarHint ||
                  text.calendarHint}
              </p>
            </motion.div>
          )}

        </motion.div>
      </div>
    </motion.section>
  );
}

export default BirthdayElenaCountdown;