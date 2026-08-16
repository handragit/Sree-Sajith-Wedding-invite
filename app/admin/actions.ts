"use server";

import { redirect } from "next/navigation";
import {
  AdminAuthConfigurationError,
  createAdminSession,
  deleteAdminSession,
  verifyAdminPassword,
} from "../../src/server/admin-auth";

export async function signIn(formData: FormData) {
  const value = formData.get("password");
  const password = typeof value === "string" ? value : "";

  try {
    if (!verifyAdminPassword(password)) {
      redirect("/admin/login?error=incorrect");
    }
    await createAdminSession();
  } catch (error) {
    if (error instanceof AdminAuthConfigurationError) {
      redirect("/admin/login?error=configuration");
    }
    throw error;
  }

  redirect("/admin");
}
export async function signOut() {
  await deleteAdminSession();
  redirect("/admin/login");
}
