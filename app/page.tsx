import { MajesticonChatText, MajesticonMail, MajesticonMapMarker } from "./components/Majesticons";
import { wedding, type WeddingEvent } from "../src/data/wedding";
import RSVPForm from "./components/RSVPForm";
import VenueCard from "./components/VenueCard";

const mana = wedding.events.find((event) => event.id === "reception")!;
const temple = wedding.events.find((event) => event.id === "temple")!;

function GaneshaMark() {
  return <svg className="ganesha" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Ganesha, invoked for an auspicious beginning"><path d="M48 24c3-4 7-6 12-6s9 2 12 6M38 44c0-13 10-22 22-22s22 9 22 22c0 8-3 13-8 17M38 44c0 8 3 13 8 17M38 34c-8-3-14 2-14 10s7 14 15 12M82 34c8-3 14 2 14 10s-7 14-15 12M60 30v10M60 48c0 10-1 18-1 26 0 7 5 11 11 11s10-4 10-10M50 58c-3 5-2 9 1 12M70 58c3 5 2 9-1 12M30 100c8-8 18-8 30-8s22 0 30 8M24 104h72" /><circle cx="51" cy="46" r="1.6" fill="currentColor" stroke="none" /><circle cx="69" cy="46" r="1.6" fill="currentColor" stroke="none" /><circle cx="60" cy="10" r="2" fill="currentColor" stroke="none" /></svg>;
}

function EventCard({ event, index }: { event: WeddingEvent; index: number }) {
  return <article className="event-card">
    <p className="eyebrow">Event {String(index + 1).padStart(2, "0")}</p>
    <p className="event-date">{event.displayDate}</p>
    <h3>{event.title}</h3>
    {event.time && <p className="event-time">{event.time}</p>}
    <div className="event-place"><MajesticonMapMarker size={18} /><p><strong>{event.venue}</strong><br />{event.address}</p></div>
    <p className="event-note">{event.note}</p>
    <a className="text-link" href={event.mapUrl} target="_blank" rel="noreferrer">View on Google Maps <span aria-hidden="true">↗</span></a>
  </article>;
}

export default function Page() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <nav className="nav" aria-label="Main navigation"><a className="monogram" href="#home" aria-label="Sajith and Sreelakshmi, home">{wedding.couple.monogram}</a><div className="nav-links">{[["Events", "events"], ["Venues", "venues"], ["RSVP", "rsvp"]].map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}</div></nav>
    <main id="main">
      <header id="home" className="hero"><div className="card-border" aria-hidden="true" /><div className="hero-inner"><GaneshaMark /><h1><span>Sajith</span><em>&amp;</em><span>Sreelakshmi</span></h1><p className="invitation-line">Together with our families,<br />we invite you to celebrate with us.</p><div className="hero-details"><strong>13–14 December 2026</strong><span>Thrissur, Kerala</span></div></div></header>
      <section className="parents section"><p className="eyebrow">WITH THE BLESSINGS OF OUR PARENTS</p><h2>{wedding.parents[0]}</h2><span className="and">and</span><h2>{wedding.parents[1]}</h2><p>together with the blessings of our grandparents and elders,<br /><br />we invite you to join us in celebrating our wedding.</p></section>
      <section id="events" className="events-section section"><div className="section-title"><p className="eyebrow">The celebration</p><h2>Wedding Events</h2></div><div className="event-list">{wedding.events.map((event, index) => <EventCard event={event} index={index} key={event.id} />)}</div></section>
      <section id="venues" className="venues-section section"><div className="section-title centered"><p className="eyebrow">Where to find us</p><h2>Venues</h2><p>Directions and practical details for our two wedding venues.</p></div><div className="venue-list"><VenueCard event={temple} /><VenueCard event={mana} /></div></section>
      <section id="rsvp" className="rsvp-section section"><div className="rsvp-intro"><p className="eyebrow">Kindly respond</p><h2>RSVP</h2><p>Please reply by <strong>{wedding.rsvp.deadline}</strong>.</p><p>The quiet temple ceremony is reserved for our closest family. We look forward to celebrating with you at the receptions.</p><div className="contacts"><h3>WhatsApp</h3>{wedding.contacts.map((contact) => <a key={`wa-${contact.name}`} href={`https://wa.me/${contact.phoneE164}?text=${encodeURIComponent("Hello, I’m writing about the wedding celebrations.")}`} target="_blank" rel="noreferrer"><MajesticonChatText size={18} /><span><strong>{contact.name}</strong><small>{contact.phoneDisplay}</small></span></a>)}<h3>Email</h3>{wedding.contacts.map((contact) => <a key={`mail-${contact.name}`} href={`mailto:${contact.email}?subject=${encodeURIComponent("Wedding RSVP — Sajith & Sreelakshmi")}`}><MajesticonMail size={18} /><span><strong>{contact.name}</strong><small>{contact.email}</small></span></a>)}</div></div><RSVPForm /></section>
      <section className="closing"><div className="closing-mark">{wedding.couple.monogram}</div><p>13–14 December 2026<br />Thrissur, Kerala</p></section>
      <section className="welcome section"><div className="kolam-rule" aria-hidden="true" /><h2>We would be delighted<br />to celebrate with you.</h2><div className="languages"><p lang="ml">{wedding.phrases.malayalam}</p><p lang="ta">{wedding.phrases.tamil}</p></div></section>
    </main>
    <footer><span>{wedding.couple.monogram}</span><span>Wedding invitation · 2026</span></footer>
  </>;
}
