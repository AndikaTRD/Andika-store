import { Router, type IRouter } from "express";
import { db, ordersTable } from "@workspace/db";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import {
  AdminListOrdersQueryParams,
  AdminListOrdersResponse,
  AdminUpdateOrderStatusParams,
  AdminUpdateOrderStatusBody,
  AdminUpdateOrderStatusResponse,
  AdminGetStatsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serializeOrder(order: typeof ordersTable.$inferSelect) {
  return {
    ...order,
    items: order.items as Array<{ productId: number; productName: string; price: number; quantity: number }>,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

router.get("/admin/orders", async (req, res): Promise<void> => {
  const params = AdminListOrdersQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { status } = params.data;

  const orders = status
    ? await db.select().from(ordersTable).where(eq(ordersTable.status, status)).orderBy(desc(ordersTable.createdAt))
    : await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));

  res.json(AdminListOrdersResponse.parse(orders.map(serializeOrder)));
});

router.patch("/admin/orders/:orderId/status", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.orderId) ? req.params.orderId[0] : req.params.orderId;
  const params = AdminUpdateOrderStatusParams.safeParse({ orderId: rawId });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = AdminUpdateOrderStatusBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [updated] = await db
    .update(ordersTable)
    .set({ status: body.data.status })
    .where(eq(ordersTable.orderId, params.data.orderId))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(AdminUpdateOrderStatusResponse.parse(serializeOrder(updated)));
});

router.get("/admin/stats", async (_req, res): Promise<void> => {
  const allOrders = await db.select().from(ordersTable);
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayOrders = await db
    .select()
    .from(ordersTable)
    .where(gte(ordersTable.createdAt, todayStart));

  const totalOrders = allOrders.length;
  const pendingOrders = allOrders.filter((o) => o.status === "pending" || o.status === "proof_uploaded").length;
  const confirmedOrders = allOrders.filter((o) => o.status === "confirmed").length;
  const totalRevenue = allOrders
    .filter((o) => o.status === "confirmed")
    .reduce((sum, o) => sum + o.total, 0);
  const todayCount = todayOrders.length;
  const todayRevenue = todayOrders
    .filter((o) => o.status === "confirmed")
    .reduce((sum, o) => sum + o.total, 0);

  res.json(
    AdminGetStatsResponse.parse({
      totalOrders,
      pendingOrders,
      confirmedOrders,
      totalRevenue,
      todayOrders: todayCount,
      todayRevenue,
    })
  );
});

export default router;
