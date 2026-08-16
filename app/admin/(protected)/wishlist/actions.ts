"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminPage } from "../../../../src/server/admin-auth";
import {
  createWishlistItem,
  deleteWishlistItem,
  parseWishlistInput,
  releaseWishlistReservation,
  toggleWishlistItemVisibility,
  updateWishlistItem,
  type WishlistFieldErrors,
} from "../../../../src/server/wishlist";

export type WishlistFormState = {
  error?: string;
  fieldErrors?: WishlistFieldErrors;
};

export async function createWishlistAction(_state: WishlistFormState, formData: FormData): Promise<WishlistFormState> {
  await requireAdminPage();
  const parsed = parseWishlistInput(formData);
  if (!parsed.data) return { error: "Please correct the highlighted fields.", fieldErrors: parsed.errors };

  try {
    await createWishlistItem(parsed.data);
  } catch {
    return { error: "We couldn’t add this item right now." };
  }

  revalidatePath("/admin/wishlist");
  revalidatePath("/");
  redirect("/admin/wishlist");
}

export async function updateWishlistAction(id: string, _state: WishlistFormState, formData: FormData): Promise<WishlistFormState> {
  await requireAdminPage();
  const parsed = parseWishlistInput(formData);
  if (!parsed.data) return { error: "Please correct the highlighted fields.", fieldErrors: parsed.errors };

  try {
    if (!(await updateWishlistItem(id, parsed.data))) return { error: "This wishlist item could not be found." };
  } catch {
    return { error: "We couldn’t save this item right now." };
  }

  revalidatePath("/admin/wishlist");
  revalidatePath("/");
  redirect("/admin/wishlist");
}

export async function toggleWishlistAction(formData: FormData) {
  await requireAdminPage();
  const id = formData.get("id");
  if (typeof id !== "string") redirect("/admin/wishlist?error=invalid-item");

  let updated;
  try {
    updated = await toggleWishlistItemVisibility(id);
  } catch {
    redirect("/admin/wishlist?error=save-failed");
  }
  if (!updated) redirect("/admin/wishlist?error=invalid-item");

  revalidatePath("/admin/wishlist");
  revalidatePath("/");
  redirect("/admin/wishlist");
}

export async function deleteWishlistAction(formData: FormData) {
  await requireAdminPage();
  const id = formData.get("id");
  if (typeof id !== "string") redirect("/admin/wishlist?error=invalid-item");

  let deleted;
  try {
    deleted = await deleteWishlistItem(id);
  } catch {
    redirect("/admin/wishlist?error=delete-failed");
  }
  if (!deleted) redirect("/admin/wishlist?error=invalid-item");

  revalidatePath("/admin/wishlist");
  revalidatePath("/");
  redirect("/admin/wishlist");
}

export async function releaseWishlistReservationAction(formData: FormData) {
  await requireAdminPage();
  const id = formData.get("id");
  if (typeof id !== "string") redirect("/admin/wishlist?error=invalid-item");

  let released;
  try {
    released = await releaseWishlistReservation(id);
  } catch {
    redirect("/admin/wishlist?error=release-failed");
  }
  if (!released) redirect("/admin/wishlist?error=invalid-item");

  revalidatePath("/admin/wishlist");
  revalidatePath("/");
  redirect("/admin/wishlist");
}
