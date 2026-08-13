"use client";

import { FormEvent, useRef, useState } from "react";
import { CalendarDays, Check, Clipboard, Mail, MapPin, Menu, MessageCircle, X } from "lucide-react";
import { wedding, type WeddingEvent } from "../src/data/wedding";

const mana = wedding.events.find((event) => event.id === "reception")!;
const temple = wedding.events.find((event) => event.id === "temple")!;

function GaneshaMark() {
  return <svg className="ganesha" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Ganesha, invoked for an auspicious beginning"><path d="M48 24c3-4 7-6 12-6s9 2 12 6M38 44c0-13 10-22 22-22s22 9 22 22c0 8-3 13-8 17M38 44c0 8 3 13 8 17M38 34c-8-3-14 2-14 10s7 14 15 12M82 34c8-3 14 2 14 10s-7 14-15 12M60 30v10M60 48c0 10-1 18-1 26 0 7 5 11 11 11s10-4 10-10M50 58c-3 5-2 9 1 12M70 58c3 5 2 9-1 12M30 100c8-8 18-8 30-8s22 0 30 8M24 104h72" /><circle cx="51" cy="46" r="1.6" fill="currentColor" stroke="none" /><circle cx="69" cy="46" r="1.6" fill="currentColor" stroke="none" /><circle cx="60" cy="10" r="2" fill="currentColor" stroke="none" /></svg>;
}

function CalendarLink() {
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Sajith and Sreelakshmi//Wedding//EN", "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT", "UID:wedding-celebration-20261214@sree-sajith-wedding.vercel.app",
    "DTSTAMP:20260813T000000Z", "DTSTART;TZID=Asia/Kolkata:20261214T110000",
    "SUMMARY:Sajith & Sreelakshmi — Wedding Celebration", `LOCATION:${mana.venue}\\, ${mana.address}`,
    "DESCRIPTION:Wedding ceremonies and celebration with family and friends.", "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  return <a className="button button--outline" download="sajith-sreelakshmi-wedding.ics" href={`data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`}><CalendarDays size={17} /> Add to Calendar</a>;
}

function RSVPForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "fallback" | "error">("idle");
  const [message, setMessage] = useState("");
  const lastSubmission = useRef(0);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (Date.now() - lastSubmission.current < 8000) { setStatus("error"); setMessage("Please wait a moment before trying again."); return; }
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    if (data.website) return;
    const attendees = Number(data.attendees);
    if (!data.name || !data.email || !data.attendance || !data.celebration || !Number.isInteger(attendees) || attendees < 1 || attendees > 12) {
      setStatus("error"); setMessage("Please check the required fields and attendee count."); return;
    }
    lastSubmission.current = Date.now(); setStatus("sending"); setMessage("");
    try {
      const response = await fetch("/api/rsvp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await response.json();
      if (response.ok && result.persisted) { setStatus("success"); setMessage("Thank you — your response has been securely received."); form.reset(); }
      else if (response.status === 503) { setStatus("fallback"); setMessage("Online saving is temporarily unavailable. Please respond by WhatsApp or email below."); }
      else throw new Error(result.error || "Unable to save RSVP");
    } catch { setStatus("fallback"); setMessage("We couldn’t save your response just now. Please use WhatsApp or email below."); }
  }

  return <form className="rsvp-form" onSubmit={submit} noValidate>
    <div className="field field--full"><label htmlFor="name">Guest name</label><input id="name" name="name" required autoComplete="name" /></div>
    <div className="field field--full"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" required autoComplete="email" /></div>
    <div className="field"><label htmlFor="attendance">Attendance status</label><select id="attendance" name="attendance" required defaultValue=""><option value="" disabled>Select one</option><option>Attending</option><option>Unable to attend</option></select></div>
    <div className="field"><label htmlFor="attendees">Number attending</label><input id="attendees" name="attendees" type="number" min="1" max="12" defaultValue="1" required /></div>
    <div className="field field--full"><label htmlFor="celebration">Which celebration?</label><select id="celebration" name="celebration" required defaultValue=""><option value="" disabled>Select one</option><option value="Evening reception â€” 13 December">Evening reception — 13 December</option><option value="Main reception â€” 14 December">Wedding celebration — 14 December</option><option>Both receptions</option><option>Unable to attend</option></select></div>
    <div className="field field--full"><label htmlFor="dietary">Dietary requirements <span>optional</span></label><input id="dietary" name="dietary" /></div>
    <div className="field field--full"><label htmlFor="message">A message for the couple <span>optional</span></label><textarea id="message" name="message" rows={4} maxLength={600} /></div>
    <div className="honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
    <button className="button button--solid" disabled={status === "sending"} type="submit">{status === "sending" ? "Sending…" : "Send RSVP"}</button>
    {message && <p className={`form-status form-status--${status}`} role="status">{status === "success" && <Check size={17} />} {message}</p>}
  </form>;
}

function EventCard({ event, index }: { event: WeddingEvent; index: number }) {
  return <article className="event-card">
    <p className="eyebrow">Event {String(index + 1).padStart(2, "0")}</p>
    <p className="event-date">{event.displayDate}</p>
    <h3>{event.title}</h3>
    {event.time && <p className="event-time">{event.time}</p>}
    <div className="event-place"><MapPin size={18} aria-hidden="true" /><p><strong>{event.venue}</strong><br />{event.address}</p></div>
    <p className="event-note">{event.note}</p>
    <a className="text-link" href={event.mapUrl} target="_blank" rel="noreferrer">View on Google Maps <span aria-hidden="true">↗</span></a>
  </article>;
}

function VenueCard({ event }: { event: WeddingEvent }) {
  const [copied, setCopied] = useState(false);
  async function copyAddress() { await navigator.clipboard.writeText(`${event.venue}, ${event.address}`); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }
  return <article className="venue-card">
    <div className="venue-ornament" aria-hidden="true"><span>✦</span></div>
    <div><h3>{event.venue}</h3><address>{event.address}</address><div className="actions"><a className="button button--solid" href={event.mapUrl} target="_blank" rel="noreferrer"><MapPin size={17} /> Get Directions</a>{event.id === "reception" && <CalendarLink />}<button className="button button--outline" onClick={copyAddress} type="button"><Clipboard size={17} /> {copied ? "Address copied" : "Copy Address"}</button></div></div>
  </article>;
}

export default function Page() {
  const [menu, setMenu] = useState(false);
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <nav className="nav" aria-label="Main navigation"><a className="monogram" href="#home" aria-label="Sajith and Sreelakshmi, home">{wedding.couple.monogram}</a><button className="menu-button" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="nav-links" aria-label="Toggle navigation">{menu ? <X /> : <Menu />}</button><div id="nav-links" className={`nav-links ${menu ? "open" : ""}`}>{[["Events", "events"], ["Venues", "venues"], ["RSVP", "rsvp"]].map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{label}</a>)}</div></nav>
    <main id="main">
      <header id="home" className="hero"><div className="card-border" aria-hidden="true" /><div className="hero-inner"><GaneshaMark /><h1><span>Sajith</span><em>&amp;</em><span>Sreelakshmi</span></h1><p className="invitation-line">Together with our families,<br />we invite you to celebrate with us.</p><div className="hero-details"><strong>13–14 December 2026</strong><span>Thrissur, Kerala</span></div></div></header>
      <section className="parents section"><p className="eyebrow">With the blessings of our parents</p><h2>{wedding.parents[0]}</h2><span className="and">and</span><h2>{wedding.parents[1]}</h2><p>we invite you to join us in celebrating our wedding.</p></section>
      <section className="welcome section"><div className="kolam-rule" aria-hidden="true" /><h2>We would be delighted<br />to celebrate with you.</h2><div className="languages"><p lang="ml">{wedding.phrases.malayalam}</p><p lang="ta">{wedding.phrases.tamil}</p></div><p className="date-place">13–14 December 2026 <span>·</span> Thrissur</p></section>
      <section id="events" className="events-section section"><div className="section-title"><p className="eyebrow">The celebration</p><h2>Wedding Events</h2></div><div className="event-list">{wedding.events.map((event, index) => <EventCard event={event} index={index} key={event.id} />)}</div></section>
      <section id="venues" className="venues-section section"><div className="section-title centered"><p className="eyebrow">Where to find us</p><h2>Venues</h2><p>Directions and practical details for our two wedding venues.</p></div><div className="venue-list"><VenueCard event={temple} /><VenueCard event={mana} /></div></section>
      <section id="rsvp" className="rsvp-section section"><div className="rsvp-intro"><p className="eyebrow">Kindly respond</p><h2>RSVP</h2><p>Please reply by <strong>{wedding.rsvp.deadline}</strong>.</p><p>The quiet temple ceremony is reserved for our closest family. We look forward to celebrating with you at the receptions.</p><div className="contacts"><h3>WhatsApp</h3>{wedding.contacts.map((contact) => <a key={`wa-${contact.name}`} href={`https://wa.me/${contact.phoneE164}?text=${encodeURIComponent("Hello, I’m writing about the wedding celebrations.")}`} target="_blank" rel="noreferrer"><MessageCircle size={18} /><span><strong>{contact.name}</strong><small>{contact.phoneDisplay}</small></span></a>)}<h3>Email</h3>{wedding.contacts.map((contact) => <a key={`mail-${contact.name}`} href={`mailto:${contact.email}?subject=${encodeURIComponent("Wedding RSVP — Sajith & Sreelakshmi")}`}><Mail size={18} /><span><strong>{contact.name}</strong><small>{contact.email}</small></span></a>)}</div></div><RSVPForm /></section>
      <section className="closing"><div className="closing-mark">{wedding.couple.monogram}</div><p>13–14 December 2026<br />Thrissur, Kerala</p></section>
    </main>
    <footer><span>{wedding.couple.monogram}</span><span>Wedding invitation · 2026</span></footer>
  </>;
}
