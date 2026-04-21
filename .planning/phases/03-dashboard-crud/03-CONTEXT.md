# Phase 3: Dashboard CRUD - Context

**Gathered:** 2026-04-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace the placeholder dashboard with a real QR management screen. Users see their saved QR codes in a grid, can edit any entry (pre-loaded in the designer), delete with confirmation, and duplicate. Creating new QR codes stays in the designer — dashboard is management only.

</domain>

<decisions>
## Implementation Decisions

### Card Layout
- 3-column grid on desktop, 1-column on mobile
- Each card shows: QR type badge, title, creation date, 3 action icons
- Thumbnail: render QR with qr-code-styling (canvas → data URL) inside each card — small inline preview
- Cards use the existing white/rounded-3xl/shadow-sm pattern already in dashboard

### Edit Flow
- Route: `/qr-code-generator/[type]?edit=[id]`
- On load: fetch QrCode + QrContent + QrDesign from DB, dispatch to DesignerContext
- Save button: PUT /api/qr/[id] to update the existing record (in-place update)
- User can also use "Kaydet" to create a new copy if desired

### Action Buttons
- Three always-visible icon buttons per card: edit (pencil), duplicate (copy), delete (trash)
- Delete triggers a confirmation modal before executing
- Duplicate immediately creates a new record with "(copy)" appended, adds to list optimistically

### Empty State
- "Henüz QR kodun yok" message + CTA button linking to /qr-code-generator
- Friendly, not cluttered

### Auth
- Dashboard keeps `getServerSession` — header normalization middleware ensures it works
- Unauthenticated users redirected to /login (existing redirect)

### Claude's Discretion
- Exact icon choice (lucide-react or similar)
- Loading skeleton design
- Optimistic update strategy for delete/duplicate
- Error toast placement

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `DesignerContext` (useReducer): full state shape for QrStyle, contentType, content, shapeId, frameId — dispatch actions to pre-load a saved QR
- `POST /api/qr` route: reference for auth gate pattern and Prisma nested read structure
- `StickerDesigner`: accepts state from context — just pre-populate context before mounting
- `SaveQrModal`: reusable for rename on duplicate if needed

### Established Patterns
- Page auth guard: `getServerSession` + `redirect('/login')` if no session
- API auth: `getServerSession` + 401 if no session
- Tailwind styling: `rounded-3xl border border-slate-200 bg-white p-8 shadow-sm` for cards
- Server Actions used for register/login; API routes used for data mutations (POST /api/qr) — keep mutations as API routes

### Integration Points
- `src/app/dashboard/page.tsx`: replace placeholder with real list (server component fetching via Prisma)
- `src/app/qr-code-generator/[type]/page.tsx`: add `edit` query param handling, load QR data into context
- New API routes needed: `GET /api/qr`, `DELETE /api/qr/[id]`, `POST /api/qr/[id]/duplicate`, `PUT /api/qr/[id]`
- `DesignerContext`: may need a `LOAD_QR` action that sets all fields at once from a saved record

</code_context>

<specifics>
## Specific Ideas

- Thumbnail renders inline via qr-code-styling — no server-side image generation needed
- Grid layout consistent with the white-card aesthetic already in dashboard
- Delete modal follows the same pattern as SaveQrModal (simple centered modal)

</specifics>

<deferred>
## Deferred Ideas

- Search / filtering QR codes by type or name — future phase
- Bulk delete — future phase
- Rename QR code inline — future phase

</deferred>

---

*Phase: 03-dashboard-crud*
*Context gathered: 2026-04-20*
