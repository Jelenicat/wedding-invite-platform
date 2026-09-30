import { useEffect, useMemo, useRef, useState } from "react";
import EnvelopeFlapIntro from "./EnvelopeFlapIntro";
import "../styles/intro.css";

function firstLetter(value) {
  return Array.from(String(value || "").trim())[0]?.toUpperCase() || "";
}

export default function EnvelopeFlapVideoIntro({
  brideName,
  groomName,
  videoSrc,
  details = {},
  onEnter,
  slug,
  script = "latin",
}) {
  const config = details.envelopeVideoFlow || {};

  const [stage, setStage] = useState("envelope");
  const [videoFinishing, setVideoFinishing] = useState(false);

  const videoRef = useRef(null);
  const completedRef = useRef(false);
  const envelopeTimerRef = useRef(null);

  const brideInitial = useMemo(
    () => config.brideInitial || firstLetter(brideName),
    [brideName, config.brideInitial]
  );

  const groomInitial = useMemo(
    () => config.groomInitial || firstLetter(groomName),
    [groomName, config.groomInitial]
  );

  const videoMuted = config.videoMuted !== false;

  const initialsDuration = Number.isFinite(config.initialsDuration)
    ? config.initialsDuration
    : 2200;

  const envelopeCutDelay = Number.isFinite(config.envelopeCutDelay)
    ? config.envelopeCutDelay
    : 2400;

  useEffect(() => {
    if (!videoSrc) return undefined;

    const video = document.createElement("video");

    video.src = videoSrc;
    video.preload = "auto";
    video.muted = videoMuted;
    video.playsInline = true;

    video.load();

    return () => {
      video.removeAttribute("src");
      video.load();
    };
  }, [videoSrc, videoMuted]);

  useEffect(() => {
    if (stage !== "video" || !videoRef.current) return;

    const video = videoRef.current;

    video.currentTime = 0;

    const promise = video.play();

    if (promise?.catch) {
      promise.catch((error) => {
        console.error("Intro video nije automatski pokrenut:", error);
      });
    }
  }, [stage]);

  useEffect(() => {
    if (stage !== "initials") return undefined;

    const timeout = window.setTimeout(() => {
      if (completedRef.current) return;

      completedRef.current = true;
      onEnter?.();
    }, initialsDuration);

    return () => window.clearTimeout(timeout);
  }, [stage, initialsDuration, onEnter]);

  useEffect(() => {
    return () => {
      if (envelopeTimerRef.current) {
        window.clearTimeout(envelopeTimerRef.current);
      }
    };
  }, []);

  const handleEnvelopeReveal = () => {
    if (envelopeTimerRef.current) {
      window.clearTimeout(envelopeTimerRef.current);
    }

    envelopeTimerRef.current = window.setTimeout(() => {
      setVideoFinishing(false);
      setStage(videoSrc ? "video" : "initials");
    }, envelopeCutDelay);
  };

  const handleVideoTimeUpdate = (event) => {
    const video = event.currentTarget;

    if (!Number.isFinite(video.duration) || video.duration <= 0) return;

    const fadeBeforeEnd = Number.isFinite(config.videoFadeBeforeEnd)
      ? config.videoFadeBeforeEnd
      : 0.8;

    if (video.duration - video.currentTime <= fadeBeforeEnd) {
      setVideoFinishing(true);
    }
  };

  const handleVideoFinished = () => {
    setStage("initials");
  };

  return (
    <div
      className="efv-intro"
      style={{
        "--efv-video-fit": config.videoFit || "cover",
        "--efv-video-position": config.videoPosition || "center",

        "--efv-initials-bg":
          config.initialsBackground || "#000000",

        "--efv-initials-color":
          config.initialsColor || "#ffffff",

        "--efv-slash-color":
          config.slashColor ||
          config.initialsColor ||
          "#ffffff",

        "--efv-initials-duration": `${initialsDuration}ms`,
      }}
    >
      {stage === "video" && (
        <section
          className={`efv-video-screen ${
            videoFinishing ? "is-finishing" : ""
          }`}
          aria-label="Video uvod pozivnice"
        >
          <video
            ref={videoRef}
            className="efv-video"
            src={videoSrc}
            muted={videoMuted}
            playsInline
            preload="auto"
            onTimeUpdate={handleVideoTimeUpdate}
            onEnded={handleVideoFinished}
            onError={handleVideoFinished}
          />
        </section>
      )}

      {stage === "initials" && (
        <section
          className="efv-initials-screen"
          aria-label="Inicijali mladenaca"
        >
          <div className="efv-initials-mark" aria-hidden="true">
            <span className="efv-initial efv-initial-bride">
              {brideInitial}
            </span>

            <span className="efv-slash">/</span>

            <span className="efv-initial efv-initial-groom">
              {groomInitial}
            </span>
          </div>
        </section>
      )}

      {stage === "envelope" && (
        <EnvelopeFlapIntro
          onEnter={() => {}}
          onReveal={handleEnvelopeReveal}
          onStartMusic={() => {}}
          slug={slug}
          details={details}
          script={script}
        />
      )}
    </div>
  );
}