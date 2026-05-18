"use client";

import dynamic from "next/dynamic";
import type { SalesOrderRow } from "@/app/components/tables/types";
import type { HandsontableFeatureProfile } from "@/app/components/tables/handsontable/profiles";

type HandsontableSalesTableProps = {
  initialRows: SalesOrderRow[];
  featureProfile?: HandsontableFeatureProfile;
};

const HandsontableSalesTableClient = dynamic(
  () =>
    import("@/app/components/tables/handsontable/client").then(
      (module) => module.HandsontableSalesTableClient,
    ),
  { ssr: false },
);

export function HandsontableSalesTable(props: HandsontableSalesTableProps) {
  return <HandsontableSalesTableClient {...props} />;
}
