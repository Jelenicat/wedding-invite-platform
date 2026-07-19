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
   * Eva koristi videoSrc iz sluga.
   * Ostali slugovi zadržavaju stari način:
   * /videos/ime-sluga.mp4
   */
  const videoPath =
    slug === "eva-1"
      ? videoSrc || `/videos/${slug}.mp4`
      : `/videos/${slug}.mp4`;

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

  const subtitle = isCyrillic
    ? "слави свој рођендан"
    : "slavi svoj rođendan";

  /*
   * Za latinicu ostavljamo stare oznake,
   * da ne menjamo postojeće slugove.
   */
  const calendarDays = isCyrillic
    ? ["По", "Ут", "Ср", "Че", "Пе", "Су", "Не"]
    : ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  /*
   * Pravi raspored kalendara samo za Evu.
   * Datum se čita iz details.dateISO.
   */
  const isEvaSlug =
    slug === "eva-1";

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
   * JavaScript:
   * 0 = nedelja
   * 1 = ponedeljak
   *
   * Naš kalendar:
   * 0 = ponedeljak
   * 6 = nedelja
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
   * Eva dobija prazna polja pre prvog dana
   * meseca, kako bi dani bili ispod pravog
   * dana u nedelji.
   *
   * Ostali slugovi ostaju po starom.
   */
  const calendarDates =
    isEvaSlug && hasValidEventDate
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

  const activeCalendarDay =
    isEvaSlug && hasValidEventDate
      ? eventDay
      : day;

  const locationLink =
    details?.mapLink ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      venue || ""
    )}`;

  return (
    <>
      <section
        className={`birthday-video-invitation birthday-video-${slug} ${
          isCyrillic
            ? "birthday-video-invitation-cyrillic"
            : ""
        }`}
      >
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

        <div className="birthday-video-overlay" />

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
          <h1 className="birthday-video-name">
            {name}
          </h1>

          <p className="birthday-video-subtitle">
            {subtitle}
          </p>

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

          <div className="birthday-video-info">
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

              <span>{venue}</span>
            </a>

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

              <span>{weddingTime}</span>
            </div>

            {details?.welcomeText && (
              <div className="birthday-video-welcome">
                {details.welcomeText}
              </div>
            )}

            {details?.note && (
              <div className="birthday-video-note">
                {details.note}
              </div>
            )}
          </div>
        </motion.div>
      </section>

      <BirthdaySplitRSVP
        slug={slug}
        eventType="birthday"
        brideName={brideName}
        details={details}
        backgroundImage={backgroundImage}
        script={activeScript}
      />

      <BirthdaySplitCountdown
        slug={slug}
        targetDate={details?.dateISO}
        backgroundImage={backgroundImage}
        script={activeScript}
        brideName={brideName}
        venue={venue}
        details={details}
      />
    </>
  );
}

export default BirthdaySplitInvitationCard;