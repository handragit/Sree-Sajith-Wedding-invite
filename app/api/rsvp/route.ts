import { neon, NeonDbError } from "@neondatabase/serverless";
import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

type RSVPBody = {
  name?: unknown; email?: unknown; attendance?: unknown; attendees?: unknown;
  celebration?: unknown; dietary?: unknown; message?: unknown; website?: unknown;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_WINDOW_MS = 60_000;
const DUPLICATE_WINDOW_MS = 10 * 60_000;
const attendanceValues = new Map([["Attending", "attending"], ["Unable to attend", "unable_to_attend"], ["Not sure", "not_sure"]]);
const eventValues = new Map<string, string[]>([
  ["Evening reception — 13 December", ["evening_reception"]],
  ["Main reception — 14 December", ["main_reception"]],
  ["Both receptions", ["evening_reception", "main_reception"]],
  ["Unable to attend", []],
]);

// Supplemental only: serverless instances do not share this memory.
const requestWindows = new Map<string, { count: number; resetAt: number }>();
const clean = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";

function rateLimited(request: Request) {
  const raw = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  const key = createHash("sha256").update(raw).digest("hex").slice(0, 24);
  const now = Date.now();
  const current = requestWindows.get(key);
  if (!current || current.resetAt <= now) {
    requestWindows.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > 5;
}

export async function POST(request: Request) {
  let body: RSVPBody;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Please check your response and try again." }, { status: 400 }); }

  if (clean(body.website, 200)) return NextResponse.json({ persisted: true });
  if (rateLimited(request)) return NextResponse.json({ error: "Please wait a moment before trying again." }, { status: 429 });

  const guestName = clean(body.name, 120);
  const email = clean(body.email, 254).toLowerCase();
  const attendanceStatus = attendanceValues.get(clean(body.attendance, 40));
  const events = eventValues.get(clean(body.celebration, 80));
  const guestCount = Number(body.attendees);
  const dietaryRequirements = clean(body.dietary, 500);
  const message = clean(body.message, 1000);
  if (!guestName || (email && !EMAIL_PATTERN.test(email)) || !attendanceStatus || !events ||
      !Number.isInteger(guestCount) || guestCount < 1 || guestCount > 12 ||
      (attendanceStatus === "unable_to_attend" && events.length !== 0) ||
      (attendanceStatus === "attending" && events.length === 0)) {
    return NextResponse.json({ error: "Please check the required fields and try again." }, { status: 400 });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return NextResponse.json({ error: "Online RSVP is temporarily unavailable.", persisted: false }, { status: 503 });

  const bucket = Math.floor(Date.now() / DUPLICATE_WINDOW_MS);
  const submissionHash = createHash("sha256")
    .update(JSON.stringify([guestName.toLowerCase(), email, attendanceStatus, events, guestCount, dietaryRequirements, message, bucket]))
    .digest("hex");
  try {
    const sql = neon(databaseUrl);
    await sql`INSERT INTO rsvps
      (guest_name, attendance_status, events, guest_count, email, dietary_requirements, message, submission_hash)
      VALUES (${guestName}, ${attendanceStatus}, ${events}, ${guestCount}, ${email || null},
      ${dietaryRequirements || null}, ${message || null}, ${submissionHash})`;
    return NextResponse.json({ persisted: true });
  } catch (error) {
    if (error instanceof NeonDbError && error.code === "23505") {
      return NextResponse.json({ error: "This response was already received recently." }, { status: 409 });
    }
    return NextResponse.json({ error: "We could not save your response. Please try again or contact Sree." }, { status: 500 });
  }
}
