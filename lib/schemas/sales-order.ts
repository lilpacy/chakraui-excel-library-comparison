import { z } from "zod";
import { salesOrderStatuses } from "@/lib/db/schema";

export const salesOrderSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  orderDate: z.string().min(1, "Order date is required"),
  customer: z.string().min(1, "Customer is required"),
  region: z.string().min(1, "Region is required"),
  rep: z.string().min(1, "Sales rep is required"),
  category: z.string().min(1, "Category is required"),
  product: z.string().min(1, "Product is required"),
  quantity: z.number().int().min(0, "Quantity must be 0 or greater"),
  unitPrice: z.number().int().min(0, "Unit price must be 0 or greater"),
  status: z.enum(salesOrderStatuses),
});

export type SalesOrderInput = z.infer<typeof salesOrderSchema>;
