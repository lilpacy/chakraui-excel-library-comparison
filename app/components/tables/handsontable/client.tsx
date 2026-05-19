"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { HotTable, type HotTableRef } from "@handsontable/react-wrapper";
import type { CellChange } from "handsontable/common";
import { updateSalesOrder } from "@/app/actions/sales-orders";
import { designSystemClassNames } from "@/app/design-system/patterns";
import type { HandsontableFeatureProfile } from "@/app/components/tables/handsontable/profiles";
import type { SalesOrderRow } from "@/app/components/tables/types";
import {
  colHeaders,
  cloneRow,
  cloneRows,
  coerceRow,
  contextMenuItems,
  contextMenuKeysByTarget,
  createColumns,
  defaultFeatureProfile,
  dropdownMenuItems,
  getContextMenuTarget,
  gridHeight,
  gridRowHeight,
  handleAfterGetColHeader,
  isColumnKey,
  registerHandsontableModules,
  rollbackChanges,
  rowsEqual,
  viewportColumnRenderingOffset,
  viewportRowRenderingOffset,
} from "@/app/components/tables/handsontable/shared";

type HandsontableSalesTableClientProps = {
  initialRows: SalesOrderRow[];
  featureProfile?: HandsontableFeatureProfile;
};
type ContextMenuTarget = "cell" | "column-header" | "row-header" | "corner";
type ContextMenuPlugin = {
  close: () => void;
};
type DropdownMenuPlugin = {
  open: (position: { left: number; top: number }) => void;
};
type UndoRedoPlugin = {
  clear: () => void;
  undo: () => void;
  redo: () => void;
  isUndoAvailable: () => boolean;
  isRedoAvailable: () => boolean;
};

registerHandsontableModules();

function getUndoRedoPlugin(hotRef: React.RefObject<HotTableRef | null>) {
  return hotRef.current?.hotInstance?.getPlugin("undoRedo") as
    | UndoRedoPlugin
    | undefined;
}

function getDropdownMenuPlugin(hotRef: React.RefObject<HotTableRef | null>) {
  return hotRef.current?.hotInstance?.getPlugin("dropdownMenu") as
    | DropdownMenuPlugin
    | undefined;
}

function getContextMenuPlugin(hotRef: React.RefObject<HotTableRef | null>) {
  return hotRef.current?.hotInstance?.getPlugin("contextMenu") as
    | ContextMenuPlugin
    | undefined;
}

export function HandsontableSalesTableClient({
  initialRows,
  featureProfile = defaultFeatureProfile,
}: HandsontableSalesTableClientProps) {
  const hotRef = useRef<HotTableRef | null>(null);
  const contextMenuTargetRef = useRef<ContextMenuTarget>("cell");
  const rowsRef = useRef(cloneRows(initialRows));
  const [isPending, startTransition] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const isFilterMenuEnabled = featureProfile.filters && featureProfile.dropdownMenu;
  const isContextMenuEnabled = featureProfile.contextMenu;
  const columns = useMemo(() => createColumns(featureProfile), [featureProfile]);
  const contextMenuSettings = useMemo(
    () => (isContextMenuEnabled ? { items: [...contextMenuItems] } : false),
    [isContextMenuEnabled],
  );
  const dropdownMenuSettings = useMemo(
    () => (isFilterMenuEnabled ? [...dropdownMenuItems] : false),
    [isFilterMenuEnabled],
  );

  const syncUndoRedoState = useCallback(() => {
    if (!featureProfile.undo) {
      setCanUndo(false);
      setCanRedo(false);
      return;
    }

    const undoRedo = getUndoRedoPlugin(hotRef);

    setCanUndo(Boolean(undoRedo?.isUndoAvailable()));
    setCanRedo(Boolean(undoRedo?.isRedoAvailable()));
  }, [featureProfile.undo]);

  useEffect(() => {
    const nextRows = cloneRows(initialRows);
    const hotInstance = hotRef.current?.hotInstance;

    if (rowsEqual(nextRows, rowsRef.current)) {
      syncUndoRedoState();
      return;
    }

    rowsRef.current = nextRows;
    hotInstance?.loadData(nextRows, "external");
    getUndoRedoPlugin(hotRef)?.clear();
    syncUndoRedoState();
  }, [initialRows, syncUndoRedoState]);

  const handleUndo = useCallback(() => {
    if (!featureProfile.undo) {
      return;
    }

    const undoRedo = getUndoRedoPlugin(hotRef);

    if (!undoRedo?.isUndoAvailable()) {
      return;
    }

    setSaveError(null);
    undoRedo.undo();
    syncUndoRedoState();
  }, [featureProfile.undo, syncUndoRedoState]);

  const handleRedo = useCallback(() => {
    if (!featureProfile.undo) {
      return;
    }

    const undoRedo = getUndoRedoPlugin(hotRef);

    if (!undoRedo?.isRedoAvailable()) {
      return;
    }

    setSaveError(null);
    undoRedo.redo();
    syncUndoRedoState();
  }, [featureProfile.undo, syncUndoRedoState]);

  const handleAfterChange = useCallback((changes: CellChange[] | null, source: string) => {
    const changeSource = String(source);

    if (
      !changes ||
      !hotRef.current?.hotInstance ||
      changeSource === "loadData" ||
      changeSource === "external" ||
      changeSource === "rollback"
    ) {
      return;
    }

    const hotInstance = hotRef.current.hotInstance;
    const changedPhysicalRows = new Set<number>();

    for (const [rowIndex, prop, oldValue, newValue] of changes) {
      if (oldValue !== newValue && isColumnKey(prop)) {
        const physicalRowIndex = hotInstance.toPhysicalRow(rowIndex);

        if (physicalRowIndex >= 0) {
          changedPhysicalRows.add(physicalRowIndex);
        }
      }
    }

    if (changedPhysicalRows.size === 0) {
      syncUndoRedoState();
      return;
    }

    syncUndoRedoState();
    setSaveError(null);

    startTransition(async () => {
      for (const physicalRowIndex of changedPhysicalRows) {
        const previousRow = cloneRow(rowsRef.current[physicalRowIndex]);
        const nextRow = coerceRow(
          hotInstance.getSourceDataAtRow(physicalRowIndex) as Partial<SalesOrderRow> &
            Record<string, unknown>,
        );

        try {
          await updateSalesOrder(previousRow.orderId, nextRow);
          rowsRef.current[physicalRowIndex] = cloneRow(nextRow);
        } catch (error) {
          hotInstance.setSourceDataAtCell(
            rollbackChanges(physicalRowIndex, previousRow),
            "rollback",
          );
          setSaveError(error instanceof Error ? error.message : "Failed to save sales order");
        }
      }
    });
  }, [startTransition, syncUndoRedoState]);

  const handleBeforeOnCellContextMenu = useCallback((
    event: MouseEvent,
    coords: { row: number; col: number },
  ) => {
    if (!isContextMenuEnabled) {
      return;
    }

    const contextMenuTarget = getContextMenuTarget(coords.row, coords.col);
    const hotInstance = hotRef.current?.hotInstance;

    contextMenuTargetRef.current = contextMenuTarget;

    if (!hotInstance) {
      return;
    }

    if (contextMenuTarget === "column-header" && isFilterMenuEnabled) {
      hotInstance.selectColumns(coords.col, coords.col, -1);
      event.preventDefault();
      event.stopImmediatePropagation();
      getContextMenuPlugin(hotRef)?.close();
      getDropdownMenuPlugin(hotRef)?.open({
        left: event.clientX,
        top: event.clientY,
      });
      return;
    }

    if (contextMenuTarget === "row-header") {
      hotInstance.selectRows(coords.row, coords.row, -1);
      return;
    }

    if (contextMenuTarget === "cell") {
      hotInstance.selectCell(coords.row, coords.col);
    }
  }, [isContextMenuEnabled, isFilterMenuEnabled]);

  const handleBeforeContextMenuSetItems = useCallback((
    menuItems: Array<{ key?: string }>,
  ) => {
    if (!isContextMenuEnabled) {
      menuItems.splice(0, menuItems.length);
      return;
    }

    if (contextMenuTargetRef.current === "column-header") {
      menuItems.splice(0, menuItems.length);
      return;
    }

    const allowedKeys = contextMenuKeysByTarget[contextMenuTargetRef.current];
    const filteredItems = menuItems.filter((item) => item.key && allowedKeys.has(item.key));

    menuItems.splice(0, menuItems.length, ...filteredItems);
  }, [isContextMenuEnabled]);

  return (
    <Box className={designSystemClassNames.dataGrid}>
      {featureProfile.undo && (
        <HStack px="4" py="3" justify="space-between" borderBottomWidth="1px" borderColor="border">
          <HStack gap="2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleUndo}
              disabled={!canUndo || isPending}
            >
              Undo
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRedo}
              disabled={!canRedo || isPending}
            >
              Redo
            </Button>
          </HStack>
          <Text color="fg.muted" fontSize="sm">
            Cmd/Ctrl+Z, Cmd/Ctrl+Y
          </Text>
        </HStack>
      )}
      <HotTable
        ref={hotRef}
        className="handsontable-comparison"
        data={rowsRef.current}
        columns={columns}
        colHeaders={colHeaders}
        rowHeaders
        rowHeaderWidth={44}
        width="100%"
        height={gridHeight}
        rowHeights={gridRowHeight}
        stretchH="none"
        readOnly={isPending}
        contextMenu={contextMenuSettings}
        filters={featureProfile.filters}
        dropdownMenu={dropdownMenuSettings}
        columnSorting={featureProfile.columnSorting}
        fixedColumnsStart={1}
        manualColumnMove={featureProfile.manualColumnMove}
        undo={featureProfile.undo}
        autoRowSize={false}
        autoColumnSize={false}
        renderAllRows={false}
        viewportRowRenderingOffset={viewportRowRenderingOffset}
        viewportColumnRenderingOffset={viewportColumnRenderingOffset}
        licenseKey="non-commercial-and-evaluation"
        themeName="ht-theme-main"
        textEllipsis
        afterChange={handleAfterChange}
        afterGetColHeader={featureProfile.headerStyling ? handleAfterGetColHeader : undefined}
        afterInit={syncUndoRedoState}
        afterUndo={featureProfile.undo ? syncUndoRedoState : undefined}
        afterRedo={featureProfile.undo ? syncUndoRedoState : undefined}
        afterUndoStackChange={featureProfile.undo ? syncUndoRedoState : undefined}
        afterRedoStackChange={featureProfile.undo ? syncUndoRedoState : undefined}
        beforeOnCellContextMenu={isContextMenuEnabled ? handleBeforeOnCellContextMenu : undefined}
        beforeContextMenuSetItems={isContextMenuEnabled ? handleBeforeContextMenuSetItems : undefined}
      />
      {(isPending || saveError) && (
        <Text px="4" py="3" color={saveError ? "fg.error" : "fg.muted"} fontSize="sm">
          {saveError ?? "Saving changes..."}
        </Text>
      )}
    </Box>
  );
}
