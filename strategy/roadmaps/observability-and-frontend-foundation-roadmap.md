# Observability and Frontend Foundation Roadmap

## Purpose

This roadmap captures the SaaS-readiness implementation slice focused on runtime observability foundations, typed frontend API boundaries, and CI-gated end-to-end coverage for critical user flows.

It exists as a dedicated roadmap because the work spans backend endpoint design, frontend contract typing, and test-pipeline enforcement in one coherent execution sequence.

See the [roadmap index](../roadmap.md) for active lane ordering.

## Current status snapshot

This lane is scoped but not yet executed as a dedicated sequence.

The target scope comes from the former Week-6 SaaS-readiness audit output and is now normalized into three implementation slices:

- PR-13: health and metrics endpoints
- PR-14: frontend API client migration to typed TypeScript
- PR-15: critical-flow E2E coverage in CI

## Completion criteria

This roadmap is complete when all three slices are true in the workspace repo:

- `/api/v1/health` and `/api/v1/metrics` expose actionable runtime and service metrics and are consumable by the admin surface
- legacy frontend API-client JavaScript boundary is replaced by typed TypeScript with normalized Hypertext Transfer Protocol error handling and no unresolved `any` leaks in the migrated surface
- critical submit and explorer flows pass in CI on each pull request through deterministic E2E coverage

## Migration slices

### Slice 1 - PR-13 Health and metrics endpoints

Goal:

- provide one runtime-health endpoint and one metrics endpoint that make service reliability observable from the admin surface

Deliverables:

- database and Redis health checks in `/api/v1/health`
- metrics in `/api/v1/metrics` covering total requests, 5xx errors, service latency, and active sessions
- endpoint response shapes stable enough for dashboard consumption

Acceptance criteria:

- admin dashboard can consume both endpoints without shape guessing or ad hoc fallback parsing

### Slice 2 - PR-14 Typed frontend API boundary

Goal:

- migrate the frontend API boundary from JavaScript to typed TypeScript so request and response contracts are explicit at compile time

Deliverables:

- replace `js/api.js` with `ts/api.ts` (or equivalent typed API-client boundary)
- integrate shared types from workspace contract packages where those contracts are already authoritative
- normalize Hypertext Transfer Protocol error mapping so frontend surfaces do not carry inconsistent error-shape assumptions

Acceptance criteria:

- no unresolved `any` in the migrated API boundary
- Explorer and SubmitForm remain functional on the migrated boundary

### Slice 3 - PR-15 Critical-flow E2E coverage

Goal:

- enforce critical user flows in CI so regression risk is caught before merge

Deliverables:

- Playwright coverage for submit flow (`token -> submit -> success`)
- Playwright coverage for explorer-access flow (`grant -> load`)
- CI execution for these flows on each pull request

Acceptance criteria:

- both flows pass reliably in CI for pull request validation

## Sequencing rule

Implement the slices in order.

Do not start E2E enforcement before health or typed API boundaries are stable enough to avoid flaky or shape-guessing tests.

## Next suggested slice

Start with PR-13 endpoint contract design and admin-consumption shape review before implementing endpoint internals.

## Farther move

After this roadmap completes, decide whether cross-surface SLO reporting should become a dedicated operator telemetry lane or remain lightweight status reporting.
