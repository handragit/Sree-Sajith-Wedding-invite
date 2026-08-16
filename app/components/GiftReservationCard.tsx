"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import {
  reserveGiftAction,
  type GiftReservationState,
} from "../actions/wishlist-reservation";
import type { PublicWishlistItem } from "../../src/server/wishlist";

function ReserveButton() {
  const { pending } = useFormStatus();
  return <button className="registry-reserve-confirm" disabled={pending} type="submit">
    {pending ? "Reserving…" : "Yes, reserve this gift"}
  </button>;
}

export default function GiftReservationCard({ item }: { item: PublicWishlistItem }) {
  const [confirming, setConfirming] = useState(false);
  const initialState: GiftReservationState = { status: "idle" };
  const [state, formAction] = useActionState(reserveGiftAction, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.status !== "success") return;
    const refreshTimer = window.setTimeout(() => router.refresh(), 1600);
    return () => window.clearTimeout(refreshTimer);
  }, [router, state.status]);

  if (state.status === "success") {
    return <article className="registry-wishlist-card registry-reservation-success" role="status">
      <p>{state.message}</p>
    </article>;
  }

  return <article className={`registry-wishlist-card${item.imageUrl ? "" : " registry-wishlist-card--text-only"}`}>
    {item.imageUrl && <div className="registry-image-wrap">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.imageUrl} alt={item.title} loading="lazy" decoding="async" referrerPolicy="no-referrer" />
    </div>}
    <div className="registry-card-content">
      {item.category && <p className="registry-category">{item.category}</p>}
      <h3>{item.title}</h3>
      {item.description && <p>{item.description}</p>}
      <div className="registry-card-actions">
        {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer">View item <span aria-hidden="true">↗</span></a>}
        {!confirming && <button className="registry-reserve-start" type="button" onClick={() => setConfirming(true)}>Choose this gift</button>}
      </div>
      {confirming && <form action={formAction} className="registry-reservation-form">
        <input name="wishlistId" type="hidden" value={item.id} />
        <fieldset>
          <legend>Are you planning to gift this item?</legend>
          <p>Once confirmed, we’ll remove it from the public wishlist so another guest doesn’t choose the same gift.</p>
          <label htmlFor={`guest-name-${item.id}`}>Your name</label>
          <input
            id={`guest-name-${item.id}`}
            aria-describedby={state.nameError ? `guest-name-error-${item.id}` : undefined}
            aria-invalid={Boolean(state.nameError)}
            autoComplete="name"
            maxLength={160}
            name="guestName"
            required
            type="text"
          />
          {state.nameError && <p className="registry-reservation-error" id={`guest-name-error-${item.id}`}>{state.nameError}</p>}
          {state.message && <p className="registry-reservation-error" role="alert">{state.message}</p>}
          <div className="registry-confirm-actions">
            <ReserveButton />
            <button type="button" onClick={() => setConfirming(false)}>No, go back</button>
          </div>
        </fieldset>
      </form>}
    </div>
  </article>;
}
