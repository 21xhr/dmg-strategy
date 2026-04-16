# Product Roadmap

## Purpose

This file is the clean roadmap index for work that should happen before the next major implementation wave.

It exists to separate:

- current product definition
- implementation roadmaps
- backlog items that are real but not yet shaped into a dedicated roadmap
- brainstorm material that still needs triage

## Placement note

Shareable documentation placement and instruction-boundary rules are defined in `/Users/mac/dmg-workspace/apps/docs/system-architecture/documentation-system.md`.

This file is the roadmap index. When a new dedicated roadmap is created under `dmg-doc/strategy/roadmaps/`, add it here.

## Completed groundwork

### Documentation cleanup before more code

Goal:

- reduce the amount of roadmap material mixed into current-state technical docs
- make it easier to extract a clean presentation-ready product basis
- keep exploratory thinking without letting it pollute the source-of-truth product docs

Outputs:

- one clean roadmap index
- one roadmap file per major migration track
- one triage pass on the brainstorm dump

Status:

- largely done
- keep only as lightweight documentation discipline, not as a blocking implementation step

### Brainstorm triage

Goal:

- turn the downloaded brainstorm dump into structured strategic material instead of leaving it as one large mixed document

Status:

- largely done
- continue only as lightweight inbox discipline and occasional extraction of new durable ideas

Recommended result:

- keep one raw inbox document for capture only
- extract durable insights into focused documents by topic
- discard duplicates and temporary wording once promoted into clean docs

Current extracted strategy docs:

- `strategy/gamification-and-behavioral-system.md`
- `strategy/market-analysis/`
- `strategy/market-verticals.md`
- `strategy/internal-organization-use-cases.md`
- `strategy/moat-and-portable-identity.md`
- `strategy/competitive-positioning.md`
- `strategy/participation-and-adoption.md`
- `strategy/uncertainty-reduction.md`
- `strategy/source-material-workflow.md`
- `strategy/decision-support-boundaries.md`

Current extracted fundraising notes:

- `fundraising/briefs/advisor-brief-marc-jim.md`
- `fundraising/briefs/audience-pitch-notes.md`
- `fundraising/plans/market-feedback-and-loi-plan.md`

## Active roadmap

### 1. SaaS-readiness foundation

Goal:

- make tenant-scoped settings real
- move hard-coded business rules toward database-backed configuration
- prepare admin visibility and future operator ownership

Primary roadmap files:

- `strategy/roadmaps/config-to-database-roadmap.md`
- `strategy/roadmaps/config-to-database-schema-roadmap.md`

Scope note:

- keep tenant settings and config migration work in these roadmap files
- do not fold separate economy-ledger migration work into the config-to-database roadmap once it has its own dedicated track

### 2. Economy and ledger redesign

Goal:

- replace the legacy `User ID 1` world-ledger pattern with dedicated economy records
- move shared pools, balances, and summaries out of identity-based shortcuts
- keep economy migration scoped separately so the config-to-database roadmap stays focused on tenant and settings work

Primary roadmap file:

- `strategy/roadmaps/economy-ledger-redesign-roadmap.md`

### 3. Shared API contract

Goal:

- stop frontend and backend payloads from drifting independently
- generate or publish one reviewable contract surface for route payloads and shared types
- keep transport, schema, and consumer typing aligned across repos

Status:

- started
- backend-owned contract artifacts now cover the challenge-submit token verification response, the public app-config bootstrap payload, the public stream-status read, the explorer token verification and access-grant responses, the explorer challenge list, delta, and detail reads, the challenge web-submission response, the push quote and push confirm responses, and the digout and challenge-removal responses
- backend-owned contract artifacts now also cover the admin dashboard pulse read
- backend-owned contract artifacts now also cover the operator-side public-app-config editor surface
- generated browser contracts are exported into the webapp; the current classic-script frontend now consumes the challenge-submit, app-config, admin pulse, operator public-app-config, stream-status, explorer access, and explorer challenge-read artifacts as runtime guards while push and challenge-lifecycle artifacts still exist ahead of dedicated browser-side action surfaces

Primary roadmap file:

- `strategy/roadmaps/shared-api-contract-roadmap.md`

### 4. Provider and ingress abstraction

Goal:

- keep the command-processing core provider-agnostic
- make ingress providers replaceable at the boundary
- prepare provider selection and connection management by configuration

Status:

- started
- first normalization step exists in code already
- not a reason to delay tenant and settings work until a full provider registry exists

Primary roadmap file:

- `strategy/roadmaps/ingress-abstraction-roadmap.md`

Recommended scope boundary:

- finish the boundary cleanup needed to keep the command core provider-agnostic
- do not treat second-provider support or full provider management as a prerequisite to tenant and config migration

### 5. Monorepo migration

Goal:

- consolidate the codebase into one workspace once the shared package seams are clear enough to deserve first-class ownership
- keep independent deployment boundaries while removing cross-repo coordination friction
- make contracts, tooling, and future shared packages evolve inside one review and CI graph

Status:

- started
- now strategically relevant because product slices already land across backend, webapp, and docs together
- phase-one trigger is now materially stronger because the first frontend-consumed challenge read family is contractized in addition to the earlier token and mutation slices
- a first workspace-shell bootstrap now exists with `pnpm` workspaces, Turborepo, placeholder app boundaries, and the initial `contracts` plus `tooling` package seams
- the first mechanical app move is now in place under `apps/api`, `apps/web`, and a confidentiality-filtered `apps/docs`
- the first real extracted shared package is now `packages/contracts`, and the moved API imports it directly
- `packages/tooling` now owns the browser-contract export script in the workspace instead of leaving that codegen path inside `apps/api`
- should begin before the full shared-contract roadmap is complete, but not before the first shared package seams are stable enough to avoid cargo-cult package extraction

Primary roadmap file:

- `strategy/roadmaps/monorepo-migration-roadmap.md`

Supporting checklist:

- `strategy/roadmaps/monorepo-phase-one-bootstrap-checklist.md`

### 6. Frontend productization

Goal:

- define the shared SaaS-ready frontend base
- decide which surfaces stay pilot-specific versus reusable
- make the UI evolve by surface boundaries rather than one-off hacks

Outputs to produce next:

- component inventory
- route and surface inventory
- settings and operator UX roadmap

### 7. Runtime notifications

Goal:

- move challenge lifecycle notifications out of log-only stubs and into explicit delivery boundaries
- keep websocket fanout and provider-backed public messaging behind dedicated notification transport interfaces
- avoid scattering presentation-side delivery logic across challenge, stream, and route services

Primary roadmap file:

- `strategy/roadmaps/runtime-notification-roadmap.md`

## Suggested near-term execution order

Latest completed slice:

- explicit tenant-context cleanup now covers challenge mutation flows, challenge removal, auth-driven account creation, stats rendering, token duration caps, daily submission context, maintenance-state reads, and stream helper entrypoints that previously relied on one ambient default tenant

Next execution order:

1. keep the shared API contract track close behind active backend route changes so frontend payload drift stops accumulating while the tenant model is still moving
2. continue the remaining economy-ledger migration slices instead of reopening schema design that already exists in code
3. finish the ingress boundary cleanup needed to keep provider logic out of the command core
4. continue frontend component and surface cleanup against the roadmap rather than ad hoc
5. shape runtime notifications as a dedicated transport layer instead of leaving challenge-event delivery at the current log-only subscriber layer

Execution rule:

- finish one active roadmap slice before opening the next implementation-heavy slice when there is a dependency boundary between them
- keep separate tracks separate in documentation even when the implementation order is sequential