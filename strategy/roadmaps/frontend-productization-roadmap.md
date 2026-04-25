# Frontend Productization Roadmap

## Purpose

This note tracks the shared frontend shell rollout and the boundary between shared product surfaces and intentionally separate operator surfaces.

It lives under `strategy/roadmaps/` because the work spans current-state inventory, shared-surface definition, docs alignment, and archival criteria rather than a single page edit.

See the [roadmap index](../roadmap.md) for the active roadmap list.

Documentation placement and repo-governance rules are defined in `system-architecture/documentation-system.md`.

## Current state

The shared product shell is already implemented on the agreed public and product surfaces in the workspace repo.

Current coverage:

- landing page
- Frequently Asked Questions page
- donation page
- Explorer page
- public challenge page
- challenge submit form

Current boundary decisions:

- Explorer uses the shared shell in wide mode
- admin and operator surfaces remain intentionally separate and are documented as a different surface class
- the current docs describe the shell in present-state language instead of change-relative language

## Status snapshot

The shared product shell is live across the agreed public and product surfaces, and the remaining work is boundary locking plus archive review.

What is already in place:

- the shared shell renders on the current public entry and challenge surfaces
- the Explorer page uses the wide shell variant
- the frontend architecture note describes the shell in current-state language
- the overview note describes the shared shell and keeps the passive-versus-participatory comparison intact

What still needs to land:

- a final inventory check that the shared shell covers every page in the agreed surface set
- an explicit statement of any intentional exceptions, if a future surface stays outside the shell pattern
- archive review after the remaining implementation work is complete

## Completion criteria

This roadmap is complete when all of the following are true:

- every page in the agreed shared surface inventory uses the shared product shell
- any intentionally separate surface is documented as an exception rather than left implicit
- the shareable docs use stable present-state language for the shell coverage
- the relevant workspace validation passes for the final surface set
- the roadmap can be archived without leaving unresolved surface-boundary questions

Status: active.

Completion signal: the shell inventory is fixed, exceptions are explicit, and the frontend docs and workspace validation agree on the final surface set.

## Surface boundary

The shared shell is the default presentation layer for shared product surfaces.

The operator/admin surface remains separate because it serves a different role, with different access and control semantics.

That boundary should remain explicit so future frontend work does not blur operator controls into the shared product layer.

## Validation checkpoints

The track is ready for archive review when:

- `pnpm --filter @dmg/web build:static` passes with the shared shell pages included
- `git diff --check` stays clean after the final inventory update
- `pnpm docs:review-targets -- --event implementation-change --path apps/docs/overview.md` only returns expected follow-up docs, if any

## Execution sequence

1. confirm the final shared-surface inventory
2. document any deliberate exceptions to the shared shell pattern
3. keep the docs aligned with present-state language and the agreed shell boundary
4. archive the roadmap once validation passes and no additional surface work remains