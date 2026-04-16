# Git Glossary And Useful Commands

## Purpose

This file is the source of truth for the git vocabulary and commands used in DMG release and milestone management.

## Core vocabulary

### Commit

A commit is a saved checkpoint in one repo.

Use case:

- "I want to preserve the current working version of the workspace."

### Branch

A branch is a parallel line of work in the same repo.

Use case:

- "I want to work on config-to-database without mixing it immediately into main."

### Tag

A tag is a named bookmark attached to one specific commit.

Use case:

- "I want a permanent named marker for the streaming demo baseline."

### Manifest

A manifest is a file that records which exact commits from multiple repos belong together for one milestone.

Use case:

- "I want to know exactly which docs, API, and webapp revisions formed the 2026-04-06 demo baseline."

### SHA

A SHA is the long unique identifier of a git commit.

Use case:

- "I need the exact technical revision, not just a human-readable name."

### Main

`main` is the primary branch of the repo.

Use case:

- stable ongoing line of development

## Useful commands

### Check the current state

```bash
git status
```

Shows modified, staged, and untracked files.

### Save a checkpoint

```bash
git add .
git commit -m "Describe the milestone"
```

Stages changes and saves them as a commit.

### Create a branch

```bash
git checkout -b feature/tenant-runtime-config
```

Creates and switches to a new branch.

### Return to main

```bash
git checkout main
```

Switches back to the main branch.

### Merge finished branch work

```bash
git merge feature/tenant-runtime-config
```

Brings the finished branch changes into main.

### Create an annotated tag

```bash
git tag -a demo-2026-04-06 -m "Streaming demo baseline"
```

Creates a named milestone bookmark.

### Show the current commit SHA

```bash
git rev-parse HEAD
```

Prints the exact SHA of the current commit.

### Show tags

```bash
git tag
```

Lists tags in the current repo.

### Show what a tag points to

```bash
git show demo-2026-04-06 --no-patch
```

Shows the tagged commit without printing the whole diff.

### Push commits

```bash
git push origin main
```

Pushes the main branch to GitHub.

### Push a tag

```bash
git push origin demo-2026-04-06
```

Pushes the named tag to GitHub.

## Atomic commits

Atomic commits are good practice.

That means each commit should ideally represent one coherent change.

You do not need to wait a whole day before committing.

In fact, many small clean commits are often better than one giant mixed commit.

## Push frequency

Pushing frequently is fine.

Professional practice is not about pushing rarely.

It is about understanding what each commit and tag represents.

Frequent pushes are useful for:

- backup
- collaboration
- preserving work across machines
- making milestone history safer

## Line-by-line explanation of the branch example

```bash
git checkout -b feature/tenant-runtime-config
# do the work
git add .
git commit -m "Move tenant runtime config toward database-backed settings"
git checkout main
git merge feature/tenant-runtime-config
```

- `git checkout -b feature/tenant-runtime-config`
  Create a new branch named `feature/tenant-runtime-config` and switch to it.
- `# do the work`
  Edit files normally.
- `git add .`
  Stage all changed files in this repo.
- `git commit -m "Move tenant runtime config toward database-backed settings"`
  Save that branch work in a commit.
- `git checkout main`
  Switch back to the main branch.
- `git merge feature/tenant-runtime-config`
  Bring the completed branch changes into main.

## Reassurance rule

If you are unsure whether you should copy folders or create a new repo, the answer is usually: neither.

Use commits, branches, tags, and manifests first.