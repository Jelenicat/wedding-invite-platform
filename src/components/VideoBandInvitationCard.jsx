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

  const revealUp = {
    hidden: {
      opacity: 0,
      y: 70,
      scale: 0.96,
      filter: "blur(14px)",
    },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1.15,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const revealSoft = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.985,
      filter: "blur(10px)",
    },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const staggerWrap = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.16,
      },
    },
  };

  const timelineReveal = {
    hidden: { opacity: 0, y: 34, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <>
      <section className="video-band-editorial">
        <motion.div
          className="video-band-editorial-hero"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
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
              custom={0.15}
            >
              Wedding day
            </motion.p>

            <motion.h1
              className="video-band-editorial-names"
              variants={revealUp}
              custom={0.28}
            >
              <span>{safeBrideName}</span>
              <span className="video-band-editorial-and">&</span>
              <span>{safeGroomName}</span>
            </motion.h1>

            {details.date && (
              <motion.p
                className="video-band-editorial-date"
                variants={revealSoft}
                custom={0.42}
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
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            variants={revealUp}
            custom={0.08}
          >
            <motion.div
              className="video-band-magazine-col video-band-magazine-col-left"
              variants={staggerWrap}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.18 }}
            >
              {details.welcomeText && (
                <motion.section
                  className="video-band-mag-block video-band-mag-block-soft"
                  variants={revealSoft}
                  custom={0.1}
                >
                  <p className="video-band-mag-text">{details.welcomeText}</p>
                </motion.section>
              )}

              {details.date && (
                <motion.section
                  className="video-band-mag-block"
                  variants={revealSoft}
                  custom={0.18}
                >
                  <p className="video-band-mag-label">Datum</p>
                  <h3 className="video-band-mag-date">{details.date}</h3>
                </motion.section>
              )}

              {details.venue && (
                <motion.section
                  className="video-band-mag-block"
                  variants={revealSoft}
                  custom={0.28}
                >
                  <p className="video-band-mag-label">Lokacija</p>
                  <h3 className="video-band-mag-heading">{details.venue}</h3>

                  {details.churchVenue && (
                    <p className="video-band-mag-subtext">
                      Crkva: {details.churchVenue}
                    </p>
                  )}

                  {details.mapLink && (
                    <a
                      href={details.mapLink}
                      target="_blank"
                      rel="noreferrer"
                      className="video-band-mag-link"
                    >
                      Otvori mapu
                    </a>
                  )}
                </motion.section>
              )}
            </motion.div>

            <motion.div
              className="video-band-magazine-col video-band-magazine-col-right"
              variants={staggerWrap}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.18 }}
            >
              {timelineItems.length > 0 && (
                <motion.section
                  className="video-band-mag-block"
                  variants={revealSoft}
                  custom={0.16}
                >
                  <p className="video-band-mag-label">Raspored</p>

                  <motion.div
                    className="video-band-elegant-timeline"
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
                  custom={0.28}
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
                        initial={{ opacity: 0, y: 16, scale: 0.82, filter: "blur(6px)" }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          filter: "blur(0px)",
                        }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.8,
                          delay: 0.18 + index * 0.12,
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
                  custom={0.38}
                >
                  <p className="video-band-mag-label">Napomena</p>
                  <p className="video-band-mag-text">{details.note}</p>
                </motion.section>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="video-band-scroll-section">
        <VideoBandRSVP />
      </div>

      {details.dateISO && (
        <div className="video-band-scroll-section">
          <VideoBandCountdown targetDate={details.dateISO} />
        </div>
      )}
    </>
  );
}

export default VideoBandInvitationCard;