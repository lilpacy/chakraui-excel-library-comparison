# トラブルシュート

| 症状 | 主な原因 | 対処 |
|---|---|---|
| Next.jsで `window is not defined` / hydration error | Server Component/SSRでGridを読み込んでいる | Grid本体をClient Componentにし、必要ならClient wrapper内で `dynamic(..., { ssr:false })` を使う。 |
| App Routerで `ssr:false` が効かない | Server Component内で `dynamic` を使っている | `"use client"` 付きwrapperへ移す。 |
| Gridが表示されない | 親要素の高さが0 / CSS未読込 | 親に明示heightを与え、`@glideapps/glide-data-grid/dist/index.css` をglobal importする。 |
| セル編集しても値が戻る | `onCellEdited` でstate/source of truthを更新していない | 編集callbackで外部データを更新する。 |
| 編集できない | `allowOverlay:false`, `readonly:true`, `provideEditor`不足 | セル型に応じて `allowOverlay` と編集callbackを確認する。 |
| コピーできない/値がおかしい | `getCellsForSelection` / `copyData` 未設定 | `getCellsForSelection` を有効化し、各セルに `copyData` を設定する。 |
| 画像overlayが崩れる | carousel CSS / portal不足 | carousel CSSを読み込み、`#portal` をbody配下へ置く。 |
| 追加セルが表示されない | `customRenderers` に登録していない | `customRenderers={allCells}` または個別rendererを渡す。 |
| 追加セルのCSS/editorが崩れる | 追加依存CSS不足 | 追加セルの依存CSS、特にArticleCell系のToast UI CSSを確認する。 |
| 座標がずれる | `[row, col]` と誤解している | Glideは `[col, row]`。`const [col, row] = cell` にする。 |
| スクロールが重い | `getCellContent` が重い / columnsやcallbackが毎renderで変わる | `useMemo`, `useCallback`, キャッシュ、局所更新を使う。 |
| onPasteが型と合わない | バージョン差・型確認不足 | インストール済みの型定義で `onPaste` signatureを確認する。 |
| MarkdownやURLの安全性が心配 | ユーザー入力をそのまま表示している | アプリ側でsanitization/allowlist/URL validationを行う。 |
| BooleanCellでnull相当を表せない | `allowEmpty` や空値表現未設計 | 三値が必要なら `allowEmpty` と保存値変換を設計する。 |
| 行番号/checkbox列を自作している | `rowMarkers` の存在を見落としている | `rowMarkers="number"`, `"checkbox"`, `"both"` を使う。 |
| 秘匿値が見えてしまう | ProtectedではなくText等で返している | 権限がないセルは `GridCellKind.Protected` を返す。 |
| 未ロード値が空文字扱いになる | Loading状態を表現していない | 未取得セルは `GridCellKind.Loading` を返す。 |
| ソート/フィルタがGridだけで完結すると誤解 | Glideはデータソース非依存 | ヘッダイベントでアプリ側stateを更新し、表示データを並べ替える。 |
