"use client";

import dynamic from "next/dynamic";
import type { SalesOrderRow } from "@/app/components/tables/types";

type TanStackSalesTableProps = {
  initialRows: SalesOrderRow[];
};

const TanStackSalesTableClient = dynamic(
  () =>
    import("@/app/components/tables/tanstack-table/client").then(
      (module) => module.TanStackSalesTableClient,
    ),
  { ssr: false },
);

export function TanStackSalesTable(props: TanStackSalesTableProps) {
  return <TanStackSalesTableClient {...props} />;
}
