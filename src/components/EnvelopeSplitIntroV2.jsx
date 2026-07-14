import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import "../styles/intro.css";

function EnvelopeSplitIntroV2({
  onEnter,
  onReveal,
  onStartMusic,
  slug,
  backgroundImage,
  introPreviewImage,
}) {
  const [opened, setOpened] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  const timersRef = useRef([]);

  const topImage = `/images/envelope/${slug}-top.svg`;
  const bottomImage = `/images/envelope/${slug}-bottom.svg`;

  /*
    Poseban prikaz fotografije važi samo za ovaj slug.

    Svi ostali slugovi koji koriste EnvelopeSplitIntroV2
    nastavljaju da rade kao do sada.
  */
  const isNikoletaMarko =
    slug === "nikoleta-marko" && Boolean(introPreviewImage);

  const clearTimers = () => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];
  };

  const addTimer = (callback, delay) => {
    const timer = setTimeout(callback, delay);
    timersRef.current.push(timer);
  };

  useEffect(() => {
    clearTimers();

    setOpened(false);
    setHidden(false);
    setImagesReady(false);
    setPreviewVisible(false);

    const imagesToLoad = [topImage, bottomImage];

    if (backgroundImage) {
      imagesToLoad.push(backgroundImage);
    }

    /*
      Preview fotografiju učitavamo samo za Nikoletu i Marka.
      Kod ostalih slugova se potpuno ignoriše.
    */
    if (isNikoletaMarko && introPreviewImage) {
      imagesToLoad.push(introPreviewImage);
    }

    let loadedCount = 0;
    let isMounted = true;

    const markLoaded = () => {
      loadedCount += 1;

      if (
        loadedCount === imagesToLoad.length &&
        isMounted
      ) {
        setImagesReady(true);
      }
    };

    imagesToLoad.forEach((src) => {
      const img = new Image();

      img.onload = markLoaded;
      img.onerror = markLoaded;
      img.src = src;
    });

    return () => {
      isMounted = false;
      clearTimers();
    };
  }, [
    topImage,
    bottomImage,
    backgroundImage,
    introPreviewImage,
    isNikoletaMarko,
  ]);

  const handleOpen = () => {
    if (opened || !imagesReady) return;

    setOpened(true);

    // Muzika kreće odmah nakon klika/tapa.
    onStartMusic?.();

    if (isNikoletaMarko) {
      /*
        Samo Nikoleta i Marko:

        1. Koverta počinje da se otvara.
        2. Pojavljuje se fotografija mladenaca.
        3. Fotografija ostaje kratko prikazana.
        4. Invitation card se otkriva iza nje.
        5. Intro se zatim potpuno uklanja.
      */

      addTimer(() => {
        setPreviewVisible(true);
      }, 650);

      addTimer(() => {
        onReveal?.();
      }, 3400);

      addTimer(() => {
        setHidden(true);
        onEnter?.();
      }, 5200);

      return;
    }

    /*
      Originalno ponašanje za sve ostale slugove.
      Invitation card se odmah otkriva iza koverte.
    */
    onReveal?.();

    addTimer(() => {
      setHidden(true);
      onEnter?.();
    }, 5200);
  };

  if (hidden || !imagesReady) return null;

  return (
    <motion.section
      className={`envelope-split-overlay ${
        isNikoletaMarko
          ? "envelope-split-nikoleta-marko"
          : ""
      }`}
      onClick={handleOpen}
      animate={
        opened
          ? {
              opacity: 0,
            }
          : {
              opacity: 1,
            }
      }
      transition={
        isNikoletaMarko
          ? {
              /*
                Kod Nikoleta–Marko intro ostaje vidljiv duže,
                kako bi fotografija mogla kratko da se prikaže.
              */
              duration: 1.7,
              ease: [0.22, 1, 0.36, 1],
              delay: opened ? 3.3 : 0,
            }
          : {
              /*
                Originalna animacija za sve ostale slugove.
              */
              duration: 3.8,
              ease: [0.22, 1, 0.36, 1],
              delay: opened ? 1.6 : 0,
            }
      }
    >
      {isNikoletaMarko && (
        <motion.div
          className="nm-envelope-preview-layer"
          initial={{
            opacity: 0,
            scale: 0.9,
            y: 28,
          }}
          animate={
            previewVisible
              ? {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }
              : {
                  opacity: 0,
                  scale: 0.9,
                  y: 28,
                }
          }
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <img
            src={introPreviewImage}
            alt={`${slug} fotografija`}
            className="nm-envelope-preview-card"
          />
        </motion.div>
      )}

      <motion.img
        src={bottomImage}
        alt=""
        className="envelope-split-bottom"
        animate={
          opened
            ? {
                y: "62vh",
                scale: 1.02,
              }
            : {
                y: 0,
                scale: 1,
              }
        }
        transition={{
          duration: 4.8,
          ease: [0.16, 1, 0.3, 1],
        }}
      />

      <motion.div
        className="envelope-top-wrap"
        animate={
          opened
            ? {
                rotateX: -28,
                y: "-56vh",
                scale: 1.01,
              }
            : {
                rotateX: 0,
                y: 0,
                scale: 1,
              }
        }
        transition={{
          duration: 4.8,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <motion.img
          src={topImage}
          alt=""
          className="envelope-split-top"
        />
      </motion.div>
    </motion.section>
  );
}

export default EnvelopeSplitIntroV2;