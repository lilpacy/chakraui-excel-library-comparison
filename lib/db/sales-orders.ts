import { asc } from "drizzle-orm";
import { getDbAsync } from "@/lib/db/client";
import { salesOrders } from "@/lib/db/schema";

export async function getSalesOrders() {
  const db = await getDbAsync();

  return db.select().from(salesOrders).orderBy(asc(salesOrders.orderDate)).all();
}
