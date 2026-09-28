import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "ff_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload {
  userId: string;
  email: string;
}

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === "change-me-in-production") {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET must be set to a strong random value in production.");
    }
    if (!globalThis.__FF_DEV_JWT__) {
      globalThis.__FF_DEV_JWT__ = "dev-only-" + Math.random().toString(36).slice(2);
      console.warn("[session] Using ephemeral dev JWT secret. Set JWT_SECRET for stable sessions.");
    }
    return new TextEncoder().encode((globalThis.__FF_DEV_JWT__ as string) + "-ff-session");
  }
  return new TextEncoder().encode(secret);
}

declare global {
  var __FF_DEV_JWT__: string | undefined;
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), { algorithms: ["HS256"] });
    if (typeof payload.userId !== "string" || typeof payload.email !== "string") return null;
    return { userId: payload.userId, email: payload.email };
  } catch {
    return null;
  }
}

export async function getPasswordSession(): Promise<SessionPayload | null> {
  try {
    const store = await cookies();
    const token = store.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

export function sessionCookieHeader(token: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE}${secure}`;
}

export function clearSessionCookieHeader(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export { SESSION_MAX_AGE };
