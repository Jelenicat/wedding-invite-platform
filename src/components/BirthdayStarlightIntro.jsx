import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "../styles/newintro.css";

// Zajednički delovi su u ovom fajlu kako bi ceo template imao tačno 4 JSX fajla.
export function starlightData(props = {}) {
  const details = props.details || {};
  const starlight = details.starlight || {};
  const intro = details.birthdayIntro || {};
  const c = props.script === "cyrillic";
  const name = String(props.brideName || props.childName || details.rsvpSignature || (c ? "Анастасија" : "Anastasija"));
  const age = String(details.age ?? intro.age ?? 25).replace(/[^0-9]/g, "").slice(0, 3) || "25";
  const assets = "/images/birthday-starlight/";
  return {
    details, starlight, intro, c, name, age,
    date: details.date || props.weddingDate || "",
    dateISO: details.dateISO || "",
    time: details.gatheringTime || props.weddingTime || "",
    venue: details.locationName || details.venue || props.venue || "",
    address: details.locationAddress || "",
    pourImage: starlight.pourImage || `${assets}champagne-pour.webp`,
    toastImage: starlight.toastImage || `${assets}champagne-toast.webp`,
    dressImage: starlight.dressImage || `${assets}black-tie-looks.webp`,
    nameScale: Math.min(1, 11 / Math.max(11, Array.from(name).length)),
  };
}

// Jedan observer po sceni; animacije pokreće CSS, bez renderovanja pri skrolu.
export function useStarlightScene(root, sceneKey) {
  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return undefined;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer;
    const showAll = () => {
      observer?.disconnect();
      element.classList.remove("bsl-motion-ready");
    };
    const initialize = () => {
      showAll();
      if (preference.matches || !("IntersectionObserver" in window)) return;
      element.classList.add("bsl-motion-ready");
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("bsl-visible");
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -10px 0px" });
      element.querySelectorAll("[data-bsl-animate]").forEach((target) => observer.observe(target));
    };
    initialize();
    preference.addEventListener?.("change", initialize);
    return () => {
      showAll();
      preference.removeEventListener?.("change", initialize);
    };
  }, [root, sceneKey]);
}

export function StarlightReveal({ children, className = "", delay = 0, style, ...rest }) {
  return <div className={`bsl-reveal ${className}`} data-bsl-animate="reveal" style={{ "--bsl-delay": `${delay}s`, ...style }} {...rest}>{children}</div>;
}

export function StarlightScript({ children, className = "", delay = 0 }) {
  return <span className={`bsl-script bsl-writing ${className}`} data-bsl-animate="writing" style={{ "--bsl-delay": `${delay}s` }}><span>{children}</span></span>;
}

export function StarlightLetters({ text = "", className = "", delay = 0 }) {
  let order = 0;
  return <span className={`bsl-letters ${className}`} data-bsl-animate="letters" aria-label={String(text)}>
    {String(text).split(/(\s+)/).map((word, index) => /^\s+$/.test(word)
      ? <span key={index} aria-hidden="true">{word}</span>
      : <span className="bsl-word" aria-hidden="true" key={index}>{Array.from(word).map((letter, i) => {
        const wait = delay + Math.min(order++ * 0.028, 0.75);
        return <span className="bsl-letter-window" key={i}><span className="bsl-glyph" style={{ "--bsl-delay": `${wait}s` }}>{letter}</span></span>;
      })}</span>)}
  </span>;
}

export function StarlightIcon({ name = "star", className = "" }) {
  const icons = {
    star: "/icons/birthday-starlight-star.svg",
    calendar: "/icons/birthday-starlight-calendar.svg",
    check: "/icons/birthday-starlight-check.svg",
    location: "/icons/birthday-starlight-location.svg",
    clock: "/icons/birthday-starlight-clock.svg",
    arrow: "/icons/birthday-starlight-arrow.svg",
  };
  return <img className={`bsl-icon ${className}`} src={icons[name] || icons.star} alt="" aria-hidden="true" width="24" height="24" draggable="false" />;
}

export function StarlightSparkles({ className = "" }) {
  const points = [[16, 12, 11], [78, 7, 7], [91, 34, 16], [9, 55, 7], [76, 65, 12], [30, 84, 6], [88, 91, 8], [39, 28, 5], [52, 52, 5], [22, 68, 4], [63, 17, 4], [57, 89, 4]];
  return <div className={`bsl-sparkles ${className}`} aria-hidden="true">{points.map(([x, y, size], i) => <span key={i} style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, "--bsl-twinkle-delay": `${i * -0.47}s` }} />)}</div>;
}

function ordinal(age) {
  const number = Number(age);
  if (number % 100 >= 11 && number % 100 <= 13) return "th";
  return ({ 1: "st", 2: "nd", 3: "rd" })[number % 10] || "th";
}

export function StarlightAge({ data }) {
  return <div className="bsl-age" style={{ "--bsl-age-scale": data.age.length > 2 ? 0.72 : 1 }} aria-label={`${data.age}. ${data.c ? "рођендан" : "rođendan"}`}>
    <StarlightLetters text={data.age} className="bsl-age-number" delay={0.08} />
    <span className="bsl-age-suffix" aria-hidden="true">{data.starlight.ageSuffix ?? (data.c ? "." : ordinal(data.age))}</span>
  </div>;
}

export default function BirthdayStarlightIntro(props) {
  const data = starlightData(props);
  const { c, starlight, intro } = data;
  const root = useRef(null);
  const pending = useRef(false);
  const timer = useRef(null);
  const [opening, setOpening] = useState(false);
  useStarlightScene(root, props.slug);

  useEffect(() => {
    pending.current = false;
    setOpening(false);
    // Mala slika za prvu sekciju može da se učita dok je intro otvoren.
    const preload = new Image();
    preload.src = data.pourImage;
    return () => window.clearTimeout(timer.current);
  }, [props.slug, data.pourImage]);

  const open = () => {
    if (pending.current) return;
    pending.current = true;
    props.onStartMusic?.();
    setOpening(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = window.setTimeout(() => {
      if (typeof props.onEnter === "function") props.onEnter();
      else props.onOpen?.();
    }, reduced ? 0 : 640);
  };

  return <section ref={root} className={`bsl bsl-intro ${opening ? "bsl-intro-opening" : ""}`} data-script={c ? "cyrillic" : "latin"} lang={c ? "sr-Cyrl" : "sr-Latn"} aria-label={c ? "Рођенданска позивница" : "Rođendanska pozivnica"}>
    <div className="bsl-intro-scene">
      <StarlightSparkles />
      <div className="bsl-light-sweep" aria-hidden="true" />
      <div className="bsl-intro-content">
        <StarlightReveal><p className="bsl-eyebrow">{starlight.introKicker || (c ? "ЈЕДНО ВЕЧЕ ЗА ПАМЋЕЊЕ" : "JEDNO VEČE ZA PAMĆENJE")}</p></StarlightReveal>
        <StarlightAge data={data} />
        <h1 className="bsl-party-title"><StarlightScript delay={0.15}>{starlight.heroTitle || (c ? "Рођенданска" : "Birthday")}</StarlightScript><StarlightScript className="bsl-party-second" delay={0.42}>{starlight.heroSubtitle || (c ? "прослава" : "party")}</StarlightScript></h1>
        <StarlightReveal delay={0.25}><p className="bsl-intro-name">{data.name}</p>{data.date && <p className="bsl-intro-date">{data.date}</p>}</StarlightReveal>
        <button className="bsl-button bsl-button-cream bsl-enter" type="button" onClick={open} disabled={opening}>{intro.buttonText || (c ? "Погледај позивницу" : "Pogledaj pozivnicu")}</button>
      </div>
    </div>
  </section>;
}
