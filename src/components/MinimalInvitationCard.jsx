import { motion } from "framer-motion";
import MinimalRSVP from "./MinimalRSVP";
import MinimalCountdown from "./MinimalCountdown";
import "../styles/card.css";
import "../styles/rsvp.css";
function MinimalInvitationCard({ brideName, groomName, details = {}, backgroundImage, slug, type, script = "latin", language = "sr", }) {
    const safeBrideName = brideName || "Bride";
    const safeGroomName = groomName || "Groom";
    const finalBg = backgroundImage || "/images/minimal-bg.jpg";
    const shouldUseNamesSvg = slug === "jovana-dusan-1";
    const isAndrijanaMarko = slug === "andrijana-marko" || slug === "andrijana-marko-1";
    const isJovanaAleksandarSlug = slug === "jovana-aleksandar";
    const splitPersonName = (fullName = "") => {
        const parts = fullName.trim().split(/\s+/);
        return {
            firstName: parts[0] || "",
            lastName: parts.slice(1).join(" "),
        };
    };
    const brideCardName = splitPersonName(safeBrideName);
    const groomCardName = splitPersonName(safeGroomName);
    const t = language === "de"
        ? {
            invitation: "Einladung",
            date: "Datum",
            plan: "Tagesablauf",
            dressCode: "Dresscode",
            women: "Damen:",
            men: "Herren:",
            location: "Standort anzeigen",
        }
        : language === "en"
            ? {
                invitation: "Invitation",
                date: "Date",
                plan: "Wedding timeline",
                dressCode: "Dress code",
                women: "Ladies:",
                men: "Gentlemen:",
                location: "View location",
            }
            : script === "cyrillic"
                ? {
                    invitation: "Позивница",
                    date: "Датум",
                    plan: "План венчања",
                    dressCode: "Дрес код",
                    women: "Даме:",
                    men: "Мушкарци:",
                    location: "Погледај локацију",
                }
                : {
                    invitation: "Pozivnica",
                    date: "Datum",
                    plan: "Plan venčanja",
                    dressCode: "Dress code",
                    women: "Dame:",
                    men: "Muškarci:",
                    location: "Pogledaj lokaciju",
                };
    const iconMap = {
        gathering: "/icons/gathering.svg",
        guests: "/icons/guests.svg",
        church: "/icons/church.svg",
        groom: "/icons/groom.svg",
        civil: "/icons/civil.svg",
        ceremony: "/icons/ceremony.svg",
        dinner: "/icons/dinner.svg",
        restaurant: "/icons/restaurant.svg",
        party: "/icons/party.svg",
        rings: "/icons/rings.svg",
        angel: "/icons/angel.svg",
        dresscode: "/icons/dresscode.svg",
        cake: "/icons/cake.svg",
        vecera: "/icons/vecera.svg",
    };
    const timelineItems = details.events?.filter((item) => item.label || item.time) || [];
    const shouldShowDressCode = details.showDressCode &&
        (details.dressCodeTitle ||
            details.dressCodeNote ||
            details.dressCodeWomen ||
            details.dressCodeMen ||
            details.dressCodePalette?.length > 0);
    return (<>

      <motion.section className={`minimal-invitation-card minimal-slug-${slug || ""}`} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>

        <div className="minimal-invitation-bg" style={{ backgroundImage: `url(${finalBg})` }}/>

        <div className="minimal-invitation-overlay"/>

        <div className="minimal-invitation-paper">

          <div className="minimal-invitation-frame"/>

          <p className="minimal-invitation-kicker">

            {t.invitation}

          </p>

          <div className="minimal-invitation-monogram">

            <span>{safeBrideName[0]}</span>

            <span className="minimal-invitation-monogram-and">

              &

            </span>

            <span>{safeGroomName[0]}</span>

          </div>

          {slug === "gordana-milos" && (<p className="minimal-gordana-milos-vow">

              Везани љубављу, заједно пред Богом

            </p>)}

          {shouldUseNamesSvg ? (<div className="minimal-names-svg-wrap" aria-label={`${safeBrideName} & ${safeGroomName}`}>

              <span className="minimal-names-svg-mask"/>

            </div>) : (<h1 className={`minimal-invitation-names ${script === "cyrillic"
                ? "minimal-invitation-names-cyrillic"
                : ""} ${isJovanaAleksandarSlug
                ? "minimal-invitation-names-full"
                : ""} ${slug === "teodora-petar"
                ? "teodora-petar-card-names"
                : ""}`}>

              {isJovanaAleksandarSlug ? (<>

                  <span className="minimal-person-name">

                    <span className="minimal-person-first">

                      {brideCardName.firstName}

                    </span>

                    {brideCardName.lastName && (<span className="minimal-person-last">

                        {brideCardName.lastName}

                      </span>)}

                  </span>

                  <span className="minimal-invitation-amp minimal-invitation-amp-full">

                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">

                      <path d="M12 20

                        c-6-4.5-9-7.5-9-11

                        c0-2.5 2-4.5 4.5-4.5

                        c1.5 0 3 .8 4.5 2.3

                        c1.5-1.5 3-2.3 4.5-2.3

                        C19 4.5 21 6.5 21 9

                        c0 3.5-3 6.5-9 11z"/>

                    </svg>

                  </span>

                  <span className="minimal-person-name minimal-person-name-groom">

                    <span className="minimal-person-first">

                      {groomCardName.firstName}

                    </span>

                    {groomCardName.lastName && (<span className="minimal-person-last">

                        {groomCardName.lastName}

                      </span>)}

                  </span>

                </>) : (<>

                  <span>{safeBrideName}</span>

                  <span className="minimal-invitation-amp">

                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">

                      <path d="M12 20

                        c-6-4.5-9-7.5-9-11

                        c0-2.5 2-4.5 4.5-4.5

                        c1.5 0 3 .8 4.5 2.3

                        c1.5-1.5 3-2.3 4.5-2.3

                        C19 4.5 21 6.5 21 9

                        c0 3.5-3 6.5-9 11z"/>

                    </svg>

                  </span>

                  <span>{safeGroomName}</span>

                </>)}

            </h1>)}

          {details.welcomeText && (<p className="minimal-invitation-text">

              {details.welcomeText}

            </p>)}

          {details.date && (<div className="minimal-invitation-date-block">

              <span className="minimal-invitation-date-label">

                {t.date}

              </span>

              <p className="minimal-invitation-date">

                {slug === "jovana-stefan"
                ? details.date
                    .replace(/^(\d{1,2})(\s)/, "$1.$2")
                    .replace(/(\d{4})$/, "$1.")
                : details.date}

              </p>

            </div>)}

          {timelineItems.length > 0 && (<div className="minimal-program-card minimal-program-editorial">

              <h3 className="minimal-section-title minimal-script-title">

                {t.plan}

              </h3>

              <div className="minimal-timeline">

                {timelineItems.map((event, index) => (<motion.div key={`${event.label}-${index}`} className="minimal-timeline-row" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{
                    once: true,
                    amount: 0.2,
                }} transition={{
                    duration: 0.45,
                    delay: index * 0.06,
                }}>

                    <div className="minimal-timeline-left">

                      <div className="minimal-timeline-icon">

                        <img src={iconMap[event.icon] ||
                    "/icons/guests.svg"} alt={event.label}/>

                      </div>

                      {index !== timelineItems.length - 1 && (<span className="minimal-timeline-line"/>)}

                    </div>

                    <div className="minimal-timeline-right">

                      <p className="minimal-timeline-time">

                        {event.time}

                        {!isAndrijanaMarko &&
                    event.location && (<>

                              <span className="minimal-timeline-separator">

                                {" "}

                                |{" "}

                              </span>

                              <a href={event.mapLink ||
                        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`} target="_blank" rel="noopener noreferrer" className="minimal-timeline-location-inline minimal-timeline-location-link">

                                {event.location}

                              </a>

                            </>)}

                      </p>

                      <h4 className="minimal-timeline-title">

                        {event.label}

                      </h4>

                      {isAndrijanaMarko &&
                    event.location && (<a href={event.mapLink ||
                        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`} target="_blank" rel="noopener noreferrer" className="minimal-timeline-location-below">

                            {event.location}

                          </a>)}

                    </div>

                  </motion.div>))}

              </div>

            </div>)}

          {shouldShowDressCode && (<div className="minimal-extra-card minimal-dresscode-editorial">

              <h3 className="minimal-section-title minimal-script-title">

                {details.dressCodeTitle || t.dressCode}

              </h3>

              {details.dressCodeNote && (<p className="minimal-section-note minimal-dresscode-note-editorial">

                  {details.dressCodeNote}

                </p>)}

              {details.dressCodeWomen && (<div className="minimal-dresscode-role">

                  <p className="minimal-dresscode-role-title">

                    {t.women}

                  </p>

                  <p className="minimal-dresscode-role-text">

                    {details.dressCodeWomen}

                  </p>

                </div>)}

              {details.dressCodePalette?.length > 0 && (<div className="minimal-palette-box">

                  <div className="minimal-palette minimal-palette-editorial">

                    {details.dressCodePalette.map((color, index) => (<span key={`${color}-${index}`} className="minimal-palette-dot minimal-palette-dot-editorial" style={{
                        backgroundColor: color,
                    }} aria-label={`dress code color ${index + 1}`}/>))}

                  </div>

                </div>)}

              {details.dressCodeMen && (<div className="minimal-dresscode-role minimal-dresscode-role-men">

                  <p className="minimal-dresscode-role-title">

                    {t.men}

                  </p>

                  <p className="minimal-dresscode-role-text">

                    {details.dressCodeMen}

                  </p>

                </div>)}

            </div>)}

          {slug === "andjela-andrija-5" && (
            <motion.section
              className="aa5-bridesmaids-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <p className="aa5-bridesmaids-eyebrow">
                {language === "de"
                  ? "FÜR UNSERE BRAUTJUNGFERN"
                  : "ZA NAŠE DEVERUŠE"}
              </p>

              <h3 className="aa5-bridesmaids-title">
                {language === "de"
                  ? "An der Seite der Braut – von den ersten Momenten an"
                  : "Uz mladu, od prvih trenutaka"}
              </h3>

              <div className="aa5-bridesmaids-divider" />

              <p className="aa5-bridesmaids-intro">
                {language === "de"
                  ? "Ihr Lieben, wir wünschen uns, dass ihr einen besonderen Teil dieses Tages an der Seite der Braut verbringt – von den Vorbereitungen, den ersten Lächeln und Fotos bis zur Zeremonie."
                  : "Drage naše, želimo da jedan poseban deo ovog dana provedete uz mladu — od priprema, prvih osmeha i fotografija, pa sve do ceremonije."}
              </p>

              <div className="aa5-bridesmaids-list">
                <div className="aa5-bridesmaids-item">
                  <span className="aa5-bridesmaids-number">01</span>

                  <div className="aa5-bridesmaids-item-copy">
                    <h4>
                      {language === "de"
                        ? "An der Seite der Braut"
                        : "Uz mladu"}
                    </h4>

                    <p>
                      {language === "de"
                        ? "An diesem Morgen ist euer Platz bei der Braut – für gemeinsame Vorbereitungen, Aufregung, Lachen und all die kleinen Momente, die wir für immer in Erinnerung behalten werden."
                        : "Vaše mesto tog jutra je uz mladu — da zajedno podelite pripreme, tremu, smeh i one male trenutke koje ćemo zauvek pamtiti."}
                    </p>
                  </div>
                </div>

                <div className="aa5-bridesmaids-item">
                  <span className="aa5-bridesmaids-number">02</span>

                  <div className="aa5-bridesmaids-item-copy">
                    <h4>
                      {language === "de"
                        ? "Ein gemeinsamer Look"
                        : "Jedan zajednički izgled"}
                    </h4>

                    <p>
                      {language === "de"
                        ? "Für die Vorbereitungen und die Zeremonie möchten wir, dass ihr alle dasselbe Kleid tragt, damit ein harmonisches und besonderes Gesamtbild entsteht."
                        : "Za pripreme i ceremoniju želimo da sve budete u istim haljinama, kako bismo zajedno stvorile skladnu i posebnu uspomenu."}
                    </p>
                  </div>
                </div>

                <div className="aa5-bridesmaids-item">
                  <span className="aa5-bridesmaids-number">03</span>

                  <div className="aa5-bridesmaids-item-copy">
                    <h4>
                      {language === "de"
                        ? "Im Restaurant"
                        : "U restoranu"}
                    </h4>

                    <p>
                      {language === "de"
                        ? "Sobald wir im Restaurant angekommen sind, könnt ihr euch gerne umziehen und den Abend in einem Outfit eurer Wahl weiterfeiern – wichtig ist, dass ihr euch wohlfühlt."
                        : "Po dolasku u restoran, slobodno se presvucite i nastavite slavlje u odeći po svom izboru — najvažnije nam je da se osećate lepo i opušteno."}
                    </p>
                  </div>
                </div>
              </div>

              <p className="aa5-bridesmaids-closing">
                {language === "de"
                  ? "Danke, dass ihr an unserer Seite seid und diesen Tag noch besonderer macht. ♡"
                  : "Hvala vam što ćete biti uz nas i što ćete ovaj dan učiniti još posebnijim. ♡"}
              </p>
            </motion.section>
          )}

          {details.mapLink && (<div className="minimal-location-section">

              <a href={details.mapLink} target="_blank" rel="noreferrer" className="minimal-map-link">

                {t.location}

              </a>

            </div>)}

          {details.note && (<p className="minimal-invitation-note">

              {details.note}

            </p>)}

        </div>

      </motion.section>

      <MinimalRSVP slug={slug} eventType={type} brideName={safeBrideName} groomName={safeGroomName} details={details} script={script} language={language}/>


      {slug === "andjela-andrija-5" &&
            details?.foreignGuests?.enabled && (<motion.section className="aa-travel-section" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true, amount: 0.15 }}>

            <div className="aa-travel-inner">

              {details.foreignGuests.eyebrow && (<p className="aa-travel-eyebrow">

                  {details.foreignGuests.eyebrow}

                </p>)}

              {details.foreignGuests.title && (<h2 className="aa-travel-title">

                  {details.foreignGuests.title}

                </h2>)}

              <div className="aa-travel-divider"/>

              {details.foreignGuests.intro && (<p className="aa-travel-intro">

                  {details.foreignGuests.intro}

                </p>)}

              {details.foreignGuests.arrival && (<div className="aa-travel-card aa-travel-card--arrival">

                  <div className="aa-travel-icon" aria-hidden="true">

                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">

                      <path d="M22 2 9.5 14.5"/>

                      <path d="m22 2-7 20-4-8-8-4 19-8Z"/>

                    </svg>

                  </div>

                  <div className="aa-travel-card-content">

                    {details.foreignGuests.arrival.eyebrow && (<p className="aa-travel-card-eyebrow">

                        {details.foreignGuests.arrival.eyebrow}

                      </p>)}

                    {details.foreignGuests.arrival.title && (<h3 className="aa-travel-card-title">

                        {details.foreignGuests.arrival.title}

                      </h3>)}

                    {details.foreignGuests.arrival.text && (<p className="aa-travel-card-text">

                        {details.foreignGuests.arrival.text}

                      </p>)}

                    {details.foreignGuests.arrival.mapLink && (<a href={details.foreignGuests.arrival.mapLink} target="_blank" rel="noopener noreferrer" className="aa-travel-link">

                        {details.foreignGuests.arrival.buttonText ||
                        t.location}

                      </a>)}

                  </div>

                </div>)}

              {details.foreignGuests.accommodation && (<div className="aa-travel-card aa-travel-card--stay">

                  <div className="aa-travel-icon" aria-hidden="true">

                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">

                      <path d="M3 21h18"/>

                      <path d="M5 21V9l7-5 7 5v12"/>

                      <path d="M9 21v-6h6v6"/>

                    </svg>

                  </div>

                  <div className="aa-travel-card-content">

                    {details.foreignGuests.accommodation.eyebrow && (<p className="aa-travel-card-eyebrow">

                        {details.foreignGuests.accommodation.eyebrow}

                      </p>)}

                    {details.foreignGuests.accommodation.title && (<h3 className="aa-travel-card-title">

                        {details.foreignGuests.accommodation.title}

                      </h3>)}

                    {details.foreignGuests.accommodation.text && (<p className="aa-travel-card-text">

                        {details.foreignGuests.accommodation.text}

                      </p>)}

                    {Array.isArray(details.foreignGuests.accommodation.hotels) &&
                    details.foreignGuests.accommodation.hotels.length >
                        0 && (<div className="aa-travel-hotels">

                          {details.foreignGuests.accommodation.hotels.map((hotel, index) => (<div className="aa-travel-hotel" key={`${hotel.name || "hotel"}-${index}`}>

                                <div className="aa-travel-hotel-copy">

                                  {hotel.name &&
                            (hotel.mapLink ? (<a href={hotel.mapLink} target="_blank" rel="noopener noreferrer" className="aa-travel-hotel-name aa-travel-hotel-name--link">

                                        {hotel.name}

                                      </a>) : (<p className="aa-travel-hotel-name">

                                        {hotel.name}

                                      </p>))}

                                  {hotel.note && (<p className="aa-travel-hotel-note">

                                      {hotel.note}

                                    </p>)}

                                </div>

                                {hotel.mapLink && (<a href={hotel.mapLink} target="_blank" rel="noopener noreferrer" className="aa-travel-hotel-arrow" aria-label={`${t.location}: ${hotel.name || ""}`}>

                                    ↗

                                  </a>)}

                              </div>))}

                        </div>)}

                    {details.foreignGuests.accommodation.footer && (<p className="aa-travel-footer">

                        {details.foreignGuests.accommodation.footer}

                      </p>)}

                  </div>

                </div>)}

            </div>

          </motion.section>)}

        {slug === "ana-nemanja" && (<motion.section className="ana-nemanja-contact-section" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true, amount: 0.2 }}>

    <div className="ana-nemanja-contact-inner">

      <p className="ana-nemanja-contact-kicker">

        Kontakt

      </p>

      <h2 className="ana-nemanja-contact-title">

        Tu smo za sva pitanja

      </h2>

      <div className="ana-nemanja-contact-divider"/>

      <p className="ana-nemanja-contact-text">

        Ukoliko vam je potrebna dodatna informacija,

        slobodno nam se javite.

      </p>

      <div className="ana-nemanja-contact-grid">

        <a href="tel:+381637252476" className="ana-nemanja-contact-person">

          <span className="ana-nemanja-contact-name">

            Ana

          </span>

          <span className="ana-nemanja-contact-phone">

            063 725 2476

          </span>

        </a>

        <a href="tel:+381692731994" className="ana-nemanja-contact-person">

          <span className="ana-nemanja-contact-name">

            Nemanja

          </span>

          <span className="ana-nemanja-contact-phone">

            069 273 1994

          </span>

        </a>

      </div>

      <span className="ana-nemanja-contact-heart">

        ♡

      </span>

    </div>

  </motion.section>)}

      {details.dateISO && (<MinimalCountdown targetDate={details.dateISO} brideName={safeBrideName} groomName={safeGroomName} details={details} script={script} slug={slug} language={language}/>)}
{slug === "andjela-andrija-5" && (
  <motion.section
    className="aa5-childhood-ending"
    initial={{
      opacity: 0,
      y: 24,
    }}
    whileInView={{
      opacity: 1,
      y: 0,
    }}
    transition={{
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    }}
    viewport={{
      once: true,
      amount: 0.25,
    }}
  >
    <div className="aa5-childhood-ending-inner">
      <span className="aa5-childhood-ending-small">
        A &amp; A
      </span>

      <div className="aa5-childhood-ending-image-wrap">
        <img
          src="/images/andjela-andrija-kids.png"
          alt=""
          className="aa5-childhood-ending-image"
          draggable={false}
        />
      </div>

      <p className="aa5-childhood-ending-text">
        {language === "de"
          ? "Von den ersten Umarmungen bis zu diesem besonderen Tag."
          : "Od prvih zagrljaja do ovog posebnog dana."}
      </p>
    </div>
  </motion.section>
)}


    </>);
}
export default MinimalInvitationCard;
