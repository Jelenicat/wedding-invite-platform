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

  const isHanaSlug =
    slug === "hana-1" || slug === "hana-2";

  /*
   * Lara, Relja i Hana koriste isti CARD stil.
   */
  const usesLaraCardStyle =
    isLaraSlug ||
    isReljaSlug ||
    isHanaSlug;

  /*
   * VIDEO ZA GLAVNU KARTICU
   */
  const videoPath =
    videoSrc ||
    `/videos/${slug}.mp4`;

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
        : isHanaSlug
          ? "slavi svoj 1. rođendan"
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
   * Eva, Lara, Relja i Hana koriste pravi kalendar.
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

  // Poseban dizajn isključivo za hana-2.
  // Ostali slugovi nastavljaju kroz postojeći return ispod.
  if (slug === "hana-2") {
    const monthNames = [
      "Januar", "Februar", "Mart", "April", "Maj", "Jun",
      "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar",
    ];
    const weekdayNames = [
      "Nedelja", "Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota",
    ];
    const monthName = hasValidEventDate ? monthNames[eventMonth - 1] : month;
    const weekday = hasValidEventDate
      ? weekdayNames[new Date(Date.UTC(eventYear, eventMonth - 1, eventDay)).getUTCDay()]
      : "";
    const events = Array.isArray(details?.events) ? details.events : [];
    const reveal = {
      initial: { opacity: 0, y: 14 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, amount: 0.12 },
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    };

    return (
      <div className="hana2-shared-page">
        {/* Jedan video za celu unutrašnjost — samo hana-2 */}
        <div className="hana2-shared-video" aria-hidden="true">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={backgroundImage || undefined}
          >
            <source src={videoPath} type="video/mp4" />
          </video>
        </div>
        <div className="hana2-shared-content">
          <section className="hana2-day" lang="sr-Latn">
            <motion.article className="hana2-day-paper" {...reveal}>
              <img className="hana2-day-bow" src="/images/hana-2/bow.png" alt="" aria-hidden="true" />
              <header className="hana2-day-header">
                <p className="hana2-day-eyebrow">Dva razloga za radost</p>
                <h1 className="hana2-day-name">{name}</h1>
                <p className="hana2-day-subtitle">
                  slavi svoj prvi rođendan<br />i krštenje
                </p>
              </header>

              <motion.div className="hana2-day-calendar" {...reveal}>
                <div className="hana2-day-month">
                  {monthName} {hasValidEventDate ? eventYear : ""}
                </div>
                <div className="hana2-day-weekdays" aria-hidden="true">
                  {calendarDays.map((d) => <span key={d}>{d}</span>)}
                </div>
                <div className="hana2-day-dates" aria-label={`Kalendar: ${monthName} ${eventYear || ""}`}>
                  {calendarDates.map((d, index) => {
                    const active = d !== null && d === activeCalendarDay;
                    return (
                      <span
                        key={index}
                        className={`hana2-day-date${active ? " is-selected" : ""}`}
                        aria-label={active ? `${d}. ${monthName}, dan proslave` : undefined}
                      >
                        {active && (
                          <svg viewBox="0 0 40 40" aria-hidden="true">
                            <path d="M20 35 C16 31 3 23 3 13 C3 3 15 1 20 10 C25 1 37 3 37 13 C37 23 24 31 20 35Z" />
                          </svg>
                        )}
                        <span>{d ?? ""}</span>
                      </span>
                    );
                  })}
                </div>
                <div className="hana2-day-date-caption">
                  {weekday}{weekday && " · "}{hasValidEventDate ? `${String(eventDay).padStart(2, "0")}.${String(eventMonth).padStart(2, "0")}.${eventYear}.` : displayedDate}
                </div>
              </motion.div>

              <motion.div className="hana2-day-program" {...reveal}>
                <h2>Naš poseban dan</h2>
                {events.map((event, index) => {
                  const isChurch =
                    event.icon === "church" || /kr[šs]tenje/i.test(event.label || "");
                  const href = event.mapLink || (event.location
                    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`
                    : "");

                  return (
                    <div className="hana2-event-row" key={`${event.label}-${index}`}>
                      <div className="hana2-event-icon-wrap" aria-hidden="true">
                        {isChurch ? (
                          <img
                            className="hana2-event-icon hana2-event-church"
                            src="/images/hana-2/crkva.svg"
                            alt=""
                          />
                        ) : (
                          <svg
                            className="hana2-event-icon"
                            viewBox="0 0 64 64"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            {/* Torta na dva sprata, sa talasastim prelivom */}
                            <path d="M20 23C13 25 11 29 16 32C23 38 43 38 50 32C55 28 51 24 47 23" />
                            <path d="M14 29v12c0 4 8 8 19 8s19-4 19-8V29" />
                            <path d="M14 38C9 40 6 43 6 47v7c0 5 12 8 26 8s26-3 26-8v-7c0-4-2-7-6-9" />
                            <path d="M6 47c5 6 10-2 16 2s7 5 13 1 10-3 15 0 6-2 8-3" />
                            {[24, 34, 44].map((x) => (
                              <g key={x}>
                                <rect x={x - 1.6} y="12" width="3.2" height="10" rx=".5" />
                                <path d={`M${x} 10c-5 0-3-4 0-7 3 3 5 7 0 7Z`} />
                              </g>
                            ))}
                          </svg>
                        )}
                      </div>
                      <div className="hana2-event-main">
                        <div className="hana2-event-topline">
                          <h3 className="hana2-event-title">{event.label}</h3>
                          {event.time && (
                            <span className="hana2-event-time">{event.time} h</span>
                          )}
                        </div>
                        {event.location && (
                          <p className="hana2-event-location">{event.location}</p>
                        )}
                        {href && (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hana2-event-link"
                          >
                            Pogledaj lokaciju <svg
  className="hana2-map-arrow"
  viewBox="0 0 24 24"
  fill="none"
  aria-hidden="true"
>
  <path
    d="M7 17L17 7M7 7H17V17"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </motion.div>

              <motion.footer className="hana2-day-footer" {...reveal}>
                {details?.welcomeText && <p className="hana2-day-welcome">{details.welcomeText}</p>}
                {details?.rsvpDeadline ? (
                  <div className="hana2-day-deadline">
                    <span>Molimo vas da potvrdite dolazak do</span>
                    <strong>{details.rsvpDeadline}</strong>
                  </div>
                ) : details?.note ? (
                  <p className="hana2-day-deadline">{details.note}</p>
                ) : null}
              </motion.footer>
            </motion.article>
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
            venue={displayedVenue}
            details={details}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* =====================================================
          GLAVNA KARTICA
      ===================================================== */}

      <section
        className={`birthday-video-invitation birthday-video-${slug} ${
          slug === "hana-2"
            ? "birthday-video-hana-1"
            : ""
        } ${
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
            ) : isHanaSlug ? (
              <span>
                slavi svoj 1. rođendan
              </span>
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

          {/* =================================================
              INFO
          ================================================= */}

          <div className="birthday-video-info">

            {/* ===============================================
                HANA
            =============================================== */}

            {isHanaSlug &&
            Array.isArray(details?.events) ? (
              <div className="birthday-video-hana-events">

                {details.events.map(
                  (event, index) => (
                    <div
                      className="birthday-video-hana-event"
                      key={`${event.label}-${event.time}-${index}`}
                    >
                      {/* NAZIV DOGAĐAJA */}
                      {event.label && (
                        <div className="birthday-video-hana-event-title">
                          {event.label}
                        </div>
                      )}

                      {/* VREME + LOKACIJA */}
                      <div className="birthday-video-hana-event-details">

                        {/* VREME */}
                        {event.time && (
                          <div className="birthday-video-hana-event-detail">
                            <span
                              className="birthday-video-hana-detail-icon"
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
                                  strokeWidth="1.5"
                                />

                                <path
                                  d="M12 7.5v5l3 2"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>

                            <span>
                              {event.time}
                            </span>
                          </div>
                        )}

                        {/* LOKACIJA */}
                        {event.location && (
                          <a
                            href={
                              event.mapLink ||
                              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                event.location
                              )}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="birthday-video-hana-event-detail"
                          >
                            <span
                              className="birthday-video-hana-detail-icon"
                              aria-hidden="true"
                            >
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M12 21s-6-5.4-6-10a6 6 0 1 1 12 0c0 4.6-6 10-6 10Z"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />

                                <circle
                                  cx="12"
                                  cy="11"
                                  r="2.4"
                                  fill="currentColor"
                                />
                              </svg>
                            </span>

                            <span>
                              {event.location}
                            </span>
                          </a>
                        )}
                      </div>
                    </div>
                  )
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
            ) : (
              <>
                {/* ===========================================
                    SVI OSTALI SLUGOVI
                =========================================== */}

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
              </>
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
