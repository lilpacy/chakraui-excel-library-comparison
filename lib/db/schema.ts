import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const salesOrderStatuses = ["Delivered", "In Transit", "Pending"] as const;

export const todos = sqliteTable("todos", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  completed: integer("completed", { mode: "boolean" }).default(false).notNull(),
  userId: text("user_id").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

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

export const users = sqliteTable("users", {
  userId: text("user_id").primaryKey(),
  profileImageUrl: text("profile_image_url"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
