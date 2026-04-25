# Ingress Abstraction Roadmap

Archived on 2026-04-25 after the Lumiastream and Discord bot ingress adapters were proven against the shared normalized command contract.

## Purpose

This file describes the forward-looking ingress abstraction path.

It lives under `strategy/roadmaps/` because it mixes current-state observations with planned provider-boundary work. Documentation placement and repo-governance rules are defined in `system-architecture/documentation-system.md`.

## Current state

The backend already has a real first normalization step in code:

- one centralized command ingress route
- one normalized command payload contract
- one route-level normalization pass before auth, rate limiting, and dispatch

- route-level normalization exists
- the dispatcher consumes normalized payloads
- the next step is a more explicit provider adapter boundary

## Status snapshot

The ingress boundary is normalized enough to support provider-agnostic command handling, but it is not yet fully adapter-driven.

What is already in place:

- the command ingress route normalizes inbound payloads before auth and dispatch
- the normalized payload carries `command`, `user`, `platform`, `args`, `providerName`, and `providerMetadata`
- the dispatcher consumes the normalized payload shape instead of provider-specific raw request bodies
- the current fallback keeps older payloads working while newer adapters populate `providerName` explicitly

What still needs to land:

- a provider adapter boundary in code
- Lumiastream-specific parsing behind that boundary
- tenant-configurable provider selection
- a second ingress provider proving the same normalized contract through the Discord bot
- a clear separation between ingress provider concerns and wallet or points authority

## Completion criteria

This roadmap is complete when all of the following are true:

- the provider adapter interface exists in code
- Lumiastream-specific parsing has moved behind the adapter boundary
- provider selection is tenant-configurable instead of implicit
- the Discord bot validates against the same normalized ingress contract
- wallet authority remains separate from ingress provider logic unless a later economics decision intentionally changes that boundary

Status: complete.

Completion signal: the Lumiastream and Discord bot ingress adapters both normalize onto the same command contract, and the provider boundary is now explicit in code.

## What the first step means in practice

The normalized ingress payload shape is the shared boundary between the route and the dispatcher.

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

The current fallback exists because Lumiastream is the only real live provider wired today.

That fallback is a backward-compatibility convenience, not the target end state.

Later, the cleaner model is:

- each ingress adapter sets `providerName` explicitly
- or the system derives it from the connected tenant provider configuration

At that point, the raw payload should not need an implicit default.

## How adapters should work later

The clean model is one ingress adapter per provider or ingestion service.

Examples:

- one Lumiastream adapter
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

## Execution sequence

1. define a provider adapter interface in code
2. move Lumiastream-specific parsing behind that interface
3. make provider selection tenant-configurable
4. prove the Discord bot provider against the same normalized contract
5. separate wallet authority from ingress provider when the economics justify it