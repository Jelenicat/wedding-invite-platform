import { motion } from "framer-motion";
import "../styles/card.css";

import BirthdaySplitRSVP from "./BirthdaySplitRSVP";
import BirthdaySplitCountdown from "./BirthdaySplitCountdown";

function BirthdaySplitInvitationCard({
  slug,
  brideName,
  weddingDate,
  weddingTime,
  venue,
  details = {},
  backgroundImage,
  videoSrc,
  script,
}) {
  const activeScript =
    script ||
    details?.script ||
    "latin";

  const isCyrillic =
    activeScript === "cyrillic";

  const name =
    brideName ||
    (isCyrillic ? "Нина" : "Nina");

  /*
   * POSEBNI SLUGOVI
   */
  const isEvaSlug =
    slug === "eva-1";

  const isLaraSlug =
    slug === "lara-1";

  const isReljaSlug =
    slug === "relja";

  /*
   * Lara i Relja koriste isti CARD stil.
   */
  const usesLaraCardStyle =
    isLaraSlug ||
    isReljaSlug;

  /*
   * VIDEO ZA GLAVNU KARTICU
   */
  const videoPath =
    isEvaSlug
      ? videoSrc || `/videos/${slug}.mp4`
      : `/videos/${slug}.mp4`;

  /*
   * RELJIN POSEBAN VIDEO
   */
  const reljaVideoPath =
    "/videos/relja.mp4";

  /*
   * DATUM
   */
  const displayedDate =
    details?.date ||
    weddingDate ||
    "";

  const dateParts = displayedDate
    .replace(/\s+/g, " ")
    .trim()
    .split(" ");

  const dayValue =
    dateParts[0] || "24";

  const month =
    dateParts[1] ||
    (isCyrillic ? "СЕП" : "SEP");

  const day =
    Number.parseInt(dayValue, 10);

  /*
   * TEKST ISPOD IMENA
   */
  const subtitle =
    isReljaSlug
      ? "Relja’s Beary 1st Birthday 🧸🤎"
      : isLaraSlug
        ? "slavi svoj 1. rođendan 🤎"
        : isCyrillic
          ? "слави свој рођендан"
          : "slavi svoj rođendan";

  /*
   * DANI U NEDELJI
   */
  const calendarDays = isCyrillic
    ? ["По", "Ут", "Ср", "Че", "Пе", "Су", "Не"]
    : usesLaraCardStyle
      ? ["Po", "Ut", "Sr", "Če", "Pe", "Su", "Ne"]
      : ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  /*
   * ISO DATUM
   */
  const isoDateParts =
    details?.dateISO
      ?.slice(0, 10)
      .split("-")
      .map(Number) || [];

  const eventYear =
    isoDateParts[0];

  const eventMonth =
    isoDateParts[1];

  const eventDay =
    isoDateParts[2];

  const hasValidEventDate =
    Number.isInteger(eventYear) &&
    Number.isInteger(eventMonth) &&
    Number.isInteger(eventDay);

  /*
   * JS:
   * 0 = nedelja
   *
   * Naš kalendar:
   * 0 = ponedeljak
   */
  const firstDayOfMonth =
    hasValidEventDate
      ? new Date(
          Date.UTC(
            eventYear,
            eventMonth - 1,
            1
          )
        ).getUTCDay()
      : 1;

  const mondayFirstOffset =
    (firstDayOfMonth + 6) % 7;

  const daysInMonth =
    hasValidEventDate
      ? new Date(
          Date.UTC(
            eventYear,
            eventMonth,
            0
          )
        ).getUTCDate()
      : 30;

  /*
   * Eva, Lara i Relja koriste pravi kalendar.
   */
  const usesRealCalendar =
    isEvaSlug ||
    usesLaraCardStyle;

  const calendarDates =
    usesRealCalendar && hasValidEventDate
      ? [
          ...Array.from(
            {
              length: mondayFirstOffset,
            },
            () => null
          ),

          ...Array.from(
            {
              length: daysInMonth,
            },
            (_, index) => index + 1
          ),
        ]
      : Array.from(
          {
            length: 30,
          },
          (_, index) => index + 1
        );

  /*
   * AKTIVNI DAN
   */
  const activeCalendarDay =
    usesRealCalendar && hasValidEventDate
      ? eventDay
      : day;

  /*
   * LOKACIJA
   */
  const displayedVenue =
    details?.venueDetails
      ? `${venue}, ${details.venueDetails}`
      : venue;

  const locationLink =
    details?.mapLink ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      displayedVenue || ""
    )}`;

  return (
    <>
      {/* =====================================================
          GLAVNA KARTICA
      ===================================================== */}

      <section
        className={`birthday-video-invitation birthday-video-${slug} ${
          usesLaraCardStyle
            ? "birthday-video-lara-1"
            : ""
        } ${
          isCyrillic
            ? "birthday-video-invitation-cyrillic"
            : ""
        }`}
      >
        {isReljaSlug ? (
          <div
            className="birthday-video-bg birthday-video-bg-image"
            style={
              backgroundImage
                ? {
                    backgroundImage: `url(${backgroundImage})`,
                  }
                : undefined
            }
          />
        ) : (
          <video
            className="birthday-video-bg"
            autoPlay
            muted
            loop
            playsInline
            poster={backgroundImage || undefined}
          >
            <source
              src={videoPath}
              type="video/mp4"
            />
          </video>
        )}

        <div className="birthday-video-overlay" />

        {/* CARD */}
        <motion.div
          className="birthday-video-card"
          initial={{
            opacity: 0,
            y: 30,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.85,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {/* IME */}
          <h1 className="birthday-video-name">
            {name}
          </h1>

          {/* SUBTITLE */}
          <p className="birthday-video-subtitle">
            {isReljaSlug ? (
              <>
                <span>
                  Relja’s Beary 1st Birthday{" "}
                </span>

                <span className="lara-subtitle-emojis">
                  🧸🤎
                </span>
              </>
            ) : isLaraSlug ? (
              <>
                <span>
                  slavi svoj 1. rođendan{" "}
                </span>

                <span className="lara-subtitle-emojis">
                  🤎
                </span>
              </>
            ) : (
              subtitle
            )}
          </p>

          {/* KALENDAR */}
          <div className="birthday-video-calendar">
            <div className="calendar-month">
              {month}
            </div>

            <div className="calendar-days">
              {calendarDays.map(
                (calendarDay) => (
                  <span key={calendarDay}>
                    {calendarDay}
                  </span>
                )
              )}
            </div>

            <div className="calendar-grid">
              {calendarDates.map(
                (calendarDate, index) => (
                  <div
                    key={
                      calendarDate !== null
                        ? `calendar-day-${calendarDate}`
                        : `calendar-empty-${index}`
                    }
                    className={[
                      "calendar-cell",

                      calendarDate === null
                        ? "is-empty"
                        : "",

                      calendarDate ===
                      activeCalendarDay
                        ? "active"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {calendarDate ?? ""}
                  </div>
                )
              )}
            </div>
          </div>

          {/* INFO */}
          <div className="birthday-video-info">

            {/* LOKACIJA */}
            {displayedVenue && (
              <a
                href={locationLink}
                target="_blank"
                rel="noreferrer"
                className="birthday-video-item"
              >
                <span
                  className="birthday-video-item-icon"
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 21s-6-5.4-6-10a6 6 0 1 1 12 0c0 4.6-6 10-6 10Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    <circle
                      cx="12"
                      cy="11"
                      r="2.5"
                      fill="currentColor"
                    />
                  </svg>
                </span>

                <span>
                  {displayedVenue}
                </span>
              </a>
            )}

            {/* VREME */}
            {weddingTime && (
              <div className="birthday-video-item">
                <span
                  className="birthday-video-item-icon"
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="8.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />

                    <path
                      d="M12 7.5v5l3 2"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <span>
                  {weddingTime}
                </span>
              </div>
            )}

            {/* WELCOME */}
            {details?.welcomeText && (
              <div className="birthday-video-welcome">
                {details.welcomeText}
              </div>
            )}

            {/* NOTE */}
            {details?.note && (
              <div className="birthday-video-note">
                {details.note}
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* =====================================================
          RSVP
      ===================================================== */}

      <BirthdaySplitRSVP
        slug={slug}
        eventType="birthday"
        brideName={brideName}
        details={details}
        backgroundImage={backgroundImage}
        script={activeScript}
      />

      {/* =====================================================
          RELJIN VIDEO
          ISPOD RSVP-a
          SAMO slug: relja
      ===================================================== */}

      {isReljaSlug && (
        <section
          className="relja-memory-video-section"
          style={
            backgroundImage
              ? {
                  "--relja-memory-background": `url(${backgroundImage})`,
                }
              : undefined
          }
        >
          <div className="relja-memory-video-background" />
          <div className="relja-memory-video-overlay" />

          <motion.div
            className="relja-memory-video-wrap"
            initial={{
              opacity: 0,
              y: 26,
              scale: 0.98,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            viewport={{
              once: true,
              amount: 0.18,
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <video
              className="relja-memory-video"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            >
              <source
                src={reljaVideoPath}
                type="video/mp4"
              />
            </video>
          </motion.div>
        </section>
      )}

      {/* =====================================================
          COUNTDOWN
      ===================================================== */}

      <BirthdaySplitCountdown
        slug={slug}
        targetDate={details?.dateISO}
        backgroundImage={backgroundImage}
        script={activeScript}
        brideName={brideName}
        venue={displayedVenue}
        details={details}
      />
    </>
  );
}

export default BirthdaySplitInvitationCard;