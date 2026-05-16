"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { Box, Text } from "@chakra-ui/react";
import {
  DataEditor,
  GridCellKind,
  type EditableGridCell,
  type GridCell,
  type GridColumn,
  type Item,
  type NumberCell,
  type TextCell,
  type Theme,
} from "@glideapps/glide-data-grid";
import { updateSalesOrder } from "@/app/actions/sales-orders";
import { designSystemClassNames } from "@/app/design-system/patterns";
import type { SalesOrderRow, SalesOrderStatus } from "@/app/components/tables/types";
import { salesOrderStatuses } from "@/lib/db/schema";

type GlideDataGridSalesTableClientProps = {
  initialRows: SalesOrderRow[];
};

type ColumnKey = keyof SalesOrderRow;

type ColumnDefinition = {
  key: ColumnKey;
  title: string;
  width: number;
  kind: "text" | "number" | "currency";
};

const gridColumns: readonly ColumnDefinition[] = [
  { key: "orderId", title: "Order ID", width: 88, kind: "text" },
  { key: "orderDate", title: "Date", width: 92, kind: "text" },
  { key: "customer", title: "Customer", width: 135, kind: "text" },
  { key: "region", title: "Region", width: 92, kind: "text" },
  { key: "rep", title: "Sales Rep", width: 106, kind: "text" },
  { key: "category", title: "Category", width: 99, kind: "text" },
  { key: "product", title: "Product", width: 131, kind: "text" },
  { key: "quantity", title: "Qty", width: 59, kind: "number" },
  { key: "unitPrice", title: "Unit Price", width: 79, kind: "currency" },
  { key: "status", title: "Status", width: 87, kind: "text" },
] as const;

const gridHeight = 418;

const currencyFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

function readCssVar(
  styles: CSSStyleDeclaration,
  name: string,
  fallback: string,
) {
  const value = styles.getPropertyValue(name).trim();
  return value === "" ? fallback : value;
}

function parseNumber(value: unknown) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? Math.trunc(numericValue) : 0;
}

function makeTextCell(value: string): TextCell {
  return {
    kind: GridCellKind.Text,
    allowOverlay: true,
    readonly: false,
    displayData: value,
    data: value,
  };
}

function makeNumberCell(value: number, displayData = String(value)): NumberCell {
  return {
    kind: GridCellKind.Number,
    allowOverlay: true,
    readonly: false,
    data: value,
    displayData,
    thousandSeparator: true,
  };
}

function applyCellEdit(
  row: SalesOrderRow,
  column: ColumnDefinition,
  value: EditableGridCell,
): SalesOrderRow | null {
  switch (column.key) {
    case "quantity":
    case "unitPrice": {
      if (value.kind !== GridCellKind.Number) {
        return null;
      }

      return {
        ...row,
        [column.key]: parseNumber(value.data),
      };
    }
    case "status": {
      if (value.kind !== GridCellKind.Text) {
        return null;
      }

      if (!salesOrderStatuses.includes(value.data as SalesOrderStatus)) {
        return null;
      }

      return {
        ...row,
        status: value.data as SalesOrderStatus,
      };
    }
    default: {
      if (value.kind !== GridCellKind.Text) {
        return null;
      }

      return {
        ...row,
        [column.key]: value.data,
      } as SalesOrderRow;
    }
  }
}

export function GlideDataGridSalesTableClient({
  initialRows,
}: GlideDataGridSalesTableClientProps) {
  const [rows, setRows] = useState(initialRows);
  const [isPending, startTransition] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  const columns = useMemo<readonly GridColumn[]>(
    () =>
      gridColumns.map((column) => ({
        id: column.key,
        title: column.title,
        width: column.width,
      })),
    [],
  );

  const gridTheme = useMemo<Partial<Theme>>(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const bodyStyles = getComputedStyle(document.body);
    const fontFamily = bodyStyles.fontFamily || "sans-serif";

    return {
      accentColor: readCssVar(rootStyles, "--ds-color-accent-blue-hover", "#2b6cb0"),
      accentFg: "white",
      accentLight: readCssVar(rootStyles, "--ds-color-accent-blue-bg", "#d4eaff"),
      textDark: readCssVar(rootStyles, "--ds-color-fg-default", "#1a202c"),
      textMedium: readCssVar(rootStyles, "--ds-color-fg-default", "#1a202c"),
      textLight: readCssVar(rootStyles, "--ds-color-fg-muted", "#4a5568"),
      textBubble: readCssVar(rootStyles, "--ds-color-fg-default", "#1a202c"),
      bgIconHeader: readCssVar(rootStyles, "--ds-color-bg-subtle", "#f5f5f5"),
      fgIconHeader: readCssVar(rootStyles, "--ds-color-fg-default", "#1a202c"),
      textHeader: readCssVar(rootStyles, "--ds-color-fg-default", "#1a202c"),
      textHeaderSelected: readCssVar(rootStyles, "--ds-color-fg-default", "#1a202c"),
      bgCell: readCssVar(rootStyles, "--ds-color-bg-panel", "#ffffff"),
      bgCellMedium: readCssVar(rootStyles, "--ds-color-bg-subtle", "#f5f5f5"),
      bgHeader: readCssVar(rootStyles, "--ds-color-bg-subtle", "#f5f5f5"),
      bgHeaderHasFocus: readCssVar(rootStyles, "--ds-color-bg-subtle", "#f5f5f5"),
      bgHeaderHovered: readCssVar(rootStyles, "--ds-color-bg-subtle", "#f5f5f5"),
      bgBubble: readCssVar(rootStyles, "--ds-color-bg-subtle", "#f5f5f5"),
      bgBubbleSelected: readCssVar(rootStyles, "--ds-color-accent-blue-bg", "#d4eaff"),
      bgSearchResult: readCssVar(rootStyles, "--ds-color-accent-yellow-bg", "#fcf4cc"),
      borderColor: readCssVar(rootStyles, "--ds-color-border-default", "#e2e8f0"),
      drilldownBorder: readCssVar(rootStyles, "--ds-color-border-default", "#e2e8f0"),
      linkColor: readCssVar(rootStyles, "--ds-color-link", "#2b6cb0"),
      cellHorizontalPadding: 8,
      cellVerticalPadding: 8,
      headerFontStyle: `700 12px ${fontFamily}`,
      baseFontStyle: `12px ${fontFamily}`,
      markerFontStyle: `12px ${fontFamily}`,
      fontFamily,
      editorFontSize: "12px",
      lineHeight: 18,
      headerIconSize: 0,
    };
  }, []);

  const getCellContent = useCallback(
    ([columnIndex, rowIndex]: Item): GridCell => {
      const row = rows[rowIndex];
      const column = gridColumns[columnIndex];

      if (!row || !column) {
        return {
          kind: GridCellKind.Loading,
          allowOverlay: false,
        };
      }

      switch (column.key) {
        case "quantity":
          return makeNumberCell(row.quantity);
        case "unitPrice":
          return makeNumberCell(row.unitPrice, currencyFormatter.format(row.unitPrice));
        default:
          return makeTextCell(String(row[column.key]));
      }
    },
    [rows],
  );

  const onCellEdited = useCallback(
    ([columnIndex, rowIndex]: Item, newValue: EditableGridCell) => {
      const column = gridColumns[columnIndex];
      const previousRow = rows[rowIndex];

      if (!column || !previousRow) {
        return;
      }

      const nextRow = applyCellEdit(previousRow, column, newValue);

      if (!nextRow || JSON.stringify(nextRow) === JSON.stringify(previousRow)) {
        return;
      }

      setRows((currentRows) =>
        currentRows.map((row, index) => (index === rowIndex ? nextRow : row)),
      );
      setSaveError(null);

      startTransition(async () => {
        try {
          await updateSalesOrder(previousRow.orderId, nextRow);
        } catch (error) {
          setRows((currentRows) =>
            currentRows.map((row, index) => (index === rowIndex ? previousRow : row)),
          );
          setSaveError(
            error instanceof Error ? error.message : "Failed to save sales order",
          );
        }
      });
    },
    [rows],
  );

  return (
    <Box className={`${designSystemClassNames.dataGrid} glide-data-grid-comparison`}>
      <DataEditor
        className="glide-data-grid-comparison__editor"
        width="100%"
        height={gridHeight}
        columns={columns}
        rows={rows.length}
        getCellContent={getCellContent}
        onCellEdited={onCellEdited}
        rowMarkers="none"
        rowHeight={38}
        headerHeight={38}
        smoothScrollX
        smoothScrollY
        theme={gridTheme}
      />
      {(isPending || saveError) && (
        <Text
          px="4"
          py="3"
          className={saveError ? designSystemClassNames.statusError : undefined}
          color={saveError ? "red.600" : "fg.muted"}
          fontSize="sm"
        >
          {saveError ?? "Saving changes..."}
        </Text>
      )}
    </Box>
  );
}
