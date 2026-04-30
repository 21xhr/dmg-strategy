# Governance Event Architecture

## Purpose

This note captures the architectural direction for treating DMG as governance infrastructure that keeps a tenant-scoped history of decision operations rather than only task execution.

It exists as a mental model and design anchor for future implementation work.

## Core thesis

If DMG is meant to support auditable decision operations, then each tenant should accumulate structured governance history.

That history should not live only in isolated workflow-specific tables with no common model.

The stronger architecture is:

- a tenant-scoped governance workflow model
- a tenant-scoped governance event log
- workflow-specific read models or projections for operational surfaces

## Recommended architecture layers

### Governance workflow instance

This is the durable container for one governance process inside one tenant.

Treat this as a reusable module boundary: each workflow type is one governance module with a stable event contract, role semantics, and projection contract.

The tenant does not get custom code by default.

The tenant gets a module with tenant-scoped configuration, policy values, and integration bindings.

Typical fields would include:

- tenant identifier
- workflow type
- workflow status
- owning surface or context
- created and updated timestamps

Examples of workflow types could later include:

- runtime-notification drift escalation
- strategic arbitration between competing requests
- sensitive configuration approval
- tenant-specific rule-change review

Over time, the product can keep a module catalog and enable only the modules that match each tenant profile.

This is close to ERP-style capability packaging in shape, but the product promise stays governance-first: integration plus reusable governance modules.

### Governance event log

This is the append-only history of what happened inside a workflow.

Typical fields would include:

- workflow instance identifier
- tenant identifier
- event type
- actor identity and role
- timestamp
- structured payload describing the event context

Examples of event types could later include:

- alert acknowledged
- escalation opened
- decision proposed
- decision approved
- threshold changed
- owner override recorded

### Read models or projections

Operational screens should not query the raw event log directly for every use case.

Instead, workflow-specific read models can provide optimized views such as:

- runtime-notification acknowledgement history
- escalation handoff history
- decision timeline for one arbitration case
- owner-visible audit summaries

To make projections explicit, define each projection with four fields:

- source events: the event types that update the projection
- projection key: the lookup scope (for example tenant plus workflow, or tenant plus workflow plus actor)
- serving surface: the API route or report that consumes the projection
- freshness rule: whether projection updates are synchronous on write or asynchronous in a worker

Examples:

- `runtimeNotificationAcknowledgementHistory`
	- source events: alert acknowledged
	- projection key: tenant plus workflow
	- serving surface: operator runtime-notification status route
	- freshness rule: synchronous on write
- `runtimeNotificationEscalationHandoffHistory`
	- source events: escalation opened, escalation updated, escalation closed
	- projection key: tenant plus workflow
	- serving surface: operator runtime-notification escalation panel
	- freshness rule: synchronous on write for create, asynchronous allowed for derived metrics
- `governanceDecisionTimeline`
	- source events: decision proposed, decision revised, decision approved, decision rejected
	- projection key: tenant plus workflow instance
	- serving surface: operator and owner decision-audit view
	- freshness rule: asynchronous allowed when timeline rendering does not gate write-time correctness

## Why this is stronger than one table per workflow

One workflow-specific table can be a good first step when a feature is still narrow.

That is what happened with runtime-notification drift-alert acknowledgement history.

But if every new governance workflow creates a completely separate data model with no common event pattern, the product risks:

- inconsistent audit semantics
- duplicated actor and timestamp logic
- fragmented tenant history
- harder cross-workflow reporting later

The long-term value of DMG is not only that one workflow is auditable.

It is that tenant governance activity becomes legible as a system.

## How the current runtime-notification model fits

`RuntimeNotificationDriftAlertAcknowledgement` is a valid tenant-scoped governance history model for the current feature.

It can be treated as an early workflow-specific projection.

That does not force immediate migration into a broader governance-event system, but it does suggest the direction future workflows should converge toward.

To prove this direction in the streaming wedge with low integration cost, define a roadmap that lands at least two complete streaming governance workflows with explicit workflow state, event history, and projection surfaces.

Recommended first two workflows:

- drift-alert acknowledgement plus escalation handoff workflow
- moderation-arbitration workflow for contested moderation actions in stream operations

## Design rule for future work

When a new governance workflow is introduced, decide explicitly whether it should be:

- a narrow workflow-specific projection only
- or part of a broader tenant-scoped governance workflow and event architecture

If multiple governance workflows need audit trails, shared actor semantics, or cross-workflow reporting, prefer the broader event architecture.

Narrow workflow-specific projections are still correct when:

- the workflow is isolated and unlikely to need cross-workflow reporting
- the workflow has low write volume and simple actor semantics
- the product is still validating behavior before committing to shared workflow infrastructure
- migration cost into a shared governance-event layer is kept explicit and reversible

Concrete examples:

- Isolated workflow with no cross-workflow reporting need:
	- tenant-level newsletter preference toggle can stay a `TenantConfig` boolean when the only requirement is current effective value and no actor timeline is required.
- Low write volume with simple actor semantics:
	- annual owner acknowledgement of one tenant policy document can be a narrow projection when one owner action per year is enough and no multi-step review chain is required.
- Behavior-validation stage before shared infrastructure:
	- first rollout of moderation-arbitration in one streaming wedge can stay workflow-local while event taxonomy is still stabilizing.
- Reversible migration path is explicit:
	- keep workflow-local event table names and payloads aligned with a future shared event contract so migration can be scripted without data-loss ambiguity.

Boolean-or-workflow test:

- use a direct config field when only the current value matters
- use a workflow when actor, timestamp, reason, and transition history must be auditable
- use a module when the same workflow pattern repeats across multiple tenants or multiple product surfaces

Modularity guardrail:

Design reusable modules early, but do not over-generalize before the second concrete use case is validated.

Example:

- a file-attestation module can be designed with configurable recurrence, actor quorum, and artifact type once at least two real policy-attestation workflows need those controls.