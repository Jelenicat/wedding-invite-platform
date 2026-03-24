import { motion } from "framer-motion";

function MinimalIntro({
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  venue,
  introText,
  backgroundImage,
  onEnter,
}) {
  const [day = "15", month = "JAN", year = "2025"] = weddingDate
    ? weddingDate.split(" ")
    : ["15", "JAN", "2025"];

  const finalBg = backgroundImage || "/images/minimal-bg.jpg";

  return (
    <section className="minimal-intro-v2">
      <div
        className="minimal-intro-v2-bg"
        style={{ backgroundImage: `url(${finalBg})` }}
      />
      <div className="minimal-intro-v2-fade" />

      <motion.div
        className="minimal-intro-v2-card"
        initial={{ opacity: 0, y: 20, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <div className="minimal-frame" />

        <p className="minimal-top-title">POZIVNICA</p>

        <div className="minimal-arch" />

        <h1 className="minimal-script-names">
          <span>{brideName}</span>
          <span className="minimal-amp">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M12 20
                   c-6-4.5-9-7.5-9-11
                   c0-2.5 2-4.5 4.5-4.5
                   c1.5 0 3 .8 4.5 2.3
                   c1.5-1.5 3-2.3 4.5-2.3
                   C19 4.5 21 6.5 21 9
                   c0 3.5-3 6.5-9 11z"
              />
            </svg>
          </span>
          <span>{groomName}</span>
        </h1>

        <div className="minimal-date-row">
          <div className="minimal-date-box">
            <span className="minimal-date-label">DAN</span>
            <span className="minimal-date-line" />
          </div>

          <div className="minimal-date-center">
            <span className="minimal-date-month">{month}</span>
            <span className="minimal-date-day">{day}</span>
            <span className="minimal-date-year">{year}</span>
          </div>

          <div className="minimal-date-box">
            <span className="minimal-date-label">{weddingTime || "17:00"}</span>
            <span className="minimal-date-line" />
          </div>
        </div>

        <p className="minimal-bottom-text">
          {introText ||
            "Sa velikom radošću vas pozivamo da svojim prisustvom ulepšate naš poseban dan."}
        </p>

        <p className="minimal-venue">{venue}</p>

        <button className="minimal-open-btn" onClick={onEnter}>
          OTVORI POZIVNICU
        </button>
      </motion.div>
    </section>
  );
}

export default MinimalIntro;