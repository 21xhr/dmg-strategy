# Runtime Notification Roadmap

## Purpose

This note defines the staged path from the current log-only challenge event notification layer to explicit runtime notification delivery.

It lives under `strategy/roadmaps/` because the work spans current-state inventory, target boundary design, and phased implementation rather than only documenting present behavior.

See the [roadmap index](../roadmap.md) for the active roadmap list.

Documentation placement and repo-governance rules are defined in `system-architecture/documentation-system.md`.

## Current state

Challenge lifecycle subscribers currently log major events but do not yet fan out notifications to runtime consumers.

Today that means:

- `src/eventSubscribers/notificationService.ts` currently records notification-relevant lifecycle events without delivering them to runtime transports
- websocket fanout is not yet expressed as a stable application boundary
- provider-backed public messaging is not yet modeled as a reusable delivery interface
- event producers remain clean, but notification delivery is deferred rather than explicitly designed

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