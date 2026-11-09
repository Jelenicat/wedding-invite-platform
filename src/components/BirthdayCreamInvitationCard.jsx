import { useLayoutEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import BirthdayCreamRSVP from "./BirthdayCreamRSVP";
import BirthdayCreamCountdown from "./BirthdayCreamCountdown";
import "../styles/birthdayintro.css";
import "../styles/birthdaycard.css";

const DEFAULT_IMAGE = "/images/birthday-cream/cream-stone-premium.webp";

export default function BirthdayCreamInvitationCard({
  brideName,
  weddingDate,
  weddingTime,
  venue,
  backgroundImage,
  details = {},
  slug,
  type = "birthday",
  sharedBackground = false,
  introOpening = false,
  introReady = true,
}) {
  const reduceMotion = useReducedMotion();
  const titleRef = useRef(null);
  const name = brideName || "Matej";
  const age = details.age ?? 18;
  const photo = backgroundImage || details.backgroundImage || DEFAULT_IMAGE;
  const date = weddingDate || details.date || "";
  const time = weddingTime || details.time || "";
  const location = details.locationName || venue || details.venue || "";
  const address = details.locationAddress || "";
  const mapLink = details.locationButtonLink || details.mapLink;
  const heroVisible = introOpening || introReady;
  const moodTitle = String(details.showDressCode
    ? (details.dressCodeNote || "Dobro raspoloženje")
    : "Dobro društvo. Dobre uspomene.").trim();
  const [moodFirst, ...moodWords] = moodTitle.split(/\s+/);
  const moodRest = moodWords.join(" ");
  const heroMotion = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 18, filter: reduceMotion ? "blur(0px)" : "blur(5px)" },
    visible: {
      opacity: 1, y: 0, filter: "blur(0px)",
      transition: {
        duration: reduceMotion ? 0 : 1.1,
        ease: [0.22, 1, 0.36, 1],
        delayChildren: reduceMotion ? 0 : 0.14,
        staggerChildren: reduceMotion ? 0 : 0.08,
      },
    },
  };
  const heroItem = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 15 },
    visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] } },
  };

  useLayoutEffect(() => {
    if (!introReady) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    titleRef.current?.focus({ preventScroll: true });
  }, [slug, introReady]);

  const reveal = {
    initial: reduceMotion ? false : { opacity: 0, y: 30, filter: "blur(6px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <main className={`mcr-theme mcr-page mcr-editorial${sharedBackground ? " mcr-page--shared" : ""}`}>
      {!sharedBackground && <div className="mcr-page-backdrop" aria-hidden="true">
        <img src={photo} alt="" />
      </div>}

      <motion.section
        className="mcr-card-hero"
        data-active={heroVisible ? "true" : "false"}
        aria-label="Pozivnica za rođendan"
        variants={heroMotion}
        initial={reduceMotion ? false : "hidden"}
        animate={heroVisible ? "visible" : "hidden"}
      >
        <div className="mcr-card-panel">
          <motion.header className="mcr-invitation-header" variants={heroItem}>
            <p className="mcr-card-kicker">Pozivnica za rođendan</p>
            <span className="mcr-card-age" aria-hidden="true">{age}</span>
            <h1 className="mcr-card-name" ref={titleRef} tabIndex={-1}>
              {name.toLocaleUpperCase("sr-RS")}
            </h1>
            <p className="mcr-card-subtitle">proslavlja {age}. rođendan</p>
          </motion.header>
          <motion.p className="mcr-card-tagline" variants={heroItem}>
            {details.birthdayTagline || "Jedno veče. Punoletstvo. Uspomene."}
          </motion.p>
          <motion.div className="mcr-card-divider" variants={heroItem} aria-hidden="true" />
          <motion.div className="mcr-info-grid" variants={heroItem}>
            <div className="mcr-info-tile mcr-date-tile">
              <span>Datum</span>
              <time className="mcr-info-value" dateTime={details.dateISO || undefined}>{date}</time>
            </div>
            <div className="mcr-info-tile mcr-time-tile">
              <span>Vreme</span>
              <strong className="mcr-info-value">{time}</strong>
            </div>
            <div className="mcr-info-tile mcr-location">
              <span>Lokacija</span>
              <h2 className="mcr-location-name">{location}</h2>
              {address && <p>{address}</p>}
            </div>
          </motion.div>
          {details.rsvpDeadline && (
            <motion.p className="mcr-card-confirmation" variants={heroItem}>
              Molim vas da potvrdite dolazak do <strong>{details.rsvpDeadline}</strong>
            </motion.p>
          )}
          {mapLink && details.showLocationButton !== false && (
            <motion.a className="mcr-map-button" href={mapLink} target="_blank" rel="noopener noreferrer" variants={heroItem}>
              {details.locationButtonText || "Pogledaj lokaciju"}
            </motion.a>
          )}
        </div>
        <a className="mcr-scroll-cue" href="#mcr-evening-details" style={{ opacity: introReady ? 1 : 0 }} onClick={(event) => {
          event.preventDefault();
          document.getElementById("mcr-evening-details")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        }}>
          <span>Još detalja</span>
          <span className="mcr-scroll-track" aria-hidden="true" />
        </a>
      </motion.section>

      <section className="mcr-evening-section" id="mcr-evening-details" aria-label="Detalji proslave">
        <motion.div className="mcr-attitude-panel" {...reveal}>
          <p className="mcr-eyebrow">{details.showDressCode ? (details.dressCodeTitle || "Dress code") : "Veče za pamćenje"}</p>
          <h2 className="mcr-mood-title" aria-label={moodTitle}>
            <span className="mcr-mood-first" aria-hidden="true">{moodFirst}</span>
            {moodRest && <> <span className="mcr-mood-rest" aria-hidden="true">{moodRest}</span></>}
          </h2>
          <p className="mcr-attitude-note">{details.note || "Uz drage ljude, muziku i osmehe, svako veče postaje posebno. Radujem se što ćemo ovo pamtiti zajedno."}</p>
        </motion.div>
      </section>

      <BirthdayCreamRSVP slug={slug} eventType={type} brideName={name} details={details} />
      <BirthdayCreamCountdown targetDate={details.dateISO} brideName={name} venue={location} details={details} />
      <footer className="mcr-footer">
        <span>Radujem se vašem dolasku</span>
        <strong>{name}</strong>
      </footer>
    </main>
  );
}
