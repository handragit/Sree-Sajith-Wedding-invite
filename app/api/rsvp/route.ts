import { NextResponse } from "next/server";

type RSVP = { name?: string; email?: string; attendance?: string; attendees?: string | number; celebration?: string; dietary?: string; message?: string; website?: string };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: RSVP;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (body.website) return NextResponse.json({ persisted: true });
  const count = Number(body.attendees);
  if (!body.name?.trim() || !body.email || !emailPattern.test(body.email) || !body.attendance || !body.celebration || !Number.isInteger(count) || count < 1 || count > 12) {
    return NextResponse.json({ error: "Please check the required fields." }, { status: 400 });
  }
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return NextResponse.json({ error: "RSVP storage is not configured.", persisted: false }, { status: 503 });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const payload = { id: crypto.randomUUID(), name: body.name.trim().slice(0, 120), email: body.email.toLowerCase().slice(0, 200), attendance: body.attendance, attendees: count, celebration: body.celebration, dietary: body.dietary?.trim().slice(0, 400) || "", message: body.message?.trim().slice(0, 600) || "", createdAt: new Date().toISOString() };
  const fingerprint = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${ip}:${payload.email}`));
  const rateKey = `rsvp-rate:${Array.from(new Uint8Array(fingerprint)).map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 24)}`;
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  const rate = await fetch(`${url}/get/${rateKey}`, { headers, cache: "no-store" });
  const rateData = await rate.json();
  if (rateData.result) return NextResponse.json({ error: "A response was recently submitted. Please wait before trying again." }, { status: 429 });
  const response = await fetch(`${url}/pipeline`, { method: "POST", headers, body: JSON.stringify([["LPUSH", "wedding:rsvps", JSON.stringify(payload)], ["SET", rateKey, "1", "EX", 60]]) });
  if (!response.ok) return NextResponse.json({ error: "Could not save your response." }, { status: 502 });
  return NextResponse.json({ persisted: true });
}
