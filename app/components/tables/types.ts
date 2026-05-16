import { salesOrderStatuses } from "@/lib/db/schema";

export type SalesOrderStatus = (typeof salesOrderStatuses)[number];

export type SalesOrderRow = {
  orderId: string;
  orderDate: string;
  customer: string;
  region: string;
  rep: string;
  category: string;
  product: string;
  quantity: number;
  unitPrice: number;
  status: SalesOrderStatus;
};
