import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

function IntroHeart({
  brideName,
  groomName,
  weddingDate,
  backgroundImage,
  details = {},
  onEnter,
  onStartMusic,
}) {
  const [started, setStarted] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const sceneRef = useRef(null);

  const bg =
    backgroundImage ||
    details?.backgroundImage ||
    "/images/floral-olja-milos.jpg";

  const cardImage =
    details?.introCardImage ||
    "/images/intro-heart-card.png";

  /* Floating dust particles — spawned once on mount */
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const particles = [];

    for (let i = 0; i < 20; i++) {
      const el = document.createElement("span");
      el.className = "hi-dust";
      el.style.cssText = `
        left: ${8 + Math.random() * 84}%;
        bottom: ${Math.random() * 28}%;
        width: ${1 + Math.random() * 2}px;
        height: ${1 + Math.random() * 2}px;
        --dx: ${-35 + Math.random() * 70}px;
        animation-duration: ${5 + Math.random() * 9}s;
        animation-delay: ${Math.random() * 9}s;
      `;
      scene.appendChild(el);
      particles.push(el);
    }

    const glyphs = ["♥", "·", "✦", "⋆", "∗"];

    for (let i = 0; i < 24; i++) {
      const el = document.createElement("span");
      el.className = "hi-star";
      el.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      el.style.cssText = `
        left: ${4 + Math.random() * 92}%;
        top: ${4 + Math.random() * 92}%;
        font-size: ${5 + Math.random() * 9}px;
        animation-duration: ${3 + Math.random() * 5}s;
        animation-delay: ${Math.random() * 6}s;
      `;
      scene.appendChild(el);
      particles.push(el);
    }

    return () => particles.forEach((el) => el.remove());
  }, []);

  /* 54 heart particles pre-computed */
  const hearts = useMemo(() => {
    return Array.from({ length: 54 }).map((_, index) => {
      const angle = (360 / 54) * index + Math.random() * 16;
      const distance = 110 + Math.random() * 180;
      const size = 9 + Math.random() * 16;
      const rotate = -45 + Math.random() * 90;
      const delay = Math.random() * 0.14;

      return {
        id: index,
        angle,
        distance,
        size,
        rotate,
        delay,
      };
    });
  }, []);

  const handleOpen = () => {
    if (started) return;

    setStarted(true);

    if (onStartMusic) {
      onStartMusic();
    }

    setTimeout(() => setLeaving(true), 1450);

    setTimeout(() => {
      if (onEnter) onEnter();
    }, 2050);
  };

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.section
          className="hi-root"
          ref={sceneRef}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          {/* Background photo */}
          <div
            className={`hi-bg${bg ? " has-image" : ""}`}
            style={bg ? { backgroundImage: `url(${bg})` } : undefined}
          />

          {/* Atmospheric layers */}
          <div className="hi-overlay" />
          <div className="hi-vignette" />

          {/* Bokeh orbs */}
          <div className="hi-bokeh hi-bokeh--1" />
          <div className="hi-bokeh hi-bokeh--2" />
          <div className="hi-bokeh hi-bokeh--3" />

          {/* Card content */}
          <motion.div
            className="hi-card"
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 1.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Image card frame */}
            <div
              className="hi-card-frame"
              style={{ backgroundImage: `url(${cardImage})` }}
            />

            {/* Kicker */}
            <motion.p
              className="hi-kicker"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.8 }}
            >
              Pozivnica za venčanje
            </motion.p>

            {/* Names */}
            <motion.h1
              className="hi-names"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.9 }}
            >
              {brideName}
              <em>&amp;</em>
              {groomName}
            </motion.h1>

            {/* Date */}
            <motion.div
              className="hi-date"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {weddingDate}
            </motion.div>

            {/* Ornament */}
            <motion.div
              className="hi-ornament"
              initial={{ opacity: 0, scaleX: 0.4 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.72, duration: 0.7 }}
            >
              <span className="hi-ornament-line" />
              <span className="hi-ornament-diamond" />
              <span className="hi-ornament-line" />
            </motion.div>

            {/* Heart button */}
            <motion.button
              type="button"
              className={`hi-btn${started ? " is-started" : ""}`}
              onClick={handleOpen}
              aria-label="Otvori pozivnicu"
              disabled={started}
              initial={{ opacity: 0, scale: 0.82 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.84,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={!started ? { scale: 1.04 } : undefined}
              whileTap={!started ? { scale: 0.97 } : undefined}
            >
              {/* Pulse ring */}
              <motion.span
                className="hi-btn-ring"
                animate={
                  started
                    ? { scale: 2.6, opacity: 0 }
                    : {
                        scale: [1, 1.12, 1],
                        opacity: [0.6, 0.9, 0.6],
                      }
                }
                transition={
                  started
                    ? { duration: 0.8, ease: "easeOut" }
                    : {
                        duration: 2.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                }
              />

              {/* 3D button layers */}
              <span className="hi-btn-base" />
              <span className="hi-btn-rim" />

              <span className="hi-btn-face">
                <motion.span
                  className="hi-heart-icon"
                  animate={
                    started
                      ? {
                          scale: [1, 1.6, 1.25],
                          rotate: [0, -5, 4, 0],
                        }
                      : { scale: [1, 1.07, 1] }
                  }
                  transition={
                    started
                      ? { duration: 0.7, ease: "easeOut" }
                      : {
                          duration: 1.9,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                  }
                >
                  ♥
                </motion.span>
              </span>

              {/* Label */}
              <span className="hi-btn-label">
                {started ? "Otvara se…" : "Otvori pozivnicu"}
              </span>

              {/* Burst particles */}
              {started && (
                <span className="hi-particles" aria-hidden="true">
                  {hearts.map((heart) => {
                    const x =
                      Math.cos((heart.angle * Math.PI) / 180) *
                      heart.distance;

                    const y =
                      Math.sin((heart.angle * Math.PI) / 180) *
                      heart.distance;

                    return (
                      <motion.span
                        key={heart.id}
                        className="hi-particle"
                        style={{
                          width: heart.size,
                          height: heart.size,
                          fontSize: heart.size,
                        }}
                        initial={{
                          x: 0,
                          y: 0,
                          scale: 0.2,
                          opacity: 0,
                          rotate: 0,
                        }}
                        animate={{
                          x,
                          y,
                          scale: [0.2, 1, 0.5],
                          opacity: [0, 1, 0],
                          rotate: heart.rotate,
                        }}
                        transition={{
                          duration: 1.4,
                          delay: heart.delay,
                          ease: "easeOut",
                        }}
                      >
                        ♥
                      </motion.span>
                    );
                  })}
                </span>
              )}
            </motion.button>

            {/* Hint */}
            <motion.p
              className="hi-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: started ? 0 : 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              Dodirnite srce
            </motion.p>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

export default IntroHeart;