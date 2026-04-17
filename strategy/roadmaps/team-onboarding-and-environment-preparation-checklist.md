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