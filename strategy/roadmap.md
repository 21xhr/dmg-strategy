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

- turn the downloaded brainstorm dump into structured strategic material and keep durable ideas in focused documents

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
- legacy repos were archived and the public rename cleanup is complete
- the first workspace shell, app moves, and initial `contracts` plus `tooling` package seams are in place

### Operational setup baseline

Goal:

- document the current Render, GitHub Actions, and environment-separation baseline for production and staging
- keep the working setup concise enough that onboarding and operator steps can be maintained as current-state notes rather than a live roadmap

Status:

- completed enough to stop treating it as an active roadmap
- current reference lives in `strategy/roadmaps/team-onboarding-and-environment-preparation-checklist.md` and `strategy/roadmaps/render-production-staging-setup.md`

Completed outcome:

- production and staging Render services are deployed and healthy
- production and staging migrations run manually through GitHub Actions
- production and staging maintenance flows are split cleanly by GitHub environment
- the onboarding and environment-preparation notes read as current-state operator reference

## Active execution sequence

This section is ordered for execution, not just for topic grouping.

Use the dedicated roadmap files for detailed implementation notes, but use this index to decide what should happen now, what should start next, and what should stay deliberately later.

### Now

#### 1. Economy and ledger redesign

Goal:

- replace the legacy `User ID 1` world-ledger pattern with dedicated economy records
- move shared pools, balances, and summaries out of identity-based shortcuts
- keep economy migration scoped separately from the completed SaaS-readiness foundation

Primary roadmap file:

- `strategy/roadmaps/economy-ledger-redesign-roadmap.md`

Why this is now active:

- tenant and settings boundaries are explicit enough that the remaining work stops competing with the next implementation-heavy migration slice
- the SaaS-readiness foundation is complete enough for tenant-attributed economy records, pools, and summaries

Checkpoint to start this track cleanly:

- the SaaS-readiness foundation has already removed the main tenant-context ambiguity needed for economy records, pools, and summaries

#### SaaS-readiness foundation

Status:

- completed enough to stop competing with active execution priorities
- archived after tenant-context hardening, settings-ownership decisions, and runtime-authority boundaries became explicit enough for the next migration track

Archived records:

- `strategy/roadmaps/archive/2026-04-21-config-to-database-schema-roadmap.md`
- `strategy/roadmaps/archive/2026-04-20-config-to-database-roadmap.md`
- `strategy/roadmaps/archive/2026-04-18-drift-reduction-roadmap.md`

### Next

#### 2. Shared API contract

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
- public app-config and explorer access contracts now also surface demo-boundary metadata so browser UX can label demo-tenant rendering and demo-scoped Explorer datasets explicitly
- generated browser contracts are exported into the webapp; the current classic-script frontend now consumes the challenge-submit, app-config, admin pulse, operator public-app-config, stream-status, explorer access, explorer challenge-read, explorer push-action, Explorer digout, Explorer challenge-removal, and Explorer disrupt artifacts as runtime guards

Primary roadmap file:

- `strategy/roadmaps/shared-api-contract-roadmap.md`

Execution rule for this track:

- keep this track close behind active backend route changes while the tenant model and operator surfaces are still moving, but do not let it outrank the core economy migration

#### 3. Provider and ingress abstraction

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

#### 4. Frontend productization

Goal:

- define the shared SaaS-ready frontend base
- decide which surfaces stay pilot-specific versus reusable
- make the UI evolve by surface boundaries rather than one-off hacks

Outputs to produce when this track becomes active:

- component inventory
- route and surface inventory
- settings and operator UX roadmap

Checkpoint for promotion out of later:

- tenant policy boundaries, economy records, and the highest-risk route contracts are stable enough for frontend cleanup to focus on durable surfaces

#### 5. Runtime notifications

Goal:

- move challenge lifecycle notifications out of log-only stubs and into explicit delivery boundaries
- keep websocket fanout and provider-backed public messaging behind dedicated notification transport interfaces
- avoid scattering presentation-side delivery logic across challenge, stream, and route services

Primary roadmap file:

- `strategy/roadmaps/runtime-notification-roadmap.md`

Checkpoint for promotion out of later:

- challenge execution state, tenant ownership, and operator-action boundaries are stable enough that the notification transport is being designed around settled runtime events rather than moving targets

## Current status snapshot

Latest completed slice:

- the SaaS-readiness foundation is archived after tenant-context hardening, runtime-authority cleanup, and settings-ownership decisions became explicit enough to stop competing with active execution priorities
- explicit tenant-context coverage extends across challenge mutation flows, challenge removal, auth-driven account creation, stats rendering, token duration caps, daily submission context, maintenance-state reads, stream helper entrypoints, command ingress, and recurring background maintenance fanout
- operator-control safeguard hardening covers the destructive operator challenge actions on the current admin surface: duplicate execute requests are rejected, and repeated status updates to the same target state are idempotent no-op success responses

Current execution rule:

- keep the economy and ledger redesign as the primary implementation lane
- keep shared API contract work close behind active backend route changes without letting it outrank economy migration
- treat residual SaaS-readiness follow-up such as feature availability packaging, neutral capability vocabulary, and editor-shape polish as backlog or narrower follow-up work unless they reopen tenant-boundary ownership