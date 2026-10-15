import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { cherryData, cherryEventDate, CherryCalendarButton, CherryDoodle, CherryLetters, CherryPhoto, CherryReveal, CherryScript } from "./BirthdayCherryIntro";
import "../styles/newcard.css";

function clockState(date) {
  const target = date ? new Date(date).getTime() : NaN;
  if (!Number.isFinite(target)) return { status: "invalid", values: [] };
  const seconds = Math.max(0, Math.ceil((target - Date.now()) / 1000));
  if (!seconds) return { status: "finished", values: [] };
  return { status: "upcoming", values: [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60] };
}

export default function BirthdayCherryCountdown(props) {
  const { details = {}, targetDate, showCalendarButton } = props;
  const data = cherryData(props);
  const c = data.cyrillic;
  const config = details.birthdayGalleryCountdown || {};
  const date = cherryEventDate(targetDate, data.time) || data.dateISO;
  const section = useRef(null);
  const seen = useInView(section, { once: false, amount: 0.02 });
  const reduced = useReducedMotion();
  const uid = useId();
  const [time, setTime] = useState(() => clockState(date));
  const shouldShowCalendar = showCalendarButton ?? config.showCalendarButton ?? details.showCalendarButton ?? false;

  useEffect(() => {
    let timer;
    const update = () => setTime(clockState(date));
    const sync = () => {
      clearInterval(timer);
      update();
      if (seen && !document.hidden) timer = window.setInterval(update, 1000);
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", sync); };
  }, [date, seen]);

  const finished = time.status === "finished";
  const labels = c ? ["ДАНА", "САТИ", "МИНУТА", "СЕКУНДИ"] : ["DANA", "SATI", "MINUTA", "SEKUNDI"];
  return (
    <section ref={section} className="bch bch-countdown bch-section" data-script={c ? "cyrillic" : "latin"} aria-labelledby={`${uid}-title`} style={{ "--bch-name-scale": data.nameScale }}>
      <CherryReveal>
        <CherryDoodle type="cherries" />
        <p className="bch-kicker">{config.kicker || (c ? "ВРЕМЕ ЈЕ ЗА УСПОМЕНЕ" : "VREME JE ZA USPOMENE")}</p>
        <h2 id={`${uid}-title`} className="bch-countdown-title">
          <CherryLetters text={finished
            ? config.finishedTitle || (c ? "ДАН ЈЕ СТИГАО" : "DAN JE STIGAO")
            : config.title || (c ? "ДО НАШЕ ПРОСЛАВЕ" : "DO NAŠE PROSLAVE")} />
          <CherryScript>{finished ? c ? "славимо!" : "slavimo!" : c ? "још мало." : "još malo."}</CherryScript>
        </h2>
      </CherryReveal>

      {time.status === "upcoming" ? (
        <CherryReveal>
          <div className="bch-clock" role="timer" aria-live="off" aria-label={c ? "Преостало време до прославе" : "Preostalo vreme do proslave"}>
            {time.values.map((value, index) => <div className="bch-clock-unit" key={labels[index]}>
              <div className={`bch-clock-window ${String(value).length > 3 ? "bch-clock-window-wide" : ""}`}>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.strong
                    key={value}
                    initial={reduced || !seen ? false : { y: "80%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={reduced || !seen ? { opacity: 0 } : { y: "-80%", opacity: 0 }}
                    transition={{ duration: reduced || !seen ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >{String(value).padStart(2, "0")}</motion.strong>
                </AnimatePresence>
              </div>
              <span>{labels[index]}</span>
            </div>)}
          </div>
        </CherryReveal>
      ) : <p className="bch-countdown-note">{finished
        ? config.finishedText || (c ? "Видимо се на прослави!" : "Vidimo se na proslavi!")
        : c ? "Датум прославе ускоро стиже." : "Datum proslave uskoro stiže."}</p>}

      {shouldShowCalendar && time.status !== "invalid" && <CherryReveal className="bch-calendar">
        <CherryCalendarButton data={data} details={details} dateISO={date} text={config.calendarButtonText} />
        <p>{config.calendarHint || (c ? "Један подсетник. Једно незаборавно вече." : "Jedan podsetnik. Jedno nezaboravno veče.")}</p>
      </CherryReveal>}

      <CherryPhoto className="bch-evening-photo" src={data.evening} position={data.cherry.eveningPosition || "50% 55%"} />
      <footer className="bch-finale"><CherryScript>{data.name}</CherryScript><span>{data.age}. {c ? "РОЂЕНДАН" : "ROĐENDAN"}</span></footer>
    </section>
  );
}
