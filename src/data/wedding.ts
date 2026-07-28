export type WeddingEvent = {
  id: "evening" | "temple" | "reception";
  title: string;
  date: string;
  displayDate: string;
  time: string | null;
  venue: string | null;
  address: string | null;
  mapUrl: string | null;
  publicInvitation: boolean;
  note: string;
};

const mapsSearch = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export const wedding = {
  couple: { first: "Sree", second: "Sajith", display: "Sree & Sajith", monogram: "S & S" },
  year: 2026,
  weddingDate: "2026-12-14",
  countdownTarget: "2026-12-14T06:00:00+05:30",
  timezone: "Asia/Kolkata",
  location: "Thrissur, Kerala",
  canonicalUrl: "https://sree-sajith-wedding.vercel.app",
  rsvp: {
    deadline: "20 October 2026",
    contactName: "Sree",
    phoneDisplay: "+91 97895 07300",
    phoneE164: "919789507300",
    email: "subramaniansreelakshmi01@gmail.com",
  },
  phrases: {
    english: "With love, we invite you.",
    malayalam: "സ്നേഹത്തോടെ സ്വാഗതം",
    tamil: "அன்புடன் வரவேற்கிறோம்",
  },
  story: [
    {
      id: "beginning",
      kicker: "Chapter one · The beginning",
      heading: "Some stories begin quietly.",
      body: "We first met during our undergraduate years, when neither of us knew where life would eventually lead.",
    },
    {
      id: "paths",
      kicker: "Chapter two · Different paths",
      heading: "Life moved forward.",
      body: "Time moved forward, and life carried us along different paths.",
    },
    {
      id: "istanbul",
      kicker: "Chapter three · Istanbul",
      heading: "And then, Istanbul.",
      body: "A few years later, far from where our story first began, we found each other again in Istanbul.",
      aside: "Some meetings feel like coincidence. Others feel like the story finding its way back.",
    },
    {
      id: "home",
      kicker: "Chapter four · Home",
      heading: "The story brings us home.",
      body: "What began years ago now brings us home—to Kerala, to our families, and to the beginning of our life together.",
      aside: "We would love for you to be part of the celebration.",
    },
  ],
  events: [
    {
      id: "evening",
      title: "Evening reception",
      date: "2026-12-13",
      displayDate: "13 December 2026",
      time: null, // TODO: Confirm the exact evening reception time.
      venue: null, // TODO: Confirm the evening reception venue.
      address: null, // TODO: Confirm the evening reception address.
      mapUrl: null,
      publicInvitation: true,
      note: "Evening celebration — details to follow",
    },
    {
      id: "temple",
      title: "Temple wedding ceremony",
      date: "2026-12-14",
      displayDate: "14 December 2026",
      time: "6:00 AM",
      venue: "Guruvayoor Temple",
      address: "Thrissur, Kerala",
      mapUrl: mapsSearch("Guruvayoor Temple, Thrissur, Kerala"),
      publicInvitation: false,
      note: "Our wedding ceremony will take place at Guruvayoor Temple in the quiet hours of the morning, surrounded by our closest family.",
    },
    {
      id: "reception",
      title: "Main reception",
      date: "2026-12-14",
      displayDate: "14 December 2026",
      time: "From 11:00 AM",
      venue: "K. R. Thekkedath Mana",
      address: "Ottupara–Kunnamkulam Road, Thalappally, Kerala",
      mapUrl: mapsSearch("K. R. Thekkedath Mana, Ottupara–Kunnamkulam Road, Thalappally, Kerala"),
      publicInvitation: true,
      note: "Our main celebration with family and friends.",
    },
  ] satisfies WeddingEvent[],
  placeholders: {
    dressCode: null, // TODO: Confirm whether a dress code will be specified.
    accommodationTravel: null, // TODO: Confirm whether accommodation or travel information will be added.
    digitalGuestbook: null, // TODO: Confirm whether the couple wants a digital guestbook.
    rsvpStorage: "Neon PostgreSQL via the server-side Vercel API route", // TODO: Confirm the final RSVP storage choice before invitations are sent.
  },
  social: {
    title: "Sree & Sajith — Wedding Invitation",
    description: "Join Sree and Sajith as they celebrate their wedding in Thrissur, Kerala, on 14 December 2026.",
  },
} as const;

export type WeddingData = typeof wedding;
