#!/bin/sh
set -eu

if [ "${DOC_CHAT_OK:-0}" = "1" ]; then
  exit 0
fi

repo_root=$(git rev-parse --show-toplevel)
cd "$repo_root"

tmp_output=$(mktemp)
trap 'rm -f "$tmp_output"' EXIT

staged_files=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.md$' || true)

if [ -z "$staged_files" ]; then
  exit 0
fi

pattern='^Here([,:]|[[:space:]]).*(means|refers to)\b|that is what .* means here|WDYM|What ".*" Means Here|^Yes,[[:space:]]|^No,[[:space:]]|^In plain terms,[[:space:]]|^This note provides\b|^This brief turns\b'

printf '%s\n' "$staged_files" | while IFS= read -r file; do
  [ -z "$file" ] && continue

  case "$file" in
    .github/copilot-instructions.md)
      continue
      ;;
  esac

  git show ":$file" | grep -nE "$pattern" | sed "s|^|$file:|" >> "$tmp_output" || true
done

if [ -s "$tmp_output" ]; then
  echo "Blocked commit: possible chat-answer phrasing found in staged markdown files." >&2
  echo >&2
  cat "$tmp_output" >&2
  echo >&2
  echo "Rewrite the flagged phrasing into standalone documentation language, or bypass once with DOC_CHAT_OK=1 if the phrasing is genuinely required." >&2
  exit 1
fi

exit 0