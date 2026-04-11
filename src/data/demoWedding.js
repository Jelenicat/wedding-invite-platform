const createDetails = ({
  backgroundImage,
   theme,
  welcomeText,
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
  dressCodePalette = [],
  dressCodeNote = "",
  dressCodeWomen,
  dressCodeMen,
  mapLink,
  note,
  editorialImage1,
  editorialImage2,
  editorialImage3,
  events = [],
  rsvpOptions = {},
}) => ({
  backgroundImage,
   theme,
  welcomeText,
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
  dressCodePalette,
  dressCodeNote,
  dressCodeWomen,
  dressCodeMen,
  mapLink,
  note,
  editorialImage1,
  editorialImage2,
  editorialImage3,
  events,
  rsvpOptions,
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

  backgroundImage: "/images/milica-ognjen-minimal.jpg",

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
// =========================
// PHOTO SCRIPT TEMPLATES
// =========================
{
  slug: "ivana-filip",
  type: "wedding",
  template: "photo-script",
  brideName: "Ivana",
  groomName: "Filip",
  videoSrc: "/videos/wedding.mp4",
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
  videoSrc: "/videos/vanja-aleksa2.mp4",
  weddingDate: "18 SEP 2026",
  weddingTime: "17:00",
  venue: "Beograd",
  introText: "Radujemo se da ovaj dan podelimo sa vama.",
  details: createDetails({
     backgroundImage: "/images/vanja-aleksa-split.jpg",
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
  videoSrc: "/videos/ana-ognjen.mp4",
  weddingDate: "18 SEP 2026",
  weddingTime: "17:00",
  venue: "Beograd",
  introText: "Radujemo se da ovaj dan podelimo sa vama.",
  details: createDetails({
    backgroundImage: "/images/ANA-OGNJEN-split.jpg",
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
  videoSrc: "/videos/ivona-aleksa.mp4",
  fontMode: "light",
  weddingDate: "06 SEP 2026",
  weddingTime: "17:00",
  venue: "Beograd",
  backgroundImage: "/images/ivona-aleksa-minimal.jpg",
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
  videoSrc: "/videos/wedding2222.mp4",
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
// Klijenti
// =========================
{
  slug: "dijana-stefan",
  type: "wedding",
  template: "video-band",
  brideName: "Dijana",
  groomName: "Stefan",
  videoSrc: "/videos/dijana-stefan.mp4",
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
  videoSrc: "/videos/aleksandra-aleksej.mp4",
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
      {
        label: "Građansko venčanje",
        time: "17:00",
       location: "Hotel Tiski Cvet, Novi Bečej",
        mapLink: "https://www.google.com/maps/place/%D0%A2%D0%B8%D1%81%D0%BA%D0%B8+%D1%86%D0%B2%D0%B5%D1%82/@45.5942253,20.132972,17z/data=!3m1!4b1!4m9!3m8!1s0x475b2d9034f0ae43:0xea48bcb4e8be3019!5m2!4m1!1i2!8m2!3d45.5942253!4d20.132972!16s%2Fg%2F1tqpy0mn?entry=ttu&g_ep=EgoyMDI2MDQwNi4wIKXMDSoASAFQAw%3D%3D",
        note: "Trenutak kada počinje naše novo poglavlje",
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
  introMainText: "#ffffff",
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
  videoSrc: "/videos/wedding-Adrijana-Aleksandar1.mp4",
  musicSrc: "/music/adrijana-aleksandar.mp3",
  weddingDate: "11 JUL 2026",
  weddingTime: "19:00",
  venue: "Niš",

  details: createDetails({
    welcomeText: "Radujemo se da ovaj dan podelimo sa vama.",

    date: "11 JUL 2026",
    dateISO: "2026-07-11T19:00:00+02:00",

    editorialImage1: "/images/adrijana-aleksandar.jpg",

    events: [
      {
        label: "Okupljanje zvanica",
        time: "17:45",
        icon: "gathering",
        location: "Restoran LUSSO, Niš",
        mapLink: "https://www.google.com/maps/place/Lusso+Restoran/@43.2596203,21.8634665,17z/data=!3m1!4b1!4m6!3m5!1s0x4755bba205ac2295:0x7907c824c1cde073!8m2!3d43.2596203!4d21.8660414!16s%2Fg%2F11y_f7y92x?entry=ttu&g_ep=EgoyMDI2MDQwNi4wIKXMDSoASAFQAw%3D%3D",
      },
      {
        label: "Građansko venčanje",
        time: "19:00",
        icon: "civil",
        location: "Restoran LUSSO, Niš",
        mapLink: "https://www.google.com/maps/place/Lusso+Restoran/@43.2596203,21.8634665,17z/data=!3m1!4b1!4m6!3m5!1s0x4755bba205ac2295:0x7907c824c1cde073!8m2!3d43.2596203!4d21.8660414!16s%2Fg%2F11y_f7y92x?entry=ttu&g_ep=EgoyMDI2MDQwNi4wIKXMDSoASAFQAw%3D%3D",
      },
    ],

    showDressCode: true,
    dressCodeTitle: "Dress code",
    dressCodeNote:
      "Svečano i elegantno, u stilu koji vam najviše prija.",
    dressCodePalette: [],

    note: "Molimo vas da svoj dolazak potvrdite do 1. juna.",
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
   musicSrc: "/music/masa-nikola.mp3",
  weddingDate: "06 SEP 2026",
  weddingTime: "16:30",
  details: createDetails({
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

    mapLink:  "https://www.google.com/maps?q=Orthodox+Church+of+St.+Luke+the+Apostle,+Kneza+Vi%C5%A1eslava+100,+Beograd&ftid=0x475a71ea9fb4c97f:0xeec28c0c6bbe6268&entry=gps&shh=CAE&lucs=,94297699,100795625,94284454,94231188,94280568,47071704,94218641,94282134,94286869&g_ep=CAISEjI2LjE0LjAuODkxOTAzMTgwMBgAINeCAypSLDk0Mjk3Njk5LDEwMDc5NTYyNSw5NDI4NDQ1NCw5NDIzMTE4OCw5NDI4MDU2OCw0NzA3MTcwNCw5NDIxODY0MSw5NDI4MjEzNCw5NDI4Njg2OUICUlM%3D&skid=02ce878b-ce2e-4e16-b2c4-ed151262d881&g_st=iw",
    note: "Molimo vas da svoj dolazak potvrdite do 23. avgusta.",
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