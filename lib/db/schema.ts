import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const salesOrderStatuses = ["Delivered", "In Transit", "Pending"] as const;

export const salesOrders = sqliteTable("sales_orders", {
  orderId: text("order_id").primaryKey(),
  orderDate: text("order_date").notNull(),
  customer: text("customer").notNull(),
  region: text("region").notNull(),
  rep: text("rep").notNull(),
  category: text("category").notNull(),
  product: text("product").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: integer("unit_price").notNull(),
  status: text("status", { enum: salesOrderStatuses }).notNull(),
});
