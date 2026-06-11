import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import GoldPrintVideoRSVP from "./GoldPrintVideoRSVP";
import GoldPrintVideoCountdown from "./GoldPrintVideoCountdown";

import "../styles/card.css";
import "../styles/rsvp.css";

function getDateParts(dateText = "") {
  const clean = String(dateText).trim();

  const monthsByNumber = [
    "",
    "јануар",
    "фебруар",
    "март",
    "април",
    "мај",
    "јун",
    "јул",
    "август",
    "септембар",
    "октобар",
    "новембар",
    "децембар",
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
    /^(\d{1,2})\s+([A-Za-zČĆŽŠĐčćžšđА-Яа-яЉљЊњЂђЋћЏџ]+)\s+(\d{4})$/
  );

  if (textMatch) {
    const day = textMatch[1];
    const monthRaw = textMatch[2].toUpperCase();
    const year = textMatch[3];

    const monthMap = {
      JAN: "јануар",
      JANUAR: "јануар",
      ЈАН: "јануар",
      ЈАНУАР: "јануар",

      FEB: "фебруар",
      FEBRUAR: "фебруар",
      ФЕБ: "фебруар",
      ФЕБРУАР: "фебруар",

      MAR: "март",
      MART: "март",
      МАР: "март",
      МАРТ: "март",

      APR: "април",
      APRIL: "април",
      АПР: "април",
      АПРИЛ: "април",

      MAY: "мај",
      MAJ: "мај",
      МАЈ: "мај",

      JUN: "јун",
      ЈУН: "јун",

      JUL: "јул",
      ЈУЛ: "јул",

      AUG: "август",
      AVG: "август",
      AVGUST: "август",
      АВГ: "август",
      АВГУСТ: "август",

      SEP: "септембар",
      SEPT: "септембар",
      SEPTEMBAR: "септембар",
      СЕП: "септембар",
      СЕПТЕМБАР: "септембар",

      OKT: "октобар",
      OCT: "октобар",
      OKTOBAR: "октобар",
      ОКТ: "октобар",
      ОКТОБАР: "октобар",

      NOV: "новембар",
      NOVEMBAR: "новембар",
      НОВ: "новембар",
      НОВЕМБАР: "новембар",

      DEC: "децембар",
      DECEMBAR: "децембар",
      ДЕЦ: "децембар",
      ДЕЦЕМБАР: "децембар",
    };

    return {
      day,
      month: monthMap[monthRaw] || textMatch[2],
      year,
    };
  }

  return {
    day: "00",
    month: "мјесец",
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
    <div className="goldprint-video-scratch-item">
      <div className="goldprint-video-scratch-box">
        <div className="goldprint-video-scratch-value">{value}</div>

        {!isRevealed && (
          <canvas
            ref={canvasRef}
            className="goldprint-video-scratch-canvas"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          />
        )}
      </div>

      <div className="goldprint-video-scratch-label">{label}</div>
    </div>
  );
}

function FireworksBurst({ active }) {
  if (!active) return null;

const bursts = [
  { x: "16%", y: "80px", delay: 0 },
  { x: "50%", y: "60px", delay: 0.22 },
  { x: "84%", y: "80px", delay: 0.42 },
  { x: "30%", y: "100px", delay: 0.62 },
  { x: "68%", y: "100px", delay: 0.8 },
];

  const colors = [
    "#fff6d2", "#f4d783", "#d6a341", "#b98228",
    "#ffe066", "#ffd700", "#ffffff", "#e8c96a",
  ];

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: "-40px",
        pointerEvents: "none",
        overflow: "visible",
        zIndex: 8,
      }}
    >
      {bursts.map((burst, bi) =>
        Array.from({ length: 32 }).map((_, i) => {
          const angle = (Math.PI * 2 * i) / 32;
          const length = 38 + Math.random() * 55;
          const color = colors[i % colors.length];
          const width = 1.2 + Math.random() * 1.2;

          return (
            <motion.div
              key={`${bi}-${i}`}
              style={{
                position: "absolute",
                left: burst.x,
                top: burst.y,
                width: width,
                height: length,
                borderRadius: 999,
                background: `linear-gradient(180deg, ${color} 0%, rgba(255,241,184,0.6) 40%, transparent 100%)`,
                boxShadow: `0 0 4px ${color}, 0 0 10px rgba(255,220,100,0.3)`,
                transformOrigin: "top center",
                rotate: `${(angle * 180) / Math.PI + 90}deg`,
              }}
              initial={{
                x: 0,
                y: 0,
                scaleY: 0,
                opacity: 0,
              }}
              animate={{
                x: Math.cos(angle) * (length * 0.5),
                y: Math.sin(angle) * (length * 0.5),
                scaleY: [0, 1, 1, 0.4],
                opacity: [0, 1, 0.85, 0],
              }}
              transition={{
                duration: 1.4 + Math.random() * 0.4,
                delay: burst.delay + i * 0.008,
                ease: [0.2, 0.8, 0.4, 1],
              }}
            />
          );
        })
      )}
    </div>
  );
}

function ConfettiBurst({ active }) {
  if (!active) return null;

  const pieces = Array.from({ length: 26 });

  return (
    <div className="goldprint-video-confetti-layer" aria-hidden="true">
      {pieces.map((_, index) => {
        const x = Math.random() * 100;
        const delay = Math.random() * 0.25;
        const duration = 3.2 + Math.random() * 1.4;
        const rotate = Math.random() * 360;
        const size = 6 + Math.random() * 8;

        return (
          <span
            key={index}
            className="goldprint-video-confetti-piece"
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

function EnvelopeLetterSection({ brideName, groomName, details = {} }) {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 90%", "start 20%"],
  });

  const letterY = useTransform(
    scrollYProgress,
    [0, 0.42, 1],
    [300, -50, -210]
  );

  const letterOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 1],
    [0.96, 1, 1]
  );

  const leftSwanX = useTransform(
    scrollYProgress,
    [0, 0.34, 1],
    ["0px", "-70px", "-240px"]
  );

  const rightSwanX = useTransform(
    scrollYProgress,
    [0, 0.34, 1],
    ["0px", "70px", "240px"]
  );

  const swanOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1, 0.92, 0]
  );

  const envelopeLeft =
    details?.envelopeLeft ||
    details?.swanLeft ||
    "/images/goldprint-envelope/envelope-left.svg";

  const envelopeRight =
    details?.envelopeRight ||
    details?.swanRight ||
    "/images/goldprint-envelope/envelope-right.svg";

  const letterCrestSvg =
    details?.letterCrestSvg ||
    details?.familyCrestSvg ||
    "/images/crests/family-crest.svg";

  const letterIntro = details?.letterIntro || "У срцу Херцеговине,";

  const letterText1 =
    details?.letterText1 ||
    "тамо гдје сунце најтоплије грли небо, а камен чува приче о вјечности, куцнуо је час да и ми испишемо наше најважније поглавље.";

  const letterText2 =
    details?.letterText2 ||
    "Под окриљем љубави која нас покреће, желимо да крунишемо наш заједнички пут и закорачимо у нови почетак.";

  return (
    <section className="goldprint-video-letter-section" ref={sectionRef}>
      <div className="goldprint-video-letter-sticky">
        <div className="goldprint-video-envelope-scene">
          <motion.div
            className="goldprint-video-letter-stack"
            style={{
              y: letterY,
              opacity: letterOpacity,
            }}
          >
            <div className="goldprint-video-letter-hearts">
              <span>♡</span>
              <span>♡</span>
            </div>

            <div className="goldprint-video-letter-paper">
             
              <p className="goldprint-video-letter-script">{letterIntro}</p>

              <p>{letterText1}</p>
              <p>{letterText2}</p>
             

              <p className="goldprint-video-letter-signature">
                {brideName} & {groomName}
              </p>

            </div>
          </motion.div>

          <motion.div
            className="goldprint-video-swan-wrap goldprint-video-swan-wrap-left"
            style={{
              x: leftSwanX,
              opacity: swanOpacity,
            }}
          >
            <img
              className="goldprint-video-envelope-left-img"
              src={envelopeLeft}
              alt=""
              aria-hidden="true"
              draggable="false"
            />
          </motion.div>

          <motion.div
            className="goldprint-video-swan-wrap goldprint-video-swan-wrap-right"
            style={{
              x: rightSwanX,
              opacity: swanOpacity,
            }}
          >
            <img
              className="goldprint-video-envelope-right-img"
              src={envelopeRight}
              alt=""
              aria-hidden="true"
              draggable="false"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function AnimatedEventsSection({ events = [], details = {} }) {
  const sectionRef = useRef(null);

  const programText =
    details?.programText ||
    "Срећа је стварна само онда када се дијели са онима које волимо. Зато вас позивамо да својом близином, осмијехом и топлином увеличате наш најважнији дан и са нама подијелите радост овог вјечног обећања.";

  const programOrnamentSvg =
    details?.programOrnamentSvg ||
    "/images/ornaments/goldprint-wide.svg";

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
    <section className="goldprint-video-events-section" ref={sectionRef}>
      <motion.img
        className="goldprint-video-event-cloud goldprint-video-event-cloud-left"
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
        className="goldprint-video-event-cloud goldprint-video-event-cloud-right"
        src={cloudRight}
        alt=""
        aria-hidden="true"
        draggable="false"
        style={{
          x: rightCloudX,
          opacity: cloudsOpacity,
        }}
      />

      <div className="goldprint-video-events-inner">
        <motion.h2
          className="goldprint-video-events-title"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          Програм дана
        </motion.h2>

        <div className="goldprint-video-timeline">
          <div className="goldprint-video-timeline-line" />

          {events.map((event, index) => {
            const isLeft = index % 2 === 1;

            return (
              <motion.div
                className={`goldprint-video-timeline-row ${
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
                <div className="goldprint-video-timeline-dot" />

                <div className="goldprint-video-timeline-content">
                  <div className="goldprint-video-timeline-time">
                    {event.time}
                  </div>

                  <div className="goldprint-video-timeline-label">
                    {event.label}
                  </div>

                  {event.location && (
                    <div className="goldprint-video-timeline-location">
                      {event.location}
                    </div>
                  )}

                  {event.description && (
                    <div className="goldprint-video-timeline-description">
                      {event.description}
                    </div>
                  )}

                  {event.mapLink && (
                    <a
                      className="goldprint-video-timeline-map"
                      href={event.mapLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Отвори мапу
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="goldprint-video-events-wide-ornament-wrap"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{
            duration: 0.9,
            delay: 0.05,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <img
            className="goldprint-video-events-wide-ornament"
            src={programOrnamentSvg}
            alt=""
            aria-hidden="true"
            draggable="false"
          />
        </motion.div>

        <motion.p
          className="goldprint-video-events-note"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{
            duration: 0.9,
            delay: 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {programText}
        </motion.p>
      </div>
    </section>
  );
}

function GoldPrintVideoInvitationCard({
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  venue,
  videoSrc,
  details = {},
  slug,
  type = "wedding",
  script = "cyrillic",
}) {
  const safeBrideName = brideName || "Млада";
  const safeGroomName = groomName || "Младожења";

  const finalVideoSrc =
    details?.videoSrc ||
    details?.video ||
    details?.heroVideo ||
    videoSrc;

  const heroSvg =
    details?.heroSvg ||
    details?.introSvg ||
    details?.monogramSvg ||
    details?.namesSvg;

  const cornerSvg =
    details?.cornerSvg || "/images/goldprint-corners/corner.svg";

  const dateText = details?.date || weddingDate;

  const heroText =
    details?.heroText || details?.invitationText || "се вјенчавају";

  const events = details?.events || [];
  const dateParts = getDateParts(dateText);

  const goldPrintVariantClass = details?.goldPrintVariant
    ? `goldprint-video-${details.goldPrintVariant}`
    : "";

  const slugClass = slug ? `goldprint-video-slug-${slug}` : "";

  const scratchVariant =
    details?.goldPrintVariant === "silver" ? "silver" : "default";

  const [showFireworks, setShowFireworks] = useState(false);
  const revealedDateParts = useRef(0);

  const handleDatePartReveal = () => {
    revealedDateParts.current += 1;

    if (revealedDateParts.current === 3) {
      setShowFireworks(true);

      setTimeout(() => {
        setShowFireworks(false);
      }, 4000);
    }
  };

  return (
    <>
      <main
        className={`goldprint-video-card-page ${goldPrintVariantClass} ${slugClass}`}
      >
        <section className="goldprint-video-hero">
          <video
            className="goldprint-video-hero-video"
            src={finalVideoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />

          <div className="goldprint-video-hero-overlay" />

          <motion.div
            className="goldprint-video-hero-content"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.4,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.25,
            }}
          >
            {heroSvg ? (
              <div className="goldprint-video-hero-name-box">
                <img
                  className="goldprint-video-corner goldprint-video-corner-tl"
                  src={cornerSvg}
                  alt=""
                  aria-hidden="true"
                  draggable="false"
                />

                <img
                  className="goldprint-video-corner goldprint-video-corner-tr"
                  src={cornerSvg}
                  alt=""
                  aria-hidden="true"
                  draggable="false"
                />

                <img
                  className="goldprint-video-corner goldprint-video-corner-br"
                  src={cornerSvg}
                  alt=""
                  aria-hidden="true"
                  draggable="false"
                />

                <img
                  className="goldprint-video-corner goldprint-video-corner-bl"
                  src={cornerSvg}
                  alt=""
                  aria-hidden="true"
                  draggable="false"
                />

                <motion.img
                  className="goldprint-video-hero-svg-img"
                  src={heroSvg}
                  alt={`${safeBrideName} & ${safeGroomName}`}
                  draggable="false"
                  initial={{ opacity: 0, scale: 0.96, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    duration: 1.25,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.35,
                  }}
                />

                <div className="goldprint-video-subtitle goldprint-video-subtitle-gold">
                  {heroText}
                </div>
              </div>
            ) : (
              <>
                <div className="goldprint-video-names">
                  {safeBrideName} <span>&</span> {safeGroomName}
                </div>

                <div className="goldprint-video-subtitle">{heroText}</div>
              </>
            )}
          </motion.div>
        </section>

        <section className="goldprint-video-date-section">
          <motion.div
            className="goldprint-video-date-inner"
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="goldprint-video-date-title">Када?</h2>

            <p className="goldprint-video-date-subtitle">
              <img
                className="goldprint-video-date-subtitle-svg goldprint-video-date-subtitle-svg-left"
                src={
                  details?.scratchOrnamentSvg ||
                  "/images/ornaments/goldprint-small.svg"
                }
                alt=""
                aria-hidden="true"
                draggable="false"
              />

              <span>Огреби да откријеш датум</span>

              <img
                className="goldprint-video-date-subtitle-svg goldprint-video-date-subtitle-svg-right"
                src={
                  details?.scratchOrnamentSvg ||
                  "/images/ornaments/goldprint-small.svg"
                }
                alt=""
                aria-hidden="true"
                draggable="false"
              />
            </p>

            <div className="goldprint-video-date-reveal-wrap">
              <FireworksBurst active={showFireworks} />

              <div className="goldprint-video-scratch-grid">
                <ScratchCard
                  value={dateParts.day}
                  label="ДАН"
                  variant={scratchVariant}
                  onReveal={handleDatePartReveal}
                />

                <ScratchCard
                  value={dateParts.month}
                  label="МЈЕСЕЦ"
                  variant={scratchVariant}
                  onReveal={handleDatePartReveal}
                />

                <ScratchCard
                  value={dateParts.year}
                  label="ГОДИНА"
                  variant={scratchVariant}
                  onReveal={handleDatePartReveal}
                />
              </div>
            </div>
          </motion.div>
        </section>

        <EnvelopeLetterSection
          brideName={safeBrideName}
          groomName={safeGroomName}
          details={details}
        />

        {events.length > 0 && (
          <AnimatedEventsSection events={events} details={details} />
        )}
      </main>

      <GoldPrintVideoRSVP
        slug={slug}
        eventType={type}
        brideName={safeBrideName}
        groomName={safeGroomName}
        details={details}
        script="cyrillic"
      />

      {details?.dateISO && (
        <GoldPrintVideoCountdown
          targetDate={details.dateISO}
          brideName={safeBrideName}
          groomName={safeGroomName}
          details={details}
          script="cyrillic"
        />
      )}
    </>
  );
}

export default GoldPrintVideoInvitationCard;