"use server";

import { revalidatePath } from "next/cache";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { salesOrders } from "@/lib/db/schema";
import { salesOrderSchema, type SalesOrderInput } from "@/lib/schemas/sales-order";

async function getDb() {
  const { env } = await getCloudflareContext();
  return drizzle(env.DB);
}

export async function updateSalesOrder(originalOrderId: string, input: SalesOrderInput) {
  if (!originalOrderId) {
    throw new Error("Original order ID is required");
  }

  const validatedData = salesOrderSchema.parse(input);
  const db = await getDb();

  const existingOrder = await db
    .select({ orderId: salesOrders.orderId })
    .from(salesOrders)
    .where(eq(salesOrders.orderId, originalOrderId))
    .get();

  if (!existingOrder) {
    throw new Error("Sales order not found");
  }

  if (validatedData.orderId !== originalOrderId) {
    const conflictingOrder = await db
      .select({ orderId: salesOrders.orderId })
      .from(salesOrders)
      .where(eq(salesOrders.orderId, validatedData.orderId))
      .get();

    if (conflictingOrder) {
      throw new Error("Order ID already exists");
    }
  }

  await db.update(salesOrders).set(validatedData).where(eq(salesOrders.orderId, originalOrderId));

  revalidatePath("/");
  return { orderId: validatedData.orderId };
}
