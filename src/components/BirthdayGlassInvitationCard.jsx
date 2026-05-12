import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import BirthdayLuxuryRSVP from "./BirthdayLuxuryRSVP";
import BirthdayLuxuryCountdown from "./BirthdayLuxuryCountdown";
import "../styles/birthdaycard.css";

function FloatingScrollHint({ text = "Još detalja" }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);

      const isNearTop = scrollTop < 15;
      const hasMoreContentBelow = distanceFromBottom > 120;

      setVisible(isNearTop && hasMoreContentBelow);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="bglass-floating-scroll-hint">
      <span className="bglass-floating-scroll-text">{text}</span>
      <span className="bglass-floating-scroll-arrow">⌄</span>
    </div>
  );
}

function AfterRsvpFloatingHint({
  text = "Još detalja",
  rsvpRef,
  countdownRef,
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!rsvpRef.current || !countdownRef.current) {
        setVisible(false);
        return;
      }

      const rsvpRect = rsvpRef.current.getBoundingClientRect();
      const countdownRect = countdownRef.current.getBoundingClientRect();

           const rsvpPassed = rsvpRect.bottom < window.innerHeight + 20;
      const countdownNotReached = countdownRect.top > window.innerHeight * 0.55;

      setVisible(rsvpPassed && countdownNotReached);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [rsvpRef, countdownRef]);

  if (!visible) return null;

  return (
    <div className="bglass-floating-scroll-hint bglass-floating-scroll-hint-after-rsvp">
      <span className="bglass-floating-scroll-text">{text}</span>
      <span className="bglass-floating-scroll-arrow">⌄</span>
    </div>
  );
}

function BirthdayGlassInvitationCard({
  brideName,
  weddingDate,
  weddingTime,
  venue,
  details = {},
  backgroundImage,
  slug,
  type,
}) {
  const name = brideName || "Đorđe";
  const age = details.age || 18;
  const date = weddingDate || details.date || "27.06.2026.";
  const time = weddingTime || details.time || "20:00";

  const locationName =
    details.locationName || venue || details.venue || "Splav Cotier";

  const locationAddress = details.locationAddress || "Zemunski kej";

  const note =
    details.note || "Radujemo se da zajedno proslavimo ovaj poseban dan.";

  const mapLink = details.mapLink;

  const rsvpRef = useRef(null);
  const countdownRef = useRef(null);

  return (
    <>
      <main className="bglass-card-page">
        <div
          className="bglass-card-bg"
          style={{
            backgroundImage: `url(${
              backgroundImage || "/images/birthday-glass-bg.jpg"
            })`,
          }}
        />

        <div className="bglass-card-overlay" />

        <motion.section
          className="bglass-card"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <p className="bglass-card-kicker">Pozivnica za rođendan</p>

          <h2 className="bglass-card-title">
            <span className="bglass-card-name">
              {name.toLocaleUpperCase("sr-RS")}
            </span>

            <span className="bglass-card-subtitle">
              proslavlja {age}. rođendan
            </span>
          </h2>

          <div className="bglass-card-line" />

          <div className="bglass-info-grid">
            <div>
              <span>Datum</span>
              <strong>{date}</strong>
            </div>

            <div>
              <span>Vreme</span>
              <strong>{time}</strong>
            </div>

            <div className="bglass-full bglass-location-box">
              <span>Lokacija</span>

              <strong className="bglass-location-name">
                {locationName}
              </strong>

              {locationAddress && (
                <small className="bglass-location-address">
                  {locationAddress}
                </small>
              )}
            </div>
          </div>

          <p className="bglass-note">{note}</p>

          {mapLink && (
            <a
              className="bglass-map-btn"
              href={mapLink}
              target="_blank"
              rel="noreferrer"
            >
              Pogledaj lokaciju
            </a>
          )}
        </motion.section>
      </main>

      <div ref={rsvpRef}>
        <BirthdayLuxuryRSVP slug={slug} eventType={type} details={details} />
      </div>

      {details.dateISO && (
        <div ref={countdownRef}>
          <BirthdayLuxuryCountdown
            targetDate={details.dateISO}
            brideName={brideName}
            details={details}
          />
        </div>
      )}

      <FloatingScrollHint text="Još detalja" />

      {details.dateISO && (
        <AfterRsvpFloatingHint
          text="Još detalja"
          rsvpRef={rsvpRef}
          countdownRef={countdownRef}
        />
      )}
    </>
  );
}

export default BirthdayGlassInvitationCard;