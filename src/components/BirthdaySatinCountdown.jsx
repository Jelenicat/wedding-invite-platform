import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { satinData, SatinIcon, SatinLetters, SatinReveal } from "./BirthdaySatinIntro";
import "../styles/newcard.css";

function remainingUntil(target) {
  if (!Number.isFinite(target)) return null;
  const seconds = Math.max(0, Math.floor((target - Date.now()) / 1000));
  return { finished: seconds === 0, values: [Math.floor(seconds / 86400), Math.floor((seconds % 86400) / 3600), Math.floor((seconds % 3600) / 60), seconds % 60] };
}

function SatinNumber({ value, animate }) {
  return <span className="bsa-count-number">
    <AnimatePresence initial={false} mode="popLayout">
      <motion.span key={value} initial={animate ? { opacity: 0, y: "35%" } : false} animate={{ opacity: 1, y: 0 }} exit={animate ? { opacity: 0, y: "-35%" } : undefined} transition={{ duration: animate ? 0.24 : 0 }}>
        {String(value).padStart(2, "0")}
      </motion.span>
    </AnimatePresence>
  </span>;
}

export default function BirthdaySatinCountdown(props) {
  const { date, satin, cyrillic, t } = satinData(props);
  const target = date?.getTime() ?? NaN;
  const reduced = useReducedMotion();
  const root = useRef(null);
  const [remaining, setRemaining] = useState(() => remainingUntil(target));
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = root.current;
    if (!element) return undefined;
    if (!("IntersectionObserver" in window)) { setInView(true); return undefined; }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "80px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, [target]);

  useEffect(() => {
    let timer;
    const update = () => {
      window.clearInterval(timer);
      const value = remainingUntil(target);
      setRemaining(value);
      // Brojač se zaustavlja van ekrana, u pozadini i kada proslava počne.
      if (inView && !document.hidden && value && !value.finished) {
        timer = window.setInterval(() => {
          const next = remainingUntil(target);
          setRemaining(next);
          if (!next || next.finished) window.clearInterval(timer);
        }, 1000);
      }
    };
    update();
    document.addEventListener("visibilitychange", update);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", update); };
  }, [target, inView]);

  // Bez ispravnog datuma nema izmišljenog odbrojavanja.
  if (!Number.isFinite(target)) return null;
  const current = remaining || remainingUntil(target);
  const labels = t(["DANA", "SATI", "MINUTA", "SEKUNDI"], ["ДАНА", "САТИ", "МИНУТА", "СЕКУНДИ"]);
  return <section ref={root} className="bsa bsa-countdown bsa-section" data-script={cyrillic ? "cyrillic" : "latin"} aria-labelledby={`bsa-countdown-${props.slug || "event"}`}>
    <SatinReveal><SatinIcon /><p className="bsa-kicker">{t("DO NAŠEG SUSRETA", "ДО НАШЕГ СУСРЕТА")}</p></SatinReveal>
    <SatinLetters as="h2" className="bsa-title" id={`bsa-countdown-${props.slug || "event"}`}>{current.finished ? t("Vreme je za slavlje!", "Време је за славље!") : satin.countdownTitle || t("Još samo…", "Још само…")}</SatinLetters>
    {!current.finished && <SatinReveal>
      <div className="bsa-count-grid" role="timer" aria-label={t("Preostalo vreme do proslave", "Преостало време до прославе")} aria-live="off">
        {current.values.map((value, index) => <div className="bsa-count-cell" key={labels[index]}><SatinNumber value={value} animate={!reduced && inView} /><span className="bsa-count-label">{labels[index]}</span></div>)}
      </div>
    </SatinReveal>}
    <SatinReveal><p className="bsa-count-caption">{current.finished ? satin.startedText || t("Neka najlepše uspomene počnu.", "Нека најлепше успомене почну.") : satin.countdownText || t("Do večeri koju ćemo pamtiti.", "До вечери коју ћемо памтити.")}</p></SatinReveal>
  </section>;
}
