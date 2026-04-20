#!/bin/sh
set -eu

if [ "${DOC_CHAT_OK:-0}" = "1" ]; then
  exit 0
fi

repo_root=$(git rev-parse --show-toplevel)
cd "$repo_root"

tmp_output=$(mktemp)
tmp_scope_output=$(mktemp)
trap 'rm -f "$tmp_output" "$tmp_scope_output"' EXIT

staged_files=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.md$' || true)

if [ -z "$staged_files" ]; then
  exit 0
fi

pattern='^Here([,:]|[[:space:]]).*(means|refers to)\b|that is what .* means here|WDYM|What ".*" Means Here|^Yes,[[:space:]]|^No,[[:space:]]|^In plain terms,[[:space:]]|^This note provides\b|^This brief turns\b'
present_boundary_transition_pattern='\bno longer\b|\bused to\b|\bpreviously\b|\bformerly\b|\bbefore this change\b|\bafter this change\b|\bbefore migration\b|\bbefore the migration\b|\bafter migration\b|\bafter the migration\b|\bnow (depends|loads|runs|uses|includes|returns|separates|carries|lives|flows|ships|binds|resolves|stores|tracks|reads|writes)\b'

printf '%s\n' "$staged_files" | while IFS= read -r file; do
  [ -z "$file" ] && continue

  case "$file" in
    .github/copilot-instructions.md)
      continue
      ;;
  esac

  git show ":$file" | grep -nE "$pattern" | sed "s|^|$file:|" >> "$tmp_output" || true
done

printf '%s\n' "$staged_files" | grep -E '^(strategy/backlog\.md|strategy/roadmaps/.*\.md|strategy/[^/]+\.md|fundraising/plans/.*\.md|external-network/plans/.*\.md)$' | while IFS= read -r file; do
  [ -z "$file" ] && continue

  git show ":$file" | grep -niE "$present_boundary_transition_pattern" | sed "s|^|$file:|" >> "$tmp_scope_output" || true
done || true

if [ -s "$tmp_output" ] || [ -s "$tmp_scope_output" ]; then
  if [ -s "$tmp_output" ]; then
    echo "Blocked commit: possible chat-answer phrasing found in staged markdown files." >&2
    echo >&2
    cat "$tmp_output" >&2
    echo >&2
  fi

  if [ -s "$tmp_scope_output" ]; then
    echo "Blocked commit: present-boundary planning notes may contain migration-history wording." >&2
    echo >&2
    cat "$tmp_scope_output" >&2
    echo >&2
  fi

  echo "Rewrite the flagged phrasing into standalone documentation language, or bypass once with DOC_CHAT_OK=1 if the phrasing is genuinely required." >&2
  exit 1
fi

exit 0