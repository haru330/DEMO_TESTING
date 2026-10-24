import { POST as createHouseholdRoute } from "@/app/api/households/route";
import { GET as meRoute } from "@/app/api/me/route";

export const post = (url: string, body: unknown) =>
  new Request(`http://test${url}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

export const withCookie = (url: string, cookie?: string) =>
  new Request(`http://test${url}`, cookie ? { headers: { cookie } } : undefined);

/** Create a Household through the API and return the cookie the device would keep. */
export async function createHousehold(displayName: string) {
  const res = await createHouseholdRoute(post("/api/households", { displayName }));
  const cookie = res.headers.get("set-cookie")?.split(";")[0];
  return { res, body: await res.json(), cookie };
}

export const getMe = (cookie?: string) => meRoute(withCookie("/api/me", cookie));
