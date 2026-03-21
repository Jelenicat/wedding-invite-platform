import { useEffect, useMemo, useState } from "react";
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
    Invitation: EnvelopeInvitationCard,
  },
};

function WeddingPage() {
  const { slug } = useParams();

  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [showInvitation, setShowInvitation] = useState(false);

  const invitation = useMemo(() => {
    return demoWedding.find((item) => item.slug === slug);
  }, [slug]);

  useEffect(() => {
    if (!invitation) return;

    document.title =
      invitation.type === "birthday"
        ? `${invitation.brideName} | Pozivnica`
        : `${invitation.brideName} & ${invitation.groomName} | Pozivnica`;

    setIsIntroOpen(false);
    setShowInvitation(false);
  }, [invitation]);

  if (!invitation) {
    return <div className="wedding-page">Pozivnica nije pronađena.</div>;
  }

  const templateKey = invitation.template || "envelope";
  const template = TEMPLATE_COMPONENTS[templateKey] || TEMPLATE_COMPONENTS.envelope;

  const IntroComponent = template.Intro;
  const InvitationComponent = template.Invitation;

  const handleIntroOpen = () => {
    setIsIntroOpen(true);

    setTimeout(() => {
      setShowInvitation(true);
    }, 1600);
  };

  const handleIntroEnter = () => {
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
    onEnter: handleIntroEnter,
    isOpen: isIntroOpen,
    onOpen: handleIntroOpen,
  };

  const invitationProps = {
    brideName: invitation.brideName,
    groomName: invitation.groomName,
    details: invitation.details,
    image: invitation.image,
    imageSrc: invitation.image,
    videoSrc: invitation.videoSrc,
  };

  return (
    <div className="wedding-page">
      {!showInvitation ? (
        <IntroComponent {...introProps} />
      ) : (
        <InvitationComponent {...invitationProps} />
      )}
    </div>
  );
}

export default WeddingPage;