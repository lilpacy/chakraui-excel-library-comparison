"use client";

import dynamic from "next/dynamic";
import type { HandsontableFeatureProfile } from "@/app/components/tables/handsontable/profiles";
import type { SalesOrderRow } from "@/app/components/tables/types";

type HandsontableCoreSalesTableProps = {
  initialRows: SalesOrderRow[];
  featureProfile?: HandsontableFeatureProfile;
};

const HandsontableCoreSalesTableClient = dynamic(
  () =>
    import("@/app/components/tables/handsontable/core-client").then(
      (module) => module.HandsontableCoreSalesTableClient,
    ),
  { ssr: false },
);

export function HandsontableCoreSalesTable(props: HandsontableCoreSalesTableProps) {
  return <HandsontableCoreSalesTableClient {...props} />;
}
