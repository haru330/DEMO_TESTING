import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

export default defineConfig({
  testDir: "tests/e2e",
  use: { baseURL: `http://localhost:${PORT}` },
  projects: [{ name: "chromium", use: { ...devices["Pixel 7"] } }],
  // The service worker only runs against a production build.
  webServer: {
    command: `npm run build && npm run start -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    env: { PANTRY_DB_DIR: "memory://" },
    timeout: 180_000,
    reuseExistingServer: false,
  },
});
