# Roadmap: QR Platform — Milestone v1.0

## Overview

Milestone v1.0 closes the gap between a working QR designer and a useful product. The designer already renders and exports QR codes client-side, but nothing saves to the database and the dashboard is a placeholder. These four phases wire type-specific forms into the designer, persist designs to the database, build a real dashboard with CRUD, and expose download from that dashboard.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Type Forms** - Replace generic text input with type-specific content forms for all 7 QR types
- [ ] **Phase 2: Save Flow** - Add save button + API to persist QrCode + QrContent + QrDesign to the database
- [ ] **Phase 3: Dashboard CRUD** - Build real dashboard with list, edit, delete, and duplicate actions
- [ ] **Phase 4: Dashboard Download** - Enable PNG and SVG download directly from the dashboard

## Phase Details

### Phase 1: Type Forms
**Goal**: Every supported QR type renders its own tailored input form, and the live preview reflects what the user types
**Depends on**: Nothing (designer is already functional; forms replace ContentPanel generic input)
**Requirements**: FORM-01, FORM-02, FORM-03, FORM-04, FORM-05, FORM-06, FORM-07, FORM-08
**Success Criteria** (what must be TRUE):
  1. Selecting "URL" type shows a URL field and optional title field; the QR preview encodes the entered URL
  2. Selecting "Phone", "Email", "WhatsApp", "WiFi", "vCard", or "Map" each shows its own distinct form with the correct fields for that type
  3. Typing or changing any field value updates the QR preview in real time without requiring a button press
  4. A form with empty required fields shows an empty or placeholder QR rather than crashing
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md — Schema extensions + 7 type-specific form components
- [x] 01-02-PLAN.md — ContentPanel refactor to use form components + human verify

### Phase 2: Save Flow
**Goal**: A logged-in user can save the current QR design to their account with a name; an unauthenticated user is prompted to log in
**Depends on**: Phase 1 (save must capture typed, validated content from the new forms)
**Requirements**: SAVE-01, SAVE-02, SAVE-03, SAVE-04
**Success Criteria** (what must be TRUE):
  1. Logged-in user clicks "Save", enters a name, and the QR is stored — QrCode, QrContent, and QrDesign records all appear in the database
  2. After a successful save, the user lands on the dashboard (redirect)
  3. A user who is not logged in and attempts to save is redirected to the login page or sees a login prompt
  4. Saving the same QR twice creates two separate records (no silent deduplication)
**Plans**: TBD

### Phase 3: Dashboard CRUD
**Goal**: The dashboard shows the user's saved QR codes and lets them edit, delete, or duplicate any entry
**Depends on**: Phase 2 (dashboard requires saved records to exist)
**Requirements**: DASH-01, DASH-02, DASH-03, DASH-04
**Success Criteria** (what must be TRUE):
  1. The dashboard lists every QR code belonging to the logged-in user, showing a preview thumbnail, name, type, and creation date
  2. Clicking "Edit" on a saved QR opens the designer pre-loaded with that QR's content and design settings
  3. Clicking "Delete" shows a confirmation prompt; confirming removes the entry from the list and the database
  4. Clicking "Duplicate" creates a new entry with "(copy)" appended to the name and adds it to the list immediately
**Plans**: TBD

### Phase 4: Dashboard Download
**Goal**: Users can download any saved QR as PNG or SVG directly from the dashboard without opening the editor
**Depends on**: Phase 3 (download actions live on dashboard cards)
**Requirements**: DOWN-01, DOWN-02
**Success Criteria** (what must be TRUE):
  1. Each dashboard card has a "Download PNG" action that triggers a browser file download of a valid PNG image for that QR
  2. Each dashboard card has a "Download SVG" action that triggers a browser file download of a valid SVG file for that QR
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Type Forms | 2/2 | Complete | 2026-04-19 |
| 2. Save Flow | 0/TBD | Not started | - |
| 3. Dashboard CRUD | 0/TBD | Not started | - |
| 4. Dashboard Download | 0/TBD | Not started | - |
