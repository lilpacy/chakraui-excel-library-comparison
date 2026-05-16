"use client";

import dynamic from "next/dynamic";
import type { SalesOrderRow } from "@/app/components/tables/types";

type GlideDataGridSalesTableProps = {
  initialRows: SalesOrderRow[];
};

const GlideDataGridSalesTableClient = dynamic(
  () =>
    import("@/app/components/tables/glide-data-grid/client").then(
      (module) => module.GlideDataGridSalesTableClient,
    ),
  { ssr: false },
);

export function GlideDataGridSalesTable(props: GlideDataGridSalesTableProps) {
  return <GlideDataGridSalesTableClient {...props} />;
}
