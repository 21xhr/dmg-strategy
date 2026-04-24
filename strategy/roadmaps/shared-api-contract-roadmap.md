# Shared API Contract Roadmap

## Purpose

This roadmap defines how frontend and backend contracts stop drifting independently across the DMG repos.

See the [roadmap index](../roadmap.md) for the current list of active roadmap tracks.

Shareable documentation placement and repo-governance rules are defined in `/Users/mac/dmg-workspace/apps/docs/system-architecture/documentation-system.md`.

## Problem to solve

Route handlers, response payloads, request bodies, and query conventions currently evolve inside the backend and frontend on separate timelines.

That creates silent breakage risk in three ways:

- frontend code can keep compiling against stale assumptions after backend payloads change
- backend route changes can ship without one reviewable contract artifact
- shared naming and enum changes can drift across repos before any integration test fails

## Scope of this roadmap

This roadmap covers shared contract publication between `dmg-api` and `dmg-webapp`.

It does not define a public third-party developer platform. The goal is internal contract discipline first.

## Target outcome

The product should have one authoritative backend-to-frontend contract surface that is generated or published from the backend and consumed directly by the frontend.

Acceptable first implementations:

- generated OpenAPI plus generated frontend types
- a shared `dmg-types` package published from backend-owned schemas
- another backend-owned schema pipeline that still produces one reviewable contract artifact

The chosen approach should preserve one rule: backend payload shape is defined once and reused everywhere.

## Current state

The backend already has enough explicit route structure that contract generation can continue without waiting for a full API redesign.

What exists now is:

- backend-owned contract artifacts for the current public bootstrap, admin session/pulse, operator config/editor/control, stream status, explorer token/access, challenge list/detail/delta, submission, push, digout, disrupt, and removal route families
- generated browser contract artifacts exported into `dmg-webapp/js/generated/` and consumed by the webapp runtime guards instead of handwritten duplicates
- a live first slice for the challenge-submit token verification flow, plus public app-config and explorer access metadata that labels demo-only datasets explicitly
- an operator tenant-policy surface is already contractized in the backend and webapp, including the editable operator policy load/save flow, the owner-only policy variants, the private operator-session policy variants, the surface-access manifest, and the structured user-stats read model

The next slice after the freshness gate is contract-diff review surfacing for the operator contract family, and that behavior now exists in workspace code and CI so stale generated artifacts fail with a visible patch instead of only a filename list.

The missing pieces are:

- one canonical schema source for route payloads
- one generation or publication step in CI or local build workflows
- one frontend consumption path that replaces hand-maintained duplicate types

## Completed contract family

The operator and admin contract family is the first finished route-family slice for this roadmap.

It covered:

- the admin pulse read surface
- the public app-config editor surface
- the operator session-policy load and save surface
- the operator owner-policy load and save surface
- the operator surface-access manifest
- the operator user-stats read surface

Completion signals:

- generated browser contract artifacts are the only frontend-consumed source for these surfaces
- freshness failures surface a readable diff, not only a stale-file list
- no handwritten frontend duplicate survives for the covered operator/admin payloads
- the roadmap can move to the next family without reopening this block

## Current active family

The next live slice is public config and identity bootstrap.

It covers:

- the app-config bootstrap payload
- the challenge-submit secure-link token verification flow
- the explorer token verification flow
- the explorer access grant flow
- the explorer challenge list, delta, and detail read family

Completion signals:

- generated browser contract artifacts remain the only frontend-consumed source for the covered payloads
- freshness failures surface a readable diff, not only a stale-file list
- no handwritten frontend duplicate survives for the covered public config and identity bootstrap payloads
- the roadmap can advance to the next route family without reopening this block

## Phase 1 - Inventory contract surfaces

Create a route inventory grouped by stability and frontend dependency.

Priority surfaces:

- public bootstrap config and tenant runtime config payloads
- challenge submission and quote flows
- explorer access and token-backed entry flows
- admin dashboard reads and writes that already behave like typed product APIs

Output:

- one contract inventory note or checklist tied to backend route files
- one first-pass list of unstable payloads that should be normalized before generation

## Phase 2 - Choose the contract source of truth

Pick one backend-owned representation for request and response schemas.

Decision rule:

- the backend owns transport truth
- the frontend consumes generated or exported artifacts
- do not let the shared-types package become a second handwritten API definition

Evaluation criteria:

- easy review in pull requests
- type-safe backend handler usage
- type-safe frontend consumption
- support for enums and nullable fields without hand-maintained duplication
- compatibility with CI validation and breaking-change detection

## Phase 3 - Publish the first contract artifact

Ship one thin but real contract publication path.

Minimum goal:

- generate or export types for a small set of high-value routes
- consume them in the frontend
- fail CI or local validation when the generated artifact is stale

Current thin slices already live:

- token verification for challenge-submit secure links
- app-config bootstrap payload
- stream-status read
- explorer token verification flow
- explorer access grant flow
- explorer challenge list, delta, and detail read family
- challenge web-submission flow
- push quote flow
- push confirm flow
- digout flow
- disrupt flow
- challenge removal flow
- operator tenant-policy load/save flow
- operator owner-policy load/save flow
- operator session-policy load/save flow
- operator surface-access manifest
- operator user-stats read surface
- operator contract export freshness check
- operator contract export diff surfacing on freshness failures

Next thin slices after that:

- one contract-family expansion slice after the operator export path is the reviewable baseline

## Phase 4 - Expand to route families

Grow the contract surface by route family instead of attempting full backend coverage in one pass.

Suggested order:

1. public config and identity bootstrap
2. challenge submission and quote flows
3. explorer and token flows
4. admin dashboard reads and writes

Execution rule:

- each family should end with frontend consumption switched to shared contracts
- avoid leaving generated artifacts unused while handwritten frontend duplicates remain in place
- the current active family is the public config and identity bootstrap block above; treat later families as follow-on only after this block is fully consumed through generated artifacts

## Phase 5 - Add change detection and review gates

Make contract drift visible during development.

Targets:

- CI check for stale generated artifacts, starting with the operator contract export path and the committed browser contract files
- contract diff visibility in pull requests
- explicit review expectation when enums, nullable fields, or payload shapes change

## Completion criteria

This roadmap is complete when:

- backend-owned contract artifacts cover the frontend-critical route families
- frontend code keeps those payload types in shared artifacts rather than handwritten duplicates
- contract changes are reviewable and validated in normal development workflows
- route payload drift between repos is caught before runtime breakage

## Review rule

Reject implementations that:

- create a second handwritten source of truth for payload types
- publish shared types without a backend-owned generation or validation path
- expand the contract surface by copying ad hoc frontend assumptions back into backend code