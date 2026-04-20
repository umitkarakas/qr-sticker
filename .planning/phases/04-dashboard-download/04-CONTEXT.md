# Phase 4: Dashboard Download - Context

**Gathered:** 2026-04-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Add PNG and SVG download actions to each dashboard card so users can download any saved QR without opening the editor. No new pages, no API routes — client-side generation from existing saved design data.

</domain>

<decisions>
## Implementation Decisions

### Button Placement
- Add a single "İndir ▾" dropdown button alongside the existing 3 action buttons (Düzenle / Kopyala / Sil)
- Clicking the dropdown reveals two options: PNG İndir / SVG İndir
- Dropdown position on the action row: Claude's discretion (user said "fark etmez")
- Total actions: 4 buttons — keeps the card clean vs 5 separate buttons

### Export Fidelity
- Frame included: use `composeFrameSvg()` pipeline, identical to the designer export
- If the QR has no frame, output is the plain styled QR (same as designer behavior)
- NOT a simple `qr-code-styling` raw export — must go through the full composition engine

### PNG Size
- 800×800px @ 3x scale (same as designer) — 2400px output, print quality
- Consistent with `downloadPng(svgString, filename, 800, 800, 3)` already used in StickerPreview

### File Naming
- Use the QR title: spaces → hyphens, lowercase
- Format: `{title}.png` / `{title}.svg`
- Example: "Sitem" → `sitem.png`, "telefon et" → `telefon-et.svg`

### Claude's Discretion
- Exact dropdown trigger style (chevron icon, hover/click behavior)
- Loading state during PNG generation (spinner on button, disable during async)
- Error handling if export fails
- Dropdown position within action row

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/core/export.ts` — `downloadPng(svgString, filename, 800, 800, 3)` and `downloadSvg(svgString, filename)` fully implemented and battle-tested in StickerPreview
- `src/lib/core/composition.ts` (or equivalent) — `composeFrameSvg()` takes design params and returns SVG string; QrCard already has all required data (content.payload, design.shapeId, design.frameId, design.style)
- `QrCard.tsx` — already instantiates `QRCodeStyling` with full design data for thumbnail; the same params feed into `composeFrameSvg`
- `QrCardData` interface — already includes `content`, `design.shapeId`, `design.frameId`, `design.style` needed for composition

### Established Patterns
- Export flow: `composeFrameSvg(params) → SVG string → downloadPng/downloadSvg`
- StickerPreview does this on every download click — QrCard needs the same pipeline with saved data
- Action buttons: `flex gap-2` row with icon + text, fuchsia accent for primary, gray for secondary
- Tailwind card pattern: `rounded-3xl border border-slate-200 bg-white shadow-sm`

### Integration Points
- `src/components/dashboard/QrCard.tsx` — add download dropdown to existing action row
- `src/lib/core/export.ts` — import `downloadPng` and `downloadSvg` (no changes needed)
- `composeFrameSvg` — needs to be called with data reconstructed from `QrCardData`; same reconstruction pattern as `EditLoader` in GeneratorWorkspace

</code_context>

<specifics>
## Specific Ideas

- Download behavior exactly mirrors the designer — frame included, 800×800 @3x PNG, same SVG pipeline
- File named after QR title (user's own label, not a generic filename)
- Single dropdown keeps the card action row at 4 items max

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-dashboard-download*
*Context gathered: 2026-04-21*
