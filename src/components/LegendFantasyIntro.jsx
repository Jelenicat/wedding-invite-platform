import { useCallback, useEffect, useRef, useState } from "react";
import "../styles/legendFantasy.css";

/**
 * Cinematic, mobile-first fantasy intro.
 * The artwork is locally served from /public/images/legend-fantasy/.
 * There are no additional JavaScript dependencies.
 * The existing WeddingPage onEnter mechanism remains unchanged.
 */
const INTRO_DURATION = 11400;
const EXIT_DURATION = 850;

export default function LegendFantasyIntro({
  brideName = "Ana",
  groomName = "Luka",
  weddingDate = "",
  onEnter,
  onStartMusic,
}) {
  const [leaving, setLeaving] = useState(false);
  const finishedRef = useRef(false);
  const timeoutRef = useRef(null);
  const exitRef = useRef(null);
  const onEnterRef = useRef(onEnter);
  const onStartMusicRef = useRef(onStartMusic);

  useEffect(() => {
    onEnterRef.current = onEnter;
    onStartMusicRef.current = onStartMusic;
  }, [onEnter, onStartMusic]);

  const finishIntro = useCallback((initiatedByUser = false) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    window.clearTimeout(timeoutRef.current);

    // The browser only allows reliable audio playback following a user gesture.
    if (initiatedByUser) onStartMusicRef.current?.();

    setLeaving(true);
    exitRef.current = window.setTimeout(() => {
      onEnterRef.current?.();
    }, EXIT_DURATION);
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    timeoutRef.current = window.setTimeout(
      () => finishIntro(false),
      reducedMotion ? 1300 : INTRO_DURATION
    );

    return () => {
      window.clearTimeout(timeoutRef.current);
      window.clearTimeout(exitRef.current);
    };
  }, [finishIntro]);

  return (
    <main
      className={`legend-fantasy legend-fantasy--intro lf2-intro${leaving ? " lf-leaving" : ""}`}
      aria-label={`Filmski uvod pozivnice: ${brideName} i ${groomName}`}
    >
      <div className="lf2-scene" aria-hidden="true">
        <div className="lf2-scene__art" />
        <div className="lf2-scene__vignette" />
        <div className="lf2-eye-glow" />
        <div className="lf2-fog lf2-fog--front" />
        <div className="lf2-fog lf2-fog--back" />

        <div className="lf2-ring-flight">
          <div className="lf2-ring-bloom" />
          <div className="lf2-orbit lf2-orbit--first" />
          <div className="lf2-orbit lf2-orbit--second" />
          <img
            className="lf2-ring"
            src="/images/legend-fantasy/enchanted-ring.webp"
            alt=""
            draggable="false"
            width="692"
            height="814"
            decoding="async"
            fetchPriority="high"
          />
        </div>

        <div className="lf2-embers">
          {Array.from({ length: 24 }, (_, i) => (
            <i
              key={i}
              style={{
                "--i": i,
                "--x": `${(i * 37 + 9) % 100}%`,
                "--drift": `${((i * 19) % 55) - 27}px`,
                "--delay": `${(i * 0.38) % 6}s`,
                "--duration": `${3.1 + (i % 8) * 0.44}s`,
              }}
            />
          ))}
        </div>
        <div className="lf2-lightburst" />
      </div>

      <div className="lf2-story">
        <div className="lf2-story__top">
          <div className="lf2-story__line" aria-hidden="true"><span>✧</span></div>
          <p>Svaka velika priča počinje jednim susretom</p>
        </div>
        <div className="lf2-story__bottom">
          <span className="lf2-story__kicker">Dva puta postaju jedan</span>
          <h1>{brideName}<em>&</em>{groomName}</h1>
          <span className="lf2-story__date">{weddingDate}</span>
          <div className="lf2-story__ornament" aria-hidden="true">✦</div>
        </div>
      </div>

      <button
        className="lf2-skip"
        type="button"
        onClick={() => finishIntro(true)}
        aria-label="Preskoči filmski uvod i otvori pozivnicu"
      >
        Preskoči <span aria-hidden="true">↗</span>
      </button>
      <div className="lf2-progress" aria-hidden="true"><span /></div>
    </main>
  );
}
