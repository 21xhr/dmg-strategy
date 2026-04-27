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

## Next suggested slice

- completed slices: explicit payload mapping, websocket transport adapter, subscriber bridge for active listeners, provider-backed delivery policy, provider transport adapter, throttling signals, retry posture, queue-backed delivery, transport-level metrics, provider transport health reporting, dead-letter style handling for repeated public-message failures, operator-visible notification status reporting, recurring failure history with repeated-failure alerting signals, operator-facing trend summaries (failure rates by time window, trend direction, common failure causes), configurable failure threshold via tenant policy, persisted runtime-notification health history for cross-restart retention, and decision framing for drift-threshold alerting versus cross-tenant comparison surfaces
- next suggested slice: implement tenant-local drift-threshold alerting on top of the existing runtime trend surface, with explicit thresholds and acknowledgement flow in the operator runtime-notification surface
- farther move completed: tenant-specific and per-user runtime-notification routing filters are evaluated and deferred behind explicit trigger criteria in [runtime-notification-routing-filter-evaluation.md](runtime-notification-routing-filter-evaluation.md)
- farther move next opportunity: open a dedicated implementation slice only if privacy segmentation, traffic-shaping constraints, or contractual routing requirements become explicit

This slice is captured in [runtime notification drift-threshold and comparison decision](runtime-notification-drift-threshold-and-comparison-decision.md).

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