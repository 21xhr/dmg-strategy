# 2026-04-30 DSS Architecture Deep Dives and Comparison

## Purpose

Implement Phase 3 of the market-research roadmap by creating focused architecture deep dives and one reusable cross-architecture comparison table.

## Architecture deep dives (strategic relevance to DMG)

### Data-driven DSS

Core strength:

- turns high-volume structured data into ranked outputs quickly

Boundary relative to DMG:

- strong on signal ordering
- weaker when legitimacy and reusable arbitration rationale must be explicit

Strategic implication:

- useful as input layer for arbitration
- not sufficient alone for governance-grade conflict resolution

### Model-driven DSS

Core strength:

- optimization and simulation under constraints

Boundary relative to DMG:

- strong on mathematically optimized recommendations
- can miss social legitimacy and cross-stakeholder contestability if rationale is not operationalized

Strategic implication:

- strong candidate for recommendation engines behind DMG-assisted arbitration circuits

### Knowledge-driven DSS

Core strength:

- codifies expert rules and domain logic into repeatable recommendations

Boundary relative to DMG:

- highest overlap with reusable decision logic
- still needs role-aware governance and conflict-resolution process framing

Strategic implication:

- strongest architecture family for DMG methodology integration

### Communication-driven DSS

Core strength:

- structures deliberation across stakeholders

Boundary relative to DMG:

- strong for participation and transparency
- often weak on converting deliberation into reusable, formal arbitration history

Strategic implication:

- relevant for upstream legitimacy and input quality
- needs an arbitration layer to close decision loops

### Agentic DSS

Core strength:

- orchestrates multi-step recommendations and handoffs

Boundary relative to DMG:

- high automation potential
- requires clear human override, authority boundaries, and explainability for high-stakes arbitration

Strategic implication:

- valuable support layer once governance circuits and role boundaries are explicit

## Cross-architecture comparison table

| Architecture family | Deciding mechanism | Integration burden | Governance posture | Human-in-the-loop boundary |
| --- | --- | --- | --- | --- |
| Data-driven DSS | Weighted ranking and threshold rules on observable metrics | Medium: connectors to operational and reporting systems | Medium: audit trail may exist but rationale depth varies | Human reviews exceptions and high-impact conflicts |
| Model-driven DSS | Constraint optimization and scenario simulation | Medium to high: model calibration and data fidelity requirements | Medium: strong optimization trace, weaker legitimacy framing unless designed | Human sets constraints and approves non-routine outcomes |
| Knowledge-driven DSS | Rule engines and encoded expert logic | Medium: rule maintenance and policy alignment overhead | High potential when explanation and traceability are explicit | Human governs rule changes and contested decisions |
| Communication-driven DSS | Deliberation and consensus workflows | Low to medium: collaboration tooling is often mature | Medium: transparent discussion, variable formal rationale capture | Human participants drive both inputs and final decisions |
| Agentic DSS | Autonomous recommendation chains with escalation policies | High: orchestration, guardrails, and monitoring requirements | Variable: depends on explicit oversight controls and model governance | Human signs off on high-stakes actions and policy exceptions |

## Prompt templates for recurring use

### Broad scan template

Use when a category boundary is unclear.

Prompt template:

"Map the current [category] landscape in 2026. Separate direct substitutes from adjacent complements. For each cluster, extract deciding mechanism, buyer, integration posture, and governance posture. Output in one comparison table plus one short boundary summary."

### Architecture deep-dive template

Use when one architecture family needs deeper strategic interpretation.

Prompt template:

"Analyze [architecture family] decision systems in 2026. Explain deciding mechanism, data dependencies, integration burden, governance strengths and weaknesses, and human override patterns. End with implications for DMG's product boundary and go-to-market language."

### Regulatory deep-dive template

Use when compliance and governance constraints affect category fit.

Prompt template:

"Assess governance and regulatory constraints for [category/use case] with focus on auditability, explainability, human oversight, data provenance, and accountability. Distinguish low-risk and high-risk deployment patterns and list product-design implications."

## Next suggested slice

- Use this comparison table as the baseline when updating competitor notes that currently blend architecture claims and company claims.
- Add one evidence refresh date to this note when a substantive update changes category boundaries.