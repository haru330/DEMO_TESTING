import { expect, test } from "@playwright/test";

test("serves a valid web app manifest", async ({ request }) => {
  const res = await request.get("/manifest.webmanifest");
  expect(res.ok()).toBe(true);
  const manifest = await res.json();

  expect(manifest.display).toBe("standalone");
  expect(manifest.start_url).toBe("/");
  expect(manifest.name).toBeTruthy();
  const sizes = manifest.icons.map((icon: { sizes: string }) => icon.sizes);
  expect(sizes).toContain("192x192");
  expect(sizes).toContain("512x512");

  for (const icon of manifest.icons) {
    const iconRes = await request.get(icon.src);
    expect(iconRes.ok()).toBe(true);
    expect(iconRes.headers()["content-type"]).toContain("image/png");
  }
});

test("is installable: manifest linked and service worker controls the page", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute("href", /manifest/);

  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  expect(await page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
});

test("shows the offline screen when there is no connection", async ({ page, context }) => {
  await page.goto("/");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();

  await context.setOffline(true);
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "You're offline" })).toBeVisible();
});

test("a visitor creates a Household and stays signed in", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Your name").fill("Haru");
  await page.getByRole("button", { name: "Create our Household" }).click();

  await expect(page.getByText("Signed in as Haru")).toBeVisible();
  await expect(page.getByText("Your Pantry is empty")).toBeVisible();

  await page.reload();
  await expect(page.getByText("Signed in as Haru")).toBeVisible();
});
