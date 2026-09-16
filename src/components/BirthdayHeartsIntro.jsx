import React, { useEffect, useRef, useState } from "react";
import "../styles/birthdayintro.css";

const COPY = {
  latin: {
    eyebrow: "Malo srce, velika ljubav",
    subtitle: "slavi svoj prvi rođendan",
    hint: "Dodirni srca. U svakom je malo ljubavi.",
    open: "Otvori pozivnicu",
    opening: "Otvaramo pozivnicu…",
    photo: "Bebina fotografija",
    flip: "Okreni srce",
    front: "Vrati fotografiju",
    fallbackName: "Ime deteta",
    backs: [
      ["moj prvi", "osmeh"],
      ["365", "dana ljubavi"],
      ["najlepše", "tek dolazi"],
    ],
  },

  cyrillic: {
    eyebrow: "Мало срце, велика љубав",
    subtitle: "слави свој први рођендан",
    hint: "Додирни срца. У сваком је мало љубави.",
    open: "Отвори позивницу",
    opening: "Отварамо позивницу…",
    photo: "Бебина фотографија",
    flip: "Окрени срце",
    front: "Врати фотографију",
    fallbackName: "Име детета",
    backs: [
      ["мој први", "осмех"],
      ["365", "дана љубави"],
      ["најлепше", "тек долази"],
    ],
  },
};

const DEMO_PHOTOS = [0, 1, 2].map((panel) => ({
  src: "/images/birthday-hearts-demo.jpg",
  panel,
}));

function printableDate(value) {
  if (!value) return "";

  const raw = String(value).trim();

  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/);

  if (iso) {
    return `${iso[3]}.${iso[2]}.${iso[1]}.`;
  }

  return raw;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setReduced(media.matches);
    };

    update();

    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  return reduced;
}

export default function BirthdayHeartsIntro({
  childName,
  brideName,
  birthdayDate,
  weddingDate,

  introPhotos,
  image1,
  image2,
  image3,

  introBackgroundImage,

  onOpen,
  onEnter,

  isOpen = false,

  slug,
  details = {},

  script = "latin",
  className = "",
}) {
  const isCyrillic = [
    "cyrillic",
    "cyr",
    "ćirilica",
    "cirilica",
  ].includes(script);

  const text = isCyrillic
    ? COPY.cyrillic
    : COPY.latin;

  const name =
    childName ||
    details.childName ||
    brideName ||
    text.fallbackName;

  const date = printableDate(
    birthdayDate ||
      details.birthdayDate ||
      weddingDate
  );

  const bgImage =
    details.introBackgroundImage ||
    introBackgroundImage ||
    "";

  const imageProps = [
    image1,
    image2,
    image3,
  ].filter(Boolean);

  const supplied =
    introPhotos ||
    details.introPhotos ||
    imageProps;

  const items =
    Array.isArray(supplied) &&
    supplied.length
      ? supplied
      : DEMO_PHOTOS;

  const photos = [0, 1, 2].map((index) => {
    const item = items[index % items.length];

    return typeof item === "string"
      ? { src: item }
      : item;
  });

  const [flipped, setFlipped] = useState([
    false,
    false,
    false,
  ]);

  const [opening, setOpening] =
    useState(isOpen);

  const rootRef = useRef(null);
  const openingRef = useRef(isOpen);
  const gesture = useRef(null);
  const suppressClick = useRef(0);

  const reduced = useReducedMotion();

  useEffect(() => {
    openingRef.current = isOpen;
    setOpening(isOpen);
  }, [isOpen, slug]);

  useEffect(() => {
    setFlipped([
      false,
      false,
      false,
    ]);

    suppressClick.current = 0;
    gesture.current = null;

    resetParallax();
  }, [slug]);

  useEffect(() => {
    const root = rootRef.current;

    const update = () => {
      if (root) {
        root.dataset.paused =
          String(document.hidden);
      }
    };

    update();

    document.addEventListener(
      "visibilitychange",
      update
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        update
      );
    };
  }, []);

  function resetParallax() {
    rootRef.current?.style.setProperty(
      "--bhi-px",
      "0px"
    );

    rootRef.current?.style.setProperty(
      "--bhi-py",
      "0px"
    );
  }

  function parallax(event) {
    if (
      reduced ||
      openingRef.current ||
      event.pointerType !== "mouse"
    ) {
      return;
    }

    const root = rootRef.current;

    if (!root) return;

    const box =
      root.getBoundingClientRect();

    root.style.setProperty(
      "--bhi-px",
      `${
        (
          (event.clientX - box.left) /
            box.width -
          0.5
        ) * 14
      }px`
    );

    root.style.setProperty(
      "--bhi-py",
      `${
        (
          (event.clientY - box.top) /
            box.height -
          0.5
        ) * 10
      }px`
    );
  }

  function startDrag(event) {
    if (
      openingRef.current ||
      !event.isPrimary ||
      event.button !== 0
    ) {
      return;
    }

    const element =
      event.currentTarget;

    gesture.current = {
      element,
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      moved: false,
    };

    element.setPointerCapture(
      event.pointerId
    );

    element.dataset.dragging =
      "true";
  }

  function drag(event) {
    const current =
      gesture.current;

    if (
      !current ||
      current.id !== event.pointerId
    ) {
      return;
    }

    const dx =
      event.clientX - current.x;

    const dy =
      event.clientY - current.y;

    if (Math.hypot(dx, dy) > 7) {
      current.moved = true;
    }

    if (reduced) return;

    const max =
      current.element.offsetWidth *
      0.14;

    current.element.style.setProperty(
      "--bhi-dx",
      `${Math.max(
        -max,
        Math.min(max, dx * 0.65)
      )}px`
    );

    current.element.style.setProperty(
      "--bhi-dy",
      `${Math.max(
        -max,
        Math.min(max, dy * 0.65)
      )}px`
    );
  }

  function endDrag(event) {
    const current =
      gesture.current;

    if (
      !current ||
      current.id !== event.pointerId
    ) {
      return;
    }

    if (
      current.moved ||
      event.type === "pointercancel"
    ) {
      suppressClick.current =
        Date.now() + 350;
    }

    current.element.dataset.dragging =
      "false";

    current.element.style.setProperty(
      "--bhi-dx",
      "0px"
    );

    current.element.style.setProperty(
      "--bhi-dy",
      "0px"
    );

    if (
      current.element.hasPointerCapture(
        event.pointerId
      )
    ) {
      current.element.releasePointerCapture(
        event.pointerId
      );
    }

    gesture.current = null;
  }

  function flip(index, event) {
    if (
      openingRef.current ||
      (
        event.detail !== 0 &&
        Date.now() <
          suppressClick.current
      )
    ) {
      return;
    }

    setFlipped((old) =>
      old.map(
        (value, i) =>
          i === index
            ? !value
            : value
      )
    );
  }

  function openInvitation(event) {
    if (openingRef.current) {
      return;
    }

    openingRef.current = true;
    setOpening(true);

    resetParallax();

    const callback =
      typeof onOpen === "function"
        ? onOpen
        : onEnter;

    if (
      typeof callback === "function"
    ) {
      callback(event);
    }
  }

  return (
    <section
      ref={rootRef}
      className={
        `bhi-intro` +
        `${
          opening
            ? " bhi-is-opening"
            : ""
        }` +
        `${
          isCyrillic
            ? " bhi-cyrillic"
            : ""
        }` +
        ` ${className}`
      }
      aria-label={`${name} — ${text.subtitle}`}
      onPointerMove={parallax}
      onPointerLeave={resetParallax}
      data-reduced={String(reduced)}
      style={
        bgImage
          ? {
              "--bhi-bg-image":
                `url("${bgImage}")`,
            }
          : undefined
      }
    >
      {bgImage && (
        <div
          className="bhi-bg-image"
          aria-hidden="true"
        />
      )}

      <div
        className="bhi-light bhi-light-a"
        aria-hidden="true"
      />

      <div
        className="bhi-light bhi-light-b"
        aria-hidden="true"
      />

      <div
        className="bhi-grain"
        aria-hidden="true"
      />

      <div className="bhi-content">
        <header className="bhi-heading">
          <p className="bhi-eyebrow">
            {text.eyebrow}
          </p>

          <h1 className="bhi-name">
            {name}
          </h1>

          <p className="bhi-subtitle">
            {text.subtitle}
          </p>
        </header>

        <div className="bhi-stage">
          <span
            className="bhi-one"
            aria-hidden="true"
          >
            one
          </span>

          <span
            className="bhi-orbit bhi-orbit-a"
            aria-hidden="true"
          />

          <span
            className="bhi-orbit bhi-orbit-b"
            aria-hidden="true"
          />

          <span
            className="bhi-glint bhi-glint-a"
            aria-hidden="true"
          />

          <span
            className="bhi-glint bhi-glint-b"
            aria-hidden="true"
          />

          <span
            className="bhi-glint bhi-glint-c"
            aria-hidden="true"
          />

          <div className="bhi-parallax">
            {photos.map(
              (photo, index) => (
                <div
                  key={index}
                  className={`bhi-heart-slot bhi-heart-${index}`}
                >
                  <div className="bhi-heart-float">
                    <button
                      type="button"
                      className={
                        `bhi-heart` +
                        `${
                          flipped[index]
                            ? " bhi-is-flipped"
                            : ""
                        }`
                      }
                      onPointerDown={
                        startDrag
                      }
                      onPointerMove={drag}
                      onPointerUp={
                        endDrag
                      }
                      onPointerCancel={
                        endDrag
                      }
                      onLostPointerCapture={
                        endDrag
                      }
                      onClick={(event) =>
                        flip(
                          index,
                          event
                        )
                      }
                      disabled={opening}
                      aria-pressed={
                        flipped[index]
                      }
                      aria-label={`${
                        flipped[index]
                          ? text.front
                          : text.flip
                      } ${
                        index + 1
                      }${
                        flipped[index]
                          ? `: ${text.backs[
                              index
                            ].join(" ")}`
                          : ""
                      }`}
                    >
                      <span className="bhi-heart-turn">
                        <span className="bhi-heart-face bhi-heart-front">
                          <span
                            className="bhi-photo-fallback"
                            aria-hidden="true"
                          >
                            1
                          </span>

                          <img
                            src={photo.src}
                            alt={
                              photo.alt ||
                              `${text.photo} ${
                                index + 1
                              }`
                            }
                            draggable="false"
                            decoding="async"
                            loading="eager"
                            className={
                              `bhi-photo` +
                              `${
                                photo.panel !==
                                undefined
                                  ? " bhi-photo-sheet"
                                  : ""
                              }`
                            }
                            style={{
                              objectPosition:
                                photo.position ||
                                "50% 42%",

                              left:
                                photo.panel !==
                                undefined
                                  ? `${
                                      -100 *
                                      photo.panel
                                    }%`
                                  : undefined,
                            }}
                            onError={(event) => {
                              event.currentTarget.style.visibility =
                                "hidden";
                            }}
                            onLoad={(event) => {
                              event.currentTarget.style.visibility =
                                "visible";
                            }}
                          />

                          <span
                            className="bhi-photo-light"
                            aria-hidden="true"
                          />
                        </span>

                        <span
                          className="bhi-heart-face bhi-heart-back"
                          aria-hidden={
                            !flipped[index]
                          }
                        >
                          <span className="bhi-back-main">
                            {
                              text.backs[
                                index
                              ][0]
                            }
                          </span>

                          <span className="bhi-back-small">
                            {
                              text.backs[
                                index
                              ][1]
                            }
                          </span>
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <p className="bhi-hint">
          {text.hint}
        </p>

        <div className="bhi-bottom">
          <button
            type="button"
            className="bhi-open"
            onClick={openInvitation}
            disabled={opening}
          >
            <span>
              {opening
                ? text.opening
                : text.open}
            </span>
          </button>

          {date && (
            <p className="bhi-date">
              {date}
            </p>
          )}
        </div>
      </div>

      <div
        className="bhi-opening-bloom"
        aria-hidden="true"
      />

      <div
        className="bhi-sr-only"
        role="status"
        aria-live="polite"
      >
        {opening
          ? text.opening
          : ""}
      </div>
    </section>
  );
}