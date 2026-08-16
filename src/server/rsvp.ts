import "server-only";

import { getDatabase } from "./db";

export type AttendanceStatus = "attending" | "not_sure" | "unable_to_attend";
export type RsvpEvent = "evening_reception" | "main_reception";

export type RsvpSummary = {
  totalSubmissions: number;
  confirmedGuests: number;
  attendingResponses: number;
  notSureResponses: number;
  unableToAttendResponses: number;
};

export type RsvpSubmission = {
  id: string;
  guestName: string;
  attendanceStatus: AttendanceStatus;
  events: RsvpEvent[];
  guestCount: number;
  email: string | null;
  phone: string | null;
  dietaryRequirements: string | null;
  message: string | null;
  createdAt: string;
};

export type CurrentRsvp = RsvpSubmission & {
  previousResponses: RsvpSubmission[];
  responseCount: number;
  matchedByNameOnly: boolean;
};

type SubmissionRow = {
  id: string;
  guest_name: string;
  attendance_status: AttendanceStatus;
  events: RsvpEvent[];
  guest_count: number;
  email: string | null;
  phone: string | null;
  dietary_requirements: string | null;
  message: string | null;
  created_at: string;
};

export async function getRsvpDashboardData() {
  const sql = getDatabase();
  const submissionRows = await sql`
    SELECT
      id,
      guest_name,
      attendance_status,
      events,
      guest_count,
      email,
      phone,
      dietary_requirements,
      message,
      created_at
    FROM rsvps
    ORDER BY created_at DESC, id DESC
  `;

  const submissions = (submissionRows as SubmissionRow[]).map((submission): RsvpSubmission => ({
    id: submission.id,
    guestName: submission.guest_name,
    attendanceStatus: submission.attendance_status,
    events: submission.events,
    guestCount: submission.guest_count,
    email: submission.email,
    phone: submission.phone,
    dietaryRequirements: submission.dietary_requirements,
    message: submission.message,
    createdAt: submission.created_at,
  }));

  return buildCurrentRsvpDashboardData(submissions);
}

function normalizedIdentity(submission: RsvpSubmission) {
  const email = submission.email?.trim().toLowerCase();
  if (email) return { key: `email:${email}`, usesNameOnly: false };

  const name = submission.guestName.trim().toLowerCase().replace(/\s+/g, " ");
  return { key: `name:${name}`, usesNameOnly: true };
}

export function buildCurrentRsvpDashboardData(submissions: RsvpSubmission[]) {
  const grouped = new Map<string, { usesNameOnly: boolean; responses: RsvpSubmission[] }>();
  const newestFirst = [...submissions].sort((left, right) => {
    const timeDifference = new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    return timeDifference || right.id.localeCompare(left.id);
  });

  for (const submission of newestFirst) {
    const identity = normalizedIdentity(submission);
    const existing = grouped.get(identity.key);
    if (existing) existing.responses.push(submission);
    else grouped.set(identity.key, { usesNameOnly: identity.usesNameOnly, responses: [submission] });
  }

  const currentResponses: CurrentRsvp[] = Array.from(grouped.values()).map(({ usesNameOnly, responses }) => ({
    ...responses[0],
    previousResponses: responses.slice(1),
    responseCount: responses.length,
    matchedByNameOnly: usesNameOnly && responses.length > 1,
  }));

  const summary = currentResponses.reduce<RsvpSummary>((totals, response) => {
    totals.totalSubmissions += 1;
    if (response.attendanceStatus === "attending") {
      totals.confirmedGuests += response.guestCount;
      totals.attendingResponses += 1;
    } else if (response.attendanceStatus === "not_sure") {
      totals.notSureResponses += 1;
    } else {
      totals.unableToAttendResponses += 1;
    }
    return totals;
  }, {
    totalSubmissions: 0,
    confirmedGuests: 0,
    attendingResponses: 0,
    notSureResponses: 0,
    unableToAttendResponses: 0,
  });

  return { summary, currentResponses };
}
