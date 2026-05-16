# handsontable-nextjs Skill

Claude Code 用の Skill パッケージです。Next.js で Handsontable を使うための実装手順、コンポーネント種別、セル型、plugin、hooks、テーマ、i18n をまとめています。

## インストール例

```bash
mkdir -p ~/.claude/skills
unzip handsontable-nextjs-skill.zip -d ~/.claude/skills/
```

展開後のパスが次のようになるようにしてください。

```text
~/.claude/skills/handsontable-nextjs/SKILL.md
```

プロジェクト共有にしたい場合は、リポジトリ直下に配置します。

```text
.claude/skills/handsontable-nextjs/SKILL.md
```

## 内容

```text
handsontable-nextjs/
├── SKILL.md
├── references/
│   ├── 01-nextjs-setup.md
│   ├── 02-component-inventory.md
│   ├── 03-cell-types-and-cell-functions.md
│   ├── 04-modules-plugins-themes-i18n.md
│   ├── 05-hooks-api-data-saving.md
│   ├── 06-quality-checklist.md
│   └── sources.md
├── examples/
│   ├── app-router/
│   ├── pages-router/
│   └── custom-editor/
└── scripts/
    └── scaffold-handsontable-nextjs.mjs
```

## 使い方の例

Claude Code に次のように依頼すると、この Skill が発動しやすくなります。

- `Next.js App RouterでHandsontableの編集可能な表を作って`
- `HotTable/HotColumnの使い方をレビューして`
- `Handsontableのセル型とプラグインを漏れなく選定して`
- `@handsontable/react-wrapperに移行して`
- `Next.jsでHandsontableをSSRエラーなしに表示して`
