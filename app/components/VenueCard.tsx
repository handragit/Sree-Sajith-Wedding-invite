"use client";

import { useState } from "react";
import { MajesticonCalendar, MajesticonClipboard, MajesticonMapMarker } from "./Majesticons";
import type { WeddingEvent } from "../../src/data/wedding";

function CalendarLink({ event }: { event: WeddingEvent }) {
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Sajith and Sreelakshmi//Wedding//EN", "CALSCALE:GREGORIAN", "BEGIN:VEVENT", "UID:wedding-celebration-20261214@sree-sajith-wedding.vercel.app", "DTSTAMP:20260813T000000Z", "DTSTART;TZID=Asia/Kolkata:20261214T110000", "SUMMARY:Sajith & Sreelakshmi — Wedding Celebration", `LOCATION:${event.venue}\\, ${event.address}`, "DESCRIPTION:Wedding ceremonies and celebration with family and friends.", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  return <a className="button button--outline" download="sajith-sreelakshmi-wedding.ics" href={`data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`}><MajesticonCalendar size={17} /> Add to Calendar</a>;
}

export default function VenueCard({ event }: { event: WeddingEvent }) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  async function copyAddress() {
    try { await navigator.clipboard.writeText(`${event.venue}, ${event.address}`); setCopyStatus("copied"); }
    catch { setCopyStatus("error"); }
    window.setTimeout(() => setCopyStatus("idle"), 2200);
  }
  return <article className="venue-card">
    <div className="venue-ornament" aria-hidden="true"><span>✦</span></div>
    <div><h3>{event.venue}</h3><address>{event.address}</address><div className="actions"><a className="button button--solid" href={event.mapUrl} target="_blank" rel="noreferrer"><MajesticonMapMarker size={17} /> Get Directions</a>{event.id === "reception" && <CalendarLink event={event} />}<button className="button button--outline" onClick={copyAddress} type="button"><MajesticonClipboard size={17} /> {copyStatus === "copied" ? "Address copied" : copyStatus === "error" ? "Copy unavailable" : "Copy Address"}</button></div><span className="sr-only" aria-live="polite">{copyStatus === "copied" ? "Address copied to clipboard." : copyStatus === "error" ? "The address could not be copied. Select the address text to copy it manually." : ""}</span></div>
  </article>;
}
