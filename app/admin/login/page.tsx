import { redirect } from "next/navigation";
import { isAdminAuthenticated, isAdminAuthConfigured } from "../../../src/server/admin-auth";
import { signIn } from "../actions";
import styles from "../admin.module.css";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  if (await isAdminAuthenticated()) redirect("/admin");

  const { error } = await searchParams;
  const configurationMissing = !isAdminAuthConfigured() || error === "configuration";
  const errorMessage = configurationMissing
    ? "Admin authentication is not configured on the server."
    : error === "incorrect" ? "Incorrect password" : null;

  return <main className={styles.shell}>
    <section className={styles.panel} aria-labelledby="admin-login-heading">
      <p className={styles.eyebrow}>Admin</p>
      <h1 className={styles.heading} id="admin-login-heading">Private wedding dashboard</h1>
      <p className={styles.intro}>Sign in to manage the private wedding tools.</p>
      <form className={styles.form} action={signIn}>
        <div className={styles.field}>
          <label htmlFor="admin-password">Password</label>
          <input id="admin-password" name="password" type="password" required autoComplete="current-password" aria-invalid={Boolean(errorMessage)} aria-describedby={errorMessage ? "login-error" : undefined} />
        </div>
        {errorMessage && <p className={styles.error} id="login-error" role="alert">{errorMessage}</p>}
        <button className={styles.button} type="submit" disabled={configurationMissing}>Sign in</button>
      </form>
    </section>
  </main>;
}
