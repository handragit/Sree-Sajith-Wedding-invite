import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminPage } from "../../../../../../src/server/admin-auth";
import { getWishlistItem } from "../../../../../../src/server/wishlist";
import WishlistItemForm from "../../../../components/WishlistItemForm";
import { updateWishlistAction } from "../../actions";
import styles from "../../../../admin.module.css";

type EditWishlistItemPageProps = { params: Promise<{ id: string }> };

export default async function EditWishlistItemPage({ params }: EditWishlistItemPageProps) {
  await requireAdminPage();
  const { id } = await params;
  const item = await getWishlistItem(id);
  if (!item) notFound();
  const action = updateWishlistAction.bind(null, item.id);

  return <main className={styles.dashboardShell}>
    <header className={styles.adminHeader}><div><Link href="/admin">Wedding Admin</Link><span aria-hidden="true">/</span><Link href="/admin/wishlist">Wishlist Manager</Link></div></header>
    <div className={`${styles.dashboardContent} ${styles.formPage}`}>
      <p className={styles.eyebrow}>Wishlist Manager</p>
      <h1 className={styles.dashboardHeading}>Edit wishlist item</h1>
      <WishlistItemForm action={action} item={item} submitLabel="Save changes" />
    </div>
  </main>;
}
