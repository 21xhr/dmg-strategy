# Config To Database Schema Roadmap

Archived on 2026-04-21 after tenant-context hardening, runtime-authority cleanup, and settings-ownership decisions finished the SaaS-readiness foundation as an active execution lane. Residual follow-up stays in backlog items or in later tracks such as economy-ledger redesign and tenant feature-availability governance.

## Purpose

This file is the archived schema-planning record for the config-to-database migration.

It lives in the planning repo because it is roadmap and design work, not an executable Prisma artifact. Documentation placement and repo-governance rules are defined in `system-architecture/documentation-system.md`.

The API repo should contain the real schema, migrations, and seed logic once implementation starts.

## Recommended model set

### `Tenant`

Purpose:

- one streamer space
- one SaaS workspace
- one service business account
- one internal organization workspace

Suggested fields:

- `id`
- `slug`
- `displayName`
- `tenantType`
- `createdAt`
- `updatedAt`

Suggested enum values to discuss before implementation:

- `STREAMING`
- `SAAS`
- `SERVICE_BUSINESS`
- `INTERNAL_ORGANIZATION`

`INTERNAL_ORGANIZATION` covers internal decision environments such as a department, company, association, institution, or other structured organization.

### `TenantMembership`

Purpose:

- connect users to tenants
- store tenant-scoped roles without duplicating users

Why it must be separate from `Tenant`:

- one user can belong to many tenants
- one tenant can have many users
- the relationship itself carries meaning such as role and primary operator status

That makes `TenantMembership` a normal many-to-many join model with role data on it.

Suggested fields:

- `id`
- `tenantId`
- `userId`
- `role`
- `isPrimaryOperator`
- `createdAt`

Suggested enum:

- `OWNER`
- `ADMIN`
- `MEMBER`
- `VIEWER`

### `TenantConfig`

Purpose:

- store tenant-scoped rules and defaults
- keep provider connection data out of config rows

Suggested fields for the first migration step:

- `id`
- `tenantId` with unique constraint
- `submissionBaseCost`
- `pushBaseCost`
- `explorerStandardCost`
- `explorerMeritCost`
- `explorerAccessStepMinutes`
- `liveDiscountMultiplierNumerator`
- `discountDivisor`
- `sessionDurationMinutes`
- `createdAt`
- `updatedAt`

`tenantId` with a unique constraint means:

- `TenantConfig.tenantId` is a foreign key pointing to `Tenant.id`
- each tenant can have at most one current config row in this first design

It is a one-to-one extension table, not a duplicate identifier.

By contrast, `TenantMembership.tenantId` also points to `Tenant.id`, but it is not unique because many members can belong to one tenant.

### `TenantConnection`

Purpose:

- represent integrations connected to a tenant
- isolate provider-specific connection state from generic settings
- hold small tenant-scoped runtime metadata while the product is still converging on its final domain/runtime model

Suggested fields:

- `id`
- `tenantId`
- `providerName`
- `externalChannelId`
- `externalChannelLabel`
- `status`
- `connectionMetadata` as JSON
- `createdAt`
- `updatedAt`

Boundary note:

- `TenantConnection` is an acceptable temporary home for lightweight frontend runtime metadata such as one resolved frontend base URL or allowed-origin list
- if custom domains become a first-class tenant feature, especially with verification, certificate, redirect, or multi-domain policy, that should likely move to a dedicated model such as `TenantDomain` or `TenantHostBinding`
- that staged feature path is documented separately in `strategy/roadmaps/tenant-custom-domain-roadmap.md`

## First Prisma change sequence

1. add `TenantType`
2. add `TenantMembershipRole`
3. create `Tenant`
4. create `TenantMembership`
5. create `TenantConfig`
6. create `TenantConnection`
7. seed one default tenant for the current streaming MVP
8. attach the current operator user to that tenant as `OWNER` when that user exists
9. keep current `User` and `Account` tables intact in the first migration

If the first migration happens before there is any real operator user in the database, the practical initial data can simply be:

- one seeded `Tenant`
- one seeded `TenantConfig`
- zero `TenantMembership` rows until the first operator identity exists

## Why tenant-owned domain records should link to `tenantId` later

That relation should exist.

`Challenge` and `Stream` are the current implementation examples, but the principle is broader: tenant-owned operational records should carry direct tenant linkage.

It is listed later because it changes existing domain tables and usually requires data backfill or migration logic.

The safer sequence is:

1. create tenant layer
2. create tenant config and membership
3. seed initial tenant
4. then attach domain records once the tenant model is stable

Even if the current database is still early, that staged migration keeps the first step smaller and easier to validate.

## Internal actor marker note

`GAME_MASTER` in the current `PlatformName` enum does not represent tenant ownership.

It behaves more like an internal actor marker for cases such as the current community chest sink account.

That is separate from tenant membership and tenant role design.

It is worth reviewing later.

## Current Prisma defaults audit

Most current schema defaults are structurally safe.

Examples:

- timestamps using `now()`
- booleans such as `isExecuting = false`
- counters initialized to `0`

The two defaults that look closest to business-rule defaults today are:

- `Challenge.pushBaseCost @default(21)`
- `Challenge.cadenceRequiredCount @default(1)`

Those are the main defaults to move out of hidden schema behavior once tenant config becomes real.

`Account.currentBalance @default(0)` is acceptable as a structural starting state in the current schema, but the initial-balance policy itself should move toward tenant-configurable setup rather than staying only as a code constant.

## Seeded row versus backend fallback

These two ideas are complementary, not contradictory.

Seeded row:

- a real `TenantConfig` row inserted for a tenant during migration, seeding, or controlled setup

Backend fallback:

- one explicit code path that defines what happens if a tenant config row is unexpectedly missing

The ideal steady state is seeded config rows for all active tenants.

The backend fallback exists as operational safety, not as the primary business-rule store.

## Settings ownership decision snapshot

The current split is clear enough to treat as the working model for the remaining SaaS-readiness lane.

### Tenant-backed public runtime config

These belong in tenant-editable public runtime config because they shape browser-visible behavior, link generation, or public branding for one tenant:

- frontend base URL
- allowed browser origins
- share handle
- share hashtags
- Ko-fi username and derived donation embed override

### Tenant-backed operating policy

These belong in tenant-manageable operating policy because they shape one tenant's participation, pricing, pacing, and ledger behavior without crossing into private operator security.

- participant starting balance and reset cadence
- execution-unit duration for tenant activity windows
- entry, escalation, and spend controls for tenant actions
- tenant-scoped access-step timing and entitlement thresholds
- tenant-scoped pricing modifiers and settlement ratios

Current implementation examples include `initialBalance`, `dailyResetHourUtc`, `sessionDurationMinutes`, `submissionBaseCost`, `pushBaseCost`, `pushQuoteLimit`, `disruptCost`, `explorerStandardCost`, `explorerMeritCost`, `explorerAccessStepMinutes`, `demoExplorerGrantUnitCap`, `explorerMeritThreshold`, `liveDiscountMultiplierNumerator`, `digoutPercentageNumerator`, and `removalRefundPercentageNumerator`.

### Owner-sensitive tenant policy

These belong in owner-only tenant policy because they affect tenant security posture or issuance authority more than routine tenant operations:

- operator-issued demo-token enablement
- demo token TTL
- max token duration

### Private operator-session policy

These belong in the separate owner-only session-policy surface because they control privileged dashboard session lifetime, not public runtime behavior or tenant operating policy:

- admin session duration override

### Internal bootstrap or support configuration

These should stay outside normal tenant-editable policy surfaces unless a later product requirement justifies promoting them:

- system token and admin-session caps
- default fallback durations used when a tenant override is absent
- static bootstrap defaults that exist only as migration or operational safety rails
- cron secrets, database credentials, and other deployment-only infrastructure settings
- support-only or operational feature gates such as whether public challenge detail pages stay open, are disabled, or sit behind a password wall until a broader tenant feature-availability model is shaped

The main remaining governance task is to gather per-tenant availability and activation switches into one explicit feature-availability layer so broader product capability packaging does not stay coupled to the current streaming-wedge mechanic vocabulary.