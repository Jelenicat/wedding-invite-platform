import { useEffect, useRef, useState } from "react";
import "../styles/newintro.css";

// Svi dekorativni elementi su u paketu. Fontovi se uvoze preko Google Fonts u newintro.css.
export const DENTELLE_ASSETS = {
  cover: "/images/dentelle/lace-envelope.webp",
  frame: "/images/dentelle/lace-frame.webp",
  edge: "/images/dentelle/lace-edge.webp",
  venue: "/icons/dentelle-villa.svg",
};

const CYRILLIC = {
  A:"А",B:"Б",V:"В",G:"Г",D:"Д",Đ:"Ђ",E:"Е",Ž:"Ж",Z:"З",I:"И",J:"Ј",K:"К",L:"Л",M:"М",
  N:"Н",O:"О",P:"П",R:"Р",S:"С",T:"Т",Ć:"Ћ",U:"У",F:"Ф",H:"Х",C:"Ц",Č:"Ч",Š:"Ш",
  a:"а",b:"б",v:"в",g:"г",d:"д",đ:"ђ",e:"е",ž:"ж",z:"з",i:"и",j:"ј",k:"к",l:"л",m:"м",
  n:"н",o:"о",p:"п",r:"р",s:"с",t:"т",ć:"ћ",u:"у",f:"ф",h:"х",c:"ц",č:"ч",š:"ш",
};
export function dentelleText(script = "latin") {
  const labels = {
    forYou: "Sa ljubavlju, za vas", open: "Otvori pozivnicu",
    opening: "Otvaramo pozivnicu…", invitation: "Pozivnica za venčanje",
    together: "Zajedno sa svojim porodicama", and: "i",
    celebrate: "Pozivamo vas da proslavimo ljubav.", details: "Naša priča",
    welcomeTitle: "Najlepše je zajedno.", countdown: "Do našeg zauvek",
    days: "dana", hours: "sati", minutes: "minuta", seconds: "sekundi",
    today: "Naš dan je stigao.", dateSoon: "Datum uskoro.", countdownKicker: "Zauvek počinje za",
    location: "Mesto naše priče", directions: "Pogledaj lokaciju",
    day: "Naš dan", dayNote: "Od prvog susreta do poslednjeg plesa.",
    dress: "Stil odevanja", dressTitle: "Svečano, u svom stilu.",
    dressNote: "Obucite ono u čemu se osećate posebno. Osmeh je obavezan.",
    gift: "Najlepši poklon", giftText: "Vaše prisustvo je naš najlepši poklon.",
    giftNote: "Najviše nam znači da ovaj dan podelimo sa vama.",
    rsvp: "Potvrdite dolazak", rsvpNote: "Naš dan biće još lepši sa vama.",
    deadline: "Molimo vas da odgovorite do", fullName: "Ime i prezime",
    namePlaceholder: "Vaše ime i prezime", attendance: "Da li dolazite?",
    yes: "Dolazim", yesNote: "Sa zadovoljstvom", no: "Ne dolazim", noNote: "Ovog puta ne mogu",
    guests: "Ukupan broj osoba", guestsHint: "Uključujući vas i decu.",
    fewer: "Smanji broj osoba", more: "Povećaj broj osoba",
    children: "Od toga dece", childrenHint: "Deca su već uračunata u ukupan broj.",
    fewerChildren: "Smanji broj dece", moreChildren: "Povećaj broj dece",
    guest: "Gost", guestNames: "Imena ostalih gostiju",
    fasting: "Da li postite?", fastingYes: "Postim", fastingNo: "Ne postim",
    dietary: "Alergije ili posebna ishrana", dietaryPlaceholder: "Npr. vegetarijanski meni, alergija na orašaste plodove…",
    message: "Poruka za nas", messagePlaceholder: "Ostavite nam nekoliko reči…",
    submit: "Pošalji odgovor", sending: "Šaljemo odgovor…", thanks: "Hvala od srca!",
    saved: "Vaš odgovor je uspešno sačuvan.",
    savedYes: "Jedva čekamo da slavimo zajedno.", savedNo: "Hvala što ste nam javili. Bićete u našim mislima.",
    another: "Pošalji odgovor za drugog gosta", closed: "Prijave su zatvorene",
    closedNote: "Za naknadne izmene obratite se mladencima.",
    missingSlug: "Nedostaje oznaka pozivnice. Osvežite stranicu i pokušajte ponovo.",
    enterName: "Unesite ime i prezime.", chooseAttendance: "Izaberite da li dolazite.",
    invalidGuests: "Proverite ukupan broj osoba.", invalidChildren: "Broj dece mora biti manji od ukupnog broja osoba.",
    missingNames: "Unesite ime i prezime svakog gosta.", chooseFasting: "Izaberite odgovor za posni meni.",
    submitError: "Odgovor nije sačuvan. Proverite vezu i pokušajte ponovo.",
    offline: "Trenutno nemate internet vezu. Povežite se i pokušajte ponovo.",
    calendar: "Sačuvaj datum", closing: "Radujemo se što ćete biti deo naše priče.",
    withLove: "Sa ljubavlju", venueAlt: "Dekorativna ilustracija vile",
    welcomeBody: "Sa velikom radošću vas pozivamo da svojim prisustvom ulepšate početak naše zajedničke priče.",
    locationKicker: "Tamo gde se slavi ljubav", scheduleKicker: "Jedan dan. Bezbroj uspomena.",
    rsvpKicker: "Vi ste deo naše priče",
  };
  if (script !== "cyrillic") return labels;
  const convert = (value) => value
    .replace(/Dž|DŽ/g, "Џ").replace(/dž/g, "џ").replace(/Lj|LJ/g, "Љ").replace(/lj/g, "љ")
    .replace(/Nj|NJ/g, "Њ").replace(/nj/g, "њ").replace(/[A-Za-zĐđŽžĆćČčŠš]/g, (letter) => CYRILLIC[letter] || letter);
  return Object.fromEntries(Object.entries(labels).map(([key, value]) => [key, convert(value)]));
}

export function dentelleDate(dateISO) {
  if (typeof dateISO !== "string" || !/^\d{4}-\d{2}-\d{2}(?:T|$)/.test(dateISO)) return null;
  const [year, month, day] = dateISO.slice(0, 10).split("-").map(Number);
  const check = new Date(Date.UTC(year, month - 1, day));
  if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) return null;
  const date = new Date(dateISO);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function dentelleSafeLink(value) {
  return typeof value === "string" && /^https?:\/\//i.test(value) ? value : "";
}

export function DentelleReveal({ children, className = "", as: Tag = "div" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.08 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <Tag ref={ref} className={"dnt-reveal " + (visible ? "dnt-is-visible " : "") + className}>{children}</Tag>;
}

export function DentelleLace({ src = DENTELLE_ASSETS.edge, className = "" }) {
  return <div className={"dnt-lace " + className} aria-hidden="true">
    <img src={src} alt="" loading="lazy" decoding="async" />
  </div>;
}

export const DENTELLE_ICONS = {
  rings: { file: "dentelle-rings.svg", viewBox: "0 0 72 72" },
  church: { file: "dentelle-church.svg" },
  gathering: { file: "dentelle-gathering.svg" },
  civil: { file: "dentelle-civil.svg" },
  dinner: { file: "dentelle-dinner.svg" },
  party: { file: "dentelle-party.svg" },
  cake: { file: "dentelle-cake.svg" },
  location: { file: "dentelle-location.svg" },
  calendar: { file: "dentelle-calendar.svg" },
  heart: { file: "dentelle-heart.svg" },
  dress: { file: "dentelle-dress.svg", viewBox: "0 0 106 146", heightRatio: 146 / 106 },
  check: { file: "dentelle-check.svg" },
  swans: { file: "dentelle-swans.svg", viewBox: "0 0 180 100", widthRatio: 1.8 },
  tablescape: { file: "dentelle-tablescape.svg", viewBox: "0 0 580 190", widthRatio: 580 / 190 },
  seal: { file: "dentelle-seal.svg", viewBox: "0 0 100 100" },
};

// Geometrija je u public/icons; currentColor se nasleđuje iz CSS-a.
export function DentelleFlourish({ className = "" }) {
  return <svg className={"dnt-flourish " + className} viewBox="0 0 320 66" fill="none" aria-hidden="true" focusable="false">
    <use href="/icons/dentelle-flourish.svg#dnt-flourish" />
  </svg>;
}

export function DentelleIcon({ name = "rings", className = "", size = 64 }) {
  const key = DENTELLE_ICONS[name] ? name : "rings";
  const asset = DENTELLE_ICONS[key];
  return <svg className={"dnt-icon " + (key === "tablescape" ? "dnt-tablescape " : "") + className}
    width={size * (asset.widthRatio || 1)} height={size * (asset.heightRatio || 1)}
    viewBox={asset.viewBox || "0 0 64 64"} fill="none" aria-hidden="true" focusable="false">
    <use href={"/icons/" + asset.file + "#dnt-" + key} />
  </svg>;
}

// Ista unutrašnja kartica tokom otvaranja i nakon prelaska na InvitationCard.
export function DentelleHeroContent({ brideName, groomName, weddingDate, venue, details = {}, script = "latin", rsvpId }) {
  const t = dentelleText(script);
  const config = details.dentelle || {};
  return <div className="dnt-hero-content">
    <DentelleIcon name="swans" size={44} className="dnt-hero-swans" />
    <p className="dnt-hero-family">{config.familyText || t.together}</p>
    <h1 className="dnt-hero-names">
      <span className="dnt-script-name">{brideName}</span>
      <span className="dnt-ampersand">&amp;</span>
      <span className="dnt-script-name">{groomName}</span>
    </h1>
    <p className="dnt-date">{weddingDate}</p>
    <img className="dnt-hero-villa" src={config.heroIllustration || config.venueImage || DENTELLE_ASSETS.venue} alt="" decoding="async" />
    <p className="dnt-hero-venue">{details.locationName || venue}</p>
    <p className="dnt-kicker dnt-hero-address">{details.locationAddress || config.heroSubtitle || ""}</p>
    {rsvpId ? <a className="dnt-hero-reply" href={"#" + rsvpId}>{t.rsvp}</a> : <span className="dnt-hero-reply">{t.rsvp}</span>}
  </div>;
}

export default function DentelleIntro({
  brideName = "", groomName = "", weddingDate = "", venue = "", details = {}, script = "latin",
  onOpen, onEnter, onStartMusic, isOpen = false,
}) {
  const t = dentelleText(script);
  const config = details.dentelle || {};
  const [opening, setOpening] = useState(false);
  const lock = useRef(false);
  const timer = useRef(null);
  const initials = config.monogram || [brideName.trim().charAt(0), groomName.trim().charAt(0)].join("");

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const open = () => {
    if (lock.current || isOpen) return;
    lock.current = true;
    setOpening(true);
    onStartMusic?.();
    // Ne pozivamo onOpen na početku: WeddingPage bi prekinuo preklapanje posle 1600 ms.
    // Intro sam završava svoju animaciju i tek tada predaje prikaz kartici.
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 150 : 2600;
    timer.current = setTimeout(() => (onEnter || onOpen)?.(), duration);
  };

  return <section className={"dnt dnt-intro " + (opening || isOpen ? "dnt-is-opening" : "")} data-script={script} aria-label={t.invitation}>
    <div className="dnt-intro-stage">
      <div className="dnt-intro-card" aria-hidden="true">
        <img className="dnt-intro-frame" src={config.frameImage || DENTELLE_ASSETS.frame} alt="" decoding="async" />
        <DentelleHeroContent brideName={brideName} groomName={groomName} weddingDate={weddingDate} venue={venue} details={details} script={script} />
      </div>
      <div className="dnt-envelope-flap" aria-hidden="true">
        <div className="dnt-envelope-face dnt-envelope-flap-front">
          <img src={config.coverImage || DENTELLE_ASSETS.cover} alt="" fetchPriority="high" decoding="async" />
          <span className="dnt-wax-seal dnt-flap-seal">
            <DentelleIcon name="seal" className="dnt-seal-ring-art" size={100} />
            <span className="dnt-seal-monogram">{initials}</span>
            <DentelleFlourish className="dnt-seal-flourish" />
          </span>
        </div>
        <div className="dnt-envelope-face dnt-envelope-flap-back">
          <img src={config.frameImage || DENTELLE_ASSETS.frame} alt="" decoding="async" />
        </div>
      </div>
      {["left", "right", "bottom"].map((fold) => <div key={fold} className={"dnt-envelope-fold dnt-envelope-" + fold} aria-hidden="true">
        <img src={config.coverImage || DENTELLE_ASSETS.cover} alt="" decoding="async" />
      </div>)}
      <div className="dnt-intro-vignette" aria-hidden="true" />
      <p className="dnt-intro-kicker">{config.introKicker ?? t.forYou}</p>
      <button type="button" className="dnt-wax-seal" onClick={open} disabled={opening || isOpen} aria-label={t.open}>
        <DentelleIcon name="seal" className="dnt-seal-ring-art" size={100} />
        <span className="dnt-seal-monogram" aria-hidden="true">{initials}</span>
        <DentelleFlourish className="dnt-seal-flourish" />
      </button>
      <div className="dnt-intro-caption">
        <h1 className="dnt-intro-names">{brideName} <span>&amp;</span> {groomName}</h1>
        <p className="dnt-intro-date">{weddingDate}</p>
      </div>
    </div>
  </section>;
}
