const createDetails = ({
  welcomeText,
  date,
  dateISO,
  gatheringTime,
  ceremonyTime,
  churchTime,
  venue,
  churchVenue,
  dinnerTime,
  dressCodeTitle = "Dress code",
  dressCodePalette = [],
  dressCodeNote,
  dressCodeWomen,
  dressCodeMen,
  mapLink,
  note,
  editorialImage1,
  editorialImage2,
  editorialImage3,
  events = [],
}) => ({
  welcomeText,
  date,
  dateISO,
  gatheringTime,
  ceremonyTime,
  churchTime,
  venue,
  churchVenue,
  dinnerTime,
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
    note: "Molimo vas da svoj dolazak potvrdite na vreme.",
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
];

export default demoWedding;