import { useEffect, useId, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { addToCalendar } from "../utils/calendar";
import { JungleMark, jungleData } from "./BirthdayJungleBookIntro";
import "../styles/newcard.css";

function splitTime(seconds) {
  return [
    Math.floor(seconds / 86400),
    Math.floor(seconds / 3600) % 24,
    Math.floor(seconds / 60) % 60,
    seconds % 60,
  ];
}

export default function BirthdayJungleBookCountdown(props) {
  const { details, config, dateISO, name, age, venue, text } = jungleData(props);
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

  return (
    <section className="jb-countdown" ref={section} aria-labelledby={title}>
      <div className="jb-content">
        <JungleMark type="leaf" className="jb-section-mark" />
        <h2 id={title}>{hasDate && seconds === 0
          ? text("Avantura je počela", "Авантура је почела")
          : text("Još malo do proslave", "Још мало до прославе")}</h2>
        {clockEnabled && hasDate && seconds > 0 && (
          <div className="jb-clock" role="timer" aria-live="off" aria-label={text("Vreme do proslave", "Време до прославе")}>
            {splitTime(seconds).map((value, index) => (
              <div key={units[index]}><strong>{String(value).padStart(2, "0")}</strong><span>{units[index]}</span></div>
            ))}
          </div>
        )}
        {clockEnabled && !hasDate && <p>{text("Datum proslave stiže uskoro.", "Датум прославе стиже ускоро.")}</p>}
        {calendarEnabled && (
          <button type="button" className="jb-button" onClick={saveDate} disabled={calendarStatus === "saving"}>
            <JungleMark type="compass" />
            {calendarStatus === "saving" ? text("Otvaramo kalendar…", "Отварамо календар…") : text("Sačuvaj datum", "Сачувај датум")}
          </button>
        )}
        {calendarStatus === "error" && <p className="jb-calendar-error" role="alert">{text("Kalendar nije otvoren. Pokušajte ponovo.", "Календар није отворен. Покушајте поново.")}</p>}
      </div>
    </section>
  );
}
