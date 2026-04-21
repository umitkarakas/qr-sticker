---
phase: 04-dashboard-download
plan: 01
status: complete
completed: "2026-04-21"
files_modified:
  - src/components/dashboard/QrCard.tsx
requirements_satisfied:
  - DOWN-01
  - DOWN-02
---

# Plan 04-01 Summary: Dashboard Download Dropdown

## What Was Built

Added PNG and SVG download actions to each `QrCard` on the dashboard. A single "İndir ▾" dropdown button joins the existing Düzenle / Kopyala / Sil action row, making 4 total buttons per card.

## Changes

### `src/components/dashboard/QrCard.tsx`

- Added imports: `generateQrSvg`, `composeStickerSvg`, `composeFrameSvg`, `downloadPng`, `downloadSvg`, `getShape`, `getFrame`, `QrStyle`, `CtaConfig`, `ChevronDown`
- Added `toSlug(title)` helper: converts QR title to filename slug (lowercase, spaces→hyphens, Turkish chars preserved)
- Added `composeSvgFromCard(qr)` async helper: reconstructs full designer export pipeline (mirrors EditLoader pattern from GeneratorWorkspace)
- Added `downloadOpen` and `downloading` state to `QrCard`
- Added `handleDownloadPng` and `handleDownloadSvg` handlers
- Added "İndir ▾" dropdown button as 4th action; opens upward (`bottom-full`) to avoid clipping
- Fixed overlay (`fixed inset-0`) to close dropdown on outside click
- Removed `overflow-hidden` from outer card div so dropdown can render above card border

## Key Decisions

- Dropdown opens upward (`bottom-full`) — cards near viewport bottom would clip a downward panel
- Fixed overlay closes on outside click without extra event listeners
- `composeSvgFromCard` mirrors EditLoader reconstruction exactly — guarantees fidelity parity with designer
- `toSlug` preserves `\u00c0-\u024f` range for Turkish/Latin extended characters

## Verification

- `npx tsc --noEmit` — zero errors
- Server running at localhost:3000 — login required to reach /dashboard
