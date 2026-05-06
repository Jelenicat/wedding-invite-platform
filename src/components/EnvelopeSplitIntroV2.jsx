import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "../styles/intro.css";

function EnvelopeSplitIntroV2({
  onEnter,
  onReveal,
  onStartMusic,
  slug,
  backgroundImage,
}) {
  const [opened, setOpened] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);

  const topImage = `/images/envelope/${slug}-top.svg`;
  const bottomImage = `/images/envelope/${slug}-bottom.svg`;

  useEffect(() => {
    setImagesReady(false);

    const imagesToLoad = [topImage, bottomImage];

    if (backgroundImage) {
      imagesToLoad.push(backgroundImage);
    }

    let loadedCount = 0;
    let isMounted = true;

    const markLoaded = () => {
      loadedCount += 1;

      if (loadedCount === imagesToLoad.length && isMounted) {
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
    };
  }, [topImage, bottomImage, backgroundImage]);

  const handleOpen = () => {
    if (opened || !imagesReady) return;

    setOpened(true);

    // Muzika kreće odmah na klik/tap na pismo
    onStartMusic?.();

    // Pozivnica iza pisma se otkriva
    onReveal?.();

    setTimeout(() => {
      setHidden(true);
      onEnter?.();
    }, 5200);
  };

  if (hidden || !imagesReady) return null;

  return (
    <motion.section
      className="envelope-split-overlay"
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
      transition={{
        duration: 3.8,
        ease: [0.22, 1, 0.36, 1],
        delay: opened ? 1.6 : 0,
      }}
    >
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