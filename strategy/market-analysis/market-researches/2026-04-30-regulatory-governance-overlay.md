# 2026-04-30 Regulatory and Governance Overlay for DSS-Style Systems

## Purpose

Implement Phase 4 of the market-research roadmap by adding one reusable governance overlay that can be applied across competitor and architecture reviews.

## Scope

This note focuses on governance constraints that materially affect strategic-arbitration products and adjacent DSS-style systems:

- auditability
- explainability
- human oversight
- accountability and role boundaries
- data provenance and retention

## Practical overlay matrix

| Governance dimension | Low-risk posture | Elevated-risk posture | Research signal to capture |
| --- | --- | --- | --- |
| Auditability | Decision logs exist and are queryable | Logs are partial, opaque, or unavailable | whether rationale and alternatives are preserved |
| Explainability | Decision factors are explicit and reviewable | Output is opaque or justification is generic | whether non-technical stakeholders can understand why |
| Human oversight | Role authority and override paths are explicit | Automation can bypass accountable decision owners | who can approve, challenge, or override |
| Accountability | Decision ownership is assigned and traceable | Ownership is diffuse or implied | where accountability is recorded in workflow |
| Data provenance | Input origin and transformation are trackable | Input lineage is unclear or undocumented | whether evidence source can be reconstructed |
| Retention and reuse | Decision history is retained and reusable | History is fragmented or inaccessible | whether similar cases can reuse prior logic |

## Reusable governance checklist

Use this checklist in each competitor or architecture note:

1. Is priority arbitration explicit when legitimate options conflict?
2. Is the decision rationale persisted beyond task status changes?
3. Can an authorized actor challenge and review a decision path?
4. Is role-based authority clear for approval and override?
5. Can input evidence lineage be inspected after the fact?
6. Are similar cases able to reuse prior decision logic with context?

## Integration point for competitor notes

When a competitor note is updated, add one short "Governance boundary" subsection that answers the six checklist questions at a high level.

Initial integration targets already in repo:

- [strategy/market-analysis/competitors/wrike/wrike-governance-boundary-analysis.md](../competitors/wrike/wrike-governance-boundary-analysis.md)
- [strategy/market-analysis/competitors/make-org.md](../competitors/make-org.md)
- [strategy/market-analysis/competitors/decidim.md](../competitors/decidim.md)
- [strategy/market-analysis/competitors/govocal.md](../competitors/govocal.md)
- [strategy/market-analysis/competitors/open-source-politics.md](../competitors/open-source-politics.md)
- [strategy/market-analysis/competitors/airtable.md](../competitors/airtable.md)

## EU AI Act relevance (planning lens)

For this roadmap stage, treat EU AI Act implications as a governance sensitivity overlay rather than a full legal memo.

- Higher automation and lower explainability increase governance and adoption risk.
- Systems that preserve rationale, authority, and audit paths are better aligned with trust and oversight expectations.
- High-stakes strategic arbitration needs explicit human accountability, even when recommendation quality is high.

## Next suggested slice

- Add one recurring review checkpoint for governance claims when competitor notes are refreshed.
- Split this overlay into a standing governance-review template if updates become frequent.