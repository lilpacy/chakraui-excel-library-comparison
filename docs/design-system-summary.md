# Design System Summary

`raw/design-system-screenshots` にあるスクリーンショットをもとに、現時点のデザインシステムを文章で整理したメモ。  
このファイルは要約と完全転記を兼ねる。前半で設計ルールをまとめ、後半でスクショ由来の token をすべて列挙する。

## 1. 全体像

- ベースはダークグレー背景上にトークンを一覧表示したデザインシステム資料。
- 設計の中心は「色の実体値」よりも「Semantic token の使い分け」にある。
- Light / Dark の両テーマを前提にしており、同じ意味を持つ token がテーマごとに別スケールへマッピングされている。
- アクセントカラーは 12 系統あり、各色で共通の運用パターンを取る。

## 2. 基本カラー

コアの単色は以下の 3 つ。

| Token | Value |
| --- | --- |
| `color/black` | `#000000` |
| `color/white` | `#FFFFFF` |
| `color/brand` | `#11A8C1` |

ブランドカラーはシアン寄りのブルーグリーンで、プロダクトの識別色として使う前提に見える。

## 3. パレット構成

### Neutral

- `color/gray`: `50` から `950` までの 11 段階
- `color/gray-alpha`: `0A0A0A` の透明度違いで `5%` から `90%`
- `color/green-gray`: `50` から `950` までの 11 段階

ニュートラルは単なる無彩色だけでなく、少しグリーンに寄せた `green-gray` が用意されている。  
これにより、無機質すぎない面や区切りを作る設計になっている。

### Accent

アクセント系は以下の 12 ファミリー。

- `blue`
- `aqua`
- `teal`
- `green`
- `lime`
- `yellow`
- `orange`
- `red`
- `magenta`
- `fuchsia`
- `purple`
- `iris`

各アクセント色は基本的に `50` から `900` までのスケールを持つ。

## 4. Semantic Color Rules

### Text

本文系のテキスト token は以下のマッピング。

| Token | Light | Dark |
| --- | --- | --- |
| `primary` | `gray/950` | `gray/100` |
| `secondary` | `gray/700` | `gray/300` |
| `tertiary` | `gray/500` | `gray/400` |
| `success` | `green/700` | `green/100` |
| `danger` | `red/700` | `red/100` |
| `warning` | `yellow/700` | `yellow/100` |
| `information` | `blue/700` | `blue/100` |

要点は、通常テキストは Light では濃色、Dark では淡色に反転し、状態付きテキストも同じルールで統一されていること。

### Background

背景の基本 token は以下。

| Token | Light | Dark |
| --- | --- | --- |
| `primary` | `white` | `gray/900` |
| `secondary` | `gray/50` | `gray/950` |

ページ全体とカードやセクション背景を 2 層で使い分ける想定に見える。

### Emphasis / Divider 相当

境界線や控えめな面に使う token。

| Token | Light | Dark |
| --- | --- | --- |
| `midEmphasis` | `gray/200` | `gray/700` |
| `lowEmphasis` | `gray/100` | `gray/800` |

Light では薄いグレー、Dark では少し明るいグレーを使って、テーマごとに視認性を揃えている。

### Accent Text / Accent Background / Hover

アクセント色の semantic 運用には明確な規則がある。

- Accent text: Light は `700`、Dark は `100`
- Accent background: Light は `100`、Dark は `700`
- Accent hover background: Light は `200`、Dark は `600`

つまり、同じ色ファミリーでも「文字は強いコントラスト」「面は淡色/濃色」「hover は 1 段だけ強める」という一貫した階層になっている。

### Neutral Accent Background

色付きアクセントだけでなく、ニュートラル背景用の semantic token もある。

| Token | Light | Dark | Hover Light | Hover Dark |
| --- | --- | --- | --- | --- |
| `lightgray` | `gray/200` | `gray/600` | `gray/300` | `gray/500` |
| `darkgray` | `gray/300` | `gray/500` | `gray/400` | `gray/400` |
| `greengray` | `green-gray/200` | `green-gray/600` | - | - |

`greengray` に hover が見当たらないため、まずは通常背景の補助用途と考えるのが妥当。

### Status Color

ステータス色は Light / Dark ともに同一スケール。

| Token | Value |
| --- | --- |
| `success` | `green/500` |
| `danger` | `red/500` |
| `warning` | `yellow/500` |
| `information` | `blue/500` |

テキスト用 semantic token と違い、ステータス色はテーマ非依存で固定されている。

## 5. Typography

### Font Weight

| Token | Value |
| --- | --- |
| `regular` | `400` |
| `bold` | `600` |

見出しを極端に太くする設計ではなく、`600` を最大として比較的フラットに運用する前提。

### Font Size

| Token | Value |
| --- | --- |
| `xs` | `10` |
| `sm` | `12` |
| `md` | `14` |
| `lg` | `16` |
| `xl` | `18` |
| `2xl` | `20` |
| `3xl` | `24` |
| `4xl` | `30` |
| `5xl` | `36` |
| `6xl` | `48` |
| `7xl` | `64` |

### Line Height

| Token | Value |
| --- | --- |
| `xs` | `14` |
| `sm` | `18` |
| `md` | `20` |
| `lg` | `24` |
| `xl` | `28` |
| `2xl` | `30` |
| `3xl` | `36` |
| `4xl` | `44` |
| `5xl` | `48` |
| `6xl` | `72` |
| `7xl` | `96` |

タイポグラフィは `14/20` を本文の基準にしやすい構成で、情報量の多い UI に向いている。

## 6. Radius / Spacing

### Border Radius

| Token | Value |
| --- | --- |
| `none` | `0` |
| `sm` | `4` |
| `md` | `6` |
| `lg` | `8` |
| `xl` | `16` |
| `full` | `9999` |

角丸はかなり節度があり、基本 UI は `4` から `8` を中心に設計するのが自然。

### Spacing

Spacing は 4px グリッドが中心。

- `0 = 0`
- `px = 1`
- `1 = 4`
- `2 = 8`
- `3 = 12`
- `4 = 16`
- `5 = 20`
- `6 = 24`
- `7 = 28`
- `8 = 32`
- `9 = 36`
- `10 = 40`
- `12 = 48`
- `14 = 56`
- `16 = 64`
- `20 = 80`
- `24 = 96`
- `28 = 112`
- `32 = 128`
- `36 = 144`
- `40 = 160`
- `44 = 176`
- `48 = 192`
- `52 = 208`
- `56 = 224`
- `60 = 240`
- `64 = 256`
- `72 = 288`
- `80 = 320`
- `96 = 384`

## 7. 実装に向けた読み替え

この資料から読み取れる実装ルールは以下。

- 本文色は semantic token を優先し、実体色を直接参照しない
- アクセント色は「text = 700/100」「background = 100/700」「hover = 200/600」というパターンで統一する
- 背景は `primary` と `secondary` の 2 層で組み、境界線や補助面は `midEmphasis` と `lowEmphasis` を使う
- 角丸は `md` か `lg`、spacing は 4px グリッドを基本にする
- ブランドカラー `#11A8C1` は単独の識別色として扱い、既存の 12 色アクセントとは別軸で考える

## 8. 現状コードとのギャップ

現状の [`app/styles/_tokens.scss`](/Users/lilpacy/go/src/github.com/lilpacy/chakraui-excel-library-comparison/app/styles/_tokens.scss) は、このスクリーンショット群と一致していない。

主な差分:

- `font-size` はスクショが `10, 12, 14, ... 64` だが、現コードは Tailwind 系の `0.75rem, 0.875rem, 1rem, ...`
- `gray` と `blue` の実体値がスクショの値と異なる
- semantic token 群はまだコード側へ十分に反映されていない

したがって、この文書は「現行実装の説明」ではなく、「スクショを正とした設計意図の要約」として扱うのがよい。

## 9. Full Token Inventory

この章は `raw/design-system-screenshots` から読み取れる token の完全転記。

### Core Colors

| Token | Value |
| --- | --- |
| `color/black` | `#000000` |
| `color/white` | `#FFFFFF` |
| `color/brand` | `#11A8C1` |

### Semantic Tokens

#### Text

| Name | Light | Dark |
| --- | --- | --- |
| `primary` | `color/gray/950` | `color/gray/100` |
| `secondary` | `color/gray/700` | `color/gray/300` |
| `tertiary` | `color/gray/500` | `color/gray/400` |
| `success` | `color/green/700` | `color/green/100` |
| `danger` | `color/red/700` | `color/red/100` |
| `warning` | `color/yellow/700` | `color/yellow/100` |
| `information` | `color/blue/700` | `color/blue/100` |

#### Text Accent

| Name | Light | Dark |
| --- | --- | --- |
| `blue` | `color/blue/700` | `color/blue/100` |
| `aqua` | `color/aqua/700` | `color/aqua/100` |
| `teal` | `color/teal/700` | `color/teal/100` |
| `green` | `color/green/700` | `color/green/100` |
| `lime` | `color/lime/700` | `color/lime/100` |
| `yellow` | `color/yellow/700` | `color/yellow/100` |
| `orange` | `color/orange/700` | `color/orange/100` |
| `red` | `color/red/700` | `color/red/100` |
| `magenta` | `color/magenta/700` | `color/magenta/100` |
| `fuchsia` | `color/fuchsia/700` | `color/fuchsia/100` |
| `purple` | `color/purple/700` | `color/purple/100` |
| `iris` | `color/iris/700` | `color/iris/100` |

#### Background

| Name | Light | Dark |
| --- | --- | --- |
| `primary` | `color/white` | `color/gray/900` |
| `secondary` | `color/gray/50` | `color/gray/950` |

#### Background Accent

| Name | Light | Dark |
| --- | --- | --- |
| `lightgray` | `color/gray/200` | `color/gray/600` |
| `darkgray` | `color/gray/300` | `color/gray/500` |
| `greengray` | `color/green-gray/200` | `color/green-gray/600` |
| `blue` | `color/blue/100` | `color/blue/700` |
| `aqua` | `color/aqua/100` | `color/aqua/700` |
| `teal` | `color/teal/100` | `color/teal/700` |
| `green` | `color/green/100` | `color/green/700` |
| `lime` | `color/lime/100` | `color/lime/700` |
| `yellow` | `color/yellow/100` | `color/yellow/700` |
| `orange` | `color/orange/100` | `color/orange/700` |
| `red` | `color/red/100` | `color/red/700` |
| `magenta` | `color/magenta/100` | `color/magenta/700` |
| `fuchsia` | `color/fuchsia/100` | `color/fuchsia/700` |
| `purple` | `color/purple/100` | `color/purple/700` |
| `iris` | `color/iris/100` | `color/iris/700` |

#### Background Accent Hover

| Name | Light | Dark |
| --- | --- | --- |
| `lightgray` | `color/gray/300` | `color/gray/500` |
| `darkgray` | `color/gray/400` | `color/gray/400` |
| `blue` | `color/blue/200` | `color/blue/600` |
| `aqua` | `color/aqua/200` | `color/aqua/600` |
| `teal` | `color/teal/200` | `color/teal/600` |
| `green` | `color/green/200` | `color/green/600` |
| `lime` | `color/lime/200` | `color/lime/600` |
| `yellow` | `color/yellow/200` | `color/yellow/600` |
| `orange` | `color/orange/200` | `color/orange/600` |
| `red` | `color/red/200` | `color/red/600` |
| `magenta` | `color/magenta/200` | `color/magenta/600` |
| `fuchsia` | `color/fuchsia/200` | `color/fuchsia/600` |
| `purple` | `color/purple/200` | `color/purple/600` |
| `iris` | `color/iris/200` | `color/iris/600` |

#### Emphasis

| Name | Light | Dark |
| --- | --- | --- |
| `midEmphasis` | `color/gray/200` | `color/gray/700` |
| `lowEmphasis` | `color/gray/100` | `color/gray/800` |

#### Status

| Name | Light | Dark |
| --- | --- | --- |
| `success` | `color/green/500` | `color/green/500` |
| `danger` | `color/red/500` | `color/red/500` |
| `warning` | `color/yellow/500` | `color/yellow/500` |
| `information` | `color/blue/500` | `color/blue/500` |

### Foundation Palettes

#### Gray

| Scale | Hex |
| --- | --- |
| `50` | `#FAFAFA` |
| `100` | `#F5F5F5` |
| `200` | `#E5E5E5` |
| `300` | `#D4D4D4` |
| `400` | `#A3A3A3` |
| `500` | `#737373` |
| `600` | `#525252` |
| `700` | `#404040` |
| `800` | `#262626` |
| `900` | `#171717` |
| `950` | `#0A0A0A` |

#### Gray Alpha

| Scale | Base | Opacity |
| --- | --- | --- |
| `50` | `#0A0A0A` | `5%` |
| `100` | `#0A0A0A` | `10%` |
| `200` | `#0A0A0A` | `20%` |
| `300` | `#0A0A0A` | `30%` |
| `400` | `#0A0A0A` | `40%` |
| `500` | `#0A0A0A` | `50%` |
| `600` | `#0A0A0A` | `60%` |
| `700` | `#0A0A0A` | `70%` |
| `800` | `#0A0A0A` | `80%` |
| `900` | `#0A0A0A` | `90%` |

#### Green Gray

| Scale | Hex |
| --- | --- |
| `50` | `#F3FAF2` |
| `100` | `#EEF5ED` |
| `200` | `#DBE5DA` |
| `300` | `#C7D4C5` |
| `400` | `#96A395` |
| `500` | `#687366` |
| `600` | `#515C50` |
| `700` | `#3C453B` |
| `800` | `#212621` |
| `900` | `#141714` |
| `950` | `#090A09` |

#### Blue / Aqua / Teal / Green

| Scale | Blue | Aqua | Teal | Green |
| --- | --- | --- | --- | --- |
| `50` | `#EBF5FF` | `#E1F7F7` | `#E1FAF2` | `#E9FCE6` |
| `100` | `#D4EAFF` | `#C4F1F2` | `#C9F5E6` | `#D2FCCC` |
| `200` | `#9DC8F0` | `#97E6E8` | `#A1E5D1` | `#AAEDA1` |
| `300` | `#6DADE9` | `#69D8D8` | `#63C7A9` | `#78DE6A` |
| `400` | `#3C91E1` | `#45D4D9` | `#35B58E` | `#4BCF3A` |
| `500` | `#0B76DA` | `#18C7CC` | `#05AE7B` | `#20C40A` |
| `600` | `#095EAE` | `#15AEB2` | `#06A172` | `#1AA308` |
| `700` | `#074783` | `#10878A` | `#05805A` | `#158006` |
| `800` | `#042F57` | `#0A5557` | `#0A5557` | `#0F5C05` |
| `900` | `#02182C` | `#062F30` | `#023022` | `#083003` |

#### Lime / Yellow / Orange / Red

| Scale | Lime | Yellow | Orange | Red |
| --- | --- | --- | --- | --- |
| `50` | `#F5FAE3` | `#FDF9E5` | `#FFF4E8` | `#FFEDEB` |
| `100` | `#EEF7CB` | `#FCF4CC` | `#FFE9D1` | `#FFD9D4` |
| `200` | `#E2F2A0` | `#F9E999` | `#F4C999` | `#FAB5AC` |
| `300` | `#D2EB71` | `#F6DE66` | `#EEAF66` | `#F58173` |
| `400` | `#C4E540` | `#F3D333` | `#E99433` | `#E5503E` |
| `500` | `#B3DE07` | `#F0C800` | `#E37900` | `#E33B27` |
| `600` | `#92B505` | `#C0A000` | `#B66100` | `#BA3020` |
| `700` | `#759104` | `#907800` | `#884900` | `#8A2417` |
| `800` | `#4E6103` | `#605000` | `#5B3000` | `#59170F` |
| `900` | `#273001` | `#302800` | `#2D1800` | `#300D08` |

#### Magenta / Fuchsia / Purple / Iris

| Scale | Magenta | Fuchsia | Purple | Iris |
| --- | --- | --- | --- | --- |
| `50` | `#FFE8F3` | `#FFEBFD` | `#F8E8FF` | `#F1EBFF` |
| `100` | `#FCD2E6` | `#FFD4FA` | `#F0CFFF` | `#E3D4FF` |
| `200` | `#F59FC7` | `#F2A5EA` | `#DCA1F7` | `#B796F2` |
| `300` | `#F26DAB` | `#FB6EDD` | `#BF64E8` | `#9161E8` |
| `400` | `#EB3F8F` | `#E53CD2` | `#B03CE5` | `#6E30E3` |
| `500` | `#E81075` | `#E312CB` | `#9D0BE0` | `#5309DE` |
| `600` | `#B50D5B` | `#B50EA2` | `#8009B8` | `#4107AD` |
| `700` | `#8A0A45` | `#820A74` | `#60078A` | `#310582` |
| `800` | `#5C062E` | `#590750` | `#40055C` | `#220459` |
| `900` | `#2E0317` | `#30042C` | `#220230` | `#130230` |

### Typography

#### Font Weight

| Token | Value |
| --- | --- |
| `regular` | `400` |
| `bold` | `600` |

#### Font Size

| Token | Value |
| --- | --- |
| `xs` | `10` |
| `sm` | `12` |
| `md` | `14` |
| `lg` | `16` |
| `xl` | `18` |
| `2xl` | `20` |
| `3xl` | `24` |
| `4xl` | `30` |
| `5xl` | `36` |
| `6xl` | `48` |
| `7xl` | `64` |

#### Line Height

| Token | Value |
| --- | --- |
| `xs` | `14` |
| `sm` | `18` |
| `md` | `20` |
| `lg` | `24` |
| `xl` | `28` |
| `2xl` | `30` |
| `3xl` | `36` |
| `4xl` | `44` |
| `5xl` | `48` |
| `6xl` | `72` |
| `7xl` | `96` |

### Radius

| Token | Value |
| --- | --- |
| `none` | `0` |
| `sm` | `4` |
| `md` | `6` |
| `lg` | `8` |
| `xl` | `16` |
| `full` | `9999` |

### Spacing

| Token | Value |
| --- | --- |
| `0` | `0` |
| `px` | `1` |
| `1` | `4` |
| `2` | `8` |
| `3` | `12` |
| `4` | `16` |
| `5` | `20` |
| `6` | `24` |
| `7` | `28` |
| `8` | `32` |
| `9` | `36` |
| `10` | `40` |
| `12` | `48` |
| `14` | `56` |
| `16` | `64` |
| `20` | `80` |
| `24` | `96` |
| `28` | `112` |
| `32` | `128` |
| `36` | `144` |
| `40` | `160` |
| `44` | `176` |
| `48` | `192` |
| `52` | `208` |
| `56` | `224` |
| `60` | `240` |
| `64` | `256` |
| `72` | `288` |
| `80` | `320` |
| `96` | `384` |

## 10. Coverage Check

`raw/design-system-screenshots` 配下の画像は `30` 枚。以下の対応で全件を確認した。

| Screenshot | Covered In |
| --- | --- |
| `Screenshot 2026-05-16 at 18.49.46.png` | `Semantic Tokens > Status` |
| `Screenshot 2026-05-16 at 18.49.54.png` | `Semantic Tokens > Text` |
| `Screenshot 2026-05-16 at 18.50.00.png` | `Semantic Tokens > Text Accent` |
| `Screenshot 2026-05-16 at 18.50.09.png` | `Semantic Tokens > Background` |
| `Screenshot 2026-05-16 at 18.50.23.png` | `Semantic Tokens > Background Accent` |
| `Screenshot 2026-05-16 at 18.50.31.png` | `Semantic Tokens > Background Accent Hover` |
| `Screenshot 2026-05-16 at 18.50.39.png` | `Semantic Tokens > Emphasis` |
| `Screenshot 2026-05-16 at 18.51.28.png` | `Core Colors` |
| `Screenshot 2026-05-16 at 18.51.33.png` | `Foundation Palettes > Gray` |
| `Screenshot 2026-05-16 at 18.51.39.png` | `Foundation Palettes > Gray Alpha` |
| `Screenshot 2026-05-16 at 18.51.49.png` | `Foundation Palettes > Green Gray` |
| `Screenshot 2026-05-16 at 18.51.55.png` | `Foundation Palettes > Magenta / Fuchsia / Purple / Iris` |
| `Screenshot 2026-05-16 at 18.52.02.png` | `Foundation Palettes > Blue / Aqua / Teal / Green` |
| `Screenshot 2026-05-16 at 18.52.08.png` | `Foundation Palettes > Lime / Yellow / Orange / Red` |
| `Screenshot 2026-05-16 at 18.52.15.png` | `Foundation Palettes > Magenta / Fuchsia / Purple / Iris` |
| `Screenshot 2026-05-16 at 18.52.22.png` | `Foundation Palettes > Magenta / Fuchsia / Purple / Iris` |
| `Screenshot 2026-05-16 at 18.52.27.png` | `Foundation Palettes > Blue / Aqua / Teal / Green` |
| `Screenshot 2026-05-16 at 18.52.35.png` | `Foundation Palettes > Blue / Aqua / Teal / Green` |
| `Screenshot 2026-05-16 at 18.52.41.png` | `Foundation Palettes > Lime / Yellow / Orange / Red` |
| `Screenshot 2026-05-16 at 18.52.46.png` | `Foundation Palettes > Lime / Yellow / Orange / Red` |
| `Screenshot 2026-05-16 at 18.52.53.png` | `Foundation Palettes > Lime / Yellow / Orange / Red` |
| `Screenshot 2026-05-16 at 18.52.58.png` | `Foundation Palettes > Magenta / Fuchsia / Purple / Iris` |
| `Screenshot 2026-05-16 at 18.53.04.png` | `Foundation Palettes > Blue / Aqua / Teal / Green` |
| `Screenshot 2026-05-16 at 18.53.12.png` | `Typography > Font Weight` |
| `Screenshot 2026-05-16 at 18.53.18.png` | `Typography > Font Size` |
| `Screenshot 2026-05-16 at 18.53.26.png` | `Typography > Line Height` |
| `Screenshot 2026-05-16 at 18.53.44.png` | `Radius` |
| `spacing1.png` | `Spacing` |
| `spacing2.png` | `Spacing` |
| `spacing3.png` | `Spacing` |

確認結果:

- 30 / 30 枚を対応付け済み
- semantic token、foundation palette、typography、radius、spacing の全カテゴリを網羅
- スクショ上に見える token 名と値は本文へすべて反映済み
