import { useEffect, useId, useRef, useState } from "react";
import { preload } from "react-dom";
import {
  formatRedSatinDate,
  getRedSatinDate,
  redSatinCapitalize,
  redSatinText,
} from "./BirthdayRedSatinCountdown";
import "../styles/birthdayintro.css";

export const RED_SATIN_PAPER_TOAST = "/images/birthday-red-satin/paper-toast.webp";
const COVER_IMAGE = "/images/birthday-red-satin/intro-toast.webp";
const OPENING_MS = 1080;

export default function BirthdayRedSatinIntro({
  brideName, childName, weddingDate, weddingTime, details = {}, script,
  onStartMusic, onReveal, onEnter,
}) {
  const headingId = useId();
  const [opening, setOpening] = useState(false);
  const openingRef = useRef(false);
  const stageRef = useRef(null);
  const swipeRef = useRef(null);
  const timerRef = useRef(null);
  const config = details.redSatin || {};
  const activeScript = script || details.script;
  const t = (value) => redSatinText(value, activeScript);
  const name = childName || brideName || details.childName;
  const age = String(details.age ?? "").trim().replace(/\.+$/, "");
  const date = getRedSatinDate(details.dateISO, weddingTime);
  const coverDate = config.introDate || (date
    ? redSatinCapitalize(formatRedSatinDate(date, activeScript, {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    }))
    : weddingDate || details.date);

  preload(config.toastImage || RED_SATIN_PAPER_TOAST, { as: "image" });

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  function openInvitation() {
    if (openingRef.current) return;

    openingRef.current = true;
    stageRef.current?.removeAttribute("data-brs-dragging");
    onStartMusic?.();
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    onReveal?.();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onEnter?.();
      return;
    }

    setOpening(true);
    timerRef.current = window.setTimeout(() => onEnter?.(), OPENING_MS);
  }

  function startSwipe(event) {
    if (openingRef.current || !event.isPrimary || event.button !== 0 ||
        event.target.closest("button") || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    swipeRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      width: event.currentTarget.clientWidth,
      dragging: false,
    };
  }

  function moveSwipe(event) {
    const swipe = swipeRef.current;
    if (swipe?.id !== event.pointerId || openingRef.current) return;
    if (event.pointerType === "mouse" && (event.buttons & 1) === 0) {
      finishSwipe(event, true);
      return;
    }

    const horizontal = Math.abs(event.clientX - swipe.x);
    const vertical = Math.abs(event.clientY - swipe.y);
    const stage = event.currentTarget;

    if (!swipe.dragging) {
      if (vertical > 10 && vertical >= horizontal) {
        swipeRef.current = null;
        return;
      }
      if (horizontal < 9 || horizontal < vertical * 1.15) return;

      swipe.dragging = true;
      stage.setPointerCapture(event.pointerId);
      stage.setAttribute("data-brs-dragging", "");
    }

    const spread = Math.min(26, 76 * horizontal / swipe.width);
    stage.style.setProperty("--brs-drag-spread", spread + "%");
    stage.style.setProperty("--brs-drag-copy", String(Math.max(.34, 1 - spread / 34)));
    stage.style.setProperty("--brs-drag-glow", String(Math.min(1, spread / 15)));
  }

  function finishSwipe(event, cancelled = false) {
    const swipe = swipeRef.current;
    if (swipe?.id !== event.pointerId) return;

    swipeRef.current = null;
    const stage = event.currentTarget;
    const threshold = Math.min(110, swipe.width * .23);

    if (!cancelled && swipe.dragging && Math.abs(event.clientX - swipe.x) >= threshold) {
      openInvitation();
      return;
    }

    stage.removeAttribute("data-brs-dragging");
    stage.style.removeProperty("--brs-drag-spread");
    stage.style.removeProperty("--brs-drag-copy");
    stage.style.removeProperty("--brs-drag-glow");
  }

  return (
    <section ref={stageRef} className={"brs-intro" + (opening ? " brs-is-opening" : "")}
      aria-labelledby={headingId} inert={opening} aria-hidden={opening || undefined}
      onPointerDown={startSwipe} onPointerMove={moveSwipe} onPointerUp={finishSwipe}
      onPointerCancel={(event) => finishSwipe(event, true)}
      onLostPointerCapture={(event) => finishSwipe(event, true)}>
      <div className="brs-curtain-wing brs-curtain-wing--left" aria-hidden="true" />
      <div className="brs-curtain-wing brs-curtain-wing--right" aria-hidden="true" />
      <div className="brs-curtain-light" aria-hidden="true" />
      <div className="brs-intro-content">
        <div className="brs-intro-toast" aria-hidden="true">
          <img src={config.introToastImage || COVER_IMAGE} width="550" height="825" alt="" draggable={false} />
        </div>
        <h1 className="brs-intro-title" id={headingId}>
          {name && <span className="brs-script brs-intro-name">{name}</span>}
          {name && age && <span className="brs-intro-phrase brs-caps">{t("slavi svoj")}</span>}
          <span className="brs-intro-age-group">
            {age && <span className="brs-intro-age">{age}.</span>}
            <span className="brs-intro-occasion brs-caps">{t("rođendan")}</span>
          </span>
        </h1>
        <div className="brs-intro-bottom">
          {coverDate && <p className="brs-intro-date">{coverDate}</p>}
          <button className="brs-button brs-button--light brs-intro-button" type="button" onClick={openInvitation}>
            {t("Pogledaj pozivnicu")}
          </button>
          <p className="brs-intro-gesture" aria-hidden="true">{t("Ili razmakni zavesu")}</p>
        </div>
      </div>
    </section>
  );
}
