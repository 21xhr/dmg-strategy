---
applyTo: "strategy/**/*.md,external-network/**/*.md,fundraising/**/*.md,README.md"
description: "Use when writing durable markdown in the strategy repo, especially notes, roadmaps, contacts, analysis, and fundraising derivatives."
---

Use the following markdown style rules for durable repo writing:

- Prefer repo-relative markdown links for internal references. Do not use absolute filesystem paths or `file://` links in internal markdown links.
- Keep durable notes, trackers, roadmaps, and strategic analysis in neutral voice. Avoid first-person phrasing unless the section is a verbatim quoted draft meant to be sent unchanged.
- Before using a new acronym or sector abbreviation, check `strategy/glossary.md`. If the term is not already defined, add it to the glossary in the same slice before relying on it in durable notes.
- Introduce abbreviations once with their expansion where practical, then use the short form consistently.
- Keep product names and vendor claims distinct from DMG's own thesis.
- When a durable note is renamed or moved, delete the stale source file in the same slice unless a one-line redirect is intentionally needed during the transition.
