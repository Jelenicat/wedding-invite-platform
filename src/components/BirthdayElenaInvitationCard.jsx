import { motion } from "framer-motion";
import BirthdayElenaRSVP from "./BirthdayElenaRSVP";
import BirthdayElenaCountdown from "./BirthdayElenaCountdown";
import "../styles/birthdaycard.css";

function GemHeart({ className = "" }) {
  return (
    <svg
      className={`birthday-elena-card__gem ${className}`}
      viewBox="0 0 44 40"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="birthdayElenaCardGem"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0" stopColor="#fff8f3" />
          <stop offset="0.28" stopColor="#efc2b2" />
          <stop offset="0.58" stopColor="#c77c69" />
          <stop offset="0.82" stopColor="#9f5d4d" />
          <stop offset="1" stopColor="#f0c7b8" />
        </linearGradient>
      </defs>

      <path
        d="M22 35.8 5.9 20.2C-3.8 10.7 9.3-3 19.1 6.5L22 9.4l2.9-2.9C34.7-3 47.8 10.7 38.1 20.2Z"
        fill="url(#birthdayElenaCardGem)"
        stroke="rgba(143,82,66,.65)"
        strokeWidth="1.15"
      />

      <path
        d="M7.8 13.1 19.2 7.7 15 20.6 22 34.1 26.2 20.6 36.2 12.9 24.8 8.1 22 10.9 19.2 8.1Z"
        fill="none"
        stroke="rgba(255,255,255,.48)"
        strokeWidth="1"
      />
    </svg>
  );
}

function TopOrnament() {
  return (
    <div
      className="birthday-elena-card__ornament"
      aria-hidden="true"
    >
      <svg viewBox="0 0 164 44">
        <path d="M73 23c-12-14-26-14-33-5-5 7 3 14 10 9 4-2 5-7 1-10" />
        <path d="M42 21c-11 0-17 5-20 11" />
        <path d="M91 23c12-14 26-14 33-5 5 7-3 14-10 9-4-2-5-7-1-10" />
        <path d="M122 21c11 0 17 5 20 11" />
        <path d="M82 29v8" />
        <path d="M78 34h8" />
      </svg>

      <GemHeart />
    </div>
  );
}

function Divider() {
  return (
    <div
      className="birthday-elena-card__divider"
      aria-hidden="true"
    >
      <span />
      <GemHeart />
      <span />
    </div>
  );
}

function AnjaHeartDivider({
  compact = false,
}) {
  return (
    <div
      className={[
        "birthday-elena-card__anja-heart-divider",
        compact
          ? "birthday-elena-card__anja-heart-divider--compact"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      <span />
      <i>♡</i>
      <span />
    </div>
  );
}

function AnjaBow() {
  return (
    <svg
      className="birthday-elena-card__anja-bow"
      viewBox="0 0 92 64"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="anjaBowGradient"
          x1="18"
          y1="10"
          x2="70"
          y2="57"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#f8e8d8" />
          <stop offset="0.38" stopColor="#d7b391" />
          <stop offset="0.65" stopColor="#fff2e3" />
          <stop offset="1" stopColor="#b98c69" />
        </linearGradient>
      </defs>

      <path
        d="M45.8 28.7C36.2 12.4 20.5 7.8 12.7 14.9c-7.2 6.7 1.4 18.3 12.3 16.2 8.1-1.6 14.4-7.2 20.8-2.4Z"
        fill="url(#anjaBowGradient)"
        stroke="#c7a17e"
        strokeWidth="1.2"
      />

      <path
        d="M46.2 28.7C55.8 12.4 71.5 7.8 79.3 14.9c7.2 6.7-1.4 18.3-12.3 16.2-8.1-1.6-14.4-7.2-20.8-2.4Z"
        fill="url(#anjaBowGradient)"
        stroke="#c7a17e"
        strokeWidth="1.2"
      />

      <ellipse
        cx="46"
        cy="29"
        rx="8"
        ry="6.5"
        fill="url(#anjaBowGradient)"
        stroke="#c7a17e"
        strokeWidth="1.2"
      />

      <path
        d="M42 34 31 58l14-8 2-15"
        fill="url(#anjaBowGradient)"
        stroke="#c7a17e"
        strokeWidth="1.2"
      />

      <path
        d="m50 34 11 24-14-8-2-15"
        fill="url(#anjaBowGradient)"
        stroke="#c7a17e"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function AnjaBowDivider() {
  return (
    <div
      className="birthday-elena-card__anja-bow-divider"
      aria-hidden="true"
    >
      <span />
      <AnjaBow />
      <span />
    </div>
  );
}

function InfoIcon({ type }) {
  if (type === "calendar") {
    return (
      <svg viewBox="0 0 64 64" fill="none">
        <rect
          x="12"
          y="16"
          width="40"
          height="36"
          rx="3"
        />

        <path d="M20 10v12M44 10v12M12 26h40" />

        <path d="M24 34h1M32 34h1M40 34h1M24 42h1M32 42h1M40 42h1" />
      </svg>
    );
  }

  if (type === "clock") {
    return (
      <svg viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="21" />
        <path d="M32 20v14l9 5" />
      </svg>
    );
  }

  if (type === "location") {
    return (
      <svg viewBox="0 0 64 64" fill="none">
        <path d="M32 54s17-15.1 17-29a17 17 0 1 0-34 0c0 13.9 17 29 17 29Z" />
        <circle cx="32" cy="25" r="6" />
      </svg>
    );
  }

  if (type === "mail") {
    return (
      <svg viewBox="0 0 64 64" fill="none">
        <rect
          x="10"
          y="16"
          width="44"
          height="34"
          rx="3"
        />
        <path d="m12 20 20 16 20-16" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M25 12c3 5 11 5 14 0l5 8-6 5v27H26V25l-6-5 5-8Z" />
      <path d="M26 31h12" />
      <path d="M26 52 17 57M38 52l9 5" />
    </svg>
  );
}

function InfoRow({
  icon,
  children,
  href,
  className = "",
  delay = 0,
}) {
  const content = (
    <>
      <span
        className="birthday-elena-card__info-icon"
        aria-hidden="true"
      >
        <InfoIcon type={icon} />
      </span>

      <span
        className="birthday-elena-card__info-line"
        aria-hidden="true"
      >
        <i />
      </span>

      <span className="birthday-elena-card__info-copy">
        {children}
      </span>
    </>
  );

  const animation = {
    initial: {
      opacity: 0,
      y: 14,
    },

    whileInView: {
      opacity: 1,
      y: 0,
    },

    viewport: {
      once: true,
      amount: 0.25,
    },

    transition: {
      duration: 0.55,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  };

  if (href) {
    return (
      <motion.a
        {...animation}
        className={`birthday-elena-card__info-row ${className}`}
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div
      {...animation}
      className={`birthday-elena-card__info-row ${className}`}
    >
      {content}
    </motion.div>
  );
}

function BirthdayElenaInvitationCard({
  slug,
  brideName,
  weddingDate,
  weddingTime,
  venue,
  details = {},
  backgroundImage,
}) {
  const isAnja18 =
    slug === "anja-18";

  const name =
    details?.birthdayIntro?.name ||
    brideName ||
    "Elena";

  const age =
    details?.age ??
    details?.birthdayIntro?.age ??
    18;

  const date =
    details?.date ||
    weddingDate ||
    "12.09.2026.";

  const time =
    weddingTime ||
    details?.time ||
    "18:00";

  const welcomeText =
    details?.welcomeText ||
    `Pozivamo vas da zajedno proslavimo ${name}in 18. rođendan.`;

  const locationName =
    details?.locationName ||
    details?.venue ||
    venue ||
    "Svečana sala Lollywood";

  const locationAddress =
    details?.locationAddress ||
    "Savska 2a, Ostružnica";

  const mapLink =
    details?.mapLink ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${locationName} ${locationAddress}`
    )}`;

  const rsvpText =
    details?.rsvpText ||
    details?.note ||
    "Dolazak potvrditi do 01.09.2026.";

  const dressCodeTitle =
    details?.dressCodeTitle ||
    "Dress code";

  const dressCodeNote =
    details?.dressCodeNote ||
    "Sve osim belog i baby roze.";

  const cardBackground =
    details?.cardBackground ||
    details?.cardBackgroundImage ||
    backgroundImage ||
    "/images/elena-intro/invitation-background.webp";

  const rsvpBackground =
    details?.rsvpImage ||
    details?.rsvpBackgroundImage ||
    cardBackground;

  const countdownBackground =
    details?.birthdayGalleryCountdown?.backgroundImage ||
    details?.countdownImage ||
    details?.countdownBackgroundImage ||
    cardBackground;

  const displayedTime =
    typeof time === "string"
      ? time.replace(":00", "h")
      : time;

  const showDressCode =
    details?.showDressCode !== false;

  return (
    <>
      <section
        className={[
          "birthday-elena-card",
          slug
            ? `birthday-elena-card--${slug}`
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          "--birthday-elena-card-bg":
            `url("${cardBackground}")`,
        }}
      >
        <div className="birthday-elena-card__background" />
        <div className="birthday-elena-card__overlay" />

        <motion.div
          className="birthday-elena-card__content"
          initial={{
            opacity: 0,
            y: 22,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {isAnja18 ? (
            <AnjaHeartDivider compact />
          ) : (
            <TopOrnament />
          )}

          <header className="birthday-elena-card__heading">
            <h2
              className="birthday-elena-card__name"
              data-text={name}
            >
              {name}
            </h2>

            <p className="birthday-elena-card__subtitle">
              {age}. ROĐENDAN
            </p>

            {isAnja18 && (
              <>
                <AnjaHeartDivider />

                <p className="birthday-elena-card__welcome">
                  {welcomeText}
                </p>
              </>
            )}
          </header>

          {isAnja18 ? (
            <AnjaBowDivider />
          ) : (
            <Divider />
          )}

          <div className="birthday-elena-card__details">
            {isAnja18 ? (
              <>
                <InfoRow
                  icon="calendar"
                  className="birthday-elena-card__info-row--anja"
                  delay={0.05}
                >
                  <strong>DATUM</strong>

                  <span className="birthday-elena-card__info-value">
                    {date}
                  </span>
                </InfoRow>

                <InfoRow
                  icon="clock"
                  className="birthday-elena-card__info-row--anja"
                  delay={0.1}
                >
                  <strong>VREME</strong>

                  <span className="birthday-elena-card__info-value">
                    {displayedTime}
                  </span>
                </InfoRow>

                <InfoRow
                  icon="location"
                  className="birthday-elena-card__info-row--anja"
                  href={mapLink}
                  delay={0.15}
                >
                  <strong>MESTO</strong>

                  <span className="birthday-elena-card__info-value">
                    {locationName}
                  </span>

                  <span className="birthday-elena-card__info-address">
                    {locationAddress}
                  </span>
                </InfoRow>
              </>
            ) : (
              <>
                <InfoRow
                  icon="calendar"
                  delay={0.05}
                >
                  <strong>{date}</strong>
                </InfoRow>

                <InfoRow
                  icon="clock"
                  delay={0.1}
                >
                  <strong>{displayedTime}</strong>
                </InfoRow>

                <InfoRow
                  icon="location"
                  href={mapLink}
                  delay={0.15}
                >
                  <strong>{locationName}</strong>
                  <span>{locationAddress}</span>
                </InfoRow>

                <InfoRow
                  icon="mail"
                  delay={0.2}
                >
                  <strong>{rsvpText}</strong>
                </InfoRow>
              </>
            )}
          </div>

          {isAnja18 && (
            <motion.div
              className="birthday-elena-card__anja-footer"
              initial={{
                opacity: 0,
                y: 12,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.3,
              }}
              transition={{
                duration: 0.6,
                delay: 0.22,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <p>Veselimo se vašem dolasku!</p>

              <AnjaHeartDivider compact />
            </motion.div>
          )}

          {showDressCode && (
            <motion.div
              className="birthday-elena-card__dresscode"
              initial={{
                opacity: 0,
                y: 14,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.25,
              }}
              transition={{
                duration: 0.55,
                delay: 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {isAnja18 ? (
                <AnjaHeartDivider />
              ) : (
                <div
                  className="birthday-elena-card__dresscode-divider"
                  aria-hidden="true"
                >
                  <span />
                  <GemHeart />
                  <span />
                </div>
              )}

              <h3>{dressCodeTitle}</h3>
              <p>{dressCodeNote}</p>
            </motion.div>
          )}

          {!isAnja18 && (
            <TopOrnament />
          )}
        </motion.div>
      </section>

      <BirthdayElenaRSVP
        slug={slug}
        eventType="birthday"
        brideName={brideName}
        details={details}
        backgroundImage={rsvpBackground}
      />

      <BirthdayElenaCountdown
        slug={slug}
        targetDate={details?.dateISO}
        brideName={brideName}
        weddingDate={weddingDate}
        weddingTime={weddingTime}
        venue={venue}
        details={details}
        backgroundImage={countdownBackground}
        showCalendarButton={
          details?.showCalendarButton
        }
      />
    </>
  );
}

export default BirthdayElenaInvitationCard;