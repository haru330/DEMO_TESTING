import { beforeEach, describe, expect, it } from "vitest";
import { POST as createHouseholdRoute } from "@/app/api/households/route";
import { resetDbForTests } from "@/lib/db";
import { createHousehold, getMe, post } from "./helpers";

beforeEach(() => resetDbForTests());

describe("creating a Household", () => {
  it("makes the creator its first Member and signs them in", async () => {
    const { res, body, cookie } = await createHousehold("Haru");

    expect(res.status).toBe(201);
    expect(body.member.displayName).toBe("Haru");
    expect(cookie).toMatch(/^pantry_session=.+/);

    const me = await getMe(cookie);
    expect(me.status).toBe(200);
    const current = await me.json();
    expect(current.member.id).toBe(body.member.id);
    expect(current.household.id).toBe(body.household.id);
  });

  it("keeps the session for a long time with no password or email", async () => {
    const { res } = await createHousehold("Haru");
    const setCookie = res.headers.get("set-cookie")!;

    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=Lax");
    expect(Number(/Max-Age=(\d+)/.exec(setCookie)![1])).toBeGreaterThan(60 * 60 * 24 * 365);
  });

  it("trims the display name", async () => {
    const { body } = await createHousehold("  Haru  ");
    expect(body.member.displayName).toBe("Haru");
  });

  it.each([[""], ["   "], ["x".repeat(41)]])("refuses the display name %j", async (displayName) => {
    const res = await createHouseholdRoute(post("/api/households", { displayName }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBeTruthy();
  });

  it("refuses a request with no usable body", async () => {
    const res = await createHouseholdRoute(
      new Request("http://test/api/households", { method: "POST", body: "not json" }),
    );
    expect(res.status).toBe(400);
  });

  it("gives each Household its own Member and session", async () => {
    const a = await createHousehold("Haru");
    const b = await createHousehold("Sam");

    expect(a.body.household.id).not.toBe(b.body.household.id);
    expect((await (await getMe(a.cookie)).json()).member.displayName).toBe("Haru");
    expect((await (await getMe(b.cookie)).json()).member.displayName).toBe("Sam");
  });
});

describe("who am I", () => {
  it("treats a request with no session as signed out", async () => {
    expect((await getMe()).status).toBe(401);
  });

  it("treats an unknown or tampered session as signed out", async () => {
    const { cookie } = await createHousehold("Haru");
    expect((await getMe("pantry_session=made-up")).status).toBe(401);
    expect((await getMe(`${cookie}x`)).status).toBe(401);
  });
});
