import { motion } from "framer-motion";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import "../styles/card.css";
import "../styles/rsvp.css";
import PassportRSVP from "./PassportRSVP";
import PassportCountdown from "./PassportCountdown";

function PassportInvitationCard({
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  venue,
  details = {},
  slug = "",
}) {
  const events = details.events || [];
  const theme = details.theme || {};

  const lineWrapRef = useRef(null);
  const planeRef = useRef(null);
  const stopRefs = useRef([]);
  const [planeStops, setPlaneStops] = useState([0, 120, 240]);

  // Invitation card koristi SAMO slug-card-bg, ne slug-bg
  const cardBg =
    details.cardBackground || `/images/passport/${slug}-card-bg.jpg`;

  const passportThemeStyle = {
    "--passport-main": theme.main || "#f7efe4",
    "--passport-main-dark": theme.mainDark || "#efe1cd",
    "--passport-cream": theme.cream || "#fffbf5",
    "--passport-white": theme.white || "#ffffff",

    "--passport-text-main": theme.textMain || "#5f4a2d",
    "--passport-text-soft": theme.textSoft || "#8f7450",
    "--passport-text-muted": theme.textMuted || "#a08965",

    "--passport-card-overlay":
      theme.cardOverlay || "rgba(255, 251, 245, 0.82)",
    "--passport-card-border":
      theme.cardBorder || "rgba(177, 141, 83, 0.26)",
    "--passport-band-bg": theme.bandBg || "rgba(237, 223, 201, 0.44)",

    "--passport-accent": theme.accent || "#b18d53",
    "--passport-accent-soft":
      theme.accentSoft || "rgba(180, 144, 84, 0.34)",

    "--passport-button-bg": theme.buttonBg || "#b18d53",
    "--passport-button-text": theme.buttonText || "#ffffff",

    "--passport-icon-filter": theme.iconFilter || "none",
  };

  const ticketNumber = useMemo(() => {
    if (details.ticketNumber) return details.ticketNumber;

    const cleanSlug = (slug || `${brideName}-${groomName}`)
      .replace(/\s+/g, "")
      .replace(/[^a-zA-Z0-9-]/g, "")
      .toUpperCase();

    const datePart = (details.date || weddingDate || "2026")
      .replace(/\s+/g, "")
      .replace(/[^A-Z0-9]/gi, "")
      .slice(0, 8)
      .toUpperCase();

    return `${cleanSlug.slice(0, 6)}-${datePart}-01`;
  }, [
    details.ticketNumber,
    details.date,
    weddingDate,
    slug,
    brideName,
    groomName,
  ]);

  useLayoutEffect(() => {
    const updateStops = () => {
      if (!lineWrapRef.current || !stopRefs.current.length) return;

      const wrapRect = lineWrapRef.current.getBoundingClientRect();

      const positions = stopRefs.current
        .filter(Boolean)
        .map((stop) => {
          const rect = stop.getBoundingClientRect();
          const planeHalf = planeRef.current
            ? planeRef.current.offsetHeight / 2
            : 18;

          return rect.top - wrapRect.top - planeHalf + rect.height / 2;
        });

      if (positions.length) {
        setPlaneStops(positions);
      }
    };

    updateStops();
    window.addEventListener("resize", updateStops);

    return () => window.removeEventListener("resize", updateStops);
  }, [events.length]);

  const planeAnimation = useMemo(() => {
    if (!planeStops.length) return [0];

    const frames = [];

    planeStops.forEach((stop) => {
      frames.push(stop, stop, stop);
    });

    return frames;
  }, [planeStops]);

  const planeTransition = useMemo(() => {
    if (!planeStops.length) {
      return {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      };
    }

    return {
      duration: Math.max(7, planeStops.length * 2.5),
      repeat: Infinity,
      ease: "easeInOut",
      times: planeAnimation.map((_, i) =>
        planeAnimation.length === 1 ? 1 : i / (planeAnimation.length - 1)
      ),
    };
  }, [planeAnimation, planeStops.length]);

  const getEventIcon = (event) => {
    const label = (event.label || "").toLowerCase();
    const icon = (event.icon || "").toLowerCase();

    if (
      icon === "gathering" ||
      label.includes("okupljanje") ||
      label.includes("skup")
    ) {
      return "/images/passport/icons/gathering.svg";
    }

    if (icon === "church" || label.includes("crkveno")) {
      return "/images/passport/icons/church.svg";
    }

    if (
      icon === "civil" ||
      label.includes("ceremonija") ||
      label.includes("građansko") ||
      label.includes("venčanja")
    ) {
      return "/images/passport/icons/rings.svg";
    }

    if (
      label.includes("zdravica") ||
      label.includes("koktel") ||
      icon === "toast"
    ) {
      return "/images/passport/icons/toast.svg";
    }

    if (
      icon === "restaurant" ||
      label.includes("večera") ||
      label.includes("ručak")
    ) {
      return "/images/passport/icons/dinner.svg";
    }

    if (
      icon === "party" ||
      label.includes("proslava") ||
      label.includes("after") ||
      label.includes("zabava")
    ) {
      return "/images/passport/icons/party.svg";
    }

    if (label.includes("torta")) {
      return "/images/passport/icons/cake.svg";
    }

    return "/images/passport/icons/event.svg";
  };

  return (
    <>
      <section className="passport-card-page" style={passportThemeStyle}>
        <div className="passport-card-bg-overlay" />

        <motion.div
          className="passport-ticket-card"
          initial={{ opacity: 0, y: 40, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="passport-ticket-bg-parallax"
            style={{ backgroundImage: `url(${cardBg})` }}
            animate={{ y: [0, -10, 0], scale: [1, 1.02, 1] }}
            transition={{
              duration: 14,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />

          <div className="passport-ticket-overlay" />

          <div className="passport-ticket-main">
            <div className="passport-ticket-left-band">
              <div className="passport-ticket-band-barcode" aria-hidden="true">
                {Array.from({ length: 16 }).map((_, i) => (
                  <span
                    key={i}
                    className={`passport-band-line ${
                      i % 4 === 0 ? "wide" : ""
                    }`}
                  />
                ))}
              </div>

              <div className="passport-ticket-band-text">
                LOVE IS OUR GREATEST ADVENTURE
              </div>

              <motion.img
                src="/images/passport/plane-corner.svg"
                alt=""
                className="passport-ticket-band-plane"
                aria-hidden="true"
                animate={{ y: [0, -4, 0], rotate: [0, -3, 0] }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            <div className="passport-ticket-hero">
              <motion.div
                className="passport-ticket-kicker"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.12 }}
              >
                POZIVAMO VAS
              </motion.div>

              <motion.div
                className="passport-ticket-subkicker"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.18 }}
              >
                DA BUDETE DEO NAŠE PRIČE
              </motion.div>

              <motion.div
                className="passport-ticket-divider"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.65, delay: 0.22 }}
              >
                <span />
                <motion.img
                  src="/images/passport/heart-mini.svg"
                  alt=""
                  aria-hidden="true"
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <span />
              </motion.div>

              <motion.div
                className="passport-ticket-title"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.28 }}
              >
                POZIVNICA
              </motion.div>

              <motion.div
                className="passport-ticket-subtitle"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.34 }}
              >
                ZA NAŠ NAJLEPŠI DAN
              </motion.div>

              <motion.h1
                className="passport-ticket-names"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.42 }}
              >
                <motion.span
                  className="passport-ticket-name-line"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.48 }}
                >
                  {brideName}
                </motion.span>

                <motion.span
                  className="passport-ticket-ampersand"
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.55, delay: 0.58 }}
                >
                  &
                </motion.span>

                <motion.span
                  className="passport-ticket-name-line"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.64 }}
                >
                  {groomName}
                </motion.span>
              </motion.h1>

              <div className="passport-ticket-map" aria-hidden="true" />

              <motion.div
                className="passport-ticket-bottom-decor"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.74 }}
              >
                <motion.img
                  src="/images/passport/plane-small-cross.svg"
                  alt=""
                  className="passport-ticket-small-plane"
                  aria-hidden="true"
                  animate={{
                    x: [0, 6, 0],
                    y: [0, -4, 0],
                    rotate: [0, 4, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <motion.img
                  src="/images/passport/route-heart.svg"
                  alt=""
                  className="passport-ticket-route-heart"
                  aria-hidden="true"
                  animate={{ scale: [1, 1.05, 1], opacity: [0.92, 1, 0.92] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </div>
          </div>

          <div className="passport-ticket-bottom">
            <div className="passport-ticket-bottom-topline passport-ticket-bottom-topline-clean">
              <motion.div
                className="passport-ticket-date-badge"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.18 }}
              >
                {details.date || weddingDate}
              </motion.div>

              <motion.div
                className="passport-ticket-stamp"
                initial={{ opacity: 0, scale: 0.85, rotate: -18 }}
                animate={{
                  opacity: 1,
                  scale: [1, 1.03, 1],
                  rotate: [-12, -10, -12],
                }}
                transition={{
                  opacity: { duration: 0.55, delay: 0.22 },
                  scale: {
                    duration: 4.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  rotate: {
                    duration: 4.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <div className="passport-ticket-stamp-inner">
                  <span>FIRST</span>
                  <span>CLASS</span>
                </div>
              </motion.div>
            </div>

            {events.length > 0 && (
              <>
                <motion.div
                  className="passport-ticket-events-title-wrap"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.span
                    className="passport-ticket-events-title-line"
                    initial={{ scaleX: 0.4, opacity: 0 }}
                    whileInView={{ scaleX: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                  />

                  <motion.span
                    className="passport-ticket-events-title-text"
                    initial={{ opacity: 0, letterSpacing: "0.32em" }}
                    whileInView={{ opacity: 1, letterSpacing: "0.22em" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.08 }}
                  >
                    RASPORED
                  </motion.span>

                  <motion.span
                    className="passport-ticket-events-title-line"
                    initial={{ scaleX: 0.4, opacity: 0 }}
                    whileInView={{ scaleX: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.16 }}
                  />
                </motion.div>

                <div className="passport-ticket-timeline" ref={lineWrapRef}>
                  <div className="passport-ticket-flight-line" />

                  <motion.img
                    ref={planeRef}
                    src="/images/passport/avion.svg"
                    alt="Avion"
                    className="passport-ticket-flight-plane"
                    animate={{ y: planeAnimation }}
                    transition={planeTransition}
                  />

                  <div className="passport-ticket-events">
                    {events.map((event, index) => (
                      <motion.div
                        className="passport-ticket-event"
                        key={`${event.label}-${index}`}
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.45 }}
                        transition={{
                          duration: 0.55,
                          delay: index * 0.08,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <div
                          className="passport-ticket-stop-anchor"
                          ref={(el) => {
                            stopRefs.current[index] = el;
                          }}
                        />

                        <div className="passport-ticket-event-row">
                          <motion.div
                            className="passport-ticket-event-time"
                            initial={{ opacity: 0, x: -8 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.45,
                              delay: index * 0.08 + 0.05,
                            }}
                          >
                            {event.time}
                          </motion.div>

                          <motion.div
                            className="passport-ticket-event-icon-wrap"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.45,
                              delay: index * 0.08 + 0.1,
                            }}
                          >
                            <img
                              src={getEventIcon(event)}
                              alt=""
                              className="passport-ticket-event-icon"
                              aria-hidden="true"
                            />
                          </motion.div>

                          <motion.div
                            className="passport-ticket-event-text"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.45,
                              delay: index * 0.08 + 0.12,
                            }}
                          >
                            <div className="passport-ticket-event-label">
                              {event.label}
                            </div>

                           {event.location && (
  event.mapLink ? (
    <a
      href={event.mapLink}
      target="_blank"
      rel="noopener noreferrer"
      className="passport-ticket-event-location passport-ticket-event-location-link"
    >
      {event.location}
    </a>
  ) : (
    <div className="passport-ticket-event-location">
      {event.location}
    </div>
  )
)}
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <motion.div
              className="passport-ticket-love-line"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <motion.img
                src="/images/passport/heart-mini.svg"
                alt=""
                aria-hidden="true"
                animate={{ scale: [1, 1.12, 1], opacity: [0.92, 1, 0.92] }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <span>LJUBAV NAS VODI ZAUVEK</span>
            </motion.div>

            <motion.div
              className="passport-ticket-bottom-barcode-wrap"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 }}
            >
              <div className="passport-ticket-bottom-barcode" aria-hidden="true">
                {Array.from({ length: 38 }).map((_, i) => (
                  <span
                    key={i}
                    className={`passport-bottom-bar-line ${
                      i % 5 === 0 ? "wide" : ""
                    } ${i % 7 === 0 ? "thin" : ""}`}
                  />
                ))}
              </div>

              <div className="passport-ticket-bottom-barcode-text">
                BOARDING TO FOREVER • {ticketNumber}
              </div>
            </motion.div>
          </div>

          <div className="passport-ticket-notch passport-ticket-notch-top" />
          <div className="passport-ticket-notch passport-ticket-notch-bottom" />
          <div className="passport-ticket-corner passport-ticket-corner-top" />
          <div className="passport-ticket-corner passport-ticket-corner-bottom" />
        </motion.div>
      </section>
<PassportRSVP
  slug={slug}
  eventType="wedding"
  theme={theme}
  details={details}
/>

      {details.dateISO && (
        <PassportCountdown
          targetDate={details.dateISO}
          slug={slug}
          theme={theme}
          brideName={brideName}
          groomName={groomName}
          details={details}
        />
      )}
    </>
  );
}

export default PassportInvitationCard;