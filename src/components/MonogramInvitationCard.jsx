import { motion } from "framer-motion";
import EditorialRSVP from "./EditorialRSVP";
import EditorialCountdown from "./EditorialCountdown";

export default function MonogramInvitationCard({
  brideName,
  groomName,
  weddingDate,
  details = {},
  image1,
  venue,
  slug,
  type,
  backgroundImage,
}) {
  const events = details?.events || [];

  const dressWomen = details?.dressCodeWomen || "";
  const dressMen = details?.dressCodeMen || "";

  const dressCodePalette = Array.isArray(
    details?.dressCodePalette
  )
    ? details.dressCodePalette.filter(Boolean)
    : [];

  const dressCodeWomenPalette = Array.isArray(
    details?.dressCodeWomenPalette
  )
    ? details.dressCodeWomenPalette.filter(Boolean)
    : [];

  const dressCodeMenPalette = Array.isArray(
    details?.dressCodeMenPalette
  )
    ? details.dressCodeMenPalette.filter(Boolean)
    : [];

  const hasSeparatedDressCode =
    Boolean(dressWomen) ||
    Boolean(dressMen) ||
    dressCodeWomenPalette.length > 0 ||
    dressCodeMenPalette.length > 0;

  const shouldShowDressCode =
    details?.showDressCode &&
    (
      details?.dressCodeNote ||
      dressWomen ||
      dressMen ||
      dressCodePalette.length > 0 ||
      dressCodeWomenPalette.length > 0 ||
      dressCodeMenPalette.length > 0
    );

  const locationText =
    venue ||
    details?.venue ||
    details?.restaurantVenue ||
    events?.[events.length - 1]?.location ||
    "";

  const cardBackground =
    details?.cardBackgroundImage ||
    backgroundImage ||
    "";

  /* =========================================
     EVENT ICONS
  ========================================= */

  const getEventIcon = (event = {}) => {
    const label =
      String(event?.label || "")
        .toLowerCase()
        .trim();

    const icon =
      String(event?.icon || "")
        .toLowerCase()
        .trim();

    if (
      icon === "church" ||
      icon === "crkva" ||
      label.includes("crkven") ||
      label.includes("crkva")
    ) {
      return "/icons/church.svg";
    }

    if (
      icon === "gathering" ||
      label.includes("okupljanje") ||
      label.includes("skup")
    ) {
      return "/icons/gathering.svg";
    }

    if (
      icon === "civil" ||
      label.includes("građansko") ||
      label.includes("gradjansko")
    ) {
      return "/icons/civil.svg";
    }

    if (
      icon === "ceremony" ||
      label.includes("ceremon")
    ) {
      return "/icons/ceremony.svg";
    }

    if (
      icon === "dinner" ||
      label.includes("večera") ||
      label.includes("vecera")
    ) {
      return "/icons/dinner.svg";
    }

    if (
      icon === "restaurant" ||
      label.includes("restoran")
    ) {
      return "/icons/restaurant.svg";
    }

    if (
      icon === "party" ||
      label.includes("žurka") ||
      label.includes("zurka") ||
      label.includes("proslava")
    ) {
      return "/icons/party.svg";
    }

    return "/icons/rings.svg";
  };

  /* =========================================
     DRESS PALETTE
  ========================================= */

  const renderDressPalette = (
    palette,
    className = ""
  ) => {
    if (!palette.length) return null;

    return (
      <div
        className={`editorial-dress-palette-box ${className}`.trim()}
      >
        <div className="editorial-dress-palette">
          {palette.map((color, index) => (
            <span
              key={`${color}-${index}`}
              className="editorial-dress-palette-dot"
              style={{
                backgroundColor: color,
              }}
              aria-label={`Dress code boja ${index + 1}`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <section
      className={`editorial-card editorial-card--monogram ${
        slug ? `editorial-card--${slug}` : ""
      }`}
      style={{
        "--editorial-monogram-bg":
          cardBackground
            ? `url(${cardBackground})`
            : "none",
      }}
    >
      {/* BACKGROUND */}

      <div className="editorial-monogram-background" />

      <div className="editorial-monogram-background-overlay" />

      <div className="editorial-card-shell">
        <motion.div
          className="editorial-card-inner"
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
            amount: 0.15,
          }}
          transition={{
            duration: 0.8,
          }}
        >

          {/* =========================================
              HERO
          ========================================= */}

          <section className="editorial-hero editorial-monogram-hero">

            {/* IMENA */}

            <motion.div
              className="editorial-monogram-hero-names"
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
                duration: 0.8,
              }}
            >
              <span>{brideName}</span>

              <span className="editorial-monogram-hero-and">
                &
              </span>

              <span>{groomName}</span>
            </motion.div>


            {/* MINI NASLOV */}

            <motion.div
              className="editorial-monogram-hero-kicker"
              initial={{
                opacity: 0,
                y: 6,
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
              POZIVNICA ZA VENČANJE
            </motion.div>


            {/* UKRAS */}

            <motion.div
              className="editorial-monogram-hero-symbol"
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.65,
                delay: 0.15,
              }}
            >
              <span />

              <img
                src="/icons/rings.svg"
                alt=""
              />

              <span />
            </motion.div>


            {/* DATUM */}

            <motion.div
              className="editorial-hero-date"
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
                duration: 0.7,
                delay: 0.2,
              }}
            >
              {weddingDate}
            </motion.div>


            {/* WELCOME */}

            <motion.p
              className="editorial-hero-bottom editorial-monogram-welcome"
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
                duration: 0.7,
                delay: 0.25,
              }}
            >
              {details?.welcomeText ||
                "Biće nam izuzetno drago da svojim prisustvom ulepšate naš poseban dan."}
            </motion.p>
          </section>


          {/* =========================================
              LOKACIJA
          ========================================= */}

          <section className="editorial-section editorial-location-section">

            <motion.img
              src="/icons/restaurant.svg"
              alt=""
              className="editorial-monogram-section-icon"
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.6,
              }}
            />

            <h2 className="editorial-title">
              LOKACIJA
            </h2>

            <div className="editorial-script">
              restoran
            </div>

            {image1 && (
              <div className="editorial-location-image-wrap">
                <img
                  src={image1}
                  alt={`${brideName} i ${groomName}`}
                  className="editorial-location-image"
                />
              </div>
            )}

            <div className="editorial-location-text">
              {locationText ? (
                <div className="editorial-location-stack">

                  <div className="editorial-location-name-row">
                    {details?.mapLink ? (
                      <a
                        href={details.mapLink}
                        target="_blank"
                        rel="noreferrer"
                        className="editorial-location-main-link"
                      >
                        {locationText}
                      </a>
                    ) : (
                      <span className="editorial-location-main-link">
                        {locationText}
                      </span>
                    )}
                  </div>

                  {details?.mapLink && (
                    <div className="editorial-location-button-row">
                      <a
                        href={details.mapLink}
                        target="_blank"
                        rel="noreferrer"
                        className="editorial-map-link"
                      >
                        Otvori lokaciju
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <p
                  style={{
                    opacity: 0.5,
                  }}
                >
                  Lokacija uskoro
                </p>
              )}
            </div>
          </section>


          {/* =========================================
              RASPORED
          ========================================= */}

          {!!events.length && (
            <section className="editorial-section editorial-timing-section">

              <motion.img
                src="/icons/ceremony.svg"
                alt=""
                className="editorial-monogram-section-icon"
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.6,
                }}
              />

              <h2 className="editorial-title">
                RASPORED
              </h2>

              <div className="editorial-script">
                naš dan
              </div>

              <div className="editorial-timeline">

                <div className="editorial-timeline-line" />

                {events.map(
                  (
                    event,
                    index
                  ) => {
                    const eventIconSrc =
                      getEventIcon(event);

                    return (
                      <motion.div
                        className="editorial-timeline-item editorial-monogram-timeline-item"
                        key={`${event.time || "event"}-${index}`}
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
                          duration: 0.55,
                          delay:
                            index * 0.07,
                        }}
                      >

                        {event.time && (
                          <div className="editorial-time">
                            {event.time}
                          </div>
                        )}

                        {eventIconSrc && (
                          <div className="editorial-monogram-event-icon-wrap">
                            <img
                              src={eventIconSrc}
                              alt=""
                              className="editorial-event-icon editorial-monogram-event-icon"
                            />
                          </div>
                        )}

                        {event.label && (
                          <div className="editorial-time-label">
                            {event.label}
                          </div>
                        )}

                        {event.location &&
                          (
                            event.mapLink
                              ? (
                                <a
                                  href={event.mapLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="editorial-time-location editorial-time-location-link"
                                >
                                  {event.location}
                                </a>
                              )
                              : (
                                <div className="editorial-time-location">
                                  {event.location}
                                </div>
                              )
                          )}
                      </motion.div>
                    );
                  }
                )}
              </div>
            </section>
          )}


          {/* =========================================
              DRESS CODE
          ========================================= */}

          {shouldShowDressCode && (
            <section className="editorial-section editorial-dress-section">

              <motion.img
                src="/icons/dresscode.svg"
                alt=""
                className="editorial-monogram-section-icon editorial-monogram-dress-icon"
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.6,
                }}
              />

              <h2 className="editorial-title editorial-dress-title">
                KOD
                <br />
                OBLAČENJA
              </h2>

              {details?.dressCodeNote && (
                <div className="editorial-dress-copy">
                  <p>
                    {details.dressCodeNote}
                  </p>
                </div>
              )}

              {hasSeparatedDressCode ? (
                <div className="editorial-dress-roles">

                  {(
                    dressWomen ||
                    dressCodeWomenPalette.length > 0
                  ) && (
                    <div className="editorial-dress-role">

                      <h3 className="editorial-dress-role-title">
                        Dame
                      </h3>

                      {dressWomen && (
                        <p className="editorial-dress-role-text">
                          {dressWomen}
                        </p>
                      )}

                      {renderDressPalette(
                        dressCodeWomenPalette,
                        "editorial-dress-palette-box--women"
                      )}
                    </div>
                  )}

                  {(
                    dressMen ||
                    dressCodeMenPalette.length > 0
                  ) && (
                    <div className="editorial-dress-role editorial-dress-role--men">

                      <h3 className="editorial-dress-role-title">
                        Gospoda
                      </h3>

                      {dressMen && (
                        <p className="editorial-dress-role-text">
                          {dressMen}
                        </p>
                      )}

                      {renderDressPalette(
                        dressCodeMenPalette,
                        "editorial-dress-palette-box--men"
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {!details?.dressCodeNote && (
                    <div className="editorial-dress-copy">
                      <p>
                        Elegantna garderoba u skladu sa stilom proslave.
                      </p>
                    </div>
                  )}

                  {renderDressPalette(
                    dressCodePalette
                  )}
                </>
              )}
            </section>
          )}


          {/* =========================================
              RSVP
          ========================================= */}

          <EditorialRSVP
            slug={slug}
            eventType={type || "wedding"}
            brideName={brideName}
            groomName={groomName}
            note={details?.note}
          />


          {/* =========================================
              COUNTDOWN
          ========================================= */}

          <EditorialCountdown
            targetDate={details?.dateISO}
            brideName={brideName}
            groomName={groomName}
            details={details}
            script={details?.script || "latin"}
            slug={slug}
          />
        </motion.div>
      </div>
    </section>
  );
}