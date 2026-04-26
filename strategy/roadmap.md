# Product Roadmap

## Purpose

This file is the clean roadmap index for work that should happen before the next major implementation wave.

It exists to separate:

- current product definition
- implementation roadmaps
- backlog items that are real but not yet shaped into a dedicated roadmap
- brainstorm material that still needs triage

## Placement note

Shareable documentation placement and instruction-boundary rules are defined in [documentation-system](../dmg-workspace/apps/docs/system-architecture/documentation-system.md).

This file is the roadmap index. When a new dedicated roadmap is created under `strategy/roadmaps/`, add it here.

## Roadmap writing rule

Write active roadmap files with enough signal that archive decisions do not depend on memory.

Each active roadmap should include:

- a current status snapshot
- explicit completion criteria or exit conditions
- concrete checkpoint signals or key metrics that make “mostly done” legible before archival review

When a roadmap reaches its completion criteria and the relevant code validation passes, archive it in `strategy/roadmaps/archive/` with a date-prefixed filename and remove it from the active execution sequence in the same slice.

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
- current reference lives in `strategy/operational-baseline.md` and `strategy/roadmaps/render-production-staging-setup.md`

Completed outcome:

- production and staging Render services are deployed and healthy
- production and staging migrations run manually through GitHub Actions
- production and staging maintenance flows are split cleanly by GitHub environment
- the onboarding and environment-preparation notes read as current-state operator reference

### Completed migration tracks

#### Economy and ledger redesign

Goal:

- replace the legacy `User ID 1` world-ledger pattern with dedicated economy records
- move shared pools, balances, and summaries out of identity-based shortcuts

Status:

- completed enough to archive after replay, diff, and guarded apply tooling landed
- the current replay tooling lives in `apps/api/src/services/economyReplayService.ts` and `apps/api/scripts/economyRebuild.ts`

Completed outcome:

- shared economy behavior is owned by dedicated economy records
- removal settlement metadata supports exact replay of `totalToPushers`
- tenant summary and pool repair can be run explicitly when needed

#### SaaS-readiness foundation

Status:

- completed and archived

Completed outcome:

- tenant-context hardening, settings-ownership decisions, and runtime-authority boundaries are explicit enough for the next migration track

## Active execution sequence

This section is ordered for execution, not just for topic grouping.

Use the dedicated roadmap files for detailed implementation notes, but use this index to decide what should happen now, what should start next, and what should stay deliberately later.

### Now

#### 1. Runtime notifications

Goal:

- move challenge lifecycle notifications out of log-only stubs and into explicit delivery boundaries
- keep websocket fanout and provider-backed public messaging behind dedicated notification transport interfaces
- avoid scattering presentation-side delivery logic across challenge, stream, and route services

Status:

- tracked in [strategy/roadmaps/runtime-notification-roadmap.md](roadmaps/runtime-notification-roadmap.md)
- session-completed and challenge-completed emission remain separate signals before transport fanout depends on them
- explicit payload mapping, websocket transport adapter, and active-subscriber bridge are in place for the runtime delivery boundary
- next suggested slice: add provider-backed public messaging policy for selected challenge lifecycle events

Why this is now active:

- the frontend productization track is complete and archived
- the notification boundary work can now move forward without reopening the shell boundary discussion

Checkpoint to start this track cleanly:

- notification transport boundaries stay explicit before presentation logic starts depending on them
- session-finalization events stay distinguishable from end-of-challenge events in the scheduler and notification hub
- farther move: split provider-backed public messaging policy from websocket delivery policy so each channel can evolve and throttle independently

## Completed surface tracks

### Frontend productization

Status:

- complete and archived in [strategy/roadmaps/archive/2026-04-25-frontend-productization-roadmap.md](roadmaps/archive/2026-04-25-frontend-productization-roadmap.md)

Completed outcome:

- the shared product shell covers the agreed public and product surfaces in the workspace repo
- Explorer uses the wide shell variant
- the shareable docs describe the shell in stable present-state language

## Current status snapshot

Latest completed slice:
- frontend productization roadmap archived after the shared product shell covered the agreed public and product surfaces and validation passed
- ingress abstraction roadmap archived after the Lumiastream and Discord bot provider adapters were proven against the shared normalized command contract
- shared API contract roadmap archived after the workspace contract tests and browser contract checks passed
- tenant economy replay, diff, and guarded apply tooling is in place and ready for archive review
- explicit tenant-context coverage extends across challenge mutation flows, challenge removal, auth-driven account creation, stats rendering, token duration caps, daily submission context, maintenance-state reads, stream helper entrypoints, command ingress, and recurring background maintenance fanout
- operator-control safeguard hardening covers the destructive operator challenge actions on the current admin surface: duplicate execute requests are rejected, and repeated status updates to the same target state are idempotent no-op success responses

Current execution rule:
- keep runtime notifications as the primary implementation lane
- keep frontend productization as archived reference unless it reopens surface-boundary questions
- treat completed migration tracks such as economy and ledger redesign and SaaS-readiness foundation as archived reference unless they reopen tenant-boundary ownership