import { motion } from "framer-motion";
import "../styles/birthdaycard.css";

import BirthdayHeartsRSVP from "./BirthdayHeartsRSVP";
import BirthdayHeartsCountdown from "./BirthdayHeartsCountdown";

const MONTHS_LATIN = [
  "januar",
  "februar",
  "mart",
  "april",
  "maj",
  "jun",
  "jul",
  "avgust",
  "septembar",
  "oktobar",
  "novembar",
  "decembar",
];

const MONTHS_CYRILLIC = [
  "јануар",
  "фебруар",
  "март",
  "април",
  "мај",
  "јун",
  "јул",
  "август",
  "септембар",
  "октобар",
  "новембар",
  "децембар",
];

const DAYS_LATIN = [
  "Po",
  "Ut",
  "Sr",
  "Če",
  "Pe",
  "Su",
  "Ne",
];

const DAYS_CYRILLIC = [
  "По",
  "Ут",
  "Ср",
  "Че",
  "Пе",
  "Су",
  "Не",
];

function parseEventDate(dateISO, fallbackDate) {
  if (dateISO) {
    const clean = String(dateISO)
      .slice(0, 10)
      .split("-")
      .map(Number);

    if (
      clean.length === 3 &&
      clean.every(Number.isInteger)
    ) {
      return {
        year: clean[0],
        month: clean[1],
        day: clean[2],
      };
    }
  }

  if (fallbackDate) {
    const match = String(fallbackDate).match(
      /(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{4})/
    );

    if (match) {
      return {
        day: Number(match[1]),
        month: Number(match[2]),
        year: Number(match[3]),
      };
    }
  }

  return null;
}

function buildCalendar(year, month) {
  if (!year || !month) {
    return [];
  }

  const firstDay = new Date(
    Date.UTC(
      year,
      month - 1,
      1
    )
  ).getUTCDay();

  const mondayFirstOffset =
    (firstDay + 6) % 7;

  const daysInMonth = new Date(
    Date.UTC(
      year,
      month,
      0
    )
  ).getUTCDate();

  return [
    ...Array.from(
      {
        length:
          mondayFirstOffset,
      },
      () => null
    ),

    ...Array.from(
      {
        length:
          daysInMonth,
      },
      (_, index) =>
        index + 1
    ),
  ];
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 21s-6-5.4-6-10a6 6 0 1 1 12 0c0 4.6-6 10-6 10Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="12"
        cy="11"
        r="2.3"
        fill="currentColor"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="8.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />

      <path
        d="M12 7.5v5l3.2 2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BirthdayHeartsInvitationCard({
  slug,

  brideName,
  childName,

  weddingDate,
  weddingTime,

  venue,

  details = {},

  backgroundImage,

  script = "latin",
}) {
  /* =========================================================
     JEZIK / PISMO
  ========================================================= */

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

  /* =========================================================
     IME
  ========================================================= */

  const name =
    childName ||
    brideName ||
    details?.childName ||
    (
      isCyrillic
        ? "Име"
        : "Ime"
    );

  /* =========================================================
     DATUM
  ========================================================= */

  const dateData =
    parseEventDate(
      details?.dateISO,

      details?.date ||
        weddingDate
    );

  const year =
    dateData?.year;

  const monthNumber =
    dateData?.month;

  const activeDay =
    dateData?.day;

  const months =
    isCyrillic
      ? MONTHS_CYRILLIC
      : MONTHS_LATIN;

  const weekdays =
    isCyrillic
      ? DAYS_CYRILLIC
      : DAYS_LATIN;

  const monthName =
    monthNumber
      ? months[
          monthNumber - 1
        ]
      : "";

  const calendarDates =
    dateData
      ? buildCalendar(
          year,
          monthNumber
        )
      : [];

  /* =========================================================
     POZADINA
  ========================================================= */

  const cardBackgroundImage =
    details?.cardBackgroundImage ||
    backgroundImage ||
    details?.introBackgroundImage ||
    "";

  /* =========================================================
     LOKACIJA
  ========================================================= */

  const displayedVenue =
    details?.venueDetails
      ? `${venue}, ${details.venueDetails}`
      : venue;

  const locationLink =
    details?.mapLink ||
    (
      displayedVenue
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            displayedVenue
          )}`
        : ""
    );

  /* =========================================================
     TEKSTOVI
  ========================================================= */

  const subtitle =
    details?.cardSubtitle ||
    details?.subtitle ||
    (
      isCyrillic
        ? "слави свој први рођендан"
        : "slavi svoj prvi rođendan"
    );

  const kicker =
    details?.cardKicker ||
    (
      isCyrillic
        ? "Мало срце, велика љубав"
        : "Malo srce, velika ljubav"
    );

  const welcomeText =
    details?.welcomeText ||
    (
      isCyrillic
        ? "Дођите да заједно створимо још једну лепу успомену."
        : "Dođite da zajedno stvorimo još jednu lepu uspomenu."
    );

  /* =========================================================
     DOGAĐAJI
  ========================================================= */

  const eventList =
    Array.isArray(
      details?.events
    )
      ? details.events
      : [];

  return (
    <>
      {/* =====================================================
          INVITATION CARD
      ===================================================== */}

      <section
        className={`bhc-page bhc-${
          slug || "birthday"
        }`}
        style={
          cardBackgroundImage
            ? {
                "--bhc-background":
                  `url("${cardBackgroundImage}")`,
              }
            : undefined
        }
      >
        {/* POZADINA */}

        <div
          className="bhc-background"
          aria-hidden="true"
        />

        <div
          className="bhc-background-softener"
          aria-hidden="true"
        />

        {/* =================================================
            GLAVNA KARTICA
        ================================================= */}

        <motion.article
          className="bhc-card"
          initial={{
            opacity: 0,
            y: 34,
            scale: 0.975,
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
            duration: 0.9,

            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
        >
          <div
            className="bhc-soft-glow bhc-soft-glow-one"
            aria-hidden="true"
          />

          <div
            className="bhc-soft-glow bhc-soft-glow-two"
            aria-hidden="true"
          />

          {/* ===============================================
              HEADING
          =============================================== */}

          <header className="bhc-heading">
            <p className="bhc-kicker">
              {kicker}
            </p>

            <h1 className="bhc-name">
              {name}
            </h1>

            <p className="bhc-subtitle">
              {subtitle}
            </p>

            <div
              className="bhc-heading-flourish"
              aria-hidden="true"
            >
              <span />

              <span className="bhc-flourish-heart">
                ♡
              </span>

              <span />
            </div>
          </header>

          {/* ===============================================
              KALENDAR
          =============================================== */}

          {dateData && (
            <motion.div
              className="bhc-calendar"
              initial={{
                opacity: 0,
                y: 18,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.7,
                delay: 0.12,
              }}
            >
              <div className="bhc-calendar-script">
                {isCyrillic
                  ? "наш посебан дан"
                  : "naš poseban dan"}
              </div>

              <div className="bhc-calendar-heading">
                <span className="bhc-calendar-month">
                  {monthName}
                </span>

                <span className="bhc-calendar-year">
                  {year}
                </span>
              </div>

              {/* DANI U NEDELJI */}

              <div className="bhc-calendar-weekdays">
                {weekdays.map(
                  (dayLabel) => (
                    <span
                      key={
                        dayLabel
                      }
                    >
                      {
                        dayLabel
                      }
                    </span>
                  )
                )}
              </div>

              {/* BROJEVI */}

              <div className="bhc-calendar-grid">
                {calendarDates.map(
                  (
                    calendarDay,
                    index
                  ) => (
                    <span
                      key={
                        calendarDay ===
                        null
                          ? `empty-${index}`
                          : calendarDay
                      }
                      className={[
                        "bhc-calendar-day",

                        calendarDay ===
                        null
                          ? "is-empty"
                          : "",

                        calendarDay ===
                        activeDay
                          ? "is-active"
                          : "",
                      ]
                        .filter(
                          Boolean
                        )
                        .join(
                          " "
                        )}
                    >
                      {calendarDay ||
                        ""}

                      {calendarDay ===
                        activeDay && (
                        <span
                          className="bhc-calendar-heart"
                          aria-hidden="true"
                        >
                          ♡
                        </span>
                      )}
                    </span>
                  )
                )}
              </div>
            </motion.div>
          )}

          {/* ===============================================
              WELCOME
          =============================================== */}

          <motion.div
            className="bhc-message"
            initial={{
              opacity: 0,
              y: 16,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
              delay: 0.2,
            }}
          >
            {welcomeText}
          </motion.div>

          {/* ===============================================
              INFO / EVENTS
          =============================================== */}

          <div className="bhc-info">
            {eventList.length >
            0 ? (
              eventList.map(
                (
                  event,
                  index
                ) => (
                  <motion.div
                    className="bhc-event"
                    key={`${
                      event.label ||
                      "event"
                    }-${index}`}
                    initial={{
                      opacity: 0,
                      y: 14,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.6,

                      delay:
                        0.23 +
                        index *
                          0.08,
                    }}
                  >
                    {/* NAZIV DOGAĐAJA */}

                    {event.label && (
                      <div className="bhc-event-title">
                        {
                          event.label
                        }
                      </div>
                    )}

                    <div className="bhc-event-meta">
                      {/* VREME */}

                      {event.time && (
                        <div className="bhc-meta-row">
                          <span className="bhc-meta-icon">
                            <ClockIcon />
                          </span>

                          <span>
                            {
                              event.time
                            }
                          </span>
                        </div>
                      )}

                      {/* LOKACIJA */}

                      {event.location && (
                        <a
                          className="bhc-meta-row"
                          href={
                            event.mapLink ||
                            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              event.location
                            )}`
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span className="bhc-meta-icon">
                            <LocationIcon />
                          </span>

                          <span>
                            {
                              event.location
                            }
                          </span>
                        </a>
                      )}
                    </div>
                  </motion.div>
                )
              )
            ) : (
              <>
                {/* VREME */}

                {weddingTime && (
                  <motion.div
                    className="bhc-info-row"
                    initial={{
                      opacity: 0,
                      x: -12,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: 0.25,
                    }}
                  >
                    <span className="bhc-info-icon">
                      <ClockIcon />
                    </span>

                    <div className="bhc-info-content">
                      <span className="bhc-info-label">
                        {isCyrillic
                          ? "Време"
                          : "Vreme"}
                      </span>

                      <span className="bhc-info-value">
                        {
                          weddingTime
                        }
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* MESTO */}

                {displayedVenue && (
                  <motion.a
                    className="bhc-info-row"
                    href={
                      locationLink
                    }
                    target="_blank"
                    rel="noreferrer"
                    initial={{
                      opacity: 0,
                      x: 12,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: 0.32,
                    }}
                  >
                    <span className="bhc-info-icon">
                      <LocationIcon />
                    </span>

                    <div className="bhc-info-content">
                      <span className="bhc-info-label">
                        {isCyrillic
                          ? "Место"
                          : "Mesto"}
                      </span>

                      <span className="bhc-info-value">
                        {
                          displayedVenue
                        }
                      </span>
                    </div>
                  </motion.a>
                )}
              </>
            )}
          </div>

          {/* ===============================================
              NOTE
          =============================================== */}

          {details?.note && (
            <p className="bhc-note">
              {
                details.note
              }
            </p>
          )}

          {/* ===============================================
              BOTTOM DECORATION
          =============================================== */}

          <div
            className="bhc-bottom-decoration"
            aria-hidden="true"
          >
            <span />

            <span className="bhc-bottom-script">
              one
            </span>

            <span />
          </div>
        </motion.article>
      </section>

      {/* =====================================================
          NOVI RSVP
      ===================================================== */}

      <BirthdayHeartsRSVP
        slug={slug}
        eventType="birthday"
        brideName={
          brideName
        }
        childName={
          childName
        }
        details={
          details
        }
        backgroundImage={
          cardBackgroundImage
        }
        script={
          activeScript
        }
      />

      {/* =====================================================
          NOVI COUNTDOWN
      ===================================================== */}

      <BirthdayHeartsCountdown
        slug={slug}
        targetDate={
          details?.dateISO
        }
        backgroundImage={
          cardBackgroundImage
        }
        script={
          activeScript
        }
        brideName={
          brideName
        }
        childName={
          childName
        }
        venue={
          displayedVenue
        }
        details={
          details
        }
      />
    </>
  );
}

export default BirthdayHeartsInvitationCard;