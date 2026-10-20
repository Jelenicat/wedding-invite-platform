import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { addToCalendar } from "../utils/calendar";

const EASE = [0.22, 1, 0.36, 1];
export const NewlywedTimesAnimationContext = createContext(true);
export function newlywedTimesCopy(language = "sr", script = "latin") {
  if (language === "en")
    return {
      special: "Special wedding edition",
      edition: "A love worth printing",
      invite: "You are invited to celebrate our wedding",
      open: "View invitation",
      story: "THE JOURNEY OF LOVE",
      storySmall: "A story to remember",
      guests: "Dear guests",
      storyTitle: "Our next chapter",
      storyText:
        "Some moments deserve a place on the front page. Our wedding is one of them, and we would love to share it with you.",
      quote:
        "The best part of our story is sharing it with the people we love.",
      program: "THE ORDER OF THE DAY",
      programSmall: "Three moments. One unforgettable day.",
      details: "TWO SOULS. ONE DESTINY.",
      detailsSmall: "The wedding day",
      location: "The celebration",
      map: "View location",
      dress: "Style notes",
      women: "For her",
      men: "For him",
      love: "With love",
      countdown: "UNTIL OUR WEDDING",
      past: "OUR DAY IS HERE",
      days: "days",
      hours: "hours",
      minutes: "min",
      seconds: "sec",
      calendar: "Save the date",
      storyPage: "The love story",
      detailsPage: "Your invitation",
      next: "The story continues",
      rsvpPage: "Kindly reply",
      month: "The date",
      issue: "Issue 01",
    };
  if (language === "de")
    return {
      special: "Besondere Hochzeitsausgabe",
      edition: "Eine Liebe für die Titelseite",
      invite: "Wir laden euch zu unserer Hochzeit ein",
      open: "Einladung ansehen",
      story: "UNSERE LIEBESGESCHICHTE",
      storySmall: "Eine Geschichte für immer",
      guests: "Liebe Gäste",
      storyTitle: "Unser nächstes Kapitel",
      storyText:
        "Manche Momente gehören auf die Titelseite. Unsere Hochzeit ist einer davon und wir möchten sie mit euch teilen.",
      quote:
        "Am schönsten ist unsere Geschichte mit den Menschen, die wir lieben.",
      program: "UNSER TAGESABLAUF",
      programSmall: "Drei Momente. Ein unvergesslicher Tag.",
      details: "ZWEI HERZEN. EIN WEG.",
      detailsSmall: "Unser Hochzeitstag",
      location: "Die Feier",
      map: "Ort ansehen",
      dress: "Kleine Stilnotizen",
      women: "Für sie",
      men: "Für ihn",
      love: "In Liebe",
      countdown: "BIS ZU UNSERER HOCHZEIT",
      past: "UNSER TAG IST DA",
      days: "Tage",
      hours: "Std.",
      minutes: "Min.",
      seconds: "Sek.",
      calendar: "Datum speichern",
      storyPage: "Die Liebesgeschichte",
      detailsPage: "Eure Einladung",
      next: "Die Geschichte geht weiter",
      rsvpPage: "Eure Rückmeldung",
      month: "Das Datum",
      issue: "Ausgabe 01",
    };
  if (script === "cyrillic")
    return {
      special: "Специјално свадбено издање",
      edition: "Једна љубав, вредна насловне стране",
      invite: "Позивамо вас да прославимо наше венчање",
      open: "Погледај позивницу",
      story: "ЈЕДНА ЉУБАВНА ПРИЧА",
      storySmall: "Од првог сусрета",
      guests: "Драги наши",
      storyTitle: "Наш најлепши наставак",
      storyText:
        "Постоје тренуци који заслужују насловну страну. Наше венчање је један од њих, а ви сте људи са којима желимо да га поделимо.",
      quote: "Најлепши део наше приче је што је делимо са људима које волимо.",
      program: "РАСПОРЕД НАШЕГ ДАНА",
      programSmall: "Од првог сусрета до последњег плеса.",
      details: "ДВА СРЦА. ЈЕДНА ПРИЧА.",
      detailsSmall: "Дан нашег венчања",
      location: "Место прославе",
      map: "Погледај локацију",
      dress: "Мали водич за госте",
      women: "За даме",
      men: "За господу",
      love: "С љубављу",
      countdown: "ДО НАШЕГ ВЕНЧАЊА",
      past: "НАШ ДАН ЈЕ СТИГАО",
      days: "дана",
      hours: "сати",
      minutes: "мин",
      seconds: "сек",
      calendar: "Сачувај датум",
      storyPage: "Љубавна хроника",
      detailsPage: "Ваша позивница",
      next: "Прича се наставља",
      rsvpPage: "Ваш одговор",
      month: "Датум који чувамо",
      issue: "Број 01",
    };
  return {
    special: "Specijalno svadbeno izdanje",
    edition: "Jedna ljubav, vredna naslovne strane",
    invite: "Pozivamo vas da proslavimo naše venčanje",
    open: "Pogledaj pozivnicu",
    story: "JEDNA LJUBAVNA PRIČA",
    storySmall: "Od prvog susreta",
    guests: "Dragi naši",
    storyTitle: "Naš najlepši nastavak",
    storyText:
      "Postoje trenuci koji zaslužuju naslovnu stranu. Naše venčanje je jedan od njih, a vi ste ljudi sa kojima želimo da ga podelimo.",
    quote: "Najlepši deo naše priče je što je delimo sa ljudima koje volimo.",
    program: "RASPORED NAŠEG DANA",
    programSmall: "Od prvog susreta do poslednjeg plesa.",
    details: "DVA SRCA. JEDNA PRIČA.",
    detailsSmall: "Dan našeg venčanja",
    location: "Mesto proslave",
    map: "Pogledaj lokaciju",
    dress: "Mali vodič za goste",
    women: "Za dame",
    men: "Za gospodu",
    love: "S ljubavlju",
    countdown: "DO NAŠEG VENČANJA",
    past: "NAŠ DAN JE STIGAO",
    days: "dana",
    hours: "sati",
    minutes: "min",
    seconds: "sek",
    calendar: "Sačuvaj datum",
    storyPage: "Ljubavna hronika",
    detailsPage: "Vaša pozivnica",
    next: "Priča se nastavlja",
    rsvpPage: "Vaš odgovor",
    month: "Datum koji čuvamo",
    issue: "Broj 01",
  };
}
export function newlywedTimesDate(dateISO, language = "sr", script = "latin") {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateISO || "");
  if (!match) return null;
  const [y, m, d] = match.slice(1).map(Number),
    date = new Date(Date.UTC(y, m - 1, d));
  if (
    date.getUTCFullYear() !== y ||
    date.getUTCMonth() !== m - 1 ||
    date.getUTCDate() !== d
  )
    return null;
  const locale =
    language === "de"
      ? "de"
      : language === "en"
        ? "en-GB"
        : script === "cyrillic"
          ? "sr-Cyrl"
          : "sr-Latn";
  return {
    y,
    m,
    d,
    date,
    iso: match[0],
    label: new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(date),
    month: new Intl.DateTimeFormat(locale, {
      month: "long",
      timeZone: "UTC",
    }).format(date),
  };
}
export function NewlywedTimesReveal({
  children,
  className = "",
  delay = 0,
  ...props
}) {
  const reduced = useReducedMotion(),
    ready = useContext(NewlywedTimesAnimationContext);
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 19 }}
      whileInView={ready ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: reduced ? 0 : 0.85,
        delay: reduced ? 0 : delay,
        ease: EASE,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
export function NewlywedTimesText({
  children,
  as = "h2",
  className = "",
  letters = false,
  scriptText = false,
  delay = 0,
}) {
  const Tag = motion[as],
    reduced = useReducedMotion(),
    ready = useContext(NewlywedTimesAnimationContext),
    value = String(children ?? "");
  return (
    <Tag
      className={`nwt-text ${scriptText ? "nwt-script" : ""} ${className}`}
      aria-label={value}
      initial={reduced ? false : "hidden"}
      whileInView={ready ? "visible" : undefined}
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        visible: {
          transition: {
            staggerChildren: letters ? 0.032 : 0.085,
            delayChildren: delay,
          },
        },
      }}
    >
      {scriptText ? (
        <motion.span
          className="nwt-script-ink"
          aria-hidden="true"
          variants={{
            hidden: { opacity: 0, clipPath: "inset(0 110% 0 -15%)" },
            visible: { opacity: 1, clipPath: "inset(0 -25% 0 -15%)" },
          }}
          transition={{ duration: reduced ? 0 : 1.25, ease: EASE }}
        >
          {value}
        </motion.span>
      ) : (
        <span aria-hidden="true">
          {value.split(/(\s+)/).map((word, i) =>
            /^\s+$/.test(word) ? (
              " "
            ) : (
              <span className="nwt-word" key={i}>
                {(letters ? Array.from(word) : [word]).map((part, j) => (
                  <motion.span
                    className="nwt-word-ink"
                    key={j}
                    variants={{
                      hidden: { opacity: 0, y: 9 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: reduced ? 0 : 0.65, ease: EASE }}
                  >
                    {part}
                  </motion.span>
                ))}
              </span>
            ),
          )}
        </span>
      )}
    </Tag>
  );
}
export function NewlywedTimesRule({ className = "" }) {
  const reduced = useReducedMotion(),
    ready = useContext(NewlywedTimesAnimationContext);
  return (
    <svg
      className={`nwt-ink-rule ${className}`}
      viewBox="0 0 400 9"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <motion.path
        d="M0 4.5H400"
        fill="none"
        stroke="currentColor"
        strokeWidth=".8"
        initial={reduced ? false : { pathLength: 0 }}
        whileInView={ready ? { pathLength: 1 } : undefined}
        viewport={{ once: true }}
        transition={{ duration: reduced ? 0 : 1.3, ease: EASE }}
      />
    </svg>
  );
}
export function NewlywedTimesFolio({
  date,
  city,
  page,
  label = "NEWLYWED TIMES",
}) {
  return (
    <div className="nwt-folio">
      <span>{city}</span>
      <span>{label}</span>
      <span>{page ? `${String(page).padStart(2, "0")} / 04` : date}</span>
    </div>
  );
}
export function NewlywedTimesPhoto({
  src,
  className = "",
  alt = "Mladenci",
  position = "50% 0%",
  eager = false,
}) {
  const ref = useRef(null),
    reduced = useReducedMotion(),
    ready = useContext(NewlywedTimesAnimationContext);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-4, 4]);
  return (
    <motion.figure
      ref={ref}
      className={`nwt-photo ${className}`}
      initial={reduced || eager ? false : "hidden"}
      whileInView={ready || eager ? "visible" : undefined}
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0 },
      }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduced ? 0 : 0.8, ease: EASE }}
    >
      <motion.img
        src={src}
        alt={alt}
        width="1024"
        height="1536"
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        style={{ objectPosition: position, y: reduced ? 0 : y }}
        variants={{
          hidden: { clipPath: "inset(0 0 100% 0)", scale: 1.065 },
          visible: { clipPath: "inset(0 0 0% 0)", scale: 1.045 },
        }}
        transition={{ duration: reduced ? 0 : 1.25, ease: EASE }}
      />
    </motion.figure>
  );
}
export function NewlywedTimesNames({
  brideName = "Ana",
  groomName = "Nikola",
}) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0,
      disposed = false,
      last = 0;
    const canvas = document.createElement("canvas"),
      ctx = canvas.getContext("2d");
    function fit() {
      if (disposed || !ctx) return;
      const sample = el.querySelector(".nwt-name");
      if (!sample) return;
      const c = getComputedStyle(sample),
        scale = Number(el.style.getPropertyValue("--nwt-name-scale")) || 1;
      ctx.font = `400 ${parseFloat(c.fontSize) / scale}px ${c.fontFamily}`;
      const w = Math.max(
        ...[brideName, groomName].map((n) => {
          const m = ctx.measureText(String(n).toUpperCase());
          return Math.max(
            m.width,
            Math.abs(m.actualBoundingBoxLeft || 0) +
              Math.abs(m.actualBoundingBoxRight || 0),
          );
        }),
      );
      el.style.setProperty(
        "--nwt-name-scale",
        String(Math.min(1, (el.clientWidth - 22) / Math.max(1, w))),
      );
    }
    function schedule() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fit);
    }
    fit();
    document.fonts?.ready.then(schedule);
    const ro =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver((e) => {
            const w = e[0]?.contentRect.width || 0;
            if (Math.abs(w - last) > 0.5) {
              last = w;
              schedule();
            }
          });
    ro?.observe(el);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      ro?.disconnect();
    };
  }, [brideName, groomName]);
  return (
    <h1
      ref={ref}
      className="nwt-names"
      aria-label={`${brideName} & ${groomName}`}
    >
      <NewlywedTimesText as="span" letters className="nwt-name">
        {brideName}
      </NewlywedTimesText>
      <span className="nwt-name-and" aria-hidden="true">
        &amp;
      </span>
      <NewlywedTimesText as="span" letters className="nwt-name">
        {groomName}
      </NewlywedTimesText>
    </h1>
  );
}
export function NewlywedTimesCalendar({
  dateISO,
  language = "sr",
  script = "latin",
}) {
  const reduced = useReducedMotion(),
    ready = useContext(NewlywedTimesAnimationContext),
    parts = newlywedTimesDate(dateISO, language, script);
  if (!parts) return null;
  const { y, m, d, month } = parts,
    start = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7,
    days = new Date(Date.UTC(y, m, 0)).getUTCDate(),
    cells = Array.from({ length: Math.ceil((start + days) / 7) * 7 }, (_, i) =>
      i >= start && i < start + days ? i - start + 1 : null,
    );
  const week =
    language === "en"
      ? ["M", "T", "W", "T", "F", "S", "S"]
      : language === "de"
        ? ["M", "D", "M", "D", "F", "S", "S"]
        : script === "cyrillic"
          ? ["П", "У", "С", "Ч", "П", "С", "Н"]
          : ["P", "U", "S", "Č", "P", "S", "N"];
  return (
    <NewlywedTimesReveal className="nwt-calendar-wrap">
      <table className="nwt-month-calendar">
        <caption>
          {month} <span>{y}</span>
        </caption>
        <thead>
          <tr>
            {week.map((v, i) => (
              <th key={i} scope="col">
                {v}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: cells.length / 7 }, (_, r) => (
            <tr key={r}>
              {cells.slice(r * 7, r * 7 + 7).map((day, i) => (
                <td key={i} className={day === d ? "nwt-wedding-day" : ""}>
                  {day && (
                    <time
                      dateTime={`${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`}
                    >
                      {day}
                    </time>
                  )}
                  {day === d && (
                    <svg viewBox="0 0 64 64" aria-hidden="true">
                      <motion.path
                        d="M32 54C25 48 7 37 7 23C7 10 24 7 32 20C40 7 57 10 57 24C57 37 40 48 32 54Z"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        fill="none"
                        initial={reduced ? false : { pathLength: 0 }}
                        whileInView={ready ? { pathLength: 1 } : undefined}
                        viewport={{ once: true }}
                        transition={{ duration: reduced ? 0 : 1.5 }}
                      />
                    </svg>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </NewlywedTimesReveal>
  );
}
function getTime(target) {
  const stamp = new Date(target).getTime();
  if (!Number.isFinite(stamp)) return null;
  const difference = Math.max(0, stamp - Date.now());
  return {
    difference,
    days: Math.floor(difference / 86400000),
    hours: Math.floor(difference / 3600000) % 24,
    minutes: Math.floor(difference / 60000) % 60,
    seconds: Math.floor(difference / 1000) % 60,
  };
}
export default function NewlywedTimesCountdown({
  targetDate,
  brideName,
  groomName,
  details = {},
  language = "sr",
  script = "latin",
}) {
  const [time, setTime] = useState(() => getTime(targetDate)),
    reduced = useReducedMotion(),
    t = newlywedTimesCopy(language, script);
  useEffect(() => {
    setTime(getTime(targetDate));
    const initial = getTime(targetDate);
    if (!initial || !initial.difference) return;
    const id = setInterval(() => {
      const next = getTime(targetDate);
      setTime(next);
      if (!next?.difference) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  if (!time) return null;
  return (
    <NewlywedTimesReveal className="nwt-countdown">
      <p className="nwt-kicker">
        {time.difference === 0 ? t.past : t.countdown}
      </p>
      <div className="nwt-countdown-grid" role="timer" aria-live="off">
        {["days", "hours", "minutes", "seconds"].map((key) => (
          <div className="nwt-countdown-unit" key={key}>
            <div className="nwt-countdown-number">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  key={time[key]}
                  initial={reduced ? false : { opacity: 0, y: 9 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -9 }}
                  transition={{ duration: reduced ? 0 : 0.25 }}
                >
                  {String(time[key]).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
            </div>
            <span>{t[key]}</span>
          </div>
        ))}
      </div>
      {details.showCalendarButton === true && (
        <button
          type="button"
          className="nwt-button nwt-calendar-button"
          onClick={() =>
            addToCalendar({
              brideName,
              groomName,
              dateISO: targetDate,
              venue: details.venue || details.locationName,
              mapLink: details.mapLink || details.locationButtonLink,
              note: details.note,
              durationHours: details.calendarDurationHours,
              language,
            })
          }
        >
          <img
            src="/icons/newlywed-times-calendar.svg"
            width="16"
            height="16"
            alt=""
          />
          {t.calendar}
        </button>
      )}
    </NewlywedTimesReveal>
  );
}
