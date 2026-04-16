# Freeze And Tag A Demo Baseline - Reusable Commands

## Purpose

This file captures the git command pattern used to preserve a demo baseline across the two active repos.

Before running the commands below, choose:

- one commit message
- one tag name
- one baseline date label

Example placeholders used below:

- `<baseline-date>`
- `<baseline-tag>`
- `<freeze-commit-message>`

## 1. Freeze the workspace repo

```bash
cd /Users/mac/dmg-workspace
git status
git add .
git diff-index --quiet HEAD -- || git commit -m "<freeze-commit-message>"
git tag -a <baseline-tag> -m "DMG workspace baseline <baseline-date>"
git show --stat --oneline HEAD
git show <baseline-tag> --no-patch
```

## 2. Freeze the strategy repo

```bash
cd /Users/mac/dmg-strategy
git status
git add .
git diff-index --quiet HEAD -- || git commit -m "<freeze-commit-message>"
git tag -a <baseline-tag> -m "DMG strategy baseline <baseline-date>"
git show --stat --oneline HEAD
git show <baseline-tag> --no-patch
```

## What happens if there is nothing to commit

That is completely fine.

The `git diff-index --quiet HEAD -- || git commit ...` pattern means:

- if there are changes, create the freeze commit
- if there are no changes, skip the commit and tag the current `HEAD`

That is exactly what you want for a clean repo whose current `HEAD` is already the baseline.

## 4. Push commits and tags

```bash
cd /Users/mac/dmg-workspace
git push origin main
git push origin <baseline-tag>

cd /Users/mac/dmg-strategy
git push origin main
git push origin <baseline-tag>
```

## 5. Update the manifest if the SHAs changed

After committing, update the baseline manifest with the new commit SHAs from each active repo.

Commands:

```bash
cd /Users/mac/dmg-workspace && git rev-parse HEAD
cd /Users/mac/dmg-strategy && git rev-parse HEAD
```

## Historical note

If you are preserving or referencing a pre-monorepo demo baseline, keep using the old repo SHAs in that historical manifest.

Do not rewrite history just to make an old baseline look like it came from the new workspace layout.

## What each important command does

- `git status`
  Shows what is modified, new, or untracked.
- `git add .`
  Stages all current changes for the next commit.
- `git commit -m "..."`
  Creates a saved checkpoint with a message.
- `git tag -a ...`
  Creates a named bookmark attached to the current commit.
- `git show --stat --oneline HEAD`
  Shows the last commit summary and changed files.
- `git show <baseline-tag> --no-patch`
  Shows the tag object and the commit it points to.
- `git push origin main`
  Pushes commits to GitHub.
- `git push origin <baseline-tag>`
  Pushes the tag to GitHub.

## Commit and push cadence note

Small atomic commits are good professional practice.

You do not need to wait hours or days before committing.

Likewise, pushing frequently is not unprofessional. It is often useful for:

- backup
- remote visibility
- collaboration
- protecting milestone history

The real goal is not "push rarely."

The real goal is:

- commit coherently
- tag intentionally
- know which revision represents which milestone