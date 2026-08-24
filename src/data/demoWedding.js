import { script } from "framer-motion/client";


const createDetails = ({
  backgroundImage,
  theme,
  imageShape,
  envelopeTopImage,
  envelopeBottomImage,
  envelopeBack,
envelopeFront,
  welcomeText,
    cardBackground,
  date,
  dateISO,
  gatheringTime,
  ceremonyTime,
  churchTime,
  venue,
  churchVenue,
  dinnerTime,
  showDressCode = false,
  dressCodeTitle = "",
  dressCodeWomenPalette = [],
dressCodeMenPalette = [],
  dressCodePalette = [],
  dressCodeNote = "",
  dressCodeWomen,
  dressCodeMen,
  mapLink,
  note,
    fixedBackgroundImage,
  foreverSvg,
  editorialImage1,
  editorialImage2,
  editorialImage3,
  showLocationButton = false,
  locationButtonText = "",
  locationButtonLink = "",
  events = [],
  rsvpOptions = {},
  rsvpSignature,
  locationName,
locationAddress,
 ticketNumber,
 introCardImage,
 cloudLeft,
cloudRight,
rsvpImage,
rsvpPhotoTitle,
rsvpPhotoText,
heroText,
rsvpText,
italianVariant,
 namesSvg,
  videoSrc,
  heroSvg,
  introSvg,
  monogramSvg,
  envelopeLeft,
  envelopeRight,
  swanLeft,
  swanRight,
scheduleBackground,
introBabyCircleSvg,
introOrnamentTopSvg,
introOrnamentBottomSvg,
heroScriptText,
heroSubText,
birthdayIntro,
birthdayGalleryCard,
birthdayGalleryRSVP,
birthdayGalleryCountdown,
age,
hideRsvpPhotoBlock = false,
sliderImages = [],
  showCalendarButton = false,
  calendarDurationHours,
 showLanguageSwitcher = false,
defaultLanguage = "sr",
languages = ["sr", "en"],
languageLabels = { sr: "SR", en: "EN" },
translations = {},
}) => ({
  backgroundImage,
  theme,
  imageShape,
  envelopeTopImage,
  envelopeBottomImage,
  envelopeBack,
envelopeFront,
  welcomeText,
    cardBackground,
  date,
  dateISO,
  gatheringTime,
  ceremonyTime,
  churchTime,
  venue,
  churchVenue,
  dinnerTime,
  showDressCode,
  dressCodeTitle,
  dressCodeWomenPalette,
dressCodeMenPalette,
  dressCodePalette,
  dressCodeNote,
  dressCodeWomen,
  dressCodeMen,
  mapLink,
  note,
    fixedBackgroundImage,
  foreverSvg,
  editorialImage1,
  editorialImage2,
  editorialImage3,
  showLocationButton,
  locationButtonText,
  locationButtonLink,
  events,
  rsvpOptions,
  rsvpSignature,
  locationName,
locationAddress,
 ticketNumber,
 introCardImage,
 cloudLeft,
cloudRight,
rsvpImage,
rsvpPhotoTitle,
rsvpPhotoText,
heroText,
rsvpText,
italianVariant,
 namesSvg,
  videoSrc,
  heroSvg,
  introSvg,
  monogramSvg,
  envelopeLeft,
  envelopeRight,
  swanLeft,
  swanRight,
scheduleBackground,
introBabyCircleSvg,
introOrnamentTopSvg,
introOrnamentBottomSvg,
heroScriptText,
heroSubText,
birthdayIntro,
birthdayGalleryCard,
birthdayGalleryRSVP,
birthdayGalleryCountdown,
age,
hideRsvpPhotoBlock,
  sliderImages,
  showCalendarButton,
  calendarDurationHours,
showLanguageSwitcher,
defaultLanguage,
languages,
languageLabels,
translations,
});
const demoWedding = [
  {
    slug: "ana-marko",
    type: "wedding",
    template: "envelope",
    brideName: "Ana",
    groomName: "Marko",
    weddingDate: "24 AVG 2026",
    weddingTime: "16:00",
    venue: "Hotel Moskva, Beograd",
    details: createDetails({
  welcomeText:
    "Sa velikom radošću vas pozivamo da svojim prisustvom ulepšate naš poseban dan.",
  date: "24 AVG 2026",
  dateISO: "2026-08-24T16:00:00",

  events: [
    {
      label: "Okupljanje gostiju",
      time: "15:30",
      location: "Hotel Moskva, Beograd",
      mapLink: "https://maps.google.com/?q=Hotel+Moskva+Beograd",
    },
    {
      label: "Crkveno venčanje",
      time: "14:30",
      location: "Crkva Svetog Marka, Beograd",
      mapLink: "https://maps.google.com/?q=Crkva+Svetog+Marka+Beograd",
    },
    {
      label: "Početak venčanja",
      time: "16:00",
      location: "Hotel Moskva, Beograd",
      mapLink: "https://maps.google.com/?q=Hotel+Moskva+Beograd",
    },
    {
      label: "Proslava",
      time: "18:00",
      location: "Hotel Moskva, Beograd",
      mapLink: "https://maps.google.com/?q=Hotel+Moskva+Beograd",
    },
  ],

  dressCodeTitle: "Dress code",
  dressCodePalette: ["#d8c8b4", "#c2a98f", "#8d7057", "#f3e7da"],
  dressCodeNote:
    "Elegantne, tople i klasične nijanse savršeno će se uklopiti.",
  mapLink: "https://maps.google.com/?q=Hotel+Moskva+Beograd",
  note: "Molimo vas da svoj dolazak potvrdite do 1. avgusta.",
}),
  },
// =========================
// 🌸 FLORAL MODAL TEMPLATE
// =========================
  {
  slug: "jovana-luka",
  type: "wedding",
  template: "floral",
  brideName: "Jovana",
  groomName: "Luka",
  backgroundImage: "/images/floral-jovana-luka.png",
  weddingDate: "12 SEP 2026",
  weddingTime: "17:00",
  venue: "Topčider, Beograd",
  details: createDetails({
    welcomeText:
      "Radujemo se što ćemo najlepše trenutke našeg dana podeliti sa vama.",

    dateISO: "2026-09-12T17:00:00+02:00",

  events: [
  {
    label: "Okupljanje gostiju",
    time: "16:30",
    icon: "gathering",
    location: "Topčider, Beograd",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Topcider+Beograd",
  },
  {
    label: "Crkveno venčanje",
    time: "15:30",
    icon: "church",
    location: "Crkva Svetog Marka",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Crkva+Svetog+Marka+Beograd",
  },
  {
    label: "Građansko venčanje",
    time: "17:00",
    icon: "civil",
    location: "Topčider",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Topcider+Beograd",
  },
  {
    label: "Svečani ručak",
    time: "18:30",
    icon: "restaurant",
    location: "Restoran Topčiderac",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Restoran+Topciderac+Beograd",
  },
],

    dressCodeTitle: "Dress code",
    dressCodePalette: ["#b8b1a4", "#d8d0c2", "#7f8173", "#cab7a4", "#e7d9cf"],
    dressCodeNote:
      "Molimo vas da birate nežne, zemljane i puderaste tonove.",

    mapLink: "https://maps.google.com/?q=Topcider+Beograd",
    note: "Molimo vas da svoj dolazak potvrdite do 1. septembra.",
  }),
},

{
  slug: "jasna-luka",
  type: "wedding",
  template: "floral",
  brideName: "Jasna",
  groomName: "Luka",
  backgroundImage: "/images/floral-jasna-luka.png",
  weddingDate: "12 SEP 2026",
  weddingTime: "17:00",
  venue: "Topčider, Beograd",
  details: createDetails({
    welcomeText:
      "Radujemo se što ćemo najlepše trenutke našeg dana podeliti sa vama.",

    dateISO: "2026-09-12T17:00:00+02:00",

events: [
  {
    label: "Okupljanje gostiju",
    time: "16:30",
    icon: "gathering",
    location: "Topčider, Beograd",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Topcider+Beograd",
  },
  {
    label: "Crkveno venčanje",
    time: "15:30",
    icon: "church",
    location: "Crkva Svetog Marka",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Crkva+Svetog+Marka+Beograd",
  },
  {
    label: "Građansko venčanje",
    time: "17:00",
    icon: "civil",
    location: "Topčider, Beograd",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Topcider+Beograd",
  },
  {
    label: "Svečani ručak",
    time: "18:30",
    icon: "restaurant",
    location: "Restoran Topčiderac",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Restoran+Topciderac+Beograd",
  },
],

    dressCodeTitle: "Dress code",
    dressCodePalette: ["#b8b1a4", "#d8d0c2", "#7f8173", "#cab7a4", "#e7d9cf"],
    dressCodeNote:
      "Molimo vas da birate nežne, zemljane i puderaste tonove.",

    mapLink: "https://maps.google.com/?q=Topcider+Beograd",
    note: "Molimo vas da svoj dolazak potvrdite do 1. septembra.",
  }),
},

{
  slug: "jasna-ivan",
  type: "wedding",
  template: "floral",
  brideName: "Jasna",
  groomName: "Ivan",
  backgroundImage: "/images/floral-jasna-ivan1.png",
  weddingDate: "01 SEP 2026",
  weddingTime: "17:00",
  venue: "Topčider, Beograd",
  details: createDetails({
    welcomeText:
      "Radujemo se što ćemo najlepše trenutke našeg dana podeliti sa vama.",

    dateISO: "2026-09-01T17:00:00+02:00",

   events: [
  {
    label: "Okupljanje gostiju",
    time: "16:30",
    icon: "gathering",
    location: "Topčider, Beograd",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Topcider+Beograd",
  },
  {
    label: "Crkveno venčanje",
    time: "15:30",
    icon: "church",
    location: "Crkva Svetog Marka",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Crkva+Svetog+Marka+Beograd",
  },
  {
    label: "Građansko venčanje",
    time: "17:00",
    icon: "civil",
    location: "Topčider, Beograd",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Topcider+Beograd",
  },
  {
    label: "Svečani ručak",
    time: "18:30",
    icon: "restaurant",
    location: "Restoran Topčiderac",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Restoran+Topciderac+Beograd",
  },
],

    dressCodeTitle: "Dress code",
    dressCodePalette: ["#b8b1a4", "#d8d0c2", "#7f8173", "#cab7a4", "#e7d9cf"],
    dressCodeNote:
      "Molimo vas da birate nežne, zemljane i puderaste tonove.",

    mapLink: "https://maps.google.com/?q=Topcider+Beograd",
    note: "Molimo vas da svoj dolazak potvrdite do 1. septembra.",
  }),
},
// =========================
// ANGEL TEMPLATES
// =========================
{
  slug: "ivana-pedja",
  type: "wedding",
  template: "angel",
  brideName: "Ivana",
  groomName: "Pedja",

  backgroundImage: "/images/angel-bg.jpg",
  image: "/images/ivana-pedja/couple.jpg",

  weddingDate: "25 JUN 2026",
  weddingTime: "13:00",

  details: createDetails({
   
    date: "25 JUN 2026",
    dateISO: "2026-06-25T13:00:00",

    events: [
      {
        label: "Okupljanje gostiju",
        time: "12:30",
        note: "Dolazak i okupljanje gostiju",
        iconType: "gathering",
      },
      {
        label: "Crkveno venčanje",
        time: "13:00",
        note: "Početak ceremonije",
        iconType: "church",
      },
      {
        label: "Proslava",
        time: "15:00",
        note: "Ručak, muzika i slavlje",
        iconType: "dinner",
      },
    ],

    dressCodeNote: "Molimo vas da svojim outfitom ispratite nežne i elegantne tonove.",

    dressCodeWomen: [
      "#E7D7D1",
      "#D8B7AE",
      "#C79A92",
      "#F3EAE5",
    ],

    dressCodeMen: [
      "#2F3136",
      "#5C4A4A",
      "#8B7A74",
      "#CBBDB6",
    ],

    note: "Radujemo se da ovaj poseban dan podelimo sa vama.",
  }),
},
// =========================
// MINIMAL TEMPLATES
// =========================

{
  slug: "milica-ognjen",
  type: "wedding",
  template: "minimal",
  brideName: "Milica",
  groomName: "Ognjen",

  weddingDate: "05 OKT 2026",
  weddingTime: "15:30",
  venue: "Beli dvor, Beograd",

  backgroundImage: "/images/milica-ognjen-minimal1.jpg",

  introText:
    "Pozivamo vas da zajedno sa nama proslavite ljubav, radost i početak novog poglavlja.",

  details: createDetails({
    welcomeText:
      "Biće nam izuzetno drago da svojim prisustvom ulepšate naš poseban dan.",

    date: "05 OKT 2026",
    dateISO: "2026-10-05T15:30:00+02:00",

    events: [
      {
        label: "Crkveno venčanje",
        time: "14:30",
        icon: "church",
        location: "Crkva Svetog Save, Beograd",
      },
      {
        label: "Ceremonija",
        time: "15:30",
        icon: "civil",
        location: "Beli dvor, Beograd",
      },
      {
        label: "Banket",
        time: "18:00",
        icon: "restaurant",
        location: "Beli dvor, Beograd",
      },
      {
        label: "Završetak večeri",
        time: "23:00",
        icon: "party",
        location: "Beli dvor, Beograd",
      },
    ],

    dressCodeWomen: "večernje ili koktel haljine",
    dressCodeMen: "klasično odelo i košulja",
    dressCodeNote:
      "Nam bude prijatno, ako svojim outfitom podržite stilsku notu našeg venčanja.",
    dressCodePalette: ["#f0c9d2", "#dfb6ca", "#eed8df", "#f2e5ea"],

    mapLink: "https://maps.google.com/?q=Beli+dvor+Beograd",
    note: "Biće nam čast da budete deo našeg dana.",
  }),
},

{
  slug: "kaca-nebojsa",
  type: "wedding",
  template: "minimal",
  brideName: "Kaca",
  groomName: "Nebojsa",

  weddingDate: "05 OKT 2026",
  weddingTime: "15:30",
  venue: "Beli dvor, Beograd",

  backgroundImage: "/images/kaca-nebojsa-minimal.jpg",

  introText:
    "Pozivamo vas da zajedno sa nama proslavite ljubav, radost i početak novog poglavlja.",

  details: createDetails({
    welcomeText:
      "Biće nam izuzetno drago da svojim prisustvom ulepšate naš poseban dan.",

    date: "05 OKT 2026",
    dateISO: "2026-10-05T15:30:00+02:00",

    events: [
      {
        label: "Crkveno venčanje",
        time: "14:30",
        icon: "church",
        location: "Crkva Svetog Save, Beograd",
      },
      {
        label: "Ceremonija",
        time: "15:30",
        icon: "civil",
        location: "Beli dvor, Beograd",
      },
      {
        label: "Banket",
        time: "18:00",
        icon: "restaurant",
        location: "Beli dvor, Beograd",
      },
      {
        label: "Završetak večeri",
        time: "23:00",
        icon: "party",
        location: "Beli dvor, Beograd",
      },
    ],

    dressCodeWomen: "večernje ili koktel haljine",
    dressCodeMen: "klasično odelo i košulja",
    dressCodeNote:
      "Nam bude prijatno, ako svojim outfitom podržite stilsku notu našeg venčanja.",
    dressCodePalette: ["#f0c9d2", "#dfb6ca", "#eed8df", "#f2e5ea"],

    mapLink: "https://maps.google.com/?q=Beli+dvor+Beograd",
    note: "Biće nam čast da budete deo našeg dana.",
  }),
},

{
  slug: "sanja-milos",
  type: "wedding",
  template: "minimal",
  brideName: "Sanja",
  groomName: "Milos",

  weddingDate: "05 OKT 2026",
  weddingTime: "15:30",
  venue: "Beli dvor, Beograd",
uploadCoverImage: "/images/upload/sanja-milos-upload.jpg",
  backgroundImage: "/images/sanja-milos-minimal.jpg",

  introText:
    "Pozivamo vas da zajedno sa nama proslavite ljubav, radost i početak novog poglavlja.",

  details: createDetails({
    welcomeText:
      "Biće nam izuzetno drago da svojim prisustvom ulepšate naš poseban dan.",

    date: "05 OKT 2026",
    dateISO: "2026-10-05T15:30:00+02:00",

    events: [
      {
        label: "Crkveno venčanje",
        time: "14:30",
        icon: "church",
        location: "Crkva Svetog Save, Beograd",
      },
      {
        label: "Ceremonija",
        time: "15:30",
        icon: "civil",
        location: "Beli dvor, Beograd",
      },
      {
        label: "Banket",
        time: "18:00",
        icon: "restaurant",
        location: "Beli dvor, Beograd",
      },
      {
        label: "Završetak večeri",
        time: "23:00",
        icon: "party",
        location: "Beli dvor, Beograd",
      },
    ],

    dressCodeWomen: "večernje ili koktel haljine",
    dressCodeMen: "klasično odelo i košulja",
    dressCodeNote:
      "Nam bude prijatno, ako svojim outfitom podržite stilsku notu našeg venčanja.",
    dressCodePalette: ["#f0c9d2", "#dfb6ca", "#eed8df", "#f2e5ea"],

    mapLink: "https://maps.google.com/?q=Beli+dvor+Beograd",
    note: "Biće nam čast da budete deo našeg dana.",
  }),
},
// =========================
// PHOTO CARD TEMPLATES
// =========================

{
  slug: "anja-marko",
  type: "wedding",
  template: "photo-card",
  brideName: "Anja",
  groomName: "Marko",
  image: "/images/anja-marko-photocard.jpg",
  backgroundImage: "/images/anja-marko-photocard-bg.jpg",
  
  weddingDate: "12 MAY 2026",
  weddingTime: "17:00",
  venue: "ul. Novosadska, Novi Sad",
  uploadCoverImage: "/images/upload/anja-marko-upload.jpg",
  details: createDetails({
    welcomeText:
      "Sa velikom radošću vas pozivamo da budete deo našeg posebnog dana.",

    date: "12 MAY 2026",
    dateISO: "2026-05-12T17:00:00+02:00",

    events: [
      {
        label: "Skup gostiju",
        time: "15:00",
        icon: "gathering",
        location: "Dvorište vile",
        mapLink: "https://maps.google.com/?q=Dvoriste+vile",
      },
      {
        label: "Venčanje",
        time: "17:30",
        icon: "civil",
        location: "Beli dvor",
        mapLink: "https://maps.google.com/?q=Beli+dvor",
      },
      {
        label: "Svadbena ceremonija",
        time: "18:00",
        icon: "church",
        location: "Crkva Svetog Save",
        mapLink: "https://maps.google.com/?q=Crkva+Svetog+Save",
      },
      {
        label: "Početak banketa",
        time: "19:00",
        icon: "restaurant",
        location: "Sala za proslave",
        mapLink: "https://maps.google.com/?q=Sala+za+proslave",
      },
      {
        label: "Završetak proslave",
        time: "23:00",
        icon: "party",
        location: "Beli dvor",
        mapLink: "https://maps.google.com/?q=Beli+dvor",
      },
    ],

    

    dressCodeTitle: "Dress code",
    dressCodePalette: ["#111111", "#6d4b12", "#9b1637", "#6a7a1f", "#7d8530", "#efeee9"],
    dressCodeNote:
      "Biće nam drago ako svojim odevnim kombinacijama ispratite stilsku notu našeg venčanja.",

    mapLink: "https://maps.google.com/?q=ulica+Novosadska+Novi+Sad",
    note: "Molimo vas da svoj dolazak potvrdite na vreme.",
  }),
},

{
  slug: "natasa-marko",
  type: "wedding",
  template: "photo-card",
  brideName: "Nataša",
  groomName: "Marko",
  image: "/images/natasa-marko-photocard.jpg",
  backgroundImage: "/images/natasa-marko-photocard-bg.jpg",
  weddingDate: "12 MAY 2026",
  weddingTime: "17:00",
  venue: "ul. Novosadska, Novi Sad",
  details: createDetails({
    welcomeText:
      "Sa velikom radošću vas pozivamo da budete deo našeg posebnog dana.",

    date: "12 MAY 2026",
    dateISO: "2026-05-12T17:00:00+02:00",

    events: [
      {
        label: "Skup gostiju",
        time: "15:00",
        icon: "gathering",
        location: "Dvorište vile",
        mapLink: "https://maps.google.com/?q=Dvoriste+vile",
      },
      {
        label: "Venčanje",
        time: "17:30",
        icon: "civil",
        location: "Beli dvor",
        mapLink: "https://maps.google.com/?q=Beli+dvor",
      },
      {
        label: "Svadbena ceremonija",
        time: "18:00",
        icon: "church",
        location: "Crkva Svetog Save",
        mapLink: "https://maps.google.com/?q=Crkva+Svetog+Save",
      },
      {
        label: "Početak banketa",
        time: "19:00",
        icon: "restaurant",
        location: "Sala za proslave",
        mapLink: "https://maps.google.com/?q=Sala+za+proslave",
      },
      {
        label: "Završetak proslave",
        time: "23:00",
        icon: "party",
        location: "Beli dvor",
        mapLink: "https://maps.google.com/?q=Beli+dvor",
      },
    ],

   

    dressCodeTitle: "Dress code",
    dressCodePalette: [
      "#111111",
      "#6d4b12",
      "#9b1637",
      "#6a7a1f",
      "#7d8530",
      "#efeee9",
    ],
    dressCodeNote:
      "Biće nam drago ako svojim odevnim kombinacijama ispratite stilsku notu našeg venčanja.",

    mapLink: "https://maps.google.com/?q=ulica+Novosadska+Novi+Sad",
    note: "Molimo vas da svoj dolazak potvrdite na vreme.",
  }),
},
{
  slug: "ivona-marko",
  type: "wedding",
  template: "photo-card",
  brideName: "Ivona",
  groomName: "Marko",
  image: "/images/ivona-marko-photocard.jpg",
  backgroundImage: "/images/ivona-marko-photocard-bg.jpg",
  weddingDate: "12 MAY 2026",
  weddingTime: "17:00",
  venue: "ul. Novosadska, Novi Sad",
  details: createDetails({
    welcomeText:
      "Sa velikom radošću vas pozivamo da budete deo našeg posebnog dana.",
 imageShape: "vertical", 
    date: "12 MAY 2026",
    dateISO: "2026-05-12T17:00:00+02:00",

    events: [
      {
        label: "Skup gostiju",
        time: "15:00",
        icon: "gathering",
        location: "Dvorište vile",
        mapLink: "https://maps.google.com/?q=Dvoriste+vile",
      },
      {
        label: "Venčanje",
        time: "17:30",
        icon: "civil",
        location: "Beli dvor",
        mapLink: "https://maps.google.com/?q=Beli+dvor",
      },
      {
        label: "Svadbena ceremonija",
        time: "18:00",
        icon: "church",
        location: "Crkva Svetog Save",
        mapLink: "https://maps.google.com/?q=Crkva+Svetog+Save",
      },
      {
        label: "Početak banketa",
        time: "19:00",
        icon: "restaurant",
        location: "Sala za proslave",
        mapLink: "https://maps.google.com/?q=Sala+za+proslave",
      },
      {
        label: "Završetak proslave",
        time: "23:00",
        icon: "party",
        location: "Beli dvor",
        mapLink: "https://maps.google.com/?q=Beli+dvor",
      },
    ],

   

    dressCodeTitle: "Dress code",
    dressCodePalette: [
      "#111111",
      "#6d4b12",
      "#9b1637",
      "#6a7a1f",
      "#7d8530",
      "#efeee9",
    ],
    dressCodeNote:
      "Biće nam drago ako svojim odevnim kombinacijama ispratite stilsku notu našeg venčanja.",

    mapLink: "https://maps.google.com/?q=ulica+Novosadska+Novi+Sad",
    note: "Molimo vas da svoj dolazak potvrdite na vreme.",
  }),
},
// =========================
// PHOTO SCRIPT TEMPLATES
// =========================
{
  slug: "ivana-filip",
  type: "wedding",
  template: "photo-script",
  brideName: "Ivana",
  groomName: "Filip",
  videoSrc: "/videos/wedding-if4.mp4",
  weddingDate: "18 SEP 2026",
  weddingTime: "17:00",
  venue: "Beograd",
  details: createDetails({
    welcomeText: "Radujemo se da ovaj dan podelimo sa vama.",
    date: "18 SEP 2026",
    dateISO: "2026-09-18T17:00:00+02:00",

    events: [
      {
        label: "Okupljanje gostiju",
        time: "15:00",
        icon: "gathering",
        location: "Hotel Hyatt, Beograd",
        mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
      },
      {
        label: "Crkveno venčanje",
        time: "16:30",
        icon: "church",
        location: "Crkva Svetog Marka, Beograd",
        mapLink: "https://maps.google.com/?q=Crkva+Svetog+Marka+Beograd",
      },
      {
        label: "Građansko venčanje",
        time: "17:00",
        icon: "civil",
        location: "Hotel Hyatt, Beograd",
        mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
      },
      {
        label: "Početak banketa",
        time: "17:30",
        icon: "restaurant",
        location: "Svečana sala, Hyatt",
        mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
      },
      {
        label: "After party",
        time: "22:00",
        icon: "party",
        location: "Lounge bar, Hyatt",
        mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
      },
    ],

    editorialImage1: "/images/couple-blackwhite.jpg",

    dressCodeTitle: "Dress code",
    dressCodePalette: ["#2a2a2a", "#6e6461", "#b9a39b", "#d6c4bb"],
    dressCodeNote: "Elegantni, zagasiti i neutralni tonovi.",
    note: "Molimo vas da svoj dolazak potvrdite na vreme.",
  }),
},

{
  slug: "lena-aleksa",
  type: "wedding",
  template: "photo-script",
  brideName: "Lena",
  groomName: "Aleksa",
  videoSrc: "/videos/wedding-Lena-Aleksa.mp4",
  weddingDate: "18 SEP 2026",
  weddingTime: "17:00",
  venue: "Beograd",
  details: createDetails({
    welcomeText: "Radujemo se da ovaj dan podelimo sa vama.",
    date: "18 SEP 2026",
    dateISO: "2026-09-18T17:00:00+02:00",

    events: [
      {
        label: "Okupljanje gostiju",
        time: "15:00",
        icon: "gathering",
        location: "Hotel Hyatt, Beograd",
        mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
      },
      {
        label: "Crkveno venčanje",
        time: "16:30",
        icon: "church",
        location: "Crkva Svetog Marka, Beograd",
        mapLink: "https://maps.google.com/?q=Crkva+Svetog+Marka+Beograd",
      },
      {
        label: "Građansko venčanje",
        time: "17:00",
        icon: "civil",
        location: "Hotel Hyatt, Beograd",
        mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
      },
      {
        label: "Početak banketa",
        time: "17:30",
        icon: "restaurant",
        location: "Svečana sala, Hyatt",
        mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
      },
      {
        label: "After party",
        time: "22:00",
        icon: "party",
        location: "Lounge bar, Hyatt",
        mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
      },
    ],

    editorialImage1: "/images/couple-blackwhite1.jpg",

    dressCodeTitle: "Dress code",
    dressCodePalette: ["#2a2a2a", "#6e6461", "#b9a39b", "#d6c4bb"],
    dressCodeNote: "Elegantni, zagasiti i neutralni tonovi.",
    note: "Molimo vas da svoj dolazak potvrdite na vreme.",
  }),
},
{
  slug: "ena-aleksa",
  type: "wedding",
  template: "photo-script",
  script: "latin",

  brideName: "Ena",
  groomName: "Aleksa",

  videoSrc: "/videos/wedding-Ena-Aleksa-4.mp4",

  weddingDate: "18 SEP 2026",
  weddingTime: "17:00",
  venue: "Beograd",

  details: createDetails({
    theme: {
namesGradient: `linear-gradient(
  115deg,
  #5f3a0f 0%,
  #9a6a22 16%,
  #d6ad52 34%,
  #fff3bd 48%,
  #f7dc8d 56%,
  #c89532 70%,
  #8a5b18 86%,
  #4f300b 100%
)`,

    

      introAccent: "#d6b46a",
      introMainText: "#f3df9f",
      introButtonText: "#d6ad52",
      introButtonBorder: "rgba(255, 232, 160, 0.55)",

      cardAccent: "#d6b46a",
      cardTitle: "#d6b46a",
      cardKicker: "#d6b46a",
      cardDivider: "rgba(214, 180, 106, 0.75)",

      cardEventTitle: "#f3df9f",
      cardDotRing: "rgba(214, 180, 106, 0.18)",
      cardLineTop: "rgba(214, 180, 106, 0.55)",
      cardLineBottom: "rgba(214, 180, 106, 0.12)",

      locationButtonBg: `linear-gradient(
        135deg,
        rgba(120, 82, 28, 0.42) 0%,
        rgba(214, 180, 106, 0.24) 45%,
        rgba(255, 232, 160, 0.18) 100%
      )`,
      locationButtonBorder: "rgba(214, 180, 106, 0.42)",
      locationButtonTextColor: "#f7e7b2",

      rsvpButtonBg: `linear-gradient(
        135deg,
        #7a541c 0%,
        #d6b46a 48%,
        #fff1b8 100%
      )`,
      rsvpButtonBorder: "rgba(255, 232, 160, 0.55)",
      rsvpButtonText: "#1f1609",

      rsvpDividerAccent: "rgba(214, 180, 106, 0.55)",
      rsvpInputBorderFocus: "rgba(214, 180, 106, 0.55)",
      rsvpChoiceHoverBorder: "rgba(214, 180, 106, 0.35)",
      rsvpChoiceActiveBorder: "rgba(214, 180, 106, 0.55)",

      countdownDividerTop: "rgba(214, 180, 106, 0.55)",
      countdownNumber: "#f3df9f",
    },

    welcomeText: "Radujemo se da ovaj dan podelimo sa vama.",
    date: "18 SEP 2026",
    dateISO: "2026-09-18T17:00:00+02:00",

    events: [
      {
        label: "Okupljanje gostiju",
        time: "15:00",
        icon: "gathering",
        location: "Hotel Hyatt, Beograd",
        mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
      },
      {
        label: "Crkveno venčanje",
        time: "16:30",
        icon: "church",
        location: "Crkva Svetog Marka, Beograd",
        mapLink: "https://maps.google.com/?q=Crkva+Svetog+Marka+Beograd",
      },
      {
        label: "Građansko venčanje",
        time: "17:00",
        icon: "civil",
        location: "Hotel Hyatt, Beograd",
        mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
      },
      {
        label: "Početak banketa",
        time: "17:30",
        icon: "restaurant",
        location: "Svečana sala, Hyatt",
        mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
      },
      {
        label: "After party",
        time: "22:00",
        icon: "party",
        location: "Lounge bar, Hyatt",
        mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
      },
    ],

    editorialImage1: "/images/couple-blackwhite1.jpg",

    dressCodeTitle: "Dress code",
    dressCodePalette: ["#2a2a2a", "#6e6461", "#b9a39b", "#d6c4bb"],
    dressCodeNote: "Elegantni, zagasiti i neutralni tonovi.",
    note: "Molimo vas da svoj dolazak potvrdite na vreme.",
  }),
},
// =========================
// SPLIT VIDEO TEMPLATE
// =========================
  {
  slug: "nevena-ognjen",
  type: "wedding",
  template: "split-video",
  brideName: "Nevena",
  groomName: "Ognjen",
  videoSrc: "/videos/wedding345.mp4",
  weddingDate: "18 SEP 2026",
  weddingTime: "17:00",
  venue: "Beograd",
  introText: "Radujemo se da ovaj dan podelimo sa vama.",
  details: createDetails({
   
  backgroundImage: "/images/nevena-ognjen-split.jpg",
 
    welcomeText:
      "Biće nam veliko zadovoljstvo da svojim prisustvom ulepšate naš poseban dan.",
    date: "18 SEP 2026",
    dateISO: "2026-09-18T17:00:00+02:00",

    events: [
      {
        label: "Okupljanje gostiju",
        time: "15:30",
        location: "Bašta hotela, Beograd",
        mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
        note: "Početak okupljanja i dragi susreti pre ceremonije.",
      },
      {
        label: "Ceremonija",
        time: "17:00",
        location: "Svečana sala",
        mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
        note: "Trenutak kada počinje naše novo poglavlje.",
      },
      {
        label: "Večera",
        time: "18:30",
        location: "Restoranski salon",
        mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
        note: "Veče uz muziku, nazdravljanje i slavlje.",
      },
      {
        label: "Torta",
        time: "21:30",
        location: "Glavna sala",
        mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
        note: "Slatki trenutak koji ćemo podeliti sa svima vama.",
      },
    ],

   showDressCode: true,
  venue: "Beograd",
  dressCodeTitle: "Dress code",
  dressCodePalette: ["#c9c3bb", "#a89e94", "#e8ddd4", "#f3ece6", "#8f8a64"],
  dressCodeNote:
    "Nježni, elegantni i prirodni tonovi lepo će se uklopiti u atmosferu našeg dana.",
  mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
  note: "Molimo vas da svoj dolazak potvrdite na vreme.",
  }),
},

{
  slug: "nina-janko",
  type: "wedding",
  template: "split-video",
  brideName: "Nina",
  groomName: "Janko",
  videoSrc: "/videos/nina-janko1.mp4",
  weddingDate: "18 SEP 2026",
  weddingTime: "17:00",
  venue: "Beograd",
  introText: "Radujemo se da ovaj dan podelimo sa vama.",
  details: createDetails({
      backgroundImage: "/images/nina-janko-split.jpg",
    welcomeText:
      "Biće nam veliko zadovoljstvo da svojim prisustvom ulepšate naš poseban dan.",
    date: "18 SEP 2026",
    dateISO: "2026-09-18T17:00:00+02:00",

    events: [
      {
        label: "Okupljanje gostiju",
        time: "15:30",
        location: "Bašta hotela, Beograd",
        mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
        note: "Početak okupljanja i dragi susreti pre ceremonije.",
      },
      {
        label: "Ceremonija",
        time: "17:00",
        location: "Svečana sala",
        mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
        note: "Trenutak kada počinje naše novo poglavlje.",
      },
      {
        label: "Večera",
        time: "18:30",
        location: "Restoranski salon",
        mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
        note: "Veče uz muziku, nazdravljanje i slavlje.",
      },
      {
        label: "Torta",
        time: "21:30",
        location: "Glavna sala",
        mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
        note: "Slatki trenutak koji ćemo podeliti sa svima vama.",
      },
    ],

  showDressCode: true,
  venue: "Beograd",
  dressCodeTitle: "Dress code",
  dressCodePalette: [],
  dressCodeNote:
    "Nježni, elegantni i prirodni tonovi lepo će se uklopiti u atmosferu našeg dana.",
  mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
  note: "Molimo vas da svoj dolazak potvrdite na vreme.",
  }),
},
{
  slug: "vanja-aleksa",
  type: "wedding",
  template: "split-video",
  brideName: "Vanja",
  groomName: "Aleksa",
  videoSrc: "/videos/vanja-aleksa345.mp4",
  weddingDate: "18 SEP 2026",
  weddingTime: "17:00",
  venue: "Beograd",
  introText: "Radujemo se da ovaj dan podelimo sa vama.",
  details: createDetails({
     backgroundImage: "/images/vanja-aleksa-split-2.jpg",
    welcomeText:
      "Biće nam veliko zadovoljstvo da svojim prisustvom ulepšate naš poseban dan.",
    date: "18 SEP 2026",
    dateISO: "2026-09-18T17:00:00+02:00",

    events: [
      {
        label: "Okupljanje gostiju",
        time: "15:30",
        location: "Bašta hotela, Beograd",
        mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
        note: "Početak okupljanja i dragi susreti pre ceremonije.",
      },
      {
        label: "Ceremonija",
        time: "17:00",
        location: "Svečana sala",
        mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
        note: "Trenutak kada počinje naše novo poglavlje.",
      },
      {
        label: "Večera",
        time: "18:30",
        location: "Restoranski salon",
        mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
        note: "Veče uz muziku, nazdravljanje i slavlje.",
      },
      {
        label: "Torta",
        time: "21:30",
        location: "Glavna sala",
        mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
        note: "Slatki trenutak koji ćemo podeliti sa svima vama.",
      },
    ],

showDressCode: false,
  venue: "Beograd",
  dressCodeTitle: "Dress code",
  dressCodePalette: ["#c9c3bb", "#a89e94", "#e8ddd4", "#f3ece6", "#8f8a64"],
  dressCodeNote:
    "Nježni, elegantni i prirodni tonovi lepo će se uklopiti u atmosferu našeg dana.",
  mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
  note: "Molimo vas da svoj dolazak potvrdite na vreme.",
  }),
},
  {
  slug: "ANA-OGNJEN",
  type: "wedding",
  template: "split-video",
  brideName: "Ana",
  groomName: "Ognjen",
  videoSrc: "/videos/ana-ognjen-2.mp4",
  weddingDate: "18 SEP 2026",
  weddingTime: "17:00",
  venue: "Beograd",
  introText: "Radujemo se da ovaj dan podelimo sa vama.",
  details: createDetails({
    backgroundImage: "/images/ANA-OGNJEN-split-2.jpg",
    welcomeText:
      "Biće nam veliko zadovoljstvo da svojim prisustvom ulepšate naš poseban dan.",
    date: "18 SEP 2026",
    dateISO: "2026-09-18T17:00:00+02:00",
  showCalendarButton: true,
    events: [
      {
        label: "Okupljanje gostiju",
        time: "15:30",
        location: "Bašta hotela, Beograd",
        mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
        note: "Početak okupljanja i dragi susreti pre ceremonije.",
      },
      {
        label: "Ceremonija",
        time: "17:00",
        location: "Svečana sala",
        mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
        note: "Trenutak kada počinje naše novo poglavlje.",
      },
      {
        label: "Večera",
        time: "18:30",
        location: "Restoranski salon",
        mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
        note: "Veče uz muziku, nazdravljanje i slavlje.",
      },
      {
        label: "Torta",
        time: "21:30",
        location: "Glavna sala",
        mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
        note: "Slatki trenutak koji ćemo podeliti sa svima vama.",
      },
    ],
theme: {
  mainText: "#FFFDF7",
  softText: "#F7F2E8",
  scriptText: "#FFFDF7",
  mutedText: "#EEE7D8",

  accent: "#F4E8C8",
  accentStrong: "#E2D0A2",
  buttonText: "#2F352A",

  cardBg: "rgba(32, 38, 29, 0.42)",
  cardBorder: "rgba(255,255,255,0.16)",
  frameBorder: "rgba(244,232,200,0.32)",

  paperOverlayTop: "rgba(25, 31, 24, 0.58)",
  paperOverlayBottom: "rgba(25, 31, 24, 0.32)",
  vignetteColor: "rgba(20, 25, 19, 0.34)",

  flowLine: "#FFF8E8",
  dividerLine: "rgba(255,248,232,0.42)",
  nodeRing: "rgba(255,248,232,0.30)",

  backgroundColor: "#343A2E",

  /* INTRO */
  introMainText: "#FFFDF7",
  introAccent: "#F4E8C8",
  introButtonBg: "rgba(35, 42, 31, 0.42)",
  introButtonBorder: "rgba(255,248,232,0.55)",
  introButtonText: "#FFFDF7",
  introButtonHoverBg: "rgba(35, 42, 31, 0.58)",

  /* RSVP */
  rsvpButtonBg: "#596047",
  rsvpButtonText: "#FFFDF7",
},
 showDressCode: true,
  venue: "Beograd",
  dressCodeTitle: "Dress code",
  dressCodePalette: ["#c9c3bb", "#a89e94", "#e8ddd4", "#f3ece6", "#8f8a64"],
  dressCodeNote:
    "Nježni, elegantni i prirodni tonovi lepo će se uklopiti u atmosferu našeg dana.",
  mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
  note: "Molimo vas da svoj dolazak potvrdite na vreme.",
  }),
},
 {
  slug: "lana-milan",
  type: "wedding",
  template: "split-video",
  brideName: "Lana",
  groomName: "Milan",
  videoSrc: "/videos/lana-milan-2.mp4",
  weddingDate: "10 OKT 2026",
  weddingTime: "17:00",
 venue: "Beograd",
 
  introText: "Radujemo se da ovaj dan podelimo sa vama.",
  details: createDetails({
    backgroundImage: "/images/lana-milan-split-1.jpg",
    welcomeText:
      "Biće nam veliko zadovoljstvo da svojim prisustvom ulepšate naš poseban dan.",
    date: "10 OKT 2026",
    dateISO: "2026-10-10T17:00:00+02:00",

    events: [
      {
        label: "Crkveno venčanje",
        time: "13:30",
        location: "Hram Svetog Save, Beograd",
        
        note: "Svečani čin crkvenog venčanja.",
      },
      {
        label: "Skup svatova",
        time: "16:00",
        location: "Hotel Moskva, Beograd",
        
        note: "Početak okupljanja i dragi susreti pre ceremonije."
      },
      {
        label: "Građansko venčanje",
        time: "17:00",
       location: "Hotel Moskva, Beograd",
        
        note: "Trenutak kada počinje naše novo poglavlje",
      },
    
    ],
theme: {
  mainText:"#584c4c",
  softText: "#584c4c",
  scriptText: "#7b1234",
  mutedText: "#7b1234",

  accent: "  #7b1234",
  accentStrong:" #7b1234",
  buttonText: "#ffffff",

  cardBg: "rgba(255,255,255,0.28)",
  cardBorder: "transparent",
  frameBorder: "rgba(123,18,52,0.20)",

  paperOverlayTop: "rgba(255,255,255,0.03)",
paperOverlayBottom: "rgba(36,59,107,0.06)",
  vignetteColor: "rgba(123,18,52,0.08)",

  flowLine: "#7b1234",
  dividerLine: "rgba(123,18,52,0.25)",
  nodeRing: "rgba(181,144,59,0.16)",
backgroundColor: "#f3ece6",
  /* INTRO */
  introMainText:"#ffffff",
  introAccent: "#ffffff",
  introButtonBg: "rgba(255,255,255,0.18)",
  introButtonBorder: "rgba(255,255,255,0.35)",
  introButtonText: "#ffffff",
  introButtonHoverBg: "rgba(255,255,255,0.28)",

  /* RSVP */
  rsvpButtonBg: "#7b1234",
  rsvpButtonText: "#ffffff",
},
 showDressCode: true,
  venue: "Beograd",
  dressCodeTitle: "Dress code",
  dressCodePalette: [],
  dressCodeNote:
    "Slobodno birajte boje po želji, uz molbu da izbegnete belu.",
  mapLink: "https://www.google.com/maps/place/%D0%A2%D0%B8%D1%81%D0%BA%D0%B8+%D1%86%D0%B2%D0%B5%D1%82/@45.5942253,20.132972,17z/data=!3m1!4b1!4m9!3m8!1s0x475b2d9034f0ae43:0xea48bcb4e8be3019!5m2!4m1!1i2!8m2!3d45.5942253!4d20.132972!16s%2Fg%2F1tqpy0mn?entry=ttu&g_ep=EgoyMDI2MDQwNi4wIKXMDSoASAFQAw%3D%3D",
  note: "Molimo vas da svoj dolazak potvrdite do 26. septembra.",
  }),
},
// =========================
// SILK TEMPLATE
// =========================
{
  slug: "nina-nikola",
  type: "wedding",
  template: "silk",
  brideName: "Nina",
  groomName: "Nikola",
  videoSrc: "/videos/nina-nikola.mp4",
  fontMode: "dark",
  weddingDate: "06 SEP 2026",
  weddingTime: "17:00",
  venue: "Beograd",
  backgroundImage: "/images/nina-nikola-minimal.jpg",
  details: createDetails({
    welcomeText:
      "Biće nam izuzetno drago da svojim prisustvom ulepšate naš poseban dan.",
    date: "06 SEP 2026",
    dateISO: "2026-09-06T17:00:00+02:00",
    events: [
      {
        label: "Okupljanje gostiju",
        time: "16:00",
        icon: "gathering",
        location: "Beograd",
      },
      {
        label: "Ceremonija",
        time: "17:00",
        icon: "civil",
        location: "Beograd",
      },
      {
        label: "Večera i proslava",
        time: "18:30",
        icon: "restaurant",
        location: "Beograd",
      },
    ],
    dressCodeTitle: "Dress code",
    dressCodePalette: ["#d8c8b4", "#c2a98f", "#8d7057", "#f3e7da"],
    dressCodeNote:
      "Elegantne i nežne nijanse savršeno će se uklopiti u atmosferu našeg dana.",
    mapLink: "https://maps.google.com/?q=Beograd",
    note: "Molimo vas da svoj dolazak potvrdite na vreme.",
  }),
},
{
  slug: "ivona-aleksa",
  type: "wedding",
  template: "silk",
  brideName: "Ivona",
  groomName: "Aleksa",
  videoSrc: "/videos/ivona-aleksa-3.mp4",
  fontMode: "light",
  weddingDate: "06 SEP 2026",
  weddingTime: "17:00",
  venue: "Beograd",
  backgroundImage: "/images/ivona-aleksa-minimal-3.jpg",
  details: createDetails({
    welcomeText:
      "Biće nam izuzetno drago da svojim prisustvom ulepšate naš poseban dan.",
    date: "06 SEP 2026",
    dateISO: "2026-09-06T17:00:00+02:00",
    events: [
      {
        label: "Okupljanje gostiju",
        time: "16:00",
        icon: "gathering",
        location: "Beograd",
      },
      {
        label: "Ceremonija",
        time: "17:00",
        icon: "civil",
        location: "Beograd",
      },
      {
        label: "Večera i proslava",
        time: "18:30",
        icon: "restaurant",
        location: "Beograd",
      },
    ],
    dressCodeTitle: "Dress code",
    dressCodePalette: ["#d8c8b4", "#c2a98f", "#8d7057", "#f3e7da"],
    dressCodeNote:
      "Elegantne i nežne nijanse savršeno će se uklopiti u atmosferu našeg dana.",
    mapLink: "https://maps.google.com/?q=Beograd",
    note: "Molimo vas da svoj dolazak potvrdite na vreme.",
  }),
},
{
  slug: "nika-ivan",
  type: "wedding",
  template: "silk",
  brideName: "Nina",
  groomName: "Ivan",
  videoSrc: "/videos/nika-ivan.mp4",
  fontMode: "light",
  weddingDate: "06 SEP 2026",
  weddingTime: "17:00",
  venue: "Beograd",
  backgroundImage: "/images/nika-ivan-minimal.jpg",
  details: createDetails({
    welcomeText:
      "Biće nam izuzetno drago da svojim prisustvom ulepšate naš poseban dan.",
    date: "06 SEP 2026",
    dateISO: "2026-09-06T17:00:00+02:00",
    events: [
      {
        label: "Okupljanje gostiju",
        time: "16:00",
        icon: "gathering",
        location: "Beograd",
      },
      {
        label: "Ceremonija",
        time: "17:00",
        icon: "civil",
        location: "Beograd",
      },
      {
        label: "Večera i proslava",
        time: "18:30",
        icon: "restaurant",
        location: "Beograd",
      },
    ],
    dressCodeTitle: "Dress code",
    dressCodePalette: ["#d8c8b4", "#c2a98f", "#8d7057", "#f3e7da"],
    dressCodeNote:
      "Elegantne i nežne nijanse savršeno će se uklopiti u atmosferu našeg dana.",
    mapLink: "https://maps.google.com/?q=Beograd",
    note: "Molimo vas da svoj dolazak potvrdite na vreme.",
  }),
},
{
  slug: "anđela-jovan",
  type: "wedding",
  template: "silk",
  brideName: "Anđela",
  groomName: "Jovan",
  videoSrc: "/videos/anđela-jovan.mp4",
  fontMode: "light",
  weddingDate: "06 SEP 2026",
  weddingTime: "17:00",
  venue: "Beograd",
  backgroundImage: "/images/anđela-jovan-minimal.jpg",
  details: createDetails({
    welcomeText:
      "Biće nam izuzetno drago da svojim prisustvom ulepšate naš poseban dan.",
    date: "06 SEP 2026",
    dateISO: "2026-09-06T17:00:00+02:00",
    events: [
      {
        label: "Okupljanje gostiju",
        time: "16:00",
        icon: "gathering",
        location: "Beograd",
      },
      {
        label: "Ceremonija",
        time: "17:00",
        icon: "civil",
        location: "Beograd",
      },
      {
        label: "Večera i proslava",
        time: "18:30",
        icon: "restaurant",
        location: "Beograd",
      },
    ],
    dressCodeTitle: "Dress code",
    dressCodePalette: ["#d8c8b4", "#c2a98f", "#8d7057", "#f3e7da"],
    dressCodeNote:
      "Elegantne i nežne nijanse savršeno će se uklopiti u atmosferu našeg dana.",
    mapLink: "https://maps.google.com/?q=Beograd",
    note: "Molimo vas da svoj dolazak potvrdite na vreme.",
  }),
},
{
  slug: "jovana-nikola-1",
  type: "wedding",
  template: "silk",
  brideName: "Jovana",
  groomName: "Nikola",
  videoSrc: "/videos/jovana-nikola-3.mp4",
  fontMode: "light",
  weddingDate: "06 SEP 2026",
  weddingTime: "17:00",
  venue: "Beograd",
  backgroundImage: "/images/jovana-nikola-minimal-1.jpg",
  details: createDetails({
    welcomeText:
      "Biće nam izuzetno drago da svojim prisustvom ulepšate naš poseban dan.",
    date: "06 SEP 2026",
    dateISO: "2026-09-06T17:00:00+02:00",
    events: [
      {
        label: "Okupljanje gostiju",
        time: "16:00",
        icon: "gathering",
        location: "Beograd",
      },
      {
        label: "Ceremonija",
        time: "17:00",
        icon: "civil",
        location: "Beograd",
      },
      {
        label: "Večera i proslava",
        time: "18:30",
        icon: "restaurant",
        location: "Beograd",
      },
    ],
    dressCodeTitle: "Dress code",
    dressCodePalette: ["#d8c8b4", "#c2a98f", "#8d7057", "#f3e7da"],
    dressCodeNote:
      "Elegantne i nežne nijanse savršeno će se uklopiti u atmosferu našeg dana.",
    mapLink: "https://maps.google.com/?q=Beograd",
    note: "Molimo vas da svoj dolazak potvrdite na vreme.",
  }),
},
// =========================
// SPLIT IMAGE TEMPLATE
// =========================
{
  slug: "draga-stefan",
  type: "wedding",
  template: "split-image",
  brideName: "Draga",
  groomName: "Stefan",
  image: "/images/wedding4.jpg",
  weddingDate: "18 SEP 2026",
  weddingTime: "17:00",
  venue: "Beograd",
 details: createDetails({
  welcomeText:
    "Sa velikom radošću vas pozivamo da budete deo našeg posebnog dana.",
  date: "18 SEP 2026",
  dateISO: "2026-09-18T17:00:00",

  events: [
    {
      label: "Okupljanje gostiju",
      time: "16:00",
      location: "Hotel Hyatt, Beograd",
      mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
      note: "Doček i prvi zajednički trenuci.",
    },
    {
      label: "Crkveno venčanje",
      time: "17:00",
      location: "Crkva Svetog Marka, Beograd",
      mapLink: "https://maps.google.com/?q=Crkva+Svetog+Marka+Beograd",
      note: "Svečani obred u krugu najbližih.",
    },
    {
      label: "Svečani ručak",
      time: "18:30",
      location: "Svečana sala, Hyatt",
      mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
      note: "Proslava, muzika i nezaboravno veče.",
    },
    {
      label: "After party",
      time: "22:30",
      location: "Lounge bar Hyatt",
      mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
      note: "Nastavljamo slavlje uz opušteniju atmosferu.",
    },
  ],

  editorialImage1: "/images/wedding4.jpg",
  editorialImage2: "/images/wedding4.jpg",
  editorialImage3: "/images/wedding4.jpg",

  dressCodeTitle: "Dress code",
  dressCodePalette: ["#2f2c2c", "#726767", "#b1a19d", "#e2d8d2"],
  dressCodeNote:
    "Elegantni tonovi i zagasite nijanse savršeno će se uklopiti.",
  note: "Molimo vas da svoj dolazak potvrdite na vreme.",
}),
},

  {
  slug: "vesna-mitar",
  type: "wedding",
  template: "split-image",
  brideName: "Vesna",
  groomName: "Mitar",
  image: "/images/vesna-mitar.jpg",
  weddingDate: "18 SEP 2026",
  weddingTime: "17:00",
  venue: "Beograd",
 details: createDetails({
  welcomeText:
    "Sa velikom radošću vas pozivamo da budete deo našeg posebnog dana.",
  date: "18 SEP 2026",
  dateISO: "2026-09-18T17:00:00",

  events: [
    {
      label: "Okupljanje gostiju",
      time: "16:00",
      location: "Hotel Hyatt, Beograd",
      mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
      note: "Doček i prvi zajednički trenuci.",
    },
    {
      label: "Crkveno venčanje",
      time: "17:00",
      location: "Crkva Svetog Marka, Beograd",
      mapLink: "https://maps.google.com/?q=Crkva+Svetog+Marka+Beograd",
      note: "Svečani obred u krugu najbližih.",
    },
    {
      label: "Svečani ručak",
      time: "18:30",
      location: "Svečana sala, Hyatt",
      mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
      note: "Proslava, muzika i nezaboravno veče.",
    },
    {
      label: "After party",
      time: "22:30",
      location: "Lounge bar Hyatt",
      mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
      note: "Nastavljamo slavlje uz opušteniju atmosferu.",
    },
  ],

  editorialImage1: "/images/wedding4.jpg",
  editorialImage2: "/images/wedding4.jpg",
  editorialImage3: "/images/wedding4.jpg",

  dressCodeTitle: "Dress code",
  dressCodePalette: ["#2f2c2c", "#726767", "#b1a19d", "#e2d8d2"],
  dressCodeNote:
    "Elegantni tonovi i zagasite nijanse savršeno će se uklopiti.",
  note: "Molimo vas da svoj dolazak potvrdite na vreme.",
}),
},


  {
  slug: "iva-vuk",
  type: "wedding",
  template: "split-image",
  brideName: "Iva",
  groomName: "Vuk",
  image: "/images/iva-vuk.jpg",
  weddingDate: "18 SEP 2026",
  weddingTime: "17:00",
  venue: "Beograd",
 details: createDetails({
  welcomeText:
    "Sa velikom radošću vas pozivamo da budete deo našeg posebnog dana.",
  date: "18 SEP 2026",
  dateISO: "2026-09-18T17:00:00",

  events: [
    {
      label: "Okupljanje gostiju",
      time: "16:00",
      location: "Hotel Hyatt, Beograd",
      mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
      note: "Doček i prvi zajednički trenuci.",
    },
    {
      label: "Crkveno venčanje",
      time: "17:00",
      location: "Crkva Svetog Marka, Beograd",
      mapLink: "https://maps.google.com/?q=Crkva+Svetog+Marka+Beograd",
      note: "Svečani obred u krugu najbližih.",
    },
    {
      label: "Svečani ručak",
      time: "18:30",
      location: "Svečana sala, Hyatt",
      mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
      note: "Proslava, muzika i nezaboravno veče.",
    },
    {
      label: "After party",
      time: "22:30",
      location: "Lounge bar Hyatt",
      mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
      note: "Nastavljamo slavlje uz opušteniju atmosferu.",
    },
  ],

  editorialImage1: "/images/wedding4.jpg",
  editorialImage2: "/images/wedding4.jpg",
  editorialImage3: "/images/wedding4.jpg",

  dressCodeTitle: "Dress code",
  dressCodePalette: ["#2f2c2c", "#726767", "#b1a19d", "#e2d8d2"],
  dressCodeNote:
    "Elegantni tonovi i zagasite nijanse savršeno će se uklopiti.",
  note: "Molimo vas da svoj dolazak potvrdite na vreme.",
}),
},
// =========================
// VIDEO BAND TEMPLATE
// =========================
{
  slug: "iva-pedja",
  type: "wedding",
  template: "video-band",
  brideName: "Iva",
  groomName: "Pedja",
  videoSrc: "/videos/iva-pedja5.mp4",
  weddingDate: "18 SEP 2026",
  weddingTime: "17:00",

  details: createDetails({
    welcomeText:
      "Biće nam veliko zadovoljstvo da ovaj poseban dan podelimo sa vama.",

    date: "18 SEP 2026",
    dateISO: "2026-09-18T17:00:00",

    events: [
      {
        label: "Skup gostiju",
        time: "14:30",
        location: "Topčiderac, Beograd",
      },
      {
        label: "Crkveno venčanje",
        time: "15:00",
        location: "Crkva Svetog Marka, Beograd",
      },
      {
        label: "Građansko venčanje",
        time: "17:00",
        location: "Topčiderac, Beograd",
      },
      {
        label: "Svečani ručak",
        time: "18:30",
        location: "Topčiderac, Beograd",
      },
    ],

    venue: "Topčiderac, Beograd",
    churchVenue: "Crkva Svetog Marka, Beograd",

    dressCodeTitle: "Dress code",
    dressCodePalette: ["#d8c7c2", "#e9ddd6", "#bfa8a0", "#cbb7ae", "#f2ebe6"],
    dressCodeNote:
      "Molimo vas da birate elegantne, nežne i puderaste tonove.",

    mapLink: "https://maps.google.com/?q=Beograd",
    note: "Molimo vas da svoj dolazak potvrdite na vreme.",
  }),
},
{
  slug: "katarina-milos",
  type: "wedding",
  template: "video-band",
  brideName: "Katarina",
  groomName: "Milos",
  videoSrc: "/videos/katarina-milos.mp4",
  weddingDate: "18 SEP 2026",
  weddingTime: "17:00",

  details: createDetails({
    welcomeText:
      "Radujemo se da zajedno sa vama proslavimo ljubav i početak našeg novog poglavlja.",

    date: "18 SEP 2026",
    dateISO: "2026-09-18T17:00:00",

    events: [
      {
        label: "Skup gostiju",
        time: "14:30",
        location: "Topčiderac, Beograd",
      },
      {
        label: "Crkveno venčanje",
        time: "15:00",
        location: "Crkva Svetog Marka, Beograd",
      },
      {
        label: "Građansko venčanje",
        time: "17:00",
        location: "Topčiderac, Beograd",
      },
      {
        label: "Svečani ručak",
        time: "18:30",
        location: "Topčiderac, Beograd",
      },
    ],

    venue: "Topčiderac, Beograd",
    churchVenue: "Crkva Svetog Marka, Beograd",

    dressCodeTitle: "Dress code",
    dressCodePalette: ["#d8c7c2", "#e9ddd6", "#bfa8a0", "#cbb7ae", "#f2ebe6"],
    dressCodeNote:
      "Molimo vas da birate elegantne, nežne i puderaste tonove.",

    mapLink: "https://maps.google.com/?q=Beograd",
    note: "Molimo vas da svoj dolazak potvrdite do 20. Septembra.",
  }),
},

{
  slug: "katarina-aleksa",
  type: "wedding",
  template: "video-band",
  brideName: "Katarina",
  groomName: "Aleksa",
  videoSrc: "/videos/katarina-aleksa5.mp4",
  weddingDate: "18 SEP 2026",
  weddingTime: "17:00",

  details: createDetails({
    welcomeText:
      "Radujemo se da zajedno sa vama proslavimo ljubav i početak našeg novog poglavlja.",

    date: "18 SEP 2026",
    dateISO: "2026-09-18T17:00:00",

    events: [
      {
        label: "Skup gostiju",
        time: "14:30",
        location: "Topčiderac, Beograd",
      },
      {
        label: "Crkveno venčanje",
        time: "15:00",
        location: "Crkva Svetog Marka, Beograd",
      },
      {
        label: "Građansko venčanje",
        time: "17:00",
        location: "Topčiderac, Beograd",
      },
      {
        label: "Svečani ručak",
        time: "18:30",
        location: "Topčiderac, Beograd",
      },
    ],

    venue: "Topčiderac, Beograd",
    churchVenue: "Crkva Svetog Marka, Beograd",

    dressCodeTitle: "Dress code",
    dressCodePalette: ["#d8c7c2", "#e9ddd6", "#bfa8a0", "#cbb7ae", "#f2ebe6"],
    dressCodeNote:
      "Molimo vas da birate elegantne, nežne i puderaste tonove.",

    mapLink: "https://maps.google.com/?q=Beograd",
    note: "Molimo vas da svoj dolazak potvrdite do 20. Septembra.",
  }),
},
// =========================
// PASSPORT TEMPLATE
// =========================
{
  slug: "anja-jovan",
  type: "wedding",
  template: "passport",

  brideName: "Anja",
  groomName: "Jovan",

  weddingDate: "18 SEP 2026",
  weddingTime: "17:00",
  venue: "Hotel Hyatt, Beograd",

  details: createDetails({
    cardBackground: "/images/passport/anja-jovan-card-bg.jpg",
    welcomeText: "Radujemo se da ovaj dan podelimo sa vama.",
    date: "18 SEP 2026",
    dateISO: "2026-09-18T17:00:00+02:00",
    venue: "Hotel Hyatt, Beograd",

    events: [
      {
        label: "Okupljanje gostiju",
        time: "15:30",
        location: "Hotel Hyatt, Beograd",
        icon: "gathering",
      },
      {
        label: "Ceremonija",
        time: "17:00",
        location: "Hotel Hyatt, Beograd",
        icon: "civil",
      },
      {
        label: "Zdravica i koktel",
        time: "17:45",
        location: "Hotel Hyatt, Beograd",
        icon: "toast",
      },
      {
        label: "Večera",
        time: "19:00",
        location: "Hotel Hyatt, Beograd",
        icon: "restaurant",
      },
      {
        label: "After party",
        time: "23:30",
        location: "Hotel Hyatt, Beograd",
        icon: "party",
      },
    ],

    showDressCode: true,
    dressCodeTitle: "Dress code",
    dressCodeNote: "Elegantne i svetle nijanse savršeno će se uklopiti.",
    dressCodePalette: ["#e8ddd4", "#c9b8a8", "#a38f7b"],

    note: "Molimo vas da svoj dolazak potvrdite na vreme.",
    rsvpDeadline: "Molimo vas da odgovorite do 1. septembra 2026.",
  }),
},
{
  slug: "anja-dejan",
  type: "wedding",
  template: "elegant-white",

  brideName: "Anja",
  groomName: "Dejan",

  weddingDate: "18 SEP 2026",
  weddingTime: "17:00",
    backgroundImage: "/images/elegant-white/background.jpg",
  details: createDetails({
    backgroundImage: "/images/elegant-white/background.jpg",

    welcomeText: "Radujemo se da ovaj dan podelimo sa vama.",

    date: "18 SEP 2026",
    dateISO: "2026-09-18T17:00:00+02:00",

    venue: "Vila Miloš",
    locationText: "Karađorđeva 72, Topola",

    events: [
      {
        label: "Okupljanje gostiju",
        time: "15:30",
        location: "Hotel Hyatt, Beograd",
      },
      {
        label: "Ceremonija",
        time: "17:00",
        location: "Hotel Hyatt, Beograd",
      },
      {
        label: "Koktel",
        time: "18:00",
        location: "Bašta hotela",
      },
      {
        label: "Večera",
        time: "19:30",
        location: "Svečana sala",
      },
      {
        label: "Proslava",
        time: "21:00",
        location: "DJ & ples",
      },
    ],
  }),
},
// =========================
// ELEGANT BLACK TEMPLATE
// =========================
{
  slug: "marija-nikola-2",
  type: "wedding",
  template: "elegant-black",

  brideName: "Marija",
  groomName: "Nikola",

  weddingDate: "12 SEP 2026",
  weddingTime: "17:00",

  backgroundImage: "/images/elegant-black/marija-nikola-bg.jpg",

  details: createDetails({
    backgroundImage: "/images/elegant-black/marija-nikola-bg.jpg",

    welcomeText:
      "Sa velikom radošću vas pozivamo da budete deo našeg posebnog dana.",

    date: "12 SEP 2026",
    dateISO: "2026-09-12T17:00:00+02:00",

    venue: "Restoran Topčiderac, Beograd",

    events: [
      {
        label: "Okupljanje gostiju",
        time: "16:00",
        location: "Topčiderac, Beograd",
      },
      {
        label: "Ceremonija",
        time: "17:00",
        location: "Topčiderac, Beograd",
      },
      {
        label: "Večera",
        time: "19:00",
        location: "Svečana sala",
      },
      {
        label: "Proslava",
        time: "21:00",
        location: "DJ & ples",
      },
    ],

    showDressCode: true,
    dressCodeTitle: "Dress code",
    dressCodePalette: ["#000000", "#2b2b2b", "#8c6f3f", "#d4c2a8"],
    dressCodeNote:
      "Elegantne i tamnije nijanse uz zlatne detalje savršeno će se uklopiti.",

    mapLink:
      "https://maps.google.com/?q=Topciderac+Beograd",

    note:
      "Molimo vas da svoj dolazak potvrdite do 1. septembra.",
  }),
},
{
  slug: "anika-stefan",
  type: "wedding",
  template: "envelope-split",
  brideName: "Anika",
  groomName: "Stefan",
  weddingDate: "24 AVG 2026",
  weddingTime: "16:00",
  venue: "Hotel Moskva, Beograd",
  backgroundImage: "/images/milica-ognjen-minimal.jpg",
  musicSrc: "/music/milica-aleksandar.mp3",
  details: createDetails({
  
    welcomeText:
      "Sa velikom radošću vas pozivamo da svojim prisustvom ulepšate naš poseban dan.",
    date: "24 AVG 2026",
    dateISO: "2026-08-24T16:00:00+02:00",
    events: [
      {
        label: "Okupljanje gostiju",
        time: "15:30",
        icon: "gathering",
        location: "Hotel Moskva, Beograd",
      },
      {
        label: "Ceremonija",
        time: "16:00",
        icon: "civil",
        location: "Hotel Moskva, Beograd",
      },
      {
        label: "Večera",
        time: "18:00",
        icon: "restaurant",
        location: "Hotel Moskva, Beograd",
      },
    ],
    showDressCode: false,
    note: "Molimo vas da svoj dolazak potvrdite do 1. avgusta.",
  }),
},
{
  slug: "anika-ivan",
  type: "wedding",
  template: "envelope-split",
  brideName: "Anika",
  groomName: "Ivan",
  weddingDate: "24 AVG 2026",
  weddingTime: "16:00",
  venue: "Hotel Moskva, Beograd",
  backgroundImage: "/images/milica-ognjen-minimal-1.jpg",
  musicSrc: "/music/milica-aleksandar.mp3",
  details: createDetails({
 
    welcomeText:
      "Sa velikom radošću vas pozivamo da svojim prisustvom ulepšate naš poseban dan.",
    date: "24 AVG 2026",
    dateISO: "2026-08-24T16:00:00+02:00",
    events: [
      {
        label: "Okupljanje gostiju",
        time: "15:30",
        icon: "gathering",
        location: "Hotel Moskva, Beograd",
      },
      {
        label: "Ceremonija",
        time: "16:00",
        icon: "civil",
        location: "Hotel Moskva, Beograd",
      },
      {
        label: "Večera",
        time: "18:00",
        icon: "restaurant",
        location: "Hotel Moskva, Beograd",
      },
    ],
    showDressCode: false,
    note: "Molimo vas da svoj dolazak potvrdite do 1. avgusta.",
  }),
},
{
  slug: "anika-jovan",
  type: "wedding",
  template: "envelope-split",
  brideName: "Anika",
  groomName: "Jovan",
  weddingDate: "24 AVG 2026",
  weddingTime: "16:00",
  venue: "Hotel Moskva, Beograd",
  backgroundImage: "/images/milica-ognjen-minimal.jpg",
  musicSrc: "/music/milica-aleksandar.mp3",
  details: createDetails({
 
    welcomeText:
      "Sa velikom radošću vas pozivamo da svojim prisustvom ulepšate naš poseban dan.",
    date: "24 AVG 2026",
    dateISO: "2026-08-24T16:00:00+02:00",
    events: [
      {
        label: "Okupljanje gostiju",
        time: "15:30",
        icon: "gathering",
        location: "Hotel Moskva, Beograd",
      },
      {
        label: "Ceremonija",
        time: "16:00",
        icon: "civil",
        location: "Hotel Moskva, Beograd",
      },
      {
        label: "Večera",
        time: "18:00",
        icon: "restaurant",
        location: "Hotel Moskva, Beograd",
      },
    ],
    showDressCode: false,
    note: "Molimo vas da svoj dolazak potvrdite do 1. avgusta.",
  }),
},
{
  slug: "milena-stefan",
  type: "wedding",
  template: "envelope-side-split", // 👈 BITNO

  brideName: "Milena",
  groomName: "Stefan",

  weddingDate: "20 SEP 2026",
  weddingTime: "17:00",
  venue: "Restoran Topčiderac, Beograd",

  backgroundImage: "/images/floral-milena-stefan.jpg", // floral background
  musicSrc: "/music/olja-milos.mp3",

  details: createDetails({
    welcomeText:
      "Radujemo se što ćemo naš poseban dan podeliti sa vama.",

    date: "20 SEP 2026",
    dateISO: "2026-09-20T17:00:00+02:00",

    events: [
      {
        label: "Okupljanje gostiju",
        time: "16:30",
        icon: "gathering",
        location: "Topčiderac, Beograd",
        mapLink:
          "https://maps.google.com/?q=Topciderac+Beograd",
      },
      {
        label: "Ceremonija",
        time: "17:00",
        icon: "civil",
        location: "Topčiderac, Beograd",
      },
      {
        label: "Večera i slavlje",
        time: "18:30",
        icon: "restaurant",
        location: "Topčiderac, Beograd",
      },
    ],

    showDressCode: true,
    dressCodeTitle: "Dress code",
    dressCodePalette: [
      "#e8ddd4",
      "#c9b8a8",
      "#a38f7b",
      "#f3ece6",
    ],
    dressCodeNote:
      "Elegantni i nežni tonovi savršeno će se uklopiti.",

    mapLink:
      "https://maps.google.com/?q=Topciderac+Beograd",

    note:
      "Molimo vas da svoj dolazak potvrdite do 1. septembra.",
  }),
},
{
  slug: "milena-ivan",
  type: "wedding",
  template: "envelope-side-split", // 👈 BITNO

  brideName: "Milena",
  groomName: "Ivan",

  weddingDate: "20 SEP 2026",
  weddingTime: "17:00",
  venue: "Restoran Topčiderac, Beograd",

  backgroundImage: "/images/floral-milena-ivan.jpg", // floral background
  musicSrc: "/music/olja-milos.mp3",

  details: createDetails({
    welcomeText:
      "Radujemo se što ćemo naš poseban dan podeliti sa vama.",

    date: "20 SEP 2026",
    dateISO: "2026-09-20T17:00:00+02:00",

    events: [
      {
        label: "Okupljanje gostiju",
        time: "16:30",
        icon: "gathering",
        location: "Topčiderac, Beograd",
        mapLink:
          "https://maps.google.com/?q=Topciderac+Beograd",
      },
      {
        label: "Ceremonija",
        time: "17:00",
        icon: "civil",
        location: "Topčiderac, Beograd",
      },
      {
        label: "Večera i slavlje",
        time: "18:30",
        icon: "restaurant",
        location: "Topčiderac, Beograd",
      },
    ],

    showDressCode: true,
    dressCodeTitle: "Dress code",
    dressCodePalette: [
      "#e8ddd4",
      "#c9b8a8",
      "#a38f7b",
      "#f3ece6",
    ],
    dressCodeNote:
      "Elegantni i nežni tonovi savršeno će se uklopiti.",

    mapLink:
      "https://maps.google.com/?q=Topciderac+Beograd",

    note:
      "Molimo vas da svoj dolazak potvrdite do 1. septembra.",
  }),
},
{
  slug: "milena-jovan",
  type: "wedding",
  template: "envelope-side-split", // 👈 BITNO

  brideName: "Milena",
  groomName: "Jovan",

  weddingDate: "20 SEP 2026",
  weddingTime: "17:00",
  venue: "Restoran Topčiderac, Beograd",

  backgroundImage: "/images/floral-milena-jovan.jpg", // floral background
  musicSrc: "/music/olja-milos.mp3",

  details: createDetails({
    welcomeText:
      "Radujemo se što ćemo naš poseban dan podeliti sa vama.",

    date: "20 SEP 2026",
    dateISO: "2026-09-20T17:00:00+02:00",

    events: [
      {
        label: "Okupljanje gostiju",
        time: "16:30",
        icon: "gathering",
        location: "Topčiderac, Beograd",
        mapLink:
          "https://maps.google.com/?q=Topciderac+Beograd",
      },
      {
        label: "Ceremonija",
        time: "17:00",
        icon: "civil",
        location: "Topčiderac, Beograd",
      },
      {
        label: "Večera i slavlje",
        time: "18:30",
        icon: "restaurant",
        location: "Topčiderac, Beograd",
      },
    ],

    showDressCode: true,
    dressCodeTitle: "Dress code",
    dressCodePalette: [
      "#e8ddd4",
      "#c9b8a8",
      "#a38f7b",
      "#f3ece6",
    ],
    dressCodeNote:
      "Elegantni i nežni tonovi savršeno će se uklopiti.",

    mapLink:
      "https://maps.google.com/?q=Topciderac+Beograd",

    note:
      "Molimo vas da svoj dolazak potvrdite do 1. septembra.",
  }),
},
{
  slug: "milena-aleksa",
  type: "wedding",
  template: "envelope-side-split", // 👈 BITNO

  brideName: "Milena",
  groomName: "Aleksa",

  weddingDate: "20 SEP 2026",
  weddingTime: "17:00",
  venue: "Restoran Topčiderac, Beograd",

  backgroundImage: "/images/floral-milena-aleksa.jpg", // floral background
  musicSrc: "/music/olja-milos.mp3",

  details: createDetails({
    welcomeText:
      "Radujemo se što ćemo naš poseban dan podeliti sa vama.",

    date: "20 SEP 2026",
    dateISO: "2026-09-20T17:00:00+02:00",

    events: [
      {
        label: "Okupljanje gostiju",
        time: "16:30",
        icon: "gathering",
        location: "Topčiderac, Beograd",
        mapLink:
          "https://maps.google.com/?q=Topciderac+Beograd",
      },
      {
        label: "Ceremonija",
        time: "17:00",
        icon: "civil",
        location: "Topčiderac, Beograd",
      },
      {
        label: "Večera i slavlje",
        time: "18:30",
        icon: "restaurant",
        location: "Topčiderac, Beograd",
      },
    ],

    showDressCode: true,
    dressCodeTitle: "Dress code",
    dressCodePalette: [
      "#e8ddd4",
      "#c9b8a8",
      "#a38f7b",
      "#f3ece6",
    ],
    dressCodeNote:
      "Elegantni i nežni tonovi savršeno će se uklopiti.",

    mapLink:
      "https://maps.google.com/?q=Topciderac+Beograd",

    note:
      "Molimo vas da svoj dolazak potvrdite do 1. septembra.",
  }),
},
{
  slug: "milena-nenad",
  type: "wedding",
  template: "envelope-side-split", // 👈 BITNO

  brideName: "Milena",
  groomName: "Nenad",

  weddingDate: "20 SEP 2026",
  weddingTime: "17:00",
  venue: "Restoran Topčiderac, Beograd",

  backgroundImage: "/images/floral-milena-nenad.jpg", // floral background
  musicSrc: "/music/olja-milos.mp3",

  details: createDetails({
    welcomeText:
      "Radujemo se što ćemo naš poseban dan podeliti sa vama.",

    date: "20 SEP 2026",
    dateISO: "2026-09-20T17:00:00+02:00",

    events: [
      {
        label: "Okupljanje gostiju",
        time: "16:30",
        icon: "gathering",
        location: "Topčiderac, Beograd",
        mapLink:
          "https://maps.google.com/?q=Topciderac+Beograd",
      },
      {
        label: "Ceremonija",
        time: "17:00",
        icon: "civil",
        location: "Topčiderac, Beograd",
      },
      {
        label: "Večera i slavlje",
        time: "18:30",
        icon: "restaurant",
        location: "Topčiderac, Beograd",
      },
    ],

    showDressCode: true,
    dressCodeTitle: "Dress code",
    dressCodePalette: [
      "#e8ddd4",
      "#c9b8a8",
      "#a38f7b",
      "#f3ece6",
    ],
    dressCodeNote:
      "Elegantni i nežni tonovi savršeno će se uklopiti.",

    mapLink:
      "https://maps.google.com/?q=Topciderac+Beograd",

    note:
      "Molimo vas da svoj dolazak potvrdite do 1. septembra.",
  }),
},
{
  slug: "dark-floral-demo",
  type: "wedding",
  template: "dark-floral",

  brideName: "Katarina",
  groomName: "Miloš",

  weddingDate: "18 SEP 2026",
  weddingTime: "17:00",
  venue: "Beograd",

  backgroundImage: "/images/dark-floral-intro.jpg",

  details: createDetails({
    backgroundImage: "/images/dark-floral-intro.jpg",
    cardBackground: "/images/dark-floral-card.jpg",

    welcomeText: "Radujemo se da ovaj poseban dan podelimo sa vama.",

    date: "18 SEP 2026",
    dateISO: "2026-09-18T17:00:00+02:00",
    venue: "Beograd",

    showCalendarButton: true,
    showDressCode: false,

    events: [
      {
        label: "Okupljanje gostiju",
        time: "15:30",
        icon: "gathering",
        location: "Beograd",
        mapLink: "https://maps.google.com/?q=Beograd",
      },
      {
        label: "Crkveno venčanje",
        time: "16:00",
        icon: "church",
        location: "Crkva Svetog Marka, Beograd",
        mapLink: "https://maps.google.com/?q=Crkva+Svetog+Marka+Beograd",
      },
      {
        label: "Građansko venčanje",
        time: "17:00",
        icon: "civil",
        location: "Beograd",
        mapLink: "https://maps.google.com/?q=Beograd",
      },
      {
        label: "Svečani ručak",
        time: "18:30",
        icon: "restaurant",
        location: "Restoran, Beograd",
        mapLink: "https://maps.google.com/?q=Restoran+Beograd",
      },
    ],

    mapLink: "https://maps.google.com/?q=Beograd",

    note: "Molimo vas da svoj dolazak potvrdite na vreme.",
  }),
},
{
  slug: "heart-floral-demo",
  type: "wedding",
  template: "heart-floral",

  brideName: "Lena",
  groomName: "Vuk",

  backgroundImage: "/images/floral-jovana-luka.png",
  musicSrc: "/music/olja-milos.mp3",

  weddingDate: "12 SEP 2026",
  weddingTime: "17:00",
  venue: "Topčider, Beograd",

  details: createDetails({
    welcomeText:
      "Radujemo se što ćemo najlepše trenutke našeg dana podeliti sa vama.",

    date: "12 SEP 2026",
    dateISO: "2026-09-12T17:00:00+02:00",

    rsvpOptions: {
      foodPreferences: true,
      musicWish: true,
    },

    events: [
      {
        label: "Okupljanje gostiju",
        time: "16:30",
        icon: "gathering",
        location: "Topčider, Beograd",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Topcider+Beograd",
      },
      {
        label: "Crkveno venčanje",
        time: "15:30",
        icon: "church",
        location: "Crkva Svetog Marka, Beograd",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Crkva+Svetog+Marka+Beograd",
      },
      {
        label: "Građansko venčanje",
        time: "17:00",
        icon: "civil",
        location: "Topčider, Beograd",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Topcider+Beograd",
      },
      {
        label: "Svečani ručak",
        time: "18:30",
        icon: "restaurant",
        location: "Restoran Topčiderac",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Restoran+Topciderac+Beograd",
      },
    ],

    showDressCode: true,
    dressCodeTitle: "Dress code",
    dressCodePalette: [
      "#b8b1a4",
      "#d8d0c2",
      "#7f8173",
      "#cab7a4",
      "#e7d9cf",
    ],
    dressCodeNote:
      "Molimo vas da birate nežne, zemljane i puderaste tonove.",

    mapLink: "https://maps.google.com/?q=Topcider+Beograd",
    note: "Molimo vas da svoj dolazak potvrdite do 1. septembra.",
  }),
},
{
  slug: "lara-mateja-magazine",
  type: "wedding",
  template: "magazine-editorial",

  brideName: "Lara",
  groomName: "Mateja",

  weddingDate: "06 SEP 2026",
  weddingTime: "13:00",
  venue: "EKOPARK Event & catering center, Beograd",

  backgroundImage: "/images/magazine-intro-bg.png",
  image1: "/images/nevena-pedja/location.jpg",
  details: createDetails({
    backgroundImage: "/images/magazine-intro-bg.png",


    ticketNumber: "060926LM",

    welcomeText:
      "Radujemo se da ovaj poseban dan podelimo sa vama.",

    date: "06 SEP 2026",
    dateISO: "2026-09-06T13:00:00+02:00",

    venue: "EKOPARK Event & catering center, Beograd",

    showCalendarButton: true,

    events: [
      {
        label: "Crkveno venčanje",
        time: "13:00",
        icon: "church",
        location: "Crkva Svetog Vasilija Ostroškog, Beograd",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Crkva+Svetog+Vasilija+Ostroskog+Crnotravska+2+Vozdovac+Beograd",
      },
      {
        label: "Skup gostiju",
        time: "15:00",
        icon: "gathering",
        location: "EKOPARK Event & catering center, Beograd",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=EKOPARK+Event+catering+center+Staska+Sondermajera+18v+Beograd",
      },
      {
        label: "Građansko venčanje",
        time: "16:00",
        icon: "civil",
        location: "EKOPARK Event & catering center",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=EKOPARK+Event+catering+center+Staska+Sondermajera+18v+Beograd",
      },
    ],

    showDressCode: true,

    mapLink:
      "https://www.google.com/maps/search/?api=1&query=EKOPARK+Event+catering+center+Staska+Sondermajera+18v+Beograd",

    note: "Molimo vas da svoj dolazak potvrdite do 20.08.2026.",
    rsvpDeadline: "20.08.2026.",
  }),
},
{
  slug: "lara-mateja",
  type: "wedding",
  template: "magazine-editorial",

  brideName: "Lara",
  groomName: "Mateja",

  weddingDate: "12 SEP 2026",
  weddingTime: "11:00",
  venue: "Restoran Glamour",

  backgroundImage: "/images/lara-mateja-intro-bg.png",
  image1: "/images/nevena-pedja/location.jpg",
  musicSrc: "/music/lara-mateja.mp3",

  details: createDetails({
    backgroundImage: "/images/magazine-intro-bg.png",

    ticketNumber: "120926LM",

    welcomeText:
      "Radujemo se da ovaj poseban dan podelimo sa vama.",

    date: "12 SEP 2026",
    dateISO: "2026-09-12T11:00:00+02:00",

    venue: "Restoran Glamour",

    showCalendarButton: false,
    showDressCode: false,

    events: [
      {
        label: "Skup svatova kod mladoženje",
        time: "11:00",
        icon: "gathering",
        location: "Porodična kuća mladoženje",
      },
      {
        label: "Crkveno venčanje",
        time: "13:30",
        icon: "church",
        location: "Hram Svetog Save",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Hram+Svetog+Save+Beograd",
      },
      {
        label: "Skup gostiju",
        time: "15:30",
        icon: "gathering",
        location: "Restoran Glamour",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Restoran+Glamour",
      },
      {
        label: "Građansko venčanje",
        time: "16:00",
        icon: "civil",
        location: "Restoran Glamour",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Restoran+Glamour",
      },
    ],

    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Restoran+Glamour",

    note: "Molimo vas da svoj dolazak potvrdite do 01.09.2026.",
    rsvpDeadline: "01.09.2026.",
    rsvpDeadlineISO: "2026-09-01",
  }),
},
{
  slug: "milena-luka",
  type: "wedding",
  template: "playing-card",

  brideName: "Milena",
  groomName: "Luka",

  weddingDate: "14 SEP 2026",
  weddingTime: "17:00",
  venue: "Beograd",

  details: createDetails({
    welcomeText:
      "Sa velikom radošću vas pozivamo da budete deo našeg posebnog dana.",

    date: "14 SEP 2026",
    dateISO: "2026-09-14T17:00:00+02:00",

    venue: "Beograd",

    showCalendarButton: true,
    showDressCode: false,

    events: [
      {
        label: "Okupljanje gostiju",
        time: "16:30",
        icon: "gathering",
        location: "Beograd",
        address: "Beograd",
        mapLink: "https://maps.google.com/?q=Beograd",
        buttonText: "Pogledaj lokaciju",
      },
      {
        label: "Građansko venčanje",
        time: "17:00",
        icon: "civil",
        location: "Beograd",
        address: "Beograd",
        mapLink: "https://maps.google.com/?q=Beograd",
        buttonText: "Pogledaj lokaciju",
      },
      {
        label: "Večera i proslava",
        time: "18:30",
        icon: "restaurant",
        location: "Beograd",
        address: "Beograd",
        mapLink: "https://maps.google.com/?q=Beograd",
        buttonText: "Pogledaj lokaciju",
      },
    ],

    mapLink: "https://maps.google.com/?q=Beograd",

    note: "Molimo vas da svoj dolazak potvrdite do 1. septembra.",
  }),
},
{
  slug: "tamara-viktor-calla",
  type: "wedding",
  template: "calla-lace",

  brideName: "Tamara",
  groomName: "Viktor",

  weddingDate: "14.06.2026.",
  weddingTime: "16:00",
  venue: "Restoran Elegance, Beograd",

  backgroundImage: "/images/calla-lace-bg.jpg",
  videoSrc: "/videos/tamara-viktor-calla.mp4",
  musicSrc: "/music/olja-milos.mp3",

  details: createDetails({
    backgroundImage: "/images/calla-lace-bg.jpg",
    heroText: "sa radošću vas pozivaju da budete deo njihovog dana",

    date: "14.06.2026.",
    dateISO: "2026-06-14T16:00:00+02:00",
rsvpImage: "/images/italian-rsvp/tamara-viktor-calla-rsvp.jpg",
 events: [
  {
    label: "Okupljanje gostiju",
    time: "15:30",
    icon: "gathering",
    location: "Restoran Elegance, Beograd",
    mapLink: "https://maps.google.com/?q=Restoran+Elegance+Beograd",
  },
  {
    label: "Svečana ceremonija",
    time: "16:00",
    icon: "civil",
    location: "Restoran Elegance, Beograd",
    mapLink: "https://maps.google.com/?q=Restoran+Elegance+Beograd",
  },
  {
    label: "Čestitanje i fotografisanje",
    time: "16:30",
    icon: "toast",
    location: "Restoran Elegance, Beograd",
    mapLink: "https://maps.google.com/?q=Restoran+Elegance+Beograd",
  },
  {
    label: "Svečani ručak / večera",
    time: "17:30",
    icon: "restaurant",
    location: "Restoran Elegance, Beograd",
    mapLink: "https://maps.google.com/?q=Restoran+Elegance+Beograd",
  },
  {
    label: "Prvi ples",
    time: "20:00",
    icon: "party",
    location: "Restoran Elegance, Beograd",
    mapLink: "https://maps.google.com/?q=Restoran+Elegance+Beograd",
  },
  {
    label: "Torta",
    time: "22:00",
    icon: "cake",
    location: "Restoran Elegance, Beograd",
    mapLink: "https://maps.google.com/?q=Restoran+Elegance+Beograd",
  },
],

    showDressCode: false,
    mapLink: "https://maps.google.com/?q=Restoran+Elegance+Beograd",
    note: "Molimo vas da svoj dolazak potvrdite na vreme.",
  }),
},
{
  slug: "nina-nemanja",
  type: "wedding",
  template: "italian-envelope-video",

  brideName: "Nina",
  groomName: "Nemanja",

  weddingDate: "12.06.2027.",
  weddingTime: "15:30",
  venue: "Villa Jelena, Beograd",

  videoSrc: "/videos/nina-nemanja.mp4",


  details: createDetails({
    welcomeText:
      "Sa velikom radošću vas pozivamo da budete deo našeg posebnog dana.",

    rsvpImage: "/images/italian-rsvp/nina-nemanja-rsvp.jpg",
    rsvpPhotoTitle: "Vidimo se!",

    heroText: "Naš poseban dan",
    showCalendarButton: true,

    date: "12.06.2027.",
    dateISO: "2027-06-12T15:30:00+02:00",

    cloudLeft: "/images/italian-clouds/nina-nemanja-cloud-left.svg",
    cloudRight: "/images/italian-clouds/nina-nemanja-cloud-right.svg",

    events: [
      {
        label: "Okupljanje gostiju",
        time: "15:30",
        icon: "gathering",
        location: "Villa Jelena, Beograd",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Villa+Jelena+Beograd",
      },
      {
        label: "Ceremonija venčanja",
        time: "16:30",
        icon: "civil",
        location: "Bašta restorana Villa Jelena",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Villa+Jelena+Beograd",
      },
      {
        label: "Svečana večera",
        time: "18:00",
        icon: "restaurant",
        location: "Villa Jelena, svečana sala",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Villa+Jelena+Beograd",
      },
      {
        label: "Žurka",
        time: "20:30",
        icon: "party",
        location: "Villa Jelena, Beograd",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Villa+Jelena+Beograd",
      },
    ],

    mapLink: "https://www.google.com/maps/search/?api=1&query=Villa+Jelena+Beograd",

    note: "Molimo vas da svoj dolazak potvrdite do 25. maja.",
  }),
},
{
  slug: "test-silk-date-flow",
  type: "wedding",
  template: "silk-date-flow",

  brideName: "Ivana",
  groomName: "Aleksa",

  videoSrc: "/videos/test-silk-date-flow4.mp4",
  fontMode: "dark",

  weddingDate: "11 AVG 2026",
  weddingTime: "14:30",
  venue: "Restoran Primer, Beograd",



  details: createDetails({
    // fallback / opšta slika
    backgroundImage: "/images/silk-date-flow-bg.jpg",

    // Slika za prvi deo invitation card-a: imena + datum + kalendar
    cardBackground: "/images/date-flow-bg.jpg",

    // Slika za drugi deo: Raspored događaja
    scheduleBackground: "/images/date-flow-schedule-bg.jpg",

    welcomeText:
      "Sa velikom radošću vas pozivamo da budete deo našeg posebnog dana.",

    date: "11 AVG 2026",
    dateISO: "2026-08-11T14:30:00+02:00",

    showCalendarButton: true,

    events: [
      {
        label: "Skup gostiju",
        time: "12:00",
        location: "Restoran Primer, Beograd",
        note: "Vreme prijatnog čekanja uz osveženje i upoznavanje sa drugim gostima.",
        icon: "gathering",
      },
      {
        label: "Ceremonija",
        time: "14:30",
        location: "Restoran Primer, Beograd",
        note: "Vi ćete prisustvovati sklapanju naše veze i naše sreće.",
        icon: "civil",
      },
      {
        label: "Večera",
        time: "17:00",
        location: "Restoran Primer, Beograd",
        note: "Nastavljamo slavlje uz večeru, muziku i lepe trenutke.",
        icon: "restaurant",
      },
    ],

    mapLink: "https://maps.google.com/?q=Beograd",
    note: "Molimo vas da svoj dolazak potvrdite na vreme.",
  }),
},
{
  slug: "nadja-ivan",
  type: "wedding",
  template: "silk",
  script: "cyrillic",

  brideName: "Нађа",
  groomName: "Иван",

  videoSrc: "/videos/nadja-ivan.mp4",


  fontMode: "light",

  weddingDate: "1 АВГ 2026",
  weddingTime: "14:00",
  venue: "Вила Лаванда",

  backgroundImage: "/images/nadja-ivan-minimal.jpg",

  details: createDetails({
    welcomeText:
      "Са радошћу вас позивамо да будете део нашег најлепшег дана и да заједно прославимо почетак нашег новог поглавља.",

    date: "01.08.2026.",
    dateISO: "2026-08-01T14:00:00+02:00",

    venue: "Вила Лаванда",

    showCalendarButton: true,
    calendarDurationHours: 9,

    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Vila+Lavanda",

    showLanguageSwitcher: true,
    defaultLanguage: "sr",
    languages: ["sr", "en"],
    languageLabels: {
      sr: "SR",
      en: "EN",
    },

    translations: {
      en: {
        script: "latin",

        brideName: "Nadja",
        groomName: "Ivan",

        weddingDate: "1 AUG 2026",
        weddingTime: "2:00 PM",
        venue: "Villa Lavanda",

        details: {
          welcomeText:
            "With great joy, we invite you to be part of our most beautiful day and celebrate the beginning of our new chapter together.",

          date: "1 AUG 2026",
          venue: "Villa Lavanda",

          events: [
            {
              label: "Gathering at the bride's family home",
              time: "2:00 PM",
              icon: "gathering",
              location: "Bride's family home",
            },
            {
              label: "Church wedding ceremony",
              time: "4:00 PM",
              icon: "church",
              location: "Church of Saint Nicholas",
              mapLink:
                "https://www.google.com/maps/search/?api=1&query=Church+of+Saint+Nicholas",
            },
            {
              label: "Guest gathering",
              time: "5:30 PM",
              icon: "restaurant",
              location: "Villa Lavanda",
              mapLink:
                "https://www.google.com/maps/search/?api=1&query=Villa+Lavanda",
            },
            {
              label: "Civil wedding ceremony",
              time: "6:30 PM",
              icon: "civil",
              location: "Villa Lavanda",
              mapLink:
                "https://www.google.com/maps/search/?api=1&query=Villa+Lavanda",
            },
            {
              label: "Dinner and celebration",
              time: "7:30 PM",
              icon: "restaurant",
              location: "Villa Lavanda",
              mapLink:
                "https://www.google.com/maps/search/?api=1&query=Villa+Lavanda",
            },
          ],

          mapLink:
            "https://www.google.com/maps/search/?api=1&query=Villa+Lavanda",

          note: "Please confirm your attendance by July 15, 2026.",
          rsvpText: "Please confirm your attendance by July 15, 2026.",
          rsvpDeadline: "15 JUL 2026",
          rsvpDeadlineISO: "2026-07-15",
        },
      },
    },

    events: [
      {
        label: "Скуп код младе",
        time: "14:00",
        icon: "gathering",
        location: "Породична кућа младе",
      },
      {
        label: "Црквено венчање",
        time: "16:00",
        icon: "church",
        location: "Црква Светог Николе",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Crkva+Svetog+Nikole",
      },
      {
        label: "Окупљање гостију",
        time: "17:30",
        icon: "gathering",
        location: "Вила Лаванда",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Vila+Lavanda",
      },
      {
        label: "Грађанско венчање",
        time: "18:30",
        icon: "civil",
        location: "Вила Лаванда",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Vila+Lavanda",
      },
      {
        label: "Вечера и прослава",
        time: "19:30",
        icon: "restaurant",
        location: "Вила Лаванда",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Vila+Lavanda",
      },
    ],

    showDressCode: false,
    dressCodeTitle: "",
    dressCodePalette: [],
    dressCodeNote: "",

    note: "Молимо вас да свој долазак потврдите до 15.07.2026. године.",
    rsvpText: "Молимо вас да свој долазак потврдите до 15.07.2026. године.",
    rsvpDeadline: "15.07.2026.",
    rsvpDeadlineISO: "2026-07-15",
  }),
},

{
  slug: "milica-nemanja-photo",
  type: "wedding",
  template: "silk-photo-script",
  script: "latin",

  brideName: "Milica",
  groomName: "Nemanja",

  // Silk intro
  backgroundImage: "/images/silk-intro.jpg",
  videoSrc: "/videos/milica-nemanja-1.mp4",

  // Muzika — izbriši ako je nećeš
  musicSrc: "/music/wedding-song.mp3",

  weddingDate: "12. septembar 2026.",
  weddingTime: "16:00",
  venue: "Vila Jelena",

  introText:
    "Sa radošću vas pozivamo da budete deo našeg dana.",

  details: {
    script: "latin",

    dateISO: "2026-09-12T16:00:00+02:00",
    dateDisplay: "12.09.2026.",

    // Fotografija u pozadini invitation card-a
    cardBackgroundImage: "/images/invitation-background.jpg",

    // Možeš potpuno da izbrišeš ovu stavku.
    // Tada će automatski biti center.
    cardBackgroundPosition: "center",

    // Fotografija u pozadini RSVP-a i countdown-a
    sectionBackgroundImage: "/images/invitation-background.jpg",
    sectionBackgroundPosition: "center",

    // Srce između imena
    nameConnector: "heart",

    invitationKicker: "Pozivnica za venčanje",

    welcomeText:
      "Sa velikom radošću vas pozivamo da svojim prisustvom ulepšate početak našeg zajedničkog života.",

    events: [
      {
        time: "14:30",
        label: "Crkveno venčanje",
        location: "Hram Svetog Save",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Hram+Svetog+Save",
        icon: "church",
      },
      {
        time: "16:00",
        label: "Okupljanje gostiju",
        location: "Vila Jelena",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Vila+Jelena",
        icon: "gathering",
      },
      {
        time: "17:00",
        label: "Građansko venčanje",
        location: "Vila Jelena",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Vila+Jelena",
        icon: "civil",
      },
      {
        time: "18:00",
        label: "Večera i proslava",
        location: "Vila Jelena",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Vila+Jelena",
        icon: "party",
      },
    ],

    // Donji blok sa glavnom lokacijom
    locationTitle: "Čekamo vas",
    locationPrefix: "na adresi",

    venue: "Vila Jelena",
    venueAddress: "Bulevar venčanja 12, Beograd",

    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Vila+Jelena",

    mapButtonText: "Pogledaj lokaciju",

    // Dress code
    showDressCode: true,
    dressCodeTitle: "Dress code",
    dressCodeNote: "Svečano i elegantno",

    dressCodePalette: [
      "#e8dfd2",
      "#c5ad91",
      "#826d5f",
      "#4f463f",
    ],

    note:
      "Molimo vas da dolazak potvrdite najkasnije do 20. avgusta 2026.",

    // RSVP
    rsvpKicker: "Potvrda dolaska",
    rsvpTitle: "Radujemo se vašem odgovoru",

    rsvpSubtitle:
      "Molimo vas da potvrdite dolazak najkasnije do 20. avgusta.",

    rsvpButtonText: "Pošalji potvrdu",
    rsvpMaxGuests: 10,

    // Postim / ne postim
    showFastingOption: true,

    // Countdown
    countdownKicker: "Odbrojavamo zajedno",
    countdownTitle: "Do našeg dana je ostalo",

    countdownNote:
      "Jedva čekamo da ovaj poseban trenutak podelimo sa vama.",

    countdownFinishedTitle: "Naš dan je stigao",
    countdownFinishedNote: "Vidimo se na proslavi!",

    // Dodavanje događaja u kalendar
    showCalendarButton: true,
    calendarButtonText: "Dodaj u kalendar",

    calendarHint:
      "Sačuvajte datum venčanja u svom telefonu.",

theme: {
  backgroundColor: "#e9e2d8",

  // Osnovni tekst
  mainText: "#5b514a",
  softText: "#786c64",
  mutedText: "#978a80",

  // Imena, srce, vremena i detalji
  accent: "#c2a078",
  accentStrong: "#916842",

  onAccent: "#fffaf3",

  locationSoftText: "#916842",

  // Providna kartica
 cardPaper: "rgba(255, 255, 255, 0.30)",
  cardBorder: "rgba(113, 91, 74, 0.22)",
  cardInnerBorder: "rgba(113, 91, 74, 0.15)",
  cardShadow: "rgba(55, 43, 35, 0.14)",

  // Filter preko fotografije
  cardPhotoOverlay: "rgba(245, 240, 233, 0.01)",
  cardPhotoOverlayBottom: "rgba(245, 237, 229, 0.30)",

  // RSVP i countdown
  sectionOverlay: "rgba(255, 255, 255, 0.30)",
  cardBg: "rgba(255, 252, 247, 0.48)",
  inputBg: "rgba(255, 253, 249, 0.62)",

  rsvpButtonText: "#fffaf3",
},
  },
},
{
  slug: "marko-rodjendan",
  type: "birthday",
  template: "birthday-glass-luxury",

  brideName: "Marko",

  weddingDate: "12.09.2026.",
  weddingTime: "19:00",
  venue: "Lumière Event Center",

  backgroundImage: "/images/birthday-glass-bg.jpg",
  introBackgroundImage: "/images/birthday-glass-intro.jpg",
  musicSrc: "/music/marko-18.mp3",
  uploadCoverImage: "/images/upload/birthday-glass-upload.jpg",

  details: createDetails({
    age: 18,

    welcomeText:
      "Pozivamo vas da zajedno proslavimo Markov 18. rođendan.",

    date: "12.09.2026.",
    dateISO: "2026-09-12T19:00:00+02:00",

    rsvpSignature: "Marko",

    venue: "Lumière Event Center",
    locationName: "Lumière Event Center",
    locationAddress: "Beograd",

    mapLink:
      "https://maps.google.com/?q=Lumiere+Event+Center+Beograd",

    note: "Molimo vas da potvrdite dolazak do 01.09.",
    rsvpDeadline: "01.09.2026.",

    showCalendarButton: true,

    showDressCode: false,
    dressCodeTitle: "Dress code",
    dressCodePalette: ["#050403", "#d8aa68", "#f6ead4", "#17311f"],
    dressCodeNote:
      "Elegantne kombinacije u tamnim i zlatnim tonovima su dobrodošle.",
  }),
},

{
  slug: "masa-1",
  type: "birthday",
  template: "birthday-eva",
  script: "latin",

  brideName: "Maša",
  title: "Prvi rođendan",

  videoSrc: "/videos/eva-1.mp4",

  weddingDate: "6. septembar 2026.",
  weddingTime: "16:00",
  venue: "Vila Jelena",

  musicSrc: "/music/eva-1.mp3",

  introPreviewImage: "/images/masa/masa-intro-bg.png",
  babyImage: "/images/masa/masa-bear.svg",
  introText: "slavi svoj prvi rođendan",

  backgroundImage: "/images/eva/eva-bg.png",

  details: createDetails({
    welcomeText: "Radujemo se vašem dolasku!",

    date: "6. septembar 2026.",
    dateISO: "2026-09-06T16:00:00+02:00",

    venue: "Vila Jelena",

    note: "Molimo vas da dolazak potvrdite do 25. avgusta.",
    rsvpText: "Molimo vas da dolazak potvrdite do 25. avgusta.",

    showCalendarButton: false,
    calendarDurationHours: 4,
  }),
},
{
  slug: "jovan-1",
  type: "birthday",
  template: "birthday-eva",
  script: "latin",

  brideName: "Jovan",
  title: "Prvi rođendan",

  videoSrc: "/videos/vuk-1.mp4",

  weddingDate: "20. septembar 2026.",
  weddingTime: "17:00",
  venue: "Sala Garden",

  musicSrc: "/music/eva-1.mp3",

  introPreviewImage: "/images/jovan/jovan-intro-bg.png",
  babyImage: "/images/jovan/jovan-bear.svg",
  introText: "slavi svoj prvi rođendan",

    backgroundImage: "/images/eva/eva-bg.png",

  details: createDetails({
    welcomeText: "Radujemo se vašem dolasku!",

    date: "20. septembar 2026.",
    dateISO: "2026-09-20T17:00:00+02:00",

    venue: "Sala Garden",

    note: "Molimo vas da dolazak potvrdite do 10. septembra.",
    rsvpText:
      "Molimo vas da dolazak potvrdite do 10. septembra.",

    showCalendarButton: false,
    calendarDurationHours: 4,
  }),
},

{
  slug: "sofija-nikola",
  type: "wedding",
  template: "silk-photo-script",
  script: "latin",

  brideName: "Sofija",
  groomName: "Nikola",

  // Silk intro
  backgroundImage: "/images/silk-intro.jpg",
  videoSrc: "/videos/sofija-andrej.mp4",

  // Muzika
  musicSrc: "/music/sofija-andrej.mp3",

  weddingDate: "10. oktobar 2026.",
  weddingTime: "16:30",
  venue: "Vila Aleksandar, Beograd",

  introText:
    "Sa radošću vas pozivamo da zajedno sa nama proslavite početak našeg zajedničkog života.",

  details: {
    script: "latin",

    dateISO: "2026-10-10T16:30:00+02:00",
    dateDisplay: "10.10.2026.",

    // Fotografija u pozadini invitation card-a
    cardBackgroundImage:
      "/images/sofija-andrej-invitation.jpg",
    cardBackgroundPosition: "center",

    // Fotografija u pozadini RSVP-a i countdown-a
    sectionBackgroundImage:
      "/images/sofija-andrej-invitation.jpg",
    sectionBackgroundPosition: "center",

    // Srce između imena
    nameConnector: "heart",

    invitationKicker: "Pozivnica za venčanje",

    welcomeText:
      "Sa velikom radošću vas pozivamo da svojim prisustvom uveličate naš poseban dan i budete deo uspomena koje ćemo zauvek čuvati.",

    events: [
      {
        time: "15:00",
        label: "Crkveno venčanje",
        location: "Hram Svetog Aleksandra Nevskog, Beograd",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Hram+Svetog+Aleksandra+Nevskog+Beograd",
        icon: "church",
      },
      {
        time: "16:30",
        label: "Okupljanje gostiju",
        location: "Vila Aleksandar, Beograd",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Vila+Aleksandar+Beograd",
        icon: "gathering",
      },
      {
        time: "17:30",
        label: "Građansko venčanje",
        location: "Vila Aleksandar, Beograd",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Vila+Aleksandar+Beograd",
        icon: "civil",
      },
      {
        time: "18:00",
        label: "Večera i proslava",
        location: "Vila Aleksandar, Beograd",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Vila+Aleksandar+Beograd",
        icon: "party",
      },
    ],

    // Donji blok sa glavnom lokacijom
    locationTitle: "Čekamo vas",
    locationPrefix: "na adresi",

    venue: "Vila Aleksandar",
    venueAddress: "Beograd",

    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Vila+Aleksandar+Beograd",

    mapButtonText: "Pogledaj lokaciju",

    // Bez dress code-a
    showDressCode: false,

    note:
      "Molimo vas da dolazak potvrdite najkasnije do 20. septembra 2026.",

    // RSVP
    rsvpKicker: "Potvrda dolaska",
    rsvpTitle: "Radujemo se vašem odgovoru",

    rsvpSubtitle:
      "Molimo vas da potvrdite dolazak najkasnije do 20. septembra.",

    rsvpButtonText: "Pošalji potvrdu",
    rsvpMaxGuests: 10,

    showFastingOption: true,

    // Countdown
    countdownKicker: "Odbrojavamo zajedno",
    countdownTitle: "Do našeg dana je ostalo",

    countdownNote:
      "Jedva čekamo da ovaj poseban dan podelimo sa vama.",

    countdownFinishedTitle: "Naš dan je stigao",
    countdownFinishedNote: "Vidimo se na proslavi!",

    showCalendarButton: false,

    theme: {
      // Topla ivory pozadina
      backgroundColor: "#f3eeea",

      // Tekst — gotovo sve u istoj toploj tamnoj nijansi
      mainText: "#443839",
      softText: "#69595b",
      mutedText: "#8a797b",

      // Glavna bordo boja
      accent: "#741f35",
      accentStrong: "#541525",

      onAccent: "#fffaf7",

      locationSoftText: "#741f35",

      // Kartica
      cardPaper: "rgba(255, 252, 249, 0.3)",
      cardBorder: "rgba(84, 21, 37, 0.20)",
      cardInnerBorder: "rgba(84, 21, 37, 0.12)",
      cardShadow: "rgba(48, 31, 35, 0.16)",

      // Fotografija — vrlo blag bordo/ivory filter
      cardPhotoOverlay:
        "rgba(255, 249, 246, 0.03)",

      cardPhotoOverlayBottom:
        "rgba(92, 34, 48, 0.16)",

      // RSVP + countdown
      sectionOverlay:
        "rgba(248, 242, 239, 0.34)",

      cardBg:
        "rgba(255, 252, 250, 0.54)",

      inputBg:
        "rgba(255, 253, 251, 0.2)",

      // Dugme
      rsvpButtonText: "#fffaf7",
    },
  },
},

// =========================
// Klijenti
// =========================
{
  slug: "dijana-stefan",
  type: "wedding",
  template: "video-band",
  brideName: "Dijana",
  groomName: "Stefan",
  videoSrc: "/videos/dijana-stefan1.mp4",
  musicSrc: "/music/dijana-stefan.mp3",
  weddingDate: "16 OKT 2026",
  weddingTime: "16:00",

  details: createDetails({
    welcomeText:
      "Biće nam veliko zadovoljstvo da ovaj poseban dan podelimo sa vama.",

    date: "16 OKT 2026",
    dateISO: "2026-10-16T16:00:00",
    rsvpDeadline: "20 SEP 2026",

    events: [
      {
        label: "Skup svatova kod mladoženje",
        time: "10:00",
        location: "Dom porodice Vukša, Borča",
      },
      {
        label: "Skup svatova kod mlade",
        time: "11:00",
        location: "Dom porodice Zarić, Krnjača",
      },
      {
        label: "Crkveno venčanje",
        time: "15:00",
        location: "Crkva Sveta Petka, put za Ovču",
        mapLink: "https://maps.google.com/?q=Crkva+Sveta+Petka,+put+za+Ovču",
      },
      {
        label: "Skup gostiju",
        time: "16:00",
        location: "Sala Anđelina, put za Ovču",
        mapLink: "https://www.google.com/maps/place/Sve%C4%8Dana+sala+%22An%C4%91elina%22/@44.882065,20.4690897,17z/data=!3m1!4b1!4m6!3m5!1s0x475a6300269fa3d3:0xab5b9f3580141e95!8m2!3d44.882065!4d20.4716646!16s%2Fg%2F11lmdpxcmw?entry=ttu&g_ep=EgoyMDI2MDMzMS4wIKXMDSoASAFQAw%3D%3D",
      },
      {
        label: "Građansko venčanje",
        time: "17:00",
        location: "Sala Anđelina, put za Ovču",
      },
    ],

    venue: "Sala Anđelina, put za Ovču",
    churchVenue: "Crkva Sveta Petka, put za Ovču",
     mapLink: "https://maps.google.com/?q=Sala+Anđelina,+Put+za+Ovču+43",
    note: "Molimo vas da svoj dolazak potvrdite do 20. Septembra",
  }),
},
{
  slug: "olja-milos",
  type: "wedding",
  template: "floral",
  brideName: "Olja",
  groomName: "Miloš",
  backgroundImage: "/images/floral-olja-milos.jpg",
   musicSrc: "/music/olja-milos.mp3",
  weddingDate: "20 JUN 2026",
  weddingTime: "17:00",
  venue: "Restoran Rajska Oaza, Kikinda",
  details: createDetails({
    welcomeText:
      "Radujemo se što ćemo najlepše trenutke našeg dana podeliti sa vama.",

    dateISO: "2026-06-20T17:00:00+02:00",

    rsvpOptions: {
      foodPreferences: true,
      musicWish: true,
    },

    events: [
      {
        label: "Skup svatova",
        time: "16:00",
        icon: "gathering",
        location: "Restoran Rajska Oaza, Kikinda",
        mapLink:
          "https://www.google.com/maps/place/Restoran+Rajska+Oaza/@45.8275364,20.4657951,17z/data=!4m6!3m5!1s0x4744df37a886741d:0xf966c38263c7e815!8m2!3d45.8274211!4d20.4659445!16s%2Fg%2F11pf38k3lq?entry=ttu&g_ep=EgoyMDI2MDQwMS4wIKXMDSoASAFQAw%3D%3D",
      },
      {
        label: "Građansko venčanje",
        time: "17:00",
        icon: "civil",
        location: "Restoran Rajska Oaza, Kikinda",
        mapLink:
          "https://www.google.com/maps/place/Restoran+Rajska+Oaza/@45.8275364,20.4657951,17z/data=!4m6!3m5!1s0x4744df37a886741d:0xf966c38263c7e815!8m2!3d45.8274211!4d20.4659445!16s%2Fg%2F11pf38k3lq?entry=ttu&g_ep=EgoyMDI2MDQwMS4wIKXMDSoASAFQAw%3D%3D",
      },
      {
     label: "Večera i slavlje",
   
    icon: "party",
    note: "Nakon ceremonije nastavljamo sa večerom, muzikom i proslavom.",
    location: "Restoran Rajska Oaza, Kikinda",
        mapLink:
          "https://www.google.com/maps/place/Restoran+Rajska+Oaza/@45.8275364,20.4657951,17z/data=!4m6!3m5!1s0x4744df37a886741d:0xf966c38263c7e815!8m2!3d45.8274211!4d20.4659445!16s%2Fg%2F11pf38k3lq?entry=ttu&g_ep=EgoyMDI2MDQwMS4wIKXMDSoASAFQAw%3D%3D",
      },
    ],

 showDressCode: true,
dressCodeTitle: "Dress code",
dressCodeNote:
  "Slobodno birajte boje po želji, uz molbu da izbegnete belu i potpuno crne kombinacije.",
dressCodePalette: [],
    mapLink:
      "https://www.google.com/maps/place/Restoran+Rajska+Oaza/@45.8275364,20.4657951,17z/data=!4m6!3m5!1s0x4744df37a886741d:0xf966c38263c7e815!8m2!3d45.8274211!4d20.4659445!16s%2Fg%2F11pf38k3lq?entry=ttu&g_ep=EgoyMDI2MDQwMS4wIKXMDSoASAFQAw%3D%3D",
    note: "Molimo vas da svoj dolazak potvrdite do 30. maja.",
  }),
},


  {
  slug: "aleksandra-aleksej",
  type: "wedding",
  template: "split-video",
  brideName: "Aleksandra",
  groomName: "Aleksej",
  videoSrc: "/videos/aleksandra-aleksej5.mp4",
   musicSrc: "/music/aleksandra-aleksej.mp3",
     uploadCoverImage: "/images/upload/aleksandra-aleksej-upload.jpg",
  weddingDate: "17 OKT 2026",
  weddingTime: "17:00",
 venue: "Bečej",
 
  introText: "Radujemo se da ovaj dan podelimo sa vama.",
  details: createDetails({
    backgroundImage: "/images/aleksandra-aleksej-split.jpg",
    welcomeText:
      "Biće nam veliko zadovoljstvo da svojim prisustvom ulepšate naš poseban dan.",
    date: "17 OKT 2026",
    dateISO: "2026-10-17T17:00:00+02:00",

    events: [
      {
        label: "Crkveno venčanje",
        time: "14:30",
        location: "Srpska pravoslavna crkva Svetog Đorđa, Bečej",
        mapLink: "https://www.google.com/maps/place/%D0%A6%D1%80%D0%BA%D0%B2%D0%B0+%D0%A1%D0%B2%D0%B5%D1%82%D0%BE%D0%B3+%D0%92%D0%B5%D0%BB%D0%B8%D0%BA%D0%BE%D0%BC%D1%83%D1%87%D0%B5%D0%BD%D0%B8%D0%BA%D0%B0+%D0%93%D0%B5%D0%BE%D1%80%D0%B3%D0%B8%D1%98%D0%B0+%D0%91%D0%B5%D1%87%D0%B5%D1%98/@45.6149232,20.047257,17z/data=!3m1!4b1!4m6!3m5!1s0x475b33006a2a744b:0xe5a4d8f6bbc9e249!8m2!3d45.6149232!4d20.0498319!16s%2Fg%2F155qnvzp?entry=ttu&g_ep=EgoyMDI2MDQwNi4wIKXMDSoASAFQAw%3D%3D",
        note: "Svečani čin crkvenog venčanja.",
      },
      {
        label: "Skup svatova",
        time: "16:00",
        location: "Hotel Tiski Cvet, Novi Bečej",
        mapLink: "https://www.google.com/maps/place/%D0%A2%D0%B8%D1%81%D0%BA%D0%B8+%D1%86%D0%B2%D0%B5%D1%82/@45.5942253,20.132972,17z/data=!3m1!4b1!4m9!3m8!1s0x475b2d9034f0ae43:0xea48bcb4e8be3019!5m2!4m1!1i2!8m2!3d45.5942253!4d20.132972!16s%2Fg%2F1tqpy0mn?entry=ttu&g_ep=EgoyMDI2MDQwNi4wIKXMDSoASAFQAw%3D%3D",
        note: "Početak okupljanja i dragi susreti pre ceremonije."
      },
    
    
    ],
theme: {
  mainText: "#7b1234",
  softText: "#243b6b",
  scriptText: "#7b1234",
  mutedText: "#7b1234",

  accent: "#7b1234",
  accentStrong: "#243b6b",
  buttonText: "#ffffff",

  cardBg: "rgba(255,255,255,0.28)",
  cardBorder: "transparent",
  frameBorder: "rgba(123,18,52,0.20)",

  paperOverlayTop: "rgba(255,255,255,0.03)",
paperOverlayBottom: "rgba(36,59,107,0.06)",
  vignetteColor: "rgba(123,18,52,0.08)",

  flowLine: "#7b1234",
  dividerLine: "rgba(123,18,52,0.25)",
  nodeRing: "rgba(181,144,59,0.16)",
backgroundColor: "#f3ece6",
  /* INTRO */
  introMainText:"#7b1234",
  introAccent: "#7b1234",
  introButtonBg: "rgba(255,255,255,0.18)",
  introButtonBorder: "rgba(255,255,255,0.35)",
  introButtonText: "#7b1234",
  introButtonHoverBg: "rgba(255,255,255,0.28)",

  /* RSVP */
  rsvpButtonBg: "#7b1234",
  rsvpButtonText: "#ffffff",
},
 showDressCode: true,
  venue: "Novi Bečej",
  dressCodeTitle: "Dress code",
  dressCodePalette: [],
  dressCodeNote:
    "Slobodno birajte boje po želji, uz molbu da izbegnete belu.",
  mapLink: "https://www.google.com/maps/place/%D0%A2%D0%B8%D1%81%D0%BA%D0%B8+%D1%86%D0%B2%D0%B5%D1%82/@45.5942253,20.132972,17z/data=!3m1!4b1!4m9!3m8!1s0x475b2d9034f0ae43:0xea48bcb4e8be3019!5m2!4m1!1i2!8m2!3d45.5942253!4d20.132972!16s%2Fg%2F1tqpy0mn?entry=ttu&g_ep=EgoyMDI2MDQwNi4wIKXMDSoASAFQAw%3D%3D",
  note: "Molimo vas da svoj dolazak potvrdite do 26. septembra.",
  }),
},
{
  slug: "adrijana-aleksandar",
  type: "wedding",
  template: "photo-script",

  brideName: "Adrijana",
  groomName: "Aleksandar",
  videoSrc: "/videos/wedding-fixed.mp4",
  musicSrc: "/music/adrijana-aleksandar.mp3",
  weddingDate: "11 JUL 2026",
  weddingTime: "16:00",
  venue: "Niš",

  details: createDetails({
    welcomeText: "Radujemo se da ovaj dan podelimo sa vama.",

    date: "11 JUL 2026",
    dateISO: "2026-07-11T19:00:00+02:00",

    editorialImage1: "/images/adrijana-aleksandar.jpg",

    events: [
        {
        label: "Građansko venčanje",
        time: "16:00",
        icon: "civil",
        location: "Crystal Light, Niš",
        mapLink: "https://www.google.com/maps/place/Hotel+Crystal+Light/data=!4m2!3m1!1s0x0:0x1d9ede331e21ad6f?sa=X&ved=1t:2428&ictx=111",
      },
      {
        label: "Početak proslave",
        time: "16:30",
        icon: "gathering",
        location: "Crystal Light, Niš",
        mapLink: "https://www.google.com/maps/place/Hotel+Crystal+Light/data=!4m2!3m1!1s0x0:0x1d9ede331e21ad6f?sa=X&ved=1t:2428&ictx=111",
      },
    
    ],

    showDressCode: true,
    dressCodeTitle: "Dress code",
    dressCodeNote:
      "Svečano i elegantno, u stilu koji vam najviše prija.",
    dressCodePalette: [],

    note: "",
  }),
},
{
  slug: "masa-nikola",
  type: "wedding",
  template: "photo-card",
  brideName: "Maša",
  groomName: "Nikola",
  image: "/images/masa-nikola-photocard.jpg",
  backgroundImage: "/images/masa-nikola-photocard-bg.jpg",
   uploadCoverImage: "/images/upload/masa-nikola-photocard.jpg",
   
  weddingDate: "06 SEP 2026",
  weddingTime: "16:30",
  details: createDetails({
     imageShape: "vertical", // 👈 OVO
    welcomeText:
      "Sa velikom radošću vas pozivamo da budete deo našeg posebnog dana.",
venue: "Restoran Srpski dvor otvorena sala, Rušanj",
    date: "06 SEP 2026",
    dateISO: "2026-09-06T16:30:00+02:00",

    events: [
         {
        label: "Crkveno venčanje",
        time: "14:00",
        icon: "church",
        location: "Crkva Svetog Luke",
        mapLink: "https://www.google.com/maps?q=Orthodox+Church+of+St.+Luke+the+Apostle,+Kneza+Vi%C5%A1eslava+100,+Beograd&ftid=0x475a71ea9fb4c97f:0xeec28c0c6bbe6268&entry=gps&shh=CAE&lucs=,94297699,100795625,94284454,94231188,94280568,47071704,94218641,94282134,94286869&g_ep=CAISEjI2LjE0LjAuODkxOTAzMTgwMBgAINeCAypSLDk0Mjk3Njk5LDEwMDc5NTYyNSw5NDI4NDQ1NCw5NDIzMTE4OCw5NDI4MDU2OCw0NzA3MTcwNCw5NDIxODY0MSw5NDI4MjEzNCw5NDI4Njg2OUICUlM%3D&skid=02ce878b-ce2e-4e16-b2c4-ed151262d881&g_st=iw",
      },
      {
        label: "Skup gostiju",
        time: "15:30",
        icon: "gathering",
        location: "Restoran Srpski dvor otvorena sala, Rušanj",
        mapLink: "https://www.google.com/maps/place/%D0%A0%D0%B5%D1%81%D1%82%D0%BE%D1%80%D0%B0%D0%BD+%D0%A1%D1%80%D0%BF%D1%81%D0%BA%D0%B8+%D0%B4%D0%B2%D0%BE%D1%80/@44.6838824,20.4254496,17z/data=!4m14!1m7!3m6!1s0x475a731a9eef208d:0x82bd697a69e9962c!2z0KDQtdGB0YLQvtGA0LDQvSDQodGA0L_RgdC60Lgg0LTQstC-0YA!8m2!3d44.6838824!4d20.4280245!16s%2Fg%2F1q5bmp24z!3m5!1s0x475a731a9eef208d:0x82bd697a69e9962c!8m2!3d44.6838824!4d20.4280245!16s%2Fg%2F1q5bmp24z!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDQwNi4wIKXMDSoASAFQAw%3D%3D",
      },
     
    
      {
        label: "Građansko venčanje",
        time: "16:30",
        icon: "restaurant",
        location: "Restoran Srpski dvor otvorena sala, Rušanj",
        mapLink: "https://www.google.com/maps/place/%D0%A0%D0%B5%D1%81%D1%82%D0%BE%D1%80%D0%B0%D0%BD+%D0%A1%D1%80%D0%BF%D1%81%D0%BA%D0%B8+%D0%B4%D0%B2%D0%BE%D1%80/@44.6838824,20.4254496,17z/data=!4m14!1m7!3m6!1s0x475a731a9eef208d:0x82bd697a69e9962c!2z0KDQtdGB0YLQvtGA0LDQvSDQodGA0L_RgdC60Lgg0LTQstC-0YA!8m2!3d44.6838824!4d20.4280245!16s%2Fg%2F1q5bmp24z!3m5!1s0x475a731a9eef208d:0x82bd697a69e9962c!8m2!3d44.6838824!4d20.4280245!16s%2Fg%2F1q5bmp24z!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDQwNi4wIKXMDSoASAFQAw%3D%3D",
      },
     
    ],

    
showDressCode: false,
dressCodeTitle: "Dress code",
dressCodeNote:
  "Elegantne kombinacije u tonovima iz palete (crna, bordo, maslinasta i zemljani tonovi) su dobrodošle.",

    mapLink:  "https://www.google.com/maps/place/%D0%A0%D0%B5%D1%81%D1%82%D0%BE%D1%80%D0%B0%D0%BD+%D0%A1%D1%80%D0%BF%D1%81%D0%BA%D0%B8+%D0%B4%D0%B2%D0%BE%D1%80/@44.6838824,20.4254496,17z/data=!4m14!1m7!3m6!1s0x475a731a9eef208d:0x82bd697a69e9962c!2z0KDQtdGB0YLQvtGA0LDQvSDQodGA0L_RgdC60Lgg0LTQstC-0YA!8m2!3d44.6838824!4d20.4280245!16s%2Fg%2F1q5bmp24z!3m5!1s0x475a731a9eef208d:0x82bd697a69e9962c!8m2!3d44.6838824!4d20.4280245!16s%2Fg%2F1q5bmp24z!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDQwNi4wIKXMDSoASAFQAw%3D%3D",
    note: "Molimo vas da svoj dolazak potvrdite do 23. avgusta.",
  }),
},
{
  slug: "milica-aleksandar",
  type: "wedding",
  template: "photo-script",

  brideName: "Milica",
  groomName: "Aleksandar",
  videoSrc: "/videos/milica-aleksandar1.mp4",
  musicSrc: "/music/milica-aleksandar.mp3",
  weddingDate: "30 MAJ 2026",
  weddingTime: "16:30",
  

  details: createDetails({
  welcomeText: "Radujemo se da ovaj dan podelimo sa vama.",

  date: "30 MAJ 2026",
  dateISO: "2026-05-30T16:30:00+02:00",

  editorialImage1: "/images/milica-aleksandar.jpg",

  showLocationButton: true,
  locationButtonText: "Pogledaj lokaciju",
  locationButtonLink: "https://www.google.com/maps/place/Hotel+Euforija,+Obilazni+put+BB,+Majur/data=!4m2!3m1!1s0x475bcbb440cbc269:0x844f650670df7b7d?sa=X&ved=1t:242&ictx=111",

  events: [
    {
      label: "Skup svatova",
      time: "10:00",
      icon: "gathering",
      location: "Porodična kuća",
      
    },
    {
      label: "Crkveno venčanje",
      time: "15:30",
      icon: "gathering",
      location: "Hram Svete Trojice, Letnjikovac",
      mapLink: "https://www.google.com/maps/place/Church+of+the+Holy+Trinity/data=!4m2!3m1!1s0x0:0xb63c516e0e4822d9?sa=X&ved=1t:2428&ictx=111",
    },
    {
      label: "Okupljanje gostiju",
      time: "16:30",
      icon: "civil",
      location: "Hotel Euforija, Obilazni put BB, Majur",
      mapLink: "https://www.google.com/maps/place/Hotel+Euforija,+Obilazni+put+BB,+Majur/data=!4m2!3m1!1s0x475bcbb440cbc269:0x844f650670df7b7d?sa=X&ved=1t:242&ictx=111",
    },
  ],

  showDressCode: false,
  dressCodeTitle: "Dress code",
  dressCodeNote: "Svečano i elegantno, u stilu koji vam najviše prija.",
  dressCodePalette: [],
  note: "Molimo vas da svoj dolazak potvrdite do 15. maja.",

  theme: {
    introMainText: "#7a7f46",
    introAccent: "#5f633a",

    cardAccent: "#5f633a",
    cardTextMain: "rgba(255,255,255,0.84)",
    cardTextSoft: "rgba(255,255,255,0.72)",
    cardTextMuted: "rgba(255,255,255,0.66)",

    rsvpDividerAccent: "#5f633a",
    rsvpChoiceActiveBorder: "#5f633a",
    rsvpInputBorderFocus: "#5f633a",
    rsvpConfettiAccent: "#5f633a",

    rsvpButtonBorder: "rgba(95,99,58,0.34)",
    rsvpButtonBg: "linear-gradient(180deg, #6f7442, #5f633a)",
    rsvpButtonText: "#fffdf7",
  locationButtonBg: "rgba(95,99,58,0.18)",
  locationButtonBorder: "rgba(95,99,58,0.34)",
  locationButtonTextColor: "#f5f1e8",
    countdownDividerTop: "#5f633a",
    nameFont: '"Tangerine", cursive',
    scriptFont: '"Cormorant Garamond", serif',
  },
}),},



{
  slug: "aleksandra-marko-6",
  type: "wedding",
  template: "silk",
  script: "cyrillic",

  brideName: "Александра",
  groomName: "Марко",

 
  musicSrc: "/music/aleksandra-marko.mp3",

  videoSrc: "/videos/aleksandra-marko-4.mp4",
  fontMode: "light",

  weddingDate: "20 СЕП 2026",
  weddingTime: "11:00",
  venue: "Jet Set Lux, Нова Пазова",

  backgroundImage: "/images/aleksandra-marko-4.jpg",

  details: createDetails({
    welcomeText:
      "Биће нам изузетно драго да својим присуством улепшате наш посебан дан.",

    date: "20 СЕП 2026",
    dateISO: "2026-09-20T11:00:00+02:00",

    events: [
      {
        label: "Дочек сватова",
        time: "11:00",
        icon: "guest",
        location: "Породица Шарац",
      },
      {
        label: "Црквено венчање",
        time: "14:00",
        icon: "rings",
        location: "Храм Рођења Пресвете Богородице, Батајница",
        mapLink:
          "https://maps.google.com/?q=Hram+Rodjenja+Presvete+Bogorodice+Batajnica",
      },
      {
        label: "Ресторан",
        time: "15:00",
        icon: "dinner",
        location: "Jet Set Lux, Пионирска 12, Нова Пазова",
        mapLink:
          "https://maps.google.com/?q=Jet+Set+Lux+Pionirska+12+Nova+Pazova",
      },
    ],

    showDressCode: false,

    mapLink:
      "https://maps.google.com/?q=Jet+Set+Lux+Pionirska+12+Nova+Pazova",

    note: "Молимо вас да свој долазак потврдите до 1. септембра 2026.",
  }),
},
{
  slug: "marija-milan",
  type: "wedding",
  template: "envelope-split-v2",

  brideName: "Marija",
  groomName: "Milan",

  weddingDate: "15 AVG 2026",
  weddingTime: "15:30",
  venue: "Talas Resort",
 musicSrc: "/music/marija-milan.mp3",
  backgroundImage: "/images/floral-marija-milan.jpg",
uploadCoverImage: "/images/upload/birthday-glass-upload.jpg",

  details: createDetails({
    welcomeText:
      "Radujemo se što ćemo najlepše trenutke našeg dana podeliti sa vama.",
showCalendarButton: true,
    date: "15 AVG 2026",
    dateISO: "2026-08-15T15:30:00+02:00",

    events: [
      {
        label: "Okupljanje gostiju",
        time: "15:30",
        icon: "gathering",
        location: "Talas Resort, Kraljevo",
        mapLink: "https://www.google.com/maps/search/?api=1&query=Talas+Resort",
      },
      {
        label: "Građansko venčanje",
        time: "16:30",
        icon: "civil",
        location: "Talas Resort, Kraljevo",
        mapLink: "https://www.google.com/maps/search/?api=1&query=Talas+Resort",
      },
    ],

 showDressCode: true,
dressCodeTitle: "Dress code",
dressCodeNote:
  "Bez pravila za boje — po Vašoj želji.",
dressCodePalette: [],

    mapLink: "https://www.google.com/maps/search/?api=1&query=Talas+Resort",
    note: "Molimo vas da svoj dolazak potvrdite do 25. jula.",
  }),
},
{
  slug: "stefana-stefan",
  type: "wedding",
  template: "angel",

  brideName: "Stefana",
  groomName: "Stefan",
  image: "/images/angel/stefana-stefan.jpg",
  weddingDate: "25 JUL 2026",
  weddingTime: "13:30",
  venue: "Manastir Svetog Nikole, Vranje",
musicSrc: "/music/stefana-stefan.mp3",
  details: createDetails({
    welcomeText: "Sa radošću vas pozivamo da zajedno proslavimo naš dan.",

    date: "25 JUL 2026",
    dateISO: "2026-07-25T13:30:00+02:00",

    venue: "Manastir Svetog Nikole, Vranje",
    mapLink: "https://www.google.com/maps/place/St.+Nicholas+church,+Vranje/data=!4m2!3m1!1s0x1355202930267b4d:0xb4c2b186dc6c0bde?sa=X&ved=1t:155783&hl=hr-rs&ictx=111",

    showCalendarButton: true,

    showDressCode: false,

    rsvpDeadline: "10.07.2026",
    rsvpDeadlineISO: "2026-07-10",

    events: [
      {
        label: "Crkveno venčanje",
        time: "13:30",
        location: "Manastir Svetog Nikole, Vranje",
        mapLink: "https://www.google.com/maps/place/St.+Nicholas+church,+Vranje/data=!4m2!3m1!1s0x1355202930267b4d:0xb4c2b186dc6c0bde?sa=X&ved=1t:155783&hl=hr-rs&ictx=111",
        icon: "church",
      },
      {
        label: "Skup svatova",
        time: "15:30",
        location: "Hotel Vojvoda Putnik",
        mapLink: "https://www.google.com/maps/place/hotel+vojvoda+putnik/data=!4m2!3m1!1s0x13551f1fdd0ece71:0x34c6aa0a4b47a2b2?sa=X&ved=1t:242&hl=hr-rs&ictx=111&cshid=1778228499663687",
        icon: "restaurant",
      },
      {
        label: "Građansko venčanje",
        time: "17:00",
        location: "Hotel Vojvoda Putnik",
        mapLink: "https://www.google.com/maps/place/hotel+vojvoda+putnik/data=!4m2!3m1!1s0x13551f1fdd0ece71:0x34c6aa0a4b47a2b2?sa=X&ved=1t:242&hl=hr-rs&ictx=111&cshid=1778228499663687",
        icon: "civil",
      },
    ],

    note: "Molimo vas da potvrdite dolazak do 10.07.2026.",
  }),
},
{
  slug: "anabela-marko",
  template: "envelope-side-split-v2",

  brideName: "Anabela",
  groomName: "Marko",

  weddingDate: "12.09.2026.",
  weddingTime: "13H",
  venue: "Crkva Sveta Petka",

  musicSrc: "/music/anabela-marko.mp3",

  backgroundImage: "/images/cards/envelope-side-split-v2-paper.jpg",

  details: {
    cardBackgroundImage: "/images/cards/envelope-side-split-v2-paper.jpg",

    invitationText:
      "POZIVAMO VAS DA SVOJIM\nPRISUSTVOM ULEPŠATE NAŠE SLAVLJE",

    city: "NIŠ",
    date: "12.09.2026.",

    events: [
      {
        time: "13H",
        location: "CRKVA SVETA PETKA",
        icon: "church",
        mapLink:
          "https://www.google.com/maps/place/%D0%A1%D1%80%D0%BF%D1%81%D0%BA%D0%B0+%D0%BF%D1%80%D0%B0%D0%B2%D0%BE%D1%81%D0%BB%D0%B0%D0%B2%D0%BD%D0%B0+%D1%86%D1%80%D0%BA%D0%B2%D0%B0+%D0%A1%D0%B2%D0%B5%D1%82%D0%B5+%D0%9F%D0%B5%D1%82%D0%BA%D0%B5/@43.3153621,21.8756639,17z/data=!3m1!4b1!4m6!3m5!1s0x4755b753dfd02833:0xcb64df33c744cf05!8m2!3d43.3153621!4d21.8782388!16s%2Fg%2F11fzb1rkxl?entry=ttu&g_ep=EgoyMDI2MDUwNi4wIKXMDSoASAFQAw%3D%3D",
      },
      {
        time: "17H",
        location: "DAMI RESORT (PROSEK)",
        icon: "rings",
        mapLink:
          "https://www.google.com/maps?sca_esv=828ada9278fc7429&output=search&q=dami+resort+nis&source=lnms&fbs=ADc_l-aN0CWEZBOHjofHoaMMDiKpaEWjvZ2Py1XXV8d8KvlI3j2nXl-YQ05KjnWz5SrU93HEjYyChsjChlPh8hoCFXOKGKdIkdWV9Y1jIT6MO4-1nGlfchNIc5D-klC_exTOWrKKe_kCTVhWhBJtlgR9t2IFizZKJRWqvxEYC_nin3RN3qM7yrmb9k7HQN7FFHERx57AJ_KtnFsSMRokLgDMbrpTS2zLMg&entry=mc&ved=1t:200715&ictx=111",
      },
    ],

    closingScript: "Radujemo se vašem dolasku",

    rsvpText: "Molimo Vas da potvrdite Vaš dolazak do 01.09.2026.",
  },
},

{
  slug: "djordje-rodjendan",
  type: "birthday",
  template: "birthday-glass-luxury",

  brideName: "Đorđe",

  weddingDate: "27.06.2026.",
  weddingTime: "19:00",
  venue: "Splav Côtier",

  backgroundImage: "/images/birthday-glass-bg.jpg",
  introBackgroundImage: "/images/birthday-glass-intro.jpg",
  musicSrc: "/music/djordje-18.mp3",
uploadCoverImage: "/images/upload/birthday-glass-upload.jpg",
  details: createDetails({
    age: 18,

    welcomeText:
      "Pozivamo vas da zajedno proslavimo Đorđev 18. rođendan.",

    date: "27.06.2026.",
    dateISO: "2026-06-27T19:00:00+02:00",

    rsvpSignature: "Đorđe Krušić",

    venue: "Splav Côtier",
    locationName: "Splav Côtier",
    locationAddress: "Zemunski kej",

    mapLink: "https://maps.google.com/?q=Splav+Cotier+Zemunski+kej",

    note: "Molimo vas da potvrdite dolazak do 10.06.",
    rsvpDeadline: "10.06.2026.",

    showCalendarButton: true,

    showDressCode: false,
    dressCodeTitle: "Dress code",
    dressCodePalette: ["#050403", "#d8aa68", "#f6ead4", "#17311f"],
    dressCodeNote:
      "Elegantne kombinacije u tamnim i zlatnim tonovima su dobrodošle.",
  }),
},
{
  slug: "nevena-nemanja",
  type: "wedding",
  template: "split-video",
  brideName: "Nevena",
  groomName: "Nemanja",
  videoSrc: "/videos/nevena-nemanja.mp4",
  weddingDate: "11 JUL 2026",
  weddingTime: "16:00",
  venue: "Beograd",
  introText: "Radujemo se da ovaj dan podelimo sa vama.",
   musicSrc: "/music/nevena-nemanja.mp3",
  details: createDetails({
      backgroundImage: "/images/nevena-nemanja.jpg",
    welcomeText:
      "Biće nam veliko zadovoljstvo da svojim prisustvom ulepšate naš poseban dan.",
    date: "11 JUL 2026",
    dateISO: "2026-07-11T16:00:00+02:00",
  showCalendarButton: true,
    events: [
     
      {
        label: "Proslava",
        time: "16.00",
        location: "Restoran Festina Palace",
        mapLink: "https://www.google.com/maps/place/Festina+Palace+Event+Centar/@43.2311955,21.5715658,14.5z/data=!4m6!3m5!1s0x4755c358d19b64c7:0x2acaf488a87cb79c!8m2!3d43.232074!4d21.5801227!16s%2Fg%2F11vz7xfjpc?entry=ttu&g_ep=EgoyMDI2MDUxMS4wIKXMDSoASAFQAw%3D%3D",
        note: "Trenutak kada počinje naše novo poglavlje.",
      },
 
    ],

  showDressCode: false,
  venue: "Prokuplje",
  dressCodeTitle: "Dress code",
  dressCodePalette: [],
  dressCodeNote:
    "Nježni, elegantni i prirodni tonovi lepo će se uklopiti u atmosferu našeg dana.",
  mapLink: "https://www.google.com/maps/place/Festina+Palace+Event+Centar/@43.2311955,21.5715658,14.5z/data=!4m6!3m5!1s0x4755c358d19b64c7:0x2acaf488a87cb79c!8m2!3d43.232074!4d21.5801227!16s%2Fg%2F11vz7xfjpc?entry=ttu&g_ep=EgoyMDI2MDUxMS4wIKXMDSoASAFQAw%3D%3D",
  note: "Molimo vas da svoj dolazak potvrdite do 30.06.",
  }),
},
{
  slug: "jovana-caslav",
  type: "wedding",
  template: "passport",

  brideName: "Jovana",
  groomName: "Časlav",

  weddingDate: "06 SEP 2026",
  weddingTime: "13:00",
  venue: "EKOPARK Event & catering center, Beograd",
 musicSrc: "/music/jovana-caslav.mp3",
  details: createDetails({
    cardBackground: "/images/passport/jovana-caslav-card-bg.jpg",
ticketNumber: "06SEP2026",
    welcomeText: "Radujemo se da ovaj poseban dan podelimo sa vama.",

    date: "06 SEP 2026",
    dateISO: "2026-09-06T13:00:00+02:00",
    venue: "EKOPARK Event & catering center, Beograd",

    showCalendarButton: true,

    theme: {
      /* OSNOVNE BOJE */
      main: "#1c3720",
      mainDark: "#102414",
      cream: "#f5efe3",
      white: "#ffffff",

      /* TEKST */
      textMain: "#ffffff",
      textSoft: "rgba(255,255,255,0.82)",
      textMuted: "rgba(255,255,255,0.64)",

      /* KARTICA */
      cardOverlay: "rgba(28, 55, 32, 0.90)",
      cardBorder: "rgba(255,255,255,0.28)",
      bandBg: "rgba(16, 36, 20, 0.92)",

      /* DETALJI */
      accent: "#ffffff",
      accentSoft: "rgba(255,255,255,0.22)",

      /* DUGMAD */
      buttonBg: "#ffffff",
      buttonText: "#1c3720",

      /* IKONICE */
      iconFilter: "brightness(0) invert(1)",

      /* INTRO */
      introButtonBg: "rgba(255,255,255,0.96)",
      introButtonBorder: "rgba(255,255,255,0.75)",
      introButtonText: "#1c3720",
      introButtonTextHover: "#102414",
      introButtonDot: "#1c3720",
      introButtonDotRing: "rgba(28,55,32,0.16)",
      introButtonHoverBg: "#ffffff",

      introOverlayTop: "rgba(28, 55, 32, 0.06)",
      introOverlayMid: "rgba(28, 55, 32, 0.04)",
      introOverlayMid2: "rgba(28, 55, 32, 0.08)",
      introOverlayBottom: "rgba(0, 0, 0, 0.10)",

      /* RSVP */
      rsvpButtonBg: "#ffffff",
      rsvpButtonText: "#1c3720",

      /* COUNTDOWN */
      countdownBg: "#1c3720",
    },

    events: [
      {
        label: "Crkveno venčanje",
        time: "13:00",
        icon: "church",
        location:
          "Crkva Svetog Vasilija Ostroškog, Beograd",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Crkva+Svetog+Vasilija+Ostroskog+Crnotravska+2+Vozdovac+Beograd",
      },
      {
        label: "Skup gostiju",
        time: "15:00",
        icon: "gathering",
        location:
          "EKOPARK Event & catering center, Beograd",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=EKOPARK+Event+catering+center+Staska+Sondermajera+18v+Beograd",
      },
      {
        label: "Građansko venčanje",
        time: "16:00",
        icon: "civil",
        location: "EKOPARK Event & catering center",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=EKOPARK+Event+catering+center+Staska+Sondermajera+18v+Beograd",
      },
    ],

    showDressCode: true,
    dressCodeTitle: "Dress code",
    dressCodePalette: ["#1c3720", "#f5efe3", "#ffffff", "#d8cfbd"],
    dressCodeNote:
      "Zelena i krem nijanse će se lepo uklopiti u atmosferu venčanja.",

    mapLink:
      "https://www.google.com/maps/search/?api=1&query=EKOPARK+Event+catering+center+Staska+Sondermajera+18v+Beograd",

    note: "Molimo vas da svoj dolazak potvrdite do 20.08.2026.",
    rsvpDeadline: "20.08.2026.",
  }),
},
{
  slug: "marija-aleksandar",
  type: "wedding",
  template: "italian-envelope-video",

  brideName: "Marija",
  groomName: "Aleksandar",

  weddingDate: "19.09.2026.",
  weddingTime: "14:00",
  venue: "New Lux Event",

  videoSrc: "/videos/marija-aleksandar.mp4",
  musicSrc: "/music/marija-aleksandar.mp3",



details: createDetails({
  welcomeText:
    "Sa velikom radošću vas pozivamo da budete deo našeg posebnog dana.",
rsvpImage: "/images/italian-rsvp/marija-aleksandar-rsvp.jpg",
rsvpPhotoTitle: "Radujemo se vašem dolasku!",
rsvpPhotoText: "Porodice Živić i Milutinović",
  heroText: "venčanje",
  showCalendarButton: true,
  date: "19.09.2026.",
  dateISO: "2026-09-19T14:00:00+02:00",

  cloudLeft: "/images/italian-clouds/cloud-left.svg",
  cloudRight: "/images/italian-clouds/cloud-right.svg",

  events: [
    {
      label: "Crkveno venčanje",
      time: "14:00",
      icon: "church",
      location: "Crkva Svetog Luke, Krnjača",
      mapLink:
        "https://www.google.com/maps/search/?api=1&query=Crkva+Svetog+Luke+Krnjaca",
    },
    {
      label: "Skup gostiju",
      time: "15:00",
      icon: "gathering",
      location: "Restoran New Lux Event",
      mapLink:
        "https://www.google.com/maps/search/?api=1&query=New+Lux+Event",
    },
    {
      label: "Ceremonija građanskog venčanja",
      time: "16:20",
      icon: "civil",
      location: "Restoran New Lux Event",
      mapLink:
        "https://www.google.com/maps/search/?api=1&query=New+Lux+Event",
    },
  ],

  mapLink: "https://www.google.com/maps/search/?api=1&query=New+Lux+Event",
  note: "Molimo vas da svoj dolazak potvrdite do 1. septembra.",
})
},
{
  slug: "aleksandra-luka",
  type: "wedding",
  template: "silk",

  brideName: "Aleksandra",
  groomName: "Luka",

  videoSrc: "/videos/aleksandra-luka-1.mp4",
  fontMode: "light",

  weddingDate: "26 SEP 2026",
  weddingTime: "15:00",
  venue: "Restoran Smokvica, Airport City, Novi Beograd",

  backgroundImage: "/images/aleksandra-luka-minimal-1.jpg",

  details: createDetails({
    welcomeText:
      "Biće nam izuzetno drago da svojim prisustvom ulepšate naš poseban dan.",

    date: "26 SEP 2026",
    dateISO: "2026-09-26T15:00:00+02:00",

    events: [
      {
        label: "Crkveno venčanje",
        time: "15:00",
        icon: "rings",
        location: "Crkva Sveti Stefan Dečanski, Železnik",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Crkva+Sveti+Stefan+De%C4%8Danski+%C5%BDeleznik",
      },
      {
        label: "Okupljanje gostiju ispred restorana",
        time: "16:30",
        icon: "guest",
        location: "Restoran Smokvica, Airport City, Novi Beograd",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Restoran+Smokvica+Airport+City+Novi+Beograd",
      },
      {
        label: "Građansko venčanje",
        time: "18:15",
        icon: "ceremony",
        location: "Restoran Smokvica, Airport City, Novi Beograd",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Restoran+Smokvica+Airport+City+Novi+Beograd",
      },
  
    ],

    showCalendarButton: true,

    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Restoran+Smokvica+Airport+City+Novi+Beograd",

    note: "Molimo vas da svoj dolazak potvrdite do 10.09.2026.",
  }),
},
{
  slug: "relja-1",
  type: "birthday",
  template: "birthday-one-word",

  brideName: "Relja",
  title: "Relja slavi rođendan",

  weddingDate: "09 AUG 2026",
  weddingTime: "14:30",
  venue: "Restoran Romantična noć 2, Kaluđerica",

  backgroundImage: "/images/relja-1-bg.jpg",
  image1: "/images/relja-1-1.jpg",
  image2: "/images/relja-1-2.jpg",
  image3: "/images/relja-1-3.jpg",

  details: createDetails({
    welcomeText:
      "Sa velikom radošću vas pozivamo da zajedno proslavimo Reljin poseban dan.",
showCalendarButton: true,

    date: "09 AUG 2026",
    dateISO: "2026-08-09T14:30:00+02:00",
rsvpText:
  "Radovaćemo se da zajedno proslavimo Reljin rođendan i krštenje.",
    venue: "Restoran Romantična noć 2, Kaluđerica",

    events: [
      {
        label: "Krštenje",
        time: "14:30",
        icon: "church",
        location: "Crkva Sv. Luka, Krnjača",
      },
      {
        label: "Rođendan",
        time: "16:00",
        icon: "cake",
        location: "Restoran Romantična noć 2, Kaluđerica",
      },
    ],
    sliderImages: [
      "/images/relja-1-card-1.jpg",
      "/images/relja-1-card-2.jpg",
      "/images/relja-1-card-3.jpg",
      "/images/relja-1-card-4.jpg",
      "/images/relja-1-card-5.jpg",
          "/images/relja-1-card-6.jpg",
      "/images/relja-1-card-7.jpg",
      "/images/relja-1-card-8.jpg",
    ],
    note: "Dolazak je potrebno potvrditi do 25.07.2026.",

    

    mapLink:
      "https://maps.google.com/?q=Restoran%20Romanti%C4%8Dna%20no%C4%87%202%20Kalu%C4%91erica",
  }),
},
{
  slug: "milica-djordje",
  type: "wedding",
  template: "italian-envelope-video",

  brideName: "Milica",
  groomName: "Đorđe",

  weddingDate: "21.08.2026.",
  weddingTime: "16:30",
  venue: "Mesečev konak, Niš",

  videoSrc: "/videos/milica-djordje.mp4",
  musicSrc: "/music/milica-djordje.mp3",

  details: createDetails({
    italianVariant: "silver",
    hideRsvpPhotoBlock: true,
envelopeBack: "/images/italian-envelope/milica-djordje-envelope-back.svg",
envelopeFront: "/images/italian-envelope/milica-djordje-envelope-front.svg",
    welcomeText:
      "Sa velikom radošću vas pozivamo da budete deo našeg posebnog dana.",

    heroText: "venčanje",
    showCalendarButton: true,

    date: "21.08.2026.",
    dateISO: "2026-08-21T16:30:00+02:00",

    cloudLeft: "/images/italian-clouds/milica-djordje-cloud-left.svg",
    cloudRight: "/images/italian-clouds/milica-djordje-cloud-right.svg",

    events: [
      {
        label: "Ceremonija građanskog venčanja",
        time: "16:30",
        icon: "civil",
        location: "Mesečev konak, Niš",
        mapLink:
          "https://www.google.com/maps/place/43%C2%B018'57.3%22N+21%C2%B047'54.7%22E/@43.31592,21.7972305,358m/data=!3m2!1e3!4b1!4m4!3m3!8m2!3d43.31592!4d21.798518?entry=ttu&g_ep=EgoyMDI2MDUyNy4wIKXMDSoASAFQAw%3D%3D",
      },
      {
        label: "Večera i proslava",
        time: "17:00",
        icon: "restaurant",
        location: "Mesečev konak, Niš",
        mapLink:
          "https://www.google.com/maps/place/43%C2%B018'57.3%22N+21%C2%B047'54.7%22E/@43.31592,21.7972305,358m/data=!3m2!1e3!4b1!4m4!3m3!8m2!3d43.31592!4d21.798518?entry=ttu&g_ep=EgoyMDI2MDUyNy4wIKXMDSoASAFQAw%3D%3D",
      },
    ],

    showDressCode: false,

    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Mesecev+konak+Nis",

    note: "Molimo vas da svoj dolazak potvrdite do 1. avgusta.",
    rsvpText: "Molimo vas da svoj dolazak potvrdite do 1. avgusta.",
  }),
},

{
  slug: "magdalena-lazar",
  type: "wedding",
  template: "elegant-white",

  brideName: "Magdalena",
  groomName: "Lazar",
 musicSrc: "/music/magdalena-lazar.mp3",
  weddingDate: "02 AVG 2026",
  weddingTime: "13:00",
  venue: "Hotel Vojvoda Putnik",

  backgroundImage: "/images/elegant-white/background.jpg",

  details: createDetails({
    backgroundImage: "/images/elegant-white/background.jpg",

    welcomeText: "Radujemo se da ovaj dan podelimo sa vama.",

    date: "02 AVG 2026",
    dateISO: "2026-08-02T13:00:00+02:00",

    venue: "Hotel Vojvoda Putnik",

    showCalendarButton: true,

events: [
  {
    label: "Crkveno venčanje",
    time: "13:00",
    icon: "church",
    location: "Manastir Sv. Nikole",
    mapLink:
      "https://www.google.com/maps/place/manastir+svetog+nikole+vranje/data=!4m2!3m1!1s0x1355202930267b4d:0xb4c2b186dc6c0bde?sa=X&ved=1t:155783&ictx=111",
  },
  {
    label: "Prijem gostiju",
    time: "15:30",
    icon: "guests",
    location: "Hotel Vojvoda Putnik",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Hotel+Vojvoda+Putnik",
  },
  {
    label: "Građansko venčanje",
    time: "17:00",
    icon: "civil",
    location: "Hotel Vojvoda Putnik",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Hotel+Vojvoda+Putnik",
  },
],

    showDressCode: false,

    note: "Molimo vas da svoj dolazak potvrdite do 10. jula.",
   
  }),
},
{
  slug: "jelena-aleksandar",
  type: "wedding",
  template: "silk-minimal-split",

  brideName: "Jelena",
  groomName: "Aleksandar",

  videoSrc: "/videos/jelena-aleksandar.mp4",
  musicSrc: "/music/jelena-aleksandar.mp3",
  fontMode: "light",

  weddingDate: "22 AVG 2026",
  weddingTime: "16:30",
  venue: "Svečana sala Bjanka, Bogatić",

  backgroundImage: "/images/jelena-aleksandar-minimal.jpg",

  details: createDetails({
    welcomeText:
      "Biće nam izuzetno drago da svojim prisustvom ulepšate naš poseban dan.",

    date: "22.08.2026.",
    dateISO: "2026-08-22T16:30:00+02:00",

    events: [
      {
        label: "Skup svatova",
        time: "16:30",
        icon: "gathering",
        location: "Svečana sala Bjanka, Bogatić",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Svecana+sala+Bjanka+Bogatic",
      },
      {
        label: "Građansko venčanje",
        time: "17:30",
        icon: "civil",
        location: "Svečana sala Bjanka, Bogatić",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Svecana+sala+Bjanka+Bogatic",
      },
    ],

    showCalendarButton: true,

    showDressCode: true,
    dressCodeTitle: "Dress code",

    dressCodeNote:
      "Elegantne kombinacije u tonovima naše palete.",

    dressCodeWomen:
      "Koktel haljine u roze, krem, bordo i zelenim tonovima.",

    dressCodeWomenPalette: [
      "#b45f72",
      "#d28f92",
    
      "#f5e8d1",
      "#7b1234",
      "#4f6b2c",
      "#9cad6f",
    ],

    dressCodeMen:
      "Odela ili elegantne kombinacije u braon, crnoj, beloj ili teget boji.",

    dressCodeMenPalette: [
      "#4a2f22",
      "#111111",
      "#f6efe3",
      "#1f2f4f",
    ],

    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Svecana+sala+Bjanka+Bogatic",

    note: "Molimo Vas da potvrdite svoj dolazak do 1. avgusta.",
  }),
},
{
  slug: "tamara-ratko",
  type: "wedding",
  template: "italian-envelope-video",

  brideName: "Tamara",
  groomName: "Ratko",

  weddingDate: "17.10.2026.",
  weddingTime: "14:30",
  venue: "Klub Maestro, Višnjička 102, Beograd",

  videoSrc: "/videos/tamara-ratko.mp4",
  musicSrc: "/music/tamara-ratko.mp3",

  details: createDetails({
    welcomeText:
      "Sa velikom radošću vas pozivamo da budete deo našeg posebnog dana.",

    heroText: "venčanje",
    showCalendarButton: false,

    date: "17.10.2026.",
    dateISO: "2026-10-17T14:30:00+02:00",

    cloudLeft: "/images/italian-clouds/cloud-left.svg",
    cloudRight: "/images/italian-clouds/cloud-right.svg",

     rsvpImage: "/images/italian-rsvp/tamara-ratko-rsvp.jpg",
    rsvpPhotoTitle: "Vidimo se!",

    events: [
      {
        label: "Crkveno venčanje",
        time: "14:30",
        icon: "church",
        location: "Crkva Svetog Luke, Krnjača",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Crkva+Svetog+Luke+Krnjaca",
      },
      {
        label: "Skup gostiju",
        time: "15:30",
        icon: "gathering",
        location: "Klub Maestro, Višnjička 102, Beograd",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Klub+Maestro+Visnjicka+102+Beograd",
      },
      {
        label: "Građansko venčanje",
        time: "16:00",
        icon: "civil",
        location: "Klub Maestro, Višnjička 102, Beograd",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Klub+Maestro+Visnjicka+102+Beograd",
      },
    ],

    showDressCode: false,

    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Klub+Maestro+Visnjicka+102+Beograd",

    note: "Molimo vas da svoj dolazak potvrdite do 01.10.2026.",
    rsvpText: "Molimo vas da svoj dolazak potvrdite do 01.10.2026.",
    rsvpDeadline: "01.10.2026.",
    rsvpDeadlineISO: "2026-10-01",
  }),
},
{
  slug: "milica-nikola-gavrilo",
  type: "wedding",
  template: "wedding-baptism-silk",

  brideName: "Milica",
  groomName: "Nikola",
  childName: "Gavrila",

  videoSrc: "/videos/milica-nikola-gavrilo.mp4",
  musicSrc: "/music/milica-nikola-gavrilo.mp3",
  fontMode: "light",

  weddingDate: "06 AVG 2026",
  weddingTime: "15:00",
  venue: "Crkva Svetog Nikole, Vrbnica",

  backgroundImage: "/images/milica-nikola-gavrilo-minimal.jpg",

  details: createDetails({
    welcomeText:
      "Sa velikom radošću vas pozivamo da zajedno sa nama proslavite naše venčanje i krštenje našeg sina Gavrila.",

    date: "06.08.2026.",
    dateISO: "2026-08-06T15:00:00+02:00",

  events: [
  {
    label: "Skup mladinih gostiju",
    time: "11:00",
    icon: "gathering",
    location: "Selo Buci",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=selo+Buci",
  },
  {
    label: "Skup mladoženjinih gostiju",
    time: "12:30",
    icon: "groom",
    location: "Donji Stupanj",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Donji+Stupanj",
  },
  {
    label: "Venčanje i krštenje",
    time: "15:00",
    icon: "church",
    location: "Crkva Svetog Nikole, Vrbnica",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Crkva+Svetog+Nikole+Vrbnica",
  },
  {
    label: "Svečani ručak",
    time: "17:00",
    icon: "ceremony",
    location: "Restoran Trifunović Company, Vitkovo",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Restoran+Trifunovic+Company+Vitkovo+Aleksandrovac",
  },
],

    showCalendarButton: false,
    showDressCode: false,

    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Restoran+Trifunovic+Company+Vitkovo+Aleksandrovac",

    note: "Molimo vas da svoj dolazak potvrdite do 16.07.2026.",
    rsvpDeadline: "16.07.2026.",
  }),
},
{
  slug: "benedikt-stela",
  type: "wedding",
  template: "minimal-gold",

  brideName: "Stela",
  groomName: "Benedikt",

  weddingDate: "10 LISTOPAD 2026",
  weddingTime: "17:30",
  venue: "Svetište sv. Leopolda Bogdana Mandića",

  backgroundImage: "/images/benedikt-stela-minimal-gold.jpg",

  details: createDetails({
    date: "10.10.2026.",
    dateISO: "2026-10-10T17:30:00+02:00",

    welcomeText:
      "Pozivamo vas da pred Bogom i u Kristu budete svjedoci našega bračnog zavjeta.",

  events: [
  {
    label: "Crkveno vjenčanje",
    time: "17:30",
    icon: "church",
    location: "Svetište sv. Leopolda Bogdana Mandića",
    address:
      "Ulica Svetog Leopolda Mandića 41, Zagreb (Dubrava)",
  },
  {
    label: "Svadbena svečanost",
    time: "20:00",
    icon: "restaurant",
    location: "Restoran Laguna",
    address:
      "Dugoselska cesta 33a, Sesvetski Kraljevec",
  },
],

    showCalendarButton: false,
    showDressCode: false,

    note:
      "A sad ostaju vjera, ufanje i ljubav, ovo troje – ali najveća je među njima ljubav.",

    rsvpDeadline: "20.09.2026.",
    rsvpDeadlineISO: "2026-09-20",
  }),
},

{
  slug: "nikolina-velibor",
  type: "wedding",
  template: "gold-print-video",
  script: "cyrillic",

  brideName: "Николина",
  groomName: "Велибор",
brideNameLatin: "Nikolina",
  groomNameLatin: "Velibor",
  videoSrc: "/videos/nikolina-velibor-intro.mp4",
  musicSrc: "/music/nikolina-velibor.mp3",
uploadCoverImage: "/images/upload/birthday-glass-upload.jpg",

  weddingDate: "2 АВГ 2026",
  weddingTime: "12:00",
  venue: "Херцеговачка Грачаница",

  backgroundImage: "/images/nikolina-velibor-fallback.jpg",

  details: createDetails({
    namesSvg: "/images/names/nikolina-velibor.svg",

    videoSrc: "/videos/nikolina-velibor-intro-2.mp4",
    rsvpImage: "/images/italian-rsvp/nikolina-velibor-rsvp.jpg",

    welcomeText:
      "Са великом радошћу вас позивамо да будете део нашег посебног дана.",

    heroText: "вjенчање",

    date: "2 АВГ 2026",
    dateISO: "2026-08-02T12:00:00+02:00",

    showCalendarButton: true,

    envelopeLeft: "/images/goldprint-envelope/nikolina-velibor-left.svg",
    envelopeRight: "/images/goldprint-envelope/nikolina-velibor-right.svg",

    letterIntro: "У срцу Херцеговине,",

    letterText1:
      "тамо где сунце најтоплије грли небо, а камен чува приче о вечности, куцнуо је час да и ми испишемо наше најважније поглавље.",

    letterText2:
      "Под окриљем љубави која нас покреће, желимо да крунишемо наш заједнички пут и закорачимо у нови почетак.",

events: [
  {
    label: "Окупљање гостију",
    time: "12:00h - 12:45h",
    icon: "gathering",
    location: "Хотел Bellevue, Требиње",
    description: "Почетак окупљања и драги сусрети прије церемоније.",
    mapLink: "https://maps.google.com/?q=Hotel+Bellevue+Trebinje",
  },
  {
    label: "Црквено вјенчање",
    time: "14:30h",
    icon: "church",
    location: "Црква Пресвете Богородице, Херцеговачка Грачаница",
    description: "Круна наше љубави и почетак новог животног поглавља.",
    mapLink:
      "https://maps.google.com/?q=Crkva+Presvete+Bogorodice+Hercegovacka+Gracanica",
  },
  {
    label: "Фотографисање",
    time: "16:30h",
    icon: "camera",
    location: "По повратку са црквеног вјенчања",
  },
  {
    label: "Свечани ручак / вечера",
    time: "17:30h",
    icon: "restaurant",
    location: "Прослава са породицом и пријатељима",
  },
  {
    label: "Први плес",
    time: "18:30h",
    icon: "music",
    location: "Наш први плес & Почетак журке",
  },
  {
    label: "Торта",
    time: "21:00h",
    icon: "cake",
    location: "Слатки тренутак који ћемо подијелити са вама",
  },
],
    showDressCode: false,

    mapLink:
      "https://maps.google.com/?q=Crkva+Presvete+Bogorodice+Hercegovacka+Gracanica",

    note: "Молимо Вас да свој долазак потврдите до 10. јула .2026..",
  }),
},

{
  slug: "jasmina-sinisa",
  type: "wedding",
  template: "silk",

  brideName: "Jasmina",
  groomName: "Siniša",

  // ovde zameni kad budeš imala njihov video/muziku
  videoSrc: "/videos/jasmina-sinisa.mp4",
  // musicSrc: "/music/jasmina-sinisa.mp3",

  fontMode: "light",

  weddingDate: "13 SEP 2026",
  weddingTime: "15:00",
  venue: "Fruška 151, Sremski Karlovci",

  backgroundImage: "/images/jasmina-sinisa-minimal.jpg",

  details: createDetails({
    welcomeText:
      "Biće nam izuzetno drago da svojim prisustvom ulepšate naš poseban dan.",

    date: "13 SEP 2026",
    dateISO: "2026-09-13T15:00:00+02:00",

    showCalendarButton: true,

    events: [
      {
        label: "Okupljanje svatova",
        time: "15:00",
        icon: "gathering",
        location: "Fruška 151, Sremski Karlovci",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Fruska+151+Sremski+Karlovci",
      },
      {
        label: "Građansko venčanje",
        time: "16:00",
        icon: "civil",
        location: "Fruška 151, Sremski Karlovci",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Fruska+151+Sremski+Karlovci",
      },
      {
        label: "Proslava",
        time: "16:30",
        icon: "restaurant",
        location: "Fruška 151, Sremski Karlovci",
        note: "Nakon ceremonije nastavljamo sa slavljem.",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Fruska+151+Sremski+Karlovci",
      },
      {
        label: "Završetak proslave",
        time: "23:00",
        icon: "party",
        location: "Fruška 151, Sremski Karlovci",
      },
    ],

    showDressCode: false,
    dressCodeTitle: "Dress code",
    dressCodePalette: [],
    dressCodeNote: "",

    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Fruska+151+Sremski+Karlovci",

    note: "Molimo vas da svoj dolazak potvrdite do 20.08.2026.",
    rsvpDeadline: "20.08.2026.",
    rsvpDeadlineISO: "2026-08-20",
  }),
},
{
  slug: "jovana-dusan",
  type: "wedding",
  template: "cyrillic-svg-silk",

  brideName: "Јована",
  groomName: "Душан",
  script: "cyrillic",
  fontMode: "light",

  weddingDate: "8 NOV 2026",
  weddingTime: "12:00",
  venue: "Краљево",

  introNamesSvg: "/images/names/jovana-dusan.svg",
  videoSrc: "/videos/jovana-dusan.mp4",
musicSrc: "/music/jovana-dusan-1.mp3",
  details: {
    date: "8. новембар 2026.",
    dateText: "8. новембар 2026.",
    dateISO: "2026-11-08T12:00:00+01:00",

    rsvpDeadline: "20. октобра 2026.",
    rsvpDeadlineISO: "2026-10-20",

    fixedBackgroundImage: "/images/cyrillic-svg-silk/paper-bg.jpg",

    foreverSvg: "/images/names/zauvek.svg",
    namesSvg: "/images/names/jovana-dusan-main.svg",

    welcomeText:
      "Са радошћу вас позивамо да увеличате наше венчање.",

    note:
      "Молимо вас да свој долазак потврдите до 20. октобра.",

    events: [
      {
        label: "Скуп сватова",
        time: "12.00ч",
        icon: "gathering",
        location: "Породична кућа Дуњић",
        address: "Ушћанских рудара 5, Краљево",
        mapLink:
          "https://maps.google.com/?q=Uscanskih+rudara+5+Kraljevo",
        buttonText: "Погледај локацију",
      },
      {
        label: "Црквено венчање",
        time: "14.00ч",
        icon: "church",
        location: "Храм Светог Саве, Краљево",
        mapLink:
          "https://maps.google.com/?q=Hram+Svetog+Save+Kraljevo",
        buttonText: "Погледај локацију",
      },
      {
        label: "Свечана сала",
        time: "16.00ч",
        icon: "restaurant",
        location: "Talas Resort, Краљево",
        mapLink:
          "https://maps.google.com/?q=Talas+Resort+Kraljevo",
        buttonText: "Погледај локацију",
      },
       {
        label: "Грађанско венчање",
        time: "17.00ч",
        icon: "rings",
        location: "Talas Resort, Краљево",
        mapLink:
          "https://maps.google.com/?q=Talas+Resort+Kraljevo",
        buttonText: "Погледај локацију",
      },
    ],

    showDressCode: false,
    showCalendarButton: true,
  },
},
{
  slug: "jovana-stefan",
  type: "wedding",
  template: "silk",

  brideName: "Jovana",
  groomName: "Stefan",

  // ako nemaš video još, obriši ovu liniju ili je zakomentariši
  videoSrc: "/videos/jovana-stefan.mp4",

  fontMode: "light",

  weddingDate: "20 SEP 2026",
  weddingTime: "13:00",
  venue: "Wind Rose Jagodina",
  uploadCoverImage:
    "/images/upload/birthday-glass-upload.jpg",
  // zameni pravom slikom kad je budeš imala
  backgroundImage: "/images/jovana-stefan-minimal.jpg",

  details: createDetails({
    welcomeText:
      "Biće nam izuzetno drago da svojim prisustvom ulepšate naš poseban dan.",

    date: "20 SEP 2026",
    dateISO: "2026-09-20T13:00:00+02:00",

    showCalendarButton: true,

    events: [
      {
        label: "Crkveno venčanje",
        time: "13:00",
        icon: "church",
        location: "Hram Svetih arhangela Mihaila i Gavrila, Jagodina",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Hram+Svetih+arhangela+Mihaila+i+Gavrila+Jagodina",
      },
      {
        label: "Okupljanje gostiju",
        time: "16:00",
        icon: "gathering",
        location: "Wind Rose, Jagodina",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Wind+Rose+Jagodina",
      },
      {
        label: "Građansko venčanje",
        time: "17:00",
        icon: "civil",
        location: "Wind Rose, Jagodina",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Wind+Rose+Jagodina",
      },
    ],

    showDressCode: false,

    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Wind+Rose+Jagodina",

    note: "Molimo vas da svoj dolazak potvrdite do 10.08.2026.",
    rsvpText: "Molimo vas da svoj dolazak potvrdite do 10.08.2026.",
  }),
},
{
  slug: "teodora-branislav",
  type: "wedding",
  template: "magazine-editorial",

  brideName: "Teodora",
  groomName: "Branislav",

  weddingDate: "29 AVG 2026",
  weddingTime: "10:00",
  venue: "Hotel Hedonic",

  backgroundImage: "/images/teodora-branislav-intro-bg.png",
 image1: "/images/nevena-pedja/location.jpg", // dodaj samo ako imaš sliku
musicSrc: "/music/teodora-branislav.mp3",
  details: createDetails({
    backgroundImage: "/images/magazine-intro-bg.png",

    ticketNumber: "290826TB",

    welcomeText:
      "Radujemo se da ovaj poseban dan podelimo sa vama.",

    date: "29 AVG 2026",
    dateISO: "2026-08-29T10:00:00+02:00",

    venue: "Hotel Hedonic",

    showCalendarButton: false,
    showDressCode: false,

    events: [
      {
        label: "Skup svatova",
        time: "10:00",
        icon: "gathering",
        location: "Kod mladoženje",
      },
      {
        label: "Crkveno venčanje",
        time: "13:00",
        icon: "church",
        location: "Hram Preobraženja Gospodnjeg",
        mapLink:
          "https://www.google.com/maps/place/%D0%A5%D1%80%D0%B0%D0%BC+%D0%9F%D1%80%D0%B5%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B5%D1%9A%D0%B0+%D0%93%D0%BE%D1%81%D0%BF%D0%BE%D0%B4%D1%9A%D0%B5%D0%B3/@44.790724,20.4839501,699m/data=!3m2!1e3!4b1!4m6!3m5!1s0x475a707ca8676db3:0x8108329da96527e0!8m2!3d44.790724!4d20.486525!16s%2Fg%2F1z449_5ln?entry=ttu&g_ep=EgoyMDI2MDYyNC4wIKXMDSoASAFQAw%3D%3D",
      },
      {
        label: "Skup gostiju",
        time: "15:00",
        icon: "gathering",
        location: "Hotel Hedonic",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Hotel+Hedonic",
      },
      {
        label: "Građansko venčanje",
        time: "16:00",
        icon: "civil",
        location: "Hotel Hedonic",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Hotel+Hedonic",
      },
    ],

    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Hotel+Hedonic",

    note: "Molimo vas da svoj dolazak potvrdite do 14.08.2026.",
    rsvpDeadline: "14.08.2026.",
    rsvpDeadlineISO: "2026-08-14",
  }),
},
{
  slug: "doroteja-marko",
  type: "wedding",
  template: "passport",

  brideName: "Doroteja",
  groomName: "Marko",

  weddingDate: "30 AVG 2026",
  weddingTime: "16:00",
  venue: "Hotel „Sloboda”, Odžaci",

musicSrc: "/music/jovana-caslav.mp3",

  details: createDetails({
    cardBackground: "/images/passport/doroteja-marko-card-bg.jpg",

    ticketNumber: "300826DM",

    welcomeText:
      "Sa velikom radošću vas pozivamo da budete deo našeg posebnog dana.",

    date: "30.08.2026.",
    dateISO: "2026-08-30T16:00:00+02:00",

    venue: "Hotel „Sloboda”, Odžaci",

    showCalendarButton: true,
    showDressCode: false,

    

    events: [
      {
        label: "Skup gostiju",
        time: "11:00",
        icon: "gathering",
        location: "Kod mladoženje",
      },
      {
        label: "Skup gostiju",
        time: "12:00",
        icon: "guests",
        location: "Kod mlade",
      },
      {
        label: "Crkveno venčanje",
        time: "14:00",
        icon: "church",
        location: "Hram svetih apostola Petra i Pavla",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Hram+svetih+apostola+Petra+i+Pavla+Odzaci",
      },
      {
        label: "Skup u sali",
        time: "16:00",
        icon: "restaurant",
        location: "Hotel „Sloboda”, Odžaci",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Hotel+Sloboda+Odzaci",
      },
      {
        label: "Građansko venčanje u sali",
        time: "17:00",
        icon: "civil",
        location: "Hotel „Sloboda”, Odžaci",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Hotel+Sloboda+Odzaci",
      },
    ],

    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Hotel+Sloboda+Odzaci",

    note: "Molimo vas da svoj dolazak potvrdite do 30. jula.",
    rsvpText: "Dolazak je potrebno potvrditi do 30. jula.",
    rsvpDeadline: "30.07.2026.",
    rsvpDeadlineISO: "2026-07-30",
  }),
},
{
  slug: "jovana-nikola",
  type: "wedding",
  template: "silk",

  brideName: "Jovana",
  groomName: "Nikola",

  videoSrc: "/videos/jovana-nikola-4.mp4",
  fontMode: "light",
  uploadCoverImage: "/images/upload/birthday-glass-upload.jpg",
  weddingDate: "13 SEP 2026",
  weddingTime: "10:00",
  venue: "Events centar Anđela, Šabac",

  backgroundImage: "/images/jovana-nikola-minimal-1.jpg",
musicSrc: "/music/jovana-nikola.mp3",
  details: createDetails({
    welcomeText:
      "Biće nam izuzetno drago da svojim prisustvom ulepšate naš poseban dan.",

    date: "13 SEP 2026",
    dateISO: "2026-09-13T10:00:00+02:00",

    showCalendarButton: false,

    events: [
      {
        label: "Skup svatova",
        time: "10:00",
        icon: "gathering",
        location: "Porodična kuća",
      },
      {
        label: "Crkveno venčanje",
        time: "15:00",
        icon: "church",
        location: "Hram Svete Trojice, Letnjikovac",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Hram+Svete+Trojice+Letnjikovac",
      },
      {
        label: "Svečana sala",
        time: "16:00",
        icon: "restaurant",
        location: "Events centar Anđela, Šabac",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Events+centar+Andjela+Sabac",
      },
    ],

    showDressCode: false,

    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Events+centar+Andjela+Sabac",

    note: "Molimo vas da svoj dolazak potvrdite do 01.09.2026.",
    rsvpText: "Molimo vas da svoj dolazak potvrdite do 01.09.2026.",
    rsvpDeadline: "01.09.2026.",
    rsvpDeadlineISO: "2026-09-01",
  }),
},
{
  slug: "andrijana-marko",
  type: "wedding",
  template: "silk",

  brideName: "Andrijana",
  groomName: "Marko",

  videoSrc: "/videos/andrijana-marko.mp4",

  fontMode: "light",

  weddingDate: "16 AVG 2026",
  weddingTime: "19:00",
  venue: "Hotel-Restoran Madera",

  backgroundImage: "/images/andrijana-marko-minimal-1.jpg",
musicSrc: "/music/andrijana-marko.mp3",
 details: createDetails({
  welcomeText:
    "Pozivamo Vas da sa nama podelite radost našeg venčanja i krunisanja ljubavi koju već dugo živimo, čuvamo i zajedno gradimo.",

  date: "16 AVG 2026",
  dateISO: "2026-08-16T19:00:00+02:00",
rsvpOptions: {
  fasting: true,
},

  venue: "Hotel-Restoran Madera",
  showCalendarButton: true,
calendarDurationHours: 7,
 events: [
  {
    label: "Doček gostiju",
    time: "19:00",
    icon: "gathering",
    location: "Hotel-Restoran Madera, pored bazena",
    mapLink:
      "https://www.google.com/maps/place/Hotel-Restoran+Madera/@43.2556178,21.8643691,718m/data=!3m2!1e3!4b1!4m6!3m5!1s0x4755bb2b0b017195:0x1da2df081511f09e!8m2!3d43.2556178!4d21.8643691!16s%2Fg%2F11hdvr4w80?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D",
  },
  {
    label: "Građansko venčanje",
    time: "20:00",
    icon: "civil",
  },
  {
    label: "Večera",
    time: "21:30",
    icon: "vecera",
  },
  {
    label: "Torta",
    time: "00:00",
    icon: "ceremony",
  },
],

  showDressCode: true,
  dressCodeTitle: "Dress code",
  dressCodePalette: [],
  dressCodeNote: "Svečano i elegantno, u stilu koji vam najviše prija.",

  mapLink:
    "https://www.google.com/maps/place/Hotel-Restoran+Madera/@43.2556178,21.8643691,718m/data=!3m2!1e3!4b1!4m6!3m5!1s0x4755bb2b0b017195:0x1da2df081511f09e!8m2!3d43.2556178!4d21.8643691!16s%2Fg%2F11hdvr4w80?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D",

  note: "Molimo vas da svoj dolazak potvrdite do 01.08.2026.",
  rsvpText: "Molimo vas da svoj dolazak potvrdite do 01.08.2026.",
  rsvpDeadline: "01.08.2026.",
  rsvpDeadlineISO: "2026-08-01",
}),
},

{
  slug: "marija-petar",
  type: "wedding",
  template: "silk",
  script: "cyrillic",

  brideName: "Марија",
  groomName: "Петар",

  videoSrc: "/videos/marija-petar.mp4",
  musicSrc: "/music/marija-petar.mp3",

  fontMode: "dark",

  weddingDate: "24 ОКТ 2026",
  weddingTime: "15:30",
  venue: "Месечев конак",

  backgroundImage: "/images/marija-petar-minimal.jpg",

  details: createDetails({
    welcomeText:
      "Наша прича добија ново поглавље, зато вас са радошћу позивамо да будете део наше успомене.",

    date: "24.10.2026.",
    dateISO: "2026-10-24T15:30:00+02:00",

    venue: "Месечев конак",

    showCalendarButton: true,
    calendarDurationHours: 9,

    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Mesecev+konak+Nis",

    showLanguageSwitcher: true,
    defaultLanguage: "sr",
    languages: ["sr", "en"],

    languageLabels: {
      sr: "SR",
      en: "EN",
    },

    translations: {
      en: {
        script: "latin",

        brideName: "Marija",
        groomName: "Petar",

        weddingDate: "24 OCT 2026",
        weddingTime: "3:30 PM",
        venue: "Mesečev konak",

        details: {
          welcomeText:
            "Our story begins a new chapter, and we joyfully invite you to be part of our special memory.",

          date: "24 OCT 2026",
          venue: "Mesečev konak",

          events: [
            {
              label: "Civil wedding ceremony",
              time: "3:30 PM",
              icon: "civil",
              location: "Oficirski dom",
              mapLink:
                "https://www.google.com/maps/search/?api=1&query=Oficirski+dom+Nis",
            },
            {
              label: "Guest gathering",
              time: "5:00 PM",
              icon: "restaurant",
              location: "Restaurant Mesečev konak",
              mapLink:
                "https://www.google.com/maps/search/?api=1&query=Mesecev+konak+Nis",
            },
          ],

          mapLink:
            "https://www.google.com/maps/search/?api=1&query=Mesecev+konak+Nis",

          note:
            "Please confirm your attendance by October 10, 2026.",

          rsvpText:
            "Please confirm your attendance by October 10, 2026.",

          rsvpDeadline: "10 OCT 2026",
          rsvpDeadlineISO: "2026-10-10",
        },
      },
    },

    events: [
      {
        label: "Церемонија општинског венчања",
        time: "15:30",
        icon: "civil",
        location: "Официрски дом",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Oficirski+dom+Nis",
      },
      {
        label: "Окупљање гостију",
        time: "17:00",
        icon: "restaurant",
        location: "Ресторан „Месечев конак”",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Mesecev+konak+Nis",
      },
    ],

    showDressCode: false,
    dressCodeTitle: "",
    dressCodePalette: [],
    dressCodeNote: "",

    note:
      "Молимо вас да свој долазак потврдите до 10.10.2026. године.",

    rsvpText:
      "Молимо вас да свој долазак потврдите до 10.10.2026. године.",

    rsvpDeadline: "10.10.2026.",
    rsvpDeadlineISO: "2026-10-10",
  }),
},

{
  slug: "mina-dragan",
  type: "wedding",
  template: "split-video",
  script: "cyrillic",

  brideName: "Мина",
  groomName: "Драган",

  videoSrc: "/videos/mina-dragan.mp4",
  musicSrc: "/music/mina-dragan.mp3",

  weddingDate: "12 СЕП 2026",
  weddingTime: "09:00",
  venue: "Сала „Гранд”, Ново Село",

  introText: "Радујемо се да овај дан поделимо са вама.",

  details: createDetails({
    backgroundImage: "/images/mina-dragan-split-1.jpg",

   welcomeText:
  "Пре годину дана започела је наша најлепша прича… \n\nА сада је време да започнемо ново поглавље.\n\nСа великом радошћу позивамо вас да будете део нашег венчања и својим присуством улепшате наш најважнији дан.",

    date: "12 СЕП 2026",
    dateISO: "2026-09-12T09:00:00+02:00",

    showCalendarButton: true,
    calendarDurationHours: 9,

    events: [
      {
        label: "Скуп сватова",
        time: "09:00",
        icon: "gathering",
        location: "Код породице Рајковић",
        note: "Окупљање сватова",
      },
      {
        label: "Скуп сватова",
        time: "10:00",
        icon: "gathering",
        location: "Код породице Ивановић",
        note: "Окупљање сватова",
      },
      {
        label: "Венчање",
        time: "12:30",
        icon: "church",
        location: "Храм Пресвете Богородице",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Hram+Presvete+Bogorodice",
        note: "Свечани чин венчања у храму.",
      },
      {
        label: "Свечани ручак",
        time: "15:00",
        icon: "restaurant",
        location: "Сала „Гранд”, Ново Село",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Sala+Grand+Novo+Selo",
        note: "Свечани ручак у сали „Гранд”.",
      },
      {
        label: "Грађанско венчање",
        time: "16:15",
        icon: "civil",
        location: "Сала „Гранд”, Ново Село",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Sala+Grand+Novo+Selo",
        note: "Грађанско венчање.",
      },
    ],

    showDressCode: true,
    dressCodeTitle: "Стил облачења",
    dressCodePalette: [],
    dressCodeNote:
      "Обуците шта вам најлепше стоји, а понесите добро расположење.",

    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Sala+Grand+Novo+Selo",

    note: "Молимо вас да свој долазак потврдите до 20. августа 2026.",
    rsvpText: "Молимо вас да свој долазак потврдите до 20. августа 2026.",
    rsvpDeadline: "20.08.2026.",
    rsvpDeadlineISO: "2026-08-20",
    rsvpSignature: "Породице Рајковић и Ивановић",
  }),
},

{
  slug: "nina-andrija",
  type: "wedding",
  template: "silk",
 

  brideName: "Nina",
  groomName: "Andrija",

  videoSrc: "/videos/jovana-nikola-4.mp4",
musicSrc: "/music/nina-andrija.mp3",

  fontMode: "light",

  weddingDate: "20 SEP 2026",
  weddingTime: "10:00",
  venue: "Woodland Resort, Kragujevac",

  backgroundImage: "/images/jovana-nikola-minimal-1.jpg",

  details: createDetails({
    welcomeText:
      "Sa velikom radošću pozivamo Vas da sa nama proslavite naš dan ljubavi.",

    date: "20 SEP 2026",
    dateISO: "2026-09-20T10:00:00+02:00",

    showCalendarButton: true,
    calendarDurationHours: 12,

    events: [
      {
        label: "Skup svatova",
        time: "10:00",
        icon: "gathering",
        location: "Kod porodice Radovanović",
      },
      {
        label: "Skup svatova",
        time: "11:30",
        icon: "gathering",
        location: "Kod porodice Savić",
      },
      {
        label: "Crkveno venčanje",
        time: "13:00",
        icon: "church",
        location: "Svetouspenski saborni hram, Kragujevac",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Svetouspenski+saborni+hram+Kragujevac",
      },
      {
        label: "Koktel dobrodošlice i okupljanje gostiju",
        time: "15:00",
        icon: "gathering",
        location: "Woodland Resort",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Woodland+Resort+Kragujevac",
      },
      {
        label: "Svečani ručak",
        time: "16:00",
        icon: "restaurant",
        location: "Woodland Resort",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Woodland+Resort+Kragujevac",
      },
    ],

    showDressCode: false,

    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Woodland+Resort+Kragujevac",

    note: "Molimo Vas da svoj dolazak potvrdite do 15. avgusta 2026. godine.",
    rsvpText: "Molimo Vas da svoj dolazak potvrdite do 15. avgusta 2026. godine.",
    rsvpDeadline: "15.08.2026.",
    rsvpDeadlineISO: "2026-08-15",
  }),
},

{
  slug: "marina-ilija",
  type: "wedding",
  template: "silk",

  brideName: "Marina",
  groomName: "Ilija",

  videoSrc: "/videos/jovana-stefan.mp4",
  musicSrc: "/music/mina-dragan.mp3",

  fontMode: "light",

  weddingDate: "13 SEP 2026",
  weddingTime: "15:30",
  venue: "Restoran Belwood wedding centar Ada",

  backgroundImage: "/images/jovana-stefan-minimal.jpg",

  details: createDetails({
    welcomeText:
      "Biće nam izuzetno drago da svojim prisustvom ulepšate naš poseban dan.",

    date: "13 SEP 2026",
    dateISO: "2026-09-13T15:30:00+02:00",

    venue: "Restoran Belwood wedding centar Ada",

    showCalendarButton: true,
    calendarDurationHours: 9,

    events: [
      {
        label: "Crkveno venčanje",
        time: "15:30",
        icon: "church",
        location: "Saborna crkva",
        mapLink:
          "https://www.google.com/maps?q=Cathedral+Church+of+Saint+Michael+the+Archangel,+Tomb+of+Vuk+Karadzic,+Kneza+Sime+Markovi%C4%87a,+Beograd+11000&ftid=0x475a654db6ac097d:0x98763d658b7a685f&entry=gps&shh=CAE&lucs=,94297699,94231188,94280568,47071704,94218641,94282134,100813464,94286869&g_ep=CAISEjI2LjI1LjMuOTMyMTI1MTg3MBgAIIgnKkksOTQyOTc2OTksOTQyMzExODgsOTQyODA1NjgsNDcwNzE3MDQsOTQyMTg2NDEsOTQyODIxMzQsMTAwODEzNDY0LDk0Mjg2ODY5QgJSUw%3D%3D&skid=cc9aa62e-1347-42ff-9079-757c736be7b5&g_st=ii",
      },
      {
        label: "Okupljanje gostiju",
        time: "16:00",
        icon: "gathering",
        location: "Restoran Belwood wedding centar Ada",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Belwood+wedding+centar+Ada+Beograd",
      },
      {
        label: "Građansko venčanje",
        time: "17:00",
        icon: "civil",
        location: "Restoran Belwood wedding centar Ada",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Belwood+wedding+centar+Ada+Beograd",
      },
    ],

    showDressCode: true,
    dressCodeTitle: "Dress code",
    dressCodePalette: [],
    dressCodeNote:
      "Svečano i elegantno, u stilu koji vam najviše odgovara i prija.",

    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Belwood+wedding+centar+Ada+Beograd",

    note: "Molimo vas da svoj dolazak potvrdite do 01.09.2026.",
    rsvpText: "Molimo vas da svoj dolazak potvrdite do 01.09.2026.",
    rsvpDeadline: "01.09.2026.",
    rsvpDeadlineISO: "2026-09-01",
  }),
},

{
  slug: "jovana-aleksandar",
  type: "wedding",
  template: "silk",

  brideName: "Jovana Nikolić",
  groomName: "Aleksandar Vukosavljević",

  videoSrc: "/videos/jovana-stefan.mp4",
  musicSrc: "/music/jovana-aleksandar.mp3",
 uploadCoverImage: "/images/upload/jovana-aleksandar-upload.jpg",
  fontMode: "light",

  weddingDate: "16 AVG 2026",
  weddingTime: "17:00",
  venue: "Restoran Vidikovac, Niš",

  backgroundImage: "/images/jovana-stefan-minimal.jpg",

  details: createDetails({
    welcomeText:
      "Biće nam izuzetno drago da svojim prisustvom ulepšate naš poseban dan.",
rsvpOptions: {
  fasting: true,
},
    date: "16.08.2026.",
    dateISO: "2026-08-16T17:00:00+02:00",

    venue: "Restoran Vidikovac, Niš",

    showCalendarButton: true,
    calendarDurationHours: 7,

    events: [
      {
        label: "Skup gostiju",
        time: "17:00",
        icon: "gathering",
        location: "Restoran Vidikovac, Niš",
        mapLink:
          "https://www.google.rs/maps/place/Hotel+Vidikovac/@43.3049147,21.9114184,17z/data=!3m1!4b1!4m9!3m8!1s0x4755b16d66585f8d:0xbb8adf1b3cab20ad!5m2!4m1!1i2!8m2!3d43.3049147!4d21.9114184!16s%2Fg%2F11fkw8qhyf?hl=en&entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D",
      },
      {
        label: "Građansko venčanje",
        time: "18:00",
        icon: "civil",
        location: "Restoran Vidikovac, Niš",
        mapLink:
          "https://www.google.rs/maps/place/Hotel+Vidikovac/@43.3049147,21.9114184,17z/data=!3m1!4b1!4m9!3m8!1s0x4755b16d66585f8d:0xbb8adf1b3cab20ad!5m2!4m1!1i2!8m2!3d43.3049147!4d21.9114184!16s%2Fg%2F11fkw8qhyf?hl=en&entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D",
      },
    ],

    showDressCode: false,
    dressCodeTitle: "Dress code",
    dressCodePalette: [],
    dressCodeNote: "",

    mapLink:
      "https://www.google.rs/maps/place/Hotel+Vidikovac/@43.3049147,21.9114184,17z/data=!3m1!4b1!4m9!3m8!1s0x4755b16d66585f8d:0xbb8adf1b3cab20ad!5m2!4m1!1i2!8m2!3d43.3049147!4d21.9114184!16s%2Fg%2F11fkw8qhyf?hl=en&entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D",

    note: "Molimo vas da svoj dolazak potvrdite do 01.08.2026.",
    rsvpText: "Molimo vas da svoj dolazak potvrdite do 01.08.2026.",
    rsvpDeadline: "01.08.2026.",
    rsvpDeadlineISO: "2026-08-01",
  }),
},

{
  slug: "dijana-pavle",
  type: "wedding",
  template: "photo-card-split-video",

  brideName: "Dijana",
  groomName: "Pavle",

  videoSrc: "/videos/dijana-pavle.mp4",
  musicSrc: "/music/dijana-pavle.mp3",

  weddingDate: "10 OKT 2026",
  weddingTime: "16:00",
  venue: "Glamoure Event Center",

  introText: "Radujemo se da ovaj dan podelimo sa vama.",

  details: createDetails({
    welcomeText:
      "Sa velikom radošću vas pozivamo da budete deo našeg posebnog dana.",

    date: "10 OKT 2026",
    dateISO: "2026-10-10T16:00:00+02:00",

    venue: "Glamoure Event Center",

    showCalendarButton: true,
    calendarDurationHours: 9,

    events: [
      {
        label: "Crkveno venčanje",
        time: "13:30",
        icon: "church",
        location: "Saborna crkva",
        mapLink:
          "https://www.google.com/maps?q=Cathedral+Church+of+Saint+Michael+the+Archangel,+Tomb+of+Vuk+Karadzic,+Kneza+Sime+Markovi%C4%87a,+Beograd+11000&ftid=0x475a654db6ac097d:0x98763d658b7a685f&entry=gps&shh=CAE&lucs=,94297699,94231188,94280568,47071704,94218641,94282134,100813464,94286869&g_ep=CAISEjI2LjI1LjMuOTMyMTI1MTg3MBgAIIgnKkksOTQyOTc2OTksOTQyMzExODgsOTQyODA1NjgsNDcwNzE3MDQsOTQyMTg2NDEsOTQyODIxMzQsMTAwODEzNDY0LDk0Mjg2ODY5QgJSUw%3D%3D&skid=cc9aa62e-1347-42ff-9079-757c736be7b5&g_st=ii",
      },
      {
        label: "Skup gostiju",
        time: "15:00",
        icon: "gathering",
        location: "Glamoure Event Center",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Glamoure+Event+Center",
      },
      {
        label: "Građansko venčanje",
        time: "16:00",
        icon: "civil",
        location: "Glamoure Event Center",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Glamoure+Event+Center",
      },
    ],

    showDressCode: false,

    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Glamoure+Event+Center",

    note: "Molimo vas da svoj dolazak potvrdite do 30.09.2026.",
    rsvpText: "Molimo vas da svoj dolazak potvrdite do 30.09.2026.",
    rsvpDeadline: "30.09.2026.",
    rsvpDeadlineISO: "2026-09-30",

    theme: {
      backgroundColor: "#f7efe9",
      mainText: "#5f544d",
      softText: "#7c7068",
      mutedText: "#8d7d72",
      accent: "#b11c3f",
      accentStrong: "#981835",
      buttonText: "#ffffff",
      rsvpButtonBg: "#981835",
      rsvpButtonText: "#ffffff",
      cardBg: "rgba(255,255,255,0.45)",
      cardBorder: "rgba(152,24,53,0.14)",
      dividerLine: "rgba(152,24,53,0.28)",
      paperOverlayTop: "rgba(255,250,245,0.98)",
      paperOverlayBottom: "rgba(244,236,229,0.98)",

      introMainText: "#ffffff",
      introAccent: "#ffffff",
      introButtonBg: "rgba(255,255,255,0.18)",
      introButtonBorder: "#2a2a2a43",
      introButtonText: "#2a2a2a",
    },
  }),
},

{
  slug: "aleksandra-aleksa",
  type: "wedding",
  template: "envelope-split-v2-editorial",

  brideName: "Aleksandra",
  groomName: "Aleksa",

  weddingDate: "03 OKT 2026",
  weddingTime: "15:00",
  venue: "Diamond Garden, Beograd",

  image1: "/images/nevena-pedja/location.jpg", // zameni kad budeš imala pravu sliku
  musicSrc: "/music/aleksandra-aleksa.mp3",

  details: createDetails({
    welcomeText:
      "Sa velikom radošću vas pozivamo da budete deo našeg posebnog dana.",

    date: "03.10.2026.",
    dateISO: "2026-10-03T15:00:00+02:00",

    venue: "Diamond Garden, Beograd",

    showCalendarButton: true,
    calendarDurationHours: 10,

    events: [
      {
        label: "Crkveno venčanje",
        time: "15:00",
        icon: "church",
        location: "Crkva Svetog Save, Vračar",
        mapLink:
          "https://www.google.com/maps?vet=10CAAQoqAOahcKEwig05DH_cKVAxUAAAAAHQAAAAAQDA..i&pvq=Cg0vZy8xMWp6eWdsbGN2IgsKBWNya3ZhEAIYAw&lqi=Chljcmt2YSBzdmV0b2cgc2F2ZSBiZW9ncmFkSPqSpdf7sICACFovEAAYABgBGAIYAyIZY3JrdmEgc3ZldG9nIHNhdmUgYmVvZ3JhZCoECAIQADICc3KSAQ9vcnRob2RveF9jaHVyY2g&fvr=1&cs=0&um=1&ie=UTF-8&fb=1&gl=rs&sa=X&ftid=0x475a710f60dbaab5:0xcc14c28de0839597",
      },
      {
        label: "Okupljanje gostiju",
        time: "16:00",
        icon: "gathering",
        location: "Diamond Garden, Beograd",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Diamond+Garden+Beograd",
      },
      {
        label: "Građansko venčanje",
        time: "17:00",
        icon: "civil",
        location: "Diamond Garden, Beograd",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Diamond+Garden+Beograd",
      },
    ],

    showDressCode: false,

    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Diamond+Garden+Beograd",

    note: "Molimo vas da svoj dolazak potvrdite do 15.09.2026.",
    rsvpText: "Molimo vas da svoj dolazak potvrdite do 15.09.2026.",
    rsvpDeadline: "15.09.2026.",
    rsvpDeadlineISO: "2026-09-15",

    showRsvpText: true,
  }),
},
{
  slug: "doroteja-dragan",
  type: "wedding",
  template: "italian-envelope-video",

  brideName: "Doroteja",
  groomName: "Dragan",

  weddingDate: "25.09.2026.",
  weddingTime: "15:00",
  venue: "Sala Faena, Ada Ciganlija",

  videoSrc: "/videos/tamara-ratko.mp4",
  musicSrc: "/music/doroteja-dragan.mp3",

  details: createDetails({
    welcomeText:
      "Sa velikom radošću vas pozivamo da zajedno proslavimo venčanje Doroteje i Dragana i Stefanovo krštenje.",

    heroText: "VENČANJE",
    heroScriptText: "Stefanovo",
    heroSubText: "KRŠTENJE",

    showCalendarButton: true,
    calendarDurationHours: 8,

    date: "25.09.2026.",
    dateISO: "2026-09-25T15:00:00+02:00",

    cloudLeft: "/images/italian-clouds/cloud-left.svg",
    cloudRight: "/images/italian-clouds/cloud-right.svg",

    hideRsvpPhotoBlock: true,


    letterIntro: "Dragi naši,",

    letterText1:
      "Sa velikom radošću vas pozivamo da budete deo venčanja Doroteje i Dragana.",

    letterText2:
      "Istog dana proslavljamo i Stefanovo krštenje, zato će nam biti posebno drago da ovaj dan podelimo sa vama.",

    events: [
      {
        label: "Venčanje i krštenje",
        time: "15:00",
        icon: "church",
        location: "Crkva Svetog Marka, Beograd",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Crkva+Svetog+Marka+Beograd",
      },
      {
        label: "Proslava",
        time: "17:00",
        icon: "restaurant",
        location: "Sala Faena, Ada Ciganlija",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Sala+Faena+Ada+Ciganlija+Beograd",
      },
    ],

    showDressCode: false,
    dressCodeTitle: "",
    dressCodePalette: [],
    dressCodeNote: "",

    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Sala+Faena+Ada+Ciganlija+Beograd",

    note: "Molimo vas da svoj dolazak potvrdite do 01.09.2026.",
    rsvpText: "Molimo vas da svoj dolazak potvrdite do 01.09.2026.",
    rsvpDeadline: "01.09.2026.",
    rsvpDeadlineISO: "2026-09-01",
  }),
},

{
  slug: "nikoleta-marko",
  type: "wedding",
  template: "envelope-split-v2-photo-card",
  script: "cyrillic",

  brideName: "Николета",
  groomName: "Марко",

  weddingDate: "10 ОКТ 2026",
  weddingTime: "12:00",
  venue: "Ресторан „Језеро“, Ада Циганлија, Чукарица",
musicSrc: "/music/nikoleta-marko.mp3",
  /*
    Фотографија која се приказује преко целог екрана
    након отварања коверте.
  */
  introPreviewImage: "/images/nikoleta-marko/intro.jpg",

  details: {
    cardBackgroundImage: "/images/nikoleta-marko/card-bg.jpg",

 welcomeText:
  "Драги наши, имамо најлепши разлог да вас окупимо – дошло је време за наше венчање. Своје судбоносно „ДА“ изговорићемо два пута. Први пут под сводовима Цркве Рођења Пресвете Богородице, а други пут у ресторану „Језеро“. Било би нам неизмерно драго да будете део нашег посебног дана и да то чујете лично.",

    date: "10 ОКТ 2026",
    dateISO: "2026-10-10T12:00:00+02:00",

   

    showCalendarButton: false,
    showDressCode: false,

  events: [
  {
    label: "Окупљање сватова породице Илић",
    time: "12:00",
    icon: "gathering",
    location: "Палмира Тољатија 22а, Нови Београд",
  mapLink:
  "https://www.google.com/maps/search/?api=1&query=Palmira+Toljatija+22a+Novi+Beograd",
  },
  {
    label: "Окупљање сватова породице Кецојевић",
    time: "12:30",
    icon: "party",
    location: "Ресторан „Стара Пивница“, Земун",
    mapLink:
      "https://www.google.com/maps/place/stara+pivnica+bezanijska+2/data=!4m2!3m1!1s0x475a655ea82a5f13:0x93f2f3ecd9bea105?sa=X&ved=1t:242&ictx=111",
  },
  {
    label: "Црквено венчање",
    time: "14:15",
    icon: "church",
    location:
      "Црква Рођења Пресвете Богородице, Рајачићева, Земун",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Crkva+Rodjenja+Presvete+Bogorodice+Rajaciceva+Zemun",
  },
  {
    label: "Окупљање гостију",
    time: "16:00",
    icon: "restaurant",
    location: "Ресторан „Језеро“, Ада Циганлија, Чукарица",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Restoran+Jezero+Ada+Ciganlija+Beograd",
  },
  {
    label: "Грађанско венчање",
    time: "16:30",
    icon: "civil",
    location: "Ресторан „Језеро“, Ада Циганлија, Чукарица",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Restoran+Jezero+Ada+Ciganlija+Beograd",
  },
],

    rsvpDeadline: "10.09.2026.",
    rsvpDeadlineISO: "2026-09-10",

    rsvpText:
      "Молимо вас да свој долазак потврдите до 10.09.2026.",

    note:
      "Молимо вас да свој долазак потврдите до 10.09.2026.",

    theme: {
      backgroundColor: "#f7f3eb",

      mainText: "#4d4338",
      softText: "#766858",
      mutedText: "#8b7c69",

      accent: "#b3924d",
      accentStrong: "#8e6d2e",

      cardBg: "rgba(255,255,255,0.70)",
      cardBorder: "rgba(179,146,77,0.20)",
      frameBorder: "rgba(179,146,77,0.18)",
      dividerLine: "rgba(179,146,77,0.44)",

      rsvpButtonBg: "#b3924d",
      rsvpButtonText: "#ffffff",
    },
  },
},

{
  slug: "eva-1",
  type: "birthday",
  template: "birthday-eva",
  script: "cyrillic",

  brideName: "Ева",
  title: "Први рођендан",
videoSrc: "/videos/eva-1.mp4",
  weddingDate: "13. август 2026.",
  weddingTime: "17:00",
  venue: "Вила Вико-Ченеј",
musicSrc: "/music/eva-1.mp3",
  introPreviewImage: "/images/eva/eva-intro-bg.png",
  babyImage: "/images/eva/eva-bear.svg",
  introText: "слави свој први рођендан",

  backgroundImage: "/images/eva/eva-bg.png",

  details: createDetails({
    welcomeText: "Радујемо се Вашем доласку!",

    date: "13. август 2026.",
    dateISO: "2026-08-13T17:00:00+02:00",

    venue: "Вила Вико-Ченеј",

    note: "Молимо вас да долазак потврдите до 3. августа.",
    rsvpText: "Молимо вас да долазак потврдите до 3. августа.",

    showCalendarButton: true,
    calendarDurationHours: 4,
  }),
},

{
  slug: "tadija-1",
  type: "birthday",
  template: "birthday-gallery",
  script: "latin",

  brideName: "Tadija",

  weddingDate: "25 SEP 2026",
  weddingTime: "17:00",

  venue:
    "Restoran Bolji život 2 (Elektronska industrija)",

  backgroundImage: "/images/tadija-1-bg.jpg",
musicSrc: "/music/eva-1.mp3",
  /*
   * Ove tri slike ostaju kao fallback
   * za delove template-a koji koriste
   * image1, image2 i image3.
   */
  image1: "/images/tadija-1/tadija-1-1.jpg",
  image2: "/images/tadija-1/tadija-1-2.jpg",
  image3: "/images/tadija-1/tadija-1-3.jpg",

  details: createDetails({
    age: 1,

    /*
     * Slider koristi svih šest slika.
     */
    sliderImages: [
      "/images/tadija-1/tadija-1-1.jpg",
      "/images/tadija-1/tadija-1-2.jpg",
      "/images/tadija-1/tadija-1-3.jpg",
      "/images/tadija-1/tadija-1-4.jpg",
      "/images/tadija-1/tadija-1-5.jpg",
      "/images/tadija-1/tadija-1-6.jpg",
    ],

    date: "25.09.2026.",
    dateISO: "2026-09-25T17:00:00+02:00",

    welcomeText:
      "Lete dani kao ptica, prođe jedna godinica. Došao je i taj dan, Tadija slavi prvi rođendan!",

    venue:
      "Restoran Bolji život 2                                         (Elektronska industrija)",

    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Restoran+Bolji+zivot+2+Elektronska+industrija",

    note:
      "Molimo vas da svoj dolazak potvrdite najkasnije do 15.09.2026.",

    rsvpDeadline: "15.09.2026.",
    rsvpDeadlineISO: "2026-09-15",

    /* =========================
       SVE BOJE TEMPLATE-A
    ========================= */

    theme: {
      /* =========================
         OPŠTE BOJE
      ========================= */

      backgroundColor: "#B2BC9A",

      mainText: "#343923",
      softText: "#656B4E",
      mutedText: "#858A6A",

      accent: "#B5985F",
      accentStrong: "#947641",

      buttonBackground: "#4A332A",
      buttonText: "#FFF9F0",
      buttonBorder: "#4A332A",

      /* =========================
         INTRO
      ========================= */

      introCardBackground:
        "rgba(255, 250, 239, 0.06)",

      introMainText: "#3D2B24",
      introSoftText: "#FFF8EA",
      introAccent: "#D6BE89",

      introButtonBg: "#3D2B24",
      introButtonText: "#FFF9F0",

      introButtonBorder:
        "rgba(255, 249, 240, 0.22)",

      /* =========================
         GLAVNA KARTICA
      ========================= */

      cardMainText: "#4A332A",
      cardSoftText: "#3D2B24",
      cardAccent: "#3D2B24",

      cardKickerText: "#4A332A",
      cardTitleText: "#3D2B24",
      cardSubtitleText: "#4A332A",

      cardCalendarText: "#4A332A",
      cardCalendarDayText: "#3D2B24",

      cardInfoLabelText: "#947641",
      cardInfoValueText: "#343923",

      cardFooterText: "#4A332A",

      cardOverlay:
        "rgba(71, 78, 47, 0.16)",

      cardSurfaceBackground:
        "rgba(255, 252, 244, 0.08)",

      cardSurfaceBorder:
        "rgba(255, 252, 244, 0.12)",

      cardInfoBackground:
        "rgba(250, 246, 235, 0.92)",

      cardInfoBorder:
        "rgba(71, 78, 47, 0.18)",

      cardDivider:
        "rgba(71, 78, 47, 0.20)",

      cardCalendarHeaderBackground:
        "#4A332A",

      cardCalendarHeaderText:
        "#FFF9F0",

      cardCalendarBackground:
        "rgba(250, 246, 235, 0.94)",

      cardCalendarBorder:
        "rgba(71, 78, 47, 0.18)",

      cardCalendarDayBackground:
        "linear-gradient(180deg, #F7F1E2 0%, #EDE3CB 100%)",

      cardCalendarRing:
        "rgba(181, 152, 95, 0.30)",

      cardButtonBackground: "#4A332A",
      cardButtonText: "#FFF9F0",
      cardButtonBorder: "#4A332A",

      cardGlowOne:
        "rgba(237, 224, 187, 0.28)",

      cardGlowTwo:
        "rgba(150, 158, 103, 0.20)",

      /* =========================
         RSVP
      ========================= */

      rsvpPageBackground: "#6C7450",

      rsvpMainText: "#343923",
      rsvpSoftText: "#656B4E",
      rsvpAccent: "#9B7D48",

      rsvpKickerText: "#9B7D48",
      rsvpTitleText: "#343923",
      rsvpSubtitleText: "#656B4E",

      rsvpLabelText: "#343923",

      rsvpInputText: "#343923",
      rsvpPlaceholderText: "#858A6A",

      rsvpChoiceTitleText: "#343923",
      rsvpChoiceText: "#656B4E",

      rsvpOverlay:
        "rgba(82, 90, 55, 0.22)",

      rsvpCardBackground:
        "rgba(250, 246, 235, 0.94)",

      rsvpCardBorder:
        "rgba(71, 78, 47, 0.18)",

      rsvpInputBackground:
        "rgba(255, 252, 244, 0.90)",

      rsvpInputBorder:
        "rgba(71, 78, 47, 0.23)",

      rsvpChoiceBackground:
        "rgba(255, 252, 244, 0.72)",

      rsvpChoiceActiveBackground:
        "rgba(108, 116, 80, 0.16)",

      rsvpChoiceActiveBorder: "#7C855C",

      rsvpDivider:
        "rgba(71, 78, 47, 0.18)",

      rsvpButtonBackground: "#4A332A",
      rsvpButtonText: "#FFF9F0",
      rsvpButtonBorder: "#4A332A",

      rsvpSuccess: "#8C7040",
      rsvpSuccessTitleText: "#343923",
      rsvpSuccessText: "#656B4E",

      /* =========================
         COUNTDOWN
      ========================= */

      countdownPageBackground: "#6C7450",

      countdownMainText: "#343923",
      countdownSoftText: "#656B4E",
      countdownAccent: "#9B7D48",

      countdownKickerText: "#9B7D48",
      countdownTitleText: "#343923",
      countdownSubtitleText: "#656B4E",

      countdownNumberText: "#343923",
      countdownLabelText: "#656B4E",

      countdownFinishedText: "#343923",

      countdownOverlay:
        "rgba(82, 90, 55, 0.22)",

      countdownCardBackground:
        "rgba(250, 246, 235, 0.92)",

      countdownCardBorder:
        "rgba(71, 78, 47, 0.18)",

      countdownUnitBackground:
        "rgba(255, 252, 244, 0.72)",

      countdownUnitBorder:
        "rgba(71, 78, 47, 0.18)",

      countdownButtonBackground: "#4A332A",
      countdownButtonText: "#FFF9F0",
      countdownButtonBorder: "#4A332A",

      countdownGlowOne:
        "rgba(237, 224, 187, 0.26)",

      countdownGlowTwo:
        "rgba(150, 158, 103, 0.18)",
    },

    /* =========================
       INTRO
    ========================= */

    birthdayIntro: {
      buttonText: "Otvorite pozivnicu",
    },

    /* =========================
       COUNTDOWN I KALENDAR
    ========================= */

    birthdayGalleryCountdown: {
      showCalendarButton: true,

      /*
       * Događaj u kalendaru traje
       * od 17:00 do 21:00.
       */
      calendarDurationHours: 4,
    },
  }),
},

{
  slug: "nina-milan",
  type: "wedding",
  template: "split-video",

  brideName: "Nina",
  groomName: "Milan",

  videoSrc: "/videos/nina-milan.mp4",
  musicSrc: "/music/nina-milan.mp3",
 uploadCoverImage: "/images/upload/birthday-glass-upload.jpg",
  weddingDate: "23 AVG 2026",
  weddingTime: "16:00",
  venue: "Garni Hotel Oblačinsko Jezero",

  introText: "Radujemo se da ovaj dan podelimo sa vama.",

  details: createDetails({
    backgroundImage: "/images/nina-milan-split.jpg",

    welcomeText:
      "Biće nam veliko zadovoljstvo da svojim prisustvom ulepšate naš poseban dan.",

    date: "23 AVG 2026",
    dateISO: "2026-08-23T16:00:00+02:00",

    showCalendarButton: false,

    events: [
      {
        label: "Okupljanje gostiju",
        time: "16:00",
        location: "Bašta restorana",
        mapLink:
          "https://maps.app.goo.gl/zXUEBhvvcvomiikN9?g_st=ipc",
        note:
          "Početak okupljanja i dragi susreti pre ceremonije.",
      },
      {
        label: "Ceremonija građanskog venčanja",
        time: "17:15",
        location: "Plaža",
        mapLink:
          "https://maps.app.goo.gl/zXUEBhvvcvomiikN9?g_st=ipc",
        note:
          "Trenutak kada počinje naše novo poglavlje.",
      },
      {
        label: "Večera",
        time: "18:00",
        location: "Bašta restorana",
        mapLink:
          "https://maps.app.goo.gl/zXUEBhvvcvomiikN9?g_st=ipc",
        note:
          "Veče uz muziku, nazdravljanje i slavlje.",
      },
      {
        label: "Torta",
        time: "21:00",
        location: "Bašta restorana",
        mapLink:
          "https://maps.app.goo.gl/zXUEBhvvcvomiikN9?g_st=ipc",
        note:
          "Slatki trenutak koji ćemo podeliti sa svima vama.",
      },
    ],

    theme: {
      mainText: "#ffffff",
      softText: "#ffffff",
      scriptText: "#ffffff",
      mutedText: "#ffffff",

      accent: "#ffffff",
      accentStrong: "#ffffff",
      buttonText: "#000000",

      cardBg: "rgba(255, 255, 255, 0.1)",
      cardBorder: "transparent",
      frameBorder: "rgba(255, 255, 255, 0.25)",

      paperOverlayTop: "rgba(255, 255, 255, 0.03)",
      paperOverlayBottom: "rgba(36, 59, 107, 0.06)",
      vignetteColor: "rgba(123, 18, 52, 0.08)",

      flowLine: "#ffffff",
      dividerLine: "#ffffff",
      nodeRing: "rgba(181, 144, 59, 0.16)",
      backgroundColor: "#000000",

      /* INTRO */
      introMainText: "#ffffff",
      introAccent: "#ffffff",
      introButtonBg: "rgba(255, 255, 255, 0.18)",
      introButtonBorder: "rgba(255, 255, 255, 0.35)",
      introButtonText: "#000000",
      introButtonHoverBg: "rgba(255, 255, 255, 0.28)",

      /* RSVP */
      rsvpButtonBg: "#a24242",
      rsvpButtonText: "#ffffff",
    },

    showDressCode: true,
    dressCodeTitle: "Dress code",

    dressCodeNote:
      "Birajte nežne zemljane i puderaste tonove.",

  
dressCodeWomenPalette: [
  "#8F9C70", // maslinasta
  "#C7B299", // tamnija bež
  "#D4D4D4", // svetlo siva
  "#FFFCB7", // svetlo žuta
],


dressCodeMenPalette: [
  "#111111", // crna
  
  "#8F9C70", // maslinasta
  
  "#C7B299", // tamnija bež
   "#D4D4D4", // svetlo siva
  "#FFFFFF", // bela
],

    venue: "Garni Hotel Oblačinsko Jezero",

    mapLink:
      "https://maps.app.goo.gl/zXUEBhvvcvomiikN9?g_st=ipc",

    note:
      "Molimo vas da svoj dolazak potvrdite do 08.08.",
  }),
},


{
  slug: "elena-18-3",
  type: "birthday",
  template: "birthday-intro",
  script: "latin",

  brideName: "Elena",

  weddingDate: "12.09.2026.",
  weddingTime: "18:00",
  venue: "Svečana sala Lollywood",

  musicSrc:
    "/music/eva-1.mp3",

  introPreviewImage:
    "/images/elena-intro-3/background.webp",
  uploadCoverImage: "/images/upload/birthday-glass-upload.jpg",

  details: createDetails({
    age: 18,

    date:
      "12.09.2026.",

    dateISO:
      "2026-09-12T18:00:00+02:00",

    welcomeText:
      "Pozivamo vas da zajedno proslavimo Elenin 18. rođendan.",

    venue:
      "Svečana sala Lollywood",

    locationName:
      "Svečana sala Lollywood",

    locationAddress:
      "Savska 2a, Ostružnica",

    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Svecana+sala+Lollywood+Savska+2a+Ostruznica",

    showCalendarButton: true,

    showDressCode: true,

    dressCodeTitle:
      "Dress code",

    dressCodeNote:
      "Sve boje su dozvoljene osim bele i baby roze.",

    dressCodePalette: [],

    note:
      "Molimo vas da svoj dolazak potvrdite do 01.09.2026.",

    rsvpText:
      "Molimo vas da svoj dolazak potvrdite do 01.09.2026.",

    /*
     * Pozadina invitation card sekcije
     */
    cardBackground:
      "/images/elena-intro-3/elena-card-background.webp",

    /*
     * Pozadina RSVP sekcije
     */
    rsvpImage:
      "/images/elena-intro-3/elena-rsvp-background.webp",

    /*
     * Countdown sekcija
     */
    birthdayGalleryCountdown: {
      backgroundImage:
        "/images/elena-intro-3/elena-countdown-background.webp",

      kicker:
        "ODBROJAVANJE",

      title:
        "DO PROSLAVE JE OSTALO",

      finishedTitle:
        "POSEBAN DAN JE STIGAO",

      finishedText:
        "Vidimo se na proslavi!",

      calendarButtonText:
        "DODAJ U KALENDAR",

      calendarHint:
        "Sačuvajte datum proslave u svom telefonu.",

      showCalendarButton: true,
    },

    /*
     * Intro sekcija
     */
    birthdayIntro: {
      backgroundImage:
        "/images/elena-intro-3/background.webp",

      backgroundPosition:
        "center top",

      backgroundSize:
        "cover",

      name:
        "Elena",

      age:
        18,

      date:
        "12.09.2026.",

      birthdayLabel:
        "ROĐENDAN",

      buttonText:
        "POGLEDAJ POZIVNICU",

      contentTop:
        "18.5%",

      buttonBottom:
        "7.5%",

      /*
       * Hladnija srebrno-šampanj paleta
       * samo za ovu treću verziju.
       */
      textColor:
        "#7d7778",

      accentColor:
        "#aaa2a3",

      nameColor:
        "#8f8788",

      ageColor:
        "#8f8788",

      nameGradient:
        "linear-gradient(180deg, #6f6a6c 0%, #b8b1b2 18%, #f1eeee 38%, #aaa2a4 56%, #7c7577 76%, #c9c2c3 100%)",

      ageGradient:
        "linear-gradient(180deg, #6d686a 0%, #b5adaf 18%, #eee9ea 38%, #a79fa1 58%, #777173 78%, #c5bdbe 100%)",

      buttonBackground:
        "rgba(250, 248, 248, 0.8)",

      buttonTextColor:
        "#777173",

      buttonBorderColor:
        "rgba(164, 156, 158, 0.48)",

      pageBackground:
        "#f5efed",
    },
  }),
},

{
  slug: "marija-nikola",
  type: "wedding",
  template: "silk",

  brideName: "Marija",
  groomName: "Nikola",

  videoSrc: "/videos/marija-nikola.mp4",
  musicSrc: "/music/marija-nikola-1.mp3",
  fontMode: "dark",

  weddingDate: "07 NOV 2026",
  weddingTime: "14:30",
  venue: "The Dream Event Venue, Beton hala",

  backgroundImage: "/images/marija-nikola-minimal.jpg",

  details: createDetails({
 welcomeText:
  "Dragi naši,\nSa velikom radošću i uzbuđenjem, da svojim prisustvom upotpunite naš poseban dan, pozivamo vas na naše venčanje",

    date: "07 NOV 2026",
    dateISO: "2026-11-07T14:30:00+01:00",

    showCalendarButton: true,
    showDressCode: false,

    events: [
      {
        label: "Ceremonija crkvenog venčanja",
        time: "14:30",
        icon: "church",
        location:
          "Saborna crkva Svetog arhangela Mihaila",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Saborni+hram+Svetog+arhangela+Mihaila+Kneza+Sime+Markovica+3+Beograd",
      },
      {
        label: "Svečani prijem u restoranu",
        time: "15:30",
        icon: "gathering",
        location:
          "The Dream Event Venue, Beton hala",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=The+Dream+Event+Venue+Beton+hala+Karadjordjeva+2-4+Beograd",
      },
      {
        label: "Ceremonija građanskog venčanja",
        time: "16:30",
        icon: "civil",
        location:
          "The Dream Event Venue, Beton hala",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=The+Dream+Event+Venue+Beton+hala+Karadjordjeva+2-4+Beograd",
      },
    ],

    mapLink:
      "https://www.google.com/maps/search/?api=1&query=The+Dream+Event+Venue+Beton+hala+Karadjordjeva+2-4+Beograd",

    note:
      "Molimo vas da svoj dolazak potvrdite najkasnije do 25.10.2026.",
    rsvpText:
      "Molimo vas da svoj dolazak potvrdite najkasnije do 25.10.2026.",
  }),
},

{
  slug: "anja-18",
  type: "birthday",
  template: "birthday-intro",
  script: "latin",

  brideName: "Anja",

  weddingDate: "04.09.2026.",
  weddingTime: "19:00",
  venue: "Sala Grand M",

  musicSrc: "/music/eva-1.mp3",

  introPreviewImage:
    "/images/anja-18/background.webp",

  

  details: createDetails({
    age: 18,

    date: "04.09.2026.",

    dateISO:
      "2026-09-04T19:00:00+02:00",

    welcomeText:
      "Pozivamo vas da zajedno proslavimo Anjin 18. rođendan.",

    venue:
      "Sala Grand M",

    locationName:
      "Sala Grand M",

    locationAddress:
      "Novi Bečej",

    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Sala+Grand+M+Novi+Becej",

    showCalendarButton: true,

    showDressCode: false,

    note:
      "Molimo vas da svoj dolazak potvrdite do 28.08.2026.",

    rsvpText:
      "Molimo vas da svoj dolazak potvrdite do 28.08.2026.",

    /*
     * Ista poslata slika koristi se kao pozadina
     * invitation card sekcije.
     */
    cardBackground:
      "/images/anja-18/card.webp",

    /*
     * Pozadina RSVP sekcije
     */
    rsvpImage:
      "/images/anja-18/rsvp.webp",

    /*
     * Countdown sekcija
     */
    birthdayGalleryCountdown: {
      backgroundImage:
        "/images/anja-18/2.webp",

      kicker:
        "ODBROJAVANJE",

      title:
        "DO PROSLAVE JE OSTALO",

      finishedTitle:
        "POSEBAN DAN JE STIGAO",

      finishedText:
        "Vidimo se na proslavi!",

      calendarButtonText:
        "DODAJ U KALENDAR",

      calendarHint:
        "Sačuvajte datum proslave u svom telefonu.",

      showCalendarButton: true,
    },

    /*
     * Intro sekcija
     */
    birthdayIntro: {
      backgroundImage:
        "/images/anja-18/background.webp",

      backgroundPosition:
        "center top",

      backgroundSize:
        "cover",

      name:
        "Anja",

      age:
        18,

      date:
        "04.09.2026.",

      birthdayLabel:
        "ROĐENDAN",

      buttonText:
        "POGLEDAJ POZIVNICU",

      contentTop:
        "18.5%",

      buttonBottom:
        "7.5%",

      /*
       * Topla krem i šampanj paleta
       * prilagođena poslatoj pozadini.
       */
      textColor:
        "#89745f",

      accentColor:
        "#b99a72",

      nameColor:
        "#957653",

      ageColor:
        "#957653",

      nameGradient:
        "linear-gradient(180deg, #72583f 0%, #b89567 18%, #f5e4bd 38%, #aa8458 57%, #745a40 77%, #c8a777 100%)",

      ageGradient:
        "linear-gradient(180deg, #72583f 0%, #b89567 18%, #f5e4bd 38%, #aa8458 57%, #745a40 77%, #c8a777 100%)",

      buttonBackground:
        "rgba(255, 250, 241, 0.82)",

      buttonTextColor:
        "#80684f",

      buttonBorderColor:
        "rgba(177, 145, 105, 0.48)",

      pageBackground:
        "#f3e5d3",
    },
  }),
},

{
  slug: "nevena-aleksandar",
  type: "wedding",
  template: "split-video",
  script: "cyrillic",

  brideName: "Невена",
  groomName: "Александар",

  videoSrc: "/videos/nevena-aleksandar.mp4",
  musicSrc: "/music/nevena-aleksandar.mp3",

  weddingDate: "17 ОКТ 2026",
  weddingTime: "08:00",
  venue: "Империја Голд, Степојевац",

  uploadCoverImage:
    "/images/upload/birthday-glass-upload.jpg",

  introText:
    "Радујемо се да овај посебан дан поделимо са вама.",

  details: createDetails({
    backgroundImage:
      "/images/nevena-aleksandar-split.jpg",

    heroText: "и крштење Василије",

    welcomeText:
      "Са великом радошћу вас позивамо да заједно са нама прославите наше венчање и крштење Василије.",

    date: "17 ОКТ 2026",
    dateISO: "2026-10-17T08:00:00+02:00",

    showCalendarButton: true,
    calendarDurationHours: 10,

    events: [
      {
        label: "Скуп сватова код младожење",
        time: "08:00",
        icon: "gathering",
        location:
          "Угриновачки пут 42. део 12, Алтина",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Ugrinovacki+put+42+deo+12+Altina",
        note:
          "Окупљање сватова и припрема за полазак по младу.",
      },
      {
        label: "Скуп сватова код младе",
        time: "09:30",
        icon: "gathering",
        location: "Косјерићка 6, Ваљево",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Kosjericka+6+Valjevo",
        note:
          "Дочек сватова код младе и заједничко окупљање пред церемонију.",
      },
      {
        label:
          "Црквено венчање и крштење Василије",
        time: "12:30",
        icon: "church",
        location:
          "Црква Светог великомученика Георгија, Ваљево",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Crkva+Svetog+Velikomucenika+Georgija+Valjevo",
        note:
          "Свечани чин црквеног венчања и крштења Василије.",
      },
      {
        label: "Свечани ручак",
        time: "15:00",
        icon: "restaurant",
        location: "Imperia Gold, Степојевац",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Imperia+Gold+Stepojevac",
        note:
          "Након церемоније настављамо славље уз ручак, музику и најдраже госте.",
      },
    ],

    theme: {
      mainText: "#7b1234",
      softText: "#243b6b",
      scriptText: "#7b1234",
      mutedText: "#7b1234",

      accent: "#7b1234",
      accentStrong: "#243b6b",
      buttonText: "#ffffff",

      cardBg: "rgba(255,255,255,0.28)",
      cardBorder: "transparent",
      frameBorder: "rgba(123,18,52,0.20)",

      paperOverlayTop:
        "rgba(255,255,255,0.03)",
      paperOverlayBottom:
        "rgba(36,59,107,0.06)",
      vignetteColor:
        "rgba(123,18,52,0.08)",

      flowLine: "#7b1234",
      dividerLine:
        "rgba(123,18,52,0.25)",
      nodeRing:
        "rgba(181,144,59,0.16)",

      backgroundColor: "#f3ece6",

      /* INTRO */
      introMainText: "#7b1234",
      introAccent: "#7b1234",
      introButtonBg:
        "rgba(255,255,255,0.18)",
      introButtonBorder:
        "rgba(255,255,255,0.35)",
      introButtonText: "#ffffff",
      introButtonHoverBg:
        "rgba(255,255,255,0.28)",

      /* RSVP */
      rsvpButtonBg: "#7b1234",
      rsvpButtonText: "#ffffff",
    },

    showDressCode: false,
    dressCodeTitle: "",
    dressCodePalette: [],
    dressCodeNote: "",

    venue: "Imperia Gold, Степојевац",

    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Imperia+Gold+Stepojevac",

    note:
      "Молимо вас да свој долазак потврдите најкасније до 5. октобра.",

    rsvpText:
      "Молимо вас да свој долазак потврдите најкасније до 5. октобра.",
  }),
},

{
  slug: "ivana-dusan",
  type: "wedding",
  template: "silk-elegant-white",
  script: "cyrillic",

  brideName: "Ивана",
  groomName: "Душан",

  videoSrc: "/videos/ivana-dusan.mp4",
  musicSrc: "/music/ivana-dusan.mp3",

  fontMode: "light",

  weddingDate: "20 СЕП 2026",
  weddingTime: "11:00",
  venue: "Ресторан Златиборска ноћ",

  backgroundImage:
    "/images/ivana-dusan.jpg",

  details: createDetails({
    welcomeText:
      "Са великом радошћу вас позивамо да својим присуством улепшате наш посебан дан.",

    date: "20 СЕП 2026",
    dateISO: "2026-09-20T11:00:00+02:00",

    venue: "Ресторан Златиборска ноћ",

    showCalendarButton: false,
    showDressCode: false,

    events: [
      {
        label: "Црквено венчање",
        time: "11:00",
        icon: "church",
        location: "Црква Светог Марка, Ужице",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Crkva+Svetog+Marka+Uzice",
      },
      {
        label: "Грађанско венчање",
        time: "12:00",
        icon: "civil",
        location: "Градска кућа, Ужице",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Gradska+kuca+Uzice",
      },
      {
        label: "Прослава",
        time: "15:00",
        icon: "restaurant",
       location: "Ресторан „Златиборска ноћ“",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Restoran+Zlatiborska+noc+Uzice",
      },
    ],

    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Restoran+Zlatiborska+noc+Uzice",

    note:
      "Молимо вас да свој долазак потврдите до 5. септембра.",

    rsvpText:
      "Молимо вас да свој долазак потврдите до 5. септембра.",
  }),
},

{
  slug: "marija-nikola-1",
  type: "wedding",
  template: "silk-photo-script",
  script: "latin",

  brideName: "Marija",
  groomName: "Nikola",

  // Silk intro
 backgroundImage: "/images/silk-intro.jpg",
  videoSrc: "/videos/milica-nemanja-1.mp4",
 musicSrc: "/music/marija-nikola-5.mp3",

  weddingDate: "3. oktobar 2026.",
  weddingTime: "15:30",
  venue: "Restoran Švajcarija, Niš",

  introText:
    "Sa radošću vas pozivamo da budete deo našeg dana.",

  details: {
    script: "latin",

    dateISO: "2026-10-03T15:30:00+02:00",
    dateDisplay: "03.10.2026.",

    // Pozadina invitation card-a
    cardBackgroundImage:
      "/images/invitation-background.jpg",
    cardBackgroundPosition: "center",

    // Pozadina RSVP-a i countdown-a
    sectionBackgroundImage:
      "/images/invitation-background.jpg",
    sectionBackgroundPosition: "center",

    nameConnector: "heart",

    invitationKicker: "Pozivnica za venčanje",

    welcomeText:
      "Sa velikom radošću vas pozivamo da svojim prisustvom ulepšate početak našeg zajedničkog života.",

    events: [
   {
  time: "15:30",
  label: "Crkveno venčanje",
  location: "Crkva Svetog Vasilija Ostroškog, Niš",
  mapLink:
    "https://www.google.com/maps/search/?api=1&query=Crkva+Svetog+Vasilija+Ostroskog+Bulevar+Medijana+Nis",
  icon: "church",
},
      {
        time: "17:00",
        label: "Okupljanje gostiju",
        location: "Restoran Švajcarija, Niš",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Restoran+Svajcarija+Nis",
        icon: "gathering",
      },
  
    ],

    locationTitle: "Čekamo vas",
    locationPrefix: "na adresi",

    venue: "Restoran Švajcarija",
    venueAddress: "Niš",

    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Restoran+Svajcarija+Nis",

    mapButtonText: "Pogledaj lokaciju",

    // Bez dress koda
    showDressCode: false,

    note:
      "Molimo vas da dolazak potvrdite najkasnije do 1. septembra 2026.",

    // RSVP
    rsvpKicker: "Potvrda dolaska",
    rsvpTitle: "Radujemo se vašem odgovoru",

    rsvpSubtitle:
      "Molimo vas da potvrdite dolazak najkasnije do 1. septembra.",

    rsvpButtonText: "Pošalji potvrdu",
    rsvpMaxGuests: 10,

    // Countdown
    countdownKicker: "Odbrojavamo zajedno",
    countdownTitle: "Do našeg dana je ostalo",

    countdownNote:
      "Jedva čekamo da ovaj poseban trenutak podelimo sa vama.",

    countdownFinishedTitle: "Naš dan je stigao",
    countdownFinishedNote: "Vidimo se na proslavi!",

    // Dodavanje u kalendar
    showCalendarButton: true,
    calendarButtonText: "Dodaj u kalendar",

    calendarHint:
      "Sačuvajte datum venčanja u svom telefonu.",

    theme: {
      backgroundColor: "#e9e2d8",

      mainText: "#5b514a",
      softText: "#786c64",
      mutedText: "#978a80",

      accent: "#c2a078",
      accentStrong: "#916842",
      onAccent: "#fffaf3",

      locationSoftText: "#916842",

      cardPaper: "rgba(255, 255, 255, 0.30)",
      cardBorder: "rgba(113, 91, 74, 0.22)",
      cardInnerBorder: "rgba(113, 91, 74, 0.15)",
      cardShadow: "rgba(55, 43, 35, 0.14)",

      cardPhotoOverlay: "rgba(245, 240, 233, 0.01)",
      cardPhotoOverlayBottom:
        "rgba(245, 237, 229, 0.30)",

      sectionOverlay: "rgba(255, 255, 255, 0.30)",
      cardBg: "rgba(255, 252, 247, 0.48)",
      inputBg: "rgba(255, 253, 249, 0.62)",

      rsvpButtonText: "#fffaf3",
    },
  },
},

{
  slug: "gordana-milos",
  type: "wedding",
  template: "italian-minimal",
  script: "cyrillic",

  brideName: "Гордана",
  groomName: "Милош",

  weddingDate: "17. октобар 2026.",
  weddingTime: "08:30",
  venue: "Свечана сала „Мимоза“",

  backgroundImage: "/images/gordana-milos-minimal.jpg",
  musicSrc: "/music/gordana-milos.mp3",

  details: {
    introOpenText: "Кликни да отвориш",

    welcomeText:
      "Са радошћу вас позивамо да будете уз нас док ступамо у свети завет брака и прослављамо нашу љубав",

    date: "17. ОКТ 2026.",
    dateISO: "2026-10-17T08:30:00+02:00",

    showCalendarButton: true,
    calendarButtonText: "Додај у календар",
note: "Молимо вас да свој долазак потврдите до 1. октобра 2026.",
    showDressCode: false,

    rsvpImage: "/images/gordana-milos-rsvp.jpg",

    rsvpPhotoTitle:
      "Тамо где љубав пронађе свој дом, почиње вечност.",

    rsvpPhotoText:
      "С поштовањем,\nпородице Станојевић и Петковић",

    events: [
      {
        label: "Скуп сватова",
        time: "08:30",
        icon: "gathering",
        location: "Породична кућа Петковић",
       
      },
      {
        label: "Црквено венчање",
        time: "13:00",
        icon: "church",
        location: "Манастир Грачаница",
        mapLink:
          "https://www.google.com/maps/place/%D0%BC%D0%B0%D0%BD%D0%B0%D1%81%D1%82%D0%B8%D1%80+%D0%B3%D1%80%D0%B0%D1%87%D0%B0%D0%BD%D0%B8%D1%86%D0%B0/data=!4m2!3m1!1s0x13549b89603b0297:0x63b853d64ac39927?sa=X&ved=1t:155783&ictx=111",
      },
      {
        label: "Пријем званица",
        time: "16:00",
        icon: "restaurant",
        location: "Свечана сала „Мимоза“",
        mapLink:
          "https://www.google.com/maps/place/Restoran+%22Mimoza%22/@42.5973076,21.1971238,725m/data=!3m2!1e3!4b1!4m9!3m8!1s0x13549b76b37a0dd1:0x9407665954c399f7!5m2!4m1!1i2!8m2!3d42.5973076!4d21.1996987!16s%2Fg%2F11q1lm46xr?entry=ttu&g_ep=EgoyMDI2MDgwNS4xIKXMDSoASAFQAw%3D%3D",
      },
    ],

    // Ovo pravi posebno dugme "Погледај локацију"
    // ispod plana venčanja
    mapLink:
      "https://www.google.com/maps/place/Restoran+%22Mimoza%22/@42.5973076,21.1971238,725m/data=!3m2!1e3!4b1!4m9!3m8!1s0x13549b76b37a0dd1:0x9407665954c399f7!5m2!4m1!1i2!8m2!3d42.5973076!4d21.1996987!16s%2Fg%2F11q1lm46xr?entry=ttu&g_ep=EgoyMDI2MDgwNS4xIKXMDSoASAFQAw%3D%3D",
  },
},

{
  slug: "ema-aleksa",
  type: "wedding",
  template: "silk-photo-script",
  script: "latin",

  brideName: "Ema",
  groomName: "Aleksa",

  // Silk intro
  backgroundImage: "/images/silk-intro.jpg",
  videoSrc: "/videos/ema-aleksa.mp4",

  // Muzika
 musicSrc: "/music/mina-dragan.mp3",

  weddingDate: "18. septembar 2026.",
  weddingTime: "16:00",
  venue: "Mesečev konak, Niš",

  introText:
    "Sa radošću vas pozivamo da budete deo našeg dana.",

  details: {
    script: "latin",

    dateISO: "2026-09-18T16:00:00+02:00",
    dateDisplay: "18.09.2026.",

    // Fotografija u pozadini invitation card-a
    cardBackgroundImage: "/images/invitation-background.jpg",
    cardBackgroundPosition: "center",

    // Fotografija u pozadini RSVP-a i countdown-a
    sectionBackgroundImage: "/images/invitation-background.jpg",
    sectionBackgroundPosition: "center",

    // Srce između imena
    nameConnector: "heart",

    invitationKicker: "Pozivnica za venčanje",

    welcomeText:
      "Sa velikom radošću vas pozivamo da svojim prisustvom ulepšate početak našeg zajedničkog života.",

    events: [
      {
        time: "16:00",
        label: "Crkveno venčanje",
        location: "Crkva Svetog Pantelejmona, Niš",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Crkva+Svetog+Pantelejmona+Nis",
        icon: "church",
      },
      {
        time: "17:30",
        label: "Građansko venčanje",
        location: "Oficirski dom, Niš",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Oficirski+dom+Nis",
        icon: "civil",
      },
      {
        time: "19:00",
        label: "Večera i proslava",
        location: "Restoran Mesečev konak, Niš",
        mapLink:
          "https://www.google.com/maps/search/?api=1&query=Mesecev+konak+Nis",
        icon: "party",
      },
    ],

    // Donji blok sa glavnom lokacijom
    locationTitle: "Čekamo vas",
    locationPrefix: "na adresi",

    venue: "Restoran Mesečev konak",
    venueAddress: "Niš",

    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Mesecev+konak+Nis",

    mapButtonText: "Pogledaj lokaciju",

    // Bez dress code-a
    showDressCode: false,

    note:
      "Molimo vas da dolazak potvrdite najkasnije do 1. septembra 2026.",

    // RSVP
    rsvpKicker: "Potvrda dolaska",
    rsvpTitle: "Radujemo se vašem odgovoru",

    rsvpSubtitle:
      "Molimo vas da potvrdite dolazak najkasnije do 1. septembra.",

    rsvpButtonText: "Pošalji potvrdu",
    rsvpMaxGuests: 10,

    // Postim / ne postim


    // Countdown
    countdownKicker: "Odbrojavamo zajedno",
    countdownTitle: "Do našeg dana je ostalo",

    countdownNote:
      "Jedva čekamo da ovaj poseban trenutak podelimo sa vama.",

    countdownFinishedTitle: "Naš dan je stigao",
    countdownFinishedNote: "Vidimo se na proslavi!",

    // Bez dugmeta za dodavanje u kalendar
    showCalendarButton: false,

    theme: {
      backgroundColor: "#e9e2d8",

      mainText: "#5b514a",
      softText: "#786c64",
      mutedText: "#978a80",

      accent: "#c2a078",
      accentStrong: "#916842",

      onAccent: "#fffaf3",

      locationSoftText: "#916842",

      cardPaper: "rgba(255, 255, 255, 0.30)",
      cardBorder: "rgba(113, 91, 74, 0.22)",
      cardInnerBorder: "rgba(113, 91, 74, 0.15)",
      cardShadow: "rgba(55, 43, 35, 0.14)",

      cardPhotoOverlay: "rgba(245, 240, 233, 0.01)",
      cardPhotoOverlayBottom: "rgba(245, 237, 229, 0.30)",

      sectionOverlay: "rgba(255, 255, 255, 0.30)",
      cardBg: "rgba(255, 252, 247, 0.48)",
      inputBg: "rgba(255, 253, 249, 0.62)",

      rsvpButtonText: "#fffaf3",
    },
  },
},

{
  slug: "kristina-vukasin",
  type: "wedding",
  template: "split-video",

  brideName: "Kristina",
  groomName: "Vukašin",

  videoSrc: "/videos/kristina-vukasin.mp4",

  weddingDate: "07 NOV 2026",
  weddingTime: "13:00",
  venue: "Vranje",

  introText: "Radujemo se da ovaj dan podelimo sa vama.",

  details: createDetails({
    backgroundImage: "/images/ANA-OGNJEN-split-1.jpg",

    welcomeText:
      "Biće nam veliko zadovoljstvo da svojim prisustvom ulepšate naš poseban dan.",

    date: "07 NOV 2026",
    dateISO: "2026-11-07T13:00:00+01:00",

    showCalendarButton: true,

    events: [
      {
        label: "Crkveno venčanje",
        time: "13:00",
        location: "Crkva Svete Trojice",
        mapLink:
          "https://maps.google.com/?q=Crkva+Svete+Trojice+Vranje",
        note: "Trenutak kada počinje naše zajedničko novo poglavlje.",
      },
      {
        label: "Prijem gostiju",
        time: "15:30",
        location: "Hotel Vojvoda Putnik, Vranje",
        mapLink:
          "https://maps.google.com/?q=Hotel+Vojvoda+Putnik+Vranje",
        note: "Radujemo se zajedničkom slavlju sa vama.",
      },
    ],

 theme: {
  mainText: "#F7F2F4",
  softText: "#E8E0E3",
  scriptText: "#FFF8FA",
  mutedText: "#CFC5CB",

accent: "#F5F3F4",
accentStrong: "#FFFFFF",
  buttonText: "#2A1F24",

  cardBg: "rgba(18, 15, 20, 0.46)",
  cardBorder: "rgba(255,255,255,0.14)",
  frameBorder: "rgba(255,255,255,0.16)",

 paperOverlayTop: "rgba(0, 0, 0, 0.72)",
paperOverlayBottom: "rgba(0, 0, 0, 0.42)",
vignetteColor: "rgba(0, 0, 0, 0.38)",

  flowLine: "#F6EEF1",
  dividerLine: "rgba(255,255,255,0.18)",
  nodeRing: "rgba(255,255,255,0.24)",

  backgroundColor: "#09070B",

  /* INTRO */
  introMainText: "#FFF8FA",
  introAccent: "#FFF8FA",
  introButtonBg: "rgba(255,255,255,0.08)",
  introButtonBorder: "rgba(255,255,255,0.42)",
  introButtonText: "#FFF8FA",
  introButtonHoverBg: "rgba(255,255,255,0.14)",

  /* RSVP */
  rsvpButtonBg: "#A84F59",
  rsvpButtonText: "#FFF9FA",
},

    showDressCode: false,

    venue: "Hotel Vojvoda Putnik, Vranje",

    mapLink:
      "https://maps.google.com/?q=Hotel+Vojvoda+Putnik+Vranje",

    note:
      "Molimo vas da svoj dolazak potvrdite do 25. oktobra 2026.",
  }),
},

  // =========================
  // BIRTHDAY TEMPLATES
  // =========================
  {
  slug: "jelena-18",
  type: "birthday",
  template: "black-white-intro",
  brideName: "Jelena",
  groomName: "",
  weddingDate: "15 NOV 2026",
  weddingTime: "20:00",
  venue: "Beograd",
  details: createDetails({
    welcomeText: "Pozivam te da zajedno proslavimo moj 18. rođendan.",
    age: 18,
    date: "15 NOV 2026",
    dateISO: "2026-11-15T20:00:00",
    gatheringTime: "19:30",
    ceremonyTime: "20:00",
    venue: "Club XYZ, Beograd",
    dinnerTime: "20:30",
    dressCodeTitle: "Dress code",
    dressCodePalette: ["#000000", "#ffffff", "#d31717"],
    dressCodeNote: "Crno-beli outfit sa crvenim detaljem je dobrodošao.",
    mapLink: "https://maps.google.com/?q=Beograd",
    note: "Potvrdi dolazak na vreme.",
  }),
},
{
  slug: "jelena-retro",
  type: "birthday",
  template: "retro",
  backgroundImage: "/images/jelena-retro.png",
  videoSrc: "/videos/jelena-retro.mp4",
  rsvpVideoSrc: "/videos/jelena-retro-rsvp.mp4",
  weddingDate: "15 NOV 2026",
  weddingTime: "20:00",
  venue: "Beograd",
  details: createDetails({
    welcomeText: "Pozivam te da zajedno proslavimo moj 18. rođendan.",
    date: "15 NOV 2026",
    dateISO: "2026-11-15T20:00:00",
    gatheringTime: "19:30",
    ceremonyTime: "20:00",
    venue: "Club XYZ, Beograd",
    dinnerTime: "20:30",
    dressCodeTitle: "Dress code",
    dressCodePalette: ["#000000", "#ffffff", "#d31717"],
    dressCodeNote: "Crno-beli outfit sa crvenim detaljem je dobrodošao.",
    mapLink: "https://maps.google.com/?q=Beograd",
    note: "Potvrdi dolazak na vreme.",
  }),
},
{
  slug: "viktor-1",
  type: "birthday",
  template: "birthday-gallery",
  brideName: "Viktor",
  weddingDate: "10 SEP 2026",
  weddingTime: "11:00",
  venue: "Topčiderac, Beograd",
  backgroundImage: "/images/viktor-1-bg.jpg",
  image1: "/images/viktor-1-1.jpg",
  image2: "/images/viktor-1-2.jpg",
  image3: "/images/viktor-1-3.jpg",
  details: createDetails({
    welcomeText: "Join us for a very special first birthday celebration.",
    date: "10 SEP 2026",
    dateISO: "2026-09-10T11:00:00",
    venue: "Topčiderac, Beograd",
    note: "Potvrdite do 25. avgusta",
  }),
},
{
  slug: "aleksa-1",
  type: "birthday",
  template: "birthday-gallery",
  brideName: "Aleksa",
  weddingDate: "18 OCT 2026",
  weddingTime: "12:00",
  venue: "Sunset Hall, Chicago",
  image1: "/images/aleksa-1-1.jpg",
  image2: "/images/aleksa-1-2.jpg",
  image3: "/images/aleksa-1-3.jpg",
  details: createDetails({
    welcomeText: "Come celebrate Noah's first birthday with us.",
    date: "18 OCT 2026",
    dateISO: "2026-10-18T12:00:00",
    venue: "Sunset Hall, Chicago",
    note: "RSVP by 1 Oct",
  }),
},
{
  slug: "nina-1",
  type: "birthday",
  template: "birthday-one-word",
  brideName: "Nina",
  title: "Nina slavi rođendan",
  weddingDate: "24 SEP 2026",
  weddingTime: "15:00",
  venue: "Igraonica Sunce, Beograd",
  backgroundImage: "/images/nina-1-bg.jpg",
  image1: "/images/nina-1-1.jpg",
  image2: "/images/nina-1-2.jpg",
  image3: "/images/nina-1-3.jpg",
  details: createDetails({
    welcomeText: "Join us to celebrate Nina's first birthday.",
    date: "24 SEP 2026",
    dateISO: "2026-09-24T15:00:00+02:00",
    venue: "Igraonica Sunce, Beograd",
    note: "RSVP do 10. septembra",
    rsvpTitle: "Potvrdite dolazak",
    rsvpText: "Radovaćemo se da zajedno proslavimo Ninin rođendan.",
  }),
},
{
  slug: "vuk-1",
  type: "birthday",
  template: "birthday-split",
  brideName: "Vuk",
  title: "Vuk slavi rođendan",
  weddingDate: "24 SEP 2026",
  weddingTime: "15:00",
  venue: "Igraonica Sunce, Beograd",
  backgroundImage: "/images/vuk-1-bg.jpg",
  image1: "/images/vuk-1-1.jpg",
  image2: "/images/vuk-1-2.jpg",
  image3: "/images/vuk-1-3.jpg",
  details: createDetails({
    welcomeText: "Join us to celebrate Vuk's first birthday.",
    date: "24 SEP 2026",
    dateISO: "2026-09-24T15:00:00+02:00",
    venue: "Igraonica Sunce, Beograd",
    note: "RSVP do 10. septembra",
    rsvpTitle: "Potvrdite dolazak",
    rsvpText: "Radovaćemo se da zajedno proslavimo Ninin rođendan.",
  }),
},
{
  slug: "ana-rodjendan",
  type: "birthday",
  template: "birthday-party",
  partyGender: "girl",
  brideName: "Ana",
  weddingDate: "1 SEP 2026",
  weddingTime: "18:00",
  venue: "Igraonica Maštograd",

  videoSrc: "/videos/ana-rodjendan-intro-1.mp4",
  babyImage: "/images/ana-beba.svg",
  
  introText: "Pozivamo vas da zajedno proslavimo Anin prvi rođendan.",

  details: createDetails({
    dateISO: "2026-09-01T18:00:00+02:00",
    note: "Molimo vas da potvrdite dolazak.",
  }),
},
{
  slug: "ana-prvi-rodjendan",
  type: "birthday",
  template: "birthday-baby-luxury",

  brideName: "Ana",

  weddingDate: "15.09.2026.",
  weddingTime: "17:00",
  venue: "Restoran Romantična noć 2, Kaluđerica",

  videoSrc: "/videos/ana-rodjendan-intro-1.mp4",

  backgroundImage: "/images/ana-prvi-rodjendan-fallback.jpg",

  details: createDetails({
    introOrnamentTopSvg: "/images/birthday/ana/ornament-top.svg",
    introOrnamentBottomSvg: "/images/birthday/ana/ornament-bottom.svg",

    theme: {
      babyMain: "#ae6f60",
      babySoft: "#ead7bf",
      babyLight: "#fff6f1",
      babyMuted: "#a4695e",
      babyBorder: "rgba(198, 131, 101, 0.52)",
      babyShadow: "rgba(154, 94, 76, 0.18)",
    },

    welcomeText:
      "Sa velikom radošću vas pozivamo da zajedno proslavimo Anin prvi rođendan.",

    date: "15.09.2026.",
    dateISO: "2026-09-15T17:00:00+02:00",

    rsvpText:
      "Radovaćemo se da zajedno proslavimo Anin prvi rođendan.",

    venue: "Restoran Romantična noć 2, Kaluđerica",

    events: [
      {
        label: "Krštenje",
        time: "14:30",
        icon: "church",
        location: "Crkva Sv. Luka, Krnjača",
        mapLink: "https://maps.google.com/?q=Crkva+Sv.+Luka+Krnjaca",
      },
      {
        label: "Proslava",
        time: "16:00",
        icon: "cake",
        location: "Restoran Romantična noć 2, Kaluđerica",
        mapLink:
          "https://maps.google.com/?q=Restoran%20Romanti%C4%8Dna%20no%C4%87%202%20Kalu%C4%91erica",
      },
    ],

    showCalendarButton: true,
    showDressCode: false,
    note: "Dolazak je potrebno potvrditi do 01.09.2026.",
  }),
},

{
  slug: "nikola-prvi-rodjendan",
  type: "birthday",
  template: "birthday-baby-luxury",

  brideName: "Nikola",

  weddingDate: "15.09.2026.",
  weddingTime: "17:00",
  venue: "Restoran Primer",

  videoSrc: "/videos/nikola-rodjendan-intro-1.mp4",

  backgroundImage: "/images/nikola-prvi-rodjendan-fallback.jpg",

  details: createDetails({
    introOrnamentTopSvg: "/images/birthday/ana/ornament-top.svg",
    introOrnamentBottomSvg: "/images/birthday/ana/ornament-bottom.svg",

   theme: {
  babyMain: "#8a5f3d",
  babySoft: "#ead7bf",
  babyLight: "#fff8ef",
  babyMuted: "#7a5a43",
  babyBorder: "rgba(138, 95, 61, 0.42)",
  babyShadow: "rgba(112, 78, 48, 0.18)",
},

    welcomeText:
      "Sa velikom radošću vas pozivamo da zajedno proslavimo Nikolin prvi rođendan.",

    date: "15.09.2026.",
    dateISO: "2026-09-15T17:00:00+02:00",

    rsvpText:
      "Radovaćemo se da zajedno proslavimo Nikolin prvi rođendan.",

    venue: "Restoran Primer",

    events: [
      {
        label: "Rođendan",
        time: "17:00",
        icon: "cake",
        location: "Restoran Primer",
        mapLink: "https://maps.google.com/?q=Restoran+Primer",
      },
    ],

    showCalendarButton: true,
    showDressCode: false,
    note: "Dolazak je potrebno potvrditi do 01.09.2026.",
  }),
},
{
  slug: "nikola-1",
  type: "birthday",
  template: "birthday-party",
  partyGender: "boy",
  brideName: "Nikola",
  weddingDate: "1 SEP 2026",
  weddingTime: "18:00",
  venue: "Igraonica Maštograd",

  videoSrc: "/videos/nikola-rodjendan-intro-1.mp4",
  babyImage: "/images/nikola-beba.svg",
  
  introText: "Pozivamo vas da zajedno proslavimo Anin prvi rođendan.",

  details: createDetails({
    dateISO: "2026-09-01T18:00:00+02:00",
    note: "Molimo vas da potvrdite dolazak.",
  }),
},
  // =========================
  // CLASSIC TEMPLATES
  // =========================
{
  slug: "laura-david",
  type: "wedding",
  template: "classic",
  brideName: "Laura",
  groomName: "David",
  weddingDate: "26 AVG 2026",
  weddingTime: "14:00",
  backgroundImage: "/images/laura-david/intro-bg.jpg",
  introPreviewImage: "/images/laura-david/intro-preview.jpg",
  image1: "/images/laura-david/story1.jpg",
  image2: "/images/laura-david/story2.jpg",
  details: createDetails({
    welcomeText: "Biće nam zadovoljstvo da naš dan podelimo sa vama.",
    date: "26 AVG 2026",
    dateISO: "2026-08-26T14:00:00",

    events: [
{
  label: "Građansko venčanje",
  time: "14:00",
  location: "Opština",
  note: "Molimo vas da dođete 30 minuta ranije.",
},
{
  label: "Fotografisanje",
  time: "16:00",
  location: "Park",
  note: "Zabeležimo najlepše trenutke zajedno.",
},
{
  label: "Koktel",
  time: "18:00",
  location: "Restoran",
  note: "Dobrodošlica uz piće i muziku.",
},
{
  label: "Večera i slavlje",
  time: "20:00",
  location: "Sala",
  note: "Počinje proslava!",
},
    ],

    dressCodeNote: "The wedding theme is old money.",
    dressCodePalette: ["#e9e1d9", "#d8c5b7", "#9a836d", "#6b532e"],

    note: "Molimo vas da potvrdite dolazak."
  }),
},
  // =========================
  // EDITORIAL TEMPLATES
  // =========================
{
  slug: "nevena-pedja",
  type: "wedding",
  template: "editorial",

  brideName: "Nevena",
  groomName: "Pedja",

  weddingDate: "25 JUN 2026",
  weddingTime: "17:00",
  venue: "Restoran Tradition, Beograd",

  image1: "/images/nevena-pedja/location.jpg",

  details: createDetails({
    welcomeText:
      "Biće nam veliko zadovoljstvo da ovaj poseban dan podelimo sa vama.",

    date: "25 JUN 2026",
    dateISO: "2026-06-25T17:00:00",

    venue: "Restoran Tradition, Beograd",
    mapLink: "https://maps.google.com/?q=Restoran+Tradition+Beograd",

    dressCodeWomen:
      "Za dame preporučujemo elegantne haljine u crnim i neutralnim tonovima.",
    dressCodeMen:
      "Za muškarce preporučujemo odela u tamnim nijansama.",

    events: [
      {
        label: "Okupljanje gostiju",
        time: "17:00",
        location: "Restoran Tradition, Beograd",
      },
      {
        label: "Početak ceremonije",
        time: "18:00",
        location: "Restoran Tradition, Beograd",
      },
      {
        label: "Proslava i večera",
        time: "19:00",
        location: "Restoran Tradition, Beograd",
      },
    ],
  }),
}

];

export default demoWedding;