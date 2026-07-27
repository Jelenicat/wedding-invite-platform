import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import FloralIntro from "../components/FloralIntro";
import FloralInvitationCard from "../components/FloralInvitationCard";

import EnvelopeIntro from "../components/EnvelopeIntro";
import EnvelopeInvitationCard from "../components/EnvelopeInvitationCard";

import MinimalIntro from "../components/MinimalIntro";
import MinimalInvitationCard from "../components/MinimalInvitationCard";
import MinimalInvitationCardSplit from "../components/MinimalInvitationCardSplit";

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
import BirthdayPartyIntro from "../components/BirthdayPartyIntro";
import BirthdayIntro from "../components/BirthdayIntro";
import BirthdayElenaInvitationCard from "../components/BirthdayElenaInvitationCard";

import AngelIntro from "../components/AngelIntro";
import AngelInvitationCard from "../components/AngelInvitationCard";
import ClassicIntro from "../components/ClassicIntro";
import ClassicInvitationCard from "../components/ClassicInvitationCard";
import EditorialIntro from "../components/EditorialIntro";
import EditorialInvitationCard from "../components/EditorialInvitationCard";
import SilkIntro from "../components/SilkIntro";
import SilkPhotoInvitationCard from "../components/SilkPhotoInvitationCard";

import SilkDateFlowInvitationCard from "../components/SilkDateFlowInvitationCard";
import EnvelopeSplitIntro from "../components/EnvelopeSplitIntro";
import EnvelopeSideSplitIntro from "../components/EnvelopeSideSplitIntro";
import EnvelopeSplitIntroV2 from "../components/EnvelopeSplitIntroV2";
import EnvelopeSideSplitIntroV2 from "../components/EnvelopeSideSplitIntroV2";
import EnvelopeSideSplitV2InvitationCard from "../components/EnvelopeSideSplitV2InvitationCard";
import PassportIntro from "../components/PassportIntro";
import PassportInvitationCard from "../components/PassportInvitationCard";
import ElegantWhiteIntro from "../components/ElegantWhiteIntro";
import EleganWhiteInvitationCard from "../components/EleganWhiteInvitationCard";
import ElegantBlackIntro from "../components/ElegantBlackIntro";
import ElegantBlackInvitationCard from "../components/ElegantBlackInvitationCard";
import DarkFloralIntro from "../components/DarkFloralIntro";
import DarkFloralInvitationCard from "../components/DarkFloralInvitationCard";
import IntroHeart from "../components/IntroHeart";
import PlayingCardIntro from "../components/PlayingCardIntro";
import PlayingCardInvitationCard from "../components/PlayingCardInvitationCard";
import MagazineEditorialIntro from "../components/MagazineEditorialIntro";
import CallaLaceIntro from "../components/CallaLaceIntro";
import CallaLaceInvitationCard from "../components/CallaLaceInvitationCard";
import ItalianIntro from "../components/ItalianIntro";
import ItalianInvitationCard from "../components/ItalianInvitationCard";
import MinimalGoldIntro from "../components/MinimalGoldIntro";
import MinimalGoldInvitationCard from "../components/MinimalGoldInvitationCard";
import GoldPrintVideoIntro from "../components/GoldPrintVideoIntro";
import GoldPrintVideoInvitationCard from "../components/GoldPrintVideoInvitationCard";
import CyrillicSvgSilkIntro from "../components/CyrillicSvgSilkIntro";
import CyrillicSvgSilkInvitationCard from "../components/CyrillicSvgSilkInvitationCard";
import PhotoCardSplitInvitationCard from "../components/PhotoCardSplitInvitationCard";

import BirthdayLuxuryIntro from "../components/BirthdayLuxuryIntro";
import BirthdayEvaIntro from "../components/BirthdayEvaIntro";
import BirthdayLuxuryInvitationCard from "../components/BirthdayLuxuryInvitationCard";
import BirthdayGlassIntro from "../components/BirthdayGlassIntro";
import BirthdayGlassInvitationCard from "../components/BirthdayGlassInvitationCard";
import BirthdayMarbleIntro from "../components/BirthdayMarbleIntro";
import BirthdayMarbleInvitationCard from "../components/BirthdayMarbleInvitationCard";
import BirthdayBabyIntro from "../components/BirthdayBabyIntro";
import BirthdayBabyInvitationCard from "../components/BirthdayBabyInvitationCard";
import WeddingBaptismSilkIntro from "../components/WeddingBaptismSilkIntro";

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
  "silk-date-flow": {
    Intro: SilkIntro,
    Invitation: SilkDateFlowInvitationCard,
  },
  "silk-minimal-split": {
    Intro: SilkIntro,
    Invitation: MinimalInvitationCardSplit,
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
    Invitation: EleganWhiteInvitationCard,
  },
  "elegant-black": {
    Intro: ElegantBlackIntro,
    Invitation: ElegantBlackInvitationCard,
  },
  "birthday-party": {
    Intro: BirthdayPartyIntro,
    Invitation: BirthdaySplitInvitationCard,
  },
  "envelope-split-v2": {
    Intro: EnvelopeSplitIntroV2,
    Invitation: FloralInvitationCard,
  },
  "envelope-side-split-v2": {
    Intro: EnvelopeSideSplitIntroV2,
    Invitation: EnvelopeSideSplitV2InvitationCard,
  },
  "birthday-luxury": {
    Intro: BirthdayLuxuryIntro,
    Invitation: BirthdayLuxuryInvitationCard,
  },
  "birthday-glass-luxury": {
    Intro: BirthdayGlassIntro,
    Invitation: BirthdayGlassInvitationCard,
  },
  "birthday-marble-luxury": {
    Intro: BirthdayMarbleIntro,
    Invitation: BirthdayMarbleInvitationCard,
  },
  "dark-floral": {
    Intro: DarkFloralIntro,
    Invitation: DarkFloralInvitationCard,
  },
  "heart-floral": {
    Intro: IntroHeart,
    Invitation: FloralInvitationCard,
  },
  "magazine-editorial": {
    Intro: MagazineEditorialIntro,
    Invitation: EditorialInvitationCard,
  },
  "calla-lace": {
    Intro: CallaLaceIntro,
    Invitation: CallaLaceInvitationCard,
  },
  "italian-envelope-video": {
    Intro: ItalianIntro,
    Invitation: ItalianInvitationCard,
  },
  "wedding-baptism-silk": {
    Intro: WeddingBaptismSilkIntro,
    Invitation: MinimalInvitationCard,
  },
  "minimal-gold": {
    Intro: MinimalGoldIntro,
    Invitation: MinimalGoldInvitationCard,
  },
  "gold-print-video": {
    Intro: GoldPrintVideoIntro,
    Invitation: GoldPrintVideoInvitationCard,
  },
  "cyrillic-svg-silk": {
    Intro: CyrillicSvgSilkIntro,
    Invitation: CyrillicSvgSilkInvitationCard,
  },
  "birthday-baby-luxury": {
    Intro: BirthdayBabyIntro,
    Invitation: BirthdayBabyInvitationCard,
  },
  "playing-card": {
    Intro: PlayingCardIntro,
    Invitation: PlayingCardInvitationCard,
  },
  "photo-card-split-video": {
  Intro: SplitVideoIntro,
  Invitation: PhotoCardSplitInvitationCard,
},
"envelope-split-v2-editorial": {
  Intro: EnvelopeSplitIntroV2,
  Invitation: EditorialInvitationCard,
},

"envelope-split-v2-photo-card": {
  Intro: EnvelopeSplitIntroV2,
  Invitation: PhotoCardSplitInvitationCard,
},

  "silk-photo-script": {
    Intro: SilkIntro,
    Invitation: SilkPhotoInvitationCard,
  },
"birthday-eva": {
  Intro: BirthdayEvaIntro,
  Invitation: BirthdaySplitInvitationCard,
},
"birthday-intro": {
  Intro: BirthdayIntro,
   Invitation: BirthdayElenaInvitationCard,
},
};

const isObject = (value) =>
  value && typeof value === "object" && !Array.isArray(value);

function deepMerge(base, override) {
  if (Array.isArray(base) && Array.isArray(override)) {
    const maxLength = Math.max(base.length, override.length);

    return Array.from({ length: maxLength }, (_, index) => {
      if (override[index] === undefined) return base[index];
      if (base[index] === undefined) return override[index];

      return deepMerge(base[index], override[index]);
    });
  }

  if (isObject(base) && isObject(override)) {
    return Object.keys(override).reduce(
      (acc, key) => {
        acc[key] = deepMerge(acc[key], override[key]);
        return acc;
      },
      { ...base }
    );
  }

  return override !== undefined ? override : base;
}

function getLocalizedInvitation(invitation, language) {
  if (!invitation) return invitation;

  const translations = invitation.details?.translations || {};
  const translation = translations[language];

  if (!translation) return invitation;

  const { details: translatedDetails, ...rootTranslation } = translation;

  return {
    ...invitation,
    ...rootTranslation,
    details: deepMerge(invitation.details || {}, translatedDetails || {}),
  };
}

function WeddingPage() {
  const { slug } = useParams();

  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [showInvitation, setShowInvitation] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const [envelopeRevealed, setEnvelopeRevealed] = useState(false);
  const [language, setLanguage] = useState("sr");

  const introTimeoutRef = useRef(null);
  const audioRef = useRef(null);

  const invitation = useMemo(() => {
    return demoWedding.find((item) => item.slug === slug);
  }, [slug]);

  useEffect(() => {
    let wasPlayingBeforeHidden = false;

    const pauseMusic = () => {
      if (audioRef.current && !audioRef.current.paused) {
        wasPlayingBeforeHidden = true;
        audioRef.current.pause();
      }
    };

    const resumeMusic = () => {
      if (!wasPlayingBeforeHidden) return;
      if (!audioRef.current) return;

      audioRef.current.muted = false;

      audioRef.current
        .play()
        .then(() => {
          setMusicStarted(true);
          wasPlayingBeforeHidden = false;
        })
        .catch((error) => {
          console.error("Muzika nije ponovo pokrenuta:", error);
        });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseMusic();
      } else {
        resumeMusic();
      }
    };

    window.addEventListener("pagehide", pauseMusic);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (introTimeoutRef.current) {
        clearTimeout(introTimeoutRef.current);
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      window.removeEventListener("pagehide", pauseMusic);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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
    setLanguage(invitation.details?.defaultLanguage || "sr");

    if (introTimeoutRef.current) {
      clearTimeout(introTimeoutRef.current);
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.muted = false;
    }
  }, [invitation]);

  useEffect(() => {
    if (!invitation) return;

    const templateKey = invitation.template || "envelope";

    // Samo Angel template — ostali ostaju po starom
    if (templateKey !== "angel") return;

    // Ako nema muzike ili je već pokrenuta, ne dodajemo listenere
    if (!invitation.musicSrc || musicStarted) return;

    const events = ["click", "touchstart", "wheel"];

    const handleFirstInteraction = () => {
      playInvitationMusic();

      events.forEach((eventName) => {
        document.removeEventListener(eventName, handleFirstInteraction);
      });
    };

    events.forEach((eventName) => {
      document.addEventListener(eventName, handleFirstInteraction, {
        passive: true,
      });
    });

    return () => {
      events.forEach((eventName) => {
        document.removeEventListener(eventName, handleFirstInteraction);
      });
    };
  }, [invitation, musicStarted]);

  if (!invitation) {
    return <div className="wedding-page">Pozivnica nije pronađena.</div>;
  }

  const localizedInvitation = getLocalizedInvitation(invitation, language);

  const templateKey = invitation.template || "envelope";
  const template =
    TEMPLATE_COMPONENTS[templateKey] || TEMPLATE_COMPONENTS.envelope;

  const IntroComponent = template.Intro;
  const InvitationComponent = template.Invitation;

  const playInvitationMusic = () => {
    if (!invitation.musicSrc || !audioRef.current || musicStarted) return;

    const musicVolume = templateKey === "cyrillic-svg-silk" ? 0.32 : 0.45;

    audioRef.current.muted = false;
    audioRef.current.volume = musicVolume;

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

    // Muzika kreće tek nakon korisničkog klika/tapa
    playInvitationMusic();

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

  const canSwitchLanguage =
    invitation.details?.showLanguageSwitcher &&
    invitation.details?.translations &&
    Object.keys(invitation.details.translations).length > 0;

  const languageLabels = invitation.details?.languageLabels || {
    sr: "SR",
    en: "EN",
  };

  const languages = invitation.details?.languages || [
    "sr",
    ...Object.keys(invitation.details?.translations || {}),
  ];

  const introProps = {
    brideName: localizedInvitation.brideName,
    groomName: localizedInvitation.groomName,
    childName: localizedInvitation.childName,
    backgroundImage: localizedInvitation.backgroundImage,
    weddingDate: localizedInvitation.weddingDate,
    weddingTime: localizedInvitation.weddingTime,
    venue: localizedInvitation.venue,
    introText: localizedInvitation.introText,
    videoSrc: localizedInvitation.videoSrc,
    image: localizedInvitation.image,
    imageSrc: localizedInvitation.image,
    image1: localizedInvitation.image1,
    image2: localizedInvitation.image2,
    image3: localizedInvitation.image3,
    onEnter: handleIntroEnter,
    isOpen: isIntroOpen,
    onOpen: handleIntroOpen,
    slug: localizedInvitation.slug,
    introPreviewImage: localizedInvitation.introPreviewImage,
    fontMode: localizedInvitation.fontMode,
    details: localizedInvitation.details,
    script: localizedInvitation.script,
    babyImage: localizedInvitation.babyImage,
    partyGender: localizedInvitation.partyGender,
    introNamesSvg: localizedInvitation.introNamesSvg,

    // LANGUAGE SWITCHER — prosleđuje se intro template-u
    language,
    onLanguageChange: setLanguage,
    showLanguageSwitcher: canSwitchLanguage,
    languages,
    languageLabels,
  };

  const invitationProps = {
    brideName: localizedInvitation.brideName,
    groomName: localizedInvitation.groomName,
    childName: localizedInvitation.childName,
    weddingDate: localizedInvitation.weddingDate,
    weddingTime: localizedInvitation.weddingTime,
    venue: localizedInvitation.venue,
    details: localizedInvitation.details,
    backgroundImage: localizedInvitation.backgroundImage,
    image: localizedInvitation.image,
    imageSrc: localizedInvitation.image,
    videoSrc: localizedInvitation.videoSrc,
    rsvpVideoSrc: localizedInvitation.rsvpVideoSrc,
    slug: localizedInvitation.slug,
    type: localizedInvitation.type,
    image1: localizedInvitation.image1,
    image2: localizedInvitation.image2,
    image3: localizedInvitation.image3,
    script: localizedInvitation.script,

    // Korisno kasnije ako želiš da i invitation card koristi jezik
    language,
  };

  const audioNode = invitation.musicSrc ? (
    <audio ref={audioRef} loop preload="none">
      <source src={invitation.musicSrc} type="audio/mpeg" />
    </audio>
  ) : null;

  const angelMusicText =
    language === "en"
      ? musicStarted
        ? "Music playing"
        : "Play music"
      : musicStarted
        ? "Muzika svira"
        : "Pusti muziku";

  const angelMusicButton =
    templateKey === "angel" && invitation.musicSrc ? (
      <button
        type="button"
        className={`angel-music-floating-btn ${
          musicStarted ? "is-playing" : ""
        }`}
        onClick={playInvitationMusic}
        aria-label={angelMusicText}
      >
        <span>♪</span>
        {angelMusicText}
      </button>
    ) : null;

  if (templateKey === "angel" || templateKey === "classic") {
    return (
      <div className="wedding-page">
        {audioNode}
        {angelMusicButton}
        <IntroComponent {...introProps} />
        <InvitationComponent {...invitationProps} />
      </div>
    );
  }

  if (
    templateKey === "envelope-split" ||
    templateKey === "envelope-split-v2" ||
     templateKey === "envelope-split-v2-photo-card" ||
    templateKey === "envelope-split-v2-editorial" ||
    templateKey === "envelope-side-split" ||
    templateKey === "envelope-side-split-v2" ||
    templateKey === "italian-envelope-video"
  ) {
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
          onStartMusic={playInvitationMusic}
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