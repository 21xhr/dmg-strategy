# Copilot Instructions – dmg-strategy

This is the strategy repo.

## Scope
- strategy and roadmap planning
- fundraising materials and investor-facing derivatives
- relationship and network management notes
- exploratory analysis and research drafts
- private release notes, baseline manifests, and working workflow notes

## Core behavior
- Write notes as durable planning material, not as answers to the last chat prompt.
- Preserve clean documentation tone. Avoid rhetorical questions, filler bridges, and wording that reads like inline chat.
- Use glossary-defined abbreviations when they are already established in `strategy/glossary.md`; do not expand them back into full phrases just to avoid the acronym.
- Use explicit, human-readable commit messages that name the concrete slice that landed. Avoid umbrella labels when the change is really a smaller route, policy, or doc boundary.
- When referring to repositories, use `strategy repo` for the private planning repo and `workspace repo` or `shareable repo` for the shareable workspace repo.
- Keep this instruction file short and let the tracked notes carry the durable policy.

## Routing rule
- Treat this file as the router for strategy work, not the end state for a request.
- When the user asks to implement the next slice of a roadmap, first identify the concrete slice, the owning repo, and the nearest implementation surface.
- If the work requires changes in dmg-workspace, switch to the matching instruction set in the workspace repo and work there; this includes anything under dmg-workspace/apps, shared API contracts, shared packages, and most roadmap slices that land in the workspace repo.
- When work lands in the workspace repo, load and follow the workspace repo instruction set and the workspace documentation dependency model before editing shareable code or docs.
- Do not satisfy an implementation request by only reshaping the roadmap or backlog unless the user explicitly asked for planning-only changes.
- If the roadmap item is still abstract, step one hop into the nearest note, code file, or tracker that controls the behavior, then complete that slice.
- If the same request spans multiple slices, complete them in sequence and keep each slice tied to its own validation point before moving on.

## Execution discipline
- When the user asks for one or more roadmap slices or implementation slices, keep going until every requested slice is complete and validated in the current turn unless blocked by an external dependency.
- When multiple slices are requested, complete them in sequence and keep the slice boundaries explicit; if commits are part of the workflow, prefer one commit boundary per completed slice before moving to the next.
- Do not yield early with a partial implementation when the request clearly asks for completion.

## Planning and roadmap handling
- Before landing strategy or architecture-impacting material, check `strategy/backlog.md` and any relevant `strategy/roadmaps/` note so new work stays aligned with the tracked plan.
- When creating or reshaping a roadmap, include a status snapshot and explicit completion criteria or checkpoint signals so archival decisions do not rely on memory or gut feel.
- When reshaping a roadmap, keep the execution sequence concrete and justified: active lanes should have a current status snapshot, explicit completion criteria, and a clear reason they belong in `Now` or `Next`.
- When working a roadmap slice, update the active roadmap note in the same slice with the completed work, the next suggested slice, and any farther move that is now concrete enough to name.
- Do not finish a roadmap implementation slice without refreshing the active roadmap note so it still points at the next concrete slice.
- When a roadmap stays active after a slice lands, end the note with a concrete next suggested slice; if the slice is broad enough, also name the farther move.
- When a roadmap reaches its completion criteria and the relevant code validation passes, archive it in `strategy/roadmaps/archive/` with a date-prefixed filename and remove it from the active execution sequence in the same slice.
- Do not keep archived-roadmap history in backlog files; backlog entries are forward-looking only.
- When a roadmap's own completion criteria or status markers indicate that the track is mostly finished, ask whether it should be archived instead of leaving it in the active roadmap lane.
- When a note is renamed or moved, remove the stale source file in the same slice or replace it with a one-line pointer only when a temporary redirect is genuinely needed; do not keep old and new active copies side by side.

## Release workflow
- When work concerns preserving demo states, tags, or baseline manifests, follow [releases/repo-and-release-workflow.md](../releases/repo-and-release-workflow.md).
- Keep release-baseline guidance in that file.

## Repo boundary
- Treat `strategy/` as source material for internal reasoning and reusable theses.
- Treat `fundraising/` as derivative external-facing material distilled from strategy notes.
- Treat `external-network/` as the durable home for relationship context, discovery notes, and follow-up planning.
- When work concerns external network contacts, follow [external-network/plans/contact-documentation-workflow.md](../external-network/plans/contact-documentation-workflow.md) so the contact note, action sheet, and broader thesis docs stay synchronized at the right level.

## Shareable-doc migration guideline
- When a document matures into shareable source-of-truth content, move it to the workspace docs app.
- Do not duplicate shareable docs here once migrated.
- Use the workspace docs system notes for shareable documentation placement, naming, and code-maintenance rules.
