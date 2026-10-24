import { getDb } from "@/lib/db";
import { createHousehold, createHouseholdInput } from "@/lib/households";
import { sessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = createHouseholdInput.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { token, member, household } = await createHousehold(await getDb(), parsed.data);
  return Response.json(
    { member, household },
    { status: 201, headers: { "Set-Cookie": sessionCookie(token) } },
  );
}
