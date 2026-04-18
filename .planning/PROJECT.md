# QR Platform (qrbir.com)

## What This Is

A full-stack QR code creation platform where users design, customize, and manage QR codes with rich visual options — similar to ME-QR. Users register, create QR codes with various content types, customize them with shapes and frames, and download or share them. Live at v1.qrbir.com.

## Core Value

Users can create a fully customized QR code, save it, and download it in seconds.

## Requirements

### Validated

<!-- Shipped and confirmed working in production. -->

- ✓ User registration and login (NextAuth credentials, bcryptjs) — Phase 1
- ✓ QR designer UI (StickerDesigner with 4 panels: Content, Style, Shape, Frame) — Phase 1
- ✓ QR type catalog page + detail pages (10 types, 7 ready) — Phase 1
- ✓ Real-time SVG preview with PNG/SVG export (qr-code-styling) — Phase 1
- ✓ 10 shape varieties (geometric + figurative) — Phase 1
- ✓ Frame system (plain, banded, decorative) — Phase 1
- ✓ Docker deployment on Hetzner, Coolify-managed, OLS reverse proxy — Phase 1
- ✓ PostgreSQL schema: User, QrCode, QrContent, QrDesign, QrAsset, QrScan — Phase 1

### Active

<!-- Milestone v1.0: Save Flow + Dashboard CRUD + Download -->

- [ ] Type-specific content forms for all 7 ready QR types (url, phone, email, whatsapp, wifi, vcard, map)
- [ ] Save QR to database (QrCode + QrContent + QrDesign records)
- [ ] Dashboard: list user's saved QR codes
- [ ] Dashboard: edit, delete, duplicate QR codes
- [ ] Dashboard: download PNG/SVG per QR code

### Out of Scope

- Dynamic QR / redirect tracking — Milestone 3 (requires redirect infrastructure)
- Scan analytics — Milestone 3 (depends on dynamic QR)
- File upload QR types (PDF, image, audio) — Milestone 2
- Social / link-in-bio QR — Milestone 2
- Landing page builder — Milestone 4
- Teams / multi-user — Not planned
- Mobile app — Web-first

## Context

- **Deployed and live:** v1.qrbir.com running Next.js 15 standalone in Docker on Hetzner CPX32 (Ubuntu 22.04)
- **Auth working:** NextAuth v4 with credentials provider; users can register and log in
- **Schema deployed:** Prisma migrations run at `prisma/migrations/20260418184500_init/`; all tables exist but QrCode/QrContent/QrDesign are empty — no save flow exists yet
- **Designer functional:** StickerDesigner renders and exports QR codes client-side; state lives in DesignerContext (useReducer); nothing is persisted
- **QR type routing:** `/qr-code-generator/[type]` renders `GeneratorWorkspace`; ContentPanel shows a generic text input regardless of type — type-specific forms not yet built
- **Content types:** Defined in `src/lib/core/content-types.ts` with Zod schemas; 7 ready (url, phone, email, whatsapp, wifi, vcard, map), 3 planned (text, pdf, image)
- **Dashboard:** Placeholder at `/dashboard` — no real data, no CRUD

## Constraints

- **Tech Stack:** Next.js 15 App Router, TypeScript, Prisma, PostgreSQL, NextAuth v4, Tailwind CSS — no changes
- **Deployment:** Docker standalone on Hetzner, Coolify-managed — no CI/CD changes in this milestone
- **DB:** Shared platform-postgres (qr_platform DB) — schema is deployed, use existing tables as-is
- **Prisma version:** Pin to v6.x for CLI operations (v7 breaks on `url = env()` syntax)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js 15 App Router standalone | SSR + static, Docker-compatible | ✓ Good |
| NextAuth v4 with credentials | Simple auth, no OAuth complexity for v1 | ✓ Good |
| Prisma ORM with PostgreSQL | Type-safe DB, migrations | ✓ Good |
| qr-code-styling for QR rendering | SVG output, rich styling API | ✓ Good |
| HOSTNAME=0.0.0.0 in docker-compose env | Fixes Next.js standalone binding in Docker | ✓ Good |
| Client-side QR generation, server save | No server re-render needed; just persist design params | — Pending |
| Type-specific Zod schemas in content-types.ts | Shared validation between client forms and API | — Pending |

## Current Milestone: v1.0 — Type Form + Save + Dashboard CRUD

**Goal:** Users can create a QR code of any supported type, save it to their account, manage it from a dashboard, and download it.

**Target features:**
- Type-specific content forms (url, phone, email, whatsapp, wifi, vcard, map)
- Save QR flow (POST /api/qr → creates QrCode + QrContent + QrDesign)
- Dashboard list with real data
- Edit, delete, duplicate actions
- Download PNG/SVG from dashboard

---
*Last updated: 2026-04-18 after Milestone v1.0 initialization*
