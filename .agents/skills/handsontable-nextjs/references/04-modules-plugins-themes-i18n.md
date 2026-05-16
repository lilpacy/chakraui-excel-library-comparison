# Modules / Plugins / Themes / i18n

## モジュール登録の考え方

Handsontable は base module が必須で、その他は cell type、plugin、translation などの optional module として扱う。開発初期は `registerAllModules()` で素早く始め、本番では必要な module だけに絞る。

```ts
import { registerAllModules } from 'handsontable/registry';

registerAllModules();
```

個別登録の基本:

```ts
import Handsontable from 'handsontable/base';
import { registerCellType, NumericCellType, DropdownCellType } from 'handsontable/cellTypes';
import { registerPlugin, Filters, DropdownMenu, ContextMenu, MultiColumnSorting } from 'handsontable/plugins';
import { registerLanguageDictionary, jaJP } from 'handsontable/i18n';

void Handsontable;

registerCellType(NumericCellType);
registerCellType(DropdownCellType);
registerPlugin(Filters);
registerPlugin(DropdownMenu);
registerPlugin(ContextMenu);
registerPlugin(MultiColumnSorting);
registerLanguageDictionary(jaJP);
```

## Cell type modules

- `AutocompleteCellType` → `autocomplete`
- `CheckboxCellType` → `checkbox`
- `DateCellType` → `date`
- `DropdownCellType` → `dropdown`
- `HandsontableCellType` → `handsontable`
- `NumericCellType` → `numeric`
- `PasswordCellType` → `password`
- `SelectCellType` → `select`
- `TextCellType` → `text`
- `TimeCellType` → `time`

注意: React docs の navigation には `MultiSelect cell type` が追加されている。使用バージョンの module import 名と alias を必ず確認し、`type="multiselect"` を使う場合は package version の docs を見る。

## Renderer modules

- `baseRenderer`
- `autocompleteRenderer`
- `checkboxRenderer`
- `dateRenderer`
- `dropdownRenderer`
- `handsontableRenderer`
- `htmlRenderer`
- `numericRenderer`
- `passwordRenderer`
- `selectRenderer`
- `textRenderer`

## Editor modules

- `AutocompleteEditor`
- `BaseEditor`
- `CheckboxEditor`
- `DateEditor`
- `DropdownEditor`
- `HandsontableEditor`
- `NumericEditor`
- `PasswordEditor`
- `SelectEditor`
- `TextEditor`

## Validator modules

- `autocompleteValidator`
- `dateValidator`
- `dropdownValidator`
- `numericValidator`
- `timeValidator`

## Plugin modules

公式 modules list にある plugin module:

- `AutoColumnSize`
- `AutoRowSize`
- `Autofill`
- `BasePlugin`
- `BindRowsWithHeaders`
- `CollapsibleColumns`
- `ColumnSorting`
- `ColumnSummary`
- `Comments`
- `ContextMenu`
- `CopyPaste`
- `CustomBorders`
- `DragToScroll`
- `DropdownMenu`
- `ExportFile`
- `Filters`
- `Formulas`
- `HiddenColumns`
- `HiddenRows`
- `ManualColumnFreeze`
- `ManualColumnMove`
- `ManualColumnResize`
- `ManualRowMove`
- `ManualRowResize`
- `MergeCells`
- `MultiColumnSorting`
- `MultipleSelectionHandles`
- `NestedHeaders`
- `NestedRows`
- `Search`
- `StretchColumns`
- `TouchScroll`
- `TrimRows`
- `UndoRedo`

実装時は plugin module 名、設定 prop 名、API plugin key を混同しない。

例:

```tsx
<HotTable
  data={rows}
  filters={true}
  dropdownMenu={true}
  contextMenu={true}
  multiColumnSorting={true}
  hiddenColumns={{ columns: [0], indicators: true }}
  manualColumnResize={true}
  manualRowMove={true}
  mergeCells={true}
  comments={true}
  search={true}
  licenseKey="non-commercial-and-evaluation"
/>
```

## Guide / feature map も確認する

plugin module list だけを見ると、UI機能や guide-level feature を見落としやすい。以下も要件に応じて確認する。

### Columns

- Column headers
- Column groups / NestedHeaders
- Column hiding / HiddenColumns
- Column moving / ManualColumnMove
- Column freezing / ManualColumnFreeze
- Column widths / ManualColumnResize / AutoColumnSize / StretchColumns
- Column summary / ColumnSummary
- Column virtualization
- Column menu / DropdownMenu
- Column filter / Filters

### Rows

- Row headers
- Row parent-child / NestedRows
- Row hiding / HiddenRows
- Row moving / ManualRowMove
- Row freezing
- Row heights / ManualRowResize / AutoRowSize
- Row virtualization
- Rows sorting / ColumnSorting / MultiColumnSorting
- Rows pagination
- Row trimming / TrimRows
- Row pre-populating / spare rows

### Cell features

- Clipboard / CopyPaste
- Selection / MultipleSelectionHandles
- Merge cells / MergeCells
- Conditional formatting / `cells`, `cell`, `className`, custom renderer
- Text alignment / `className`
- Disabled cells / `readOnly`, `editor={false}`
- Comments / Comments
- Autofill values / Autofill
- Formatting cells / renderer, numeric/date/time formats

### Navigation / UX / other

- Formulas / Formulas + HyperFormula
- Keyboard shortcuts
- Custom shortcuts
- Focus scopes
- Searching values / Search
- Accessibility
- Context menu / ContextMenu
- Undo and redo / UndoRedo
- Icon pack
- Export to CSV / ExportFile
- Empty Data State
- Dialog
- Loading

## Themes

Built-in themes:

- `main`: spreadsheet-like。既定で使いやすい。
- `horizon`: data display / analysis 向け。
- `classic`: legacy look の置き換え。

Theme API 推奨:

```tsx
import { mainTheme, registerTheme } from 'handsontable/themes';

const theme = registerTheme(mainTheme)
  .setColorScheme('auto')
  .setDensityType('comfortable');

<HotTable theme={theme} />
```

CSS file 方式:

```tsx
import 'handsontable/styles/ht-theme-main.min.css';

<HotTable theme="ht-theme-main" />
```

Available CSS files:

- `handsontable.css` / `handsontable.min.css` — structural/base CSS。通常は auto-injected だが、手動注入にする場合は `injectCoreCss: false` を確認。
- `ht-theme-main.css` / `.min.css`
- `ht-theme-main-no-icons.css` / `.min.css`
- `ht-theme-horizon.css` / `.min.css`
- `ht-theme-horizon-no-icons.css` / `.min.css`
- `ht-theme-classic.css` / `.min.css`
- `ht-theme-classic-no-icons.css` / `.min.css`
- `ht-icons-main.css` / `.min.css`
- `ht-icons-horizon.css` / `.min.css`

## i18n / language modules

Translation modules:

- `arAR` — Arabic Global
- `csCZ` — Czech Czech Republic
- `deCH` — German Switzerland
- `deDE` — German Germany
- `enUS` — English United States
- `esMX` — Spanish Mexico
- `faIR` — Persian Iran
- `frFR` — French France
- `hrHR` — Croatian Croatia
- `itIT` — Italian Italy
- `jaJP` — Japanese Japan
- `koKR` — Korean Korea
- `lvLV` — Latvian Latvia
- `nbNO` — Norwegian Bokmål Norway
- `nlNL` — Dutch Netherlands
- `plPL` — Polish Poland
- `ptBR` — Portuguese Brazil
- `ruRU` — Russian Russia
- `srSP` — Serbian Serbia
- `zhCN` — Chinese China
- `zhTW` — Chinese Taiwan

日本語 UI 例:

```tsx
import { registerLanguageDictionary, jaJP } from 'handsontable/i18n';

registerLanguageDictionary(jaJP);

<HotTable language={jaJP.languageCode} locale="ja-JP" />
```

確認ポイント:

- `language`: UI文字列、context menu などの翻訳。
- `locale`: numeric/date/time 表示や Intl formatting。
- `layoutDirection`: RTL 言語で必要。
- IME support: 日本語・中国語・韓国語入力の編集 UX をテストする。

## Bundle size 最適化チェック

- [ ] `registerAllModules()` でよい段階か、個別登録に切り替えるべきか確認した。
- [ ] 使っていない plugin を有効化していない。
- [ ] 使っていない translation を登録していない。
- [ ] theme CSS を重複 import していない。
- [ ] `formulas` を使わないのに HyperFormula を bundle に入れていない。
- [ ] dynamic import / `ssr: false` の必要性を確認した。
