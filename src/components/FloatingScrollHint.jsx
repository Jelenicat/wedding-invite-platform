import { useEffect, useState } from "react";
import "../styles/floatingScrollHint.css";

export default function FloatingScrollHint({ text = "Još detalja" }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);

      // Nestaje kad korisnik dođe blizu kraja stranice
      if (distanceFromBottom < 120) {
        setVisible(false);
      } else {
        setVisible(true);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="floating-scroll-hint">
      <span className="floating-scroll-text">{text}</span>
      <span className="floating-scroll-arrow">⌄</span>
    </div>
  );
}