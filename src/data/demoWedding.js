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
    dateISO: "2026-05-20T17:00:00",

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

    venue: "ul. Novosadska, Novi Sad",
    dressCodeTitle: "Dress – kod",
    dressCodePalette: ["#111111", "#6d4b12", "#9b1637", "#6a7a1f", "#7d8530", "#efeee9"],
    dressCodeNote:
      "Nam će biti drago, ako u svojim odevnim kombinacijama ispratite stilsku notu našeg venčanja.",
    mapLink: "https://maps.google.com/?q=Novi+Sad",
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
    slug: "nevena-ognjen",
    type: "wedding",
    template: "split-video",
    brideName: "Nevena",
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

  events: [
    {
      label: "Ceremonija",
      time: "15:30",
      location: "Hotel Hyatt, Beograd",
      mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
      note: "Prisustvo na ceremoniji nam puno znači.",
    },
    {
      label: "Svadbeni ručak",
      time: "17:30",
      location: "Svečana sala Hyatt",
      mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
      note: "Ukusni zalogaji i opuštena atmosfera.",
    },
    {
      label: "Torta",
      time: "21:30",
      location: "Glavna sala",
      mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
      note: "Sečenje torte uz muziku i osmeh.",
    },
    {
      label: "Okončanje",
      time: "23:30",
      location: "Hotel Hyatt, Beograd",
      mapLink: "https://maps.google.com/?q=Hotel+Hyatt+Beograd",
      note: "Lepo nam je zajedno i želimo nezaboravno veče.",
    },
  ],

  dressCodeTitle: "Dress code",
  dressCodePalette: ["#bdbdbd", "#7f807d", "#e7c0cf", "#8f1d33", "#050505"],
  dressCodeNote:
    "Poželjno je da izaberete elegantne komade koji odgovaraju tonu proslave.",
  note: "Molimo vas da svoj dolazak potvrdite na vreme.",
}),
  },

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
    slug: "katarina-milos",
    type: "wedding",
    template: "video-band",
    brideName: "Katarina",
    groomName: "Milos",
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