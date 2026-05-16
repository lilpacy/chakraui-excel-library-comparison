"use client";

import * as React from "react";
import DataEditor, {
  GridCellKind,
  type EditableGridCell,
  type GridCell,
  type GridColumn,
  type Item,
} from "@glideapps/glide-data-grid";

type Person = {
  id: string;
  name: string;
  age: number;
  active: boolean;
  website: string;
};

const initialRows: Person[] = [
  { id: "u-001", name: "Alice", age: 32, active: true, website: "https://example.com" },
  { id: "u-002", name: "Bob", age: 28, active: false, website: "https://example.org" },
  { id: "u-003", name: "Charlie", age: 41, active: true, website: "https://example.net" },
];

const columns: GridColumn[] = [
  { title: "ID", id: "id", width: 90 },
  { title: "Name", id: "name", width: 180 },
  { title: "Age", id: "age", width: 90 },
  { title: "Active", id: "active", width: 90 },
  { title: "Website", id: "website", width: 240 },
];

export function PeopleGrid() {
  const [rows, setRows] = React.useState<Person[]>(initialRows);

  const getCellContent = React.useCallback(
    ([col, row]: Item): GridCell => {
      const person = rows[row];
      const columnId = columns[col]?.id;

      if (!person || columnId == null) {
        return { kind: GridCellKind.Loading, allowOverlay: false };
      }

      switch (columnId) {
        case "id":
          return { kind: GridCellKind.RowID, data: person.id, allowOverlay: false };
        case "name":
          return {
            kind: GridCellKind.Text,
            data: person.name,
            displayData: person.name,
            allowOverlay: true,
            copyData: person.name,
          };
        case "age":
          return {
            kind: GridCellKind.Number,
            data: person.age,
            displayData: String(person.age),
            allowOverlay: true,
            copyData: String(person.age),
          };
        case "active":
          return {
            kind: GridCellKind.Boolean,
            data: person.active,
            allowOverlay: false,
            copyData: person.active ? "TRUE" : "FALSE",
          };
        case "website":
          return {
            kind: GridCellKind.Uri,
            data: person.website,
            allowOverlay: true,
            copyData: person.website,
          };
        default:
          return { kind: GridCellKind.Protected, allowOverlay: false };
      }
    },
    [rows]
  );

  const onCellEdited = React.useCallback(
    ([col, row]: Item, newValue: EditableGridCell) => {
      const columnId = columns[col]?.id;
      if (!columnId) return;

      setRows((currentRows) => {
        const next = [...currentRows];
        const target = next[row];
        if (!target) return currentRows;

        if (columnId === "name" && newValue.kind === GridCellKind.Text) {
          next[row] = { ...target, name: newValue.data };
        } else if (columnId === "age" && newValue.kind === GridCellKind.Number) {
          next[row] = { ...target, age: Number(newValue.data) };
        } else if (columnId === "active" && newValue.kind === GridCellKind.Boolean) {
          next[row] = { ...target, active: Boolean(newValue.data) };
        } else if (columnId === "website" && newValue.kind === GridCellKind.Uri) {
          next[row] = { ...target, website: newValue.data };
        } else {
          return currentRows;
        }

        return next;
      });
    },
    []
  );

  return (
    <section style={{ height: 520, width: "100%" }}>
      <DataEditor
        columns={columns}
        rows={rows.length}
        getCellContent={getCellContent}
        onCellEdited={onCellEdited}
        getCellsForSelection
        rowMarkers="both"
        smoothScrollX
        smoothScrollY
      />
    </section>
  );
}
