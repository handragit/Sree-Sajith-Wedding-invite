"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Heart,
  MapPin,
  Menu,
  Music2,
  Plane,
  Sparkles,
  X
} from "lucide-react";

const weddingDate = new Date("2027-02-14T16:00:00+05:30");

const events = [
  {
    date: "FEB 13",
    time: "6:00 PM",
    title: "Welcome Sundowner",
    place: "The Garden Terrace",
    note: "Drinks, small plates & sunset stories",
    dress: "Festive garden"
  },
  {
    date: "FEB 14",
    time: "4:00 PM",
    title: "The Wedding",
    place: "The Lakeside Lawn",
    note: "Ceremony followed by dinner & dancing",
    dress: "Indian formal · jewel tones"
  },
  {
    date: "FEB 15",
    time: "10:30 AM",
    title: "Farewell Brunch",
    place: "The Courtyard",
    note: "Coffee, comfort food & one last hug",
    dress: "Easy breezy"
  }
];

const faqs = [
  ["Can I bring a plus one?", "Your invitation will mention whether a plus one is included. If you’re unsure, send us a note—we’re happy to help."],
  ["Are children invited?", "We adore your little ones. Please check your invitation for the names included in your party."],
  ["What will the weather be like?", "February evenings are lovely but can get cool by the lake. A light shawl or jacket is a good idea."],
  ["Will transport be arranged?", "Yes. Shuttles will run between our partner hotels and the venue. Timings will be shared closer to the weekend."]
];

const quiz = [
  { q: "Who said “I love you” first?", options: ["Maya", "Aarav", "At the exact same time"], answer: 1 },
  { q: "Their ideal Sunday looks like…", options: ["A sunrise hike", "Brunch that becomes dinner", "A movie marathon"], answer: 1 },
  { q: "Who is most likely to own the dance floor?", options: ["Maya", "Aarav", "Both—after dessert"], answer: 2 }
];

function Countdown() {
  const [time, setTime] = useState({ days: "—", hours: "—", mins: "—", secs: "—" });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, weddingDate.getTime() - Date.now());
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        mins: Math.floor((diff / 60000) % 60),
        secs: Math.floor((diff / 1000) % 60)
      });
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown" aria-label="Countdown to the wedding">
      {Object.entries(time).map(([label, value]) => (
        <div key={label}><strong>{String(value).padStart(2, "0")}</strong><span>{label}</span></div>
      ))}
    </div>
  );
}

function Quiz() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const answer = (index) => {
    const nextScore = score + (index === quiz[step].answer ? 1 : 0);
    setScore(nextScore);
    if (step === quiz.length - 1) setDone(true);
    else setStep(step + 1);
  };

  const reset = () => { setStep(0); setScore(0); setDone(false); };

  return (
    <div className="quiz-card">
      {!done ? (
        <>
          <div className="quiz-top"><span>QUESTION {step + 1} OF {quiz.length}</span><span>{score} right</span></div>
          <div className="quiz-progress"><i style={{ width: `${((step + 1) / quiz.length) * 100}%` }} /></div>
          <h3>{quiz[step].q}</h3>
          <div className="answers">
            {quiz[step].options.map((option, index) => (
              <button key={option} onClick={() => answer(index)}>{option}<ArrowRight size={17} /></button>
            ))}
          </div>
        </>
      ) : (
        <div className="quiz-result">
          <Sparkles size={32} />
          <p className="eyebrow">THE VERDICT IS IN</p>
          <h3>{score === 3 ? "You know us frighteningly well!" : score >= 2 ? "Inner-circle energy!" : "See you at the welcome drinks!"}</h3>
          <p>You got {score} out of {quiz.length}. Either way, you’ve earned a spin on the dance floor.</p>
          <button className="text-button" onClick={reset}>Play again <ArrowRight size={16} /></button>
        </div>
      )}
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(0);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [wish, setWish] = useState("");
  const [wishes, setWishes] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("wedding-wishes") || "[]");
    setWishes(stored);
  }, []);

  const addWish = (e) => {
    e.preventDefault();
    if (!wish.trim()) return;
    const next = [{ text: wish.trim(), id: Date.now() }, ...wishes].slice(0, 6);
    setWishes(next);
    localStorage.setItem("wedding-wishes", JSON.stringify(next));
    setWish("");
  };

  return (
    <main>
      <nav>
        <a className="monogram" href="#home">M <Heart size={12} fill="currentColor" /> A</a>
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          {["Story", "Weekend", "Stay", "Play", "FAQ"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{item}</a>
          ))}
          <button className="nav-rsvp" onClick={() => { setRsvpOpen(true); setMenuOpen(false); }}>RSVP</button>
        </div>
        <button className="menu" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      <header id="home" className="hero">
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="hero-copy">
          <p className="eyebrow">SAVE THE WEEKEND · 13—15 FEBRUARY 2027</p>
          <h1>Maya <em>&</em><br />Aarav</h1>
          <p className="hero-lead">are getting married</p>
          <div className="hero-meta"><MapPin size={17} /> Udaipur, Rajasthan</div>
          <button className="primary" onClick={() => setRsvpOpen(true)}>Kindly respond <ArrowRight size={18} /></button>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="sun"><span>14</span><small>FEB</small></div>
          <div className="arch arch-back" />
          <div className="arch arch-front"><div className="couple-mark">M<span>♥</span>A</div></div>
          <div className="flower flower-one">✦</div>
          <div className="flower flower-two">✺</div>
        </div>
        <a href="#story" className="scroll-note">SCROLL TO CELEBRATE <ChevronDown size={16} /></a>
      </header>

      <section className="countdown-wrap">
        <p>Until we say “we do”</p>
        <Countdown />
      </section>

      <section id="story" className="story section">
        <div className="section-number">01</div>
        <div className="story-heading">
          <p className="eyebrow">A SHORT VERSION OF A LONG STORY</p>
          <h2>One wrong turn.<br />One very right person.</h2>
        </div>
        <div className="story-copy">
          <p>We met in 2019 when Aarav confidently led a group hike in completely the wrong direction. Maya was the only one who found it funny.</p>
          <p>Six years, three cities, and an unreasonable number of shared desserts later, we’re gathering our favourite people in one beautiful place.</p>
          <p className="script">We can’t wait to celebrate with you.</p>
        </div>
        <div className="story-stamp"><Heart fill="currentColor" /><span>EST.<br />2019</span></div>
      </section>

      <section id="weekend" className="weekend section dark">
        <div className="section-intro">
          <p className="eyebrow coral">THE CELEBRATION</p>
          <h2>A whole weekend<br />of <em>good things.</em></h2>
          <p>Come for the vows. Stay for the stories, the dancing, and the second helping of dessert.</p>
        </div>
        <div className="event-list">
          {events.map((event, index) => (
            <article key={event.title}>
              <div className="event-index">0{index + 1}</div>
              <div className="event-date">{event.date}<span>{event.time}</span></div>
              <div className="event-main">
                <h3>{event.title}</h3>
                <p><MapPin size={15} /> {event.place}</p>
                <p className="muted">{event.note}</p>
              </div>
              <div className="dress">{event.dress}</div>
            </article>
          ))}
        </div>
      </section>

      <section id="stay" className="travel section">
        <div className="travel-card">
          <p className="eyebrow">GETTING THERE & STAYING OVER</p>
          <h2>Make a little<br />holiday of it.</h2>
          <p>We’ve reserved rooms at two nearby hotels and arranged weekend shuttles. Udaipur airport is a scenic 40-minute drive from the celebration.</p>
          <div className="travel-actions">
            <a href="https://maps.google.com/?q=Udaipur+Rajasthan" target="_blank" rel="noreferrer"><MapPin size={18} /> View the area</a>
            <a href="mailto:hello@example.com?subject=Wedding travel help"><Plane size={18} /> Ask about travel</a>
          </div>
        </div>
        <div className="travel-notes">
          <div><CalendarDays /><span><strong>Arrive by</strong>Friday, 13 February · 3 PM</span></div>
          <div><Plane /><span><strong>Nearest airport</strong>Maharana Pratap Airport (UDR)</span></div>
          <div><Music2 /><span><strong>Shuttle service</strong>All official events, all weekend</span></div>
        </div>
      </section>

      <section id="play" className="play section">
        <div className="play-copy">
          <p className="eyebrow">A LITTLE SOMETHING FUN</p>
          <h2>How well do you<br />know the almost-newlyweds?</h2>
          <p>No pressure. Only lifelong bragging rights.</p>
        </div>
        <Quiz />
      </section>

      <section className="wishes section">
        <div>
          <p className="eyebrow">THE DIGITAL GUESTBOOK</p>
          <h2>Leave a little love.</h2>
          <p>Share a wish, a piece of advice, or your best dance-floor request. Your notes are saved on this device as a sweet preview.</p>
        </div>
        <form onSubmit={addWish}>
          <textarea value={wish} onChange={e => setWish(e.target.value)} maxLength={160} placeholder="Dear Maya & Aarav…" aria-label="Your wish" />
          <div><small>{wish.length}/160</small><button className="primary" type="submit">Send your wish <Heart size={16} /></button></div>
        </form>
        {wishes.length > 0 && <div className="wish-wall">{wishes.map(item => <blockquote key={item.id}>“{item.text}”</blockquote>)}</div>}
      </section>

      <section id="faq" className="faq section">
        <div>
          <p className="eyebrow">GOOD TO KNOW</p>
          <h2>A few answers<br />before you ask.</h2>
        </div>
        <div className="faq-list">
          {faqs.map(([question, answer], index) => (
            <article className={faqOpen === index ? "open" : ""} key={question}>
              <button onClick={() => setFaqOpen(faqOpen === index ? -1 : index)}><span>{question}</span><span>{faqOpen === index ? "−" : "+"}</span></button>
              <div><p>{answer}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <div className="mini-sun">✦</div>
        <p className="eyebrow">ONE LAST THING</p>
        <h2>Will you be there?</h2>
        <p>Please reply by 01 November 2026.<br />We’re saving you a seat—and possibly a dance.</p>
        <button className="primary light" onClick={() => setRsvpOpen(true)}>RSVP now <ArrowRight size={18} /></button>
      </section>

      <footer>
        <div className="monogram">M <Heart size={12} fill="currentColor" /> A</div>
        <p>Made with love, snacks & several opinions.</p>
        <p>Udaipur · 2027</p>
      </footer>

      {rsvpOpen && (
        <div className="modal-backdrop" onMouseDown={() => setRsvpOpen(false)}>
          <div className="modal" onMouseDown={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setRsvpOpen(false)} aria-label="Close"><X /></button>
            {!submitted ? (
              <>
                <p className="eyebrow">KINDLY RESPOND</p>
                <h2>We hope it’s a yes.</h2>
                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                  <label>Your name<input required placeholder="First & last name" /></label>
                  <label>Email address<input required type="email" placeholder="you@example.com" /></label>
                  <fieldset><legend>Will you join us?</legend>
                    <label><input required type="radio" name="attending" /> Joyfully accepts</label>
                    <label><input required type="radio" name="attending" /> Regretfully declines</label>
                  </fieldset>
                  <label>Dietary notes<textarea placeholder="Allergies or preferences" /></label>
                  <button className="primary" type="submit">Send RSVP <ArrowRight size={17} /></button>
                </form>
                <small className="form-note">Demo RSVP: connect this form to your preferred email or guest-list service before sending invitations.</small>
              </>
            ) : (
              <div className="success"><div><Check /></div><p className="eyebrow">RESPONSE RECEIVED</p><h2>Thank you!</h2><p>Your demo response is all set. We can’t wait to celebrate together.</p></div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
