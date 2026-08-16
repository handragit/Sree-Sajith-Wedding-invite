"use server";

import { revalidatePath } from "next/cache";
import { isWishlistId, reservePublicWishlistItem } from "../../src/server/wishlist";

export type GiftReservationState = {
  status: "idle" | "success" | "validation" | "conflict" | "error";
  message?: string;
  nameError?: string;
};

export async function reserveGiftAction(
  _state: GiftReservationState,
  formData: FormData,
): Promise<GiftReservationState> {
  const idValue = formData.get("wishlistId");
  const nameValue = formData.get("guestName");
  const id = typeof idValue === "string" ? idValue : "";
  const guestName = typeof nameValue === "string" ? nameValue.trim() : "";

  if (!isWishlistId(id)) {
    return { status: "error", message: "This gift could not be found. Please choose another item." };
  }
  if (!guestName) {
    return { status: "validation", nameError: "Please enter your name." };
  }
  if (guestName.length > 160) {
    return { status: "validation", nameError: "Please use 160 characters or fewer." };
  }

  try {
    const reserved = await reservePublicWishlistItem(id, guestName);
    if (!reserved) {
      return {
        status: "conflict",
        message: "This gift has just been reserved by someone else. Please choose another item.",
      };
    }
  } catch {
    return { status: "error", message: "We couldn't reserve this gift right now. Please try again." };
  }

  revalidatePath("/");
  return { status: "success", message: "Thank you — we've marked this gift as reserved." };
}
