# Team Onboarding and Environment Preparation Checklist

## Purpose

Current implementation reference for development, staging, and production setup. This document is concise by design and focuses on what is live, what must be maintained, and what is next.

See also: [Render Production and Staging Setup](./render-production-staging-setup.md).

## Current state snapshot

- Supabase is split into two environment tiers:
  - `DMG Production` organization and project
  - `DMG Staging` organization and project
- API services are deployed on Render:
  - production service `dmg-api`
  - staging service `dmg-api-staging`
- both Render services deploy from branch `main`
- Prisma migrations are manual GitHub Actions workflows on branch `main`
- production daily maintenance is active through GitHub Actions
- staging daily maintenance workflow exists and uses staging-scoped URL and cron secret

## Current implementation

### 1. Environment separation

- local development: `APP_ENV=development`, local-only database/secrets
- staging runtime: `APP_ENV=staging`, staging database/secrets only
- production runtime: `APP_ENV=production`, production database/secrets only
- production and staging never share database credentials, JWT secrets, or cron secrets

### 2. Supabase baseline

- production data lives in `DMG Production`
- staging and preview data live in `DMG Staging`
- runtime URL and migration URL must always target the same tier
- GitHub-hosted migration runners use the environment session pooler URL in `MIGRATION_DATABASE_URL`

### 3. Render API setup

For both production and staging services:

- language: Node
- branch: `main`
- region: Frankfurt (`EU Central`)
- root directory: blank (repository root)
- build command: `corepack enable && pnpm install --frozen-lockfile && pnpm --filter dmg-api build`
- start command: `pnpm --filter dmg-api start`
- health check path: `/`
- auto-deploy on commit: enabled
- PR previews: off
- instance type: Free
- custom domain: not configured

Render subdomains:

- production: `https://dmg-api.onrender.com`
- staging: Render default service subdomain for `dmg-api-staging`

### 4. Runtime variables

Production Render service:

- `APP_ENV=production`
- `DATABASE_URL=<production runtime URL>`
- `MIGRATION_DATABASE_URL=<production migration URL>`
- `JWT_SECRET=<production JWT secret>`
- `CRON_SECRET=<production cron secret>`
- `SESSION_SCHEDULER_MODE=enabled`

Staging Render service:

- `APP_ENV=staging`
- `DATABASE_URL=<staging runtime URL>`
- `MIGRATION_DATABASE_URL=<staging migration URL>`
- `JWT_SECRET=<staging JWT secret>`
- `CRON_SECRET=<staging cron secret>` only when staging maintenance is enabled
- `SESSION_SCHEDULER_MODE` left unset by default (resolves to `disabled`)

### 5. Migration workflows

Production migrations:

- workflow: `.github/workflows/production-migrations.yml`
- GitHub environment: `Production`
- required secrets: `DATABASE_URL`, `MIGRATION_DATABASE_URL`
- run target branch: `main`

Staging migrations:

- workflow: `.github/workflows/staging-migrations.yml`
- GitHub environment: `Staging`
- required secrets: `DATABASE_URL`, `MIGRATION_DATABASE_URL`
- run target branch: `main`

### 6. Daily maintenance workflows

Production maintenance:

- workflow: `.github/workflows/daily-maintenance.yml`
- GitHub environment: `Production`
- required variable: `PRODUCTION_API_MAINTENANCE_URL`
- required secret: `PRODUCTION_CRON_SECRET`
- runtime expectation: production Render `CRON_SECRET` uses same value

Staging maintenance:

- workflow: `.github/workflows/staging-daily-maintenance.yml`
- GitHub environment: `Staging`
- required variable: `STAGING_API_MAINTENANCE_URL`
- required secret: `STAGING_CRON_SECRET`
- runtime expectation: staging Render `CRON_SECRET` uses same value when staging maintenance is enabled

### 7. Secret baseline

- use long random secrets (64-character strings currently used)
- keep environment-identifiable naming for operator clarity
- never reuse exact secret values across environments
- keep rotation ownership explicit per environment

## What is next

- confirm staging `CRON_SECRET` is configured in Render if staging maintenance schedule should stay active
- decide whether staging maintenance should remain scheduled daily or be manual-only
- add rollback and incident owner mapping for production and staging operations
- keep one source of truth for live values in environment managers, not in markdown

## Recommendations

- keep migrations in GitHub Actions, not in Render startup commands
- keep staging scheduler off by default unless a specific validation scenario requires it
- keep production and staging maintenance flows separate to reduce accidental cross-environment calls
- continue environment-scoped secret naming in GitHub (`PRODUCTION_*`, `STAGING_*`) for readability and auditability

## Short implementation justification

This setup keeps deployment simple (Render), schema rollout controlled (GitHub Actions), and environment boundaries explicit (separate Supabase and secret scopes) while staying low-ops for the current phase.
