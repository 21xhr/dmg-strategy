# Monorepo Phase One Bootstrap Checklist

## Purpose

This checklist turns the first monorepo migration pass into a mechanical sequence instead of an open-ended redesign.

Use it alongside `strategy/roadmaps/monorepo-migration-roadmap.md`.

## Bootstrap order

1. Create the root workspace shell.
2. Move the three current repos into `apps/` with minimal behavior change.
3. Re-run current build, test, and export commands from their new app locations before extracting any package.
4. Extract `packages/contracts` only after the moved apps still pass their current workflows.
5. Extract `packages/tooling` only after the contract package boundary is proven by real code movement.

## Root shell checklist

- add one root `package.json`
- add one `pnpm-workspace.yaml`
- add one `turbo.json`
- define placeholder manifests for `apps/api`, `apps/web`, and `apps/docs`
- reserve directories for `packages/contracts`, `packages/tooling`, `packages/config`, `packages/domain`, and `infra`

## App move checklist

### `apps/api`

- preserve current runtime entrypoints
- preserve Prisma layout
- preserve `npm run build`, `npm test`, and contract export behavior before package extraction

### `apps/web`

- preserve current classic HTML and script entrypoints
- preserve generated contract output under `js/generated`
- preserve the existing dev-server workflow until frontend productization changes it intentionally

### `apps/docs`

- preserve tracked-note structure and documentation governance
- preserve current scripts and hooks locally until a real shared tooling boundary exists

## First extraction checklist

### `packages/contracts`

- move only the exported transport contract surface first
- keep backend ownership of schema truth explicit
- do not introduce a second handwritten contract definition

### `packages/tooling`

- move contract export scripts only after the contracts package is stable
- move validation helpers that support generated artifact checks
- keep app-local build logic in the apps until it becomes truly shared

## Review rule

Reject a Phase 1 migration pass that:

- combines repo movement with frontend or backend redesign
- extracts a catch-all shared package without one clear responsibility
- breaks existing build, test, or generated-artifact workflows before the app move is stable