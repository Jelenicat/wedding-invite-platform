import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import {
  universeData,
  UniverseBurst,
  UniverseIcon,
  UniverseOrbit,
  UniverseReveal,
  UniverseScript,
  UniverseStars,
  UNIVERSE_ASSETS,
  UNIVERSE_EASE,
} from "./BirthdayLittleUniverseIntro";
import BirthdayLittleUniverseRSVP from "./BirthdayLittleUniverseRSVP";
import BirthdayLittleUniverseCountdown from "./BirthdayLittleUniverseCountdown";
import "../styles/newcard.css";

const STORY_STAR = { x: "64%", y: "41%" };

function StarlightHero({ data, welcomeHeading, continueStory }) {
  const { name, date, dateISO, hero, c, config } = data;
  const uid = useId();
  const reduced = useReducedMotion();
  const [glowing, setGlowing] = useState(false);
  const transitionTimer = useRef(null);
  useEffect(() => () => window.clearTimeout(transitionTimer.current), []);

  const openStory = () => {
    if (transitionTimer.current !== null) return;
    if (reduced) {
      continueStory();
      return;
    }
    setGlowing(true);
    transitionTimer.current = window.setTimeout(() => {
      transitionTimer.current = null;
      setGlowing(false);
      continueStory();
    }, 580);
  };

  return (
    <section className="blu-hero" aria-labelledby={`${uid}-title`} data-glowing={glowing}>
      <motion.div
        className="blu-hero-copy"
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : .75, ease: UNIVERSE_EASE }}
      >
        <p className="blu-kicker">{config.heroKicker || (c ? "ПОЗИВНИЦА ЗА ПРВИ РОЂЕНДАН" : "POZIVNICA ZA PRVI ROĐENDAN")}</p>
        <h1 id={`${uid}-title`}>{name}</h1>
        {date && <p className="blu-hero-date"><time dateTime={dateISO || undefined}>{date}</time></p>}
      </motion.div>

      <div className="blu-hero-scene">
        <div className="blu-hero-picture" style={{ "--blu-star-x": STORY_STAR.x, "--blu-star-y": STORY_STAR.y }}>
          <img
            className="blu-hero-art"
            src={hero}
            alt={config.heroAlt || (c
              ? "Мали путник посеже ка звезди док га лисица посматра."
              : "Mali putnik poseže ka zvezdi dok ga lisica posmatra.")}
            fetchPriority="high"
            decoding="async"
            draggable="false"
          />
          <button
            type="button"
            className="blu-hero-star"
            aria-controls={welcomeHeading}
            aria-disabled={glowing}
            onClick={openStory}
          >
            <img src={UNIVERSE_ASSETS.storyStar} alt="" decoding="async" draggable="false" />
            <span>{c ? "Додирни звезду" : "Dodirni zvezdu"}</span>
          </button>
          <UniverseBurst burst={glowing ? { id: uid, ...STORY_STAR } : null} />
        </div>
      </div>
    </section>
  );
}

function PlanetStory({ entry, index, chapterId, nextId, nextIsPlanet, c, goTo }) {
  const reduced = useReducedMotion();
  const [opened, setOpened] = useState(false);
  const panelId = `${chapterId}-uspomena`;
  const verb = opened ? (c ? "Затвори успомену" : "Zatvori uspomenu") : (c ? "Отвори успомену" : "Otvori uspomenu");
  const nextLabel = nextIsPlanet
    ? (c ? "Следећа планета" : "Sledeća planeta")
    : (c ? "До прославе" : "Do proslave");

  return (
    <li className="blu-planet-chapter">
      <UniverseReveal>
        <h3>
          <button
            id={chapterId}
            type="button"
            className="blu-planet-trigger"
            aria-expanded={opened}
            aria-controls={panelId}
            aria-label={`${verb}: ${entry.label}`}
            onClick={() => setOpened(value => !value)}
          >
            <span className="blu-planet-visual" aria-hidden="true">
              <UniverseOrbit className="blu-planet-orbit" />
              <img
                className="blu-planet"
                src={UNIVERSE_ASSETS.planets[index % UNIVERSE_ASSETS.planets.length]}
                alt=""
                loading="lazy"
                decoding="async"
                draggable="false"
              />
              <img className="blu-planet-spark" src={UNIVERSE_ASSETS.sparkle} alt="" loading="lazy" decoding="async" />
            </span>
            <span className="blu-planet-title">{entry.label}</span>
            <span className="blu-planet-verb">{verb}<UniverseIcon type={opened ? "check" : "sparkle"} /></span>
          </button>
        </h3>
        <div id={panelId} hidden={!opened}>
          {opened && (
            <motion.div
              className="blu-planet-memory"
              initial={reduced ? false : { opacity: 0, y: 9 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : .42, ease: UNIVERSE_EASE }}
            >
              {entry.image && (
                <img className="blu-memory-photo" src={entry.image} alt={entry.imageAlt || entry.title || ""} loading="lazy" decoding="async" />
              )}
              {entry.date && <p className="blu-kicker">{entry.date}</p>}
              <h4>{entry.title}</h4>
              <p className="blu-memory-text">{entry.text}</p>
              <button type="button" className="blu-story-link" onClick={() => goTo(nextId, nextIsPlanet ? "center" : "start")}>
                {nextLabel}<UniverseIcon type="down" />
              </button>
            </motion.div>
          )}
        </div>
      </UniverseReveal>
    </li>
  );
}

function FirstYear({ data, partyHeading, goTo }) {
  const { c, config } = data;
  const uid = useId();
  const fallback = [
    { label: c ? "Мој долазак" : "Moj dolazak", title: c ? "Кад је све почело." : "Kad je sve počelo.", text: c ? "Једног дана стигао је неко сасвим мали и наш свет је постао бескрајно велики." : "Jednog dana stigao je neko sasvim mali i naš svet je postao beskrajno veliki.", date: c ? "ПРВО ПОГЛАВЉЕ" : "PRVO POGLAVLJE" },
    { label: c ? "Први осмех" : "Prvi osmeh", title: c ? "Најсјајнија звездица." : "Najsjajnija zvezdica.", text: c ? "Један осмех био је довољан да нам и најобичнији дан засија као читаво небо." : "Jedan osmeh bio je dovoljan da nam i najobičniji dan zasija kao čitavo nebo.", date: c ? "ЈЕДНО МАЛО ЧУДО" : "JEDNO MALO ČUDO" },
    { label: c ? "Мала открића" : "Mala otkrića", title: c ? "Свет на дохват руке." : "Svet na dohvat ruke.", text: c ? "Мале руке, велика радозналост. Сваки нови дан донео нам је још један разлог за радост." : "Male ruke, velika radoznalost. Svaki novi dan doneo nam je još jedan razlog za radost.", date: c ? "МОЈЕ АВАНТУРЕ" : "MOJE AVANTURE" },
    { label: c ? "Прва свећица" : "Prva svećica", title: c ? "Сада славимо заједно." : "Sada slavimo zajedno.", text: c ? "Прва година је пролетела. За следећу авантуру недостајете нам само ви." : "Prva godina je proletela. Za sledeću avanturu nedostajete nam samo vi.", date: data.date || (c ? "УСКОРО СЛАВИМО" : "USKORO SLAVIMO") },
  ];
  const items = Array.isArray(config.milestones) && config.milestones.length ? config.milestones : fallback;

  return (
    <section className="blu-first-year blu-section" aria-labelledby={`${uid}-heading`}>
      <UniverseReveal className="blu-year-heading">
        <UniverseIcon type="sparkle" />
        <h2 id={`${uid}-heading`} className="blu-heading">
          {c ? "Планете" : "Planete"}
          <UniverseScript>{c ? "моје прве године" : "moje prve godine"}</UniverseScript>
        </h2>
        <p className="blu-section-intro">{c ? "Додирни планету и откриј шта она чува." : "Dodirni planetu i otkrij šta ona čuva."}</p>
      </UniverseReveal>
      <ol className="blu-planet-story">
        {items.map((entry, index) => {
          const hasNext = index < items.length - 1;
          return (
            <PlanetStory
              key={`${entry.label}-${index}`}
              entry={entry}
              index={index}
              chapterId={`${uid}-planeta-${index}`}
              nextId={hasNext ? `${uid}-planeta-${index + 1}` : partyHeading}
              nextIsPlanet={hasNext}
              c={c}
              goTo={goTo}
            />
          );
        })}
      </ol>
    </section>
  );
}

function Celebration({ data, headingId, goToRSVP }) {
  const { c, config, details, date, dateISO, time, venue, address } = data;
  const [revealed, setRevealed] = useState(false);
  const reduced = useReducedMotion();
  const panelId = `${headingId}-detalji`;
  const gateLabelId = `${headingId}-prolaz`;
  const events = Array.isArray(details.events) ? details.events : [];
  const palette = Array.isArray(details.dressCodePalette) ? details.dressCodePalette : [];
  const map = details.mapLink || details.locationButtonLink || (venue
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue} ${address}`.trim())}`
    : "");
  const showRSVP = config.showQuickRSVP !== false && !details.rsvpClosed;
  const gateLabel = revealed ? (c ? "Сакриј детаље" : "Sakrij detalje") : (c ? "Откриј прославу" : "Otkrij proslavu");

  return (
    <section className="blu-celebration blu-section" aria-labelledby={headingId} data-revealed={revealed}>
      <UniverseReveal className="blu-celebration-heading">
        <p className="blu-kicker">{c ? "ДАТУМ И МЕСТО ПРОСЛАВЕ" : "DATUM I MESTO PROSLAVE"}</p>
        <h2 id={headingId} tabIndex={-1} className="blu-heading">
          {c ? "Видимо се" : "Vidimo se"}
          <UniverseScript>{c ? "под звездама" : "pod zvezdama"}</UniverseScript>
        </h2>
      </UniverseReveal>

      <UniverseReveal>
        <button
          className="blu-celebration-portal"
          type="button"
          aria-expanded={revealed}
          aria-controls={panelId}
          aria-labelledby={gateLabelId}
          onClick={() => setRevealed(value => !value)}
        >
          <span className="blu-celebration-art">
            <img
              src={config.celebrationImage || UNIVERSE_ASSETS.celebration}
              alt={config.celebrationImageAlt || ""}
              loading="lazy"
              decoding="async"
              draggable="false"
            />
            <img className="blu-celebration-flare" src={UNIVERSE_ASSETS.storyStar} alt="" loading="lazy" decoding="async" />
          </span>
          <span className="blu-celebration-invite">
            <span id={gateLabelId}>{gateLabel}</span><UniverseIcon type="down" />
          </span>
        </button>
      </UniverseReveal>

      <div className="blu-celebration-panel" id={panelId} hidden={!revealed}>
        <motion.div
          initial={false}
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 12 }}
          transition={{ duration: reduced ? 0 : .52, ease: UNIVERSE_EASE }}
        >
          <div className="blu-celebration-details">
            <div className="blu-celebration-when">
              <UniverseIcon type="calendar" />
              <time dateTime={dateISO || undefined}>{date || (c ? "Датум ускоро" : "Datum uskoro")}</time>
              {time && <p>{c ? "Почињемо у" : "Počinjemo u"} <strong>{time}</strong> h</p>}
            </div>
            <div className="blu-celebration-where">
              <UniverseIcon type="location" />
              <div>
                <h3>{venue || (c ? "Локација ускоро" : "Lokacija uskoro")}</h3>
                {address && <p>{address}</p>}
              </div>
            </div>
            {(showRSVP || (map && details.showLocationButton !== false)) && (
              <div className="blu-celebration-actions">
                {map && details.showLocationButton !== false && (
                  <a className="blu-button blu-map-link" href={map} target="_blank" rel="noopener noreferrer">
                    <UniverseIcon type="location" />
                    {details.locationButtonText || (c ? "Отвори мапу" : "Otvori mapu")}
                    <UniverseIcon type="arrow" />
                  </a>
                )}
                {showRSVP && (
                  <button type="button" className="blu-story-link" onClick={goToRSVP}>
                    {c ? "Потврди долазак" : "Potvrdi dolazak"}<UniverseIcon type="down" />
                  </button>
                )}
              </div>
            )}
          </div>

          {events.length > 0 && (
            <details className="blu-celebration-program">
              <summary>
                <UniverseIcon type="sparkle" />
                {c ? "Распоред прославе" : "Raspored proslave"}
                <UniverseIcon type="down" />
              </summary>
              <ol className="blu-schedule">
                {events.map((event, index) => (
                  <li key={index} className="blu-schedule-item">
                    <span className="blu-schedule-time">{event.time}</span>
                    <div>
                      <h3>{event.title || event.label || event.name}</h3>
                      {(event.description || event.location || event.venue) && (
                        <p>{event.description || event.location || event.venue}</p>
                      )}
                      {event.mapLink && (
                        <a className="blu-text-link" href={event.mapLink} target="_blank" rel="noopener noreferrer">
                          {c ? "Локација" : "Lokacija"}<UniverseIcon type="arrow" />
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </details>
          )}

          {details.showDressCode && (
            <div className="blu-dress">
              <h3>{details.dressCodeTitle || "Dress code"}</h3>
              {details.dressCodeNote && <p>{details.dressCodeNote}</p>}
              {palette.length > 0 && (
                <div className="blu-palette">
                  {palette.map((entry, index) => {
                    const color = typeof entry === "string" ? entry : entry?.color || entry?.hex;
                    const label = typeof entry === "string" ? entry : entry?.label || entry?.name;
                    return color && <i key={index} style={{ background: color }} title={label} />;
                  })}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function BirthdayWish({ data }) {
  const { c, config } = data;
  const uid = useId();
  const reduced = useReducedMotion();
  const [lit, setLit] = useState(false);
  return (
    <section className="blu-wish blu-section" data-lit={lit} aria-labelledby={`${uid}-heading`}>
      <UniverseStars />
      <UniverseReveal>
        <h2 id={`${uid}-heading`} className="blu-heading">
          {c ? "Једна свећица." : "Jedna svećica."}
          <UniverseScript>{c ? "Хиљаду жеља." : "Hiljadu želja."}</UniverseScript>
        </h2>
        <p className="blu-wish-invite">{config.wishIntro || (c ? "Замисли једну лепу жељу. Па додирни свећицу." : "Zamisli jednu lepu želju. Pa dodirni svećicu.")}</p>
      </UniverseReveal>
      <div className="blu-candle-scene">
        <UniverseOrbit className="blu-candle-orbits" />
        <button
          className="blu-candle-button"
          type="button"
          aria-pressed={lit}
          aria-label={lit ? (c ? "Свећица је упаљена" : "Svećica je upaljena") : (c ? "Упали прву свећицу" : "Upali prvu svećicu")}
          onClick={() => setLit(true)}
        >
          <img className="blu-candle-image blu-candle-unlit" src={UNIVERSE_ASSETS.candleUnlit} alt="" loading="lazy" decoding="async" draggable="false" />
          <img className="blu-candle-image blu-candle-lit" src={UNIVERSE_ASSETS.candleLit} alt="" loading="lazy" decoding="async" draggable="false" />
        </button>
        <UniverseBurst burst={lit ? { id: uid, x: "50%", y: "25%" } : null} />
      </div>
      <div className="blu-wish-response" role="status" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p key={lit ? "lit" : "unlit"} initial={reduced ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {lit
              ? config.wishThanks || (c ? "Нека расте срећно, вољено и радознало." : "Neka raste srećno, voljeno i radoznalo.")
              : (c ? "Упали моју прву свећицу" : "Upali moju prvu svećicu")}
          </motion.p>
        </AnimatePresence>
      </div>
    </section>
  );
}

export default function BirthdayLittleUniverseInvitationCard(props) {
  const data = universeData(props);
  const { name, date, c, config, details, nameScale } = data;
  const eventSlug = props.slug || "event";
  const uid = useId();
  const [openedStorySlug, setOpenedStorySlug] = useState(null);
  const article = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: article, offset: ["start start", "end end"] });
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 32 });
  const welcomeHeading = `${uid}-welcome`;
  const partyHeading = `${uid}-proslava`;
  const rsvpId = `blu-rsvp-${eventSlug}`;

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      article.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [eventSlug]);

  const goTo = (id, block = "start") => {
    const section = document.getElementById(id);
    section?.focus({ preventScroll: true });
    section?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block });
  };

  return (
    <article
      ref={article}
      className="blu blu-card"
      tabIndex={-1}
      data-script={c ? "cyrillic" : "latin"}
      lang={c ? "sr-Cyrl" : "sr-Latn"}
      aria-label={c ? "Позивница за први рођендан" : "Pozivnica za prvi rođendan"}
      style={{ "--blu-name-scale": nameScale, position: "relative" }}
    >
      <motion.div className="blu-reading-progress" style={{ scaleX: reduced ? scrollYProgress : scaleX }} aria-hidden="true" />

      <StarlightHero
        key={`hero-${eventSlug}`}
        data={data}
        welcomeHeading={welcomeHeading}
        continueStory={() => {
          setOpenedStorySlug(eventSlug);
          goTo(welcomeHeading);
        }}
      />

      <section className="blu-welcome blu-section" aria-labelledby={welcomeHeading}>
        <UniverseReveal>
          <UniverseOrbit />
          <h2 id={welcomeHeading} tabIndex={-1} className="blu-heading">
            {c ? "Некад си био жеља." : "Nekad si bio želja."}
            <UniverseScript>{c ? "Сада си наш свет." : "Sada si naš svet."}</UniverseScript>
          </h2>
          {openedStorySlug === eventSlug && config.starMessage && <p className="blu-welcome-note">{config.starMessage}</p>}
          {config.heroText && <p className="blu-welcome-note">{config.heroText}</p>}
          <p className="blu-welcome-text">{details.welcomeText || (c
            ? "Пре годину дана у наш живот стигао је један мали дечак и донео читав свемир љубави. Позивамо вас да заједно прославимо његов први рођендан и створимо успомене које ће расти с њим."
            : "Pre godinu dana u naš život stigao je jedan mali dečak i doneo čitav svemir ljubavi. Pozivamo vas da zajedno proslavimo njegov prvi rođendan i stvorimo uspomene koje će rasti s njim.")}</p>
          <UniverseScript className="blu-parent-signature">{config.parents || (c ? "Мама и тата" : "Mama i tata")}</UniverseScript>
        </UniverseReveal>
      </section>

      {config.showMilestones !== false && <FirstYear data={data} partyHeading={partyHeading} goTo={goTo} />}
      <Celebration key={`celebration-${eventSlug}`} data={data} headingId={partyHeading} goToRSVP={() => goTo(rsvpId)} />
      {config.showCandle !== false && <BirthdayWish data={data} />}
      <BirthdayLittleUniverseCountdown {...props} targetDate={data.dateISO} />
      <BirthdayLittleUniverseRSVP {...props} eventType="birthday" />

      <footer className="blu-finale">
        <UniverseReveal>
          <UniverseOrbit />
          <p className="blu-finale-text">{details.closingText || (c ? "Најлепше успомене тек ћемо створити." : "Najlepše uspomene tek ćemo stvoriti.")}</p>
          <UniverseScript>{name}</UniverseScript>
          {date && <p className="blu-finale-date">{date}</p>}
        </UniverseReveal>
      </footer>
    </article>
  );
}
