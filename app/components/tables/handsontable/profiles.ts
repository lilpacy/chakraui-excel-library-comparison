export type HandsontableFeatureProfile = {
  filters: boolean;
  dropdownMenu: boolean;
  contextMenu: boolean;
  columnSorting: boolean;
  manualColumnMove: boolean;
  undo: boolean;
  headerStyling: boolean;
  statusRenderer: boolean;
};

export const handsontableFeaturePresets = {
  full: {
    filters: true,
    dropdownMenu: true,
    contextMenu: true,
    columnSorting: true,
    manualColumnMove: true,
    undo: true,
    headerStyling: true,
    statusRenderer: true,
  },
  "no-menus": {
    filters: false,
    dropdownMenu: false,
    contextMenu: false,
    columnSorting: true,
    manualColumnMove: true,
    undo: true,
    headerStyling: true,
    statusRenderer: true,
  },
  plain: {
    filters: false,
    dropdownMenu: false,
    contextMenu: false,
    columnSorting: false,
    manualColumnMove: false,
    undo: false,
    headerStyling: false,
    statusRenderer: false,
  },
} as const satisfies Record<string, HandsontableFeatureProfile>;

export type HandsontableFeaturePresetName = keyof typeof handsontableFeaturePresets;

export function resolveHandsontableFeaturePreset(
  value: string | string[] | undefined,
): HandsontableFeaturePresetName {
  if (typeof value !== "string") {
    return "full";
  }

  return value in handsontableFeaturePresets
    ? (value as HandsontableFeaturePresetName)
    : "full";
}
