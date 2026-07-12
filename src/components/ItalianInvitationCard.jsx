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

function ScratchCard({ value, label, onReveal, variant = "default" }) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const scratchCount = useRef(0);
  const [isRevealed, setIsRevealed] = useState(false);

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

    const isSilver = variant === "silver";

    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);

    if (isSilver) {
      gradient.addColorStop(0, "#e9edf2");
      gradient.addColorStop(0.46, "#f8fafc");
      gradient.addColorStop(1, "#d7dde5");
    } else {
      gradient.addColorStop(0, "#f1eadc");
      gradient.addColorStop(0.5, "#fbf5e9");
      gradient.addColorStop(1, "#e8dcc8");
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.fillStyle = isSilver
      ? "rgba(128, 139, 154, 0.075)"
      : "rgba(156, 119, 72, 0.06)";

    for (let i = 0; i < 28; i += 1) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * rect.width,
        Math.random() * rect.height,
        Math.random() * 2 + 0.8,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.strokeStyle = isSilver
      ? "rgba(255,255,255,0.52)"
      : "rgba(255,255,255,0.30)";
    ctx.lineWidth = 1;

    for (let i = -rect.height; i < rect.width; i += 18) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + rect.height, rect.height);
      ctx.stroke();
    }
  }, [variant]);

  const revealWholeCard = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext("2d");

    setIsRevealed(true);
    onReveal?.();

    canvas.style.transition = "opacity 0.75s ease";
    canvas.style.opacity = "0";

    setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 750);
  };

  const scratch = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

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
    if (isRevealed) return;

    isDrawing.current = true;
    scratchCount.current += 1;

    scratch(e.clientX, e.clientY);

    if (scratchCount.current >= 3) {
      revealWholeCard();
    }
  };

  const handlePointerMove = (e) => {
    if (!isDrawing.current || isRevealed) return;

    scratch(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
  };

  return (
    <div className="italian-scratch-item">
      <div className="italian-scratch-box">
        <div className="italian-scratch-value">{value}</div>

        {!isRevealed && (
          <canvas
            ref={canvasRef}
            className="italian-scratch-canvas"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          />
        )}
      </div>

      <div className="italian-scratch-label">{label}</div>
    </div>
  );
}

function ConfettiBurst({ active }) {
  if (!active) return null;

  const pieces = Array.from({ length: 26 });

  return (
    <div className="italian-confetti-layer" aria-hidden="true">
      {pieces.map((_, index) => {
        const x = Math.random() * 100;
        const delay = Math.random() * 0.25;
        const duration = 3.2 + Math.random() * 1.4;
        const rotate = Math.random() * 360;
        const size = 6 + Math.random() * 8;

        return (
          <span
            key={index}
            className="italian-confetti-piece"
            style={{
              left: `${x}%`,
              width: `${size}px`,
              height: `${size * 1.45}px`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              transform: `rotate(${rotate}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}

function EnvelopeLetterSection({
  brideName,
  groomName,
  details = {},
  showStefan = false,
}) {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 90%", "start 30%"],
  });

  const letterY = useTransform(
    scrollYProgress,
    [0, 0.8, 1],
    [310, -210, -210]
  );

  const letterOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 1],
    [0.95, 1, 1]
  );

  const envelopeBack =
    details?.envelopeBack || "/images/italian-envelope/envelope-back.svg";

  const envelopeFront =
    details?.envelopeFront || "/images/italian-envelope/envelope-front.svg";

  const letterIntro = details?.letterIntro || "Dragi naši,";

  const letterText1 =
    details?.letterText1 ||
    "Najlepši trenuci u životu postaju još lepši kada se dele sa dragim ljudima.";

  const letterText2 =
    details?.letterText2 ||
    "Pozivamo vas da zajedno sa nama nazdravite ljubavi, sreći i novim počecima.";

  return (
    <section className="italian-letter-section" ref={sectionRef}>
      <div className="italian-letter-sticky">
        <div className="italian-envelope-scene">
          <img
            className="italian-envelope-back-img"
            src={envelopeBack}
            alt=""
            aria-hidden="true"
            draggable="false"
          />

          <motion.div
            className="italian-letter-stack"
            style={{
              y: letterY,
              opacity: letterOpacity,
            }}
          >
            <div className="italian-letter-hearts">
              <span>♡</span>
              <span>♡</span>
            </div>

            <div className="italian-letter-paper">
              <p className="italian-letter-script">{letterIntro}</p>

              <p>{letterText1}</p>

              <p>{letterText2}</p>

              <p className="italian-letter-signature">
                {brideName} & {groomName}

                {showStefan && (
                  <span className="italian-letter-signature-stefan">
                    sa Stefanom
                  </span>
                )}
              </p>
            </div>
          </motion.div>

          <img
            className="italian-envelope-front-img"
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

function AnimatedEventsSection({ events = [], details = {} }) {
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

  return (
    <section className="italian-events-section" ref={sectionRef}>
      <motion.img
        className="italian-event-cloud italian-event-cloud-left"
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
        className="italian-event-cloud italian-event-cloud-right"
        src={cloudRight}
        alt=""
        aria-hidden="true"
        draggable="false"
        style={{
          x: rightCloudX,
          opacity: cloudsOpacity,
        }}
      />

      <div className="italian-events-inner">
        <motion.h2
          className="italian-events-title"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          Program dana
        </motion.h2>

        <div className="italian-timeline">
          <div className="italian-timeline-line" />

          {events.map((event, index) => {
            const isLeft = index % 2 === 1;

            return (
              <motion.div
                className={`italian-timeline-row ${
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
                <div className="italian-timeline-dot" />

                <div className="italian-timeline-content">
                  <div className="italian-timeline-time">{event.time}</div>

                  <div className="italian-timeline-label">{event.label}</div>

                  {event.location && (
                    <div className="italian-timeline-location">
                      {event.location}
                    </div>
                  )}

                  {event.mapLink && (
                    <a
                      className="italian-timeline-map"
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

function ItalianInvitationCard({
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  venue,
  videoSrc,
  details = {},
  slug,
  type = "wedding",
  script = "latin",
}) {
  const safeBrideName = brideName || "Bride";
  const safeGroomName = groomName || "Groom";

  const isDorotejaDragan = slug === "doroteja-dragan";

  const dateText = details?.date || weddingDate;

  const heroText =
    details?.heroText || details?.invitationText || "se venčavaju";

  const heroScriptText = details?.heroScriptText || "";
  const heroSubText = details?.heroSubText || "";

  const events = details?.events || [];
  const dateParts = getDateParts(dateText);

  const italianVariantClass = details?.italianVariant
    ? `italian-${details.italianVariant}`
    : "";

  const slugClass = slug ? `italian-slug-${slug}` : "";

  const scratchVariant =
    details?.italianVariant === "silver" ? "silver" : "default";

  const [revealedDateParts, setRevealedDateParts] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleDatePartReveal = () => {
    setRevealedDateParts((prev) => {
      const next = prev + 1;

      if (next === 3) {
        setShowConfetti(true);

        setTimeout(() => {
          setShowConfetti(false);
        }, 4000);
      }

      return next;
    });
  };

  return (
    <>
      <main className={`italian-card-page ${italianVariantClass} ${slugClass}`}>
        <section className="italian-hero">
          <video
            className="italian-hero-video"
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />

          <div className="italian-hero-overlay" />

          <motion.div
            className="italian-hero-content"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.4,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.25,
            }}
          >
            <div className="italian-names">
              {safeBrideName} <span>&</span> {safeGroomName}
            </div>

            <div className="italian-subtitle">{heroText}</div>

            {heroScriptText && (
              <div className="italian-names italian-hero-script-text">
                {heroScriptText}
              </div>
            )}

            {heroSubText && (
              <div className="italian-subtitle italian-subtitle-extra">
                {heroSubText}
              </div>
            )}
          </motion.div>
        </section>

        <section className="italian-date-section">
          <motion.div
            className="italian-date-inner"
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="italian-date-title">Datum</h2>

            {isDorotejaDragan ? (
              <>
                <div className="italian-plain-date">
                  <span className="italian-plain-date-day">{dateParts.day}</span>
                  <span className="italian-plain-date-month">
                    {dateParts.month}
                  </span>
                  <span className="italian-plain-date-year">{dateParts.year}</span>
                </div>

                <div className="italian-date-occasion" aria-hidden="true">
                  <span className="italian-date-occasion-line" />
                  <span className="italian-date-occasion-symbol">◆</span>
                  <span className="italian-date-occasion-line" />
                </div>

                <p className="italian-date-caption">
                  <span className="italian-date-caption-main">
                    Venčanje Doroteje i Dragana
                  </span>

                  <span className="italian-date-caption-secondary">
                    i krštenje našeg sina Stefana
                  </span>
                </p>
              </>
            ) : (
              <>
                <p className="italian-date-subtitle">
                  ✦ Ogrebi da otkriješ datum ✦
                </p>

                <div className="italian-date-reveal-wrap">
                  <ConfettiBurst active={showConfetti} />

                  <div className="italian-scratch-grid">
                    <ScratchCard
                      value={dateParts.day}
                      label="DAN"
                      variant={scratchVariant}
                      onReveal={handleDatePartReveal}
                    />

                    <ScratchCard
                      value={dateParts.month}
                      label="MESEC"
                      variant={scratchVariant}
                      onReveal={handleDatePartReveal}
                    />

                    <ScratchCard
                      value={dateParts.year}
                      label="GODINA"
                      variant={scratchVariant}
                      onReveal={handleDatePartReveal}
                    />
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </section>

        <EnvelopeLetterSection
          brideName={safeBrideName}
          groomName={safeGroomName}
          showStefan={isDorotejaDragan}
          details={
            isDorotejaDragan
              ? {
                  ...details,
                  letterIntro: "Dragi naši,",
                  letterText1:
                    "Sa velikom radošću pozivamo vas da budete deo jednog posebnog dana – dana našeg venčanja i Stefanovog krštenja.",
                  letterText2:
                    "Biće nam neizmerna čast da ove nezaboravne trenutke ljubavi i porodične sreće podelimo upravo sa vama.",
                }
              : details
          }
        />

        {events.length > 0 && (
          <AnimatedEventsSection events={events} details={details} />
        )}
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
          slug={slug}
        />
      )}
    </>
  );
}

export default ItalianInvitationCard;