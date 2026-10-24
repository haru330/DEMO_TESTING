import { z } from "zod";
import type { Db } from "./db";
import { households, members } from "./db/schema";
import { startSession, type CurrentMember } from "./session";

export const createHouseholdInput = z.object({
  displayName: z.string().trim().min(1, "Enter a name").max(40, "Keep it under 40 characters"),
});

/** Create a Household with its first Member, and sign that Member in on this device. */
export async function createHousehold(
  db: Db,
  input: z.infer<typeof createHouseholdInput>,
): Promise<CurrentMember & { token: string }> {
  const [household] = await db.insert(households).values({}).returning();
  const [member] = await db
    .insert(members)
    .values({ householdId: household.id, displayName: input.displayName })
    .returning();
  const token = await startSession(db, member.id);
  return {
    token,
    member: { id: member.id, displayName: member.displayName },
    household: { id: household.id },
  };
}
