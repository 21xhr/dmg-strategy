# Streaming Governance Workflow Roadmap

## Purpose

This roadmap defines how the streaming wedge should prove DMG as a governance-event system with complete workflow modules, event history, and projection surfaces.

The target is to complete at least two stream-operations governance workflows that are reusable across streamer tenants, then shape a third streaming-specific workflow candidate.

## Current state

Streaming already provides a low-friction environment for governance workflow rollout because:

- tenant integrations are lighter than multi-system enterprise contexts
- platform and operator patterns are similar across many streamer tenants
- event and policy surfaces can be validated quickly with existing runtime-notification and operator flows

Workflow-1 is already underway through runtime-notification drift-alert acknowledgement and escalation handoff slices. This workflow is cross-vertical, but it serves as the first event-governance baseline in the streaming wedge.

## Completion criteria

This roadmap is complete when all of the following are true:

- workflow-1 is complete with explicit state transitions, event history, and operator projections
- workflow-2 is complete with explicit state transitions, event history, and operator projections
- workflow-3 candidate is defined with objective, scope, and validation boundary
- both workflows use role semantics that align with tenant operator boundaries
- both workflows expose contract-validated read models for admin and operator surfaces
- cross-workflow guidance for when to keep narrow projections versus shared governance-event infrastructure is captured in strategy notes

## Phase status snapshot

- Phase 1 - Workflow-1 runtime-notification drift escalation: active
- Phase 2 - Workflow-2 moderation arbitration: next
- Phase 3 - Workflow-3 streaming-specific candidate shaping: queued
- Phase 4 - Shared projection and governance-event convergence review: queued

## Phase 1 - Workflow-1 runtime-notification drift escalation

Status: active

Scope:

- keep completing runtime-notification escalation handoff in `strategy/roadmaps/runtime-notification-roadmap.md`
- keep workflow state explicit for acknowledgement and escalation operations
- keep event history and projection coverage visible in operator surfaces

Checkpoint:

- runtime-notification roadmap marks Phase-4 Slice-2 complete with validation and operator visibility checks

## Phase 2 - Workflow-2 moderation arbitration

Status: next

Objective:

- add a moderation-arbitration governance workflow for contested moderation actions in stream operations

In scope:

- tenant-scoped moderation-arbitration workflow instance model
- workflow event history for dispute opened, evidence added, decision recorded, and closure
- operator projection for active disputes and per-case timeline
- role boundaries for who can open, review, decide, and close

Out of scope:

- cross-tenant arbitration
- management of legal or platform-policy appeals outside the product boundary; the workflow may still record an external-referral terminal outcome
- external ticketing integration

Acceptance criteria:

- at least one contested moderation flow can be opened and resolved end-to-end
- event timeline is visible for each arbitration case
- projection contract validation passes for operator surface payloads
- role boundaries are enforced and test-covered

Validation checkpoints:

- contract and generated-guard validation pass
- API build and relevant test suites pass
- roadmap and docs are updated in the same slice

## Phase 3 - Workflow-3 streaming-specific candidate shaping

Status: queued

Objective:

- define one additional streaming-specific governance workflow that is not runtime-notification driven

Candidate workflow:

- sponsor-obligation arbitration for disputed campaign deliverables in stream operations

Scope:

- workflow state for obligation raised, evidence submitted, decision recorded, resolution closed
- event history for dispute and decision timeline
- role boundaries for streamer, moderator, and owner-level reviewer actions

Exit signal:

- one implementation-ready slice plan exists with objective, scope, acceptance criteria, and validation checks

## Phase 4 - Shared projection and governance-event convergence review

Status: queued

Objective:

- evaluate whether workflow-1 and workflow-2 should stay narrow projections or move into a shared governance-event layer

Exit signal:

- one explicit decision note captures keep-narrow versus converge-shared direction with migration implications

## Next suggested slice

- complete runtime-notification Phase-4 Slice-2 in `strategy/roadmaps/runtime-notification-roadmap.md`
- then open workflow-2 data-model slice with tenant-scoped moderation-arbitration workflow and event tables