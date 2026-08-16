"use client";

import { FormEvent, useRef, useState } from "react";
import { Check } from "lucide-react";

type FieldName = "name" | "email" | "attendance" | "attendees" | "celebration";
type FieldErrors = Partial<Record<FieldName, string>>;

const errorIds: Record<FieldName, string> = {
  name: "name-error", email: "email-error", attendance: "attendance-error", attendees: "attendees-error", celebration: "celebration-error",
};

function FieldError({ field, errors }: { field: FieldName; errors: FieldErrors }) {
  return errors[field] ? <p className="field-error" id={errorIds[field]}>{errors[field]}</p> : null;
}

export default function RSVPForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "fallback" | "error">("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const lastSubmission = useRef(0);

  function validate(data: Record<string, FormDataEntryValue>) {
    const nextErrors: FieldErrors = {};
    const name = String(data.name ?? "").trim();
    const email = String(data.email ?? "").trim();
    const attendees = Number(data.attendees);
    if (!name) nextErrors.name = "Enter the guest name.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Enter a valid email address, such as name@example.com.";
    if (!data.attendance) nextErrors.attendance = "Select whether you will attend.";
    if (!Number.isInteger(attendees) || attendees < 1 || attendees > 12) nextErrors.attendees = "Enter a whole number from 1 to 12.";
    if (!data.celebration) nextErrors.celebration = "Select the celebration you are responding to.";
    return nextErrors;
  }

  function clearFieldError(event: FormEvent<HTMLFormElement>) {
    const field = (event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).name as FieldName;
    if (field in errorIds && errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    if (data.website) return;
    const nextErrors = validate(data);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors); setStatus("error"); setMessage("Please correct the highlighted fields and submit again.");
      (form.elements.namedItem(Object.keys(nextErrors)[0]) as HTMLElement | null)?.focus();
      return;
    }
    if (Date.now() - lastSubmission.current < 8000) { setStatus("error"); setMessage("Please wait a moment before trying again."); return; }
    setErrors({}); lastSubmission.current = Date.now(); setStatus("sending"); setMessage("");
    try {
      const response = await fetch("/api/rsvp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await response.json();
      if (response.ok && result.persisted) { setStatus("success"); setMessage("Thank you — your response has been securely received."); form.reset(); }
      else if (response.status === 503) { setStatus("fallback"); setMessage("Online saving is temporarily unavailable. Please respond by WhatsApp or email below."); }
      else throw new Error(result.error || "Unable to save RSVP");
    } catch { setStatus("fallback"); setMessage("We couldn’t save your response just now. Please use WhatsApp or email below."); }
  }

  return <form className="rsvp-form" onSubmit={submit} onInput={clearFieldError} noValidate>
    <div className="field field--full"><label htmlFor="name">Guest name</label><input id="name" name="name" required maxLength={120} autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? errorIds.name : undefined} /><FieldError field="name" errors={errors} /></div>
    <div className="field field--full"><label htmlFor="email">Email address <span>optional</span></label><input id="email" name="email" type="email" maxLength={254} autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? errorIds.email : undefined} /><FieldError field="email" errors={errors} /></div>
    <div className="field"><label htmlFor="attendance">Attendance status</label><select id="attendance" name="attendance" required defaultValue="" aria-invalid={Boolean(errors.attendance)} aria-describedby={errors.attendance ? errorIds.attendance : undefined}><option value="" disabled>Select one</option><option>Attending</option><option>Unable to attend</option><option>Not sure</option></select><FieldError field="attendance" errors={errors} /></div>
    <div className="field"><label htmlFor="attendees">Number attending</label><input id="attendees" name="attendees" type="number" min="1" max="12" defaultValue="1" required aria-invalid={Boolean(errors.attendees)} aria-describedby={errors.attendees ? errorIds.attendees : undefined} /><FieldError field="attendees" errors={errors} /></div>
    <div className="field field--full"><label htmlFor="celebration">Which celebration?</label><select id="celebration" name="celebration" required defaultValue="" aria-invalid={Boolean(errors.celebration)} aria-describedby={errors.celebration ? errorIds.celebration : undefined}><option value="" disabled>Select one</option><option value="Evening reception — 13 December">Evening reception — 13 December</option><option value="Main reception — 14 December">Wedding celebration — 14 December</option><option>Both receptions</option><option>Unable to attend</option></select><FieldError field="celebration" errors={errors} /></div>
    <div className="field field--full"><label htmlFor="dietary">Dietary requirements <span>optional</span></label><input id="dietary" name="dietary" maxLength={300} /></div>
    <div className="field field--full"><label htmlFor="message">A message for the couple <span>optional</span></label><textarea id="message" name="message" rows={4} maxLength={600} /></div>
    <div className="honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
    <button className="button button--solid" disabled={status === "sending"} type="submit">{status === "sending" ? "Sending…" : "Send RSVP"}</button>
    {message && <p className={`form-status form-status--${status}`} role={status === "error" || status === "fallback" ? "alert" : "status"} aria-live="polite">{status === "success" && <Check size={17} />} {message}</p>}
  </form>;
}
