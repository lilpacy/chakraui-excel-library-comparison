"use client";

import dynamic from "next/dynamic";
import type { SalesOrderRow } from "@/app/components/tables/types";

type AgGridSalesTableProps = {
  initialRows: SalesOrderRow[];
};

const AgGridSalesTableClient = dynamic(
  () =>
    import("@/app/components/tables/ag-grid/client").then(
      (module) => module.AgGridSalesTableClient,
    ),
  { ssr: false },
);

export function AgGridSalesTable(props: AgGridSalesTableProps) {
  return <AgGridSalesTableClient {...props} />;
}
