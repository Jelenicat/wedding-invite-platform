import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

function SilkIntro({
  brideName,
  groomName,
  onEnter,
  videoSrc,
  fontMode = "light",
  weddingDate,
  script = "latin",
  slug,

  // LANGUAGE SWITCHER
  language = "sr",
  onLanguageChange,
  showLanguageSwitcher = false,
  languages = ["sr", "en"],
  languageLabels = { sr: "SR", en: "EN" },
}) {
  const videoRef = useRef(null);

  const shouldUseIntroNamesSvg =
    slug === "jovana-dusan-1";

  const isEnglish =
    language === "en";

  const isWeddingPartySlug =
    slug === "jovana-stefan";

  const isJovanaAleksandarSlug =
    slug === "jovana-aleksandar";

  const isIvanaDusanSlug =
    slug === "ivana-dusan";

  /* Tačke iza dana i godine samo za ove slugove */
  const shouldAddDateDots =
    slug === "jovana-stefan" ||
    slug === "ivana-dusan";

  const splitPersonName = (fullName = "") => {
    const parts = fullName
      .trim()
      .split(/\s+/);

    return {
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" "),
    };
  };

  const brideIntroName =
    splitPersonName(brideName);

  const groomIntroName =
    splitPersonName(groomName);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Browser je blokirao autoplay.
        // Intro i dalje ostaje prikazan normalno.
      });
    }
  }, [videoSrc]);

  const textColor =
    fontMode === "dark"
      ? "#2f2a26"
      : "rgba(255,255,255,0.92)";

  const monthMapLatin = {
    JAN: "januar",
    FEB: "februar",
    MAR: "mart",
    APR: "april",
    MAY: "maj",
    MAJ: "maj",
    JUN: "jun",
    JUL: "jul",
    AVG: "avgust",
    AUG: "avgust",
    SEP: "septembar",
    OCT: "oktobar",
    OKT: "oktobar",
    NOV: "novembar",
    DEC: "decembar",
  };

  const monthMapEnglish = {
    JAN: "January",
    FEB: "February",
    MAR: "March",
    APR: "April",
    MAY: "May",
    MAJ: "May",
    JUN: "June",
    JUL: "July",
    AVG: "August",
    AUG: "August",
    SEP: "September",
    OCT: "October",
    OKT: "October",
    NOV: "November",
    DEC: "December",
  };

  const monthMapCyrillic = {
    JAN: "јануар",
    FEB: "фебруар",
    MAR: "март",
    APR: "април",
    MAY: "мај",
    MAJ: "мај",
    JUN: "јун",
    JUL: "јул",
    AVG: "август",
    AUG: "август",
    SEP: "септембар",
    СЕП: "септембар",
    OCT: "октобар",
    OKT: "октобар",
    ОКТ: "октобар",
    NOV: "новембар",
    DEC: "децембар",
  };

  const monthMap = isEnglish
    ? monthMapEnglish
    : script === "cyrillic"
      ? monthMapCyrillic
      : monthMapLatin;

  let month = isEnglish
    ? "September"
    : script === "cyrillic"
      ? "септембар"
      : "septembar";

  let day = "06";
  let year = "2026";

  if (weddingDate) {
    const parts = weddingDate
      .trim()
      .split(/\s+/);

    if (parts.length === 3) {
      if (Number.isNaN(Number(parts[0]))) {
        month =
          monthMap[parts[0].toUpperCase()] ||
          parts[0];

        day = parts[1];
        year = parts[2];
      } else {
        day = parts[0];

        month =
          monthMap[parts[1].toUpperCase()] ||
          parts[1];

        year = parts[2];
      }
    }
  }

  const t = isEnglish
    ? {
        top: "Wedding invitation",
        button: "View invitation",
      }
    : script === "cyrillic"
      ? {
          top: "Позивница за венчање",
          button: "Погледај позивницу",
        }
      : {
          top: "Pozivnica za venčanje",
          button: "Pogledaj pozivnicu",
        };

  return (
    <section
      className={`silk-intro silk-slug-${slug || ""}`}
    >
      <video
        ref={videoRef}
        className="silk-video"
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
      />

      <div className="silk-overlay" />

      {showLanguageSwitcher && (
        <div
          className={`silk-language-switcher ${fontMode}`}
        >
          {languages.map((lang) => (
            <button
              key={lang}
              type="button"
              className={`silk-language-btn ${
                language === lang
                  ? "is-active"
                  : ""
              }`}
              onClick={() =>
                onLanguageChange?.(lang)
              }
            >
              {languageLabels[lang] ||
                lang.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <motion.div
        className="silk-content"
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 1,
        }}
      >
        <p className={`silk-top ${fontMode}`}>
          {isWeddingPartySlug
            ? "Wedding party"
            : t.top}
        </p>

        {shouldUseIntroNamesSvg ? (
          <div
            className="silk-intro-names-svg-wrap"
            aria-label={`${brideName} & ${groomName}`}
          >
            <span className="silk-intro-names-svg-mask" />
          </div>
        ) : (
          <h1
            className={`silk-names ${
              script === "cyrillic"
                ? "silk-names-cyrillic"
                : ""
            } ${
              isIvanaDusanSlug
                ? "silk-names-ivana-dusan"
                : ""
            } ${
              isJovanaAleksandarSlug
                ? "silk-names-full"
                : ""
            }`}
            style={{
              color: textColor,
            }}
          >
            {isJovanaAleksandarSlug ? (
              <>
                <span className="silk-person-name">
                  <span className="silk-person-first">
                    {brideIntroName.firstName}
                  </span>

                  {brideIntroName.lastName && (
                    <span className="silk-person-last">
                      {brideIntroName.lastName}
                    </span>
                  )}
                </span>

                <span className="silk-amp silk-amp-full">
                  &
                </span>

                <span className="silk-person-name silk-person-name-groom">
                  <span className="silk-person-first">
                    {groomIntroName.firstName}
                  </span>

                  {groomIntroName.lastName && (
                    <span className="silk-person-last">
                      {groomIntroName.lastName}
                    </span>
                  )}
                </span>
              </>
            ) : (
              <>
                {brideName}

                <br />

                <span className="silk-amp">
                  &
                </span>

                <br />

                {groomName}
              </>
            )}
          </h1>
        )}

        <p className={`silk-date ${fontMode}`}>
          {month}

          <br />

          {shouldAddDateDots
            ? `${day}.`
            : day}

          <br />

          {shouldAddDateDots
            ? `${year}.`
            : year}
        </p>

        <button
          type="button"
          className={`silk-enter ${fontMode}`}
          onClick={onEnter}
        >
          {t.button}
        </button>
      </motion.div>
    </section>
  );
}

export default SilkIntro;