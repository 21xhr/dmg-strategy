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
- TODO: split removal settlement and refund orchestration out of `challengeService.ts` into smaller service boundaries once the current tenant-config migration stabilizes

### Runtime notifications

- runtime notification transport is now tracked in `strategy/roadmaps/runtime-notification-roadmap.md`

### Documentation tooling

- decide whether `apps/docs` stays a content-only package or gets a real preview, build, lint, and validation toolchain, then remove the current no-op package-script placeholders once that operating model is chosen
- define the documentation linting or prose-validation boundary for the workspace so shareable docs style checks do not rely only on manual review

### Naming and scope cleanup

- run a multi-repo naming pass across docs, backend, and frontend so tenant scope, session scope, maintenance state, and provider boundaries are explicit instead of implied
- run a naming pass on `NUMBERS` so the shared workspace cleanly separates current DMG branding from any broader wedge-neutral currency vocabulary that future tenants may need
- review wedge-specific submission prose and field naming so broader product paths can evolve beyond the current `challenge` wording without collapsing current DMG semantics during migration
- brainstorm how to handle the `challenge` term across DMG and broader wedges so the shared core can support better neutral naming without breaking the current product language abruptly
- review terse infrastructure variable names in multi-step service logic so transaction and policy boundaries stay readable once helpers grow beyond tiny local scopes
- continue removing duplicated default values and legacy literal phrasing from shared-domain docs and comments so the authoritative config reference remains the only source for live defaults
- review future-leaning generic guidance sentences in shareable docs and either rewrite them as current scoped rules or move them back into private planning notes
- review later whether `fundraising/plans/market-feedback-and-loi-plan.md` should remain one bridge note or split into separate external-network discovery and fundraising-proof packaging notes once those responsibilities diverge more clearly

### API contract and type sharing

- shared API contract work is now tracked in `strategy/roadmaps/shared-api-contract-roadmap.md`
- TODO: contractize one next admin or operator action surface after the current `/admin/pulse` and public-app-config editor seams

### Configuration governance

- formalize config governance tiers so public runtime config, operator-editable tenant policy, owner-only sensitive settings, and internal bootstrap or support controls do not remain mixed in one surface
- define which challenge and player actions stay globally available and which ones become tenant-scoped or feature-gated so livestream use and in-app use can diverge cleanly per tenant
- extend operator control safeguards beyond duplicate execute blocking, especially for repeated status changes and other destructive controls that still rely only on session authentication
- continue moving scattered fallback defaults into dedicated config modules or tenant-backed records so `tenantSettingsService.ts` stays an assembly layer rather than a long-term home for business-rule literals
- define the expected development, staging, and production secret tiers for database and infrastructure credentials before repository handoff to a broader engineering team
- decide whether automatic challenge lifecycle scheduling stays an always-on server capability or becomes tenant-scoped, feature-gated, or operator-configurable in the SaaS model

### Admin surface polish

- add concise tooltips or helper copy for operator-editable public runtime fields when the labels alone are not enough to explain launch-time defaults or tenant scope

### Identity and access

- retire or rename the legacy `master_demo_token` bootstrap artifact so it no longer reads like a demo token
- design the operator and user-facing flows that mint tenant-scoped perennial tokens now that the base `tenantId` and purpose model exists
- decide when perennial tokens remain direct bearer credentials versus when they should be exchanged for browser sessions or cookies
- keep perennial-token access as a distinct non-OAuth entry path if the product wants lightweight user-managed links alongside OAuth-based account connections
- TODO: add operator and user-facing token issuance flows on top of the new `tenantId` plus purpose model
- TODO: add tenant-level defaults and per-token overrides for whether a perennial token purpose stays a direct bearer link or is exchanged for a cookie-backed browser session on first use

### Demo policy

- expand the lean private tenant demo settings wedge only when a dedicated demo-config model is justified by field count or workflow complexity
- support tenant-specific demo user identities rather than one shared demo identity pool when clean analytics and future data aggregation matter more than short-term convenience
- design operator-issued demo access so tenants can generate scoped test access for their own users without leaking into public runtime config

## Working rule

If a backlog item becomes concrete enough to schedule, move it into a focused roadmap file.