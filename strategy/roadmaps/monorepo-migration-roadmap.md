# Monorepo Migration Roadmap

## Purpose

This roadmap now serves as the completion record for the DMG move out of the legacy multi-repo layout and into the current operating model.

That operating model is:

- one active engineering workspace in `/Users/mac/dmg-workspace`
- one private planning workspace in `/Users/mac/dmg-strategy`

The roadmap remains useful as a record of the package-seam decisions, migration order, and completion thresholds that shaped that move.

See the [roadmap index](../roadmap.md) for the active roadmap list.

Shareable documentation placement and repo-governance rules are defined in `/Users/mac/dmg-workspace/apps/docs/system-architecture/documentation-system.md`.

## Problem to solve

DMG currently lands cross-cutting slices across separate repositories.

That creates recurring friction in four places:

- one product slice can require synchronized commits across backend, webapp, and docs
- shared contract changes need generated artifacts copied across repo boundaries
- CI and review context are split even when the change is logically one unit of work
- future shared packages would need publication, versioning, or manual synchronization before they become usable

This cost stays acceptable while boundaries are still being discovered.

It becomes expensive once the product has stable shared surfaces such as contracts, shared config readers, or reusable frontend infrastructure.

## Core decision

The target operating model for a mature DMG product should be a monorepo with modular packages, not a permanently separate multi-repo setup.

The monorepo should preserve deployable boundary separation.

The goal is not one merged application. The goal is one review, build, and dependency graph for code that already changes together.

## Recommended target structure

Suggested top-level layout:

- `apps/api`
- `apps/web`
- `apps/docs`
- `packages/contracts`
- `packages/domain`
- `packages/config`
- `packages/tooling`
- `infra/`

Interpretation of those boundaries:

- `apps/api`: deployable backend runtime, route handlers, provider adapters, worker entrypoints, and Prisma usage
- `apps/web`: product frontend and any browser-side route consumption
- `apps/docs`: product, architecture, implementation, and other team-shareable documentation plus docs-specific scripts
- `packages/contracts`: backend-owned transport schemas and generated contract helpers
- `packages/domain`: shareable product rules that are truly wedge-neutral and transport-neutral
- `packages/config`: environment parsing, shared config assembly helpers, and stable cross-app config utilities
- `packages/tooling`: lint, build, codegen, generator scripts, and workspace-level developer tooling
- `infra/`: infrastructure configuration and deployment support assets that should version with the codebase

## Documentation confidentiality boundary

Do not assume that every note currently living in `dmg-doc` belongs in the future team-visible monorepo.

The monorepo docs app should contain documentation that future engineers and collaborators are expected to access as part of normal product work.

Keep confidential strategy, fundraising, contact-network, and other access-restricted material outside the shared monorepo in a separate private repo or another access-controlled system.

That rule also applies to mixed reference notes.

If a glossary, appendix, or reference file combines product or engineering terminology with private market, fundraising, or contact-specific terminology, split it before migration so `apps/docs` receives only the monorepo-safe part.

## Why this is the best mature-state configuration

This structure is stronger than a permanent multi-repo layout because it improves the exact areas DMG is already stressing:

- one pull request can cover backend contract changes, generated browser artifacts, and docs updates together
- shared packages do not need publication before use inside sibling apps
- CI can validate only affected packages while still seeing the whole dependency graph
- contract drift becomes easier to detect because source, generation, and consumption live in one workspace
- future frontend productization becomes easier because app code and shared packages can evolve together instead of by cross-repo copy or package-release choreography

This structure is stronger than a flattened monolith because deployment boundaries remain explicit.

The API, webapp, and docs can still deploy independently.

## What this roadmap is not

This roadmap is not a reason to pause current product work and perform a large migration immediately.

It is also not a recommendation to keep the current multi-repo layout forever.

The correct move is a staged migration once the shared boundaries are stable enough that the workspace graph will reflect real product structure rather than temporary experiments.

## Timing rule

Do not migrate before the shared boundaries are clear enough to deserve first-class packages.

Do not wait until every shared-contract roadmap item is complete either.

Recommended timing:

- continue the current shared API contract roadmap until at least one frontend-consumed challenge read family is contractized in addition to the current mutation and token slices
- keep the current backend-owned contract export path as the source of truth while the package boundaries are clarified
- start the monorepo migration once `contracts`, `tooling`, and the first frontend-productization boundary are concrete enough to move as named packages rather than vague future intentions

In practice, that means the monorepo migration should begin before the entire shared API contract roadmap is complete, but after the current contract system has proved its real package seams.

## Current status

For DMG as it exists now:

- the explorer challenge read family was enough to close the Phase 1 package-seam decision
- cross-repo friction is no longer the primary operating model for active engineering work
- the migration should now be treated as completed groundwork rather than an active execution track

The migration is no longer just strategically relevant.

It has already been executed where it mattered operationally.

The first mechanical move and first shared-package extraction now exist in the workspace:

- the current API repo is mirrored under `apps/api` with its current build, test, and contract-export flow preserved
- the current web repo is mirrored under `apps/web` with generated browser contracts still emitted under `js/generated`
- the future shared docs app under `apps/docs` contains only team-shareable product and engineering material, while strategy and other confidential notes remain outside the shell
- `packages/contracts` now contains the backend-owned contract modules and is imported by `apps/api` as a real workspace package
- `packages/tooling` now contains the workspace-level browser-contract export script instead of leaving that codegen path inside `apps/api`

The repo-boundary cleanup around that move is also now done:

- `dmg-workspace` and `dmg-strategy` are the active repos
- legacy repos are archived historical references rather than part of the active delivery path

## Phase 1 decision outcome

The current package-seam decisions are now concrete enough to record:

- workspace package manager: `pnpm`
- workspace task runner: Turborepo
- first package candidates: `packages/contracts` and `packages/tooling`
- initial contract ownership rule: contract schemas and builders remain backend-owned, but the exported contract surface is the first package candidate to relocate into `packages/contracts` during extraction
- initial tooling ownership rule: the contract-export script and related validation helpers are the first tooling candidates to relocate into `packages/tooling`

This is enough to begin workspace-shell preparation without pretending that every later shared package boundary is already mature.

It is also enough to stop treating the migration as one of the main active roadmap tracks.

## Phase 2 bootstrap contents

The first workspace shell should contain only the boundary-defining files needed to make the migration concrete:

- one root `package.json` with workspace-level build, test, lint, codegen, and dev scripts
- one `pnpm-workspace.yaml`
- one `turbo.json`
- placeholder app manifests under `apps/api`, `apps/web`, and `apps/docs`
- placeholder package manifests or boundary notes for `packages/contracts` and `packages/tooling`
- reserved directories for `packages/config`, `packages/domain`, and `infra`

That shell should stay intentionally mechanical.

It should not be used as an excuse to redesign the API, frontend, or docs application while the repos are still moving.

## Phase 1 - Stabilize package seams before moving repos

Goal:

- confirm which boundaries deserve first-class shared packages

Required signals:

- backend-owned contract generation is already the accepted source of truth
- at least one frontend-consumed challenge read family is migrated onto that contract surface
- the frontend direction for product surfaces is explicit enough to know whether shared browser packages should target classic-script compatibility temporarily or a TypeScript/module-based app structure

Outputs:

- package candidate list with clear ownership
- decision on workspace package manager and task runner
- decision on whether contract generation remains backend-owned but relocates into `packages/contracts`

## Phase 2 - Create the workspace shell

Goal:

- introduce the monorepo shell without changing runtime behavior yet

Recommended stack:

- `pnpm` workspaces for dependency management
- Turborepo for task graph, cache, and targeted CI execution

Outputs:

- root workspace manifest
- root task runner configuration
- app folders for `api`, `web`, and `docs`
- initial workspace scripts for build, test, lint, and code generation
- a short migration checklist that keeps app moves and first package extraction in a stable order

Execution rule:

- keep existing deployment outputs working during this phase
- do not combine migration with unrelated runtime rewrites

## Phase 3 - Move apps without redesigning them mid-flight

Goal:

- relocate the current repositories into `apps/` with minimal behavioral change

Execution rule:

- preserve current runtime entrypoints
- preserve current deployment expectations
- keep app-local dependencies isolated until shared packages are extracted intentionally

Outputs:

- `apps/api`
- `apps/web`
- `apps/docs`
- working root build and test commands

Current status:

- the shell now contains live app copies under `apps/`
- the docs move already follows the confidentiality boundary by excluding `strategy/` and other private material
- `apps/api` preserves its runtime entrypoints and exports browser contracts into `apps/web/js/generated`

Documentation move rule:

- move only the docs that are appropriate for the future shared engineering workspace
- keep private strategy and relationship material outside the monorepo even if it currently sits near product docs today

## Phase 4 - Extract the first real shared packages

Goal:

- move proven shared surfaces into packages only after their boundaries are already clear

Priority extraction order:

1. `packages/contracts`
2. `packages/tooling`
3. `packages/config`
4. `packages/domain` only for genuinely transport-neutral rules

Current status:

- `packages/contracts` is now the first proven extracted package
- `packages/tooling` is now the next extracted package for workspace-level contract export tooling
- `apps/api` imports the contract surface from that package instead of app-local contract modules
- the moved workspace build and browser-contract export flow succeed with those package boundaries in place

Review rule:

- do not create a `packages/shared` junk drawer
- if a candidate package does not have one clear responsibility, keep it in the app until it does

## Phase 5 - Rebuild CI around the workspace graph

Goal:

- make CI reflect the real dependency graph instead of treating each repo as an isolated black box

Targets:

- affected-package build and test execution
- stale generated artifact detection at workspace level
- one review surface for contract source, generated artifacts, and consumer updates
- deploy pipelines that can still target `api`, `web`, and `docs` independently

Status:

- partial as migration-specific work
- the workspace now has one local task graph through `pnpm` plus Turborepo, which was the important migration threshold
- further CI hardening should now be treated as ordinary workspace/platform evolution rather than as a blocker keeping monorepo migration active

## Phase 6 - Reduce transitional duplication

Goal:

- remove temporary cross-app glue once the workspace is stable

Examples:

- manual artifact-copy assumptions that only existed because repos were separate
- duplicated generator wrappers across apps
- compatibility shims that were only needed during repo consolidation

## Relationship to the shared API contract roadmap

The monorepo migration does not replace the shared API contract roadmap.

It makes that roadmap cheaper to continue.

Recommended rule:

- do not pause contract work to wait for the monorepo
- do not finish the entire contract roadmap first and only then start the monorepo
- overlap the two once the contract package seam is obvious and the frontend has at least one more real consumer family beyond the current token and mutation slices, such as the current stream-status read plus explorer read coverage

## Completion criteria

This roadmap is complete when:

- the codebase runs as one workspace with independent app deployments
- shared contract and tooling surfaces live as packages rather than cross-repo copy steps
- CI validates the workspace graph and generated artifacts coherently
- cross-cutting product slices no longer require synchronized multi-repo commit choreography

## Review rule

Reject migration plans that:

- move repos into one workspace but keep all shared logic duplicated
- create vague catch-all packages without clear ownership
- use the monorepo migration as a reason to redesign every app at once
- delay the migration until the codebase is much larger and the coordination cost is already entrenched