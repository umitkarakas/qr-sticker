---
phase: 01-type-forms
verified: 2026-04-19T00:00:00Z
status: human_needed
score: 12/12 must-haves verified
human_verification:
  - test: "Open the designer and click through all 7 QR type buttons"
    expected: "Each type shows its specific form (URL shows 2 fields, Email shows 3 with textarea, VCard shows 6, WiFi shows dropdown, etc.)"
    why_human: "Can't verify runtime rendering or type-switcher click behavior programmatically"
  - test: "Type in any form field while watching the QR preview"
    expected: "QR preview updates within ~300ms of stopping (debounce active), no crash"
    why_human: "Debounce timing and live preview refresh require a running browser"
  - test: "Clear the URL field completely on URL type"
    expected: "QR preview shows a fallback/placeholder — does not crash or show error state visible to user"
    why_human: "Error boundary rendering after getQrData returns empty string requires visual confirmation"
---

# Phase 1: Type Forms Verification Report

**Phase Goal:** Every supported QR type renders its own tailored input form, and the live preview reflects what the user types.
**Verified:** 2026-04-19
**Status:** human_needed — all automated checks pass; 3 behavioral items need visual confirmation
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| #  | Truth | Status | Evidence |
|----|-------|--------|----------|
| 1  | UrlForm renders a URL input and an optional Title input | VERIFIED | `UrlForm.tsx` lines 17-34: two FormField blocks, URL + "Başlık (opsiyonel)" |
| 2  | PhoneForm renders a single phone number input | VERIFIED | `PhoneForm.tsx` lines 17-25: single FormField "Telefon Numarası" |
| 3  | MapForm renders a Google Maps URL input | VERIFIED | `MapForm.tsx` lines 17-25: FormField "Google Maps Linki", type="url" |
| 4  | EmailForm renders email, optional subject, and optional body inputs | VERIFIED | `EmailForm.tsx` lines 17-43: three FormFields; body uses `<textarea>` rows=3 |
| 5  | WhatsAppForm renders phone and optional message inputs | VERIFIED | `WhatsAppForm.tsx` lines 17-34: two FormFields, phone + "Mesaj (opsiyonel)" |
| 6  | WiFiForm renders SSID, password, and encryption select inputs | VERIFIED | `WiFiForm.tsx` lines 17-45: three FormFields; encryption uses `<select>` with WPA/WEP/nopass |
| 7  | VCardForm renders firstName, lastName, phone, email, website, and org inputs | VERIFIED | `VCardForm.tsx` lines 17-70: six FormFields including "Web Sitesi (opsiyonel)" |
| 8  | All form components accept onChange and dispatch via useDesigner | VERIFIED | All 7 files import `useDesigner`, call `dispatch({ type: 'SET_CONTENT', ... })` on every onChange |
| 9  | Empty required fields produce a safe (non-crashing) QR string | VERIFIED | `StickerPreview.tsx` lines 16-19: try/catch in `getQrData` returns '' on error; lines 34/70: outer try/catch sets error state, no crash |
| 10 | ContentPanel renders the correct form component for each active content type | VERIFIED | `ContentPanel.tsx` lines 23-72: `renderForm()` switch maps all 7 types to their components |
| 11 | Inline conditional blocks for all 7 types are removed from ContentPanel | VERIFIED | ContentPanel has no inline url/phone/email/whatsapp/wifi/vcard/location blocks; only instagram, google-review, menu remain inline as designed |
| 12 | QR preview is debounced and wired to state changes | VERIFIED | `StickerPreview.tsx` lines 79-85: `useEffect` with 300ms `setTimeout(buildPreview)` on `[buildPreview]`, which depends on `[state]` |

**Score: 12/12 truths verified**

---

### Required Artifacts

| Artifact | Status | Details |
|----------|--------|---------|
| `src/lib/core/schemas.ts` | VERIFIED | `url` schema has `title: z.string().optional()` (line 13); `vcard` schema has `website: z.string().optional()` (line 30) |
| `src/components/panels/content/FormField.tsx` | VERIFIED | Exports `FormField`, renders label + children wrapper |
| `src/components/panels/content/UrlForm.tsx` | VERIFIED | Exports `UrlForm`, dispatches SET_CONTENT, 2 fields |
| `src/components/panels/content/PhoneForm.tsx` | VERIFIED | Exports `PhoneForm`, dispatches SET_CONTENT, 1 field |
| `src/components/panels/content/MapForm.tsx` | VERIFIED | Exports `MapForm`, dispatches SET_CONTENT, 1 field |
| `src/components/panels/content/EmailForm.tsx` | VERIFIED | Exports `EmailForm`, dispatches SET_CONTENT, 3 fields including textarea body |
| `src/components/panels/content/WhatsAppForm.tsx` | VERIFIED | Exports `WhatsAppForm`, dispatches SET_CONTENT, 2 fields |
| `src/components/panels/content/WiFiForm.tsx` | VERIFIED | Exports `WiFiForm`, dispatches SET_CONTENT, 3 fields including select |
| `src/components/panels/content/VCardForm.tsx` | VERIFIED | Exports `VCardForm`, dispatches SET_CONTENT, 6 fields including website |
| `src/components/panels/content/index.ts` | VERIFIED | Barrel exports all 7 form components |
| `src/components/panels/ContentPanel.tsx` | VERIFIED | Imports all 7 from `./content`, delegates via `renderForm()` switch |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `content/*.tsx` (all 7) | `DesignerContext.tsx` | `useDesigner` + `dispatch({ type: 'SET_CONTENT' })` | WIRED | Every form file has `useDesigner` import and `dispatch({ type: 'SET_CONTENT', ... })` on every onChange |
| `ContentPanel.tsx` | `content/index.ts` | `import { UrlForm, PhoneForm, MapForm, EmailForm, WhatsAppForm, WiFiForm, VCardForm } from './content'` | WIRED | ContentPanel.tsx line 8 matches exactly |
| `schemas.ts` → `UrlForm.tsx` | `title` field | `Extract<ContentData, { type: 'url' }>.title` is `string \| undefined` | WIRED | schemas.ts line 13 has `title: z.string().optional()`; UrlForm uses `content.title ?? ''` |
| `DesignerContext.tsx` | `StickerPreview.tsx` | `state` changes → `useEffect` → `buildPreview` → `getQrData` → `generateQrSvg` | WIRED | StickerPreview uses `useDesigner()`, `useEffect([buildPreview])`, 300ms debounce confirmed |
| `content-types.ts` → `formatVcard` | `website` field | `if (data.website) lines.push(\`URL:${data.website}\`)` | WIRED | content-types.ts line 29 present |

---

### Requirements Coverage

| Requirement | Description | Status | Evidence |
|-------------|-------------|--------|----------|
| FORM-01 | User sees URL input form (url + optional title) for URL QR type | SATISFIED | `UrlForm.tsx` renders URL + optional title fields; schema has `title: z.string().optional()` |
| FORM-02 | User sees phone number input for Phone QR type | SATISFIED | `PhoneForm.tsx` renders single phone input |
| FORM-03 | User sees email + optional subject/body fields for Email QR type | SATISFIED | `EmailForm.tsx` renders all 3 fields; body is a `<textarea>` |
| FORM-04 | User sees phone + optional message fields for WhatsApp QR type | SATISFIED | `WhatsAppForm.tsx` renders phone + optional message |
| FORM-05 | User sees SSID, password, and security type fields for WiFi QR type | SATISFIED | `WiFiForm.tsx` renders SSID, password, encryption select (WPA/WEP/nopass) |
| FORM-06 | User sees name, phone, email, website, organization fields for vCard QR type | SATISFIED | `VCardForm.tsx` renders 6 fields including website; schema has `website: z.string().optional()` |
| FORM-07 | User sees address/coordinates field for Map QR type | SATISFIED | `MapForm.tsx` renders "Google Maps Linki" URL input; `location` schema encodes location as a Google Maps URL, which is the established field for this type |
| FORM-08 | QR preview updates in real-time as user types in any form field | SATISFIED (automated) | `StickerPreview.tsx` debounces 300ms and re-renders on every state change; requires human confirmation of visual behavior |

---

### Anti-Patterns Found

None. No TODO/FIXME/HACK/PLACEHOLDER comments found in any form component. No stub return patterns (`return null`, `return {}`, empty arrow functions). All onChange handlers perform real dispatch calls, not console.log stubs.

---

### Human Verification Required

#### 1. Type selector + form rendering

**Test:** Run `npm run dev`, open http://localhost:3000, click the "İçerik" tab, then click each of the 10 type buttons in the grid.
**Expected:** Each of the 7 Phase-1 types (URL, Telefon, E-posta, WhatsApp, WiFi, Kartvizit, Konum) shows its own specific form with the correct number of fields and labels. The 3 remaining types (Instagram, Google Yorum, Menü) continue showing their inline single-field forms.
**Why human:** Runtime rendering and type-switcher click behavior cannot be verified by static analysis.

#### 2. Live QR preview update

**Test:** On any type form, type characters in an input field while watching the QR preview on the right.
**Expected:** QR preview re-renders within approximately 300ms of stopping typing. No crash or visible error in the preview area.
**Why human:** Debounce timing and live canvas refresh require a running browser.

#### 3. Empty required field — graceful degradation

**Test:** Switch to URL type. Clear the URL field completely (delete all characters).
**Expected:** QR preview shows a fallback (empty/placeholder QR) without throwing a visible error state to the user. The app should not crash.
**Why human:** The try/catch in `getQrData` and `buildPreview` is confirmed by code, but the visual outcome (what the user actually sees when `qrData` is empty string) needs confirmation.

---

## Gaps Summary

No gaps. All 12 automated must-haves pass. All 8 requirements (FORM-01 through FORM-08) are satisfied by the codebase. TypeScript compiles with zero errors (`npx tsc --noEmit` produced no output). The 3 human verification items are behavioral/visual checks, not code gaps.

---

_Verified: 2026-04-19_
_Verifier: Claude (gsd-verifier)_
