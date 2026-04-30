# Modularity-First Approach

## Purpose

This note defines a modularity-first strategy that stays compatible with pre-launch execution constraints.

It clarifies how DMG can pitch modular governance capability without over-promising unvalidated abstraction.

## Core posture

Use modularity by validated repetition, not modularity by speculative abstraction.

That means:

- design for extraction early
- generalize only after repeated real workflow patterns are observed
- keep module claims aligned with implemented workflow boundaries

## Why this fits pre-launch

Pre-launch work must balance three goals:

- prospect confidence in long-term modular direction
- fast implementation speed for near-term validation
- low architecture rework risk when second and third use cases arrive

Over-generalizing too early slows delivery and often encodes the wrong abstraction.

Avoiding all modular planning creates fragile one-off implementations.

The middle path is explicit module candidates plus staged validation gates.

## Three-level module maturity

### Level 1 - Workflow-local implementation

- one workflow in one wedge
- narrow state model and projection
- explicit migration path to shared event and module surfaces

### Level 2 - Repeated pattern extraction

- at least two concrete workflows share event and role semantics
- shared contract shape starts to stabilize
- module boundary is extracted with minimal tenant-specific branching

### Level 3 - Catalog-grade module

- reusable across multiple tenant profiles
- configurable policy surface and role model
- explicit integration boundary and operational ownership

## Candidate module list for prospect conversations

Validated or near-validated direction:

- runtime-notification drift governance module
- moderation-arbitration governance module

Candidate module lanes (roadmap-shaping, not launch claims):

- sponsor-obligation arbitration module
- policy-attestation module

Use candidate language explicitly in pre-launch discussions.

## Decision test: config field, workflow, or module

- use config field when only current effective value matters
- use workflow when transitions, actors, and rationale history matter
- use module when the workflow pattern repeats across multiple contexts

## Relationship to governance event architecture

This note is an execution and positioning companion to `strategy/governance-event-architecture.md`.

The architecture note defines durable model shape.

This note defines when and how that shape should be extracted into reusable modules.