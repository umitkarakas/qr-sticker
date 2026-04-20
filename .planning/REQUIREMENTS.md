# Requirements: QR Platform

**Defined:** 2026-04-18
**Core Value:** Users can create a fully customized QR code, save it, and download it in seconds.

## v1 Requirements — Milestone v1.0

### FORM — Type-specific Content Forms

- [x] **FORM-01**: User sees a URL input form (url + optional title) for URL QR type
- [x] **FORM-02**: User sees a phone number input for Phone QR type
- [x] **FORM-03**: User sees email + optional subject/body fields for Email QR type
- [x] **FORM-04**: User sees phone + optional message fields for WhatsApp QR type
- [x] **FORM-05**: User sees SSID, password, and security type fields for WiFi QR type
- [x] **FORM-06**: User sees name, phone, email, website, organization fields for vCard QR type
- [x] **FORM-07**: User sees address/coordinates field for Map QR type
- [x] **FORM-08**: QR preview updates in real-time as user types in any form field

### SAVE — Persist QR to Database

- [x] **SAVE-01**: Logged-in user can save the current QR design with a custom name
- [x] **SAVE-02**: Saving creates QrCode + QrContent + QrDesign records linked to the user
- [x] **SAVE-03**: User is redirected to the dashboard after a successful save
- [x] **SAVE-04**: Unauthenticated user is prompted to log in before saving

### DASH — Dashboard List & CRUD

- [ ] **DASH-01**: User sees a list of their saved QR codes with preview thumbnail, name, type, and date
- [x] **DASH-02**: User can open a saved QR in the editor to modify it
- [ ] **DASH-03**: User can delete a saved QR code (with confirmation)
- [ ] **DASH-04**: User can duplicate a saved QR code (creates a copy)

### DOWN — Download

- [ ] **DOWN-01**: User can download a QR code as PNG from the dashboard
- [ ] **DOWN-02**: User can download a QR code as SVG from the dashboard

## Future Requirements — Milestone 2+

### Upload Types
- **UPLD-01**: User can upload a PDF file to create a PDF QR code
- **UPLD-02**: User can upload an image to create an Image QR code
- **UPLD-03**: Uploaded files stored in /app/storage/uploads

### Social / Link-in-bio
- **SOCL-01**: User can create a social links QR (Instagram, Twitter, LinkedIn, etc.)
- **SOCL-02**: User can create a WhatsApp Business QR with catalog link
- **SOCL-03**: User can create a Google Review QR (direct review link)

### Dynamic QR & Analytics (Milestone 3)
- **DYN-01**: User can create a dynamic QR that redirects through a tracked short URL
- **ANLX-01**: User can see scan count, device breakdown, and location for each QR

## Out of Scope

| Feature | Reason |
|---------|--------|
| Teams / multi-user workspaces | High complexity, not core for v1 |
| Mobile app | Web-first; mobile deferred |
| Landing page builder | Milestone 4 — depends on dynamic QR |
| OAuth login (Google, GitHub) | Email/password sufficient for MVP |
| Real-time collaboration | Not planned |
| White-label / custom domains | Enterprise tier, deferred |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FORM-01 | Phase 1 | Complete |
| FORM-02 | Phase 1 | Complete |
| FORM-03 | Phase 1 | Complete |
| FORM-04 | Phase 1 | Complete |
| FORM-05 | Phase 1 | Complete |
| FORM-06 | Phase 1 | Complete |
| FORM-07 | Phase 1 | Complete |
| FORM-08 | Phase 1 | Complete |
| SAVE-01 | Phase 2 | Complete |
| SAVE-02 | Phase 2 | Complete |
| SAVE-03 | Phase 2 | Complete |
| SAVE-04 | Phase 2 | Complete |
| DASH-01 | Phase 3 | Pending |
| DASH-02 | Phase 3 | Complete |
| DASH-03 | Phase 3 | Pending |
| DASH-04 | Phase 3 | Pending |
| DOWN-01 | Phase 4 | Pending |
| DOWN-02 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 18 total
- Mapped to phases: 18 (roadmap complete)
- Unmapped: 0

---
*Requirements defined: 2026-04-18*
*Last updated: 2026-04-19 — Traceability filled after roadmap creation*
