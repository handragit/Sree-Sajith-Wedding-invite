import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminPage } from "../../../../../../src/server/admin-auth";
import { getWishlistItem } from "../../../../../../src/server/wishlist";
import { deleteWishlistAction } from "../../actions";
import styles from "../../../../admin.module.css";

type DeleteWishlistItemPageProps = { params: Promise<{ id: string }> };

export default async function DeleteWishlistItemPage({ params }: DeleteWishlistItemPageProps) {
  await requireAdminPage();
  const { id } = await params;
  const item = await getWishlistItem(id);
  if (!item) notFound();

  return <main className={styles.dashboardShell}>
    <header className={styles.adminHeader}><div><Link href="/admin">Wedding Admin</Link><span aria-hidden="true">/</span><Link href="/admin/wishlist">Wishlist Manager</Link></div></header>
    <div className={`${styles.dashboardContent} ${styles.confirmPage}`}>
      <p className={styles.eyebrow}>Wishlist Manager</p>
      <h1 className={styles.dashboardHeading}>Delete wishlist item?</h1>
      <div className={styles.confirmPanel}>
        <p>This permanently deletes <strong>{item.title}</strong>. This action cannot be undone.</p>
        <div className={styles.formActions}>
          <form action={deleteWishlistAction}><input name="id" type="hidden" value={item.id} /><button className={styles.dangerButton} type="submit">Permanently delete</button></form>
          <Link className={styles.secondaryAction} href="/admin/wishlist">Cancel</Link>
        </div>
      </div>
    </div>
  </main>;
}
