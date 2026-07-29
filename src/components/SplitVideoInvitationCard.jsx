import { motion } from "framer-motion";
import SplitVideoRSVP from "./SplitVideoRSVP";
import SplitVideoCountdown from "./SplitVideoCountdown";
import "../styles/card.css";
import "../styles/rsvp.css";

function SplitVideoInvitationCard({
  brideName,
  groomName,
  details = {},
  slug,
  type,
  script = "latin",
}) {
  const isCyrillic =
    script === "cyrillic" ||
    details.script === "cyrillic" ||
    /[А-Яа-яЉЊЋЂЏђћљњџ]/.test(`${brideName || ""} ${groomName || ""}`);

  const safeBrideName = brideName || (isCyrillic ? "Млада" : "Bride");
  const safeGroomName = groomName || (isCyrillic ? "Младожења" : "Groom");

  const t = isCyrillic
    ? {
        welcome: "Добро дошли",
        day: "Дан",
        year: "Година",
        location: "Локација",
        map: "Погледај мапу",
        dressCode: "Дрес код",
        women: "Даме:",
        men: "Господа:",
      }
    : {
        welcome: "Dobrodošli",
        day: "Dan",
        year: "Godina",
        location: "Lokacija",
        map: "Pogledaj mapu",
        dressCode: "Dress code",
        women: "Dame:",
        men: "Gospoda:",
      };

  const getDateParts = () => {
    const monthNamesLatin = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAJ",
      "JUN",
      "JUL",
      "AVG",
      "SEP",
      "OKT",
      "NOV",
      "DEC",
    ];

    const monthNamesCyrillic = [
      "ЈАН",
      "ФЕБ",
      "МАР",
      "АПР",
      "МАЈ",
      "ЈУН",
      "ЈУЛ",
      "АВГ",
      "СЕП",
      "ОКТ",
      "НОВ",
      "ДЕЦ",
    ];

    const monthNames = isCyrillic ? monthNamesCyrillic : monthNamesLatin;

    if (details.date) {
      const cleanDate = details.date.trim();

      const spacedParts = cleanDate.split(/\s+/).filter(Boolean);
      if (spacedParts.length >= 3) {
        return [spacedParts[0], spacedParts[1], spacedParts[2]];
      }

      const numericDate = cleanDate.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
      if (numericDate) {
        const day = numericDate[1];
        const monthIndex = Number(numericDate[2]) - 1;
        const year = numericDate[3];

        return [day, monthNames[monthIndex] || numericDate[2], year];
      }
    }

    if (details.dateISO) {
      const isoDate = details.dateISO.match(/^(\d{4})-(\d{2})-(\d{2})/);

      if (isoDate) {
        const year = isoDate[1];
        const monthIndex = Number(isoDate[2]) - 1;
        const day = String(Number(isoDate[3]));

        return [day, monthNames[monthIndex] || isoDate[2], year];
      }
    }

    return isCyrillic ? ["18", "СЕП", "2026"] : ["18", "SEP", "2026"];
  };

  const [day, month, year] = getDateParts();

  const timelineItems =
    details.events?.filter((item) => item.label || item.time) || [];

  const dressCodeWomenText =
    typeof details.dressCodeWomen === "string"
      ? details.dressCodeWomen
      : "";

  const dressCodeMenText =
    typeof details.dressCodeMen === "string"
      ? details.dressCodeMen
      : "";

  const dressCodeWomenPalette =
    details.dressCodeWomenPalette?.length > 0
      ? details.dressCodeWomenPalette
      : Array.isArray(details.dressCodeWomen)
        ? details.dressCodeWomen
        : [];

  const dressCodeMenPalette =
    details.dressCodeMenPalette?.length > 0
      ? details.dressCodeMenPalette
      : Array.isArray(details.dressCodeMen)
        ? details.dressCodeMen
        : [];

  const hasWomenDressCode =
    Boolean(dressCodeWomenText) || dressCodeWomenPalette.length > 0;

  const hasMenDressCode =
    Boolean(dressCodeMenText) || dressCodeMenPalette.length > 0;

  const hasSeparatedDressCode =
    hasWomenDressCode || hasMenDressCode;

  const shouldShowDressCode =
    details.showDressCode &&
    (details.dressCodeTitle ||
      details.dressCodeNote ||
      details.dressCodePalette?.length > 0 ||
      hasSeparatedDressCode);

  const backgroundImage =
    details.backgroundImage || "/images/paper-texture1.jpg";

  const theme = details.theme || {};

  const themeStyles = {
    "--split-bg": theme.backgroundColor || "#f3ece6",
    "--split-paper-overlay-top":
      theme.paperOverlayTop || "rgba(247, 238, 233, 0.12)",
    "--split-paper-overlay-bottom":
      theme.paperOverlayBottom || "rgba(243, 231, 225, 0.12)",
    "--split-vignette": theme.vignetteColor || "rgba(0, 0, 0, 0.05)",

    "--split-main-text": theme.mainText || "#827167",
    "--split-soft-text": theme.softText || "#8a776c",
    "--split-script-text": theme.scriptText || "#7b6558",
    "--split-muted-text": theme.mutedText || "#9a877a",

    "--split-accent": theme.accent || "#8f8a64",
    "--split-accent-strong": theme.accentStrong || "#6e5a4e",
    "--split-button-text": theme.buttonText || "#fffaf5",

    "--split-card-bg": theme.cardBg || "rgba(255, 255, 255, 0.28)",
    "--split-card-border": theme.cardBorder || "rgba(145, 122, 108, 0.12)",
    "--split-frame-border": theme.frameBorder || "rgba(145, 122, 108, 0.15)",
    "--split-divider-line": theme.dividerLine || "rgba(145, 122, 108, 0.4)",
    "--split-divider-line-soft": "rgba(145, 122, 108, 0)",
    "--split-flow-line": theme.flowLine || "rgba(145, 122, 108, 0.55)",
    "--split-node-ring": theme.nodeRing || "rgba(143, 138, 100, 0.12)",
    "--split-shadow-soft": "rgba(0, 0, 0, 0.02)",
    "--split-shadow-strong": "rgba(0, 0, 0, 0.06)",
    "--split-palette-hover": "rgba(88, 71, 60, 0.08)",
  };

  const fadeUp = {
    initial: { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
  };

  return (
    <>
      <motion.section
        className={`split-video-invitation split-video-${slug || ""} ${
          isCyrillic ? "split-video-invitation--cyrillic" : ""
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div
          className="split-video-paper"
          style={{
            ...themeStyles,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="split-video-paper-inner">
            <motion.h1
              className="split-video-invitation-names top"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="split-video-name">{safeBrideName}</span>
              <span className="split-video-invitation-and block">&</span>
              <span className="split-video-name">{safeGroomName}</span>
            </motion.h1>

            <motion.p
              className="split-video-kicker"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
            >
              {t.welcome}
            </motion.p>

            {details.welcomeText && (
              <motion.p
                className="split-video-text"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.2 }}
              >
                {details.welcomeText}
              </motion.p>
            )}

            <motion.div
              className="split-video-calendar"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.28 }}
            >
              <div className="split-video-calendar-line" />

              <div className="split-video-calendar-grid">
                <div className="split-video-calendar-col">
                  <span className="split-video-calendar-label">{t.day}</span>
                  <span className="split-video-calendar-value">{day}</span>
                </div>

                <div className="split-video-calendar-col split-video-calendar-col-center">
                  <motion.span
                    className="split-video-calendar-heart"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.45 }}
                  >
                    ♡
                  </motion.span>

                  <span className="split-video-calendar-month">{month}</span>
                </div>

                <div className="split-video-calendar-col">
                  <span className="split-video-calendar-label">{t.year}</span>
                  <span className="split-video-calendar-value">{year}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="split-video-love-mark"
              initial={{ opacity: 0, scale: 0.8, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.5 }}
            >
              ♥
            </motion.div>

            {timelineItems.length > 0 && (
              <motion.div
                className="split-video-flow"
                {...fadeUp}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                {timelineItems.map((event, index) => (
                  <motion.div
                    key={`${event.label}-${index}`}
                    className="split-video-flow-item"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                  >
                    <motion.div
                      className="split-video-flow-node"
                      initial={{ opacity: 0, scale: 0.6 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.35,
                        delay: index * 0.08 + 0.08,
                      }}
                    />

                    <div className="split-video-flow-curve" />

                    <div className="split-video-flow-content">
                      <h4 className="split-video-flow-title">{event.label}</h4>

                      {event.time && (
                        <p className="split-video-flow-time">{event.time}</p>
                      )}

                      {event.location &&
                        (event.mapLink ? (
                          <a
                            href={event.mapLink}
                            target="_blank"
                            rel="noreferrer"
                            className="split-video-flow-location is-link"
                          >
                            {event.location}
                          </a>
                        ) : (
                          <p className="split-video-flow-location">
                            {event.location}
                          </p>
                        ))}

                      {event.note && (
                        <p className="split-video-flow-note">{event.note}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {(details.mapLink || details.venue) && (
              <motion.div
                className="split-video-location-box"
                {...fadeUp}
                transition={{ duration: 0.65 }}
              >
                <h3 className="split-video-section-script">{t.location}</h3>

                {details.venue && (
                  <p className="split-video-location-text">{details.venue}</p>
                )}

                {details.mapLink && (
                  <a
                    href={details.mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="split-video-location-link"
                  >
                    {t.map}
                  </a>
                )}
              </motion.div>
            )}

            {shouldShowDressCode && (
              <motion.div
                className="split-video-dresscode-box"
                {...fadeUp}
                transition={{ duration: 0.65 }}
              >
                <h3 className="split-video-section-script">
                  {details.dressCodeTitle || t.dressCode}
                </h3>

                {details.dressCodeNote && (
                  <p className="split-video-section-note">
                    {details.dressCodeNote}
                  </p>
                )}

                {hasSeparatedDressCode ? (
                  <>
                    {hasWomenDressCode && (
                      <div className="split-video-dresscode-role">
                        <p className="split-video-dresscode-role-title">
                          {t.women}
                        </p>

                        {dressCodeWomenText && (
                          <p className="split-video-dresscode-role-text">
                            {dressCodeWomenText}
                          </p>
                        )}

                        {dressCodeWomenPalette.length > 0 && (
                          <div className="split-video-palette">
                            {dressCodeWomenPalette.map((color, index) => (
                              <motion.span
                                key={`women-${color}-${index}`}
                                className="split-video-palette-dot"
                                style={{ backgroundColor: color }}
                                initial={{ opacity: 0, scale: 0.7, y: 8 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                  duration: 0.35,
                                  delay: index * 0.06,
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {hasMenDressCode && (
                      <div className="split-video-dresscode-role split-video-dresscode-role-men">
                        <p className="split-video-dresscode-role-title">
                          {t.men}
                        </p>

                        {dressCodeMenText && (
                          <p className="split-video-dresscode-role-text">
                            {dressCodeMenText}
                          </p>
                        )}

                        {dressCodeMenPalette.length > 0 && (
                          <div className="split-video-palette">
                            {dressCodeMenPalette.map((color, index) => (
                              <motion.span
                                key={`men-${color}-${index}`}
                                className="split-video-palette-dot"
                                style={{ backgroundColor: color }}
                                initial={{ opacity: 0, scale: 0.7, y: 8 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                  duration: 0.35,
                                  delay: index * 0.06,
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  details.dressCodePalette?.length > 0 && (
                    <div className="split-video-palette">
                      {details.dressCodePalette.map((color, index) => (
                        <motion.span
                          key={`${color}-${index}`}
                          className="split-video-palette-dot"
                          style={{ backgroundColor: color }}
                          initial={{ opacity: 0, scale: 0.7, y: 8 }}
                          whileInView={{ opacity: 1, scale: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.35, delay: index * 0.06 }}
                        />
                      ))}
                    </div>
                  )
                )}
              </motion.div>
            )}

            {details.note && (
              <motion.p
                className="split-video-note"
                {...fadeUp}
                transition={{ duration: 0.6 }}
              >
                {details.note}
              </motion.p>
            )}
          </div>
        </div>
      </motion.section>

      <SplitVideoRSVP
        slug={slug}
        eventType={type}
        details={details}
        script={script}
      />

      {details.dateISO && (
        <SplitVideoCountdown
          targetDate={details.dateISO}
          brideName={safeBrideName}
          groomName={safeGroomName}
          details={details}
          script={script}
          slug={slug}
        />
      )}
    </>
  );
}

export default SplitVideoInvitationCard;