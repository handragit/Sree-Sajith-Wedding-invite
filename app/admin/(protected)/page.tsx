import Link from "next/link";
import { signOut } from "../actions";
import styles from "../admin.module.css";

export default function AdminPage() {
  return <main className={styles.shell}>
    <section className={styles.panel} aria-labelledby="admin-heading">
      <p className={styles.eyebrow}>Private dashboard</p>
      <h1 className={styles.heading} id="admin-heading">Wedding Admin</h1>
      <div className={styles.cards}>
        <Link className={`${styles.card} ${styles.cardLink}`} href="/admin/rsvp"><h2>RSVP Dashboard</h2><p>View responses <span aria-hidden="true">→</span></p></Link>
        <Link className={`${styles.card} ${styles.cardLink}`} href="/admin/wishlist"><h2>Wishlist Manager</h2><p>Manage registry items <span aria-hidden="true">→</span></p></Link>
      </div>
      <form action={signOut}><button className={styles.button} type="submit">Sign out</button></form>
    </section>
  </main>;
}
