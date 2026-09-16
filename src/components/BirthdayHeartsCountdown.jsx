import {
  useEffect,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import "../styles/birthdayrsvp.css";

function formatCalendarDate(
  date
) {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

function escapeCalendarText(
  value = ""
) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function BirthdayHeartsCountdown({
  slug,
  targetDate,

  backgroundImage,

  script,

  brideName,
  childName,

  venue,

  details = {},
}) {
  const activeScript =
    script ||
    details?.script ||
    "latin";

  const isCyrillic = [
    "cyrillic",
    "cyr",
    "ćirilica",
    "cirilica",
  ].includes(activeScript);

  const name =
    childName ||
    brideName ||
    details?.childName ||
    (isCyrillic
      ? "Име"
      : "Ime");

  const text = isCyrillic
    ? {
        kicker:
          "ОДБРОЈАВАМО",

        title:
          "Још мало до славља",

        subtitle:
          "Сваким даном смо све ближе једној посебној успомени.",

        days:
          "Дана",

        hours:
          "Сати",

        minutes:
          "Минута",

        seconds:
          "Секунди",

        finished:
          "Прослава је почела!",

        calendarButton:
          "Додај у календар",

        calendarError:
          "Датум догађаја није исправно подешен.",

        calendarTitle:
          `${name} — први рођендан`,

        calendarDescription:
          "Радујемо се Вашем доласку!",
      }
    : {
        kicker:
          "ODBROJAVAMO",

        title:
          "Još malo do slavlja",

        subtitle:
          "Svakim danom smo sve bliže jednoj posebnoj uspomeni.",

        days:
          "Dana",

        hours:
          "Sati",

        minutes:
          "Minuta",

        seconds:
          "Sekundi",

        finished:
          "Proslava je počela!",

        calendarButton:
          "Dodaj u kalendar",

        calendarError:
          "Datum događaja nije ispravno podešen.",

        calendarTitle:
          `${name} — prvi rođendan`,

        calendarDescription:
          "Radujemo se Vašem dolasku!",
      };

  const kicker =
    details?.countdownKicker ||
    text.kicker;

  const title =
    details?.countdownTitle ||
    text.title;

  const subtitle =
    details?.countdownSubtitle ||
    text.subtitle;

  const sectionBackground =
    details?.countdownBackgroundImage ||
    details?.cardBackgroundImage ||
    backgroundImage ||
    details?.introBackgroundImage ||
    "";

  const calculateTimeLeft =
    () => {
      if (!targetDate) {
        return null;
      }

      const targetTime =
        new Date(
          targetDate
        ).getTime();

      if (
        Number.isNaN(
          targetTime
        )
      ) {
        return null;
      }

      const difference =
        targetTime -
        Date.now();

      if (
        difference <= 0
      ) {
        return null;
      }

      return {
        days:
          Math.floor(
            difference /
              (
                1000 *
                60 *
                60 *
                24
              )
          ),

        hours:
          Math.floor(
            (
              difference /
              (
                1000 *
                60 *
                60
              )
            ) %
              24
          ),

        minutes:
          Math.floor(
            (
              difference /
              (
                1000 *
                60
              )
            ) %
              60
          ),

        seconds:
          Math.floor(
            (
              difference /
              1000
            ) %
              60
          ),
      };
    };

  const [
    timeLeft,
    setTimeLeft,
  ] = useState(
    calculateTimeLeft()
  );

  useEffect(() => {
    setTimeLeft(
      calculateTimeLeft()
    );

    const interval =
      setInterval(() => {
        setTimeLeft(
          calculateTimeLeft()
        );
      }, 1000);

    return () =>
      clearInterval(
        interval
      );
  }, [targetDate]);

  const format = (
    number
  ) =>
    String(number).padStart(
      2,
      "0"
    );

  const units = timeLeft
    ? [
        {
          label:
            text.days,

          value:
            format(
              timeLeft.days
            ),
        },

        {
          label:
            text.hours,

          value:
            format(
              timeLeft.hours
            ),
        },

        {
          label:
            text.minutes,

          value:
            format(
              timeLeft.minutes
            ),
        },

        {
          label:
            text.seconds,

          value:
            format(
              timeLeft.seconds
            ),
        },
      ]
    : [];

  const showCalendarButton =
    details?.showCalendarButton ===
    true;

  const handleAddToCalendar =
    () => {
      const startDate =
        new Date(
          targetDate
        );

      if (
        !targetDate ||
        Number.isNaN(
          startDate.getTime()
        )
      ) {
        alert(
          text.calendarError
        );

        return;
      }

      const configuredDuration =
        Number(
          details?.calendarDurationHours
        );

      const durationHours =
        Number.isFinite(
          configuredDuration
        ) &&
        configuredDuration > 0
          ? configuredDuration
          : 4;

      const endDate =
        new Date(
          startDate.getTime() +
            durationHours *
              60 *
              60 *
              1000
        );

      const eventTitle =
        details?.calendarTitle ||
        text.calendarTitle;

      const eventDescription =
        details?.calendarDescription ||
        details?.welcomeText ||
        text.calendarDescription;

      const eventLocation =
        details?.venue ||
        venue ||
        "";

      const eventUid =
        `${
          slug ||
          "birthday"
        }-${startDate.getTime()}@mojapozivnica.app`;

      const calendarContent =
        [
          "BEGIN:VCALENDAR",
          "VERSION:2.0",
          "PRODID:-//Moja Pozivnica//Birthday Event//SR",
          "CALSCALE:GREGORIAN",
          "METHOD:PUBLISH",

          "BEGIN:VEVENT",

          `UID:${eventUid}`,

          `DTSTAMP:${formatCalendarDate(
            new Date()
          )}`,

          `DTSTART:${formatCalendarDate(
            startDate
          )}`,

          `DTEND:${formatCalendarDate(
            endDate
          )}`,

          `SUMMARY:${escapeCalendarText(
            eventTitle
          )}`,

          `DESCRIPTION:${escapeCalendarText(
            eventDescription
          )}`,

          `LOCATION:${escapeCalendarText(
            eventLocation
          )}`,

          "END:VEVENT",
          "END:VCALENDAR",
        ].join("\r\n");

      const calendarBlob =
        new Blob(
          [
            calendarContent,
          ],
          {
            type:
              "text/calendar;charset=utf-8",
          }
        );

      const calendarUrl =
        URL.createObjectURL(
          calendarBlob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href =
        calendarUrl;

      link.download =
        `${
          slug ||
          "rodjendan"
        }.ics`;

      document.body.appendChild(
        link
      );

      link.click();

      document.body.removeChild(
        link
      );

      URL.revokeObjectURL(
        calendarUrl
      );
    };

  return (
    <section
      className="bhcount-section"
      lang={
        isCyrillic
          ? "sr-Cyrl"
          : "sr-Latn"
      }
      style={
        sectionBackground
          ? {
              "--bhcount-bg":
                `url("${sectionBackground}")`,
            }
          : undefined
      }
    >
      <div
        className="bhcount-bg"
        aria-hidden="true"
      />

      <div
        className="bhcount-softener"
        aria-hidden="true"
      />

      <motion.div
        className="bhcount-card"
        initial={{
          opacity: 0,
          y: 28,
          scale: 0.98,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        viewport={{
          once: true,
          amount: 0.15,
        }}
        transition={{
          duration: 0.85,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
      >
        <p className="bhcount-kicker">
          {kicker}
        </p>

        <h2 className="bhcount-title">
          {title}
        </h2>

        <p className="bhcount-subtitle">
          {subtitle}
        </p>

        <div
          className="bhcount-divider"
          aria-hidden="true"
        >
          <span />
          <b>♡</b>
          <span />
        </div>

        {timeLeft ? (
          <div className="bhcount-grid">
            {units.map(
              (item) => (
                <div
                  className="bhcount-unit"
                  key={
                    item.label
                  }
                >
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={
                        item.value
                      }
                      className="bhcount-number"
                      initial={{
                        opacity: 0,
                        y: 7,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -7,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                    >
                      {
                        item.value
                      }
                    </motion.span>
                  </AnimatePresence>

                  <span className="bhcount-label">
                    {
                      item.label
                    }
                  </span>
                </div>
              )
            )}
          </div>
        ) : (
          <motion.div
            className="bhcount-finished"
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
          >
            {
              text.finished
            }
          </motion.div>
        )}

        {showCalendarButton && (
          <motion.button
            type="button"
            className="bhcount-calendar-button"
            onClick={
              handleAddToCalendar
            }
            whileHover={{
              y: -2,
            }}
            whileTap={{
              scale: 0.98,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="4"
                y="5.5"
                width="16"
                height="14"
                rx="2.5"
                stroke="currentColor"
                strokeWidth="1.35"
              />

              <path
                d="M8 3.5v4M16 3.5v4M4 9.5h16"
                stroke="currentColor"
                strokeWidth="1.35"
                strokeLinecap="round"
              />

              <path
                d="M12 12.5v4M10 14.5h4"
                stroke="currentColor"
                strokeWidth="1.35"
                strokeLinecap="round"
              />
            </svg>

            <span>
              {
                text.calendarButton
              }
            </span>
          </motion.button>
        )}

        <div
          className="bhcount-one"
          aria-hidden="true"
        >
          one
        </div>
      </motion.div>
    </section>
  );
}

export default BirthdayHeartsCountdown;