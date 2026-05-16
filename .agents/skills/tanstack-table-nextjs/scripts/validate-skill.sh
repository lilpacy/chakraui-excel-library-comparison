#!/usr/bin/env bash
set -euo pipefail

skill_dir="${1:-.}"

if [[ ! -f "$skill_dir/SKILL.md" ]]; then
  echo "SKILL.md not found" >&2
  exit 1
fi

if ! grep -q '^---$' "$skill_dir/SKILL.md"; then
  echo "SKILL.md frontmatter delimiter not found" >&2
  exit 1
fi

if ! grep -q '^name: tanstack-table-nextjs$' "$skill_dir/SKILL.md"; then
  echo "Unexpected or missing skill name" >&2
  exit 1
fi

if ! grep -q '^description:' "$skill_dir/SKILL.md"; then
  echo "Missing description" >&2
  exit 1
fi

echo "Skill structure looks OK: $skill_dir"
