# Copilot Instructions – dmg-strategy

This is the private planning workspace.

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
- Before creating a new note, check whether the content belongs in an existing source note or should be a short derivative that links back to one.
- When a roadmap's own completion criteria or status markers indicate that the track is mostly finished, ask whether it should be archived instead of leaving it in the active roadmap lane.

## Repo boundary
- Treat `strategy/` as source material for internal reasoning and reusable theses.
- Treat `fundraising/` as derivative external-facing material distilled from strategy notes.
- Treat `external-network/` as the durable home for relationship context, discovery notes, and follow-up planning.
- When work concerns external network contacts, follow `external-network/plans/contact-documentation-workflow.md` so the contact note, action sheet, and broader thesis docs stay synchronized at the right level.

## Shareable-doc migration guideline
- When a document matures into shareable source-of-truth content, move it to `/Users/mac/dmg-workspace/apps/docs`.
- Do not duplicate shareable docs here once migrated.
- For shareable documentation placement, naming, and code-maintenance rules, consult the standing notes in `/Users/mac/dmg-workspace/apps/docs/system-architecture/` and `/Users/mac/dmg-workspace/apps/docs/technical-implementation/` instead of restating those rules here.
