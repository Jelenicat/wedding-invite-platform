import { useEffect, useRef, useState } from "react";
import "../styles/intro.css";

// Obe slike zadržavaju isto platno (1024 × 1536),
// uključujući providne delove.
function EnvelopeFlapIntro({
  onEnter,
  onReveal,
  onStartMusic,
  slug,
  details = {},
  script = "latin",
}) {
  const config = details.envelopeFlap || {};

  // Svaki slug koristi svoje slike.
  const topImage = `/images/envelope/${slug}-top.png`;
  const bottomImage = `/images/envelope/${slug}-bottom.png`;

  // Procenat visine cele slike na kome počinje pregib.
  const hinge = Number.isFinite(config.hingePercent)
    ? config.hingePercent
    : 0;

  const [assets, setAssets] = useState("loading");
  const [phase, setPhase] = useState("closed");

  const openedRef = useRef(false);
  const finishedRef = useRef(false);

  const cyrillic = script === "cyrillic";
  const hidden = phase === "hidden";

  useEffect(() => {
    let active = true;
    let loaded = 0;

    setAssets("loading");
    setPhase("closed");

    openedRef.current = false;
    finishedRef.current = false;

    const images = [bottomImage, topImage].map((src) => {
      const img = new Image();

      img.onload = () => {
        loaded += 1;

        if (active && loaded === 2) {
          setAssets("ready");
        }
      };

      img.onerror = () => {
        if (active) {
          setAssets("error");
        }
      };

      img.src = src;

      return img;
    });

    // Omogućava ulazak i ako učitavanje slika zastane.
    const timeout = setTimeout(() => {
      if (active && loaded !== 2) {
        setAssets("error");
      }
    }, 12000);

    return () => {
      active = false;
      clearTimeout(timeout);

      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [topImage, bottomImage]);

  useEffect(() => {
    if (hidden) return undefined;

    const bodyOverflow = document.body.style.overflow;
    const htmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = htmlOverflow;
    };
  }, [hidden]);

  const open = () => {
    if (openedRef.current || assets === "loading") return;

    openedRef.current = true;

    // Muzika se pokreće direktno na klik zbog mobilnih browsera.
    onStartMusic?.();

    // Invitation card se otkriva ispod koverte odmah.
    // CSS zasebno animira preklop, donju sliku i podlogu.
    onReveal?.();

    if (assets === "error") {
      setPhase("fading");
    } else {
      setPhase("opening");
    }
  };

  const reveal = (event) => {
    if (
      event.target !== event.currentTarget ||
      event.animationName !== "efi-open-flap"
    ) {
      return;
    }

    // Rotacija je završena — uklanjamo ostatak intro sloja.
    setPhase("fading");
  };

  const finish = (event) => {
    if (
      event.target !== event.currentTarget ||
      event.animationName !== "efi-fade-out" ||
      finishedRef.current
    ) {
      return;
    }

    finishedRef.current = true;

    setPhase("hidden");
    onEnter?.();
  };

  if (hidden) return null;

  return (
    <section
      className={`efi-overlay efi-${phase}`}
      aria-label={
        cyrillic ? "Отварање позивнице" : "Otvaranje pozivnice"
      }
      onAnimationEnd={finish}
    >
      <div className="efi-viewport" aria-hidden="true">
        {assets === "ready" && (
          <div
            className="efi-canvas"
            style={{
              "--efi-hinge": `${hinge}%`,
              "--efi-top-image": `url(${JSON.stringify(topImage)})`,
            }}
          >
            <img
              className="efi-bottom"
              src={bottomImage}
              alt=""
              draggable={false}
            />

            <div className="efi-shadow" />

            <div className="efi-flap" onAnimationEnd={reveal}>
              <img
                className="efi-front"
                src={topImage}
                alt=""
                draggable={false}
              />
            </div>
          </div>
        )}
      </div>

      <button
        className="efi-open-button"
        type="button"
        onClick={open}
        disabled={assets === "loading" || phase !== "closed"}
        aria-label={
          cyrillic ? "Отвори позивницу" : "Otvori pozivnicu"
        }
      >
        {slug === "bojana-vasilije" && phase === "closed" && (
          <span className="efi-bojana-open-hint" aria-hidden="true">
            <span className="efi-bojana-open-hint-sr">
              Kliknite da otvorite pismo
            </span>

            <span className="efi-bojana-open-hint-en">
              Click to open the letter
            </span>
          </span>
        )}
      </button>
    </section>
  );
}

export default EnvelopeFlapIntro;