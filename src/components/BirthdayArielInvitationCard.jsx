import { useEffect, useId, useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ARIEL_ART, arielData } from "./BirthdayArielIntro";
import BirthdayArielCountdown from "./BirthdayArielCountdown";
import BirthdayArielRSVP from "./BirthdayArielRSVP";
import "../styles/newcard.css";

function PearlCurrent({ stage, handoff }) {
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start start", "end start"] });
  const bubblesY = useTransform(scrollYProgress, [0, 1], ["0%", "-23%"]);
  const lightScale = useTransform(scrollYProgress, [0, 0.72], [1, 1.8]);

  return (
    <div className="ariel-hero-current" aria-hidden="true">
      <motion.img className="ariel-drifting-bubbles" src={ARIEL_ART.drift} alt="" style={{ y: bubblesY }} />
      <motion.div className="ariel-pearl-cast" style={{ scale: lightScale }} />
      {handoff && (
        <>
          <img className="ariel-transition-wave ariel-hero-wave" src={ARIEL_ART.refraction} alt="" />
          <img className="ariel-moving-pearl ariel-hero-pearl" src={ARIEL_ART.pearl} alt="" />
        </>
      )}
    </div>
  );
}

function MermaidHero({ data, reduceMotion }) {
  const { config, name, age, text } = data;
  const mermaid = config.mermaidImage || ARIEL_ART.mermaid;
  const stockImage = mermaid === ARIEL_ART.mermaid;
  const stage = useRef(null);

  return (
    <header className="ariel-hero" data-pearl-scene={stockImage}>
      <div className="ariel-hero-stage" ref={stage}>
        <img
          className="ariel-hero-art"
          src={mermaid}
          width={stockImage ? 1000 : undefined}
          height={stockImage ? 1500 : undefined}
          alt={config.mermaidAlt || text("Arijel pliva u morskoj pećini dok iznad njene ruke svetli biser.", "Аријел плива у морској пећини док изнад њене руке светли бисер.")}
          fetchPriority="high"
        />
        {stockImage && !reduceMotion && <PearlCurrent stage={stage} handoff={!config.openImage || config.openImage === ARIEL_ART.open} />}
        <div className="ariel-hero-copy">
          <p className="ariel-overline">{age === 1 ? text("Prvi rođendan", "Први рођендан") : age + ". " + text("rođendan", "рођендан")}</p>
          <h1 className="ariel-name" data-long-name={name.length > 9}>{name}</h1>
        </div>
      </div>
    </header>
  );
}

const reefRoute = [0, 0.18, 0.4, 0.62, 0.82, 1];

function ReefCurrent({ stage }) {
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start 0.94", "end 0.25"] });
  const progress = useSpring(scrollYProgress, { stiffness: 135, damping: 28, mass: 0.65 });
  const left = useTransform(progress, reefRoute, ["17%", "29%", "45%", "61%", "71%", "77%"]);
  const top = useTransform(progress, reefRoute, ["71%", "66%", "59%", "51%", "42%", "39%"]);
  const scale = useTransform(progress, reefRoute, [1.22, 1.14, 1, 0.8, 0.56, 0.32]);
  const rotate = useTransform(progress, reefRoute, [2, -8, -3, -13, -8, -3]);
  const opacity = useTransform(progress, [0, 0.11, 0.82, 1], [0.65, 1, 1, 0.28]);
  const refractionX = useTransform(progress, [0, 1], ["-12%", "24%"]);
  const refractionY = useTransform(progress, [0, 1], ["18%", "-22%"]);
  const refractionOpacity = useTransform(progress, [0, 0.26, 0.74, 1], [0.04, 0.37, 0.29, 0.03]);

  return (
    <div className="ariel-reef-current" aria-hidden="true">
      <motion.img
        className="ariel-reef-refraction"
        src={ARIEL_ART.refraction}
        alt=""
        style={{ x: refractionX, y: refractionY, opacity: refractionOpacity }}
      />
      <motion.div className="ariel-reef-fish" style={{ left, top, scale, rotate, opacity }}>
        <img src={ARIEL_ART.fish} alt="" />
      </motion.div>
    </div>
  );
}

function LagoonStory({ id, data, reduceMotion }) {
  const { config, details, text } = data;
  const garden = config.gardenImage || ARIEL_ART.garden;
  const stockImage = garden === ARIEL_ART.garden;
  const welcome = details.welcomeText || text(
    "Na kraju koralne staze čeka nas prva svećica. Dođite da je zajedno ugasimo.",
    "На крају коралне стазе чека нас прва свећица. Дођите да је заједно угасимо."
  );
  const stage = useRef(null);

  return (
    <section className="ariel-story" aria-labelledby={id}>
      <figure className="ariel-reef" data-reef-route={stockImage}>
        <div className="ariel-reef-stage" ref={stage}>
          <div className="ariel-reef-title">
            <h2 id={id} className="ariel-title">
              {config.storyTitle || <>{text("Kroz koralni", "Кроз корални")} <em>{text("vrt", "врт")}</em></>}
            </h2>
          </div>
          <img
            className="ariel-reef-art"
            src={garden}
            width={stockImage ? 1000 : undefined}
            height={stockImage ? 1500 : undefined}
            alt={config.gardenAlt || text("Koralni vrt sa osvetljenom stazom kroz podvodnu pećinu.", "Корални врт са осветљеном стазом кроз подводну пећину.")}
            fetchPriority="low"
            decoding="async"
          />
          {stockImage && (reduceMotion ? (
            <img className="ariel-reef-fish ariel-reef-fish-rest" src={ARIEL_ART.fish} alt="" />
          ) : <ReefCurrent stage={stage} />)}
        </div>
        <figcaption className="ariel-reef-caption">
          <p>{welcome}</p>
          {config.storyCaption && <p>{config.storyCaption}</p>}
        </figcaption>
      </figure>
    </section>
  );
}

function PalaceEntrance({ stage }) {
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start 0.94", "end 0.28"] });
  const progress = useSpring(scrollYProgress, { stiffness: 145, damping: 28, mass: 0.58 });
  const left = useTransform(progress, [0, 0.36, 0.75], ["11%", "2%", "-24%"]);
  const right = useTransform(progress, [0, 0.36, 0.75], ["-11%", "-2%", "24%"]);
  const edgeOpacity = useTransform(progress, [0, 0.4, 0.75], [0.88, 0.66, 0.1]);
  const candleGlow = useTransform(progress, [0.12, 0.52, 0.88], [0, 0.84, 0.39]);
  const candleSpread = useTransform(progress, [0.12, 0.63], [0.75, 1.6]);

  return (
    <div className="ariel-palace-motion" aria-hidden="true">
      <motion.span className="ariel-palace-candle" style={{ opacity: candleGlow, scale: candleSpread }} />
      <motion.img className="ariel-palace-edge ariel-palace-edge-left" src={ARIEL_ART.palaceEdges} alt="" style={{ x: left, opacity: edgeOpacity }} />
      <motion.img className="ariel-palace-edge ariel-palace-edge-right" src={ARIEL_ART.palaceEdges} alt="" style={{ x: right, opacity: edgeOpacity }} />
    </div>
  );
}

function LagoonCelebration({ id, data, rsvpId, goToRSVP, reduceMotion }) {
  const { config, details, text, date, dateISO, time, venue, address } = data;
  const palace = config.palaceImage || ARIEL_ART.palace;
  const stockImage = palace === ARIEL_ART.palace;
  const dateParts = typeof date === "string" ? date.match(/^(\d{1,2}\.)\s+(.+)$/u) : null;
  const location = [venue, address].filter(Boolean).join(", ");
  const mapLink = details.mapLink || details.locationButtonLink
    || (location && "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(location));
  const showLocation = mapLink && details.showLocationButton !== false;
  const showRSVP = config.showQuickRSVP !== false && !details.rsvpClosed;
  const program = Array.isArray(details.events) ? details.events : [];
  const stage = useRef(null);

  return (
    <section className="ariel-party" aria-labelledby={id} data-palace-hall={stockImage}>
      <div className="ariel-palace" ref={stage}>
        <img
          className="ariel-palace-art"
          src={palace}
          width={stockImage ? 1000 : undefined}
          height={stockImage ? 1500 : undefined}
          alt={config.palaceAlt || (stockImage ? text("U sedefastoj dvorani čeka torta sa jednom svećicom.", "У седефастој дворани чека торта са једном свећицом.") : "")}
          fetchPriority="low"
          decoding="async"
        />
        {stockImage && !reduceMotion && <PalaceEntrance stage={stage} />}
        <div className="ariel-palace-heading">
          <h2 className="ariel-title" id={id}>
            {text("Slavimo", "Славимо")} <em>{text("u laguni", "у лагуни")}</em>
          </h2>
        </div>
      </div>

      <div className="ariel-inner ariel-party-body">
        {(date || time || location) && (
          <dl className="ariel-facts">
            {(date || time) && (
              <div className="ariel-party-when">
                <dt className="ariel-overline">{text("Datum i vreme", "Датум и време")}</dt>
                <dd>
                  {date && (
                    <time className="ariel-party-date" dateTime={dateISO || undefined}>
                      {dateParts ? <><span className="ariel-party-day">{dateParts[1]}</span>{" "}<span>{dateParts[2]}</span></> : date}
                    </time>
                  )}
                  {time && <p className="ariel-fact-sub">{text("Početak u", "Почетак у")} <strong>{time}</strong></p>}
                </dd>
              </div>
            )}
            {location && (
              <div className="ariel-party-where">
                <dt className="ariel-overline">{text("Mesto proslave", "Место прославе")}</dt>
                <dd>
                  {venue && <p className="ariel-party-venue">{venue}</p>}
                  {address && <p className="ariel-fact-sub">{address}</p>}
                </dd>
              </div>
            )}
          </dl>
        )}

        {(showRSVP || showLocation) && (
          <div className="ariel-actions">
            {showRSVP && (
              <a className="ariel-button ariel-party-reply" href={"#" + rsvpId} onClick={goToRSVP}>
                {text("Potvrdi dolazak", "Потврди долазак")}
              </a>
            )}
            {showLocation && (
              <a className="ariel-button ariel-button-glass" href={mapLink} target="_blank" rel="noopener noreferrer">
                {details.locationButtonText || text("Otvori lokaciju", "Отвори локацију")}
              </a>
            )}
          </div>
        )}

        {program.length > 0 && (
          <div className="ariel-program">
            <h3>{text("Raspored proslave", "Распоред прославе")}</h3>
            <ol>
              {program.map((event, index) => (
                <li key={index}>
                  {event.time && <span className="ariel-program-time">{event.time}</span>}
                  <div>
                    <strong>{event.title || event.label || event.name}</strong>
                    {event.description && <p>{event.description}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
        {details.showDressCode && (details.dressCodeTitle || details.dressCodeNote) && (
          <div className="ariel-dress">
            {details.dressCodeTitle && <h3>{details.dressCodeTitle}</h3>}
            {details.dressCodeNote && <p>{details.dressCodeNote}</p>}
          </div>
        )}
      </div>
    </section>
  );
}

export default function BirthdayArielInvitationCard(props) {
  const data = arielData(props);
  const { name, script, language, details, text } = data;
  const card = useRef(null);
  const id = useId();
  const rsvpId = "ariel-rsvp-" + (props.slug || "event");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      card.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [props.slug]);

  const goToRSVP = (event) => {
    const rsvp = document.getElementById(rsvpId);
    if (!rsvp) return;
    event.preventDefault();
    rsvp.focus({ preventScroll: true });
    rsvp.scrollIntoView({ behavior: reduceMotion ? "instant" : "smooth", block: "start" });
  };

  return (
    <article className="ariel ariel-card" lang={language} data-script={script} tabIndex={-1} ref={card}>
      <MermaidHero data={data} reduceMotion={reduceMotion} />
      <LagoonStory id={id + "-story"} data={data} reduceMotion={reduceMotion} />
      <LagoonCelebration id={id + "-party"} data={data} rsvpId={rsvpId} goToRSVP={goToRSVP} reduceMotion={reduceMotion} />
      <BirthdayArielCountdown {...props} />
      <BirthdayArielRSVP {...props} key={props.slug || "ariel-rsvp"} id={rsvpId} />

      <footer className="ariel-end">
        <p>{details.closingText || text("Vidimo se među koralima.", "Видимо се међу коралима.")}</p>
        <span className="ariel-signature">{name}</span>
      </footer>
    </article>
  );
}
