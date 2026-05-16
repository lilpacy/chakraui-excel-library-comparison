"use client";

import dynamic from "next/dynamic";
import type { SalesOrderRow } from "@/app/components/tables/types";

type ReactDataSheetGridSalesTableProps = {
  initialRows: SalesOrderRow[];
};

const ReactDataSheetGridSalesTableClient = dynamic(
  () =>
    import("@/app/components/tables/react-datasheet-grid/client").then(
      (module) => module.ReactDataSheetGridSalesTableClient,
    ),
  { ssr: false },
);

export function ReactDataSheetGridSalesTable(
  props: ReactDataSheetGridSalesTableProps,
) {
  return <ReactDataSheetGridSalesTableClient {...props} />;
}
