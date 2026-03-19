import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
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

  const invitation = useMemo(() => {
    return demoWedding.find((item) => item.slug === slug) || demoWedding[0];
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
          {invitation.introType === "floral" ? (
        <FloralIntro
  brideName={invitation.brideName}
  groomName={invitation.groomName}
  backgroundImage={invitation.backgroundImage}
  onEnter={handleIntroEnter}
/>
          ) : invitation.introType === "minimal" ? (
            <MinimalIntro
              brideName={invitation.brideName}
              groomName={invitation.groomName}
              weddingDate={invitation.weddingDate}
              weddingTime={invitation.weddingTime}
              venue={invitation.venue}
              introText={invitation.introText}
              onEnter={handleIntroEnter}
            />
          ) : invitation.introType === "photo-script" ? (
            <PhotoScriptIntro
              brideName={invitation.brideName}
              groomName={invitation.groomName}
              videoSrc={invitation.videoSrc}
              onEnter={handleIntroEnter}
            />
          ) : invitation.introType === "photo-card" ? (
            <PhotoCardIntro
              brideName={invitation.brideName}
              groomName={invitation.groomName}
              weddingDate={invitation.weddingDate}
              location={invitation.venue}
              image={invitation.image}
              onEnter={handleIntroEnter}
            />
          ) : invitation.introType === "video-band" ? (
            <VideoBandIntro
              brideName={invitation.brideName}
              groomName={invitation.groomName}
              videoSrc={invitation.videoSrc}
              onEnter={handleIntroEnter}
            />
          ) : invitation.introType === "split-video" ? (
            <SplitVideoIntro
              brideName={invitation.brideName}
              groomName={invitation.groomName}
              videoSrc={invitation.videoSrc}
              onEnter={handleIntroEnter}
            />
          ) : invitation.introType === "split-image" ? (
            <SplitImageIntro
              brideName={invitation.brideName}
              groomName={invitation.groomName}
              imageSrc={invitation.image}
              onEnter={handleIntroEnter}
            />
          ) : (
            <EnvelopeIntro
              brideName={invitation.brideName}
              groomName={invitation.groomName}
              isOpen={isEnvelopeOpen}
              onOpen={handleEnvelopeOpen}
            />
          )}
        </>
      )}

      {showInvitation && (
        <>
          {invitation.introType === "floral" ? (
            <FloralInvitationCard
              brideName={invitation.brideName}
              groomName={invitation.groomName}
              details={invitation.details}
            />
          ) : invitation.introType === "minimal" ? (
            <MinimalInvitationCard
              brideName={invitation.brideName}
              groomName={invitation.groomName}
              details={invitation.details}
            />
          ) : invitation.introType === "photo-card" ? (
            <PhotoCardInvitationCard
              brideName={invitation.brideName}
              groomName={invitation.groomName}
              image={invitation.image}
              details={invitation.details}
            />
          ) : invitation.introType === "photo-script" ? (
            <PhotoScriptInvitationCard
              brideName={invitation.brideName}
              groomName={invitation.groomName}
              videoSrc={invitation.videoSrc}
              details={invitation.details}
            />
          ) : invitation.introType === "video-band" ? (
            <VideoBandInvitationCard
              brideName={invitation.brideName}
              groomName={invitation.groomName}
              videoSrc={invitation.videoSrc}
              details={invitation.details}
            />
          ) : invitation.introType === "split-video" ? (
            <SplitVideoInvitationCard
              brideName={invitation.brideName}
              groomName={invitation.groomName}
              videoSrc={invitation.videoSrc}
              details={invitation.details}
            />
          ) : invitation.introType === "split-image" ? (
            <SplitImageInvitationCard
              brideName={invitation.brideName}
              groomName={invitation.groomName}
              imageSrc={invitation.image}
              details={invitation.details}
            />
          ) : (
            <EnvelopeInvitationCard
              brideName={invitation.brideName}
              groomName={invitation.groomName}
              details={invitation.details}
            />
          )}
        </>
      )}
    </div>
  );
}

export default WeddingPage;