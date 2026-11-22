import { useEffect, useId, useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { JUNGLE_ART, JungleMark, jungleData } from "./BirthdayJungleBookIntro";
import BirthdayJungleBookRSVP from "./BirthdayJungleBookRSVP";
import BirthdayJungleBookCountdown from "./BirthdayJungleBookCountdown";
import "../styles/newcard.css";

function storyChapters(text) {
  return [
    {
      image: JUNGLE_ART.paw,
      alt: text("Tigrić pruža šapu preko mahovinastog stabla.", "Тигрић пружа шапу преко маховинастог стабла."),
      title: text("Prvi trag", "Први траг"),
      memory: text(
        "Kad nas je prvi put uhvatio za prst, počela je naša avantura.",
        "Кад нас је први пут ухватио за прст, почела је наша авантура."
      ),
    },
    {
      image: JUNGLE_ART.river,
      alt: text("Slonče prska vodu u mirnoj reci pod vodopadom.", "Слонче прска воду у мирној реци под водопадом."),
      title: text("Smeh kraj reke", "Смех крај реке"),
      memory: text(
        "Kada se prvi put nasmejao, hteli smo da ga čujemo još jednom. I još jednom.",
        "Када се први пут насмејао, хтели смо да га чујемо још једном. И још једном."
      ),
    },
    {
      image: JUNGLE_ART.canopy,
      alt: text("Mala džunglovska ptica na grani iznad krošnji.", "Мала џунгловска птица на грани изнад крошњи."),
      title: text("Iznad krošnji", "Изнад крошњи"),
      memory: text(
        "Prvi koraci odveli su ga do kraja sobe. Danas ga zanima šta je iza svakog ugla.",
        "Први кораци одвели су га до краја собе. Данас га занима шта је иза сваког угла."
      ),
    },
  ];
}

const flightStops = [0, 0.24, 0.48, 0.72, 1];

const trails = {
  paw: { x: ["10%", "25%", "44%", "63%", "88%"], y: ["70%", "55%", "45%", "28%", "19%"] },
  river: { x: ["12%", "28%", "47%", "65%", "89%"], y: ["62%", "66%", "56%", "38%", "31%"] },
  canopy: { x: ["9%", "27%", "49%", "71%", "94%"], y: ["66%", "57%", "43%", "29%", "23%"] },
  clearing: { x: ["11%", "25%", "43%", "61%", "78%"], y: ["58%", "47%", "32%", "23%", "16%"] },
};

function ForestTrail({ stage, route }) {
  const { scrollYProgress } = useScroll({ target: stage, offset: ["center 0.94", "center 0.13"] });
  const progress = useSpring(scrollYProgress, { stiffness: 130, damping: 29, mass: 0.62 });
  const x = useTransform(progress, flightStops, route.x);
  const y = useTransform(progress, flightStops, route.y);
  const wingSize = useTransform(progress, flightStops, [1.25, 1.08, 0.89, 0.6, 0.34]);
  const wingTurn = useTransform(progress, flightStops, [-19, 1, -12, 9, -18]);
  const visible = useTransform(progress, [0, 0.12, 0.25, 0.68, 0.91], [0, 0.62, 0.98, 0.95, 0]);
  const light = useTransform(progress, [0, 0.35, 0.67, 1], [0.02, 0.33, 0.18, 0.04]);
  const drift = useTransform(progress, [0, 1], ["8%", "-12%"]);

  return (
    <div className="jb-forest-trail" aria-hidden="true">
      <motion.img className="jb-scene-light" src={JUNGLE_ART.sunlight} alt="" style={{ x: drift, opacity: light }} />
      <motion.span className="jb-trail-flight" style={{ x, y, opacity: visible }}>
        <motion.img src={JUNGLE_ART.butterfly} alt="" style={{ scale: wingSize, rotate: wingTurn }} />
      </motion.span>
    </div>
  );
}

function JungleChapter({ chapter, defaultChapter, route, reduced }) {
  const stage = useRef(null);
  const defaultImage = chapter.image === defaultChapter.image;

  return (
    <figure className="jb-chapter" data-story-scene={defaultImage}>
      <div className="jb-scene" ref={stage}>
        <img
          src={chapter.image}
          alt={chapter.alt}
          width={defaultImage ? 1160 : undefined}
          height={defaultImage ? 870 : undefined}
          loading="lazy"
          decoding="async"
        />
        {defaultImage && !reduced && <ForestTrail stage={stage} route={route} />}
      </div>
      <figcaption className="jb-chapter-caption">
        <h3>{chapter.title}</h3>
        <p>{chapter.memory}</p>
      </figcaption>
    </figure>
  );
}

function JungleStory({ id, data, reduced }) {
  const { text, details, config } = data;
  const routes = [trails.paw, trails.river, trails.canopy];

  return (
    <section className="jb-story" aria-labelledby={id}>
      <header className="jb-content jb-story-heading">
        <h2 id={id} tabIndex={-1}>{text("Prva godina", "Прва година")} <span className="jb-script">{text("u džungli", "у џунгли")}</span></h2>
        {details.welcomeText && <p className="jb-section-copy">{details.welcomeText}</p>}
      </header>

      {storyChapters(text).map((defaultChapter, index) => (
        <JungleChapter
          key={defaultChapter.title}
          defaultChapter={defaultChapter}
          chapter={{ ...defaultChapter, ...config.chapters?.[index] }}
          route={routes[index]}
          reduced={reduced}
        />
      ))}
    </section>
  );
}

function JungleCelebration({ id, rsvpId, data, goTo, reduced }) {
  const { text, details, config, date, dateISO, time, venue, address } = data;
  const clearing = config.mapImage || JUNGLE_ART.clearing;
  const forestGarden = clearing === JUNGLE_ART.clearing;
  const dateParts = typeof date === "string" ? date.trim().match(/^(\d{1,2}\.)\s+(.+)$/u) : null;
  const mapLink = details.mapLink || details.locationButtonLink
    || (venue || address ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent([venue, address].filter(Boolean).join(", ")) : "");
  const showLocation = mapLink && details.showLocationButton !== false;
  const showRSVP = config.showQuickRSVP !== false && !details.rsvpClosed;
  const events = Array.isArray(details.events) ? details.events : [];
  const stage = useRef(null);

  return (
    <section className="jb-party" aria-labelledby={id} data-forest-garden={forestGarden}>
      <div className="jb-scene jb-party-scene" ref={stage}>
        <img
          src={clearing}
          alt={forestGarden ? text("Na proplanku između paprati i fenjera čeka rođendanska torta.", "На пропланку између папрати и фењера чека рођенданска торта.") : ""}
          width={forestGarden ? 1000 : undefined}
          height={forestGarden ? 1500 : undefined}
          loading="lazy"
          decoding="async"
        />
        {forestGarden && !reduced && <ForestTrail stage={stage} route={trails.clearing} />}
      </div>

      <div className="jb-content jb-party-content">
        <h2 id={id} tabIndex={-1}>{text("Vidimo se", "Видимо се")} <span className="jb-script">{text("na proplanku", "на пропланку")}</span></h2>

        {(date || time || venue || address) && (
          <dl className="jb-event-details">
            {(date || time) && (
              <div>
                <dt className="jb-eyebrow">{text("Datum i vreme", "Датум и време")}</dt>
                <dd>
                  {date && (
                    <time dateTime={dateISO || undefined}>
                      {dateParts ? <><span className="jb-event-day">{dateParts[1]}</span>{" "}<span>{dateParts[2]}</span></> : date}
                    </time>
                  )}
                  {time && <p>{text("Početak u", "Почетак у")} <strong>{time}</strong></p>}
                </dd>
              </div>
            )}
            {(venue || address) && (
              <div>
                <dt className="jb-eyebrow">{text("Mesto proslave", "Место прославе")}</dt>
                <dd>
                  {venue && <p className="jb-event-venue">{venue}</p>}
                  {address && <p>{address}</p>}
                </dd>
              </div>
            )}
          </dl>
        )}

        {(showLocation || showRSVP) && (
          <div className="jb-location-actions">
            {showRSVP && (
              <a className="jb-button jb-reply" href={"#" + rsvpId} onClick={(event) => { event.preventDefault(); goTo(rsvpId); }}>
                {text("Potvrdi dolazak", "Потврди долазак")}
              </a>
            )}
            {showLocation && (
              <a className="jb-button jb-directions" href={mapLink} target="_blank" rel="noopener noreferrer">
                <JungleMark type="compass" />
                {details.locationButtonText || text("Otvori lokaciju", "Отвори локацију")}
              </a>
            )}
          </div>
        )}

        {events.length > 0 && (
          <div className="jb-program">
            <h3>{text("Raspored proslave", "Распоред прославе")}</h3>
            <ol>
              {events.map((event, index) => (
                <li key={index}>
                  {event.time && <span className="jb-program-time">{event.time}</span>}
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
          <div className="jb-dress">
            {details.dressCodeTitle && <strong>{details.dressCodeTitle}</strong>}
            {details.dressCodeNote && <p>{details.dressCodeNote}</p>}
          </div>
        )}
      </div>
    </section>
  );
}

export default function BirthdayJungleBookInvitationCard(props) {
  const data = jungleData(props);
  const { config, details, name, age, text, date, dateISO, script, language } = data;
  const id = useId();
  const storyId = id + "-prica";
  const partyId = id + "-proslava";
  const rsvpId = "jb-rsvp-" + (props.slug || "event");
  const article = useRef(null);
  const reduced = useReducedMotion();
  const prologueImage = config.prologueImage || JUNGLE_ART.prologue;
  const handoff = prologueImage === JUNGLE_ART.prologue && !reduced;

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      article.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [props.slug]);

  const goTo = (target) => {
    const element = document.getElementById(target);
    element?.focus({ preventScroll: true });
    element?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" });
  };

  return (
    <article className="jb jb-card" ref={article} tabIndex={-1} data-script={script} lang={language}>
      <header className="jb-prologue" data-handoff={handoff}>
        <img className="jb-prologue-art" src={prologueImage} alt="" fetchPriority="high" />
        {handoff && (
          <div className="jb-prologue-overlay" aria-hidden="true">
            <img className="jb-prologue-light" src={JUNGLE_ART.sunlight} alt="" />
            <img className="jb-prologue-butterfly" src={JUNGLE_ART.butterfly} alt="" />
          </div>
        )}
        <motion.div
          className="jb-prologue-title"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.65, delay: handoff ? 0.36 : 0 }}
        >
          <p className="jb-eyebrow">{text("Pozivnica za", "Позивница за")} {age}. {text("rođendan", "рођендан")}</p>
          <h1 className="jb-script" data-long-name={name.length > 13}>{name}</h1>
          {date && <time dateTime={dateISO || undefined}>{date}</time>}
          <button type="button" className="jb-button" onClick={() => goTo(storyId)}>
            <JungleMark type="paw" />
            {text("Pročitaj priču", "Прочитај причу")}
          </button>
        </motion.div>
      </header>

      <JungleStory id={storyId} data={data} reduced={reduced} />
      <JungleCelebration id={partyId} rsvpId={rsvpId} data={data} goTo={goTo} reduced={reduced} />
      <BirthdayJungleBookCountdown {...props} />
      <BirthdayJungleBookRSVP {...props} key={props.slug || "rsvp"} id={rsvpId} />

      <footer className="jb-end">
        <JungleMark type="leaf" />
        <p>{details.closingText || text("Vidimo se među krošnjama.", "Видимо се међу крошњама.")}</p>
        <span className="jb-script">{name}</span>
      </footer>
    </article>
  );
}
