# Product Backlog

## Purpose

This file is the backlog for forward-looking work that is real enough to preserve, but not yet shaped into a dedicated roadmap.

Shareable documentation placement and instruction-boundary rules are defined in `/Users/mac/dmg-workspace/apps/docs/system-architecture/documentation-system.md`.

## Current backlog lanes

### Economy and ledger redesign

- economy-ledger migration is now tracked in `strategy/roadmaps/economy-ledger-redesign-roadmap.md`
- define how cross-community mechanics should work when one tenant community challenges another tenant or another platform community inside the same tenant
- review economy-facing enum names and categories later so they fit a broader tenant audience and additional product wedges without overfitting to the current DMG vocabulary
- define direct user-funded Community Chest flows so players can intentionally contribute to the communal pool outside removal settlement
- add the first stream-recovery optimization as a database index or partial index around unprocessed stream rows instead of rewriting startup recovery logic early
- review whether Prisma indexes are sufficient for the new tenant-scoped challenge, quote, maintenance, and tenant-user-state hot paths before multi-tenant load hides avoidable query costs
- decide whether `LIVE_DISCOUNT` remains one game-wide percentage or becomes action-specific and tenant-policy-driven so live incentives can vary without hard-coded branching
- decide whether future tenant-specific cost logic should remain one shared quadratic formula with parameters or open a clearer per-tenant pricing-rule boundary
- open item: split removal settlement and refund orchestration out of `challengeService.ts` into smaller service boundaries once the current tenant-config migration stabilizes

### Runtime notifications

- runtime notification transport is now tracked in `strategy/roadmaps/runtime-notification-roadmap.md`

### Documentation tooling

- decide whether `apps/docs` stays a content-only package or gets a real preview, build, lint, and validation toolchain, then remove the current no-op package-script placeholders once that operating model is chosen
- define the documentation linting or prose-validation boundary for the workspace so shareable docs style checks do not rely only on manual review
- check whether glossary-worthy term changes are reviewed automatically and consistently enough across the current documentation dependency model, review-target tooling, and standing instructions
- audit private planning notes that still point at pre-monorepo paths or older workspace assumptions, including `strategy/decision-support-boundaries.md` references when related notes now assume the current two-repo structure
- define the workspace developer-onboarding document shape so the root README stays high-level while one modern quick-start guide carries local setup, first-run checks, and next-surface pointers
- extend the documentation prose guard so meta-routing sentences about what belongs in private notes or what a guide should become are blocked in shareable repo markdown before commit

### Naming and scope cleanup

- run a multi-repo naming pass across docs, backend, and frontend so tenant scope, session scope, maintenance state, and provider boundaries are explicit instead of implied
- execute the planned file or module rename for `adminRoutes` and `operatorRoutes` only when the next boundary split creates enough leverage to justify churn, while keeping the current route path split stable unless a later launch cleanup requires route alias removal
- keep later route-family rename cleanup as backlog-only work unless a real boundary split earns the churn; do not reopen the archived config-to-database roadmap for naming polish alone
- run a naming pass across database fields, APIs, and docs so the current numbers vocabulary and related economy terms cleanly separate current DMG branding from broader wedge-neutral tenant terminology
- review wedge-specific submission prose and field naming so broader product paths can evolve beyond the current `challenge` wording without collapsing current DMG semantics during migration
- brainstorm how to handle the `challenge` term across DMG and broader wedges so the shared core can support better neutral naming without breaking the current product language abruptly
- review terse infrastructure variable names in multi-step service logic so transaction and policy boundaries stay readable once helpers grow beyond tiny local scopes
- continue removing duplicated default values and legacy literal phrasing from shared-domain docs and comments so the authoritative config reference remains the only source for live defaults
- treat later wording and editor-shape cleanup as backlog maintenance unless it changes where runtime settings, tenant policy, or private session controls are owned
- review future-leaning generic guidance sentences in shareable docs and either rewrite them as current scoped rules or move them back into private planning notes
- review later whether `fundraising/plans/market-feedback-and-loi-plan.md` should remain one bridge note or split into separate external-network discovery and fundraising-proof packaging notes once those responsibilities diverge more clearly

### API contract and type sharing

- shared API contract roadmap is complete in `strategy/roadmaps/shared-api-contract-roadmap.md`

### Configuration governance

- define which challenge and player actions stay globally available and which ones become tenant-scoped or feature-gated so livestream use and in-app use can diverge cleanly per tenant
- add per-tenant availability controls for public challenge detail pages, including whether a tenant can disable public challenge pages entirely or place them behind a lightweight password wall
- define the neutral capability vocabulary that should replace current streaming-wedge mechanic naming across tenant policy and feature-availability layers once the broader product surface is stabilized
- continue moving scattered fallback defaults into dedicated config modules or tenant-backed records so `tenantSettingsService.ts` stays an assembly layer rather than a long-term home for business-rule literals
- treat future browser or helper literal scans as spot cleanup unless they reveal a real ownership-boundary regression in app-config or tenant-backed policy
- define the expected development, staging, and production secret tiers for database and infrastructure credentials before repository handoff to a broader engineering team
- decide whether automatic challenge lifecycle scheduling stays an always-on server capability or becomes tenant-scoped, feature-gated, or operator-configurable in the SaaS model

### Tenant state and analytics

- review which user progression fields belong globally on `User` versus per-tenant on `TenantUserState`, including whether totals such as `totalChallengesSubmitted` should remain DMG-global or gain tenant-scoped companions
- define a durable stats and read-model plan for the tenant user-stats page so operator-visible player metrics have one explicit serving path
- add `uniquePusher` or equivalent explicit per-challenge uniqueness tracking once the analytics consumer is clear enough to avoid another placeholder field rename later
- implement a tenant-safe "total unique pushers in session" metric once the challenge/session analytics boundary is explicit

### Admin surface polish

- add concise tooltips or helper copy for operator-editable public runtime fields when the labels alone are not enough to explain launch-time defaults or tenant scope
- continue replacing the minimal JSON-backed admin editor with more structured tenant-policy and operator views once the governance-tier field list stabilizes
- keep low-leverage editor-shape and helper-copy cleanup in backlog unless it changes policy ownership, route boundaries, or tenant scope
- define the longer-term role-scoped admin visibility matrix beyond the current manifest baseline so support/read, operator-write, owner-sensitive, and future privacy-limited surfaces stay explicit as more admin roles appear

### Identity and access

- rename the `master_demo_token` bootstrap artifact to a scope-accurate operator bootstrap label
- design the operator and user-facing flows that mint tenant-scoped perennial tokens now that the base `tenantId` and purpose model exists
- decide when perennial tokens remain direct bearer credentials versus when they should be exchanged for browser sessions or cookies
- keep perennial-token access as a distinct non-OAuth entry path if the product wants lightweight user-managed links alongside OAuth-based account connections
- check whether the previous guided demo flow still works cleanly on top of the new tenant-scoped perennial-token and demo-policy model, and document the intended replacement if it does not
- open item: add operator and user-facing token issuance flows on top of the new `tenantId` plus purpose model
- open item: add tenant-level defaults and per-token overrides for whether a perennial token purpose stays a direct bearer link or is exchanged for a cookie-backed browser session on first use

### Demo policy

- expand the lean private tenant demo settings wedge only when a dedicated demo-config model is justified by field count or workflow complexity
- support tenant-specific demo user identities rather than one shared demo identity pool when clean analytics and future data aggregation matter more than short-term convenience
- design operator-issued demo access so tenants can generate scoped test access for their own users without leaking into public runtime config
- add an owner-gated demo dataset reset surface backed by the existing `resetDemoScope` flow once destructive operator-action governance is explicit enough to expose it beyond scripts

### Internationalization and architecture governance

- define the minimum viable i18n boundary early so operator pages and public pages do not hard-code English copy into every surface before localization primitives exist
- decide whether ADRs should exist as a lightweight standing format for cross-repo boundary choices, and if so where they should live and how they should be linked from roadmap work
- capture the current web-on-Vercel plus API-on-Render deployment model as an ADR once the first production deployment path is exercised end to end, including the rationale for keeping the API on a conventional Node-service host
- include in that ADR the validation-stage infrastructure posture: why low-cost hosting is acceptable for pre-money validation, what makes it still credible, and which triggers should force the move to paid or more operationally capable infrastructure
- define protected-path review controls for deployment manifests, reset scripts, secret-handling code, and maintenance-entrypoint changes, including whether code-owner rules or CI approval checks should gate those files

## Working rule

If a backlog item becomes concrete enough to schedule, move it into a focused roadmap file.