# Economy Ledger Redesign Roadmap

## Purpose


This file describes the migration path from the legacy `User ID 1` world-ledger pattern to dedicated economy records.

See the [roadmap index](../roadmap.md) for the current list of active roadmap tracks.

Documentation placement and repo-governance rules are defined in `system-architecture/documentation-system.md`.

It lives under `strategy/roadmaps/` because it mixes current-state inventory, target migration sequencing, and implementation-phase replacement work.

## Architecture to preserve

The target model is defined in `system-architecture/economy-model.md`.

The migration should preserve these core roles:

- explicit economy actors
- explicit shared pools
- explicit balances
- explicit transactions
- explicit economy policy
- explicit read-model summaries

Completion for this roadmap means shared economy behavior is fully owned by dedicated economy records, with the legacy `User ID 1` world-ledger and special `community_chest` account convention retired.

## Current state

The backend now has a first explicit tenant-scoped economy layer in code.

Today that means:

- dedicated `EconomyActor`, `EconomyPool`, `EconomyBalance`, `EconomyTransaction`, `EconomyPolicy`, and `EconomySummary` records exist in the schema
- challenge spend, removal settlement, and explorer-access spend already route through `economyService.ts`
- operator-facing pulse reads already use `EconomySummary`; the legacy `User ID 1` world-ledger is not the source for those totals
- active runtime spend, refund, and explorer-merit decisions use tenant-scoped economy records and `TenantUserState`
- the `User` schema carries identity and relationship data while tenant activity totals live in `TenantUserState`

## Current legacy touchpoints

### Bootstrap and seed paths

- `prisma/seedUsers.ts`

	Seeds tenant economy foundation records directly and resets the user identity sequence after explicit bootstrap inserts. The old `User ID 1` world-ledger artifact is removed from the active seed path.

- `prisma/seedPushes.ts`

	Records seeded push spending through explicit economy seed-adjustment records and applies those adjustments to the tenant that owns the seeded challenges.

### Reset and rebuild paths

- `prisma/resetDemoScope.ts`

	Removes demo-scope challenge and explorer spend from the demo tenant's economy summary and tenant shared fund pool. Remaining cleanup here is broader transaction-derived rebuild tooling if later reset flows need full economy recomputation.

### Runtime write paths

- `src/services/challengeRemovalService.ts`

	Removal settlement already records tenant-scoped economy transactions and summary updates without mirroring removal totals into legacy `User` counters.

- `src/services/challengeService.ts`

	Submission, push, digout, and disrupt spend paths already route through tenant-scoped economy spend helpers and tenant-scoped user-state counters. The remaining work here is follow-through cleanup around the current tenant-scoped path.

- `src/routes/tokenRoutes.ts`

	Explorer-access purchases already route through the economy layer, and explorer merit reads tenant-scoped spend from `TenantUserState`. The remaining work here is contract and coverage hardening around the current tenant-scoped path.

### Runtime read paths

- `src/routes/adminRoutes.ts`

	The pulse view already reads tenant-scoped totals from `EconomySummary`. Remaining read migration work is to remove any smaller compatibility reads that still depend on legacy counters in user-facing or maintenance paths.

### Schema surfaces

- `prisma/schema.prisma`

	The `User` model carries identity and relationship data. Tenant spend, refund, and activity totals live in `TenantUserState`, and shared economy state lives in economy actors, pools, balances, transactions, policy, and summaries.

## Status snapshot

### Completed or materially started

- Phase 1 schema introduction is complete
- Phase 2 runtime write migration is materially started and already covers the main spend, settlement, and explorer-merit decision paths
- Phase 3 balance and shared-pool migration is materially started because the active seed path uses tenant-scoped economy records directly
- Phase 4 read migration is materially started because admin pulse totals now use `EconomySummary`
- Phase 5 compatibility cleanup is materially started because legacy `User` economy fields are removed from the active schema

### Real remaining work

- decide whether any additional replay or repair commands are needed beyond the current diff/apply CLI
- decide whether the remaining rebuild-tooling work is narrow enough to move to backlog and archive this roadmap

### Current rebuild-tooling slice

A tenant-scoped replay and diff CLI now exists in the workspace repo, and the follow-up guarded apply mode now exists for explicit operator repair.

Implementation surfaces:

- `apps/api/src/services/economyReplayService.ts`
- `apps/api/scripts/economyRebuild.ts`

Current command boundary:

- `pnpm --filter dmg-api run economy:rebuild:diff -- --tenant-slug <slug>`
- `pnpm --filter dmg-api run economy:rebuild:apply -- --tenant-slug <slug> --confirm-tenant <slug>`
- alternate selector: `--tenant-id <id>`
- optional windowing: `--since <iso>` and `--until <iso>`
- operator or CI usage: `--json` and `--fail-on-diff`

Current scope:

- replay immutable `EconomyTransaction` history for one tenant
- project expected `EconomySummary` values from transaction history
- project expected shared-pool balances from source and destination balance movements
- diff those projections against the current tenant summary and pool-balance records without mutating live state
- allow explicit full-history repair of the tenant summary and shared-pool balances only when operator confirmation and apply gating are both present
- warn when older removal transactions do not carry enough metadata to replay `totalToPushers` exactly

Completion signal for this slice:

- one operator-safe audit command exists for tenant economy drift detection
- one separately gated apply command exists for explicit tenant repair workflows
- new removal settlements record enough metadata to support exact future replay for `totalToPushers`
- any later broader repair workflow still treats apply as an explicit operator action rather than a hidden side effect of diff mode

## Migration phases

### Phase 1 - Introduce dedicated economy records

Status:

- completed

Create the first explicit economy model set in the backend schema.

Minimum targets:

- actor record
- pool record
- balance record
- transaction record
- policy record
- summary read model

This phase should focus on schema clarity and scope boundaries, not full feature migration.

#### First schema slice

The first backend schema slice should be concrete enough to implement directly in Prisma.

It should introduce tenant-scoped economy records without waiting for the full feature migration to finish.

Slice boundary:

- introduce dedicated economy tables
- make tenant scope explicit on every economy record
- replace the special `community_chest` account convention with an explicit pool record
- support immutable movement history plus current-balance reads
- support the current operator pulse totals through an explicit summary record

The first slice should not require the full removal of legacy counters from `User` or `Account`. Those old fields may remain temporarily as compatibility surfaces while feature writes move over.

Tenant scoping rule:

- every first-slice economy record should carry `tenantId`
- do not introduce a new global economy singleton table
- old global counters may continue temporarily for compatibility, but the new economy model should start from explicit tenant scope

Recommended model set:

##### `EconomyActor`

Purpose:

- identify the economy participant that spends, receives, or is adjusted

Fields:

- `id`
- `tenantId`
- `actorType` enum
- `userId` nullable
- `accountId` nullable
- `systemKey` nullable
- `createdAt`
- `updatedAt`

First-slice actor types:

- `USER`
- `ACCOUNT`
- `SYSTEM`

Constraints:

- exactly one of `userId`, `accountId`, or `systemKey` should be populated
- `tenantId` plus `userId` should be unique when `userId` is present
- `tenantId` plus `accountId` should be unique when `accountId` is present
- `tenantId` plus `systemKey` should be unique when `systemKey` is present

Notes:

- use `USER` actors for player-level spending and refunds
- use `ACCOUNT` actors only when a platform-specific balance must be represented separately from the user
- use `SYSTEM` actors for explicit non-user participants such as seeded bootstrap behavior or operator-side adjustments

##### `EconomyPool`

Purpose:

- represent a shared fund that should not be stored in a user row or account row

Fields:

- `id`
- `tenantId`
- `poolKey`
- `poolType` enum
- `displayName`
- `platformName` nullable
- `externalScopeId` nullable
- `createdAt`
- `updatedAt`

First-slice pool types:

- `COMMUNITY_CHEST`
- `SHARED_TENANT_FUND`

Constraints:

- `tenantId` plus `poolKey` should be unique

Notes:

- the first migration should seed one `COMMUNITY_CHEST` pool per tenant
- `platformName` and `externalScopeId` stay nullable so the first slice can support tenant-wide pools immediately and narrower community pools later without inventing another special user convention

##### `EconomyBalance`

Purpose:

- store the authoritative current amount for one actor-owned or pool-owned balance

Fields:

- `id`
- `tenantId`
- `ownerType` enum
- `actorId` nullable
- `poolId` nullable
- `balanceType` enum
- `amount`
- `createdAt`
- `updatedAt`

First-slice owner types:

- `ACTOR`
- `POOL`

First-slice balance types:

- `AVAILABLE`

Constraints:

- exactly one of `actorId` or `poolId` should be populated
- `tenantId` plus `actorId` plus `balanceType` should be unique when `actorId` is present
- `tenantId` plus `poolId` plus `balanceType` should be unique when `poolId` is present

Notes:

- use `BigInt` for `amount`
- keep balances mutable and current-state only
- do not treat balances as the historical ledger; the immutable history belongs in `EconomyTransaction`

##### `EconomyTransaction`

Purpose:

- record one immutable posted movement of value between explicit balances

Fields:

- `id`
- `tenantId`
- `transactionType` enum
- `settlementGroupKey` nullable
- `sourceBalanceId` nullable
- `destinationBalanceId` nullable
- `amount`
- `referenceType` enum
- `referenceId` nullable
- `challengeId` nullable
- `metadata` nullable
- `occurredAt`
- `createdAt`

First-slice transaction types:

- `SUBMISSION_SPEND`
- `PUSH_SPEND`
- `DIGOUT_SPEND`
- `DISRUPT_SPEND`
- `REMOVAL_REFUND`
- `REMOVAL_FORFEIT`
- `EXPLORER_ACCESS_SPEND`
- `MANUAL_ADJUSTMENT`
- `SEED_ADJUSTMENT`

First-slice reference types:

- `CHALLENGE`
- `TOKEN_PURCHASE`
- `SEED`
- `MANUAL`
- `SYSTEM`

Constraints:

- `amount` should be stored as `BigInt` and should always be positive
- one transaction row should represent one posted movement between exactly one source and one destination
- split settlements should be modeled as multiple transaction rows that share the same `settlementGroupKey`
- mint-like or burn-like adjustments may leave one side null, but ordinary transfers should set both balance references

Notes:

- use `challengeId` when the economy event is challenge-related so runtime reads do not need to decode that from JSON metadata
- `referenceId` should carry the domain record identifier for non-challenge flows such as explorer-access purchases or seed batches
- `metadata` may carry audit detail, but core routing should not depend on opaque JSON if a first-class field already exists

##### `EconomyPolicy`

Purpose:

- store economy routing and split rules outside feature handlers

Fields:

- `id`
- `tenantId`
- `policyKey`
- `isEnabled`
- `config`
- `createdAt`
- `updatedAt`

First-slice policy keys:

- `REMOVAL_SETTLEMENT`
- `COMMUNITY_CHEST_ROUTING`

Constraints:

- `tenantId` plus `policyKey` should be unique

Notes:

- `config` may remain JSON in the first slice so the migration does not need a large policy-table explosion
- policy records should still be explicit and named even when the configuration body is small

##### `EconomySummary`

Purpose:

- provide the first explicit read model for operator and admin totals that currently come from `User ID 1`

Fields:

- `id`
- `tenantId`
- `grossNumbersSpent`
- `totalNumbersReturnedFromRemovals`
- `totalToCommunityChest`
- `totalToPushers`
- `totalChallengesSubmitted`
- `lastTransactionAt` nullable
- `lastRebuiltAt` nullable
- `createdAt`
- `updatedAt`

Constraints:

- `tenantId` should be unique

Notes:

- this first slice should start with one tenant-scoped summary row that mirrors the totals currently needed by operator views
- additional summary tables can be added later, but the first slice should already make admin pulse reads independent from the special ledger user

First-slice conventions:

- use `BigInt` for all persisted economy amounts and totals
- keep transaction history immutable
- keep balances and summaries mutable read models derived from transactions and settlement logic
- seed shared pools explicitly and keep them separate from accounts and users
- create actors lazily when a tenant-scoped economy participant first appears if a full backfill is unnecessary
- do not add new shared-ledger meaning back onto `User`, `Account`, `Challenge`, or other feature tables

Direct implementation target:

- `EconomyActor`
- `EconomyPool`
- `EconomyBalance`
- `EconomyTransaction`
- `EconomyPolicy`
- `EconomySummary`
- actor, pool, owner, balance, transaction, and reference enums needed by those models

That schema slice is sufficient to begin routing writes away from `User ID 1` while keeping the later feature migration phases separate.

### Phase 2 - Route new writes through the economy layer

Status:

- materially started
- challenge spend, removal settlement, and explorer-access spend already route through the economy layer
- seed push adjustments now route through the economy layer as well
- explorer merit decisions now use tenant-scoped spend through tenant-scoped records
- seeded push adjustments and demo-scope resets use the tenant that owns the seeded activity
- remaining work is concentrated in rebuild tooling and archival review rather than active runtime migration

Replace direct shared-counter writes in runtime flows.

Priority write paths:

- challenge submission
- push execution
- digout execution
- disrupt execution
- removal settlement
- explorer-access purchases
- seed-generated spending where the seed currently simulates finalized economy activity

During this phase, it is acceptable to keep legacy counters temporarily synchronized if a compatibility bridge is required.

### Phase 3 - Move balances and shared pools off identity tables

Status:

- partially complete
- explicit pools and balances exist, and the active seed path uses tenant-scoped economy records directly
- reset tooling and seeded push accounting use tenant-scoped pool balances directly

Replace the special `community_chest` account convention and stop using identity rows as shared fund holders.

This phase should leave:

- user and account records responsible for identity and user-facing balances only
- shared pools and shared balances owned by dedicated economy records

### Phase 4 - Move reads to explicit economy summaries

Status:

- materially started
- admin pulse already reads from `EconomySummary`
- remaining work is to remove smaller legacy reads and rebuild assumptions outside the main operator pulse

Replace operator and system reads that still depend on `User ID 1` counters.

Priority targets:

- admin pulse and health views
- any internal dashboard totals
- any reset or maintenance flow that rebuilds shared totals from identity rows

### Phase 5 - Remove legacy compatibility

Status:

- not complete
- the main remaining gap is rebuild tooling for bulk recomputation or cleanup paths that may need to derive summaries from explicit economy records

Delete the remaining `User ID 1` world-ledger assumptions and the `community_chest` sink convention.

Completion criteria:

- no runtime write path updates shared economy totals on `User ID 1`
- no runtime read path depends on `User ID 1` for shared economy summaries
- no reset or seed path needs `recomputeGlobalLedger()`
- shared pool balances live in dedicated economy records

## Review rule

When implementing this roadmap, reject migration slices that:

- add new writes to `User ID 1`
- create another special-case account when a pool model already fits the behavior
- store shared economy state in a feature table for convenience
- introduce new product-currency behavior without routing it through the same economy transaction boundary