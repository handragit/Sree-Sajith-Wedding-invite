import Link from "next/link";
import { requireAdminPage } from "../../../../src/server/admin-auth";
import { DatabaseConfigurationError } from "../../../../src/server/db";
import { getWishlistItems } from "../../../../src/server/wishlist";
import { signOut } from "../../actions";
import styles from "../../admin.module.css";
import { releaseWishlistReservationAction, toggleWishlistAction } from "./actions";

export const dynamic = "force-dynamic";

type WishlistManagerPageProps = {
  searchParams: Promise<{ error?: string }>;
};

const errorMessages: Record<string, string> = {
  "invalid-item": "That wishlist item could not be found.",
  "save-failed": "The visibility change could not be saved.",
  "delete-failed": "The wishlist item could not be deleted.",
  "release-failed": "The reservation could not be released.",
};

const adminDateFormatter = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

export default async function WishlistManagerPage({ searchParams }: WishlistManagerPageProps) {
  await requireAdminPage();
  const { error } = await searchParams;

  let items;
  try {
    items = await getWishlistItems();
  } catch (databaseError) {
    const message = databaseError instanceof DatabaseConfigurationError
      ? "Wishlist database access is not configured on the server."
      : "We couldn’t load wishlist items right now.";
    return <WishlistShell><div className={styles.adminError} role="alert"><h2>Wishlist unavailable</h2><p>{message}</p></div></WishlistShell>;
  }

  return <WishlistShell>
    {error && errorMessages[error] && <p className={styles.managerAlert} role="alert">{errorMessages[error]}</p>}
    <div className={styles.managerToolbar}>
      <div><h2>Wishlist items</h2><p>Ordered by sort order, then creation date.</p></div>
      <Link className={styles.button} href="/admin/wishlist/new">Add item</Link>
    </div>
    {!items.length ? <div className={styles.emptyState}><h2>No wishlist items yet.</h2><p>Add your first item when you’re ready.</p></div> : <div className={styles.wishlistList}>
      {items.map((item) => <article className={styles.wishlistItem} key={item.id}>
        <div className={styles.wishlistItemMain}>
          <div><h2>{item.title}</h2><p>{item.category || "Uncategorised"}</p></div>
          <span className={`${styles.visibilityBadge} ${item.isReserved ? styles.visibilityReserved : item.isVisible ? styles.visibilityPublished : styles.visibilityHidden}`}>{item.isReserved ? "Reserved" : item.isVisible ? "Published" : "Hidden"}</span>
        </div>
        <dl className={styles.itemMeta}>
          <div><dt>Sort order</dt><dd>{item.sortOrder}</dd></div>
          {item.isReserved && <>
            <div><dt>Reserved by</dt><dd>{item.reservedBy || "—"}</dd></div>
            <div><dt>Reserved at</dt><dd>{item.reservedAt ? adminDateFormatter.format(new Date(item.reservedAt)) : "—"}</dd></div>
          </>}
        </dl>
        <div className={styles.itemActions}>
          <Link href={`/admin/wishlist/${item.id}/edit`}>Edit</Link>
          <form action={toggleWishlistAction}><input name="id" type="hidden" value={item.id} /><button type="submit">{item.isVisible ? "Hide" : "Show"}</button></form>
          {item.isReserved && <form action={releaseWishlistReservationAction}><input name="id" type="hidden" value={item.id} /><button type="submit">Make available again</button></form>}
          <Link className={styles.deleteAction} href={`/admin/wishlist/${item.id}/delete`}>Delete</Link>
        </div>
      </article>)}
    </div>}
  </WishlistShell>;
}
function WishlistShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return <main className={styles.dashboardShell}>
    <header className={styles.adminHeader}>
      <div><Link href="/admin">Wedding Admin</Link><span aria-hidden="true">/</span><strong>Wishlist Manager</strong></div>
      <form action={signOut}><button className={styles.textButton} type="submit">Sign out</button></form>
    </header>
    <div className={`${styles.dashboardContent} ${styles.managerContent}`}>
      <p className={styles.eyebrow}>Wedding Admin</p>
      <h1 className={styles.dashboardHeading}>Wishlist Manager</h1>
      {children}
    </div>
  </main>;
}
