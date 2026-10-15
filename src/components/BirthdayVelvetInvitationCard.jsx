import { useEffect, useRef } from "react";
import { velvetData, VelvetArrow, VelvetLetters, VelvetLine, VelvetOrnament, VelvetPhoto, VelvetReveal, VelvetScript } from "./BirthdayVelvetIntro";
import BirthdayVelvetRSVP from "./BirthdayVelvetRSVP";
import BirthdayVelvetCountdown from "./BirthdayVelvetCountdown";
import "../styles/newcard.css";

export default function BirthdayVelvetInvitationCard(props) {
  const { slug, details = {} } = props;
  const data = velvetData(props), c = data.cyrillic;
  const root = useRef(null);
  const map = details.mapLink || details.locationButtonLink || (data.venue ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${data.venue} ${data.address}`.trim())}` : "");
  const events = Array.isArray(details.events) ? details.events : [];
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      root.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [slug]);

  return <article ref={root} className="bvs bvs-card" tabIndex={-1} data-variant={data.variant} data-script={c ? "cyrillic" : "latin"} lang={c ? "sr-Cyrl" : "sr-Latn"} style={{"--bvs-name-scale":data.nameScale}}>
    <section className="bvs-welcome bvs-section">
      <VelvetReveal><p className="bvs-kicker">{c?"ДРАГИ МОЈИ,":"DRAGI MOJI,"}</p><h1 className="bvs-welcome-title"><VelvetLetters text={c?"Једно вече.":"Jedno veče."} /><VelvetScript>{c?"наше успомене.":"naše uspomene."}</VelvetScript></h1></VelvetReveal>
      <VelvetReveal><p className="bvs-welcome-text">{details.welcomeText || (c ? `Позивам вас да заједно прославимо мој ${data.age}. рођендан. Чекају нас музика, смех и успомене које остају.` : `Pozivam vas da zajedno proslavimo moj ${data.age}. rođendan. Čekaju nas muzika, smeh i uspomene koje ostaju.`)}</p></VelvetReveal>
      <VelvetReveal className="bvs-date-signature"><VelvetScript>{data.velvet.dateLine || data.date}</VelvetScript><VelvetLine /></VelvetReveal>
    </section>

    <section className="bvs-location bvs-section">
      <VelvetReveal><p className="bvs-kicker">01 / {c?"МЕСТО ПРОСЛАВЕ":"MESTO PROSLAVE"}</p><h2 className="bvs-section-title"><VelvetScript>{c?"Локација":"Lokacija"}</VelvetScript></h2><h3>{data.venue || (c?"Место ускоро откривамо":"Mesto uskoro otkrivamo")}</h3>{data.address && <p className="bvs-address">{data.address}</p>}</VelvetReveal>
      <VelvetReveal className="bvs-location-picture"><VelvetPhoto src={data.velvet.locationImage || data.evening} position={data.velvet.locationPosition || "50% 58%"} alt={c?"Атмосфера прославе":"Atmosfera proslave"} /></VelvetReveal>
      {map && <VelvetReveal><a className="bvs-button bvs-button-outline" href={map} target="_blank" rel="noopener noreferrer"><span>{details.locationButtonText || (c?"ПОГЛЕДАЈ ЛОКАЦИЈУ":"POGLEDAJ LOKACIJU")}</span><VelvetArrow /></a></VelvetReveal>}
    </section>

    {events.length > 0 && <section className="bvs-schedule bvs-section">
      <VelvetReveal><h2 className="bvs-section-title"><VelvetScript>{c?"Сатница":"Satnica"}</VelvetScript></h2></VelvetReveal>
      <div className="bvs-timeline">{events.map((event,index)=><VelvetReveal className="bvs-timeline-row" key={index}>
        <span className="bvs-timeline-pearls" aria-hidden="true"><i /><i /></span>
        <div className="bvs-timeline-time"><VelvetScript>{event.time}</VelvetScript></div>
        <div className="bvs-timeline-description"><h3>{event.title || event.label || event.name}</h3>{(event.venue || event.location) && <p>{event.venue || event.location}</p>}{event.mapLink && <a className="bvs-text-link" href={event.mapLink} target="_blank" rel="noopener noreferrer">{c?"ЛОКАЦИЈА":"LOKACIJA"}<VelvetArrow /></a>}</div>
      </VelvetReveal>)}</div>
    </section>}

    <BirthdayVelvetRSVP {...props} eventType="birthday" />

    {details.showDressCode && <section className="bvs-dress bvs-section">
      <VelvetReveal><p className="bvs-kicker">{c?"МАЛА ИНСПИРАЦИЈА":"MALA INSPIRACIJA"}</p><h2 className="bvs-section-title"><VelvetScript>{details.dressCodeTitle || "Dress code"}</VelvetScript></h2>{data.velvet.dressImage && <VelvetPhoto className="bvs-dress-photo" src={data.velvet.dressImage} position={data.velvet.dressPosition || "50% 50%"} alt={c?"Инспирација за одевање":"Inspiracija za odevanje"} />}{details.dressCodeNote && <p className="bvs-dress-note">{details.dressCodeNote}</p>}{Array.isArray(details.dressCodePalette) && <div className="bvs-palette">{details.dressCodePalette.map((value,index)=>{const color=typeof value==="string"?value:value.color||value.hex; const label=typeof value==="string"?value:value.label||value.name||color; return <span key={index} style={{backgroundColor:color}} role="img" aria-label={label} title={label} />;})}</div>}</VelvetReveal>
    </section>}

    {data.velvet.detailsText && <section className="bvs-details bvs-section"><VelvetReveal><p className="bvs-kicker">{c?"ЈОШ ЈЕДНА СИТНИЦА":"JOŠ JEDNA SITNICA"}</p><h2><VelvetScript>{c?"Детаљи":"Detalji"}</VelvetScript></h2><p>{data.velvet.detailsText}</p><VelvetOrnament /></VelvetReveal></section>}

    <BirthdayVelvetCountdown {...props} targetDate={details.dateISO} />
  </article>;
}
