# Team Onboarding And Environment Preparation Checklist

## Purpose

This checklist tracks the operational preparation required before a broader team starts working in the current workspace.

It is a checklist rather than a roadmap because the work is mostly environment readiness, access control, and operating-rule setup rather than one sequential implementation track.

See the [roadmap index](../roadmap.md) for the active roadmap and checklist list.

## Status snapshot

Current state:

- the workspace now has clearer local startup commands, env examples, and basic runtime diagnostics
- the remaining gaps are team-facing access, secrets distribution, environment separation, and revocation procedures
- these items should be closed before the repository stops being treated as a transitional builder-managed workspace

Completion signal:

- a new contributor can receive the correct development access, populate local environment variables safely, start the workspace, and understand which credentials and services belong to development, staging, and production without relying on private chat context

Onboarding delivery note:

- this checklist should lead to one clean developer onboarding guide in the workspace repo once the setup is stable enough to describe as current operating procedure
- that guide should optimize for quick local setup, clear pointers, and low-friction first use rather than repeating every operational rationale inline

## Current reference - environment matrix

This section is the current operating reference for environment separation.

Local development:

- local API runtime uses `apps/api/.env` on each developer machine
- local runtime uses `APP_ENV=development`
- local runtime should use a development-only database and development-only secrets
- local development should default to a developer-managed local Postgres instance rather than the shared non-production Supabase project
- local runtime may omit Upstash credentials when rate limiting is not needed during development

Staging or non-production shared environment:

- shared non-production runtime uses `APP_ENV=staging`
- staging uses a non-production database that is separate from production
- staging should stay logically separate from developer-local databases even if both remain non-production
- the current `DMG Non-Prod` Supabase project is the shared staging and preview database baseline
- staging uses distinct `JWT_SECRET`, admin secrets, and infrastructure credentials
- staging should not reuse production database credentials or production bearer secrets

Production:

- production uses `APP_ENV=production`
- production uses the production database and production-only secrets
- production rollout should come from managed secrets in the deployment platform or CI
- production should not share database, JWT, or infrastructure credentials with development or staging

## Current reference - Supabase baseline

This section captures the current recommended baseline for the DMG transition from solo operation to a team-managed setup.

Current account shape:

- one separate Supabase organization now exists for production: `DMG Prod`
- one separate Supabase organization now exists for non-production: `DMG Non-Prod`
- one project exists inside each organization, currently using the organization name as the project name
- the older project in the previous `21xhr` organization has been paused

Current assessment:

- this split is directionally good because it separates production and non-production access earlier than the previous single-org posture
- it is acceptable to retire the old paused project if its data is disposable and the active runtime will be repointed to the new production and non-production projects
- before deleting the old project, confirm no runtime still points at its connection string and no manual reference data needs to be copied out

Recommended layout:

- create one Supabase project for production, such as `DMG Prod`
- create one separate Supabase project for non-production, such as `DMG Non-Prod`
- keep production and non-production in separate projects even if broader environment automation does not exist yet

Settings reference:

| Setting | What it controls | Current recommendation | Notes |
| --- | --- | --- | --- |
| Data API | Supabase HTTP access to project resources | Leave enabled | The current backend-owned architecture does not depend on exposing tables directly to browsers, but this setting is not harmful by itself. |
| Automatically expose new tables and functions | Whether new resources are surfaced through the Data API automatically | Acceptable to leave enabled for now | Revisit later if stricter platform-surface control becomes important. |
| Automatic RLS for new tables | Whether new tables start with Row Level Security enabled | Leave disabled by default | The current product relies on the DMG backend as the main access boundary rather than direct browser-to-Supabase access. |
| Enforce SSL on incoming connections | Rejects non-TLS database connections | Enable for both production and non-production | This is the explicit toggle behind the "SSL should be enforced" recommendation. |
| Connection pooling | Provides pooled runtime database connections | Use for hosted application runtime connections | Best fit for deployed API processes that may open many short-lived connections. |
| Direct connection string | Non-pooled database connection | Use for Prisma migrations, schema changes, and most local development | This is the safer default for Prisma migrate and other schema-changing workflows. |
| Network restrictions | IP-based access control for database connections | Leave off unless the hosting model supports stable egress controls | This is usually not the first move for low-cost early hosting setups. |
| Replication destinations | Cross-region or downstream replication targets | Do not configure yet | Not needed in the current operating model. |

Current settings baseline:

- Data API can remain enabled; the current backend-owned model does not depend on exposing tables directly to browsers
- automatically exposing new tables and functions can remain enabled for now, though it is not the main access boundary for the current product
- automatic RLS enablement for new tables should stay off by default in the current backend-owned architecture
- SSL should be enforced for incoming non-local connections
- connection pooling is appropriate for runtime application connections; direct migration access should stay available for Prisma migration workflows
- replication destinations are not required in the current operating model
- network restrictions should only be enabled when the deployment platform provides a stable and supportable egress model

Connection-string operating rule:

- local development should use the direct non-production connection string unless a later local-ops reason makes pooling necessary
- the deployed API runtime should use the pooled non-production or production connection string for its own environment
- Prisma migration workflows should use the direct connection string for the matching environment
- do not point local development at production merely because only one direct connection string is easy to copy

Matching-environment note:

- direct non-production means the direct connection string for the non-production Supabase project
- direct production means the direct connection string for the production Supabase project
- the runtime and migration URLs should always point at the same environment tier even when one is pooled and the other is direct

Prisma migration resolution note:

- Prisma does not invent a database target on its own; it reads the datasource URL from the workspace environment configuration
- in the current workspace repo, `apps/api/prisma.config.ts` resolves `MIGRATION_DATABASE_URL` first and then falls back to `DATABASE_URL`
- local developer runs can rely on `apps/api/.env` when that file is present on the developer machine
- shared staging and production rollout should come from managed secrets in CI or the deployment platform rather than from an untracked env file copied around the team
- this means a team can keep runtime `DATABASE_URL` pooled while keeping `MIGRATION_DATABASE_URL` direct for the same staging or production database
- production database credentials should stay in the deployment platform or CI secret manager and should not be part of ordinary developer secret distribution

Access model note:

- the current production and non-production org split is a reasonable response to the free-plan project-limit and visibility constraints already encountered
- if later paid-plan features or team-role controls make a single-org structure safe and simpler, revisit the split only when the operational upside is clear

Certificate note:

- enabling SSL enforcement does not mean every ordinary runtime has to manage a downloaded certificate file manually
- use the provider's SSL-enabled connection strings as the default starting point
- only introduce manual certificate distribution when a client library or hosting environment genuinely requires certificate pinning beyond the normal connection-string posture

## Current reference - hosting model baseline

This section captures the current recommended deployment posture for a credible early-stage but portable setup.

Recommended split:

- deploy the browser-facing web runtime on Vercel
- deploy the API on a plain Node-friendly host rather than reshaping the current Express server into a Vercel-native serverless surface
- keep Supabase as the managed Postgres provider rather than coupling runtime hosting and database hosting into one vendor decision

Current recommendation:

- treat a portable deployment model as the primary operating principle
- prefer hosting choices that keep the API close to an ordinary Node process or container so later migration to another provider is operationally straightforward
- avoid making the current API architecture look more serverless-native than it really is just to fit a free-tier platform constraint

Provider baseline:

- Vercel remains the preferred web host because static and frontend deployment workflows are clear and team-friendly there
- Render is the current recommended API host because it fits a boring Node-service deployment story more naturally than forcing the existing API into serverless shape
- a later move to another Node or container host should remain feasible because the API should stay deployable as a conventional service

Web-host note:

- Render can also host the web bundle, but the current web runtime benefits more from Vercel's static deployment, preview, and routing ergonomics than from provider unification for its own sake
- this remains credible for a SaaS path because the current browser runtime is a static multi-page frontend, not a compute-heavy frontend that needs to share a runtime model with the API
- if the web runtime later grows into a different rendering or compute posture, the hosting choice can be revisited separately from the API host

Serverless note:

- Vercel-native serverless is not inherently better than a conventional Node service
- it is better only when the API boundary, execution model, cold-start tolerance, and operational budget actually match serverless assumptions
- the current Express API is a better fit for a conventional service host, so reshaping it into serverless form now would be platform-fitting work rather than product-leverage work

Practical note:

- a fully free early setup is possible for experimentation, but a stable production-grade API host should be treated as a budgeted infrastructure dependency rather than a forever-free assumption

Why this model is credible:

- it keeps the browser-facing deployment simple
- it keeps the API aligned with its real runtime architecture
- it avoids unnecessary provider-specific rewrites before product and team shape justify them
- it preserves optionality for later infrastructure migration

## Current reference - Vercel environment matrix

Web runtime:

- production web deployment needs an explicit production API base URL
- preview web deployment needs an explicit non-production API base URL
- local web development can use local origin or explicit local `API_BASE_URL` override

API runtime:

- production API deployment needs production `APP_ENV`, database, JWT, admin, and infrastructure secrets
- preview or staging API deployment needs non-production `APP_ENV`, database, JWT, admin, and infrastructure secrets
- preview and staging should not point at the production database

## Current reference - Render API setup checklist

This section is the current one-time setup checklist for the Render-hosted API service.

Service shape:

- create one Render web service for `apps/api`
- use the repository root as the service root
- keep the API as the only long-running backend service in this first deployment shape

Build and start commands:

- build command field in Render: `corepack enable && pnpm install --frozen-lockfile && pnpm --filter dmg-api build`
- start command: `pnpm --filter dmg-api start`
- health check path: `/`

Runtime fit note:

- the current API shape assumes one stable backend service that owns the autonomous scheduler and other backend-managed runtime behavior

Production environment variables:

- `APP_ENV=production`
- `DATABASE_URL=<production pooled Postgres URL>`
- `MIGRATION_DATABASE_URL=<production direct Postgres URL>`
- `JWT_SECRET=<production JWT secret>`
- `CRON_SECRET=<production cron secret>`
- `SESSION_SCHEDULER_MODE=enabled`
- `UPSTASH_REDIS_REST_URL=<production Upstash URL>` only when non-local rate limiting is enabled
- `UPSTASH_REDIS_REST_TOKEN=<production Upstash token>` only when non-local rate limiting is enabled

Field mapping note:

- Render uses one build-command field, so dependency install and app build should be combined in that single command
- `UPSTASH_REDIS_REST_TOKEN` is only needed when the non-local environment should enforce Redis-backed rate limiting

Current setup attempt: 2026-04-22

- source repository: `dmg-workspace`
- service name entered: `dmg-api`
- naming note: `dmg-api` is acceptable for a first production service; if a second long-lived non-production service is added later, use a clearer pair such as `dmg-api-prod` and `dmg-api-staging`
- language: Node
- branch: `main`
- region: Frankfurt (`EU Central`)
- root directory left blank so Render runs from the repository root, matching the current monorepo guidance
- auto-deploy on commit: enabled
- PR previews: off
- custom domain: not configured yet
- render subdomain expectation: `https://dmg-api.onrender.com`
- production API base URL once live: `https://dmg-api.onrender.com/api/v1`
- health check path: `/`
- selected instance type: Free

Free-tier note:

- the free instance is acceptable for smoke testing and first setup validation
- it is not a stable production-grade target because it spins down on inactivity and does not provide SSH access, one-off jobs, or other operational features needed for smoother production maintenance
- if the service remains on the free tier, production migrations cannot rely on a Render shell or Render pre-deploy command because those execution surfaces are not available on that plan; use CI or another controlled execution surface instead

Current blocker:

- the Git LFS clone failures were repaired by pushing the missing remote LFS objects
- the current deploy now reaches runtime startup
- the current runtime failure moved from schema mismatch to deploy-step timing: running migrations inside the web-service start command delays port binding
- the immediate repair path on the free plan is to run `db:migrate:deploy` from a separate controlled execution surface before redeploying the web service
- the current Supabase `DMG Prod` database has been checked directly and is currently empty

Operational rule:

- production database secrets and JWT secrets should be entered in Render managed environment variables and should not be part of ordinary developer secret distribution
- migration execution should happen from a Render shell, a Render one-off job, or CI with the same managed production secret set; do not make developer laptops the default production migration surface
- for the current Render free-plan posture, GitHub Actions is a justified production migration surface because it is controlled, auditable, repeatable, and separate from developer laptops

Daily maintenance:

- configure one scheduled caller for `POST /api/v1/clock/run-daily-maintenance`
- set `CRON_SECRET` in the production Render service first; this is the secret the API expects in the `x-cron-secret` header
- set `PRODUCTION_API_MAINTENANCE_URL` in the GitHub `Production` environment for the workspace repository; the preferred home is an environment variable because the full endpoint URL is not sensitive
- set `PRODUCTION_CRON_SECRET` as a GitHub Actions secret in the workspace repository; use the same value as the production Render `CRON_SECRET`
- use the repository workflow `.github/workflows/daily-maintenance.yml` as the scheduled caller
- send `x-cron-secret: <CRON_SECRET>` on that request
- keep only one scheduler path active for daily maintenance

Concrete setup sequence:

1. generate one production cron secret, for example with `openssl rand -hex 32`
2. add that value to the production Render service as `CRON_SECRET`
3. open the GitHub repository settings for `21xhr/dmg-workspace`
4. go to `Settings -> Environments -> Production`
5. create the environment variable `PRODUCTION_API_MAINTENANCE_URL=https://dmg-api.onrender.com/api/v1/clock/run-daily-maintenance`
6. create the environment secret `PRODUCTION_CRON_SECRET=<same value as Render CRON_SECRET>`
7. keep `.github/workflows/daily-maintenance.yml` on the default branch and keep GitHub Actions allowed for the repository; there is no separate per-file enable switch for this workflow
8. do not configure a second scheduler in Render, Vercel, or another service for the same endpoint

Naming note:

- Render keeps the runtime variable name `CRON_SECRET` because that is the name the API process reads from its own environment
- GitHub Actions uses `PRODUCTION_CRON_SECRET` so the workflow can later grow a staging sibling without ambiguous secret names
- `PRODUCTION_API_MAINTENANCE_URL` is better modeled as a GitHub environment variable than as a secret because the endpoint URL is not sensitive

Production migration surface:

- use `.github/workflows/production-migrations.yml` as the manual GitHub Actions workflow for production schema rollout
- store `DATABASE_URL` and `MIGRATION_DATABASE_URL` as GitHub `Production` environment secrets
- `DATABASE_URL` should match the production runtime pooled Postgres URL used by the API service
- `MIGRATION_DATABASE_URL` should match the production session pooler URL when the migration runner is a GitHub-hosted workflow runner; the direct Supabase URL is IPv6-only and is not the correct default for that runner class
- the workflow itself sets `APP_ENV=production` and runs `pnpm --filter dmg-api run db:migrate:deploy`; no extra GitHub variable is required for `APP_ENV`
- to use it: open `Actions` in the GitHub repository, choose `Production Migrations`, click `Run workflow`, and confirm the run on `main`
- once that job succeeds, redeploy or restart the Render web service so the API boots against the migrated schema

Staging migration surface:

- create a separate Render service named `dmg-api-staging` inside the `dmg-api-staging` Render environment when staging is needed
- use `.github/workflows/staging-migrations.yml` as the manual GitHub Actions workflow for staging schema rollout
- store `DATABASE_URL` and `MIGRATION_DATABASE_URL` as GitHub `Staging` environment secrets
- `DATABASE_URL` should match the staging runtime pooled Postgres URL used by the staging API service
- `MIGRATION_DATABASE_URL` should match the staging session pooler URL when the migration runner is a GitHub-hosted workflow runner
- the workflow itself sets `APP_ENV=staging` and runs `pnpm --filter dmg-api run db:migrate:deploy`; no extra GitHub variable is required for `APP_ENV`
- to use it: open `Actions` in the GitHub repository, choose `Staging Migrations`, click `Run workflow`, and confirm the run on the branch that should drive staging
- once that job succeeds, redeploy or restart the staging Render web service so the API boots against the migrated schema

## Current reference - Vercel web setup checklist

This section is the current one-time setup checklist for the Vercel-hosted browser runtime.

Project shape:

- import the workspace repository into Vercel
- set the project root directory to `apps/web`
- use the `Other` framework preset

Build settings:

- install command: leave blank when Vercel auto-detects the workspace install, otherwise `corepack enable && pnpm install --frozen-lockfile`
- build command: `pnpm run build:static`
- output directory: `dist`

Project settings note:

- confirm the root directory is `apps/web`
- confirm `vercel.json` rewrites are included from that project root
- use the shared non-production API host for Preview and the production API host for Production

Environment variables:

- Preview `API_BASE_URL=<shared non-production API base URL>/api/v1`
- Production `API_BASE_URL=<production API base URL>/api/v1`

Operational rule:

- preview and production web deployments should target different API base URLs
- the Vercel web project does not need database secrets or `JWT_SECRET`
- the current setup implies one deployed non-production API service for preview and staging traffic and one deployed production API service for production traffic

## Current reference - deployment fill-in sheet

Use this section to record the concrete values once the provider projects and domains exist.

Supabase baseline:

- production org and project: `DMG Prod`
- shared non-production org and project: `DMG Non-Prod`

Render API runtime:

- production service name: `dmg-api`
- shared non-production service name: `<fill-render-non-production-service-name>`
- production host: `https://dmg-api.onrender.com`
- shared non-production host: `https://<fill-render-non-production-host>`
- production API base URL: `https://dmg-api.onrender.com/api/v1`
- shared non-production API base URL: `https://<fill-render-non-production-host>/api/v1`
- production maintenance URL: `https://dmg-api.onrender.com/api/v1/clock/run-daily-maintenance`

Vercel web runtime:

- project name: `dmg-workspace-web`
- preview `API_BASE_URL`: `https://dmg-api.onrender.com/api/v1` until a separate non-production API service exists
- production `API_BASE_URL`: `https://dmg-api.onrender.com/api/v1`

Environment groups note:

- Render environment groups can be useful later for shared non-production variables across more than one staging-like service
- they are not required for the first production API service

Operational ownership:

- production migrations run from: `<fill-render-shell-or-ci-surface>`
- production cron caller runs from: `<fill-provider-or-job-surface>`

## 1. Database and access

- [ ] ensure a dedicated development database exists in Supabase and is not the production database
- [ ] decide whether a staging database is required and how it will be created: from scratch, semi-automatic clone, or anonymized production-derived dump
- [ ] create a dedicated development database user with least-privilege access for the team instead of sharing high-privilege credentials
- [ ] invite team members to Supabase with the correct project role and verify the access actually matches the intended operating model
- [ ] review whether Supabase project access is too coarse for the intended team shape and document the fallback plan if SQL or policy-level controls are required
- [ ] document the credential rotation and revocation procedure

## 2. Environment variables and secrets management

- [ ] keep `.env.example` current for local development without adding real secrets
- [ ] define which variables are required for development, staging, and production
- [ ] require distinct `JWT_SECRET` values for development, staging, and production rather than reusing one secret across environments
- [ ] decide the secrets distribution model across local work, CI, and deployment surfaces
- [ ] decide whether the current manual `.env` distribution posture is sufficient or whether a secrets tool such as Infisical or Doppler is justified
- [ ] decide whether any team-shared staging env file is only a short transitional bootstrap or an accepted operating model, and replace it once broader onboarding or CI access makes that posture too loose
- [ ] document who owns secret rotation when a credential leak or offboarding event happens

## 3. Environment separation

- [ ] make the rule explicit that development and staging must never use production database credentials
- [ ] require anonymized or synthetic data for staging if it is derived from production
- [ ] separate third-party credentials by environment where possible, including Upstash, object storage, and deployment surfaces
- [ ] decide which shared services can remain builder-managed during transition and which must be split before team onboarding

## 4. Workspace and delivery workflow

- [ ] document the local startup flow and expected runtime surfaces clearly enough for a new contributor to follow without private context
- [ ] document the expected local ports and URLs for the API, web runtime, and any operator-facing surfaces
- [ ] document CI and deployment dependencies, including which secrets are required and which environments consume them
- [ ] document the current staging and production deployment triggers and who is allowed to run them

## 5. Policy and tooling

- [ ] keep the no-`.env`-in-repo rule explicit
- [ ] document the incident response path for credential leaks
- [ ] document how agent-run local servers, URLs, and browser sessions should be handled to avoid workflow collisions during AI-assisted work
- [ ] decide whether additional enforcement is needed for environment separation before a broader team starts committing regularly

## Notes to preserve

- Supabase project access is primarily project-scoped and does not by itself provide fine-grained schema or table permissions without additional SQL or policy work
- if staging is created from production-derived data, masking and data minimization should be treated as a prerequisite rather than a cleanup step
- a team-shared staging env file can be a temporary transition tool while the team is still tiny, but it should not become the long-term substitute for per-environment secret ownership and rotation
- `JWT_SECRET` should be treated as an environment-specific secret with separate values and rotation paths for development, staging, and production
- the current workspace is closer to a hardened solo-to-team transition baseline than to a finished team onboarding system

## References

- Supabase Auth and Access: `https://supabase.com/docs/guides/auth`
- Doppler pricing: `https://www.doppler.com/pricing`
- Infisical pricing: `https://infisical.com/pricing`