import { useEffect, useRef } from "react";
import { starlightData, StarlightAge, StarlightIcon, StarlightLetters, StarlightReveal, StarlightScript, StarlightSparkles, useStarlightScene } from "./BirthdayStarlightIntro";
import BirthdayStarlightRSVP from "./BirthdayStarlightRSVP";
import BirthdayStarlightCountdown from "./BirthdayStarlightCountdown";
import "../styles/newcard.css";

export default function BirthdayStarlightInvitationCard(props) {
  const data = starlightData(props);
  const { c, details, starlight } = data;
  const root = useRef(null);
  useStarlightScene(root, props.slug);
  const map = details.mapLink || details.locationButtonLink || (data.venue ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${data.venue} ${data.address}`.trim())}` : "");
  const events = Array.isArray(details.events) ? details.events : [];
  const dressPhotos = Array.isArray(starlight.dressPhotos) ? starlight.dressPhotos : [];

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      root.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [props.slug]);

  return <article ref={root} tabIndex={-1} className="bsl bsl-card" data-script={c ? "cyrillic" : "latin"} lang={c ? "sr-Cyrl" : "sr-Latn"} style={{ "--bsl-name-scale": data.nameScale }} aria-label={`${data.name} — ${data.age}. ${c ? "рођендан" : "rođendan"}`}>
    <div className="bsl-shell">
      <section className="bsl-hero" aria-labelledby="bsl-party-heading">
        <StarlightSparkles />
        <div className="bsl-light-sweep" aria-hidden="true" />
        <StarlightAge data={data} />
        <h1 id="bsl-party-heading" className="bsl-party-title"><StarlightScript delay={0.12}>{starlight.heroTitle || (c ? "Рођенданска" : "Birthday")}</StarlightScript><StarlightScript className="bsl-party-second" delay={0.38}>{starlight.heroSubtitle || (c ? "прослава" : "party")}</StarlightScript></h1>
        <StarlightReveal delay={0.25}><p className="bsl-hero-signature">{data.name}</p></StarlightReveal>
      </section>

      <section className="bsl-invitation-arch" aria-label={c ? "Детаљи прославе" : "Detalji proslave"}>
        <div className="bsl-arch-paper" aria-hidden="true" />
        <div className="bsl-arch-copy">
          <h2 className="bsl-welcome-heading"><StarlightScript>{starlight.welcomeTitle || (c ? "Драги пријатељи!" : "Dragi prijatelji!")}</StarlightScript></h2>
          <StarlightReveal><p className="bsl-welcome-text">{details.welcomeText || (c ? `Позивам вас да заједно прославимо мој ${data.age}. рођендан!` : `Pozivam vas da zajedno proslavimo moj ${data.age}. rođendan!`)}</p></StarlightReveal>
          {data.date && <p className="bsl-event-date"><StarlightLetters text={data.date} delay={0.05} /></p>}
          {data.venue && <div className="bsl-location">
            <h3><StarlightScript>{starlight.locationTitle || (c ? "Место прославе" : "Mesto proslave")}</StarlightScript></h3>
            <StarlightReveal><p className="bsl-venue">{data.venue}</p>{data.address && <p className="bsl-address">{data.address}</p>}
              {map && <a className="bsl-button bsl-button-black bsl-map-button" href={map} target="_blank" rel="noopener noreferrer">{details.locationButtonText || (c ? "Погледај локацију" : "Pogledaj lokaciju")}</a>}
            </StarlightReveal>
          </div>}
        </div>
        <StarlightReveal className="bsl-pour-photo" delay={0.1}><img src={data.pourImage} alt="" loading="lazy" decoding="async" draggable="false" width="1536" height="1024" /></StarlightReveal>
        <div className="bsl-gathering">
          <h3><StarlightScript>{starlight.gatheringTitle || (c ? "Окупљање гостију" : "Okupljanje gostiju")}</StarlightScript></h3>
          {data.time && <p><StarlightLetters text={`${c ? "У" : "U"} ${data.time}`} /></p>}
          {events.length > 0 && <div className="bsl-extra-events">{events.map((event, index) => <StarlightReveal key={`${event.time}-${index}`}><p><strong>{event.time}</strong><span>{event.title || event.label || event.name}</span></p>{(event.venue || event.location) && <small>{event.venue || event.location}</small>}</StarlightReveal>)}</div>}
        </div>
      </section>

      {details.showDressCode !== false && <section className="bsl-dress" aria-labelledby="bsl-dress-heading">
        <h2 id="bsl-dress-heading" className="bsl-dress-heading"><StarlightScript>Dress</StarlightScript><StarlightScript className="bsl-dress-second" delay={0.18}>code</StarlightScript></h2>
        <h3 className="bsl-dress-name"><StarlightScript>{details.dressCodeTitle || "Black Tie"}</StarlightScript></h3>
        <StarlightReveal><p className="bsl-dress-note">{details.dressCodeNote || (c ? "Волим елеганцију црне боје и биће ми драго да будете део ове вечери у црним одевним комбинацијама." : "Volim eleganciju crne boje i biće mi drago da budete deo ove večeri u crnim odevnim kombinacijama.")}</p></StarlightReveal>
        <div className="bsl-dress-looks">
          {[0, 1, 2].map((index) => <StarlightReveal key={index} className="bsl-look" delay={index * 0.12}>
            <div className="bsl-look-window"><img className={dressPhotos[index] ? "bsl-look-custom" : "bsl-look-strip"} src={dressPhotos[index] || data.dressImage} alt={(c ? ["Црна вечерња хаљина", "Црно одело", "Црна сатенска хаљина"] : ["Crna večernja haljina", "Crno odelo", "Crna satenska haljina"])[index]} style={{ "--bsl-look-index": index }} loading="lazy" decoding="async" draggable="false" width={dressPhotos[index] ? 512 : 1536} height="1024" /></div>
          </StarlightReveal>)}
        </div>
      </section>}

      <BirthdayStarlightRSVP {...props} eventType="birthday" />
      <BirthdayStarlightCountdown {...props} targetDate={details.dateISO} />
      <div className="bsl-bottom-star" aria-hidden="true"><StarlightIcon /></div>
    </div>
  </article>;
}
