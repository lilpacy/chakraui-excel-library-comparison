"use client";

import dynamic from "next/dynamic";
import type { SalesOrderRow } from "@/app/components/tables/types";

type HandsontableSalesTableProps = {
  initialRows: SalesOrderRow[];
};

const HandsontableSalesTableClient = dynamic(
  () =>
    import("@/app/components/tables/handsontable-sales-table-client").then(
      (module) => module.HandsontableSalesTableClient,
    ),
  { ssr: false },
);

export function HandsontableSalesTable(props: HandsontableSalesTableProps) {
  return <HandsontableSalesTableClient {...props} />;
}
