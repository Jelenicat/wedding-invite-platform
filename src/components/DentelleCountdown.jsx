import { useEffect, useState } from "react";
import { DentelleLace, DentelleReveal, dentelleDate, dentelleText } from "./DentelleIntro";
import "../styles/newcard.css";

export function dentelleTimeLeft(dateISO, now = Date.now()) {
  const target = dentelleDate(dateISO);
  if (!target) return null;
  const seconds = Math.max(0, Math.floor((target.getTime() - now) / 1000));
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor(seconds % 86400 / 3600),
    minutes: Math.floor(seconds % 3600 / 60),
    seconds: seconds % 60,
    reached: now >= target.getTime(),
  };
}

export default function DentelleCountdown({ dateISO, details = {}, script = "latin" }) {
  const t = dentelleText(script);
  const config = details.dentelle || {};
  const date = dateISO || details.dateISO;
  const [left, setLeft] = useState(() => dentelleTimeLeft(date));

  useEffect(() => {
    let interval;
    const update = () => setLeft(dentelleTimeLeft(date));
    const resume = () => {
      clearInterval(interval);
      update();
      if (!document.hidden) interval = setInterval(update, 1000);
    };
    resume();
    document.addEventListener("visibilitychange", resume);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", resume);
    };
  }, [date]);

  return (
    <section className="dnt dnt-countdown" data-script={script} aria-label={t.countdown}>
      <DentelleLace src={config.edgeImage} className="dnt-lace-top" />

      <DentelleReveal className="dnt-countdown-inner">
        {/* Samo jedan kompletan okvir; tekst i brojevi su unutar njega. */}
        <img
          src="/icons/dentelle-flourish.svg"
          className="dnt-countdown-frame"
          alt=""
          aria-hidden="true"
          draggable={false}
          decoding="async"
        />

        <div className="dnt-countdown-content">
          <p className="dnt-kicker">{config.countdownKicker || t.countdownKicker}</p>
          <h2 className="dnt-heading">
            {!left ? t.dateSoon : left.reached ? t.today : config.countdownTitle || t.countdown}
          </h2>

          {left && !left.reached && (
            <div className="dnt-countdown-grid" aria-live="off">
              {["days", "hours", "minutes", "seconds"].map((unit) => (
                <div className="dnt-countdown-unit" key={unit}>
                  <span className="dnt-countdown-value" key={left[unit]}>
                    {String(left[unit]).padStart(2, "0")}
                  </span>
                  <span className="dnt-countdown-label">{t[unit]}</span>
                </div>
              ))}
            </div>
          )}

          {left?.reached && (
            <p className="dnt-body">{config.countdownReachedText || t.celebrate}</p>
          )}
        </div>
      </DentelleReveal>

      <DentelleLace src={config.edgeImage} className="dnt-lace-bottom" />
    </section>
  );
}
