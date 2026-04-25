# Documentation Update Dependency Model

## Purpose

This note captures a planning model for how documentation updates could scale across DMG work.

The shareable standing-rule implementation lives in [documentation-update-dependency-model](../dmg-workspace/apps/docs/system-architecture/documentation-update-dependency-model.md) and [documentation-update-manifest.json](../dmg-workspace/apps/docs/system-architecture/documentation-update-manifest.json).

This note is not the source of truth for shareable product architecture.

It remains a private planning note for private-first boundary decisions, cross-repo implications, operator workflows, and tenant-facing structuring ideas that are not yet rewritten into shareable current-state or standing-rule docs.

## Core idea

When new source material enters the system, do not ask only where to store the new note.

Also ask which existing durable notes may now be stale, incomplete, or contradicted.

Treat that review set as the documentation equivalent of a dependency graph.

## Why this matters

Code exposes dependency graphs through imports, packages, and build tooling.

Documentation usually cannot.

Documentation dependencies are semantic rather than syntactic, so recurring review sets need to be modeled intentionally.

## Practical model

Every recurring documentation workflow should define three things:

1. the source event type
2. the default durable notes to review
3. the threshold for when each reviewed note actually changes

For environment or startup surface changes, include the touched source env artifact in the update set so the runtime contract is documented where it is actually defined.

## Example source event types

- product-boundary clarification or naming correction
- architecture or workspace-structure decision
- implementation change that alters current behavior or current boundaries
- glossary-worthy term introduction
- fundraising or external-network learning that changes a reusable thesis

## Monorepo implication

Turborepo can track code dependency graphs because code expresses imports and package boundaries directly.

Documentation needs a different graph shape.

The equivalent is a review graph built from source-event categories and durable update sets.

This graph will be partly human-defined.

That is acceptable.

The important property is not perfect automation.

It is that recurring documentation dependencies become explicit, reviewable, and reusable.

## DMG product implication

If DMG later wants to support better upstream input structuring for its own operators or for future tenants, this model could inform how documentation, follow-up prompts, or operational review sets are structured.

That is a later product or operations question, not current shareable architecture.

## Working rule

When a roadmap, backlog status snapshot, or other live-state planning note describes the present system boundary, write it in direct present-state language.

Do not use transition-history phrasing in current-state planning notes unless the note is explicitly historical.

Avoid unnecessary comparison-led phrasing such as `instead of ...` or `rather than ...` when the sentence is really stating the present boundary. State the present model directly unless the comparison is analytically necessary.

If the sentence is about current state, rewrite it so the current boundary stands on its own.

Keep this note in private planning for planning-only extensions that do not yet belong in the shareable docs app.

If the boundary is unclear, default to keeping the material here until the shareable/private split is explicit.

Promote concrete shareable rules into the docs app instead of duplicating them here.

Use this note only when the material still needs to translate into:

- a shareable current-state documentation rule
- a roadmap with implementation scope
- or a product-facing workflow note with clear ownership