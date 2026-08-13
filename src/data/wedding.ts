export type WeddingEvent = {
  id: "evening" | "temple" | "reception";
  title: string;
  date: string;
  displayDate: string;
  time: string | null;
  venue: string;
  address: string;
  mapUrl: string;
  publicInvitation: boolean;
  note: string;
};

const mapsSearch = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const manaAddress = "Ottupara–Kunnamkulam Road, Thalappally, Kerala";

export const wedding = {
  couple: { first: "Sajith", second: "Sreelakshmi", display: "Sajith & Sreelakshmi", monogram: "S & S" },
  year: 2026,
  weddingDate: "2026-12-14",
  timezone: "Asia/Kolkata",
  location: "Thrissur, Kerala",
  canonicalUrl: "https://sree-sajith-wedding.vercel.app",
  parents: ["Subramanian & Padma", "Chandran & Sunitha"],
  rsvp: { deadline: "20 October 2026" },
  contacts: [
    { name: "Sreelakshmi", phoneDisplay: "+44 7824 069153", phoneE164: "447824069153", email: "subramaniansreelakshmi0@gmail.com" },
    { name: "Sajith", phoneDisplay: "+91 94958 92900", phoneE164: "919495892900", email: "sajithchan369@gmail.com" },
  ],
  phrases: {
    malayalam: "സ്നേഹത്തോടെ സ്വാഗതം",
    tamil: "அன்புடன் வரவேற்கிறோம்",
  },
  events: [
    {
      id: "evening",
      title: "Evening Reception / Party",
      date: "2026-12-13",
      displayDate: "13 December 2026",
      time: null,
      venue: "K. R. Thekkedath Mana",
      address: manaAddress,
      mapUrl: mapsSearch(`K. R. Thekkedath Mana, ${manaAddress}`),
      publicInvitation: true,
      note: "An evening celebration with family and friends.",
    },
    {
      id: "temple",
      title: "Wedding Ceremony",
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
      title: "Wedding Ceremonies & Celebration",
      date: "2026-12-14",
      displayDate: "14 December 2026",
      time: "From 11:00 AM",
      venue: "K. R. Thekkedath Mana",
      address: manaAddress,
      mapUrl: mapsSearch(`K. R. Thekkedath Mana, ${manaAddress}`),
      publicInvitation: true,
      note: "Join us as the wedding ceremonies and celebrations continue with family and friends.",
    },
  ] satisfies WeddingEvent[],
  social: {
    title: "Sajith & Sreelakshmi — Wedding Invitation",
    description: "Join Sajith and Sreelakshmi for their wedding celebrations in Thrissur, Kerala, on 13–14 December 2026.",
  },
} as const;

export type WeddingData = typeof wedding;
