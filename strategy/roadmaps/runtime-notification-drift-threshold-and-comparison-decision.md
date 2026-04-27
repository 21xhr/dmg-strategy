# Runtime Notification Drift-Threshold and Comparison Decision

## Purpose

This note captures the next runtime-notification decision slice after transport health, trend summaries, and tenant-backed failure threshold controls were implemented.

The goal is to decide whether the next investment should prioritize:

- drift-threshold alerting inside a tenant runtime-notification surface
- cross-tenant comparison surfaces for operator benchmarking

## Decision outcome

The next implementation slice should prioritize tenant-local drift-threshold alerting.

Cross-tenant comparison surfaces should stay deferred until the platform has an explicit cross-tenant support boundary and a clear operator role model that allows benchmark views without weakening tenant isolation.

## Why drift-threshold alerting first

- it extends existing per-tenant health, failure-history, and trend infrastructure without opening a new data-sharing boundary
- it fits current operator workflows where remediation is tenant-local and actionability is immediate
- it avoids introducing comparative rankings that can be noisy or misleading before normalization assumptions are explicit

## Why cross-tenant comparison is deferred

- tenant boundaries remain the primary authority model for runtime policy and operational visibility
- cross-tenant views require explicit support-role governance, auditability, and access controls before rollout
- meaningful comparison needs normalization rules (traffic volume, channel mix, event rate composition) that are not yet modeled

## Scope for the next implementation slice

- define one tenant-local drift signal derived from already persisted trend windows
- define one explicit threshold policy for drift breach conditions
- define one operator-visible alert state model with acknowledgement metadata
- define one minimum test boundary for drift alert transitions and reset behavior

## Completion criteria for this slice

This decision slice is complete when:

- the runtime-notification roadmap references this decision as the next-slice authority
- roadmap status in `strategy/roadmap.md` aligns with drift-threshold-first sequencing
- cross-tenant comparison is explicitly marked as deferred pending governance prerequisites

## Next suggested slice

Implement tenant-local drift-threshold alerting in the workspace repo runtime-notification status path and admin runtime-notification card, then document policy ownership and alert lifecycle in shareable docs.

## Farther move

Evaluate tenant-specific and per-user notification-routing filters after drift-threshold alerting lands, using explicit privacy and traffic-shaping trigger criteria.
