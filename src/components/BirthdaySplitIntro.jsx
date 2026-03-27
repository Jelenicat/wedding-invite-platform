import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "../styles/intro.css";

function BirthdaySplitIntro({
  brideName,
  image1,
  image2,
  image3,
  onEnter,
}) {
  const name = brideName || "Olivia";

  const images = [image1, image2, image3].filter(Boolean);
  const sliderImages = [...images, ...images];

  return (
    <section className="birthday-split-intro">
      
      {/* LEFT - SLIDER */}
      <div className="birthday-split-left">
        <div className="birthday-split-track">
          {sliderImages.map((img, i) => (
            <div className="birthday-split-slide" key={i}>
              <img src={img} alt="" />
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT - TEXT */}
      <motion.div
        className="birthday-split-right"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9 }}
      >
<div className="birthday-split-heading">
  <motion.div
    className="birthday-split-one"
    initial={{ opacity: 0, scale: 0.85, filter: "blur(6px)" }}
    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
    transition={{
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
    }}
  >
    1
  </motion.div>

  <motion.h1
    className="birthday-split-title"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.15, duration: 0.8 }}
  >
    One
  </motion.h1>
</div>

        <p className="birthday-split-subtitle">
          {name} slavi rođendan! 
        </p>

    <motion.button
  className="birthday-split-btn"
  onClick={onEnter}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.5, duration: 0.7 }}
  whileHover={{ y: -2 }}
  whileTap={{ scale: 0.98 }}
>
  Pogledaj pozivnicu
</motion.button>
      </motion.div>
    </section>
  );
}

export default BirthdaySplitIntro;