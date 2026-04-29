# 2026-04-30 DSS Taxonomy and Competition Watchlist

## Purpose

Establish one stable DSS taxonomy and one durable competition watchlist that separates direct competitors from adjacent products.

This note is the Phase 1 and Phase 2 implementation slice of the market-research roadmap.

## DSS taxonomy baseline (2026)

| Architecture family | Core deciding mechanism | Typical output | Typical buyer need | DMG overlap signal |
| --- | --- | --- | --- | --- |
| Data-driven DSS | Ranking and threshold logic on structured operational data | Prioritized lists, scorecards, alerts | Throughput, operational prioritization, reporting | Medium when ranking replaces explicit arbitration logic |
| Model-driven DSS | Simulation, optimization, and scenario constraints | Recommended plan under constraints | Resource allocation, planning under uncertainty | Medium to high when trade-off logic is central |
| Knowledge-driven DSS | Rules and expert knowledge encoded as reusable decision logic | Rule-backed recommendations and explanations | Consistency, compliance, repeatability | High when formalized justification is required |
| Communication-driven DSS | Structured deliberation and group-input workflows | Group recommendations and consensus artifacts | Multi-stakeholder alignment and transparency | Medium when process quality is strong but arbitration reuse is weak |
| Agentic DSS | Multi-step autonomous assistants with human approval gates | Proposed actions, escalation paths, adaptive routing | Automation with supervision and exception handling | Medium when recommendations are generated but governance memory is shallow |

## Classification guardrails for later notes

- Keep architecture-level findings in market-research notes, not in company notes.
- Keep company-specific facts in competitor notes, not in reusable taxonomy notes.
- Treat recommendation quality and arbitration quality as separate dimensions.

## Competition watchlist (direct vs adjacent)

### Direct competition candidates

Tools in this group can plausibly claim support for conflict arbitration, prioritization logic, or governance-grade decision traceability in multi-stakeholder environments.

- Make.org
- Decidim
- Go Vocal
- Open Source Politics

### Adjacent workflow and collaboration products

Tools in this group provide high value in request intake, workflow execution, or collaboration structure but do not natively solve governance-grade strategic arbitration as a first-class product boundary.

- Wrike
- Airtable
- Miro
- Notion
- Guru

### Adjacent analytic and intelligence products

Tools in this group strengthen evidence gathering and analytical insight but are usually upstream inputs to arbitration rather than arbitration systems themselves.

- AlienVault Open Threat Exchange
- Maltego

## Direct vs adjacent decision rule

Classify as direct only if at least two of these are true:

1. The product formalizes explicit priority trade-offs when legitimate options conflict.
2. The product preserves reusable decision rationale (not only task history).
3. The product exposes governance controls for legitimacy, contestability, and role-bound authority.

Classify as adjacent when operational execution quality is high but strategic arbitration memory is weak or absent.

## Buyer, integration, and governance differences by category

| Category | Primary buyer | Integration posture | Governance posture |
| --- | --- | --- | --- |
| Direct arbitration systems | Strategy or governance owners, transformation sponsors | Medium to high: must connect input channels and downstream execution tools | Strong: legitimacy, traceability, contestability are central |
| Adjacent workflow products | Operations owners, program management leaders, delivery leads | Medium: often easier due to mature APIs and templates | Medium: approvals and status controls, but limited strategic rationale capture |
| Adjacent knowledge systems | Knowledge and enablement teams | Low to medium: document and retrieval integrations | Low to medium: memory is strong, arbitration logic is usually external |
| Adjacent intelligence products | Security, analysis, or insights teams | Medium to high: data connectors and pipeline dependencies | Low to medium: evidence quality is strong, decision accountability sits elsewhere |

## Airtable relevance note

Airtable is adjacent but strategically important to track.

Reason:

- Airtable scoring patterns can approximate decision-support behavior.
- scoring logic can look like arbitration at first glance.
- Most implementations still sit closer to operational prioritization and coordination unless explicit governance rationale, conflict resolution rules, and reusable arbitration history are added.

See [strategy/market-analysis/competitors/airtable.md](../competitors/airtable.md) for the product-specific boundary note.

## Reusable routing rule for new research artifacts

- Add to backlog when the research need is acknowledged but the output shape is not yet defined.
- Add to roadmap when multiple future notes depend on one shared operating rule or sequence.
- Add to a competitor note when the material is product- or company-specific.
- Add to reusable market-research notes when the material is category-level, architecture-level, or method-level and should inform multiple competitor notes.

## Next suggested slice

- Run one structured update pass on direct competitor notes using the direct-vs-adjacent decision rule and governance checklist.
- Add one monthly watchlist refresh cadence note if update frequency remains high.