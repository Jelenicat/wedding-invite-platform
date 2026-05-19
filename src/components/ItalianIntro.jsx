import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import "../styles/intro.css";

function preloadImage(src) {
  return new Promise((resolve) => {
    if (!src) {
      resolve();
      return;
    }

    const img = new Image();

    img.onload = async () => {
      try {
        if (img.decode) {
          await img.decode();
        }
      } catch {
        // Ako browser ne uspe decode, ne blokiramo prikaz.
      }

      resolve();
    };

    img.onerror = () => {
      // Ne blokiramo pozivnicu ako neka slika fali,
      // ali proveri u Network tabu ako se nešto ne prikaže.
      resolve();
    };

    img.src = src;
  });
}

function ItalianIntro({
  onEnter,
  onReveal,
  onStartMusic,
  slug,
  backgroundImage,
  details = {},
}) {
  const [opened, setOpened] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);

  const leftImage =
    details?.envelopeLeftImage || `/images/envelope/${slug}-left.svg`;

  const rightImage =
    details?.envelopeRightImage || `/images/envelope/${slug}-right.svg`;

  const topImage =
    details?.envelopeTopImage || `/images/envelope/${slug}-top.svg`;

  const bottomImage =
    details?.envelopeBottomImage || `/images/envelope/${slug}-bottom.svg`;

  const centerImage =
    details?.envelopeCenterImage || `/images/envelope/${slug}-center.svg`;

  const imagesToLoad = useMemo(() => {
    return [
      leftImage,
      rightImage,
      topImage,
      bottomImage,
      centerImage,
      backgroundImage,
    ]
      .filter(Boolean)
      .filter((src, index, array) => array.indexOf(src) === index);
  }, [
    leftImage,
    rightImage,
    topImage,
    bottomImage,
    centerImage,
    backgroundImage,
  ]);

  useEffect(() => {
    let isMounted = true;

    setImagesReady(false);

    Promise.all(imagesToLoad.map((src) => preloadImage(src))).then(() => {
      if (isMounted) {
        setImagesReady(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [imagesToLoad]);

  const handleOpen = () => {
    if (opened || !imagesReady) return;

    setOpened(true);

    onStartMusic?.();
    onReveal?.();

    setTimeout(() => {
      setHidden(true);
      onEnter?.();
    }, 5200);
  };

  if (hidden || !imagesReady) return null;

  return (
    <motion.section
      className="fourway-envelope-overlay"
      onClick={handleOpen}
      animate={
        opened
          ? {
              opacity: 0,
              filter: "blur(3px)",
            }
          : {
              opacity: 1,
              filter: "blur(0px)",
            }
      }
      transition={{
        duration: 3.6,
        ease: [0.22, 1, 0.36, 1],
        delay: opened ? 1.6 : 0,
      }}
    >
      <motion.img
        src={topImage}
        alt=""
        className="fourway-envelope-part fourway-envelope-top"
        draggable={false}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        animate={
          opened
            ? {
                y: "-62vh",
                scale: 1.04,
                rotate: -1.5,
              }
            : {
                y: 0,
                scale: 1,
                rotate: 0,
              }
        }
        transition={{
          duration: 4.8,
          ease: [0.16, 1, 0.3, 1],
        }}
      />

      <motion.img
        src={bottomImage}
        alt=""
        className="fourway-envelope-part fourway-envelope-bottom"
        draggable={false}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        animate={
          opened
            ? {
                y: "64vh",
                scale: 1.04,
                rotate: 1.2,
              }
            : {
                y: 0,
                scale: 1,
                rotate: 0,
              }
        }
        transition={{
          duration: 4.8,
          ease: [0.16, 1, 0.3, 1],
        }}
      />

      <motion.img
        src={leftImage}
        alt=""
        className="fourway-envelope-part fourway-envelope-left"
        draggable={false}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        animate={
          opened
            ? {
                x: "-68vw",
                scale: 1.04,
                rotate: -2.5,
              }
            : {
                x: 0,
                scale: 1,
                rotate: 0,
              }
        }
        transition={{
          duration: 4.8,
          ease: [0.16, 1, 0.3, 1],
        }}
      />

      <motion.img
        src={rightImage}
        alt=""
        className="fourway-envelope-part fourway-envelope-right"
        draggable={false}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        animate={
          opened
            ? {
                x: "68vw",
                scale: 1.04,
                rotate: 2.5,
              }
            : {
                x: 0,
                scale: 1,
                rotate: 0,
              }
        }
        transition={{
          duration: 4.8,
          ease: [0.16, 1, 0.3, 1],
        }}
      />

      <motion.img
        src={centerImage}
        alt=""
        className="fourway-envelope-part fourway-envelope-center-piece"
        draggable={false}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        animate={
          opened
            ? {
                opacity: 0,
                scale: 0.82,
                filter: "blur(8px)",
              }
            : {
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
              }
        }
        transition={{
          duration: 1.35,
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      <motion.button
        type="button"
        className="fourway-envelope-open-btn"
        aria-label="Otvori pozivnicu"
        animate={
          opened
            ? {
                opacity: 0,
                y: 12,
                filter: "blur(6px)",
              }
            : {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }
        }
        transition={{
          duration: 1,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        Klikni da otvoriš
      </motion.button>
    </motion.section>
  );
}

export default ItalianIntro;