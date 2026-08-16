"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";

function excludePrivateAdminTraffic(event: BeforeSendEvent) {
  try {
    const pathname = new URL(event.url, window.location.origin).pathname;
    if (pathname === "/admin" || pathname.startsWith("/admin/") || pathname === "/api/admin" || pathname.startsWith("/api/admin/")) {
      return null;
    }
  } catch {
    // Preserve the package's default behavior for an unexpected URL shape.
  }

  return event;
}
export default function PublicAnalytics() {
  return <Analytics beforeSend={excludePrivateAdminTraffic} />;
}
