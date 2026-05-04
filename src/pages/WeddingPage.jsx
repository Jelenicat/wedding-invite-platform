import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import FloralIntro from "../components/FloralIntro";
import FloralInvitationCard from "../components/FloralInvitationCard";

import EnvelopeIntro from "../components/EnvelopeIntro";
import EnvelopeInvitationCard from "../components/EnvelopeInvitationCard";

import MinimalIntro from "../components/MinimalIntro";
import MinimalInvitationCard from "../components/MinimalInvitationCard";

import PhotoScriptIntro from "../components/PhotoScriptIntro";
import PhotoScriptInvitationCard from "../components/PhotoScriptInvitationCard";

import PhotoCardIntro from "../components/PhotoCardIntro";
import PhotoCardInvitationCard from "../components/PhotoCardInvitationCard";

import VideoBandIntro from "../components/VideoBandIntro";
import VideoBandInvitationCard from "../components/VideoBandInvitationCard";

import SplitVideoIntro from "../components/SplitVideoIntro";
import SplitVideoInvitationCard from "../components/SplitVideoInvitationCard";

import SplitImageIntro from "../components/SplitImageIntro";
import SplitImageInvitationCard from "../components/SplitImageInvitationCard";

import BlackWhiteIntro from "../components/BlackWhiteIntro";
import BlackWhiteInvitationCard from "../components/BlackWhiteInvitationCard";

import RetroIntro from "../components/RetroIntro";
import RetroInvitationCard from "../components/RetroInvitationCard";

import BirthdayGalleryIntro from "../components/BirthdayGalleryIntro";
import BirthdayGalleryInvitationCard from "../components/BirthdayGalleryInvitationCard";

import BirthdayOneWordIntro from "../components/BirthdayOneWordIntro";
import BirthdayOneWordInvitationCard from "../components/BirthdayOneWordInvitationCard";

import BirthdaySplitIntro from "../components/BirthdaySplitIntro";
import BirthdaySplitInvitationCard from "../components/BirthdaySplitInvitationCard";

import AngelIntro from "../components/AngelIntro";
import AngelInvitationCard from "../components/AngelInvitationCard";
import ClassicIntro from "../components/ClassicIntro";
import ClassicInvitationCard from "../components/ClassicInvitationCard";
import EditorialIntro from "../components/EditorialIntro";
import EditorialInvitationCard from "../components/EditorialInvitationCard";
import SilkIntro from "../components/SilkIntro";
import EnvelopeSplitIntro from "../components/EnvelopeSplitIntro";
import EnvelopeSideSplitIntro from "../components/EnvelopeSideSplitIntro";
import PassportIntro from "../components/PassportIntro";
import PassportInvitationCard from "../components/PassportInvitationCard"; // (ili šta već nazoveš)
import ElegantWhiteIntro from "../components/ElegantWhiteIntro";
import EleganWhiteInvitationCard from "../components/EleganWhiteInvitationCard";
import ElegantBlackIntro from "../components/ElegantBlackIntro";
import ElegantBlackInvitationCard from "../components/ElegantBlackInvitationCard";
import demoWedding from "../data/demoWedding";
import "../styles/intro.css";

const TEMPLATE_COMPONENTS = {
  floral: {
    Intro: FloralIntro,
    Invitation: FloralInvitationCard,
  },
  envelope: {
    Intro: EnvelopeIntro,
    Invitation: EnvelopeInvitationCard,
  },
  minimal: {
    Intro: MinimalIntro,
    Invitation: MinimalInvitationCard,
  },
  "photo-script": {
    Intro: PhotoScriptIntro,
    Invitation: PhotoScriptInvitationCard,
  },
  "photo-card": {
    Intro: PhotoCardIntro,
    Invitation: PhotoCardInvitationCard,
  },
  "video-band": {
    Intro: VideoBandIntro,
    Invitation: VideoBandInvitationCard,
  },
  "split-video": {
    Intro: SplitVideoIntro,
    Invitation: SplitVideoInvitationCard,
  },
  "split-image": {
    Intro: SplitImageIntro,
    Invitation: SplitImageInvitationCard,
  },
  "black-white-intro": {
    Intro: BlackWhiteIntro,
    Invitation: BlackWhiteInvitationCard,
  },
  retro: {
    Intro: RetroIntro,
    Invitation: RetroInvitationCard,
  },
  "birthday-gallery": {
    Intro: BirthdayGalleryIntro,
    Invitation: BirthdayGalleryInvitationCard,
  },
  "birthday-one-word": {
    Intro: BirthdayOneWordIntro,
    Invitation: BirthdayOneWordInvitationCard,
  },
  "birthday-split": {
    Intro: BirthdaySplitIntro,
    Invitation: BirthdaySplitInvitationCard,
  },
  angel: {
    Intro: AngelIntro,
    Invitation: AngelInvitationCard,
  },
  classic: {
    Intro: ClassicIntro,
    Invitation: ClassicInvitationCard,
  },
  editorial: {
    Intro: EditorialIntro,
    Invitation: EditorialInvitationCard,
  },
  silk: {
    Intro: SilkIntro,
    Invitation: MinimalInvitationCard,
  },
  "envelope-split": {
    Intro: EnvelopeSplitIntro,
    Invitation: MinimalInvitationCard,
  },
  "envelope-side-split": {
  Intro: EnvelopeSideSplitIntro,
  Invitation: FloralInvitationCard,
},
 passport: {
    Intro: PassportIntro,
    Invitation: PassportInvitationCard,
  },
  "elegant-white": {
  Intro: ElegantWhiteIntro,
   Invitation: EleganWhiteInvitationCard,// privremeno koristi neki postojeći
},
"elegant-black": {
  Intro: ElegantBlackIntro,
  Invitation: ElegantBlackInvitationCard,
},
};

function WeddingPage() {
  const { slug } = useParams();

  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [showInvitation, setShowInvitation] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const [envelopeRevealed, setEnvelopeRevealed] = useState(false);

  const introTimeoutRef = useRef(null);
  const audioRef = useRef(null);

  const invitation = useMemo(() => {
    return demoWedding.find((item) => item.slug === slug);
  }, [slug]);

  useEffect(() => {
    return () => {
      if (introTimeoutRef.current) {
        clearTimeout(introTimeoutRef.current);
      }

      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (!invitation) return;

    document.title =
      invitation.type === "birthday"
        ? `${invitation.brideName} | Pozivnica`
        : `${invitation.brideName} & ${invitation.groomName} | Pozivnica`;

    setIsIntroOpen(false);
    setShowInvitation(false);
    setMusicStarted(false);
    setEnvelopeRevealed(false);

    if (introTimeoutRef.current) {
      clearTimeout(introTimeoutRef.current);
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.muted = false;
      audioRef.current.load();
    }
  }, [invitation]);
useEffect(() => {
  if (!invitation?.startMusicOnIntro) return;
  if (!invitation?.musicSrc) return;
  if (!audioRef.current) return;

  const audio = audioRef.current;

  audio.volume = 0.45;
  audio.muted = false;

  const tryAutoplay = async () => {
    try {
      await audio.play();
      setMusicStarted(true);
    } catch (error) {
      console.log("Autoplay muzike je blokiran, čekamo prvi klik/tap.", error);
    }
  };

  tryAutoplay();
}, [invitation]);
  if (!invitation) {
    return <div className="wedding-page">Pozivnica nije pronađena.</div>;
  }

  const templateKey = invitation.template || "envelope";
  const template =
    TEMPLATE_COMPONENTS[templateKey] || TEMPLATE_COMPONENTS.envelope;

  const IntroComponent = template.Intro;
  const InvitationComponent = template.Invitation;
const playInvitationMusic = () => {
  if (!invitation.musicSrc || !audioRef.current || musicStarted) return;

  audioRef.current.volume = 0.45;

  audioRef.current
    .play()
    .then(() => {
      setMusicStarted(true);
    })
    .catch((error) => {
      console.error("Muzika nije pokrenuta:", error);
    });
};
const handleIntroOpen = () => {
  setIsIntroOpen(true);

  if (invitation.startMusicOnIntro) {
    playInvitationMusic();
  }

  if (introTimeoutRef.current) {
    clearTimeout(introTimeoutRef.current);
  }

  introTimeoutRef.current = setTimeout(() => {
    setShowInvitation(true);
  }, 1600);
};
const handleIntroEnter = () => {
  if (introTimeoutRef.current) {
    clearTimeout(introTimeoutRef.current);
  }

  playInvitationMusic();

  setShowInvitation(true);
};

  const introProps = {
    brideName: invitation.brideName,
    groomName: invitation.groomName,
    backgroundImage: invitation.backgroundImage,
    weddingDate: invitation.weddingDate,
    weddingTime: invitation.weddingTime,
    venue: invitation.venue,
    introText: invitation.introText,
    videoSrc: invitation.videoSrc,
    image: invitation.image,
    imageSrc: invitation.image,
    image1: invitation.image1,
    image2: invitation.image2,
    image3: invitation.image3,
    onEnter: handleIntroEnter,
    isOpen: isIntroOpen,
    onOpen: handleIntroOpen,
    slug: invitation.slug,
    introPreviewImage: invitation.introPreviewImage,
    fontMode: invitation.fontMode,
    details: invitation.details,
    script: invitation.script,
  };

  const invitationProps = {
    brideName: invitation.brideName,
    groomName: invitation.groomName,
    weddingDate: invitation.weddingDate,
    weddingTime: invitation.weddingTime,
    venue: invitation.venue,
    details: invitation.details,
    backgroundImage: invitation.backgroundImage,
    image: invitation.image,
    imageSrc: invitation.image,
    videoSrc: invitation.videoSrc,
    rsvpVideoSrc: invitation.rsvpVideoSrc,
    slug: invitation.slug,
    type: invitation.type,
    image1: invitation.image1,
    image2: invitation.image2,
    image3: invitation.image3,
    script: invitation.script,
  };

const audioNode = invitation.musicSrc ? (
  <audio
    ref={audioRef}
    loop
    preload="auto"
    autoPlay={Boolean(invitation.startMusicOnIntro)}
  >
    <source src={invitation.musicSrc} type="audio/mpeg" />
  </audio>
) : null;

  if (templateKey === "angel" || templateKey === "classic") {
    return (
      <div className="wedding-page">
        {audioNode}
        <IntroComponent {...introProps} />
        <InvitationComponent {...invitationProps} />
      </div>
    );
  }

  if (templateKey === "envelope-split" || templateKey === "envelope-side-split") {
    return (
      <div className="wedding-page">
        {audioNode}

        <div
          className={`envelope-card-layer ${
            envelopeRevealed ? "is-revealed" : ""
          }`}
        >
          <InvitationComponent {...invitationProps} />
        </div>

        <IntroComponent
          {...introProps}
          onEnter={handleIntroEnter}
          onReveal={() => setEnvelopeRevealed(true)}
        />
      </div>
    );
  }

  return (
    <div className="wedding-page">
      {audioNode}

      {!showInvitation ? (
        <IntroComponent {...introProps} />
      ) : (
        <InvitationComponent {...invitationProps} />
      )}
    </div>
  );
}

export default WeddingPage;