import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "../styles/rsvp.css";

function BirthdayGalleryCountdown({
  targetDate,
  backgroundImage,
  details = {},
  script,
  brideName,
  venue,
  slug,
}) {
  const activeScript =
    script || details?.script || "latin";

  const isCyrillic =
    activeScript === "cyrillic";

  /*
   * Ovde ostaju samo funkcionalna podešavanja:
   * showCalendarButton, trajanje događaja i slično.
   */
  const countdownConfig =
    details?.birthdayGalleryCountdown || {};

  /*
   * Sve nove boje čitamo iz zajedničke teme.
   */
  const theme =
    details?.theme || {};

  /*
   * Podrška za stare slugove koji još koriste:
   *
   * birthdayGalleryCountdown: {
   *   colors: {}
   * }
   */
  const legacyColors =
    countdownConfig?.colors || {};

  const getLocalizedText = (
    value,
    fallback = ""
  ) => {
    if (!value) {
      return fallback;
    }

    if (
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      return (
        value[activeScript] ||
        value.latin ||
        value.cyrillic ||
        fallback
      );
    }

    return value;
  };

  /*
   * Svi tekstovi su već definisani u komponenti.
   * Ne moraš ih ponavljati u demoWedding slugu.
   */
  const defaultTexts = isCyrillic
    ? {
        kicker: "ОДБРОЈАВАЊЕ",

        title:
          "Још мало до прославе",

        subtitle:
          "Одбројавамо до једног посебног дана пуног осмеха, радости и лепих успомена.",

        days: "Дана",
        hours: "Сати",
        minutes: "Минута",
        seconds: "Секунди",

        finished:
          "Прослава је почела!",

        calendarButton:
          "Додај у календар",

        defaultCalendarTitle:
          brideName
            ? `${brideName} – рођендан`
            : "Рођенданска прослава",

        defaultCalendarDescription:
          "Радујемо се да заједно прославимо овај посебан дан.",
      }
    : {
        kicker: "ODBROJAVANJE",

        title:
          "Još malo do proslave",

        subtitle:
          "Odbrojavamo do jednog posebnog dana punog osmeha, radosti i lepih uspomena.",

        days: "Dana",
        hours: "Sati",
        minutes: "Minuta",
        seconds: "Sekundi",

        finished:
          "Proslava je počela!",

        calendarButton:
          "Dodaj u kalendar",

        defaultCalendarTitle:
          brideName
            ? `${brideName} – rođendan`
            : "Rođendanska proslava",

        defaultCalendarDescription:
          "Radujemo se da zajedno proslavimo ovaj poseban dan.",
      };

  /*
   * Stari slugovi sa posebnim tekstovima
   * nastaviće da rade.
   *
   * Za Tadiju texts nije potreban.
   */
  const legacyCustomTexts =
    countdownConfig?.texts?.[activeScript] || {};

  const texts = {
    ...defaultTexts,
    ...legacyCustomTexts,
  };

  const activeBackgroundImage =
    countdownConfig?.backgroundImage ||
    backgroundImage ||
    details?.backgroundImage ||
    "";

  /*
   * Dugme se prikazuje kada je izričito uključeno.
   */
  const showCalendarButton =
    countdownConfig?.showCalendarButton === true;

  const calculateTimeLeft = () => {
    if (!targetDate) {
      return null;
    }

    const targetTime =
      new Date(targetDate).getTime();

    if (Number.isNaN(targetTime)) {
      return null;
    }

    const difference =
      targetTime - Date.now();

    if (difference <= 0) {
      return null;
    }

    return {
      days: Math.floor(
        difference /
          (1000 * 60 * 60 * 24)
      ),

      hours: Math.floor(
        (
          difference /
          (1000 * 60 * 60)
        ) % 24
      ),

      minutes: Math.floor(
        (
          difference /
          (1000 * 60)
        ) % 60
      ),

      seconds: Math.floor(
        (difference / 1000) % 60
      ),
    };
  };

  const [timeLeft, setTimeLeft] =
    useState(calculateTimeLeft());

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [targetDate]);

  const format = (number) =>
    String(number).padStart(2, "0");

  const units = timeLeft
    ? [
        {
          key: "days",
          label: texts.days,
          value: format(timeLeft.days),
        },
        {
          key: "hours",
          label: texts.hours,
          value: format(timeLeft.hours),
        },
        {
          key: "minutes",
          label: texts.minutes,
          value: format(timeLeft.minutes),
        },
        {
          key: "seconds",
          label: texts.seconds,
          value: format(timeLeft.seconds),
        },
      ]
    : [];

  const formatICSDate = (date) =>
    date
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");

  const escapeICSText = (text = "") =>
    String(text)
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");

  const handleAddToCalendar = () => {
    const startDate =
      new Date(targetDate);

    if (
      Number.isNaN(startDate.getTime())
    ) {
      console.error(
        "Neispravan datum događaja:",
        targetDate
      );

      return;
    }

    const configuredDuration = Number(
      countdownConfig?.calendarDurationHours ??
        details?.calendarDurationHours ??
        3
    );

    const durationHours =
      Number.isFinite(configuredDuration) &&
      configuredDuration > 0
        ? configuredDuration
        : 3;

    const endDate = new Date(
      startDate.getTime() +
        durationHours *
          60 *
          60 *
          1000
    );

    /*
     * Naslov kalendara automatski koristi ime deteta.
     * Posebna vrednost u slugu nije obavezna.
     */
    const calendarTitle =
      getLocalizedText(
        countdownConfig?.calendarTitle,
        texts.defaultCalendarTitle
      );

    const calendarDescription =
      getLocalizedText(
        countdownConfig?.calendarDescription,
        texts.defaultCalendarDescription
      );

    /*
     * Lokaciju automatski uzima iz venue propa.
     */
    const calendarLocation =
      getLocalizedText(
        countdownConfig?.calendarLocation,
        venue || details?.venue || ""
      );

    const eventSlug =
      slug || "birthday-event";

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Moja Pozivnica//Birthday Event//SR",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",

      `UID:${eventSlug}-${startDate.getTime()}@mojapozivnica.app`,

      `DTSTAMP:${formatICSDate(
        new Date()
      )}`,

      `DTSTART:${formatICSDate(
        startDate
      )}`,

      `DTEND:${formatICSDate(
        endDate
      )}`,

      `SUMMARY:${escapeICSText(
        calendarTitle
      )}`,

      `DESCRIPTION:${escapeICSText(
        calendarDescription
      )}`,

      `LOCATION:${escapeICSText(
        calendarLocation
      )}`,

      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const calendarBlob = new Blob(
      [icsContent],
      {
        type: "text/calendar;charset=utf-8",
      }
    );

    const calendarUrl =
      window.URL.createObjectURL(
        calendarBlob
      );

    const downloadLink =
      document.createElement("a");

    downloadLink.href =
      calendarUrl;

    downloadLink.download =
      countdownConfig?.calendarFileName ||
      `${eventSlug}-kalendar.ics`;

    document.body.appendChild(
      downloadLink
    );

    downloadLink.click();
    downloadLink.remove();

    window.URL.revokeObjectURL(
      calendarUrl
    );
  };

  /*
   * Sve nove boje prvenstveno dolaze iz details.theme.
   *
   * legacyColors ostaje kao rezervna opcija
   * da se ne poremete stari slugovi.
   */
  const themeStyle = {
    "--birthday-countdown-page-bg":
      theme.countdownPageBackground ||
      theme.backgroundColor ||
      legacyColors.background ||
      "#f7f4ee",

    "--birthday-countdown-overlay":
      theme.countdownOverlay ||
      legacyColors.overlay ||
      "rgba(247, 244, 238, 0.62)",

    "--birthday-countdown-card-bg":
      theme.countdownCardBackground ||
      legacyColors.cardBackground ||
      "rgba(255, 255, 255, 0.72)",

    "--birthday-countdown-card-border":
      theme.countdownCardBorder ||
      legacyColors.cardBorder ||
      "rgba(100, 78, 62, 0.15)",

    /*
     * Opšte boje teksta
     */
    "--birthday-countdown-text":
      theme.countdownMainText ||
      theme.mainText ||
      legacyColors.text ||
      "#2f251f",

    "--birthday-countdown-muted-text":
      theme.countdownSoftText ||
      theme.softText ||
      legacyColors.secondaryText ||
      "#89796f",

    "--birthday-countdown-accent":
      theme.countdownAccent ||
      theme.accent ||
      legacyColors.accent ||
      "#b49778",

    /*
     * Pojedinačne boje teksta
     */
    "--birthday-countdown-kicker-text":
      theme.countdownKickerText ||
      theme.countdownAccent ||
      theme.accent ||
      legacyColors.accent ||
      "#b49778",

    "--birthday-countdown-title-text":
      theme.countdownTitleText ||
      theme.countdownMainText ||
      theme.mainText ||
      legacyColors.text ||
      "#2f251f",

    "--birthday-countdown-subtitle-text":
      theme.countdownSubtitleText ||
      theme.countdownSoftText ||
      theme.softText ||
      legacyColors.secondaryText ||
      "#89796f",

    "--birthday-countdown-number-text":
      theme.countdownNumberText ||
      theme.countdownMainText ||
      theme.mainText ||
      legacyColors.text ||
      "#2f251f",

    "--birthday-countdown-label-text":
      theme.countdownLabelText ||
      theme.countdownSoftText ||
      theme.softText ||
      legacyColors.secondaryText ||
      "#89796f",

    "--birthday-countdown-finished-text":
      theme.countdownFinishedText ||
      theme.countdownMainText ||
      theme.mainText ||
      legacyColors.text ||
      "#2f251f",

    /*
     * Kartice sa brojevima
     */
    "--birthday-countdown-unit-bg":
      theme.countdownUnitBackground ||
      legacyColors.unitBackground ||
      "rgba(255, 255, 255, 0.48)",

    "--birthday-countdown-unit-border":
      theme.countdownUnitBorder ||
      legacyColors.unitBorder ||
      "rgba(100, 78, 62, 0.15)",

    /*
     * Dugme kalendara
     */
    "--birthday-countdown-button-bg":
      theme.countdownButtonBackground ||
      theme.buttonBackground ||
      legacyColors.buttonBackground ||
      "#2f241d",

    "--birthday-countdown-button-text":
      theme.countdownButtonText ||
      theme.buttonText ||
      legacyColors.buttonText ||
      "#ffffff",

    "--birthday-countdown-button-border":
      theme.countdownButtonBorder ||
      theme.buttonBorder ||
      legacyColors.buttonBorder ||
      legacyColors.buttonBackground ||
      "#2f241d",

    /*
     * Dekorativni glow
     */
    "--birthday-countdown-glow-one":
      theme.countdownGlowOne ||
      legacyColors.glowOne ||
      "rgba(255, 255, 255, 0.48)",

    "--birthday-countdown-glow-two":
      theme.countdownGlowTwo ||
      legacyColors.glowTwo ||
      "rgba(200, 176, 150, 0.18)",

    ...(activeBackgroundImage
      ? {
          "--birthday-countdown-bg":
            `url(${activeBackgroundImage})`,
        }
      : {}),
  };

  return (
    <section
      className={`birthday-countdown-section birthday-countdown-section-${activeScript}`}
      style={themeStyle}
    >
      {activeBackgroundImage && (
        <div className="birthday-countdown-bg-image" />
      )}

      <div className="birthday-countdown-overlay" />

      <div className="birthday-countdown-glow birthday-countdown-glow-one" />

      <div className="birthday-countdown-glow birthday-countdown-glow-two" />

      <motion.div
        className="birthday-countdown-card"
        initial={{
          opacity: 0,
          y: 26,
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
        <p className="birthday-countdown-kicker">
          {texts.kicker}
        </p>

        <h2 className="birthday-countdown-title">
          {texts.title}
        </h2>

        <p className="birthday-countdown-subtitle">
          {texts.subtitle}
        </p>

        {timeLeft ? (
          <div className="birthday-countdown-grid">
            {units.map((item) => (
              <div
                className="birthday-countdown-unit"
                key={item.key}
              >
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={item.value}
                    className="birthday-countdown-number"
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

                <span className="birthday-countdown-label">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className="birthday-countdown-finished"
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
            {texts.finished}
          </motion.div>
        )}

        {showCalendarButton && (
          <motion.button
            type="button"
            className="birthday-countdown-calendar-button"
            onClick={handleAddToCalendar}
            initial={{
              opacity: 0,
              y: 8,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.25,
              duration: 0.5,
            }}
          >
            <span
              className="birthday-countdown-calendar-icon"
              aria-hidden="true"
            >
              ＋
            </span>

            <span>
              {texts.calendarButton}
            </span>
          </motion.button>
        )}
      </motion.div>
    </section>
  );
}

export default BirthdayGalleryCountdown;