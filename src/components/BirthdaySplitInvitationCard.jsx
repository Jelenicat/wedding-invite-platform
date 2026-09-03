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

  /*
   * Eva koristi videoSrc iz sluga.
   * Ostali slugovi zadržavaju stari način:
   * /videos/ime-sluga.mp4
   */
  const videoPath =
    isEvaSlug
      ? videoSrc || `/videos/${slug}.mp4`
      : `/videos/${slug}.mp4`;

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
  const subtitle = isCyrillic
    ? "слави свој рођендан"
    : "slavi svoj rođendan";

  /*
   * DANI U NEDELJI
   *
   * Lara dobija srpske oznake.
   * Eva ostaje kao ranije.
   * Ostali stari slugovi ostaju kao ranije.
   */
  const calendarDays = isCyrillic
    ? ["По", "Ут", "Ср", "Че", "Пе", "Су", "Не"]
    : isLaraSlug
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
   * Eva VEĆ koristi pravi kalendar.
   *
   * Sada ga koristi i Lara.
   *
   * Ostali stari slugovi ostaju potpuno
   * po starom.
   */
  const usesRealCalendar =
    isEvaSlug ||
    isLaraSlug;

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
   * Aktivni dan
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
      <section
        className={`birthday-video-invitation birthday-video-${slug} ${
          isCyrillic
            ? "birthday-video-invitation-cyrillic"
            : ""
        }`}
      >
        {/* VIDEO BACKGROUND */}
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
            {subtitle}
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

            {/* VREME
                Prikazuje se SAMO ako postoji.
                Eva ima vreme -> ostaje kao ranije.
                Lara trenutno nema -> nema prazne ikonice.
            */}
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

      {/* RSVP */}
      <BirthdaySplitRSVP
        slug={slug}
        eventType="birthday"
        brideName={brideName}
        details={details}
        backgroundImage={backgroundImage}
        script={activeScript}
      />

      {/* COUNTDOWN */}
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