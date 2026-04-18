# Deploy Notes

## Target

- app: `qr-platform`
- domain: `v1.qrbir.com`
- deploy path: `/opt/apps/qr-platform`
- bind: `127.0.0.1:3006`
- ingress: OpenLiteSpeed vhost proxy

## Required Runtime Files

- `Dockerfile`
- `docker-compose.yml`
- `.env`
- `manifest.json`
- `DEPLOY_SOURCE.json`

## Required Environment Variables

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NODE_ENV=production`

## First Provisioning Steps

1. Copy repo to `/opt/apps/qr-platform`
2. Create production `.env`
3. Ensure database `qr_platform` exists on `platform-postgres`
4. Run `docker compose build`
5. Run `docker compose up -d`
6. Run `docker compose exec qr-platform npx prisma migrate deploy`
7. Add OLS vhost for `v1.qrbir.com` -> `127.0.0.1:3006`
8. Update infrastructure records
