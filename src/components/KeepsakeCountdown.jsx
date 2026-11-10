import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { addToCalendar } from "../utils/calendar";
import "../styles/newrsvp.css";

// Shared copy and small presentation helpers live here so the template has
// exactly four JSX files. These helpers do not change any application globals.
const SR = {
  invited: "POZVANI STE NA", heroTitle: ["Wedding", "Day"],
  open: "Pogledaj pozivnicu", opening: "Otvaranje…", littleNote: "od malih nogu\ndo velikog dana",
  dear: "DRAGI GOSTI!", date: "Naš datum", plan: "PLAN DANA", planScript: "našeg",
  place: "MESTO\nPROSLAVE", map: "Pogledaj lokaciju", dressCode: "DRES KOD", dressScript: "malo inspiracije",
  women: "Za dame", men: "Za muškarce", palette: "Paleta boja", wishes: "MALE ŽELJE", wishesScript: "od srca",
  remaining: "DO VENČANJA JE OSTALO", arrived: "NAŠ DAN JE STIGAO!", invalidDate: "Datum uskoro stiže.",
  days: "dana", hours: "sati", minutes: "minuta", seconds: "sekundi", calendar: "Sačuvaj datum",
  calendarError: "Kalendar trenutno nije dostupan. Pokušajte ponovo.",
  rsvp: "ANKETA GOSTIJU", rsvpScript: "Vidimo se?", rsvpText: "Vaš odgovor nam pomaže da pripremimo jedan divan dan.",
  deadline: "Molimo vas da odgovorite do", fullName: "Ime i prezime", namePlaceholder: "Vaše ime i prezime",
  attendance: "Da li dolazite?", yes: "Dolazim, jedva čekam!", no: "Nažalost, ne mogu da dođem",
  guests: "Broj osoba, uključujući vas", less: "Smanji broj osoba", more: "Povećaj broj osoba",
  fasting: "Da li postite?", fastingYes: "Postim", fastingNo: "Ne postim", note: "Poruka za nas", optional: "opciono",
  notePlaceholder: "Želja, pesma za ples ili mala napomena…", submit: "Pošalji odgovor", sending: "Slanje…",
  thanks: "Hvala od srca!", success: "Vaš odgovor je uspešno sačuvan.", successYes: "Radujemo se što ćemo slaviti zajedno!",
  successNo: "Hvala što ste nam javili. Nazdravićemo i za vas!", closed: "Potvrde dolaska su zatvorene.",
  missingSlug: "Nedostaju podaci o događaju. Osvežite stranicu i pokušajte ponovo.", enterName: "Unesite ime i prezime.",
  chooseAttendance: "Izaberite da li dolazite.", invalidGuests: "Broj osoba mora biti ceo broj od 1 do 10.",
  chooseFasting: "Izaberite da li postite.", submitError: "Odgovor nije poslat. Pokušajte ponovo.",
  namesTitle: "Imena gostiju", guestLabel: "Gost", missingGuestNames: "Unesite ime i prezime za svaku osobu.",
  forever: "I tako počinje naše zauvek.", photoBefore: "nekada", photoAfter: "zauvek", locale: "sr-Latn-RS",
};
const CY = {
  invited: "ПОЗВАНИ СТЕ НА", heroTitle: ["Наше", "венчање"], open: "Погледај позивницу", opening: "Отварање…",
  littleNote: "од малих ногу\nдо великог дана", dear: "ДРАГИ ГОСТИ!", date: "Наш датум", plan: "ПЛАН ДАНА", planScript: "нашег",
  place: "МЕСТО\nПРОСЛАВЕ", map: "Погледај локацију", dressCode: "ДРЕС КОД", dressScript: "мало инспирације",
  women: "За даме", men: "За мушкарце", palette: "Палета боја", wishes: "МАЛЕ ЖЕЉЕ", wishesScript: "од срца",
  remaining: "ДО ВЕНЧАЊА ЈЕ ОСТАЛО", arrived: "НАШ ДАН ЈЕ СТИГАО!", invalidDate: "Датум ускоро стиже.",
  days: "дана", hours: "сати", minutes: "минута", seconds: "секунди", calendar: "Сачувај датум",
  calendarError: "Календар тренутно није доступан. Покушајте поново.",
  rsvp: "АНКЕТА ГОСТИЈУ", rsvpScript: "Видимо се?", rsvpText: "Ваш одговор нам помаже да припремимо један диван дан.",
  deadline: "Молимо вас да одговорите до", fullName: "Име и презиме", namePlaceholder: "Ваше име и презиме",
  attendance: "Да ли долазите?", yes: "Долазим, једва чекам!", no: "Нажалост, не могу да дођем",
  guests: "Број особа, укључујући вас", less: "Смањи број особа", more: "Повећај број особа",
  fasting: "Да ли постите?", fastingYes: "Постим", fastingNo: "Не постим", note: "Порука за нас", optional: "опционо",
  notePlaceholder: "Жеља, песма за плес или мала напомена…", submit: "Пошаљи одговор", sending: "Слање…",
  thanks: "Хвала од срца!", success: "Ваш одговор је успешно сачуван.", successYes: "Радујемо се што ћемо славити заједно!",
  successNo: "Хвала што сте нам јавили. Наздравићемо и за вас!", closed: "Потврде доласка су затворене.",
  missingSlug: "Недостају подаци о догађају. Освежите страницу и покушајте поново.", enterName: "Унесите име и презиме.",
  chooseAttendance: "Изаберите да ли долазите.", invalidGuests: "Број особа мора бити цео број од 1 до 10.",
  chooseFasting: "Изаберите да ли постите.", submitError: "Одговор није послат. Покушајте поново.",
  namesTitle: "Имена гостију", guestLabel: "Гост", missingGuestNames: "Унесите име и презиме за сваку особу.",
  forever: "И тако почиње наше заувек.", photoBefore: "некада", photoAfter: "заувек", locale: "sr-Cyrl-RS",
};
const EN = {
  invited: "YOU ARE INVITED", open: "View invitation", opening: "Opening…", littleNote: "little beginnings\none big day",
  dear: "DEAR GUESTS!", date: "Our date", plan: "THE DAY'S PLAN", planScript: "our", place: "THE\nVENUE", map: "View location",
  dressCode: "DRESS CODE", dressScript: "a little inspiration", women: "For the ladies", men: "For the gentlemen",
  palette: "Color palette", wishes: "LITTLE WISHES", wishesScript: "with love", remaining: "UNTIL OUR WEDDING",
  arrived: "OUR DAY IS HERE!", invalidDate: "Our date is coming soon.", days: "days", hours: "hours", minutes: "minutes", seconds: "seconds",
  calendar: "Save the date", calendarError: "The calendar is unavailable. Please try again.", rsvp: "GUEST RSVP", rsvpScript: "See you there?",
  rsvpText: "Your reply helps us plan a wonderful day.", deadline: "Please reply by", fullName: "Full name", namePlaceholder: "Your full name",
  attendance: "Will you join us?", yes: "Yes, I can't wait!", no: "Sadly, I can't make it", guests: "Number of guests, including you",
  less: "Decrease guest count", more: "Increase guest count", fasting: "Are you fasting?", fastingYes: "Fasting", fastingNo: "Not fasting",
  note: "A note for us", optional: "optional", notePlaceholder: "A wish, a song to dance to, or a little note…",
  submit: "Send reply", sending: "Sending…", thanks: "Thank you!", success: "Your reply has been saved.",
  successYes: "We can't wait to celebrate with you!", successNo: "Thank you for letting us know. We'll raise a glass to you!",
  closed: "RSVPs are now closed.", missingSlug: "Event information is missing. Please refresh and try again.", enterName: "Please enter your full name.",
  chooseAttendance: "Please choose whether you will attend.", invalidGuests: "The guest count must be a whole number from 1 to 10.",
  chooseFasting: "Please choose whether you are fasting.", submitError: "Your reply wasn't sent. Please try again.", namesTitle: "Guest names",
  guestLabel: "Guest", missingGuestNames: "Please enter the full name of every guest.", forever: "And so our forever begins.",
  photoBefore: "back then", photoAfter: "forever", locale: "en-GB",
};
const DE = {
  invited: "IHR SEID EINGELADEN", open: "Einladung ansehen", opening: "Wird geöffnet…", littleNote: "kleine Anfänge\nein großer Tag",
  dear: "LIEBE GÄSTE!", date: "Unser Datum", plan: "TAGESABLAUF", planScript: "unser", place: "DER\nFESTORT", map: "Ort ansehen",
  dressCode: "DRESSCODE", dressScript: "ein wenig Inspiration", women: "Für die Damen", men: "Für die Herren", palette: "Farbpalette",
  wishes: "KLEINE WÜNSCHE", wishesScript: "von Herzen", remaining: "BIS ZU UNSERER HOCHZEIT", arrived: "UNSER TAG IST DA!",
  invalidDate: "Unser Datum folgt bald.", days: "Tage", hours: "Std.", minutes: "Min.", seconds: "Sek.", calendar: "Datum speichern",
  calendarError: "Der Kalender ist nicht verfügbar. Bitte versucht es erneut.", rsvp: "RÜCKMELDUNG", rsvpScript: "Seid ihr dabei?",
  rsvpText: "Eure Antwort hilft uns, einen wunderschönen Tag zu planen.", deadline: "Bitte antwortet bis zum", fullName: "Vor- und Nachname",
  namePlaceholder: "Euer Vor- und Nachname", attendance: "Seid ihr dabei?", yes: "Ja, wir freuen uns!", no: "Leider können wir nicht kommen",
  guests: "Anzahl der Gäste, einschließlich euch", less: "Gästeanzahl verringern", more: "Gästeanzahl erhöhen", fasting: "Fastet ihr?",
  fastingYes: "Wir fasten", fastingNo: "Wir fasten nicht", note: "Eine Nachricht für uns", optional: "optional",
  notePlaceholder: "Ein Wunsch, ein Lied zum Tanzen oder eine kleine Nachricht…", submit: "Antwort senden", sending: "Wird gesendet…",
  thanks: "Vielen Dank!", success: "Eure Antwort wurde gespeichert.", successYes: "Wir freuen uns darauf, mit euch zu feiern!",
  successNo: "Danke für eure Rückmeldung. Wir stoßen auch auf euch an!", closed: "Die Rückmeldefrist ist abgelaufen.",
  missingSlug: "Veranstaltungsdaten fehlen. Bitte ladet die Seite neu.", enterName: "Bitte gebt euren Vor- und Nachnamen ein.",
  chooseAttendance: "Bitte wählt aus, ob ihr teilnehmt.", invalidGuests: "Die Gästeanzahl muss eine ganze Zahl von 1 bis 10 sein.",
  chooseFasting: "Bitte wählt aus, ob ihr fastet.", submitError: "Die Antwort wurde nicht gesendet. Bitte versucht es erneut.",
  namesTitle: "Namen der Gäste", guestLabel: "Gast", missingGuestNames: "Bitte gebt den vollständigen Namen jeder Person ein.",
  forever: "Und so beginnt unser Für immer.", photoBefore: "damals", photoAfter: "für immer", locale: "de-DE",
};

export function keepsakeCopy(script = "latin", language = "sr", overrides = {}) {
  const lang = String(language).toLowerCase().split(/[-_]/)[0];
  const dictionary = lang === "en" ? EN : lang === "de" ? DE : script === "cyrillic" ? CY : {};
  const croatian = lang === "hr" ? {
    remaining: "DO VJENČANJA JE OSTALO", arrived: "NAŠ DAN JE STIGAO!", thanks: "Hvala od srca!",
    successYes: "Veselimo se zajedničkoj proslavi!", locale: "hr-HR",
  } : {};
  return { ...SR, ...dictionary, ...croatian, ...overrides };
}

export function useKeepsakeFonts() {
  useEffect(() => {
    if (document.getElementById("keepsake-fonts")) return;
    const link = document.createElement("link");
    link.id = "keepsake-fonts";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Italianno&family=Manrope:wght@400;500;600;700&family=Marck+Script&display=swap";
    document.head.appendChild(link);
  }, []);
}

// Read the written calendar date from the ISO prefix, rather than shifting it
// to the phone's timezone. The countdown itself uses the complete timestamp.
export function keepsakeDate(dateISO) {
  const match = String(dateISO || "").match(/^(\d{4})-(\d{2})-(\d{2})(?:T|$)/);
  if (!match) return null;
  const [, y, m, d] = match.map(Number);
  const value = new Date(Date.UTC(y, m - 1, d));
  if (value.getUTCFullYear() !== y || value.getUTCMonth() !== m - 1 || value.getUTCDate() !== d) return null;
  return { year: y, month: m, day: d, value, numeric: `${String(d).padStart(2, "0")}.${String(m).padStart(2, "0")}.${y}.` };
}

export function keepsakeTimeLeft(dateISO, now = Date.now()) {
  const timestamp = Date.parse(dateISO || "");
  if (!Number.isFinite(timestamp)) return { status: "invalid", days: 0, hours: 0, minutes: 0, seconds: 0 };
  const total = Math.max(0, Math.ceil((timestamp - now) / 1000));
  return {
    status: total > 0 ? "future" : "arrived",
    days: Math.floor(total / 86400), hours: Math.floor(total / 3600) % 24,
    minutes: Math.floor(total / 60) % 60, seconds: total % 60,
  };
}

export function KeepsakeReveal({ children, className = "", delay = 0, ...props }) {
  const reduced = useReducedMotion();
  return (
    <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12, margin: "0px 0px -16px 0px" }}
      transition={{ duration: reduced ? 0 : 0.72, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }} {...props}>
      {children}
    </motion.div>
  );
}

export function KeepsakeHeart({ className = "", ...props }) {
  return <svg className={className} viewBox="0 0 54 52" fill="none" aria-hidden="true" {...props}>
    <path d="M27 46C20 39 3 26 5 14 7 1 22 5 27 15 34-2 50 1 49 16 48 28 33 42 27 46Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11 17C10 9 21 10 24 18M31 22C36 9 47 6 43 19" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
  </svg>;
}

export default function KeepsakeCountdown({ targetDate, brideName, groomName, details = {}, script = "latin", language = "sr", embedded = false, venue }) {
  useKeepsakeFonts();
  const config = details.keepsake || {};
  const t = keepsakeCopy(script, language, config.copy);
  const dateISO = targetDate || details.dateISO;
  const [time, setTime] = useState(() => keepsakeTimeLeft(dateISO));
  const [calendarError, setCalendarError] = useState("");
  useEffect(() => {
    const update = () => setTime(keepsakeTimeLeft(dateISO));
    update();
    if (keepsakeTimeLeft(dateISO).status !== "future") return undefined;
    const interval = window.setInterval(() => {
      const next = keepsakeTimeLeft(dateISO);
      setTime(next);
      if (next.status !== "future") window.clearInterval(interval);
    }, 1000);
    document.addEventListener("visibilitychange", update);
    return () => { window.clearInterval(interval); document.removeEventListener("visibilitychange", update); };
  }, [dateISO]);
  async function saveDate() {
    setCalendarError("");
    try {
      // Keep using the application's existing calendar utility.
      await addToCalendar({ brideName, groomName, dateISO,
        venue: details.venue || details.locationName || venue,
        mapLink: details.mapLink || details.locationButtonLink, note: details.note,
        durationHours: details.calendarDurationHours, language });
    } catch { setCalendarError(t.calendarError); }
  }
  const title = time.status === "arrived" ? t.arrived : time.status === "invalid" ? t.invalidDate : t.remaining;
  return <section className={`keepsake-countdown${embedded ? " keepsake-countdown--embedded" : ""}`} data-script={script}>
    <KeepsakeReveal className="keepsake-countdown-inner">
      <h2 className="keepsake-countdown-title">{title}</h2>
      {time.status !== "invalid" && <div className="keepsake-countdown-digits" role="timer" aria-live="off">
        {["days", "hours", "minutes", "seconds"].map((unit) => <div key={unit} className="keepsake-countdown-unit">
          <span className="keepsake-countdown-number">{String(time[unit]).padStart(2, "0")}</span><span className="keepsake-countdown-label">{t[unit]}</span>
        </div>)}
      </div>}
      {config.countdownNote && <p className="keepsake-countdown-note">{config.countdownNote}</p>}
      {details.showCalendarButton === true && time.status !== "invalid" && <button type="button" className="keepsake-countdown-calendar" onClick={saveDate}>
        <img src="/icons/keepsake-calendar.svg" width="22" height="22" alt="" />{t.calendar}
      </button>}
      {calendarError && <p className="keepsake-countdown-error" role="alert">{calendarError}</p>}
    </KeepsakeReveal>
  </section>;
}
