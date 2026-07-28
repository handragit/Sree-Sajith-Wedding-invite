"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { CalendarDays, Check, ChevronDown, Clipboard, Clock3, Mail, MapPin, Menu, MessageCircle, X } from "lucide-react";
import { wedding } from "../src/data/wedding";

const mainReception = wedding.events.find((event) => event.id === "reception")!;

function Lamp({ compact = false }: { compact?: boolean }) {
  return (
    <svg className={`lamp ${compact ? "lamp--compact" : ""}`} viewBox="0 0 240 520" aria-hidden="true">
      <defs>
        <radialGradient id="flame" cx="50%" cy="55%">
          <stop offset="0" stopColor="#fff4bc" />
          <stop offset=".48" stopColor="#e6a83c" />
          <stop offset="1" stopColor="#8b3b20" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="brass" x1="0" x2="1">
          <stop stopColor="#74451f" /><stop offset=".48" stopColor="#e2b75f" /><stop offset=".7" stopColor="#9e672c" /><stop offset="1" stopColor="#4e2c19" />
        </linearGradient>
      </defs>
      <ellipse className="lamp-glow" cx="120" cy="130" rx="110" ry="120" fill="url(#flame)" />
      <path className="flame" d="M120 36c31 43 28 75 0 98-28-23-31-55 0-98Z" fill="#f6c968" />
      <path d="M69 143c17 22 85 22 102 0-8 38-28 53-51 53s-43-15-51-53Z" fill="url(#brass)" />
      <path d="M112 190h16v202h-16z" fill="url(#brass)" />
      <path d="M82 388h76l18 24H64l18-24Zm-27 31h130l21 42H34l21-42Z" fill="url(#brass)" />
      <ellipse cx="120" cy="461" rx="92" ry="18" fill="#5a321d" opacity=".7" />
    </svg>
  );
}

function Countdown() {
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setRemaining(new Date(wedding.countdownTarget).getTime() - Date.now());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);
  if (remaining !== null && remaining <= 0) return <p className="countdown-finished">The celebrations have begun.</p>;
  const value = Math.max(0, remaining ?? 0);
  const units = [
    ["Days", Math.floor(value / 86400000)],
    ["Hours", Math.floor((value / 3600000) % 24)],
    ["Minutes", Math.floor((value / 60000) % 60)],
    ["Seconds", Math.floor((value / 1000) % 60)],
  ];
  return <div className="countdown" aria-live="polite">{units.map(([label, number]) => <div key={label}><strong>{remaining === null ? "—" : String(number).padStart(2, "0")}</strong><span>{label}</span></div>)}</div>;
}

function IstanbulArt() {
  return <div className="istanbul-art" aria-hidden="true">
    <div className="moon" />
    <svg viewBox="0 0 1200 420" preserveAspectRatio="none">
      <path className="water-line line-a" d="M0 345 C240 275 390 410 610 335 S960 270 1200 350" />
      <path className="water-line line-b" d="M0 375 C250 315 420 430 650 365 S970 320 1200 390" />
      <path className="path-line path-one" d="M0 410 C240 300 420 310 600 240" />
      <path className="path-line path-two" d="M1200 410 C960 300 780 310 600 240" />
      <g className="skyline"><path d="M0 334h95v-68h20v68h85v-104h22v104h70v-55h45v55h82v-126h18v126h70v-67h35v67h94v-155h18v155h72v-83h55v83h83v-115h20v115h90v-57h36v57h100v86H0Z" /></g>
    </svg>
    <div className="city-lights">{Array.from({ length: 18 }, (_, i) => <i key={i} />)}</div>
  </div>;
}

function CalendarLink() {
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Sree and Sajith//Wedding//EN", "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT", "UID:main-reception-20261214@sree-sajith-wedding.vercel.app",
    "DTSTAMP:20260728T000000Z", "DTSTART;TZID=Asia/Kolkata:20261214T110000", "DTEND;TZID=Asia/Kolkata:20261214T150000",
    "SUMMARY:Sree & Sajith — Main Reception", `LOCATION:${mainReception.venue}\\, ${mainReception.address}`,
    "DESCRIPTION:Celebrate Sree and Sajith's wedding reception.", "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  return <a className="button button--ghost" download="sree-sajith-main-reception.ics" href={`data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`}><CalendarDays size={17} /> Add to calendar</a>;
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
    lastSubmission.current = Date.now();
    setStatus("sending"); setMessage("");
    try {
      const response = await fetch("/api/rsvp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await response.json();
      if (response.ok && result.persisted) { setStatus("success"); setMessage("Thank you — your response has been securely received."); form.reset(); }
      else if (response.status === 503) { setStatus("fallback"); setMessage("Online saving is not configured yet. Please send your response by WhatsApp or email below."); }
      else throw new Error(result.error || "Unable to save RSVP");
    } catch {
      setStatus("fallback"); setMessage("We couldn’t save your response just now. Please use WhatsApp or email so Sree receives it.");
    }
  }

  return <form className="rsvp-form" onSubmit={submit} noValidate>
    <div className="field field--full"><label htmlFor="name">Guest name</label><input id="name" name="name" required autoComplete="name" /></div>
    <div className="field field--full"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" required autoComplete="email" /></div>
    <div className="field"><label htmlFor="attendance">Attendance status</label><select id="attendance" name="attendance" required defaultValue=""><option value="" disabled>Select one</option><option>Attending</option><option>Unable to attend</option></select></div>
    <div className="field"><label htmlFor="attendees">Number attending</label><input id="attendees" name="attendees" type="number" min="1" max="12" defaultValue="1" required /></div>
    <div className="field field--full"><label htmlFor="celebration">Which celebration?</label><select id="celebration" name="celebration" required defaultValue=""><option value="" disabled>Select one</option><option>Evening reception — 13 December</option><option>Main reception — 14 December</option><option>Both receptions</option><option>Unable to attend</option></select></div>
    <div className="field field--full"><label htmlFor="dietary">Dietary requirements <span>optional</span></label><input id="dietary" name="dietary" /></div>
    <div className="field field--full"><label htmlFor="message">A message for the couple <span>optional</span></label><textarea id="message" name="message" rows={4} maxLength={600} /></div>
    <div className="honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
    <button className="button button--gold" disabled={status === "sending"} type="submit">{status === "sending" ? "Sending…" : "Send RSVP"}</button>
    {message && <p className={`form-status form-status--${status}`} role="status">{status === "success" && <Check size={17} />} {message}</p>}
  </form>;
}

export default function Page() {
  const [menu, setMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")), { threshold: .16 });
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  const whatsapp = `https://wa.me/${wedding.rsvp.phoneE164}?text=${encodeURIComponent("Hello Sree, I’m writing about the wedding celebrations.")}`;
  const copyAddress = async () => { await navigator.clipboard.writeText(mainReception.address!); setCopied(true); window.setTimeout(() => setCopied(false), 1800); };

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <nav className="nav" aria-label="Main navigation">
      <a className="monogram" href="#home" aria-label="Sree and Sajith, home">{wedding.couple.monogram}</a>
      <button className="menu-button" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="nav-links" aria-label="Toggle navigation">{menu ? <X /> : <Menu />}</button>
      <div id="nav-links" className={`nav-links ${menu ? "open" : ""}`}>
        {[["Our Story", "story"], ["Celebrations", "celebrations"], ["Venue", "venue"], ["RSVP", "rsvp"]].map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{label}</a>)}
      </div>
    </nav>
    <main id="main">
      <header id="home" className="hero">
        <div className="hero-pattern" aria-hidden="true" />
        <div className="hero-language"><span lang="ml">{wedding.phrases.malayalam}</span><i /><span lang="ta">{wedding.phrases.tamil}</span></div>
        <Lamp />
        <div className="hero-copy">
          <p className="overline">{wedding.phrases.english}</p>
          <h1><span>Sree</span><em>&</em><span>Sajith</span></h1>
          <p className="hero-line">We are getting married</p>
          <p className="hero-date">14 December 2026 <i /> Thrissur, Kerala</p>
        </div>
        <a href="#countdown" className="scroll-cue">Scroll to begin <ChevronDown size={16} /></a>
      </header>

      <section id="countdown" className="countdown-section">
        <p className="overline">Until our wedding day</p><Countdown />
      </section>

      <section id="story" className="story-intro">
        <div className="reveal"><p className="overline">Our story</p><h2>In time, and across distance,<br />two paths found each other again.</h2></div>
      </section>
      <div className="story-journey">
        {wedding.story.map((chapter, index) => <section key={chapter.id} className={`chapter chapter--${chapter.id}`}>
          {chapter.id === "istanbul" && <IstanbulArt />}
          <div className="chapter-number" aria-hidden="true">0{index + 1}</div>
          <div className="chapter-copy reveal"><p className="overline">{chapter.kicker}</p><h2>{chapter.heading}</h2><p>{chapter.body}</p>{"aside" in chapter && <blockquote>{chapter.aside}</blockquote>}</div>
        </section>)}
      </div>

      <section id="celebrations" className="celebrations">
        <div className="section-heading reveal"><p className="overline">The celebrations</p><h2>Three moments.<br />One new beginning.</h2></div>
        <div className="event-flow">
          {wedding.events.map((event, index) => <article className="event reveal" key={event.id}>
            <div className="event-marker"><span>0{index + 1}</span></div>
            <div><p className="event-date">{event.displayDate}</p><h3>{event.title}</h3><p className="event-time">{event.time ?? event.note}</p>{event.venue && <p className="event-place"><MapPin size={16} /> {event.venue}{event.address ? ` · ${event.address}` : ""}</p>}<p className="event-note">{event.note}</p>{event.mapUrl && <a className="text-link" href={event.mapUrl} target="_blank" rel="noreferrer">View on Google Maps <span>↗</span></a>}</div>
          </article>)}
        </div>
      </section>

      <section id="venue" className="venue-section">
        <div className="venue-arch" aria-hidden="true"><Lamp compact /></div>
        <div className="venue-copy reveal"><p className="overline">The main reception · 14 December</p><h2>{mainReception.venue}</h2><p className="venue-time"><Clock3 size={18} /> From 11:00 AM</p><address>{mainReception.address}</address><p>We would be honoured to celebrate this new beginning with you.</p><div className="actions"><a className="button button--gold" href={mainReception.mapUrl!} target="_blank" rel="noreferrer"><MapPin size={17} /> Get directions</a><CalendarLink /><button className="button button--ghost" onClick={copyAddress}><Clipboard size={17} /> {copied ? "Address copied" : "Copy address"}</button></div></div>
      </section>

      <section id="rsvp" className="rsvp-section">
        <div className="rsvp-intro reveal"><p className="overline">Kindly respond</p><h2>Will you join us?</h2><p>Please reply by <strong>{wedding.rsvp.deadline}</strong>. The RSVP choices cover our two receptions; the quiet temple ceremony is reserved for our closest family.</p><div className="contact-actions"><a href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp Sree<br /><small>{wedding.rsvp.phoneDisplay}</small></a><a href={`mailto:${wedding.rsvp.email}?subject=${encodeURIComponent("RSVP — Sree & Sajith")}`}><Mail /> Email Sree<br /><small>{wedding.rsvp.email}</small></a></div></div>
        <RSVPForm />
      </section>

      <section className="closing">
        <div className="kolam" aria-hidden="true" />
        <div className="reveal"><p className="overline">Come celebrate with us.</p><h2>From our beginning, to Istanbul, and now home.</h2><p>From a beginning in our undergraduate years, to finding each other again in Istanbul, our story has brought us here. We would be honoured to celebrate this new beginning with you.</p><div className="closing-languages"><span lang="ml">{wedding.phrases.malayalam}</span><span lang="ta">{wedding.phrases.tamil}</span></div><h3>{wedding.couple.display}</h3><p>14 December 2026 · Thrissur</p></div>
      </section>
    </main>
    <footer><span>{wedding.couple.monogram}</span><span>With love, from Kerala · 2026</span></footer>
  </>;
}
