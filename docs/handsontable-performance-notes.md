# Handsontable Performance Notes

## Current status

- Current target page for isolated measurement:
  - `/handsontable-only?engine=wrapper&preset=full`
  - `/handsontable-only?engine=core&preset=full`
- The sample dataset is small, around 10 rows x 10 columns.
- The main bottleneck is not data volume. It is mostly Handsontable startup cost, especially script evaluation and script parsing.

## Important measurement caveat

- `TBT` is not the same as "time until the table becomes visible".
- On the isolated `core/full` page, the page starts painting quickly, and the grid cells appear later.
- Recent direct browser measurement was roughly:
  - `first-contentful-paint`: about `136ms`
  - `domComplete`: about `481ms`
  - first visible Handsontable cell DOM: about `957ms`
- This means a Lighthouse `TBT` value in the hundreds or thousands of milliseconds must not be read as "the table takes that long to appear".

## Optimizations already in place

### Bundle and module scope

- Replaced broad registration with `handsontable/base` plus selective module registration.
- Avoided `registerAllModules()`.
- Added only the modules needed by the current table features.
- Registered missing plugin dependencies explicitly for modular builds:
  - `AutoColumnSize`
  - `HiddenRows`
  - `CheckboxCellType`

### Grid settings

- Fixed grid height.
- Fixed column widths.
- Fixed row height.
- Disabled `autoRowSize`.
- Disabled `autoColumnSize`.
- Explicitly kept `renderAllRows: false`.
- Explicitly set:
  - `viewportRowRenderingOffset`
  - `viewportColumnRenderingOffset`

### React / wrapper stability

- Stabilized `columns` with `useMemo`.
- Stabilized wrapper menu settings with `useMemo`.
- Stabilized wrapper hook callbacks with `useCallback`.
- This reduces avoidable `updateSettings()` churn in `@handsontable/react-wrapper`.

### Core implementation cleanup

- Added a direct `Handsontable.Core` comparison route for A/B measurement.
- Removed an unnecessary re-initialization path in `core-client.tsx` where `isPending` changes could recreate the grid.
- Kept read-only toggling on the existing instance via `updateSettings()`.

### Profiling support

- Added `/handsontable-only` for isolating Handsontable cost from the rest of the comparison page.
- Added `engine=wrapper|core` comparison.
- Added `preset=full|no-menus|plain` comparison.

## What these optimizations achieved

- They reduced obvious waste and made measurements more trustworthy.
- They did not fundamentally remove Handsontable's fixed startup cost.
- For this repo, the startup profile is still dominated by:
  - `Script Evaluation`
  - `Script Parsing & Compilation`
- In other words, the remaining cost is mostly library startup overhead, not row count.

## Stronger measures that are still possible

### 1. Lazy mount the grid

- Do not mount Handsontable on initial page render.
- Mount it only when:
  - the section enters the viewport, or
  - the user opens a tab, or
  - the user clicks "show spreadsheet".
- This is the highest-leverage option if initial page responsiveness matters more than immediate spreadsheet visibility.

### 2. Interaction-gated mount

- Similar to lazy mount, but stricter.
- Keep a lightweight placeholder first.
- Load and mount Handsontable only after explicit user action.
- This improves initial page responsiveness at the cost of delayed spreadsheet availability.

### 3. Further feature reduction

- Remove more built-in features if they are not essential:
  - `filters`
  - `dropdownMenu`
  - `contextMenu`
  - `manualColumnMove`
  - `columnSorting`
  - `undo`
- This can help somewhat, but earlier measurements suggest these are not the main bottleneck.

### 4. Simpler rendering

- Remove or simplify the status badge renderer.
- Prefer plain text rendering where possible.
- This is lower impact than lazy mount, but still worth considering if render complexity grows.

### 5. Replace Handsontable on screens that do not need spreadsheet behavior

- If a screen does not need spreadsheet-native interactions, use a lighter grid.
- This is the strongest structural option, but also the largest product-level change.

## What is not the main issue right now

- Server-side paging
- Large dataset chunking
- `batch()` for massive updates

These are still valid techniques in general, but they are not the main lever in this repo today because the sample data is small.

## Recommended stance

- Current performance is likely acceptable if the isolated page feels responsive enough in real use.
- If more work is needed later, prefer `lazy mount` before deeper micro-optimizations.
- Treat Lighthouse `TBT` as a startup-pressure signal, not as a direct "table visible" metric.
