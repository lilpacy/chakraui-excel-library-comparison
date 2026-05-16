"use client";

import {
  defineConfig,
  defineGlobalStyles,
  defineLayerStyles,
  defineSemanticTokens,
  defineTextStyles,
  defineTokens,
  type SystemStyleObject,
} from "@chakra-ui/react";
import {
  accentColorNames,
  foundationColors,
  radiusTokens,
  semanticColorRefs,
  spacingTokens,
  typographyTokens,
  type AccentColorName,
  type ColorRef,
} from "@/app/design-system/tokens";

type TokenTree = {
  [key: string]: { value: string } | TokenTree;
};

type SemanticTokenTree = {
  [key: string]: { value: string | { _light: string; _dark: string } } | SemanticTokenTree;
};

function pxToRem(px: number) {
  return `${px / 16}rem`;
}

function px(px: number) {
  return `${px}px`;
}

function toKebabCase(value: string) {
  return value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

function colorRefToTokenRef(colorRef: ColorRef) {
  if (!colorRef.includes(".")) {
    return `{colors.${colorRef}}`;
  }

  return `{colors.${colorRef}}`;
}

function colorRefToCssVar(colorRef: ColorRef) {
  if (!colorRef.includes(".")) {
    return `var(--ds-color-${toKebabCase(colorRef)})`;
  }

  const [paletteName, scale] = colorRef.split(".");
  return `var(--ds-color-${toKebabCase(paletteName)}-${scale})`;
}

function semanticValue(light: ColorRef, dark: ColorRef) {
  return { value: { _light: colorRefToTokenRef(light), _dark: colorRefToTokenRef(dark) } };
}

function buildColorTokens(): TokenTree {
  const colors: TokenTree = {
    black: { value: foundationColors.black },
    white: { value: foundationColors.white },
    brand: { value: foundationColors.brand },
  };

  for (const [paletteName, paletteValue] of Object.entries(foundationColors)) {
    if (typeof paletteValue === "string") {
      continue;
    }

    colors[paletteName] = Object.fromEntries(
      Object.entries(paletteValue).map(([scale, hex]) => [scale, { value: hex }]),
    );
  }

  return colors;
}

function buildFontSizeTokens() {
  return Object.fromEntries(
    Object.entries(typographyTokens.fontSize).map(([name, value]) => [name, { value: pxToRem(value) }]),
  );
}

function buildLineHeightTokens() {
  return Object.fromEntries(
    Object.entries(typographyTokens.lineHeight).map(([name, value]) => [name, { value: px(value) }]),
  );
}

function buildFontWeightTokens() {
  return Object.fromEntries(
    Object.entries(typographyTokens.fontWeight).map(([name, value]) => [name, { value: String(value) }]),
  );
}

function buildRadiusTokens() {
  return Object.fromEntries(
    Object.entries(radiusTokens).map(([name, value]) => [name, { value: px(value) }]),
  );
}

function buildSpacingTokens() {
  return Object.fromEntries(
    Object.entries(spacingTokens).map(([name, value]) => [name, { value: px(value) }]),
  );
}

function buildPaletteSemanticToken(paletteName: AccentColorName) {
  const contrastRef =
    paletteName === "yellow" || paletteName === "lime" ? "gray.950" : "white";

  return {
    contrast: semanticValue(contrastRef, contrastRef),
    fg: semanticValue(`${paletteName}.700`, `${paletteName}.100`),
    subtle: semanticValue(`${paletteName}.100`, `${paletteName}.700`),
    muted: semanticValue(`${paletteName}.200`, `${paletteName}.600`),
    emphasized: semanticValue(`${paletteName}.200`, `${paletteName}.600`),
    solid: semanticValue(`${paletteName}.500`, `${paletteName}.500`),
    focusRing: semanticValue(`${paletteName}.500`, `${paletteName}.500`),
    border: semanticValue(`${paletteName}.200`, `${paletteName}.600`),
  };
}

function buildSemanticTokens(): SemanticTokenTree {
  const semanticColors: SemanticTokenTree = {
    bg: {
      DEFAULT: semanticValue(semanticColorRefs.background.primary.light, semanticColorRefs.background.primary.dark),
      subtle: semanticValue(semanticColorRefs.background.secondary.light, semanticColorRefs.background.secondary.dark),
      muted: semanticValue(semanticColorRefs.emphasis.low.light, semanticColorRefs.emphasis.low.dark),
      emphasized: semanticValue(semanticColorRefs.emphasis.mid.light, semanticColorRefs.emphasis.mid.dark),
      panel: semanticValue(semanticColorRefs.background.secondary.light, semanticColorRefs.background.secondary.dark),
      error: semanticValue("red.100", "red.700"),
      warning: semanticValue("yellow.100", "yellow.700"),
      success: semanticValue("green.100", "green.700"),
      info: semanticValue("blue.100", "blue.700"),
    },
    fg: {
      DEFAULT: semanticValue(semanticColorRefs.text.primary.light, semanticColorRefs.text.primary.dark),
      muted: semanticValue(semanticColorRefs.text.secondary.light, semanticColorRefs.text.secondary.dark),
      subtle: semanticValue(semanticColorRefs.text.tertiary.light, semanticColorRefs.text.tertiary.dark),
      error: semanticValue(semanticColorRefs.text.danger.light, semanticColorRefs.text.danger.dark),
      warning: semanticValue(semanticColorRefs.text.warning.light, semanticColorRefs.text.warning.dark),
      success: semanticValue(semanticColorRefs.text.success.light, semanticColorRefs.text.success.dark),
      info: semanticValue(semanticColorRefs.text.information.light, semanticColorRefs.text.information.dark),
      brand: semanticValue("brand", "brand"),
    },
    border: {
      DEFAULT: semanticValue(semanticColorRefs.emphasis.low.light, semanticColorRefs.emphasis.low.dark),
      muted: semanticValue(semanticColorRefs.background.secondary.light, semanticColorRefs.background.secondary.dark),
      subtle: semanticValue(semanticColorRefs.background.secondary.light, semanticColorRefs.background.secondary.dark),
      emphasized: semanticValue(semanticColorRefs.emphasis.mid.light, semanticColorRefs.emphasis.mid.dark),
      error: semanticValue("red.200", "red.600"),
      warning: semanticValue("yellow.200", "yellow.600"),
      success: semanticValue("green.200", "green.600"),
      info: semanticValue("blue.200", "blue.600"),
    },
    gray: {
      contrast: semanticValue("white", "gray.950"),
      fg: semanticValue("gray.700", "gray.300"),
      subtle: semanticValue("gray.200", "gray.600"),
      muted: semanticValue("gray.300", "gray.500"),
      emphasized: semanticValue("gray.400", "gray.400"),
      solid: semanticValue("gray.950", "gray.100"),
      focusRing: semanticValue("gray.400", "gray.400"),
      border: semanticValue("gray.200", "gray.700"),
    },
    brand: {
      contrast: semanticValue("white", "white"),
      fg: semanticValue("brand", "brand"),
      subtle: semanticValue("aqua.100", "aqua.700"),
      muted: semanticValue("aqua.200", "aqua.600"),
      emphasized: semanticValue("aqua.200", "aqua.600"),
      solid: semanticValue("brand", "brand"),
      focusRing: semanticValue("brand", "brand"),
      border: semanticValue("aqua.200", "aqua.600"),
    },
  };

  for (const paletteName of accentColorNames) {
    semanticColors[paletteName] = buildPaletteSemanticToken(paletteName);
  }

  return semanticColors;
}

function buildCssVariableMap() {
  const baseVars: SystemStyleObject = {
    "--ds-font-family-body": "var(--font-geist-sans)",
    "--ds-font-family-heading": "var(--font-geist-sans)",
    "--ds-font-family-mono": "var(--font-geist-mono)",
  };

  for (const [name, value] of Object.entries(typographyTokens.fontSize)) {
    baseVars[`--ds-font-size-${name}`] = px(value);
  }

  for (const [name, value] of Object.entries(typographyTokens.lineHeight)) {
    baseVars[`--ds-line-height-${name}`] = px(value);
  }

  for (const [name, value] of Object.entries(typographyTokens.fontWeight)) {
    baseVars[`--ds-font-weight-${name}`] = String(value);
  }

  for (const [name, value] of Object.entries(radiusTokens)) {
    baseVars[`--ds-radius-${name}`] = px(value);
  }

  for (const [name, value] of Object.entries(spacingTokens)) {
    baseVars[`--ds-space-${name}`] = px(value);
  }

  for (const [name, value] of Object.entries(foundationColors)) {
    if (typeof value === "string") {
      baseVars[`--ds-color-${toKebabCase(name)}`] = value;
      continue;
    }

    for (const [scale, hex] of Object.entries(value)) {
      baseVars[`--ds-color-${toKebabCase(name)}-${scale}`] = hex;
    }
  }

  const lightVars: SystemStyleObject = {
    "--ds-color-bg-canvas": colorRefToCssVar(semanticColorRefs.background.primary.light),
    "--ds-color-bg-panel": colorRefToCssVar(semanticColorRefs.background.secondary.light),
    "--ds-color-bg-subtle": colorRefToCssVar(semanticColorRefs.emphasis.low.light),
    "--ds-color-bg-muted": colorRefToCssVar(semanticColorRefs.emphasis.mid.light),
    "--ds-color-bg-emphasized": colorRefToCssVar(semanticColorRefs.emphasis.high.light),
    "--ds-color-fg-primary": colorRefToCssVar(semanticColorRefs.text.primary.light),
    "--ds-color-fg-secondary": colorRefToCssVar(semanticColorRefs.text.secondary.light),
    "--ds-color-fg-tertiary": colorRefToCssVar(semanticColorRefs.text.tertiary.light),
    "--ds-color-border-default": colorRefToCssVar(semanticColorRefs.emphasis.low.light),
    "--ds-color-border-emphasized": colorRefToCssVar(semanticColorRefs.emphasis.mid.light),
    "--ds-color-status-error-fg": colorRefToCssVar(semanticColorRefs.text.danger.light),
    "--ds-color-status-error-bg": colorRefToCssVar("red.100"),
    "--ds-color-status-error-border": colorRefToCssVar("red.200"),
    "--ds-color-status-success-fg": colorRefToCssVar(semanticColorRefs.text.success.light),
    "--ds-color-status-success-bg": colorRefToCssVar("green.100"),
    "--ds-color-status-success-border": colorRefToCssVar("green.200"),
    "--ds-color-status-warning-fg": colorRefToCssVar(semanticColorRefs.text.warning.light),
    "--ds-color-status-warning-bg": colorRefToCssVar("yellow.100"),
    "--ds-color-status-warning-border": colorRefToCssVar("yellow.200"),
    "--ds-color-status-info-fg": colorRefToCssVar(semanticColorRefs.text.information.light),
    "--ds-color-status-info-bg": colorRefToCssVar("blue.100"),
    "--ds-color-status-info-border": colorRefToCssVar("blue.200"),
    "--ds-color-link": colorRefToCssVar("blue.700"),
    "--ds-color-link-hover": colorRefToCssVar("blue.500"),
  };

  const darkVars: SystemStyleObject = {
    "--ds-color-bg-canvas": colorRefToCssVar(semanticColorRefs.background.primary.dark),
    "--ds-color-bg-panel": colorRefToCssVar(semanticColorRefs.background.secondary.dark),
    "--ds-color-bg-subtle": colorRefToCssVar(semanticColorRefs.emphasis.low.dark),
    "--ds-color-bg-muted": colorRefToCssVar(semanticColorRefs.emphasis.mid.dark),
    "--ds-color-bg-emphasized": colorRefToCssVar(semanticColorRefs.emphasis.high.dark),
    "--ds-color-fg-primary": colorRefToCssVar(semanticColorRefs.text.primary.dark),
    "--ds-color-fg-secondary": colorRefToCssVar(semanticColorRefs.text.secondary.dark),
    "--ds-color-fg-tertiary": colorRefToCssVar(semanticColorRefs.text.tertiary.dark),
    "--ds-color-border-default": colorRefToCssVar(semanticColorRefs.emphasis.low.dark),
    "--ds-color-border-emphasized": colorRefToCssVar(semanticColorRefs.emphasis.mid.dark),
    "--ds-color-status-error-fg": colorRefToCssVar(semanticColorRefs.text.danger.dark),
    "--ds-color-status-error-bg": colorRefToCssVar("red.700"),
    "--ds-color-status-error-border": colorRefToCssVar("red.600"),
    "--ds-color-status-success-fg": colorRefToCssVar(semanticColorRefs.text.success.dark),
    "--ds-color-status-success-bg": colorRefToCssVar("green.700"),
    "--ds-color-status-success-border": colorRefToCssVar("green.600"),
    "--ds-color-status-warning-fg": colorRefToCssVar(semanticColorRefs.text.warning.dark),
    "--ds-color-status-warning-bg": colorRefToCssVar("yellow.700"),
    "--ds-color-status-warning-border": colorRefToCssVar("yellow.600"),
    "--ds-color-status-info-fg": colorRefToCssVar(semanticColorRefs.text.information.dark),
    "--ds-color-status-info-bg": colorRefToCssVar("blue.700"),
    "--ds-color-status-info-border": colorRefToCssVar("blue.600"),
    "--ds-color-link": colorRefToCssVar("blue.100"),
    "--ds-color-link-hover": colorRefToCssVar("blue.200"),
  };

  for (const paletteName of accentColorNames) {
    lightVars[`--ds-color-accent-${paletteName}-fg`] = colorRefToCssVar(`${paletteName}.700`);
    lightVars[`--ds-color-accent-${paletteName}-bg`] = colorRefToCssVar(`${paletteName}.100`);
    lightVars[`--ds-color-accent-${paletteName}-hover`] = colorRefToCssVar(`${paletteName}.200`);

    darkVars[`--ds-color-accent-${paletteName}-fg`] = colorRefToCssVar(`${paletteName}.100`);
    darkVars[`--ds-color-accent-${paletteName}-bg`] = colorRefToCssVar(`${paletteName}.700`);
    darkVars[`--ds-color-accent-${paletteName}-hover`] = colorRefToCssVar(`${paletteName}.600`);
  }

  return { baseVars, lightVars, darkVars };
}

const { baseVars, lightVars, darkVars } = buildCssVariableMap();
const globalCss = defineGlobalStyles({
  ":root": baseVars,
  "html, :where(html, .chakra-theme)": lightVars,
  "html.dark": darkVars,
  html: {
    colorPalette: "blue",
  },
  body: {
    minHeight: "100vh",
    backgroundColor: "var(--ds-color-bg-canvas)",
    backgroundImage:
      'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAACXBIWXMAAAsSAAALEgHS3X78AAAAG3RFWHRTb2Z0d2FyZQBDZWxzeXMgU3R1ZGlvIFRvb2zBp+F8AAAAaklEQVRYw+3SOwqAUAxE0YyCP5773+cDwUbGRkTQxkZT3FSBNIeZaF2qI9FoXar7oUQ0SgSa5tvBjpASgdIkZG8htcfu0Mcx5U3or595BHVjOau51kRlgAABAgQIECBAgAABAgQIEKC3swOGHZ93/K3/jwAAAABJRU5ErkJggg==")',
    backgroundRepeat: "repeat",
    color: "fg",
    fontFamily: "body",
    transitionProperty: "background-color, color, border-color",
    transitionDuration: "200ms",
  },
  "::selection": {
    backgroundColor: "var(--ds-color-brand)",
    color: "white",
  },
  a: {
    textDecoration: "none",
  },
  ".ds-link": {
    color: "var(--ds-color-link)",
    transitionProperty: "color",
    transitionDuration: "200ms",
  },
  ".ds-link:hover": {
    color: "var(--ds-color-link-hover)",
  },
  ".ds-surface": {
    backgroundColor: "var(--ds-color-bg-panel)",
    border: "1px solid var(--ds-color-border-default)",
    borderRadius: "var(--ds-radius-lg)",
  },
  ".ds-surface--muted": {
    backgroundColor: "var(--ds-color-bg-subtle)",
  },
  ".ds-data-grid": {
    overflow: "hidden",
  },
  ".ds-status-message": {
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: "var(--ds-radius-md)",
    fontSize: "var(--ds-font-size-sm)",
    lineHeight: "var(--ds-line-height-sm)",
    padding: "var(--ds-space-3)",
  },
  ".ds-status-message--error": {
    backgroundColor: "var(--ds-color-status-error-bg)",
    borderColor: "var(--ds-color-status-error-border)",
    color: "var(--ds-color-status-error-fg)",
  },
  ".ds-status-message--success": {
    backgroundColor: "var(--ds-color-status-success-bg)",
    borderColor: "var(--ds-color-status-success-border)",
    color: "var(--ds-color-status-success-fg)",
  },
  ".ds-status-message--warning": {
    backgroundColor: "var(--ds-color-status-warning-bg)",
    borderColor: "var(--ds-color-status-warning-border)",
    color: "var(--ds-color-status-warning-fg)",
  },
  ".ds-sales-status-badge": {
    display: "inline-flex",
    alignItems: "center",
    minHeight: "20px",
    paddingInline: "6px",
    borderRadius: "var(--ds-radius-sm)",
    fontSize: "var(--ds-font-size-xs)",
    lineHeight: "var(--ds-line-height-xs)",
    fontWeight: "500",
    whiteSpace: "nowrap",
  },
  ".ds-sales-status-badge[data-tone='green']": {
    backgroundColor: "var(--ds-color-accent-green-bg)",
    color: "var(--ds-color-accent-green-fg)",
  },
  ".ds-sales-status-badge[data-tone='blue']": {
    backgroundColor: "var(--ds-color-accent-blue-bg)",
    color: "var(--ds-color-accent-blue-fg)",
  },
  ".ds-sales-status-badge[data-tone='orange']": {
    backgroundColor: "var(--ds-color-accent-orange-bg)",
    color: "var(--ds-color-accent-orange-fg)",
  },
});

const textStyles = defineTextStyles({
  pageTitle: {
    value: {
      fontSize: "3xl",
      lineHeight: "3xl",
      fontWeight: "bold",
      letterSpacing: "-0.02em",
      color: "fg",
    },
  },
  sectionTitle: {
    value: {
      fontSize: "xl",
      lineHeight: "xl",
      fontWeight: "bold",
      letterSpacing: "-0.01em",
      color: "fg",
    },
  },
  body: {
    value: {
      fontSize: "md",
      lineHeight: "md",
      color: "fg",
    },
  },
  bodyMuted: {
    value: {
      fontSize: "md",
      lineHeight: "md",
      color: "fg.muted",
    },
  },
  caption: {
    value: {
      fontSize: "sm",
      lineHeight: "sm",
      color: "fg.subtle",
    },
  },
});

const layerStyles = defineLayerStyles({
  surface: {
    value: {
      bg: "bg.panel",
      borderWidth: "1px",
      borderColor: "border",
      borderRadius: "lg",
    },
  },
});

export const chakraConfig = defineConfig({
  globalCss,
  theme: {
    tokens: defineTokens({
      colors: defineTokens.colors(buildColorTokens()),
      fonts: {
        body: { value: "var(--font-geist-sans)" },
        heading: { value: "var(--font-geist-sans)" },
        mono: { value: "var(--font-geist-mono)" },
      },
      fontSizes: buildFontSizeTokens(),
      lineHeights: buildLineHeightTokens(),
      fontWeights: buildFontWeightTokens(),
      radii: buildRadiusTokens(),
      spacing: buildSpacingTokens(),
    }),
    semanticTokens: defineSemanticTokens({
      colors: defineSemanticTokens.colors(buildSemanticTokens()),
    }),
    textStyles,
    layerStyles,
  },
});
