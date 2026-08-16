import Link from "next/link";
import { requireAdminPage } from "../../../../../src/server/admin-auth";
import WishlistItemForm from "../../../components/WishlistItemForm";
import { createWishlistAction } from "../actions";
import styles from "../../../admin.module.css";

export default async function NewWishlistItemPage() {
  await requireAdminPage();

  return <main className={styles.dashboardShell}>
    <header className={styles.adminHeader}><div><Link href="/admin">Wedding Admin</Link><span aria-hidden="true">/</span><Link href="/admin/wishlist">Wishlist Manager</Link></div></header>
    <div className={`${styles.dashboardContent} ${styles.formPage}`}>
      <p className={styles.eyebrow}>Wishlist Manager</p>
      <h1 className={styles.dashboardHeading}>Add wishlist item</h1>
      <p className={styles.formIntro}>New items remain hidden unless you explicitly mark them visible.</p>
      <WishlistItemForm action={createWishlistAction} submitLabel="Add item" />
    </div>
  </main>;
}
