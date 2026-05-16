# tanstack-table-nextjs Skill

Next.jsでTanStack Table v8/latestを実装・修正・レビューするためのClaude Code Skillです。

## インストール例

Personal skillとして使う場合:

```bash
mkdir -p ~/.claude/skills
unzip tanstack-table-nextjs-skill.zip -d ~/.claude/skills/
```

Project skillとして共有する場合:

```bash
mkdir -p .claude/skills
unzip tanstack-table-nextjs-skill.zip -d .claude/skills/
```

展開後のパス例:

```text
.claude/skills/tanstack-table-nextjs-skill/SKILL.md
```

ディレクトリ名を`tanstack-table-nextjs`へ変更しても構いません。

## 内容

- `SKILL.md`: Skill本体
- `references/`: 実装ガイド、コンポーネント一覧、機能マトリクス、Next.jsパターン、公式Examples対応表、公式リンク
- `templates/`: client-side mode / server-side manual modeのテンプレート
- `checklists/`: レビュー用チェックリスト

## 想定依頼例

- 「Next.jsでTanStack Tableのデータテーブルを作って」
- 「TanStack Tableのpagination/sorting/filteringをserver-sideにして」
- 「shadcn/uiのDataTableをTanStack Tableで組んで」
- 「行選択、列表示切替、行アクション、検索を追加して」
- 「このTanStack Table実装をレビューして」
