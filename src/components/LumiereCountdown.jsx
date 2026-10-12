import { useEffect, useRef, useState } from "react";
import { addToCalendar } from "../utils/calendar";
import { LUMIERE_ASSETS, LumiereIcon, LumierePhoto, LumiereReveal, lumiereText } from "./LumiereIntro";
import "../styles/newcard.css";

export function calculateLumiereCountdown(targetDate, now = Date.now()) {
  if (!targetDate) return null;
  const timestamp = new Date(targetDate).getTime();
  if (!Number.isFinite(timestamp)) return null;
  const milliseconds = timestamp - now;
  if (milliseconds <= 0) return { arrived: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  const total = Math.floor(milliseconds / 1000);
  return { arrived: false, days: Math.floor(total / 86400), hours: Math.floor(total / 3600) % 24, minutes: Math.floor(total / 60) % 60, seconds: total % 60 };
}

export default function LumiereCountdown({ targetDate, brideName = "", groomName = "", details = {}, script = "latin", language = "sr" }) {
  const t = lumiereText(language, script);
  const config = details.lumiere || {};
  const rootRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(() => calculateLumiereCountdown(targetDate));
  const finalImage = config.closingImage || config.heroImage || LUMIERE_ASSETS.hero;
  const showCalendar = details.showCalendarButton === true && Boolean(targetDate) && Number.isFinite(new Date(targetDate).getTime());

  useEffect(() => {
    let interval, inView = !window.IntersectionObserver;
    const update = () => setTimeLeft(calculateLumiereCountdown(targetDate));
    const sync = () => {
      window.clearInterval(interval);
      if (inView && !document.hidden && Number.isFinite(new Date(targetDate).getTime())) { update(); interval = window.setInterval(update, 1000); }
    };
    update();
    let observer;
    if (window.IntersectionObserver && rootRef.current) {
      observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); }, { rootMargin: "120px" });
      observer.observe(rootRef.current);
    } else sync();
    document.addEventListener("visibilitychange", sync);
    return () => { window.clearInterval(interval); observer?.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, [targetDate]);

  const calendar = () => {
    if (!showCalendar) return;
    addToCalendar({ brideName, groomName, dateISO: targetDate, venue: details.venue || details.locationName, mapLink: details.mapLink || details.locationButtonLink, note: details.note, durationHours: details.calendarDurationHours, language });
  };
  const items = timeLeft && !timeLeft.arrived ? [[timeLeft.days, t.days], [timeLeft.hours, t.hours], [timeLeft.minutes, t.minutes], [timeLeft.seconds, t.seconds]] : [];

  return <section ref={rootRef} className="lmv lmv-countdown" data-script={script}>
    {(timeLeft || showCalendar) && <LumiereReveal className="lmv-clock-paper"><div className="lmv-wrap"><div className="lmv-clock-line"><span aria-hidden="true">♡</span><span>{t.chapter}</span></div>{timeLeft?.arrived ? <h2 className="lmv-clock-arrived">{t.arrived}</h2> : timeLeft && <><h2 className="lmv-kicker">{t.remaining}</h2><div className="lmv-clock-grid" aria-live="off">{items.map(([value, label], index) => <div className="lmv-clock-unit" key={index}><span key={value} className={`lmv-clock-number ${String(value).length > 3 ? "is-long" : ""}`}>{String(value).padStart(2, "0")}</span><span className="lmv-clock-label">{label}</span></div>)}</div></>}{showCalendar && <div className="lmv-clock-calendar"><button className="lmv-button" type="button" onClick={calendar}><LumiereIcon name="calendar" size={20} /><span>{t.addCalendar}</span><span className="lmv-arrow" aria-hidden="true">↗</span></button><p className="lmv-body">{t.calendarHint}</p></div>}</div></LumiereReveal>}
    <footer className="lmv-finale"><span className="lmv-finale-amp" aria-hidden="true">&amp;</span><div className="lmv-finale-photo"><LumierePhoto src={finalImage} alt="" position={config.closingPosition || "50% 35%"} /></div><LumiereReveal className="lmv-finale-copy"><p className="lmv-kicker">{t.closing}</p><p className="lmv-finale-names">{brideName} &amp; {groomName}</p><p className="lmv-body">{config.closingText || t.closingNote}</p><span className="lmv-finale-heart" aria-hidden="true">♡</span></LumiereReveal>{details.date && <p className="lmv-finale-foot">{details.date}</p>}</footer>
  </section>;
}
