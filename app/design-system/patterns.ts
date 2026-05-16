export const designSystemClassNames = {
  surface: "ds-surface",
  surfaceMuted: "ds-surface ds-surface--muted",
  dataGrid: "ds-surface ds-data-grid",
  statusError: "ds-status-message ds-status-message--error",
  statusSuccess: "ds-status-message ds-status-message--success",
  statusWarning: "ds-status-message ds-status-message--warning",
} as const;

export const surfaceBoxProps = {
  className: designSystemClassNames.surface,
  borderWidth: "1px",
  borderColor: "border",
  rounded: "lg",
} as const;

export const dataGridBoxProps = {
  ...surfaceBoxProps,
  className: designSystemClassNames.dataGrid,
  overflow: "hidden",
} as const;

export const pageTitleProps = {
  fontSize: { base: "3xl", md: "4xl" },
  lineHeight: { base: "3xl", md: "4xl" },
  fontWeight: "bold",
  letterSpacing: "-0.02em",
  color: "fg",
} as const;

export const heroTitleProps = {
  fontSize: { base: "4xl", md: "5xl" },
  lineHeight: { base: "4xl", md: "5xl" },
  fontWeight: "bold",
  letterSpacing: "-0.03em",
  color: "fg",
} as const;

export const sectionTitleProps = {
  fontSize: { base: "xl", md: "2xl" },
  lineHeight: { base: "xl", md: "2xl" },
  fontWeight: "bold",
  letterSpacing: "-0.02em",
  color: "fg",
} as const;

export const sectionDescriptionProps = {
  color: "fg.muted",
} as const;

export const labelTextProps = {
  display: "block",
  fontSize: "sm",
  lineHeight: "sm",
  fontWeight: "bold",
  color: "fg.muted",
  mb: "1",
} as const;

export const helperTextProps = {
  fontSize: "xs",
  lineHeight: "xs",
  color: "fg.subtle",
} as const;

export const gridCellStyles = {
  borderColor: "border",
  borderInlineEndWidth: "1px",
  borderBottomWidth: "1px",
} as const;

export const tableHeaderRowProps = {
  bg: "bg.subtle",
} as const;

export const editableInputStyles = {
  unstyled: true,
  bg: "transparent",
  color: "inherit",
  fontFamily: "inherit",
  fontSize: "inherit",
  lineHeight: "inherit",
  minW: "100%",
  w: "100%",
  h: "auto",
  px: "0",
  py: "0",
  _focusVisible: {
    outline: "2px solid",
    outlineColor: "blue.focusRing",
    outlineOffset: "2px",
    borderRadius: "sm",
  },
} as const;

export const editablePreviewStyles = {
  unstyled: true,
  cursor: "text",
  display: "block",
} as const;

export const editableRootStyles = {
  activationMode: "dblclick" as const,
  submitMode: "both" as const,
  selectOnFocus: true,
  unstyled: true,
} as const;

export const editableSelectStyles = {
  appearance: "none" as const,
  background: "transparent",
  border: "none",
  borderRadius: "0",
  color: "inherit",
  fontFamily: "inherit",
  fontSize: "inherit",
  lineHeight: "inherit",
  minWidth: "100%",
  padding: "0 1.25rem 0 0",
  width: "100%",
} as const;

export const salesStatusColorPalette = {
  Delivered: "green",
  "In Transit": "blue",
  Pending: "orange",
} as const;
