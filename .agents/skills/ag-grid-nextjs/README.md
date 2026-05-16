# ag-grid-nextjs Skill

Claude Code 用の AG Grid + Next.js Skill です。

## インストール例

Personal skill として使う場合:

```bash
mkdir -p ~/.claude/skills/ag-grid-nextjs
cp -R ag-grid-nextjs/* ~/.claude/skills/ag-grid-nextjs/
```

Project skill として使う場合:

```bash
mkdir -p .claude/skills/ag-grid-nextjs
cp -R ag-grid-nextjs/* .claude/skills/ag-grid-nextjs/
```

## 内容

- `SKILL.md`: Skill 本体
- `reference/nextjs-setup.md`: Next.js 導入・SSR/Client Component 注意点
- `reference/component-catalog.md`: AG Grid component 種別・設定属性・provided component 一覧
- `reference/implementation-patterns.md`: 実装パターン集
- `reference/checklist.md`: レビュー用チェックリスト
- `examples/app-router-basic-grid.md`: App Router の基本実装例
- `examples/custom-components-examples.md`: custom component 実装例
