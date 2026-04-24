# Config To Database Roadmap

## Purpose

This roadmap captured the first SaaS-readiness migration path for tenant-backed runtime settings, operator policy boundaries, and public app-config ownership.

Archived on 2026-04-20 after the final private operator-session close-out lane completed and the remaining naming or editor polish was moved back into backlog-level cleanup.

Archive outcome:

- tenant-backed runtime settings, public runtime config, operator policy, owner policy, and private session-policy ownership boundaries are explicit enough to stop treating this as an active roadmap
- admin bootstrap compatibility cleanup and the last high-value browser timing drift in this lane were finished before archiving

See the [roadmap index](../roadmap.md) for the current active execution order.

## Core model to preserve

Keep the current identity split:

- `User`
  one internal DMG person identity
- `Account`
  one linked external account or platform identity

The missing layer is not a streamer-specific table.

Use `Tenant`.

That is the clearest long-term name for the operator space.

## Why the generic tenant model matters

Do not scale by creating one product model for streaming, one for SaaS, and one for each B2B vertical.

That creates exponential technical debt because every new market increases the maintenance surface.

The generic tenant model scales horizontally instead of multiplying product-specific schema and code paths.

With the generic model:

- one streamer can operate one tenant
- one business can operate one tenant
- one person can belong to multiple tenants
- one tenant can configure its own rules without forking the product

## Scope of this roadmap

This roadmap is not a full multi-tenant rebuild.

It is the first SaaS-readiness migration path.

## Target outcome

The system should load tenant-overridable runtime settings from the database instead of relying only on static config files.

First candidates:

- submission base cost
- push base cost
- explorer pricing
- session duration
- current balance (for initial balance)
- selected operator-facing feature flags

## Current roadmap shape

This roadmap is no longer at the purely forward-looking stage.

Several major migration slices are already implemented, the final close-out lane is complete, and the roadmap is now archive-ready.

The clearest reading order is therefore:

1. completed foundation work
2. remaining major migration work
3. completed final hardening and launch cleanup

## Status snapshot

### Completed foundation work

- tenant settings model exists through `Tenant`, `TenantMembership`, `TenantConfig`, and `TenantConnection`
- backend settings resolution exists and is reused across request flows
- core business-rule reads now resolve from effective tenant settings rather than only from static config
- privileged operator routes now use tenant membership and server-issued admin sessions
- public tenant bootstrap config now flows through `GET /api/v1/references/app-config`
- public tenant copy, public links, branding values, and browser timing values now live behind tenant-backed app-config payloads
- the admin dashboard can now view and edit the current public tenant app-config contract
- tenant push quote policy now resolves under a system safety cap
- demo scope is now explicit in seed and reset flows instead of remaining an ambient product-wide assumption
- maintenance state is now tenant-scoped instead of using one shared product maintenance record

### Remaining major migration work

- governance-tier separation is implemented at the baseline level: public runtime config, operator-manageable tenant policy, owner-only tenant policy, and internal bootstrap values no longer share one mixed editor
- Explorer entitlement state is tenant-scoped on `TenantUserState` instead of living as ambient access on the global `User` record
- `Challenge` and the main maintenance or operator lifecycle paths already carry explicit tenant scope

The remaining major work is therefore one final close-out sequence:

1. close the last bootstrap-era access assumptions by moving admin-session lifetime and related private operator-session rules behind explicit private policy surfaces
2. finish launch cleanup by retiring compatibility paths and removing the remaining high-value literal or fallback drift that would otherwise reopen mixed-surface behavior later

#### Ordered execution detail

**Completed slice: Deploy and runtime authority cleanup**

Status snapshot:

- tenant and domain-aware runtime resolution exists
- non-local secure link generation now requires explicit tenant frontend runtime configuration instead of falling back to the request host
- local-development loopback and LAN defaults remain the only deliberate fallback path

Completion criteria:

- production runtime URLs resolve from explicit tenant or domain-aware configuration rather than silent bootstrap defaults
- allowed-origin and frontend-base-url behavior has one authoritative resolution path plus a deliberate local-development exception only
- shareable docs and operator guidance describe the same runtime authority model without explaining it through migration history

**Completed slice: Tenant user-state and stats read model**

Status snapshot:

- tenant-scoped maintenance counters, Explorer entitlement, progression totals, and refund-facing stats now live on `TenantUserState`
- DMG-wide `User` fields remain internal-only and are not part of tenant-visible operator or player stats reads
- the admin user-stats surface and tenant-facing submission feedback use tenant-scoped totals directly

Completion criteria:

- the roadmap explicitly classifies which user fields stay DMG-global versus which ones gain tenant-scoped companions or derived stats views
- a tenant user-stats surface can read one durable model without service-specific reconstruction logic leaking into each caller
- future tenant-only entitlements or privacy rules can attach to tenant-scoped state without reopening global user semantics each time

**Completed slice: Structured role-scoped admin surfaces**

Status snapshot:

- the baseline governance split is implemented in route, contract, and admin UI form
- the admin UI exposes session role visibility explicitly and includes a dedicated tenant user-stats surface
- tenant user stats now resolve through a dedicated operator read route and contract instead of sharing the admin-session route family
- a backend-owned surface-access manifest defines dashboard card visibility and editability for the active session
- a support/read admin role can inspect read surfaces without inheriting operator write access
- the long-term target is many admins with different access boundaries, not one permanent two-role shortcut

Completion criteria:

- public runtime config, operator policy, owner policy, and future stats or support surfaces each keep separate contracts and route ownership
- additional admin roles can gain narrower views without reopening the mixed-surface problem
- higher-sensitivity fields remain isolated enough to support future per-user privacy or policy slicing on demand

**Completed slice: Shared operator vocabulary baseline**

Status snapshot:

- shareable glossary and naming rules now define tenant, tenant operator, owner, admin session, public runtime config, operator policy, owner policy, and private operator-session policy explicitly
- shareable docs no longer need to lean on legacy gamemaster wording to describe privileged surfaces
- comparison-led wording checks are narrowed so direct current-state writing is enforced without turning every comparative sentence into a false positive

Completion criteria:

- shareable docs have one durable vocabulary source for the main privileged-surface and policy terms
- future route, UI, and policy work can reuse those terms without re-explaining them from scratch in each slice
- later code renames such as route-family naming cleanup can be evaluated against one explicit vocabulary baseline instead of ad hoc wording preferences

**Completed slice: Route-family naming cleanup plan**

Status snapshot:

- the current HTTP boundary already separates `/api/v1/admin/session` and `/api/v1/admin/pulse` from `/api/v1/operator/*`
- file and module names still compress those responsibilities into broader `adminRoutes` and `operatorRoutes` labels
- the vocabulary baseline now gives the rename work an explicit boundary vocabulary instead of leaving it to taste or drift

Completion criteria:

- the near-term rename plan keeps the current external HTTP path split stable while clarifying internal module naming later
- `adminRoutes.ts` has a clear first rename target when the session and monitoring concerns need separate ownership
- `operatorRoutes.ts` stays the umbrella name until there is real pressure to split read, policy, or action families into narrower route modules

Planned rename order:

1. keep `/api/v1/admin/*` and `/api/v1/operator/*` path behavior stable during the naming pass unless a later launch cleanup needs alias removal
2. rename internal files and imports before considering any public route-path rename
3. split `adminRoutes.ts` toward `adminSessionRoutes.ts` or another explicit session-plus-monitoring name only when that boundary earns its own module
4. keep `operatorRoutes.ts` as the umbrella until there is enough behavior to justify narrower modules such as operator-surface, operator-policy, or operator-action routes

**Completed slice: Private operator-session policy and roadmap close-out**

Status snapshot:

- tenant membership already drives admin session role resolution
- a private owner-only session-policy surface controls admin-session lifetime per tenant under a system ceiling
- admin session issuance resolves only through verified tenant operator identity and tenant membership
- route-family naming now has an explicit internal rename plan, so the remaining work no longer depends on unresolved naming debates
- admin session bootstrap now accepts only the tenant operator token shape used by the stable login flow
- the browser submit flow no longer carries page-level timing fallbacks for token reverification or Explorer polling when app-config already provides those values

Completion criteria:

- legacy bootstrap admin-secret compatibility is retired
- admin-session lifetime and related private access controls live behind explicit private operator policy instead of ambient bootstrap constants
- session policy hardening can proceed without reopening tenant config governance or user-state boundaries
- the remaining cleanup list is narrow enough that any leftover naming or editor polish can move to backlog instead of keeping this roadmap open

Checkpoint signals:

- privileged admin access no longer depends on bootstrap secret compatibility
- admin-session duration policy is private and tenant-scoped rather than ambient bootstrap config
- the remaining config-to-database work is limited to backlog-level polish or to other focused roadmaps such as economy, domain runtime, or custom-domain work

Archive signal:

- this roadmap is now archive-ready because the remaining work no longer changes where runtime settings, admin policy, or tenant context are owned

#### Completed safeguard slice

- the current admin action forms were mapped to the real mutation endpoints instead of treating the safeguard pass as a hypothetical control list
- `POST /api/v1/operator/challenge/execute` remains the reference pattern for destructive operator controls because it rejects duplicate execute requests against the challenge that is already running
- `PUT /api/v1/operator/challenge/:challengeId/status` now has an explicit replay policy: repeated requests to the same target status return an idempotent no-op success instead of replaying writes or duplicate event publication
- the current admin UI trigger points remain `operator-execute-form` and `operator-status-form`, with the server-side contract treated as the primary safeguard layer
- `GET /api/v1/admin/pulse`, `GET/POST/DELETE /api/v1/admin/session`, and `GET /api/v1/operator/public-app-config` remain out of scope for this slice because they are read or auth flows rather than destructive operator controls
- `PUT /api/v1/operator/public-app-config` remains configuration mutation work and should only enter this safeguard lane later if it needs distinct save-conflict or concurrency rules

Checkpoint signals now satisfied:

- repeated destructive actions have a documented server-side policy instead of only a UI-level expectation
- the current operator route inventory clearly distinguishes destructive challenge actions from configuration mutation and read-only admin flows
- operator safeguard follow-up work is narrow enough to live under specific settings, policy, or route slices
- this roadmap can move back to tenant-context resolution and config-governance cleanup as the main remaining dependency work

#### Challenge tenant migration plan

Status snapshot:

- main schema and runtime hardening slice implemented
- `Challenge` carries explicit `tenantId`, transient quote records are tenant-scoped explicitly, and maintenance fanout updates tenant-scoped user activity
- challenge lifecycle isolation is no longer the active dependency risk inside this roadmap; the remaining dependency work is runtime fallback cleanup plus tenant stats and session policy boundaries

Completion criteria:

- `Challenge` stores `tenantId` directly and backfills existing rows safely
- challenge creation writes `tenantId` from resolved tenant settings instead of inferring tenant scope only through the proposer relationship
- high-risk lifecycle reads and writes reject or skip cross-tenant rows by filtering on `tenantId`
- background session ticking and operator challenge controls operate on tenant-scoped challenge queries instead of global executing-challenge assumptions
- demo reset and seed helpers stop inferring challenge scope indirectly from proposer membership alone

Execution order:

1. add `Challenge.tenantId` with a backfill rule that prefers the proposer's primary tenant membership and otherwise falls back to the first tenant row
2. update challenge creation, demo reset filters, and seed or reset helpers so all new challenge rows are written with explicit tenant scope
3. convert the most exposed runtime paths to tenant-scoped queries first: operator execute, operator status update, active challenge reads, session tick, stream finalization, archival, and public explorer reads
4. move maintenance and cadence enforcement onto tenant-scoped challenge queries so background workflows stop depending on one global challenge set
5. close the remaining action paths that still touch challenges through global identifiers only, including push, digout, and removal settlement validation
6. only after the challenge lifecycle is tenant-safe, decide whether quotes or other adjacent tables also need explicit tenant keys for stronger isolation and easier indexing

Checkpoint signals:

- no live entrypoint that mutates a challenge can operate without a tenant-backed runtime
- no operator route can execute or change the status of a challenge outside the current tenant
- public challenge feeds and detail reads are filtered by the resolved tenant instead of only by demo-user shape
- the remaining work is narrowed to secondary hardening rather than the primary schema boundary

Current follow-up focus:

- keep any later naming, wording, or editor-shape polish in backlog unless it reopens runtime-settings ownership or privileged-policy boundaries
- leave future tenant-domain, economy, or admin-surface evolution to their own focused roadmaps rather than extending this one again

### Boundary with the economy roadmap

The first dedicated economy slice now exists in code, so this roadmap no longer blocks economy Phase 1.

The remaining dependency rule is narrower:

- keep tenant settings and tenant context readable and explicit wherever economy flows need them
- keep public config, operator-private policy, and internal bootstrap behavior separated instead of collapsing them back together during cleanup work

This roadmap should stay focused on settings and tenant-policy boundaries, while economy pool, balance, transaction, and summary migration remains in `strategy/roadmaps/economy-ledger-redesign-roadmap.md`.

Not blockers for ongoing economy cleanup:

- structured operator settings-editor replacement
- later admin-surface polish that does not reopen policy ownership boundaries

These remain valid follow-up work, but they do not need to delay the remaining economy migration slices.

Execution rule:

- keep the remaining config-to-database follow-up work in this roadmap rather than folding it into economy migration
- treat explicit tenant-context resolution as the main shared dependency boundary with other active tracks
- keep the completed safeguard slice documented here as the current operator-control baseline, but treat explicit tenant-context resolution as the active dependency work now

### Final hardening and launch cleanup

- tenant operator token login is now the only supported admin bootstrap path
- admin session lifetime now lives behind a private owner-only operator session policy surface
- the last page-level timing fallbacks identified in this roadmap were removed so browser timing reads flow through app-config helpers
- any residual polish should stay in backlog or narrower follow-up roadmaps rather than extending this roadmap again

## Phases

### Completed foundation

### Phase 1 - Inventory current constants

Classify constants into three buckets:

- permanently global
- global for now
- tenant-overridable

Current first-pass classification from `gameConfig.ts`:

Permanently global or infrastructure-level:

- `DISCOUNT_DIVISOR`

Global for now:

- `ADMIN_USER_ID`

Historical bootstrap constants already removed from runtime:

- legacy demo user-range constants

Tenant-overridable candidates:

- `PRODUCT_NAME`
- `CURRENCY_NAME`
- `INITIAL_BALANCE`
- `SESSION_DURATION_MS`
- `SUBMISSION_BASE_COST`
- `PUSH_BASE_COST`
- `DISRUPT_COST`
- `EXPLORER_STANDARD_COST`
- `EXPLORER_MERIT_COST`
- `EXPLORER_ACCESS_STEP_MINUTES`
- `EXPLORER_MERIT_THRESHOLD`
- `LIVE_DISCOUNT_MULTIPLIER_NUMERATOR`
- `DIGOUT_PERCENTAGE_NUMERATOR`
- `REMOVAL_REFUND_PERCENTAGE_NUMERATOR`
- `MAX_TOKEN_DURATION_MINUTES`

Frontend migration candidates once tenant settings are readable through the backend:

- product display name and product label
- tenant-facing currency label
- tenant display and CTA copy
- share handle and share hashtags
- social links and donation provider settings
- other operator-facing runtime config now stored in `js/app-config.js`
- current frontend rule fallbacks that still rely on scattered inline literals

Notes:

- `PRODUCT_NAME` should be prepared as tenant-backed branding even if the current operating model keeps it locked to `DMG`. White-label readiness depends on treating product naming as effective runtime branding rather than as a forever-static code constant.
- `CURRENCY_NAME` should move behind tenant config because it is branding, UX copy, and commercial policy, not infrastructure. Once that happens, backend responses, frontend labels, and any future shared UI config should read the effective tenant currency name from one source of truth.
- `INITIAL_BALANCE` should be treated as a configurable starting-balance policy rather than a forever-global constant.
- `SESSION_DURATION_MS` is stored in code as milliseconds today, but if session length becomes tenant-configurable the tenant model should store the business value as minutes, then convert to milliseconds in the runtime layer when needed.
- `LIVE_DISCOUNT_MULTIPLIER_NUMERATOR`, `DIGOUT_PERCENTAGE_NUMERATOR`, and `REMOVAL_REFUND_PERCENTAGE_NUMERATOR` are not infrastructure constants in themselves. They are precise integer representations of business rules that already have product meaning and branding value, so they belong with tenant-overridable pricing policy.
- `DISCOUNT_DIVISOR` remains infrastructure-level because it is the arithmetic base used to express percentage math safely with integers.
- `MAX_TOKEN_DURATION_MINUTES` can move into tenant policy, but it should still be enforced under one global hard ceiling in code.
- `ADMIN_USER_ID` should be treated as a bootstrap escape hatch only. The real admin authority target is `TenantMembership.role`.
- founder or bootstrap operator identities should not remain privileged production assumptions. Long-term operator access should flow through the same tenant-scoped identity and authorization model used by any other operator.

### Phase 2 - Create the tenant settings model

The first model set should stay generic:

- `Tenant`
- `TenantMembership`
- `TenantConfig`
- `TenantConnection`

Avoid names like `StreamerConfig`.

### Why this is better than streamer-specific tables

Do not create one schema path for streamers and another for SaaS or B2B operators.

That would silo the product and make each new vertical materially more expensive to maintain.

The decision here is architectural, not cosmetic.

It also makes future portable identity easier to implement because identity stays generic instead of being trapped inside one vertical-specific schema.

### Phase 3 - Add a settings read layer

Create one backend settings reader that:

- resolves tenant context
- loads effective tenant settings once
- applies one documented fallback policy
- makes repeated ad hoc database reads unnecessary inside downstream helpers

Current status:

- a first default-tenant settings reader now exists in the API service layer
- it already implements a safety-net fallback when the tenant row or config row is missing
- the next step is explicit tenant-context resolution rather than relying on the default tenant everywhere

### Scalability note on reads

The intended model is not one fresh database query in every helper.

The intended model is:

1. resolve `tenantId`
2. load settings once through a settings reader
3. reuse the resolved settings for the request flow
4. add short-lived cache by tenant only when needed

That is fully normal for the scale you described.

### Phase 4 - Refactor rule entry points

Move in-scope rule reads behind the settings layer.

Current priority targets:

- challenge submission pricing
- push pricing
- explorer pricing
- session duration rules

### Phase 5 - Admin visibility

Make effective settings visible in the admin surface before aiming for a polished editor.

Visibility matters before editing polish.

### Phase 6 - Replace bootstrap admin checks

Move admin authorization from `ADMIN_USER_ID` toward tenant membership roles.

The intended target is:

- `TenantMembership.role` as the real authority source
- `ADMIN_USER_ID` retained only as a temporary bootstrap path during migration

The same hardening track should replace the current browser-stored admin shared secret pattern.

Target direction:

- admin access should use tenant-scoped authority, not a forever-global shared secret in `.env`
- the frontend should stop storing raw admin secrets in session storage once a server-issued admin session flow exists
- public runtime config must remain separate from admin auth state and must never carry private operator credentials

### Phase 7 - Frontend config migration

Move tenant-facing runtime config out of static frontend files and behind backend-served tenant config.

This includes:

- effective product naming
- currency naming
- tenant branding and CTA copy
- share text inputs
- social and donation settings

Route naming and module naming cleanup for endpoints such as `referenceRoutes` should happen after this migration surface stabilizes.

Repo-wide route comment harmonization should be handled as a separate cleanup commit, not mixed into the migration commits.

The same migration pass should include an explicit scan for hardcoded product-specific strings so branding stops leaking across backend messages, frontend pages, and bootstrap helpers.

The public bootstrap endpoint for this work is `GET /api/v1/references/app-config`.

Current implementation note:

- backend-issued frontend links should resolve through stable route keys and one frontend-route config surface, not through hardcoded page filenames inside service logic
- this keeps route naming changeable for wedge-specific UX without coupling server logic to one page naming scheme

That endpoint should be the only browser-readable source for non-sensitive tenant-facing runtime values that affect public UX.

Examples now in scope for that contract:

- product naming
- currency naming
- session duration display values
- explorer access-step display values
- live discount display values
- public social and donation presentation values

### Phase 8 - Safe editing path later

Add a minimal editing path only after the model and settings reader are stable.

### Phase 9 - Remove transitional fallback leakage

Frontend pages should not carry raw business-rule fallbacks once the public bootstrap contract exposes those values.

Current cleanup target:

- remove page-level fallbacks such as hardcoded session duration, explorer access-step size, live discount label math, and polling intervals when those values already exist in app-config helpers
- keep one bootstrap default shape in `js/app-config.js` only until the database-backed contract is fully authoritative

### Phase 10.1 - Add tenant quote policy under system safety caps

Tenants may eventually need a product-facing push quote cap, but that should remain subordinate to a non-tenant system safety ceiling.

Current implemented state:

- one internal system maximum already exists for push quote quantity
- `TenantConfig` now carries an optional tenant push quote limit
- the effective push quote limit now resolves as `min(systemMax, tenantLimit)`
- the public app-config payload can expose the effective limit when public UX needs it

Target architecture:

- keep one internal system maximum for push quote quantity to protect stability and numeric safety
- add an optional tenant-configured push quote cap that must be less than or equal to the system maximum
- expose the tenant-facing cap only where it affects operator or player-facing behavior
- keep the system safety ceiling out of public marketing or general tenant copy

Migration shape:

1. preserve the current internal system ceiling as the hard upper bound
2. keep the tenant-configured push quote limit nullable so tenants without an override still inherit the system ceiling
3. resolve the effective push quote limit as `min(systemMax, tenantLimit)` when tenantLimit is present
4. surface the effective tenant limit in relevant UI only if the product actually needs to communicate it

### Remaining major migration work

### Phase 10.2 - Isolate demo behavior behind explicit demo scope

Demo access should move from ad hoc seeded identities toward explicit demo-scoped environments or tenants.

Current implemented state:

- demo access now resolves through an explicit `users.isDemo` boundary instead of an implicit user-ID range
- dedicated demo perennial tokens still exist, but they now resolve into explicit demo-scoped identity state
- the current `master_demo_token` seed artifact now behaves as a legacy bootstrap operator token and should be renamed or removed when the bootstrap compatibility path is retired
- tenant config now carries a private demo explorer grant cap so demo-only access policy no longer depends on a hardcoded clamp in request handling
- a dedicated demo tenant boundary now exists for first-pass isolation, and demo-scoped public flows now reject cross-boundary use instead of relying only on `users.isDemo`
- demo perennial tokens now carry an explicit expiry window, and demo rebuilds can run through a dedicated demo-scope reset script instead of forcing a full destructive reseed
- demo reset and demo seed lifecycle filters now resolve through demo-tenant membership plus demo identity instead of broad `isDemo`-only selection

Target architecture:

- keep demo users in the same schema only when they are explicitly scoped to a demo tenant or demo environment boundary
- make demo data resettable without touching production tenant data
- support short-lived demo perennial tokens or equivalent demo access grants so a user can enter a contained demo environment for a limited time
- allow demo perennial token lifetime and related demo access policy to be tenant-configurable inside a dedicated demo settings wedge rather than a public runtime surface
- preserve full-product behavior inside the demo scope so submission, explorer access, and push flows behave like the real app while remaining isolated
- do not model demo access as a tenant membership role by default; treat it as scoped access policy attached to demo identities, demo tokens, or demo environment state

Migration shape:

1. define the explicit demo boundary, either a dedicated demo tenant model or a dedicated demo environment
2. tag or scope demo users, demo challenges, and demo access grants to that boundary
3. add a repeatable demo reset path that clears and rebuilds only the demo-scoped dataset
4. add a demo settings wedge that can govern demo perennial token lifetime and other demo access policy without leaking into public app config
5. shorten or separately govern demo perennial token lifetime so demo access can expire cleanly
6. keep demo behavior out of standard production tenant flows unless the active identity is explicitly demo-scoped

### Phase 11 - Remove deploy bootstrap URL defaults

Current deployment host defaults are centralized, but they still exist as bootstrap infrastructure.

Current implemented state:

- hardcoded deploy URL fallbacks have been removed from backend secure-link generation and frontend API-base resolution
- local development still keeps explicit local resolution rules so localhost and LAN testing do not require extra setup
- tenant frontend runtime metadata can now live in `TenantConnection`, allowing backend secure links and production CORS checks to resolve from tenant-scoped runtime data instead of one global deploy URL
- frontend API-base resolution now prefers explicit deployment config when present and otherwise assumes same-origin `/api/v1`
- shared-host public routing can now carry tenant context through an explicit tenant slug on generated frontend links and frontend API calls, which is enough for near-term multi-tenant testing on one frontend host before first-class host binding exists
- deployed shared-host public entry points now bind tenant context through `/t/<tenant>/...` paths
- the webapp now ships with a rewrite-capable local dev server so localhost can exercise the same `/t/<tenant>/...` public paths during normal development instead of relying on a separate query-parameter fallback
- tenant-facing public page copy and public-link defaults for the home, FAQ, and donation pages now resolve through shared `app-config` helpers instead of being repeated inline in each page
- the backend-served `app-config` payload now carries those centralized public copy and support-link defaults, so the browser can hydrate them from one tenant-scoped runtime response instead of only from frontend bootstrap literals
- `TenantConfig` now also carries the public app-config fields behind that response, including share handle, share hashtags, support-provider identity, public links, and structured public page copy for the home, FAQ, and donation surfaces
- the admin dashboard now includes a session-backed editor for those tenant public app-config fields, backed by privileged operator endpoints so operators can load and update the public runtime contract without seed or migration edits
- the public app-config contract now also carries tenant-backed browser timing values for stream refresh, explorer polling, token reverification, and minimum verification delay, removing another slice of frontend bootstrap-only runtime policy
- shared-host tenant routing scopes public runtime policy such as explorer pricing, access rules, and branding, but it does not change the authenticated account identity encoded in the token; the same operator account can therefore verify as `21xhr` under more than one tenant while still receiving tenant-specific runtime behavior
- newly generated public JWT links now also carry the tenant slug in the signed payload, so submit and explorer verification reject a secure link if it is replayed under a different tenant context
- public token-backed submit and explorer routes now also require tenant membership for the token user, so a valid tenant-bound link is not enough on its own if the user is not authorized for that tenant
- submit and explorer pages now wait for `StreamState` before completing page bootstrap so a fast local refresh is less likely to leave the UI stuck in an early verification state during initialization
- the remaining global deploy env vars are now local-development conveniences or bootstrap seed inputs, not the only non-local production resolution path

Follow-up target:

- remove remaining backend and frontend deploy URL defaults once tenant/domain-aware runtime config is authoritative
- keep deploy host resolution out of page logic and service logic
- ensure the public bootstrap contract and tenant/domain resolution make those static defaults unnecessary
- keep bearer-link risk reduction as a later hardening track unless streaming-wedge evidence shows that short-lived, tenant-bound, membership-checked links are insufficient; the most compatible next step would be a token-to-session exchange or soft client binding that survives normal refresh within one active browser session
- keep removing remaining public-route hardcoding and move more tenant-facing runtime copy and link defaults behind app-config so the browser surface depends on one explicit tenant bootstrap contract
- replace the minimal JSON-backed public app-config editor with a more structured operator settings surface once the final field set is stable

Commercial direction:

- tenant-owned frontend domains should be treated as a real SaaS capability rather than as a deployment accident
- custom domains are a credible candidate for higher-tier packaging because they strengthen white-label positioning, reduce platform-brand dependence, and make tenant identity feel first-party
- the current `TenantConnection`-based frontend runtime metadata is a valid transition step, but if domain onboarding grows into verification, canonical redirect policy, DNS state, certificate state, or multiple domains per tenant, that should move into a dedicated tenant-domain model
- the staged capability and long-term domain-model direction are tracked separately in `strategy/roadmaps/tenant-custom-domain-roadmap.md`

Suggested future capability boundary:

- baseline tenant runtime: one platform-hosted frontend domain
- premium tenant runtime: custom domain binding, branded canonical host, and tenant-managed public entry surface

### Final hardening and launch cleanup

### Phase 12 - Retired bootstrap admin secret compatibility

The admin surface exchanges a tenant operator token once and uses a short-lived `httpOnly` session cookie for subsequent admin requests.

Current implemented state:

- admin session issuance is live behind `/api/v1/admin/session`
- admin dashboard restore and monitoring calls use the cookie-backed session flow
- privileged operator routes now live under `/api/v1/operator/*`
- tenant membership is the current authority boundary for privileged operator actions
- the legacy bootstrap admin secret compatibility branch is removed

Target architecture:

- admin authority derives from tenant-scoped membership or tenant-scoped operator config, not from a forever-global `ADMIN_USER_ID` plus shared `.env` secret
- the admin login flow exchanges an admin credential for a short-lived server-issued admin session
- the browser stores only a server-issued session identifier in an `httpOnly`, `secure`, scoped cookie rather than the raw secret itself
- admin routes validate server session state instead of reading a raw shared secret from request headers
- public runtime config stays separate from admin auth and never carries private operator credentials
- `ADMIN_SESSION_DURATION_SECONDS` should move into a private operator session policy surface rather than public tenant runtime config
- if cross-tenant founder or support access is needed, it should be modeled as an explicit audited platform-support capability with audit logs and clear grant boundaries rather than an implicit bypass into every tenant dashboard
- platform support authority should stay distinct from tenant `OWNER` or `ADMIN` membership so tenant-internal support and platform-level support do not collapse into the same role model
- `/api/v1/operator/*` should ship as the only supported privileged operator route group before live launch

Reference flow note:

- see [admin-authentication-and-dashboard-flow.md](../../../../dmg-workspace/apps/docs/appendix/flows/admin-authentication-and-dashboard-flow.md) for the current token exchange, cookie session issuance, dashboard restore flow, and protected pulse access

Implemented migration shape:

1. keep the admin session creation endpoint limited to returning only a server-managed session cookie
2. keep admin routes on session validation middleware rather than request-header secrets
3. keep raw-secret storage out of the admin page
4. keep Game Master and admin authorization keyed to tenant membership rather than a fixed bootstrap user ID
5. retire the legacy admin secret compatibility branch after token-based operator login is the stable admin entry path
6. move admin session lifetime behind private operator session policy once the admin policy surface exists
7. remove compatibility aliases such as `/api/v1/gamemaster/*` before live launch unless a measured migration need actually exists

## Acceptance criteria

This roadmap step is successful when:

- all in-scope tenant-overridable rules read from database-backed settings
- immutable global constants are explicitly separated from tenant-overridable rules
- one fallback policy is documented and implemented centrally
- the settings reader avoids uncontrolled duplicate reads
- the effective settings are visible in the admin flow
- the change is documented in release notes or baseline notes

## Fallback policy guidance

Prisma defaults are fine for structural safety.

Examples:

- timestamps
- booleans
- counters initialized to zero

Important business defaults should not live only as schema defaults.

In the current project stage, the target should be:

- create the first tenant and its `TenantConfig` before the first real operator uses the system
- treat that seeded config row as the normal path, not as an exception

So the fallback is not there because the first real operator should routinely hit it.

The fallback exists as operational safety for cases such as:

- a partial migration
- an incomplete local or staging database
- a tenant row created before its config row
- a bug or failed setup flow

The better pattern is therefore:

- create a real `TenantConfig` row for each tenant through a seed or migration step
- keep one explicit backend fallback policy only as a safety net when a config row is unexpectedly missing

In this context, "seeded" means an actual database row inserted by a migration, seed script, or controlled setup flow.

It does not mean a hidden schema default doing business-rule work on its own.

## Public app-config contract

The public tenant config endpoint `GET /api/v1/references/app-config` is intended for non-sensitive bootstrap data only.

Examples:

- effective product name
- tenant slug and display name
- currency label
- session duration and other tenant-facing rule-display values that pages need to render public UX correctly
- effective public push quote limit when quote-entry UX needs the current tenant cap
- public social links
- donation provider username or public embed settings

This contract is also the right place to remove duplicated frontend business-rule literals when the values are already non-sensitive and already derived from effective tenant settings.

This endpoint should not carry secrets, internal provider credentials, private operational toggles, or admin-only state.

Examples of values that should stay outside the public contract:

- provider API keys, OAuth client secrets, webhook secrets, or passwords
- internal moderation flags or admin tooling controls
- unpublished rollout toggles meant only for operators or staff
- membership, billing, or tenant-management state that reveals private account operations

## Configuration governance tiers

`TenantConfig` is a useful first landing surface, but it should not become the forever-home for every tenant-related setting.

The migration target should separate at least four governance tiers:

- public runtime config
- operator-editable tenant policy
- owner-only sensitive tenant settings
- internal support or bootstrap controls

Public runtime config is safe to expose through app-config and safe to cache in browsers.

Operator-editable tenant policy is runtime behavior that authorized tenant operators may edit, but it does not belong in the public bootstrap contract.

Owner-only sensitive settings include values that materially affect security, authority, billing, or external integrations. Those fields should not share the same editing surface or persistence contract as public copy, pricing labels, or normal operator UX settings.

Internal support or bootstrap controls remain outside tenant self-service surfaces even when they temporarily live in environment variables or controlled setup flows.

Admin-facing implementation should therefore answer two separate questions for each field:

- who may read it
- who may edit it

Field classification should exist before the tenant settings editor keeps expanding, otherwise admin tooling will continue to mix public runtime values with higher-sensitivity controls.

## Default placement rule during migration

Until a field is fully tenant-backed, fallback defaults should live in dedicated config modules that describe one policy surface at a time.

`tenantSettingsService.ts` should assemble effective settings, not become the long-term source file for unrelated business-rule literals.

That keeps the migration path cleaner when a constant later moves from static fallback to seeded tenant config, private operator policy, or owner-only settings.

## Numeric and string scan triage

Not every `21`, `210`, `42`, or `420` literal is accidental leakage.

The scan should separate three cases:

- intentional canon that defines the current DMG rule system and belongs in backend config, tenant settings, or product docs
- sample or seed data that deliberately models DMG-specific defaults for local development
- accidental leakage where generic code paths, auth copy, response copy, or public page logic keep hardcoded values that should instead read from effective settings

Current examples of accidental leakage that should be removed quickly:

- auth or admin-copy references that expose bootstrap identifiers such as `User ID 21`
- example values in generic command guidance that unnecessarily encode canon numbers
- public page logic that redefines rule values already available through app-config helpers

Current examples that may remain temporarily by design:

- backend canonical rule defaults in `gameConfig.ts` until full tenant-backed replacement is complete
- seed and demo data that intentionally represent the current DMG operating model
- product and feature documentation that explicitly describes the current canonical rule set

## Follow-up cleanup still required

- replace browser-stored admin shared-secret handling with a tenant-scoped admin session model
- remove remaining deploy bootstrap URL defaults once tenant/domain-aware runtime config is authoritative
- continue explicit scans for hardcoded business-rule literals in webapp page logic so UI timing, pricing, and access-unit math stop drifting from backend settings