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

This file is the roadmap index. When a new dedicated roadmap is created under `strategy/roadmaps/`, add it here.

## Roadmap writing rule

Write active roadmap files with enough signal that archive decisions do not depend on memory.

Each active roadmap should include:

- a current status snapshot
- explicit completion criteria or exit conditions
- concrete checkpoint signals or key metrics that make “mostly done” legible before archival review

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

### Monorepo migration

Goal:

- complete the split from the legacy multi-repo layout into one active engineering workspace plus one private planning workspace
- keep package seams, docs boundaries, and release workflow notes aligned with the new operating model

Status:

- completed enough to stop treating it as an active roadmap
- keep the migration notes only as historical record and for narrow residual cleanup

Archived records:

- `strategy/roadmaps/archive/2026-04-16-monorepo-migration-roadmap.md`
- `strategy/roadmaps/archive/2026-04-16-monorepo-phase-one-bootstrap-checklist.md`

Completed outcome:

- `dmg-workspace` is now the active engineering workspace
- `dmg-strategy` is now the active private planning workspace
- legacy repos were archived and the public rename cleanup is no longer an open planning item
- the first workspace shell, app moves, and initial `contracts` plus `tooling` package seams are in place

## Active execution sequence

This section is ordered for execution, not just for topic grouping.

Use the dedicated roadmap files for detailed implementation notes, but use this index to decide what should happen now, what should start next, and what should stay deliberately later.

### Now

#### 1. SaaS-readiness foundation

Goal:

- make tenant-scoped settings and operator policy boundaries explicit enough that later work does not keep inheriting bootstrap-era assumptions
- keep the remaining active work scoped to schema follow-through and explicit tenant-context cleanup rather than reopening completed launch-hardening work

Primary roadmap file:

- `strategy/roadmaps/config-to-database-schema-roadmap.md`

Latest completed slice:

- the config-to-database implementation roadmap is completed and archived after the private operator-session close-out lane finished
- operator-control safeguard hardening now covers the real destructive admin action surfaces in the current dashboard
- `POST /api/v1/operator/challenge/execute` rejects duplicate execute requests against the challenge that is already running
- `PUT /api/v1/operator/challenge/:challengeId/status` now treats repeated requests to the same status as an idempotent no-op success instead of replaying writes or duplicate event publication
- the remaining admin mutation surface is `PUT /api/v1/operator/public-app-config`, which stays tracked as configuration-governance work rather than as part of the destructive-control safeguard slice

Next slice inside this same track:

- continue the remaining explicit tenant-context hardening where routes, background workflows, or deploy/bootstrap resolution still assume one ambient tenant
- then decide which remaining settings belong in tenant-backed operator policy versus internal bootstrap or support configuration

Checkpoint signals for moving beyond this track:

- tenant context is explicit wherever active economy or operator flows still depend on it
- deploy/bootstrap URL defaults are no longer the hidden source of runtime authority where tenant or domain-aware resolution should win
- the remaining work in this track is mostly schema follow-through, structured settings-editor replacement, and narrower backlog cleanup rather than foundational tenant-boundary cleanup

Archived records:

- `strategy/roadmaps/archive/2026-04-20-config-to-database-roadmap.md`
- `strategy/roadmaps/archive/2026-04-18-drift-reduction-roadmap.md`

### Next

#### 2. Economy and ledger redesign

Goal:

- replace the legacy `User ID 1` world-ledger pattern with dedicated economy records
- move shared pools, balances, and summaries out of identity-based shortcuts
- keep economy migration scoped separately so the config-to-database roadmap stays focused on tenant and settings work

Primary roadmap file:

- `strategy/roadmaps/economy-ledger-redesign-roadmap.md`

Why this is next:

- this is the biggest remaining implementation slice, but it should start after the SaaS-readiness track stops leaving tenant and operator-policy ambiguity at the runtime boundary

Checkpoint to start this track cleanly:

- the current SaaS-readiness slice has already removed the main tenant-context ambiguity that would otherwise leak into economy records, pools, and summaries

#### 3. Shared API contract

Goal:

- stop frontend and backend payloads from drifting independently
- generate or publish one reviewable contract surface for route payloads and shared types
- keep transport, schema, and consumer typing aligned across repos

Status:

- started
- backend-owned contract artifacts now cover the challenge-submit token verification response, the public app-config bootstrap payload, the public stream-status read, the explorer token verification and access-grant responses, the explorer challenge list, delta, and detail reads, the challenge web-submission response, the push quote and push confirm responses, and the digout, disrupt, and challenge-removal responses
- backend-owned contract artifacts now also cover the admin dashboard pulse read
- backend-owned contract artifacts now also cover the operator-side public-app-config editor surface
- operator challenge execute now reports interrupted-session context and blocks duplicate execute requests against the currently running challenge
- generated browser contracts are exported into the webapp; the current classic-script frontend now consumes the challenge-submit, app-config, admin pulse, operator public-app-config, stream-status, explorer access, explorer challenge-read, explorer push-action, Explorer digout, Explorer challenge-removal, and Explorer disrupt artifacts as runtime guards

Primary roadmap file:

- `strategy/roadmaps/shared-api-contract-roadmap.md`

Execution rule for this track:

- keep this track close behind active backend route changes while the tenant model and operator surfaces are still moving, but do not let it outrank the remaining tenant-boundary work or the core economy migration

#### 4. Provider and ingress abstraction

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

### Later

#### 5. Frontend productization

Goal:

- define the shared SaaS-ready frontend base
- decide which surfaces stay pilot-specific versus reusable
- make the UI evolve by surface boundaries rather than one-off hacks

Outputs to produce when this track becomes active:

- component inventory
- route and surface inventory
- settings and operator UX roadmap

Checkpoint for promotion out of later:

- tenant policy boundaries, economy records, and the highest-risk route contracts are stable enough that frontend cleanup is productizing durable surfaces instead of transitional ones

#### 6. Runtime notifications

Goal:

- move challenge lifecycle notifications out of log-only stubs and into explicit delivery boundaries
- keep websocket fanout and provider-backed public messaging behind dedicated notification transport interfaces
- avoid scattering presentation-side delivery logic across challenge, stream, and route services

Primary roadmap file:

- `strategy/roadmaps/runtime-notification-roadmap.md`

Checkpoint for promotion out of later:

- challenge execution state, tenant ownership, and operator-action boundaries are stable enough that the notification transport is being designed around settled runtime events rather than moving targets

#### 7. Team onboarding and environment preparation

Goal:

- close the operational gaps that still rely on builder memory or direct handoff before a broader team starts using the current workspace

Primary checklist file:

- `strategy/roadmaps/team-onboarding-and-environment-preparation-checklist.md`

Checkpoint for promotion out of later:

- the current execution sequence has stopped shifting the basic local-development and operator workflow assumptions underneath new contributors

## Current status snapshot

Latest completed slice:

- explicit tenant-context cleanup now covers challenge mutation flows, challenge removal, auth-driven account creation, stats rendering, token duration caps, daily submission context, maintenance-state reads, and stream helper entrypoints that previously relied on one ambient default tenant
- operator-control safeguard hardening now covers the destructive operator challenge actions on the current admin surface: duplicate execute requests are rejected, and repeated status updates to the same target state are idempotent no-op success responses

Current execution rule:

- finish the active SaaS-readiness close-out slice before opening the next implementation-heavy migration slice that depends on tenant or operator-policy clarity
- keep separate tracks separate in documentation even when the implementation order is sequential