# Operational Baseline

This note captures the current onboarding, environment, Render, and GitHub Actions setup for the workspace.

See also: [Render Production and Staging Setup Matrix](./roadmaps/render-production-staging-setup.md).

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
- GitHub environment variables and secrets are tier-scoped through the `Production` and `Staging` environments

## Current implementation

### Environment separation

- local development: `APP_ENV=development`, local-only database/secrets
- staging runtime: `APP_ENV=staging`, staging database/secrets only
- production runtime: `APP_ENV=production`, production database/secrets only
- production and staging never share database credentials, JWT secrets, or cron secrets

### Supabase baseline

- production data lives in `DMG Production`
- staging and preview data live in `DMG Staging`
- runtime URL and migration URL must always target the same tier
- GitHub-hosted migration runners use the environment session pooler URL in `MIGRATION_DATABASE_URL`
- GitHub Actions should use the session pooler URL for `DATABASE_URL` and `MIGRATION_DATABASE_URL`; the direct Supabase connection string is IPv6-only unless the dedicated IPv4 add-on is enabled, and GitHub-hosted runners do not reliably reach that path
- the red `unrestricted` badge in Supabase means the table is open at the database layer because Row Level Security is off
- the current database migration enables RLS on every public application table in the API schema; keep it off only for narrow bootstrap or service-owned tables that are intentionally accessed only through trusted backend paths
- enabling RLS does not replace backend authorization, but it makes the default posture explicit and keeps browser-facing or operator-facing tables from staying open by accident
- if Supabase offers to auto-enable RLS for new tables, accept that prompt; it keeps the future default aligned with the current posture

### Render API setup

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
- staging: `https://dmg-api-staging.onrender.com`

### Runtime variables

Production Render service:

- `APP_ENV=production`
- `DATABASE_URL=<production runtime session pooler URL>`
- `MIGRATION_DATABASE_URL=<production migration URL for GitHub Actions>`
- `JWT_SECRET=<production JWT secret>`
- `CRON_SECRET=<production cron secret>`
- `SESSION_SCHEDULER_MODE=enabled`

Staging Render service:

- `APP_ENV=staging`
- `DATABASE_URL=<staging runtime session pooler URL>`
- `MIGRATION_DATABASE_URL=<staging migration URL for GitHub Actions>`
- `JWT_SECRET=<staging JWT secret>`
- `CRON_SECRET=<staging cron secret>` when staging maintenance is enabled
- `SESSION_SCHEDULER_MODE` left unset by default (resolves to `disabled`)

Runtime URL rule:

- the runtime `DATABASE_URL` should use the environment session pooler URL
- the migration `MIGRATION_DATABASE_URL` should be a direct connection string reachable from GitHub-hosted runners and match the same environment tier
- GitHub Actions needs both `DATABASE_URL` and `MIGRATION_DATABASE_URL` set in each environment so validation and migration execution stay explicit

### Migration workflows

Production migrations:

- workflow: `.github/workflows/production-migrations.yml`
- GitHub environment: `Production`
- required secrets: `DATABASE_URL`, `MIGRATION_DATABASE_URL`
- run target branch: `main`
- GitHub Actions runs the workflow with `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` to opt the JavaScript actions into Node 24 before the runner default changes

Staging migrations:

- workflow: `.github/workflows/staging-migrations.yml`
- GitHub environment: `Staging`
- required secrets: `DATABASE_URL`, `MIGRATION_DATABASE_URL`
- run target branch: `main`
- GitHub Actions runs the workflow with `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` to opt the JavaScript actions into Node 24 before the runner default changes

### Daily maintenance workflows

Production maintenance:

- workflow: `.github/workflows/daily-maintenance.yml`
- GitHub environment: `Production`
- required variable: `PRODUCTION_API_MAINTENANCE_URL`
- required secret: `PRODUCTION_CRON_SECRET`
- runtime expectation: production Render `CRON_SECRET` uses the same value as GitHub `Production` `PRODUCTION_CRON_SECRET`

Staging maintenance:

- workflow: `.github/workflows/staging-daily-maintenance.yml`
- GitHub environment: `Staging`
- required variable: `STAGING_API_MAINTENANCE_URL`
- required secret: `STAGING_CRON_SECRET`
- runtime expectation: staging Render `CRON_SECRET` uses the same value as GitHub `Staging` `STAGING_CRON_SECRET` when staging maintenance is enabled

### Secret baseline

- use long random secrets (64-character strings currently used)
- keep environment-identifiable naming for operator clarity
- never reuse exact secret values across environments
- keep rotation ownership explicit per environment

## Current operational notes

- staging Render already has `CRON_SECRET` set to the same value as GitHub `Staging` `STAGING_CRON_SECRET`
- scheduled daily maintenance gives a standing smoke test for the staging maintenance path
- manual-only staging maintenance is simpler and quieter if automatic exercises are not needed
- keep live secret values in Render, GitHub environment scopes, and the KeePassXC `.kdbx` secret store; keep markdown limited to names and relationships

## Recommendations

- keep migrations in GitHub Actions and out of Render startup commands
- keep GitHub-hosted jobs on the session pooler rather than the direct database string so the workflow does not depend on IPv6 reachability or a paid IPv4 add-on
- keep staging scheduler off by default unless a specific validation scenario requires it; for a local test run, set `SESSION_SCHEDULER_MODE=enabled` explicitly in `apps/api/.env` or the shell before starting the API
- keep production and staging maintenance flows separate; that is already the current implementation
- continue environment-scoped secret naming in GitHub (`PRODUCTION_*`, `STAGING_*`) for readability and auditability
- keep `DATABASE_URL` and `MIGRATION_DATABASE_URL` unprefixed because the code reads those exact names; use GitHub environment scope to separate Production from Staging

## Short implementation justification

This setup keeps deployment simple (Render), schema rollout controlled (GitHub Actions), and environment boundaries explicit (separate Supabase, Render, and secret scopes) while staying low-ops for the current phase.

## Rollback and incident handling

- production rollback: revert the code change, rerun production migrations only if schema changes were applied, and redeploy the Render production service
- staging rollback: revert the code change, rerun staging migrations only if schema changes were applied, and redeploy the Render staging service
- production incident owner: the current repository maintainer or release operator who ran the production workflow
- staging incident owner: the current repository maintainer or staging operator who ran the staging workflow
