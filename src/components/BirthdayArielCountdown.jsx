import { useEffect, useId, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { addToCalendar } from "../utils/calendar";
import { ARIEL_ART, arielData } from "./BirthdayArielIntro";
import "../styles/newcard.css";

function splitTime(seconds) {
  return [
    Math.floor(seconds / 86400),
    Math.floor(seconds / 3600) % 24,
    Math.floor(seconds / 60) % 60,
    seconds % 60,
  ];
}

function HourglassLight({ section }) {
  const { scrollYProgress } = useScroll({ target: section, offset: ["start 0.93", "start 0.28"] });
  const opacity = useTransform(scrollYProgress, [0, 0.26, 0.75, 1], [0.05, 0.19, 0.9, 0.59]);
  const scale = useTransform(scrollYProgress, [0, 0.78], [0.62, 1.62]);
  return <motion.span className="ariel-time-gleam" style={{ opacity, scale }} />;
}

function ClockReadout({ values, units, label }) {
  return (
    <div className="ariel-clock" role="timer" aria-live="off" aria-label={label}>
      <div className="ariel-clock-days">
        <strong>{String(values[0]).padStart(2, "0")}</strong>
        <span>{units[0]}</span>
      </div>
      <div className="ariel-clock-units">
        {values.slice(1).map((value, index) => (
          <div className="ariel-clock-part" key={units[index + 1]}>
            <strong key={value}>{String(value).padStart(2, "0")}</strong>
            <span>{units[index + 1]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BirthdayArielCountdown(props) {
  const { details, config, dateISO, name, age, venue, text } = arielData(props);
  const target = props.targetDate || dateISO;
  const timestamp = target ? new Date(target).getTime() : NaN;
  const hasDate = Number.isFinite(timestamp);
  const clockEnabled = config.showCountdown !== false;
  const calendarEnabled = (props.showCalendarButton ?? details.showCalendarButton) && hasDate;
  const [now, setNow] = useState(Date.now);
  const [calendarStatus, setCalendarStatus] = useState("idle");
  const pendingCalendar = useRef(false);
  const section = useRef(null);
  const inView = useInView(section, { amount: "some" });
  const reduceMotion = useReducedMotion();
  const title = useId();
  const seconds = Math.max(0, Math.ceil((timestamp - now) / 1000));
  const units = text(["Dana", "Sati", "Minuta", "Sekundi"], ["Дана", "Сати", "Минута", "Секунди"]);

  useEffect(() => {
    if (!clockEnabled || !hasDate) return;
    let timer;
    const sync = () => {
      const current = Date.now();
      setNow(current);
      if (current >= timestamp) window.clearInterval(timer);
    };
    const start = () => {
      window.clearInterval(timer);
      sync();
      if (inView && !document.hidden && Date.now() < timestamp) timer = window.setInterval(sync, 1000);
    };
    start();
    document.addEventListener("visibilitychange", start);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", start);
    };
  }, [clockEnabled, hasDate, timestamp, inView]);

  const saveDate = async () => {
    if (pendingCalendar.current || !calendarEnabled) return;
    pendingCalendar.current = true;
    setCalendarStatus("saving");
    try {
      await addToCalendar({
        brideName: name,
        groomName: "",
        dateISO: target,
        venue,
        mapLink: details.mapLink || details.locationButtonLink,
        note: details.calendarDescription,
        durationHours: details.calendarDurationHours,
        eventType: "birthday",
        eventTitle: details.calendarTitle || name + " — " + age + ". " + text("rođendan", "рођендан"),
        language: "sr",
        age,
      });
      setCalendarStatus("idle");
    } catch {
      setCalendarStatus("error");
    } finally {
      pendingCalendar.current = false;
    }
  };

  if (!clockEnabled && !calendarEnabled) return null;

  const started = hasDate && seconds === 0;

  return (
    <section className="ariel-countdown" ref={section} aria-labelledby={title}>
      <div className="ariel-time-scene">
        <div className="ariel-time-art" aria-hidden="true">
          <img src={ARIEL_ART.hourglass} alt="" width="1200" height="800" loading="lazy" decoding="async" />
          {!reduceMotion && <HourglassLight section={section} />}
        </div>
        <div className="ariel-time-body">
          <h2 className="ariel-title" id={title}>
            {started ? text("Proslava", "Прослава") : text("Još malo", "Још мало")} <em>{started ? text("je počela", "је почела") : text("do proslave", "до прославе")}</em>
          </h2>
          {clockEnabled && hasDate && seconds > 0 && (
            <ClockReadout values={splitTime(seconds)} units={units} label={text("Vreme do proslave", "Време до прославе")} />
          )}
          {clockEnabled && !hasDate && <p>{text("Datum proslave stiže uskoro.", "Датум прославе стиже ускоро.")}</p>}
          {calendarEnabled && (
            <button type="button" className="ariel-button ariel-calendar" onClick={saveDate} disabled={calendarStatus === "saving"}>
              {calendarStatus === "saving" ? text("Otvaramo kalendar…", "Отварамо календар…") : text("Sačuvaj datum", "Сачувај датум")}
            </button>
          )}
          {calendarStatus === "error" && <p className="ariel-calendar-error" role="alert">{text("Kalendar nije otvoren. Pokušajte ponovo.", "Календар није отворен. Покушајте поново.")}</p>}
        </div>
      </div>
    </section>
  );
}
