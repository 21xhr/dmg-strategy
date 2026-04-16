# Ingress Abstraction Roadmap

## Purpose

This file describes the forward-looking ingress abstraction path.

It lives under `strategy/roadmaps/` because it mixes current-state observations with planned provider-boundary work. Documentation placement and repo-governance rules are defined in `system-architecture/documentation-system.md`.

## Current state

The backend now already has a real first normalization step in code:

- one centralized command ingress route
- one normalized command payload contract
- one route-level normalization pass before auth, rate limiting, and dispatch

- route-level normalization exists
- the dispatcher consumes normalized payloads
- the next step is a more explicit provider adapter boundary

## What the first step already means in practice

"Define a normalized inbound command contract" is no longer only a roadmap statement.

That first step is already partially done.

What exists now is a normalized ingress payload shape shared between the route boundary and the dispatcher.

What is not done yet is a fuller provider registry or adapter layer around it.

## Provider-agnostic contract

The normalized command contract should carry only the data the DMG command core actually needs.

Typical fields:

- `command`
- `user.platformId`
- `user.username`
- `user.displayName`
- `platform.name`
- `args`
- `providerName`
- `providerMetadata`

## What `providerMetadata` means

`providerMetadata` is extra provider-origin information that may be useful at the boundary without becoming part of the core game contract.

Examples:

- request or event identifiers for tracing
- provider-specific channel identifiers or labels
- transport mode such as webhook versus queue delivery
- provider-specific role or permission hints
- signature version or ingestion diagnostics

Examples of concrete shapes:

- `{ "requestId": "req_123", "deliveryMode": "webhook" }`
- `{ "channelId": "yt-live-42", "channelLabel": "Kalyoz Live" }`
- `{ "eventId": "evt_9", "providerUserRole": "moderator" }`

Core game services should not depend on this structure unless there is a deliberate boundary-level reason.

## Why keep `providerName`

Exposing provider name is useful for:

- logs
- analytics
- operational debugging
- future adapter selection or verification logic

It does not mean the command services should branch everywhere by provider.

Provider differences should stay at the ingress boundary as much as possible.

## About the current `LUMIA` fallback

The current fallback exists because Lumia is the only real live provider wired today.

That fallback is a backward-compatibility convenience, not the target end state.

Later, the cleaner model is:

- each ingress adapter sets `providerName` explicitly
- or the system derives it from the connected tenant provider configuration

At that point, the raw payload should not need an implicit default.

## How adapters should work later

The clean model is one ingress adapter per provider or ingestion service.

Examples:

- one Lumia adapter
- one Discord adapter
- one Telegram adapter
- one in-house listener adapter that may receive events from Twitch, Kick, or YouTube

If DMG later internalizes more of the provider surface, that scope should be described precisely.

The useful connector buckets are:

- platform chat listeners
- platform auth or account connectors
- platform event or webhook ingestion
- any provider-specific bridge still delegated to a third party today

That list is useful because it turns "internalize the connectors" from a vague slogan into a concrete future work surface.

It should still be treated as a later-stage control and economics move, not as the first required milestone.

`providerName` identifies the ingress adapter or service that delivered the payload.

`platform.name` identifies the user-facing platform context relevant to DMG logic.

Those two values can be related without meaning the same thing.

## About the local normalization middleware in the route file

Keeping a small normalization middleware inside the route file is professional when:

- it is private to that route
- it is short
- it stays focused on one boundary concern

Extract it only when:

- multiple routes reuse it
- provider-specific logic grows
- testing pressure makes a dedicated module clearer

So the current placement is acceptable.

## Clarifying chat provider versus points authority

The chat ingress provider is the system that receives or forwards command events from an external surface such as Twitch chat, YouTube chat, Kick chat, Discord, or another command source.

That is separate from "points authority" or "wallet authority," which decides balances and paid-action affordability.

Today this is already mostly true in the code.

The reason to document it is defensive: keep ingress concerns and balance-authority concerns from becoming re-coupled as more providers are added.

The real risk is not that the current route fundamentally requires point-logic rewrites.

The risk is future leakage of provider-specific assumptions into balance or command code.

## UI before OAuth

A provider-selection or provider-connection UI can exist before full OAuth or channel-linking flows.

That UI can already show:

- available providers
- connected providers
- active provider
- required authorization status
- placeholder actions for future connection flows

That is still useful architecture work because it shapes the operator UX early.

## Next milestones

1. define a provider adapter interface in code
2. move Lumia-specific parsing behind that interface
3. make provider selection tenant-configurable
4. prove a second ingress provider against the same normalized contract
5. separate wallet authority from ingress provider when the economics justify it