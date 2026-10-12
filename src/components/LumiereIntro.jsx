import { useEffect, useRef, useState } from "react";
import "../styles/newintro.css";

// Zajedničke funkcije i mali elementi koje koriste Lumiere komponente.
export const LUMIERE_ASSETS = {
  hero: "/images/lumiere/lumiere-arch.webp",
  detail: "/images/lumiere/lumiere-rings.webp",
  story: "/images/lumiere/lumiere-staircase.webp",
  venue: "/images/lumiere/lumiere-reception.webp",
};

const COPY = {
  sr: {
    invitation: "Pozivnica za venčanje", open: "Pogledaj pozivnicu", opening: "Otvaramo našu priču",
    chapter: "Jedan dan. Naše zauvek.", story: "Naša priča", welcomeTitle: "Najlepše je zajedno.",
    welcome: "Sa velikom radošću vas pozivamo da budete deo početka naše zajedničke priče.",
    date: "Sačuvajte datum", scroll: "Priča se nastavlja", plan: "Plan našeg dana", planNote: "Od prvog zagrljaja do poslednjeg plesa.",
    location: "Mesto susreta", map: "Pogledaj lokaciju", dressCode: "Za ovu priliku", women: "Dame", men: "Muškarci",
    details: "Dobro je znati", contact: "Tu smo za sva pitanja", rsvp: "Vaše mesto u našoj priči", rsvpTitle: "Dolazite?", deadline: "Molimo potvrdite do",
    rsvpNote: "Jedva čekamo da ovaj dan podelimo sa vama.", fullName: "Ime i prezime", namePlaceholder: "Upišite ime i prezime",
    attendance: "Da li dolazite?", yes: "Dolazim", yesNote: "Vidimo se na slavlju", no: "Ne dolazim", noNote: "Šaljem vam ljubav",
    guests: "Broj osoba", guestsHint: "Uključujući i vas", fewer: "Smanji broj osoba", more: "Povećaj broj osoba",
    fasting: "Da li postite?", fastingYes: "Postim", fastingNo: "Ne postim", guest: "Gost", guestNames: "Imena svih gostiju",
    submit: "Pošalji potvrdu", sending: "Šaljemo vašu potvrdu…", thanks: "Hvala od srca.", success: "Vaša potvrda je uspešno poslata.",
    successYes: "Čuvamo vam mesto. Vidimo se uskoro!", successNo: "Hvala što ste nam javili. Šaljemo veliki zagrljaj!", another: "Pošalji novu potvrdu",
    closed: "Potvrde su zatvorene", closedNote: "Za izmene potvrde ili dodatne informacije javite se mladencima.",
    enterName: "Unesite ime i prezime.", chooseAttendance: "Izaberite da li dolazite.", invalidGuests: "Izaberite od 1 do 10 osoba.",
    chooseFasting: "Izaberite da li postite.", missingNames: "Unesite ime i prezime za svaku osobu.", submitError: "Potvrda nije poslata. Pokušajte ponovo.",
    missingSlug: "Potvrda trenutno nije dostupna. Javite se mladencima.", remaining: "Do našeg zauvek", arrived: "Naš dan je stigao.",
    days: "dana", hours: "sati", minutes: "minuta", seconds: "sekundi", addCalendar: "Dodaj u kalendar", calendarHint: "Jedan datum. Toliko uspomena.",
    closing: "Sa ljubavlju", closingNote: "Najlepše uspomene stvaramo zajedno.", viewPhoto: "Uvećaj fotografiju", closePhoto: "Zatvori fotografiju",
    palette: "Predložene boje", color: "Boja", language: "Jezik pozivnice", jumpRsvp: "Potvrdi dolazak",
  },
  en: {
    invitation: "Wedding invitation", open: "Open the invitation", opening: "Our story is opening",
    chapter: "One day. Our forever.", story: "Our story", welcomeTitle: "Better, together.",
    welcome: "With joyful hearts, we invite you to be part of the beginning of our story together.",
    date: "Save the date", scroll: "The story continues", plan: "The wedding day", planNote: "From the first embrace to the last dance.",
    location: "Where we meet", map: "View location", dressCode: "For the occasion", women: "Ladies", men: "Gentlemen", details: "Good to know", contact: "Here for your questions",
    rsvp: "Your place in our story", rsvpTitle: "Will you join us?", deadline: "Please reply by", rsvpNote: "We can’t wait to share this day with you.",
    fullName: "Full name", namePlaceholder: "Enter your full name", attendance: "Will you attend?", yes: "Attending", yesNote: "See you at the celebration", no: "Not attending", noNote: "Sending you love",
    guests: "Number of guests", guestsHint: "Including yourself", fewer: "Remove one guest", more: "Add one guest", fasting: "Are you fasting?", fastingYes: "Fasting", fastingNo: "Not fasting",
    guest: "Guest", guestNames: "All guest names", submit: "Send RSVP", sending: "Sending your RSVP…", thanks: "Thank you, truly.", success: "Your RSVP has been sent successfully.",
    successYes: "Your place is saved. See you soon!", successNo: "Thank you for letting us know. Sending a big hug!", another: "Send another RSVP",
    closed: "RSVP is closed", closedNote: "Please contact the couple for any changes or additional information.", enterName: "Please enter your full name.", chooseAttendance: "Please select your attendance.",
    invalidGuests: "Please choose between 1 and 10 guests.", chooseFasting: "Please select your fasting preference.", missingNames: "Please enter a full name for every guest.",
    submitError: "Your RSVP was not sent. Please try again.", missingSlug: "RSVP is currently unavailable. Please contact the couple.", remaining: "Until our forever", arrived: "Our day has arrived.",
    days: "days", hours: "hours", minutes: "minutes", seconds: "seconds", addCalendar: "Add to calendar", calendarHint: "One date. A lifetime of memories.",
    closing: "With love", closingNote: "The best memories are made together.", viewPhoto: "Enlarge photograph", closePhoto: "Close photograph", palette: "Suggested colours", color: "Colour", language: "Invitation language", jumpRsvp: "RSVP",
  },
  de: {
    invitation: "Hochzeitseinladung", open: "Einladung öffnen", opening: "Unsere Geschichte beginnt",
    chapter: "Ein Tag. Unser Für immer.", story: "Unsere Geschichte", welcomeTitle: "Zusammen ist es schöner.",
    welcome: "Mit großer Freude laden wir euch ein, den Beginn unserer gemeinsamen Geschichte mit uns zu feiern.",
    date: "Merkt euch das Datum", scroll: "Die Geschichte geht weiter", plan: "Unser Hochzeitstag", planNote: "Von der ersten Umarmung bis zum letzten Tanz.",
    location: "Unser Treffpunkt", map: "Standort anzeigen", dressCode: "Für diesen Anlass", women: "Damen", men: "Herren", details: "Gut zu wissen", contact: "Wir sind für euch da",
    rsvp: "Euer Platz in unserer Geschichte", rsvpTitle: "Seid ihr dabei?", deadline: "Bitte antwortet bis", rsvpNote: "Wir freuen uns, diesen Tag mit euch zu teilen.",
    fullName: "Vor- und Nachname", namePlaceholder: "Vor- und Nachname eingeben", attendance: "Seid ihr dabei?", yes: "Wir sind dabei", yesNote: "Wir feiern mit euch", no: "Nicht dabei", noNote: "Wir senden euch Liebe",
    guests: "Anzahl der Gäste", guestsHint: "Euch selbst eingeschlossen", fewer: "Eine Person weniger", more: "Eine Person mehr", fasting: "Fastet ihr?", fastingYes: "Wir fasten", fastingNo: "Wir fasten nicht",
    guest: "Gast", guestNames: "Namen aller Gäste", submit: "Antwort senden", sending: "Antwort wird gesendet…", thanks: "Von Herzen, danke.", success: "Eure Rückmeldung wurde erfolgreich gesendet.",
    successYes: "Euer Platz ist reserviert. Bis bald!", successNo: "Danke für eure Rückmeldung. Wir senden euch eine große Umarmung!", another: "Weitere Antwort senden",
    closed: "Die Rückmeldung ist geschlossen", closedNote: "Bitte kontaktiert das Brautpaar bei Änderungen oder Fragen.", enterName: "Bitte gebt euren Vor- und Nachnamen ein.", chooseAttendance: "Bitte wählt, ob ihr teilnehmt.",
    invalidGuests: "Bitte wählt zwischen 1 und 10 Personen.", chooseFasting: "Bitte wählt eure Fastenoption.", missingNames: "Bitte gebt für jeden Gast den vollständigen Namen ein.",
    submitError: "Die Antwort wurde nicht gesendet. Bitte versucht es erneut.", missingSlug: "Die Rückmeldung ist gerade nicht verfügbar. Bitte kontaktiert das Brautpaar.", remaining: "Bis zu unserem Für immer", arrived: "Unser Tag ist da.",
    days: "Tage", hours: "Stunden", minutes: "Minuten", seconds: "Sekunden", addCalendar: "Zum Kalender hinzufügen", calendarHint: "Ein Datum. Unzählige Erinnerungen.",
    closing: "Mit Liebe", closingNote: "Die schönsten Erinnerungen schaffen wir gemeinsam.", viewPhoto: "Foto vergrößern", closePhoto: "Foto schließen", palette: "Empfohlene Farben", color: "Farbe", language: "Sprache der Einladung", jumpRsvp: "Zusagen",
  },
};

export function toLumiereCyrillic(value = "") {
  const pairs = { dž: "џ", lj: "љ", nj: "њ", Dž: "Џ", Lj: "Љ", Nj: "Њ", DŽ: "Џ", LJ: "Љ", NJ: "Њ" };
  const latin = "abvgdđežzijk lmnoprstćufhcčšABVGDĐEŽZIJK LMNOPRSTĆUFHCČŠ";
  const cyr = "абвгдђежзијк лмнопрстћуфхцчшАБВГДЂЕЖЗИЈК ЛМНОПРСТЋУФХЦЧШ";
  return String(value).replace(/dž|lj|nj/gi, (part) => pairs[part] || part)
    .split("").map((char) => latin.includes(char) ? cyr[latin.indexOf(char)] : char).join("");
}

export function lumiereText(language = "sr", script = "latin") {
  const t = COPY[language] || COPY.sr;
  return language !== "en" && language !== "de" && script === "cyrillic"
    ? Object.fromEntries(Object.entries(t).map(([key, value]) => [key, toLumiereCyrillic(value)])) : t;
}

export function lumiereNameScale(name, budget = 6.8) {
  const longestWord = Math.max(1, ...String(name || "").trim().split(/\s+/).map((word) => Array.from(word).length));
  return Math.min(1, budget / longestWord);
}

export function lumiereDateParts(input, language = "sr", script = "latin") {
  if (!input) return null;
  const raw = String(input).trim();
  let date;
  const numeric = raw.match(/^(\d{1,2})[./]\s*(\d{1,2})[./]\s*(\d{4})\.?$/);
  const named = raw.match(/^(\d{1,2})\.?\s+([^\s.]+)\.?\s+(\d{4})\.?$/);
  const months = [
    ["jan", "januar", "january", "januari", "јан", "јануар"], ["feb", "februar", "february", "феб", "фебруар"],
    ["mar", "mart", "march", "märz", "март", "мар"], ["apr", "april", "апр", "април"], ["maj", "may", "mai", "мај"],
    ["jun", "juni", "june", "јун"], ["jul", "juli", "july", "јул"], ["avg", "avgust", "aug", "august", "авг", "август"],
    ["sep", "sept", "septembar", "september", "сеп", "септембар"], ["okt", "oktobar", "oct", "october", "oktober", "окт", "октобар"],
    ["nov", "novembar", "november", "нов", "новембар"], ["dec", "decembar", "december", "dez", "dezember", "дец", "децембар"],
  ];
  let day, month, year;
  if (numeric) [, day, month, year] = numeric.map(Number);
  else if (named) {
    day = Number(named[1]); year = Number(named[3]);
    month = months.findIndex((names) => names.includes(named[2].toLowerCase())) + 1;
    if (!month) return null;
  }
  if (day !== undefined) {
    date = new Date(Date.UTC(year, month - 1, day, 12));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  } else if (/^\d{4}-\d{2}-\d{2}/.test(raw)) date = new Date(raw);
  else return null;
  if (!Number.isFinite(date.getTime())) return null;
  const locale = language === "en" ? "en-GB" : language === "de" ? "de-DE" : script === "cyrillic" ? "sr-Cyrl-RS" : "sr-Latn-RS";
  const fmt = (options) => new Intl.DateTimeFormat(locale, { timeZone: "Europe/Belgrade", ...options }).format(date);
  return { day: fmt({ day: "2-digit" }), month: fmt({ month: "long" }), monthNumber: fmt({ month: "numeric" }), year: fmt({ year: "numeric" }), weekday: fmt({ weekday: "long" }), numeric: fmt({ day: "2-digit", month: "2-digit", year: "numeric" }) };
}

export function useLumiereReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

export function LumiereIcon({ name = "rings", size = 32, className = "" }) {
  const allowed = ["rings", "church", "glasses", "dinner", "party", "cake", "pin", "dress", "calendar", "heart", "envelope", "sparkle", "camera", "car", "arrow", "monogram-frame"];
  return <img className={`lmv-icon ${className}`} src={`/icons/lumiere-${allowed.includes(name) ? name : "rings"}.svg`} width={size} height={size} alt="" aria-hidden="true" draggable={false} />;
}

export function LumiereReveal({ children, className = "", delay = 0, as: Tag = "div", ...props }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!window.IntersectionObserver || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.06, rootMargin: "0px 0px -16px 0px" });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <Tag ref={ref} className={`lmv-reveal ${visible ? "is-visible" : ""} ${className}`} style={{ "--lmv-delay": `${delay}ms` }} {...props}>{children}</Tag>;
}

export function LumierePhoto({ src, alt = "", className = "", position = "50% 50%", eager = false, parallax = true }) {
  const ref = useRef(null);
  const imgRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const reduced = useLumiereReducedMotion();
  useEffect(() => setFailed(false), [src]);
  useEffect(() => {
    if (!parallax || reduced || !ref.current || !imgRef.current || !window.IntersectionObserver) return;
    let active = false, frame = 0;
    const update = () => {
      frame = 0;
      if (!active || !ref.current || !imgRef.current) return;
      const box = ref.current.getBoundingClientRect();
      const shift = Math.max(-16, Math.min(16, ((window.innerHeight - box.height) / 2 - box.top) * 0.045));
      imgRef.current.style.setProperty("--lmv-photo-shift", `${shift}px`);
    };
    const onScroll = () => { if (active && !frame) frame = window.requestAnimationFrame(update); };
    const observer = new IntersectionObserver(([entry]) => { active = entry.isIntersecting; if (active) onScroll(); }, { rootMargin: "80px" });
    observer.observe(ref.current);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener("scroll", onScroll); window.cancelAnimationFrame(frame); };
  }, [parallax, reduced, src]);
  return <div ref={ref} className={`lmv-photo ${failed ? "is-empty" : ""} ${className}`}>
    {!failed && src ? <img ref={imgRef} src={src} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" style={{ "--lmv-photo-position": position }} onError={() => setFailed(true)} draggable={false} /> : <span className="lmv-photo-fallback" aria-hidden="true"><LumiereIcon name="heart" size={48} /></span>}
  </div>;
}

// Kompatibilnost sa postojećim importima; CSS se učitava iz newintro.css.
export function LumiereStyles() { return null; }

export default function LumiereIntro({ brideName = "", groomName = "", weddingDate = "", backgroundImage, image, image1, details = {}, onEnter, onStartMusic, script = "latin", language = "sr", showLanguageSwitcher, languages = ["sr", "en"], languageLabels = { sr: "SR", en: "EN", de: "DE" }, onLanguageChange }) {
  const [opening, setOpening] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const openingRef = useRef(false);
  const timerRef = useRef(null);
  const reduced = useLumiereReducedMotion();
  const t = lumiereText(language, script);
  const config = details.lumiere || {};
  const hero = config.introImage || config.heroImage || image || image1 || backgroundImage || LUMIERE_ASSETS.hero;
  const date = lumiereDateParts(weddingDate || details.dateISO || details.date, language, script);
  const customInitials = String(config.introMonogram || "").split(/[/&·]/).map((part) => part.trim());
  const initials = customInitials.length === 2 && customInitials.every(Boolean)
    ? customInitials.map((part) => Array.from(part)[0])
    : [brideName, groomName].map((name) => Array.from(String(name || "").trim())[0] || "");
  const kicker = config.introKicker ?? t.chapter;
  useEffect(() => () => window.clearTimeout(timerRef.current), []);
  useEffect(() => setImageFailed(false), [hero]);
  const open = () => {
    if (openingRef.current) return;
    openingRef.current = true;
    onStartMusic?.(); // U istom korisničkom kliku, važno za muziku na telefonu.
    setOpening(true);
    timerRef.current = window.setTimeout(() => onEnter?.(), reduced ? 30 : 1260);
  };
  return <section className={`lmv lmv-intro ${opening ? "is-opening" : ""}`} data-script={script} aria-label={t.invitation} style={{ "--lmv-hero-position": config.introPosition || config.heroPosition || "50% 45%" }}>
    <div className="lmv-intro-behind" aria-hidden="true"><LumiereIcon name="rings" size={48} /><span className="lmv-script">{t.story}</span><span className="lmv-kicker">{t.chapter}</span></div>
    <div className="lmv-cover">
      <div className="lmv-cover-portrait" aria-hidden="true">{!imageFailed && <img src={hero} alt="" fetchPriority="high" decoding="async" onError={() => setImageFailed(true)} />}</div>
      {showLanguageSwitcher && onLanguageChange && <nav className="lmv-intro-languages" aria-label={t.language}>{languages.map((lang) => <button key={lang} type="button" aria-pressed={language === lang} onClick={() => onLanguageChange(lang)}>{languageLabels[lang] || lang.toUpperCase()}</button>)}</nav>}
      <div className="lmv-intro-stage">
        {kicker && <p className="lmv-cover-aside">{kicker}</p>}
        <h1 className="lmv-intro-emblem" aria-label={initials.filter(Boolean).join(" / ")}>
          <LumiereIcon name="monogram-frame" size={340} className="lmv-intro-emblem-frame" />
          <span className="lmv-intro-monogram" aria-hidden="true"><span className="lmv-intro-initial">{initials[0]}</span><span className="lmv-intro-initial">{initials[1]}</span></span>
        </h1>
        <div className="lmv-intro-bottom">
          <p className="lmv-cover-date" aria-label={weddingDate || details.date || details.dateISO}>{date ? <><span>{date.day}</span><span className="lmv-date-separator" aria-hidden="true">/</span><span>{date.month}</span><span className="lmv-date-separator" aria-hidden="true">/</span><span>{date.year}</span></> : <span>{weddingDate || details.date}</span>}</p>
          <button className="lmv-intro-open" type="button" onClick={open} disabled={opening} aria-busy={opening}><span>{opening ? t.opening : t.open}</span></button>
        </div>
      </div>
    </div>
  </section>;
}
