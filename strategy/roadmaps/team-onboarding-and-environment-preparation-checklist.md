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

## Current reference - environment matrix

This section is the current operating reference for environment separation.

Local development:

- local API runtime uses `apps/api/.env` on each developer machine
- local runtime uses `APP_ENV=development`
- local runtime should use a development-only database and development-only secrets
- local runtime may omit Upstash credentials when rate limiting is not needed during development

Staging or non-production shared environment:

- shared non-production runtime uses `APP_ENV=staging`
- staging uses a non-production database that is separate from production
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