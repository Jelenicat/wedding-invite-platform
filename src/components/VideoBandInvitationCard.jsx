import { motion } from "framer-motion";
import VideoBandRSVP from "./VideoBandRSVP";
import VideoBandCountdown from "./VideoBandCountdown";
import "../styles/card.css";
import "../styles/rsvp.css";

function VideoBandInvitationCard({
  brideName,
  groomName,
  videoSrc,
  details = {},
}) {
  const safeBrideName = brideName || "Bride";
  const safeGroomName = groomName || "Groom";

  const iconMap = {
    gathering: "/icons/gathering.svg",
    church: "/icons/church.svg",
    restaurant: "/icons/restaurant.svg",
    civil: "/icons/civil.svg",
  };

  const timelineItems =
    details.events?.length > 0
      ? details.events.map((item) => ({
          label: item.label,
          value: item.time,
          iconSrc: iconMap[item.icon],
        }))
      : [
          {
            label: "Skup svatova",
            value: details.gatheringTime,
            iconSrc: "/icons/gathering.svg",
          },
          {
            label: "Crkveno venčanje",
            value: details.churchTime,
            iconSrc: "/icons/church.svg",
          },
          {
            label: "Svečani ručak",
            value: details.dinnerTime,
            iconSrc: "/icons/restaurant.svg",
          },
          {
            label: "Građansko venčanje",
            value: details.ceremonyTime,
            iconSrc: "/icons/civil.svg",
          },
        ].filter((item) => item.value);

  const heroFade = {
    hidden: {
      opacity: 0,
      scale: 1.03,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1.1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const staggerWrap = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.14,
      },
    },
  };

  const revealUp = {
    hidden: {
      opacity: 0,
      y: 56,
      scale: 0.97,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.95,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const revealSoft = {
    hidden: {
      opacity: 0,
      y: 28,
      scale: 0.99,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const timelineReveal = {
    hidden: {
      opacity: 0,
      x: -18,
      y: 18,
      filter: "blur(6px)",
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

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
              Wedding day
            </motion.p>

            <motion.h1
              className="video-band-editorial-names"
              variants={revealUp}
            >
              <span>{safeBrideName}</span>
              <span className="video-band-editorial-and">&</span>
              <span>{safeGroomName}</span>
            </motion.h1>

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
            variants={revealUp}
          >
            <motion.div
              className="video-band-magazine-col video-band-magazine-col-left"
              initial="hidden"
              animate="visible"
              variants={staggerWrap}
            >
              {details.welcomeText && (
                <motion.section
                  className="video-band-mag-block video-band-mag-block-soft"
                  variants={revealSoft}
                >
                  <p className="video-band-mag-text">{details.welcomeText}</p>
                </motion.section>
              )}

              {details.date && (
                <motion.section
                  className="video-band-mag-block"
                  variants={revealSoft}
                >
                  <p className="video-band-mag-label">Datum</p>
                  <h3 className="video-band-mag-date">{details.date}</h3>
                </motion.section>
              )}

              {details.venue && (
                <motion.section
                  className="video-band-mag-block"
                  variants={revealSoft}
                >
                  <p className="video-band-mag-label">Lokacija</p>
                  <h3 className="video-band-mag-heading">{details.venue}</h3>

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
                      whileHover={{ y: -4, scale: 1.02 }}
                      transition={{ duration: 0.25 }}
                    >
                      Otvori mapu
                    </motion.a>
                  )}
                </motion.section>
              )}
            </motion.div>

            <motion.div
              className="video-band-magazine-col video-band-magazine-col-right"
              initial="hidden"
              animate="visible"
              variants={staggerWrap}
            >
              {timelineItems.length > 0 && (
                <motion.section
                  className="video-band-mag-block"
                  variants={revealSoft}
                >
                  <p className="video-band-mag-label">Raspored</p>

                  <motion.div
                    className="video-band-elegant-timeline"
                    initial="hidden"
                    animate="visible"
                    variants={staggerWrap}
                  >
                    {timelineItems.map((item, index) => (
                      <motion.div
                        key={`${item.label}-${index}`}
                        className="video-band-elegant-row"
                        variants={timelineReveal}
                      >
                        <div className="video-band-elegant-icon">
                          {item.iconSrc && <img src={item.iconSrc} alt="" />}
                        </div>

                        <div className="video-band-elegant-content">
                          <div className="video-band-elegant-time">
                            {item.value}
                          </div>
                          <div className="video-band-elegant-title">
                            {item.label}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.section>
              )}

              {details.dressCodePalette?.length > 0 && (
                <motion.section
                  className="video-band-mag-block"
                  variants={revealSoft}
                >
                  <p className="video-band-mag-label">
                    {details.dressCodeTitle || "Dress code"}
                  </p>

                  <div className="video-band-mag-palette">
                    {details.dressCodePalette.map((color, index) => (
                      <motion.span
                        key={`${color}-${index}`}
                        className="video-band-mag-palette-dot"
                        style={{ backgroundColor: color }}
                        aria-label={`dress code color ${index + 1}`}
                        initial={{
                          opacity: 0,
                          y: 14,
                          scale: 0.88,
                          filter: "blur(4px)",
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          filter: "blur(0px)",
                        }}
                        transition={{
                          duration: 0.7,
                          delay: 0.55 + index * 0.1,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    ))}
                  </div>

                  {details.dressCodeNote && (
                    <p className="video-band-mag-subtext">
                      {details.dressCodeNote}
                    </p>
                  )}
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
        <VideoBandRSVP />
      </motion.div>

      {details.dateISO && (
        <motion.div
          className="video-band-scroll-section"
          initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.95, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <VideoBandCountdown targetDate={details.dateISO} />
        </motion.div>
      )}
    </>
  );
}

export default VideoBandInvitationCard;