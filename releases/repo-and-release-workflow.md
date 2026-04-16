# Repo And Release Workflow

This guide explains the practical workflow to keep DMG clean as a solo builder while preparing for fundraising, pilots, and future scaling.

## Why this file lives in `releases/`

This file is not only about fundraising.

It is about:

- preserving milestones
- organizing code and docs across repos
- managing demo baselines
- preparing future release discipline

So `releases/` is a better home than `fundraising/`.

## 1. Repositories: what each one is for

- `dmg-workspace`
  Active shareable engineering workspace. It contains the monorepo apps, packages, hooks, and shareable docs app.
- `dmg-strategy`
  Private planning workspace. It contains strategy, fundraising, network notes, release workflow notes, and baseline manifests.

Do not create a new repo for every new idea or vertical.
Keep one active engineering repo and one private planning repo unless the product genuinely diverges into a separate codebase.

## 2. What a demo state means

A demo state is simply a version of the product you want to preserve as a reference.

Examples:

- current streaming MVP demo
- first streamer-pilot-ready version
- first SaaS-readiness version
- first B2B walkthrough version

It is not a copied folder.
It is a known git revision that you can always return to.

## 3. How to preserve a demo state professionally

### Step A - Make a clean commit

In each repo that matters for the baseline, commit the exact state you want to preserve.

### Step B - Create an annotated tag

An annotated tag is a named marker attached to a commit.

### Step C - Record the SHAs in a manifest

Create a manifest in `releases/demo-baselines/` that records the exact commit SHA of each repo included in that baseline.

That file becomes your cross-repo reference point.

## 4. What a branch is

A branch is an independent line of work inside the same repo.

Examples:

- `main`
  stable ongoing branch
- `feature/tenant-runtime-config`
  work on tenant-backed runtime configuration
- `feature/ingress-adapter`
  work on Lumia abstraction

Branches let you work on a topic without mixing everything together immediately.

## 5. What feature work means

Feature work means a focused unit of change with a clear objective.

Examples:

- config to database
- ingress adapter abstraction
- first streamer settings page
- B2B walkthrough copy

One feature does not need its own repo.
Usually it needs its own branch and its own commits.

## 6. Recommended branch workflow for now

For a solo builder, keep it simple:

1. stay on `main` for stable day-to-day work
2. create a branch for larger risky work
3. merge back once the work is coherent

See [[releases/git-glossary-and-useful-commands]] for the line-by-line explanation of the example commands.

## 7. How to think about streaming, SaaS, and B2B versions

Do not think of them as separate copied products.

Think of them as:

- one evolving core engine
- different milestones
- different demos or packaging layers

At this stage:

- streaming MVP is the current operational wedge
- SaaS-readiness is the next architecture milestone
- B2B demo is a packaging or walkthrough milestone, not a separate codebase

### What this means concretely for code

If the repo contains 100 files, the demo does not live in a special smaller folder by default.

The demo is simply the state of the repo at a known milestone.

That is why:

- you preserve the milestone with commits and tags
- you explain the milestone with manifests and demo notes
- you create specific walkthroughs or configs for a use case instead of duplicating the whole codebase

Only split codebases later if the implementation genuinely diverges.

## 7.5 One frontend repo versus multiple product surfaces

One frontend repo does not mean one identical UI for every use case.

At this stage, the cleaner structure is:

- one shared frontend foundation inside `dmg-workspace`
- one shared design system or UI basis
- one shared data and auth layer when possible
- use-case-specific components, screens, settings, and entry flows on top

That means you can absolutely have:

- a streaming Explorer surface
- a B2B Explorer surface
- shared core list, filtering, auth, and permissions logic underneath

So the goal is not to make everything generic in a bland or over-universal way.

The goal is to keep the reusable base generic while making the use-case-specific layer explicit and modular.

Split into multiple frontend repos only when the product surfaces truly become separate applications with materially different build, deployment, or ownership needs.

There is still real frontend productization work to do before the UI feels SaaS-ready.

That work should be organized in this order:

1. agree on the product roadmap first
2. separate current-product docs from forward-looking roadmap docs
3. define the shared frontend foundation that stays common
4. define which surfaces are specific to streaming pilots, B2B demos, or future SaaS operator flows

That matters because a Kalyoz-oriented demo does not need every future SaaS surface immediately.

The professional path is not to over-generalize the UI too early.

The professional path is to keep one frontend repo, make the shared base explicit, and let use-case-specific surfaces grow behind clear component and route boundaries.

## 8. Documentation structure going forward

Use explicit folders in `dmg-strategy`:

- `analysis/`
  generated exports and valuation artifacts
- `fundraising/`
  one-pagers, briefs, decks, outreach material
- `releases/`
  baseline manifests, workflow docs, git glossary, release notes
- `strategy/`
  private roadmap and planning material

Keep shareable current-state product documentation in `/Users/mac/dmg-workspace/apps/docs`.

That separation makes it easier to extract:

- what exists now
- what is next
- what is still exploratory

### Documentation review rule across repos

Set the repo boundary first.

If a note is still strategic, exploratory, migration-sequencing-heavy, or unclear in scope, keep it in `dmg-strategy`.

Only move material into `dmg-workspace/apps/docs` after it has been rewritten as current-state or standing-rule documentation.

Once a change clearly belongs in `dmg-workspace`, run the review-target assembler before merge, tag, or baseline work when the change could affect more than one durable doc.

Treat that as part of the standard release-quality check for shareable documentation, not as an optional reminder.

Use:

- `pnpm docs:review-targets -- --event <event-type> --path <touched-path>`

Treat the command as a normal review aid.

It does not decide whether docs must change, but it should be part of the standard check for shareable doc-impacting work.

## 9. What to show investors

Show progressively:

1. one-pager
2. advisor brief or short deck
3. demo
4. selected architecture views
5. private repo access only in serious diligence cases

Do not make the repo public just to fundraise.

## 10. Practical rule of thumb

If a new version is just a milestone of the same product, use:

- commits
- branches
- tags
- manifests

If it is a genuinely different product with a different codebase, then consider a new repo.