import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import ItalianRSVP from "./ItalianRSVP";
import ItalianCountdown from "./ItalianCountdown";

import "../styles/card.css";
import "../styles/rsvp.css";

function getDateParts(dateText = "") {
  const clean = String(dateText).trim();

  const monthsByNumber = [
    "",
    "januar",
    "februar",
    "mart",
    "april",
    "maj",
    "jun",
    "jul",
    "avgust",
    "septembar",
    "oktobar",
    "novembar",
    "decembar",
  ];

  const numericMatch = clean.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})\.?$/);

  if (numericMatch) {
    const day = numericMatch[1];
    const monthNumber = Number(numericMatch[2]);
    const year = numericMatch[3];

    return {
      day,
      month: monthsByNumber[monthNumber] || numericMatch[2],
      year,
    };
  }

  const textMatch = clean.match(
    /^(\d{1,2})\s+([A-Za-zČĆŽŠĐčćžšđ]+)\s+(\d{4})$/
  );

  if (textMatch) {
    const day = textMatch[1];
    const monthRaw = textMatch[2].toUpperCase();
    const year = textMatch[3];

    const monthMap = {
      JAN: "januar",
      FEB: "februar",
      MAR: "mart",
      APR: "april",
      MAY: "maj",
      MAJ: "maj",
      JUN: "jun",
      JUL: "jul",
      AUG: "avgust",
      AVG: "avgust",
      SEP: "septembar",
      SEPT: "septembar",
      OKT: "oktobar",
      OCT: "oktobar",
      NOV: "novembar",
      DEC: "decembar",
    };

    return {
      day,
      month: monthMap[monthRaw] || textMatch[2],
      year,
    };
  }

  return {
    day: "00",
    month: "mesec",
    year: "0000",
  };
}

function CallaDateCard({ value, label, delay = 0, onReveal }) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const scratchCount = useRef(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#050505");
    gradient.addColorStop(0.48, "#1a1a1a");
    gradient.addColorStop(1, "#000000");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.fillStyle = "rgba(255,255,255,0.08)";

    for (let i = 0; i < 34; i += 1) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * rect.width,
        Math.random() * rect.height,
        Math.random() * 1.8 + 0.7,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    ctx.lineWidth = 1;

    for (let i = -rect.height; i < rect.width; i += 16) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + rect.height, rect.height);
      ctx.stroke();
    }

    ctx.font = "11px Cormorant Garamond, serif";
    ctx.fillStyle = "rgba(255,255,255,0.68)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("OGREBI", rect.width / 2, rect.height / 2);
  }, []);

  const revealWholeCard = () => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;

    const ctx = canvas.getContext("2d");

    setRevealed(true);
    onReveal?.();

    canvas.style.transition = "opacity 0.75s ease, filter 0.75s ease";
    canvas.style.opacity = "0";
    canvas.style.filter = "blur(6px)";

    setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 750);
  };

  const scratch = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();
  };

  const handlePointerDown = (e) => {
    if (revealed) return;

    isDrawing.current = true;
    scratchCount.current += 1;

    scratch(e.clientX, e.clientY);

    if (scratchCount.current >= 3) {
      revealWholeCard();
    }
  };

  const handlePointerMove = (e) => {
    if (!isDrawing.current || revealed) return;

    scratch(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
  };

  return (
    <motion.div
      className={`clace-date-card ${revealed ? "is-revealed" : ""}`}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ delay, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="clace-date-scratch-box">
        <span className="clace-date-value">{value}</span>

        {!revealed && (
          <canvas
            ref={canvasRef}
            className="clace-date-scratch-canvas"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          />
        )}
      </div>

      <span className="clace-date-label">{label}</span>
    </motion.div>
  );
}

function CallaLetterSection({ brideName, groomName, details = {} }) {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 90%", "start 30%"],
  });

  const paperY = useTransform(
    scrollYProgress,
    [0, 0.8, 1],
    [310, -210, -210]
  );

  const paperOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 1],
    [0.95, 1, 1]
  );

  const envelopeBack =
    details?.envelopeBack || "/images/italian-envelope/callalace-back.svg";

  const envelopeFront =
    details?.envelopeFront || "/images/italian-envelope/callalace-front.svg";

  const letterIntro = details?.letterIntro || "Dragi naši,";

  const letterText1 =
    details?.letterText1 ||
    "Sa velikom radošću vas pozivamo da budete deo dana koji za nas označava početak najlepšeg zajedničkog poglavlja.";

  const letterText2 =
    details?.letterText2 ||
    "Vaše prisustvo učiniće ovaj trenutak još toplijim, svečanijim i nezaboravnim.";

  return (
    <section className="clace-letter-section" ref={sectionRef}>
      <div className="clace-letter-sticky">
        <div className="clace-envelope-scene">
          <img
            className="clace-envelope-back-img"
            src={envelopeBack}
            alt=""
            aria-hidden="true"
            draggable="false"
          />

          <motion.div
            className="clace-letter-stack"
            style={{
              y: paperY,
              opacity: paperOpacity,
            }}
          >
            <div className="clace-letter-hearts">
              <span>♡</span>
              <span>♡</span>
            </div>

            <div className="clace-letter-paper">
              <p className="clace-letter-script">{letterIntro}</p>

              <p>{letterText1}</p>

              <p>{letterText2}</p>

              <p className="clace-letter-signature">
                {brideName} & {groomName}
              </p>
            </div>
          </motion.div>

          <img
            className="clace-envelope-front-img"
            src={envelopeFront}
            alt=""
            aria-hidden="true"
            draggable="false"
          />
        </div>
      </div>
    </section>
  );
}

function CallaEventsSection({ events = [], details = {} }) {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "start -20%"],
  });

  const leftCloudX = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 1],
    ["0%", "0%", "-55%", "-125%"]
  );

  const rightCloudX = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 1],
    ["0%", "0%", "55%", "125%"]
  );

  const cloudsOpacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.6, 1],
    [1, 1, 0.75, 0]
  );

  const cloudLeft =
    details?.cloudLeft || "/images/italian-clouds/cloud-left.svg";

  const cloudRight =
    details?.cloudRight || "/images/italian-clouds/cloud-right.svg";

  if (!events.length) return null;

  return (
    <section className="clace-events-section" ref={sectionRef}>
      <motion.img
        className="clace-event-cloud clace-event-cloud-left"
        src={cloudLeft}
        alt=""
        aria-hidden="true"
        draggable="false"
        style={{
          x: leftCloudX,
          opacity: cloudsOpacity,
        }}
      />

      <motion.img
        className="clace-event-cloud clace-event-cloud-right"
        src={cloudRight}
        alt=""
        aria-hidden="true"
        draggable="false"
        style={{
          x: rightCloudX,
          opacity: cloudsOpacity,
        }}
      />

      <div className="clace-events-inner">
        <motion.h2
          className="clace-events-title"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          Program dana
        </motion.h2>

        <div className="clace-timeline">
          <div className="clace-timeline-line" />

          {events.map((event, index) => {
            const isLeft = index % 2 === 1;

            return (
              <motion.div
                className={`clace-timeline-row ${
                  isLeft ? "is-left" : "is-right"
                }`}
                key={`${event.label}-${event.time}-${index}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{
                  duration: 0.75,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="clace-timeline-dot" />

                <div className="clace-timeline-content">
                  <div className="clace-timeline-time">{event.time}</div>

                  <div className="clace-timeline-label">{event.label}</div>

                  {event.location && (
                    <div className="clace-timeline-location">
                      {event.location}
                    </div>
                  )}

                  {event.mapLink && (
                    <a
                      className="clace-timeline-map"
                      href={event.mapLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Otvori mapu
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CallaLaceInvitationCard({
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  venue,
  videoSrc,
  backgroundImage,
  details = {},
  slug,
  type = "wedding",
  script = "latin",
}) {
  const safeBrideName = brideName || "Tamara";
  const safeGroomName = groomName || "Viktor";

  const bg =
    details?.backgroundImage || backgroundImage || "/images/calla-lace-bg.jpg";

  const dateText = details?.date || weddingDate;
  const dateParts = getDateParts(dateText);

  const heroText =
    details?.heroText ||
    details?.invitationText ||
    "sa radošću vas pozivaju da budete deo njihovog dana";

  const events = details?.events || [];

  return (
    <>
      <main className="clace-card-page">
        <section className="clace-card-hero">
          {videoSrc ? (
            <video
              className="clace-card-hero-media"
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          ) : (
            <div
              className="clace-card-hero-media clace-card-hero-image"
              style={{ backgroundImage: `url(${bg})` }}
            />
          )}

          <div className="clace-card-hero-overlay" />

          <motion.div
            className="clace-card-hero-content"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.25,
              duration: 1.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p className="clace-card-kicker">Pozivnica za venčanje</p>

            <h1 className="clace-card-names">
              <span>{safeBrideName}</span>
              <em>&amp;</em>
              <span>{safeGroomName}</span>
            </h1>

            <p className="clace-card-hero-text">{heroText}</p>
          </motion.div>
        </section>

        <section className="clace-date-section">
          <motion.div
            className="clace-date-inner"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="clace-section-kicker">Sačuvajte datum</p>

            <h2 className="clace-section-title">Kada?</h2>

            <p className="clace-date-help">Ogrebi da otkriješ datum</p>

            <div className="clace-date-grid">
              <CallaDateCard value={dateParts.day} label="dan" delay={0.05} />

              <CallaDateCard
                value={dateParts.month}
                label="mesec"
                delay={0.12}
              />

              <CallaDateCard
                value={dateParts.year}
                label="godina"
                delay={0.19}
              />
            </div>

            {weddingTime && (
              <p className="clace-date-time">
                Početak u <strong>{weddingTime}</strong>
              </p>
            )}

            {venue && <p className="clace-date-venue">{venue}</p>}
          </motion.div>
        </section>

        <CallaLetterSection
          brideName={safeBrideName}
          groomName={safeGroomName}
          details={details}
        />

        <CallaEventsSection events={events} details={details} />
      </main>

      <ItalianRSVP
        slug={slug}
        eventType={type}
        brideName={safeBrideName}
        groomName={safeGroomName}
        details={details}
        script={script}
      />

      {details?.dateISO && (
        <ItalianCountdown
          targetDate={details.dateISO}
          brideName={safeBrideName}
          groomName={safeGroomName}
          details={details}
          script={script}
        />
      )}
    </>
  );
}

export default CallaLaceInvitationCard;