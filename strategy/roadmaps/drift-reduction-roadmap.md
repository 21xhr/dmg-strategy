# Drift Reduction Roadmap

## Purpose

This roadmap keeps drift-prone runtime assumptions visible while the active SaaS-readiness work continues.

It exists because the current codebase still contains duplicated defaults, bootstrap-era fallbacks, and environment assumptions that are easy to preserve accidentally during otherwise correct feature work.

See the [roadmap index](../roadmap.md) for the active roadmap list.

## Status snapshot

Current state:

- the main drift-prone clusters are identified
- some early hardening is already in place, including better local runtime startup checks, placeholder Upstash detection, and cleaner frontend-to-API local host alignment
- the remaining work is now a consolidation and boundary-clarification track rather than one large migration event

Why this remains active:

- active roadmap work can still reintroduce duplicated runtime defaults or preserve bootstrap fallbacks unless this cleanup stays explicit
- several of the remaining risks cut across config, frontend runtime, admin access, and scheduler behavior rather than belonging to one feature slice

## Completion criteria

Archive this roadmap only when these signals are true:

- runtime port and host defaults have one authoritative configuration path rather than being restated across browser, server, and diagnostic code
- bootstrap tenant and branding fallbacks no longer behave like durable live-runtime defaults
- environment branching is explicit enough that local, staging, and production behavior do not depend on a binary production-versus-non-production split
- scheduler behavior has an explicit operating model instead of remaining an ambient always-on server assumption
- placeholder and example config values are either rejected or clearly quarantined from live runtime behavior
- the most important silent tenant and host fallback paths are either removed, logged, or made deliberately explicit

## Roadmap scope

This roadmap covers drift-prone code patterns that can create future regressions even when the immediate feature work is correct.

Primary scope:

- duplicated runtime defaults
- bootstrap tenant and branding fallbacks
- frontend and backend environment assumption drift
- scheduler operating-model ambiguity
- placeholder configuration acceptance
- silent fallback chains that hide routing or tenant-resolution errors

Out of scope:

- the full config-to-database migration sequence already tracked elsewhere
- economy-ledger redesign
- provider abstraction beyond the drift risks that come from current runtime assumptions

## Current risk clusters

### Port and host defaults

Current hotspots:

- `apps/api/src/index.ts`
- `apps/web/scripts/dev-server.mjs`
- `scripts/dev-doctor.mjs`
- `apps/web/js/api.js`

Risk:

- runtime, browser, and diagnostic code still restate overlapping default host and port behavior
- a later override can work in one layer while drifting in another

### Bootstrap tenant and branding defaults

Current hotspots:

- `apps/api/src/config/gameConfig.ts`
- `apps/api/src/config/publicAppConfigDefaults.ts`
- `apps/api/src/services/tenantSettingsService.ts`
- `apps/web/js/app-config.js`

Risk:

- bootstrap values remain close enough to live runtime behavior that incomplete tenant setup can still leak old defaults

### Frontend and backend runtime assumptions

Current hotspots:

- `apps/web/js/api.js`
- `apps/api/src/services/frontendRuntimeService.ts`
- `apps/api/src/index.ts`

Risk:

- local-host detection, CORS posture, and runtime URL assumptions are still split across layers
- staging-like behavior can still collapse into development assumptions

### Scheduler operating model

Current hotspots:

- `apps/api/src/scheduler.ts`
- `apps/api/src/index.ts`
- `apps/api/src/services/tenantSettingsService.ts`

Risk:

- background lifecycle work still behaves too much like one ambient server concern
- the SaaS model still needs an explicit answer on tenant scope, feature gating, and deployment expectations

### Placeholder configuration acceptance

Current hotspots:

- `apps/api/.env.example`
- `apps/api/src/services/upstashService.ts`

Risk:

- placeholder and example values can still blur the boundary between bootstrap guidance and safe runtime configuration

### Silent fallback chains

Current hotspots:

- `apps/api/src/middleware/tenantContextMiddleware.ts`
- `apps/web/js/api.js`
- `apps/web/js/app-config.js`

Risk:

- tenant and host resolution mistakes can be masked instead of surfaced quickly

## Execution order

### Phase 1 - Consolidate runtime defaults

Goal:

- move port, host, and API-base assumptions behind one clearer configuration path

Checkpoint signals:

- browser, server, and diagnostic code stop carrying separate default chains
- the development runtime and the diagnostic command report the same effective values by construction

### Phase 2 - Reduce bootstrap fallbacks in live runtime code

Goal:

- stop tenant and branding bootstrap values from reading like stable runtime defaults

Checkpoint signals:

- current fallback values are either explicitly bootstrap-only or replaced by tenant-backed sources
- incomplete tenant setup produces explicit operational signal instead of quietly serving old defaults

### Phase 3 - Clarify environment and scheduler behavior

Goal:

- make environment branching and scheduler posture explicit enough for SaaS operation

Checkpoint signals:

- staging or staging-like deploys do not inherit accidental development behavior
- scheduler enablement and scope are documented and represented in runtime configuration or deployment policy

### Phase 4 - Tighten fallback and placeholder validation

Goal:

- reduce silent failure modes that hide configuration or routing mistakes

Checkpoint signals:

- placeholder values are rejected or loudly quarantined where appropriate
- the remaining silent fallbacks are deliberate, documented, and narrow