# react-datasheet-grid-nextjs Claude Code Skill

This folder is a Claude Code Skill for implementing and troubleshooting React Datasheet Grid in Next.js.

## Install

Copy the `react-datasheet-grid-nextjs` folder into one of these locations:

```text
~/.claude/skills/react-datasheet-grid-nextjs
```

or, for a repository-shared skill:

```text
.claude/skills/react-datasheet-grid-nextjs
```

Claude Code discovers the skill by reading the `name` and `description` frontmatter in `SKILL.md`.

## Contents

```text
react-datasheet-grid-nextjs/
├── SKILL.md
├── README.md
├── SOURCE_NOTES.md
├── reference/
│   ├── react-datasheet-grid-api.md
│   ├── nextjs-integration.md
│   └── custom-columns-and-recipes.md
└── examples/
    ├── app-router/
    │   ├── ReactDatasheetGridExample.tsx
    │   └── layout-snippet.tsx
    ├── pages-router/
    │   └── _app.snippet.tsx
    └── components/
        └── SelectColumn.tsx
```

## Scope

The skill is optimized for `react-datasheet-grid` v4.11.x and Next.js App Router / Pages Router projects. It includes a full checklist of exported components, built-in columns, helpers, public types, grid props, column props, cell props, ref API, and row operation handling.
