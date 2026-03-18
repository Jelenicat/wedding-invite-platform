import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import InvitationCard from "../components/InvitationCard";
import FloralInvitationCard from "../components/FloralInvitationCard";
import FloralIntro from "../components/FloralIntro";
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
import demoWedding from "../data/demoWedding";
import "../styles/wedding.css";
import "../styles/intro.css";

function WeddingPage() {
  const { slug } = useParams();

  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [showInvitation, setShowInvitation] = useState(false);

  const wedding = useMemo(() => {
    return demoWedding.find((w) => w.slug === slug) || demoWedding[0];
  }, [slug]);

  const handleEnvelopeOpen = () => {
    setIsEnvelopeOpen(true);

    setTimeout(() => {
      setShowInvitation(true);
    }, 1600);
  };

  const handleIntroEnter = () => {
    setShowInvitation(true);
  };

  return (
    <div className="wedding-page">
      {!showInvitation && (
        <>
          {wedding.introType === "floral" ? (
            <FloralIntro
              brideName={wedding.brideName}
              groomName={wedding.groomName}
              onEnter={handleIntroEnter}
            />
          ) : wedding.introType === "minimal" ? (
            <MinimalIntro
              brideName={wedding.brideName}
              groomName={wedding.groomName}
              weddingDate={wedding.weddingDate}
              weddingTime={wedding.weddingTime}
              venue={wedding.venue}
              introText={wedding.introText}
              onEnter={handleIntroEnter}
            />
          ) : wedding.introType === "photo-script" ? (
            <PhotoScriptIntro
              brideName={wedding.brideName}
              groomName={wedding.groomName}
              videoSrc={wedding.videoSrc}
              onEnter={handleIntroEnter}
            />
          ) : wedding.introType === "photo-card" ? (
            <PhotoCardIntro
              brideName={wedding.brideName}
              groomName={wedding.groomName}
              weddingDate={wedding.weddingDate}
              location={wedding.venue}
              image={wedding.image}
              onEnter={handleIntroEnter}
            />
          ) : wedding.introType === "video-band" ? (
            <VideoBandIntro
              brideName={wedding.brideName}
              groomName={wedding.groomName}
              videoSrc={wedding.videoSrc}
              onEnter={handleIntroEnter}
            />
          ) : wedding.introType === "split-video" ? (
            <SplitVideoIntro
              brideName={wedding.brideName}
              groomName={wedding.groomName}
              videoSrc={wedding.videoSrc}
              onEnter={handleIntroEnter}
            />
          ) : wedding.introType === "split-image" ? (
            <SplitImageIntro
              brideName={wedding.brideName}
              groomName={wedding.groomName}
              imageSrc={wedding.image}
              onEnter={handleIntroEnter}
            />
          ) : (
            <EnvelopeIntro
              brideName={wedding.brideName}
              groomName={wedding.groomName}
              isOpen={isEnvelopeOpen}
              onOpen={handleEnvelopeOpen}
            />
          )}
        </>
      )}

      {showInvitation && (
        <>
          {wedding.introType === "floral" ? (
            <FloralInvitationCard
              brideName={wedding.brideName}
              groomName={wedding.groomName}
              details={wedding.details}
            />
          ) : wedding.introType === "minimal" ? (
            <MinimalInvitationCard
              brideName={wedding.brideName}
              groomName={wedding.groomName}
              details={wedding.details}
            />
          ) : wedding.introType === "photo-card" ? (
            <PhotoCardInvitationCard
              brideName={wedding.brideName}
              groomName={wedding.groomName}
              image={wedding.image}
              details={wedding.details}
            />
          ) : wedding.introType === "photo-script" ? (
            <PhotoScriptInvitationCard
              brideName={wedding.brideName}
              groomName={wedding.groomName}
              videoSrc={wedding.videoSrc}
              details={wedding.details}
            />
          ) : wedding.introType === "video-band" ? (
            <VideoBandInvitationCard
              brideName={wedding.brideName}
              groomName={wedding.groomName}
              videoSrc={wedding.videoSrc}
              details={wedding.details}
            />
          ) : wedding.introType === "split-video" ? (
            <SplitVideoInvitationCard
              brideName={wedding.brideName}
              groomName={wedding.groomName}
              videoSrc={wedding.videoSrc}
              details={wedding.details}
            />
          ) : wedding.introType === "split-image" ? (
            <SplitImageInvitationCard
              brideName={wedding.brideName}
              groomName={wedding.groomName}
              imageSrc={wedding.image}
              details={wedding.details}
            />
          ) : (
            <EnvelopeInvitationCard
              brideName={wedding.brideName}
              groomName={wedding.groomName}
              details={wedding.details}
            />
          )}
        </>
      )}
    </div>
  );
}

export default WeddingPage;