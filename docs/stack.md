# Stack

Chosen in the walking-skeleton ticket (#2). Revisit a row when its reason stops holding.

| Part | Choice | Why |
|---|---|---|
| App and API | Next.js (App Router) with TypeScript | One codebase for the PWA screens and the HTTP API; first-class manifest support. |
| Database | Postgres through Drizzle ORM | Relational data with real constraints (unique Item names per Household). Schema and migrations live in `lib/db/schema.ts` and `drizzle/`. |
| Database for dev and tests | PGlite (Postgres compiled to WASM, in-process) | Real Postgres behaviour with no Docker. In-memory for tests, `.data/pglite` for local dev. |
| Sessions | Random token in an HttpOnly cookie, only its hash stored | Matches the no-password, device-bound Member model. |
| API tests | Vitest, calling route handlers against a fresh PGlite database | The HTTP API is the main test seam. |
| Browser smoke tests | Playwright against a production build | The service worker only runs in production. |
| Recipe model | Called through `lib/recipes/model-client.ts`; provider not chosen yet | Tests use a fake. The real provider is picked in the Recipes ticket. |

## Known gap: production database

PGlite is for dev and tests. A hosted deployment (for example on Vercel) needs a networked Postgres such as Neon, so a ticket must add a `DATABASE_URL` driver beside PGlite in `lib/db/index.ts` before this app is deployed.
