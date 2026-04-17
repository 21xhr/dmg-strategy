# Workspace Drift-Prone Code Audit

## Purpose

This note captures the current drift-prone code patterns in `dmg-workspace` that could create SaaS migration regressions or future team handoff friction.

It is source material for backlog shaping, not a current-state workspace document.

## Highest-risk drift areas

### Port and host defaults

- `apps/api/src/index.ts`
- `apps/web/scripts/dev-server.mjs`
- `scripts/dev-doctor.mjs`
- `apps/web/js/api.js`

Risk:

- port defaults and local host assumptions are duplicated across runtime, browser, and diagnostic code
- overrides can work in one layer and drift in another if a later change does not update the whole chain

### Bootstrap tenant and branding defaults

- `apps/api/src/config/gameConfig.ts`
- `apps/api/src/config/publicAppConfigDefaults.ts`
- `apps/api/src/services/tenantSettingsService.ts`
- `apps/web/js/app-config.js`

Risk:

- hardcoded fallback tenant and branding values can leak into new tenant setups when database-backed config is incomplete
- bootstrap defaults remain too close to live runtime behavior

### Frontend and backend runtime assumptions

- `apps/web/js/api.js`
- `apps/api/src/services/frontendRuntimeService.ts`
- `apps/api/src/index.ts`

Risk:

- local-host detection, port resolution, and CORS assumptions are distributed across frontend and backend code
- staging-like environments can still behave too much like development when only a production versus non-production split exists

### Scheduler always-on behavior

- `apps/api/src/scheduler.ts`
- `apps/api/src/index.ts`
- `apps/api/src/services/tenantSettingsService.ts`

Risk:

- automatic challenge lifecycle scheduling still behaves like one global server concern
- the current model needs an explicit SaaS decision about whether scheduling is always on, tenant-scoped, feature-gated, or operator-configurable

### Placeholder values accepted as runtime config

- `apps/api/.env.example`
- `apps/api/src/services/upstashService.ts`

Risk:

- example values and placeholder config can be mistaken for working setup
- runtime now detects placeholder Upstash values, but the broader config boundary still needs stricter validation rules

### Silent fallback chains

- `apps/api/src/middleware/tenantContextMiddleware.ts`
- `apps/web/js/api.js`
- `apps/web/js/app-config.js`

Risk:

- tenant or host resolution errors can be masked by silent fallbacks
- those fallbacks are useful during bootstrap but make later diagnosis harder

## Secondary drift areas

### Debug or operational flags living as defaults

- `apps/web/js/app-config.js`

### Docs or comments that can drift from actual config sources

- `apps/docs/system-architecture/challenge-lifecycle-system.md`
- `apps/docs/technical-implementation/backend-logic.md`
- `apps/docs/technical-implementation/api-endpoint-summary.md`

## Recommended follow-up order

1. consolidate runtime port and host defaults into one reusable configuration path
2. decide the SaaS scheduling model before more tenant-facing lifecycle work lands
3. reduce bootstrap tenant and branding fallbacks in live runtime code
4. tighten validation around placeholder or example config values
5. review silent tenant and host fallback chains to determine which should remain and which should become explicit errors or warnings