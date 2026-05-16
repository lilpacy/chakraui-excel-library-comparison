# Design System Summary

`raw/design-system-screenshots` にあるスクリーンショットをもとに、現時点のデザインシステムを文章で整理したメモ。  
実装前の共通認識づくりが目的であり、ここでは「全トークンの完全転記」ではなく「設計ルールが分かること」を優先する。

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
