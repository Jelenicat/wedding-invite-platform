import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useScroll } from "framer-motion";
import {
  editionData,
  EditionArrow,
  EditionLetters,
  EditionPhoto,
  EditionReveal,
  EditionScript,
} from "./BirthdayEditionIntro";
import BirthdayEditionRSVP from "./BirthdayEditionRSVP";
import BirthdayEditionCountdown from "./BirthdayEditionCountdown";
import "../styles/newcard.css";

export default function BirthdayEditionInvitationCard(props) {
  const { slug, details = {} } = props;
  const data = editionData(props);
  const c = data.cyrillic;
  const root = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end end"] });
  const events = Array.isArray(details.events) ? details.events : [];
  const mapLink = details.mapLink || details.locationButtonLink ||
    (data.venue ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${data.venue} ${data.address}`.trim())}` : "");
  const title = data.edition.heroTitle || (c ? "Ноћ за" : "Noć za");
  const scriptTitle = data.edition.heroScript || (c ? "успомене" : "uspomene");

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      root.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [slug]);

  return (
    <article
      ref={root}
      className="bde bde-card"
      tabIndex={-1}
      aria-label={c ? "Рођенданска позивница" : "Rođendanska pozivnica"}
      lang={c ? "sr-Cyrl" : "sr-Latn"}
      data-script={c ? "cyrillic" : "latin"}
      style={{ "--bde-name-scale": data.nameScale }}
    >
      {!reduced && <motion.div className="bde-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />}

      <section className="bde-hero">
        <header className="bde-page-meta">
          <span>{data.edition.coverKicker || (c ? "ПОСЕБНО ИЗДАЊЕ" : "POSEBNO IZDANJE")}</span>
          <span>№ {data.age} / 01</span>
        </header>
        <EditionReveal className="bde-hero-heading">
          <p className="bde-kicker">{data.name} · {data.age}. {c ? "РОЂЕНДАН" : "ROĐENDAN"}</p>
          <h1 className="bde-hero-title">
            <EditionLetters text={title} />
            <EditionScript delay={0.3}>{scriptTitle}</EditionScript>
          </h1>
        </EditionReveal>
        <div className="bde-hero-art">
          <EditionPhoto src={data.story} alt={data.edition.storyAlt || ""} eager position={data.edition.storyPosition || "50% 63%"} />
          <EditionReveal className="bde-hero-caption">
            <span>{data.edition.photoCaption || (c ? "ДОБРЕ ПРИЧЕ ПОЧИЊУ ОВДЕ." : "DOBRE PRIČE POČINJU OVDE.")}</span>
            <span>{data.date}</span>
          </EditionReveal>
        </div>
        <div className="bde-hero-bottom">
          <span>{c ? "ПРОЛИСТАЈ ПОЗИВНИЦУ" : "PROLISTAJ POZIVNICU"}</span>
          <EditionArrow down />
        </div>
      </section>

      <section className="bde-letter bde-section">
        <EditionReveal>
          <p className="bde-section-index"><span>01</span>{c ? "ЛИЧНО, ЗА ТЕБЕ" : "LIČNO, ZA TEBE"}</p>
          <h2 className="bde-letter-heading"><EditionScript underline>{data.edition.letterTitle || (c ? "Драги моји," : "Dragi moji,")}</EditionScript></h2>
          <p className="bde-letter-body">{details.welcomeText || (c
            ? `Ново поглавље заслужује посебно вече. Позивам вас да заједно прославимо мој ${data.age}. рођендан и створимо успомене које остају.`
            : `Novo poglavlje zaslužuje posebno veče. Pozivam vas da zajedno proslavimo moj ${data.age}. rođendan i stvorimo uspomene koje ostaju.`)}</p>
          {details.closingText && <p className="bde-letter-note">{details.closingText}</p>}
          <p className="bde-signature"><EditionScript delay={0.2}>{data.name}</EditionScript></p>
        </EditionReveal>
      </section>

      <section className="bde-details bde-section">
        <EditionReveal>
          <p className="bde-section-index"><span>02</span>{c ? "СВЕ ШТО ТРЕБА ДА ЗНАШ" : "SVE ŠTO TREBA DA ZNAŠ"}</p>
          <h2 className="bde-section-title"><EditionLetters text={c ? "САЧУВАЈ" : "SAČUVAJ"} /><EditionScript>{c ? "ово вече" : "ovo veče"}</EditionScript></h2>
        </EditionReveal>

        <div className="bde-date-grid">
          {data.date && <EditionReveal className="bde-data-cell"><span className="bde-kicker">{c ? "ДАТУМ" : "DATUM"}</span><p>{data.date}</p></EditionReveal>}
          {data.time && <EditionReveal className="bde-data-cell" delay={0.1}><span className="bde-kicker">{c ? "ПОЧЕТАК" : "POČETAK"}</span><p>{data.time}<small>h</small></p></EditionReveal>}
        </div>

        {data.venue && <EditionReveal className="bde-venue">
          <p className="bde-kicker">{c ? "МЕСТО СУСРЕТА" : "MESTO SUSRETA"}</p>
          <h3>{data.venue}</h3>
          {data.address && <p className="bde-venue-address">{data.address}</p>}
          {mapLink && <a className="bde-text-link" href={mapLink} target="_blank" rel="noopener noreferrer"><span>{details.locationButtonText || (c ? "ПОГЛЕДАЈ ЛОКАЦИЈУ" : "POGLEDAJ LOKACIJU")}</span><EditionArrow /></a>}
        </EditionReveal>}

        {events.length > 0 && <div className="bde-schedule">
          {events.map((event, index) => <EditionReveal className="bde-schedule-row" key={`${event.time || ""}-${index}`}>
            <span>{event.time}</span>
            <div><h3>{event.title || event.label || event.name}</h3>{(event.venue || event.location) && <p>{event.venue || event.location}</p>}{event.mapLink && <a className="bde-text-link" href={event.mapLink} target="_blank" rel="noopener noreferrer">{c ? "ЛОКАЦИЈА" : "LOKACIJA"}<EditionArrow /></a>}</div>
          </EditionReveal>)}
        </div>}

        {details.showDressCode && <EditionReveal className="bde-dress">
          <div><p className="bde-kicker">{c ? "МАЛИ ПОДСЕТНИК" : "MALI PODSETNIK"}</p><h3>{details.dressCodeTitle || "Dress code"}</h3></div>
          {details.dressCodeNote && <p>{details.dressCodeNote}</p>}
          {Array.isArray(details.dressCodePalette) && details.dressCodePalette.length > 0 && <div className="bde-palette" aria-label={c ? "Палета боја" : "Paleta boja"}>{details.dressCodePalette.map((item, index) => {
            const color = typeof item === "string" ? item : item.color || item.hex;
            const label = typeof item === "string" ? item : item.label || item.name || color;
            return <span key={index} style={{ backgroundColor: color }} title={label} role="img" aria-label={label} />;
          })}</div>}
        </EditionReveal>}
      </section>

      <section className="bde-interlude" aria-label={c ? "Једно посебно вече" : "Jedno posebno veče"}>
        <EditionPhoto src={data.edition.interludeImage || data.cover} position={data.edition.interludePosition || "50% 72%"} />
        <EditionReveal className="bde-interlude-note"><span>{data.edition.interludeText || (c ? "НАШЕ ПОСЕБНО ВЕЧЕ." : "NAŠE POSEBNO VEČE.")}</span><EditionScript>{data.edition.interludeScript || (c ? "Славимо заједно." : "Slavimo zajedno.")}</EditionScript></EditionReveal>
      </section>

      <BirthdayEditionRSVP {...props} eventType="birthday" />
      <BirthdayEditionCountdown {...props} targetDate={details.dateISO} />
    </article>
  );
}
