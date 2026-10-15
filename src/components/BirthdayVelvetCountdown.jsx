import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { addToCalendar } from "../utils/calendar";
import { velvetData, VelvetOrnament, VelvetLetters, VelvetPhoto, VelvetReveal, VelvetScript } from "./BirthdayVelvetIntro";
import "../styles/newcard.css";

function clockState(date) {
  const target = date ? new Date(date).getTime() : NaN;
  if (!Number.isFinite(target)) return { status: "invalid", values: [] };
  const seconds = Math.max(0, Math.ceil((target - Date.now()) / 1000));
  if (!seconds) return { status: "finished", values: [] };
  return { status: "upcoming", values: [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60] };
}

export default function BirthdayVelvetCountdown(props) {
  const { details = {}, targetDate, showCalendarButton } = props;
  const data = velvetData(props);
  const c = data.cyrillic;
  const config = details.birthdayGalleryCountdown || {};
  const date = targetDate || details.dateISO;
  const section = useRef(null);
  const seen = useInView(section, { once: false, amount: 0.02 });
  const reduced = useReducedMotion();
  const uid = useId();
  const [time, setTime] = useState(() => clockState(date));
  const [calendarError, setCalendarError] = useState("");
  const calendarPending = useRef(false);
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

  const handleCalendar = async () => {
    if (calendarPending.current) return;
    calendarPending.current = true;
    setCalendarError("");
    try {
      await addToCalendar({
        brideName: data.name,
        groomName: "",
        dateISO: date,
        venue: data.venue,
        mapLink: details.mapLink,
        note: details.calendarDescription || details.note || (c ? "Видимо се на прослави!" : "Vidimo se na proslavi!"),
        durationHours: details.calendarDurationHours,
        eventType: "birthday",
        age: data.age,
        eventTitle: details.calendarTitle || `${data.name} — ${data.age}. ${c ? "рођендан" : "rođendan"}`,
        language: "sr",
      });
    } catch (error) {
      console.error("BirthdayVelvet calendar:", error);
      setCalendarError(c ? "Календар није отворен. Покушајте поново." : "Kalendar nije otvoren. Pokušajte ponovo.");
    } finally {
      calendarPending.current = false;
    }
  };

  const finished = time.status === "finished";
  const labels = c ? ["ДАНА", "САТИ", "МИНУТА", "СЕКУНДИ"] : ["DANA", "SATI", "MINUTA", "SEKUNDI"];
  return (
    <section ref={section} className="bvs bvs-countdown bvs-section" data-variant={data.variant} data-script={c ? "cyrillic" : "latin"} aria-labelledby={`${uid}-title`} style={{ "--bvs-name-scale": data.nameScale }}>
      <VelvetReveal>
        <VelvetOrnament />
        <p className="bvs-kicker">{config.kicker || (c ? "ВРЕМЕ ЈЕ ЗА УСПОМЕНЕ" : "VREME JE ZA USPOMENE")}</p>
        <h2 id={`${uid}-title`} className="bvs-countdown-title">
          <VelvetLetters text={finished
            ? config.finishedTitle || (c ? "ДАН ЈЕ СТИГАО" : "DAN JE STIGAO")
            : config.title || (c ? "ДО НАШЕ ПРОСЛАВЕ" : "DO NAŠE PROSLAVE")} />
          <VelvetScript>{finished ? c ? "славимо!" : "slavimo!" : c ? "још мало." : "još malo."}</VelvetScript>
        </h2>
      </VelvetReveal>

      {time.status === "upcoming" ? (
        <VelvetReveal>
          <div className="bvs-clock" role="timer" aria-live="off" aria-label={c ? "Преостало време до прославе" : "Preostalo vreme do proslave"}>
            {time.values.map((value, index) => <div className="bvs-clock-unit" key={labels[index]}>
              <div className={`bvs-clock-window ${String(value).length > 3 ? "bvs-clock-window-wide" : ""}`}>
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
        </VelvetReveal>
      ) : <p className="bvs-countdown-note">{finished
        ? config.finishedText || (c ? "Видимо се на прослави!" : "Vidimo se na proslavi!")
        : c ? "Датум прославе ускоро стиже." : "Datum proslave uskoro stiže."}</p>}

      {shouldShowCalendar && time.status !== "invalid" && <VelvetReveal className="bvs-calendar">
        <button className="bvs-button bvs-button-outline" type="button" onClick={handleCalendar}>
          <svg className="bvs-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 3v4m10-4v4M4 10h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Zm4 10 2 2 4-4" /></svg>
          <span>{config.calendarButtonText || (c ? "ДОДАЈ У КАЛЕНДАР" : "DODAJ U KALENDAR")}</span>
        </button>
        <p>{config.calendarHint || (c ? "Један подсетник. Једно незаборавно вече." : "Jedan podsetnik. Jedno nezaboravno veče.")}</p>
        {calendarError && <p role="alert">{calendarError}</p>}
      </VelvetReveal>}

      <VelvetPhoto className="bvs-evening-photo" src={data.evening} position={data.velvet.eveningPosition || "50% 55%"} />
      <footer className="bvs-envelope">
        <motion.img className="bvs-envelope-image" src={data.envelope} alt="" width="1200" height="1200" loading="lazy" decoding="async" draggable="false" initial={reduced?false:{opacity:0,scale:1.035}} whileInView={{opacity:1,scale:1}} viewport={{once:true,amount:0.1}} transition={{duration:reduced?0:1.2,ease:[0.22,1,0.36,1]}} />
        <VelvetReveal className="bvs-envelope-copy"><p>{data.velvet.signoff || (data.variant === "rose" ? c ? "С ЉУБАВЉУ," : "S LJUBAVLJU," : c ? "ВИДИМО СЕ," : "VIDIMO SE,")}</p><VelvetScript>{data.name}</VelvetScript></VelvetReveal>
      </footer>
    </section>
  );
}
