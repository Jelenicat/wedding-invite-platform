import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "../styles/intro.css";

function EnvelopeSideSplitIntro({ onEnter, onReveal, slug }) {
  const [opened, setOpened] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);

  const leftImage = `/images/envelope/${slug}-left.svg`;
  const rightImage = `/images/envelope/${slug}-right.svg`;

  useEffect(() => {
    let loadedCount = 0;

    const markLoaded = () => {
      loadedCount += 1;
      if (loadedCount === 2) {
        setImagesReady(true);
      }
    };

    const leftImg = new Image();
    const rightImg = new Image();

    leftImg.onload = markLoaded;
    rightImg.onload = markLoaded;

    leftImg.src = leftImage;
    rightImg.src = rightImage;
  }, [leftImage, rightImage]);

  const handleOpen = () => {
    if (opened || !imagesReady) return;

    setOpened(true);
    onReveal?.();

    setTimeout(() => {
      setHidden(true);
      onEnter?.();
    }, 5200);
  };

  if (hidden || !imagesReady) return null;

  return (
    <motion.section
      className="envelope-side-split-overlay"
      onClick={handleOpen}
      animate={
        opened
          ? {
              opacity: 0,
              filter: "blur(4px)",
            }
          : {
              opacity: 1,
              filter: "blur(0px)",
            }
      }
      transition={{
        duration: 3.8,
        ease: [0.22, 1, 0.36, 1],
        delay: opened ? 1.6 : 0,
      }}
    >
      <motion.div
        className="envelope-side-left-wrap"
        animate={
          opened
            ? {
                x: "-58vw",
                scale: 1.02,
                rotate: -2,
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
      >
        <img
          src={leftImage}
          alt=""
          className="envelope-side-left"
          draggable={false}
        />
      </motion.div>

      <motion.div
        className="envelope-side-right-wrap"
        animate={
          opened
            ? {
                x: "58vw",
                scale: 1.02,
                rotate: 2,
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
      >
        <img
          src={rightImage}
          alt=""
          className="envelope-side-right"
          draggable={false}
        />
      </motion.div>
    </motion.section>
  );
}

export default EnvelopeSideSplitIntro;