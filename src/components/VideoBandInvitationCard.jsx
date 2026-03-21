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

  return (
    <>
      <motion.section
        className="video-band-editorial"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="video-band-editorial-hero">
          <video
            className="video-band-editorial-video"
            src={videoSrc || "/videos/wedding2.mp4"}
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="video-band-editorial-overlay" />

          <div className="video-band-editorial-names-wrap">
            <p className="video-band-editorial-kicker">Wedding day</p>

            <h1 className="video-band-editorial-names">
              <span>{safeBrideName}</span>
              <span className="video-band-editorial-and">&</span>
              <span>{safeGroomName}</span>
            </h1>

            {details.date && (
              <p className="video-band-editorial-date">{details.date}</p>
            )}
          </div>
        </div>

        <div className="video-band-editorial-sheet">
          <div className="video-band-magazine-grid">
            <div className="video-band-magazine-col video-band-magazine-col-left">
              {details.welcomeText && (
                <section className="video-band-mag-block video-band-mag-block-soft video-band-animate-up video-band-delay-1">
                  <p className="video-band-mag-text">{details.welcomeText}</p>
                </section>
              )}

              {details.date && (
                <section className="video-band-mag-block video-band-animate-up video-band-delay-2">
                  <p className="video-band-mag-label">Datum</p>
                  <h3 className="video-band-mag-date">{details.date}</h3>
                </section>
              )}

              {details.venue && (
                <section className="video-band-mag-block video-band-animate-up video-band-delay-3">
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
                </section>
              )}
            </div>

            <div className="video-band-magazine-col video-band-magazine-col-right">
              {timelineItems.length > 0 && (
                <section className="video-band-mag-block video-band-animate-up video-band-delay-2">
                  <p className="video-band-mag-label">Raspored</p>

                  <div className="video-band-elegant-timeline">
                    {timelineItems.map((item, index) => (
                      <div
                        key={`${item.label}-${index}`}
                        className="video-band-elegant-row"
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
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {details.dressCodePalette?.length > 0 && (
                <section className="video-band-mag-block video-band-animate-up video-band-delay-3">
                  <p className="video-band-mag-label">
                    {details.dressCodeTitle || "Dress code"}
                  </p>

                  <div className="video-band-mag-palette">
                    {details.dressCodePalette.map((color, index) => (
                      <span
                        key={`${color}-${index}`}
                        className="video-band-mag-palette-dot"
                        style={{ backgroundColor: color }}
                        aria-label={`dress code color ${index + 1}`}
                      />
                    ))}
                  </div>

                  {details.dressCodeNote && (
                    <p className="video-band-mag-subtext">
                      {details.dressCodeNote}
                    </p>
                  )}
                </section>
              )}

              {details.note && (
                <section className="video-band-mag-block video-band-mag-block-soft video-band-animate-up video-band-delay-4">
                  <p className="video-band-mag-label">Napomena</p>
                  <p className="video-band-mag-text">{details.note}</p>
                </section>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      <VideoBandRSVP />

      {details.dateISO && (
        <VideoBandCountdown targetDate={details.dateISO} />
      )}
    </>
  );
}

export default VideoBandInvitationCard;