import { getDb } from "@/lib/db";
import { memberForToken, tokenFromCookieHeader } from "@/lib/session";

export async function GET(request: Request) {
  const token = tokenFromCookieHeader(request.headers.get("cookie"));
  const current = await memberForToken(await getDb(), token);
  if (!current) return Response.json({ error: "Not signed in" }, { status: 401 });
  return Response.json(current);
}
