import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import NewlywedTimesCountdown, {
  NewlywedTimesAnimationContext,
  NewlywedTimesCalendar,
  NewlywedTimesFolio,
  NewlywedTimesNames,
  NewlywedTimesPhoto,
  NewlywedTimesReveal,
  NewlywedTimesRule,
  NewlywedTimesText,
  newlywedTimesCopy,
  newlywedTimesDate,
} from "./NewlywedTimesCountdown";
import NewlywedTimesRSVP from "./NewlywedTimesRSVP";
import "../styles/newintro.css";
import "../styles/newcard.css";
import "../styles/newrsvp.css";

export default function NewlywedTimesInvitationCard({
  brideName = "Ana",
  groomName = "Nikola",
  weddingDate,
  venue,
  details = {},
  slug,
  type = "wedding",
  script = "latin",
  language = "sr",
  introReady = true,
}) {
  const ref = useRef(null),
    reduced = useReducedMotion(),
    config = details.newlywedTimes || {},
    t = newlywedTimesCopy(language, script),
    date = newlywedTimesDate(details.dateISO, language, script);
  const edition = details.date || date?.label || weddingDate || "",
    city = config.city || details.locationAddress || "",
    map = details.locationButtonLink || details.mapLink;
  const photos = {
    cover: config.coverImage || "/images/newlywed-times-cover.webp",
    story: config.storyImage || "/images/newlywed-times-story.webp",
    portrait: config.portraitImage || "/images/newlywed-times-portrait.webp",
  };
  const events = (details.events || []).filter((e) => e.label || e.time);
  useEffect(() => {
    if (!introReady) return;
    const html = document.documentElement,
      old = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    html.style.scrollBehavior = old;
    ref.current?.focus({ preventScroll: true });
  }, [introReady, slug]);
  return (
    <NewlywedTimesAnimationContext.Provider value={introReady}>
      <article
        ref={ref}
        tabIndex={-1}
        className={`nwt nwt-card ${script === "cyrillic" ? "nwt-cyrillic" : ""}`}
        lang={
          language === "sr"
            ? script === "cyrillic"
              ? "sr-Cyrl"
              : "sr-Latn"
            : language
        }
      >
        <section className="nwt-sheet nwt-front">
          <NewlywedTimesFolio
            date={edition}
            city={city}
            label={config.issueLabel || t.issue}
          />
          <header className="nwt-front-heading">
            <NewlywedTimesText as="h2" letters className="nwt-masthead">
              {config.masthead || "NEWLYWED TIMES"}
            </NewlywedTimesText>
            <NewlywedTimesReveal>
              <p className="nwt-edition-line">
                {config.editionLine || t.edition}
              </p>
            </NewlywedTimesReveal>
          </header>
          <div className="nwt-cover">
            <span className="nwt-cover-label">
              {config.coverLabel ||
                (language === "en"
                  ? "WE ARE GETTING MARRIED"
                  : language === "de"
                    ? "WIR HEIRATEN"
                    : script === "cyrillic"
                      ? "ВЕНЧАВАМО СЕ"
                      : "VENČAVAMO SE")}
            </span>
            <NewlywedTimesPhoto
              src={photos.cover}
              className="nwt-cover-photo"
              eager
              position={config.coverPosition || "50% 0%"}
            />
            <div className="nwt-cover-copy">
              <NewlywedTimesNames brideName={brideName} groomName={groomName} />
              <NewlywedTimesText
                as="p"
                className="nwt-cover-invite"
                delay={0.12}
              >
                {config.coverLine || t.invite}
              </NewlywedTimesText>
            </div>
          </div>
          <div className="nwt-front-bottom">
            <span>{edition}</span>
            <span>{config.coverFootnote || t.special}</span>
            <span>01</span>
          </div>
        </section>

        <section className="nwt-sheet nwt-story">
          <NewlywedTimesFolio
            date={edition}
            city={city}
            page={2}
            label={t.storyPage}
          />
          <NewlywedTimesPhoto
            src={photos.story}
            className="nwt-story-photo"
            position={config.storyPosition || "50% 40%"}
          />
          <p className="nwt-photo-credit">
            {brideName} &amp; {groomName} · {edition}
          </p>
          <div className="nwt-story-columns">
            <div className="nwt-story-lead">
              <NewlywedTimesText className="nwt-story-headline">
                {config.storyHeadline || t.story}
              </NewlywedTimesText>
              <NewlywedTimesText as="p" className="nwt-story-script" scriptText>
                {config.storyAccent ||
                  (script === "cyrillic"
                    ? "заувек"
                    : language === "en"
                      ? "forever"
                      : language === "de"
                        ? "für immer"
                        : "zauvek")}
              </NewlywedTimesText>
              <NewlywedTimesReveal>
                <p className="nwt-kicker">{t.guests}</p>
                <p className="nwt-copy nwt-welcome-copy">
                  {details.welcomeText || t.storyText}
                </p>
              </NewlywedTimesReveal>
            </div>
            <div className="nwt-story-article">
              <NewlywedTimesText as="h3" className="nwt-article-heading">
                {config.storyTitle || t.storyTitle}
              </NewlywedTimesText>
              <NewlywedTimesReveal>
                <p className="nwt-copy nwt-dropcap">
                  {config.storyText || t.storyText}
                </p>
                {details.note && <p className="nwt-copy">{details.note}</p>}
              </NewlywedTimesReveal>
            </div>
          </div>
          <NewlywedTimesReveal className="nwt-pullquote">
            <span className="nwt-quote-mark" aria-hidden="true">
              “
            </span>
            <p>{config.quote || t.quote}</p>
          </NewlywedTimesReveal>
          {events.length > 0 && (
            <section
              className="nwt-program"
              aria-labelledby="nwt-program-title"
            >
              <NewlywedTimesRule />
              <NewlywedTimesText as="h2" className="nwt-section-headline">
                {config.programTitle || t.program}
              </NewlywedTimesText>
              <p
                id="nwt-program-title"
                className="nwt-kicker nwt-program-subtitle"
              >
                {config.programSubtitle || t.programSmall}
              </p>
              <ol className="nwt-event-grid">
                {events.map((e, i) => (
                  <motion.li
                    key={`${e.time}-${i}`}
                    initial={reduced ? false : { opacity: 0, y: 14 }}
                    whileInView={introReady ? { opacity: 1, y: 0 } : undefined}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.75,
                      delay: reduced ? 0 : i * 0.08,
                    }}
                  >
                    <span className="nwt-event-index" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="nwt-event-time">
                      <time>{e.time}</time>
                      <img
                        src={
                          i === 0
                            ? "/icons/newlywed-times-toast.svg"
                            : i === 1
                              ? "/icons/newlywed-times-rings.svg"
                              : "/icons/newlywed-times-arch.svg"
                        }
                        width="34"
                        height="34"
                        alt=""
                      />
                    </div>
                    <div className="nwt-event-copy">
                      <h3>{e.label}</h3>
                      {e.location && <p>{e.location}</p>}
                      {(e.note || e.description) && (
                        <p>{e.note || e.description}</p>
                      )}
                      {e.mapLink && (
                        <a
                          className="nwt-text-link"
                          href={e.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t.map}
                          <img
                            src="/icons/newlywed-times-arrow.svg"
                            width="16"
                            height="8"
                            alt=""
                          />
                        </a>
                      )}
                    </div>
                  </motion.li>
                ))}
              </ol>
            </section>
          )}
          <div className="nwt-page-end">
            <span>{t.next}</span>
            <span>02</span>
          </div>
        </section>

        <section className="nwt-sheet nwt-details">
          <NewlywedTimesFolio
            date={edition}
            city={city}
            page={3}
            label={t.detailsPage}
          />
          <NewlywedTimesText className="nwt-details-headline">
            {config.detailsHeadline || t.details}
          </NewlywedTimesText>
          <div className="nwt-location-spread">
            <NewlywedTimesReveal className="nwt-location-feature">
              <p className="nwt-kicker nwt-location-label">{t.location}</p>
              <h3 className="nwt-venue">
                {details.locationName || venue || details.venue}
              </h3>
              {details.locationAddress && (
                <p className="nwt-location-address">
                  {details.locationAddress}
                </p>
              )}
              {details.showLocationButton && map && (
                <a
                  className="nwt-button nwt-location-button"
                  href={map}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {details.locationButtonText || t.map}
                  <img
                    src="/icons/newlywed-times-arrow.svg"
                    width="23"
                    height="12"
                    alt=""
                  />
                </a>
              )}
            </NewlywedTimesReveal>
            <NewlywedTimesReveal className="nwt-date-feature">
              <p className="nwt-kicker">
                {config.dateHeading || t.detailsSmall}
              </p>
              {date ? (
                <>
                  <span className="nwt-date-large" aria-hidden="true">
                    {String(date.d).padStart(2, "0")}
                  </span>
                  <p className="nwt-date-legend" aria-label={edition}>
                    {date.month}
                    <span>{date.y}</span>
                  </p>
                </>
              ) : (
                <p className="nwt-date-legend">{edition}</p>
              )}
            </NewlywedTimesReveal>
          </div>
          <div className="nwt-keepsake-spread">
            <div className="nwt-calendar-column">
              <p className="nwt-kicker">{config.dateHeading || t.month}</p>
              {config.showCalendar !== false && (
                <NewlywedTimesCalendar
                  dateISO={details.dateISO}
                  script={script}
                  language={language}
                />
              )}
              <p className="nwt-sidebar-date">{edition}</p>
            </div>
            <div className="nwt-portrait-column">
              <NewlywedTimesPhoto
                src={photos.portrait}
                className="nwt-sidebar-photo"
                position={config.portraitPosition || "50% 15%"}
              />
              <p className="nwt-sidebar-caption">
                {brideName}
                <br />
                &amp; {groomName}
              </p>
            </div>
          </div>
          {details.showDressCode && (
            <NewlywedTimesReveal className="nwt-dress">
              <div className="nwt-dress-heading">
                <p className="nwt-kicker">{t.dress}</p>
                <h3>{details.dressCodeTitle || t.dress}</h3>
              </div>
              <div className="nwt-dress-copy">
                {details.dressCodeNote && (
                  <p className="nwt-copy">{details.dressCodeNote}</p>
                )}
                {(details.dressCodeWomen || details.dressCodeMen) && (
                  <div className="nwt-dress-guide">
                    {details.dressCodeWomen && (
                      <p className="nwt-copy">
                        <strong>{t.women}</strong>
                        {details.dressCodeWomen}
                      </p>
                    )}
                    {details.dressCodeMen && (
                      <p className="nwt-copy">
                        <strong>{t.men}</strong>
                        {details.dressCodeMen}
                      </p>
                    )}
                  </div>
                )}
                {details.dressCodePalette?.length > 0 && (
                  <ul
                    className="nwt-palette"
                    aria-label={details.dressCodeTitle || t.dress}
                  >
                    {details.dressCodePalette.map((c, i) => (
                      <li
                        key={i}
                        style={{
                          backgroundColor: typeof c === "string" ? c : c.color,
                        }}
                        aria-label={
                          typeof c === "string" ? c : c.label || c.color
                        }
                      />
                    ))}
                  </ul>
                )}
              </div>
            </NewlywedTimesReveal>
          )}
          {config.giftsText && (
            <NewlywedTimesReveal className="nwt-little-note">
              <p className="nwt-copy">{config.giftsText}</p>
            </NewlywedTimesReveal>
          )}
          {config.showCountdown !== false && (
            <NewlywedTimesCountdown
              targetDate={details.dateISO}
              brideName={brideName}
              groomName={groomName}
              details={details}
              language={language}
              script={script}
            />
          )}
          <div className="nwt-page-end">
            <span>{edition}</span>
            <span>03</span>
          </div>
        </section>

        <section className="nwt-sheet nwt-reply-sheet">
          <NewlywedTimesFolio
            date={edition}
            city={city}
            page={4}
            label={t.rsvpPage}
          />
          {config.showRSVP !== false && (
            <NewlywedTimesRSVP
              slug={slug}
              eventType={type}
              details={details}
              script={script}
              language={language}
            />
          )}
          {(config.contacts || []).some((p) => p.phone) && (
            <div className="nwt-contacts">
              {config.contacts
                .filter((p) => p.phone)
                .map((p, i) => (
                  <a
                    key={i}
                    href={`tel:${String(p.phone).replace(/[^+\d]/g, "")}`}
                  >
                    <span>{p.name}</span>
                    {p.phone}
                  </a>
                ))}
            </div>
          )}
          <footer className="nwt-signoff">
            <NewlywedTimesText as="p" scriptText>
              {config.closingTitle || t.love}
            </NewlywedTimesText>
            <p>
              {brideName} &amp; {groomName}
            </p>
            <NewlywedTimesRule />
            <p className="nwt-kicker">{config.masthead || "NEWLYWED TIMES"}</p>
            <span className="nwt-signoff-date">{edition}</span>
          </footer>
          <div className="nwt-page-end">
            <span>{t.special}</span>
            <span>04</span>
          </div>
        </section>
      </article>
    </NewlywedTimesAnimationContext.Provider>
  );
}
