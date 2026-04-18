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

The backend already has enough explicit route structure that contract generation can start without waiting for a full API redesign.

The first live slice now exists for the challenge-submit token verification flow.

What exists now is:

- one backend-owned contract module for `POST /token/verify-challengesubmitform`
- one backend-owned contract module for `GET /references/app-config`
- one backend-owned contract module for `POST /admin/session` and `GET /admin/session`
- one backend-owned contract module for `GET /admin/pulse`
- one backend-owned contract module for `GET /operator/public-app-config` and `PUT /operator/public-app-config`
- one backend-owned contract module for `POST /operator/challenge/execute` and `PUT /operator/challenge/:challengeId/status`
- one backend-owned contract module for `GET /stream/stats`
- one backend-owned contract module for `POST /token/verify-explorer`
- one backend-owned contract module for `POST /token/grant-explorer-access`
- one backend-owned contract module for `GET /challenges`, `GET /challenges/delta`, and `GET /challenges/:id`
- one backend-owned contract module for `POST /user/submit/web`
- one backend-owned contract module for `POST /user/push/quote` and `POST /user/push/confirm`
- one backend-owned contract module for `POST /user/digout`, `POST /user/disrupt`, and `POST /user/challenge/remove`
- one export step that publishes generated browser contract artifacts into `dmg-webapp/js/generated/`
- frontend runtime guards in the challenge-submit form, app-config bootstrap loader, admin session restore and login flow, admin dashboard pulse loader, admin public-app-config editor flow, admin challenge execute and status-update controls, shared stream-status helper, explorer verification flow, explorer access-grant flow, explorer challenge list polling flow, and public challenge detail page that consume those generated artifacts instead of trusting untyped payloads
- exported push and challenge-lifecycle artifacts now exist for push, digout, disrupt, and challenge-removal flows, but the current classic-script webapp still has no dedicated browser-side action UI that consumes them directly

The missing pieces are:

- one canonical schema source for route payloads
- one generation or publication step in CI or local build workflows
- one frontend consumption path that replaces hand-maintained duplicate types

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

Next thin slices after that:

- one next browser-side action surface that consumes the already-exported push or challenge-lifecycle artifacts directly
- one next admin or operator action surface after the current admin-session, pulse, settings-editor, and operator challenge-control seams

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

## Phase 5 - Add change detection and review gates

Make contract drift visible during development.

Targets:

- CI check for stale generated artifacts
- contract diff visibility in pull requests
- explicit review expectation when enums, nullable fields, or payload shapes change

## Completion criteria

This roadmap is complete when:

- backend-owned contract artifacts cover the frontend-critical route families
- frontend code no longer hand-maintains duplicate payload types for those surfaces
- contract changes are reviewable and validated in normal development workflows
- route payload drift between repos is caught before runtime breakage

## Review rule

Reject implementations that:

- create a second handwritten source of truth for payload types
- publish shared types without a backend-owned generation or validation path
- expand the contract surface by copying ad hoc frontend assumptions back into backend code