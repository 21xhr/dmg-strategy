# Render Production and Staging Setup Matrix

This matrix is the current implementation baseline for the API services on Render.

| Setup item | Production | Staging |
| --- | --- | --- |
| Render environment | Production | Staging |
| Service name | dmg-api | dmg-api-staging |
| Branch | main | main |
| Region | Frankfurt (EU Central) | Frankfurt (EU Central) |
| Root directory | repository root (blank in Render form) | repository root (blank in Render form) |
| Build command | corepack enable && pnpm install --frozen-lockfile && pnpm --filter dmg-api build | corepack enable && pnpm install --frozen-lockfile && pnpm --filter dmg-api build |
| Start command | pnpm --filter dmg-api start | pnpm --filter dmg-api start |
| Health check path | / | / |
| Auto deploy on commit | enabled | enabled |
| PR previews | off | off |
| Instance type | Free | Free |
| Custom domain | not configured | not configured |
| Render subdomain | https://dmg-api.onrender.com | https://dmg-api-staging.onrender.com |
| APP_ENV | production | staging |
| DATABASE_URL | Production runtime URL (session pooler connection string) | Staging runtime URL (session pooler connection string) |
| MIGRATION_DATABASE_URL | Production migration URL for GitHub Actions | Staging migration URL for GitHub Actions |
| CRON_SECRET (Render runtime) | configured | optional (only if staging maintenance caller is enabled) |
| SESSION_SCHEDULER_MODE | enabled | unset (resolves to disabled) |
| Migration workflow | .github/workflows/production-migrations.yml | .github/workflows/staging-migrations.yml |
| Migration workflow run branch | main | main |
| Daily maintenance workflow | .github/workflows/daily-maintenance.yml | .github/workflows/staging-daily-maintenance.yml |
| GitHub maintenance URL variable | Production: PRODUCTION_API_MAINTENANCE_URL | Staging: STAGING_API_MAINTENANCE_URL |
| GitHub maintenance secret | Production: PRODUCTION_CRON_SECRET | Staging: STAGING_CRON_SECRET |
| Current status | active | active |

## Short justification

- Render keeps the API in a conventional Node service shape.
- GitHub Actions is the migration surface to keep schema rollout controlled and separate from web-service startup.
- Staging keeps scheduler activity off by default to reduce background noise.
- GitHub Actions environments should set both `DATABASE_URL` and `MIGRATION_DATABASE_URL` for the matching tier, while Render keeps the runtime `DATABASE_URL` on the session pooler and the deploy/migration runner uses the migration URL.
- Render auto-deploys the API from `main` when code is pushed; a migration workflow run by itself only changes the database and does not trigger a new Render deploy.
