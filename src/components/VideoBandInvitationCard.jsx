import { motion } from "framer-motion";
import VideoBandRSVP from "./VideoBandRSVP";
import VideoBandCountdown from "./VideoBandCountdown";
import "../styles/card.css";
import "../styles/rsvp.css";

function VideoBandInvitationCard({
  brideName,
  groomName,
  details = {},
  videoSrc,
  slug,
  type,
}) {
  const safeBrideName = brideName || "Bride";
  const safeGroomName = groomName || "Groom";

  const timelineItems =
    details.events?.length > 0
      ? details.events.map((item) => ({
          label: item.label,
          value: item.time,
          location: item.location,
        }))
      : [
          {
            label: "Skup gostiju",
            value: details.gatheringTime,
            location: "",
          },
          {
            label: "Crkveno venčanje",
            value: details.churchTime,
            location: details.churchVenue || "",
          },
          {
            label: "Građansko venčanje",
            value: details.ceremonyTime,
            location: details.venue || "",
          },
          {
            label: "Proslava",
            value: details.dinnerTime,
            location: details.venue || "",
          },
        ].filter((item) => item.value);

  const heroFade = {
    hidden: {
      opacity: 0,
      scale: 1.02,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const staggerWrap = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const revealUp = {
    hidden: {
      opacity: 0,
      y: 34,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const revealSoft = {
    hidden: {
      opacity: 0,
      y: 18,
      filter: "blur(6px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const formatDateParts = (dateString) => {
    if (!dateString) {
      return { day: "08", month: "AVG", year: "2026" };
    }

    const parts = dateString.split(" ");
    return {
      day: parts[0] || "08",
      month: parts[1] || "AVG",
      year: parts[2] || "2026",
    };
  };

  const { day, month, year } = formatDateParts(details.date);

  return (
    <>
      <section className="video-band-editorial">
        <motion.div
          className="video-band-editorial-hero"
          initial="hidden"
          animate="visible"
          variants={heroFade}
        >
          <video
            className="video-band-editorial-video"
            src={videoSrc || "/videos/wedding2.mp4"}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/video-poster.jpg"
          />

          <div className="video-band-editorial-overlay" />
          <div className="video-band-editorial-glow" />
          <div className="video-band-editorial-grain" />

          <motion.div
            className="video-band-editorial-names-wrap"
            initial="hidden"
            animate="visible"
            variants={staggerWrap}
          >
            <motion.p
              className="video-band-editorial-kicker"
              variants={revealSoft}
            >
              Pozivnica
            </motion.p>

            <motion.h1
              className="video-band-editorial-names"
              variants={revealUp}
            >
              <span>{safeBrideName}</span>
              <span className="video-band-editorial-and">&</span>
              <span>{safeGroomName}</span>
            </motion.h1>

            {details.welcomeText && (
              <motion.p
                className="video-band-editorial-welcome"
                variants={revealSoft}
              >
                {details.welcomeText}
              </motion.p>
            )}

            {details.date && (
              <motion.p
                className="video-band-editorial-date"
                variants={revealSoft}
              >
                {details.date}
              </motion.p>
            )}
          </motion.div>
        </motion.div>

        <div className="video-band-editorial-sheet">
          <motion.div
            className="video-band-magazine-grid"
            initial="hidden"
            animate="visible"
            variants={staggerWrap}
          >
            <motion.div
              className="video-band-magazine-col video-band-magazine-col-left"
              variants={revealSoft}
            >
              <section className="video-band-mag-block video-band-mag-calendar-block">
                <p className="video-band-mag-label">Datum događaja</p>

                <div className="video-band-date-layout">
                  <div className="video-band-calendar-card">
                    <div className="video-band-calendar-month">{month}</div>
                    <div className="video-band-calendar-day">{day}</div>
                    <div className="video-band-calendar-year">{year}</div>
                  </div>

                  <div className="video-band-date-copy">
                    {details.date && (
                      <h3 className="video-band-mag-date">{details.date}</h3>
                    )}

                    {details.venue && (
                      <p className="video-band-mag-subtext">
                        {details.venue}
                      </p>
                    )}

                    {details.churchVenue && (
                      <p className="video-band-mag-subtext">
                        Crkva: {details.churchVenue}
                      </p>
                    )}

                    {details.mapLink && (
                      <motion.a
                        href={details.mapLink}
                        target="_blank"
                        rel="noreferrer"
                        className="video-band-mag-link"
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        Otvori mapu
                      </motion.a>
                    )}
                  </div>
                </div>
              </section>

              {details.welcomeText && (
                <motion.section
                  className="video-band-mag-block video-band-mag-block-soft"
                  variants={revealSoft}
                >
                  <p className="video-band-mag-label">Dobro došli</p>
                  <p className="video-band-mag-text">{details.welcomeText}</p>
                </motion.section>
              )}

              {details.note && (
                <motion.section
                  className="video-band-mag-block video-band-mag-block-soft"
                  variants={revealSoft}
                >
                  <p className="video-band-mag-label">Napomena</p>
                  <p className="video-band-mag-text">{details.note}</p>
                </motion.section>
              )}
            </motion.div>

            <motion.div
              className="video-band-magazine-col video-band-magazine-col-right"
              variants={revealSoft}
            >
              {timelineItems.length > 0 && (
                <motion.section
                  className="video-band-mag-block"
                  variants={revealSoft}
                >
                  <div className="video-band-mag-heading-wrap">
                    <p className="video-band-mag-label">Program dana</p>
                    <p className="video-band-mag-script">Schedule</p>
                  </div>

                  <div className="video-band-elegant-timeline video-band-program-timeline">
                    {timelineItems.map((item, index) => (
                      <div
                        key={`${item.label}-${index}`}
                        className="video-band-elegant-row video-band-program-row"
                      >
                        <div className="video-band-program-time">
                          {item.value}
                        </div>

                        <div className="video-band-program-line-wrap">
                          <span className="video-band-program-dot" />
                          <span className="video-band-program-line" />
                        </div>

                        <div className="video-band-elegant-content">
                          <div className="video-band-elegant-title">
                            {item.label}
                          </div>

                          {item.location && (
                            <div className="video-band-program-location">
                              {item.location}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {details.dressCodePalette?.length > 0 && (
                <motion.section
                  className="video-band-mag-block"
                  variants={revealSoft}
                >
                  <div className="video-band-mag-heading-wrap">
                    <p className="video-band-mag-label">
                      {details.dressCodeTitle || "Dress code"}
                    </p>
                    <p className="video-band-mag-script">Style</p>
                  </div>

                  <div className="video-band-mag-palette video-band-mag-palette-centered">
                    {details.dressCodePalette.map((color, index) => (
                      <motion.span
                        key={`${color}-${index}`}
                        className="video-band-mag-palette-dot"
                        style={{ backgroundColor: color }}
                        aria-label={`dress code color ${index + 1}`}
                        initial={{
                          opacity: 0,
                          y: 10,
                          scale: 0.9,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                        }}
                        transition={{
                          duration: 0.45,
                          delay: 0.15 + index * 0.06,
                        }}
                      />
                    ))}
                  </div>

                  {details.dressCodeNote && (
                    <p className="video-band-mag-subtext video-band-dress-note">
                      {details.dressCodeNote}
                    </p>
                  )}
                </motion.section>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <motion.div
        className="video-band-scroll-section"
        initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
      >
        <VideoBandRSVP slug={slug} eventType={type} />
      </motion.div>

      {details.dateISO && (
        <motion.div
          className="video-band-scroll-section"
          initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{
            duration: 0.95,
            delay: 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <VideoBandCountdown targetDate={details.dateISO} />
        </motion.div>
      )}
    </>
  );
}

export default VideoBandInvitationCard;