# Planning Update Dependency Model

## Purpose

This note is the strategy repo policy layer for planning workflow updates.

Use it when changing roadmap structure, backlog lane boundaries, planning status snapshots, or execution ordering decisions.

## Authority model

Use a one-direction three-layer model:

1. Router layer: .github/copilot-instructions.md routes planning tasks here.
2. Policy layer: this note defines planning workflow semantics.
3. Execution layer: roadmap and backlog files hold current execution state.

Execution files are not policy authorities.

## Core planning rules

- Keep roadmap files execution-ready with objective, in-scope, out-of-scope, acceptance criteria, and validation checks.
- Keep backlog files forward-looking; do not leave roadmap-tracker placeholder bullets after a lane becomes an active roadmap.
- Keep one active slice per roadmap lane unless explicit parallelization is intentionally documented and justified.
- Keep status snapshots explicit enough that archival decisions do not depend on memory.

## Promotion and removal rule

When a backlog lane becomes concrete enough for a dedicated roadmap:

- move implementation planning into the roadmap in the same slice
- remove superseded backlog bullets in the same slice
- keep backlog bullets only if they represent distinct unscheduled work that is not yet part of the roadmap scope

## Sequence integrity rule

When multiple planning slices are requested:

- complete them in sequence
- update execution order in the roadmap index when priority changes
- keep checkpoint and validation boundaries explicit per slice

## Planning-review dependency set

When updating a planning artifact, review at least:

- strategy/roadmap.md for active execution ordering
- strategy/backlog.md for superseded or duplicated lane text
- relevant strategy/roadmaps/*.md file for scope and status alignment
- strategy/implementation-slice-workflow.md for reusable slice protocol consistency

## Prospect and pre-launch framing rule

For pre-launch planning notes used in prospect conversations:

- separate validated modules from candidate modules
- label candidate modules as shaping hypotheses until a second concrete use case is validated
- avoid promising generalized module catalogs as current product capability when implementation is still in roadmap state