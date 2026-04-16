import { motion } from "framer-motion";
import { useState } from "react";
import "../styles/intro.css";

function EnvelopeSplitIntro({ onEnter, onReveal, slug }) {
  const [opened, setOpened] = useState(false);
  const [hidden, setHidden] = useState(false);

  const topImage = `/images/envelope/${slug}-top.svg`;
  const bottomImage = `/images/envelope/${slug}-bottom.svg`;

  const handleOpen = () => {
    if (opened) return;

    setOpened(true);
    onReveal?.();

    setTimeout(() => {
      setHidden(true);
      onEnter?.();
    }, 5200);
  };

  if (hidden) return null;

  return (
    <motion.section
      className="envelope-split-overlay"
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

export default EnvelopeSplitIntro;