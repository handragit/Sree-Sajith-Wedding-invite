import { isAdminAuthenticated } from "../../../../../src/server/admin-auth";
import { DatabaseConfigurationError } from "../../../../../src/server/db";
import {
  getRsvpDashboardData,
  type AttendanceStatus,
  type RsvpEvent,
} from "../../../../../src/server/rsvp";

const attendanceLabels: Record<AttendanceStatus, string> = {
  attending: "Attending",
  not_sure: "Not sure",
  unable_to_attend: "Unable to attend",
};

const eventLabels: Record<RsvpEvent, string> = {
  evening_reception: "Evening Reception",
  main_reception: "Wedding Celebration",
};

const columns = [
  "Guest Name",
  "Attendance Status",
  "Guest Count",
  "Events",
  "Email",
  "Phone",
  "Dietary Requirements",
  "Message",
  "Submitted At",
  "Response Count",
  "Matched By Name Only",
];

function neutralizeSpreadsheetFormula(value: string) {
  return /^[=+\-@]/.test(value.trimStart()) ? `'${value}` : value;
}
function csvCell(value: string | number | boolean | null) {
  const text = value === null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function userText(value: string | null) {
  return neutralizeSpreadsheetFormula(value ?? "");
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { "Cache-Control": "private, no-store" },
    });
  }

  try {
    const { currentResponses } = await getRsvpDashboardData();
    const rows = currentResponses.map((response) => [
      userText(response.guestName),
      attendanceLabels[response.attendanceStatus],
      response.guestCount,
      response.events.map((event) => eventLabels[event]).join("; "),
      userText(response.email),
      userText(response.phone),
      userText(response.dietaryRequirements),
      userText(response.message),
      new Date(response.createdAt).toISOString(),
      response.responseCount,
      response.matchedByNameOnly ? "Yes" : "No",
    ]);
    const csv = [columns, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
    const filenameDate = new Date().toISOString().slice(0, 10);

    return new Response(`\uFEFF${csv}`, {
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Disposition": `attachment; filename="wedding-rsvps-${filenameDate}.csv"`,
        "Content-Type": "text/csv; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    const message = error instanceof DatabaseConfigurationError
      ? "RSVP database access is not configured."
      : "Unable to export RSVP data right now.";
    return new Response(message, {
      status: 503,
      headers: { "Cache-Control": "private, no-store" },
    });
  }
}
