import { z } from "zod";

export const orderEvent = z.object({
  customerId: z.string().min(1),
  orderId: z.string().min(1),
  kind: z.enum(["checkout", "fulfillment", "receipt", "customer_update"]),
  units: z.number().int().positive()
});
export type OrderEvent = z.infer<typeof orderEvent>;

export function addUsage(totals: Map<string, number>, event: OrderEvent): number {
  const next = (totals.get(event.customerId) ?? 0) + event.units;
  totals.set(event.customerId, next);
  return next;
}
