import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "../styles/rsvp.css";

function formatCalendarDate(date) {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

function escapeCalendarText(value = "") {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function BirthdaySplitCountdown({
  slug,
  targetDate,
  backgroundImage,
  script,
  brideName,
  venue,
  details = {},
}) {
  const activeScript =
    script ||
    details?.script ||
    "latin";

  const isCyrillic = activeScript === "cyrillic";

  const name =
    brideName ||
    (isCyrillic ? "Ева" : "Eva");

  const text = isCyrillic
    ? {
        kicker: "ОДБРОЈАВАЊЕ",
        title: "Још мало до прославе",
        subtitle:
          "Одбројавамо до једног посебног дана пуног осмеха, игре и лепих успомена.",
        days: "Дана",
        hours: "Сати",
        minutes: "Минута",
        seconds: "Секунди",
        finished: "Прослава је почела!",
        calendarButton: "Додај у календар",
        calendarError:
          "Датум догађаја није исправно подешен.",
        calendarTitle: `${name} — први рођендан`,
        calendarDescription:
          "Радујемо се Вашем доласку!",
      }
    : {
        kicker: "COUNTDOWN",
        title: "Još malo do proslave",
        subtitle:
          "Odbrojavamo do jednog posebnog dana punog osmeha, igre i lepih uspomena.",
        days: "Dana",
        hours: "Sati",
        minutes: "Minuta",
        seconds: "Sekundi",
        finished: "Proslava je počela!",
        calendarButton: "Dodaj u kalendar",
        calendarError:
          "Datum događaja nije ispravno podešen.",
        calendarTitle: `${name} — prvi rođendan`,
        calendarDescription:
          "Radujemo se Vašem dolasku!",
      };

  const calculateTimeLeft = () => {
    if (!targetDate) return null;

    const targetTime = new Date(targetDate).getTime();

    if (Number.isNaN(targetTime)) {
      return null;
    }

    const difference =
      targetTime - new Date().getTime();

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
  };

  const [timeLeft, setTimeLeft] = useState(
    calculateTimeLeft()
  );

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const format = (number) =>
    String(number).padStart(2, "0");

  const units = timeLeft
    ? [
        {
          label: text.days,
          value: format(timeLeft.days),
        },
        {
          label: text.hours,
          value: format(timeLeft.hours),
        },
        {
          label: text.minutes,
          value: format(timeLeft.minutes),
        },
        {
          label: text.seconds,
          value: format(timeLeft.seconds),
        },
      ]
    : [];

  const showCalendarButton =
    details?.showCalendarButton === true;

  const handleAddToCalendar = () => {
    const startDate = new Date(targetDate);

    if (
      !targetDate ||
      Number.isNaN(startDate.getTime())
    ) {
      alert(text.calendarError);
      return;
    }

    const configuredDuration = Number(
      details?.calendarDurationHours
    );

    const durationHours =
      Number.isFinite(configuredDuration) &&
      configuredDuration > 0
        ? configuredDuration
        : 4;

    const endDate = new Date(
      startDate.getTime() +
        durationHours * 60 * 60 * 1000
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

    const eventUid = `${
      slug || "birthday"
    }-${startDate.getTime()}@mojapozivnica.app`;

    const calendarContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Moja Pozivnica//Birthday Event//SR",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${eventUid}`,
      `DTSTAMP:${formatCalendarDate(new Date())}`,
      `DTSTART:${formatCalendarDate(startDate)}`,
      `DTEND:${formatCalendarDate(endDate)}`,
      `SUMMARY:${escapeCalendarText(eventTitle)}`,
      `DESCRIPTION:${escapeCalendarText(
        eventDescription
      )}`,
      `LOCATION:${escapeCalendarText(
        eventLocation
      )}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const calendarBlob = new Blob(
      [calendarContent],
      {
        type: "text/calendar;charset=utf-8",
      }
    );

    const calendarUrl =
      URL.createObjectURL(calendarBlob);

    const downloadLink =
      document.createElement("a");

    downloadLink.href = calendarUrl;
    downloadLink.download = `${
      slug || "rodjendan"
    }.ics`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    URL.revokeObjectURL(calendarUrl);
  };

  const slugClass = slug
    ? `birthday-split-countdown-${slug}`
    : "";

  return (
    <section
      className={[
        "birthday-split-countdown-section",
        slugClass,
        isCyrillic
          ? "birthday-split-countdown-cyrillic"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
      lang={
        isCyrillic
          ? "sr-Cyrl"
          : "sr-Latn"
      }
      style={
        backgroundImage
          ? {
              "--birthday-split-countdown-bg": `url(${backgroundImage})`,
            }
          : undefined
      }
    >
      <div className="birthday-split-countdown-bg" />
      <div className="birthday-split-countdown-overlay" />

      <motion.div
        className="birthday-split-countdown-card"
        initial={{
          opacity: 0,
          y: 24,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.2,
        }}
        transition={{
          duration: 0.8,
        }}
      >
        <p className="birthday-split-countdown-kicker">
          {text.kicker}
        </p>

        <h2 className="birthday-split-countdown-title">
          {text.title}
        </h2>

        <p className="birthday-split-countdown-subtitle">
          {text.subtitle}
        </p>

        {timeLeft ? (
          <div className="birthday-split-countdown-grid">
            {units.map((item) => (
              <div
                className="birthday-split-countdown-unit"
                key={item.label}
              >
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={item.value}
                    className="birthday-split-countdown-number"
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -8,
                    }}
                    transition={{
                      duration: 0.22,
                    }}
                  >
                    {item.value}
                  </motion.span>
                </AnimatePresence>

                <span className="birthday-split-countdown-label">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className="birthday-split-countdown-finished"
            initial={{
              opacity: 0,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.45,
            }}
          >
            {text.finished}
          </motion.div>
        )}

        {showCalendarButton && (
          <motion.button
            type="button"
            className="birthday-split-countdown-calendar-button"
            onClick={handleAddToCalendar}
            whileHover={{
              y: -2,
            }}
            whileTap={{
              scale: 0.98,
            }}
          >
            <span
              className="birthday-split-countdown-calendar-icon"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
              >
                <rect
                  x="4"
                  y="5.5"
                  width="16"
                  height="14"
                  rx="2.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />

                <path
                  d="M8 3.5v4M16 3.5v4M4 9.5h16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

                <path
                  d="M12 12.5v4M10 14.5h4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <span>{text.calendarButton}</span>
          </motion.button>
        )}
      </motion.div>
    </section>
  );
}

export default BirthdaySplitCountdown;