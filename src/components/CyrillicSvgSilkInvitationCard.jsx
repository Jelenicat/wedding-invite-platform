import { motion } from "framer-motion";
import CyrillicSvgSilkRSVP from "./CyrillicSvgSilkRSVP";
import CyrillicSvgSilkCountdown from "./CyrillicSvgSilkCountdown";

import "../styles/card.css";

function CyrillicSvgSilkInvitationCard({
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  venue,
  details = {},
  slug,
}) {
  const events = details.events || [];

  const foreverSvg = details.foreverSvg;
  const namesSvg = details.namesSvg;

  // SVG-ovi zakucani u names folderu
  const scheduleSvg = "/images/names/raspored.svg";
  const monthSvg = "/images/names/novembar.svg";

  return (
    <main
      className={`cyrillic-svg-silk-card cyrillic-svg-silk-card-${slug || ""}`}
      style={{
        "--csvg-fixed-bg": details.fixedBackgroundImage
          ? `url(${details.fixedBackgroundImage})`
          : "url('/images/cyrillic-svg-silk/paper-bg.jpg')",
      }}
    >
      {/* FIXED BACKGROUND */}
      <div className="csvg-fixed-bg" />

      {/* 1. UVODNA STRANA */}
      <section className="csvg-section csvg-hero-section">
        <motion.div
          className="csvg-hero-inner"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.8 }}
        >
          <div className="csvg-quote-block">
            <p className="csvg-quote">
              „И нађох оног кога љуби душа моја“
            </p>

            <p className="csvg-quote-source">
              - песма над песмама 3,4
            </p>
          </div>

          <div className="csvg-forever-wrap">
            {foreverSvg ? (
              <img
                src={foreverSvg}
                alt="Заувек"
                className="csvg-forever-svg"
              />
            ) : (
              <h2 className="csvg-forever-fallback">Заувек</h2>
            )}
          </div>

          <p className="csvg-family-text">са својим породицама</p>

          <div className="csvg-names-wrap">
            {namesSvg ? (
              <img
                src={namesSvg}
                alt={`${brideName} и ${groomName}`}
                className="csvg-names-svg"
              />
            ) : (
              <h1 className="csvg-names-fallback">
                {brideName} <span>и</span> {groomName}
              </h1>
            )}
          </div>

          <p className="csvg-invite-text">
            вас позивају да увеличате њихово венчање
          </p>
        </motion.div>
      </section>

      {/* 2. KALENDAR */}
      <section className="csvg-section csvg-calendar-section">
        <motion.div
          className="csvg-calendar-card"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.8 }}
        >
          <div className="csvg-month-row">
            <span />

            <img
              src={monthSvg}
              alt="Новембар"
              className="csvg-month-svg"
            />

            <span />
          </div>

          <div className="csvg-week-days">
            <span>ПН</span>
            <span>УТ</span>
            <span>СР</span>
            <span>ЧТ</span>
            <span>ПТ</span>
            <span>СБ</span>
            <span>НД</span>
          </div>

          <div className="csvg-calendar-days">
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span className="is-active">8</span>
          </div>
        </motion.div>
      </section>

      {/* 3. RASPORED */}
      <section className="csvg-section csvg-schedule-section">
        <motion.div
          className="csvg-schedule-inner"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8 }}
        >
          <div className="csvg-schedule-title-wrap">
            <img
              src={scheduleSvg}
              alt="Распоред"
              className="csvg-schedule-title-svg"
            />
          </div>

          <div className="csvg-timeline">
            {events.map((event, index) => (
              <div
                className={`csvg-event ${
                  index % 2 === 0 ? "is-right" : "is-left"
                }`}
                key={`${event.time}-${event.label}`}
              >
                <div className="csvg-event-content">
                  <p className="csvg-event-time">{event.time}</p>

                  <h3>{event.label}</h3>

                  {event.location && (
                    <p className="csvg-event-location">
                      {event.location}
                    </p>
                  )}

                  {event.address && (
                    <p className="csvg-event-address">
                      {event.address}
                    </p>
                  )}

                  {event.mapLink && (
                    <a
                      className="csvg-location-btn"
                      href={event.mapLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {event.buttonText || "Погледај локацију"}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 4. RSVP */}
<section className="csvg-section csvg-rsvp-section">
  <motion.div
    className="csvg-rsvp-box"
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.8 }}
  >
    <div className="csvg-rsvp-header">
      <p className="csvg-rsvp-main">
        Ваше присуство биће нам
        <br />
        неизмерна радост на
        <br />
        почетку овог пута.
      </p>

      <div className="csvg-rsvp-divider">
        <span>♡</span>
      </div>
    </div>

    <CyrillicSvgSilkRSVP
      slug={slug}
      eventType="wedding"
      deadline={details.rsvpDeadline || "20. октобра 2026."}
    />
  </motion.div>
</section>

      {/* 5. COUNTDOWN */}
{/* 5. COUNTDOWN */}
<section className="csvg-section csvg-countdown-section">
  <CyrillicSvgSilkCountdown
    weddingDate={weddingDate}
    details={details}
    brideName={brideName}
    groomName={groomName}
  />
</section>
    </main>
  );
}

export default CyrillicSvgSilkInvitationCard;