# Handsontable Comparison Notes

## Why the appearance differs from Chakra

The Handsontable comparison table is not expected to match the Chakra tables by default.

- Chakra `Table.Root` renders a relatively plain HTML table and inherits the app's design tokens.
- Handsontable renders a spreadsheet-style grid with its own DOM structure, CSS, selection model, and editor UI.
- This repo imports Handsontable's required base CSS and theme CSS, so the visual system is primarily driven by Handsontable rather than Chakra.

Because of that, differences in spacing, borders, header styling, focus states, and in-cell editor appearance are normal.

## Can it be made closer to Chakra

Yes, but not for free.

Possible approaches:

- Override Handsontable theme variables and cell CSS to align fonts, row height, borders, and header background with Chakra.
- Match the surrounding card container styles to the existing Chakra table wrappers.
- Add custom renderers/editors if specific cells need Chakra-like presentation.

## Tradeoff for DOM comparison

There is a real tradeoff here:

- If the goal is DOM comparison, preserving more of Handsontable's native structure and styles is useful.
- If the goal is visual consistency, additional CSS customization is required.

The current implementation intentionally keeps Handsontable relatively close to its native rendering so the DOM differences remain visible.
