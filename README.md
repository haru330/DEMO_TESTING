# Pantry

A web app (PWA) that tracks the food in your home and suggests recipes from what you have. Domain language is in `GLOSSARY.md`, the stack in `docs/stack.md`.

## Commands

- `npm run dev`: start the app at http://localhost:3000 (data in `.data/`)
- `npm test`: API tests (Vitest, in-memory Postgres)
- `npm run test:e2e`: browser smoke tests (Playwright, builds the app first; run `npx playwright install chromium` once)
- `npm run typecheck`, `npm run lint`
- `npm run db:generate`: create a migration after editing `lib/db/schema.ts`
