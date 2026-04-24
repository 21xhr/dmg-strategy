# Copilot Instructions – dmg-strategy

This is the strategy repo.

## What belongs here
- strategy and roadmap planning
- fundraising materials and investor-facing derivatives
- relationship and network management notes
- exploratory analysis and research drafts
- private release notes, baseline manifests, and working workflow notes

## What does not belong here
- shareable product or engineering current-state documentation that should live in the workspace docs app

## Core behavior
- Write notes as durable planning material, not as answers to the last chat prompt.
- Before landing strategy or architecture-impacting material, check `strategy/backlog.md` and any relevant `strategy/roadmaps/` note so new work stays aligned with the tracked plan.
- Preserve clean documentation tone. Avoid rhetorical questions, filler bridges, and wording that reads like inline chat.
- Use glossary-defined abbreviations when they are already established in `strategy/glossary.md`; do not expand them back into full phrases just to avoid the acronym.
- Before creating a new note, check whether the content belongs in an existing source note or should be a short derivative that links back to one.
- When creating or reshaping a roadmap, include a status snapshot and explicit completion criteria or checkpoint signals so archival decisions do not rely on memory or gut feel.
- When a note is renamed or moved, remove the stale source file in the same slice or replace it with a one-line pointer only when a temporary redirect is genuinely needed; do not keep old and new active copies side by side.
- When reshaping a roadmap, keep the execution sequence concrete and justified: active lanes should have a current status snapshot, explicit completion criteria, and a clear reason they belong in `Now` or `Next`.
- When a roadmap's own completion criteria or status markers indicate that the track is mostly finished, ask whether it should be archived instead of leaving it in the active roadmap lane.
- Use explicit, human-readable commit messages that name the concrete slice that landed. Avoid umbrella labels when the change is really a smaller route, policy, or doc boundary.
- When referring to repositories, use `strategy repo` for `/Users/mac/dmg-strategy` and `workspace repo` or `shareable repo` for `/Users/mac/dmg-workspace`.

## Repo boundary
- Treat `strategy/` as source material for internal reasoning and reusable theses.
- Treat `fundraising/` as derivative external-facing material distilled from strategy notes.
- Treat `external-network/` as the durable home for relationship context, discovery notes, and follow-up planning.
- When work concerns external network contacts, follow `external-network/plans/contact-documentation-workflow.md` so the contact note, action sheet, and broader thesis docs stay synchronized at the right level.

## Shareable-doc migration guideline
- When a document matures into shareable source-of-truth content, move it to `/Users/mac/dmg-workspace/apps/docs`.
- Do not duplicate shareable docs here once migrated.
- For shareable documentation placement, naming, and code-maintenance rules, consult the standing notes in `/Users/mac/dmg-workspace/apps/docs/system-architecture/` and `/Users/mac/dmg-workspace/apps/docs/technical-implementation/` instead of restating those rules here.
