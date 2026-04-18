# Drift Reduction Roadmap

## Purpose

This roadmap kept drift-prone runtime assumptions visible while the active SaaS-readiness work continued.

It existed because the codebase contained duplicated defaults, bootstrap-era fallbacks, and environment assumptions that were easy to preserve accidentally during otherwise correct feature work.

Archived on 2026-04-18 after the remaining host and API-base fallback review closed with two standing rules:

- non-local browser runtimes require explicit API base configuration instead of origin-derived fallback
- backend request-host fallback remains allowed only as explicit runtime signal rather than silent behavior

See the [roadmap index](../../roadmap.md) for the current list of active roadmap tracks.

## Status snapshot at archive time

Current state:

- runtime port and host defaults have one authoritative default chain
- bootstrap public app config states are explicit instead of reading like stable tenant runtime
- environment tier and scheduler posture are explicit runtime policy rather than a production-versus-non-production split
- placeholder configuration values are quarantined from live runtime behavior
- tenant-resolution source is explicit across middleware, public app config, and browser runtime
- host and API-base fallback rules are explicit enough to stop treating drift reduction as a standalone active roadmap

Why this was archived:

- the broad cross-cutting drift clusters were reduced into explicit standing rules or narrower follow-up work attached to other active roadmaps
- leaving this file active would preserve a vague cleanup lane after its concrete remaining review question was already answered

## Completion criteria

Archive this roadmap only when these signals are true:

- runtime port and host defaults have one authoritative configuration path rather than being restated across browser, server, and diagnostic code
- bootstrap tenant and branding fallbacks no longer behave like durable live-runtime defaults
- environment branching is explicit enough that local, staging, and production behavior do not depend on a binary production-versus-non-production split
- scheduler behavior has an explicit operating model instead of remaining an ambient always-on server assumption
- placeholder and example config values are either rejected or clearly quarantined from live runtime behavior
- the most important silent tenant and host fallback paths are either removed, logged, or made deliberately explicit

## Archived scope

This roadmap covered drift-prone code patterns that could create future regressions even when the immediate feature work was correct.

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
- provider abstraction beyond the drift risks that came from runtime assumptions

## Final risk-cluster disposition

### Port and host defaults

Disposition:

- consolidated behind one runtime-default chain consumed by API bootstrap, browser runtime, and diagnostic tooling

### Bootstrap tenant and branding defaults

Disposition:

- narrowed into explicit bootstrap-only public runtime defaults and API-owned app-config behavior

### Frontend and backend runtime assumptions

Disposition:

- narrowed through explicit environment policy, explicit tenant frontend base URL resolution, and explicit non-local API base configuration requirements in the browser

### Scheduler operating model

Disposition:

- narrowed through explicit runtime policy and scheduler enablement rules; any future scheduler-scope evolution belongs in the config-to-database roadmap rather than this archive lane

### Placeholder configuration acceptance

Disposition:

- narrowed through placeholder-value quarantine in JWT and Upstash configuration handling

### Silent fallback chains

Disposition:

- narrowed through explicit tenant-resolution source and explicit host or API-base fallback signaling

## Historical execution order

### Phase 1 - Consolidate runtime defaults

Goal:

- move port, host, and API-base assumptions behind one clearer configuration path

### Phase 2 - Reduce bootstrap fallbacks in live runtime code

Goal:

- stop tenant and branding bootstrap values from reading like stable runtime defaults

### Phase 3 - Clarify environment and scheduler behavior

Goal:

- make environment branching and scheduler posture explicit enough for SaaS operation

### Phase 4 - Tighten fallback and placeholder validation

Goal:

- reduce silent failure modes that hide configuration or routing mistakes