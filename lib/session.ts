import { createHash, randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import type { Db } from "./db";
import { households, members, sessions } from "./db/schema";

export const SESSION_COOKIE = "pantry_session";
const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function startSession(db: Db, memberId: string): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  await db.insert(sessions).values({ tokenHash: hashToken(token), memberId });
  return token;
}

export function sessionCookie(token: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${TEN_YEARS}${secure}`;
}

export function tokenFromCookieHeader(header: string | null): string | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const [name, ...value] = part.trim().split("=");
    if (name === SESSION_COOKIE) return value.join("=") || null;
  }
  return null;
}

export type CurrentMember = {
  member: { id: string; displayName: string };
  household: { id: string };
};

/** The Member a session token belongs to, or null for a missing, unknown or tampered token. */
export async function memberForToken(db: Db, token: string | null): Promise<CurrentMember | null> {
  if (!token) return null;
  const [row] = await db
    .select({
      memberId: members.id,
      displayName: members.displayName,
      householdId: households.id,
    })
    .from(sessions)
    .innerJoin(members, eq(sessions.memberId, members.id))
    .innerJoin(households, eq(members.householdId, households.id))
    .where(eq(sessions.tokenHash, hashToken(token)))
    .limit(1);
  if (!row) return null;
  return {
    member: { id: row.memberId, displayName: row.displayName },
    household: { id: row.householdId },
  };
}
