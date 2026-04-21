# QR Platform Plan

## Context

Current repository is a small browser-only QR sticker designer built with React, TypeScript, Vite, Tailwind, and `qr-code-styling`.

Target product is different:

- ME-QR benzeri cok tipli QR olusturma akisi
- type catalog + type-specific content forms
- design/customization step
- user auth + saved QRs + dashboard
- PostgreSQL-backed persistence on self-hosted infrastructure
- optional dynamic QR redirect and analytics

This means the project should evolve from a single-screen design tool into a full-stack QR platform.

## Product Goal

Build a self-hosted QR creation platform that supports:

- multiple QR content types
- reusable design templates and sticker/frame customization
- user accounts and saved QR codes
- downloadable PNG/SVG outputs
- future-ready dynamic QR redirect and scan analytics

## Non-Goals For V1

- billing and subscriptions
- teams and workspaces
- full ME-QR type parity
- advanced white-labeling
- multi-language support
- deep analytics segmentation

## Current State Summary

- Frontend only, no backend or database
- Single main screen focused on sticker styling
- Existing reusable value:
  - QR SVG generation
  - frame composition
  - shape composition
  - PNG/SVG export
- Missing platform pieces:
  - auth
  - persistence
  - uploads
  - dashboard
  - redirect layer
  - analytics

## Recommended Target Architecture

## Stack

- Frontend + server: Next.js App Router
- Language: TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Validation: Zod
- Auth: Auth.js / NextAuth with database-backed sessions
- Styling: Tailwind CSS
- Storage:
  - V1: local persistent volume for uploaded files
  - V2-ready: MinIO or S3-compatible storage
- Deployment: Docker Compose on self-hosted server

## Why This Stack

- public pages, generator flow, auth, dashboard, and uploads can live in one codebase
- server actions / route handlers reduce unnecessary API surface early
- PostgreSQL + Prisma gives predictable migrations and relational modeling
- existing TypeScript QR logic can be migrated into shared modules instead of rewritten

## Architectural Direction

Do not keep growing the current Vite SPA as the main app shell.

Use this approach instead:

1. preserve and migrate the QR generation core
2. rebuild the application shell as a full-stack web app
3. introduce a typed QR type registry shared by UI, validation, and persistence
4. add persistence and auth before expanding QR type count too far

## Target User Flows

## Public Flow

1. User lands on marketing or generator page
2. User chooses a QR type from a searchable catalog
3. User enters type-specific content
4. User customizes QR design
5. User downloads the QR or signs in to save it

## Authenticated Flow

1. User signs in
2. User creates or edits a QR
3. User saves it as draft or published
4. User revisits QR list in dashboard
5. User downloads, edits, duplicates, or deletes a QR

## Future Dynamic Flow

1. QR points to a short redirect URL
2. Platform resolves slug
3. Scan event is recorded
4. User is redirected to final destination

## Initial V1 Scope

Support these QR types first:

- URL / Link
- Text
- Phone
- Email
- WhatsApp
- Wi-Fi
- vCard
- Map
- PDF
- Image

Support these product features in V1:

- type catalog page
- type-specific content forms
- design/customization step
- QR preview
- PNG/SVG export
- auth
- save and edit QR codes
- dashboard list/detail pages

Postpone these to V2:

- audio
- video
- app store / play store
- multi-link landing pages
- social media landing types
- dynamic QR analytics beyond basic redirect logging

## Domain Model

Use a normalized relational model with `jsonb` where type-specific flexibility is needed.

## Core Tables

### users

- id
- email
- name
- password_hash or auth provider fields
- created_at
- updated_at

### sessions

- id
- user_id
- expires_at
- created_at

### qr_codes

- id
- user_id
- type
- title
- status
- is_dynamic
- slug
- created_at
- updated_at

### qr_contents

- id
- qr_code_id
- payload jsonb
- normalized_target text nullable
- created_at
- updated_at

### qr_designs

- id
- qr_code_id
- shape_id
- frame_id
- style jsonb
- created_at
- updated_at

### qr_assets

- id
- qr_code_id
- kind
- storage_path
- original_name
- mime_type
- size_bytes
- created_at

### qr_scans

- id
- qr_code_id
- scanned_at
- country nullable
- city nullable
- device_type nullable
- referrer nullable
- ip_hash nullable
- user_agent nullable

## Optional Later Tables

- password_resets
- audit_logs
- api_keys
- teams
- quotas

## Shared Type Registry

Introduce a central QR type registry. Each type definition should describe:

- key
- label
- icon
- route segment
- category
- form schema
- default content
- payload normalizer
- QR formatter
- whether upload is required
- whether dynamic redirect is supported

This registry should drive:

- generator catalog UI
- form rendering
- validation
- persistence shape
- dashboard labels

## Proposed App Structure

```text
src/
  app/
    (public)/
    (auth)/
    dashboard/
    qr-code-generator/
    api/
  components/
    ui/
    generator/
    dashboard/
  modules/
    qr-types/
    qr-generator/
    auth/
    assets/
    analytics/
  lib/
    db/
    auth/
    storage/
    validation/
    qr-core/
  prisma/
    schema.prisma
```

## Reusable Code From Current Repo

These areas are candidates for migration, not rewrite:

- `src/lib/core/qr-engine.ts`
- `src/lib/core/composition.ts`
- `src/lib/core/frame-composition.ts`
- `src/lib/core/export.ts`
- `src/lib/shapes/*`
- `src/lib/frames/*`

Expected work:

- separate browser-only code from shared pure logic
- define a stable input/output contract for preview and export
- move product-specific concerns out of the old Vite component tree

## Route Plan

## Public Routes

- `/`
- `/login`
- `/register`
- `/qr-code-generator`
- `/qr-code-generator/[type]`

## Authenticated Routes

- `/dashboard`
- `/dashboard/qr`
- `/dashboard/qr/new`
- `/dashboard/qr/[id]`
- `/dashboard/settings`

## Future Redirect Route

- `/r/[slug]`

## Delivery Phases

## Phase 0 - Architecture And Scope Lock

Goal:
Define the new system explicitly before implementation.

Tasks:

- write `ARCHITECTURE.md`
- confirm stack decision
- confirm auth strategy
- confirm storage strategy
- finalize V1 QR types
- define route map
- define table model

Exit criteria:

- architecture document approved
- V1 scope frozen
- no unresolved stack-level decisions

## Phase 1 - Foundation Setup

Goal:
Create the full-stack application shell.

Tasks:

- initialize Next.js app
- configure Tailwind
- configure Prisma
- connect PostgreSQL
- create base environment config
- create Docker Compose for app + postgres
- add lint, typecheck, test scripts

Exit criteria:

- app boots locally
- database connection works
- first migration runs successfully

## Phase 2 - Auth And Base Layout

Goal:
Introduce access control and reusable app shell.

Tasks:

- implement auth
- add login/register screens
- add protected dashboard layout
- add base navigation
- add session handling

Exit criteria:

- user can sign up, sign in, sign out
- dashboard route protection works

## Phase 3 - QR Type Catalog

Goal:
Build the ME-QR-like entry experience.

Tasks:

- create searchable QR type catalog page
- add category sections or grouped cards
- create QR type registry
- add type detail routes

Exit criteria:

- user can discover and enter each supported V1 type flow

## Phase 4 - Type-Specific Content Forms

Goal:
Implement the structured content input layer.

Tasks:

- build shared generator shell
- add form schema per type
- add field-level validation
- implement content normalization
- support uploads for PDF and image
- implement map form with link and coordinates inputs

Exit criteria:

- all V1 types can produce a valid QR payload

## Phase 5 - QR Design And Preview

Goal:
Migrate and integrate the existing QR render engine.

Tasks:

- move QR core into reusable module
- connect content payload to preview
- connect design settings to preview
- restore shapes and frames
- support PNG and SVG export

Exit criteria:

- user can preview and export every V1 type

## Phase 6 - Persistence And Dashboard CRUD

Goal:
Make QRs persistent and editable.

Tasks:

- create save draft flow
- list saved QRs
- open detail/edit page
- duplicate QR
- delete QR
- persist designs and content separately

Exit criteria:

- authenticated user can fully manage saved QR records

## Phase 7 - Dynamic QR Redirect Layer

Goal:
Prepare dynamic QR capability.

Tasks:

- implement slug generation
- implement `/r/[slug]`
- resolve destination from database
- log scan events
- handle inactive and deleted QR states

Exit criteria:

- dynamic QR redirect works end to end

## Phase 8 - Basic Analytics

Goal:
Show initial scan visibility in dashboard.

Tasks:

- aggregate scan totals
- add time-series summary
- add device/referrer/country summaries
- define retention and anonymization policy

Exit criteria:

- dashboard shows useful basic scan metrics

## Phase 9 - Hardening And Deployment

Goal:
Make the system production-ready on self-hosted infrastructure.

Tasks:

- production Docker setup
- nginx reverse proxy
- SSL termination
- file persistence configuration
- backup strategy for DB and uploads
- rate limiting
- health checks
- error monitoring

Exit criteria:

- production deployment is repeatable
- backups and restore path are documented

## First Execution Sprint

This is the recommended first implementation wave.

### Sprint Scope

- create `ARCHITECTURE.md`
- initialize new Next.js stack
- add Prisma + PostgreSQL
- add auth skeleton
- add QR type registry
- build catalog page
- implement first 5 types:
  - link
  - text
  - wifi
  - map
  - vcard
- migrate QR preview/export core

### Sprint Output

- working full-stack base app
- first real generator flow
- stable direction for remaining types

## Risks

## Product Risks

- trying to match full ME-QR scope too early will stall delivery
- adding too many QR types before shared abstractions are stable will create duplication

## Technical Risks

- keeping the current Vite shell and layering backend features onto it will create structural debt
- file-based QR types require storage design early
- analytics design can accidentally collect more personal data than needed

## Delivery Risks

- auth, uploads, and dynamic redirects all increase operational complexity
- self-hosted storage and backups must be designed before production launch

## Decisions Needed Before Build Starts

- Next.js monolith confirmed: yes/no
- ORM choice confirmed: Prisma recommended
- auth method:
  - credentials
  - magic link
  - oauth
- upload storage:
  - local volume
  - MinIO
  - S3-compatible remote
- dynamic QR in V1:
  - yes
  - no

## Recommendation

Recommended default decisions:

- Next.js monolith: yes
- Prisma: yes
- auth: credentials first
- storage: local persistent volume first
- dynamic QR in V1: no, but keep schema and route design ready

## Definition Of Done For V1

V1 is done when:

- users can sign in
- users can select from core QR types
- users can enter structured content for each V1 type
- users can preview and customize QR visuals
- users can download PNG and SVG
- users can save and edit their QR codes
- the app runs against self-hosted PostgreSQL
- deployment to self-hosted server is documented and repeatable
