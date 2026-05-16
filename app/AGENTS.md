# ./app

Chakra UIのコンポーネント、スタイル設定を実装します。

## Chakra UI / Ark UI Usage

- `Field.Root` で `Checkbox.Root` のリスト全体を囲わないこと。`Field.Label` が単一 input の `id` / `for` に結びつき、複数行の checkbox が同じ input を参照して誤 toggle になることがある。
- checkbox の一覧に見出しを付けるときは、`Field.Label` ではなく通常の `Text` などでセクション見出しを描画するか、各 checkbox が独立した関連付けを保てる group / fieldset パターンを使うこと。
- Chakra UI / Ark UI の `Dialog` はデフォルトで modal であり、`body[data-inert]`, scroll lock, `pointer-events: none`, `aria-hidden` などのグローバル副作用を持つことに注意しなさい。
- 軽量なフィルタ picker や補助UIには、必要がなければ `Dialog` を modal のまま使わず、`modal={false}` と `preventScroll={false}` を検討しなさい。
- `Dialog` の `onOpenChange`, `onClose`, `CloseTrigger`, `onConfirm` の中で `router.push`, `router.replace`, query string 更新などの route navigation を直接呼ばないこと。親コンポーネントで dialog close 後に実行しなさい。

## snippets

- 以下のsnippetが利用可能です。

```bash
npx @chakra-ui/cli snippet list
[dotenv@17.2.3] injecting env (0) from .env -- tip: 🛠️  run anywhere with `dotenvx run -- yourcommand`
┌  Chakra CLI ⚡️
│
●  Found 55 snippets
│
●  ┌────────────────────┬──────────────────────────────┐
│  │ name               │ dependencies                 │
│  ├────────────────────┼──────────────────────────────┤
│  │ accordion          │ react-icons                  │
│  │ action-bar         │ -                            │
│  │ alert              │ -                            │
│  │ avatar             │ -                            │
│  │ blockquote         │ -                            │
│  │ breadcrumb         │ -                            │
│  │ carousel           │ react-icons                  │
│  │ checkbox-card      │ -                            │
│  │ checkbox           │ -                            │
│  │ clipboard          │ react-icons                  │
│  │ close-button       │ react-icons                  │
│  │ color-mode         │ next-themes, react-icons     │
│  │ color-picker       │ react-icons                  │
│  │ combobox           │ -                            │
│  │ data-list          │ -                            │
│  │ dialog             │ -                            │
│  │ drawer             │ -                            │
│  │ empty-state        │ -                            │
│  │ field              │ -                            │
│  │ file-upload        │ react-icons                  │
│  │ hover-card         │ -                            │
│  │ input-group        │ -                            │
│  │ link-button        │ -                            │
│  │ menu               │ react-icons                  │
│  │ native-select      │ -                            │
│  │ number-input       │ -                            │
│  │ pagination         │ react-icons                  │
│  │ password-input     │ react-icons                  │
│  │ pin-input          │ -                            │
│  │ popover            │ -                            │
│  │ progress-circle    │ -                            │
│  │ progress           │ -                            │
│  │ prose              │ -                            │
│  │ provider           │ -                            │
│  │ qr-code            │ -                            │
│  │ radio-card         │ -                            │
│  │ radio              │ -                            │
│  │ rating             │ -                            │
│  │ segmented-control  │ -                            │
│  │ select             │ -                            │
│  │ skeleton           │ -                            │
│  │ slider             │ -                            │
│  │ splitter           │ -                            │
│  │ stat               │ -                            │
│  │ status             │ -                            │
│  │ stepper-input      │ react-icons                  │
│  │ steps              │ react-icons                  │
│  │ switch             │ -                            │
│  │ tag                │ -                            │
│  │ tags-input         │ -                            │
│  │ timeline           │ -                            │
│  │ toaster            │ -                            │
│  │ toggle-tip         │ react-icons                  │
│  │ toggle             │ -                            │
│  │ tooltip            │ -                            │
│  └────────────────────┴──────────────────────────────┘
│
└  🎉 Done!
```
