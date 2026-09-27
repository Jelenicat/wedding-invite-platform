import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "../styles/saveTheDate.css";
import { addToCalendar } from "../utils/calendar";

function toISO(value) {
  const match = String(value || "").trim().match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})\.?$/);
  return match
    ? `${match[3]}-${match[2].padStart(2, "0")}-${match[1].padStart(2, "0")}`
    : "";
}

function openingHalfWidth(y) {
  const relativeY = (y - 0.505) / 0.25;
  return Math.abs(relativeY) < 1 ? 0.24 * Math.sqrt(1 - relativeY ** 2) : 0;
}

export default function SaveTheDateOvalVideo({
  brideName = "Ana",
  groomName = "Nikola",
  weddingDate = "19.06.2027.",
  venue = "Beograd",
  script = "latin",
  details = {},
}) {
  const config = details.saveTheDate || {};
  const cyrillic = script === "cyrillic" || config.script === "cyrillic";
  const videoSrc = config.videoSrc || config.video || "";
  const poster = config.videoPoster || config.posterImage || "";
  const frameImage = config.frameImage || "/images/save-the-date/oval-video-ivory-relief-frame.png";
  const dateISO = config.dateISO || details.dateISO || toISO(weddingDate);
  const threshold = Math.min(0.8, Math.max(0.2, Number(config.revealThreshold) || 0.46));
  const [revealed, setRevealed] = useState(false);
  const [muted, setMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef(null);
  const revealedRef = useRef(false);

  const copy = cyrillic
    ? { scratch: "ПРЕВУЦИ ПРСТОМ", reveal: "Откриј снимак", soon: "Позивница са детаљима ускоро стиже.", calendar: "Додај у календар", soundOn: "Укључи звук", soundOff: "Искључи звук", missing: "Наш снимак ускоро стиже" }
    : { scratch: "PREVUCI PRSTOM", reveal: "Otkrij snimak", soon: "Pozivnica sa detaljima uskoro stiže.", calendar: "Dodaj u kalendar", soundOn: "Uključi zvuk", soundOff: "Isključi zvuk", missing: "Naš snimak uskoro stiže" };

  useLayoutEffect(() => {
    if (revealed) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const paint = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.globalCompositeOperation = "source-over";
      context.fillStyle = config.scratchColor || "#d8d0c3";
      context.fillRect(0, 0, width, height);
      context.fillStyle = "rgba(255,255,255,.15)";
      for (let i = 0; i < 18; i += 1) {
        const x = ((i * 73) % 101) / 101 * width;
        const y = ((i * 47) % 103) / 103 * height;
        context.fillRect(x, y, 2, 2);
      }
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = "#766b5e";
      context.font = `500 ${Math.max(10, Math.min(13, width * .064))}px Georgia, serif`;
      context.fillText(copy.scratch, width / 2, height / 2);
    };

    paint();
    const observer = new ResizeObserver(paint);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [revealed, config.scratchColor, copy.scratch]);

  useEffect(() => {
    if (!revealed || !videoSrc || videoError) return;
    const video = videoRef.current;
    if (video) video.play().catch(() => {});
  }, [revealed, videoSrc, videoError]);

  function reveal() {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setRevealed(true);
  }

  function point(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function erase(event) {
    if (!drawingRef.current || revealedRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { willReadFrequently: true });
    if (!context) return;
    const current = point(event);
    const previous = lastPointRef.current || current;
    context.globalCompositeOperation = "destination-out";
    context.lineWidth = Math.max(30, canvas.clientWidth * .13);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    context.moveTo(previous.x, previous.y);
    context.lineTo(current.x, current.y);
    context.stroke();
    // A tap also removes a circular patch.
    context.beginPath();
    context.arc(current.x, current.y, context.lineWidth / 2, 0, Math.PI * 2);
    context.fill();
    lastPointRef.current = current;
  }

  function checkProgress() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { willReadFrequently: true });
    if (!context) return;
    const { width, height } = canvas;
    const pixels = context.getImageData(0, 0, width, height).data;
    let erased = 0;
    let total = 0;
    const step = Math.max(6, Math.round(width / 35));

    for (let y = step; y < height - step; y += step) {
      for (let x = step; x < width - step; x += step) {
        const nx = x / width;
        const ny = y / height;
        if (Math.abs(nx - 0.5) >= openingHalfWidth(ny)) continue;
        total += 1;
        if (pixels[(y * width + x) * 4 + 3] < 64) erased += 1;
      }
    }
    if (total && erased / total >= threshold) reveal();
  }

  function startScratch(event) {
    if (revealedRef.current) return;
    event.preventDefault();
    drawingRef.current = true;
    lastPointRef.current = null;
    event.currentTarget.setPointerCapture(event.pointerId);
    erase(event);
  }

  function stopScratch(event) {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    lastPointRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    checkProgress();
  }

  function calendar() {
    if (!dateISO) return;
    addToCalendar({
      brideName, groomName, dateISO, venue,
      eventType: "save-the-date", allDay: true, language: "sr",
      eventTitle: config.calendarTitle || `${brideName} & ${groomName} — Save the Date`,
      note: config.calendarDescription || copy.soon,
    });
  }

  function toggleSound() {
    const next = !muted;
    setMuted(next);
    if (videoRef.current) {
      videoRef.current.muted = next;
      videoRef.current.play().catch(() => {});
    }
  }

  const style = {
    "--sov-paper": config.paperColor || "#fcfbf8",
    "--sov-ink": config.inkColor || "#5b4c43",
  };

  return (
    <main className="std-oval-video" style={style} data-revealed={revealed} data-script={cyrillic ? "cyrillic" : "latin"}>
      <div className="std-oval-video__paper">
        <header className="std-oval-video__header">
          <h1>{config.heading || (cyrillic ? "Сачувај датум" : "Sačuvaj datum")}</h1>
          <p>{weddingDate}</p>
        </header>

        <section className="std-oval-video__center" aria-label={cyrillic ? "Снимак пара" : "Snimak para"}>
          <div className="std-oval-video__frame">
            <div className="std-oval-video__window">
              {videoSrc && !videoError ? (
                <video
                  ref={videoRef}
                  src={videoSrc}
                  poster={poster || undefined}
                  muted={muted}
                  playsInline
                  loop
                  preload="metadata"
                  onCanPlay={() => { if (revealedRef.current) videoRef.current?.play().catch(() => {}); }}
                  onError={() => setVideoError(true)}
                />
              ) : poster ? (
                <img src={poster} alt="" />
              ) : (
                <span className="std-oval-video__missing">{copy.missing}</span>
              )}
              {!revealed && (
                <canvas
                  ref={canvasRef}
                  className="std-oval-video__mask"
                  aria-label={copy.scratch}
                  onPointerDown={startScratch}
                  onPointerMove={erase}
                  onPointerUp={stopScratch}
                  onPointerCancel={stopScratch}
                />
              )}
            </div>
            <img className="std-oval-video__frame-image" src={frameImage} alt="" aria-hidden="true" draggable="false" fetchPriority="high" />
          </div>
          {!revealed && (
            <button className="std-oval-video__reveal-button" type="button" onClick={reveal}>
              {copy.reveal}
            </button>
          )}
          {revealed && config.showVideoSound === true && videoSrc && !videoError && (
            <button className="std-oval-video__sound" type="button" onClick={toggleSound}>
              {muted ? copy.soundOn : copy.soundOff}
            </button>
          )}
        </section>

        <footer className="std-oval-video__footer">
          <div className="std-oval-video__names">
            <span>{brideName}</span><i aria-hidden="true">&amp;</i><span>{groomName}</span>
          </div>
          {venue && <p className="std-oval-video__venue">{venue}</p>}
          <p className="std-oval-video__soon">{config.closingText || copy.soon}</p>
          {config.showCalendarButton === true && dateISO && (
            <button className="std-oval-video__calendar" type="button" onClick={calendar}>
              {copy.calendar}
            </button>
          )}
        </footer>
      </div>
    </main>
  );
}
