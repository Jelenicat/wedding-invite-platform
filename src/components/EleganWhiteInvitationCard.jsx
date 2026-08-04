import { motion } from "framer-motion";
import "../styles/card.css";
import "../styles/rsvp.css";
import ElegantWhiteCountdown from "./ElegantWhiteCountdown";
import ElegantWhiteRSVP from "./ElegantWhiteRSVP";

function EleganWhiteInvitationCard({
  brideName = "Andrea",
  groomName = "Marko",
  weddingDate = "28 JUN 2025.",
  weddingTime = "16:00",
  details = {},
  slug,
  type,
  script,
}) {
  const events = details?.events || [];

  const activeScript =
    script || details?.script || "latin";

  const isCyrillic =
    activeScript === "cyrillic";

  const isIvanaDusanSlug =
    slug === "ivana-dusan";

  const copy = isCyrillic
    ? {
        introLineOne:
          "Са радошћу вас позивамо",
        introLineTwo:
          "да са нама прославите",
        eyebrow: "Наше венчање",
        connector: "и",
        timePrefix: "у",
        timeSuffix: "часова",
        closing:
          "Радујемо се вашем доласку!",
        scheduleTitle: "Распоред",
      }
    : {
        introLineOne:
          "Sa radošću vas pozivamo",
        introLineTwo:
          "da sa nama proslavite",
        eyebrow: "Naše venčanje",
        connector: "i",
        timePrefix: "u",
        timeSuffix: "časova",
        closing:
          "Radujemo se vašem dolasku!",
        scheduleTitle: "Raspored",
      };

  const formatMainDate = (
    dateString,
    dateISO
  ) => {
    const dayNames = isCyrillic
      ? [
          "НЕДЕЉА",
          "ПОНЕДЕЉАК",
          "УТОРАК",
          "СРЕДА",
          "ЧЕТВРТАК",
          "ПЕТАК",
          "СУБОТА",
        ]
      : [
          "NEDELJA",
          "PONEDELJAK",
          "UTORAK",
          "SREDA",
          "ČETVRTAK",
          "PETAK",
          "SUBOTA",
        ];

    const monthMap = {
      JAN: 0,
      JANUAR: 0,
      ЈАН: 0,
      ЈАНУАР: 0,

      FEB: 1,
      FEBRUAR: 1,
      ФЕБ: 1,
      ФЕБРУАР: 1,

      MAR: 2,
      MART: 2,
      МАР: 2,
      МАРТ: 2,

      APR: 3,
      APRIL: 3,
      АПР: 3,
      АПРИЛ: 3,

      MAJ: 4,
      МАЈ: 4,

      JUN: 5,
      ЈУН: 5,

      JUL: 6,
      ЈУЛ: 6,

      AVG: 7,
      AVGUST: 7,
      АВГ: 7,
      АВГУСТ: 7,

      SEP: 8,
      SEPTEMBAR: 8,
      СЕП: 8,
      СЕПТЕМБАР: 8,

      OKT: 9,
      OKTOBAR: 9,
      ОКТ: 9,
      ОКТОБАР: 9,

      NOV: 10,
      NOVEMBAR: 10,
      НОВ: 10,
      НОВЕМБАР: 10,

      DEC: 11,
      DECEMBAR: 11,
      ДЕЦ: 11,
      ДЕЦЕМБАР: 11,
    };

    let parsedDate = null;

    if (dateISO) {
      const isoDateOnly =
        String(dateISO).split("T")[0];

      const [year, month, day] =
        isoDateOnly
          .split("-")
          .map(Number);

      if (year && month && day) {
        parsedDate = new Date(
          year,
          month - 1,
          day
        );
      }
    }

    const parts = dateString
      ? dateString
          .trim()
          .split(/\s+/)
      : [];

    if (
      (!parsedDate ||
        Number.isNaN(
          parsedDate.getTime()
        )) &&
      parts.length >= 3
    ) {
      const day = Number(
        String(parts[0]).replace(
          /\D/g,
          ""
        )
      );

      const monthKey = String(
        parts[1] || ""
      )
        .replace(/\./g, "")
        .toUpperCase();

      const month =
        monthMap[monthKey];

      const year = Number(
        String(parts[2]).replace(
          /\D/g,
          ""
        )
      );

      if (
        day &&
        month !== undefined &&
        year
      ) {
        parsedDate = new Date(
          year,
          month,
          day
        );
      }
    }

    const dayName =
      parsedDate &&
      !Number.isNaN(
        parsedDate.getTime()
      )
        ? dayNames[
            parsedDate.getDay()
          ]
        : "";

    if (parts.length >= 3) {
      const cleanDay = String(
        parts[0]
      ).replace(/\.$/, "");

      const cleanMonth = String(
        parts[1]
      ).replace(/\.$/, "");

      const cleanYear = String(
        parts[2]
      ).replace(/\.$/, "");

      return {
        dayName,

        dayNumber:
          isIvanaDusanSlug
            ? `${cleanDay}.`
            : parts[0],

        monthYear:
          isIvanaDusanSlug
            ? `${cleanMonth}. ${cleanYear}.`
            : `${parts[1]} ${parts[2]}`,
      };
    }

    return {
      dayName,
      dayNumber:
        dateString || "",
      monthYear: "",
    };
  };

  const dateParts =
    formatMainDate(
      details?.date ||
        weddingDate,
      details?.dateISO
    );

  const getEventIcon = (
    event
  ) => {
    const label = String(
      event?.label || ""
    ).toLowerCase();

    const icon = String(
      event?.icon || ""
    ).toLowerCase();

    if (
      icon === "guests" ||
      icon === "guest" ||
      label.includes(
        "prijem gostiju"
      ) ||
      label.includes(
        "пријем гостију"
      ) ||
      label.includes(
        "doček gostiju"
      ) ||
      label.includes(
        "дочек гостију"
      ) ||
      label.includes("gosti") ||
      label.includes("гости") ||
      label.includes(
        "svatova"
      ) ||
      label.includes("сватова")
    ) {
      return "/images/passport/icons/guests.svg";
    }

    if (
      icon === "gathering" ||
      label.includes(
        "okupljanje"
      ) ||
      label.includes(
        "окупљање"
      ) ||
      label.includes("skup") ||
      label.includes("скуп")
    ) {
      return "/images/passport/icons/gathering.svg";
    }

    if (
      icon === "church" ||
      label.includes(
        "crkveno"
      ) ||
      label.includes(
        "црквено"
      ) ||
      label.includes("храм") ||
      label.includes("црква")
    ) {
      return "/images/passport/icons/church.svg";
    }

    if (
      icon === "civil" ||
      icon === "rings" ||
      icon === "ceremony" ||
      label.includes(
        "građansko"
      ) ||
      label.includes(
        "gradjansko"
      ) ||
      label.includes(
        "грађанско"
      ) ||
      label.includes(
        "ceremonija"
      ) ||
      label.includes(
        "церемонија"
      ) ||
      label.includes(
        "venčanje"
      ) ||
      label.includes(
        "venčanja"
      ) ||
      label.includes(
        "венчање"
      ) ||
      label.includes(
        "венчања"
      )
    ) {
      return "/images/passport/icons/rings.svg";
    }

    if (
      icon === "toast" ||
      label.includes(
        "zdravica"
      ) ||
      label.includes(
        "здравица"
      ) ||
      label.includes("koktel") ||
      label.includes("коктел") ||
      label.includes("piće") ||
      label.includes("пиће")
    ) {
      return "/images/passport/icons/toast.svg";
    }

    if (
      icon === "restaurant" ||
      icon === "dinner" ||
      label.includes("večera") ||
      label.includes("вечера") ||
      label.includes("ručak") ||
      label.includes("ручак") ||
      label.includes(
        "ресторан"
      )
    ) {
      return "/images/passport/icons/dinner.svg";
    }

    if (
      icon === "party" ||
      label.includes(
        "proslava"
      ) ||
      label.includes(
        "прослава"
      ) ||
      label.includes("after") ||
      label.includes("zabava") ||
      label.includes("забава") ||
      label.includes("ples") ||
      label.includes("плес")
    ) {
      return "/images/passport/icons/party.svg";
    }

    if (
      icon === "cake" ||
      label.includes("torta") ||
      label.includes("торта")
    ) {
      return "/images/passport/icons/cake.svg";
    }

    return "/images/passport/icons/event.svg";
  };

  return (
    <>
      <section
        className={`elegant-white-card-section ${
          isCyrillic
            ? "elegant-white-card-section--cyrillic"
            : ""
        }`}
        style={{
          backgroundImage: `url(${
            details?.backgroundImage ||
            "/images/elegant-white/background.jpg"
          })`,
        }}
      >
        <div className="elegant-white-card-overlay" />

        <motion.div
          className="elegant-white-card-shell"
          initial={{
            opacity: 0,
            y: 36,
            scale: 0.985,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.25,
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
          <div className="elegant-white-card-arch">
            <div className="elegant-white-card-inner">
              <motion.div
                className="elegant-white-monogram-wrap"
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
                }}
                transition={{
                  duration: 0.7,
                }}
              >
                <div className="elegant-white-monogram-frame-wrap">
                  <img
                    src="/images/elegant-white/monogram-frame.svg"
                    alt=""
                    aria-hidden="true"
                    className="elegant-white-monogram-frame"
                  />

                  <div className="elegant-white-monogram">
                    <span>
                      {brideName?.[0] ||
                        "A"}
                    </span>

                    <span className="elegant-white-monogram-divider" />

                    <span>
                      {groomName?.[0] ||
                        "M"}
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="elegant-white-intro-copy"
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
                  duration: 0.7,
                  delay: 0.05,
                }}
              >
                <p>
                  {
                    copy.introLineOne
                  }
                </p>

                <p>
                  {
                    copy.introLineTwo
                  }
                </p>
              </motion.div>

              <motion.h3
                className="elegant-white-eyebrow"
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
                  duration: 0.7,
                  delay: 0.1,
                }}
              >
                {copy.eyebrow}
              </motion.h3>

              <motion.div
                className="elegant-white-divider"
                initial={{
                  opacity: 0,
                  scaleX: 0.7,
                }}
                whileInView={{
                  opacity: 1,
                  scaleX: 1,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.16,
                }}
                style={{
                  transformOrigin:
                    "center",
                }}
              >
                <span />
              </motion.div>

              <motion.div
                className="elegant-white-names"
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
                  duration: 0.75,
                  delay: 0.14,
                }}
              >
                <h1>{brideName}</h1>

                <div className="elegant-white-and-row">
                  <img
                    src="/images/elegant-white/ileft.svg"
                    alt=""
                    aria-hidden="true"
                    className="elegant-white-and-icon"
                  />

                  <em>
                    {copy.connector}
                  </em>

                  <img
                    src="/images/elegant-white/iright.svg"
                    alt=""
                    aria-hidden="true"
                    className="elegant-white-and-icon"
                  />
                </div>

                <h1>{groomName}</h1>
              </motion.div>

              <motion.div
                className="elegant-white-date-row"
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
                  duration: 0.75,
                  delay: 0.2,
                }}
              >
                <div className="elegant-white-date-box">
                  <span>
                    {
                      dateParts.dayName
                    }
                  </span>
                </div>

                <div className="elegant-white-date-center">
                  <strong>
                    {
                      dateParts.dayNumber
                    }
                  </strong>
                </div>

                <div className="elegant-white-date-box">
                  <span>
                    {
                      dateParts.monthYear
                    }
                  </span>
                </div>
              </motion.div>

              {!isIvanaDusanSlug && (
                <motion.div
                  className="elegant-white-time"
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
                  }}
                  transition={{
                    duration: 0.7,
                    delay: 0.24,
                  }}
                >
                  {copy.timePrefix}{" "}
                  {details?.ceremonyTime ||
                    weddingTime}{" "}
                  {copy.timeSuffix}
                </motion.div>
              )}

              <motion.div
                className="elegant-white-closing"
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
                  duration: 0.7,
                  delay: 0.32,
                }}
              >
                {copy.closing}
              </motion.div>

              <div className="elegant-white-heart">
                ♡
              </div>
            </div>
          </div>
        </motion.div>

        {events.length > 0 && (
          <motion.div
            className="elegant-white-schedule-full"
            initial={{
              opacity: 0,
              y: 32,
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
              duration: 0.85,
              delay: 0.08,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >
            <div className="elegant-white-schedule-card">
              <div className="elegant-white-schedule-inner">
                <motion.h3
                  className="elegant-white-schedule-title"
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.65,
                  }}
                >
                  {
                    copy.scheduleTitle
                  }
                </motion.h3>

                <div className="elegant-white-schedule-divider">
                  <span />
                  <i>♡</i>
                  <span />
                </div>

                <div className="elegant-white-timeline">
                  <div className="elegant-white-timeline-line" />

                  {events.map(
                    (
                      event,
                      index
                    ) => (
                      <motion.div
                        className="elegant-white-event"
                        key={`${event.label}-${index}`}
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
                          amount: 0.5,
                        }}
                        transition={{
                          duration: 0.55,
                          delay:
                            index *
                            0.08,
                          ease: [
                            0.22,
                            1,
                            0.36,
                            1,
                          ],
                        }}
                      >
                        <div className="elegant-white-event-dot" />

                        <div className="elegant-white-event-icon-wrap">
                          <img
                            src={getEventIcon(
                              event
                            )}
                            alt=""
                            aria-hidden="true"
                            className="elegant-white-event-icon"
                          />
                        </div>

                        <div className="elegant-white-event-content">
                          <div className="elegant-white-event-time">
                            {
                              event.time
                            }
                          </div>

                          <div className="elegant-white-event-label">
                            {
                              event.label
                            }
                          </div>

                          {event.location &&
                            (event.mapLink ? (
                              <a
                                href={
                                  event.mapLink
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="elegant-white-event-location elegant-white-event-location-link"
                              >
                                {
                                  event.location
                                }
                              </a>
                            ) : (
                              <div className="elegant-white-event-location">
                                {
                                  event.location
                                }
                              </div>
                            ))}
                        </div>
                      </motion.div>
                    )
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      <ElegantWhiteRSVP
        slug={slug}
        eventType={type}
        note={details?.note}
        script={activeScript}
      />

      {details?.dateISO && (
        <ElegantWhiteCountdown
          targetDate={
            details.dateISO
          }
          backgroundImage={
            details?.backgroundImage
          }
          brideName={brideName}
          groomName={groomName}
          details={details}
          showCalendarButton={
            details?.showCalendarButton
          }
          script={activeScript}
        />
      )}
    </>
  );
}

export default EleganWhiteInvitationCard;