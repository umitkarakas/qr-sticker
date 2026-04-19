---
phase: 02-save-flow
plan: 01
subsystem: api
tags: [next.js, prisma, zod, next-auth, api-route, crypto]

# Dependency graph
requires:
  - phase: 01-type-forms
    provides: ContentDataSchema, QrStyleSchema, CtaConfigSchema, ContentTypeEnum from src/lib/core/schemas.ts
provides:
  - POST /api/qr endpoint: auth-gated, validates + persists QrCode + QrContent + QrDesign atomically
  - generateSlug(): crypto-based 8-char base64url slug utility
affects:
  - 02-save-flow
  - dashboard-ui
  - qr-redirect

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "API route defines its own Zod schema (SaveQrBodySchema) rather than importing DesignerStateSchema — API owns its contract"
    - "Prisma nested create for atomic 3-table insert in a single round-trip"
    - "crypto.randomBytes(6).toString('base64url') for 8-char URL-safe slug generation"
    - "vitest.config.ts separate from vite.config.ts to decouple test runner from app bundler"

key-files:
  created:
    - src/lib/qr/slug.ts
    - src/lib/qr/slug.test.ts
    - src/app/api/qr/route.ts
    - vitest.config.ts
  modified: []

key-decisions:
  - "API owns its own Zod schema (SaveQrBodySchema) independent of DesignerStateSchema — cleaner contract boundary"
  - "Prisma nested create used over two sequential transactions — single round-trip, fully atomic"
  - "vitest.config.ts created to fix @vitejs/plugin-react missing error blocking tests"

patterns-established:
  - "API route pattern: getServerSession check → JSON parse → safeParse → generate IDs → prisma nested create → 201"
  - "Slug pattern: randomBytes(6).toString('base64url') = 8 URL-safe chars"

requirements-completed: [SAVE-01, SAVE-02, SAVE-04]

# Metrics
duration: 8min
completed: 2026-04-19
---

# Phase 2 Plan 1: Save Flow — POST /api/qr Summary

**Auth-gated POST /api/qr endpoint using Zod validation and Prisma nested create to atomically persist QrCode + QrContent + QrDesign with a crypto-based base64url slug**

## Performance

- **Duration:** 8 min
- **Started:** 2026-04-19T22:21:38Z
- **Completed:** 2026-04-19T22:22:50Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- `generateSlug()` produces cryptographically random 8-char base64url strings verified by 3 vitest tests
- `POST /api/qr` returns 401 for unauthenticated requests, 400 for invalid body, 201 with `{ id, slug }` on success
- All three DB records (QrCode, QrContent, QrDesign) created atomically via Prisma nested create in a single round-trip
- TypeScript compiles without errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Slug utility** - `ec676fc` (feat)
2. **Task 2: POST /api/qr route** - `6db91ca` (feat)

**Plan metadata:** (docs commit to follow)

_Note: Task 1 used TDD — RED (missing file) → GREEN (implementation) → all 3 tests pass_

## Files Created/Modified
- `src/lib/qr/slug.ts` - Exports `generateSlug()` using `crypto.randomBytes(6).toString('base64url')`
- `src/lib/qr/slug.test.ts` - 3 vitest tests: length=8, base64url regex, uniqueness across 10 calls
- `src/app/api/qr/route.ts` - Next.js App Router POST handler: auth gate + Zod validation + Prisma nested create
- `vitest.config.ts` - Standalone vitest config with `@` alias (fixes `@vitejs/plugin-react` startup error)

## Decisions Made
- API defines its own `SaveQrBodySchema` rather than importing `DesignerStateSchema` — API contract is independent of client state shape
- Used Prisma nested `create` (single `prisma.qrCode.create` with `content: { create: ... }` and `design: { create: ... }`) over two sequential `$transaction` calls — cleaner and truly atomic
- `vitest.config.ts` created as a standalone config (deviation auto-fix) to decouple test runner from the Vite app config that imports `@vitejs/plugin-react`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Created vitest.config.ts to fix startup error from missing @vitejs/plugin-react**
- **Found during:** Task 1 (TDD RED phase — first vitest run)
- **Issue:** `vite.config.ts` imports `@vitejs/plugin-react` which is not installed; vitest loads vite config on startup and crashes before running any tests
- **Fix:** Created `vitest.config.ts` using `vitest/config` (no React plugin needed) with `@` path alias
- **Files modified:** `vitest.config.ts` (created)
- **Verification:** `npx vitest run src/lib/qr/slug.test.ts` succeeds after fix
- **Committed in:** `ec676fc` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Fix was necessary to run any tests at all. No scope creep — vitest.config.ts is minimal and scoped to test runner only.

## Issues Encountered
- `vite.config.ts` required `@vitejs/plugin-react` which was not listed in `devDependencies`. Created a separate `vitest.config.ts` rather than installing the plugin (unnecessary for server-side/utility tests).

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- `POST /api/qr` is ready to be called from the designer save button
- Next: wire up the save flow in the frontend — call this endpoint with the current `DesignerState`
- No blockers

---
*Phase: 02-save-flow*
*Completed: 2026-04-19*
