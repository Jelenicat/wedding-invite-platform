import { useEffect, useId, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
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

function JungleStory({ id, data }) {
  const { text, details, config } = data;

  return (
    <section className="jb-story" aria-labelledby={id}>
      <header className="jb-content jb-story-heading">
        <h2 id={id} tabIndex={-1}>{text("Prva godina", "Прва година")} <span className="jb-script">{text("u džungli", "у џунгли")}</span></h2>
        {details.welcomeText && <p className="jb-section-copy">{details.welcomeText}</p>}
      </header>

      {storyChapters(text).map((defaultChapter, index) => {
        const chapter = { ...defaultChapter, ...config.chapters?.[index] };
        const defaultImage = chapter.image === defaultChapter.image;
        return (
          <figure className="jb-chapter" key={defaultChapter.title}>
            <div className="jb-scene">
              <img
                src={chapter.image}
                alt={chapter.alt}
                width={defaultImage ? 1160 : undefined}
                height={defaultImage ? 870 : undefined}
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption className="jb-chapter-caption">
              <h3>{chapter.title}</h3>
              <p>{chapter.memory}</p>
            </figcaption>
          </figure>
        );
      })}
    </section>
  );
}

function JungleCelebration({ id, rsvpId, data, goTo }) {
  const { text, details, config, date, dateISO, time, venue, address } = data;
  const mapLink = details.mapLink || details.locationButtonLink
    || (venue || address ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent([venue, address].filter(Boolean).join(", ")) : "");
  const showLocation = mapLink && details.showLocationButton !== false;
  const showRSVP = config.showQuickRSVP !== false && !details.rsvpClosed;
  const events = Array.isArray(details.events) ? details.events : [];

  return (
    <section className="jb-party" aria-labelledby={id}>
      <div className="jb-scene jb-party-scene">
        <img
          src={config.mapImage || JUNGLE_ART.clearing}
          alt=""
          width={config.mapImage ? undefined : 1160}
          height={config.mapImage ? undefined : 870}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="jb-content jb-party-content">
        <h2 id={id} tabIndex={-1}>{text("Vidimo se", "Видимо се")} <span className="jb-script">{text("na proslavi", "на прослави")}</span></h2>

        {(date || time || venue || address) && (
          <div className="jb-event-details">
            {(date || time) && (
              <div>
                <p className="jb-eyebrow">{text("Datum i vreme", "Датум и време")}</p>
                {date && <time dateTime={dateISO || undefined}>{date}</time>}
                {time && <p>{text("Početak u", "Почетак у")} {time}</p>}
              </div>
            )}
            {(venue || address) && (
              <div>
                <p className="jb-eyebrow">{text("Mesto", "Место")}</p>
                {venue && <strong>{venue}</strong>}
                {address && <p>{address}</p>}
              </div>
            )}
          </div>
        )}

        {(showLocation || showRSVP) && (
          <div className="jb-location-actions">
            {showLocation && (
              <a className="jb-button jb-directions" href={mapLink} target="_blank" rel="noopener noreferrer">
                <JungleMark type="compass" />
                {details.locationButtonText || text("Otvori lokaciju", "Отвори локацију")}
              </a>
            )}
            {showRSVP && (
              <a className="jb-button" href={"#" + rsvpId} onClick={(event) => { event.preventDefault(); goTo(rsvpId); }}>
                {text("Potvrdi dolazak", "Потврди долазак")}
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
      <header className="jb-prologue">
        <img className="jb-prologue-art" src={config.prologueImage || JUNGLE_ART.prologue} alt="" fetchPriority="high" />
        <motion.div
          className="jb-prologue-title"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : .65 }}
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

      <JungleStory id={storyId} data={data} />
      <JungleCelebration id={partyId} rsvpId={rsvpId} data={data} goTo={goTo} />
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
