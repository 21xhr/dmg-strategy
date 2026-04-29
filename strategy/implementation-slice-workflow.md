# Implementation Slice Workflow

## Purpose

This note defines how roadmap work should be broken into execution-ready slices that a manager can hand to AI agents or external engineers one step at a time.

Use it when a roadmap needs a reusable execution model rather than one-off next-slice prose.

## Core idea

Each implementation slice should be small enough to assign, validate, and close without hidden scope growth.

The manager owns:

- choosing the active slice
- checking that the slice scope is concrete enough to assign
- confirming validation passed before the slice is marked complete

The implementer owns:

- landing only the active slice
- updating the roadmap after the slice lands
- keeping validation attached to the same slice

## Slice state model

Use only one active implementation slice at a time.

Recommended states:

- `completed`: landed and validated
- `active`: currently being implemented
- `next`: ready to start after the active slice
- `queued`: shaped enough to name, but not the immediate next slice
- `blocked`: cannot proceed until an external dependency or decision is resolved

Do not keep multiple broad slices marked active in the same roadmap.

## Required fields for each active or next slice

Every active or next slice should include:

- objective
- in-scope work
- out-of-scope work
- acceptance criteria
- validation commands or review checks

If any of those are missing, the slice is not assignment-ready.

## Scope discipline

If a slice expands during implementation, do not silently widen it.

Instead:

- finish the original slice if still coherent
- or split the new work into a separately named follow-up slice

This keeps validation and delivery checkpoints legible.

## Recommended slicing rule

Prefer slices that map to one dominant implementation surface.

Examples:

- one schema and persistence slice
- one contract and API slice
- one admin UI slice
- one validation and documentation slice

If a single feature needs all of those, keep them as consecutive sub-slices under one roadmap phase.

## Manager checkpoint rule

Before a slice is marked complete, verify all of the following:

- acceptance criteria are satisfied
- validation commands or equivalent checks pass
- roadmap status is updated in the same slice
- the next slice is concrete enough to assign

## Roadmap-writing rule

Do not write reusable execution governance only inside one roadmap.

If a rule applies across multiple roadmap files or future team execution, keep that rule here and let individual roadmaps reference it.

## External engineer handoff rule

If a slice may be implemented by an external engineer, the slice must be understandable without prior chat context.

That means the roadmap should let a third party answer these questions directly from the note:

- what to build
- what not to build
- how to know when it is done
- how to validate it
- what slice comes next