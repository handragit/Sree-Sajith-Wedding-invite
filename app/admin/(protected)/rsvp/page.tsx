import { Fragment } from "react";
import Link from "next/link";
import { requireAdminPage } from "../../../../src/server/admin-auth";
import { DatabaseConfigurationError } from "../../../../src/server/db";
import {
  getRsvpDashboardData,
  type AttendanceStatus,
  type RsvpEvent,
  type CurrentRsvp,
  type RsvpSubmission,
  type RsvpSummary,
} from "../../../../src/server/rsvp";
import { signOut } from "../../actions";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";

type RsvpDashboardPageProps = {
  searchParams: Promise<{ q?: string | string[]; status?: string | string[]; event?: string | string[] }>;
};

const attendanceLabels: Record<AttendanceStatus, string> = {
  attending: "Attending",
  not_sure: "Not sure",
  unable_to_attend: "Unable to attend",
};

const eventLabels: Record<RsvpEvent, string> = {
  evening_reception: "Evening Reception",
  main_reception: "Wedding Celebration",
};

const attendanceOptions: { value: AttendanceStatus | ""; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "attending", label: "Attending" },
  { value: "not_sure", label: "Not sure" },
  { value: "unable_to_attend", label: "Unable to attend" },
];

const eventOptions: { value: RsvpEvent | ""; label: string }[] = [
  { value: "", label: "All events" },
  { value: "evening_reception", label: "Evening Reception" },
  { value: "main_reception", label: "Wedding Celebration" },
];

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

function displayValue(value: string | null) {
  return value?.trim() || "—";
}

function displayEvents(events: RsvpEvent[]) {
  return events.length ? events.map((event) => eventLabels[event]).join(", ") : "—";
}

function displayDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : `${dateFormatter.format(date)} IST`;
}

function firstQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function selectedAttendance(value: string): AttendanceStatus | "" {
  return attendanceOptions.some((option) => option.value === value) ? value as AttendanceStatus | "" : "";
}

function selectedEvent(value: string): RsvpEvent | "" {
  return eventOptions.some((option) => option.value === value) ? value as RsvpEvent | "" : "";
}

function FilterControls({ query, status, event, resultCount }: { query: string; status: AttendanceStatus | ""; event: RsvpEvent | ""; resultCount: number }) {
  const filtersActive = Boolean(query || status || event);

  return <div className={styles.filtersBlock}>
    <form className={styles.filters} method="get" action="/admin/rsvp">
      <div className={`${styles.filterField} ${styles.searchField}`}>
        <label htmlFor="rsvp-search">Search guest name</label>
        <input id="rsvp-search" name="q" type="search" placeholder="Search guest name" defaultValue={query} />
      </div>
      <div className={styles.filterField}>
        <label htmlFor="status-filter">Attendance</label>
        <select id="status-filter" name="status" defaultValue={status}>{attendanceOptions.map((option) => <option value={option.value} key={option.label}>{option.label}</option>)}</select>
      </div>
      <div className={styles.filterField}>
        <label htmlFor="event-filter">Event</label>
        <select id="event-filter" name="event" defaultValue={event}>{eventOptions.map((option) => <option value={option.value} key={option.label}>{option.label}</option>)}</select>
      </div>
      <button className={styles.filterButton} type="submit">Apply filters</button>
      {filtersActive && <Link className={styles.clearFilters} href="/admin/rsvp">Clear filters</Link>}
    </form>
    <p className={styles.resultCount} aria-live="polite">Showing {resultCount} {resultCount === 1 ? "response" : "responses"}</p>
  </div>;
}

function SummaryCards({ summary }: { summary: RsvpSummary }) {
  const metrics = [
    ["Total responses", summary.totalSubmissions],
    ["Confirmed guests", summary.confirmedGuests],
    ["Attending", summary.attendingResponses],
    ["Not sure", summary.notSureResponses],
    ["Unable to attend", summary.unableToAttendResponses],
  ] as const;

  return <div className={styles.summaryGrid} aria-label="RSVP summary">
    {metrics.map(([label, value]) => <article className={styles.metric} key={label}>
      <p>{label}</p><strong>{value}</strong>
    </article>)}
  </div>;
}

function ResponseHistory({ responses }: { responses: RsvpSubmission[] }) {
  return <details className={styles.historyDisclosure}>
    <summary>View previous responses ({responses.length})</summary>
    <div className={styles.historyList}>
      {responses.map((response) => <article className={styles.historyItem} key={response.id}>
        <p><span>Attendance</span><strong>{attendanceLabels[response.attendanceStatus]}</strong></p>
        <p><span>Guests</span><strong>{response.guestCount}</strong></p>
        <p><span>Events</span><strong>{displayEvents(response.events)}</strong></p>
        <p><span>Submitted</span><strong>{displayDate(response.createdAt)}</strong></p>
      </article>)}
    </div>
  </details>;
}

function RsvpTable({ submissions }: { submissions: CurrentRsvp[] }) {
  if (!submissions.length) {
    return <div className={styles.emptyState}><h2>No responses yet</h2><p>New RSVP submissions will appear here.</p></div>;
  }

  return <div className={styles.tableFrame}>
    <table className={styles.rsvpTable}>
      <thead><tr><th>Guest name</th><th>Status</th><th>Guests</th><th>Events</th><th>Email</th><th>Dietary</th><th>Message</th><th>Submitted</th></tr></thead>
      <tbody>{submissions.map((submission) => <Fragment key={submission.id}><tr>
        <td data-label="Guest name"><strong>{submission.guestName}</strong>{submission.responseCount > 1 && <span className={styles.updateBadge}>{submission.responseCount} responses</span>}{submission.matchedByNameOnly && <span className={styles.nameMatchWarning}>Matched by name only</span>}</td>
        <td data-label="Status"><span className={`${styles.status} ${styles[`status_${submission.attendanceStatus}`]}`}>{attendanceLabels[submission.attendanceStatus]}</span></td>
        <td data-label="Guests">{submission.guestCount}</td>
        <td data-label="Events">{displayEvents(submission.events)}</td>
        <td data-label="Email">{submission.email ? <a href={`mailto:${submission.email}`}>{submission.email}</a> : "—"}</td>
        <td data-label="Dietary">{displayValue(submission.dietaryRequirements)}</td>
        <td data-label="Message">{displayValue(submission.message)}</td>
        <td data-label="Submitted"><time dateTime={submission.createdAt}>{displayDate(submission.createdAt)}</time></td>
      </tr>{submission.previousResponses.length > 0 && <tr className={styles.historyRow}><td className={styles.historyCell} colSpan={8}><ResponseHistory responses={submission.previousResponses} /></td></tr>}</Fragment>)}</tbody>
    </table>
  </div>;
}

export default async function RsvpDashboardPage({ searchParams }: RsvpDashboardPageProps) {
  await requireAdminPage();

  let dashboardData;
  try {
    dashboardData = await getRsvpDashboardData();
  } catch (error) {
    const message = error instanceof DatabaseConfigurationError
      ? "RSVP database access is not configured on the server."
      : "We couldn’t load RSVP data right now. Please try again later.";

    return <AdminDashboardShell><div className={styles.adminError} role="alert"><h2>RSVP data unavailable</h2><p>{message}</p></div></AdminDashboardShell>;
  }

  const parameters = await searchParams;
  const query = firstQueryValue(parameters.q).trim().toLowerCase().replace(/\s+/g, " ");
  const status = selectedAttendance(firstQueryValue(parameters.status));
  const event = selectedEvent(firstQueryValue(parameters.event));
  const filteredResponses = dashboardData.currentResponses.filter((response) => {
    const matchesName = !query || response.guestName.trim().toLowerCase().replace(/\s+/g, " ").includes(query);
    const matchesStatus = !status || response.attendanceStatus === status;
    const matchesEvent = !event || response.events.includes(event);
    return matchesName && matchesStatus && matchesEvent;
  });

  return <AdminDashboardShell>
    <SummaryCards summary={dashboardData.summary} />
    <section className={styles.responsesSection} aria-labelledby="recent-rsvps">
      <div className={styles.sectionHeading}><h2 id="recent-rsvps">Recent RSVPs</h2><div className={styles.sectionActions}><p>Newest submissions first</p><a className={styles.exportLink} href="/api/admin/rsvp/export" download>Export CSV</a></div></div>
      <FilterControls query={query} status={status} event={event} resultCount={filteredResponses.length} />
      <RsvpTable submissions={filteredResponses} />
    </section>
  </AdminDashboardShell>;
}

function AdminDashboardShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return <main className={styles.dashboardShell}>
    <header className={styles.adminHeader}>
      <div><Link href="/admin">Wedding Admin</Link><span aria-hidden="true">/</span><strong>RSVP Dashboard</strong></div>
      <form action={signOut}><button className={styles.textButton} type="submit">Sign out</button></form>
    </header>
    <div className={styles.dashboardContent}>
      <p className={styles.eyebrow}>Wedding Admin</p>
      <h1 className={styles.dashboardHeading}>RSVP Dashboard</h1>
      {children}
    </div>
  </main>;
}
