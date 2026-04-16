# DMG Demo Baseline Manifest
Date: 2026-04-06

## Purpose

This manifest records the exact repository revisions that define the current demo baseline across the documentation, API, and webapp repos.

This is the professional way to freeze a reference state without copying entire folders.

## Historical status

This manifest is intentionally a legacy pre-monorepo baseline.

It should keep the old repo references because that was the real shape of the product on 2026-04-06.

Future baseline manifests should use the active repos:

- `dmg-workspace`
- `dmg-strategy`

## Current baseline

- `dmg-doc`: `demo-2026-04-06` tag in this repo is the authoritative marker for this baseline
- `dmg-api`: `5845f67aadc8471f669e97759a4a77a980b549f4`
- `dmg-webapp`: `76b5d002aecc4b549ec23b212078f5c09241bf3a`

## What this baseline represents

- current personal MVP state
- current demoable streaming product state
- current Lumia-backed launch architecture
- current documentation and valuation baseline

## How to use this file

When you want to preserve a new major stage, do **not** duplicate folders.
Instead:

1. make a clean commit in each repo
2. create an annotated git tag in each repo
3. create a new manifest file like this one with the new commit SHAs

## How this becomes useful later

This file becomes useful whenever you need to:

- rebuild or re-open the exact demo baseline
- explain to someone else which repo versions belonged together
- compare a later milestone against an earlier baseline
- recover the exact state used for a demo, pilot, or fundraising conversation

In practice, the manifest is the cross-repo map. The tag gives each repo a human-readable checkpoint name. The SHA gives the exact technical revision.

## If you forget to create a tag

If the commit SHA is recorded here, you can still recover the exact commit even if you forgot a tag, as long as the commit still exists in the git history.

What you lose without a tag is mainly convenience and readability.

The real risk is forgetting to create a clean commit at all. If the work was never committed, there is no reliable baseline to recover later.

## Why one manifest still helps when later milestones differ

The goal of this manifest is not to say that every later milestone uses the same frontend or backend forever.

The goal is to record which versions belonged together for this milestone.

You create a new manifest for each later milestone:

- one for the legacy pre-monorepo demo baseline
- one for streaming pilot baseline
- one for SaaS-readiness baseline
- one for B2B demo baseline

Each manifest records the exact trio of repos that made sense together at that time.

## Pair manifests with change notes

Future demo baselines should usually include a short note on what improved since the previous baseline.

That can be:

- a short section inside the manifest
- or a separate release-notes file linked from the manifest

The manifest answers "which revisions belonged together?"

The change notes answer "what is better or different in this baseline?"

## Suggested future baseline names

- `2026-04-06-demo-baseline`
- `2026-04-xx-streaming-pilot-baseline`
- `2026-04-xx-saas-readiness-baseline`
- `2026-04-xx-b2b-demo-baseline`

## Why this is better than copying folders

- no code duplication
- exact reproducibility
- clean history
- easier collaboration later
- standard professional release practice