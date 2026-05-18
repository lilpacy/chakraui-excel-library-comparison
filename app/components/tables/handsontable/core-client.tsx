"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Box, Button, HStack, Text } from "@chakra-ui/react";
import Handsontable from "handsontable/base";
import type { CellChange } from "handsontable/common";
import { updateSalesOrder } from "@/app/actions/sales-orders";
import { designSystemClassNames } from "@/app/design-system/patterns";
import type { HandsontableFeatureProfile } from "@/app/components/tables/handsontable/profiles";
import type { SalesOrderRow } from "@/app/components/tables/types";
import {
  cloneRow,
  cloneRows,
  coerceRow,
  contextMenuKeysByTarget,
  createGridSettings,
  defaultFeatureProfile,
  getContextMenuTarget,
  isColumnKey,
  registerHandsontableModules,
  rollbackChanges,
  rowsEqual,
  type ContextMenuTarget,
  type HandsontableInstance,
} from "@/app/components/tables/handsontable/shared";

type HandsontableCoreSalesTableClientProps = {
  initialRows: SalesOrderRow[];
  featureProfile?: HandsontableFeatureProfile;
};

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

function getUndoRedoPlugin(hotInstance: HandsontableInstance | null) {
  return hotInstance?.getPlugin("undoRedo") as UndoRedoPlugin | undefined;
}

function getDropdownMenuPlugin(hotInstance: HandsontableInstance | null) {
  return hotInstance?.getPlugin("dropdownMenu") as DropdownMenuPlugin | undefined;
}

function getContextMenuPlugin(hotInstance: HandsontableInstance | null) {
  return hotInstance?.getPlugin("contextMenu") as ContextMenuPlugin | undefined;
}

export function HandsontableCoreSalesTableClient({
  initialRows,
  featureProfile = defaultFeatureProfile,
}: HandsontableCoreSalesTableClientProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hotRef = useRef<HandsontableInstance | null>(null);
  const contextMenuTargetRef = useRef<ContextMenuTarget>("cell");
  const rowsRef = useRef(cloneRows(initialRows));
  const [isPending, startTransition] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const isFilterMenuEnabled = featureProfile.filters && featureProfile.dropdownMenu;
  const isContextMenuEnabled = featureProfile.contextMenu;

  const syncUndoRedoState = useCallback(() => {
    if (!featureProfile.undo) {
      setCanUndo(false);
      setCanRedo(false);
      return;
    }

    const undoRedo = getUndoRedoPlugin(hotRef.current);

    setCanUndo(Boolean(undoRedo?.isUndoAvailable()));
    setCanRedo(Boolean(undoRedo?.isRedoAvailable()));
  }, [featureProfile.undo]);

  useEffect(() => {
    const hotInstance = hotRef.current;
    const nextRows = cloneRows(initialRows);

    if (!hotInstance) {
      rowsRef.current = nextRows;
      return;
    }

    if (rowsEqual(nextRows, rowsRef.current)) {
      syncUndoRedoState();
      return;
    }

    rowsRef.current = nextRows;
    hotInstance.loadData(nextRows, "external");
    getUndoRedoPlugin(hotInstance)?.clear();
    syncUndoRedoState();
  }, [initialRows, syncUndoRedoState]);

  useEffect(() => {
    const hotInstance = hotRef.current;

    if (!hotInstance) {
      return;
    }

    hotInstance.updateSettings({ readOnly: isPending }, false);
  }, [isPending]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const settings = createGridSettings(rowsRef.current, featureProfile);

    settings.readOnly = isPending;
    settings.afterChange = (changes, source) => {
      const changeSource = String(source);

      if (
        !changes ||
        changeSource === "loadData" ||
        changeSource === "external" ||
        changeSource === "rollback"
      ) {
        return;
      }

      const hotInstance = hotRef.current;

      if (!hotInstance) {
        return;
      }

      const changedPhysicalRows = new Set<number>();

      for (const [rowIndex, prop, oldValue, newValue] of changes as CellChange[]) {
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
    };
    settings.afterInit = syncUndoRedoState;
    settings.afterUndo = featureProfile.undo ? syncUndoRedoState : undefined;
    settings.afterRedo = featureProfile.undo ? syncUndoRedoState : undefined;
    settings.afterUndoStackChange = featureProfile.undo ? syncUndoRedoState : undefined;
    settings.afterRedoStackChange = featureProfile.undo ? syncUndoRedoState : undefined;
    settings.beforeOnCellContextMenu = isContextMenuEnabled
      ? (event, coords) => {
          const hotInstance = hotRef.current;

          if (!hotInstance) {
            return;
          }

          const contextMenuTarget = getContextMenuTarget(coords.row, coords.col);

          contextMenuTargetRef.current = contextMenuTarget;

          if (contextMenuTarget === "column-header" && isFilterMenuEnabled) {
            hotInstance.selectColumns(coords.col, coords.col, -1);
            event.preventDefault();
            event.stopImmediatePropagation();
            getContextMenuPlugin(hotInstance)?.close();
            getDropdownMenuPlugin(hotInstance)?.open({
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
        }
      : undefined;
    settings.beforeContextMenuSetItems = isContextMenuEnabled
      ? (menuItems) => {
          if (contextMenuTargetRef.current === "column-header") {
            menuItems.splice(0, menuItems.length);
            return;
          }

          const allowedKeys = contextMenuKeysByTarget[contextMenuTargetRef.current];
          const filteredItems = menuItems.filter(
            (item) => item.key && allowedKeys.has(item.key),
          );

          menuItems.splice(0, menuItems.length, ...filteredItems);
        }
      : undefined;

    const hotInstance = new Handsontable.Core(containerRef.current, settings);

    hotInstance.init();
    hotRef.current = hotInstance as HandsontableInstance;
    syncUndoRedoState();

    return () => {
      hotRef.current?.destroy();
      hotRef.current = null;
    };
  }, [
    featureProfile,
    isContextMenuEnabled,
    isFilterMenuEnabled,
    isPending,
    startTransition,
    syncUndoRedoState,
  ]);

  function handleUndo() {
    if (!featureProfile.undo) {
      return;
    }

    const undoRedo = getUndoRedoPlugin(hotRef.current);

    if (!undoRedo?.isUndoAvailable()) {
      return;
    }

    setSaveError(null);
    undoRedo.undo();
    syncUndoRedoState();
  }

  function handleRedo() {
    if (!featureProfile.undo) {
      return;
    }

    const undoRedo = getUndoRedoPlugin(hotRef.current);

    if (!undoRedo?.isRedoAvailable()) {
      return;
    }

    setSaveError(null);
    undoRedo.redo();
    syncUndoRedoState();
  }

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
      <Box ref={containerRef} className="handsontable-comparison" />
      {(isPending || saveError) && (
        <Text px="4" py="3" color={saveError ? "fg.error" : "fg.muted"} fontSize="sm">
          {saveError ?? "Saving changes..."}
        </Text>
      )}
    </Box>
  );
}
