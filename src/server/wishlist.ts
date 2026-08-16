import "server-only";

import { getDatabase } from "./db";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SORT_ORDER_MIN = -100000;
const SORT_ORDER_MAX = 100000;

export type WishlistItem = {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  imageUrl: string | null;
  category: string | null;
  isVisible: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type WishlistInput = {
  title: string;
  description: string | null;
  url: string | null;
  imageUrl: string | null;
  category: string | null;
  isVisible: boolean;
  sortOrder: number;
};

export type PublicWishlistItem = {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  imageUrl: string | null;
  category: string | null;
  sortOrder: number;
};

export type WishlistField = "title" | "description" | "url" | "imageUrl" | "category" | "sortOrder";
export type WishlistFieldErrors = Partial<Record<WishlistField, string>>;

type WishlistRow = {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  image_url: string | null;
  category: string | null;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

function mapWishlistItem(row: WishlistRow): WishlistItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    url: row.url,
    imageUrl: row.image_url,
    category: row.category,
    isVisible: row.is_visible,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function optionalText(formData: FormData, name: string) {
  const value = formData.get(name);
  if (typeof value !== "string") return null;
  return value.trim() || null;
}

function validWebUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function safePublicUrl(value: string | null) {
  return value && validWebUrl(value) ? value : null;
}

export function parseWishlistInput(formData: FormData): { data?: WishlistInput; errors?: WishlistFieldErrors } {
  const titleValue = formData.get("title");
  const title = typeof titleValue === "string" ? titleValue.trim() : "";
  const description = optionalText(formData, "description");
  const url = optionalText(formData, "url");
  const imageUrl = optionalText(formData, "imageUrl");
  const category = optionalText(formData, "category");
  const sortOrderValue = formData.get("sortOrder");
  const sortOrderText = typeof sortOrderValue === "string" ? sortOrderValue.trim() : "";
  const sortOrder = Number(sortOrderText);
  const errors: WishlistFieldErrors = {};

  if (!title) errors.title = "Enter a title.";
  else if (title.length > 160) errors.title = "Use 160 characters or fewer.";
  if (description && description.length > 1000) errors.description = "Use 1,000 characters or fewer.";
  if (url && (url.length > 2000 || !validWebUrl(url))) errors.url = "Enter a valid http:// or https:// link up to 2,000 characters.";
  if (imageUrl && (imageUrl.length > 2000 || !validWebUrl(imageUrl))) errors.imageUrl = "Enter a valid http:// or https:// image URL up to 2,000 characters.";
  if (category && category.length > 80) errors.category = "Use 80 characters or fewer.";
  if (!sortOrderText || !Number.isInteger(sortOrder) || sortOrder < SORT_ORDER_MIN || sortOrder > SORT_ORDER_MAX) {
    errors.sortOrder = `Enter a whole number from ${SORT_ORDER_MIN} to ${SORT_ORDER_MAX}.`;
  }

  if (Object.keys(errors).length) return { errors };
  return {
    data: {
      title,
      description,
      url,
      imageUrl,
      category,
      isVisible: formData.get("isVisible") === "on",
      sortOrder,
    },
  };
}

export function isWishlistId(value: string) {
  return UUID_PATTERN.test(value);
}

export async function getWishlistItems() {
  const sql = getDatabase();
  const rows = await sql`
    SELECT id, title, description, url, image_url, category, is_visible, sort_order, created_at, updated_at
    FROM wishlist_items
    ORDER BY sort_order ASC, created_at ASC, id ASC
  `;
  return (rows as WishlistRow[]).map(mapWishlistItem);
}

export async function getPublicWishlistItems(): Promise<PublicWishlistItem[]> {
  const sql = getDatabase();
  const rows = await sql`
    SELECT id, title, description, url, image_url, category, sort_order
    FROM wishlist_items
    WHERE is_visible = true
    ORDER BY sort_order ASC, created_at ASC, id ASC
  `;

  return rows.map((row) => ({
    id: String(row.id),
    title: String(row.title),
    description: typeof row.description === "string" ? row.description : null,
    url: safePublicUrl(typeof row.url === "string" ? row.url : null),
    imageUrl: safePublicUrl(typeof row.image_url === "string" ? row.image_url : null),
    category: typeof row.category === "string" ? row.category : null,
    sortOrder: Number(row.sort_order),
  }));
}

export async function getWishlistItem(id: string) {
  if (!isWishlistId(id)) return null;
  const sql = getDatabase();
  const rows = await sql`
    SELECT id, title, description, url, image_url, category, is_visible, sort_order, created_at, updated_at
    FROM wishlist_items
    WHERE id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapWishlistItem(rows[0] as WishlistRow) : null;
}

export async function createWishlistItem(input: WishlistInput) {
  const sql = getDatabase();
  await sql`
    INSERT INTO wishlist_items (title, description, url, image_url, category, is_visible, sort_order)
    VALUES (${input.title}, ${input.description}, ${input.url}, ${input.imageUrl}, ${input.category}, ${input.isVisible}, ${input.sortOrder})
  `;
}

export async function updateWishlistItem(id: string, input: WishlistInput) {
  if (!isWishlistId(id)) return false;
  const sql = getDatabase();
  const rows = await sql`
    UPDATE wishlist_items
    SET title = ${input.title}, description = ${input.description}, url = ${input.url},
      image_url = ${input.imageUrl}, category = ${input.category}, is_visible = ${input.isVisible},
      sort_order = ${input.sortOrder}, updated_at = now()
    WHERE id = ${id}
    RETURNING id
  `;
  return rows.length === 1;
}

export async function toggleWishlistItemVisibility(id: string) {
  if (!isWishlistId(id)) return false;
  const sql = getDatabase();
  const rows = await sql`
    UPDATE wishlist_items
    SET is_visible = NOT is_visible, updated_at = now()
    WHERE id = ${id}
    RETURNING id
  `;
  return rows.length === 1;
}

export async function deleteWishlistItem(id: string) {
  if (!isWishlistId(id)) return false;
  const sql = getDatabase();
  const rows = await sql`DELETE FROM wishlist_items WHERE id = ${id} RETURNING id`;
  return rows.length === 1;
}
