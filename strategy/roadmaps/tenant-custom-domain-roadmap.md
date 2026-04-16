# Tenant Custom Domain Roadmap

## Purpose

This note isolates custom domains as a staged SaaS capability.

It exists separately from the config-to-database roadmap because custom domains are not only a deployment detail.

They affect tenant identity, packaging, white-label positioning, frontend runtime resolution, security boundaries, and later onboarding workflow.

## Why this matters

Tenant-owned domains strengthen the product in several ways:

- they make the tenant experience feel first-party rather than platform-hosted
- they improve white-label credibility
- they create a clean premium packaging surface
- they reduce founder-managed deployment assumptions by moving runtime identity into tenant-scoped product capability

## Staged capability model

Custom domains should be framed as a staged capability.

### Stage 1 - Tenant-aware runtime resolution

Goal:

- stop treating one hardcoded deploy host as the permanent frontend identity

Implemented state:

- backend secure-link generation is tenant-aware
- production CORS checks can resolve from tenant-scoped frontend runtime data
- same-origin frontend API resolution is now compatible with tenant-specific hosting

Concrete example:

- if a tenant frontend is served from `https://portal.school-a.example`, frontend pages can call `/api/v1/...` on that same host instead of hardcoding one central API hostname
- that same-origin path can be backed by a reverse proxy, gateway, or other host-routing layer, so the browser sees one tenant-facing origin even if the API is still hosted elsewhere behind the scenes

### Stage 2 - Tenant-scoped frontend runtime metadata

Goal:

- let each tenant carry its own frontend runtime metadata without needing a dedicated domain model yet

Implemented state:

- frontend runtime metadata can live in `TenantConnection` under a dedicated frontend runtime provider record
- this is a transition design, not necessarily the permanent final model

### Stage 3 - First-class custom domain capability

Goal:

- make custom domains an explicit tenant feature rather than implicit runtime metadata

Target outcomes:

- tenant-managed canonical frontend host
- one or more verified tenant domains
- explicit redirect policy between platform-hosted and tenant-owned hosts
- certificate and DNS onboarding state
- auditability around who changed domain bindings and when

### Stage 4 - Commercial packaging

Goal:

- turn custom domains into a clear SaaS packaging lever rather than only an engineering feature

Likely packaging boundary:

- baseline tier: platform-hosted tenant frontend
- premium tier: tenant-owned custom domain and branded canonical host

## Current implemented runtime metadata

Current tenant-scoped frontend runtime resolution supports these fields through frontend runtime metadata:

- `frontendBaseUrl`
  the resolved tenant frontend base URL used by backend secure-link generation when a non-local request needs a tenant frontend host
- `allowedOrigins`
  the approved frontend origins used by production CORS checks for browser access

This means a tenant-specific frontend URL can already be configured operationally.

That does not yet mean the product offers a complete self-serve custom-domain feature.

Current scope is closer to operator-managed runtime configuration than to full tenant-managed domain onboarding.

Current practical reading:

- the platform can be configured to present one tenant through a tenant-specific frontend URL
- that URL can be a tenant-owned custom domain if the operator team sets up the hosting, routing, and runtime metadata manually
- the tenant does not yet have a productized capability to self-manage that domain, self-host the frontend, or complete a serious onboarding flow for it

Current behavior:

- localhost and LAN development still use explicit local-development resolution rules
- non-local production requests can resolve tenant frontend runtime from tenant-scoped metadata rather than one global deploy origin
- frontend pages still assume same-origin API access unless explicit API-base config is injected

Same-origin note:

- same-origin API access does not require the API application itself to move onto the tenant's domain as a first-class deployment unit
- it only means the browser can interact with the API through the same visible origin, often via proxying or host-based routing

Multi-tenant note:

- multiple tenants can still be served from one shared platform-hosted domain if tenant routing is resolved through host, path, token context, or another tenant-resolution layer
- custom domains are therefore not required for multi-tenant operation, but they are relevant for white-label identity and premium packaging

## What is not configurable yet

The current implementation is not a full custom-domain system.

It does not yet provide:

- public tenant-routing model for shared-host multi-tenant frontend access
- domain verification flow
- certificate lifecycle state
- canonical redirect policy
- multiple domains per tenant with explicit roles
- domain onboarding UX
- package gating, billing coupling, or entitlement checks around custom domains

## Recommended model boundary

`TenantConnection` is acceptable while frontend runtime metadata stays lightweight.

That means:

- one frontend base URL
- one allowed-origin list
- limited runtime metadata without lifecycle workflow

If the feature expands into full custom-domain onboarding, move it to a dedicated model such as:

- `TenantDomain`
- `TenantHostBinding`
- or a similarly explicit runtime/domain model

## Suggested future phases

### Phase A - Stabilize current runtime metadata

Status:

- complete as the first milestone toward tenant custom-domain readiness

- keep current tenant-aware runtime resolution reliable
- document the frontend runtime metadata contract clearly
- avoid leaking custom-domain semantics into unrelated service code

Completed outcome:

- tenant-aware runtime resolution exists
- tenant-scoped frontend runtime metadata exists
- current implementation boundaries are documented clearly enough to distinguish runtime metadata from a full custom-domain feature

### Phase B - Introduce dedicated domain model

- create a dedicated tenant-domain model
- backfill the current frontend runtime record into that model
- keep `TenantConnection` for external integrations only

### Phase C - Add verification and canonical host policy

- support domain verification state
- support canonical-host redirects
- support operational visibility for invalid or stale bindings

### Phase D - Add packaging and admin visibility

- expose domain capability in tenant admin surfaces
- define package boundaries for platform-hosted versus custom-domain access
- ensure operators can understand current runtime host state without developer intervention