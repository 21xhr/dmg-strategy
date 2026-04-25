# Frontend Productization Roadmap

Archived on 2026-04-25 after the shared product shell covered the agreed public and product surfaces and the workspace validation passed.

## Purpose

This note tracked the shared frontend shell rollout and the boundary between shared product surfaces and intentionally separate operator surfaces.

It lived under `strategy/roadmaps/` because the work spanned current-state inventory, shared-surface definition, docs alignment, and archival criteria rather than a single page edit.

## Current state

The shared product shell is implemented on the agreed public and product surfaces in the workspace repo.

Current coverage:

- landing page
- FAQ page
- donation page
- Explorer page
- public challenge page
- challenge submit form

Current boundary decisions:

- Explorer uses the shared shell in wide mode
- admin and operator surfaces remain intentionally separate

## Completion criteria

This roadmap is complete when all of the following are true:

- every page in the agreed shared surface inventory uses the shared product shell
- any intentionally separate surface is documented as an exception rather than left implicit
- the shareable docs use stable present-state language for the shell coverage
- the relevant workspace validation passes for the final surface set
- the roadmap can be archived without leaving unresolved surface-boundary questions

Status: complete.

Completion signal: the shell inventory is fixed, exceptions are explicit, and the frontend docs and workspace validation agree on the final surface set.

## Surface boundary

The shared shell is the default presentation layer for shared product surfaces.

The operator/admin surface remains separate because it serves a different role, with different access and control semantics.

That boundary remains explicit so future frontend work does not blur operator controls into the shared product layer.

## Validation checkpoints

The track was ready for archive review when:

- `pnpm --filter @dmg/web build:static` passed with the shared shell pages included
- `git diff --check` stayed clean after the final inventory update
- `pnpm docs:review-targets -- --event implementation-change --path apps/docs/overview.md` returned only expected follow-up docs, if any