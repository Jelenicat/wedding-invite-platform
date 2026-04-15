import { motion } from "framer-motion";
import { useState } from "react";
import "../styles/intro.css";

function EnvelopeSplitIntro({ onEnter, onReveal }) {
  const [opened, setOpened] = useState(false);
  const [hidden, setHidden] = useState(false);

  const handleOpen = () => {
    if (opened) return;

    setOpened(true);
    onReveal?.();

    setTimeout(() => {
      setHidden(true);
      onEnter?.();
    }, 2000);
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
        duration: 3,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.img
        src="/images/envelope/envelope-bottom.svg"
        alt=""
        className="envelope-split-bottom"
        animate={opened ? { y: "55vh" } : { y: 0 }}
        transition={{
          duration: 2.5,
          ease: [0.16, 1, 0.3, 1],
        }}
      />

      <motion.img
        src="/images/envelope/envelope-top.svg"
        alt=""
        className="envelope-split-top"
        animate={opened ? { y: "-55vh" } : { y: 0 }}
        transition={{
          duration: 2.5,
          ease: [0.16, 1, 0.3, 1],
        }}
      />
    </motion.section>
  );
}

export default EnvelopeSplitIntro;