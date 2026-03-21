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
  mapLink,
  note,
  editorialImage1,
  editorialImage2,
  editorialImage3,

  // 🔥 DODAJ OVO
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
  mapLink,
  note,
  editorialImage1,
  editorialImage2,
  editorialImage3,

  // 🔥 I OVO
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
      gatheringTime: "15:30",
      ceremonyTime: "16:00",
      churchTime: "14:30",
      venue: "Hotel Moskva, Beograd",
      churchVenue: "Crkva Svetog Marka, Beograd",
      dinnerTime: "18:00",
      dressCodeTitle: "Dress code",
      dressCodePalette: ["#d8c8b4", "#c2a98f", "#8d7057", "#f3e7da"],
      dressCodeNote:
        "Elegantne, tople i klasične nijanse savršeno će se uklopiti.",
      mapLink: "https://maps.google.com/?q=Hotel+Moskva+Beograd",
      note: "Molimo vas da svoj dolazak potvrdite do 1. avgusta.",
    }),
  },

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

  date: "12 SEP 2026",
  dateISO: "2026-09-12T17:00:00",
events: [
  {
    label: "Okupljanje gostiju",
    time: "16:30",
    icon: "gathering",
    location: "Topčider, Beograd",
  },
  {
    label: "Crkveno venčanje",
    time: "15:30",
    icon: "church",
    location: "Crkva Svetog Marka",
  },
  {
    label: "Građansko venčanje",
    time: "17:00",
    icon: "civil",
    location: "Topčider, Beograd",
  },
  {
    label: "Svečani ručak",
    time: "18:30",
    icon: "restaurant",
    location: "Restoran Topčiderac",
  },
],
  venue: "Topčider, Beograd",
  churchVenue: "Crkva Svetog Marka, Beograd",

  dressCodeTitle: "Dress code",
  dressCodePalette: ["#b8b1a4", "#d8d0c2", "#7f8173", "#cab7a4", "#e7d9cf"],
  dressCodeNote:
    "Molimo vas da birate nežne, zemljane i puderaste tonove.",

  mapLink: "https://maps.google.com/?q=Topcider+Beograd",
  note: "Molimo vas da svoj dolazak potvrdite do 1. septembra.",
})
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

  date: "12 SEP 2026",
  dateISO: "2026-09-12T17:00:00",

events: [
  {
    label: "Okupljanje gostiju",
    time: "16:30",
    icon: "gathering",
    location: "Topčider, Beograd",
  },
  {
    label: "Crkveno venčanje",
    time: "15:30",
    icon: "church",
    location: "Crkva Svetog Marka",
  },
  {
    label: "Građansko venčanje",
    time: "17:00",
    icon: "civil",
    location: "Topčider, Beograd",
  },
  {
    label: "Svečani ručak",
    time: "18:30",
    icon: "restaurant",
    location: "Restoran Topčiderac",
  },
],

  venue: "Topčider, Beograd",
  churchVenue: "Crkva Svetog Marka, Beograd",

  dressCodeTitle: "Dress code",
  dressCodePalette: ["#b8b1a4", "#d8d0c2", "#7f8173", "#cab7a4", "#e7d9cf"],
  dressCodeNote:
    "Molimo vas da birate nežne, zemljane i puderaste tonove.",

  mapLink: "https://maps.google.com/?q=Topcider+Beograd",
  note: "Molimo vas da svoj dolazak potvrdite do 1. septembra.",
})
  },

  {
    slug: "jasna-ivan",
    type: "wedding",
    template: "floral",
    brideName: "Jasna",
    groomName: "Ivan",
    backgroundImage: "/images/floral-jasna-ivan.png",
    weddingDate: "12 SEP 2026",
    weddingTime: "17:00",
    venue: "Topčider, Beograd",
details: createDetails({
  welcomeText:
    "Radujemo se što ćemo najlepše trenutke našeg dana podeliti sa vama.",

  date: "12 SEP 2026",
  dateISO: "2026-09-12T17:00:00",
events: [
  {
    label: "Okupljanje gostiju",
    time: "16:30",
    icon: "gathering",
    location: "Topčider, Beograd",
  },
  {
    label: "Crkveno venčanje",
    time: "15:30",
    icon: "church",
    location: "Crkva Svetog Marka",
  },
  {
    label: "Građansko venčanje",
    time: "17:00",
    icon: "civil",
    location: "Topčider, Beograd",
  },
  {
    label: "Svečani ručak",
    time: "18:30",
    icon: "restaurant",
    location: "Restoran Topčiderac",
  },
],

  venue: "Topčider, Beograd",
  churchVenue: "Crkva Svetog Marka, Beograd",

  dressCodeTitle: "Dress code",
  dressCodePalette: ["#b8b1a4", "#d8d0c2", "#7f8173", "#cab7a4", "#e7d9cf"],
  dressCodeNote:
    "Molimo vas da birate nežne, zemljane i puderaste tonove.",

  mapLink: "https://maps.google.com/?q=Topcider+Beograd",
  note: "Molimo vas da svoj dolazak potvrdite do 1. septembra.",
})
  },

{
  slug: "milica-ognjen",
  type: "wedding",
  template: "minimal",
  brideName: "Milica",
  groomName: "Ognjen",
  weddingDate: "05 OKT 2026",
  weddingTime: "15:30",
  venue: "Beli dvor, Beograd",
  introText:
    "Pozivamo vas da zajedno sa nama proslavite ljubav, radost i početak novog poglavlja.",
  details: createDetails({
    welcomeText:
      "Biće nam izuzetno drago da svojim prisustvom ulepšate naš poseban dan.",

    date: "05 OKT 2026",
    dateISO: "2026-10-05T15:30:00",

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
    slug: "anja-marko",
    type: "wedding",
    template: "photo-card",
    brideName: "Anja",
    groomName: "Marko",
    image: "/images/couple.jpg",
    weddingDate: "12 MAY 2026",
    weddingTime: "17:00",
    venue: "123 Anywhere St., Any City",
    details: createDetails({
      welcomeText:
        "Sa velikom radošću vas pozivamo da budete deo našeg posebnog dana.",
      date: "12 MAY 2026",
      dateISO: "2026-05-12T17:00:00",
      gatheringTime: "16:00",
      ceremonyTime: "17:00",
      churchTime: "15:00",
      venue: "123 Anywhere St., Any City",
      churchVenue: "St. Mary Church",
      dinnerTime: "18:30",
      dressCodeTitle: "Dress code",
      dressCodePalette: ["#d8d0c2", "#b8b1a4", "#cab7a4", "#e7d9cf"],
      dressCodeNote: "Elegant and soft neutral tones are welcome.",
      mapLink: "https://maps.google.com/?q=123+Anywhere+St",
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
      dateISO: "2026-09-18T17:00:00",
      gatheringTime: "16:00",
      ceremonyTime: "17:00",
      churchTime: "15:00",
      venue: "Beograd",
      churchVenue: "Crkva Svetog Marka, Beograd",
      dinnerTime: "18:30",
      dressCodeTitle: "Dress code",
      dressCodePalette: ["#2a2a2a", "#6e6461", "#b9a39b", "#d6c4bb"],
      dressCodeNote: "Elegantni, zagasiti i neutralni tonovi.",
      mapLink: "https://maps.google.com/?q=Beograd",
      note: "Molimo vas da svoj dolazak potvrdite na vreme.",
    }),
  },

  {
    slug: "ivana-ognjen",
    type: "wedding",
    template: "split-video",
    brideName: "Ivana",
    groomName: "Ognjen",
    videoSrc: "/videos/wedding3.mp4",
    weddingDate: "18 SEP 2026",
    weddingTime: "17:00",
    venue: "Beograd",
    introText: "Radujemo se da ovaj dan podelimo sa vama.",
    details: createDetails({
      welcomeText: "Radujemo se da ovaj dan podelimo sa vama.",
      date: "18 SEP 2026",
      dateISO: "2026-09-18T17:00:00",
      gatheringTime: "16:00",
      ceremonyTime: "17:00",
      churchTime: "15:00",
      venue: "Beograd",
      churchVenue: "Crkva Svetog Marka, Beograd",
      dinnerTime: "18:30",
      dressCodeTitle: "Dress code",
      dressCodePalette: ["#2f2c2c", "#726767", "#b1a19d", "#e2d8d2"],
      dressCodeNote:
        "Elegantni tonovi i zagasite nijanse savršeno će se uklopiti.",
      mapLink: "https://maps.google.com/?q=Beograd",
      note: "Molimo vas da svoj dolazak potvrdite na vreme.",
    }),
  },

  {
    slug: "ivana-filip-roses",
    type: "wedding",
    template: "split-image",
    brideName: "Ivana",
    groomName: "Filip",
    image: "/images/wedding4.jpg",
    weddingDate: "18 SEP 2026",
    weddingTime: "17:00",
    venue: "Beograd",
    details: createDetails({
      welcomeText:
        "Sa velikom radošću vas pozivamo da budete deo našeg posebnog dana.",
      date: "18 SEP 2026",
      dateISO: "2026-09-18T17:00:00",
      gatheringTime: "16:00",
      ceremonyTime: "17:00",
      churchTime: "15:00",
      venue: "Beograd",
      churchVenue: "Crkva Svetog Marka, Beograd",
      dinnerTime: "18:30",
      dressCodeTitle: "Dress code",
      dressCodePalette: ["#2f2c2c", "#726767", "#b1a19d", "#e2d8d2"],
      dressCodeNote:
        "Elegantni tonovi i zagasite nijanse savršeno će se uklopiti.",
      mapLink: "https://maps.google.com/?q=Beograd",
      note: "Molimo vas da svoj dolazak potvrdite na vreme.",
    }),
  },

  {
    slug: "ivana-filip-video",
    type: "wedding",
    template: "split-video",
    brideName: "Ivana",
    groomName: "Filip",
    videoSrc: "/videos/wedding3.mp4",
    weddingDate: "18 SEP 2026",
    weddingTime: "17:00",
    venue: "Beograd",
    details: createDetails({
      welcomeText:
        "Sa velikom radošću vas pozivamo da budete deo našeg posebnog dana.",
      date: "18 SEP 2026",
      dateISO: "2026-09-18T17:00:00",
      gatheringTime: "16:00",
      ceremonyTime: "17:00",
      churchTime: "15:00",
      venue: "Beograd",
      churchVenue: "Crkva Svetog Marka, Beograd",
      dinnerTime: "18:30",
      dressCodeTitle: "Dress code",
      dressCodePalette: ["#2f2c2c", "#726767", "#b1a19d", "#e2d8d2"],
      dressCodeNote:
        "Elegantni tonovi i zagasite nijanse savršeno će se uklopiti.",
      mapLink: "https://maps.google.com/?q=Beograd",
      note: "Molimo vas da svoj dolazak potvrdite na vreme.",
    }),
  },

  {
    slug: "ivana-filip-video-band",
    type: "wedding",
    template: "video-band",
    brideName: "Ivana",
    groomName: "Filip",
    videoSrc: "/videos/wedding2.mp4",
    weddingDate: "18 SEP 2026",
    weddingTime: "17:00",
    
   details: createDetails({
 
  date: "18 SEP 2026",
  dateISO: "2026-09-18T17:00:00",

  events: [
    {
      label: "Skup svatova",
      time: "16:00",
      icon: "gathering",
    },
    {
      label: "Crkveno venčanje",
      time: "15:00",
      icon: "church",
    },
    {
      label: "Građansko venčanje",
      time: "17:00",
      icon: "civil",
    },
    {
      label: "Svečani ručak",
      time: "18:30",
      icon: "restaurant",
    },
  ],

  venue: "Topčiderac, Beograd",
  churchVenue: "Crkva Svetog Marka, Beograd",

  dressCodeTitle: "Dress code",
  dressCodePalette: ["#b8b1a4", "#d8d0c2", "#7f8173", "#cab7a4", "#e7d9cf"],
  dressCodeNote:
    "Molimo vas da birate nežne, zemljane i puderaste tonove.",

  mapLink: "https://maps.google.com/?q=Beograd",
  note: "Molimo vas da svoj dolazak potvrdite na vreme.",
}),
  },
  {
  slug: "jelena-18",
  type: "birthday",
  template: "black-white-intro",
  brideName: "Jelenin",
  groomName: "",
  weddingDate: "15 NOV 2026",
  weddingTime: "20:00",
  venue: "Beograd",
  details: createDetails({
    welcomeText: "Pozivam te da zajedno proslavimo moj 18. rođendan.",
    date: "15 NOV 2026",
    dateISO: "2026-11-15T20:00:00",
    gatheringTime: "19:30",
    ceremonyTime: "20:00",
    churchTime: "",
    venue: "Beograd",
    churchVenue: "",
    dinnerTime: "20:30",
    dressCodeTitle: "Dress code",
    dressCodePalette: ["#000000", "#ffffff", "#d31717"],
    dressCodeNote: "Crno-beli outfit sa crvenim detaljem je dobrodošao.",
    mapLink: "https://maps.google.com/?q=Beograd",
    note: "Potvrdi dolazak na vreme.",
  }),
},
];

export default demoWedding;