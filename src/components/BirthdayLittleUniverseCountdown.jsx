import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { addToCalendar } from "../utils/calendar";
import { universeData, UniverseIcon, UniverseReveal, UniverseScript, UNIVERSE_EASE } from "./BirthdayLittleUniverseIntro";
import "../styles/newcard.css";

function remaining(date) {
  const target = date ? new Date(date).getTime() : NaN;
  if (!Number.isFinite(target)) return { status: "invalid", values: [] };
  const seconds = Math.max(0, Math.ceil((target - Date.now()) / 1000));
  if (!seconds) return { status: "finished", values: [] };
  return { status: "upcoming", values: [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60] };
}

export default function BirthdayLittleUniverseCountdown(props) {
  const { targetDate, showCalendarButton } = props;
  const { name, age, venue, dateISO, c, config, details } = universeData(props);
  const target = targetDate || dateISO;
  const ref = useRef(null);
  const uid = useId();
  const visible = useInView(ref, { amount: 0.01 });
  const reduced = useReducedMotion();
  const pending = useRef(false);
  const [clock, setClock] = useState(() => remaining(target));
  const [calendarError, setCalendarError] = useState("");
  const [calendarLoading, setCalendarLoading] = useState(false);
  const calendarEnabled = showCalendarButton ?? details.showCalendarButton ?? false;
  const labels = c ? ["ДАНА", "САТИ", "МИНУТА", "СЕКУНДИ"] : ["DANA", "SATI", "MINUTA", "SEKUNDI"];

  useEffect(() => {
    let timer;
    const sync = () => {
      window.clearInterval(timer);
      setClock(remaining(target));
      if (visible && !document.hidden) timer = window.setInterval(() => setClock(remaining(target)), 1000);
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", sync); };
  }, [target, visible]);

  const calendar = async () => {
    if (pending.current) return;
    pending.current = true;
    setCalendarLoading(true); setCalendarError("");
    try {
      await addToCalendar({
        brideName: name, groomName: "", dateISO: target, venue,
        mapLink: details.mapLink || details.locationButtonLink,
        note: details.calendarDescription || (c ? "Први рођендан — једна година, читав свемир љубави." : "Prvi rođendan — jedna godina, čitav svemir ljubavi."),
        durationHours: details.calendarDurationHours,
        eventType: "birthday", age,
        eventTitle: details.calendarTitle || `${name} — ${age}. ${c ? "рођендан" : "rođendan"}`,
        language: "sr",
      });
    } catch (cause) {
      console.error("Little Universe calendar:", cause);
      setCalendarError(c ? "Календар није отворен. Покушајте поново." : "Kalendar nije otvoren. Pokušajte ponovo.");
    } finally {
      pending.current = false; setCalendarLoading(false);
    }
  };

  return <section ref={ref} className="blu-countdown blu-section" aria-labelledby={`${uid}-title`}>
    <UniverseReveal><UniverseIcon type="moon" /><p className="blu-kicker">{c ? "ОДБРОЈАВАМО ДО ЗАГРЉАЈА" : "ODBROJAVAMO DO ZAGRLJAJA"}</p>
      <h2 id={`${uid}-title`} className="blu-heading">{clock.status === "finished" ? c ? "Наш велики" : "Naš veliki" : c ? "До великог" : "Do velikog"}<UniverseScript>{clock.status === "finished" ? c ? "мали дан је стигао." : "mali dan je stigao." : c ? "малог дана." : "malog dana."}</UniverseScript></h2>
    </UniverseReveal>
    {clock.status === "upcoming" ? <UniverseReveal><div className="blu-clock" role="timer" aria-live="off" aria-label={c ? "Преостало време до рођендана" : "Preostalo vreme do rođendana"}>
      {clock.values.map((value, i) => <div className="blu-clock-unit" key={i}>
        <div className={`blu-clock-window ${String(value).length > 3 ? "blu-clock-wide" : ""}`}>
          <AnimatePresence initial={false} mode="popLayout"><motion.strong key={value}
            initial={reduced || !visible ? false : { opacity: 0, y: "65%" }} animate={{ opacity: 1, y: 0 }}
            exit={reduced || !visible ? { opacity: 0 } : { opacity: 0, y: "-65%" }}
            transition={{ duration: reduced ? 0 : 0.32, ease: UNIVERSE_EASE }}
          >{String(value).padStart(2, "0")}</motion.strong></AnimatePresence>
        </div><span>{labels[i]}</span>
      </div>)}
    </div></UniverseReveal> : <p className="blu-countdown-note">{clock.status === "finished" ? config.finishedText || (c ? "Једва чекамо да славимо са вама." : "Jedva čekamo da slavimo sa vama.") : c ? "Датум прославе ускоро стиже." : "Datum proslave uskoro stiže."}</p>}
    {calendarEnabled && clock.status !== "invalid" && <UniverseReveal className="blu-calendar-wrap">
      <button type="button" className="blu-button blu-button-outline" disabled={calendarLoading} onClick={calendar}><UniverseIcon type="calendar" /><span>{calendarLoading ? c ? "Отварање…" : "Otvaranje…" : c ? "Сачувај наш датум" : "Sačuvaj naš datum"}</span></button>
      <p>{c ? "За један дан који се не пропушта." : "Za jedan dan koji se ne propušta."}</p>
      {calendarError && <p className="blu-form-error" role="alert">{calendarError}</p>}
    </UniverseReveal>}
  </section>;
}
