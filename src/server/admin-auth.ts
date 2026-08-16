import "server-only";

import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_COOKIE_NAME = "wedding_admin_session";
const SESSION_LIFETIME_SECONDS = 60 * 60 * 24 * 7;

type AdminSessionPayload = {
  version: 1;
  issuedAt: number;
  expiresAt: number;
  nonce: string;
};

export class AdminAuthConfigurationError extends Error {
  constructor() {
    super("Admin authentication is not configured on the server.");
    this.name = "AdminAuthConfigurationError";
  }
}
function getAdminConfiguration() {
  const password = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!password || !sessionSecret) {
    throw new AdminAuthConfigurationError();
  }

  return { password, sessionSecret };
}

function safeEqual(left: string, right: string) {
  const leftDigest = createHash("sha256").update(left).digest();
  const rightDigest = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftDigest, rightDigest);
}

function sign(encodedPayload: string, secret: string) {
  return createHmac("sha256", secret).update(encodedPayload).digest("base64url");
}

function createSessionToken(secret: string) {
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminSessionPayload = {
    version: 1,
    issuedAt: now,
    expiresAt: now + SESSION_LIFETIME_SECONDS,
    nonce: randomBytes(24).toString("base64url"),
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encodedPayload}.${sign(encodedPayload, secret)}`;
}

function verifySessionToken(token: string, secret: string) {
  const [encodedPayload, providedSignature, extra] = token.split(".");
  if (!encodedPayload || !providedSignature || extra) return false;

  const expectedSignature = sign(encodedPayload, secret);
  if (!safeEqual(providedSignature, expectedSignature)) return false;

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as Partial<AdminSessionPayload>;
    const now = Math.floor(Date.now() / 1000);

    return payload.version === 1 &&
      typeof payload.issuedAt === "number" &&
      typeof payload.expiresAt === "number" &&
      typeof payload.nonce === "string" &&
      payload.nonce.length > 0 &&
      payload.issuedAt <= now + 60 &&
      payload.expiresAt > now &&
      payload.expiresAt - payload.issuedAt === SESSION_LIFETIME_SECONDS;
  } catch {
    return false;
  }
}

export function isAdminAuthConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

export function verifyAdminPassword(candidate: string) {
  const { password } = getAdminConfiguration();
  return safeEqual(candidate, password);
}

export async function createAdminSession() {
  const { sessionSecret } = getAdminConfiguration();
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_COOKIE_NAME, createSessionToken(sessionSecret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: SESSION_LIFETIME_SECONDS,
  });
}

export async function deleteAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: 0,
  });
}

export async function isAdminAuthenticated() {
  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;

  try {
    const { sessionSecret } = getAdminConfiguration();
    return verifySessionToken(token, sessionSecret);
  } catch (error) {
    if (error instanceof AdminAuthConfigurationError) return false;
    throw error;
  }
}

export async function requireAdminPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
}
