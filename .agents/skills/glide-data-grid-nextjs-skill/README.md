# glide-data-grid-nextjs Skill

Next.jsで `@glideapps/glide-data-grid` を導入・実装・レビューするためのClaude Code Skillです。

## 配置例

Personal Skillとして使う場合:

```bash
mkdir -p ~/.claude/skills
cp -R glide-data-grid-nextjs ~/.claude/skills/
```

Project Skillとしてリポジトリに共有する場合:

```bash
mkdir -p .claude/skills
cp -R glide-data-grid-nextjs .claude/skills/
```

## 内容

- `SKILL.md`: Claude Codeが最初に読む入口
- `references/nextjs-setup.md`: App Router / Pages Router導入
- `references/component-and-cell-reference.md`: コンポーネント、props、標準セル、追加セルの網羅表
- `references/custom-cells-and-editors.md`: カスタムセルとエディタ実装
- `references/recipes.md`: 編集、選択、コピー、検索、テーマなどのレシピ
- `references/troubleshooting.md`: よくある問題と対処
- `examples/app-router/`: Next.js App Routerの最小例
- `scripts/verify_coverage.py`: 網羅性の簡易検証

## 検証

```bash
python scripts/verify_coverage.py
```
