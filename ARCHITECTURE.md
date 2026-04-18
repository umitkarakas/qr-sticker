# QR Platform Architecture

## Product Boundary

This project is evolving from a single-screen QR sticker designer into a self-hosted QR platform.

Target product scope:

- ME-QR benzeri QR type catalog
- type-specific QR creation flows
- QR design and sticker/frame customization
- auth-protected dashboard for saved QR records
- self-hosted PostgreSQL-backed persistence
- future-ready dynamic QR redirect and analytics

This repository should no longer be treated as only a frontend demo tool.

## Core Principles

- single codebase for public generator, auth, and dashboard
- self-hosted deployment under existing Hetzner + Coolify conventions
- PostgreSQL as the primary data store
- no Supabase dependency for this product
- existing QR rendering core should be reused, not rewritten blindly
- deployment must remain traceable and standard-compliant

## Runtime Model

Recommended runtime:

- Next.js App Router application
- TypeScript
- Prisma ORM
- PostgreSQL database
- Tailwind CSS
- Auth.js / NextAuth for authentication

The app should run as a Node container behind OpenLiteSpeed/CyberPanel ingress.

## Hetzner / Coolify Platform Constraints

Observed production standard on the server:

- source checkout path: `/opt/apps/<app-name>`
- one app, one compose surface
- one app, one bound host port
- host bind policy: `127.0.0.1:<port>:<container-port>`
- public ingress terminates at CyberPanel/OpenLiteSpeed
- app metadata is tracked via:
  - `/opt/apps/<app-name>/manifest.json`
  - `/opt/apps/<app-name>/DEPLOY_SOURCE.json`
- app containers are orchestrated by Coolify but source of truth remains `/opt/apps/<app-name>`

## Existing Live Port Inventory

Verified on the server:

- `adaptika-crm` -> `127.0.0.1:3002 -> 3000`
- `4akc-link` -> `127.0.0.1:3003 -> 3000`
- `retoran-qr` -> `127.0.0.1:3004 -> 3000`
- `qr1-site` -> `127.0.0.1:3005 -> 80`
- `kebapci-menu` -> `127.0.0.1:3010 -> 3000`
- `platform-postgres` -> `127.0.0.1:5433 -> 5432`
- compatibility proxies:
  - `3111`
  - `3112`
  - `3113`

Implication:

- port sequence is mostly incremental
- `3006`, `3007`, `3008`, `3009` are currently free from the inspected app set
- safest next candidate for a new Node app is `3006`

## Existing qrbir.com Subdomain Pattern

Verified on the server:

- `01.qrbir.com` is proxied by OpenLiteSpeed to `127.0.0.1:3010`
- the extprocessor name is `kebapci_menu_proxy`
- this means `01.qrbir.com` currently serves the `kebapci-menu` app

- `001.qrbir.com` is proxied by OpenLiteSpeed to `127.0.0.1:3004`
- the extprocessor name is `retoran_qr_proxy`
- this means `001.qrbir.com` currently serves the `retoran-qr` app

Important drift:

- `/opt/apps/retoran-qr/manifest.json` says domain `01.qrbir.com`
- live OpenLiteSpeed config shows `001.qrbir.com -> 3004`

So the live routing source of truth is currently the vhost config, not the app manifest.

For new work, do not copy the metadata drift.
Copy the actual working pattern instead:

- one vhost per subdomain
- one extprocessor per app
- one proxy target per app bound to `127.0.0.1:<port>`
- SSL at the vhost level

## Recommended New App Identity

For the new QR platform instance behind `v1.qrbir.com`, recommended deployment identity is:

- app name: `qr-platform`
- public domain: `v1.qrbir.com`
- deploy path: `/opt/apps/qr-platform`
- bind: `127.0.0.1:3006`
- container port: `3000`
- runtime: `node:20-alpine`

Why:

- avoids collision with existing `retoran-qr`
- keeps naming aligned with the new broader product boundary
- follows the observed sequential port policy

If you want to preserve current brand naming instead, acceptable fallback names:

- `qrbir-platform`
- `retoran-qr-v2`

Do not reuse `retoran-qr` for the new broader app unless migration and cutover are explicitly planned.

## Data Layer

Primary data store:

- self-hosted PostgreSQL

Recommended initial contract:

- dedicated database for this app on the shared PostgreSQL host
- application connects through `DATABASE_URL`
- Prisma migrations are the source of schema truth

Non-goals:

- no Supabase client contract
- no PostgREST compatibility layer unless a concrete requirement appears later

## Storage Layer

For file-backed QR types such as PDF and image:

- V1: local persistent volume mounted into the app container
- V2-ready: MinIO or S3-compatible storage

Metadata about uploads should live in PostgreSQL.
Binary files should not be stored in PostgreSQL.

## Module Boundaries

## Public Surface

- marketing pages
- QR type catalog
- QR creation flow
- login/register

## Authenticated Surface

- dashboard
- saved QR list
- QR detail/edit pages
- account settings

## Shared Core

- QR type registry
- QR payload normalizers
- QR rendering engine
- design presets and sticker/frame composition
- export helpers

## Existing Code To Reuse

These modules are reusable assets from the current repository:

- `src/lib/core/qr-engine.ts`
- `src/lib/core/composition.ts`
- `src/lib/core/frame-composition.ts`
- `src/lib/core/export.ts`
- `src/lib/shapes/*`
- `src/lib/frames/*`

They should be migrated into a shared QR core module with clearer boundaries between:

- pure QR/render logic
- browser-only export logic
- app-specific UI state

## Data Model Direction

Recommended first-class tables:

- `users`
- `sessions`
- `qr_codes`
- `qr_contents`
- `qr_designs`
- `qr_assets`
- `qr_scans`

Use `jsonb` for type-specific payload/design flexibility, but keep ownership and lifecycle relational.

## Route Model

Public:

- `/`
- `/qr-code-generator`
- `/qr-code-generator/[type]`
- `/login`
- `/register`

Authenticated:

- `/dashboard`
- `/dashboard/qr`
- `/dashboard/qr/new`
- `/dashboard/qr/[id]`
- `/dashboard/settings`

Future:

- `/r/[slug]`

## Deployment Standard For This App

The new app must include:

- `/opt/apps/qr-platform/docker-compose.yml`
- `/opt/apps/qr-platform/Dockerfile`
- `/opt/apps/qr-platform/.env`
- `/opt/apps/qr-platform/manifest.json`
- `/opt/apps/qr-platform/DEPLOY_SOURCE.json`

Expected compose shape:

```yaml
name: qr-platform
services:
  qr-platform:
    build:
      context: .
      dockerfile: Dockerfile
    image: qr-platform:latest
    container_name: qr-platform
    restart: unless-stopped
    ports:
      - "127.0.0.1:3006:3000"
    env_file:
      - .env
    networks:
      - platform-db
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://127.0.0.1:3000/ > /dev/null && exit 0 || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 90s

networks:
  platform-db:
    external: true
```

Expected OpenLiteSpeed vhost pattern for `v1.qrbir.com`:

```text
docRoot                   /home/qrbir.com/public_html/v1.qrbir.com
vhDomain                  v1.qrbir.com
vhAliases                 www.v1.qrbir.com

extprocessor qr_platform_proxy {
  type                    proxy
  address                 http://127.0.0.1:3006
  maxConns                100
  pcKeepAliveTimeout      60
  initTimeout             60
  retryTimeout            0
  respBuffer              0
}

context / {
  type                    proxy
  handler                 qr_platform_proxy
  addDefaultCharset       off
}
```

## Compliance Status

Current platform findings:

- result type: `normalization-required`

Why not fully `standard-compliant`:

- metadata schemas vary across apps
- some apps miss complete deploy metadata
- naming is not fully consistent across `retoran-qr` vs `restoran-qr`

Still, the hosting pattern itself is consistent enough to use as the standard base for the new app.

## Immediate Next Steps

1. Freeze app identity:
   - `qr-platform`
   - port `3006`
2. Rebuild the app shell as Next.js full-stack
3. Preserve QR rendering core during migration
4. Prepare production files to match `/opt/apps/<app-name>` standard
5. Add infrastructure record after first live provisioning
