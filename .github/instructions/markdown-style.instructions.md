---
applyTo: "analysis/**/*,external-network/**/*.md,fundraising/**/*.md,strategy/**/*.md,README.md"
description: "Use when writing durable markdown in the strategy repo, especially notes, roadmaps, contacts, analysis, and fundraising derivatives."
---

## Links

- Prefer repo-relative markdown links for internal references. Do not use absolute filesystem paths or `file://` links in internal markdown links.

## Voice and scope

- Keep durable notes, trackers, roadmaps, and strategic analysis in neutral voice. Avoid first-person phrasing unless the section is a verbatim quoted draft meant to be sent unchanged.
- Keep product names and vendor claims distinct from DMG's own thesis.

## Glossary

- Before using a new acronym or sector abbreviation, check `strategy/glossary.md`. If the term is not already defined, add it to the glossary in the same slice before relying on it in durable notes.
- Glossary-defined abbreviations are allowed in durable notes; do not rewrite them into full words just to avoid the acronym.
- Keep glossary entries monolingual. If a note or entry is written in English, keep any retention marker, qualifier, or metadata in English as well; if a note or entry is written in French, keep that metadata in French as well.

## Language

- Keep each durable note monolingual. If the note is for a French contact or prospect, write the whole note in French. If the note is for an English context, keep the whole note in English. Do not mix English and French sections inside the same note unless preserving a direct quote, an official proper name, or a term that is immediately defined.
- If the contact or prospect is French, keep the durable note fully in French. If the prospect language is English, keep the durable note fully in English.

## Note hygiene

- When a durable note is renamed or moved, delete the stale source file in the same slice unless a one-line redirect is intentionally needed during the transition.
- Delete obsolete zero-information files outright when no active transition need exists. Do not keep empty `obsolete` stubs just because a file existed earlier.
- When a backlog item or lane is promoted into a dedicated roadmap or another focused durable note, remove the superseded backlog text in the same slice unless the backlog still carries distinct unscheduled work.

## Research snapshots

- For competitor research notes under `strategy/market-analysis/competitors/**`, include a `Snapshot date` field near the top of the note.
- On note creation, set `Snapshot date` to the creation date.
- On substantive updates, refresh `Snapshot date` to the update date in the same slice.
- When recovering or normalizing existing competitor notes, use the file's latest Git change date as the initial `Snapshot date` baseline.

