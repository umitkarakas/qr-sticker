---
phase: 01-type-forms
plan: 01
subsystem: ui
tags: [react, typescript, zod, forms, content-types]

# Dependency graph
requires: []
provides:
  - 7 type-specific QR content form components under src/components/panels/content/
  - FormField shared label+input wrapper component
  - url schema extended with optional title field
  - vcard schema extended with optional website field
  - formatVcard updated to emit URL vCard line
affects:
  - 01-02 (ContentPanel wiring — imports these form components)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Form component pattern: useDesigner hook + Extract<ContentData, { type: '...' }> cast + dispatch SET_CONTENT on every onChange"
    - "Shared FormField wrapper: reusable label+input layout component used by all form components"
    - "Barrel export: src/components/panels/content/index.ts exports all form components"

key-files:
  created:
    - src/components/panels/content/FormField.tsx
    - src/components/panels/content/UrlForm.tsx
    - src/components/panels/content/PhoneForm.tsx
    - src/components/panels/content/MapForm.tsx
    - src/components/panels/content/EmailForm.tsx
    - src/components/panels/content/WhatsAppForm.tsx
    - src/components/panels/content/WiFiForm.tsx
    - src/components/panels/content/VCardForm.tsx
    - src/components/panels/content/index.ts
  modified:
    - src/lib/core/schemas.ts
    - src/lib/core/content-types.ts

key-decisions:
  - "Components are standalone (no ContentPanel changes yet) — keeps this plan focused and independently verifiable; Plan 02 wires them in"
  - "Using Extract<ContentData, { type: '...' }> cast rather than runtime type guards — safe because components are only rendered when content.type matches"
  - "Optional fields use value={content.field ?? ''} with onChange converting empty string back to undefined — keeps form controlled without storing empty strings in state"

patterns-established:
  - "Form component pattern: useDesigner + type-cast + update helper + FormField wrappers"
  - "Optional field pattern: value={x ?? ''} + onChange converts '' to undefined"

requirements-completed: [FORM-01, FORM-02, FORM-03, FORM-04, FORM-05, FORM-06, FORM-07, FORM-08]

# Metrics
duration: 1min
completed: 2026-04-19
---

# Phase 1 Plan 01: Type-Specific Form Components Summary

**7 isolated QR content form components (UrlForm, PhoneForm, MapForm, EmailForm, WhatsAppForm, WiFiForm, VCardForm) using useDesigner + Zod discriminated union type casts, with schema extensions for url.title and vcard.website**

## Performance

- **Duration:** 1 min
- **Started:** 2026-04-19T12:51:10Z
- **Completed:** 2026-04-19T12:53:05Z
- **Tasks:** 3
- **Files modified:** 11

## Accomplishments
- Extended ContentData schema with optional `title` on url type and optional `website` on vcard type
- Created FormField shared wrapper and all 7 type-specific form components, each dispatching SET_CONTENT via useDesigner on every input change
- Added formatVcard URL line support and barrel index export for clean imports in Plan 02

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend schemas with missing optional fields** - `e670c80` (feat)
2. **Task 2: FormField helper + UrlForm, PhoneForm, MapForm** - `c15fc4a` (feat)
3. **Task 3: EmailForm, WhatsAppForm, WiFiForm, VCardForm + barrel index** - `dbed3bd` (feat)

**Plan metadata:** _(docs commit to follow)_

## Files Created/Modified
- `src/lib/core/schemas.ts` - Added url.title and vcard.website optional fields to discriminated union
- `src/lib/core/content-types.ts` - Added URL vCard line to formatVcard
- `src/components/panels/content/FormField.tsx` - Shared label+input wrapper used by all forms
- `src/components/panels/content/UrlForm.tsx` - URL + optional title inputs
- `src/components/panels/content/PhoneForm.tsx` - Phone number input
- `src/components/panels/content/MapForm.tsx` - Google Maps URL input
- `src/components/panels/content/EmailForm.tsx` - Email + optional subject + optional body textarea
- `src/components/panels/content/WhatsAppForm.tsx` - Phone + optional message
- `src/components/panels/content/WiFiForm.tsx` - SSID + password + encryption select
- `src/components/panels/content/VCardForm.tsx` - firstName, lastName, phone, email, website, org
- `src/components/panels/content/index.ts` - Barrel export for all 7 form components

## Decisions Made
- Components are standalone (no ContentPanel changes yet) — keeps this plan focused; Plan 02 wires them into ContentPanel
- Using `Extract<ContentData, { type: '...' }>` cast rather than runtime guards — safe since components render only when content.type matches
- Optional fields use `value={field ?? ''}` with `onChange` converting empty string back to `undefined` — keeps forms controlled without storing empty strings in state

## Deviations from Plan
None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All 7 form components ready for import in ContentPanel (Plan 02)
- Barrel index at `src/components/panels/content/index.ts` provides clean single-import point
- Schema additions compile cleanly; no breaking changes to existing components

---
*Phase: 01-type-forms*
*Completed: 2026-04-19*
