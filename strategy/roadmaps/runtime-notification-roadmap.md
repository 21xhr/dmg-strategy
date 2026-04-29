# Runtime Notification Roadmap

## Purpose

This note defines the staged path from the current log-only challenge event notification layer to explicit runtime notification delivery.

It lives under `strategy/roadmaps/` because the work spans current-state inventory, target boundary design, and phased implementation rather than only documenting present behavior.

See the [roadmap index](../roadmap.md) for the active roadmap list.

Documentation placement and repo-governance rules are defined in `system-architecture/documentation-system.md`.

## Current state

Runtime notifications are already on explicit delivery boundaries in the workspace repo.

Today that means:

- challenge events map to transport-agnostic notification intents
- websocket fanout and provider-backed transport delivery are active behind dedicated transport adapters
- notification health reporting includes transport metrics, dead-letter history, and trend summaries
- failure-threshold configuration is tenant-backed and visible in the operator runtime-notification surface
- persisted runtime-notification health history survives process restarts for trend and failure-history review

## Architecture to preserve

The notification system should preserve these boundaries:

- event producers publish domain events without caring about delivery channels
- notification orchestration decides which event maps to which notification policy
- transport adapters deliver to websocket clients, provider chat surfaces, or future channels
- presentation copy and transport rules remain outside core challenge and stream services

## Target outcome

The system should support challenge lifecycle notifications through explicit transports instead of inline TODOs or ad hoc service calls.

That target includes:

- websocket delivery for client-facing runtime updates
- provider-backed public messages for operator or audience-visible announcements where appropriate
- policy-based throttling or suppression for noisy event classes such as session ticks
- testable notification orchestration that can be exercised without coupling domain services to live transports

Execution structure and handoff rules live in [implementation-slice-workflow.md](../implementation-slice-workflow.md).

## Phase status snapshot

- Phase 1 - Notification boundary definition: completed
- Phase 2 - Websocket transport: completed
- Phase 3 - Provider-backed public messaging: completed
- Phase 4 - Hardening and observability: active

## Phase 4 execution board

### Phase-4 Slice-1 - Drift-alert acknowledgement audit trail visibility

Status: completed

Completed outcome:

- tenant-scoped acknowledgement history is persisted and returned in runtime-notification status
- operator runtime-notification surface shows acknowledgement history entries

### Phase-4 Slice-2 - Escalation handoff workflow for drift alerts

Status: next

Objective:

- let operators create an explicit escalation handoff record for drift-alert incidents with structured context and target follow-up path

In scope:

- persistence model for escalation handoff records, tenant-scoped
- operator API contract and routes for creating and listing handoff records
- admin runtime-notification UI section for creating and reviewing handoff records
- role checks aligned with existing operator-write boundaries and the current read-only support role

Out of scope:

- cross-tenant escalation routing
- external ticket-system integration
- automatic pager or webhook dispatch

Concrete implementation slices:

- Phase-4 Slice-2A: data model and migration for escalation handoff records
- Phase-4 Slice-2B: contracts and API routes (create/list) with role and tenant enforcement
- Phase-4 Slice-2C: admin UI form plus history panel for escalation handoff
- Phase-4 Slice-2D: tests and shareable doc updates for new workflow surface

Acceptance criteria:

- operator-write sessions can create a tenant-scoped escalation handoff record
- support sessions can read handoff history but cannot create records
- runtime-notification status view includes visible escalation handoff history in admin UI
- contract validations pass in browser-generated guards

Validation commands:

- `pnpm --filter @dmg/tooling run codegen:web-contracts`
- `pnpm --filter @dmg/contracts build`
- `pnpm --filter dmg-api build`
- `pnpm --filter dmg-api test -- runtimeNotificationService`

Manager checkpoint before marking completed:

- verify acceptance criteria list is fully checked
- verify validation commands pass without bypass
- verify roadmap is updated to move Phase-4 Slice-2 to completed and promote next slice

## Farther moves

- completed: tenant-specific and per-user runtime-notification routing filters are evaluated and deferred behind explicit trigger criteria in [runtime-notification-routing-filter-evaluation.md](runtime-notification-routing-filter-evaluation.md)
- next opportunity: open a dedicated implementation slice only if privacy segmentation, traffic-shaping constraints, or contractual routing requirements become explicit
- companion roadmap: streaming governance workflow expansion is tracked in [streaming-governance-workflow-roadmap.md](streaming-governance-workflow-roadmap.md)

Decision context is captured in [runtime notification drift-threshold and comparison decision](runtime-notification-drift-threshold-and-comparison-decision.md).

## Migration phases

### Phase 1 - Notification boundary definition

Goal:

- define a notification orchestration service that subscribes to challenge events and maps them to transport-agnostic notification intents

Deliverables:

- explicit notification intent types
- a transport interface for websocket and provider-backed delivery
- clear rules for which challenge events produce which notification intents

### Phase 2 - Websocket transport

Goal:

- implement client-facing runtime fanout for challenge lifecycle updates and progress changes

Deliverables:

- websocket transport adapter
- event-to-payload mapping for challenge state changes
- integration path from the notification orchestrator to active frontend subscribers

### Phase 3 - Provider-backed public messaging

Goal:

- add provider-facing public announcements without coupling challenge services directly to provider APIs

Deliverables:

- provider messaging transport adapter
- copy policy for public announcements
- failure handling and retry posture that does not block core domain transitions

### Phase 4 - Hardening and observability

Goal:

- make notification delivery measurable and safe to operate in production

Deliverables:

- per-subscriber isolation so one failing subscriber does not silently drop the rest of an event fanout
- queue-backed async delivery evaluation for higher-latency notification channels where retry and backpressure matter, including BullMQ or an equivalent job queue if the runtime stack justifies it
- transport-level logging and delivery metrics
- tests for orchestration mapping and transport isolation
- operator-visible status reporting for notification health where justified