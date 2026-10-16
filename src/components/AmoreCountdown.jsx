import { useEffect, useRef, useState } from "react";
import "../styles/newcard.css";

// Zajednički elementi su ovde da ceo template ostane u tačno tri JSX fajla.
export const AMORE_HEART_PATH =
  "M83 35C62 5 17 13 17 57c0 31 32 67 64 96 29-35 67-64 67-97 0-31-40-39-65-21M80 153c-6 8-10 15-12 23";

export const AMORE_ICONS = {
  gathering: "/icons/amore-champagne.svg",
  welcome: "/icons/amore-champagne.svg",
  buffet: "/icons/amore-buffet.svg",
  cocktail: "/icons/amore-buffet.svg",
  civil: "/icons/amore-bouquet.svg",
  ceremony: "/icons/amore-bouquet.svg",
  church: "/icons/amore-church.svg",
  dinner: "/icons/amore-cake.svg",
  banquet: "/icons/amore-cake.svg",
  cake: "/icons/amore-cake.svg",
  party: "/icons/amore-champagne.svg",
  rings: "/icons/amore-rings.svg",
};

const CYRILLIC = {
  welcome: "Dragi gosti!|Драги гости!",
  welcomeBody:
    "Sa velikom radošću vas pozivamo da budete deo našeg posebnog dana i zajedno sa nama proslavite početak naše zajedničke priče.|Са великом радошћу вас позивамо да будете део нашег посебног дана и заједно са нама прославите почетак наше заједничке приче.",
  location: "Lokacija|Локација",
  map: "Pogledaj lokaciju|Погледај локацију",
  timing: "Satnica|Сатница",
  calendar: "Sačuvaj datum|Сачувај датум",
  palette:
    "Biće nam drago da svojim izborom garderobe upotpunite paletu našeg dana.|Биће нам драго да својим избором гардеробе употпуните палету нашег дана.",
  details:
    "Najlepši poklon biće nam vaše prisustvo i osmesi koje ćemo pamtiti.|Најлепши поклон биће нам ваше присуство и осмеси које ћемо памтити.",
  waiting: "Jedva čekamo!|Једва чекамо!",
  signature: "Vaši|Ваши",
  countdown: "Do našeg dana|До нашег дана",
  days: "dana|дана",
  hours: "sati|сати",
  minutes: "minuta|минута",
  seconds: "sekundi|секунди",
  today: "Naš dan je stigao!|Наш дан је стигао!",
  rsvp: "Potvrdite dolazak|Потврдите долазак",
  rsvpNote:
    "Javite nam da li ćete biti deo naše proslave.|Јавите нам да ли ћете бити део наше прославе.",
  deadline: "Molimo vas da odgovorite do|Молимо вас да одговорите до",
  fullName: "Ime i prezime|Име и презиме",
  namePlaceholder: "Unesite ime i prezime|Унесите име и презиме",
  attendance: "Da li dolazite?|Да ли долазите?",
  yes: "Dolazim|Долазим",
  no: "Ne dolazim|Не долазим",
  guests: "Broj osoba|Број особа",
  guestsHint: "Uključujući vas.|Укључујући вас.",
  fewer: "Manje osoba|Мање особа",
  more: "Više osoba|Више особа",
  guest: "Gost|Гост",
  guestNames: "Imena i prezimena gostiju|Имена и презимена гостију",
  fasting: "Da li postite?|Да ли постите?",
  fastingYes: "Postim|Постим",
  fastingNo: "Ne postim|Не постим",
  children: "Od toga dece|Од тога деце",
  dietary: "Alergije ili posebna ishrana|Алергије или посебна исхрана",
  message: "Poruka za mladence|Порука за младенце",
  submit: "Pošalji potvrdu|Пошаљи потврду",
  sending: "Slanje…|Слање…",
  thanks: "Hvala!|Хвала!",
  saved: "Vaša potvrda je uspešno poslata.|Ваша потврда је успешно послата.",
  savedYes: "Jedva čekamo da slavimo zajedno.|Једва чекамо да славимо заједно.",
  savedNo: "Hvala što ste nas obavestili.|Хвала што сте нас обавестили.",
  another: "Pošalji još jednu potvrdu|Пошаљи још једну потврду",
  closed: "Potvrde dolaska su zatvorene.|Потврде доласка су затворене.",
  closedNote: "Za izmene kontaktirajte mladence.|За измене контактирајте младенце.",
  missingSlug: "Nedostaje oznaka pozivnice.|Недостаје ознака позивнице.",
  enterName: "Unesite ime i prezime.|Унесите име и презиме.",
  chooseAttendance: "Izaberite da li dolazite.|Изаберите да ли долазите.",
  chooseFasting: "Izaberite da li postite.|Изаберите да ли постите.",
  missingNames: "Unesite ime i prezime svake osobe.|Унесите име и презиме сваке особе.",
  invalidGuests: "Proverite broj osoba.|Проверите број особа.",
  invalidChildren:
    "Broj dece mora biti manji od ukupnog broja osoba.|Број деце мора бити мањи од укупног броја особа.",
  submitError:
    "Potvrda nije poslata. Pokušajte ponovo.|Потврда није послата. Покушајте поново.",
  offline:
    "Nema internet veze. Povežite se i pokušajte ponovo.|Нема интернет везе. Повежите се и покушајте поново.",
};

export function amoreText(script = "latin") {
  return Object.fromEntries(
    Object.entries(CYRILLIC).map(([key, value]) => [
      key,
      value.split("|")[script === "cyrillic" ? 1 : 0],
    ])
  );
}

export function AmoreReveal({ as: Tag = "div", children, className = "", delay = 0, style, innerRef, ...props }) {
  return (
    <Tag
      {...props}
      ref={innerRef}
      className={`amr-reveal ${className}`}
      data-amr-reveal=""
      style={{ "--amr-delay": `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  );
}

// Reči se prelamaju normalno; slova unutar reči se pojavljuju pojedinačno.
// Čitač ekrana dobija celu rečenicu, bez čitanja slovo po slovo.
export function AmoreText({ as: Tag = "h2", text = "", className = "", delay = 0, ...props }) {
  const plain = String(text);
  // Pisani font ostaje neprekinut radi spojenih slova; otkriva se kao potez mastila.
  if (className.split(/\s+/).some((name) => name === "amr-script" || name === "amr-hero-note")) {
    return <Tag {...props} className={`amr-letter-reveal ${className}`} data-amr-reveal=""
      data-amr-kind="script" style={{ "--amr-delay": `${delay}ms` }}><span className="amr-ink">{plain}</span></Tag>;
  }
  let index = 0;
  return (
    <Tag {...props} className={`amr-letter-reveal ${className}`} data-amr-reveal=""
      aria-label={plain} style={{ "--amr-delay": `${delay}ms` }}>
      <span aria-hidden="true">
        {plain.split(/(\s+)/).map((word, wordIndex) => /^\s+$/.test(word) ? " " : (
          <span className="amr-word" key={wordIndex}>
            {Array.from(word).map((letter) => (
              <span className="amr-letter" key={index} style={{ "--amr-i": index++ }}>{letter}</span>
            ))}
          </span>
        ))}
      </span>
    </Tag>
  );
}

export function AmoreIcon({ name = "rings", className = "" }) {
  return <img className={`amr-illustration ${className}`} src={AMORE_ICONS[name] || AMORE_ICONS.rings}
    alt="" aria-hidden="true" width="96" height="110" loading="lazy" decoding="async" draggable={false} />;
}

export function useAmoreMotion(rootRef, active = true) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const revealAll = () => {
      root.dataset.amrMotion = "reduced";
      root.querySelectorAll("[data-amr-reveal]").forEach((node) => node.classList.add("amr-is-visible"));
    };
    if (!window.IntersectionObserver || preference.matches) {
      revealAll();
      return undefined;
    }
    root.dataset.amrMotion = "on";
    if (!active) return undefined;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("amr-is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: "0px 0px 100px 0px" });
    const targets = Array.from(root.querySelectorAll("[data-amr-reveal]"));
    // Prvi kadar ne čeka asinhroni callback observera. Merenja su grupisana pre izmena.
    const nearViewport = new Set(targets.filter((node) => {
      const bounds = node.getBoundingClientRect();
      return bounds.bottom > 0 && bounds.top < window.innerHeight + 100;
    }));
    targets.forEach((node) => {
      if (nearViewport.has(node)) node.classList.add("amr-is-visible");
      else if (!node.classList.contains("amr-is-visible")) observer.observe(node);
    });

    const loops = new IntersectionObserver((entries) => entries.forEach((entry) => {
      entry.target.classList.toggle("amr-loop-in-view", entry.isIntersecting);
    }));
    root.querySelectorAll(".amr-date-tapes, .amr-details-wall").forEach((node) => loops.observe(node));

    let frame = 0;
    const photos = Array.from(root.querySelectorAll("[data-amr-parallax]"));
    const draw = () => {
      photos.forEach((photo) => {
        const bounds = photo.parentElement.getBoundingClientRect();
        if (bounds.bottom > 0 && bounds.top < window.innerHeight) {
          const progress = (window.innerHeight / 2 - bounds.top - bounds.height / 2) / window.innerHeight;
          photo.style.setProperty("--amr-photo-y", `${Math.max(-9, Math.min(9, progress * 14))}px`);
        }
      });
      frame = 0;
    };
    const scroll = () => { if (!preference.matches && !frame) frame = requestAnimationFrame(draw); };
    const onPreference = () => { if (preference.matches) revealAll(); };
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll, { passive: true });
    preference.addEventListener?.("change", onPreference);
    scroll();
    return () => {
      observer.disconnect();
      loops.disconnect();
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", scroll);
      preference.removeEventListener?.("change", onPreference);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [rootRef, active]);
}

export function getAmoreCountdown(dateISO, now = Date.now()) {
  if (!dateISO) return null;
  const target = new Date(dateISO).getTime();
  if (!Number.isFinite(target)) return null;
  const total = Math.max(0, Math.ceil((target - now) / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    done: target <= now,
  };
}

export function getAmoreDate(dateISO, script = "latin") {
  if (!dateISO) return null;
  const date = new Date(dateISO);
  if (!Number.isFinite(date.getTime())) return null;
  const locale = script === "cyrillic" ? "sr-Cyrl-RS" : "sr-Latn-RS";
  const formatter = new Intl.DateTimeFormat(locale, {
    timeZone: "Europe/Belgrade", year: "numeric", month: "numeric", day: "numeric",
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));
  // Računanje prethodnog/sledećeg dana u UTC-u sprečava probleme na promeni vremena.
  const midday = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), 12);
  const week = [-1, 0, 1].map((offset) => {
    const day = new Date(midday + offset * 86400000);
    return {
      day: day.getUTCDate(),
      month: new Intl.DateTimeFormat(locale, { timeZone: "UTC", month: "short" }).format(day).replace(/\.$/, ""),
      weekday: new Intl.DateTimeFormat(locale, { timeZone: "UTC", weekday: "long" }).format(day),
      key: day.toISOString().slice(0, 10),
      selected: offset === 0,
    };
  });
  return {
    date, week,
    label: new Intl.DateTimeFormat(locale, {
      timeZone: "Europe/Belgrade", day: "numeric", month: "long", year: "numeric",
    }).format(date),
  };
}

export function amoreCalendarURL({ dateISO, duration = 8, names, venue, description = "" }) {
  const start = new Date(dateISO);
  if (!dateISO || !Number.isFinite(start.getTime())) return "";
  const hours = Number.isFinite(Number(duration)) && Number(duration) > 0 ? Number(duration) : 8;
  const end = new Date(start.getTime() + hours * 3600000);
  const utc = (value) => value.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  return "https://calendar.google.com/calendar/render?" + new URLSearchParams({
    action: "TEMPLATE", text: names, dates: `${utc(start)}/${utc(end)}`,
    location: venue || "", details: description,
  }).toString();
}

export default function AmoreCountdown({ dateISO, details = {}, script = "latin" }) {
  const target = dateISO || details.dateISO;
  const root = useRef(null);
  const [remaining, setRemaining] = useState(() => getAmoreCountdown(target));
  const hasRemaining = remaining !== null;
  const t = amoreText(script);

  useEffect(() => {
    let timer;
    let nearViewport = !window.IntersectionObserver;
    const tick = () => {
      const next = getAmoreCountdown(target);
      setRemaining(next);
      if (!next || next.done) clearInterval(timer);
    };
    const sync = () => {
      clearInterval(timer);
      if (document.hidden || !nearViewport) return;
      tick();
      if (getAmoreCountdown(target)?.done === false) timer = setInterval(tick, 1000);
    };
    tick();
    const observer = window.IntersectionObserver ? new IntersectionObserver(([entry]) => {
      nearViewport = entry.isIntersecting;
      sync();
    }, { rootMargin: "160px 0px", threshold: 0 }) : null;
    if (root.current) observer?.observe(root.current);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => { clearInterval(timer); observer?.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, [target, hasRemaining]);

  if (!remaining) return null;
  return (
    <AmoreReveal as="section" innerRef={root} className="amr-countdown" aria-label={t.countdown}>
      <AmoreText as="h2" text={t.countdown} className="amr-script amr-countdown-title" />
      {remaining.done ? <p className="amr-countdown-done" role="status">{t.today}</p> : (
        <div className="amr-countdown-grid" role="timer" aria-live="off">
          {["days", "hours", "minutes", "seconds"].map((unit) => (
            <div className="amr-countdown-unit" key={unit}>
              <span className="amr-countdown-number" key={remaining[unit]}>{String(remaining[unit]).padStart(2, "0")}</span>
              <span className="amr-countdown-label">{t[unit]}</span>
            </div>
          ))}
        </div>
      )}
    </AmoreReveal>
  );
}
