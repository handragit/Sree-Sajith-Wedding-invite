"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { WishlistItem } from "../../../src/server/wishlist";
import type { WishlistFormState } from "../(protected)/wishlist/actions";
import styles from "../admin.module.css";

type WishlistItemFormProps = {
  action: (state: WishlistFormState, formData: FormData) => Promise<WishlistFormState>;
  item?: WishlistItem;
  submitLabel: string;
};

const initialState: WishlistFormState = {};

export default function WishlistItemForm({ action, item, submitLabel }: WishlistItemFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const errorId = (field: string) => state.fieldErrors?.[field as keyof typeof state.fieldErrors] ? `${field}-error` : undefined;

  return <form className={styles.wishlistForm} action={formAction} noValidate>
    <div className={styles.adminField}>
      <label htmlFor="title">Title</label>
      <input id="title" name="title" required maxLength={160} defaultValue={item?.title ?? ""} aria-invalid={Boolean(state.fieldErrors?.title)} aria-describedby={errorId("title")} />
      {state.fieldErrors?.title && <p className={styles.fieldMessage} id="title-error">{state.fieldErrors.title}</p>}
    </div>
    <div className={styles.adminField}>
      <label htmlFor="description">Description <span>optional</span></label>
      <textarea id="description" name="description" rows={5} maxLength={1000} defaultValue={item?.description ?? ""} aria-invalid={Boolean(state.fieldErrors?.description)} aria-describedby={errorId("description")} />
      {state.fieldErrors?.description && <p className={styles.fieldMessage} id="description-error">{state.fieldErrors.description}</p>}
    </div>
    <div className={styles.adminField}>
      <label htmlFor="url">Link <span>optional</span></label>
      <input id="url" name="url" type="url" maxLength={2000} placeholder="https://" defaultValue={item?.url ?? ""} aria-invalid={Boolean(state.fieldErrors?.url)} aria-describedby={errorId("url")} />
      {state.fieldErrors?.url && <p className={styles.fieldMessage} id="url-error">{state.fieldErrors.url}</p>}
    </div>
    <div className={styles.adminField}>
      <label htmlFor="imageUrl">Image URL <span>optional</span></label>
      <input id="imageUrl" name="imageUrl" type="url" maxLength={2000} placeholder="https://" defaultValue={item?.imageUrl ?? ""} aria-invalid={Boolean(state.fieldErrors?.imageUrl)} aria-describedby={errorId("imageUrl")} />
      {state.fieldErrors?.imageUrl && <p className={styles.fieldMessage} id="imageUrl-error">{state.fieldErrors.imageUrl}</p>}
    </div>
    <div className={styles.formColumns}>
      <div className={styles.adminField}>
        <label htmlFor="category">Category <span>optional</span></label>
        <input id="category" name="category" maxLength={80} defaultValue={item?.category ?? ""} aria-invalid={Boolean(state.fieldErrors?.category)} aria-describedby={errorId("category")} />
        {state.fieldErrors?.category && <p className={styles.fieldMessage} id="category-error">{state.fieldErrors.category}</p>}
      </div>
      <div className={styles.adminField}>
        <label htmlFor="sortOrder">Sort order</label>
        <input id="sortOrder" name="sortOrder" type="number" min={-100000} max={100000} step={1} required defaultValue={item?.sortOrder ?? 0} aria-invalid={Boolean(state.fieldErrors?.sortOrder)} aria-describedby={errorId("sortOrder")} />
        {state.fieldErrors?.sortOrder && <p className={styles.fieldMessage} id="sortOrder-error">{state.fieldErrors.sortOrder}</p>}
      </div>
    </div>
    <label className={styles.checkboxField}><input name="isVisible" type="checkbox" defaultChecked={item?.isVisible ?? false} /><span>Visible on the public registry when it is connected</span></label>
    {state.error && <p className={styles.formError} role="alert">{state.error}</p>}
    <div className={styles.formActions}>
      <button className={styles.button} type="submit" disabled={pending}>{pending ? "Saving…" : submitLabel}</button>
      <Link className={styles.secondaryAction} href="/admin/wishlist">Cancel</Link>
    </div>
  </form>;
}
